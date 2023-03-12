/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable camelcase */
/*
 * @Author: kexd
 * @Date: 2022-04-25 15:02:09
 * @Description: 地图数据及相关处理
 *
 */

import { EventClient } from '../../app/base/event/EventClient';
import { ACTION_DIRECT } from '../base/anim/AnimCfg';
import { Config } from '../base/config/Config';
import PathFindingAgent from '../base/mapBase/road/PathFindingAgent';
import RoadNode from '../base/mapBase/road/RoadNode';
import TaskQueue from '../base/TaskQueue';
import { E } from '../const/EventName';

export const MAP_AREA_X = 3;
export const MAP_AREA_Y = 5;
export const MAP_CONFIG = {
    /**
     * 屏幕分辨率宽
     */
    w: 720,
    /**
      * 屏幕分辨率高
      */
    h: 1280,
    /**
      * 一个寻路格子宽(改为非常量，这里废弃)
      */
    // cellBlockX: 32,
    /**
      * 一个寻路格子高(改为非常量，这里废弃)
      */
    // cellBlockY: 32,
    /**
      * 一个地图切片宽
      */
    mapBlockX: 512,
    /**
      * 一个地图切片高
      */
    mapBlockY: 512,
    /**
      * 人物在地图上移动倍率
      */
    speed: 5,
};
export const MEET_MONSTER_DIS = 7;

/**
 * 地图ID
 */
export enum EMapID {
    /** 测试世界Boss */
    WorldBoss = 10,
    /** 烽火连城 */
    BeaconWar1 = 2051,
    BeaconWar2 = 2052,
    BeaconWar3 = 2053,
    BeaconWar4 = 2054,
    BeaconWar5 = 2055,
    BeaconWar6 = 2056,
    BeaconWar7 = 2057,
    BeaconWar8 = 2058,
    BeaconWar9 = 2059,
    BeaconWar10 = 2060,
}

/** 地图场景副本类型 */
export enum EMapFbInstanceType {
    /** 野外 */
    YeWai = 0,
    /** 世界Boss */
    WorldBoss = 1,
    /** 烽火连城(Boss之家) */
    BeaconWar = 2,
}

/**
 * 地图类型
 */
export enum MapType {
    /** 世界地图 */
    WBosType = 1,
    /** 副本地图 */
    FBType = 2,
    /** 神域 */
    // SYType = 3,
}

export default class MapCfg {
    private static _i: MapCfg = null;
    public static get I(): MapCfg {
        if (this._i == null) {
            this._i = new MapCfg();
        }
        return this._i;
    }

    /** 当前所在的地图ID */
    private _mapId: number = 0;
    /** 野外地图ID */
    private _mapIdYW: number = 0;
    private _cellWidth: number = 0;
    private _cellHeight: number = 0;
    private _mapWidth: number = 0;
    private _mapHeight: number = 0;
    private _mapData: Cfg_Map = null;
    private _roadIndex: number = 0;
    private _mapTracePosArr: cc.Vec2[] = [];
    /** 初始化完成 */
    private _finishLoadMapData: boolean = false;

    public set mapId(mapId: number) {
        this._mapId = mapId;
    }
    public get mapId(): number {
        return this._mapId;
    }

    public set finishLoadMapData(isFinish: boolean) {
        this._finishLoadMapData = isFinish;
    }

    public get finishLoadMapData(): boolean {
        return this._finishLoadMapData;
    }

    /** 野外地图ID，有可能并不是当前所在的地图ID */
    public get mapIdYW(): number {
        return this._mapIdYW;
    }
    private set mapIdYW(id: number) {
        if (this._mapIdYW !== id) {
            this._mapIdYW = id;
            EventClient.I.emit(E.Map.ChangeMapIdYW);
        }
    }
    public setMapInfo(mapId: number, mapWidth: number, mapHeight: number, cellWidth: number, cellHeight: number, cellX: number, cellY: number): void {
        // console.log('setMapInfo-------', mapId);
        this._mapId = mapId;
        this._mapWidth = mapWidth;
        this._mapHeight = mapHeight;
        this._cellWidth = cellWidth;
        this._cellHeight = cellHeight;
        if (this.isYeWai) {
            this.mapIdYW = mapId;
        }
        this._mapRoad = {};
        this._finishLoadMapData = true;
        this.setMapTrace(cellX, cellY);
    }

    /**
     * 获取当前地图数据
     */
    public get mapData(): Cfg_Map {
        return this._mapData;
    }
    public set mapData(mapData) {
        this._mapData = mapData;
    }

