/* eslint-disable indent */
/* eslint-disable no-cond-assign */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: kexd
 * @Date: 2022-04-27 21:08:44
 * @FilePath: \SanGuo2.4\assets\script\game\map\SceneMap.ts
 * @Description: 运行地图
 *
 */

import MapLayer from './MapLayer';
import MapCfg from './MapCfg';
import { ResMgr } from '../../app/core/res/ResMgr';
import { EntityLayer } from './EntityLayer';
import { MapMode, MapSaveInfo } from '../base/mapBase/road/MapMode';
import PathFindingAgent from '../base/mapBase/road/PathFindingAgent';
import RoadNode from '../base/mapBase/road/RoadNode';
import RoadPointLayer from '../base/mapBase/RoadPointLayer';
import MapMgr from './MapMgr';
import { EventClient } from '../../app/base/event/EventClient';
import { E } from '../const/EventName';
import EntityMapMgr from '../entity/EntityMapMgr';
import { AppEvent } from '../../app/AppEventConst';
import { AssetType } from '../../app/core/res/ResConst';
import { EventProto } from '../../app/base/event/EventProto';
import NetMgr from '../manager/NetMgr';
import { ACTION_TYPE, ANIM_TYPE } from '../base/anim/AnimCfg';
import PerformanceMgr from '../manager/PerformanceMgr';
import { IEntitySkin } from '../entity/EntityConst';
import { RoleMgr } from '../module/role/RoleMgr';
import { RoleAN } from '../module/role/RoleAN';
import { EffectMgr } from '../manager/EffectMgr';
import { RoleMD } from '../module/role/RoleMD';
import EntityCfg from '../entity/EntityCfg';
import GameApp from '../base/GameApp';
import { Config } from '../base/config/Config';
import ModelMgr from '../manager/ModelMgr';
import { GameLayerEnum } from '../../app/core/mvc/WinConst';
import { LayerMgr } from '../base/main/LayerMgr';
import AudioPath from '../../app/base/manager/AudioPath';
import { AudioMgr } from '../../app/base/manager/AudioMgr';
import { NickShowType } from '../base/utils/UtilGame';
import { UtilString } from '../../app/base/utils/UtilString';
import { MainRole } from '../entity/MainRole';
import { UtilBool } from '../../app/base/utils/UtilBool';
import { RES_ENUM } from '../const/ResPath';
import { ELobbyViewType } from '../module/lobby/LobbyConst';

const { ccclass, property } = cc._decorator;

export enum MapState {
    /** 开始切换地图 */
    TransBegin = 0,

    /** 加载完了地图数据 */
    FinishLoadMapData = 1,

    /** 切换地图结束 */
    TransEnd = 2,
}

@ccclass
export default class SceneMap extends cc.Component {
    @property(MapLayer)
    private mapLayer: MapLayer = null;
    @property(RoadPointLayer)
    private roadPointLayer: RoadPointLayer = null;
    @property(EntityLayer)
    private entityLayer: EntityLayer = null;

    private _role: MainRole = null;
    private _mapId: number = 0;
    public get mapId(): number {
        return this._mapId;
    }
    private _mapWidth: number = 0;
    private _mapHeight: number = 0;
    private _cellWidth: number = 0;
    private _cellHeight: number = 0;
    private _mapType: MapMode;
    private _mapState: MapState = MapState.TransBegin;
    private _initEnd: boolean = false;
    //
    private _testSeekPathGraphic: cc.Graphics = null; // 查看寻路过程 测试用
    private _isLookSeekRoad: boolean = false; // 是否查看寻路过程 测试用

    public static I: SceneMap;

    protected onLoad(): void {
        SceneMap.I = this;
        this._initEnd = false;
        MapMgr.I.init();
        this.addE();
    }

    protected start(): void {
        PerformanceMgr.I.loginCost();
    }

    private onChangeViewType(type: ELobbyViewType) {
        switch (type) {
            case ELobbyViewType.YeWai:
                this.dealWinBigClose(true);
                break;
            default:
                this.dealWinBigClose(false);
                break;
        }
    }

