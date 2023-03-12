import { i18n, Lang } from '../../../i18n/i18n';
import { TabData } from '../../com/tab/TabData';

/** 特权争夺 */
export enum FamilyPatriarchPageType {
    FamilyPatriarchPage = 1,
    FamilyPatriarchRankPage = 2,
}

/** 世家-[世家-成员] */
export enum FamilyPageType {
    FamilyFamilyPage = 1, // 世家-世家
    FamilyMemberPage = 2, // 世家-成员
    FamilyDrillGroundPage = 3, // 世家-校场
    FamilyTotemPage = 4, // 世家-图腾
}

/** 世家-[事务] */
export enum FamilyTaskType {
    FamilyTaskPage = 1, // 事务主页
}
/** 世家-[试炼副本] */
export enum FamilyTrialPageType {
    FamilyTrialCopyPage = 1, // 试炼副本主页
}

export enum TaskState {
    notBegin = 0, // 未派遣
    doing = 1, // 派遣中
    reward = 2, // 已完成
}
export enum RewardType {
    simple = 0, // 普通奖励
    box = 1, // 宝箱奖励
    fate = 2, // 缘分奖励
}

export interface EntityData {
    IId: number, // 用来排序 这个值等于 武将里的IId  等于红颜BeautyId
    self: number, // 自己还是他人做个排序
    PartnerType: number, // 武将军师还是红颜
    Qaulity: number, // 品质
    StrId: string, // 唯一id
    inSender: number,
}

export enum TipPageType {
    Buff = 1, // buff
    FamilyTask = 2, // 事务等级
    SpecialPower = 3, // 特权
    FightBuff = 4// 族长争霸Buff
}

/** 修改名称还是修改宣言 */
export enum ModifyPageType {
    Name = 1, // 改名
    Word = 2, // 改宣言
    Award = 3, // 族长俸禄
}

/** 世家-[职位] */
export enum FamilyPos {
    Chiefs = 1, // 族长
    FuChiefs = 2, // 副族长
    Older = 3, // 长老
    Member = 4, // 普通成员
}

export enum FamilyLabState {
    before = 1, // 未开启
    doing = 2, // 进行中
    end1 = 3, // 结束状态1
    end2 = 4, // 结束状态2
}

export enum FamilyDGConstId {
    LI = 101, // 力
    MING = 102, // 敏
    ZHI = 103, // 智
    YONG = 104, // 勇
    WU = 105, // 武
    TONG = 106, // 统
}

/** 背包页TAB类型 */
export enum FamilyTrialRankType {
    /** 排行榜 */
    RANK = 1,
    /** 排行榜 奖励 */
    RANKREWARD = 2,
}

/** 背包页道具页签类别 */
export const FamilyTrialRankTabs: TabData[] = [
    {
        id: FamilyTrialRankType.RANK,
        title: i18n.tt(Lang.family_rank),
    },
    {
        id: FamilyTrialRankType.RANKREWARD,
        title: i18n.tt(Lang.family_rankReward),
    },
];

// 世家-世家 页面里有三个入口
export enum FamilyFamilyType {
    FamilyPatriarch = 1, // 族长争夺
    FamilyTask = 2, // 处理事务
    FamilyTrial = 3, // 试炼副本
}
