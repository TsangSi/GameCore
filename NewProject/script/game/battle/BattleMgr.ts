/* eslint-disable consistent-return */
/*
 * @Author: hrd
 * @Date: 2022-06-21 14:35:08
 * @FilePath: \SanGuo2.4-main\assets\script\game\battle\BattleMgr.ts
 * @Description:
 *
 */

import { EventClient } from '../../app/base/event/EventClient';
import { UtilString } from '../../app/base/utils/UtilString';
import { GameLayerEnum } from '../../app/core/mvc/WinConst';
import WinMgr from '../../app/core/mvc/WinMgr';
import { ResMgr } from '../../app/core/res/ResMgr';
import AnimCfg, { ACTION_DIRECT, ANIM_TYPE, ACTION_TYPE } from '../base/anim/AnimCfg';
import { Config } from '../base/config/Config';
import { ConfigConst } from '../base/config/ConfigConst';
import GameApp from '../base/GameApp';
import { LayerMgr } from '../base/main/LayerMgr';
import { NickShowType } from '../base/utils/UtilGame';
import { E } from '../const/EventName';
import { UI_PATH_ENUM } from '../const/UIPath';
import EntityBattle from '../entity/EntityBattle';
import EntityCfg from '../entity/EntityCfg';
import { EntityUnitType, IEntitySkin, MonsterType } from '../entity/EntityConst';
import ControllerMgr from '../manager/ControllerMgr';
import PerformanceMgr from '../manager/PerformanceMgr';
import { EBattleType } from '../module/battleResult/BattleResultConst';
import { RoleInfo } from '../module/role/RoleInfo';
import { RoleMgr } from '../module/role/RoleMgr';
import { BattleCommon } from './BattleCommon';
import BattleController from './BattleController';
import { BattleTurnDataParse } from './BattleTurnDataParse';
import { SkillEffect } from './effect/SkillEffect';
import { WordEffect } from './effect/WordEffect';
import { UtilBattle } from './util/UtilBattle';
import { BattlePanel } from './view/BattlePanel';
import { SceneWar } from './war/SceneWar';
import { WarBase } from './war/WarBase';
import { ReportType, WarStartType } from './WarConst';

export class BattleMgr {
    /**
     * 所有模型的位置，读表取得
     */
    private mCurWar: WarBase = null; // 当前战斗
    private mWar: WarBase = null;
    /** 战斗报文 */
    private _fightRepotData: S2CBattlefieldReport = null;
    /** 战报列表 */
    private _nextFightRepotDataList: S2CBattlefieldReport[] = [];
    /** 当前战斗副本类型 */
    private _curBattleType: number = null;
    /** 缓存战斗报文 */
    private _debugfightRepot: string = null;
    /** 最大回合数 */
    public MaxTurn: number = 0;
    /** 战斗场景ui面板 */
    public _BattlePanel: BattlePanel = null;
    /** 是否连续战斗 */
    public isContinueWar: boolean = false;

    private mBattleController: BattleController = null;
    private _BattlePanelPrefab: cc.Prefab = null;

    private static Instance: BattleMgr = null;
    public static get I(): BattleMgr {
        if (this.Instance == null) {
            this.Instance = new BattleMgr();
            this.Instance._init();
        }
        return this.Instance;
    }

    /** 获取战斗场景层 */
    public get BattleSceneLayer(): cc.Node {
        return this._BattlePanel.getSceneLayer();
    }
    /** 获取战斗角色层 */
    public get EntityLayer(): cc.Node {
        return this._BattlePanel.getEntityLayer();
    }
    /** 技能业务层 角色下层 */
    public get SkillLayer1(): cc.Node {
        return this._BattlePanel.getSkillLayer1();
    }
    /** 技能业务层 角色上层 */
    public get SkillLayer2(): cc.Node {
        return this._BattlePanel.getSkillLayer2();
    }
    /** 战斗扣血飘字层 */
    public get BloodLayer(): cc.Node {
        return this._BattlePanel.getBloodLayer();
    }