    protected onDestroy(): void {
        SceneMap.I = null;

        EventClient.I.off(E.Lobby.ChangeViewType, this.onChangeViewType, this);

        EventProto.I.off(ProtoId.S2CEnterMap_ID, this.s2cEnterMap, this);
        EventProto.I.off(ProtoId.S2CNoticePlayerChangeMap_ID, this.s2cChangeMap, this);

        EventClient.I.off(AppEvent.WinBigAllClose, this.dealWinBigClose, this);
        EventClient.I.off(E.MainCity.Show, () => { this.dealWinBigClose(false); }, this);
        EventClient.I.off(E.MainCity.Close, () => { this.dealWinBigClose(true); }, this);
        EventClient.I.off(E.Battle.Start, this.onBattenStart, this);
        EventClient.I.off(E.Battle.End, this.onBattleEnd, this);

        EventClient.I.off(E.Map.RemoveVMMonsterToMap, this.next, this);
        EventClient.I.off(E.Game.Start, this.initMap, this);
        EventClient.I.off(E.Map.InitPathFinding, this.checkPathFinding, this);
        EventClient.I.off(E.Map.InitMapLoaded, this.checkMapLoaded, this);

        EventClient.I.off(E.Music.FightEnd, this._onFightEndMusic, this);

        // 人物属性变化的监听
        RoleMgr.I.off(
            this.onUpdateRole,
            this,
            RoleAN.N.Title,
            RoleAN.N.PlayerSkin,
            RoleAN.N.GradeHorse,
            RoleAN.N.GradeWeapon,
            RoleAN.N.GradeWing,
            RoleAN.N.Sex,
            RoleAN.N.Nick,
            RoleAN.N.OfficeLevel,
        );
        RoleMgr.I.off(this.showLvUp, this, RoleAN.N.Level);
        RoleMgr.I.off(this.onUpdateMap, this, RoleAN.N.Stage);
    }

    private addE() {
        EventClient.I.on(E.Lobby.ChangeViewType, this.onChangeViewType, this);

        EventProto.I.on(ProtoId.S2CEnterMap_ID, this.s2cEnterMap, this);
        EventProto.I.on(ProtoId.S2CNoticePlayerChangeMap_ID, this.s2cChangeMap, this);

        EventClient.I.on(AppEvent.WinBigAllClose, this.dealWinBigClose, this);
        EventClient.I.on(E.MainCity.Show, () => { this.dealWinBigClose(false); }, this);
        EventClient.I.on(E.MainCity.Close, () => { this.dealWinBigClose(true); }, this);
        EventClient.I.on(E.Battle.Start, this.onBattenStart, this);
        EventClient.I.on(E.Battle.End, this.onBattleEnd, this);

        EventClient.I.on(E.Map.RemoveVMMonsterToMap, this.next, this);
        EventClient.I.on(E.Game.Start, this.initMap, this);
        EventClient.I.on(E.Map.InitPathFinding, this.checkPathFinding, this);
        EventClient.I.on(E.Map.InitMapLoaded, this.checkMapLoaded, this);

        EventClient.I.on(E.Music.FightEnd, this._onFightEndMusic, this);

        // 人物属性变化的监听
        RoleMgr.I.on(
            this.onUpdateRole,
            this,
            RoleAN.N.Title,
            RoleAN.N.PlayerSkin,
            RoleAN.N.GradeHorse,
            RoleAN.N.GradeWeapon,
            RoleAN.N.GradeWing,
            RoleAN.N.Sex,
            RoleAN.N.Nick,
            RoleAN.N.OfficeLevel,
        );
        RoleMgr.I.on(this.showLvUp, this, RoleAN.N.Level);
        RoleMgr.I.on(this.onUpdateMap, this, RoleAN.N.Stage);
    }

    public mainRole(): MainRole {
        return this._role;
    }

    public getEntityLayer(): EntityLayer {
        return this.entityLayer;
    }

    /**
     * 测试用，清掉地图及玩家、怪物
     */
    public destroyMap(): void {
        this._role.release();
        this._role = null;
        MapMgr.I.release();
        this.mapLayer.node.destroy();
        this.roadPointLayer.node.destroy();
        this.entityLayer.node.destroy();
        this.node.destroy();
    }

    /** 测试换地图的 */
    public testChangeMap() {
        let mapId = MapCfg.I.mapId;
        mapId++;
        if (mapId > 11) mapId = 1;
        SceneMap.I.sendEnterMap(mapId);
    }

