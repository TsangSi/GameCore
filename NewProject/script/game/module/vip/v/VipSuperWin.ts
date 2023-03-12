/*
 * @Author: myl
 * @Date: 2022-08-23 11:24:53
 * @Description:
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';

const { ccclass, property } = cc._decorator;
/** vip 和 充值 */
@ccclass
export class VipSuperWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: 0,
                className: 'RechargePage',
                TabBtnId: TabBtnId.RechargeWin,
                prefabPath: UI_PATH_ENUM.RechargePage,

            },
            {
                TabId: 1,
                className: 'VipWin',
                prefabPath: UI_PATH_ENUM.VipWin,
                // TabBtnId: TabBtnId.VipWin,
                funcId: FuncId.Vip,
                redId: RID.Vip.Vip.Id,
            },

        ];

        return tabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(param: unknown[]): void {
        // 其他初始化逻辑
    }
}
