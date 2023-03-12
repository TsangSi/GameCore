/*
 * @Author: myl
 * @Date: 2022-08-03 20:37:41
 * @Description:
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { FuncDescConst } from '../../../const/FuncDescConst';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';
import { MaterialTabId } from '../MaterialConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class MaterialWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        const tabDataArr: IWinTabData[] = [
            {
                TabId: MaterialTabId.Material,
                className: 'MaterialPage',
                // TabBtnId: TabBtnId.MaterialPage,
                prefabPath: UI_PATH_ENUM.MaterialPage,
                funcId: FuncId.MaterialFB,
                redId: RID.MaterialFB.Material.MaterialView,
            },
            {
                TabId: MaterialTabId.Team,
                className: 'TeamPage',
                prefabPath: UI_PATH_ENUM.TeamPage,

                redId: RID.MaterialFB.Team.Id,
                funcId: FuncId.Team,
                descId: FuncDescConst.TeamFB,
            },
            {
                TabId: MaterialTabId.FBExplore,
                className: 'FBExplorePage',
                prefabPath: UI_PATH_ENUM.FBExplorePage,
                redId: RID.MaterialFB.FBExplore,
                funcId: FuncId.FBExplorePage,
                // TabBtnId: TabBtnId.FBExplore,
                descId: FuncDescConst.FBExplore,
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
