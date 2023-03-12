/*
 * @Author: myl
 * @Date: 2022-10-25 17:41:13
 * @Description:
 */

/** 为了防止重复需要从里面读取内容 */
export enum AutoPayKey {
    // 进阶
    GradeHouse = 101,
    GradeWing = 111,
    GradeWeapon = 121,
    // 官印升级升星淬炼
    SealGrade = 10001,
    SealStar = 10002,
    SealRefine = 1003,
    // 虎符升级升星淬炼
    AmuletGrade = 11001,
    AmuletStar = 11002,
    AmuletRefine = 11003,
    /** 红颜星级购买材料 */
    BeautyStarBuy = 11004,
    /** 军师星级购买材料 */
    AdviserStarBuy = 11005,
    // 烽火连城体力材料快捷购买：军令
    BeaconWarQuick = 2601,
    BeaconWarAutoBuff = 2602,
    BeaconWarAutoTreat = 2603,
}

export class WinAutoPayTipsModel {
    private static recordMap: Map<number, boolean> = new Map();

    public static getState(id: number): boolean {
        return this.recordMap.get(id) ?? false;
    }

    public static setState(id: number, state: boolean): void {
        this.recordMap.set(id, state);
    }
}