    /** gm进入地图 */
    public testEnterMap(mapId: number) {
        console.log('gm进入地图：', mapId);
        SceneMap.I.sendEnterMap(mapId);
    }

    /**
     * 测试换模型的
     */
    private _roleIndex: number = 0;
    public testChangeRole() {
        const arr = [11001, 11002, 10001, 10002, 10003, 10004,
            20001, 20003, 20004, 20101, 20102, 20201, 20301, 20302, 21001, 21002, 21003, 21004, 22001, 20304];
        const atype = [ANIM_TYPE.ROLE, ANIM_TYPE.ROLE, ANIM_TYPE.ROLE, ANIM_TYPE.ROLE, ANIM_TYPE.ROLE, ANIM_TYPE.ROLE,
        ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET, ANIM_TYPE.PET];
        this._roleIndex++;
        if (this._roleIndex < 0 || this._roleIndex >= arr.length) {
            this._roleIndex = 0;
        }
        const roleSkin: IEntitySkin = {
            bodyResID: 0,
            weaponResID: 0,
            horseResID: 0,
            wingResID: 0,
        };

        roleSkin.bodyResID = arr[this._roleIndex];
        if (arr[this._roleIndex] === 10001 || arr[this._roleIndex] === 10002) {
            roleSkin.horseResID = 0;
            roleSkin.weaponResID = 0;
            roleSkin.wingResID = 0;
        } else if (arr[this._roleIndex] === 10003) {
            roleSkin.horseResID = 51002;
            roleSkin.weaponResID = 0;
            roleSkin.wingResID = 0;
        } else if (arr[this._roleIndex] === 10004) {
            roleSkin.horseResID = 51002;
            roleSkin.weaponResID = 0;
            roleSkin.wingResID = 0;
        } else if (arr[this._roleIndex] === 11001) {
            roleSkin.horseResID = 51021;
            roleSkin.weaponResID = 50001;
            roleSkin.wingResID = 52001;
        } else if (arr[this._roleIndex] === 11002) {
            roleSkin.horseResID = 51021;
            roleSkin.weaponResID = 50001;
            roleSkin.wingResID = 52021;
        }
        this._role.changeAnimData(roleSkin, atype[this._roleIndex], this._role.isMoving ? ACTION_TYPE.RUN : ACTION_TYPE.STAND);
    }

    private onUpdateMap() {
        const mapId: number = ModelMgr.I.GameLevelModel.getStageInfo();
        // console.log('当前关卡的地图id是', mapId);
        if (this._mapId !== mapId) {
            SceneMap.I.sendEnterMap(mapId);
        }
    }

    /**
     * 地图数据已初始化,数据表已加载完成，人物属性数据已接收
     */
    public initMap() {
        if (!this._role) {
            this._role = EntityMapMgr.I.createMeRole();
            this._role.setTitleAnim(RoleMgr.I.d.Title);
            this._role.setName(RoleMgr.I.info.getAreaNick(NickShowType.OfficialArenaNick, true));
            this._role.active = false;
            this.entityLayer.node.addChild(this._role);
        }

        this.node.on(cc.Node.EventType.TOUCH_START, this.onMapMouseDown, this);

        // 当前的地图id
        const mapId: number = ModelMgr.I.GameLevelModel.getStageInfo();
        // console.log('===================================  initMap  ===============================', mapId, RoleMgr.I.d.Stage);
        this.sendEnterMap(mapId);

        // 测试用的显示寻路过程
        if (this._isLookSeekRoad) {
            const testSeekPathNode: cc.Node = new cc.Node();
            // const trans = testSeekPathNode.addComponent(UITransform);
            testSeekPathNode.anchorX = 0;
            testSeekPathNode.anchorY = 0;
            this.mapLayer.node.addChild(testSeekPathNode);
            this._testSeekPathGraphic = testSeekPathNode.addComponent(cc.Graphics);
        }

        this._initEnd = true;
    }

    /** 初始化寻路数据完成 */
    private _initPathFinding: boolean = false;
    /** 地图缩略图（地图块）加载完成 */
    private _initMapLoaded: boolean = false;
    /** 场景切换的飘云完成 */
    private _initChangeMapAnim: boolean = false;

    public get mapState() {
        return this._mapState;
    }
    public get isTransEnd() {
        return this._mapState === MapState.TransEnd;
    }
    public get isFinishLoadMapData() {
        return this._mapState >= MapState.FinishLoadMapData;
    }

