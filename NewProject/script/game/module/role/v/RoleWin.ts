/*
 * @Author: hrd
 * @Date: 2022-04-08 16:37:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-27 14:29:58
 * @FilePath: \SanGuo2.4\assets\script\game\module\role\v\RoleWin.ts
 * @Description:
 *
 */

import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import { GuideBtnIds } from '../../../com/guide/GuideConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import { RID } from '../../reddot/RedDotConst';
import { RolePageType } from '../RoleConst';

const { ccclass } = cc._decorator;

@ccclass
export default class RoleWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        const tabDataArr: IWinTabData[] = [
            {
                TabId: RolePageType.Role,
                className: 'RolePage',
                prefabPath: UI_PATH_ENUM.RolePage,

                redId: RID.Role.Role.Id,
                funcId: FuncId.Role,
            },
            {
                TabId: RolePageType.Skill,
                className: 'RoleSkillPage',
                prefabPath: UI_PATH_ENUM.RoleSkillPage,

                redId: RID.Role.RoleSkill.Id,
                funcId: FuncId.RoleSkillOnetab,
                guideId: GuideBtnIds.RoleSkill,
            },
            {
                TabId: RolePageType.RoleOfficial,
                className: 'RoleArmyOfficialPage',
                prefabPath: UI_PATH_ENUM.RoleArmyOfficialPage,
                redId: RID.Role.RoleOfficial.Id,
                funcId: FuncId.RoleArmyOfficial,

                guideId: GuideBtnIds.RoleOfficial,
            },
        ];
        return tabDataArr;
    }

    public initWin(...param: unknown[]): void {
        // 其他初始化逻辑
    }

    public refreshView(param: unknown[]): void {
        this.WinTab.reTabWin.apply(this.WinTab, param);
    }
}
