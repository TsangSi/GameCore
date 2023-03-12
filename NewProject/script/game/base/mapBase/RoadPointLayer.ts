/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-04-08 18:05:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-19 11:37:11
 * @FilePath: \SanGuo\assets\script\game\base\mapBase\RoadPointLayer.ts
 * @Description: 路点层，只有测试时候才需要看，由_isShow控制
 *
 */
import MapRoadUtils, { ENUM_ROAD } from './road/MapRoadUtils';
import { MapInfo, MapMode } from './road/MapMode';
import RoadNode from './road/RoadNode';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoadPointLayer extends cc.Component {
    private _roadPointDic: { [key: string]: RoadPoint; } = {};
    private _roadNodeDic: { [key: string]: RoadNode; } = {};
    private _graphicDic: { [key: string]: cc.Graphics; } = {};
    private _roadTypeShowDic: { [key: number]: boolean; } = {};
    private _type: number = 1;
    private _gsize: number = 16;
    private _blockScale: number = 0.95;
    private _isShow: boolean = false; // 只在测试时候才需要设为true

    public constructor() {
        super();
    }

    protected onLoad(): void {
        this._roadTypeShowDic[0] = true;
        this._roadTypeShowDic[1] = true;
        this._roadTypeShowDic[2] = true;
        this._roadTypeShowDic[3] = true;
        this._roadTypeShowDic[4] = true;
        this._roadTypeShowDic[5] = true;
        this._roadTypeShowDic[6] = true;
        this._roadTypeShowDic[7] = true;
        this._roadTypeShowDic[8] = true;
        this._roadTypeShowDic[9] = true;
    }

    /**
     * 根据数据初始化路点
     * @param mapData
     * @returns
     */
    public initRoadPointInfo(mapData: MapInfo): void {
        if (!this._isShow) {
            return;
        }

        this.clear();

        if (!mapData.roadDataArr || mapData.roadDataArr.length === 0) {
            return;
        }
        // 行row是y方向上的数据长度，列col是x方向上的数据长度。编辑器的数据是以左下角，即(0,0)为锚点，先填了第一行，再往上填第二行。
        const row: number = mapData.roadDataArr.length;
        const col: number = mapData.roadDataArr[0].length;

        let value: number = ENUM_ROAD.Run;
        let dx: number = 0;
        let dy: number = 0;

        for (let i: number = 0; i < row; i++) {
            for (let j: number = 0; j < col; j++) {
                value = mapData.roadDataArr[i][j];
                dx = j;
                dy = i;

                const node: RoadNode = MapRoadUtils.I.getNodeByDerect(dx, dy);
                node.value = value;

                if (node.value !== ENUM_ROAD.Block) {
                    this._roadNodeDic[`${node.dx}_${node.dy}`] = node;
                }
            }
        }

        this.drawRointPoint();
    }

    private getRoadPointInfo(): number[][] {
        const row: number = MapRoadUtils.I.row;
        const col: number = MapRoadUtils.I.col;
        let dx: number;
        let dy: number;
        const roadDataArr: number[][] = [];

        // const mapType: number = MapRoadUtils.I.mapType;

        const dataRow: number = row;// mapType == MapMode.angle45 ? row * 2 : row;

        for (let i: number = 0; i < dataRow; i++) {
            dy = i;
            roadDataArr[i] = [];
            for (let j: number = 0; j < col; j++) {
                dx = j;

                if (this._roadNodeDic[`${dx}_${dy}`] == null) {
                    roadDataArr[i][j] = ENUM_ROAD.Block;
                } else {
                    roadDataArr[i][j] = this._roadNodeDic[`${dx}_${dy}`].value;
                }
            }
        }

        return roadDataArr;
    }

    private drawRointPoint(): void {
        const row: number = MapRoadUtils.I.row;
        const col: number = MapRoadUtils.I.col;

        const mapType: number = MapRoadUtils.I.mapType;

        let grow: number = row / this._gsize;
        if (mapType === MapMode.angle45) {
            grow = (row * 2) / this._gsize;
        }

        const gcol: number = col / this._gsize;

        for (let i = 0; i < grow; i++) {
            for (let j = 0; j < gcol; j++) {
                const gdx: number = j;
                const gdy: number = i;

                this.drawGraphic(gdx, gdy);
            }
        }
    }

    private drawGraphic(gdx: number, gdy: number, isClear: boolean = true): void {
        const graphicKey: string = `${gdx}_${gdy}`;
        const graphics: cc.Graphics = this.getGraphic(graphicKey);

        if (isClear) graphics.clear();

        const halfNodeWidth: number = MapRoadUtils.I.halfCellWidth;
        const halfNodeHeight: number = MapRoadUtils.I.halfCellHeight;
        const mapType: MapMode = MapRoadUtils.I.mapType;

        const color0: string = '#00ff0050';
        const color1: string = '#d4d4d450';
        const color2: string = '#0000ff50';
        const color3: string = '#ffff0050';

        let color: string = '00ff0050';

        const beginGdx: number = gdx * this._gsize;
        const endGdx: number = beginGdx + this._gsize;

        const beginGdy: number = gdy * this._gsize;
        const endGdy: number = beginGdy + this._gsize;

        for (let i = beginGdy; i < endGdy; i++) {
            for (let j = beginGdx; j < endGdx; j++) {
                const node: RoadNode = this._roadNodeDic[`${j}_${i}`];

                if (!node || !this._roadTypeShowDic[node.value]) {
                    continue;
                }

                if (node.value === ENUM_ROAD.Run) {
                    color = color0;
                } else if (node.value === ENUM_ROAD.Block) {
                    color = color1;
                } else if (node.value === ENUM_ROAD.Half) {
                    color = color2;
                } else if (node.value === ENUM_ROAD.Trans) {
                    color = color3;
                }

                if (mapType === MapMode.angle45) {
                    this.draw45AngleMapRoadPoint(graphics, node, color, halfNodeWidth, halfNodeHeight);
                } else if (mapType === MapMode.angle90) {
                    this.draw90AngleMapRoadPoint(graphics, node, color, halfNodeWidth, halfNodeHeight);
                } else if (mapType === MapMode.honeycomb) {
                    this.drawHoneycombMapRoadPoint(graphics, node, color, halfNodeWidth, halfNodeHeight);
                } else if (mapType === MapMode.honeycomb2) {
                    this.drawHoneycombMapRoadPoint2(graphics, node, color, halfNodeWidth, halfNodeHeight);
                }
            }
        }
    }

    private getGraphic(graphicKey: string): cc.Graphics {
        if (!this._graphicDic[graphicKey]) {
            const gNode: cc.Node = new cc.Node();
            this.node.addChild(gNode);
            gNode.setPosition(0, 0);
            const graphics: cc.Graphics = gNode.addComponent(cc.Graphics);
            this._graphicDic[graphicKey] = graphics;
        }

        return this._graphicDic[graphicKey];
    }

    /**
     *画45度地图的路点
     *
     */
    private draw45AngleMapRoadPoint(graphics: cc.Graphics, node: RoadNode, color: string, halfNodeWidth: number, halfNodeHeight: number): void {
        graphics.fillColor.fromHEX(color);

        graphics.moveTo(-(halfNodeWidth * this._blockScale) + node.px, 0 + node.py);
        graphics.lineTo(0 + node.px, -(halfNodeHeight * this._blockScale) + node.py);
        graphics.lineTo(halfNodeWidth * this._blockScale + node.px, 0 + node.py);
        graphics.lineTo(0 + node.px, halfNodeHeight * this._blockScale + node.py);

        graphics.fill();
    }

    /**
     *画90度地图的路点
     *
     */
    private draw90AngleMapRoadPoint(graphics: cc.Graphics, node: RoadNode, color: string, halfNodeWidth: number, halfNodeHeight: number): void {
        graphics.fillColor.fromHEX(color);

        graphics.rect(-(halfNodeWidth * this._blockScale) + node.px, -(halfNodeHeight * this._blockScale) + node.py, (halfNodeWidth * this._blockScale) * 2, (halfNodeHeight * this._blockScale) * 2);

        graphics.fill();
    }

    /**
     *画蜂巢地图的路点 纵向
     *
     */
    private drawHoneycombMapRoadPoint(graphics: cc.Graphics, node: RoadNode, color: string, halfNodeWidth: number, halfNodeHeight: number): void {
        graphics.fillColor.fromHEX(color);

        const nodeWidth: number = MapRoadUtils.I.cellWidth * this._blockScale;
        const nodeHeight: number = MapRoadUtils.I.cellHeight * this._blockScale;

        const w1: number = nodeWidth / 4;
        const w2: number = w1 * 2;
        const w3: number = w1 * 3;

        const halfH: number = nodeHeight / 2;

        const ws: number = -w2;
        const hs: number = -halfH;

        graphics.moveTo(ws + w1 + node.px, hs + node.py);
        graphics.lineTo(ws + w3 + node.px, hs + node.py);
        graphics.lineTo(ws + nodeWidth + node.px, halfH + hs + node.py);
        graphics.lineTo(ws + w3 + node.px, nodeHeight + hs + node.py);
        graphics.lineTo(ws + w1 + node.px, nodeHeight + hs + node.py);
        graphics.lineTo(ws + 0 + node.px, halfH + hs + node.py);
        graphics.lineTo(ws + w1 + node.px, hs + node.py);

        graphics.fill();
    }

    /**
     *画蜂巢地图的路点 横向
     *
     */
    private drawHoneycombMapRoadPoint2(graphics: cc.Graphics, node: RoadNode, color: string, halfNodeWidth: number, halfNodeHeight: number): void {
        graphics.fillColor.fromHEX(color);

        const nodeWidth: number = MapRoadUtils.I.cellWidth * this._blockScale;
        const nodeHeight: number = MapRoadUtils.I.cellHeight * this._blockScale;

        const w1: number = nodeWidth / 4;
        const w2: number = w1 * 2;
        const w3: number = w1 * 3;

        const halfH: number = nodeHeight / 2;

        const ws: number = -w2;
        const hs: number = -halfH;

        graphics.moveTo(hs + node.px, ws + w1 + node.py);
        graphics.lineTo(hs + node.px, ws + w3 + node.py);
        graphics.lineTo(halfH + hs + node.px, ws + nodeWidth + node.py);
        graphics.lineTo(nodeHeight + hs + node.px, ws + w3 + node.py);
        graphics.lineTo(nodeHeight + hs + node.px, ws + w1 + node.py);
        graphics.lineTo(halfH + hs + node.px, ws + 0 + node.py);
        graphics.lineTo(hs + node.px, ws + w1 + node.py);

        graphics.fill();
    }

    /**
     * 清除路点信息
     */
    public clear(): void {
        for (const param in this._roadPointDic) {
            this._roadPointDic[param].destroy();
            this._roadPointDic[param] = null;
            delete this._roadPointDic[param];
        }

        for (const param in this._graphicDic) {
            if (this._graphicDic[param]) {
                this._graphicDic[param].clear();
                this._graphicDic[param].destroy();
                this._graphicDic[param] = null;
                delete this._roadNodeDic[param];
            }
        }

        this._roadNodeDic = {};
    }
}

