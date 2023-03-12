/* eslint-disable no-loop-func */
/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
 * @Author: kexd
 * @Date: 2022-05-12 14:08:00
 * @FilePath: \SanGuo2.4\assets\script\game\map\MapMgr.ts
 * @Description: 管理周围玩家/怪物的生成,移除,移动,停止,说话,属性更新,进出战斗等.
 */

import { EntityMonster } from '../entity/EntityMonster';
import { EntityRole } from '../entity/EntityRole';
import MapCfg from './MapCfg';
import { EventClient } from '../../app/base/event/EventClient';
import { E } from '../const/EventName';
import { ANIM_TYPE, ACTION_DIRECT, ACTION_TYPE } from '../base/anim/AnimCfg';
import { EntityLayer } from './EntityLayer';
import { EventProto } from '../../app/base/event/EventProto';
import EntityMapMgr from '../entity/EntityMapMgr';
import RoadNode from '../base/mapBase/road/RoadNode';
import { RoleMgr } from '../module/role/RoleMgr';
import { Config } from '../base/config/Config';
import { RoleInfo } from '../module/role/RoleInfo';
import { EntityAnimName, EntityChallengeState } from '../entity/EntityConst';
import ModelMgr from '../manager/ModelMgr';
import { RoleMD } from '../module/role/RoleMD';
import { ConfigIndexer } from '../base/config/indexer/ConfigIndexer';
import SceneMap from './SceneMap';
import { EBeaconState } from '../module/beaconWar/BeaconWarConst';
import { ConfigConst } from '../base/config/ConfigConst';

/** 一个场景内只能放MaxPlayer个周围玩家，超过的话就只显示剪影图以减轻内存压力 */
const MaxPlayer = 20;

export default class MapMgr {
    private static _i: MapMgr = null;
    public static get I(): MapMgr {
        if (this._i == null) {
            this._i = new MapMgr();
        }
        return this._i;
    }

    /** 周围玩家数据 */
    private _playerData: { [uuid: number]: RoleInfo; } = cc.js.createMap(true);
    /** 怪物数据 */
    private _monsterData: { [uuid: number]: RoleInfo; } = cc.js.createMap(true);

    /** 周围玩家实体对象 */
    private _mapAllPlayer: { [uuid: number]: EntityRole; } = cc.js.createMap(true);
    /** 怪物实体对象 */
    private _mapAllMonster: { [uuid: number]: EntityMonster; } = cc.js.createMap(true);
    /** 周围玩家、怪、野外地图的虚拟怪的加载队列 */
    private _entityQueue: EntityEvent[] = [];

    /** 场景里周围玩家的数量 */
    private _mapPlayerCount: number = 0;
    /** 场景里周围玩家的最大数量 */
    private _maxNum: number = 5;

    public init(): void {
        // 周围玩家进出场景及移动处理
        EventProto.I.on(ProtoId.S2CNoticePlayerEnterMap_ID, this.playerEnterMap, this);
        EventProto.I.on(ProtoId.S2CNoticePlayerLeaveMap_ID, this.playerLeaveMap, this);
        EventProto.I.on(ProtoId.S2CNoticePlayerMove_ID, this.playerMove, this);
        EventProto.I.on(ProtoId.S2CNoticePlayerStopMove_ID, this.playerStop, this);
        // 怪物进出场景
        EventProto.I.on(ProtoId.S2CNoticeMonsterEnterMap_ID, this.monsterEnterMap, this);
        EventProto.I.on(ProtoId.S2CNoticeMonsterLeaveMap_ID, this.monsterLeaveMap, this);
        // 周围玩家和怪物的属性数据更新
        EventProto.I.on(ProtoId.S2CNoticeUnitDataChange_ID, this.mapUnitDataChange, this);
        // 野外地图的虚拟怪的增删
        EventClient.I.on(E.Map.AddVMMonsterToMap, this.addVMToMap, this);
        EventClient.I.on(E.Map.RemoveVMMonsterToMap, this.delVMFmMap, this);
    }

    public set maxNum(maxNum: number) {
        this._maxNum = maxNum;
    }

    public get mapAllPlayer(): { [uuid: number]: EntityRole; } {
        return this._mapAllPlayer;
    }

    public get mapAllMonster(): { [uuid: number]: EntityMonster; } {
        return this._mapAllMonster;
    }

