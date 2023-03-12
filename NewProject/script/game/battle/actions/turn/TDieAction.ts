import { BattleTurnDataParse } from '../../BattleTurnDataParse';
import { ActionType, ExecuteType } from '../../WarConst';
import { ActionBase } from '../base/ActionBase';

/*
 * @Author: hrd
 * @Date: 2023-03-09 11:09:47
 * @Description:
 *
 */
export class TDieAction extends ActionBase {
    public mType = ActionType.Damage;
    public target: number;
    public type: number; // DamageTypes;
    public value: number;
    private mStep: FightStep;

    public static Create(step: FightStep): TDieAction {
        const action = new TDieAction();
        action.executeType = ExecuteType.Series;
        action.mStep = step;
        action.parseData();
        return action;
    }

    /** 初始化触发器 */
    private parseData() {
        const actions = BattleTurnDataParse.ParseDatas(this.mStep.FS);
        if (this.mStep.ET) this.executeType = this.mStep.ET;
        if (actions && actions.length) {
            this.pushAction(actions);
        }
    }

    public initAct(): void {
        this.play();
    }

    public play(): void {
        const step = this.mStep;
        const tagEntity = this.mWar.getEntity(step.TP);
        if (!(tagEntity && cc.isValid(tagEntity))) {
            return;
        }

        tagEntity.mAi.doDie();
    }
}
