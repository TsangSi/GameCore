/*
 * @Author: zs
 * @Date: 2023-02-22 15:19:56
 * @Description:
 *
 */
/** buff类型 */
export enum EIncreaseType {
    /** 挂机经验加成 */
    OnHookExp = 1001,
    /** 经验副本经验加成 */
    FuBenExp = 1002,
    /** 挂机金币加成 */
    OnHookMoney = 2001,
    /** 金币副本加成 */
    FuBenMoney = 2002,
}

/** buff加成效果结构体 */
export interface IBuffAddEffectData {
    skillIds: number[],

    addEffect: {
        [type: number]: number
    }
}