    private playerEnterMap(data: S2CNoticePlayerEnterMap) {
        // console.log(RoleMgr.I.info.userID, '-----------------> playerEnterMap: ', RoleMgr.I.info.userID, data);
        if (data && data.Users && data.Users.length > 0) {
            const mapData = MapCfg.I.mapData;
            if (mapData) {
                this._maxNum = mapData.MaxNum;
            }
            for (let i = 0; i < data.Users.length; i++) {
                if (!data.Users[i]) {
                    console.log('没数据，跳过');
                    continue;
                }
                if (data.Users[i].UserId === RoleMgr.I.info.userID) {
                    // 主玩家的属性数据也刷新但是不执行下面的生成模型逻辑
                    RoleMgr.I.updateUserInfo(data.Users[i]);
                    continue;
                }
                if (this._maxNum > 0 && this._mapPlayerCount >= this._maxNum) {
                    console.log('数量限制，跳过');
                    continue;
                }
                // 判断是否已添加了
                if (this._mapAllPlayer[data.Users[i].UserId]) {
                    // console.log(MapCfg.I.mapId, '地图重复添加周围玩家：', data.Users[i].UserId);
                } else {
                    const entity = new EntityEvent(EntityType.Role, data.Users[i].UserId, data.Users[i].A, data.Users[i].B);
                    this._entityQueue.push(entity);
                    // console.log('-------------------- playerEnterMap ---------------', this._entityQueue.length, this._mapPlayerCount, Object.keys(this._mapAllPlayer).length, entity);
                    this._mapPlayerCount++;
                }
                //
                if (this._playerData[data.Users[i].UserId]) {
                    this._playerData[data.Users[i].UserId].d.setData(data.Users[i]);
                } else {
                    this._playerData[data.Users[i].UserId] = new RoleInfo(data.Users[i]);
                }
                this._playerData[data.Users[i].UserId].userID = data.Users[i].UserId;
            }
        }
    }

    private playerLeaveMap(data: S2CNoticePlayerLeaveMap) {
        // console.log('-----------------> playerLeaveMap: ', this._entityQueue.length, this._mapPlayerCount, Object.keys(this._mapAllPlayer).length, data);
        if (data && data.UserId && data.UserId.length > 0) {
            for (let i = 0; i < data.UserId.length; i++) {
                const playerId = data.UserId[i];
                if (playerId === RoleMgr.I.info.userID) {
                    continue;
                }
                // 移除 playerData
                // this._playerData[playerId] = null;
                // delete this._playerData[playerId];
                // 移除周围玩家
                if (this._mapAllPlayer[playerId]) {
                    this.removePlayer(playerId);
                }
                // 有可能还没生成，要检查this._entityQueue里是否存在
                const index = this._entityQueue.findIndex((v) => v.userId === playerId);
                if (index >= 0) {
                    this._entityQueue.splice(index, 1);
                }
            }
        }
    }

    /** 移除周围玩家 */
    private removePlayer(id: number) {
        const role: EntityRole = this._mapAllPlayer[id];
        if (role) {
            role.release();
        }
        this._mapAllPlayer[id] = null;
        delete this._mapAllPlayer[id];
        this._mapPlayerCount--;
    }

    /** 移除怪物 */
    private removeMonster(id: number) {
        const monster: EntityMonster = this._mapAllMonster[id];
        if (monster) {
            monster.release();
        }
        this._mapAllMonster[id] = null;
        delete this._mapAllMonster[id];
    }

