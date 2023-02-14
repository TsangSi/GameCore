/*
 * @Author: zs
 * @Date: 2023-02-14 18:01:15
 * @Description:
 *
 */
/* eslint-disable max-len */
import { AnimationClip, error, js, Node, tween, v2, v3, Vec2, Vec3 } from 'cc';
import ActionBase from '../../../scripts/action/ActionBase';
import ActionConfig, { ACTION_DIRECT, ACTION_RES_TYPE, ACTION_TYPE } from '../../../scripts/action/ActionConfig';
import { Config } from '../../../scripts/config/Config';
import FightSceneIndexer from '../../../scripts/config/indexer/FightSceneIndexer';
import { BATTLE_TYPE, CLIENT_SHOW_TYPE, TURN_ATK_TYPE, UNIT_TYPE } from '../../../scripts/global/GConst';
import Utils from '../../../scripts/utils/Utils';
import { Battle } from './Battle';
import UtilsCC from '../../../scripts/utils/UtilsCC';
import EntityManager from '../../../scripts/map/EntityManager';
import UIManager from '../../../scripts/ui/UIManager';
import { UI_NAME } from '../../../scripts/ui/UIConfig';
import { FightEntity } from '../../../scripts/action/FightEntity';
import { EventM } from '../../../scripts/core/event/EventManager';

interface MonsterAnimIdInfo {
    AnimId: number;
    UnitType: number;
    Hight: number;
}

export class BattleManager {
    private static _I: BattleManager = null;
    static get I(): BattleManager {
        if (this._I == null) {
            this._I = new BattleManager();
            this._I.init();
        }
        return this._I;
    }

    private _fightPrizeItems: S2CPrizeReport;
    public get fightPrizeItems() {
        return this._fightPrizeItems;
    }
    public set fightPrizeItems(v: S2CPrizeReport) {
        this._fightPrizeItems = v;
    }

    /** 战斗数据 */
    protected fightData: S2CBattlefieldReport = undefined;
    /** 回合数据 */
    protected roundDatas: number[][] = [];
    /** 最大回合数 */
    private maxRound = 0;
    /** 当前步骤索引 */
    // protected cur_index = -1;
    public readonly secondB = 100;

    /* 开始播放战报前的时间 */
    public readonly attackTargetTime = 2000;
    /* 一轮BUFF播放完，下一间隔时间 */
    public readonly buffInvterTime = 300;
    /* 近战移动到目标时间 */
    public readonly attackMoveToTime = 75;
    /* 近战在对方跟前停留时间 */
    public readonly attackStayTime = 1000;
    /* 近战打完后返回时间 */
    public readonly attackOverMoveBackTime = 100;
    /* 攻击一轮后的间隔 */
    public readonly attackOverSleepTime = 160;
    /**
    * 多模型站一个位置，被攻击时，攻击主移动跟前时的偏移
    */
    public readonly SCENE_MID: Vec3 = v3(-15, 31);
    /**
     * 除常规位置外，第二套位置起始值
     */
    /** 对方飞升id */
    protected fsHurtDefUp = 0;
    /** 我方飞升id */
    protected fsHurtDefDown = 0;
    // 我方境界人员数据
    protected myRealm: FightEntity;
    // 敌方境界人员数据
    protected emeyRealm: FightEntity[] = [];
    /** 是否有境界压制 */
    protected hasRealm = false;
    /** BOSS与玩家固定位置 */
    public readonly BOSS_POS = 18;
    /** 玩家位置 */
    public readonly ROLE_POS = 3;
    public readonly ENEMY_DRAGON_POS = 28;
    public readonly MY_DRAGON_POS = 23;
    protected AllFightEntity: { [pos: number]: FightEntity; } = js.createMap(true);
    /** 当前回合的索引 */
    private _curIndex = 0;
    get curIndex() {
        return this._curIndex;
    }
    set curIndex(i: number) {
        this._curIndex = i;
    }
    /** 当前回合数 */
    private _curRound = 1;
    get curRound() {
        return this._curRound;
    }
    set curRound(i: number) {
        this._curRound = i;
    }
    /** 总共步骤数量 */
    private _maxIndex = 0;
    get maxIndex() {
        return this._maxIndex;
    }
    private init() {
        EventM.I.on(EventM.Type.Battle.BattleReward, this.onBattleReward, this);
    }

    private onBattleReward(d: S2CPrizeReport) {
        this.fightPrizeItems = d;
    }

