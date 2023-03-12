/*
 * @Author: hwx
 * @Date: 2022-07-06 14:43:53
 * @FilePath: \SanGuo\assets\script\game\module\grade\GradeConst.ts
 * @Description: 进阶常量
 */

import { i18n, Lang } from '../../../i18n/i18n';
import { TabData } from '../../com/tab/TabData';

export enum GradeType {
    /** 坐骑 */
    HORSE = 101,
    /** 羽翼 */
    WING = 111,
    /** 光武 */
    WEAPON = 121,
    /** 萌宠 */
    PET = 151,
}

export enum GradeTabIndex {
    /** 坐骑 */
    HORSE = 0,
    /** 羽翼 */
    WING = 2,
    /** 光武 */
    WEAPON = 1,
    /** 萌宠 */
    PET = 3,
}

export enum GradePageTabType {
    /** 升阶 */
    UP = 1,
    /** 装备 */
    EQUIP = 2,
    /** 皮肤 */
    SKIN = 3,
}

/** 进阶页道具页签类别 */
export const GradePageItemTabs: TabData[] = [
    {
        id: GradePageTabType.UP,
        title: i18n.tt(Lang.grade_page_tab_grade),
    },
    {
        id: GradePageTabType.EQUIP,
        title: i18n.tt(Lang.grade_page_tab_equip),
    },
    {
        id: GradePageTabType.SKIN,
        title: i18n.tt(Lang.grade_page_tab_skin),
    },
];

export type Cfg_Grade_Unit = Cfg_Grade_Horse | Cfg_Grade_Wing | Cfg_Grade_Weapon | Cfg_Grade_Beauty | Cfg_Grade_Pet

export type Cfg_GradeSkill_Unit = Cfg_GradeSkill_Horse | Cfg_GradeSkill_Wing | Cfg_GradeSkill_Weapon | Cfg_GradeSkill_Beauty | Cfg_GradeSkill_Pet

/** 升阶最小等级 */
export const GRADE_MIN_LEVEL = 1;
/** 升阶最大等级 */
export const GRADE_MAX_LEVEL = 10;

/** 升阶最大星级 */
export const GRADE_MAX_STAR = 10;

/** 进阶技能部位数 */
export const GRADE_SKILL_PART_NUM = 1;

/** 进阶装备部位数 */
export const GRADE_EQUIP_PART_NUM = 4;

/** 进阶装备最小品质 */
export const GRADE_EQUIP_MIN_QUALITY = 3;
/** 进阶装备最大品质 */
export const GRADE_EQUIP_MAX_QUALITY = 6;

/** 进阶强化最小等级 */
export const GRADE_STRENGTH_MIN_LEVEL = 1;
/** 进阶强化最大等级 */
export const GRADE_STRENGTH_MAX_LEVEL = 100;
/** 注灵最大等级 */
export const GRADE_SOUL_MAX_LEVEL = 30;
/** 注灵技能解锁等级 */
export const GRADE_SOUL_SKILL_UNLOCK = 10;
/** 注灵技能升级等级 */
export const GRADE_SOUL_SKILL_UP = 20;
/** 时装强化最大等级 */
export const GRADE_SKIN_MAX_LV = 9999;