class RoadPoint extends cc.Node {
    public static hiddenUnWalkAble: boolean;

    private _color0: string = '#00ff0090';
    private _color1: string = '#d4d4d490';
    private _color2: string = '#0000ff90';
    private _color3: string = '#ffff0090';

    private _node: RoadNode;
    private _type: number;
    private _graphics: cc.Graphics;

    public constructor(node: RoadNode, type: number = 1) {
        super();
        this._node = node;
        this._type = type;
        this.draw(node, type);
    }

    public reset(node: RoadNode, type: number = 1): void {
        this._node = node;
        this._type = type;
        this.draw(node, type);
    }

    private draw(node: RoadNode, t: number = 1): void {
        this.clear();

        if (RoadPoint.hiddenUnWalkAble && node.value == ENUM_ROAD.Block) {
            return;
        }

        let color: string;

        if (node.value === ENUM_ROAD.Run) {
            color = this._color0;
        } else if (node.value === ENUM_ROAD.Block) {
            color = this._color1;
        } else if (node.value === ENUM_ROAD.Half) {
            color = this._color2;
        } else if (node.value === ENUM_ROAD.Trans) {
            color = this._color3;
        }

        const halfNodeWidth: number = MapRoadUtils.I.halfCellWidth;
        const halfNodeHeight: number = MapRoadUtils.I.halfCellHeight;
        const mapType: MapMode = MapRoadUtils.I.mapType;

        if (mapType === MapMode.angle45) {
            this.draw45AngleMapRoadPoint(t, color, halfNodeWidth, halfNodeHeight);
        } else if (mapType === MapMode.angle90) {
            this.draw90AngleMapRoadPoint(t, color, halfNodeWidth, halfNodeHeight);
        } else if (mapType === MapMode.honeycomb) {
            this.drawHoneycombMapRoadPoint(t, color, halfNodeWidth, halfNodeHeight);
        } else if (mapType === MapMode.honeycomb2) {
            this.drawHoneycombMapRoadPoint2(t, color, halfNodeWidth, halfNodeHeight);
        }
    }