    private playerMove(data: S2CNoticePlayerMove) {
        if (data && data.Players && data.Players.length > 0) {
            for (let i = 0; i < data.Players.length; i++) {
                if (data.Players[i].UserId === RoleMgr.I.info.userID) {
                    continue;
                }
                // console.log('-----------------> playerMove: ', data);
                if (this._mapAllPlayer[data.Players[i].UserId]) {
                    const startPos: cc.Vec2 = cc.v2(data.Players[i].Source.X, data.Players[i].Source.Y);
                    const targetPos: cc.Vec2 = cc.v2(data.Players[i].Target.X, data.Players[i].Target.Y);

                    // console.log(
                    //     data.Players[i].UserId,
                    //     '该玩家的当前位置是',
                    //     this._mapAllPlayer[data.Players[i].UserId].position.x ^ 0,
                    //     this._mapAllPlayer[data.Players[i].UserId].position.y ^ 0,
                    //     '收到的移动包起点',
                    //     data.Players[i].Source.X,
                    //     data.Players[i].Source.Y,
                    //     '终点',
                    //     data.Players[i].Target.X,
                    //     data.Players[i].Target.Y,
                    //     this._mapAllPlayer[data.Players[i].UserId].active,
                    // );
                    // if (this._mapAllPlayer[data.Players[i].UserId].position.x !== data.Players[i].Source.X || this._mapAllPlayer[data.Players[i].UserId].position.y !== data.Players[i].Source.Y) {
                    //     console.warn('起点不应该有差异');
                    // }

                    // 如果周围玩家的初始点超过地图而被修正的话，这里就直接用移动包的起点位置
                    // if (!this._mapAllPlayer[data.Players[i].UserId].active
                    //     || this._mapAllPlayer[data.Players[i].UserId].x === 0
                    //     || this._mapAllPlayer[data.Players[i].UserId].y === 0) {
                    const newX = MapCfg.I.cellToPosX(startPos.x);
                    const newY = MapCfg.I.cellToPosX(startPos.y);
                    if (Math.abs(this._mapAllPlayer[data.Players[i].UserId].x - newX) > 64
                        || Math.abs(this._mapAllPlayer[data.Players[i].UserId].y - newY) > 64) {
                        this._mapAllPlayer[data.Players[i].UserId].setPosition(newX, newY);
                    }

                    this._mapAllPlayer[data.Players[i].UserId].active = ModelMgr.I.SettingModel.getModel();
                    // console.log('重置周围玩家位置');
                    // }

                    // 有可能该周围玩家的真实位置和收到的移动包的起始位置不一致
                    // const posX = (this._mapAllPlayer[data.Players[i].UserId].x / MapCfg.I.cellWidth) ^ 0;
                    // const posY = (this._mapAllPlayer[data.Players[i].UserId].y / MapCfg.I.cellHeight) ^ 0;
                    // if (posX !== startPos.x || posY !== startPos.y) {
                    // console.log('-----------------> 开始新的寻路: ', this._mapAllPlayer[data.Players[i].UserId].x, this._mapAllPlayer[data.Players[i].UserId].y, '终点：', targetPos.x * MapCfg.I.cellWidth, targetPos.y * MapCfg.I.cellHeight);
                    MapCfg.I.createMapRoad(
                        cc.v2(this._mapAllPlayer[data.Players[i].UserId].x, this._mapAllPlayer[data.Players[i].UserId].y),
                        cc.v2(MapCfg.I.cellToPosX(targetPos.x), MapCfg.I.cellToPosX(targetPos.y)),
                        (roadNodeArr: RoadNode[]) => {
                            // console.log('-----------------> 生成了新的路点数据: ', roadNodeArr);
                            if (roadNodeArr.length > 0 && this._mapAllPlayer[data.Players[i].UserId]) {
                                this._mapAllPlayer[data.Players[i].UserId].stop();
                                this._mapAllPlayer[data.Players[i].UserId].walkByRoad(roadNodeArr, null, data.Players[i].Param === 1);
                            }
                        },
                        this,
                    );
                    // } else {
                    //     MapCfg.I.getMapRoad(
                    //         cc.v2(startPos.x * MapCfg.I.cellWidth, startPos.y * MapCfg.I.cellHeight),
                    //         cc.v2(targetPos.x * MapCfg.I.cellWidth, targetPos.y * MapCfg.I.cellHeight),
                    //         null,
                    //         (roadNodeArr: RoadNode[]) => {
                    //             // console.log('-----------------> 找到路点数据: ', roadNodeArr);
                    //             if (roadNodeArr.length > 0 && this._mapAllPlayer[data.Players[i].UserId]) {
                    //                 this._mapAllPlayer[data.Players[i].UserId].stop();
                    //                 this._mapAllPlayer[data.Players[i].UserId].walkByRoad(roadNodeArr);
                    //             }
                    //         },
                    //         this,
                    //     );
                    // }
                } else {
                    // 收到移动包，但是该周围玩家不存在, 不做强同步，这里暂不处理
                }
            }
        }
    }

    private playerStop(data: S2CNoticePlayerStopMove) {
        // 做成和幻1一样的，不停
        // console.log('-----------------> playerStop: ', data);
        // if (this._mapAllPlayer[data.UserId]) {
        //     this._mapAllPlayer[data.UserId].stop();
        // }
    }

