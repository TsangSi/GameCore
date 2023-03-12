import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';
import { FamilyTaskType } from '../FamilyConst';

const { ccclass } = cc._decorator;
/** 世家事务 */
@ccclass
export class FamilyTaskWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        return [
            {
                TabId: FamilyTaskType.FamilyTaskPage,
                className: 'FamilyTaskPage',
                prefabPath: UI_PATH_ENUM.FamilyTaskPage,
                redId: RID.Family.FamilyHome.Family.FamilyFamily.FamilyTask,
                funcId: FuncId.FamilyTask,
            },
        ];
    }

    public initWin(...param: unknown[]): void {
        //
    }
}