    /**
     * 画45度地图的路点
     */
    private draw45AngleMapRoadPoint(t: number, color: string, halfNodeWidth: number, halfNodeHeight: number): void {
        this.graphics.fillColor.fromHEX(color);

        if (t === 1) {
            this.graphics.moveTo(-(halfNodeWidth - 1), 0);
            this.graphics.lineTo(0, -(halfNodeHeight - 1));
            this.graphics.lineTo(halfNodeWidth - 1, 0);
            this.graphics.lineTo(0, halfNodeHeight - 1);
        } else if (t === 2) {
            this.graphics.rect(-halfNodeHeight / 2, -halfNodeHeight / 2, halfNodeHeight, halfNodeHeight);
        } else {
            this.graphics.circle(0, 0, halfNodeWidth / 3);
        }

        this.graphics.fill();
    }

    /**
     *画90度地图的路点
     *
     */
    private draw90AngleMapRoadPoint(t: number, color: string, halfNodeWidth: number, halfNodeHeight: number): void {
        this.graphics.fillColor.fromHEX(color);

        if (t === 1) {
            this.graphics.rect(-(halfNodeWidth - 1), -(halfNodeHeight - 1), (halfNodeWidth - 1) * 2, (halfNodeHeight - 1) * 2);
        } else if (t === 2) {
            this.graphics.rect(-halfNodeWidth / 2, -halfNodeHeight / 2, halfNodeWidth, halfNodeHeight);
        } else {
            this.graphics.circle(0, 0, halfNodeWidth / 2);
        }

        // this.graphics.stroke();
        this.graphics.fill();
    }

