import {
    Enum, js, v2, view, __private,
} from 'cc';

export type WarpMode = __private._cocos_core_animation_types__WrapMode;

export const enum ResName {
    spriteFrame = '/spriteFrame'
}

export type TFunc = (...args: any[])=> void;

export var winSize = window.winSize = view.getDesignResolutionSize();

export const Empty = Object.freeze({
    Number: 0,
    String: '',
    Array: [],
    Map: js.createMap(true),
    Vec2: v2(),
});

export enum Type {
    Number = 'number',
    String = 'string',
    Object = 'object',
    Function = 'function',
    AAAA = 1,
    Bigint = 'bigint',
    Boolean = 'boolean',
    Symbol = 'symbol',
    Undefined = 'undefined'
}

export const enum FColor {
    /** 常用色，普通字体颜色，按钮未选中时的颜色 */
    Normall = '#b87743',
    /** 红色 */
    Red = '#ff4242',
    /** 白色 */
    White = '#FFFFFF',
    /** 黑色 */
    Black = '#000000',
    /** 常用绿色 */
    Green = '#12a710',
    /** 亮绿 */
    Green2 = '#018200',
    /** 蓝色 */
    Blue = '#0057ba',
    /** 亮棕色 */
    Brown = '#8D5D2C',
    /** 灰色 */
    Grey = '#808080',
    /** 黄色 */
    Yellow = '#F3F049',
}

export const enum PrefabName {
    /** 男主 */
    NanZhu = 'prefabs/ui/login/role/nanzhu1',
    /** 女主 */
    NvZhu = 'prefabs/ui/login/role/nvzhu1',
    MsgToast = 'prefabs/com/MsgToast',
}

/** bundle类型 */
export const enum BundleType {
    gamelogic = 'gamelogic'
}

export interface AAA {
    PrefabName: PrefabName,
    BundleType: BundleType
}
export const enum AssetType {
    SpriteFrame = '.frame',
    SpriteAtlas = '.atlas',
    Texture2D = '.txture',
    JsonAsset = '.json',
    TextAsset = '.txt',
    Font = '.fnt',
    Prefab = '.prefab',
    AudioClip = '.mp3',
    /** 这个类型表示material中所用到的资源   有可能只是一个贴图 */
    Material = '.material',
    Plist = '.plist',
    Png = '.png',
    Empty = '',
}

export interface MPQ_FILE_INFO {
    begin?: number,
    length?: number,
    data?: ArrayBuffer | unknown,
    dataPng?: ArrayBuffer,
    suffix?: string,
    realImg?: string,
    jsonObj?: unknown;
}

// export const enum UI_NAME {
//     /** 登陆 */
//     Login = 'Login',
//     /** 热更新界面 */
//     UpdateWin = 'UpdateWin',
//     /** 创角 */
//     CreateRole = 'CreateRole',
//     /** 账号登录 */
//     AccountLogin = 'AccountLogin',
//     /** 账号注册 */
//     AccountReg = 'AccountReg',
//     /** 服务器选中 */
//     ServerChose = 'ServerChose',
//     /** 主界面 */
//     MainUI = 'MainUI',
//     /** 角色面板 */
//     RoleWin = 'RoleWin',
//     /** 测试子页1 */
//     Page1 = 'Page1',
//     /** 测试子页2 */
//     Page2 = 'Page2',
//     /** 测试子页3 */
//     Page3 = 'Page3',
//     /** 任务界面 */
//     Task = 'Task',
//     /** 飘字 */
//     MsgToast = 'MsgToast',
// }

export enum LoadImgType {
    Png,
    Jpg
}

/**
 * 前端显示类型
 */