    /** 有明怪表里填的方向转为实体方向 */
    private getEntityDir(dir: number): ACTION_DIRECT {
        let real = ACTION_DIRECT.RIGHT_DOWN;
        switch (dir) {
            case 1:// 左下
                real = ACTION_DIRECT.LEFT_DOWN;
                break;
            case 2: // 左上
                real = ACTION_DIRECT.LEFT_UP;
                break;
            case 3: // 右上
                real = ACTION_DIRECT.RIGHT_UP;
                break;
            case 4: // 右下
                real = ACTION_DIRECT.RIGHT_DOWN;
                break;
            default:
                break;
        }
        return real;
    }

    /** 怪物进入主玩家的场景 */
    private monsterEnterMap(data: S2CNoticeMonsterEnterMap) {
        // console.log('-----------------> monsterEnterMap: ', data);
        if (data && data.Monster && data.Monster.length > 0) {
            const cfgMapMonster: ConfigIndexer = Config.Get(Config.Type.Cfg_Map_Monster);
            const cfgRrefresh: ConfigIndexer = Config.Get(Config.Type.Cfg_Refresh);
            const cfgMonster: ConfigIndexer = Config.Get(Config.Type.Cfg_Monster);

            for (let i = 0; i < data.Monster.length; i++) {
                // 这里的Id是地图明怪表里的id，需先拿明怪表里的刷新id，再到刷新表里拿怪物ids
                const cfgMM: Cfg_Map_Monster = cfgMapMonster.getValueByKey(data.Monster[i].Id);
                if (!cfgMM) continue;
                const cfgR: Cfg_Refresh = cfgRrefresh.getValueByKey(cfgMM.RefreshId);
                if (!cfgR) continue;
                const ids = cfgR.MonsterIds.split('|');
                const bossId = +ids[0];

                // 判断是否已添加了
                if (this._mapAllMonster[data.Monster[i].Id]) {
                    // console.log(MapCfg.I.mapId, '地图重复添加相同id的怪：', data.Monster[i].Id);
                } else {
                    // console.log('怪进场景', bossId, '明怪id是', data.Monster[i].Id);
                    if (this._monsterData[data.Monster[i].Id]) {
                        this._monsterData[data.Monster[i].Id].d.setData(data.Monster[i]);
                    } else {
                        this._monsterData[data.Monster[i].Id] = new RoleInfo(data.Monster[i]);
                    }
                    this._monsterData[data.Monster[i].Id].userID = data.Monster[i].Id;

                    const cfg: Cfg_Monster = cfgMonster.getValueByKey(bossId);
                    const entity = new EntityEvent(EntityType.Monster);
                    entity.userId = data.Monster[i].Id;//  这里还是拿data.Monster[i].Id，而不是bossId
                    entity.resId = cfg.AnimId;
                    entity.resType = ANIM_TYPE.PET;
                    entity.dir = this.getEntityDir(cfgMM.Direction);
                    entity.act = ACTION_TYPE.STAND;
                    entity.pos = cc.v2(this._monsterData[data.Monster[i].Id].d.Monster_Map_X, this._monsterData[data.Monster[i].Id].d.Monster_Map_Y);
                    if (cfgMM.Scale) {
                        entity.scale = cfgMM.Scale / 10000;
                    }
                    this._entityQueue.push(entity);
                }
            }
        }
    }
    /** 怪物离开主玩家的场景 */
    private monsterLeaveMap(data: S2CNoticeMonsterLeaveMap) {
        // console.log('-----------------> monsterLeaveMap: ', data);
        if (data && data.MonsterId && data.MonsterId.length > 0) {
            for (let i = 0; i < data.MonsterId.length; i++) {
                const monsterId = data.MonsterId[i];

                // 移除 monsterData
                // this._monsterData[monsterId] = null;
                // delete this._monsterData[monsterId];

                // 移除地图上的怪物
                if (this._mapAllMonster[monsterId]) {
                    this.removeMonster(monsterId);
                }
                // 有可能还没生成，要检查this._entityQueue里是否存在
                const index = this._entityQueue.findIndex((v) => v.userId === monsterId);
                if (index >= 0) {
                    this._entityQueue.splice(index, 1);
                }
            }
        }
        // console.log('+this._monsterData=', this._monsterData);
    }

