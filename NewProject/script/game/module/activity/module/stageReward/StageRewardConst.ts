/*
 * @Author: kexd
 * @Date: 2023-01-09 16:36:57
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\module\stageReward\StageRewardConst.ts
 * @Description: 阶段奖励（等级、战力、vip等）
 *
 */

export enum EStageType {
    /** 战力 */
    Power = 1,
    /** 等级 */
    Level = 2,
    Vip = 3,
    /** 新类型往下补充 */
}

/** 领取状态 */
export enum ERewardState {
    /** 可领取 */
    canGet = -1,

    /** 未达成 */
    unReach = 0,

    /** 已领取 */
    got = 1,
}

/** 领取数据 */
export interface IStageReward {
    /** 活动表里的-功能id */
    funcID: number,
    /** 活动表里的-期号 */
    cycNo: number,
    /** 活动表里的-组ArgsGroup */
    group: string,
    /** 领取状态 */
    state: ERewardState,
    /** 表数据 */
    cfg: Cfg_Server_StageRewards,
}