export enum CLIENT_SHOW_TYPE {
    /** 技能名称显示 */
    SKILL_ATTACK = 1,
    /** 眩晕 */
    DIZZINESS = 2,
    /** 破防 */
    BROKEN_DEFENSE = 3,
    /** 连击 */
    DOUBLE_HIT = 4,
    /** 增加攻击 */
    ADD_ATTACK = 5,
    /** 吸血 */
    TAKE_BLOOD = 6,
    /** 反伤 */
    UN_HURT = 8,
    /** 复活 */
    REVIVE = 9,
    /** 回血 */
    BACK_BLOOD = 10,
    /** 复仇 */
    REVENGE = 11,
    /** 净化 */
    PURIFY = 12,
    /** 普攻 */
    DEFAULT_ATTACK = 13,
    /** 暴击 */
    CRIT = 14,
    /** 仙击 */
    GOD_HIT = 15,
    /** 魂击 */
    SOUL_BLOW = 16,
    /** 闪避 */
    DUCK = 17,
    /** 防御 */
    DEFENES = 18,
    /** 伤害 */
    HURT = 19,
    /** 这是一个BUFF */
    IS_BUFF = 20,
    /** 秒杀 */
    KILL = 21,
    /** 无敌 */
    IMBA = 22,
    /** 招唤 */
    CALL = 23,
    /** 护盾 */
    SHIELD = 24,
    /** 免疫反伤 */
    IMMUNE_UN_HURT = 0,
    /** 免疫吸血 */
    IMMUNE_TAKE_BLOOD = 0,
    /** 昏睡 */
    SLEEP = 29,
    /** 护盾免伤状态 */
    SHIELD_HURT = 30,
    /** 招架 */
    PARRY = 31,
    /** 飘血，太不扣血 */
    SHOW_BOOLD = 32,
    /** 天仙守护,客户端自定义类型 */
    PETA_GRAD = 33,
    /** 魅惑 */
    Charm = 34,
    /** 合击，两仙童攻击过，额外再掉一次血 */
    TogeterAtk = 35,
    /** 直接掉血 */
    ReduceBlood = 36,
    /** 召唤新方式 */
    CALL_A = 40,
    /** 追击 */
    CHASE = 42,
    /** 英雄飘字 */
    HERO_WORLD = 43,
    /** 吞噬吐出 */
    Swallow = 44,
    /** 免死 */
    UnDeath = 45,
    /** 异兽飘字 */
    ChangeToAlien = 46,
    /** 被吞噬 */
    BeSwallow = 48,
    /** 斩杀 */
    ForceKill = 53,
    /** 飞龙在天 */
    DragonFly = 54,
    /** 龙战于野 */
    DragonField = 55,
    /** 暗影诅咒 */
    DarkWord = 56,
    /** 暴风雪 */
    Storm = 57,
    /** 生生不息 */
    GrewEver = 58,
    /** 泽被万物 */
    ForAnything = 59,
    /** 流血，灼烧 */
    ContinueDropHp = 60,
    /** 冰盾抵消伤害伤害 */
    IceShieldUse = 61,
    /** 减速BUFF */
    SubSpeed = 62,
    /** 冰冻BUFF */
    Freeze = 63,
    /** 男仙童盯着你打 */
    LookAt = 64,
    /** 女仙童,重拳效果 */
    ZhongQuan = 65,
    /** 激励 */
    JiLi = 66,
    /** 天谴 */
    TianQian = 67,
    /** 天蓬变身 */
    PigChange = 68,
    /** 天蓬休息 */
    PigRest = 69,
    /** 致命一击 */
    DeathHit = 70,
    /** 天罚 */
    TianFa = 73,
    /** 飞升,伤害减免 */
    FEISHENG_JM = 901,
}
/**
 *战报类型
 */