    /** 周围玩家的属性变化 关注 1血FCurrHp,FMaxHp;2死亡复活Map_State,Map_ReliveTime;3位置重置Map_X,Map_Y */
    private checkPlayerDataChange(info: BaseUserInfo, isMainRole: boolean = false): number[] {
        let isChangeState: number = -1;
        let isResetPos: number = 0;
        if (MapCfg.I.isBeaconWar) {
            for (let t = 0; t < info.A.length; t++) {
                const key = RoleMD.AttrType[info.A[t].K] as string;
                if (key === 'Map_State') { //  || key === 'Map_ReliveTime'
                    isChangeState = info.A[t].V;
                    if (!isMainRole) {
                        EventClient.I.emit(E.BeaconWar.PlayerState, info.UserId);
                    }
                } else if (key === 'FCurrHp' || key === 'FMaxHp') {
                    // console.log('--玩家血--', info.A[t].V);
                    if (!isMainRole) EventClient.I.emit(E.BeaconWar.PlayerHp, info.UserId);
                } else if (key === 'Map_X' || key === 'Map_Y') {
                    isResetPos = 1;
                    if (!isMainRole) {
                        EventClient.I.emit(E.BeaconWar.PlayerResetPos, info.UserId);
                    }
                }
            }
        }
        return [isChangeState, isResetPos];
    }

    /** 周围玩家的属性变化 关注 1血FCurrHp,FMaxHp;2死亡复活Map_State,Map_ReliveTime;3归属MonsterBelong */
    private checkMonsterDataChange(info: BaseMonsterInfo): number {
        let isChangeState: number = -1;
        if (MapCfg.I.isBeaconWar) {
            for (let t = 0; t < info.A.length; t++) {
                const key = RoleMD.AttrType[info.A[t].K] as string;
                if (key === 'Monster_State') { //  || key === 'Monster_ReliveTime'
                    isChangeState = info.A[t].V;
                    EventClient.I.emit(E.BeaconWar.MonsterState, info.Id);
                } else if (key === 'FCurrHp' || key === 'FMaxHp') {
                    EventClient.I.emit(E.BeaconWar.MonsterHp, info.Id);
                } else if (key === 'Monster_OwnerId') {
                    EventClient.I.emit(E.BeaconWar.MonsterBelong, info.Id, info.A[t].V);
                }
            }
        }
        return isChangeState;
    }

