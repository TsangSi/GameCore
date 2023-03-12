/*
 * @Author: hrd
 * @Date: 2022-07-18 15:06:57
 * @FilePath: \SanGuo\assets\script\game\battle\actions\turn\TBuffAction.ts
 * @Description: buff行为
 *
 */

import EntityBattle from '../../../entity/EntityBattle';
import ModelMgr from '../../../manager/ModelMgr';
import { BattleMgr } from '../../BattleMgr';
import { UtilBattle } from '../../util/UtilBattle';
import { ActionType } from '../../WarConst';
import { ActionBase } from '../base/ActionBase';
import { UnitPlayWordAction } from '../base/UnitPlayWordAction';

export class TBuffAction extends ActionBase {
    public mType = ActionType.Buff;
    public mStep: FightStep;
    public static Create(step: FightStep): TBuffAction {
        const action = new TBuffAction();
        action.mStep = step;
        return action;
    }

    public onEnter(): void {
        super.onEnter();
        this.exeBuff();
    }

    /** 执行buff */
    private exeBuff() {
        const _step = this.mStep;
        const mEntity = this.mWar.getEntity(_step.TP);
        if (!(mEntity && cc.isValid(mEntity))) {
            return;
        }
        const buffId = Number(_step.PARAM);
        const buffEffId = _step.EK; // buff 类型
        const buffVal = _step.EV; // buff 值
        if (buffVal > 0) {
            mEntity.mAi.addBuff(buffId, buffEffId, buffVal);
            this.playWord(buffEffId, buffVal, mEntity);
        } else {
            let isRemoveAll = false;
            if (Number(buffVal) === -1) {
                isRemoveAll = true;
            }
            mEntity.mAi.removeBuff(buffId, buffEffId, isRemoveAll);
        }

        const str = `--${this.mStep.TP}号位执行Buff,buffId:${buffId} BuffEffId:${buffEffId} 值:${buffVal}，攻击者${this.mStep.P}号位`;
        BattleMgr.I.log(str);
    }

    private playWord(buffEffId: number, buffVal: number, mEntity: EntityBattle) {
        const _step = this.mStep;
        const cfg: Cfg_BuffClint = ModelMgr.I.BattleModel.getClintBuffCfg(buffEffId);
        if (cfg && cfg.WordEffId) {
            // 需要飘字
            const strVal = ModelMgr.I.BattleModel.getWordStrByEffId(cfg.WordEffId, buffVal);
            const tpos: cc.Vec2 = UtilBattle.I.getPosVec2(_step.TP);
            const tagUnit: FightUnit = mEntity.FightUnit;
            const act1 = UnitPlayWordAction.Create(strVal, cfg.WordEffId, tagUnit, tpos, mEntity);
            act1.execute(this.mWar);
        }
    }
}
