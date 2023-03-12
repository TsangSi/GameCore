/*
 * @Author: kexd
 * @Date: 2022-06-23 20:16:31
 * @FilePath: \SanGuo\assets\script\game\module\boss\v\BossWin.ts
 * @Description:
 *
 */

import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { bossTabDataArr } from '../BossConst';

const { ccclass } = cc._decorator;

@ccclass
export default class BossWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        return bossTabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(...param: unknown[]): void {
        // 其他初始化逻辑
    }

    public refreshView(param: unknown[]): void {
        this.WinTab.reTabWin.apply(this.WinTab, param);
    }
}
