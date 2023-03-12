/*
 * @Author: hrd
 * @Date: 2022-06-16 17:05:26
 * @FilePath: \SanGuo\assets\script\game\battle\actions\base\UnitParallelAction.ts
 * @Description: 并联行为 （并列执行）
 *
 */

import { ExecuteType } from '../../WarConst';
import { ActionBase } from './ActionBase';
/** 并联行为 */
export class UnitParallelAction extends ActionBase {
    public static Create(list: ActionBase[]): UnitParallelAction {
        const action = new UnitParallelAction();
        action.pushAction(list);
        action.executeType = ExecuteType.Parallel;
        return action;
    }
}