    private initMapState() {
        this._initPathFinding = false;
        this._initMapLoaded = false;
        this._initChangeMapAnim = false;
    }

    private checkPathFinding() {
        this._initPathFinding = true;
        // console.log('checkPathFinding----', this._initPathFinding, this._initMapLoaded, this._initChangeMapAnim);
        this.checkMapState();
    }

    private checkMapLoaded() {
        this._initMapLoaded = true;
        // console.log('checkMapLoaded----', this._initPathFinding, this._initMapLoaded, this._initChangeMapAnim);
        this.checkMapState();
    }

    private checkChangeMapAnim() {
        this._initChangeMapAnim = true;
        // console.log('checkChangeMapAnim----', this._initPathFinding, this._initMapLoaded, this._initChangeMapAnim);
        this.checkMapState();
    }

    /** 地图是否已完成初始化 */
    private checkMapState() {
        if (this._initPathFinding && this._initMapLoaded && this._initChangeMapAnim) {
            this._mapState = MapState.TransEnd;
            this._role.active = true;
            EventClient.I.emit(E.Map.ChangeMapEnd, this._mapId);
            // console.log('----地图是否已完成初始化 checkMapState----抛出E.Map.Change------->', this._mapId);
            this.next();
        }
    }

    private _roleOldLv: number = 0;
    private showLvUp(): void {
        const cur = RoleMgr.I.d.Level;
        if (this._roleOldLv <= 0 || this._roleOldLv >= cur) {
            this._roleOldLv = cur;
            return;
        }
        this._roleOldLv = cur;
        // 角色身上的升级特效
        const n = this._role.getChildByName('lvUp');
        if (!n) {
            EffectMgr.I.showAnim(RES_ENUM.Com_Ui_104, (node: cc.Node) => {
                if (this._role && this._role.isValid) {
                    const eff = this._role.getChildByName('lvUp');
                    if (eff) {
                        eff.destroy();
                    }
                    this._role.addChild(node);
                    node.setScale(1.2, 1.2, 1.2);
                    node.name = 'lvUp';
                }
            }, cc.WrapMode.Normal);
        }
    }
    /** 人物形象变化 */
    private onUpdateRole(o: RoleMD) {
        // console.log('人物形象变化', o);
        if (!this._role) return;
        // 套装发生变化
        if (o && !UtilBool.isNullOrUndefined(o.GradeSuitId)) {
            const roleSkin: IEntitySkin = EntityCfg.I.getSuitRes(o.GradeSuitId, RoleMgr.I.d.Sex);
            let roleResId = roleSkin.bodyResID;
            if (!roleResId) roleResId = EntityCfg.I.getRoleInitSkinId(!!o.GradeHorse, o.PlayerSkin, RoleMgr.I.d.Sex);
            this._role.setBodyAnim(roleResId, ANIM_TYPE.ROLE);

            let horseResID = roleSkin.horseResID;
            if (!horseResID && roleResId !== 10001 && roleResId !== 10002) horseResID = 51002;
            this._role.setHorseAnim(horseResID);

            this._role.setWeaponAnim(roleSkin.weaponResID);
            this._role.setWingAnim(roleSkin.wingResID);
        } else {
            // 角色时装或性别发生变化
            if (o && (!UtilBool.isNullOrUndefined(o.PlayerSkin) || !UtilBool.isNullOrUndefined(o.Sex))) {
                let roleResId = EntityCfg.I.getSkinAnimID(o.PlayerSkin, RoleMgr.I.d.Sex);
                if (!roleResId) roleResId = EntityCfg.I.getRoleInitSkinId(!!RoleMgr.I.d.GradeHorse, RoleMgr.I.d.PlayerSkin, RoleMgr.I.d.Sex);
                this._role.setBodyAnim(roleResId, ANIM_TYPE.ROLE);
                // 人物时装变化后需要看下坐骑是否要，比如当前玩家是10001或10002，变为其他的，需要同步变更坐骑资源
                let resId: number = 0;
                if (roleResId !== 10001 && roleResId !== 10002) resId = 51002;
                if (RoleMgr.I.d.GradeHorse) {
                    resId = EntityCfg.I.getGradeAnimId(RoleMgr.I.d.GradeHorse);
                }
                this._role.setHorseAnim(resId);
            }
            // 坐骑发生变化
            if (o && !UtilBool.isNullOrUndefined(o.GradeHorse)) {
                const resId: number = EntityCfg.I.getGradeAnimId(o.GradeHorse);
                // 只有10001和10002不在坐骑上，其他都是在坐骑上的。
                // 如果当前玩家是10001或10002，上坐骑，需要同时也修改玩家时装为10003或10004
                // 或如果当前玩家是10003或10004，下坐骑，需要同时也修改玩家时装为10001或10002（没有下坐骑操作）
                const bodyRes = this._role.bodyRes();
                if (resId && (bodyRes === 10001 || bodyRes === 10002)) {
                    const bodyRes = EntityCfg.I.getRoleInitSkinId(true, RoleMgr.I.d.PlayerSkin, RoleMgr.I.d.Sex);
                    this._role.setBodyAnim(bodyRes, ANIM_TYPE.ROLE);
                }
                this._role.setHorseAnim(resId);
            }
            // 武器发生变化
            if (o && !UtilBool.isNullOrUndefined(o.GradeWeapon)) {
                const resId: number = EntityCfg.I.getWeaponAnimId(o.GradeWeapon, RoleMgr.I.d.Sex, RoleMgr.I.d.GradeHorse);
                this._role.setWeaponAnim(resId);
            }
            // 光翼发生变化
            if (o && !UtilBool.isNullOrUndefined(o.GradeWing)) {
                const resId: number = EntityCfg.I.getGradeAnimId(o.GradeWing);
                this._role.setWingAnim(resId);
            }
        }

        // 称号发生变化
        if (o && !UtilBool.isNullOrUndefined(o.Title)) {
            this._role.setTitleAnim(o.Title);
        }
        // 昵称变化
        if (o && !UtilBool.isNullOrUndefined(o.Nick)) {
            this._role.setName(RoleMgr.I.info.getAreaNick(NickShowType.OfficialArenaNick, true));
        }
        // 性别变化
        if (o && !UtilBool.isNullOrUndefined(o.OfficeLevel)) {
            this._role.setName(RoleMgr.I.info.getAreaNick(NickShowType.OfficialArenaNick, true));
        }
        // 官职等级变化
        if (o && !UtilBool.isNullOrUndefined(o.OfficeLevel)) {
            this._role.setName(RoleMgr.I.info.getAreaNick(NickShowType.OfficialArenaNick, true));
        }
    }

