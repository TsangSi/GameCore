/*
 * @Author: kexd
 * @Date: 2022-06-14 16:11:10
 * @FilePath: \SanGuo2.4\assets\script\game\module\roleSkills\RoleSkillConst.ts
 * @Description: 角色技能常量
 *
 */

import { TabData } from '../../com/tab/TabData';
import { RID } from '../reddot/RedDotConst';
import { FuncId } from '../../const/FuncConst';
import { i18n, Lang } from '../../../i18n/i18n';

export enum ERoleSkillPageType {
    /** 技能 */
    Skill = 0,
    /** 绝学 */
    UniqueSkill = 1,
    /** 武艺 */
    MartialSkill = 2,
    /** 有新页签往下添加 */
}

/** 页签类别 */
export const RoleSkillPageTabs: TabData[] = [
    {
        id: ERoleSkillPageType.Skill,
        title: i18n.tt(Lang.rskill_item_tab_skill),
        redId: RID.Role.RoleSkill.Skill,
        funcId: FuncId.RoleSkill,
    },
    {
        id: ERoleSkillPageType.UniqueSkill,
        title: i18n.tt(Lang.rskill_item_tab_unique),
        redId: RID.Role.RoleSkill.UniqueSkill,
        funcId: FuncId.RoleUniqueSkill,
    },
    {
        id: ERoleSkillPageType.MartialSkill,
        title: i18n.tt(Lang.rskill_item_tab_martial),
        redId: RID.Role.RoleSkill.MartialSkill,
        funcId: FuncId.RoleMaritialSkill,
        descId: 100,
    },
    /** 有新页签往下添加 */
];
