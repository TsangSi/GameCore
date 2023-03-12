/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: hrd
 * @Date: 2022-06-29 17:50:44
 * @FilePath: \SanGuo\assets\script\game\battle\actions\turn\TAtkAction.ts
 * @Description: 攻击行为
 *
 */
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import EntityBattle from '../../../entity/EntityBattle';
import { BattleTurnDataParse } from '../../BattleTurnDataParse';
import { ActionType } from '../../WarConst';
import { ActionBase } from '../base/ActionBase';

export class TAtkAction extends ActionBase {
    public mType = ActionType.ATK;
    public mStep: FightStep;

    private mSkillActionId: number;
    public mHitStep: FightStep[] = [];
    public mHitActinList: ActionBase[] = [];

    public static Create(step: FightStep, skillActionId: number): TAtkAction {
        const action = new TAtkAction();
        action.mStep = step;
        // action.executeType = step.ET;
        action.mSkillActionId = skillActionId;
        action.mHitStep = step.FS;
        action.parseData();
        return action;
    }

    /** 初始化触发器 */
    private parseData() {
        this.mHitActinList = BattleTurnDataParse.ParseDatas(this.mHitStep, this.mSkillActionId);
    }
}
