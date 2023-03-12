/*
 * @Author: kexd
 * @Date: 2022-12-22 18:06:04
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gBook\v\GBookDetailWin.ts
 * @Description: 图鉴-详情
 *
 */

import { IWinTabData } from '../../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../../com/win/WinTabFrame';
import { TabBtnId } from '../../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { GBookMsgType } from '../GBookConst';

const { ccclass } = cc._decorator;

@ccclass
export default class GBookDetailWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: GBookMsgType.BookMsg,
                className: 'GBookDetailPage',
                prefabPath: UI_PATH_ENUM.GBookDetailPage,
                TabBtnId: TabBtnId.BaseMsg,
            },
        ];
        return tabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(...param: unknown[]): void {
        // 其他初始化逻辑
    }
}