    /** 技能 */
    // private _SkillM: BattleSkill;
    // get SkillM () {
    //     if (!this._SkillM) {
    //         this._SkillM = new BattleSkill(this);
    //     }
    //     return this._SkillM;
    // }

    /** buff */
    // private _BuffM: BattleBuff;
    // get BuffM () {
    //     if (!this._BuffM) {
    //         this._BuffM = new BattleBuff(this);
    //     }
    //     return this._BuffM;
    // }

    /** 飘字 */
    // private _FlyWorldM: BattleFlyWorld;
    // get FlyWorldM () {
    //     if (!this._FlyWorldM) {
    //         this._FlyWorldM = new BattleFlyWorld();
    //     }
    //     return this._FlyWorldM;
    // }

    /** 吞噬相关 */
    // private _SwallowM: BattleSwallow;
    // get SwallowM () {
    //     if (!this._SwallowM) {
    //         this._SwallowM = new BattleSwallow(this);
    //     }
    //     return this._SwallowM;
    // }

    isHasPrizeItems() {
        if (this.fightPrizeItems && this.fightPrizeItems.Items && this.fightPrizeItems.Items.length > 0) {
            return true;
        }
        return false;
    }

    /** boss位置 */
    private currentBOSS = -1;
    private battle: Battle;
    initBattle(fightData: S2CBattlefieldReport, battle: Battle) {
        this.fightData = fightData;
        this.battle = battle;
        this.initEntity();
        this.initRoundData();
    }

    private initEntity() {
        this.hasRealm = false;
        this.emeyRealm.length = 0;
        this._maxIndex = this.fightData.S.length - 1;
        this.curIndex = 0;
        for (let i = 0, n = this.fightData.U.length; i < n; i++) {
            const unit = this.fightData.U[i];
            // console.log('敌方单位i', i, unit);
            const a = this.createEntity(unit);
            this.setEntityPos(a, unit.P);
            if (unit.P === this.BOSS_POS) {
                this.currentBOSS = i;
            }
            if (unit.FeiShengId) {
                if (this.isTeamUp(unit.P % this.secondB)) {
                    this.fsHurtDefUp = unit.FeiShengId;
                } else {
                    this.fsHurtDefDown = unit.FeiShengId;
                }
            }

            if (Utils.isNullOrUndefined(unit.T) || unit.T === UNIT_TYPE.Player) {
                if (this.isTeamUp(unit.P % this.secondB)) {
                    this.emeyRealm.push(a);
                } else if (unit.P === 3) {
                    this.myRealm = a;
                }
            }
            this.battle.addChild(a);
            a.layer = this.battle.node.layer;
            this.AllFightEntity[unit.P] = a;
        }
        this.hasRealm = this.getHasRealm();
    }

    private EntityInfoAll: { [realPos: number]: FightEntity[]; } = js.createMap(true);
    private EntityPosInfo: { [realPos: number]: Vec3[]; } = js.createMap(true);
    /** 设置站位 */
    private setEntityPos(entity: FightEntity, p: number) {
        const real_pos = this.getRealPos(p);
        const pos = this.playersPosition(real_pos);
        // console.log('p, real_pos, pos=', p, real_pos, pos);
        entity.updateAttri('x', pos.x);
        entity.updateAttri('y', pos.y);
        entity.name = `${entity.name}_${p}_${real_pos}`;
        if (this.EntityInfoAll[real_pos]) {
            // 此坑已有人站
            this.EntityInfoAll[real_pos][p] = entity;
            // 排列坑内位置
            const unitArray = this.EntityInfoAll[real_pos];
            // 两人间隔
            const len = 30;
            const orgin = pos;
            if (this.isTeamDown(real_pos)) {
                orgin.x += len;
                orgin.y += len;
            } else {
                orgin.x -= len;
                orgin.y -= len;
            }
            let count = 0;
            // for (const k in unitArray) {
            for (let k = 0; k < unitArray.length; k++) {
                if (unitArray[k]) {
                    if (this.isTeamDown(real_pos)) {
                        unitArray[k].setPosition(orgin.x - count * len, orgin.y - count * len);
                    } else {
                        unitArray[k].setPosition(orgin.x + count * len, orgin.y + count * len);
                    }

                    this.EntityPosInfo[real_pos][k] = v3(unitArray[k].position.x, unitArray[k].position.y);
                    count++;
                }
            }
            if (count > 2) {
                error(`战位${real_pos}中数量:${count}`);
            }
        } else {
            this.EntityInfoAll[real_pos] = [];
            this.EntityInfoAll[real_pos][p] = entity;
            this.EntityPosInfo[real_pos] = [];
            this.EntityPosInfo[real_pos][p] = v3(entity.position.x, entity.position.y);
        }
        entity.setSiblingIndex(pos.y);
    }

