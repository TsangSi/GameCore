/** 酒馆仓库 底下有三个二级页签 */
export enum GeneralStoreType {
    /** 仓库 */
    Store,
    // /** 寻宝 */
    // XunBao,
    // /** 兑换 */
    // Exchange
}

/** 酒馆仓库 底下有三个二级页签 */
export enum WishState {
    lock = 0,
    add = 1,
    change = 2,
    select = 3,
    already = 4,
    none = 5
}

export enum HeroCamp {
    wei = 2, // 魏
    shu = 1, // 蜀
    wu = 3, // 吴
    qun = 4// 群
}
export enum ClientFlagEnum {
    ClientOut = 1, // 招募界面的请求
    ClientInner = 2, // 招募日志滚动的请求
}