export enum BATTLE_TYPE {
    /** 材料 */
    MATERIAL = 1,
    /** 藏宝图 */
    TREASURE = 2,
    /** 勇闯天庭 */
    HEAVENLY = 3,
    /** 玲珑宝塔 */
    TOWER = 4,
    /** 跨服副本 */
    CROSS = 5,
    /** 帮派 */
    GANG = 6,
    /** 81难 */
    EIGHT_ONE = 7,
    /** 个人BOSS */
    SELF_BOSS = 8,
    /** 全民BOSS */
    ALL_BOSS = 9,
    /** 野外BOSS */
    FIELD_BOSS = 10,
    /** 至尊BOSS */
    VIP_BOSS = 11,
    /** 关卡小怪 */
    STAGE_MONSTER = 12,
    /** 关卡BOSS */
    STAGE_BOSS = 13,
    /** 帮会地图-任务明怪 */
    GROUP_MONSTER = 14,
    /** 龙宫夺宝 */
    DROAGON_CATCH = 15,
    /** 抓宠物 */
    CATCH_PET = 16,
    /** 师门任务 */
    SM_MISSION = 17,
    /** 明怪 */
    MapMonster = 18,
    /** 运营活动-赤炎魔挑战 */
    ActBoss_CYM = 19,
    /** 运营活动-金翅大鹏挑战 */
    ActBoss_JCDP = 20,
    /** 九重天 */
    Nine_Day = 21,
    /** 竞技场 */
    JJC = 22,
    /** 西游护送 */
    West = 23,
    /** 帮会战 */
    GangWar = 24,
    /** 帮会Boss */
    GangBoss = 25,
    /** 帮会战-南天门 */
    GangWarNanTianMen = 26,
    /** 野外BOSSPVP */
    FieldBoosPVP = 27,
    // 九重天pvp
    Nine_DayPVP = 28,
    // 帮会战pvp
    GangWarPVP = 29,
    // 帮会首领PVP
    GangBossPVP = 30,
    // 仙山寻宝
    XSNB = 31,
    // 降妖除魔
    XYCM = 32,
    // 跨服首领 pve
    CrossBossPVE = 33,
    // 跨服首领 PVP
    CrossBossPVP = 34,
    // 王者争霸
    WZZB = 35,
    // 八荒探秘
    BHTM = 36,
    // 仙道会
    GodClub = 37,
    // 魂殿
    DivineSoul = 38,
    // 协助挑战首领
    HelpFightBoss = 39,
    // 剧情战斗/仙魔人物志
    PlotFight = 40,
    // 多人boss
    mulBoss = 50,
    // 世界boss
    worldBoss_PVE = 33,
    worldBoss_PVP = 34,
    // boss之家
    homeBoss_PVE = 60,
    homeBoss_PVP = 61,
    /**
     * 神龙战斗预览
     */
    SL_FIGHT_PREVIEW = 99,
    SSS_Custom = 104,
    // 仙宗争夺
    sect_Boss = 201,
    sect_Leader = 202,
    sect_PVP = 203,
    godTest = 204,
    Sect_Montn = 205,
    // 灵兽园 PVE
    Zoo_PVE = 206,
    // 灵兽园 PVE 金宝箱
    Zoo_PVE_G = 207,
    // 灵兽园 PVE 银宝箱
    Zoo_PVE_S = 208,
    // 灵兽园打BOSS
    Zoo_PVE_B = 209,
    Marry_FB = 210,
    // 宝石之塔
    Tower = 212,
    // 天仙之塔
    TianXian = 213,
    // 战神之塔
    ZhanShen = 214,
    // 仙童之塔
    XianTong = 215,
    // 剑魂塔
    JianHun = 216,

    // 经验试炼-PVE
    FB_SL_JY = 221,
    // 金币试炼-PVE
    FB_SL_JB = 222,
    //  极限生存
    JXSC_PVE = 231,
    JXSC_PVP = 232,
    // 悬赏BOSS
    XS_PVE = 235,
    // 限时挑战
    XSTZ = 236,

    // 极限挑战
    JXTZ = 237,

    // 组队副本-灵气
    FB_ZD_LQ = 241,
    // 组队副本-进阶
    FB_ZD_JJ = 242,
    // 巅峰竞技-预选赛战斗
    DFJJ_YX = 243,
    // 巅峰竞技-淘汰赛战斗
    DFJJ_TT = 244,
    // 遗迹争夺
    YJZD_PVE = 250,
    YJZD_PVP = 251,
    TXQY = 252,
    YJZD_Scene1_PVP = 255, // 冰霜遗迹-PVP
    YJZD_Scene2_PVP = 257, // 熔岩遗迹-PVP
    YJZD_Scene3_PVP = 259, // 沼泽遗迹-PVP

    Boss_XS_XLD = 281, // boss 凶兽岛-凶灵岛
    Boss_XS_XSD = 283, // boss 凶兽岛-凶煞岛
    Boss_XS_XMD = 284, // boss 凶兽岛-凶冥岛

