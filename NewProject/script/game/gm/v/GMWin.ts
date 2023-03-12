/*
 * @Author: hwx
 * @Date: 2022-06-08 17:11:13
 * @FilePath: \SanGuo-2.4-main\assets\script\game\gm\v\GMWin.ts
 * @Description: GM窗口
 */
import { IWinTabData } from '../../../app/core/mvc/WinConst';
import WinTabFrame from '../../com/win/WinTabFrame';
import { TabBtnId } from '../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../const/UIPath';

const { ccclass } = cc._decorator;

@ccclass
export default class GMWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: 1,
                className: 'GMQuickPage',
                prefabPath: UI_PATH_ENUM.GMQuickPage,
                TabBtnId: TabBtnId.Bag,
            },
            {
                TabId: 2,
                className: 'GMCommandPage',
                prefabPath: UI_PATH_ENUM.GMCommandPage,
                TabBtnId: TabBtnId.Bag,
            },
        ];
        return tabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(param: unknown[]): void {
        // 其他初始化逻辑
    }
}
