/*
 * @Author: zs
 * @Date: 2022-07-25 15:49:53
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\task\TaskConst.ts
 * @Description:
 */
/** 任务状态 */
export enum ETaskStatus {
    /** 0进行中 */
    Processing,
    /** 1已完成 可领取 */
    Completed,
    /** 2已领奖 */
    Awarded,
}

export interface ITask {
    /** 任务id */
    Id: number,
    /** 当前计数 */
    Count: number,
    /** 任务状态 */
    Status: ETaskStatus
}

export enum ETaskType {
    /** 主线任务 */
    Main = 0,
    /** 军衔任务 */
    Army = 1,
    /** 官职任务 */
    Official = 3,
    /** 见闻任务表 */
    CollectionBook = 4,
    /** 日常任务 */
    DailyTask = 5
}

export enum ECountType {
    /** 主角达到{0}级 */
    Level = 1,
    /** 通关章节{0} */
    GameLevel = 2,
    /** 穿戴{0}件{2}{3}{1}装备 */
    EquipWearNum = 3,
    /** {0}升至{1}阶 */
    GradeUp = 4,
    /** 累计登陆{0}天 */
    LongLoginDay = 5,
    /** 本月累计登录{0}天 */
    MonthLoginDay = 6,
    /** 角色战力达到{0} */
    FightValue = 7,
    /** 今日在线时间达到{0} */
    DayOnlineTime = 8,
    /** 累计在线时间达到{0} */
    LongOnlineTime = 9,
    /** 军衔达到【{0}】{1}级 */
    RoleArmyLevel = 10,
    /** 获得{0}只坐骑 */
    HorseCount = 11,
    /** 主角技能升级{0}次 */
    RoleSkillLevelCount = 12,
    /** 出战{0}个武将 */
    BattleGeneralCount = 13,
    /** 武将升到{0}级 */
    GeneralLevelUp = 14,
    /** 装备强化{0}次 */
    RoleEquipStrengthCount = 15,
    /** 所有技能达到{0}级 */
    RoleAllSkillLevel = 16,
    /** 全身装备强化达到{0}级 */
    RoleAllEquipStrengthLevel = 17,
    /** 累计激活{0}个{2}品质的{1}的图鉴     （小类别 */
    CollectionBookCount = 18,
    /** 至少{0}个{1}图鉴达到{2}星     （小类别 */
    CollectionBookStarCount = 19,
    /** {1}图鉴见闻总评达到{0}     （小类别 */
    CollectionBookScore = 20,
    /** 累计解锁{0}个生涯剧情插画 */
    CollectionBookUnLockCount = 21,
    /** 累计激活{0}个{2}品质的{1}的图鉴     （大类别 */
    CollectionBookCountClass = 22,
    /** 至少{0}个{1}图鉴达到{2}星     （大类别） */
    CollectionBookStarCountClass = 23,
    /** {1}图鉴见闻总评达到{0}      （大类别） */
    CollectionBookScoreClass = 24,

    /** 技能等级总和达到{0}级 */
    RoleSkillLevel = 40,
    /** 挑战{0}次{1}材料副本 */
    FightMateriaCount = 10004,
    /** 挑战{0}次个人首领 */
    FightPersonBossCount = 10005,
    /** 挑战{0}次至尊首领 */
    FightVipBossCount = 10006,
    /** 装备熔炼{0}次 */
    EquipSmeltCount = 10007,
    /** 武将升品{0}次 */
    GeneralUpQualityCount = 10008,
    /** 穿戴称号{0}次 */
    TitleWearCount = 10009,
    /** 完成{0}个军衔任务 */
    RoleArmyLevelTaskCount = 10010,
    /** {0}系统进阶{1}次 */
    GradeCount = 10011,
    /** 聊天发言{0}次 */
    ChatCount = 10012,
    /** 竞技场挑战{0}次 */
    FightArenaCount = 10013,
    /** 装备升星{0}次 */
    EquipUpStar = 10014,
    /** 打造{0}件{2}阶{3}星的{1}装备 */
    BuildEquip = 10015,
    /** 挑战{0}次个人Boss */
    FightPersonBossCount2 = 10016,
    /** 挑战{0}次至尊Boss */
    FightVipBossCount2 = 10017,
    /** 打造{0}装备 */
    BuildEquipShort = 10019,
    /** {0}系统升星{1}次 */
    GradeUpStarCount = 10020,
    /** 武将觉醒{0}次 */
    GeneralAwakenCount = 10021,
    /** 排行榜膜拜{0}次 */
    RankWorshipCount = 10022,
    /** 充值{0}次 */
    ReChargeCount = 10028,
    /** 挑战{0}次材料副本 */
    FightMateriaTotalCount = 10029
}

export type ICfgTask = Cfg_ArmyTask
