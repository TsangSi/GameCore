import { i18n, Lang } from '../../../i18n/i18n';
/*
 * @Author: kexd
 * @Date: 2022-06-14 16:11:10
 * @FilePath: \SanGuo\assets\script\game\com\attr\AttrFvConst.ts
 * @Description: 属性key常量
 *
 */

// 服务端的
export enum EAttrKey {
    AttrKey_AllAttr = 2100000000, // 总属性<划分的属性Key不能超过这个>

    // 角色装备
    AttrKey_RoleEquip = 100000000, // 玩家装备属性Key
    AttrKey_RoleEquipBaseAttr = 100100000, // 玩家装备基础属性
    AttrKey_RoleEquipAddAttr = 100200000, // 玩家装备附加属性
    AttrKey_RoleEquipPosStrengthAttr = 100300000, // 玩家装备格属性
    AttrKey_RoleEquipPosResonateAttr = 100400000, // 玩家装备格共鸣属性

    // 角色称号
    AttrKey_RoleTitle = 200000000, // 玩家称号属性Key
    AttrKey_RoleTitleStarAttr = 200100000, // 玩家称号星级属性

    // 角色技能
    AttrKey_RoleSkill = 210000000, // 角色技能属性
    AttrKey_RoleSkillBaseAttr = 210100000, // 角色技能基础属性

    // 角色等级
    AttrKey_RoleLevel = 220000000, // 角色等级属性
    AttrKey_RoleLevelBaseAttr = 220100000, // 角色等级基础属性
    // 军衔
    AttrKey_RoleArmyBaseAttr = 230000000, // 军衔属性
    AttrKey_RoleArmyAttr = 230100000, // 军衔属性

    // 进阶相关
    AttrKey_GradeHorse = 300000000, // 坐骑属性Key
    AttrKey_GradeHorseLv = 300100000, // 坐骑升阶属性
    AttrKey_GradeHorseSkill = 300200000, // 坐骑技能属性
    AttrKey_GradeHorseEquip = 300300000, // 坐骑装备属性
    AttrKey_GradeHorseStrengthen = 301000000, // 坐骑装备强化属性
    AttrKey_GradeHorseSoul = 300400000, // 坐骑注灵属性
    AttrKey_GradeHorseGod = 300500000, // 坐骑炼神属性
    AttrKey_GradeHorseSkin = 300600000, // 坐骑皮肤属性
    AttrKey_GradeHorseBeGold = 300700000, // 坐骑装备化金属性
    AttrKey_GradeHorseRefine = 300800000, // 坐骑淬炼属性
    AttrKey_GradeHorseChanneling = 300900000, // 坐骑通灵属性

    AttrKey_GradeWing = 310000000, // 羽翼属性Key
    AttrKey_GradeWingLv = 310100000, // 羽翼升阶属性
    AttrKey_GradeWingSkill = 310200000, // 羽翼技能属性
    AttrKey_GradeWingEquip = 310300000, // 羽翼装备属性
    AttrKey_GradeWingStrengthen = 311000000, // 羽翼装备强化属性
    AttrKey_GradeWingSoul = 310400000, // 羽翼注灵属性
    AttrKey_GradeWingGod = 310500000, // 羽翼炼神属性
    AttrKey_GradeWingSkin = 310600000, // 羽翼皮肤属性
    AttrKey_GradeWingBeGold = 310700000, // 羽翼装备化金属性
    AttrKey_GradeWingRefine = 310800000, // 羽翼淬炼属性
    AttrKey_GradeWingChanneling = 310900000, // 羽翼通灵属性

    AttrKey_GradeWeapon = 320000000, // 光武属性Key
    AttrKey_GradeWeaponLv = 320100000, // 光武升阶属性
    AttrKey_GradeWeaponSkill = 320200000, // 光武技能属性
    AttrKey_GradeWeaponEquip = 320300000, // 光武装备属性
    AttrKey_GradeWeaponStrengthen = 321000000, // 光武装备强化属性
    AttrKey_GradeWeaponSoul = 320400000, // 光武注灵属性
    AttrKey_GradeWeaponGod = 320500000, // 光武炼神属性
    AttrKey_GradeWeaponSkin = 320600000, // 光武皮肤属性
    AttrKey_GradeWeaponBeGold = 320700000, // 光武装备化金属性
    AttrKey_GradeWeaponRefine = 320800000, // 光武淬炼属性
    AttrKey_GradeWeaponChanneling = 320900000, // 光武通灵属性

    AttrKey_GradeBeauty = 330000000, // 红颜才艺属性Key
    AttrKey_GradeBeautyLv = 330100000, // 红颜才艺升阶属性
    AttrKey_GradeBeautySkill = 330200000, // 红颜才艺技能属性
    AttrKey_GradeBeautyEquip = 330300000, // 红颜才艺装备属性
    AttrKey_GradeBeautyStrengthen = 331000000, // 红颜才艺装备强化属性
    AttrKey_GradeBeautySoul = 330400000, // 红颜才艺注灵属性
    AttrKey_GradeBeautyGod = 330500000, // 红颜才艺炼神属性
    AttrKey_GradeBeautySkin = 330600000, // 红颜才艺皮肤属性
    AttrKey_GradeBeautyBeGold = 330700000, // 红颜才艺装备化金属性
    AttrKey_GradeBeautyRefine = 330800000, // 红颜才艺淬炼属性
    AttrKey_GradeBeautyChanneling = 330900000, // 红颜才艺通灵属性