    public set mapWidth(mapWidth: number) {
        this._mapWidth = mapWidth;
    }
    public get mapWidth(): number {
        return this._mapWidth;
    }

    public set mapHeight(mapHeight: number) {
        this._mapHeight = mapHeight;
    }
    public get mapHeight(): number {
        return this._mapHeight;
    }

    public set cellWidth(cellWidth: number) {
        this._cellWidth = cellWidth;
    }
    public get cellWidth(): number {
        return this._cellWidth;
    }

    public cellToPosX(x: number): number {
        return x * this._cellWidth + this._cellWidth / 2;
    }
    public cellToPosY(y: number): number {
        return y * this._cellHeight + this._cellHeight / 2;
    }

    public set cellHeight(cellHeight: number) {
        this._cellHeight = cellHeight;
    }
    public get cellHeight(): number {
        return this._cellHeight;
    }

    public cellCount(): number[] {
        return [Math.ceil(this._mapWidth / MAP_CONFIG.mapBlockX), Math.ceil(this._mapHeight / MAP_CONFIG.mapBlockY)];
    }

    /** 检查是否超出地图范围 */
    public isOutMap(cellX: number, cellY: number): boolean {
        if (this._cellWidth && this._cellHeight) {
            return cellX < 0 || cellX * this._cellWidth > this._mapWidth || cellY < 0 || cellY * this._cellHeight > this._mapHeight;
        }
        return false;
    }

    /**
     * 获取地图资源
     */
    public get mapRes(): number {
        if (this._mapData) {
            return this._mapData.ResId;
        }
        return 1;
    }

    /** 是否是野外 */
    public get isYeWai(): boolean {
        return this._mapData && this._mapData.MapType === MapType.WBosType;
    }

    /** 是否是副本中 */
    public get isInFuben(): boolean {
        return this._mapData && this._mapData.MapType === MapType.FBType;
    }

    /** 是否在烽火连城副本里 */
    public get isBeaconWar(): boolean {
        return this._mapData && this._mapData.MapType === MapType.FBType && this._mapData.InstanceType === EMapFbInstanceType.BeaconWar;
    }

    /**
     * 获取地图怪物血量
     */
    public get monsterHp(): number[] {
        const hp = this._mapData.MonsterHP.split('-');
        if (hp.length > 1) {
            return [Number(hp[0]), Number(hp[1]) - Number(hp[0])];
        }
        return [Number(hp[0]), 0];
    }

    /** 地图寻路点 */
    public setMapTrace(cellX: number, cellY: number): void {
        this._roadIndex = 0;
        this._mapTracePosArr = [];
        if (this._mapData) {
            const arrPos = this._mapData.MapTrace.split('|');
            for (let i = 0; i < arrPos.length; i++) {
                const p = arrPos[i].split(',');
                const pos = cc.v2(parseInt(p[0]), parseInt(p[1]));
                // console.log('------------this._mapTracePosArr', pos.x, pos.y, '坐标是：', pos.x * this._cellWidth, pos.y * this._cellHeight);
                this._mapTracePosArr.push(pos);
                if (pos.x === cellX && pos.y === cellY) {
                    this._roadIndex = i;
                }
            }
        }
        //
        if (cellX === 0 && cellY === 0) {
            this._roadIndex = Math.floor(Math.random() * this._mapTracePosArr.length);
        }

        console.log('------------出生在', this._roadIndex);
    }

    public getCurCell(): cc.Vec2 {
        return this._mapTracePosArr[this._roadIndex];
    }

    public nextCell(): cc.Vec2 {
        this._roadIndex++;
        if (this._roadIndex < 0 || this._roadIndex >= this._mapTracePosArr.length) {
            this._roadIndex = 0;
        }
        return this._mapTracePosArr[this._roadIndex];
    }

    public get roadIndex(): number {
        return this._roadIndex;
    }

    public getRoadIndexByPos(targetPos: cc.Vec2): number {
        if (this._mapTracePosArr) {
            const targetCellX = targetPos.x / this._cellWidth;
            const targetCellY = targetPos.y / this._cellHeight;
            for (let i = 0; i < this._mapTracePosArr.length; i++) {
                const cur = this._mapTracePosArr[i];

                if (cur.x === targetCellX && cur.y === targetCellY) {
                    return i;
                }
            }
        }
        return null;
    }

