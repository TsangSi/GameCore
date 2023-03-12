/*
 * @Author: hrd
 * @Date: 2022-06-16 16:57:20
 * @FilePath: \SanGuo\assets\script\game\battle\actions\base\UnitDelayAction.ts
 * @Description: 延时动作
 *
 */

import { ActionReturn } from '../../WarConst';
import { ActionBase } from './ActionBase';

/** 延时动作  */
export class UnitDelayAction extends ActionBase {
    /** 延迟时间单位毫秒 */
    public mDelay: number = 0;

    public static Create(delay: number): UnitDelayAction {
        const action = new UnitDelayAction();
        action.mDelay = delay;
        return action;
    }

    public onUpdate(delta: number): ActionReturn {
        this.mDelay -= delta;
        if (this.mDelay > 0) {
            return ActionReturn.CONTINUE;
        }
        return ActionReturn.NEXT;
    }
}