    /** 周围玩家及怪物的属性数据刷新 */
    private mapUnitDataChange(data: S2CNoticeUnitDataChange) {
        if (!data) return;
        if (MapCfg.I.isBeaconWar) {
            // console.log('---------- 场景里有相关属性数据刷新 -------------', data);
        }
        if (data.Users && data.Users.length > 0) {
            for (let i = 0; i < data.Users.length; i++) {
                // 是主玩家
                if (data.Users[i].UserId === RoleMgr.I.info.userID) {
                    const Map_X: number = RoleMgr.I.d.Map_X;
                    const Map_Y: number = RoleMgr.I.d.Map_Y;
                    RoleMgr.I.updateUserInfo(data.Users[i]);

                    const [isChangeState, isResetPos] = this.checkPlayerDataChange(data.Users[i], true);
                    // 重置位置
                    if (isResetPos) {
                        const newX = MapCfg.I.cellToPosX(RoleMgr.I.d.Map_X);
                        const newY = MapCfg.I.cellToPosX(RoleMgr.I.d.Map_Y);
                        // !(SceneMap.I.mainRole().stopCellX === Map_X && SceneMap.I.mainRole().stopCellY === Map_Y) &&
                        if (Math.abs(SceneMap.I.mainRole().x - newX) > 100 || Math.abs(SceneMap.I.mainRole().y - newY) > 100) {
                            // console.warn(data.Users[i].UserId, '主玩家重置位置', RoleMgr.I.d.Map_X, RoleMgr.I.d.Map_Y);
                            SceneMap.I.initPlayCell(RoleMgr.I.d.Map_X, RoleMgr.I.d.Map_Y);
                        }
                    }
                } else {
                    if (this._playerData[data.Users[i].UserId]) {
                        this._playerData[data.Users[i].UserId].d.setData(data.Users[i]);
                    } else {
                        this._playerData[data.Users[i].UserId] = new RoleInfo(data.Users[i]);
                    }
                    this._playerData[data.Users[i].UserId].userID = data.Users[i].UserId;
                    //
                    if (this._mapAllPlayer[data.Users[i].UserId]) {
                        this._mapAllPlayer[data.Users[i].UserId].roleInfo.d.setData(data.Users[i]);
                        this._mapAllPlayer[data.Users[i].UserId].roleInfo.userID = data.Users[i].UserId;
                    }

                    // 周围玩家的属性变化
                    const [isChangeState, isResetPos] = this.checkPlayerDataChange(data.Users[i]);
                    if (isChangeState >= 0) {
                        if (this._mapAllPlayer[data.Users[i].UserId]) {
                            this._mapAllPlayer[data.Users[i].UserId].setState(isChangeState === 0 ? EntityChallengeState.Die : EntityChallengeState.Normal);
                            // console.warn(data.Users[i].UserId, '周围玩家死亡状态', isChangeState);
                        }
                    }
                    // 重置位置
                    if (isResetPos) {
                        if (this._mapAllPlayer[data.Users[i].UserId]) {
                            const cellX = this._playerData[data.Users[i].UserId].d.Map_X;
                            const cellY = this._playerData[data.Users[i].UserId].d.Map_Y;
                            if (!MapCfg.I.isOutMap(cellX, cellY)) {
                                const newX = MapCfg.I.cellToPosX(cellX);
                                const newY = MapCfg.I.cellToPosX(cellY);
                                if (Math.abs(this._mapAllPlayer[data.Users[i].UserId].x - newX) > 100
                                    || Math.abs(this._mapAllPlayer[data.Users[i].UserId].y - newY) > 100) {
                                    this._mapAllPlayer[data.Users[i].UserId].x = newX;
                                    this._mapAllPlayer[data.Users[i].UserId].y = newY;
                                }
                                this._mapAllPlayer[data.Users[i].UserId].stop();
                            }
                            // console.warn(data.Users[i].UserId, '周围玩家重置位置', this._mapAllPlayer[data.Users[i].UserId].x, this._mapAllPlayer[data.Users[i].UserId].y);
                        }
                    }
                }
            }
        }
        if (data.Monsters && data.Monsters.length > 0) {
            for (let i = 0; i < data.Monsters.length; i++) {
                if (this._monsterData[data.Monsters[i].Id]) {
                    this._monsterData[data.Monsters[i].Id].d.setData(data.Monsters[i]);
                } else {
                    this._monsterData[data.Monsters[i].Id] = new RoleInfo(data.Monsters[i]);
                }
                this._monsterData[data.Monsters[i].Id].userID = data.Monsters[i].Id;
                //
                if (this._mapAllMonster[data.Monsters[i].Id]) {
                    this._mapAllMonster[data.Monsters[i].Id].roleInfo.d.setData(data.Monsters[i]);
                    this._mapAllMonster[data.Monsters[i].Id].roleInfo.userID = data.Monsters[i].Id;
                }
                // 怪物的属性变化
                const isChangeState: number = this.checkMonsterDataChange(data.Monsters[i]);
                if (isChangeState >= 0) {
                    if (this._mapAllMonster[data.Monsters[i].Id]) {
                        // this._mapAllMonster[data.Monsters[i].Id].setState(isChangeState === 0 ? EntityChallengeState.Die : EntityChallengeState.Normal);
                        // 怪死亡了就直接隐藏
                        this._mapAllMonster[data.Monsters[i].Id].active = isChangeState > 0;
                        // console.warn(data.Monsters[i].Id, '怪物死亡状态', isChangeState);
                    }
                }
            }
        }
    }

    private addVMToMap(): void {
        // console.log('怪物新增 addVMToMap --------', data.IID, isVM);
        if (MapCfg.I.isYeWai) {
            const mdata: { Id: number, IID: number, Pos: { x: number, y: number; }, dirEct: number; } = MapCfg.I.getMapMonster();
            const entity = new EntityEvent(EntityType.VMMonster);
            entity.userId = mdata.IID;
            entity.resId = 20001;
            entity.resType = ANIM_TYPE.PET;
            entity.dir = ACTION_DIRECT.RIGHT_DOWN;
            entity.act = ACTION_TYPE.STAND;
            entity.pos = cc.v2(mdata.Pos.x, mdata.Pos.y);
            this._entityQueue.push(entity);
        }

        // console.log('-------------------- addVMToMap ---------------', this._entityQueue.length, entity);
    }

    private delVMFmMap(id: number): void {
        // 死亡动作后再死亡
        // console.log('怪物死亡 delVMFmMap --------', id, isVM);
        const monster = this._mapAllMonster[id];
        if (monster) {
            monster.release();
            delete this._mapAllMonster[id];
        }
        // 保险起见也检查this._entityQueue里是否存在
        const index = this._entityQueue.findIndex((v) => v.userId === id);
        if (index >= 0) {
            this._entityQueue.splice(index, 1);
        }
    }

