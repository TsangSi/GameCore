/*
 * @Author: wangxin
 * @Date: 2022-10-11 10:39:31
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\rankList\v\RankListWin.ts
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';
import { ERankListPageIndex } from '../RankListConst';

const { ccclass } = cc._decorator;

@ccclass
export class RankListWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        const tabDataArr: IWinTabData[] = [
            {
                TabId: ERankListPageIndex.RankListLocalPage,
                funcId: FuncId.RankListLocal,
                className: 'RankListLocalPage',

                prefabPath: UI_PATH_ENUM.RankListLocalPage,
                redId: RID.RankList.Mobai.Local,
            },
            {
                TabId: ERankListPageIndex.RankListAllPage,
                funcId: FuncId.RankListCross,
                className: 'RankListLocalPage',

                prefabPath: UI_PATH_ENUM.RankListLocalPage,
                redId: RID.RankList.Mobai.More,
            },
        ];
        return tabDataArr;
    }

    public init(param: unknown[]): void {
        super.init(param);
        console.log(param);
    }

    /** 窗口初始化回调 */
    public initWin(...param: unknown[]): void {
        // 其他初始化逻辑
    }

    public refreshView(param: unknown[]): void {
        this.WinTab.reTabWin.apply(this.WinTab, param);
    }
}
