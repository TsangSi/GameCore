/*
 * @Author: zs
 * @Date: 2022-07-12 16:39:41
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\roleskin\v\RoleSkinWin.ts
 * @Description:
 *
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ModelMgr from '../../../manager/ModelMgr';
import { RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { ERoleSkinPageIndex } from './RoleSkinConst';

const { ccclass } = cc._decorator;

@ccclass
export default class RoleSkinWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        const tabDataArr: IWinTabData[] = [
            {
                TabId: ERoleSkinPageIndex.Skin,
                funcId: FuncId.Skin,
                className: 'RoleSkinPage',
                prefabPath: UI_PATH_ENUM.RoleSkinPage,
                redId: RID.Role.Role.Skin.SkinPage.Id,
            },
            {
                TabId: ERoleSkinPageIndex.SkinSuit,
                funcId: FuncId.SkinSuit,
                className: 'RoleSkinSuitPage',
                prefabPath: UI_PATH_ENUM.RoleSkinSuitPage,
                redId: RID.Role.Role.Skin.SuitPage,
            },
            {
                TabId: ERoleSkinPageIndex.ActitySuit,
                funcId: FuncId.SkinHuodongSuit,
                className: 'RoleActivitySuitPage',
                prefabPath: UI_PATH_ENUM.RoleActivitySuitPage,
                redId: RID.Role.Role.Skin.ActivitySuitPage,
            },
            {
                TabId: ERoleSkinPageIndex.ExoticSuit,
                funcId: FuncId.SkinYiyuSuit,
                className: 'RoleExoticSuitPage',
                prefabPath: UI_PATH_ENUM.RoleExoticSuitPage,
                redId: RID.Role.Role.Skin.ExoticSuitPage,
            },
        ];
        return tabDataArr;
    }
    public initWin(param: unknown[]): void {
        if (RedDotMgr.I.getStatus(RID.Role.Role.Skin.Id)) {
            ModelMgr.I.RoleSkinModel.checkSuitRed();
            if (RedDotMgr.I.getStatus(RID.Role.Role.Skin.Id)) {
                ModelMgr.I.RoleSkinModel.checkZhuLingRed();
                ModelMgr.I.RoleSkinModel.checkLianShenRed();
            }
        }
    }
}