    AttrKey_GradeAdviser = 340000000, // 军师智略属性Key
    AttrKey_GradeAdviserLv = 340100000, // 军师智略升阶属性
    AttrKey_GradeAdviserSkill = 340200000, // 军师智略技能属性
    AttrKey_GradeAdviserEquip = 340300000, // 军师智略装备属性
    AttrKey_GradeAdviserStrengthen = 331000000, // 军师智略装备强化属性
    AttrKey_GradeAdviserSoul = 340400000, // 军师智略注灵属性
    AttrKey_GradeAdviserGod = 340500000, // 军师智略炼神属性
    AttrKey_GradeAdviserSkin = 340600000, // 军师智略皮肤属性
    AttrKey_GradeAdviserBeGold = 340700000, // 军师智略装备化金属性
    AttrKey_GradeAdviserRefine = 340800000, // 军师智略淬炼属性
    AttrKey_GradeAdviserChanneling = 340900000, // 军师智略通灵属性

    AttrKey_GradePet = 350000000, // 萌宠属性Key
    AttrKey_GradePetLv = 350100000, // 萌宠升阶属性
    AttrKey_GradePetSkill = 350200000, // 萌宠技能属性
    AttrKey_GradePetEquip = 350300000, // 萌宠装备属性
    AttrKey_GradePetStrengthen = 351000000, // 萌宠装备强化属性
    AttrKey_GradePetSoul = 350400000, // 萌宠注灵属性
    AttrKey_GradePetGod = 350500000, // 萌宠炼神属性
    AttrKey_GradePetSkin = 350600000, // 萌宠皮肤属性
    AttrKey_GradePetBeGold = 350700000, // 萌宠装备化金属性
    AttrKey_GradePetRefine = 350800000, // 萌宠淬炼属性
    AttrKey_GradePetChanneling = 350900000, // 萌宠通灵属性

    // 时装（角色皮肤）
    AttrKey_RoleSkinAttr = 400000000, // 时装属性
    AttrKey_RoleSkinActiveAttr = 400100000, // 时装激活属性
    AttrKey_RoleSkinSuitAttr = 400200000, // 套装激活属性
    AttrKey_RoleSkinSoulAttr = 400300000, // 时装注灵属性
    AttrKey_RoleGodNumAttr = 400400000, // 时装炼神属性

    // 武将
    AttrKey_GeneralAttr = 500000000, // 武将属性
    AttrKey_GeneralBaseAttr = 500000100, // 武将基础属性
    AttrKey_GeneralLevelAttr = 500000200, // 武将等级属性

    AttrKey_GeneralPos1Attr = 500010001, // 武将出战位置 1 属性
    AttrKey_GeneralPos2Attr = 500020001, // 武将出战位置 2 属性
    AttrKey_GeneralPos3Attr = 500030001, // 武将出战位置 3 属性
    AttrKey_GeneralSkinAttr = 501000001, // 武将皮肤属性
}

export const AttrName = {
    /** 称号 */
    AttrKey_RoleTitleStarAttr: i18n.tt(Lang.attr_title) + i18n.tt(Lang.attr_add),
    /** 武将部分-基础属性 */
    AttrKey_GeneralBaseAttr: i18n.tt(Lang.attr_base),
    /** 武将部分-升级属性 */
    AttrKey_GeneralLevelAttr: i18n.tt(Lang.attr_general_lvup),
    /** 武将部分-皮肤属性 */
    AttrKey_GeneralSkinAttr: i18n.tt(Lang.attr_general_skin),
    /** 才艺进阶-化金属性 */
    AttrKey_GradeBeautyBeGold: i18n.tt(Lang.attr_grade_gold),
    /** 光武进阶-化金属性 */
    AttrKey_GradeWeaponBeGold: i18n.tt(Lang.attr_grade_gold),
    /** 坐骑进阶-化金属性 */
    AttrKey_GradeHorseBeGold: i18n.tt(Lang.attr_grade_gold),
    /** 翅膀进阶-化金属性 */
    AttrKey_GradeWingBeGold: i18n.tt(Lang.attr_grade_gold),

    /** 才艺进阶-化金属性 */
    AttrKey_GradeBeautyStrengthen: i18n.tt(Lang.attr_grade_strength),
    /** 光武进阶-化金属性 */
    AttrKey_GradeWeaponStrengthen: i18n.tt(Lang.attr_grade_strength),
    /** 坐骑进阶-化金属性 */
    AttrKey_GradeHorseStrengthen: i18n.tt(Lang.attr_grade_strength),
    /** 翅膀进阶-化金属性 */
    AttrKey_GradeWingStrengthen: i18n.tt(Lang.attr_grade_strength),
};
