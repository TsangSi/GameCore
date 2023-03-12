/*
 * @Author: hrd
 * @Date: 2022-06-26 15:09:22
 * @FilePath: \SanGuo\assets\script\game\battle\actions\turn\TShortAtkAction.ts
 * @Description: 近程攻击行为
 *
 */

import { AtkTimeKey, ExecuteType } from '../../WarConst';
import { ActionBase } from '../base/ActionBase';
import { TAtkAction } from './TAtkAction';
import { TShortAtkEndAction } from './TShortAtkStartAction';
import { TExeAtkAction } from './TExeAtkAction';
import { UnitDelayAction } from '../base/UnitDelayAction';
import { UtilBattle } from '../../util/UtilBattle';
import ModelMgr from '../../../manager/ModelMgr';

export class TShortAtkAction extends ActionBase {
    private mStep: FightStep;
    private mSkillActionCfg: Cfg_SkillActions;
    private mAtkEvenes: TAtkAction = null;
    private mSkillActionId: number;

    public static Create(stap: FightStep, mSkillActionId: number, atkEvents?: TAtkAction): TShortAtkAction {
        const action = new TShortAtkAction();
        action.mStep = stap;
        action.mAtkEvenes = atkEvents;
        action.executeType = ExecuteType.Series;
        action.mSkillActionId = mSkillActionId;
        action.mSkillActionCfg = ModelMgr.I.BattleModel.getSkillActionCfg(mSkillActionId);
        return action;
    }

    public initAct(): void {
        super.initAct();
        this.parseData();
    }

    public parseData(): void {
        const _hitStep = this.mAtkEvenes.mStep;
        const _atkPos = _hitStep.P; // 攻击者位置
        const atkEntity = this.mWar.getEntity(_atkPos);
        const event = this.mAtkEvenes;
        // 执行攻击
        const act1 = TExeAtkAction.Create(atkEntity, this.mSkillActionId, event.mHitActinList);
        this.pushAction(act1);
        const AtkStayTime = UtilBattle.I.getFightAtkTime(AtkTimeKey.AtkStayTime);
        const act4 = UnitDelayAction.Create(AtkStayTime);
        this.pushAction(act4);
        // 攻击完毕返回原位
        const act2 = TShortAtkEndAction.Create(_hitStep);
        this.pushAction(act2);
        const AtkEndTime = UtilBattle.I.getFightAtkTime(AtkTimeKey.AtkEndTime);
        const act3 = UnitDelayAction.Create(AtkEndTime);
        this.pushAction(act3);
    }
}
