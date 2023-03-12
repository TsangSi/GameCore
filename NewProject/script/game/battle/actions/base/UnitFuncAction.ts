/*
 * @Author: hrd
 * @Date: 2022-06-16 17:01:15
 * @FilePath: \SanGuo\assets\script\game\battle\actions\base\UnitFuncAction.ts
 * @Description: 回调行为
 *
 */

import { ActionReturn } from '../../WarConst';
import { ActionBase } from './ActionBase';

export class UnitFuncAction extends ActionBase {
    /** 延迟时间单位毫秒 */
    private mDelay: number;
    /** 回调函数 */
    private mFunc: ()=>void;

    public static Create(func: ()=>void, time: number = 0): UnitFuncAction {
        const action = new UnitFuncAction();
        action.mFunc = func;
        action.mDelay = time;
        return action;
    }

    public onUpdate(delta: number): ActionReturn {
        this.mDelay -= delta;
        if (this.mDelay > 0) {
            return ActionReturn.CONTINUE;
        }
        if (this.mFunc) this.mFunc();

        return ActionReturn.NEXT;
    }

    public onExit(): void {
        if (this.mFunc) this.mFunc = null;
    }
}
