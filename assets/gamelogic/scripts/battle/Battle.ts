/* eslint-disable max-len */
import { AnimationClip, js, Label, Node, Tween, tween, v2, v3, _decorator } from 'cc';
import ActionBase from '../../../scripts/action/ActionBase';
import ActionConfig, { ACTION_DIRECT, ACTION_RES_TYPE, ACTION_TYPE } from '../../../scripts/action/ActionConfig';
import { FightEntity } from '../../../scripts/action/FightEntity';
import { EventM } from '../../../scripts/common/EventManager';
import { Config } from '../../../scripts/config/Config';
import { CLIENT_SHOW_TYPE, TURN_ATK_TYPE } from '../../../scripts/global/GConst';
import EntityManager from '../../../scripts/map/EntityManager';
import { SceneN } from '../../../scripts/map/SceneN';
import { BaseView } from '../../../scripts/ui/base/BaseView';
import MsgToast from '../../../scripts/ui/Toast/MsgToast';
import { UI_NAME } from '../../../scripts/ui/UIConfig';
import UIManager from '../../../scripts/ui/UIManager';
import Utils from '../../../scripts/utils/Utils';
import UtilsCC from '../../../scripts/utils/UtilsCC';
import { BattleBase } from './base/BattleBase';
import { BattleCallback } from './base/BattleCallback';
import { BattleSpawn } from './base/BattleSpawn';
import { BattleBuff } from './BattleBuff';
import { BattleCenterAttack } from './BattleCenterAttack';
import { BattleLongAttack } from './BattleLongAttack';
import { BattleManager } from './BattleManager';
import { TShortAtkAction } from './TShortAtkAction';

const { ccclass, property } = _decorator;

interface MonsterAnimIdInfo {
    AnimId: number;
    UnitType: number;
    Hight: number;
}


@ccclass('Battle')
export class Battle extends BaseView {
    private BattleM: BattleManager;
    onLoad() {
        this.BattleM = BattleManager.I;
        UtilsCC.setClickEvent('BtnClose', this.node, 'on_close_clicked', this);
        const fightData: S2CBattlefieldReport = this.getArg('fightData');
        this.BattleM.initBattle(fightData, this);
        this.saveRoundActions();
        this.roundBegin();
        EventM.I.fire(EventM.Type.Battle.BattleBegin);
    }

    addChild(entity: Node) {
        this.node.addChild(entity);
    }

    /** 开始回合 */
    saveRoundActions() {
        const rounds = this.BattleM.getRoundDatas();
        const all_actions: BattleBase[][] = [];
        rounds.forEach((r, index) => {
            const action_list: BattleBase[] = [];
            const list_1: BattleBase[] = []; // 并列数组
            const list_2: BattleBase[] = []; // 串行
            r.forEach((step_index) => {
                const step = this.BattleM.getFightStepByIndex(step_index);
                const next_step = this.BattleM.getFightStepByIndex(step_index + 1);
                const action = this.doFightStep(step);
                if (this.isTogether(step, next_step)) {
                    list_1.push(action);
                } else if (list_1.length) {
                    list_1.push(action);
                    action_list.push(BattleSpawn.Create(list_1));
                    list_1.length = 0;
                    if (!next_step && !this.isBuffStep(step)) {
                        action_list.push(BattleCallback.Create(undefined, this.BattleM.attackOverSleepTime));
                    }
                } else if (list_2.length) {
                    list_2.push(action);
                    action_list.push(BattleSpawn.Create(list_2));
                    list_2.length = 0;
                    if (!next_step && !this.isBuffStep(step)) {
                        action_list.push(BattleCallback.Create(undefined, this.BattleM.attackOverSleepTime));
                    }
                } else if (this.isSamePlayFlag(step, next_step)) {
                    list_2.push(action);
                } else {
                    action_list.push(action);
                    if (!this.isBuffStep(step)) {
                        action_list.push(BattleCallback.Create(undefined, this.BattleM.attackOverSleepTime));
                    }
                }
            });
            action_list.push(BattleCallback.Create(undefined, this.BattleM.attackStayTime));
            all_actions[index] = action_list;
        });
        // console.log('all_actions=', all_actions);
        this.all_round_actions = all_actions;
    }

