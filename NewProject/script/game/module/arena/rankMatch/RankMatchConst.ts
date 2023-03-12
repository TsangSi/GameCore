/*
 * @Author: zs
 * @Date: 2023-01-09 15:09:08
 * @Description:
 *
 */
/** 排位赛常量表 */
export enum ECfgRankMatchNormallKey {
    /** 初始分数 */
    RankMatchGoals = 'RankMatchGoals',
    /** 匹配次数上限 */
    RankMatchNumLimit = 'RankMatchNumLimit',
    /** 首胜奖励 */
    RankMatchFirstReward = 'RankMatchFirstReward',
}
/** 排位赛奖励 */
export enum ERankMatchAwardTabId {
    /** 胜场奖励 */
    Win = 0,
    /** 段位奖励 */
    Segme = 1,
}
/** 排位赛页签 */
export enum ERankMatchRankTabId {
    /** 排行榜 */
    Rank = 0,
    /** 排行榜奖励 */
    Reward = 1,
}

export enum ERankMatchAwardStatus {
    /** 不能领取 */
    UnLq,
    /** 能领取 */
    Canlq,
    /** 已领取 */
    Ylq,
}

/** 排位赛奖励每一项的标题信息结构体 */
export interface IRankMatchAwardTitleInfo {
    /** 颜色 */
    color?: cc.Color,
    /** 值 */
    value: string,
}

export enum ERankMatchBtn {
    Report = 1
}
