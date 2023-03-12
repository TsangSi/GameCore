/*
 * @Author: hrd
 * @Date: 2022-06-26 15:16:31
 * @FilePath: \SanGuo\assets\script\game\battle\actions\turn\TSceneCentreAtkAction.ts
 * @Description: 中程攻击行为
 *
 */

import ModelMgr from '../../../manager/ModelMgr';
import { UtilBattle } from '../../util/UtilBattle';
import { AtkTimeKey, ExecuteType } from '../../WarConst';
import { ActionBase } from '../base/ActionBase';
import { UnitDelayAction } from '../base/UnitDelayAction';
import { UnitSeriesAction } from '../base/UnitSeriesAction';
import { TAtkAction } from './TAtkAction';
import { TLongAtkAction } from './TLongAtkAction';
import { TShortAtkEndAction, TShortAtkStartAction } from './TShortAtkStartAction';

export class TSceneCentreAtkAction extends ActionBase {
    private mStep: FightStep;
    private mSkillActionCfg: Cfg_SkillActions;
    private mAtkEvenes: TAtkAction[] = null;
    private mSkillActionId: number;

    public static Create(stap: FightStep, mSkillActionId: number, atkEvents?: TAtkAction[]): TSceneCentreAtkAction {
        const action = new TSceneCentreAtkAction();
        action.executeType = ExecuteType.Series;
        action.mStep = stap;
        action.mSkillActionId = mSkillActionId;
        action.mSkillActionCfg = ModelMgr.I.BattleModel.getSkillActionCfg(mSkillActionId);
        action.mAtkEvenes = atkEvents;
        return action;
    }

    public initAct(): void {
        super.initAct();
        this.parseData();
    }

    public parseData(): void {
        const _step = this.mStep;
        const extActList = [];
        const actList = [];
        const act0 = TShortAtkStartAction.Create(_step, UtilBattle.SceneCentrePos); // 移动到屏幕中心
        actList.push(act0);
        const act1 = TLongAtkAction.Create(this.mStep, this.mSkillActionId, this.mAtkEvenes);
        actList.push(act1);
        const AtkStayTime = UtilBattle.I.getFightAtkTime(AtkTimeKey.AtkStayTime);
        const act4 = UnitDelayAction.Create(AtkStayTime);
        actList.push(act4);
        const act2 = TShortAtkEndAction.Create(_step);
        actList.push(act2);
        const act3 = UnitSeriesAction.CreateList(actList);
        extActList.push(act3);
        this.pushAction(extActList);
    }
}