    // 统计站位信息 返回坐标
    public getEntityPosInfo(p1: number, p2: number) {
        const v = this.EntityPosInfo[p1][p2];
        return v3(v.x, v.y);
    }

    /** 初始化回合数据 */
    private initRoundData() {
        this.roundDatas.length = 0;
        this.roundDatas[0] = [];
        this.fightData.S.forEach((step: FightStep, index: number) => {
            this.roundDatas[step.R] = this.roundDatas[step.R] || [];
            this.roundDatas[step.R].push(index);
        });
        console.log('roundDatas=', this.roundDatas);
    }

    public addToBattle(n: Node) {
        n.layer = this.battle.node.layer;
        this.battle.node.addChild(n);
    }

    public getEntityByP(p: number) {
        let unit: FightEntity = this.AllFightEntity[p];
        if (!unit) {
            if (p === this.MY_DRAGON_POS) {
                unit = this.AllFightEntity[this.ENEMY_DRAGON_POS];
            } else if (p === this.ENEMY_DRAGON_POS) {
                unit = this.AllFightEntity[this.MY_DRAGON_POS];
            }
        }
        return unit;
    }

    /** 获取boss位置的unit */
    public getBossUnit() {
        if (!Utils.isNullOrUndefined(this.currentBOSS)) {
            return this.fightData.U[this.currentBOSS];
        }
        return undefined;
    }

    /** 获取位置的unit */
    public getUnitByP(p: number) {
        if (!Utils.isNullOrUndefined(p)) {
            return this.fightData.U[p];
        }
        return undefined;
    }

    /** 获取战斗类型 */
    getFightType() {
        if (this.fightData) {
            return this.fightData.T;
        }
        return 0;
    }

    /** 获取索引标记 */
    getFightIndex() {
        if (this.fightData) {
            return this.fightData.Idx;
        }
        return 0;
    }

    getHasRealm() {
        let has_realm = false;
        if (!Utils.isNullOrUndefined(this.myRealm)) {
            for (let i = this.emeyRealm.length - 1; i > 0; i--) {
                if (this.myRealm.Info.RealmLevel <= this.emeyRealm[i].Info.RealmLevel) {
                    this.emeyRealm.splice(i, 1);
                }
            }
        }
        has_realm = this.myRealm ? this.emeyRealm.length > 0 : false;
        if (has_realm) {
            switch (this.fightData.T) {
                case BATTLE_TYPE.JXSC_PVP:
                    has_realm = false;
                    break;
                case BATTLE_TYPE.SY_GUIDE:
                case BATTLE_TYPE.SY_PVE:
                case BATTLE_TYPE.SY_PVP:
                case BATTLE_TYPE.SY_ZYSS:
                case BATTLE_TYPE.SY_LM_Nomrall:
                case BATTLE_TYPE.SY_LM_Elite:
                    if (this.playersUnitDat(this.ENEMY_DRAGON_POS)) {
                        has_realm = false;
                    }
                    break;
                default:
                    break;
            }
        }
        return has_realm;
    }

    /**
     * 根据站位坐标获取初始化数据
     * @param pos 编号，自动换算新编号
     */
    public playersUnitDat(pos): FightUnit {
        const currReport = this.fightData;
        // if (currReport == null) {
        //     currReport = this.nextFightData;
        // }
        if (currReport == null) {
            return null;
        }

        for (let i = 0, n = currReport.U.length; i < n; i++) {
            if (currReport.U[i].P === pos) {
                return currReport.U[i];
            }
        }
        return undefined;
    }

