/*
 * @Author: kexd
 * @Date: 2022-10-20 12:20:32
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\timerActivity\TimerActivityConst.ts
 * @Description:
 *
 */

export enum ETimeState {
    /** 活动还没开始 */
    UnStart = 0,
    /** 在活动时间内 */
    InTime = 1,
    /** 活动已结束 */
    End = 2,
}

/** 定时活动对应ID */
export enum ETimerActId {
    /** 名将来袭 */
    MJBoss = 1,
    /** 押镖 */
    Escort = 1001,
    /** Boss战 */
    FamilyBoss = 101,
    /** 族长战 */
    FamilyChif = 102,
}