    private checkPos(x: number, y: number): number[] {
        let isOut: number = 0;
        if (x < 0 || x > MapCfg.I.mapWidth || y < 0 || y > MapCfg.I.mapHeight) {
            console.warn('超出地图外了');
            const cur = MapCfg.I.getCurCell();
            x = cur.x;
            y = cur.y;
            isOut = 1;
        }
        return [x, y, isOut];
    }

    /** 采用队列处理，避免多个玩家或怪物进入同时加载引起卡顿 */
    private dealEntity() {
        if (this._entityQueue.length > 0) {
            const d = this._entityQueue.shift();
            if (!d) return;
            if (d.entityType === EntityType.Role) {
                const count = Object.keys(this._mapAllPlayer).length;
                const role = EntityMapMgr.I.createRole({ A: d.A, B: d.B }, d.userId, count >= MaxPlayer);
                const posx = MapCfg.I.cellToPosX(role.roleInfo.d.Map_X);
                const posy = MapCfg.I.cellToPosX(role.roleInfo.d.Map_Y);
                const pos = this.checkPos(posx, posy);
                role.setPosition(pos[0], pos[1]);
                role.showbodyShadow(count >= MaxPlayer);
                role.active = pos[2] === 0 && ModelMgr.I.SettingModel.getModel();
                EntityLayer.I.node.addChild(role);

                this._mapAllPlayer[role.roleInfo.userID] = role;

                // 在烽火连城里就添加点击玩家出现挑战按钮
                if (MapCfg.I.isBeaconWar) {
                    role.showChallenge(d.userId, EntityChallengeState.Normal, (uuid: number) => {
                        EventClient.I.emit(E.BeaconWar.HideClickAnim);
                        ModelMgr.I.BeaconWarModel.moveToPlayerPos(uuid, role.x, role.y);
                    });
                }
            } else if (d.entityType === EntityType.Monster) {
                if (!MapCfg.I.isYeWai) {
                    const monster = new EntityMonster(d.resId, d.resType, d.dir, d.act);
                    const posx = MapCfg.I.cellToPosX(d.pos.x);
                    const posy = MapCfg.I.cellToPosX(d.pos.y);
                    monster.setPosition(posx, posy);
                    monster.setEntityScale(d.scale);
                    EntityLayer.I.node.addChild(monster);
                    this._mapAllMonster[d.userId] = monster;
                    this._mapAllMonster[d.userId].roleInfo = new RoleInfo(d);
                    this._mapAllMonster[d.userId].roleInfo.userID = d.userId;
                    // 在烽火连城里就添加点击怪出现挑战按钮
                    if (MapCfg.I.isBeaconWar) {
                        monster.showChallenge(d.userId, EntityChallengeState.Normal, (uuid: number) => {
                            EventClient.I.emit(E.BeaconWar.HideClickAnim);
                            ModelMgr.I.BeaconWarModel.moveToBossPos(uuid);
                        });
                    }
                }
            } else if (d.entityType === EntityType.VMMonster) {
                if (MapCfg.I.isYeWai) {
                    const monster = new EntityMonster(d.resId, d.resType, d.dir, d.act);
                    const posx = MapCfg.I.cellToPosX(d.pos.x);
                    const posy = MapCfg.I.cellToPosX(d.pos.y);
                    monster.setPosition(posx, posy);
                    monster.setEntityScale(d.scale);
                    EntityLayer.I.node.addChild(monster);
                    this._mapAllMonster[d.userId] = monster;
                    this._mapAllMonster[d.userId].roleInfo = new RoleInfo(d);
                    this._mapAllMonster[d.userId].roleInfo.userID = d.userId;
                }
            }
        }
    }

    public setChallengeState(isPlayer: boolean, userId: number, state: EntityChallengeState): void {
        if (isPlayer) {
            for (const i in this._mapAllPlayer) {
                const role: EntityRole = this._mapAllPlayer[i];
                if (role && role.isValid && role.roleInfo && role.roleInfo.userID === userId) {
                    role.setState(state);
                    break;
                }
            }
        }
    }

