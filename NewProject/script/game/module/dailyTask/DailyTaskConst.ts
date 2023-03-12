/*
 * @Author: myl
 * @Date: 2023-02-07 15:15:44
 * @Description:
 */

/** 任务类型 阶段奖励也是根据这个来获取 */
export enum DailyTaskType {
    /** 每日任务 */
    Daily = 1,
    /** 每周任务 */
    Weekly = 2
}

/** 资源找回类型 */
export enum ResRecoveryType {
    /** 资源找回 */
    Res = 1,
    /** 功能找回 */
    Func = 2,
}

export enum EDailyTaskStatus {
    Processing = 2,
    Completed = 1,
    Awarded = 3,
}

export const HalfCostId = 'HalfCostId';
