/*
 * @Author: dcj
 * @Date: 2022-08-26 11:00:41
 * @FilePath: \SanGuo2.4\assets\script\game\module\worldBoss\WorldBossConst.ts
 * @Description:
 */

/** 副本里按钮枚举 */
export enum WorldBossBtnType {
    /** 鼓舞 */
    BtnInspire = 'BtnInspire',
    /** 抢夺 */
    BtnGrab = 'BtnGrab',
    /** 自动战斗 */
    BtnAutoFight = 'BtnAutoFight',
}

/** 奖励预览排行类型 */
export enum WorldBossRPType {
    /** 个人 */
    RpSelf = 1,
    /** 势力 */
    RpFamily = 2,
}
/** 战斗结算类型 */
export enum BattleExType {
    /** 抢夺结算 */
    GrabEx = 1,
    /** BOSS战斗结算 */
    BossFightEx = 2,
    /** 世家Boss */
    Family_Boss = 3,
    /** 世家族长 */
    Family_Chif = 4,
}
/** 副本界面按钮数据接口 */
export interface IBtnItem {
    /** 目标节点 */
    target: cc.Node;
    /** 按钮描述 */
    label: string;
    /** 按钮名字 */
    btnName: string;
    /** 按钮颜色 */
    color: cc.Color;
    /** 已挑战/抢夺次数/等级 */
    val?: number,
    /** 冷却时间戳 */
    cd?: number,
    /** 按钮子目标节点 */
    subTarLab?: cc.Label;
    /** 红点 */
    btnRedDot?: boolean
}

/** 名将来袭配置表的key */
export const enum ECfgWorldBossConfigKey {
    /** 周一至周五活动地图id */
    WeekDayMapId = 'WeekDayMapId',
    /** 周一至周五出生点坐标 */
    WeekDayBornLocation = 'WeekDayBornLocation',
    /** 周一至周五BOSS出生点坐标 */
    WeekDayBossLocation = 'WeekDayBossLocation',
    /** 周末活动地图id */
    WeekendMapId = 'WeekendMapId',
    /** 触发拼点时间（秒） */
    RollStartTime = 'RollStartTime',
    /** 触发持续时间（秒） */
    RollOpenTime = 'RollOpenTime',
    /** 手气最佳奖励组id */
    RollPrize = 'RollPrize',
    /** 护盾触发时间（秒） */
    ShieldStartTime = 'ShieldStartTime',
    /** 护盾持续时间（秒） */
    ShieldOpenTime = 'ShieldOpenTime',
    /** 护盾减伤百分比 */
    ShieldEffect = 'ShieldEffect',
    /** 破盾次数要求 */
    ShieldBreakTimes = 'ShieldBreakTimes',
    /** 克制阵营次数增幅 */
    ShieldCamp = 'ShieldCamp',
    /** 破盾boss受伤增幅万分比 */
    ShieldBreakEffect = 'ShieldBreakEffect',
    /** 破盾debuff特效资源id */
    ShieldBreakResId = 'ShieldBreakResId',
    /** 破盾debuff特效持续时间 */
    ShieldBreakTime = 'ShieldBreakTime',
    /** 破盾debuff技能id */
    ShieldBreakDes = 'ShieldBreakDes',
    /** 挑战次数限制 */
    ChallengeTimes = 'ChallengeTimes',
    /** 挑战冷却时间(秒) */
    ChallengeCD = 'ChallengeCD',
    /** 挑战奖励次数 */
    ChallengePrizeTimes = 'ChallengePrizeTimes',
    /** 挑战奖励组id */
    ChallengePrize = 'ChallengePrize',
    /** 挑战伤害转换积分系数万分比 */
    ChallengePointRatio = 'ChallengePointRatio',
    /** 抢夺次数限制 */
    GrabTimes = 'GrabTimes',
    /** 抢夺冷却时间(秒) */
    GrabCD = 'GrabCD',
    /** 抢夺积分转换系数万分比 */
    GrabPointRatio = 'GrabPointRatio',
    /** 活动界面展示奖励 */
    ShowPrize = 'ShowPrize',
    /** 护盾特效资源id */
    ShieldResId = 'ShieldResId',
    /** 护盾技能 */
    ShieldDes = 'ShieldDes',
    /** 拼点宝箱固定显示的图标id */
    RollIcon = 'RollIcon',
}

/** boss事件类型 */
export enum EBossEventType {
    /** 拼点 */
    Roll,
    /** 护盾 */
    Shield
}

/** 世界boss的buff类型 */
export enum EBossBuffType {
    /** 护盾 */
    Shield = 1,
    /** 破盾 */
    BrokenShield = 2,
}

export interface IRollFrameOpts {
    /** 回调的this */
    target?: any,
    /** 最高数的玩家名字 */
    topName?: string,
    /** 最高拼点数 */
    topValue?: number,
    /** 自己的拼点数 */
    value?: number,
    /** 是否勾选自动拼点 */
    autoRoll: boolean,
    /** 道具id */
    ItemId: number,
    /** 道具数量 */
    ItemNum?: number,
    /** 帮助说明 */
    helpId?: number,
}
