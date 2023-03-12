/*
 * @Author: myl
 * @Date: 2022-09-14 12:08:19
 * @Description:
 */

/** 关卡数据  关卡名称 ，关卡详细信息，关卡状态 */
export type GameLevelInfoModel = { nameInfo: Cfg_StageName, infoChapter: Cfg_Stage, state: GameLevelState };

export enum GameLevelPageIdType {
    Map
}

export enum GameLevelState {
    // 未通关
    unpass = 0,
    // 正在通关
    passing = 1,
    // 已通关
    passed = 2
}

export enum GameLevelPageState {
    /** 默认进入 定位到最新区域 最新章节 */
    Default,
    /** 解锁最新章节 */
    NewChapter,
    /** 解锁最新区域 */
    NewArena,

}

export enum EClientDataKey {
    /** 战斗之前的剧情 */
    BeforeBattlePlot
}

export const MapOffsetX = 200;
export const MapOffsetY = -65;
export const MapLevelScale = cc.v2(1.2, 1.2);
