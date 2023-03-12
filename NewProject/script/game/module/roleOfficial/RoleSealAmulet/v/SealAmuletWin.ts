/*
 * @Author: myl
 * @Date: 2022-10-11 22:10:56
 * @Description:
 */

import { IWinTabData } from '../../../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../../../i18n/i18n';
import UtilFunOpen from '../../../../base/utils/UtilFunOpen';
import WinTabFrame from '../../../../com/win/WinTabFrame';
import { FuncId } from '../../../../const/FuncConst';
import { FuncDescConst } from '../../../../const/FuncDescConst';
import { TabBtnId } from '../../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { RID } from '../../../reddot/RedDotConst';
import { RedDotMgr } from '../../../reddot/RedDotMgr';
import { SealAmuletContentType, SealAmuletType } from '../SealAmuletConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        const tabs: IWinTabData[] = [];
        if (UtilFunOpen.isOpen(FuncId.OfficialSeal)) {
            tabs.push({
                TabId: SealAmuletType.Seal,
                className: 'SealAmuletPage',
                TabBtnId: TabBtnId.OfficialSeal,
                prefabPath: UI_PATH_ENUM.SealAmuletPage,
                descId: FuncDescConst.OfficialSeal,
                redId: RID.Role.RoleOfficial.Official.SealAmulet.Seal.Id,
            });
        }
        if (UtilFunOpen.isOpen(FuncId.OfficialAmulet)) {
            tabs.push({
                TabId: SealAmuletType.Amulet,
                className: 'SealAmuletPage',
                TabBtnId: TabBtnId.OfficialAmulet,
                prefabPath: UI_PATH_ENUM.SealAmuletPage,
                descId: FuncDescConst.OfficialAmulet,
                redId: RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Id,
            });
        }
        return tabs;
    }

    public initWin(...param: unknown[]): void {
        //
    }
}
