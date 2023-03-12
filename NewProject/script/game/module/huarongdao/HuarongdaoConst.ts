/*
 * @Author: lijun
 * @Date: 2023-02-21 17:10:45
 * @Description:
 */

/** 华容道活动状态 */
export enum HuarongdaoMatchState {
    /** 未开始  */
    wait = 0,
    /** 支持 */
    support = 1,
    /** 倒计时 */
    countDown = 2,
    /** 追逐 */
    match = 3,
    // /** 抓人 */
    // catch = 4,
    /** 结束 */
    over = 4,
}

/** 华容道押注结果 */
export enum HuarongdaoSupportResult {
    /** 成功 */
    success = 1,
    /** 失败 */
    fail = 2,
    /** 未参与 */
    noJoin = 3,
}

/** 华容道弹幕 */
export interface IHuarongdaoBulletChat {
    chatId: number,
    genId: number
}

/** 货币类型对应购买类型 */
export enum HuarongdaoBuyType {
    /** 元宝 */
    yuanba = 1,
    /** 玉璧 */
    yubi = 2,
}

/** 武将列表id */
export interface IHuarongdaoGenIdList {
    /** 主角 */
    mainRole: number,
    /** 追逐武将 */
    other: Array<number>,
}

/** 活动类型阶段 */
export interface IHuarongdaoActivityTimeStep {
    /** 类型 */
    type: number,
    /** 剩余时间s */
    time: number
}

/** 动作类型 */
export enum HuarongdaoRoleState {
    /** 站 */
    stand = 0,
    /** 跑 */
    run = 1,
    /** 晕 */
    yun = 2,
    /** 胜利 */
    win = 3,
}

/** 华容道支持武将信息 */
export interface IHuarongdaoSupportGenInfo {
    Id: number,
    OddsRatio: number, // 赔率
    SupportRatio: number, // 支持率(千分比)
}

/** 速度颜色 */
export enum HuarongdaoSpeedColor {
    /** 加速 */
    up = '#7beba1',
    /** 减速 */
    down = '#d53838',
}

/** 武将类型 */
export enum HuarongdaoGenType {
    /** 主角 */
    main = 1,
    /** 追逐武将 */
    other = 2,
}