    /** 创建实体 */
    public createEntity(entity: FightUnit) {
        if (Utils.isNullOrUndefined(entity)) { return undefined; }
        const real_pos = this.getRealPos(entity.P);
        const pos = this.playersPosition(real_pos);
        let dir = ACTION_DIRECT.RIGHT_DOWN;
        if (this.isTeamDown(real_pos)) {
            dir = ACTION_DIRECT.LEFT_UP;
        }
        const entity_type = Utils.isNullOrUndefined(entity.T) ? 0 : entity.T;
        switch (entity_type) {
            case UNIT_TYPE.Player:
                return this.newAvatar(entity, dir);
            case UNIT_TYPE.Warrior:
                return this.newWarrior(entity, dir);
            case UNIT_TYPE.Pet:
                return this.newPet(entity, dir);
            case UNIT_TYPE.PetA:
                return this.newPetA(entity, dir);
            case UNIT_TYPE.SoulBoy:
                return this.newSoulBoy(entity, dir);
            case UNIT_TYPE.Hero:
                return this.newHero(entity, dir);
            case UNIT_TYPE.Monster:
                return this.newMonster(entity, dir);
            case UNIT_TYPE.YanJia:
                return this.newYanJia(entity, dir);
            case UNIT_TYPE.Alien:
                return this.newAlien(entity, dir);
            case UNIT_TYPE.Dragon:
                return this.newDragon(entity, dir);
            default:
                break;
        }

        return undefined;
    }

    /**
     * 是否是下边的队伍
     * @param p 位置
     */
    private isTeamDown(p: number): boolean {
        if (p >= this.secondB) {
            p -= this.secondB;
        }
        return p < 11 || (p > 20 && p < 26);
    }

    public getFightStepByIndex(index?: number) {
        index = index || this.curIndex;
        return this.fightData.S[index];
    }

    public getRoundData(round?: number) {
        round = round || this.curRound;
        const round_data = this.roundDatas[round];
        return round_data;
    }

    public getRoundDatas() {
        return this.roundDatas;
    }

    /**
     * 根据回合数、回合索引获取步骤数据
     * @param round 回合数
     * @param index 回合里的索引
     * @returns 步骤数据
     */
    public getFightStepByRoundIndex(round?: number, index?: number) {
        round = round || this.curRound;
        index = index || this.curIndex;
        const round_data = this.roundDatas[round];
        if (round_data && !Utils.isNullOrUndefined(round_data[index])) {
            return this.getFightStepByIndex(round_data[index]);
        }
        return undefined;
    }

    /**
     * 玩家设置的站位坐标
     * @param pos 编号，自动换算新编号
     */
    public playersPosition(pos) {
        if (pos >= this.secondB) {
            pos -= this.secondB;
        }
        const id = pos.toString();
        const x: number = Config.getI(Config.T.Cfg_FightPosition).selectByKey(id, 'Pos_x');
        const y: number = Config.getI(Config.T.Cfg_FightPosition).selectByKey(id, 'Pos_y');
        return v3(x, y);
    }

    /** 是否敌方 */
    public isTeamUp(p: number): boolean {
        if (p >= this.secondB) {
            p -= this.secondB;
        }
        return (p > 10 && p < 21) || p > 25;
    }

    /**
     * 受击移位
     */
    public readonly _atk_pos_offset: Vec2 = v2(70, -70);

    /** 并列攻击偏移位置 */
    private childLen = 60;
    /** 获取攻击位置
     * pos_P 位置ID
     * isCharm 是否魅惑
     * moveToPos 指定移动位置
     *
    */
    public getTargetPos(pos_P: number, isCharm = false, moveToPos: Vec3 = undefined, isChild = false) {
        let pos = this.playersPosition(pos_P);

        if (moveToPos) {
            pos = v3(moveToPos.x, moveToPos.y);
            if (isChild) {
                pos = v3(pos.x + this.childLen, pos.y + this.childLen);
            }
        } else {
            if (isChild) {
                pos = v3(pos.x + this.childLen, pos.y + this.childLen);
            }
            if (this.isTeamUp(pos_P % this.secondB)) {
                if (!isCharm) {
                    pos.x += this._atk_pos_offset.x;
                    pos.y += this._atk_pos_offset.y;
                } else {
                    pos.x -= this._atk_pos_offset.x;
                    pos.y -= this._atk_pos_offset.y;
                }
            } else if (!isCharm) {
                pos.x -= this._atk_pos_offset.x;
                pos.y -= this._atk_pos_offset.y;
            } else {
                pos.x += this._atk_pos_offset.x;
                pos.y += this._atk_pos_offset.y;
            }
        }

        return pos;
    }

    newAvatar(entity: FightUnit, dir: number) {
        const roleModel = ActionConfig.I.getUser(entity);
        const p = new FightEntity(roleModel.UserId);
        entity.A.forEach((element) => {
            if (element.v != null) {
                p.updateInfo(element.k, element.v);
            }
        });

        entity.B.forEach((element) => {
            if (element.v != null) {
                p.updateInfo(element.k, element.v);
            }
        });
        p.playAction(ACTION_TYPE.RIDE_STAND, dir);
        p.fightI = entity.I;
        return p;
    }

