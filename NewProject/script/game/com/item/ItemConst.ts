/* eslint-disable @typescript-eslint/ban-types */

/*
 * @Author: hwx
 * @Date: 2022-06-13 16:48:44
 * @FilePath: \SanGuo\assets\script\game\com\item\ItemConst.ts
 * @Description: 道具常量
 */
export const enum ItemType {
    /** 其他 */
    OTHER = 0,

    /** 货币，不在背包列表中，在角色属性中取 */
    CURRENCY = 1,
    /** 充值货币 */
    CURRENCY_RECHARGE = 101,
    /** 活动货币 */
    CURRENCY_ACTIVITY = 102,

    /** 材料 */
    MATERIAL = 2,
    /** 普通材料 */
    MATERIAL_GENERAL = 201,
    /** 丹药材料 */
    MATERIAL_PANACEA = 202,
    /** 武将经验丹/提品丹/觉醒丹/等 */
    GENERAL_ITEM = 207,
    /** 武将 */
    GENERAL_TYPE = 208,
    /** 红颜精魄和红颜碎片 */
    BEAUTY = 213,
    /** 技能书 */
    GBook = 215,
    /** 军师 */
    Adviser = 217,

    /** 兑换 */
    EXCHANGE = 3,
    /** 普通兑换 */
    EXCHANGE_GENERAL = 301,

    /** 宝箱 */
    CHEST = 4,
    /** 自选宝箱 */
    CHEST_PICK = 401,
    /** 随机宝箱 */
    CHEST_RANDOM = 402,

    /** 宝石 */
    GEM = 5,
    /** 普通宝石 */
    GEM_GENERAL = 501,
    /** 特性宝石(技能宝石) */
    GEM_SKILL = 503,

    /** 皮肤 */
    SKIN = 6,
    /** 时装皮肤 */
    SKIN_FASHION = 601,
    /** 坐骑皮肤 */
    SKIN_HORSE = 602,
    /** 翅膀皮肤 */
    SKIN_WING = 603,
    /** 光武皮肤 */
    SKIN_WEAPON = 604,
    /** 华服时装 */
    SKIN_SKIN_SPECIAL = 605,
    /** 华服坐骑 */
    SKIN_HORSE_SPECIAL = 606,
    /** 华服背饰 */
    SKIN_WING_SPECIAL = 607,
    /** 华服光武 */
    SKIN_WEAPON_SPECIAL = 608,
    /** 萌宠皮肤 */
    SKIN_PET = 609,

    /** 武将皮肤 */
    SKIN_GENERAL = 620,
    /** 奇物卡 */
    WONDER_CARD = 621,
    /** 人物卡 */
    PERSON_CARD = 622,
    /** 称号皮肤 */
    SKIN_TITLE = 651,
    /** 头像皮肤 */
    SKIN_HEAD = 652,
    /** 头像框皮肤 */
    SKIN_HEAD_FRAME = 653,
    /** 聊天框皮肤 */
    SKIN_CHAT_FRAME = 654,

    /** 装备 */
    EQUIP = 7,
    /** 角色装备 */
    EQUIP_ROLE = 701,
    /** 凶兽装备 */
    EQUIP_BEAST = 702,
    /** 天仙装备 */
    EQUIP_FAIRY = 703,
    /** 幻灵装备 */
    EQUIP_GHOST = 704,
    /** 王者装备 */
    EQUIP_KING = 705,
    /** 进阶坐骑装备 */
    EQUIP_HORSE = 706,
    /** 进阶羽翼装备 */
    EQUIP_WING = 707,
    /** 进阶光武装备 */
    EQUIP_WEAPON = 708,
    /** 进阶红颜才艺饰品 */
    EQUIP_BEAUTY = 709,
    /** 进阶军师 */
    EQUIP_ADVISER = 710,
    /** 进阶萌宠装备 */
    EQUIP_PET = 711,
}

/** 道具品质 */
export const enum ItemQuality {
    /** 无 */
    NONE = 0,
    /** 绿色 */
    GREEN = 1,
    /** 蓝色 */
    BLUE = 2,
    /** 紫色 */
    PURPLE = 3,
    /** 橙色 */
    ORANGE = 4,
    /** 红色 */
    RED = 5,
    /** 金色 */
    GOLD = 6,
    /** 彩色 */
    COLORFUL = 7,
    /** 粉色 */
    PINK = 8
}

/** 道具货币ID */
export const enum ItemCurrencyId {
    /** 经验 */
    EXP = 1,
    /** 玉石 */
    JADE = 2,
    /** 元宝 */
    INGOT = 3,
    /** 铜钱 */
    COIN = 4,
    /** VIP 经验 */
    VIP_EXP = 5,
    /** 竞技场声望 */
    ARENA_COIN = 7,
    /** 战技积分 */
    SKILL_COIN = 8,
    /** 家族币 */
    FAMILY_COIN = 9,
    /** 技能升级的经验 */
    SKILL_EXP = 15,
    /** 武将积分 */
    GENERAL_SCORE = 20,
    /** 礼券 */
    HuarongTicket = 1301,
}

