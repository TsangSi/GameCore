/*
 * @Author: kexd
 * @Date: 2022-07-04 11:19:04
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\title\v\TitleWin.ts
 * @Description:
 *
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';
import { TitlePageType } from '../TitleConst';

const { ccclass } = cc._decorator;

@ccclass
export default class TitleWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: TitlePageType.Title,
                className: 'TitlePage',
                prefabPath: UI_PATH_ENUM.TitlePage,
                funcId: FuncId.Title,
                redId: RID.Role.Role.Title,
            },
        ];
        return tabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(...param: unknown[]): void {
        // 其他初始化逻辑
    }
}
