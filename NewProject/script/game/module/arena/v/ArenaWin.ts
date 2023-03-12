/*
 * @Author: hwx
 * @Date: 2022-07-20 23:25:04
 * @Description:
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { FuncDescConst } from '../../../const/FuncDescConst';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';
import { EArenaTabId } from '../ArenaConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArenaWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        const tabDataArr: IWinTabData[] = [
            {
                TabId: EArenaTabId.Areana,
                className: 'ArenaPage',
                funcId: FuncId.Arena,
                prefabPath: UI_PATH_ENUM.ArenaPage,
                redId: RID.Arena.Arena,
            },
            {
                TabId: EArenaTabId.RankMatch,
                className: 'RankMatchPage',
                funcId: FuncId.RankMatch,
                prefabPath: UI_PATH_ENUM.RankMatchPage,
                redId: RID.Arena.RankMatch.Id,
                descId: FuncDescConst.RankMatch,
            },

        ];
        return tabDataArr;
    }
    public initWin(param: unknown[]): void {
        // 其他初始化逻辑
    }

    public refreshView(param: unknown[]): void {
        this.WinTab.reTabWin.apply(this.WinTab, param);
    }
}
