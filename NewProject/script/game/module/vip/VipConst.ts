/*
 * @Author: myl
 * @Date: 2022-08-05 16:04:10
 * @Description:vip枚举
 */

/** 解锁的功能id */
export enum UnlockFunc {
    // 熔炼装备
    smelt = 1,
    // 材料扫荡功能
    materialSweep = 6,
    // 押镖
    escort = 124,
}

/** 最大vip等级 */
export const Max_Vip_Level = 10;
export const Max_SVip_Level = 30;

export enum FuncAddState {
    Old,
    New,
    Change
}

/** vip二级页签id */
// export enum VIPPageType {
//     SVip = 0,
//     Vip = 1
// }

/** vip展示资源类别 */
export enum VIpResType {
    /** 通用 */
    Common = 1,
    /** 皮肤 */
    Skin,
    /** 坐骑 */
    Horse,
    /** 羽翼 */
    Wing,
    /** 神兵 */
    Weapon,
    /** 法宝 */
    FaBao,
    /** 战神 */
    ZhanShen,
    /** 头像 */
    Avatar = 11,
    /** 头像框 */
    AvatarFrame,
    /** 聊天框 */
    ChatFrame,
    /** 宠物 */
    Pet,
    /** 凶兽 */
    FiendishPet,
    /** 称号 */
    Title = 16
}

/** vip中的相关字段 */
export enum EVipFuncType {
    MITime = 'MITime', // // 材料副本购买次数
    ArenaTimes = 'ArenaTimes', // // 竞技场购买次数
    AFKTimes = 'AFKTimes', // // 快速挂机购买次数
    MTBoss = 'MTBoss', // // 多人首领购买次数
    BeaconWarStrength = 'BeaconWarStrength', // // 烽火连城体力上限
    TeamDun1 = 'TeamDun1', // // XX组队副本可购买次数
    TeamDun2 = 'TeamDun2', // // XX组队副本可购买次数
    Family1 = 'Family1', // // 事务特权1
    Family2 = 'Family2', // // 事务特权2
    CashCow1 = 'CashCow1', // // 摇钱树免费次数
    CashCow2 = 'CashCow2', // // 摇钱树元宝次数
    CashCow3 = 'CashCow3', // // 摇钱树玉璧次数
    RankMatchDun = 'RankMatchDun', // // 排位赛可购买次数上限
    TrialCopyCount = 'TrialCopyCount', // // 试炼副本购买次数
    SilkRoadCount = 'SilkRoadCount', // // 丝绸之路购买次数

}

export const UpdateViewEvent = 'UpdateViewEvent';