    public get UILayer(): cc.Node {
        return this._BattlePanel.getUILayer();
    }

    public get curBattleType(): number {
        return this._curBattleType;
    }

    public set curBattleType(v: number) {
        this._curBattleType = v;
    }
    /** 缓存战斗报文 */
    public cacheNextFightData(data: S2CBattlefieldReport): void {
        // 只缓存连续战报类型
        const type: number = Config.Get(ConfigConst.Cfg_FightScene).getValueByKey(data.T, 'ReportType');
        if (type === ReportType.Continue) {
            this._nextFightRepotDataList.push(data);
        }
    }
    /** 清除战报缓存 */
    public clearNextFightData(): void {
        this._nextFightRepotDataList = [];
    }

    /** 获取缓存战报数量 */
    public getNextFightDataCount(): number {
        return this._nextFightRepotDataList.length;
    }

    /** 显示战斗场景 */
    public static ShowBattleScene(data: S2CBattlefieldReport): void {
        if (GameApp.I.IsBattleIng === true) {
            BattleMgr.I.cacheNextFightData(data);
            return;
        }
        BattleMgr.I.curBattleType = data.T;
        BattleMgr.I.MaxTurn = data.M;
        GameApp.I.IsBattleIng = true;
        if (!BattleMgr.I._BattlePanelPrefab) {
            ResMgr.I.loadAsync(UI_PATH_ENUM.BattlePanel, cc.Prefab).then((pre: cc.Prefab) => {
                BattleMgr.I._BattlePanelPrefab = pre;
                pre.addRef();
                const node = cc.instantiate(BattleMgr.I._BattlePanelPrefab);
                LayerMgr.I.addToLayer(GameLayerEnum.BATTLE_LAYER, node);
                BattleCommon.I.showBattleCom(data, node);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            const node = cc.instantiate(BattleMgr.I._BattlePanelPrefab);
            LayerMgr.I.addToLayer(GameLayerEnum.BATTLE_LAYER, node);
            BattleCommon.I.showBattleCom(data, node);
        }
    }

    private _init() {
        // this.mFightPos = UtilBattle.FightPosInfo;
        this.mBattleController = ControllerMgr.I.BattleController;
        EventClient.I.on(E.Battle.InitEnd, this.battleSceneInitEnd, this);
    }

    /** 战斗场景初始化完成 */
    private battleSceneInitEnd(data: S2CBattlefieldReport): void {
        BattleMgr.I.startWar(data);
        WinMgr.I.closeAll(true);
        BattleMgr.I.mBattleController.reqC2SNoticeFightStateReq(1);
    }

    /** 获取战报 */
    public getBattleReport(): S2CBattlefieldReport {
        return this._fightRepotData;
    }

    private mLastTime: number = 0;
    /** 主循环 */
    public updateTime(timeStamp: number): boolean {
        const delta = timeStamp - this.mLastTime;
        // this.mLastTime = timeStamp;
        if (this.mWar) { // 有新战斗
            if (this.mCurWar) { // 退出当前战斗
                this.mCurWar.mIsExit = true;
                this.mCurWar.onExit();
            }
            this.mCurWar = this.mWar;// 进行新战斗
            this.mWar = null;
            this.mCurWar.mIsExit = false;
            this.mCurWar.onEnter();
        }
        const dt = Math.min(delta, 30);
        if (this.mCurWar) {
            this.mCurWar.doUpdate(dt);
        }
        return false;
    }

    public getCurWar(): WarBase {
        return this.mCurWar;
    }

    /** 开始战斗 */
    public startWar(data: S2CBattlefieldReport): void {
        if (this.mCurWar) {
            this.mCurWar.mIsExit = true;
            this.mCurWar.onExit();
            this.mCurWar = this.mWar = null;
        }
        this._ballteLog = '';
        this._fightRepotData = data;
        try {
            this._debugfightRepot = JSON.stringify(this._fightRepotData);
        } catch (error) {
            // 保存战报报错
        }
        BattleMgr.I.curBattleType = data.T;
        BattleMgr.I.MaxTurn = data.M;
        const war = new SceneWar();
        war.init(data);
        const turnData = BattleTurnDataParse.ParseFightData(data);
        war.setTurnAll(turnData);
        this.mWar = war;
        this.upWarBatch();
        EventClient.I.emit(E.Battle.TurnNumChange, 1);
        EventClient.I.emit(E.Battle.Start, data.T);
        PerformanceMgr.I.startCollect(-1, true);
    }

    /** 开始当前战斗 */
    public enterCurWar(): void {
        if (this.mCurWar) {
            this.mCurWar.onEnter();
        }
    }
    /** 开始下一场战斗 */
    public enterNextWar(): void {
        if (!this._nextFightRepotDataList.length) {
            this.isContinueWar = false;
            return;
        }
        const data = this._nextFightRepotDataList.shift();
        this.clearWar();
        this.startWar(data);
        this.isContinueWar = true;
    }

    /** 结束当前战斗 */
    public exitCurWar(): void {
        this.enterNextWar();
        if (this.isContinueWar) {
            // 连续战胜状态不移除场景
            return;
        }
        const battleType = this.curBattleType;
        if (this.mCurWar) {
            this.mCurWar.onExit();
            this._BattlePanel.node.destroy();
            this._BattlePanel = null;
            this.mCurWar = this.mWar = null;
            this.doClearData();
        }
        GameApp.I.IsBattleIng = false;
        EventClient.I.emit(E.Battle.End, battleType);
        this.curBattleType = null;
        WinMgr.I.resetStashViews();
        PerformanceMgr.I.endCollect(-1, true);
        BattleMgr.I.mBattleController.reqC2SNoticeFightStateReq(0);
    }

    /** 清理战场 */
    public clearWar(): void {
        this.doClearData();
        if (this._BattlePanel) {
            this._BattlePanel.doClearAll();
        }
    }

    /** 跳过当前战斗 */
    public skipCurWar(): void {
        if (this.mCurWar) {
            this.clearNextFightData();
            this.mCurWar.skipCurWar();
        }
    }

    /** 获取战斗速度 */
    public getWarSpeed(): number {
        if (this.mCurWar) {
            return this.mCurWar.getSpeed();
        }
        return 1;
    }

    /** 设置战斗速度 */
    public setWarSpeed(v: number): void {
        if (this.mCurWar) {
            this.mCurWar.setSpeed(v);
        }
    }

    /** 获取真实回合数 */
    public getRealTurnNum(): number {
        if (!this._fightRepotData) {
            return 0;
        }
        if (!this._fightRepotData.FS) {
            return 0;
        }
        let R = 0;
        this._fightRepotData.FS.forEach((element) => {
            R = element.R;
        });
        return R;
    }

    public doClearData(): void {
        this._fightRepotData = null;
        WordEffect.I.clearAll();
        SkillEffect.I.clearAll();
    }

    public createEntity(unit: FightUnit, fbType: number): EntityBattle {
        if (!unit) {
            return null;
        }
        const userId = RoleMgr.I.d.UserId;
        // 获取真实站位
        const pos = UtilBattle.I.getRealPos(unit.P);
        let direct: number = ACTION_DIRECT.LEFT_UP;
        if (UtilBattle.I.isUpCamp(pos)) {
            direct = ACTION_DIRECT.RIGHT_DOWN;
        }
        // 角色类型 1主角 2武将 ..
        const type = unit.T;

        let _entity: EntityBattle = null;
        switch (type) {
            case EntityUnitType.Player:
                _entity = this.createPlayer(unit, pos, direct);
                break;
            case EntityUnitType.General:
                _entity = this.createPet(unit, pos, direct);
                break;
            case EntityUnitType.Monster:
                _entity = this.createMonster(unit, pos, direct, fbType);
                // const scale = ModelMgr.I.BattleModel.getMonsterScaleVal(fbType, _entity.monsterType);
                break;
            case EntityUnitType.Beauty:
                _entity = this.createBeauty(unit, pos, direct);
                break;
            default:
                _entity = this.createPet(unit, pos, direct);
                console.log('=====createEntity==not type=====', type);
                break;
        }
        if (_entity) {
            _entity.initAi();
            _entity.unitType = type;
            // _entity.scale = 0.95;
            if (_entity.roleInfo.d.UserId === userId) {
                _entity.isSelfCamp = true;
            }
        }
        return _entity;
    }

    public getEntityList(): { [pos: number]: EntityBattle; } {
        if (!this.mCurWar) return null;
        return this.mCurWar.mEntityList;
    }

    private getGeneralResId(skinId: number, generalId: number): number {
        return skinId ? EntityCfg.I.getGeneralSkinResId(skinId) : EntityCfg.I.getGeneralResId(generalId);
    }

    /** 创建玩家 */
    private createPlayer(unit: FightUnit, realPos: number, direct: number): EntityBattle {
        const resType: ANIM_TYPE = ANIM_TYPE.ROLE;
        const _roleInfo = new RoleInfo(unit);
        const actType: ACTION_TYPE = ACTION_TYPE.STAND;
        const roleSkin: IEntitySkin = EntityCfg.I.getRoleSkinResID(_roleInfo);
        const player = new EntityBattle(roleSkin.bodyResID, resType, direct, actType, cc.WrapMode.Loop, true);
        player.initAnimData(roleSkin);
        player.roleInfo = _roleInfo;
        player.showBloodBox(true);
        player.FightUnit = unit;
        player.hp = _roleInfo.d.FCurrHp;
        player.setName(_roleInfo.getAreaNick(NickShowType.OfficialArenaNick, true));
        player.name = `player_${realPos}`;
        return player;
    }

    /** 创建武将 */
    private createPet(unit: FightUnit, realPos: number, direct: number): EntityBattle {
        const resType: ANIM_TYPE = ANIM_TYPE.PET;
        const _roleInfo = new RoleInfo(unit);
        const actType: ACTION_TYPE = ACTION_TYPE.STAND;
        const skinId = this.getGeneralResId(_roleInfo.d.FGeneralSkin, _roleInfo.d.FGeneralId);
        const player = new EntityBattle(skinId, resType, direct, actType, cc.WrapMode.Loop, true);
        player.roleInfo = _roleInfo;
        player.showBloodBox(true);
        player.FightUnit = unit;
        player.hp = _roleInfo.d.FCurrHp;
        player.setName(_roleInfo.d.Nick);
        player.name = `pet_${realPos}`;
        return player;
    }

    /** 创建怪物 */
    private createMonster(unit: FightUnit, realPos: number, direct: number, fbType: number): EntityBattle {
        const resType: ANIM_TYPE = ANIM_TYPE.PET;
        const _roleInfo = new RoleInfo(unit);
        const actType: ACTION_TYPE = ACTION_TYPE.STAND;
        const skinId = EntityCfg.I.getMonsterSkinResId(_roleInfo.d.FMonsterId);
        const monsterType = EntityCfg.I.getMonsterType(_roleInfo.d.FMonsterId);
        const player = new EntityBattle(skinId, resType, direct, actType, cc.WrapMode.Loop, true);
        player.roleInfo = _roleInfo;
        player.monsterType = monsterType;
        player.showBloodBox(true);
        player.FightUnit = unit;
        player.hp = _roleInfo.d.FCurrHp;
        player.setName(_roleInfo.d.Nick);
        player.name = `monster_${realPos}`;
        if (monsterType === MonsterType.Boss) {
            if (this.mCurWar) {
                this.mCurWar.currentBOSS = unit;
            }
            EventClient.I.emit(E.Battle.NoticeBossShieldVal, _roleInfo.d.FBossShield);
        }
        const scale = UtilBattle.I.getMonsterScaleVal(fbType, monsterType);
        player.setEntityScale(scale, true);
        return player;
    }

    /** 创建红颜 */
    private createBeauty(unit: FightUnit, realPos: number, direct: number): EntityBattle {
        const resType: ANIM_TYPE = ANIM_TYPE.PET;
        const _roleInfo = new RoleInfo(unit);
        const actType: ACTION_TYPE = ACTION_TYPE.STAND;
        const skinId = EntityCfg.I.getBeautySkinResId(_roleInfo.d.FBeautyId);
        const player = new EntityBattle(skinId, resType, direct, actType, cc.WrapMode.Loop, true);
        player.roleInfo = _roleInfo;
        player.showBloodBox(true);
        player.FightUnit = unit;
        player.hp = _roleInfo.d.FCurrHp;
        player.setName(_roleInfo.d.Nick);
        player.name = `beauty_${realPos}`;
        return player;
    }

    private isShaked: boolean = false;
    /** 屏幕抖动 */
    public doSceneShake(): void {
        if (this.isShaked === true) {
            return;
        }
        this.isShaked = true;
        const target = BattleMgr.I.BattleSceneLayer;
        SkillEffect.I.sceneShake(target);
        let timer = setTimeout(() => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            this.isShaked = false;
        }, 0.11);
    }

    private _ballteLog: string = '';
    public log(str: string, isShow: boolean = false): void {
        str = `# ${str}`;
        this._ballteLog = `${this._ballteLog}/n${str}`;
        if (isShow) {
            console.log(str);
        }
    }

    /** 获取开场动画信息 */
    public getWarStarInfo(type: WarStartType): SEffect {
        const SEList: SEffect[] = this._fightRepotData.SE;
        let data: SEffect = null;
        for (let i = 0; i < SEList.length; i++) {
            const element = SEList[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (element.K === type) {
                data = element;
                break;
            }
        }
        return data;
    }

    /** 根据站位获取战斗单位数据 */
    public getFightUnitByPos(pos: number): FightUnit {
        const count = this._fightRepotData.U.length;
        for (let i = 0; i < count; i++) {
            const u = this._fightRepotData.U[i];
            if (pos === u.P) {
                return u;
            }
        }
        return null;
    }

    /** 是否显示虎符威慑 */
    public isShowAmuletAct(): boolean {
        const info = this.getWarStarInfo(WarStartType.amulet);
        if (!info) return false;
        const paramStr = info.V;
        const paramArr = UtilString.SplitToArray(paramStr);
        const stage1 = +paramArr[0][1]; // 虎符阶段
        const lv1 = +paramArr[0][2]; // 虎符等级
        const stage2 = +paramArr[1][1];// 虎符阶段
        const lv2 = +paramArr[1][2]; // 虎符等级
        if (!(stage1 && lv1)) return false;
        if (!(stage2 && lv2)) return false;

        return true;
    }

    /**
     * 解析战斗扩展参数根据副本类型 PARAM
     * @param fbType
     * @param param
     * @returns
     */
    public parseBattleReportParam(fbType: number, param: string): any {
        if (!param) return null;
        if (fbType === EBattleType.TeamFB_PVE) {
            return +param;
        }
        return param;
    }

    /** 更新战斗波数信息 */
    private upWarBatch(): void {
        const fbType = this._fightRepotData.T;
        const param = this._fightRepotData.PARAM;
        switch (fbType) {
            case EBattleType.TeamFB_PVE:
                // eslint-disable-next-line no-case-declarations
                const num: number = this.parseBattleReportParam(fbType, param) || 0;
                EventClient.I.emit(E.Battle.BacthNumChange, num);
                break;
            default:
                break;
        }
    }

    /** 获取角色动作时长 */
    public getEntityAtkDelay(entity: EntityBattle, atkName: string): number {
        let n = 1; // 默认有一帧
        if (cc.isValid(entity)) {
            n = entity.getActionLength(atkName);
        }
        // 1000 / 帧率 计算每帧时长
        const t = (1000 / AnimCfg.I.ACTION_FRAMERATE_OTHER) * n;
        return t;
    }
}