    private all_round_actions: BattleBase[][] = [];
    private curRoundActions: BattleBase[] = [];
    private curActionIndex = 0;
    roundBegin() {
        if (this.all_round_actions.length) {
            this.curRoundActions = this.all_round_actions.shift();
            this.curActionIndex = 0;
        } else {
            console.log('回合结束');
            this.readyEnd();
        }
    }

    roundEnd() {
        this.roundBegin();
    }

    update(dt: number) {
        if (this.isEnd) { return; }
        dt *= 1000;
        if (this.curActionIndex >= 0 && this.curActionIndex < this.curRoundActions.length) {
            const action = this.curRoundActions[this.curActionIndex];
            if (action) {
                if (!action.mInit) {
                    action.onEnter();
                    action.mInit = true;
                }
                if (action.onUpdate(dt) === BattleBase.State.Finish) {
                    action.onExit();
                    this.curActionIndex++;
                }
                if (!this.curRoundActions[this.curActionIndex]) {
                    this.roundEnd();
                }
            } else {
                this.roundEnd();
            }
        } else {
            this.roundEnd();
        }
    }

    /** 是否为串行战斗步骤 */
    private isSamePlayFlag(curStep: FightStep, nextStep: FightStep): boolean {
        if (!nextStep) {
            return false;
        }
        if (curStep.SamePlayFlag && nextStep.SamePlayFlag) {
            const isUp1 = this.BattleM.isTeamUp(curStep.P);
            const isUp2 = this.BattleM.isTeamUp(nextStep.P);
            if (isUp1 === isUp2) {
                // 同一阵营的战斗步骤才能串联
                return true;
            }
        }
        return false;
    }

    /** 是否为并列战斗步骤 */
    private isTogether(curStep: FightStep, nextStep: FightStep): boolean {
        if (!curStep.Together) {
            return false;
        }
        if (!nextStep) {
            return false;
        }
        if (curStep.Together === nextStep.Together) {
            return true;
        }
        return false;
    }
    /** 是否为buff */
    private isBuffStep(step: FightStep): boolean {
        if (step.U && step.U.length > 0) {
            return false;
        }
        return true;
    }

    private actions: Tween<Node>;
    /** 执行单个步骤 */
    doFightStep(step: FightStep) {
        const fightStep = step;
        console.log(`开始 第${this.BattleM.curRound}回合，第${this.BattleM.curIndex}步`);
        let action: BattleBase;
        if (this.isBuffStep(fightStep)) {
            action = BattleBuff.Create(fightStep.P, fightStep.E, fightStep.CU);
        } else {
            // 有攻击对象
            action = this.ParseFightStepToAtk(this.actions, fightStep);
        }
        // this.actions.call(() => {
        //     const rounds = this.BattleM.getRoundData();
        //     this.BattleM.curIndex++;
        //     if (this.BattleM.curIndex >= rounds.length) {
        //         this.BattleM.curRound++;
        //         this.BattleM.curIndex = 0;
        //         if (!this.BattleM.getRoundData()) {
        //             // 结束战斗;
        //             console.log('结束战斗');
        //             this.node.destroy();
        //             EntityManager.I.getPlayerAvatar().isFight = false;
        //             return;
        //         }
        //     }
        //     this.doFightStep();
        // }).start();
        return action;
    }