    Boss_FS_Cha = 300, // 飞升挑战
    MJTX = 301, // 秘境探险
    Crs_pet_Catch = 302, // 跨服灵兽园
    Cross_Boss_Pet = 304, // 跨服
    Boss_MJ = 305, // BOSS禁地
    Boss_Jd_PVP = 306, // BOSS禁地PVP胜利
    Boss_TT2 = 308, // 通天BOSS第二阶段
    Boss_TT3 = 309, // 通天BOSS第三阶段
    Family_Fight = 310, // 家族竞技
    SY_PVE = 311, // 神域场景-PVE
    SY_PVP = 312, // 神域场景-PVP
    ZZJZ_FB = 317, // 征战九州
    XLSL_FB = 318, // 仙林狩猎
    SY_GUIDE = 319, // 神域新手引导战斗
    SY_ZYSS = 320, // 神域阵营神兽-PVE
    /** 异界妖门-小怪 */
    YM_XG = 321,
    /** 异界妖门-精英怪 */
    YM_JYG = 322,
    /** 异界妖门-妖王 */
    YM_BOSS = 323,
    /** 颠峰竞技回放 */
    DFJJ_REPLAY = 324,
    /** 切磋 */
    QieCuo = 326,
    /** 神域龙脉-小怪 */
    SY_LM_Nomrall = 327,
    /** 神域龙脉-精英 */
    SY_LM_Elite = 328,
}

export enum TURN_ATK_TYPE {
    Normall = 0,
    /** 近战 */
    Short = 1,
    /** 远程 */
    Long = 2,
    /** 中程 屏中间 */
    Centre = 3,
}

export const enum Login {
    /** 登录成功事件 */
    LoginSuccess,
    /** 登录失败事件 */
    LoginFail,
    /** 切换页面 参数：index */
    ChangeView,
    /** 玩家登录结果 */
    InitUserLoginResult,
    /** 关闭创角面板 */
    CloseCreateRole,
    /** 更新选中服务器 */
    UpdateSelectServer,
}
export interface EvntType {
    Login: Login
}

export const enum EntityType {
    /** 主角类型 */
    // PlayerAvatar,
    /** 主角宠物 */
    // PlayerPet,
    /** 地图武将 */
    MapAvatar,
    /** 怪物类型 */
    Monster,
    /** NPC类型 */
    Npc,
    /** 会移动的NPC类型 */
    MovingNpc,
    /** 宠物 */
    Pet,
}

/** 怪物等级 */
export enum MONSTER_TYPE {
    /** 普通怪物 */
    Monster = 1,
    /** NPC */
    NPC = 2,
    /** 采集物 */
    Goods = 3,
    /** 仙装怪物 */
    Soul_MONSTER = 4,
    /** 仙装NPC */
    Soul_NPC = 5,
    /** 仙装NPC */
    Monster_NPC = 6,
    /** 捕兽夹 */
    BSJ_NPC = 7,
    /** 场景内特殊特效 */
    Zoo_NPC = 8,
}

/** 物品类型 */
export const enum ItemType {
    /** 其它 */
    Other,
    /** 货币 */
    Money,
    /** 材料 */
    Material,
    /** 兑换物 */
    Exchange,
    /** 宝箱 */
    Box,
    /** 收藏品 */
    Collection,
    /** 装备 */
    Equip,
    /** 符石 */
    Rune,
    /** 丹药 */
    Pill,
    /** 命格 */
    Fate,
    /** Buff */
    Buff,
    /** 魔魂 */
    DemonSoul,
    /** 圣魂 */
    HolySoul,
    /** 宠物技能书 */
    PetSkillBook,
    /** 宝石 */
    Gem,
    /** 宠物碎片 */
    PetPiece,
    /** 仙侣精魄 */
    FairyPurSpirit,
    /** 宠物道具 */
    Pet,
    /** 带角标的材料 */
    MaterialIcon,
    /** 宝箱打开直接展示道具 */
    BoxItem,
    /** 自选宝箱专用 */
    BoxChoose,
    /** 宠物技能书碎片 */
    PetSkillPiece,
    /** 剑魂 */
    Sword = 23,
    /** 龙魂 */
    Dragon = 26,
}

/** 通用的YesNo，0是NO，1为Yes */
export const enum CommonYesNo {
    /** 未领取/没有 */
    No,
    /** 已领取/有 */
    Yes,
}

/** 装备穿戴状态 */
export const enum EquipWearStatus {
    /** 未装备 */
    No = 1,
    /** 已装备 */
    Yes = 2
}

