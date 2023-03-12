/*
 * @Author: hwx
 * @Date: 2022-07-14 22:49:41
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\smelt\v\SmeltWin.ts
 * @Description:
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { SmeltViewId } from '../SmeltConst';

const { ccclass } = cc._decorator;

@ccclass
export default class SmeltWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: SmeltViewId.SIMPLE_MELT,
                className: 'SmeltPage',
                prefabPath: UI_PATH_ENUM.SmeltPage,
                funcId: FuncId.Smelt,
            },
            {
                TabId: SmeltViewId.RED_MELT,
                className: 'SmeltPage',
                prefabPath: UI_PATH_ENUM.SmeltPage,
                funcId: FuncId.RedSmelt,
            },
            {
                TabId: SmeltViewId.GRADE_MELT,
                className: 'SmeltPage',
                prefabPath: UI_PATH_ENUM.SmeltPage,
                funcId: FuncId.GradeSmelt,
            },
        ];
        return tabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(param: unknown[]): void {
        // 其他初始化逻辑
    }
}
