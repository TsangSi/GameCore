/*
 * @Author: zs
 * @Date: 2022-07-26 18:36:33
 * @FilePath: \SanGuo\assets\script\game\module\reddot\RedDotConst.ts
 * @Description:
 *
 */

export enum ERedListen {
    /** 协议id */
    ProtoId,
    /** 道具id */
    ItemId,
    /** 道具类型 */
    ItemType,
    /** 道具子类型 */
    ItemSubType,
    /** 人物属性 */
    RoleAttr,
    /** 事件 */
    EventClient,
}

export interface IListenInfo {
    /** 协议id列表 */
    ProtoId?: number[],
    /** 道具id列表 */
    ItemId?: number[],
    /** 道具type列表 */
    ItemType?: number[],
    /** 道具子类型列表 */
    ItemSubType?: number[],
    /** 人物属性 */
    RoleAttr?: string[],
    /** 前端事件 */
    EventClient?: string[],
    /** 界面id，该列表的界面正在显示的话，才会触发该红点检测，否则触发代理红点去检测 */
    CheckVid?: number[],
    /** 代理红点 */
    ProxyRid?: number[],
}

export interface IRedInfo extends IListenInfo {
    /** 父红点列表 */
    Pids?: number[],
    /** 显示中的子红点列表 */
    showChilds: number[],
    /** 显示中的子红点列表长度 */
    length: number,
    /** 是否没有子节点，最后一层 */
    isNoneChild: boolean,
    /** CC_DEV 模式下才有，红点的key名 */
    n?: string,
    /** CC_DEV 模式下才有，总的子红点列表 */
    childs?: number[],
}

export interface IRedDotMgr {
    /** 根据红点id获取实际触发的红点id列表 */
    getNeedCallRids: (rid: number) => number[];
    /** 是否显示红点 */
    getStatus: (rid: number) => boolean;
    /** 获取红点名字，Dev下才能拿到正确的值 */
    getRedName: (rid: number) => string;
}

let _rid = 0;
/**
 * 获取自增的红点id
 * @param keepCount 保留数量，假如上一次返回是1，保留5位，当前自己就是2，别人下次使用就是从8开始，3-7就是被保留下来的，
 * @returns 返回唯一id
 */
function GetRID(keepCount: number = 0) {
    _rid++;
    // _rid += UtilNum.RandomInt(1000, 10000000);
    const curId = _rid;
    _rid += keepCount;
    return curId;
}

/** 添加监听信息 (...datas: { rid: number, info: IListenInfo }[]) */
export const REDDOT_ADD_LISTEN_INFO = 9999;

/** 后端定的红点id，由后端下发，该ID不能重复，不能小于10001，不能赋值给树状结构的Id字段 */
enum ESRID {
    /** 个人首领 */
    Personal = 10001,
    /** 至尊首领 */
    Vip = 10002,
    /** 多人boss */
    MultiBoss = 10003,
    /** 烽火连城 */
    BeaconWarTili = 10004,
    BeaconWarBag = 10005,

    /** 官印相关 */
    SealUp = 10010,
    SealStar = 10011,
    SealStarBreak = 10012,
    SealRefine = 10013,
    SealRefineBreak = 10014,
    /** 虎符相关 */
    AmuletUp = 10015,
    AmuletStar = 10016,
    AmuletStarBreak = 10017,
    AmuletRefine = 10018,
    AmuletRefineBreak = 10019,

    /** 头像 头像框 */
    Head = 10020,
    HeadFrame = 10021,
    ChatBubble = 10024,
    /** 好友 */
    Friend = 10022,
    ApplyFriend = 10023,
    /** 押镖页签红点 */
    Escort = 10025,
    /** 任务红点 */
    CollectionBookTask = 10101,
    /** 生涯红点 */
    CollectionBookCareer = 10102,
    /** 奇物红点 */
    CollectionBookWonder = 10103,
    /** 人物红点 */
    CollectionBookPerson = 10104,
    /** 武艺红点 */
    RoleSkillMartial = 10201,

    /** 游历天下 */
    Adventure = 10701,

    /** 西域行商 */
    SilkRoad = 10351,
    /** 宝石装备 */
    Gem = 10401,