    /**
     *画蜂巢地图的路点 纵向
     *
     */
    private drawHoneycombMapRoadPoint(t: number, color: string, halfNodeWidth: number, halfNodeHeight: number): void {
        this.graphics.fillColor.fromHEX(color);

        if (t === 1) {
            const nodeWidth: number = MapRoadUtils.I.cellWidth * 0.95;
            // var nodeHeight:number = (nodeWidth / 2) * 1.732;
            const nodeHeight: number = MapRoadUtils.I.cellHeight * 0.95;

            const w1: number = nodeWidth / 4;
            const w2: number = w1 * 2;
            const w3: number = w1 * 3;

            const halfH: number = nodeHeight / 2;

            const ws: number = -w2;
            const hs: number = -halfH;

            this.graphics.moveTo(ws + w1, hs);
            this.graphics.lineTo(ws + w3, hs);
            this.graphics.lineTo(ws + nodeWidth, halfH + hs);
            this.graphics.lineTo(ws + w3, nodeHeight + hs);
            this.graphics.lineTo(ws + w1, nodeHeight + hs);
            this.graphics.lineTo(ws + 0, halfH + hs);
            this.graphics.lineTo(ws + w1, hs);
        } else if (t === 2) {
            this.graphics.rect(-halfNodeWidth / 2, -halfNodeHeight / 2, halfNodeWidth, halfNodeHeight);
        } else {
            this.graphics.circle(0, 0, halfNodeWidth / 2);
        }

        this.graphics.fill();
    }

    /**
     * 画蜂巢地图的路点 横向
     */
    private drawHoneycombMapRoadPoint2(t: number, color: string, halfNodeWidth: number, halfNodeHeight: number): void {
        this.graphics.fillColor.fromHEX(color);

        if (t === 1) {
            const nodeWidth: number = MapRoadUtils.I.cellWidth * 0.95;
            // var nodeHeight:number = (nodeWidth / 2) * 1.732;
            const nodeHeight: number = MapRoadUtils.I.cellHeight * 0.95;

            const w1: number = nodeWidth / 4;
            const w2: number = w1 * 2;
            const w3: number = w1 * 3;

            const halfH: number = nodeHeight / 2;

            const ws: number = -w2;
            const hs: number = -halfH;

            this.graphics.moveTo(hs, ws + w1);
            this.graphics.lineTo(hs, ws + w3);
            this.graphics.lineTo(halfH + hs, ws + nodeWidth);
            this.graphics.lineTo(nodeHeight + hs, ws + w3);
            this.graphics.lineTo(nodeHeight + hs, ws + w1);
            this.graphics.lineTo(halfH + hs, ws + 0);
            this.graphics.lineTo(hs, ws + w1);
        } else if (t === 2) {
            this.graphics.rect(-halfNodeWidth / 2, -halfNodeHeight / 2, halfNodeWidth, halfNodeHeight);
        } else {
            this.graphics.circle(0, 0, halfNodeWidth / 2);
        }

        this.graphics.fill();
    }

    public clear(): void {
        this.graphics.clear();
    }

    public get node(): RoadNode {
        return this._node;
    }

    public set node(value: RoadNode) {
        this._node = value;
    }

    public get type(): number {
        return this._type;
    }

    public set type(value: number) {
        this._type = value;
    }

    public get graphics(): cc.Graphics {
        if (!this._graphics) {
            this._graphics = this.addComponent(cc.Graphics);
        }
        return this._graphics;
    }
}
