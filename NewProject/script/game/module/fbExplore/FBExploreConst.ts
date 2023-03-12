/*
 * @Author: zs
 * @Date: 2023-02-02 16:16:31
 * @Description:
 *
 */

/** 本服首领下的页签 */
export enum EFBExploreType {
    /** 宝石 */
    Gem = 1,
    /** 宝石2 */
    Gem2 = 2,
    /** 宝石3 */
    Gem3 = 3,
}

/** 台子的路径点方向 */
export enum EFBExplorePathDir {
    /** 空 */
    Empty,
    /** 左边 */
    Left,
    /** 右边 */
    Right
}

export const FBExploreStartPos = cc.v2(167, -14);

export interface IFBExploreTai extends Cfg_FB_ExploreGem {
    // Level: number,
    // Part: number,
    // Stage: number,
    // ExploreType: number,
    // StagePrize: string,
    // Limit: number,
    // BossId: number,
    params?: string,
}