    /** 该协议只是带tag, 切换地图是否成功 */
    private s2cEnterMap(data: S2CEnterMap) {
        // console.log('------------------------------------s2cEnterMap----------------', data);
    }

    /** 该协议才是真正切换地图 */
    private s2cChangeMap(data: S2CNoticePlayerChangeMap): void {
        // console.log('------------------------------------s2cChangeMap----------------', data);
        if (!data || !data.MapId) {
            return;
        }
        if (this._mapId === data.MapId) {
            // console.log('当前地图和要切换的地图是一样的');
            if (data.Point && data.Point.X && data.Point.Y) {
                this.initPlayCell(data.Point.X, data.Point.Y);
            }
            return;
        }
        this.enterMap(data.MapId, data.Point?.X || 0, data.Point?.Y || 0);
    }

    /**
     * 进入地图
     * @param mapId 地图id
     * @param cellX 玩家出生格子x
     * @param cellY 玩家出生格子y
     */
    private _initCellX: number = 0;
    private _initCellY: number = 0;
    private enterMap(mapId: number, cellX: number = 0, cellY: number = 0) {
        console.log('enterMap------------------------', mapId, cellX, cellY);

        this._initCellX = cellX;
        this._initCellY = cellY;

        if (this._mapId === mapId) {
            // console.warn('已经切过地图了');
            if (cellX && cellY) {
                this.initPlayCell(cellX, cellY);
            }
            return;
        }
        this._mapId = mapId;
        this.initMapState();
        MapMgr.I.release();
        this.changeMapShowCouldAni();
        this._mapState = MapState.TransBegin;
        MapCfg.I.mapData = Config.Get(Config.Type.Cfg_Map).getValueByKey(this._mapId);
        MapMgr.I.maxNum = MapCfg.I.mapData.MaxNum;
        MapCfg.I.finishLoadMapData = false;
        ResMgr.I.loadRemote(`map/map_${MapCfg.I.mapData.ResId}`, AssetType.Json, (err, data: cc.JsonAsset) => {
            if (!err) {
                const json = data.json as MapSaveInfo;
                this._mapWidth = json.mapWidth;
                this._mapHeight = json.mapHeight;
                this._cellWidth = json.cellWidth;
                this._cellHeight = json.cellHeight;
                this._mapType = json.type;
                this._mapState = MapState.FinishLoadMapData;
                MapCfg.I.setMapInfo(mapId, this._mapWidth, this._mapHeight, this._cellWidth, this._cellHeight, cellX, cellY);
                this.initData(json);
            }
        });
    }

