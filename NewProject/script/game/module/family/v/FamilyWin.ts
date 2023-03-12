import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';
import { FamilyPageType } from '../FamilyConst';

const { ccclass } = cc._decorator;

@ccclass
export class FamilyWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        return [
            {
                TabId: FamilyPageType.FamilyFamilyPage, // 世家-世家
                className: 'FamilyFamilyPage',
                // TabBtnId: TabBtnId.FamilyFamilyPage,
                prefabPath: UI_PATH_ENUM.FamilyFamilyPage,
                redId: RID.Family.FamilyHome.Family.FamilyFamily.Id,
                funcId: FuncId.FamilyFamily,
            },
            {
                TabId: FamilyPageType.FamilyMemberPage, // 世家-成员
                className: 'FamilyMemberPage',
                // TabBtnId: TabBtnId.FamilyMemberPage,
                prefabPath: UI_PATH_ENUM.FamilyMemberPage,
                redId: RID.Family.FamilyHome.Family.FamilyMember,
                funcId: FuncId.FamilyMember,
            },
            {
                TabId: FamilyPageType.FamilyDrillGroundPage, // 世家-校场
                className: 'FamilyDrillGroundPage',
                // TabBtnId: TabBtnId.FamilyMemberPage,
                prefabPath: UI_PATH_ENUM.FamilyDrillGroundPage,
                redId: RID.Family.FamilyHome.Family.FamilyDrillGround,
                funcId: FuncId.FamilyDrillGround,
            },
            {
                TabId: FamilyPageType.FamilyTotemPage, // 世家-图腾
                className: 'FamilyTotemPage',
                // TabBtnId: TabBtnId.FamilyTotemPage,
                prefabPath: UI_PATH_ENUM.FamilyTotemPage,
                redId: RID.Family.FamilyHome.Family.FamilyTotem,
                funcId: FuncId.FamilyTotem,
            },
        ];
    }

    public initWin(...param: unknown[]): void {
        //
    }
}