    /** 重置状态:只是不显示挑战按钮 */
    public resetChallengeState(): void {
        for (const i in this._mapAllPlayer) {
            const role: EntityRole = this._mapAllPlayer[i];
            if (role && role.isValid) {
                if (role.roleInfo && role.roleInfo.d.Map_State === EBeaconState.Die) {
                    role.setState(EntityChallengeState.Die);
                }
                role.setChallenge(false);
            }
        }
    }

    /** 设置模型各个部件的显示隐藏 */
    public setEntityAnimActive(name: EntityAnimName, visible: boolean): void {
        for (const i in this._mapAllPlayer) {
            const role: EntityRole = this._mapAllPlayer[i];
            if (role && role.isValid) {
                if (name === EntityAnimName.ALL) {
                    role.active = visible;
                } else {
                    role.setEntityAnimActive(name, visible);
                }
            }
        }
    }

    /** 更新数据到_playerData */
    public setMapPlayerData(info: BaseUserInfo): void {
        if (info) {
            if (this._playerData[info.UserId]) {
                this._playerData[info.UserId].d.setData(info);
            } else {
                this._playerData[info.UserId] = new RoleInfo(info);
            }
            this._playerData[info.UserId].userID = info.UserId;
        }
    }

    /** 地图里的周围玩家数据 */
    public getMapPlayerData(id: number): RoleInfo {
        return this._playerData[id];
    }

    /** 地图里的怪物数据 */
    public getMapMonsterData(id: number): RoleInfo {
        return this._monsterData[id];
    }

    /** 场景内周围玩家和怪物的刷新管理 */
    public mainUpdate(dt: number): void {
        // 等待地图加载完成后才加载周围玩家和怪物
        if (SceneMap.I.isTransEnd) {
            for (const i in this._mapAllPlayer) {
                const role: EntityRole = this._mapAllPlayer[i];
                role.mainUpdate(dt);
            }
            this.dealEntity();
        }
    }

    /** 离开场景清除怪物数据及模型对象 */
    public cleanMonster(): void {
        if (this._monsterData) {
            for (const k in this._monsterData) {
                if (this._mapAllMonster[k]) {
                    this._mapAllMonster[k].release();
                    this._mapAllMonster[k] = null;
                    delete this._mapAllMonster[k];
                }
            }
            this._monsterData = cc.js.createMap(true);
        }
        // console.log('this._mapAllMonster=', this._mapAllMonster);
    }

    public release(): void {
        console.log('************ 清除场景内玩家及怪物 ************');
        this._mapPlayerCount = 0;
        this._entityQueue = [];
        // 清所有的怪物和玩家
        for (const i in this._mapAllPlayer) {
            const role: EntityRole = this._mapAllPlayer[i];
            role.release();
        }
        this._mapAllPlayer = cc.js.createMap(true);
        this._playerData = cc.js.createMap(true);

        for (const i in this._mapAllMonster) {
            const monster: EntityMonster = this._mapAllMonster[i];
            monster.release();
        }
        this._mapAllMonster = cc.js.createMap(true);
        this._monsterData = cc.js.createMap(true);
    }

    /** 根据Id 获取刷新表 */
    public CfgRefresh(refreshId: number): Cfg_Refresh {
        const indexer = Config.Get(ConfigConst.Cfg_Refresh);
        return indexer.getValueByKey(refreshId);
    }

    /** 根据怪物Id 获取怪物配置 */
    public CfgMonster(monsterId: number): Cfg_Monster {
        const indexer = Config.Get(ConfigConst.Cfg_Monster);
        return indexer.getValueByKey(monsterId);
    }
}

enum EntityType {
    /** 玩家 */
    Role = 0,
    /** 怪物 */
    Monster = 1,
    /** 野外的虚拟怪 */
    VMMonster = 2,
}
class EntityEvent {
    public entityType: EntityType = 0;

    public resId: string | number = 0;
    public resType: ANIM_TYPE = ANIM_TYPE.ROLE;
    public dir: ACTION_DIRECT = ACTION_DIRECT.RIGHT_DOWN;
    public act: ACTION_TYPE = ACTION_TYPE.STAND;
    public pos: cc.Vec2 = cc.v2(0, 0);
    public scale: number = 1;

    public userId: number = 0;
    public A: Array<IntAttr> = [];
    public B: Array<StrAttr> = [];

    public constructor(entityType: EntityType, userId?: number, A?: Array<IntAttr>, B?: Array<StrAttr>) {
        this.entityType = entityType;
        if (userId) this.userId = userId;
        if (A) this.A = A;
        if (B) this.B = B;
    }
}