    private initData(mapInfo: MapSaveInfo): void {
        // console.log('加载地图数据后--------initData', mapInfo);
        if (this._role && this._role.isValid) {
            this._role.cleanRoad();
        }
        PathFindingAgent.I.init(mapInfo);
        this.roadPointLayer.initRoadPointInfo(PathFindingAgent.I.mapData);
        this.entityLayer.initMapUintInfo(mapInfo.mapItems);
        this.mapLayer.loadBgMap();
        this.mapLayer.setBgSize(mapInfo.mapWidth, mapInfo.mapHeight);

        this.node.width = this._mapWidth;
        this.node.height = this._mapHeight;

        if (MapCfg.I.isYeWai) {
            const cell = MapCfg.I.getCurCell();
            this.initPlayCell(cell.x, cell.y);
        } else {
            this.initPlayCell(this._initCellX, this._initCellY);
        }

        this._playMusic();

        // console.log('----initData----抛出E.Map.Change------->', this._mapId);
        EventClient.I.emit(E.Map.ChangeMapStart, this._mapId);
    }

    private _onFightEndMusic() {
        this._playMusic();
    }

    private _playMusic() {
        // console.log('外面场景播放音乐>>>>');
        const arr = UtilString.SplitToArray(MapCfg.I.mapData.BgMusic);
        const musicIds: string[] = arr[0];// MapCfg.I.mapData.BgMusic.split('|')[1].split(':');
        const idx = Math.floor(Math.random() * musicIds.length);
        const audioName = `${musicIds[idx]}`;

        const path: string = AudioPath.bgMusicBase + audioName;
        AudioMgr.I.playMusic(path, { isRemote: true, loop: true });
    }

    public sendEnterMap(mapId: number) {
        // console.log('请求进入地图', mapId);
        const d = new C2SEnterMap();
        d.MapId = mapId;
        NetMgr.I.sendMessage(ProtoId.C2SEnterMap_ID, d);
    }

    private dealWinBigClose(isWinBigAllClose: boolean) {
        if (GameApp.I.IsBattleIng) {
            return;
        }
        this.hideMapLayer(isWinBigAllClose);
    }

    /** 隐藏地图 */
    private hideMapLayer(isShow: boolean) {
        if (this._role) {
            this._role.isWinBigAllClose = isShow;
        }

        this.node.active = isShow;
    }

    /** 战斗开始 */
    private onBattenStart() {
        this.hideMapLayer(false);
    }

    /** 战斗结束 */
    private onBattleEnd() {
        this.hideMapLayer(true);
    }

    private next() {
        // 测试按照路点循环走
        // console.log('next--------');
        this.nextCell();
        // 暂在这里addMonser
        if (MapCfg.I.mapData && MapCfg.I.isYeWai) {
            EventClient.I.emit(E.Map.AddVMMonsterToMap);
        }
    }

    private nextCell(): void {
        if (!MapCfg.I.isYeWai) {
            return;
        }
        const endPos = MapCfg.I.nextCell();
        const x = endPos.x * MapCfg.I.cellWidth;
        const y = endPos.y * MapCfg.I.cellHeight;
        if (this._isLookSeekRoad) {
            this.testSeekRoad(x, y);
        } else {
            this.movePlayer(x, y);
        }

        // console.log('nextCell========================', MapCfg.I.roadIndex, endPos.x, endPos.y);
    }

    private onMapMouseDown(event: cc.Event.EventMouse): void {
        // 野外地图不需点击寻路
        if (MapCfg.I.isYeWai) {
            return;
        }
        const pos: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());

