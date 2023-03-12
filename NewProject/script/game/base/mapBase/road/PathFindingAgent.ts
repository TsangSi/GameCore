/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: kexd
 * @Date: 2022-04-25 15:40:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-05 10:10:19
 * @FilePath: \SanGuo2.4\assets\script\game\base\mapBase\road\PathFindingAgent.ts
 * @Description:寻路代理器
 *
 */

import AstarHoneycombRoadSeeker from './AstarHoneycombRoadSeeker';
import AStarRoadSeeker from './AStarRoadSeeker';
import IRoadSeeker from './IRoadSeeker';
import MapRoadUtils from './MapRoadUtils';
import { MapInfo, MapMode, MapSaveInfo } from './MapMode';
import Point from './Point';
import RoadNode from './RoadNode';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import TaskQueue, { ITask } from '../../TaskQueue';

export default class PathFindingAgent {
    private static _instance: PathFindingAgent;

    public static get I(): PathFindingAgent {
        if (this._instance == null) {
            this._instance = new PathFindingAgent();
        }
        return this._instance;
    }

    private _roadDic: { [key: string]: RoadNode; } = {};
    private _roadSeeker: IRoadSeeker;
    private _mapData: MapInfo = new MapInfo();
    private _mapType: MapMode = MapMode.angle90;
    private _finishInit: boolean = false;
    private _per: number = 0;
    private readonly _times: number = 6;

    /**
     * 获得寻路接口
     */
    public get roadSeeker(): IRoadSeeker {
        return this._roadSeeker;
    }

    /** 加密转换 */
    public eCode(data: number[][]): string {
        if (!data || data.length === 0 || data[0].length === 0) {
            return '';
        }
        let outStr: string = '';
        const row: number = data.length;
        const col: number = data[0].length;

        let pre: number = null;
        let count: number = 0;

        for (let i: number = 0; i < row; i++) {
            for (let j: number = 0; j < col; j++) {
                const cur = data[i][j];

                if (pre == null) pre = cur;
                if (cur === pre) {
                    count++;
                } else {
                    outStr += `${pre}${count},`;
                    pre = cur;
                    count = 1;
                }
            }
            if (i === row - 1) {
                outStr += `${pre}${count}`;
            } else {
                outStr += `${pre}${count}|`;
            }
            pre = null;
            count = 0;
        }
        data = null;
        return outStr;
    }

    /** 解密转换 */
    public dCode(code: string): number[][] {
        // console.time('dCode');
        const array: string[] = code.split('|');
        const outData: number[][] = [];
        array.forEach((text2) => {
            const array3: string[] = text2.split(',');
            let outArray: number[] = [];
            array3.forEach((str) => {
                outArray = outArray.concat(this.getStr(str));
            });
            outData.push(outArray);
        });
        code = null;
        // console.timeEnd('dCode');
        return outData;
    }

    private getStr(str: string): number[] {
        if (str.length === 1) {
            return [Number(str)];
        }
        const mark: number = Number(str.substring(0, 1));
        const value: number = Number(str.substring(1, str.length));
        const outArray: number[] = [];
        for (let i: number = 0; i < value; i++) {
            outArray.push(mark);
        }
        return outArray;
    }

    public get mapData(): MapInfo {
        return this._mapData;
    }

    /**
     * 初始化寻路数据
     * @param roadDataArr 路电数据
     * @param mapType 地图类型
     */
    public init(mapData: MapSaveInfo): void {
        console.time('初始化寻路数据 PathFindingAgent.init');

        if (!this._mapData) {
            this._mapData = new MapInfo(mapData);
        }
        this._mapData.mapWidth = mapData.mapWidth;
        this._mapData.mapHeight = mapData.mapHeight;
        this._mapData.cellWidth = mapData.cellWidth;
        this._mapData.cellHeight = mapData.cellHeight;
        this._mapData.type = mapData.type;
        this._mapData.mapItems = mapData.mapItems;
        this._mapData.roadDataArr = this.dCode(mapData.roads);
        this._mapType = mapData.type;

        MapRoadUtils.I.updateMapInfo(
            this._mapData.mapWidth,
            this._mapData.mapHeight,
            this._mapData.cellWidth,
            this._mapData.cellHeight,
            this._mapData.type,
        );

        // 行row是y方向上的数据长度，列col是x方向上的数据长度。编辑器的数据是以左下角，即(0,0)为锚点，先填了第一行，再往上填第二行。
        const row: number = this._mapData.roadDataArr.length;
        // const col: number = this._mapData.roadDataArr[0].length;
        this._finishInit = false;
        this._per = Math.ceil(row / this._times);

        this.dealRoadDic();

        // console.timeEnd('PathFindingAgent.init');
    }

    public get finishInit(): boolean {
        return this._finishInit;
    }

    private dealRoadDic() {
        const tasks: ITask[] = [];
        for (let i = 0; i < this._times; i++) {
            const task: ITask = {
                callback: this.initRoadDicPer,
                ctx: this,
                param: i,
            };
            tasks.push(task);
        }

        TaskQueue.I.addTasks(tasks);
    }

