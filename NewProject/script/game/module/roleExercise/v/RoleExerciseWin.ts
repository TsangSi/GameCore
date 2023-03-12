import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { FuncId } from '../../../const/FuncConst';
import { FuncDescConst } from '../../../const/FuncDescConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';

const { ccclass, property } = cc._decorator;

/** 角色套装分类 */
enum RoleExercisePageIndex {
    /** 炼体 */
    RoleExercisePage = 0,
}

@ccclass
export default class RoleExerciseWin extends WinTabFrame {
    public initWin(...param: unknown[]): void {
        //
    }

    public getTabData(): IWinTabData[] {
        return [
            {
                TabId: RoleExercisePageIndex.RoleExercisePage,
                funcId: FuncId.RoleExercise,
                className: 'RoleExercisePage',
                prefabPath: UI_PATH_ENUM.RoleExercisePage,
                // redId: RID.Role.Role.SpecialSuit.Id,
                descId: FuncDescConst.RoleExercise,
            },
        ];
    }
}
