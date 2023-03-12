/*
 * @Author: hrd
 * @Date: 2022-06-16 17:11:20
 * @FilePath: \SanGuo\assets\script\game\battle\actions\base\UnitSeriesAction.ts
 * @Description: 串联行为 (顺序执行)
 *
 */

import { ExecuteType } from '../../WarConst';
import { ActionBase } from './ActionBase';

export class UnitSeriesAction extends ActionBase {
    public static CreateList(list: ActionBase[]): UnitSeriesAction {
        const action = new UnitSeriesAction();
        action.pushAction(list);
        action.executeType = ExecuteType.Series;
        return action;
    }
}
