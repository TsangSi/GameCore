/*
 * @Author: zs
 * @Date: 2022-06-06 11:12:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-23 11:01:32
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\recharge\v\RechargeWin.ts
 * @Description:
 *
 */

import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';

const { ccclass } = cc._decorator;

@ccclass
export default class RechargeWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: 1,
                className: 'RechargePage',
                TabBtnId: TabBtnId.RechargeWin,
                prefabPath: UI_PATH_ENUM.RechargePage,

            },

        ];
        return tabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(param: unknown[]): void {
        // 其他初始化逻辑
    }
}
