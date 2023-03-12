/*
 * @Author: kexd
 * @Date: 2022-06-22 18:42:39
 * @FilePath: \SanGuo2.4\assets\script\game\module\battleResult\BattleResultConst.ts
 * @Description:
 */

import { UI_PATH_ENUM } from '../../const/UIPath';

/** 战斗副本类型 */
export enum EBattleType {
    /** 材料副本 */
    MaterialFb = 1,
    /** 世界BOSS-PVE(一至五) */
    WorldBoss_PVE_DAYS = 2,
    /** 世界BOSS-PVP(一至五) */
    WorldBoss_PVP_DAYS = 3,
    /** 世界BOSS-PVE(周末) */
    WorldBoss_PVE_WeekDay = 4,
    /** 世界BOSS-PVP(周末) */
    WorldBoss_PVP_WeekDay = 5,
    /** 个人首领 */
    PersonBoss = 8,
    /** 至尊首领 */
    ZhiZunBoss = 9,
    /** 竞技副本 */
    Arena = 10,
    /** 野外小怪 */
    Monster = 12,
    /** 挑战关卡 */
    GameLevelBoss = 13,
    /** 烽火连城PVE */
    FHLC_PVE = 14,
    /** 烽火连城PVP */
    FHLC_PVP = 15,
    /** Team副本PVE */
    TeamFB_PVE = 16,
    /** Team副本PVE */
    TeamFB_PVP = 17,
    /** 多人bossPVE */
    MultiBoss_PVE = 20,
    /** 世家-boss战斗 */
    Family_Boss = 21,
    /** 世家-族长 */
    Family_Chif = 22,
    /** 排位赛 */
    RankMath = 23,
    /** 试炼副本 */
    Family_TrialCopy = 24,
    /** 押送粮草 */
    Escort_PVP = 25,
    /** 三国探险-宝石秘矿 */
    FBExploreGem = 26,
}

/** 战斗结果类型 */
export enum BattleType {
    /** 其他结果 */
    Other = 0,
    /** 战斗胜利 1 */
    Win = 1,
    /** 战斗失败 2 */
    Fail = 2,
    /** 扫荡 */
    Sweep = 3,
}

/**
    颗粒部分配置 配置表对应的颗粒路径
 */
export const BattleSettlePartCfg = {
    1: UI_PATH_ENUM.BattleSettlePartText, // 纯文本（可换行 居中对齐）
    2: UI_PATH_ENUM.BattleSettlePartReward, // 奖励
    3: UI_PATH_ENUM.BattleSettlePartBgText, // 其他文本 （根据某个字符对齐的情况）
    4: UI_PATH_ENUM.BattleSettlePartArena, // 竞技场专用
    5: UI_PATH_ENUM.BattleSettlePartFail, // 战斗失败
    6: UI_PATH_ENUM.BattleSettlePartEmoji, // 附加表情
    7: UI_PATH_ENUM.BattleRankMatchEx,
};

export const MaxLayoutWidth = 550;
export const DoubleLineHeight = 210;
export const MoreLineHeight = 230;
/**
 * 自定义数据类型 页面详细内容分成4部分处理
 * 1，颗粒1部分
 * 2，颗粒2部分
 * 3，颗粒3部分
 * 4，扩展部分
 * 实现内部细节颗粒化处理（实现动态加载）
 */
export interface BattleViewTip {
    // 第一部分是否显示 （例如 ：关卡结算 通关章节名称 ，也可以是其他字段 需要根据副本类型做判断）
    BattleResultPart1?: string,
    // 结算奖励是否显示（显示需求如果无显示需求 则不显示）
    BattleResultPart2?: string,
    // 第二部分的是否显示 （例如 ：结算排名信息）
    BattleResultPart3?: string,
    // ex部分（扩展部分）
    BattleResultExPart?: string;
}
