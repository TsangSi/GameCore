/*
 * @Author: zs
 * @Date: 2022-09-22 11:41:42
 * @FilePath: \SanGuo\assets\script\game\com\guide\GuideConst.ts
 * @Description:
 */

export enum GuideBtnIds {
    /** 占位 */
    Normall = 0,
    /** 主界面-主角 */
    Role = 1,
    /** 主界面-主角-一键换装 */
    RoleOneKey = 2,
    /** 返回 */
    Black = 3,
    /** 主界面-主角-技能 */
    RoleSkill = 4,
    /** 主界面-主角-技能-一键升级 */
    RoleSkillOneKey = 5,
    /** 主界面-称号 */
    RoleTitle = 6,
    /** 主界面-称号-主角驾到-穿戴 */
    RoleTitleWear = 7,
    /** 主角-官职 */
    RoleOfficial = 8,
    /** 官职-军衔 */
    OfficialArmyLevel = 9,
    /** 官职-军衔-领取按钮 */
    OfficialArmyLevelLQ = 10,
    /** 主界面-武将 */
    General = 11,
    /** 武将-布阵 */
    GeneralFormation = 12,
    /** 武将-出战 */
    GeneralFight = 13,
    /** 武将-升级 */
    GeneralLevelUp = 14,
    /** 武将-升级-一键使用 */
    GeneralLevelOneKey = 15,
    /** 武将-升品 */
    GeneralGradeUp = 16,
    /** 升品-第一个武将 */
    GeneralGradeUp1 = 17,
    /** 升品-第二个武将 */
    GeneralGradeUp2 = 18,
    /** 升品-第三个武将 */
    GeneralGradeUp3 = 19,
    /** 升品-按钮 */
    GeneralGradeUpBtn = 20,
    /** 升品详情-确定 */
    GeneralGradeUpSure = 21,
    /** 主界面-背包 */
    Bag = 22,
    /** 背包-熔炼 */
    BagSmelt = 23,
    /** 主界面-装备 */
    Equip = 24,
    /** 装备-一键强化 */
    EquipOneKey = 25,
    /** 装备-升星 */
    EquipStarUp = 26,
    /** 升星-一键放入 */
    EquipStarUpOneKey = 27,
    /** 升星-升星按钮 */
    EquipStarUpBtn = 28,
    /** 装备-打造 */
    EquipBuild = 29,
    /** 装备-宝石 */
    EquipGem = 38,

    /** 打造-确定 */
    EquipBuildSure = 30,
    /** 主界面-副本 */
    Fuben = 31,
    /** 材料副本-坐骑-挑战 */
    MaterialFightMount = 32,
    /** 材料副本-灵气-挑战 */
    MaterialFightReiki = 33,
    /** 材料副本-光武-挑战 */
    MaterialFightKotake = 34,
    /** 材料副本-羽翼-挑战 */
    MaterialFightWing = 35,
    /** 背包-熔炼-确定熔炼 */
    BagSmeltSure = 36,
    /** 聊天栏返回 */
    ChatBack = 37,

    /** 主界面=进阶 */
    Grade = 45,
    /** 进阶-坐骑 */
    GradeMount = 46,
    /** 进阶-光武 */
    GradeReiki = 47,
    /** 进阶-羽翼 */
    GradeWing = 48,
    /** 进阶-萌宠 */
    GradePet = 49,

    /** 进阶-一键升阶 */
    GradeUpOneKey = 56,
    /** 主界面-首领 */
    Leader = 57,
    /** 本服首领-个人首领-第一个可挑战的首领-挑战按钮 */
    LeaderPersonFight = 58,
    /** 本服首领-至尊首领 */
    LeaderSupreme = 59,
    /** 至尊首领-第一个可挑战的首领-挑战按钮 */
    LeaderSupremeFight = 60,
    /** 主界面-竞技场 */
    Arena = 61,
    /** 竞技场-中间目标-挑战 */
    ArenaCenterFight = 62,
    /** 主界面-聊天栏 */
    Chat = 63,
    /** 聊天-发送 */
    ChatSend = 64,
    /** 主界面-关卡 */
    GameLevel = 65,
    /** 关卡-挑战 */
    GameLevelFight = 66,
    /** 主角-称号-第一个称号主公驾到 */
    RoleTitleFirst = 67,
    // /** 装备-打造页面-打造 */
    // EquipBuildBtn = 68,

}

// private _show(node: cc.Node, step: number, tips: string = '', direct: number = 0, staffDir: number = 0, force: boolean = false): void {
export interface ICfgBtn {
    tips: string,
    dir: number,
    staffDir: number,
    force: boolean,
}
