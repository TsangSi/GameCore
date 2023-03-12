/*
 * @Author: kexd
 * @Date: 2022-09-22 16:45:28
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\general\gskin\v\GskinWin.ts
 * @Description:
 */

import { IWinTabData } from '../../../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../../../i18n/i18n';
import WinTabFrame from '../../../../com/win/WinTabFrame';
import { FuncId } from '../../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { RID } from '../../../reddot/RedDotConst';
import { GskinPageType } from '../GskinConst';

const { ccclass } = cc._decorator;

@ccclass
export default class GskinWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: GskinPageType.Skin,
                className: 'GskinPage',
                prefabPath: UI_PATH_ENUM.GskinPage,

                redId: RID.General.Main.Gskin,
                funcId: FuncId.GeneralSkin,
            },
        ];
        return tabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(...param: unknown[]): void {
        // 其他初始化逻辑
    }
}