    /** 每日任务 */
    DailyTask = 10451,
    /** 每周任务 */
    WeeklyTask = 10452,
    /** 资源找回 */
    ResRecovered = 10453,
    /** 功能找回 */
    FuncRecovered = 10454,
    /** 排位赛 */
    RankMatch = 10008,
    /** 三国探险 */
    FBExplore = 10601,
    /** 炼体 */
    Exercise = 10801,
    /** 功能预告 */
    FuncPreview = 10650,

    /** 军师等级 */
    AdviserLevel = 10901,
    /** 军师专精 */
    AdviserMastery = 10902,
}

/** 活动类的入口红点为100000+活动id */
export const EActivityRedId = 100000;
/** 活动等级战力通行证内部页签id  200000 + 页签id */
export const EActivityGeneralPassRedId = 500000;

/** 树状结构的红点 */
export const RID = {
    /** 背包入口 */
    Bag: {
        /** 背包红点 */
        Id: GetRID(),
        /** 邮件 */
        Mail: {
            /** 邮件红点 */
            Id: GetRID(),
            /** 普通邮件红点 */
            Normal: GetRID(),
            /** 重要邮件红点 */
            Importance: GetRID(),
        },
        /** 合成 */
        MergeMat: GetRID(),
        /** 背包道具红点 */
        Item: GetRID(),
    },
    /** 首领 */
    Boss: {
        Id: GetRID(),
        /** 本服首领 */
        LocalBoss: {
            Id: GetRID(),
            /** 个人首领 */
            Personal: ESRID.Personal,
            /** 至尊首领 */
            Vip: ESRID.Vip,
            /** 多人首领 */
            MultiBoss: ESRID.MultiBoss,
        },
        /** 跨服首领 */
        CrossBoss: {
            Id: GetRID(),
            /** 名将来袭 */
            WorldBoss: GetRID(),
            /** 烽火连城 */
            BeaconWar: {
                Id: GetRID(),
                Tili: ESRID.BeaconWarTili,
                Bag: ESRID.BeaconWarBag,
            },
        },
    },
    /** 角色 */
    Role: {
        Id: GetRID(),

        /** 角色页签 */
        Role: {
            Id: GetRID(),
            /** 称号 */
            Title: GetRID(),
            /** 时装 */
            Skin: {
                Id: GetRID(),
                /** 时装页签 */
                SkinPage: {
                    Id: GetRID(),
                    /** 时装列表 */
                    List: GetRID(),
                    /** 注灵 */
                    ZhuLing: GetRID(),
                    /** 炼神 */
                    LianShen: GetRID(),
                },
                /** 时装套装页签 */
                SuitPage: GetRID(8),
                /** 活动套装页签 */
                ActivitySuitPage: GetRID(),
                /** 异域套装页签 */
                ExoticSuitPage: GetRID(),
            },
            /** 华服 */
            SpecialSuit: {
                Id: GetRID(),
                Base: GetRID(),
                /** 华服内部红点融合 */
                // Parts: {
                //     Id: GetRID(),
                //     Special: {
                //         Id: GetRID(),
                //         Part: GetRID(),
                //         UpGrade: GetRID(),
                //     },
                // },
            },
            Exercise: ESRID.Exercise,
        },

        /** 技能页签 */
        RoleSkill: {
            Id: GetRID(),
            /** 角色技能-技能页 */
            Skill: GetRID(),
            /** 角色技能-绝学 */
            UniqueSkill: GetRID(),
            /** 角色技能-武艺 */
            MartialSkill: ESRID.RoleSkillMartial,
        },
        /** 官职 */
        RoleOfficial: {
            /** 官职红点 */
            Id: GetRID(),
            /** 官职红点 */
            Official: {
                Id: GetRID(),
                /** 官职升职 */
                Up: GetRID(),
                /** 官职任务 */
                Task: GetRID(),
                /** 官职奖励 */
                Reward: {
                    Id: GetRID(),
                    /** 等级奖励 */
                    Rank: GetRID(),
                    /** 每日奖励 */
                    Day: GetRID(),
                },
                /** 官印虎符 */
                SealAmulet: {
                    Id: GetRID(),
                    /** 官印 */
                    Seal: {
                        Id: GetRID(),
                        /** 官印升级 */
                        Grade: {
                            Id: GetRID(),
                            /** 官印 升级一键升级 */
                            Btn: ESRID.SealUp,
                        },
                        /** 官印升星 */
                        Star: {
                            Id: GetRID(),
                            /** 官印升星 一键升星 */
                            Up: ESRID.SealStar,
                            /** 官印升星突破 */
                            Break: ESRID.SealStarBreak,
                        },
                        /** 官印淬炼 */
                        Refine: {
                            Id: GetRID(),
                            /** 官印淬炼按钮 */
                            Up: ESRID.SealRefine,
                            /** 官印淬炼突破 */
                            Break: ESRID.SealRefineBreak,
                        },
                    },
                    /** 虎符 */
                    Amulet: {
                        Id: GetRID(),
                        /** 虎符升级 */
                        Grade: {
                            Id: GetRID(),
                            /** 虎符升级按钮 */
                            Btn: ESRID.AmuletUp,
                        },
                        /** 虎符升星 */
                        Star: {
                            Id: GetRID(),
                            /** 虎符升星 一键升星按钮 */
                            Up: ESRID.AmuletStar,
                            /** 虎符升星突破 */
                            Break: ESRID.AmuletStarBreak,
                        },
                        /** 虎符淬炼 */
                        Refine: {
                            Id: GetRID(),
                            /** 虎符淬炼 */
                            Up: ESRID.AmuletRefine,
                            /** 虎符淬炼突破 */
                            Break: ESRID.AmuletRefineBreak,
                        },
                    },
                },

            },
            /** 军衔红点 */
            ArmyLevel: {
                Id: GetRID(), // 军衔红点
                /** 任务基础模块 */
                TaskInfo: GetRID(),
                /** 点击晋升 */
                LvUp: GetRID(),
                /** 军衔- 一键晋升 */
                AutoLvUp: GetRID(),
                /** 任务部分-绝学 */
                SkillActive: GetRID(),
            },
        },
    },
    /** 进阶豪礼 */
    GradeGift: {
        Id: GetRID(),
        /** 坐骑 */
        Horse: GetRID(),
        /** 羽翼 */
        Wing: GetRID(),
        /** 光武 */
        Weapon: GetRID(),
        /** 红颜才艺 */
        Beauty: GetRID(),
        /** 军师智略 */
        Adviser: GetRID(),
        /** 光武 */
        Pet: GetRID(),
    },

    /** 进阶入口 */
    Grade: {
        /** 进阶红点 */
        Id: GetRID(),
        /** 坐骑红点 */
        Horse: {
            Id: GetRID(),
            /** 升阶 */
            Up: {
                Id: GetRID(),
                /** 进阶豪礼 */
                JJHL: GetRID(),
                /** 三倍领取 */
                SBLQ: GetRID(),
                /** 炼神 */
                GOD: GetRID(),
                /** 注灵 */
                SOUL: GetRID(),
                /** 技能 */
                SKILL: GetRID(),
                /** 升星 */
                UP_STAR: GetRID(),
                /** 一键升星 */
                UP_STAR_ONEKEY: GetRID(),
                /** 突破升阶 */
                UP_LEVEL: GetRID(),
            },
            /** 装备 */
            Equip: {
                Id: GetRID(),
                /** 更好的 */
                BETTER: GetRID(),
                /** 强化 */
                STRENGTH: GetRID(),
                /** 化金 */
                BE_GOLD: GetRID(),
                /** 打造红点 */
                Build: GetRID(),
            },
            /** 皮肤 */
            Skin: {
                Id: GetRID(),
                /** 激活 */
                ACTIVE: GetRID(),
                /** 升星 */
                UP_STAR: GetRID(),
            },
        },
        /** 羽翼红点 */
        Wing: {
            Id: GetRID(),
            /** 升阶 */
            Up: {
                Id: GetRID(),
                /** 进阶豪礼 */
                JJHL: GetRID(),
                /** 三倍领取 */
                SBLQ: GetRID(),
                /** 炼神 */
                GOD: GetRID(),
                /** 注灵 */
                SOUL: GetRID(),
                /** 技能 */
                SKILL: GetRID(),
                /** 升星 */
                UP_STAR: GetRID(),
                /** 一键升星 */
                UP_STAR_ONEKEY: GetRID(),
                /** 突破升阶 */
                UP_LEVEL: GetRID(),
            },
            /** 装备 */
            Equip: {
                Id: GetRID(),
                /** 更好的 */
                BETTER: GetRID(),
                /** 强化 */
                STRENGTH: GetRID(),
                /** 化金 */
                BE_GOLD: GetRID(),
                /** 打造红点 */
                Build: GetRID(),
            },
            /** 皮肤 */
            Skin: {
                Id: GetRID(),
                /** 激活 */
                ACTIVE: GetRID(),
                /** 升星 */
                UP_STAR: GetRID(),
            },

        },
        /** 光武红点 */
        Weapon: {
            Id: GetRID(),
            /** 升阶 */
            Up: {
                Id: GetRID(),
                /** 进阶豪礼 */
                JJHL: GetRID(),
                /** 三倍领取 */
                SBLQ: GetRID(),
                /** 炼神 */
                GOD: GetRID(),
                /** 注灵 */
                SOUL: GetRID(),
                /** 技能 */
                SKILL: GetRID(),
                /** 升星 */
                UP_STAR: GetRID(),
                /** 一键升星 */
                UP_STAR_ONEKEY: GetRID(),
                /** 突破升阶 */
                UP_LEVEL: GetRID(),
            },
            /** 装备 */
            Equip: {
                Id: GetRID(),
                /** 更好的 */
                BETTER: GetRID(),
                /** 强化 */
                STRENGTH: GetRID(),
                /** 化金 */
                BE_GOLD: GetRID(),
                /** 打造红点 */
                Build: GetRID(),
            },
            /** 皮肤 */
            Skin: {
                Id: GetRID(),
                /** 激活 */
                ACTIVE: GetRID(),
                /** 升星 */
                UP_STAR: GetRID(),
            },

        },

        /** 萌宠 */
        Pet: {
            Id: GetRID(),
            /** 升阶 */
            Up: {
                Id: GetRID(),
                /** 进阶豪礼 */
                JJHL: GetRID(),
                /** 三倍领取 */
                SBLQ: GetRID(),
                /** 炼神 */
                GOD: GetRID(),
                /** 注灵 */
                SOUL: GetRID(),
                /** 技能 */
                SKILL: GetRID(),
                /** 升星 */
                UP_STAR: GetRID(),
                /** 一键升星 */
                UP_STAR_ONEKEY: GetRID(),
                /** 突破升阶 */
                UP_LEVEL: GetRID(),
            },
            /** 装备 */
            Equip: {
                Id: GetRID(),
                /** 更好的 */
                BETTER: GetRID(),
                /** 强化 */
                STRENGTH: GetRID(),
                /** 化金 */
                BE_GOLD: GetRID(),
                /** 打造红点 */
                Build: GetRID(),
            },
            /** 皮肤 */
            Skin: {
                Id: GetRID(),
                /** 激活 */
                ACTIVE: GetRID(),
                /** 升星 */
                UP_STAR: GetRID(),
            },

        },
    },
    /** 角色装备 */
    Equip: {
        /** 装备红点 */
        Id: GetRID(),
        /** 强化红点 */
        Strength: {
            /** 强化功能红点 */
            Id: GetRID(),
            /** 一键强化 */
            OneKeyStrength: GetRID(),
            /** 共鸣 */
            Resonance: GetRID(),
        },
        /** 打造红点 */
        Build: GetRID(),
        /** 装备升星 */
        UpStar: GetRID(),
        /* 装备宝石 */
        Gem: ESRID.Gem,
    },

    /** 个人竞技场 */
    Arena: {
        /** 竞技场红点 */
        Id: GetRID(),
        /** 个人竞技场 */
        Arena: GetRID(),
        /** 排位赛 */
        RankMatch: {
            Id: GetRID(),
            /** 后端下发的排位赛页签 */
            Base: ESRID.RankMatch,
            Reward: {
                Id: GetRID(),
                /** 胜场奖励 */
                Win: {
                    Id: GetRID(),
                    Base: GetRID(),
                    DayFirst: GetRID(),
                },
                /** 段位奖励 */
                Segme: GetRID(),
            },
        },
    },
    /** 材料副本红点 */
    MaterialFB: {
        /** 材料副本 */
        Id: GetRID(),
        /** 材料副本页签 page */
        Material: {
            Id: GetRID(),
            /** 材料副本界面UI */
            MaterialView: GetRID(),
        },
        /** 组队副本页签 */
        Team: {
            Id: GetRID(),
            /** 组队阵容 */
            TeamPlan: GetRID(),
            /** 红颜，武将，军师，xx，xx，预留10个 */
            Type: GetRID(10),
            // General: GetRID(),
        },
        /** 三国探险页签 */
        FBExplore: ESRID.FBExplore,
    },
    /** 武将红点 */
    General: {
        Id: GetRID(),
        /** 武将信息页 */
        Main: {
            Id: GetRID(),

            /** 布阵 */
            Plan: {
                Id: GetRID(),
                /** 武将 */
                General: GetRID(),
                /** 红颜 */
                Beauty: GetRID(),
            },

            /** 所有武将里有任何一个皮肤可激活或升星 */
            Gskin: GetRID(),

            /** 出战的武将有任何一个可升级 */
            LevelUp: GetRID(),

            /** 出战的武将有任何一个可升阶 */
            GradeUp: GetRID(),

            /** 出战的武将有任何一个可觉醒 */
            Awaken: GetRID(),

            /** 出战的武将-装备 */
            Equip: GetRID(),

            /** 出战的武将-技能 */
            Skill: GetRID(),

            /** 合成 */
            Compose: GetRID(),
        },
        /** 只和选中的武将有关，不需关联父级的红点 */
        Cur: {
            /** 当前选中的武将的皮肤是否有红点 */
            CurSkin: GetRID(),
            /** 当前选中的武将是否能升级 */
            CurLvUp: GetRID(),
            /** 当前选中的武将是否能升阶 */
            CurGradeUp: GetRID(),
            /** 当前选中的武将是否能觉醒 */
            CurAwaken: GetRID(),
            /** 当前选中的武将的装备红点 */
            CurEquip: {
                Id: GetRID(),
                CurWear: GetRID(),
                CurStarUp: GetRID(),
            },
        },
        /** 升品 */
        QualityUp: {
            Id: GetRID(),
        },

    },
    Vip: {
        Id: GetRID(),
        Recharge: GetRID(),
        Vip: {
            Id: GetRID(),
            Vip: GetRID(),
            Svip: {
                Id: GetRID(),
                Base: GetRID(),
                Daily: GetRID(),
            },
        },
    },
    Shop: {
        Id: GetRID(),
        Discount: {
            Id: GetRID(),
            Base: GetRID(),
        },
    },
    /** 关卡 */
    Stage: {
        Id: GetRID(),
        /** 主线关卡 */
        Main: {
            Id: GetRID(),
            /** 通行证 */
            Pass: {
                Id: GetRID(),
                /** 章节，保留100个 */
                Chapter: GetRID(100),
            },
            // Pass: {
            //     Id: GetRID(),
            //     1: GetRID(),
            //     2: GetRID(),
            //     3: GetRID(),
            // },
        },
    },
    /** 排行榜红点 */
    RankList: {
        Id: GetRID(),
        Mobai: {
            Id: GetRID(),
            Local: GetRID(),
            More: GetRID(),
        },
        /** 世界等级 */
        WorldLevel: GetRID(),

    },
    /** 锻造-现在为国士 */
    Forge: {
        Id: GetRID(),
        /** 红颜 */
        Beauty: {
            Id: GetRID(),
            /** 红颜升级页签 */
            UpLevel: GetRID(),
            /** 红颜升星页签 */
            UpStar: GetRID(),
            /** 红颜才艺页签 */
            Grade: {
                Id: GetRID(),
                Up: {
                    Id: GetRID(),
                    /** 进阶豪礼 */
                    JJHL: GetRID(),
                    /** 三倍领取 */
                    SBLQ: GetRID(),
                    /** 炼神 */
                    GOD: GetRID(),
                    /** 注灵 */
                    SOUL: GetRID(),
                    /** 技能 */
                    SKILL: GetRID(),
                    /** 升星 */
                    UP_STAR: GetRID(),
                    /** 一键升星 */
                    UP_STAR_ONEKEY: GetRID(),
                    /** 突破升阶 */
                    UP_LEVEL: GetRID(),
                },
                Equip: {
                    Id: GetRID(),
                    /** 更好的 */
                    BETTER: GetRID(),
                    /** 强化 */
                    STRENGTH: GetRID(),
                    /** 化金 */
                    BE_GOLD: GetRID(),
                    /** 打造红点 */
                    Build: GetRID(),
                },
            },
        },
        /** 军师 */
        Adviser: {
            Id: GetRID(),
            /** 军师升级页签 */
            UpLevel: ESRID.AdviserLevel,
            /** 军师智略 */
            UpStar: GetRID(),
            /** 军师专精页签 */
            Mastery: {
                Id: GetRID(),
                Base: ESRID.AdviserMastery,
                FirstMastery: GetRID(6),
            },
            /** 军师才艺页签 */
            Grade: {
                Id: GetRID(),
                Up: {
                    Id: GetRID(),
                    /** 进阶豪礼 */
                    JJHL: GetRID(),
                    /** 三倍领取 */
                    SBLQ: GetRID(),
                    /** 炼神 */
                    GOD: GetRID(),
                    /** 注灵 */
                    SOUL: GetRID(),
                    /** 技能 */
                    SKILL: GetRID(),
                    /** 升星 */
                    UP_STAR: GetRID(),
                    /** 一键升星 */
                    UP_STAR_ONEKEY: GetRID(),
                    /** 突破升阶 */
                    UP_LEVEL: GetRID(),
                },
                Equip: {
                    Id: GetRID(),
                    /** 更好的 */
                    BETTER: GetRID(),
                    /** 强化 */
                    STRENGTH: GetRID(),
                    /** 化金 */
                    BE_GOLD: GetRID(),
                    /** 打造红点 */
                    Build: GetRID(),
                },
            },
        },
        Friend: {
            Id: GetRID(),
            shop: {
                Id: ESRID.ApplyFriend,
            },
            gift: {
                Id: GetRID(),
            },
        },
    },
    /** 更多 */
    More: {
        Id: GetRID(),
        Friend: {
            Id: GetRID(),
            Func: GetRID(),
            MyFriend: {
                Id: GetRID(),
                Base: ESRID.Friend,
                Chat: GetRID(),
            },
            ApplyFriend: ESRID.ApplyFriend,
        },
        /** 博物志 */
        CollectionBook: {
            Id: GetRID(),
            Task: ESRID.CollectionBookTask,
            Career: ESRID.CollectionBookCareer,
            Wonder: {
                Id: GetRID(),
                Base: ESRID.CollectionBookWonder,
                SubType: GetRID(10),
            },
            Person: {
                Id: GetRID(),
                Base: ESRID.CollectionBookPerson,
                SubType: GetRID(10),
            },
        },
    },
    Setting: {
        Id: GetRID(),
        Head: ESRID.Head,
        HeadFrame: ESRID.HeadFrame,
        ChatBubble: ESRID.ChatBubble,
    },
    Family: {
        Id: GetRID(), // 最外层势力
        FamilyHome: {
            Id: GetRID(), // 主页红点
            Family: {
                Id: GetRID(), // 进入世家按钮红点
                /** 世家-世家 */
                FamilyFamily: {
                    Id: 10503, // 进入世家按钮红点
                    /** 世家-族长争夺 */
                    FamilyFight: 10505,
                    /** 世家-处理事务 */
                    FamilyTask: 10506,
                    /** 世家-试炼副本 */
                    FamilyFb: 10507,
                },
                /** 世家-成员 */
                FamilyMember: 10504,
                /** 世家-图腾 */
                FamilyTotem: 10501,
                /** 世家-校场 */
                FamilyDrillGround: 10502,
            },
        },
    },

    /** 日常任务 */
    DailyTask: {
        Id: GetRID(),
        /** 日常 */
        Daily: ESRID.DailyTask,
        /** 每周 */
        Weekly: ESRID.WeeklyTask,
        /** 回收 */
        ResRecovery: {
            Id: GetRID(),
            /** 资源回收 */
            Res: ESRID.ResRecovered,
            /** 功能回收 */
            Func: ESRID.FuncRecovered,
        },
        /** 押镖 */
        Escort: GetRID(),
        /** 西域行商 */
        SilkRoad: ESRID.SilkRoad,
        /** 功能预告 */
        FuncPreview: {
            Id: ESRID.FuncPreview,
        },

        /** 游历 */
        Adventure: ESRID.Adventure,
        /** 华容道 */
        Huarongdao: {
            Id: GetRID(),
            /** 活动开启时间 前端计算活动开启时间的时候处理 */
            Time: GetRID(),
            /** 服务端推送红点（无推送，前端根据时间统计） */
            // Ser: ESRID.Huarongdao,
        },
    },

    /** 聊天 */
    Chat: {
        Id: GetRID(),
        /** 综合频道 */
        Total: GetRID(),
        /** 世家频道 */
        Current: GetRID(),
        /** 世界频道 */
        World: GetRID(),

    },
};

export enum ERedDotStyle {
    /** 默认 无文本 */
    Nor,
    /** new  红点上有个新字 */
    New,
    /** 带数字 */
    Num,
}