        // console.log('onMapMouseDown-----------', pos.x, pos.y);
        if (this._isLookSeekRoad) {
            this.testSeekRoad(pos.x, pos.y);
        } else {
            this.movePlayer(pos.x, pos.y, () => {
                //
            }, false);
        }
        EventClient.I.emit(E.Map.ClickMap, this._mapId, pos);
    }

    /**
    * 测试寻路过程
    * @param targetX
    * @param targetY
    *
    */
    private testSeekRoad(targetX: number, targetY: number) {
        this._role.stop();
        // 添加耗时测试
        // console.time('++testSeekRoad');

        const pos = this._role.position;
        PathFindingAgent.I.testSeekRoad(pos.x, pos.y, targetX, targetY, this.testSeekRoadCallback, this, 10);

        // console.timeEnd('++testSeekRoad');
    }
    /**
    * 测试寻路过程回调
    * @param startNode 寻路开始节点
    * @param targetNode 寻路目标节点
    * @param currentNode 寻路当前寻到的节点
    * @param openlist   寻路开启列表
    * @param closelist  寻路关闭列表
    * @param roadArr 寻路找到目标后的路径，没找到之前为null
    *
    */
    private testSeekRoadCallback(startNode: RoadNode, targetNode: RoadNode, currentNode: RoadNode, openlist: Array<RoadNode>, closelist: Array<RoadNode>, roadArr: Array<RoadNode>): void {
        this._testSeekPathGraphic.clear();

        let node: RoadNode;
        let i: number;

        if (roadArr) {
            this._testSeekPathGraphic.lineWidth = 4;
            this._testSeekPathGraphic.strokeColor.fromHEX('#2b2b2b');
            this._testSeekPathGraphic.fillColor.fromHEX('#ffcc00');

            for (i = 0; i < roadArr.length; i++) {
                node = roadArr[i];

                this._testSeekPathGraphic.circle(node.px, node.py, 10);
            }

            this._testSeekPathGraphic.fill();

            this._testSeekPathGraphic.unscheduleAllCallbacks();
            i = 0;
            this._testSeekPathGraphic.schedule(() => {
                this._testSeekPathGraphic.moveTo(roadArr[i].px, roadArr[i].py);
                this._testSeekPathGraphic.lineTo(roadArr[i + 1].px, roadArr[i + 1].py);
                this._testSeekPathGraphic.stroke();
                i++;
            }, 0.1, roadArr.length - 2, 0);

            this._role.walkByRoad(roadArr);
        } else {
            this._testSeekPathGraphic.fillColor.fromHEX('#d4d4d4');
            for (i = 0; i < openlist.length; i++) {
                node = openlist[i];
                this._testSeekPathGraphic.circle(node.px, node.py, 10);
            }

            this._testSeekPathGraphic.fill();

            this._testSeekPathGraphic.fillColor.fromHEX('#ffcc00');
            for (i = 0; i < closelist.length; i++) {
                node = closelist[i];
                this._testSeekPathGraphic.circle(node.px, node.py, 10);
            }

            this._testSeekPathGraphic.fill();
        }
    }

    /**
    * 移动玩家
    * @param targetX 移动到的目标点x
    * @param targetY 移到到的目标点y
    *
    */
    public movePlayer(targetX: number, targetY: number, moveEndCallback?: () => void, isCheckDistance: boolean = true): void {
        if (!this._role || !this._role) {
            return;
        }

        const startPos = cc.v2(this._role.position.x, this._role.position.y);
        const targetPos = cc.v2(targetX, targetY);
        MapCfg.I.startPos = startPos;
        MapCfg.I.targetPos = targetPos;

        // console.log('movePlayer:', startPos.x, startPos.y, '终点：', targetPos.x, targetPos.y);

        // if (!MapCfg.I.isYeWai) {
        MapCfg.I.createMapRoad(startPos, targetPos, (roadNodeArr: RoadNode[]) => {
            if (roadNodeArr.length > 0) {
                this._role.walkByRoad(roadNodeArr, moveEndCallback, isCheckDistance);
            }
        }, this);
        // } else {
        //     MapCfg.I.getMapRoad(startPos, targetPos, MapCfg.I.roadIndex, (roadNodeArr: RoadNode[]) => {
        //         if (roadNodeArr.length > 0) {
        //             this._role.walkByRoad(roadNodeArr);
        //         }
        //     }, this);
        // }
    }

    /** 停止 */
    // public stop(): void {
    //     if (this._role) {
    //         this._role.stop();
    //     }
    // }

    /** 玩家出生在哪个格子 */
    public initPlayCell(cellX: number, cellY: number): void {
        if (MapCfg.I.isOutMap(cellX, cellY)) {
            console.warn('initPlayCell的位置超过地图范围了', cellX, cellY);
            return;
        }
        const cellW: number = this._cellWidth;
        const cellH: number = this._cellHeight;
        const x: number = cellW * cellX + cellW / 2;
        const y: number = cellH * cellY + cellH / 2;
        this._role.stop();

        if (Math.abs(this._role.x - x) > 64 || Math.abs(this._role.y - y) > 64) {
            this._role.setPosition(x, y);
        }

        this.mapLayer.initCell(cellX, cellY);
        EventClient.I.emit(E.Map.ResetPos);

        // console.log(this._role.x, this._role.y, 'initPlayCell---------', x, y, cellX, cellY);
    }

    /**
     * 视图跟随玩家
     * @param dt
     */
    private followPlayer(dt: number): void {
        const size = cc.view.getVisibleSize();

        let x = -(this._role.position.x - size.width / 2);
        let y = -(this._role.position.y - size.height / 2);

        const outWidth: number = this.node.width - size.width;
        const outHeight: number = this.node.height - size.height;

        if (outWidth <= 0) {
            x = 0;
        } else if (x > 0) {
            x = 0;
        } else if (x < -outWidth) {
            x = -outWidth;
        }

        if (outHeight <= 0) {
            y = 0;
        } else if (y > 0) {
            y = 0;
        } else if (y < -outHeight) {
            y = -outHeight;
        }

        const sta = cc.v3(x - size.width / 2 - this.node.parent.x, y - size.height / 2 - this.node.parent.y);
        const end = this.node.position;

        const mag = sta.sub(end).mag();

        /** 移动镜头 */
        if (mag > 1 && mag <= 200) {
            this.node.x = cc.misc.lerp(end.x, sta.x, 1.5 * dt);
            this.node.y = cc.misc.lerp(end.y, sta.y, 1.5 * dt);
        } else {
            this.node.position = sta;
        }

        // this.node.setPosition(x - size.width / 2 - this.node.parent.x, y - size.height / 2 - this.node.parent.y);
        if (this.isFinishLoadMapData) {
            this.mapLayer.uptMapPos(this._role.position.x, this._role.position.y);
        }
    }

    public getMapPos(): cc.Vec2 {
        return this.node.getPosition();
    }

    /** 游戏主循环 */
    public mainUpdate(dt: number) {
        if (!this._initEnd) return;
        if (this.node.active) {
            if (this._role) this._role.mainUpdate(dt);
            this.entityLayer.mainUpdate(dt);
            this.setEntitySiblingIndex();
            this.followPlayer(dt);
        }
        MapMgr.I.mainUpdate(dt);
    }

    /**
     * 地图上的所有对象的位置重排
     */
    public setEntitySiblingIndex() {
        this.entityLayer.node.children.sort((a, b) => b.position.y - a.position.y);
        for (let i = 0; i < this.entityLayer.node.children.length; i++) {
            this.entityLayer.node.children[i].zIndex = 10;
            this.entityLayer.node.children[i].setSiblingIndex(i);
        }
    }

    /** 切换地图显示云 */
    private scheduleCallback: Function = null;
    public changeMapShowCouldAni() {
        // 不在播放结束才执行回调，太晚了
        if (this.scheduleCallback) {
            this.unschedule(this.scheduleCallback);
            this.scheduleCallback = null;
        }
        this.scheduleCallback = this.checkChangeMapAnim.bind(this);
        this.scheduleOnce(this.scheduleCallback, 1.1);

        ResMgr.I.showPrefabAsync('animPrefab/ui/ty_changjingqiehuan/anim/ty_changjingqiehuan').then((_node) => {
            LayerMgr.I.addToLayer(GameLayerEnum.MAIN_CITY_LAYER, _node);
            const anim = _node.getComponent(cc.Animation);
            anim.play();

            anim.once(cc.Animation.EventType.FINISHED, () => {
                console.log('_node=', _node);
                _node.destroy();
            }, _node);
        }).catch((err) => {
            console.log(err);
        });
    }
}