    private _startPos: cc.Vec2 = cc.v2(0, 0);
    public set startPos(startPos: cc.Vec2) {
        this._startPos = startPos;
    }
    public get startPos(): cc.Vec2 {
        return this._startPos;
    }
    private _targetPos: cc.Vec2 = cc.v2(0, 0);
    public set targetPos(targetPos: cc.Vec2) {
        this._targetPos = targetPos;
    }
    public get targetPos(): cc.Vec2 {
        return this._targetPos;
    }

    private _mapRoad: { [name: string]: { [name: number]: RoadNode[] }; } = {};
    public createMapRoad(startPos: cc.Vec2, targetPos: cc.Vec2, callback: Function, ctx: any) {
        // TaskQueue.I.addTask(() => {
        // console.time('++movePlayer++');
        const roadNodeArr: RoadNode[] = PathFindingAgent.I.findPath(startPos.x, startPos.y, targetPos.x, targetPos.y);// seekPath
        // console.timeEnd('++movePlayer++');
        if (callback) {
            callback.call(ctx, roadNodeArr);
            callback = null;
        }
        // }, this);
    }

    /**
     * 当前地图是否已有寻路的数据了，若没有，需要生成
     * @param mapId 地图id
     * @param startPos 起始位置
     * @param targetPos 终点位置
     * @param roadIndex 下标（野外地图才需要）
     * @param callback 回调
     * @param ctx 上下文
     */
    public getMapRoad(startPos: cc.Vec2, targetPos: cc.Vec2, roadIndex: number, callback: Function, ctx: any) {
        // 野外地图才缓存
        const mapId: number = this._mapId;
        if (this._mapData && this._mapData.MapType === MapType.WBosType) {
            if (roadIndex == null) {
                roadIndex = this.getRoadIndexByPos(targetPos);
            }
            if (roadIndex == null) {
                this.createMapRoad(startPos, targetPos, callback, ctx);
            } else if (this._mapRoad[mapId] && this._mapRoad[mapId][roadIndex]) {
                const roadNodeArr: RoadNode[] = this._mapRoad[this._mapId][roadIndex];
                // console.log(mapId, '野外的地图寻路点已有路点数据', roadIndex, roadNodeArr);
                if (callback) {
                    callback.call(ctx, roadNodeArr);
                    callback = null;
                }
            } else {
                this.createMapRoad(startPos, targetPos, (roadNodeArr: RoadNode[]) => {
                    if (this._mapData && this._mapData.MapType === MapType.WBosType) {
                        if (!this._mapRoad[this._mapId]) {
                            this._mapRoad[this._mapId] = {};
                        }
                        if (!this._mapRoad[this._mapId][roadIndex]) {
                            this._mapRoad[this._mapId][roadIndex] = [];
                        }
                        this._mapRoad[this._mapId][roadIndex] = roadNodeArr;
                    }
                    // console.log(mapId, '野外的地图寻路点生成的路点数据', roadIndex, roadNodeArr);
                    if (callback) {
                        callback.call(ctx, roadNodeArr);
                        callback = null;
                    }
                }, this);
            }
        } else {
            this.createMapRoad(startPos, targetPos, callback, ctx);
        }
    }

    public bossResID: number;
    public getMapMonster(): { Id: number, IID: number, Pos: { x: number, y: number; }, dirEct: number; } {
        const dataBoss = {
            Id: 0, IID: 0, Pos: { x: 0, y: 0 }, dirEct: 3,
        };

        const cfgStage: Cfg_Stage = Config.Get(Config.Type.Cfg_Stage).getValueByKey(this._mapId);

        // const bossArr = cfgStage.BossGroup.split('|');
        // const bossIID = bossArr[Math.floor(bossArr.length * Math.random())];
        // const boss: Cfg_Monster = Config.Get(Config.Type.Cfg_Monster).getValueByKey(bossIID);
        // this.bossResID = boss.AnimId;

        if (cfgStage) {
            const monsterArr = cfgStage.MonsterGroup.split('|');

            dataBoss.IID = Number(monsterArr[0]);
            dataBoss.Pos = this._mapTracePosArr[this._roadIndex];
        }

        return dataBoss;
    }

    public useCellSerial2Direct(beginX: number, beginY: number, endX: number, endY: number): number {
        const subX: number = endX - beginX;
        const subY: number = endY - beginY;
        let direct: number = -1;
        if (subX < 0) {
            if (subY > 0) {
                direct = ACTION_DIRECT.LEFT_UP;
            } else {
                direct = ACTION_DIRECT.LEFT_DOWN;
            }
        } else if (subY > 0) {
            direct = ACTION_DIRECT.RIGHT_UP;
        } else {
            direct = ACTION_DIRECT.RIGHT_DOWN;
        }
        return direct;
    }
}
