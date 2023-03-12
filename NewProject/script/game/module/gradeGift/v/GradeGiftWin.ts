/*
 * @Author: dcj
 * @Date: 2022-10-26 10:16:05
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\gradeGift\v\GradeGiftWin.ts
 * @Description:
 */
/** import {' cc._decorator } 'from 'cc';  // */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';

const { ccclass } = cc._decorator;

@ccclass
export default class GradeGiftWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        const tabDataArr: IWinTabData[] = [
            {
                TabId: 1,
                className: 'GradeGiftPage',
                prefabPath: UI_PATH_ENUM.GradeGiftPage,
                TabBtnId: TabBtnId.Grade_GiftPage,

                redId: RID.GradeGift.Id,
            },
        ];
        return tabDataArr;
    }
    /** 窗口初始化回调 */
    public initWin(param: unknown[]): void {
        // 其他初始化逻辑
    }
}
