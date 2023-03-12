/*
 * @Author: hrd
 * @Date: 2022-04-08 16:37:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-29 11:11:46
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\bag\v\BagWin.ts
 * @Description:
 *
 */

import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { BagWinTabType } from '../BagConst';
import { RID } from '../../reddot/RedDotConst';
import ModelMgr from '../../../manager/ModelMgr';
import { FuncId } from '../../../const/FuncConst';

const { ccclass } = cc._decorator;

@ccclass
export default class BagWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: BagWinTabType.BAG,
                className: 'BagPage',
                prefabPath: UI_PATH_ENUM.BagPage,

                redId: RID.Bag.Item,
                funcId: FuncId.Bag,
            },
            {
                TabId: BagWinTabType.EMAIL,
                className: 'MailPage',
                prefabPath: UI_PATH_ENUM.MailPage,

                redId: RID.Bag.Mail.Id,
                funcId: FuncId.Mail,
            },
            {
                TabId: BagWinTabType.Material,
                className: 'MergeMatPage',
                prefabPath: UI_PATH_ENUM.MergeMatPage,

                redId: RID.Bag.MergeMat,
                funcId: FuncId.Material,
            },
        ];
        return tabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(...param: unknown[]): void {
        // 其他初始化逻辑
        ModelMgr.I.MailModel.checkMailRed();
    }
}
