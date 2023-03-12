/*
 * @Author: myl
 * @Date: 2022-12-26 14:27:29
 * @Description:
 */

import { IWinTabData } from '../../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../../com/win/WinTabFrame';
import { FuncId } from '../../../../const/FuncConst';
import { FuncDescConst } from '../../../../const/FuncDescConst';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { RID } from '../../../reddot/RedDotConst';
import { ERoleSkinPageIndex } from '../../v/RoleSkinConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleSpecialSuitWin extends WinTabFrame {
    public initWin(...param: unknown[]): void {
        //
    }

    public getTabData(): IWinTabData[] {
        return [
            {
                TabId: ERoleSkinPageIndex.SpecialSuit,
                funcId: FuncId.SkinSpecialSuit,
                className: 'RoleSpecialSuitPage',
                prefabPath: UI_PATH_ENUM.RoleSpecialSuitPage,
                redId: RID.Role.Role.SpecialSuit.Id,
                descId: FuncDescConst.SpecialSkin,
            },
        ];
    }
}
