/*
 * @Author: myl
 * @Date: 2023-02-08 18:10:10
 * @Description:
 */
import { i18n, Lang } from '../../../../i18n/i18n';
import { TabData } from '../../../com/tab/TabData';
import { WinTabPageView } from '../../../com/win/WinTabPageView';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';
import { ResRecoveryType } from '../DailyTaskConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResRecoveryPage extends WinTabPageView {
    public tabPages(): TabData[] {
        return [
            {
                id: ResRecoveryType.Res,
                title: i18n.tt(Lang.res_recovery_title),
                uiPath: UI_PATH_ENUM.ResRecoveryView,
                redId: RID.DailyTask.ResRecovery.Res,
            },
            {
                id: ResRecoveryType.Func,
                title: i18n.tt(Lang.func_recovery_title),
                uiPath: UI_PATH_ENUM.ResRecoveryView,
                redId: RID.DailyTask.ResRecovery.Func,
            },
        ];
    }
    // public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
    //     super.init(winId, param, tabIdx, tabId);
    // }
}
