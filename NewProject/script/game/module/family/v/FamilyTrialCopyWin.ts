import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';
import { FamilyTrialPageType } from '../FamilyConst';

const { ccclass } = cc._decorator;
/** 试炼副本 */
@ccclass
export class FamilyTrialCopyWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        return [
            {
                TabId: FamilyTrialPageType.FamilyTrialCopyPage,
                className: 'FamilyTrialCopyPage',
                prefabPath: UI_PATH_ENUM.FamilyTrialCopyPage,
                redId: RID.Family.FamilyHome.Family.FamilyFamily.FamilyFb,
                funcId: FuncId.FamilyTrialCopy,
            },
        ];
    }
    public initWin(...param: unknown[]): void {
        //
    }
}