    private initRoadDicPer(index: number) {
        // console.log('initRoadDicPer:', index);
        // console.time('PathFindingAgent.initRoadDicPer');
        let value: number = 0;
        let dx: number = 0;
        let dy: number = 0;
        let cx: number = 0;
        let cy: number = 0;

        // 行row是y方向上的数据长度，列col是x方向上的数据长度。编辑器的数据是以左下角，即(0,0)为锚点，先填了第一行，再往上填第二行。
        const row: number = this._mapData.roadDataArr.length;
        const col: number = this._mapData.roadDataArr[0].length;
        const start: number = this._per * index;
        let end: number = this._per * (index + 1);
        if (end > row) end = row;

        // 空间换时间法，减少在循环体内的消耗
        if (this._mapType === MapMode.honeycomb2) {
            for (let i: number = start; i < end; i++) {
                for (let j: number = 0; j < col; j++) {
                    value = this._mapData.roadDataArr[i][j];
                    dx = j;
                    dy = i;

                    const node: RoadNode = MapRoadUtils.I.getNodeByDerect(dx, dy);
                    node.value = value;

                    cx = node.cx;
                    cy = node.cy;

                    // 如果是横式六边形，则需要把路点世界坐标转置，即x,y调换。因为六边形寻路组件AstarHoneycombRoadSeeker是按纵式六边形写的
                    node.cx = cy;
                    node.cy = cx;

                    this._roadDic[`${node.cx}_${node.cy}`] = node;
                }
            }
        } else {
            for (let i: number = start; i < end; i++) {
                for (let j: number = 0; j < col; j++) {
                    value = this._mapData.roadDataArr[i][j];
                    dx = j;
                    dy = i;

                    const node: RoadNode = MapRoadUtils.I.getNodeByDerect(dx, dy);
                    node.value = value;

                    this._roadDic[`${node.cx}_${node.cy}`] = node;
                }
            }
        }

        // 分帧处理完成
        if (index >= this._times - 1) {
            if (this._mapType === MapMode.honeycomb || this._mapType === MapMode.honeycomb2) {
                this._roadSeeker = new AstarHoneycombRoadSeeker(this._roadDic);
            } else {
                this._roadSeeker = new AStarRoadSeeker(this._roadDic);
            }
            this._finishInit = true;
            EventClient.I.emit(E.Map.InitPathFinding);
        }
        // console.timeEnd('PathFindingAgent.initRoadDicPer');
    }

    /**
     * 寻路算法入口，若目标不可到达，则采用seekPath2，否则采用seekPath
     * @param startX 起始坐标x
     * @param startY 起始坐标y
     * @param targetX 目标坐标x
     * @param targetY 目标坐标y
     * @returns 路点数组RoadNode[]
     */
    public findPath(startX: number, startY: number, targetX: number, targetY: number): RoadNode[] {
        const startNode: RoadNode = this.getRoadNodeByPixel(startX, startY);
        const targetNode: RoadNode = this.getRoadNodeByPixel(targetX, targetY);
        const roadNodeArr: RoadNode[] = this._roadSeeker.findPath(startNode, targetNode);
        return roadNodeArr;
    }

    /**
     * 寻路算法入口，若找不到，会返回空数据,可以考虑优化降低最大寻路步数，若超过最大寻路步数后返回最近的点
     * @param startX 起始坐标x
     * @param startY 起始坐标y
     * @param targetX 目标坐标x
     * @param targetY 目标坐标y
     * @returns 路点数组RoadNode[]
     */
    public seekPath(startX: number, startY: number, targetX: number, targetY: number): RoadNode[] {
        const startNode: RoadNode = this.getRoadNodeByPixel(startX, startY);
        const targetNode: RoadNode = this.getRoadNodeByPixel(targetX, targetY);
        const roadNodeArr: RoadNode[] = this._roadSeeker.seekPath(startNode, targetNode);
        return roadNodeArr;
    }

    /**
     * 寻路算法入口，若找不到，会返回距离目标点最近的位置
     * @param startX 起始坐标x
     * @param startY 起始坐标y
     * @param targetX 目标坐标x
     * @param targetY 目标坐标y
     * @returns 路点数组RoadNode[]
     */
    public seekPath2(startX: number, startY: number, targetX: number, targetY: number): RoadNode[] {
        const startNode: RoadNode = this.getRoadNodeByPixel(startX, startY);
        const targetNode: RoadNode = this.getRoadNodeByPixel(targetX, targetY);
        const roadNodeArr: RoadNode[] = this._roadSeeker.seekPath2(startNode, targetNode);
        return roadNodeArr;
    }

    /**
     * 测试寻路过程
     * @param startX
     * @param startY
     * @param targetX
     * @param targetY
     * @param seekRoadCallback
     * @param target
     * @param time
     */
    public testSeekRoad(
        startX: number,
        startY: number,
        targetX: number,
        targetY: number,
        seekRoadCallback: Function,
        target: any,
        time: number,
    ): void {
        const startNode: RoadNode = this.getRoadNodeByPixel(startX, startY);
        const targetNode: RoadNode = this.getRoadNodeByPixel(targetX, targetY);

        this._roadSeeker.testSeekPathStep(startNode, targetNode, seekRoadCallback, target, time);
    }

    /**
     * 根据像素坐标获得路节点
     * @param px 像素坐标x
     * @param py 像素坐标y
     * @returns
     */
    public getRoadNodeByPixel(px: number, py: number): RoadNode {
        const point: Point = MapRoadUtils.I.getWorldPointByPixel(px, py);

        let node: RoadNode = null;
        if (this._mapType === MapMode.honeycomb2) { // 因为初始化时 横式六边形已经对世界坐标做过转置，所以读取路节点时也要通过转置的方式
            node = this.getRoadNode(point.y, point.x);
        } else {
            node = this.getRoadNode(point.x, point.y);
        }

        return node;
    }

    /**
     * 根据世界坐标获得路节点
     * @param cx
     * @param cy
     */
    public getRoadNode(cx: number, cy: number): RoadNode {
        if (this._roadSeeker) {
            return this._roadSeeker.getRoadNode(cx, cy);
        }
        return null;
    }
}
