/*
 * @Author: zs
 * @Date: 2022-07-07 10:04:58
 * @Description:
 */

/** 分支版本版本 */
export enum GameBranchVer {
    /** 版署 */
    BanShu = 'BanShu',
    /** 外网正式 */
    Release = 'release',
    /** 开发内网 */
    Dev = 'dev'
}

export enum ESex {
    Male = 1,
    Female = 2
}

export enum GameConst {
    /** 装备部位数量 1-8 */
    Role_Euqip_Num = 8,

}

/** 激活状态 */
export enum EActiveStatus {
    /** 未激活 */
    UnActive,
    /** 能激活 */
    CanActive,
    /** 已激活 */
    Active,
}

export type NumberS = number | string;

/** UI按钮点击缩放值 */
export const BTN_CLICK_SCALE = 0.9;
