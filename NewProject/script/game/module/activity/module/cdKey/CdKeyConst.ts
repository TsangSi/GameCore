/*
 * @Author: lijun
 * @Date: 2023-02-16 18:20:21
 * @Description:
 */

/** cdkey领取结果类型 */
export enum CdKeyResultType {
    /** 成功 */
    Success = 0,
    /** 不存在 */
    NonExistent = 1,
    /** 已过期 */
    BeOverdue = 2,
    /** 已领取过 */
    Received = 3
}