    newMonster(entity: FightUnit, dir: number) {
        const roleModel = ActionConfig.I.getUser(entity);
        const ainfo = this.getMonsterAnimIdInfo(entity);
        const handle = `${ainfo.AnimId}${entity.P}`;
        const p = new FightEntity(parseInt(handle));
        // p.updateAttri('AnimId', ainfo.AnimId);

        entity.A.forEach((element) => {
            if (element.v != null) {
                p.updateInfo(element.k, element.v);
            }
        });

        entity.B.forEach((element) => {
            if (element.v != null) {
                p.updateInfo(element.k, element.v);
            }
        });
        p.initAnim(ainfo.AnimId, ACTION_RES_TYPE.PET, dir);
        p.fightI = entity.I;
        return p;
    }

    /** 获取怪物模型信息 */
    getMonsterAnimIdInfo(entity: FightUnit): MonsterAnimIdInfo {
        const ainfo: MonsterAnimIdInfo = js.createMap(true);
        if (this.fightData.T === 206) {
            // 灵兽园
            const key = entity.SectPetId.toString();
            const PetId: number = Config.getI(Config.T.Cfg_Sect_Pets).selectByKey(key, 'PetId');
            const Type: number = Config.getI(Config.T.Cfg_Sect_Pets).selectByKey(key, 'Type');
            if (PetId) {
                const pid = PetId.toString();
                ainfo.AnimId = Config.getI(Config.T.Cfg_Pet2).selectByKey(pid, 'AnimId');
                ainfo.Hight = Config.getI(Config.T.Cfg_Pet2).selectByKey(pid, 'Hight');
                const reborn_animid: string = Config.getI(Config.T.Cfg_Pet2).selectByKey(pid, 'RebornAnimId');
                if (Type) {
                    const strl = reborn_animid.split('|');
                    ainfo.AnimId = Number(strl[Type - 1]);
                }
            }
        } else if (this.fightData.T === 16) {
            // 抓宠物
            const key = entity.I.toString();
            ainfo.AnimId = Config.getI(Config.T.Cfg_Pet2).selectByKey(key, 'AnimId');
            ainfo.UnitType = Config.getI(Config.T.Cfg_Pet2).selectByKey(key, 'UnitType');
            ainfo.Hight = Config.getI(Config.T.Cfg_Pet2).selectByKey(key, 'Hight');
        } else {
            const key = entity.I.toString();
            ainfo.AnimId = Config.getI(Config.T.Cfg_Monster).selectByKey(key, 'AnimId');
            ainfo.UnitType = Config.getI(Config.T.Cfg_Monster).selectByKey(key, 'UnitType');
            ainfo.Hight = Config.getI(Config.T.Cfg_Monster).selectByKey(key, 'Hight');
        }
        return ainfo;
    }

    newWarrior(entity: FightUnit, dir: number) {
        let info: Cfg_Skin = Config.getI(Config.T.Cfg_Skin).getDataByKey(entity.I.toString());
        info = info || Config.getI(Config.T.Cfg_SkinGrade).getDataByKey(entity.I.toString());
        const handle = `${info.AnimId}${entity.P}`;
        const p = new FightEntity(parseInt(handle));
        p.initAnim(info.AnimId, ACTION_RES_TYPE.PET, dir);
        const resData = ActionConfig.I.getFollowerSkinResID(entity, UNIT_TYPE.Warrior, 1);
        if (resData) {
            const rolem = ActionConfig.I.getUser(entity);
            if (!EntityManager.I.isPlayerAvatarUserId(rolem.UserId)) {
                // 不是自己，可以根据设置屏蔽动画里屏蔽动画
            }
            p.initAnimaData(resData[0]);
        }
        entity.A.forEach((element) => {
            if (element.v != null) {
                p.updateInfo(element.k, element.v);
            }
        });

        entity.B.forEach((element) => {
            if (element.v != null) {
                p.updateInfo(element.k, element.v);
            }
        });
        p.fightI = entity.I;
        return p;
    }

