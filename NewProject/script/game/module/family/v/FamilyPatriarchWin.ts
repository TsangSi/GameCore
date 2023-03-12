import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { FuncDescConst } from '../../../const/FuncDescConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { FamilyPatriarchPageType } from '../FamilyConst';

const { ccclass } = cc._decorator;
/** 特权争夺 */
@ccclass
export class FamilyPatriarchWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        return [
            {
                TabId: FamilyPatriarchPageType.FamilyPatriarchPage,
                className: 'FamilyPatriarchPage',
                prefabPath: UI_PATH_ENUM.FamilyPatriarchPage,
                // redId: RID.Stage.Main.Id,
                funcId: FuncId.FamilyPatriarch,
                descId: FuncDescConst.FamilyPatriarch,
            },
            {
                TabId: FamilyPatriarchPageType.FamilyPatriarchRankPage,
                className: 'FamilyPatriarchRankPage',
                prefabPath: UI_PATH_ENUM.FamilyPatriarchRankPage,
                // redId: RID.Stage.Main.Id,
                funcId: FuncId.FamilyPatriarchRank,
            },
        ];
    }

    public initWin(...param: unknown[]): void {
        //
    }
}