export interface ItemIconOptions {
    /** 道具在哪，1为背包，999为其他 */
    where?: ItemWhere;
    /** 需要名称 */
    needName?: boolean;
    /** 需要数量 */
    needNum?: boolean;
    /** 深色背景 */
    isDarkBg?: boolean;
    /** 是否显示星级 */
    hideStar?: boolean;
    /** 隐藏光效 */
    hideEffect?: boolean;
    /* 自定义名称处理 */
    isCustomName?: boolean;
    /** 隐藏品质背景 */
    hideQualityBg?: boolean;
    /** 显示星阶级名称 */
    levelStar?: boolean;
    /** 显示星阶级名称 */
    levelStarName?: boolean;
    /** 点击缩放值 */
    clickScale?: number;
    /** 不可点击 */
    offClick?: boolean;
    /** 性别 */
    sex?: number;
    /** 数量1显示 */
    num1Show?: boolean;
    /** 任何数量（0、1等）显示 */
    allNumShow?: boolean;
    /** 隐藏左角标 */
    hideLeftLogo?: boolean;
    /** 隐藏右角标 */
    hideRightLogo?: boolean;
    /** 颜色 */
    color?: string,
    /** 右下角数量是否有限制要求 例如 100/10 */
    /** 该设置会覆盖数量 */
    needLimit?: boolean,
    /** 数量的缩放因数 */
    numScale?: number
}

/** 道具展示信息 */
export interface IItemMsg extends ItemIconOptions {
    /** 使用的预制 */
    prefab?: string,
    /** 已领取 */
    needGot?: boolean,
    /** 已领取暗底 */
    needGotBg?: boolean,
    /** 角标 */
    mark?: number,
    /** 颜色 */
    needColor?: boolean,
    /** option */
    option?: ItemIconOptions,
    /** 是否只运行存在一个 */
    onlyOne?: boolean,
}

export interface ItemTipsOptions {
    /** 道具在哪，1为背包，999为其他 */
    where?: ItemWhere;
    /** 强化战力 */
    strengthFv?: number
    /** 强化等级 */
    strengthLv?: number;
    /** 强化属性字符串 */
    strengthAttrStr?: string;
    /** 化金战力 */
    goldFv?: number
    /** 化金等级 */
    goldLv?: number;
    /** 化金属性字符串 */
    goldAttrStr?: string;
    /** 装备宝石战力 */
    equipGemFv?: number;
    /** 装备宝石信息 */
    equipGemInfoArr?: EquipGemShowInfo[];
}

/** 道具背包类型 */
export const enum ItemBagType {
    /** 货币 */
    NONE = 0,
    /** 普通道具 */
    GENERAL = 1,
    /** 宝石道具 */
    GEM = 2,
    /** 角色套装 */
    EQUIP_ROLE = 10,
    /** 凶兽套装 */
    EQUIP_BEAST = 11,
    /** 天仙套装 */
    EQUIP_FAIRY = 12,
    /** 幻灵套装 */
    EQUIP_GHOST = 13,
    /** 王者套装 */
    EQUIP_KING = 14,
}

/** 道具在哪 */
export const enum ItemWhere {
    /** 背包 */
    BAG = 1,
    /** 角色装备 */
    ROLE_EQUIP = 2,
    /** 进阶装备 */
    GRADE_EQUIP = 3,
    /** 商城 */
    SHOP = 4,
    /** 其他 */
    OTHER = 999,
}

/** 道具Tips模板类型 */
export const enum ItemDetailType {
    /** 通用 */
    GENERAL = 0,
    /** 属性 */
    ATTR = 1,
    /** 装备 */
    EQUIP = 2,
    /** 自选宝箱 */
    PICK_CHEST = 3,
    /** 随机宝箱 */
    RANDOM_CHEST = 4,
    /** 化身 */
    AVATAR = 5,
}

export enum ConstItemId {
    /** 强化石ID */
    stoneId = 200001,
    /** 装备打造石 */
    BuidStoneType = 4, // 材料类型表的材料类型
    /** 进阶装备打造石类型 */
    JJBuidStoneType = 1000, // 材料类型表的材料类型
    /** 装备升星石 */
    StarStoneType = 5, // 材料类型表的材料类型
    /** 卓越属性石 */
    ExcAttrStrone = 200003,
    /** 完美打造石 */
    PerfBuildStone = 200002,
}

/** 装备部位ID */
export const enum RoleEquipPart {
    /** 武器 */
    Weapon = 1,
    /** 头盔 */
    Helmet = 2,
    /** 护肩 */
    Sholder = 3,
    /** 衣服 */
    Cloth = 4,
    /** 护腕 */
    Cuff = 5,
    /** 腰带 */
    Belt = 6,
    /** 裤子 */
    Trousers = 7,
    /** 鞋子 */
    Shoes = 8
}

/** itemicon 左上角角标图片名称 */
export enum EItemLeftCustomLogoName {
    /** 概率角标 */
    Rate = 'mjlx_gailvjiaobiao',
    /** 限时 */
    Time = 'xianshi',
    /** 周末 */
    Weekly = 'zhoumo',
    /** 双倍 */
    Double = 'shuangbeijiaobiao',

}

/** 角色装备部位数量 */
export const ROLE_EQUIP_PART_NUM = 8;
/** 角色装备宝石数量 */
export const ROLE_EQUIP_GEM_NUM = 5;

/** 装备宝石显示信息 */
export interface EquipGemShowInfo {
    name: string,
    desc: string,
    rawDesc: string,
    icon: string,
    isSkill: boolean,
    skillName: string,
    skillIcon: number,
    skillLevel: number
}