/** 装备类型 */
export const enum EquipType {
    /** 普通装备 */
    Normall,
    /** 神装 */
    Gold,
    /** 套装 */
    Suit,
    /** 进阶装备 */
    Grade,
    /** 凶兽装备 */
    XiongShou,
    /** 合体天仙装备 */
    Fariy,
    /** 幻灵装备 */
    HuanLing,
    /** 偃甲装备 */
    YanJia,
    /** 王者套装 */
    King,
    /** 圣物 */
    ShengWu,
    /** 英雄装备 */
    Hero,
    /** 宠物装备 */
    Pet
}

/** tip类型。对应显示不同形态的tip */
export const enum DetailType {
    /** （默认类）大部分道具属于此类。无参数 */
    Normall_0 = 0,
    /** （称号类）参数为 称号id */
    ChengHao_1 = 1,
    /** （装备类）无参数 */
    Equip_2 = 2,
    /** （皮肤类）参数为 皮肤id */
    Skin_3 = 3,
    /** （套装类）参数为 套装id */
    Suit_4 = 4,
    /** （宠物类）参数为 宠物id */
    Pet_5 = 5,
    /** （仙侣精魄类）参数为 仙侣id */
    XianLv_6 = 6,
    /** （神装） */
    ShenZhuang_7 = 7,
    /** （魔灵） */
    MoLing_8 = 8,
    /** （战神) */
    ZhanShen_9 = 9,
    /** （战神-灵兽） */
    ZhanShenLH_10 = 10,
    /** （魔魂） */
    MoHun_11 = 11,
    /** （神器）参数为神器id */
    ShenQi_12 = 12,
    /** 圣杯 */
    ShengBei_13 = 13,
    /** 精灵 */
    JingLing_14 = 14,
    /** 剑魂 */
    JianHun_15 = 15,
    /** 英雄帖 */
    YingXiongTie_16 = 16,
    /** 幻灵灵武和灵武皮肤 */
    HL_LW_LWSkin_17 = 17,
    /** 异兽铭牌碎片 */
    YSMPSP_18 = 18,
    /** 凶兽元神 */
    XiongShowYuanShen_19 = 19,
    /** 奇门遁甲 */
    QiMenDunJia_20 = 20,
    /** 偃甲核心 */
    YanJiaHeXin_21 = 21,
    /** 未知 */
    Unknown_22 = 22,
    /** 龙魂 */
    LongHun_23 = 23,
}

/** 品质枚举 */
export const enum QualityType {
    /** unknown-2 */
    unknown_2 = -2,
    /** unknown-1 */
    unknown_1 = -1,
    /** 默认 */
    Normall = 0,
    /** 白 */
    B = 1,
    /** 蓝 */
    L = 2,
    /** 紫 */
    Z = 3,
    /** 橙 */
    C = 4,
    /** 红 */
    R = 5,
    /** 金 */
    J = 6,
    /** 彩 */
    Color = 7,
    /** 粉 */
    F = 8,
    unknown9 = 9,
    unknown10 = 10,
}

