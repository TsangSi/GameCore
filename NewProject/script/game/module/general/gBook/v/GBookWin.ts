/*
 * @Author: kexd
 * @Date: 2022-12-07 10:45:40
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gBook\v\GBookWin.ts
 * @Description: 武将-图鉴
 *
 */

import { IWinTabData } from '../../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../../com/win/WinTabFrame';
import { FuncId } from '../../../../const/FuncConst';
import { TabBtnId } from '../../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { RID } from '../../../reddot/RedDotConst';
import { GBookPageType } from '../GBookConst';

const { ccclass } = cc._decorator;

@ccclass
export default class GBookWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: GBookPageType.Book,
                className: 'GBookPage',
                prefabPath: UI_PATH_ENUM.GBookPage,
                TabBtnId: TabBtnId.GeneralBook,
            },
            {
                TabId: GBookPageType.Compose,
                className: 'GComposePage',
                prefabPath: UI_PATH_ENUM.GComposePage,
                redId: RID.General.Main.Compose,
                funcId: FuncId.GeneralCompose,
            },
        ];
        return tabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(...param: unknown[]): void {
        // 其他初始化逻辑
    }
}
