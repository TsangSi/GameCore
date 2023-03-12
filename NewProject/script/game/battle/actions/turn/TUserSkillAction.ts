/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Author: hrd
 * @Date: 2022-07-12 17:12:48
 * @FilePath: \SanGuo\assets\script\game\battle\actions\turn\TUserSkillAction.ts
 * @Description: 使用技能行为
 *
 */

import { UtilString } from '../../../../app/base/utils/UtilString';
import ModelMgr from '../../../manager/ModelMgr';
import { BattleMgr } from '../../BattleMgr';
import { BattleTurnDataParse } from '../../BattleTurnDataParse';
import { SkillEffect } from '../../effect/SkillEffect';
import { UtilBattle } from '../../util/UtilBattle';
import {
    ActionType, AtkTimeKey, AtkType, ExecuteType,
} from '../../WarConst';
import { ActionBase } from '../base/ActionBase';
import { UnitDelayAction } from '../base/UnitDelayAction';
import { UnitFuncAction } from '../base/UnitFuncAction';
import { UnitParallelAction } from '../base/UnitParallelAction';
import { UnitPlayWordAction } from '../base/UnitPlayWordAction';
import { TAtkAction } from './TAtkAction';
import { TLongAtkAction } from './TLongAtkAction';
import { TSceneCentreAtkAction } from './TSceneCentreAtkAction';
import { TShortAtkAction } from './TShortAtkAction';

export class TUserSkillAction extends ActionBase {
    public mType = ActionType.Skill;
    private mStep: FightStep = null;
    private mList: ActionBase[] = [];

    public static Create(step: FightStep): TUserSkillAction {
        const atkAction = new TUserSkillAction();
        atkAction.mStep = step;
        atkAction.executeType = step.ET;
        return atkAction;
    }

    public initAct(): void {
        super.initAct();
        this.doParse();
    }

    private doParse() {
        const model = ModelMgr.I.BattleModel;
        const step = this.mStep;
        const skillId = this.mStep.S;
        const actions: FightStep[] = step.FS;
        const atkEntity = this.mWar.getEntity(step.P);
        const animId = atkEntity.bodyRes() as number;
        const skillActionId = model.getSkillActionId(skillId, animId);
        this.mList = BattleTurnDataParse.ParseDatas(actions, skillActionId);

        const actCfg: Cfg_SkillActions = model.getSkillActionCfg(skillActionId);
        if (actCfg) {
            const actList: ActionBase[] = [];
            const actStarList: ActionBase[] = [];

            if (actCfg.StartEffId) {
                // 施法特效
                const act2 = UnitFuncAction.Create(() => {
                    let isDown = false;
                    if (UtilBattle.I.isUpCamp(step.P)) {
                        isDown = true;
                    }
                    const d = SkillEffect.I.getEffIdAndTargerPosType(`${actCfg.StartEffId}`);
                    const info = SkillEffect.I.getEffPosAndZOrder(d.posType, step.P);
                    const eff = SkillEffect.I.PlayCastEff(info.nd, d.effId, isDown);
                    eff.setPosition(info.p);
                });
                // actList.push(act2);
                actStarList.push(act2);
            }
            if (actCfg.StartWordEffId) {
                // 技能名飘字
                const atkUnit: FightUnit = atkEntity.FightUnit;
                const skillName = model.getSkillName(skillId);
                const tpos: cc.Vec2 = UtilBattle.I.getPosVec2(step.P);
                const act1 = UnitPlayWordAction.Create(skillName, actCfg.StartWordEffId, atkUnit, tpos);
                // actList.push(act1);
                actStarList.push(act1);
            }

            if (actStarList.length) {
                const act = UnitParallelAction.Create(actStarList);
                actList.push(act);
                const SkillNameTime = UtilBattle.I.getFightAtkTime(AtkTimeKey.SkillNameTime);
                actList.push(UnitDelayAction.Create(SkillNameTime));
            }

            if (actCfg.AtkType === AtkType.Short) { // 近战
                for (let index = 0; index < this.mList.length; index++) {
                    const atkAct = this.mList[index];
                    const act3 = TShortAtkAction.Create(step, skillActionId, atkAct as TAtkAction);
                    actList.push(act3);
                }
            } else if (actCfg.AtkType === AtkType.Long) { // 远程
                if (this.executeType === ExecuteType.Parallel) {
                    const act4 = TLongAtkAction.Create(step, skillActionId, this.mList as TAtkAction[]);
                    actList.push(act4);
                } else {
                    for (let i = 0; i < this.mList.length; i++) {
                        const atkAct = this.mList[i];
                        const act4 = TLongAtkAction.Create(step, skillActionId, [atkAct] as TAtkAction[]);
                        actList.push(act4);
                    }
                }
            } else if (actCfg.AtkType === AtkType.Centre) { // 屏幕中心
                const act5 = TSceneCentreAtkAction.Create(step, skillActionId, this.mList as TAtkAction[]);
                actList.push(act5);
            }

            this.pushAction(actList);

            const str = `${step.P}号位使用技能${step.S}发起攻击>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`;
            BattleMgr.I.log(str);
        } else {
            const AtkEndTime = UtilBattle.I.getFightAtkTime(AtkTimeKey.AtkEndTime);
            this.mList.push(UnitDelayAction.Create(AtkEndTime - 100));
            this.pushAction(this.mList);
            const str = `${step.P}号位发起攻击>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`;
            BattleMgr.I.log(str);
        }

        // this.executeType = ExecuteType.Series;
        // this.executeType = ExecuteType.Parallel;
    }
}