    private ParseFightStepToAtk(actions: Tween<Node>, fightStep: FightStep) {
        const action_list = [];
        const AttackType: number = Config.getI(Config.T.Cfg_Skill).selectByKey(fightStep.S.toString(), 'AttackType');
        const turnAtk = this.BattleM.getTurnAtkType(fightStep, AttackType);
        if (turnAtk === TURN_ATK_TYPE.Short) {
            action_list.push(TShortAtkAction.Create(fightStep));
        } else if (turnAtk === TURN_ATK_TYPE.Long) {
            // 远程攻击
            action_list.push(BattleLongAttack.Create(fightStep));
        } else if (turnAtk === TURN_ATK_TYPE.Centre) {
            action_list.push(BattleCenterAttack.Create(fightStep));
        }
        return BattleSpawn.Create(action_list);
    }

    /** 获取怪物模型信息 */
    getMonsterAnimIdInfo(entity: FightUnit): MonsterAnimIdInfo {
        const ainfo: MonsterAnimIdInfo = js.createMap(true);
        if (this.BattleM.isLingShouYuan()) {
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
        } else if (this.BattleM.isZhuoChong()) {
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

    private playerReport() {
        SceneN.I.C2SFightContinue();
        this.BattleM.curIndex++;
    }

    private isEnd = false;
    private readyEnd() {
        this.isEnd = true;
        if (this.BattleM.isWin()) {
            // 胜利
            if (this.BattleM.isNoShowPrize()) {
                this.doEnd();
            } else {
                this.showPrizeItems();
            }
        } else {
            // 失败
            this.doEnd();
        }
    }

    private doEnd() {
        if (this.BattleM.isTxqy()) {
            SceneN.I.C2SActLuckLeave();
        }
        if (this.BattleM.isNoWait() || this.BattleM.isTeamBattle()) {
            this.resumeFight();
        } else {
            // setTimeout(() => {
            this.resumeFight();
            // }, 7000);
        }
    }

    private resumeFight() {
        this.BattleM.endBattle();
    }

    /** 显示奖励，地上宝箱 */
    private showPrizeItems() {
        MsgToast.Show('奖励飘字');
        this.doEnd();
    }

    /**
     * 添加技能过程动画
     * @param skillID 技能ID
     * @param callback 回调
     */
    private setAnimPId(skillID, callback: () => void = null) {
        const maxSkillData: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(skillID);
        const timeP = 350;
        const time = 100;
        if (maxSkillData.AnimPId) {
            // //10351桃园结义技能，按正常逻辑走
            // if (maxSkillData.AnimPPlayTime && skillID != 10351) {
            //     //过程动画要处理的
            // this.achSkill();
            //     time = timeP + 200
            // } else {
            //     TaskQueue.I.setTimeout(() => {
            //         this.achSkill();
            //     }, timeP, true);
            // }
        }
        const fs = this.BattleM.getFightStepByIndex();
        if (fs.SamePlayFlag) {
            callback.call(this);
        } else if (callback) {
            setTimeout(() => {
                callback.call(this);
            }, time, true);
        }
    }

    private moveToAttack() {

    }

    /** 清除持续buff */
    clearKeepBuff(unit: FightEntity) {
        if (unit && unit.keepNode && unit.keepNode.isValid) {
            unit.keepNode.destroy();
            unit.keepNode = undefined;
        }
    }

    /** 获取当前步骤数据 */
    // getCurFightStep () {
    //     return this.fightData.S[this.BattleM.curIndex];
    // }

    isLastFightStep() {
        return this.BattleM.curIndex === this.BattleM.maxIndex;
    }

    close() {
        this.BattleM.endBattle();
    }

    onStartBattle(data: S2CBattlefieldReport) {
        for (let i = 0, n = data.U.length; i < n; i++) {
            const monster = data.U[i];
            const info = ActionConfig.I.getRoleSkinResID(monster);
            console.log('敌方单位i', i, monster);
            console.log('info=', info);
        }
    }

    onDestroy() {
        SceneN.I.C2SEndFight(BattleManager.I.getFightIndex());
        EventM.I.fire(EventM.Type.Battle.BattleEnd);
        EntityManager.I.getPlayerAvatar().isFight = false;
    }
}
