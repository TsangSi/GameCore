/*
 * @Author: kexd
 * @Date: 2023-02-01 15:26:49
 * @FilePath: \SanGuo2.4\assets\script\game\module\daily\DailyWin.ts
 * @Description: 日常
 *
 */

import { EMarkType, IWinTabData } from '../../../app/core/mvc/WinConst';
import WinTabFrame from '../../com/win/WinTabFrame';
import { DailyTabDataArr, EDailyPageType } from './DailyConst';
import ModelMgr from '../../manager/ModelMgr';

const { ccclass } = cc._decorator;

@ccclass
export default class DailyWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        return DailyTabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(param: unknown[]): void {
        // console.log('DailyWin----------initWin');
        //
        const tab: number = DailyTabDataArr.findIndex((v) => v.TabId === EDailyPageType.Escort);
        const isDoubelTime = ModelMgr.I.EscortModel.isInDoubleTime();
        const markType = isDoubelTime ? EMarkType.Double : EMarkType.None;
        DailyTabDataArr[tab].markType = markType;
        this.setMark(tab, markType);
    }

    public refreshView(param: unknown[]): void {
        this.WinTab.reTabWin.apply(this.WinTab, param);
    }
}