    newPet(entity: FightUnit, dir: number) {
        const petArry = ActionConfig.I.getFollowerSkinResID(entity, UNIT_TYPE.Pet, 1);
        const resData = petArry[0];
        const handle = `${resData.roleResID}${entity.P}`;
        const p = new FightEntity(parseInt(handle));
        p.initAnim(resData.roleResID, ACTION_RES_TYPE.PET, dir);
        entity.A.forEach((element) => {
            if (element.v != null) {
                p.updateInfo(element.k, element.v);
            }
        });

        entity.B.forEach((element) => {
            if (element.v != null) {
                p.updateInfo(element.k, element.v);
            }
        });
        p.fightI = entity.I;
        return p;
    }

    newPetA(entity: FightUnit, dir: number) {
        const petArry = ActionConfig.I.getFollowerSkinResID(entity, UNIT_TYPE.PetA, 1);
        const resData = petArry[0];
        const handle = `${resData.roleResID}${entity.P}`;
        const p = new FightEntity(parseInt(handle));

        entity.A.forEach((element) => {
            if (element.v != null) {
                p.updateInfo(element.k, element.v);
            }
        });

        entity.B.forEach((element) => {
            if (element.v != null) {
                p.updateInfo(element.k, element.v);
            }
        });
        p.initAnim(resData.roleResID, ACTION_RES_TYPE.PET, dir);
        p.fightI = entity.I;
        return p;
    }

    newSoulBoy(entity: FightUnit, dir: number) {
        const petArry = ActionConfig.I.getFollowerSkinResID(entity, UNIT_TYPE.SoulBoy, 1);
        const resData = petArry[0];
        const handle = `${resData.roleResID}${entity.P}`;
        const p = new FightEntity(parseInt(handle));
        p.initAnim(resData.roleResID, ACTION_RES_TYPE.PET, dir);
        p.fightI = entity.I;
        return p;
    }

    newHero(entity: FightUnit, dir: number) {
        const petArry = ActionConfig.I.getFollowerSkinResID(entity, UNIT_TYPE.Hero, 1);
        const resData = petArry[0];
        const handle = `${resData.roleResID}${entity.P}`;
        const p = new FightEntity(parseInt(handle));
        p.initAnim(resData.roleResID, ACTION_RES_TYPE.PET, dir);
        p.fightI = entity.I;
        return p;
    }

    newYanJia(entity: FightUnit, dir: number) {
        const petArry = ActionConfig.I.getFollowerSkinResID(entity, UNIT_TYPE.YanJia, 1);
        const resData = petArry[0];
        const handle = `${resData.roleResID}${entity.P}`;
        const p = new FightEntity(parseInt(handle));
        p.initAnim(resData.roleResID, ACTION_RES_TYPE.PET, dir);
        p.fightI = entity.I;
        return p;
    }

    newAlien(entity: FightUnit, dir: number) {
        const petArry = ActionConfig.I.getFollowerSkinResID(entity, undefined, 1);
        const resData = petArry[0];
        const handle = `${resData.roleResID}${entity.P}`;
        const p = new FightEntity(parseInt(handle));
        p.initAnim(resData.roleResID, ACTION_RES_TYPE.PET, dir);
        p.fightI = entity.I;
        return p;
    }

    newDragon(entity: FightUnit, dir: number) {
        const roleModel = ActionConfig.I.getUser(entity);
        const info = ActionConfig.I.getRoleSkinResID(roleModel);
        const handle = `${info.dragonResID}${entity.P}`;
        const p = new FightEntity(parseInt(handle));
        p.initAnim(info.dragonResID, ACTION_RES_TYPE.PET, dir);
        p.fightI = entity.I;
        return p;
    }

    public getRealPos(p: number) {
        return p % this.secondB;
    }

    /** 获取攻击类型 */
    getTurnAtkType(step: FightStep, attackType?: number): TURN_ATK_TYPE {
        let type: TURN_ATK_TYPE = TURN_ATK_TYPE.Normall;
        if (!step.NoAtk && step.S && attackType === 0) {
            // 近程攻击
            type = TURN_ATK_TYPE.Short;
        } else if (step.NoAtk || step.S && attackType === 1) {
            // 远程攻击
            type = TURN_ATK_TYPE.Long;
        } else if (step.S && attackType === 2) {
            // 移至屏幕中央攻击
            type = TURN_ATK_TYPE.Centre;
        }
        return type;
    }

    /** 是否是灵兽园战斗 */
    isLingShouYuan() {
        return this.fightData.T === 206;
    }

    /** 是否是抓宠物 */
    isZhuoChong() {
        return this.fightData.T === 16;
    }

    /** 是否是天仙奇缘 */
    isTxqy() {
        return this.fightData.T === BATTLE_TYPE.TXQY;
    }