/** 功能枚举 */
export const enum FuncType {
    Normall = 0,
    RoleEquip = 7, // 人物
    /** 宠物 */
    Pet = 11, // 宠物
    Fairy = 24, // 天仙
    FairyClass = 27, // 天仙仙阶
    FairyCx = 28, // 天仙合体
    /** 宠物装备 */
    PetEquip = 39,
    QieCuo = 52, // 切磋
    /** 锻造 */
    PetDuanZao = 61,
    SwordSoul = 92, // 剑魂
    SwordH = 93, // 剑魂主页面
    SwdHHC = 94, //  剑魂合成页面
    SwrdTL = 95, // 剑魂图录页面
    SwrdJZ = 96, // 剑魂剑阵页面
    /** 天仙奇缘 */
    TianXianQiYuan = 100,
    ShareShenYu = 128, // 神域分享
    Horse = 159, // 坐骑
    Wing = 158, // 翅膀
    Weapon = 157, // 神兵
    Precious = 156, // 人物法宝
    /** 900 法阵 */
    Circle = 900, // 法阵
    /** 901 主角法阵 */
    CircleRole = 901, // 主角法阵
    /** 902 战神法阵 */
    CircleMars = 902, // 战神法阵
    /** 903 天仙法阵 */
    CircleTx = 903, // 天仙法阵
    /** 904 仙童法阵 */
    CircleFb = 904, // 仙童法阵
    /** 905 宠物法阵 */
    CirclePet = 905, // 宠物法阵
    /** 906 偃甲法阵 */
    CircleYanJia = 906, // 偃甲法阵
    /** 907 英雄法阵 */
    CircleHero = 907, // 英雄法阵
    CircleOwn = 920, // 认主
    Warrior = 11161, // 战神
    WarriorPet = 11162, // 战神战骑
    GodClass = 11163, // 战神神阶
    MarsBaby = 11166, // 战神宝宝
    GoldChange = 11168, // 战神神变
    FairyBoy = 14001, // 仙童
    HorseSkin = 163, // 坐骑皮肤
    HorseTongLing = 14203, // 坐骑通灵
    YanJa = 15001, // 偃甲
    YanJBW = 15021, // 偃甲兵卫
    HuanLing = 14104, // 幻灵
    ShouLing = 201, // 兽灵
    FaQi = 210, // 天仙法器
    Hero = 14115, // 英雄
    YIShow = 14501, // 异兽
    Horse_TLing = 14203, // 坐骑通灵
    ShenYu = 14301, // 神域
    ShengH = 14302, // 圣痕
    SYHDGQ = 14305, // 神域活动关卡
    SYHDTG = 14306, // 神域活动天宫
    SYLM = 14308, // 神域龙脉
    YJYM = 11066, // 异界妖门
    YJFX = 15201, // 御剑飞仙
    DSGL = 21122, // 大圣归来
    SCHL = 21124, // 首充豪礼
    DrgTrain = 16001, // 神龙培养
    DrgWsh = 16004, // 神龙许愿
    BDJJ = 750, // 榜单竞技
    BDJJ_BOSS1 = 751, // 榜单竞技BOSS1
    BDJJ_BOSS2 = 752, // 榜单竞技BOSS1

    HuanLingSkin1 = 141040011, // 幻灵皮肤
    HuanLingSkin2 = 141040012, // 幻灵皮肤
    HuanLingSkin3 = 141040013, // 幻灵皮肤
    HuanLingSkin4 = 141040014, // 幻灵皮肤
    HuanLingSkin5 = 141040015, // 幻灵皮肤
    HuanLingWep1 = 141040001, // 幻灵灵武
    HuanLingWep2 = 141040002, // 幻灵灵武
    HuanLingWep3 = 141040003, // 幻灵灵武
    HuanLingWep4 = 141040004, // 幻灵灵武
    HuanLingWep5 = 141040005, // 幻灵灵武
    HeroSknExt = 14124,
    HeroSknExtLB = 1412401, // 刘备
    HeroSknExtZF = 1412402, // 张飞
    HeroSknExtGY = 1412403, // 关羽
    HeroSknExtZY = 1412404, // 赵云
    HeroSknExtLV = 1412405, // 吕布
    HeroSknExtMC = 1412406, // 马超
    HeroSknExtZGL = 1412407, // 诸葛亮
    HeroSknExtPT = 1412408, // 庞统
    HeroSknExtSMY = 1412409, // 司马懿
}

/** 展示来源 */
export const enum ShowSrc {
    /** 默认 */
    Normall = 0,
    /** 背包面板 */
    BagView = 1,
    /** 主角面板 */
    RoleView = 2,
    /** 展示面板 */
    Show = 5,
    /** 显示基础信息 */
    ShowBase = 6,
    /** 镀金 */
    DuJin = 7,
    /** 铸魂 */
    Zhuhun = 8,
    /** 其它玩家装备详情 */
    OtherRoleEquipInfo = 10,
}

export const enum ItemTypeView {
    TypeView,
    Bag,
}

/**
 * 战斗单位类型
 */
export enum UNIT_TYPE {
    Player = 0, // 玩家

    Pet = 1, // 宠物
    PetA = 2, // 仙侣
    Warrior = 3, // 战神
    SoulBoy = 4, // 灵童
    YanJia = 5, // 偃甲
    Alien = 6, // 异兽
    Hero = 7, // 英雄
    Monster = 8, // 怪物
    Dragon = 9, // 神龙
}
