/*
 * @Author: kexd
 * @Date: 2022-08-15 16:40:51
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\v\GeneralWin.ts
 * @Description:
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { generalTabDataArr } from '../GeneralConst';

const { ccclass } = cc._decorator;

@ccclass
export default class GeneralWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        return generalTabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(param: unknown[]): void {
        //
    }

    public refreshView(param: unknown[]): void {
        this.WinTab.reTabWin.apply(this.WinTab, param);
    }
}
