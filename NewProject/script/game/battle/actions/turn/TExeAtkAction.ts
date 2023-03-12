/*
 * @Author: hrd
 * @Date: 2022-07-12 11:37:26
 * @FilePath: \SanGuo\assets\script\game\battle\actions\turn\TExeAtkAction.ts
 * @Description: 执行攻击
 *
 */

import { ACTION_TYPE } from '../../../base/anim/AnimCfg';
import EntityBattle from '../../../entity/EntityBattle';
import {
    ActionType, AtkTimeKey, AtkType, ExecuteType,
} from '../../WarConst';
import { ActionBase } from '../base/ActionBase';
import { UnitEntityAction } from '../base/UnitEntityAction';
import { THitAction } from './THitAction';
import { TShortAtkStartAction } from './TShortAtkStartAction';
import { UnitDelayAction } from '../base/UnitDelayAction';
import { UnitSeriesAction } from '../base/UnitSeriesAction';
import { TBuffAction } from './TBuffAction';
import { UtilBattle } from '../../util/UtilBattle';
import { TEffectAction, TFxedPointEffectAction } from '../TEffectAction';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UnitParallelAction } from '../base/UnitParallelAction';
import ModelMgr from '../../../manager/ModelMgr';
import { EntityAcionName } from '../../../entity/EntityConst';
import { BattleMgr } from '../../BattleMgr';

export class TExeAtkAction extends ActionBase {
    private mEntity: EntityBattle;
    private mEvent: ActionBase[];
    private mSkillActionCfg: Cfg_SkillActions;
    private mSkillActionId: number;

    public static Create(myEntity: EntityBattle, skillActionId: number, event: ActionBase[]): TExeAtkAction {
        const action = new TExeAtkAction();
        action.mEntity = myEntity;
        action.mEvent = event;
        action.mSkillActionId = skillActionId;
        action.mSkillActionCfg = ModelMgr.I.BattleModel.getSkillActionCfg(skillActionId);
        return action;
    }

    public initAct(): void {
        super.initAct();
        this.parseActionEvent();
    }

    public onEnter(): void {
        super.onEnter();
    }

    public onExit(): void {
        super.onExit();
    }

    private parseActionEvent() {
        const actCfg = this.mSkillActionCfg;
        if (this.mEvent.length <= 0) {
            return;
        }
        if (actCfg.AtkType === AtkType.Short) { // 近战
            this.executeType = ExecuteType.Parallel;
            if (this.mSkillActionCfg.IsDouble) {
                this.executeType = ExecuteType.Series;
            }
            this.executeShortAtkFunc();
        } else {
            this.executeType = ExecuteType.Parallel;
            this.executeLongAtkFunc();
        }
    }

    /** 执行远程攻击 */
    private executeLongAtkFunc() {
        // const hitTime = 100; // 伤害间隔
        // const act1 = UnitDelayAction.Create(hitTime);
        const mList = [];
        for (let i = 0; i < this.mEvent.length; i++) {
            const data = this.mEvent[i];
            mList.push(data);
        }
        this.pushAction(mList);
    }

    /** 执行近程攻击 */
    private executeShortAtkFunc() {
        let oldTag = 0;
        const actCfg = this.mSkillActionCfg;
        const isDoubleAtk = actCfg.IsDouble;
        const isBlastEffMulti = actCfg.BlastEffMulti;
        let hitDelay = 0;
        if (actCfg.HitTime) {
            const hitTileList = UtilBattle.I.getHitTimeList(actCfg.HitTime);
            hitDelay = hitTileList[0];
        }
        const len = this.mEvent.length;
        for (let i = 0; i < len; i++) {
            const actList = [];
            let hitStep: FightStep = null; // 受击数据
            const actEvent = this.mEvent[i]; // 受击行为
            if (isDoubleAtk && actEvent.mType === ActionType.Hit) {
                const act = actEvent as THitAction;
                hitStep = act.mStep;
                const atkEntity = this.mWar.getEntity(hitStep.P);
                if (!(atkEntity && cc.isValid(atkEntity))) {
                    continue;
                }
                let act1 = null;
                if (oldTag !== hitStep.TP) {
                    // 移动到目标
                    act1 = TShortAtkStartAction.Create(hitStep);
                    actList.push(act1);
                }
                oldTag = hitStep.TP;
                // 播放攻击动作
                const act2 = UnitEntityAction.Create(atkEntity, actCfg.AtkAction as EntityAcionName);
                if (actCfg.KnifeLight) {
                    const arr = UtilString.SplitToArray(actCfg.KnifeLight)[0];
                    const effId = +arr[0];
                    const targerPos = +arr[1];
                    const act4 = TFxedPointEffectAction.Create(effId, targerPos, hitStep.P);
                    act2.executeType = ExecuteType.Parallel;
                    act2.pushAction(act4);
                }
                const atkDelay = BattleMgr.I.getEntityAtkDelay(atkEntity, actCfg.AtkAction as EntityAcionName);
                const atkActDelay = UnitDelayAction.Create(atkDelay);
                // 播放特效
                const act3 = TEffectAction.Create(hitStep, this.mSkillActionId);
                const act11 = UnitSeriesAction.CreateList([UnitDelayAction.Create(hitDelay), actEvent]);
                const act12 = UnitParallelAction.Create([act2, atkActDelay, act3, act11]);
                actList.push(act12);

                console.log('atkActDelay', atkEntity.FightUnit.P, actCfg.AtkAction, atkDelay);

                // 攻击间隔
                // if (i !== 0 && i !== len - 1) {
                if (i !== len - 1 && len > 1) {
                    const time = UtilBattle.I.getFightAtkTime(AtkTimeKey.AtkOverSleepTime);
                    actList.push(UnitDelayAction.Create(time));
                }
            } else if (actEvent.mType === ActionType.Hit) {
                const act = actEvent as THitAction;
                hitStep = act.mStep;
                const atkEntity = this.mWar.getEntity(hitStep.P);
                if (!(atkEntity && cc.isValid(atkEntity))) {
                    continue;
                }
                let act1 = null;
                if (i === 0) {
                    // 移动到目标
                    act1 = TShortAtkStartAction.Create(hitStep);
                    actList.push(act1);
                    // 播放攻击动作
                    const act2 = UnitEntityAction.Create(atkEntity, actCfg.AtkAction as EntityAcionName);
                    const act3 = TEffectAction.Create(hitStep, this.mSkillActionId);
                    if (actCfg.KnifeLight) {
                        const arr = UtilString.SplitToArray(actCfg.KnifeLight)[0];
                        const effId = +arr[0];
                        const targerPos = +arr[1];
                        const act4 = TFxedPointEffectAction.Create(effId, targerPos, hitStep.P);
                        act2.executeType = ExecuteType.Parallel;
                        act2.pushAction(act4);
                    }
                    const act11 = UnitSeriesAction.CreateList([UnitDelayAction.Create(hitDelay), actEvent]);
                    const act12 = UnitParallelAction.Create([act2, act3, act11]);
                    actList.push(act12);
                } else {
                    // 播放特效
                    const act11 = UnitDelayAction.Create(hitDelay + 80);
                    actList.push(act11);
                    if (isBlastEffMulti) {
                        const act3 = TEffectAction.Create(hitStep, this.mSkillActionId);
                        actList.push(act3);
                    }
                    actList.push(actEvent);
                }
            } else if (actEvent.mType === ActionType.Buff) {
                const act = actEvent as TBuffAction;
                hitStep = act.mStep;
                actList.push(actEvent);
            }
            this.pushAction(UnitSeriesAction.CreateList(actList));
        }
    }
}