    /** 是否胜利 */
    isWin() {
        return this.fightData.Win === 1;
    }

    /** 是否不显示奖励 */
    isNoShowPrize() {
        switch (this.fightData.T) {
            case BATTLE_TYPE.CATCH_PET:
            case BATTLE_TYPE.Zoo_PVE:
            case BATTLE_TYPE.Zoo_PVE_B:
            case BATTLE_TYPE.Zoo_PVE_G:
            case BATTLE_TYPE.Zoo_PVE_S:
                return true;
            default:
                return false;
        }
    }

    /** 战斗结束后是否不需要等待，直接结束 */
    isNoWait() {
        return FightSceneIndexer.I.isNoWait(this.fightData.T);
    }

    /** 是否组队战斗 */
    isTeamBattle() {
        switch (this.fightData.T) {
            case BATTLE_TYPE.Marry_FB:
            case BATTLE_TYPE.FB_ZD_JJ:
            case BATTLE_TYPE.FB_ZD_LQ:
                return true;
            default:
                return false;
        }
    }

    /** 是否包含 对应的显示类型 */
    hasEffectType(typeArray: Effect[], eType: number) {
        for (let i = 0, n = typeArray.length; i < n; i++) {
            if (typeArray[i].K === eType) {
                return typeArray[i];
            }
        }
        return undefined;
    }

    /**
     * 对已方所有人加盾
     * @param skillData 技能数据
     */
    public showAnimSID(ap: number, animSID: number) {
        let begin = 0;
        if (this.isTeamUp(ap)) {
            begin = 10;
        }

        for (let i = 1; i < 11; i++) {
            if (!animSID) {
                continue;
            }
            let skillEffect: ActionBase;
            let unitOther: FightEntity = this.AllFightEntity[begin + i];
            if (unitOther && unitOther.isValid) {
                skillEffect = this.getSkill(animSID, false, this.isMe(ap));
                skillEffect.setPosition(unitOther.position.x, unitOther.position.y);
            }
            unitOther = this.AllFightEntity[100 + begin + i];
            // 有两个坑的也加上
            if (unitOther && unitOther.isValid) {
                skillEffect = this.getSkill(animSID, false, this.isMe(ap));
                skillEffect.setPosition(unitOther.position.x, unitOther.position.y);
            }
        }
    }

    /** 是否最后一个 */
    public isLastAtkUnit(fightStep: FightStep, index: number) {
        const last_index = fightStep.U.length - 1;
        return index >= last_index;
    }

    /** 是否为连击 */
    public isDoubleStep(fightStep: FightStep, index: number) {
        // 如果此次是连击,或者下一次攻击是连击,则本轮攻击是连击
        if ((!this.isLastAtkUnit(fightStep, index) && this.hasEffectType(fightStep.U[0].E, CLIENT_SHOW_TYPE.DOUBLE_HIT)) || fightStep.MultiAtk) {
            return true;
        } else {
            return false;
        }
    }

    private isShaked = false;
    doSceneShake(target?: Node) {
        target = target || this.battle.node;
        if (this.isShaked) { return; }
        tween(target).sequence(
            tween().by(0.05, { position: v3(-14, -14) }),
            tween().by(0.05, { position: v3(14, 14) }),
            tween().call(() => {
                this.isShaked = false;
            }),
        ).repeat(3).start();
    }

    public doTargetDamage(Result: number, realPos: number, vicEntity: FightEntity, e: Effect) {
        if (Result === -1) {
            if (!this.isNoBool() || this.isTeamUp(realPos)) {
                // 允许掉血才飘字
                if (vicEntity.hp > 0 && e.V > 0) {
                    vicEntity.hp = e.V;
                }
            }
        } else if (Result === 1) {
            vicEntity.hp = -e.V;
        }
    }

    /** 是否只掉血不飘字 */
    public isNoBool() {
        switch (this.fightData.T) {
            case BATTLE_TYPE.Cross_Boss_Pet:
            case BATTLE_TYPE.Boss_TT2:
            case BATTLE_TYPE.Boss_TT3:
            case BATTLE_TYPE.sect_Boss:
                return true;
            default:
                return false;
        }
    }
    /** 攻击者是否死亡 */
    public isDeadAttacker(entity: FightEntity) {
        return entity.hp < 1;
    }

    /** 根据位置获取方向 */
    public getDirByP(p: number) {
        if (this.isTeamUp(p % this.secondB)) {
            return ACTION_DIRECT.RIGHT_DOWN;
        } else {
            return ACTION_DIRECT.LEFT_UP;
        }
    }

