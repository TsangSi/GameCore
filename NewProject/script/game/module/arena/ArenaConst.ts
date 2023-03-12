/*
 * @Author: zs
 * @Date: 2022-11-30 10:42:13
 * @Description:
 *
 */
/** 竞技场战斗结果奖励类型 */
export enum ArenaResultTypeEnum {
    /** 胜利 */
    Victory = 1,
    /** 失败 在最大回合数之内死亡 */
    Fail = 0,
    /** 挑战失败  挑战回合数达到最大 未死亡 被判定为失败（若判定为胜利则为挑战胜利1） */
    MaxFail = -1,
    /** 扫荡 */
    Sweep = 2,
}

/** 配置表常量枚举 */
export const enum ArenaConstEnum {
    // 竞技场挑战总次数
    Times = 'ArenaChallenge',
    // 次数恢复cd
    Cd = 'ArenaReviveTime',
    // 购买次数限制id
    BuyLimitId = 'ArenaLimitId',
    // 胜利奖励功勋配置
    WinRewards = 'ArenaWinRewards',
    // 失败奖励功勋配置
    LoseRewards = 'ArenaLoseRewards',
    // 最高排名变化 比例（变化值 * val）
    RankReward = 'ArenaRankRewards',
    // 扫荡奖励
    MopUp = 'ArenaMopUp',
    // 50名之外时，前4为玩家的排名减少比例
    MaxMatch = 'ArenaMaxMatch',
    // 第五位玩家的排名增加数量
    WeakMatch = 'ArenaWeakMatch',
    // 最大回合数
    MaxRound = 'ArenaMaxRound',
    // 竞技场初始化名次
    InitRank = 'ArenaInitRank',
    // 秒杀比例
    SeckillPercentage = 'SeckillPercentage'
}

export enum EArenaTabId {
    /** 竞技场 */
    Areana = 0,
    /** 排位赛 */
    RankMatch = 1,
}
