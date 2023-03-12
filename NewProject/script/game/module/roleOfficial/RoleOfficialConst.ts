/*
 * @Author: myl
 * @Date: 2022-10-26 10:29:36
 * @Description:
 */
import { GuideBtnIds } from '../../com/guide/GuideConst';
import { TabData } from '../../com/tab/TabData';
import { FuncDescConst } from '../../const/FuncDescConst';
import { RID } from '../reddot/RedDotConst';
import { i18n, Lang } from '../../../i18n/i18n';

export enum ERoleOfficialPageType {
    Officail = 0,
    ArmyLevel = 1,
}

/** 页签类别 */
export const RoleOfficialTabs: TabData[] = [
    {
        id: ERoleOfficialPageType.Officail,
        title: i18n.tt(Lang.roleofficial_official),
        redId: RID.Role.RoleOfficial.Official.Id,
        descId: FuncDescConst.RoleOfficial,
    },
    {
        id: ERoleOfficialPageType.ArmyLevel,
        title: i18n.tt(Lang.roleofficial_armylevel),
        redId: RID.Role.RoleOfficial.ArmyLevel.Id,
        guideId: GuideBtnIds.OfficialArmyLevel,
    },
];

/*
 * @Author: myl
 * @Date: 2022-10-13 11:19:30
 * @Description:官职常量定义
 */

export const OfficiaTitle = 'OfficiaTitle';
export const OfficiaName = 'OfficiaName';
export const OfficiaSkillIcon = 'OfficiaSkillIcon';

/** 官职经验id */

export const OfficialExpId = 16;
