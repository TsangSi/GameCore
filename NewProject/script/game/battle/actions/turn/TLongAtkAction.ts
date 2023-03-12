/*
 * @Author: hrd
 * @Date: 2022-06-26 15:15:40
 * @FilePath: \SanGuo\assets\script\game\battle\actions\turn\TLongAtkAction.ts
 * @Description: 远程攻击行为
 *
 */

import { UtilString } from '../../../../app/base/utils/UtilString';
import { ACTION_TYPE } from '../../../base/anim/AnimCfg';
import { EntityAcionName } from '../../../entity/EntityConst';
import ModelMgr from '../../../manager/ModelMgr';
import { UtilBattle } from '../../util/UtilBattle';
import {
    AtkTimeKey, EffectType, ExecuteType,
} from '../../WarConst';
import { ActionBase } from '../base/ActionBase';
import { UnitDelayAction } from '../base/UnitDelayAction';
import { UnitEntityAction } from '../base/UnitEntityAction';
import { UnitParallelAction } from '../base/UnitParallelAction';
import { UnitSeriesAction } from '../base/UnitSeriesAction';
import { TEffectAction, TFxedPointEffectAction } from '../TEffectAction';
import { TAtkAction } from './TAtkAction';
import { TExeAtkAction } from './TExeAtkAction';

export class TLongAtkAction extends ActionBase {
    private mStep: FightStep;
    private mSkillActionCfg: Cfg_SkillActions;
    private mAtkEvenes: TAtkAction[] = null;
    private mSkillActionId: number;

    public static Create(stap: FightStep, skillActionId: number, atkEvents?: TAtkAction[]): TLongAtkAction {
        const action = new TLongAtkAction();
        action.executeType = ExecuteType.Parallel;
        action.mStep = stap;
        action.mAtkEvenes = atkEvents;
        action.mSkillActionId = skillActionId;
        action.mSkillActionCfg = ModelMgr.I.BattleModel.getSkillActionCfg(skillActionId);
        // action.parseData();
        return action;
    }

    public initAct(): void {
        super.initAct();
        this.parseData();
    }

    public parseData(): void {
        /**  */
        // const act0 = TEffectAction.Create(0, 1);
        const extActList = [];
        const actCfg = this.mSkillActionCfg;
        const skillActionId = actCfg.ID;
        const atkEntity = this.mWar.getEntity(this.mStep.P);
        // 施法动作
        const act0 = UnitEntityAction.Create(atkEntity, actCfg.AtkAction as EntityAcionName);
        if (actCfg.KnifeLight) {
            // const act3 = UnitDelayAction.Create(100);
            const arr = UtilString.SplitToArray(actCfg.KnifeLight)[0];
            const effId = +arr[0];
            const targerPos = +arr[1];
            const act4 = TFxedPointEffectAction.Create(effId, targerPos, this.mStep.P);
            // const act5 = UnitSeriesAction.CreateList([act3, act4]);
            act0.executeType = ExecuteType.Parallel;
            act0.pushAction(act4);
        }

        // 前摇时间
        if (actCfg.AttackPoint) {
            const actP = UnitDelayAction.Create(actCfg.AttackPoint);
            const actPP = UnitParallelAction.Create([act0, actP]);
            extActList.push(actPP);
        } else {
            extActList.push(act0);
        }
        // 特效飞行
        if (actCfg.EffType === EffectType.FlyMove) {
            // 飞行到目标
            const act1 = EffFlyToTarget.Create(this.mStep, this.mAtkEvenes[0], skillActionId);
            extActList.push(act1);
        } else {
            // 爆点 、 持续
            const hitTileList = UtilBattle.I.getHitTimeList(actCfg.HitTime); // dong_: todo 受击间隔时间
            // 是否需要创建多个爆点特效
            const isBlastEffMulti = actCfg.BlastEffMulti;
            const actSkillList = [];
            if (isBlastEffMulti && this.mAtkEvenes[0]) {
                for (let i = 0; i < this.mAtkEvenes[0].mHitStep.length; i++) {
                    const fStep: FightStep = this.mAtkEvenes[0].mHitStep[i];
                    const act1 = TEffectAction.Create(fStep, skillActionId);
                    actSkillList.push(act1);
                }
            } else {
                const act1 = TEffectAction.Create(this.mAtkEvenes[0].mHitStep[0], skillActionId);
                actSkillList.push(act1);
            }

            const actList = [];
            for (let i = 0; i < this.mAtkEvenes.length; i++) {
                const atkEvent = this.mAtkEvenes[i];
                let time = UtilBattle.I.getFightAtkTime(AtkTimeKey.AtkHitTime1);
                if (hitTileList[i]) {
                    time = hitTileList[i];
                }
                const act2 = UnitDelayAction.Create(time);
                actList.push(act2);
                const act3 = TExeAtkAction.Create(atkEntity, skillActionId, atkEvent.mHitActinList); // 伤害
                actList.push(act3);
            }
            const AtkEndTime = UtilBattle.I.getFightAtkTime(AtkTimeKey.AtkEndTime);
            const act4 = UnitDelayAction.Create(AtkEndTime);
            actList.push(act4);
            const act5 = UnitSeriesAction.CreateList(actList);
            actSkillList.push(act5);
            const act6 = UnitParallelAction.Create(actSkillList);
            extActList.push(act6);
        }
        // this.pushAction(extActList);
        this.pushAction(UnitSeriesAction.CreateList(extActList));
    }
}

class EffFlyToTarget extends ActionBase {
    private mAtkEvent: TAtkAction = null;
    private mStep: FightStep;
    private mSkillActionId: number;

    public static Create(atkStap: FightStep, atkEvent: TAtkAction, skillActionId: number): EffFlyToTarget {
        const action = new EffFlyToTarget();
        action.executeType = ExecuteType.Parallel;
        action.mStep = atkStap;
        action.mSkillActionId = skillActionId;
        action.mAtkEvent = atkEvent;
        // action.parseData();
        return action;
    }

    public initAct(): void {
        super.initAct();
        this.parseData();
    }

    private parseData() {
        const hitStepList = this.mAtkEvent.mHitStep;
        const atkEntity = this.mWar.getEntity(this.mStep.P);
        const actList = [];
        for (let i = 0; i < hitStepList.length; i++) {
            const hitStep = hitStepList[i];
            const hitAct = this.mAtkEvent.mHitActinList[i];
            // const tagPos = hitStep.TP; // dong_: todo 目标坐标
            const act0 = TEffectAction.Create(hitStep, this.mSkillActionId); // dong_: todo 飞行特效
            const act1 = TExeAtkAction.Create(atkEntity, this.mSkillActionId, [hitAct]);
            const act2 = UnitSeriesAction.CreateList([act0, act1]);
            actList.push(act2);
        }
        this.pushAction(actList);
    }
}
