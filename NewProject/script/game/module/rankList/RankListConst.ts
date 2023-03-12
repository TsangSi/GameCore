/*
 * @Author: wangxin
 * @Date: 2022-10-12 15:50:46
 * @FilePath: \SanGuo2.4\assets\script\game\module\rankList\RankListConst.ts
 */
export enum ERankListPageIndex {
    /** 本服排行榜 */
    RankListLocalPage = 0,
    /** 跨服排行榜 */
    RankListAllPage = 1,
}

/**
 * 排行榜类型
 */
export enum ERankType {
    /** 本服 */
    Local = 1,
    /** 世界boss */
    WorldBoss = 2,
    /** 跨服 */
    More = 3,
}

/**
 * 排行榜类型参数
 */
export enum ERankParam {
    /** 战力 */
    BattleValue = 2528, // 战力榜
    Equip = 2609, // 装备
    Level = 2524, // 等级
    General = 2613, // 武将
    Office = 2680, // 官职
    Army = 2553, // 军衔
    Horse = 2610, // 坐骑
    Waepon = 2612, // 光武
    Wing = 2611, // 羽翼
    /** 三国大冒险-宝石秘矿 */
    FBExploreGem = 4301,
}