    /** 是否自己 */
    public isMe(p: number) {
        return p === this.ROLE_POS;
    }

    private skillArray: ActionBase[] = [];
    /**
     * 从池子中取到一个技能
     * @param resID 资源ID
     * @param isKeep 是否保持效果，并循环播放
     * @param isMe 是否针对当前玩家自身
     * @param direct 方向
     */
    public getSkill(resID: number | string, isKeep = false, isMe = false, direct = -1, speed = 0): ActionBase {
        // const fightStep = this.getFightStepByIndex();
        let result: ActionBase = null;

        for (let i = 0; i < this.skillArray.length; i++) {
            const skill = this.skillArray[i];
            if (skill && skill.isUsed === false) {
                skill.release();
                this.skillArray[i] = null;
            }
        }

        if (result == null || result.isValid === false) {
            if (isKeep) {
                result = new ActionBase(resID, ACTION_RES_TYPE.SKILL, direct, ACTION_TYPE.DEFAULT, AnimationClip.WrapMode.Loop);
            } else {
                result = new ActionBase(resID, ACTION_RES_TYPE.SKILL, direct, ACTION_TYPE.DEFAULT, AnimationClip.WrapMode.Normal);
                result.setFinishCallback(() => {
                    if (result && result.isValid) {
                        result.active = false;
                        result.isUsed = false;
                    }
                });
                result.active = true;
            }
            this.skillArray.push(result);
        }

        result.setScale(1, 1);
        UtilsCC.setOpacity(result, 255);

        result.isUsed = true;
        if (isMe) {
            result.active = true;
        }
        return result;
    }

    /** 显示护盾效果 */
    public shieldStatus(entity, index: number) {
        // 防御护盾 1通用盾  3敖丙盾 5无敌盾 7神龙冰盾
        let n = null;
        let shield: ShieldAction;
        /** 1 3 5 7 */
        const shields = [0, 5113, 0, 5112, 0, 5107, 0, 5112, 0];
        const resid = shields[index];
        if (!Utils.isNullOrUndefined(resid)) {
            const node_name = `shield${shields.indexOf(index)}`;
            n = entity.getChildByName(node_name);
            shield = n;
            switch (resid) {
                case 0:
                    if (shield) {
                        shield.active = false;
                        shield.shield_stetus = false;
                    }
                    break;
                default:
                    if (!shield) {
                        shield = new ShieldAction(resid, ACTION_RES_TYPE.SKILL, -1, ACTION_TYPE.DEFAULT, AnimationClip.WrapMode.Loop);
                        shield.name = node_name;
                        shield.layer = entity.layer;
                        entity.addChild(shield);
                    }
                    shield.active = true;
                    shield.shield_stetus = true;
                    break;
            }
        }
        this.refreshShieldHid(entity);
    }

    /** 刷新护盾显示状态 */
    private refreshShieldHid(entity: FightEntity) {
        // 按优先级显示  5 > 1 > 3
        const sIDlist = [5, 1, 3, 7];
        let isH = false;
        for (let index = 0; index < sIDlist.length; index++) {
            const n = sIDlist[index];
            const name = `shield${n}`;
            const sn: any = entity.getChildByName(name);
            if (!sn) {
                continue;
            }
            const shield: ShieldAction = sn;
            if (shield.shield_stetus && isH === false) {
                sn.active = true;
                isH = true;
            } else {
                sn.active = false;
            }
        }
    }

    /** 获取幻灵id */
    public getHLID(ChangHL: number, ChangeHLSkin: number) {
        const skin_id = ChangeHLSkin.toString();
        const skinDat: Cfg_Skin = Config.getI(Config.T.Cfg_Skin).getDataByKey(skin_id) || Config.getI(Config.T.Cfg_SkinGrade).getDataByKey(skin_id);
        const hlID = skinDat && skinDat.IsShow ? ChangHL + 5 : ChangHL;
        return hlID;
    }

    private removeAllFightEntity() {
        for (let p in this.AllFightEntity) {
            let e = this.AllFightEntity[p];
            if (e && e.isValid) {
                e.release();
            }
        }
        this.AllFightEntity = js.createMap(true);
    }

    public endBattle() {
        this.removeAllFightEntity();
        UIManager.I.close(UI_NAME.Battle);
    }
}

class ShieldAction extends ActionBase {
    public shield_stetus = false;
}
