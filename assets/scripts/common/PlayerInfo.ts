/* eslint-disable camelcase */
export class PlayerInfo {
    static AttrType: { [type: number]: string} = {
        1: 'Hp', // 生命
        2: 'Atk', // 攻击
        3: 'Def', // 防御
        4: 'Hit', // 命中(万分比)
        5: 'Avd', // 闪避(万分比)
        6: 'Cri', // 暴击(万分比)
        7: 'ACri', // 防暴击(万分比)
        8: 'Speed', // 速度
        9: 'Atk1', // 无视防御
        10: 'Def1', // 减免无视
        11: 'Atk2', // 伤害加深
        12: 'Def2', // 伤害减少
        13: 'Atk3', // 伤害增加%
        14: 'Def3', // 伤害减少%
        15: 'Atk4', // 暴击伤害增加
        16: 'Def4', // 暴击伤害减少
        17: 'Atk5', // 致命一击概率增加
        18: 'Def5', // 致命一击概率减少
        19: 'Atk6', // PVP伤害增加(万分比)
        20: 'Def6', // PVP伤害减少(万分比)
        21: 'Atk7', // PVE伤害增加(万分比)
        22: 'Def7', // PVE伤害减少(万分比)
        23: 'ExtraHurt', // 额外伤害
        24: 'Atk8', // 仙概率增加
        25: 'Def8', // 仙概率减少
        26: 'JinAtk', // 金攻击
        27: 'JinDef', // 金防御
        28: 'MuAtk', // 木攻击
        29: 'MuDef', // 木防御
        30: 'ShuiAtk', // 水攻击
        31: 'ShuiDef', // 水防御
        32: 'HuoAtk', // 火攻击
        33: 'HuoDef', // 火防御
        34: 'TuAtk', // 土攻击
        35: 'TuDef', // 土防御
        36: 'AllAtk', // 全系攻击
        37: 'AllDef', // 全系防御
        38: 'JinAtk2', // 金伤害加深
        39: 'JinDef2', // 金伤害减免
        40: 'MuAt2k', // 木伤害加深
        41: 'MuDef2', // 木伤害减免
        42: 'ShuiAtk2', // 水伤害加深
        43: 'ShuiDef2', // 水伤害减免
        44: 'HuoAtk2', // 火伤害加深
        45: 'HuoDef2', // 火伤害减免
        46: 'TuAtk2', // 土伤害加深
        47: 'TuDef2', // 土伤害减免
        48: 'AllAtk2', // 全系伤害加深
        49: 'AllDef2', // 全系伤害减免
        51: 'Hp_P', // 生命
        52: 'Atk_P', // 攻击
        53: 'Def_P', // 防御
        54: 'Hit_P', // 命中(万分比)
        55: 'Avd_P', // 闪避(万分比)
        56: 'Cri_P', // 暴击(万分比)
        57: 'ACri_P', // 防暴击(万分比)
        58: 'Speed_P', // 速度
        59: 'Atk1_P', // 无视防御
        60: 'Def1_P', // 减免无视
        61: 'Atk2_P', // 伤害加深
        62: 'Def2_P', // 伤害减少
        63: 'Atk3_P', // 伤害增加%
        64: 'Def3_P', // 伤害减少%
        65: 'Atk4_P', // 暴击伤害增加
        66: 'Def4_P', // 暴击伤害减少
        67: 'Atk5_P', // 魂概率增加
        68: 'Def5_P', // 魂概率减少
        69: 'Atk6_P', // PVP伤害增加(万分比)
        70: 'Def6_P', // PVP伤害减少(万分比)
        71: 'Atk7_P', // PVE伤害增加(万分比)
        72: 'Def7_P', // PVE伤害减少(万分比)
        73: 'ExtraHurt_P', // 额外伤害
        74: 'Atk8_P', // 仙概率增加
        75: 'Def8_P', // 仙概率减少
        76: 'JinAtk_P', // 金攻击百分比
        77: 'JinDef_P', // 金防御百分比
        78: 'MuAtk_P', // 木攻击百分比
        79: 'MuDef_P', // 木防御百分比
        80: 'ShuiAtk_P', // 水攻击百分比
        81: 'ShuiDef_P', // 水防御百分比
        82: 'HuoAtk_P', // 火攻击百分比
        83: 'HuoDef_P', // 火防御百分比
        84: 'TuAtk_P', // 土攻击百分比
        85: 'TuDef_P', // 土防御百分比
        86: 'AllAtk_P', // 全系攻击百分比
        87: 'AllDef_P', // 全系防御百分比
        88: 'JinAtk2_P', // 金伤害加深百分比
        89: 'JinDef2_P', // 金伤害减免百分比
        90: 'MuAt2k_P', // 木伤害加深百分比
        91: 'MuDef2_P', // 木伤害减免百分比
        92: 'ShuiAtk2_P', // 水伤害加深百分比
        93: 'ShuiDef2_P', // 水伤害减免百分比
        94: 'HuoAtk2_P', // 火伤害加深百分比
        95: 'HuoDef2_P', // 火伤害减免百分比
        96: 'TuAtk2_P', // 土伤害加深百分比
        97: 'TuDef2_P', // 土伤害减免百分比
        98: 'AllAtk2_P', // 全系伤害加深百分比
        99: 'AllDef2_P', // 全系伤害减免百分比
        100: 'UserId', // 用户编号,纯客户端用户
        101: 'Coin1', // 金币
        102: 'Coin2', // 绑定金币(暂未用)
        103: 'Coin3', // 仙玉
        104: 'Coin4', // 元宝
        105: 'Coin5', // 真气
        106: 'Coin6', // 灵兽积分
        107: 'Coin7', // 技能积分
        108: 'Coin8', // 功勋
        109: 'Coin9', // 家族币
        110: 'Coin10', // 异兽币
        111: 'Level', // 等级
        112: 'Exp', // 经验
        113: 'Nick', // 昵称
        114: 'Sex', // 性别
        115: 'LoginCpsId', // 登录cpsid
        116: 'MapId', // 地图编号
        117: 'MapX', // 地图x
        118: 'MapY', // 地图y
        119: 'CurrStage', // 当前地图的总关卡
        120: 'CurrStageTimes', // 当前关卡,小怪次数
        121: 'RoleId', // 种族ID
        122: 'HeadImg', // 头像
        123: 'Peta', // 伴侣
        124: 'RoleGodSkill', // 已解锁的仙术Id
        125: 'VipLevel', // vip等级
        126: 'SuperVip', // 超级Vip
        127: 'ChangeNickTimes', // 改名次数
        128: 'LastDay', // 记录最后登录的天数
        130: 'VipExp', // VIP经验值
        133: 'HeavenlyInstanceStageMax', // 勇闯天庭历史最高关卡
        134: 'TowerInstanceStageMax', // 玲珑宝塔历史最高关卡
        135: 'AutoStage', // 是否自动挑战关卡boss
        136: 'WeekCard', // 周卡
        137: 'MonthCard', // 月卡
        138: 'LifeCard', // 终身卡
        140: 'JJCRank', // 竞技场当前排名，不存储
        141: 'JJC_Times', // 竞技场挑战剩余次数
        142: 'JJC_NextTime', // 竞技场挑战下次增加时间
        143: 'JJCHistoryRank', // 竞技场历史最高排名
        144: 'StageSeekTimes', // 今日关卡求助次数
        145: 'StageHelpTimes', // 今日关卡帮助次数
        146: 'CreateServerId', // 出生服务器编号
        147: 'LoginServerId', // 登录服务器编号
        148: 'AreaId', // 出生区ID
        149: 'HistoryTaskId', // 当前主线任务ID
        150: 'TreasureInstanceStageMax', // 藏宝图历史最高关卡
        151: 'CrossInstanceStageMax', // 跨服副本最高关卡
        152: 'CrossInstancePrizeTimes', // 跨服副本奖励剩余次数
        153: 'CreatePrecious', // 累计高级打造法宝次数
        157: 'InstanceId', // 当前所在的副本ID
        159: 'LifeState', // 玩家生命状态
        160: 'ReviveTime', // 玩家下次复活时间
        161: 'GangInstanceStageMax', // 帮派副本历史最高关卡
        162: 'GangInstancePrizeTimes', // 帮派副本奖励剩余次数
        164: 'LimitCloth', // 是否领取过限时时装，0否，大于0存储过期倒计时
        167: 'PetCatchId', // 宠物抓取编号
        168: 'ActId', // 活动编号
        170: 'TeamId', // 活动队伍的编号
        172: 'AutoJump', // 是否勾选自动跳过
        173: 'ZFUnlock', // 阵法系统解锁日期
        174: 'ShowBuff', // 常驻增益BUFFID二维数组，用冒号和竖杠分割，表示ID、等级、到期时间戳、增幅倍数万分比
        179: 'WeeklyActId', // 周活动编号
        180: 'SM_NextTime', // 师门任务小怪下次刷新时间
        181: 'Respect', // 今日是否膜拜
        182: 'BagExtend', // 背包扩容次数
        183: 'RespectUnion', // 今日是否膜拜跨服排行榜
        184: 'Gift1', // 是否领取新号登录奖励1-转职卡+改名卡
        185: 'Gift2', // 是否领取新号登录奖励2-10000绑元+野猪+VIP5
        186: 'StageMapId', // 关卡地图编号
        187: 'ClientSwitch', // 客户端参数
        191: 'Online', // 是否在线，0否1是
        192: 'FightSign', // 战斗标志，1普通战斗，2新战斗，0无战斗
        193: 'GM', // GM
        194: 'OpenCross', // 跨服是否开启
        203: 'ShowAreaId', // 显示区ID
        204: 'BlockedAccount', // 封禁账号
        206: 'OpenSale', // 寄售服务器是否开启
        207: 'LoginAreaId', // 登录区ID
        209: 'WarriorFly', // 战神飞升阶段
        211: 'Crystal', // 水晶
        212: 'Stone', // 神石
        213: 'Iron', // 精铁
        214: 'Apple', // 苹果
        215: 'Peach', // 蟠桃
        216: 'Ginseng', // 人参果
        217: 'HelpTimes81', // 81难，今日帮助次数
        218: 'InstanceStageMax81', // 81难，最大关卡
        219: 'InstanceStageMaxDay81', // 81难，今日最大关卡
        222: 'GodClubState', // 当前仙道会状态
        223: 'GodClubSignUp', // 是否报名仙道会
        224: 'IsCollect', // 是否是采集状态
        226: 'RobberyLuck', // 渡劫幸运值
        227: 'RobberyBox', // 渡劫幸运值宝箱状态
        228: 'RobberyLevel', // 渡劫重数（等级）
        235: 'DevilSoulAuto', // 魔魂自动分解状态
        242: 'FuncOpenTime', // 功能开启时间
        245: 'OpenFunc', // 已经解锁的功能ID
        248: 'FnPreviewCfg', // 功能预告客户端缓存
        251: 'LastAFKGetTIme', // 上次领取挂机奖励时间
        252: 'AFKExp', // 积累的挂机经验数量
        253: 'AFKCoin', // 积累的挂机银两数量
        255: 'AFKEqujp', // 积累的挂机装备数量
        256: 'AFKPetPill', // 积累的挂机宠物丹数量
        260: 'AFKLQ', // 积累的挂机灵气数量
        261: 'AFKTimes', // 累计免费挂机次数
        262: 'InvincibleState', // 玩家无敌状态
        263: 'InvincibleEndTime', // 玩家无敌状态到期时间
        270: 'WeekCardDayPrize', // 周卡领取记录，格式0|0|1|0|1以此类推，0表示未领，1表示已领
        271: 'MonthCardDayPrize', // 月卡领取记录，格式0|0|1|0|1以此类推，0表示未领，1表示已领
        272: 'LifeCardDayPrize', // 终身卡今日是否已领，0否，1是
        273: 'WestExpPray', // 今日祈福ID
        274: 'LeadGet', // 新手指引已领取的奖励ID
        275: 'LeadCanGet', // 新手指引可领取的奖励ID
        276: 'DrugAdd', // 时装升星带来的仙丹上限提升值
        277: 'StageDrawTimes', // 关卡通关剩余抽奖次数
        278: 'StageDrawGet', // 关卡通过以获得的抽奖奖励ID，字符串竖杠分割
        279: 'StageDrawGroup', // 关卡抽奖当前组
        281: 'CreateTime', // 创建角色时间
        282: 'CreateDay', // 创建角色第几天
        284: 'SuperVipQQ', // 获取超级Vip的QQ
        285: 'VipDayGift', // 今日是否已领取VIP礼包
        286: 'MomoMsg', // 是否打开陌陌消息，0否1是
        287: 'MomoPrize', // 是否领取陌陌消息奖励，0否1是
        290: 'LoginMergeAreaId', // 登录合服区ID
        291: 'WorldId', // 显示世界ID
        292: 'WorldName', // 显示世界名称
        293: 'MergeWorldName', // 合服后显示世界名称
        294: 'AreaName', // 显示区服名称
        301: 'RedBag', // 今日已充值的红包档位
        321: 'Hit_Real', // 真实命中(万分比)
        322: 'Cri_Real', // 真实暴击(万分比)
        402: 'FcmStatus', // 防沉迷状态
        403: 'FcmMinute', // 防沉迷在线时间(分)
        406: 'MateName', // 伴侣名称
        407: 'MailRedPoint', // 邮件小红点
        409: 'DemonInstanceStageMax', // 降妖除魔历史最高关卡
        410: 'MateTimes', // 结婚次数
        411: 'Grade2', // 已经进入炼体阶段的升阶系统数组
        412: 'DevilAwakeValue', // 魔灵觉醒值
        413: 'NewStory', // 新号剧情完成情况
        417: 'NewPlayerZF', // 阵法系统是否已引导过，0否，1是
        418: 'MeltSettingL', // 自动熔炼设置-等级
        419: 'MeltSettingS', // 自动熔炼设置-星级
        420: 'MeltSettingQ', // 自动熔炼设置-品质
        421: 'Reborn', // 转生等级，初始为0
        423: 'EquipStrengthSuit', // 已经激活的强化大师等级
        424: 'EquipForegFree', // 每日免费洗练已使用次数
        425: 'NewEnemy', // 是否有新的仇人待查看
        427: 'DrugUse', // 各类型各等级仙丹使用情况
        429: 'Cup', // 激活圣杯ID:到期时间戳
        430: 'Medal', // 激活的所有勋章ID:等级|勋章ID:等级
        431: 'Guard', // 激活的守护精灵到期时间，初始为0
        432: 'MedalGetPrize', // 已领取奖励的勋章ID|ID|ID
        434: 'Welcome', // 是否打开过欢迎界面
        435: 'GradeMutilPrize', // 升阶三倍领取奖励倒计时，格式：功能id:等级:到期时间戳|功能id:等级:到期时间戳
        437: 'CityWarScore', // 累计获得的领地战积分
        440: 'HorseFoot', // 是否显示坐骑脚印
        441: 'SectWarScore', // 累计获得的仙宗城战积分
        442: 'SectWarTodayPraise', // 圣城之主今日是否已点赞
        451: 'RealName', // 实名认证状态
        452: 'RealNamePrize', // 是否领取过实名认证奖励
        453: 'TouristSecond', // 游客体验时间
        454: 'DayOnlineSecond', // 每天在线时间(秒)
        455: 'SeekingDragonFloor', // 寻龙点穴层数
        456: 'SeekingDragonPos', // 寻龙点穴当前位置
        457: 'SeekingDragonPrize', // 寻龙点穴阶段奖励状态
        458: 'SeekingDragonTimes', // 今日寻龙点穴次数
        461: 'SecretMallRe', // 神秘商店本日刷新次数
        462: 'TimeShopRe', // 时光贩卖机本日刷新次数
        463: 'MoonlightBoxRe', // 月光宝盒本日刷新次数
        500: 'FamilyId', // 所属家族ID
        502: 'FamilyName', // 所属家族名称
        503: 'FamilyArea', // 所属家族区服ID
        504: 'FamilyApplyNum', // 当前申请家族个数
        510: 'FTId', // 所属战队ID
        599: 'Show_Role_Skin_Suit', // 当前人物皮肤（仙装）
        600: 'Show_Role_Skin', // 当前人物皮肤（时装）
        601: 'Show_Role_Title', // 当前人物称号
        602: 'Show_Role_Life', // 当前人物历练光环
        604: 'Show_Role_GodLevel', // 当前人物仙位
        605: 'Show_Horse_Skin', // 当前显示坐骑皮肤
        606: 'Show_Precious_Skin', // 当前显示法宝皮肤
        607: 'Show_Wing_Skin', // 当前显示翅膀皮肤
        609: 'Show_Guard_Skin', // 当前显示守护皮肤
        611: 'Show_God_Skin', // 当前显示神兵皮肤
        613: 'Show_Circle_Skin', // 当前显示通灵皮肤     宠物身上
        615: 'Show_PetFly_Skin', // 当前显示兽魂皮肤     宠物身上
        617: 'Show_CircleA_Skin', // 当前显示法阵皮肤 仙侣身上(无)
        619: 'Show_TitleA_Skin', // 当前显示仙位皮肤 仙侣身上(无)
        621: 'Show_CircleB_Skin', // 当前显示花辇皮肤 战神身上(无)
        623: 'Show_TitleB_Skin', // 当前显示灵气皮肤 战神身上(无)
        625: 'Show_PetAId', // 当前跟随仙侣ID
        626: 'Show_WarriorId', // 当前跟随战神ID
        627: 'Show_SkyGodId', // 当前跟随天神ID
        628: 'Show_TempTitle', // 当前人物临时称号数组
        629: 'Show_KidId', // 当前跟随仙童ID
        630: 'Show_StarAnim', // 装备星级套装环绕光效ID
        631: 'Show_StarWeaponAnim1', // 武器星级环绕光效ID
        632: 'Show_GodAnimalInvite', // 试炼邀请玩家数组
        633: 'Show_Fairy_Boy', // 仙童(男)皮肤
        634: 'Show_Fairy_Girl', // 仙童(女)皮肤
        635: 'Show_Kid_Boy', // 跟随仙童(男)
        636: 'Show_Kid_Girl', // 跟随仙童(女)
        637: 'Show_HL', // 当前出战幻灵Id
        641: 'Show_Head', // 当前人物头像
        642: 'Show_HeadFrame', // 当前人物头像框
        643: 'Show_ChatFrame', // 当前人物聊天框
        644: 'Show_Role_Title2', // 当前人物称号2
        645: 'Show_Role_Title3', // 当前人物称号3
        646: 'Show_WarriorPet', // 当前战神灵兽
        647: 'Show_PetId1', // 当前跟随宠物资源ID1
        648: 'Show_PetId2', // 当前跟随宠物资源ID2
        649: 'Show_PetId3', // 当前跟随宠物资源ID3
        650: 'Show_Beast1', // 当前幻化凶兽ID1
        651: 'Show_Beast2', // 当前幻化凶兽ID2
        652: 'Show_Beast3', // 当前幻化凶兽ID3
        653: 'Show_Pet1', // 当前跟随宠物ID1
        654: 'Show_Pet2', // 当前跟随宠物ID2
        655: 'Show_Pet3', // 当前跟随宠物ID3
        656: 'Show_MergePetA_Skin', // 合体天仙皮肤
        657: 'Show_YanJiaId', // 当前跟随偃甲ID
        658: 'Show_YanJia_Skin', // 偃甲皮肤
        659: 'Show_kingSuit', // 王者套装法相
        660: 'Show_KingSuit_Wing', // 王者套装之翼
        661: 'Show_ZhanBao_Skin', // 当前显示战宝皮肤
        662: 'Show_ShouLing_Skin', // 当前显示兽灵皮肤
        663: 'Show_FaQi_Skin', // 当前显示法器皮肤
        664: 'Show_HeroId', // 当前出站英雄ID
        665: 'Show_SoldierGuard_Skin', // 当前显示兵卫皮肤
        666: 'Show_Alien_Id', // 当前出战异兽Id
        667: 'Show_Alien_Skin', // 当前显示异兽皮肤(弃用)
        668: 'Show_HL1_Skin', // 当前显示金幻灵皮肤
        669: 'Show_HL2_Skin', // 当前显示木幻灵皮肤
        670: 'Show_HL3_Skin', // 当前显示水幻灵皮肤
        671: 'Show_HL4_Skin', // 当前显示火幻灵皮肤
        672: 'Show_HL5_Skin', // 当前显示土幻灵皮肤
        673: 'Show_LW1_Skin', // 当前显示金灵武皮肤
        674: 'Show_LW2_Skin', // 当前显示木灵武皮肤
        675: 'Show_LW3_Skin', // 当前显示水灵武皮肤
        676: 'Show_LW4_Skin', // 当前显示火灵武皮肤
        677: 'Show_LW5_Skin', // 当前显示土灵武皮肤
        678: 'Show_Pet1_Awaken', // 当前跟随宠物1星耀等级
        679: 'Show_Pet2_Awaken', // 当前跟随宠物2星耀等级
        680: 'Show_Pet3_Awaken', // 当前跟随宠物3星耀等级
        681: 'Show_WarriorCurGC', // 当前战神神变阶级
        683: 'Show_WarriorCurGC_Level', // 当前战神神变等级
        684: 'WarriorGC_Unlock', // 当前战神神变解锁数量
        685: 'Show_SL_Skin', // 当前显示神龙皮肤
        686: 'Cur_WarriorGC_Active', // 当前战神神变是否激活
        687: 'Cur_KidsQN_Active', // 当前男童是否激活潜能飘字
        688: 'Cur_KidsQN_Girl_Active', // 当前女童是否激活潜能飘字
        689: 'Cur_KidsQN_Girl_PSkill', // 当前女童是否激活潜能被动
        690: 'Show_PetId21', // 当前跟随宠物资源2ID1
        691: 'Show_PetId22', // 当前跟随宠物资源2ID2
        692: 'Show_PetId23', // 当前跟随宠物资源2ID3
        701: 'Show_KidsQN_Grade', // 当前仙童潜能阶级(男)
        702: 'Show_KidsQN_Level', // 当前仙童潜能等级(男)
        703: 'Show_KidsQN_Grade_Girl', // 当前仙童潜能阶级(女)
        704: 'Show_KidsQN_Level_Girl', // 当前仙童潜能等级(女)
        706: 'Show_PetASX_Grade', // 天仙升仙-当前阶级
        707: 'Show_PetASX_Level', // 天仙升仙-当前等级
        708: 'Show_TianPeng_PetType', // 神兽天蓬当前变异等级
        800: 'PetFV', // 宠物最高战力
        801: 'PetAFV', // 天仙总战力
        802: 'HorseFV', // 坐骑总战力
        804: 'WingFV', // 翅膀总战力
        806: 'GuardFV', // 守护总战力
        808: 'GodFV', // 神兵总战力
        810: 'WarriorFV', // 战神总战力
        811: 'CircleAFV', // 法阵总战力
        813: 'TitleAFV', // 仙位总战力
        815: 'CircleFV', // 通灵总战力
        817: 'PetFlyFV', // 兽魂总战力
        819: 'CircleBFV', // 花辇总战力
        821: 'TitleBFV', // 灵气总战力
        823: 'KidFV', // 仙童总战力
        824: 'GodItemFV', // 神器总战力
        825: 'DevilFV', // 魔灵总战力
        826: 'SkinFV', // 玩家时装总战力
        827: 'SkinNum', // 玩家时装数量
        828: 'EquipFv', // 玩家当前穿戴装备总战力
        829: 'Rank_Reborn', // 转生排行榜
        830: 'Rank_Level', // 等级排行榜
        831: 'PreciousFV', // 法宝总战力
        832: 'PreciousLevel', // 法宝阶数
        833: 'FailyClassFV', // 仙阶总战力
        834: 'FailyClassLevel', // 仙阶阶数
        835: 'GodClassFV', // 神阶总战力
        836: 'GodClassLevel', // 神阶阶数
        837: 'WarriorPetFV', // 战神灵兽总战力(战骑)
        838: 'WarriorGCFV', // 神变总战力
        841: 'Pet1FV', // 出战宠物1战力
        842: 'Pet2FV', // 出战宠物2战力
        843: 'Pet3FV', // 出战宠物3战力
        844: 'PetXLFV', // 出战天仙战力
        850: 'ZhanBaoFV', // 战宝总战力
        851: 'ZhanBaoLevel', // 战宝阶数
        852: 'ShouLingFV', // 兽灵总战力
        853: 'ShouLingLevel', // 兽灵阶数
        854: 'FaQiFV', // 法器总战力
        855: 'FaQiLevel', // 法器阶数
        856: 'SoldierGuardFV', // 兵卫总战力
        857: 'SoldierGuardLevel', // 兵卫阶数
        871: 'WarriorSysFV', // 战神系统总战力
        872: 'PetASysFV', // 天仙系统总战力
        873: 'FairySysFV', // 仙童系统总战力
        874: 'YanJiaSysFV', // 偃甲系统总战力
        875: 'HeroSysFV', // 英雄系统总战力
        876: 'AlienSysFV', // 异兽系统总战力
        884: 'DrawTotal', // 仙玉抽奖总次数
        886: 'RoleTalent', // 人物天赋技能等级，字符串，用: | 分割，初始为空
        887: 'RoleBody', // 人物炼体等级，字符串，用: | 分割，初始为空
        888: 'KingFightTimes', // 今日王者争霸挑战次数
        901: 'XunBao_Jump', // 寻宝跳过动画
        9998: 'NowHp', // 当前生命
        9999: 'FightValue', // 战斗力总值
        10007: 'InstanceTeamId', // 跨服组队编号
        10011: 'TeamInspireTimes', // 组队鼓舞次数
        10101: 'Gang', // 帮会
        10102: 'GangDuty', // 帮会职位
        10103: 'GangGuardLevel', // 帮会守护等级
        10104: 'GangDevoteHis', // 历史帮贡
        10105: 'GangDonateCount', // 贡献帮会资金次数
        10106: 'GangGuardExp', // 帮会守护经验
        10107: 'GangGuardDayExp', // 每天的帮会守护经验
        10108: 'GangSkills', // 帮会技能
        10109: 'GangRecPeachBox', // 帮会每天领取蟠桃箱子
        10110: 'GangEatPeach', // 帮会每天吃蟠桃的信息
        10112: 'GangName', // 帮会名字
        10113: 'GangDevote', // 帮贡
        10201: 'RedPkgPool', // 个人红包池
        10202: 'RedPkgDayMaxReceive', // 当日领取的红包金额
        10301: 'MpFocusReward', // 公众号领奖
        10302: 'BindPhoneReward', // 是否领取绑定手机号奖励
        11000: 'Recharge', // 总充值额度
        11001: 'RechargeToday', // 今日充值额度
        11005: 'RechargeMonth', // 当月充值额度
        11006: 'ContinueRechargeProtectionDay_8', // 8元档连续充值保护天数
        11007: 'ContinueRechargeProtectionDay_38', // 38元档连续充值保护天数
        11008: 'ContinueRechargeProtectionDay_118', // 118元档连续充值保护天数
        11010: 'GoldTreeMulti', // 摇钱树当前倍数
        11011: 'GoldTreeTotal', // 摇钱树总次数
        11012: 'ContinueRechargeDay_8', // 8元档连续充值天数(用于产生保护天数)
        11013: 'ContinueRechargeDay_38', // 38元档连续充值天数(用于产生保护天数)
        11014: 'ContinueRechargeDay_118', // 118元档连续充值天数(用于产生保护天数)
        11022: 'KingRespect', // 王者争霸本周是否膜拜
        11100: 'SectId', // 宗门Id
        11101: 'SectTribute', // 宗主贡品
        11102: 'SectWorship', // 宗主膜拜
        11103: 'SectJob', // 仙宗职位
        11104: 'LevelReward', // 已领取仙宗等级奖励
        11105: 'SectExp', // 玩家累计的仙宗贡献
        11106: 'SectSkills', // 玩家的仙宗仙术信息
        11107: 'SectSkillMaster', // 玩家的仙术大师信息
        11108: 'SectLeaderDay', // 玩家成为宗主当前任期天数
        11109: 'SectActStatus', // 玩家宗主争夺战活动状态
        11110: 'SectGodAnimalChallenge', // 神兽试炼挑战按钮
        11111: 'SectPrestige', // 玩家累计的仙宗声望,仙宗商店货币
        11112: 'SectPrestigeLevel', // 玩家的仙宗声望等级
        11113: 'SectPrestigeRecv', // 玩家的仙宗声望等级奖励是否领取
        11114: 'SectIMTag', // 玩家的仙山标记
        11115: 'SectFirstRefresh', // 玩家初次使用缚妖索
        11116: 'SectFirstCatch', // 玩家初次捕捉
        11117: 'SectIMFirst', // 玩家是否本场第一次参与
        11118: 'SectPrestigeVal', // 玩家累计的仙宗声望,只用于仙宗声望,不扣减
        11119: 'SectPastureAuto', // 灵兽园自动化
        11120: 'SectLeaderTotalDay', // 玩家成为宗主总任期天数
        11121: 'SectName', // 宗门名称
        11122: 'SectPastureAutoRight', // 灵兽园自动抓捕权限
        11123: 'SectSymbolId', // 宗门宗徽
        11202: 'MultiBoss_Cfg', // 多人boss提示配置
        11203: 'MultiBoss_Times', // 多人boss剩余次数
        11204: 'MultiBoss_Add_Times', // 多人boss增加次数
        11205: 'MultiBoss_NextTime', // 多人boss下次增加时间
        11207: 'BossHome_BodyPower', // boss之家每天恢复体力
        11208: 'Inspire_State', // 玩家在当前场景的鼓舞状态，0没鼓舞 1 2 3
        11209: 'BossHome_Cfg', // boss之家复活提醒提示配置
        11210: 'BossHome_BodyPower_AutoBuy', // boss之家自动购买体力丹
        11211: 'MiJingBoss_AutoFight', // 秘境Boss自动挑战
        11212: 'MiJingBoss_WuDiState', // 秘境Boss无敌状态(0正常 1无敌状态)
        11301: 'RealmLevel', // 境界等级(共72级)
        11310: 'SL_Times', // 神龙降临倒计时
        11311: 'SL_Open', // 神龙降临(开启)
        11312: 'SL_Grade', // 神龙阶级
        11401: 'SkinReikiLevel', // 注灵等级
        11402: 'SkinReikiExp', // 当前等级注灵值
        11403: 'SkinSpiritUsed', // 炼神丹使用数量
        11404: 'SkinSpiritUseMax', // 炼神丹使用上限
        11405: 'SkinSuitActive', // 套装额外属性激活
        11501: 'Sign', // 当前累计签到天数
        11502: 'HaveSign', // 今天是否已经签到
        11503: 'SignDay', // 当前签到在签到周期内的第几天
        11504: 'SignGroup', // 当前签到组
        11601: 'GemTowerStageMax', // 宝石塔历史最高关卡
        11602: 'GemTowerSepPrizeStage', // 宝石塔待领取额外奖励的关卡
        11603: 'PetaATowerStageMax', // 天仙塔历史最高关卡
        11604: 'PetaATowerSepPrizeStage', // 天仙塔待领取额外奖励的关卡
        11605: 'GodTowerStageMax', // 天神塔历史最高关卡
        11606: 'GodTowerSepPrizeStage', // 天神塔待领取额外奖励的关卡
        11607: 'KidTowerStageMax', // 仙童塔历史最高关卡
        11608: 'KidTowerSepPrizeStage', // 仙童塔待领取额外奖励的关卡
        11609: 'SwordSoulTowerStageMax', // 剑魂塔历史最高关卡
        11610: 'SwordSoulTowerSepPrizeStage', // 剑魂塔待领取额外奖励的关卡
        11611: 'SwordSoulTowerDayGetPrize', // 剑魂塔每日奖励领取状态,1-已领
        11612: 'SwordSoulTowerCirclePrizeGroup', // 剑魂塔转盘当前组id
        11613: 'SwordSoulTowerCirclePrizeGet', // 剑魂塔转盘当前组已领奖品id,竖线隔开
        11614: 'SwordSoulTowerCirclePrizeTimes', // 剑魂塔转盘剩余次数
        11615: 'SwordSoulTowerCircleNum', // 剑魂塔转盘当前轮次
        11701: 'Charm', // 魅力值
        11702: 'MarryTimes', // 当日结婚次数
        11703: 'MarryActive', // 是否为求婚方 1是2否
        11704: 'MarryPartner', // 婚姻伴侣
        11705: 'MarryDay', // 结婚纪念日秒级时间戳
        11706: 'RoomGear', // 房屋档位
        11707: 'RingGear', // 戒指档位
        11708: 'WeddingInsRecvTimes', // 仙缘副本已领取奖励次数
        11709: 'WeddingVows', // 结婚誓言
        11710: 'MarryPartnerSid', // 婚姻伴侣区服Id
        11711: 'MarryPartnerName', // 婚姻伴侣名字
        11712: 'MarryPartnerTokenGear', // 婚姻伴侣信物等阶
        11713: 'MarryPartnerWorldName', // 婚姻伴侣世界
        11714: 'MaxLevel', // 仙缘副本通关最高层数
        11801: 'AladdinLampOpen', // 阿拉丁神灯开启
        11802: 'ZhaoCaiPiXiuOpen', // 招财貔貅开启
        11803: 'ZhanLiHuFuOpen', // 战力护符开启
        11804: 'LampWishTimestamp', // 神灯许愿时间戳
        11901: 'SLExpMax', // 试炼副本-经验副本-最大击杀
        11902: 'SLGoldMax', // 试炼副本-金币副本-最大击杀
        11903: 'SL_Exp_Coin3Times', // 经验试炼副本-仙玉鼓舞次数
        11904: 'SL_Exp_Coin4Times', // 经验试炼副本-元宝鼓舞次数
        11905: 'SL_Exp_Coin3Auto', // 经验试炼副本-仙玉自动鼓舞
        11906: 'SL_Exp_Coin4Auto', // 经验试炼副本-元宝自动鼓舞
        11907: 'SL_Gold_Coin3Times', // 金币试炼副本-仙玉鼓舞次数
        11908: 'SL_Gold_Coin4Times', // 金币试炼副本-元宝鼓舞次数
        11909: 'SL_Gold_Coin3Auto', // 金币试炼副本-仙玉自动鼓舞
        11910: 'SL_Gold_Coin4Auto', // 金币试炼副本-元宝自动鼓舞
        11911: 'SL_Exp_Auto', // 经验试炼副本-自动挑战
        11912: 'SL_Gold_Auto', // 金币试炼副本-自动挑战
        11950: 'BusinessToday', // 今日跑商次数
        12002: 'Pet2_Monkey', // 是否进化过美猴王
        12003: 'Pet2_Pig', // 是否进化过猪八戒
        12004: 'Pet2_ErLang', // 是否进化过二郎神
        12101: 'JXSC_Have_Silverkey', // 是否有银钥匙
        12102: 'JXSC_Have_Goldenkey', // 是否有金钥匙
        12103: 'JXSC_Join_Times', // 玩家每天参加极限生存活动次数
        12104: 'JXSC_SkinId', // 极限生存中换装皮肤Id
        12202: 'FirstRechargeOpenTimestamp', // 首充礼包开启时间戳
        12210: 'FirstRechargeGiftStateNew', // 新首充礼包状态(0不能领1能领2已领)
        12212: 'FirstRechargeDate', // 完成首充活动的日期
        12213: 'FirstRechargeSendPrizeDays', // 完成首充活动后，发放邮件奖励的天数
        12214: 'TotalRecharge_2_Date', // 完成累充2档活动的日期
        12215: 'TotalRecharge_3_Date', // 完成累充3档活动的日期
        12216: 'TotalRechargeState', // 累充3天豪礼的状态(1:1:1|2:1:2|档位:天数:状态)
        12217: 'TotalRechargeComplete', // 完成累充3天豪礼全部领奖
        12301: 'DengLuYouLiDays', // 参加登录有礼活动内登录天数
        12402: 'YJTB_ThisWeekSteps', // 遗迹探宝本周总步数
        12403: 'YJTB_TodayLuckDiceTimes', // 遗迹探宝今天剩余次数
        12404: 'YJTB_ResetTimestamp', // 遗迹探宝重置时间戳
        12600: 'SheZhi_Sound', // 声音设置 音乐音效开关
        12601: 'SheZhi_BeiJingYinYue', // 声音设置 背景音乐
        12602: 'SheZhi_YinXiao', // 声音设置 音效
        12603: 'PingBi_OtherSkill', // 屏蔽设置 其他玩家技能特效
        12604: 'PingBi_OtherHelp', // 屏蔽设置 其他玩家助战
        12605: 'PingBi_OtherWing', // 屏蔽设置 其他玩家翅膀
        12606: 'PingBi_OtherPrecious', // 屏蔽设置 其他玩家法宝
        12607: 'PingBi_SelfVipLevel', // 屏蔽设置 屏蔽自己VIP等级
        12608: 'PingBi_OtherFaZheng', // 屏蔽设置 其他玩家法阵
        12609: 'LowPerformanceMode', // 低性能模式
        12610: 'TipsBubble', // 提示气泡
        12611: 'PingBi_OwnPet', // 屏蔽自己的宠物
        12612: 'PingBi_OwnPetA', // 屏蔽自己的天仙
        12613: 'PingBi_OwnWarrior', // 屏蔽自己的战神
        12614: 'PingBi_OwnKid', // 屏蔽自己的仙童
        12615: 'PingBi_OwnHero', // 屏蔽自己的英雄
        12616: 'PingBi_OwnYanJia', // 屏蔽自己的偃甲
        12617: 'PingBi_OwnAlien', // 屏蔽自己的异兽
        12618: 'PingBi_OtherPlayers', // 屏蔽其他玩家
        12619: 'PingBi_AFKFight', // 屏蔽挂机战斗
        12620: 'PingBi_OwnHelp', // 屏蔽自己的助战跟随
        12621: 'PingBi_OwnSL', // 屏蔽自己的神龙
        13001: 'RankTurnTabIntegral', // 冲榜积分
        13020: 'ToyMasterLev', // 玩具大师等级
        13101: 'YiJiAdscTimes', // 遗迹争夺归属次数
        13102: 'YiJiDayEntrustTimes', // 遗迹争夺每天委托次数
        13103: 'YiJiDayBeEntrustedTimes', // 遗迹争夺每天接受别人委托次数
        13106: 'YiJiBeEntrustedNum', // 遗迹争夺玩家接受的委托的个数
        13201: 'XZXSDayHelpPrizeTimes', // 仙宗悬赏每日协助奖励次数
        13203: 'XZXSDayRefreshTimes', // 仙宗悬赏每日手动刷新任务次数
        13301: 'SectHonorPraiseDay', // 王权荣誉点赞日期,活动日期
        13302: 'SectHonorPraiseNum', // 王权荣誉点赞数量
        13303: 'SectHonorPraiseOpp', // 王权荣誉今日是否点赞
        13304: 'SectHonorPrizeOpp', // 王权荣誉今日是否领取俸禄
        13401: 'PetAChapterCheckpoint', // 天仙幻境通关章节关卡(章节*100+关卡)
        13402: 'KidChapterCheckpoint', // 仙童幻境通关章节关卡(章节*100+关卡)
        13501: 'XldDayEntrustTimes', // 凶灵岛Boss每天委托次数
        13503: 'XsdBoss_Cfg', // 凶兽岛复活提醒提示配置
        13504: 'XsdXsdDayFightTimes', // 凶兽岛凶煞岛每天挑战次数
        13505: 'XsdXmdDayFightTimes', // 凶兽岛凶冥岛每天挑战次数
        13506: 'XsdXsdDayLBTimes', // 凶兽岛凶煞岛每天剩余购买次数
        13507: 'XsdXmdDayLBTimes', // 凶兽岛凶冥岛每天剩余购买次数
        13508: 'XsdXsdDayHaveBuyTimes', // 凶兽岛凶煞岛每天已经购买次数
        13509: 'XsdXmdDayHaveBuyTimes', // 凶兽岛凶冥岛每天已经购买次数
        13510: 'XsdXsdDayCollectTimes', // 凶兽岛凶煞岛每天采集次数
        13511: 'XsdXmdDayCollectTimes', // 凶兽岛凶冥岛每天采集次数
        13601: 'HLPower', // 幻灵秘境体力
        13602: 'ResetHLPower_Time', // 幻灵秘境体力是否重置
        13603: 'AutoReplyPower', // 幻灵秘境自动恢复体力
        13701: 'YJFBPower', // 偃甲副本体力
        13702: 'YJFBAddPowerTimestamp', // 偃甲副本恢复体力时间戳
        13703: 'YJFBAutoUseJuShenDan', // 偃甲副本自动使用聚神丹
        13711: 'FeiShengId', // 飞升id
        13721: 'Show_FaZheng_Role', // 当前主角法阵
        13722: 'Show_FaZheng_Warrior', // 当前战神法阵
        13723: 'Show_FaZheng_PetA', // 当前天仙法阵
        13724: 'Show_FaZheng_Kid', // 当前仙童法阵
        13725: 'Show_FaZheng_Pet', // 当前宠物法阵
        13726: 'Show_FaZheng_YanJia', // 当前偃甲法阵
        13727: 'Show_FaZheng_Hero', // 当前英雄法阵
        13750: 'FamilyJJC_TimesLeft', // 家族竞技剩余挑战次数
        13751: 'FamilyJJC_Times', // 家族竞技已挑战次数
        13752: 'FamilyJJC_Score', // 家族竞技积分
        13771: 'ShenyuShop_RefreshCount', // 神域商店刷新次数
        13772: 'ShenyuShop_FreeGood', // 神域商店领取免费道具,0未领取，1已领取
        13780: 'Helper_Time', // 新业务开始时间
        13800: 'Shenyu_Military', // 神域战功
        13801: 'Shenyu_FBSkikId', // 神域副本皮肤id(客户端自己随机)
        13802: 'Shenyu_Id', // 当前加入的神域id
        13803: 'ShengWu_FV', // 圣物总战力
        13804: 'Shenyu_HallBox', // 神域殿堂开箱子数量
        13900: 'Show_HeroLevel', // 当前出站英雄等级
        13901: 'Show_HeroQuality', // 当前出站英雄品质
        13902: 'Show_HeroGrade', // 当前出站英雄阶级
        13903: 'Show_HeroStar', // 当前出站英雄星级
        13951: 'JungleHunt_LeftFreeResetTimes', // 仙林狩猎剩余免费重置次数
        13952: 'JungleHunt_LeftResetTimes', // 仙林狩猎剩余收费重置次数
        13956: 'JungleHunt_Show_Pet1_StrId', // 仙林狩猎当前跟随宠物ID1字符串
        13957: 'JungleHunt_Show_Pet2_StrId', // 仙林狩猎当前跟随宠物ID2字符串
        13958: 'JungleHunt_Show_Pet3_StrId', // 仙林狩猎当前跟随宠物ID3字符串
        13959: 'JungleHunt_Show_PetAId', // 仙林狩猎当前跟随天仙ID
        13960: 'JungleHunt_Show_HeroId', // 仙林狩猎当前出站英雄ID
        13961: 'JungleHunt_AlreadyResetTimes', // 仙林狩猎已经收费重置次数
        13962: 'JungleHunt_Show_Alien_Id', // 仙林狩猎当前出战异兽Id
        13963: 'JungleHunt_Life_State', // 仙林狩猎副本玩家生命状态(0复活 1死亡)
        14001: 'Auction_BeOvertaken', // 拍卖行竞价被超出
        15003: 'Src_Server_Id', // 源出生服ID
        15001: 'HuanHua_ZhenFaId', // 奇门遁甲幻化阵法Id
        15002: 'HuanHua_ZhenFaStar', // 奇门遁甲幻化阵法星级
        15010: 'CheckRedisMailTimes', // redis邮件每天检查一次的时间
        15020: 'FirstRechargeInvest_Timestamp', // 首充投资开启时间戳
        15021: 'FirstRechargeInvest_Charge', // 首充投资期间充值
        15022: 'FirstRechargeInvest_FinishFlag', // 首充投资领奖标记
        15031: 'ShenYuGodActionBuy_Type1', // 神域行动丹购买类型次数1
        15032: 'ShenYuGodActionBuy_Type2', // 神域行动丹购买类型次数2
        15041: 'QieCuo_FuncOpen', // 切磋功能是否开启 0未开启 1开启
        15042: 'QieCuo_Timestamp', // 切磋时间戳
        15043: 'QieCuo_Require_Timestamp', // 请求切磋战报时间戳
        15053: 'FYTZ_BindUserId', // 风雨同舟绑定玩家Id
        15054: 'FYTZ_Recharge', // 风雨同舟绑定玩家在绑定期间的充值
        15101: 'ActTheme3BuyTimes', // 派对礼包，连续购买次数
        15102: 'ActTheme3HaveBuy', // 派对礼包，本期是否购买(0没购买，1已经购买)
        15132: 'LianHuaLevel', // 炼化等级
        15133: 'LianHuaExp', // 炼化经验
        15134: 'x', // 炼化经验
        15135: 'y', // 炼化经验
    }

    x = 0;
    y = 0;
    /*
    * 生命
    */
    Hp = 0;
    /*
    * 攻击
    */
    Atk = 0;
    /*
    * 防御
    */
    Def = 0;
    /*
    * 命中(万分比)
    */
    Hit = 0;
    /*
    * 闪避(万分比)
    */
    Avd = 0;
    /*
    * 暴击(万分比)
    */
    Cri = 0;
    /*
    * 防暴击(万分比)
    */
    ACri = 0;
    /*
    * 速度
    */
    Speed = 0;
    /*
    * 无视防御
    */
    Atk1 = 0;
    /*
    * 减免无视
    */
    Def1 = 0;
    /*
    * 伤害加深
    */
    Atk2 = 0;
    /*
    * 伤害减少
    */
    Def2 = 0;
    /*
    * 伤害增加%
    */
    Atk3 = 0;
    /*
    * 伤害减少%
    */
    Def3 = 0;
    /*
    * 暴击伤害增加
    */
    Atk4 = 0;
    /*
    * 暴击伤害减少
    */
    Def4 = 0;
    /*
    * 致命一击概率增加
    */
    Atk5 = 0;
    /*
    * 致命一击概率减少
    */
    Def5 = 0;
    /*
    * PVP伤害增加(万分比)
    */
    Atk6 = 0;
    /*
    * PVP伤害减少(万分比)
    */
    Def6 = 0;
    /*
    * PVE伤害增加(万分比)
    */
    Atk7 = 0;
    /*
    * PVE伤害减少(万分比)
    */
    Def7 = 0;
    /*
    * 额外伤害
    */
    ExtraHurt = 0;
    /*
    * 仙概率增加
    */
    Atk8 = 0;
    /*
    * 仙概率减少
    */
    Def8 = 0;
    /*
    * 金攻击
    */
    JinAtk = 0;
    /*
    * 金防御
    */
    JinDef = 0;
    /*
    * 木攻击
    */
    MuAtk = 0;
    /*
    * 木防御
    */
    MuDef = 0;
    /*
    * 水攻击
    */
    ShuiAtk = 0;
    /*
    * 水防御
    */
    ShuiDef = 0;
    /*
    * 火攻击
    */
    HuoAtk = 0;
    /*
    * 火防御
    */
    HuoDef = 0;
    /*
    * 土攻击
    */
    TuAtk = 0;
    /*
    * 土防御
    */
    TuDef = 0;
    /*
    * 全系攻击
    */
    AllAtk = 0;
    /*
    * 全系防御
    */
    AllDef = 0;
    /*
    * 金伤害加深
    */
    JinAtk2 = 0;
    /*
    * 金伤害减免
    */
    JinDef2 = 0;
    /*
    * 木伤害加深
    */
    MuAt2k = 0;
    /*
    * 木伤害减免
    */
    MuDef2 = 0;
    /*
    * 水伤害加深
    */
    ShuiAtk2 = 0;
    /*
    * 水伤害减免
    */
    ShuiDef2 = 0;
    /*
    * 火伤害加深
    */
    HuoAtk2 = 0;
    /*
    * 火伤害减免
    */
    HuoDef2 = 0;
    /*
    * 土伤害加深
    */
    TuAtk2 = 0;
    /*
    * 土伤害减免
    */
    TuDef2 = 0;
    /*
    * 全系伤害加深
    */
    AllAtk2 = 0;
    /*
    * 全系伤害减免
    */
    AllDef2 = 0;
    /*
    * 生命
    */
    Hp_P = 0;
    /*
    * 攻击
    */
    Atk_P = 0;
    /*
    * 防御
    */
    Def_P = 0;
    /*
    * 命中(万分比)
    */
    Hit_P = 0;
    /*
    * 闪避(万分比)
    */
    Avd_P = 0;
    /*
    * 暴击(万分比)
    */
    Cri_P = 0;
    /*
    * 防暴击(万分比)
    */
    ACri_P = 0;
    /*
    * 速度
    */
    Speed_P = 0;
    /*
    * 无视防御
    */
    Atk1_P = 0;
    /*
    * 减免无视
    */
    Def1_P = 0;
    /*
    * 伤害加深
    */
    Atk2_P = 0;
    /*
    * 伤害减少
    */
    Def2_P = 0;
    /*
    * 伤害增加%
    */
    Atk3_P = 0;
    /*
    * 伤害减少%
    */
    Def3_P = 0;
    /*
    * 暴击伤害增加
    */
    Atk4_P = 0;
    /*
    * 暴击伤害减少
    */
    Def4_P = 0;
    /*
    * 魂概率增加
    */
    Atk5_P = 0;
    /*
    * 魂概率减少
    */
    Def5_P = 0;
    /*
    * PVP伤害增加(万分比)
    */
    Atk6_P = 0;
    /*
    * PVP伤害减少(万分比)
    */
    Def6_P = 0;
    /*
    * PVE伤害增加(万分比)
    */
    Atk7_P = 0;
    /*
    * PVE伤害减少(万分比)
    */
    Def7_P = 0;
    /*
    * 额外伤害
    */
    ExtraHurt_P = 0;
    /*
    * 仙概率增加
    */
    Atk8_P = 0;
    /*
    * 仙概率减少
    */
    Def8_P = 0;
    /*
    * 金攻击百分比
    */
    JinAtk_P = 0;
    /*
    * 金防御百分比
    */
    JinDef_P = 0;
    /*
    * 木攻击百分比
    */
    MuAtk_P = 0;
    /*
    * 木防御百分比
    */
    MuDef_P = 0;
    /*
    * 水攻击百分比
    */
    ShuiAtk_P = 0;
    /*
    * 水防御百分比
    */
    ShuiDef_P = 0;
    /*
    * 火攻击百分比
    */
    HuoAtk_P = 0;
    /*
    * 火防御百分比
    */
    HuoDef_P = 0;
    /*
    * 土攻击百分比
    */
    TuAtk_P = 0;
    /*
    * 土防御百分比
    */
    TuDef_P = 0;
    /*
    * 全系攻击百分比
    */
    AllAtk_P = 0;
    /*
    * 全系防御百分比
    */
    AllDef_P = 0;
    /*
    * 金伤害加深百分比
    */
    JinAtk2_P = 0;
    /*
    * 金伤害减免百分比
    */
    JinDef2_P = 0;
    /*
    * 木伤害加深百分比
    */
    MuAt2k_P = 0;
    /*
    * 木伤害减免百分比
    */
    MuDef2_P = 0;
    /*
    * 水伤害加深百分比
    */
    ShuiAtk2_P = 0;
    /*
    * 水伤害减免百分比
    */
    ShuiDef2_P = 0;
    /*
    * 火伤害加深百分比
    */
    HuoAtk2_P = 0;
    /*
    * 火伤害减免百分比
    */
    HuoDef2_P = 0;
    /*
    * 土伤害加深百分比
    */
    TuAtk2_P = 0;
    /*
    * 土伤害减免百分比
    */
    TuDef2_P = 0;
    /*
    * 全系伤害加深百分比
    */
    AllAtk2_P = 0;
    /*
    * 全系伤害减免百分比
    */
    AllDef2_P = 0;
    /*
    * 用户编号,纯客户端用户
    */
    UserId = 0;
    /*
    * 金币
    */
    Coin1 = 0;
    /*
    * 绑定金币(暂未用)
    */
    Coin2 = 0;
    /*
    * 仙玉
    */
    Coin3 = 0;
    /*
    * 元宝
    */
    Coin4 = 0;
    /*
    * 真气
    */
    Coin5 = 0;
    /*
    * 灵兽积分
    */
    Coin6 = 0;
    /*
    * 技能积分
    */
    Coin7 = 0;
    /*
    * 功勋
    */
    Coin8 = 0;
    /*
    * 家族币
    */
    Coin9 = 0;
    /*
    * 异兽币
    */
    Coin10 = 0;
    /*
    * 等级
    */
    Level = 0;
    /*
    * 经验
    */
    Exp = 0;
    /*
    * 昵称
    */
    Nick = '';
    /*
    * 性别
    */
    Sex = 0;
    /*
    * 登录cpsid
    */
    LoginCpsId = 0;
    /*
    * 地图编号
    */
    MapId = 0;
    /*
    * 地图x
    */
    MapX = 0;
    /*
    * 地图y
    */
    MapY = 0;
    /*
    * 当前地图的总关卡
    */
    CurrStage = 0;
    /*
    * 当前关卡,小怪次数
    */
    CurrStageTimes = 0;
    /*
    * 种族ID
    */
    RoleId = 0;
    /*
    * 头像
    */
    HeadImg = 0;
    /*
    * 伴侣
    */
    Peta = 0;
    /*
    * 已解锁的仙术Id
    */
    RoleGodSkill = '';
    /*
    * vip等级
    */
    VipLevel = 0;
    /*
    * 超级Vip
    */
    SuperVip = 0;
    /*
    * 改名次数
    */
    ChangeNickTimes = 0;
    /*
    * 记录最后登录的天数
    */
    LastDay = 0;
    /*
    * VIP经验值
    */
    VipExp = 0;
    /*
    * 勇闯天庭历史最高关卡
    */
    HeavenlyInstanceStageMax = 0;
    /*
    * 玲珑宝塔历史最高关卡
    */
    TowerInstanceStageMax = 0;
    /*
    * 是否自动挑战关卡boss
    */
    AutoStage = 0;
    /*
    * 周卡
    */
    WeekCard = 0;
    /*
    * 月卡
    */
    MonthCard = 0;
    /*
    * 终身卡
    */
    LifeCard = 0;
    /*
    * 竞技场当前排名，不存储
    */
    JJCRank = 0;
    /*
    * 竞技场挑战剩余次数
    */
    JJC_Times = 0;
    /*
    * 竞技场挑战下次增加时间
    */
    JJC_NextTime = 0;
    /*
    * 竞技场历史最高排名
    */
    JJCHistoryRank = 0;
    /*
    * 今日关卡求助次数
    */
    StageSeekTimes = 0;
    /*
    * 今日关卡帮助次数
    */
    StageHelpTimes = 0;
    /*
    * 出生服务器编号
    */
    CreateServerId = 0;
    /*
    * 登录服务器编号
    */
    LoginServerId = 0;
    /*
    * 出生区ID
    */
    AreaId = 0;
    /*
    * 当前主线任务ID
    */
    HistoryTaskId = 0;
    /*
    * 藏宝图历史最高关卡
    */
    TreasureInstanceStageMax = 0;
    /*
    * 跨服副本最高关卡
    */
    CrossInstanceStageMax = 0;
    /*
    * 跨服副本奖励剩余次数
    */
    CrossInstancePrizeTimes = 0;
    /*
    * 累计高级打造法宝次数
    */
    CreatePrecious = 0;
    /*
    * 当前所在的副本ID
    */
    InstanceId = '';
    /*
    * 玩家生命状态
    */
    LifeState = 0;
    /*
    * 玩家下次复活时间
    */
    ReviveTime = 0;
    /*
    * 帮派副本历史最高关卡
    */
    GangInstanceStageMax = 0;
    /*
    * 帮派副本奖励剩余次数
    */
    GangInstancePrizeTimes = 0;
    /*
    * 是否领取过限时时装，0否，大于0存储过期倒计时
    */
    LimitCloth = 0;
    /*
    * 宠物抓取编号
    */
    PetCatchId = 0;
    /*
    * 活动编号
    */
    ActId = 0;
    /*
    * 活动队伍的编号
    */
    TeamId = 0;
    /*
    * 是否勾选自动跳过
    */
    AutoJump = 0;
    /*
    * 阵法系统解锁日期
    */
    ZFUnlock = '';
    /*
    * 常驻增益BUFFID二维数组，用冒号和竖杠分割，表示ID、等级、到期时间戳、增幅倍数万分比
    */
    ShowBuff = '';
    /*
    * 周活动编号
    */
    WeeklyActId = 0;
    /*
    * 师门任务小怪下次刷新时间
    */
    SM_NextTime = 0;
    /*
    * 今日是否膜拜
    */
    Respect = 0;
    /*
    * 背包扩容次数
    */
    BagExtend = 0;
    /*
    * 今日是否膜拜跨服排行榜
    */
    RespectUnion = 0;
    /*
    * 是否领取新号登录奖励1-转职卡+改名卡
    */
    Gift1 = 0;
    /*
    * 是否领取新号登录奖励2-10000绑元+野猪+VIP5
    */
    Gift2 = 0;
    /*
    * 关卡地图编号
    */
    StageMapId = 0;
    /*
    * 客户端参数
    */
    ClientSwitch = 0;
    /*
    * 是否在线，0否1是
    */
    Online = 0;
    /*
    * 战斗标志，1普通战斗，2新战斗，0无战斗
    */
    FightSign = 0;
    /*
    * GM
    */
    GM = 0;
    /*
    * 跨服是否开启
    */
    OpenCross = 0;
    /*
    * 显示区ID
    */
    ShowAreaId = 0;
    /*
    * 封禁账号
    */
    BlockedAccount = 0;
    /*
    * 寄售服务器是否开启
    */
    OpenSale = 0;
    /*
    * 登录区ID
    */
    LoginAreaId = 0;
    /*
    * 战神飞升阶段
    */
    WarriorFly = 0;
    /*
    * 水晶
    */
    Crystal = 0;
    /*
    * 神石
    */
    Stone = 0;
    /*
    * 精铁
    */
    Iron = 0;
    /*
    * 苹果
    */
    Apple = 0;
    /*
    * 蟠桃
    */
    Peach = 0;
    /*
    * 人参果
    */
    Ginseng = 0;
    /*
    * 81难，今日帮助次数
    */
    HelpTimes81 = 0;
    /*
    * 81难，最大关卡
    */
    InstanceStageMax81 = 0;
    /*
    * 81难，今日最大关卡
    */
    InstanceStageMaxDay81 = 0;
    /*
    * 当前仙道会状态
    */
    GodClubState = 0;
    /*
    * 是否报名仙道会
    */
    GodClubSignUp = 0;
    /*
    * 是否是采集状态
    */
    IsCollect = 0;
    /*
    * 渡劫幸运值
    */
    RobberyLuck = 0;
    /*
    * 渡劫幸运值宝箱状态
    */
    RobberyBox = 0;
    /*
    * 渡劫重数（等级）
    */
    RobberyLevel = 0;
    /*
    * 魔魂自动分解状态
    */
    DevilSoulAuto = 0;
    /*
    * 功能开启时间
    */
    FuncOpenTime = '';
    /*
    * 已经解锁的功能ID
    */
    OpenFunc = '';
    /*
    * 功能预告客户端缓存
    */
    FnPreviewCfg = '';
    /*
    * 上次领取挂机奖励时间
    */
    LastAFKGetTIme = 0;
    /*
    * 积累的挂机经验数量
    */
    AFKExp = 0;
    /*
    * 积累的挂机银两数量
    */
    AFKCoin = 0;
    /*
    * 积累的挂机装备数量
    */
    AFKEqujp = 0;
    /*
    * 积累的挂机宠物丹数量
    */
    AFKPetPill = 0;
    /*
    * 积累的挂机灵气数量
    */
    AFKLQ = 0;
    /*
    * 累计免费挂机次数
    */
    AFKTimes = 0;
    /*
    * 玩家无敌状态
    */
    InvincibleState = 0;
    /*
    * 玩家无敌状态到期时间
    */
    InvincibleEndTime = 0;
    /*
    * 周卡领取记录，格式0|0|1|0|1以此类推，0表示未领，1表示已领
    */
    WeekCardDayPrize = '';
    /*
    * 月卡领取记录，格式0|0|1|0|1以此类推，0表示未领，1表示已领
    */
    MonthCardDayPrize = '';
    /*
    * 终身卡今日是否已领，0否，1是
    */
    LifeCardDayPrize = 0;
    /*
    * 今日祈福ID
    */
    WestExpPray = 0;
    /*
    * 新手指引已领取的奖励ID
    */
    LeadGet = '';
    /*
    * 新手指引可领取的奖励ID
    */
    LeadCanGet = '';
    /*
    * 时装升星带来的仙丹上限提升值
    */
    DrugAdd = 0;
    /*
    * 关卡通关剩余抽奖次数
    */
    StageDrawTimes = 0;
    /*
    * 关卡通过以获得的抽奖奖励ID，字符串竖杠分割
    */
    StageDrawGet = '';
    /*
    * 关卡抽奖当前组
    */
    StageDrawGroup = 0;
    /*
    * 创建角色时间
    */
    CreateTime = 0;
    /*
    * 创建角色第几天
    */
    CreateDay = 0;
    /*
    * 获取超级Vip的QQ
    */
    SuperVipQQ = 0;
    /*
    * 今日是否已领取VIP礼包
    */
    VipDayGift = 0;
    /*
    * 是否打开陌陌消息，0否1是
    */
    MomoMsg = 0;
    /*
    * 是否领取陌陌消息奖励，0否1是
    */
    MomoPrize = 0;
    /*
    * 登录合服区ID
    */
    LoginMergeAreaId = 0;
    /*
    * 显示世界ID
    */
    WorldId = 0;
    /*
    * 显示世界名称
    */
    WorldName = '';
    /*
    * 合服后显示世界名称
    */
    MergeWorldName = '';
    /*
    * 显示区服名称
    */
    AreaName = '';
    /*
    * 今日已充值的红包档位
    */
    RedBag = '';
    /*
    * 真实命中(万分比)
    */
    Hit_Real = 0;
    /*
    * 真实暴击(万分比)
    */
    Cri_Real = 0;
    /*
    * 防沉迷状态
    */
    FcmStatus = 0;
    /*
    * 防沉迷在线时间(分)
    */
    FcmMinute = 0;
    /*
    * 伴侣名称
    */
    MateName = '';
    /*
    * 邮件小红点
    */
    MailRedPoint = 0;
    /*
    * 降妖除魔历史最高关卡
    */
    DemonInstanceStageMax = 0;
    /*
    * 结婚次数
    */
    MateTimes = 0;
    /*
    * 已经进入炼体阶段的升阶系统数组
    */
    Grade2 = '';
    /*
    * 魔灵觉醒值
    */
    DevilAwakeValue = 0;
    /*
    * 新号剧情完成情况
    */
    NewStory = 0;
    /*
    * 阵法系统是否已引导过，0否，1是
    */
    NewPlayerZF = 0;
    /*
    * 自动熔炼设置-等级
    */
    MeltSettingL = 0;
    /*
    * 自动熔炼设置-星级
    */
    MeltSettingS = 0;
    /*
    * 自动熔炼设置-品质
    */
    MeltSettingQ = 0;
    /*
    * 转生等级，初始为0
    */
    Reborn = 0;
    /*
    * 已经激活的强化大师等级
    */
    EquipStrengthSuit = 0;
    /*
    * 每日免费洗练已使用次数
    */
    EquipForegFree = 0;
    /*
    * 是否有新的仇人待查看
    */
    NewEnemy = 0;
    /*
    * 各类型各等级仙丹使用情况
    */
    DrugUse = '';
    /*
    * 激活圣杯ID:到期时间戳
    */
    Cup = '';
    /*
    * 激活的所有勋章ID:等级|勋章ID:等级
    */
    Medal = '';
    /*
    * 激活的守护精灵到期时间，初始为0
    */
    Guard = 0;
    /*
    * 已领取奖励的勋章ID|ID|ID
    */
    MedalGetPrize = '';
    /*
    * 是否打开过欢迎界面
    */
    Welcome = 0;
    /*
    * 升阶三倍领取奖励倒计时，格式：功能id:等级:到期时间戳|功能id:等级:到期时间戳
    */
    GradeMutilPrize = '';
    /*
    * 累计获得的领地战积分
    */
    CityWarScore = 0;
    /*
    * 是否显示坐骑脚印
    */
    HorseFoot = 0;
    /*
    * 累计获得的仙宗城战积分
    */
    SectWarScore = 0;
    /*
    * 圣城之主今日是否已点赞
    */
    SectWarTodayPraise = 0;
    /*
    * 实名认证状态
    */
    RealName = 0;
    /*
    * 是否领取过实名认证奖励
    */
    RealNamePrize = 0;
    /*
    * 游客体验时间
    */
    TouristSecond = 0;
    /*
    * 每天在线时间(秒)
    */
    DayOnlineSecond = 0;
    /*
    * 寻龙点穴层数
    */
    SeekingDragonFloor = 0;
    /*
    * 寻龙点穴当前位置
    */
    SeekingDragonPos = 0;
    /*
    * 寻龙点穴阶段奖励状态
    */
    SeekingDragonPrize = 0;
    /*
    * 今日寻龙点穴次数
    */
    SeekingDragonTimes = 0;
    /*
    * 神秘商店本日刷新次数
    */
    SecretMallRe = 0;
    /*
    * 时光贩卖机本日刷新次数
    */
    TimeShopRe = 0;
    /*
    * 月光宝盒本日刷新次数
    */
    MoonlightBoxRe = 0;
    /*
    * 所属家族ID
    */
    FamilyId = '';
    /*
    * 所属家族名称
    */
    FamilyName = '';
    /*
    * 所属家族区服ID
    */
    FamilyArea = 0;
    /*
    * 当前申请家族个数
    */
    FamilyApplyNum = 0;
    /*
    * 所属战队ID
    */
    FTId = '';
    /*
    * 当前人物皮肤（仙装）
    */
    Show_Role_Skin_Suit = 0;
    /*
    * 当前人物皮肤（时装）
    */
    Show_Role_Skin = 0;
    /*
    * 当前人物称号
    */
    Show_Role_Title = 0;
    /*
    * 当前人物历练光环
    */
    Show_Role_Life = 0;
    /*
    * 当前人物仙位
    */
    Show_Role_GodLevel = 0;
    /*
    * 当前显示坐骑皮肤
    */
    Show_Horse_Skin = 0;
    /*
    * 当前显示法宝皮肤
    */
    Show_Precious_Skin = 0;
    /*
    * 当前显示翅膀皮肤
    */
    Show_Wing_Skin = 0;
    /*
    * 当前显示守护皮肤
    */
    Show_Guard_Skin = 0;
    /*
    * 当前显示神兵皮肤
    */
    Show_God_Skin = 0;
    /*
    * 当前显示通灵皮肤     宠物身上
    */
    Show_Circle_Skin = 0;
    /*
    * 当前显示兽魂皮肤     宠物身上
    */
    Show_PetFly_Skin = 0;
    /*
    * 当前显示法阵皮肤 仙侣身上(无)
    */
    Show_CircleA_Skin = 0;
    /*
    * 当前显示仙位皮肤 仙侣身上(无)
    */
    Show_TitleA_Skin = 0;
    /*
    * 当前显示花辇皮肤 战神身上(无)
    */
    Show_CircleB_Skin = 0;
    /*
    * 当前显示灵气皮肤 战神身上(无)
    */
    Show_TitleB_Skin = 0;
    /*
    * 当前跟随仙侣ID
    */
    Show_PetAId = 0;
    /*
    * 当前跟随战神ID
    */
    Show_WarriorId = 0;
    /*
    * 当前跟随天神ID
    */
    Show_SkyGodId = 0;
    /*
    * 当前人物临时称号数组
    */
    Show_TempTitle = '';
    /*
    * 当前跟随仙童ID
    */
    Show_KidId = 0;
    /*
    * 装备星级套装环绕光效ID
    */
    Show_StarAnim = 0;
    /*
    * 武器星级环绕光效ID
    */
    Show_StarWeaponAnim1 = 0;
    /*
    * 试炼邀请玩家数组
    */
    Show_GodAnimalInvite = '';
    /*
    * 仙童(男)皮肤
    */
    Show_Fairy_Boy = 0;
    /*
    * 仙童(女)皮肤
    */
    Show_Fairy_Girl = 0;
    /*
    * 跟随仙童(男)
    */
    Show_Kid_Boy = 0;
    /*
    * 跟随仙童(女)
    */
    Show_Kid_Girl = 0;
    /*
    * 当前出战幻灵Id
    */
    Show_HL = 0;
    /*
    * 当前人物头像
    */
    Show_Head = 0;
    /*
    * 当前人物头像框
    */
    Show_HeadFrame = 0;
    /*
    * 当前人物聊天框
    */
    Show_ChatFrame = 0;
    /*
    * 当前人物称号2
    */
    Show_Role_Title2 = 0;
    /*
    * 当前人物称号3
    */
    Show_Role_Title3 = 0;
    /*
    * 当前战神灵兽
    */
    Show_WarriorPet = 0;
    /*
    * 当前跟随宠物资源ID1
    */
    Show_PetId1 = 0;
    /*
    * 当前跟随宠物资源ID2
    */
    Show_PetId2 = 0;
    /*
    * 当前跟随宠物资源ID3
    */
    Show_PetId3 = 0;
    /*
    * 当前幻化凶兽ID1
    */
    Show_Beast1 = 0;
    /*
    * 当前幻化凶兽ID2
    */
    Show_Beast2 = 0;
    /*
    * 当前幻化凶兽ID3
    */
    Show_Beast3 = 0;
    /*
    * 当前跟随宠物ID1
    */
    Show_Pet1 = 0;
    /*
    * 当前跟随宠物ID2
    */
    Show_Pet2 = 0;
    /*
    * 当前跟随宠物ID3
    */
    Show_Pet3 = 0;
    /*
    * 合体天仙皮肤
    */
    Show_MergePetA_Skin = 0;
    /*
    * 当前跟随偃甲ID
    */
    Show_YanJiaId = 0;
    /*
    * 偃甲皮肤
    */
    Show_YanJia_Skin = 0;
    /*
    * 王者套装法相
    */
    Show_kingSuit = 0;
    /*
    * 王者套装之翼
    */
    Show_KingSuit_Wing = 0;
    /*
    * 当前显示战宝皮肤
    */
    Show_ZhanBao_Skin = 0;
    /*
    * 当前显示兽灵皮肤
    */
    Show_ShouLing_Skin = 0;
    /*
    * 当前显示法器皮肤
    */
    Show_FaQi_Skin = 0;
    /*
    * 当前出站英雄ID
    */
    Show_HeroId = 0;
    /*
    * 当前显示兵卫皮肤
    */
    Show_SoldierGuard_Skin = 0;
    /*
    * 当前出战异兽Id
    */
    Show_Alien_Id = 0;
    /*
    * 当前显示异兽皮肤(弃用)
    */
    Show_Alien_Skin = 0;
    /*
    * 当前显示金幻灵皮肤
    */
    Show_HL1_Skin = 0;
    /*
    * 当前显示木幻灵皮肤
    */
    Show_HL2_Skin = 0;
    /*
    * 当前显示水幻灵皮肤
    */
    Show_HL3_Skin = 0;
    /*
    * 当前显示火幻灵皮肤
    */
    Show_HL4_Skin = 0;
    /*
    * 当前显示土幻灵皮肤
    */
    Show_HL5_Skin = 0;
    /*
    * 当前显示金灵武皮肤
    */
    Show_LW1_Skin = 0;
    /*
    * 当前显示木灵武皮肤
    */
    Show_LW2_Skin = 0;
    /*
    * 当前显示水灵武皮肤
    */
    Show_LW3_Skin = 0;
    /*
    * 当前显示火灵武皮肤
    */
    Show_LW4_Skin = 0;
    /*
    * 当前显示土灵武皮肤
    */
    Show_LW5_Skin = 0;
    /*
    * 当前跟随宠物1星耀等级
    */
    Show_Pet1_Awaken = 0;
    /*
    * 当前跟随宠物2星耀等级
    */
    Show_Pet2_Awaken = 0;
    /*
    * 当前跟随宠物3星耀等级
    */
    Show_Pet3_Awaken = 0;
    /*
    * 当前战神神变阶级
    */
    Show_WarriorCurGC = 0;
    /*
    * 当前战神神变等级
    */
    Show_WarriorCurGC_Level = 0;
    /*
    * 当前战神神变解锁数量
    */
    WarriorGC_Unlock = 0;
    /*
    * 当前显示神龙皮肤
    */
    Show_SL_Skin = 0;
    /*
    * 当前战神神变是否激活
    */
    Cur_WarriorGC_Active = 0;
    /*
    * 当前男童是否激活潜能飘字
    */
    Cur_KidsQN_Active = 0;
    /*
    * 当前女童是否激活潜能飘字
    */
    Cur_KidsQN_Girl_Active = 0;
    /*
    * 当前女童是否激活潜能被动
    */
    Cur_KidsQN_Girl_PSkill = 0;
    /*
    * 当前跟随宠物资源2ID1
    */
    Show_PetId21 = 0;
    /*
    * 当前跟随宠物资源2ID2
    */
    Show_PetId22 = 0;
    /*
    * 当前跟随宠物资源2ID3
    */
    Show_PetId23 = 0;
    /*
    * 当前仙童潜能阶级(男)
    */
    Show_KidsQN_Grade = 0;
    /*
    * 当前仙童潜能等级(男)
    */
    Show_KidsQN_Level = 0;
    /*
    * 当前仙童潜能阶级(女)
    */
    Show_KidsQN_Grade_Girl = 0;
    /*
    * 当前仙童潜能等级(女)
    */
    Show_KidsQN_Level_Girl = 0;
    /*
    * 天仙升仙-当前阶级
    */
    Show_PetASX_Grade = 0;
    /*
    * 天仙升仙-当前等级
    */
    Show_PetASX_Level = 0;
    /*
    * 神兽天蓬当前变异等级
    */
    Show_TianPeng_PetType = 0;
    /*
    * 宠物最高战力
    */
    PetFV = 0;
    /*
    * 天仙总战力
    */
    PetAFV = 0;
    /*
    * 坐骑总战力
    */
    HorseFV = 0;
    /*
    * 翅膀总战力
    */
    WingFV = 0;
    /*
    * 守护总战力
    */
    GuardFV = 0;
    /*
    * 神兵总战力
    */
    GodFV = 0;
    /*
    * 战神总战力
    */
    WarriorFV = 0;
    /*
    * 法阵总战力
    */
    CircleAFV = 0;
    /*
    * 仙位总战力
    */
    TitleAFV = 0;
    /*
    * 通灵总战力
    */
    CircleFV = 0;
    /*
    * 兽魂总战力
    */
    PetFlyFV = 0;
    /*
    * 花辇总战力
    */
    CircleBFV = 0;
    /*
    * 灵气总战力
    */
    TitleBFV = 0;
    /*
    * 仙童总战力
    */
    KidFV = 0;
    /*
    * 神器总战力
    */
    GodItemFV = 0;
    /*
    * 魔灵总战力
    */
    DevilFV = 0;
    /*
    * 玩家时装总战力
    */
    SkinFV = 0;
    /*
    * 玩家时装数量
    */
    SkinNum = 0;
    /*
    * 玩家当前穿戴装备总战力
    */
    EquipFv = 0;
    /*
    * 转生排行榜
    */
    Rank_Reborn = 0;
    /*
    * 等级排行榜
    */
    Rank_Level = 0;
    /*
    * 法宝总战力
    */
    PreciousFV = 0;
    /*
    * 法宝阶数
    */
    PreciousLevel = 0;
    /*
    * 仙阶总战力
    */
    FailyClassFV = 0;
    /*
    * 仙阶阶数
    */
    FailyClassLevel = 0;
    /*
    * 神阶总战力
    */
    GodClassFV = 0;
    /*
    * 神阶阶数
    */
    GodClassLevel = 0;
    /*
    * 战神灵兽总战力(战骑)
    */
    WarriorPetFV = 0;
    /*
    * 神变总战力
    */
    WarriorGCFV = 0;
    /*
    * 出战宠物1战力
    */
    Pet1FV = 0;
    /*
    * 出战宠物2战力
    */
    Pet2FV = 0;
    /*
    * 出战宠物3战力
    */
    Pet3FV = 0;
    /*
    * 出战天仙战力
    */
    PetXLFV = 0;
    /*
    * 战宝总战力
    */
    ZhanBaoFV = 0;
    /*
    * 战宝阶数
    */
    ZhanBaoLevel = 0;
    /*
    * 兽灵总战力
    */
    ShouLingFV = 0;
    /*
    * 兽灵阶数
    */
    ShouLingLevel = 0;
    /*
    * 法器总战力
    */
    FaQiFV = 0;
    /*
    * 法器阶数
    */
    FaQiLevel = 0;
    /*
    * 兵卫总战力
    */
    SoldierGuardFV = 0;
    /*
    * 兵卫阶数
    */
    SoldierGuardLevel = 0;
    /*
    * 战神系统总战力
    */
    WarriorSysFV = 0;
    /*
    * 天仙系统总战力
    */
    PetASysFV = 0;
    /*
    * 仙童系统总战力
    */
    FairySysFV = 0;
    /*
    * 偃甲系统总战力
    */
    YanJiaSysFV = 0;
    /*
    * 英雄系统总战力
    */
    HeroSysFV = 0;
    /*
    * 异兽系统总战力
    */
    AlienSysFV = 0;
    /*
    * 仙玉抽奖总次数
    */
    DrawTotal = 0;
    /*
    * 人物天赋技能等级，字符串，用: | 分割，初始为空
    */
    RoleTalent = '';
    /*
    * 人物炼体等级，字符串，用: | 分割，初始为空
    */
    RoleBody = '';
    /*
    * 今日王者争霸挑战次数
    */
    KingFightTimes = 0;
    /*
    * 寻宝跳过动画
    */
    XunBao_Jump = 0;
    /*
    * 当前生命
    */
    NowHp = 0;
    /*
    * 战斗力总值
    */
    FightValue = 0;
    /*
    * 跨服组队编号
    */
    InstanceTeamId = 0;
    /*
    * 组队鼓舞次数
    */
    TeamInspireTimes = 0;
    /*
    * 帮会
    */
    Gang = '';
    /*
    * 帮会职位
    */
    GangDuty = 0;
    /*
    * 帮会守护等级
    */
    GangGuardLevel = 0;
    /*
    * 历史帮贡
    */
    GangDevoteHis = 0;
    /*
    * 贡献帮会资金次数
    */
    GangDonateCount = 0;
    /*
    * 帮会守护经验
    */
    GangGuardExp = 0;
    /*
    * 每天的帮会守护经验
    */
    GangGuardDayExp = 0;
    /*
    * 帮会技能
    */
    GangSkills = '';
    /*
    * 帮会每天领取蟠桃箱子
    */
    GangRecPeachBox = '';
    /*
    * 帮会每天吃蟠桃的信息
    */
    GangEatPeach = '';
    /*
    * 帮会名字
    */
    GangName = '';
    /*
    * 帮贡
    */
    GangDevote = 0;
    /*
    * 个人红包池
    */
    RedPkgPool = 0;
    /*
    * 当日领取的红包金额
    */
    RedPkgDayMaxReceive = 0;
    /*
    * 公众号领奖
    */
    MpFocusReward = 0;
    /*
    * 是否领取绑定手机号奖励
    */
    BindPhoneReward = 0;
    /*
    * 总充值额度
    */
    Recharge = 0;
    /*
    * 今日充值额度
    */
    RechargeToday = 0;
    /*
    * 当月充值额度
    */
    RechargeMonth = 0;
    /*
    * 8元档连续充值保护天数
    */
    ContinueRechargeProtectionDay_8 = 0;
    /*
    * 38元档连续充值保护天数
    */
    ContinueRechargeProtectionDay_38 = 0;
    /*
    * 118元档连续充值保护天数
    */
    ContinueRechargeProtectionDay_118 = 0;
    /*
    * 摇钱树当前倍数
    */
    GoldTreeMulti = 0;
    /*
    * 摇钱树总次数
    */
    GoldTreeTotal = 0;
    /*
    * 8元档连续充值天数(用于产生保护天数)
    */
    ContinueRechargeDay_8 = 0;
    /*
    * 38元档连续充值天数(用于产生保护天数)
    */
    ContinueRechargeDay_38 = 0;
    /*
    * 118元档连续充值天数(用于产生保护天数)
    */
    ContinueRechargeDay_118 = 0;
    /*
    * 王者争霸本周是否膜拜
    */
    KingRespect = 0;
    /*
    * 宗门Id
    */
    SectId = 0;
    /*
    * 宗主贡品
    */
    SectTribute = 0;
    /*
    * 宗主膜拜
    */
    SectWorship = 0;
    /*
    * 仙宗职位
    */
    SectJob = 0;
    /*
    * 已领取仙宗等级奖励
    */
    LevelReward = '';
    /*
    * 玩家累计的仙宗贡献
    */
    SectExp = 0;
    /*
    * 玩家的仙宗仙术信息
    */
    SectSkills = '';
    /*
    * 玩家的仙术大师信息
    */
    SectSkillMaster = 0;
    /*
    * 玩家成为宗主当前任期天数
    */
    SectLeaderDay = 0;
    /*
    * 玩家宗主争夺战活动状态
    */
    SectActStatus = 0;
    /*
    * 神兽试炼挑战按钮
    */
    SectGodAnimalChallenge = 0;
    /*
    * 玩家累计的仙宗声望,仙宗商店货币
    */
    SectPrestige = 0;
    /*
    * 玩家的仙宗声望等级
    */
    SectPrestigeLevel = 0;
    /*
    * 玩家的仙宗声望等级奖励是否领取
    */
    SectPrestigeRecv = 0;
    /*
    * 玩家的仙山标记
    */
    SectIMTag = 0;
    /*
    * 玩家初次使用缚妖索
    */
    SectFirstRefresh = 0;
    /*
    * 玩家初次捕捉
    */
    SectFirstCatch = 0;
    /*
    * 玩家是否本场第一次参与
    */
    SectIMFirst = 0;
    /*
    * 玩家累计的仙宗声望,只用于仙宗声望,不扣减
    */
    SectPrestigeVal = 0;
    /*
    * 灵兽园自动化
    */
    SectPastureAuto = 0;
    /*
    * 玩家成为宗主总任期天数
    */
    SectLeaderTotalDay = 0;
    /*
    * 宗门名称
    */
    SectName = '';
    /*
    * 灵兽园自动抓捕权限
    */
    SectPastureAutoRight = 0;
    /*
    * 宗门宗徽
    */
    SectSymbolId = 0;
    /*
    * 多人boss提示配置
    */
    MultiBoss_Cfg = '';
    /*
    * 多人boss剩余次数
    */
    MultiBoss_Times = 0;
    /*
    * 多人boss增加次数
    */
    MultiBoss_Add_Times = 0;
    /*
    * 多人boss下次增加时间
    */
    MultiBoss_NextTime = 0;
    /*
    * boss之家每天恢复体力
    */
    BossHome_BodyPower = 0;
    /*
    * 玩家在当前场景的鼓舞状态，0没鼓舞 1 2 3
    */
    Inspire_State = 0;
    /*
    * boss之家复活提醒提示配置
    */
    BossHome_Cfg = '';
    /*
    * boss之家自动购买体力丹
    */
    BossHome_BodyPower_AutoBuy = 0;
    /*
    * 秘境Boss自动挑战
    */
    MiJingBoss_AutoFight = 0;
    /*
    * 秘境Boss无敌状态(0正常 1无敌状态)
    */
    MiJingBoss_WuDiState = 0;
    /*
    * 境界等级(共72级)
    */
    RealmLevel = 0;
    /*
    * 神龙降临倒计时
    */
    SL_Times = 0;
    /*
    * 神龙降临(开启)
    */
    SL_Open = 0;
    /*
    * 神龙阶级
    */
    SL_Grade = 0;
    /*
    * 注灵等级
    */
    SkinReikiLevel = 0;
    /*
    * 当前等级注灵值
    */
    SkinReikiExp = 0;
    /*
    * 炼神丹使用数量
    */
    SkinSpiritUsed = 0;
    /*
    * 炼神丹使用上限
    */
    SkinSpiritUseMax = 0;
    /*
    * 套装额外属性激活
    */
    SkinSuitActive = '';
    /*
    * 当前累计签到天数
    */
    Sign = 0;
    /*
    * 今天是否已经签到
    */
    HaveSign = 0;
    /*
    * 当前签到在签到周期内的第几天
    */
    SignDay = 0;
    /*
    * 当前签到组
    */
    SignGroup = 0;
    /*
    * 宝石塔历史最高关卡
    */
    GemTowerStageMax = 0;
    /*
    * 宝石塔待领取额外奖励的关卡
    */
    GemTowerSepPrizeStage = 0;
    /*
    * 天仙塔历史最高关卡
    */
    PetaATowerStageMax = 0;
    /*
    * 天仙塔待领取额外奖励的关卡
    */
    PetaATowerSepPrizeStage = 0;
    /*
    * 天神塔历史最高关卡
    */
    GodTowerStageMax = 0;
    /*
    * 天神塔待领取额外奖励的关卡
    */
    GodTowerSepPrizeStage = 0;
    /*
    * 仙童塔历史最高关卡
    */
    KidTowerStageMax = 0;
    /*
    * 仙童塔待领取额外奖励的关卡
    */
    KidTowerSepPrizeStage = 0;
    /*
    * 剑魂塔历史最高关卡
    */
    SwordSoulTowerStageMax = 0;
    /*
    * 剑魂塔待领取额外奖励的关卡
    */
    SwordSoulTowerSepPrizeStage = 0;
    /*
    * 剑魂塔每日奖励领取状态,1-已领
    */
    SwordSoulTowerDayGetPrize = 0;
    /*
    * 剑魂塔转盘当前组id
    */
    SwordSoulTowerCirclePrizeGroup = 0;
    /*
    * 剑魂塔转盘当前组已领奖品id,竖线隔开
    */
    SwordSoulTowerCirclePrizeGet = '';
    /*
    * 剑魂塔转盘剩余次数
    */
    SwordSoulTowerCirclePrizeTimes = 0;
    /*
    * 剑魂塔转盘当前轮次
    */
    SwordSoulTowerCircleNum = 0;
    /*
    * 魅力值
    */
    Charm = 0;
    /*
    * 当日结婚次数
    */
    MarryTimes = 0;
    /*
    * 是否为求婚方 1是2否
    */
    MarryActive = 0;
    /*
    * 婚姻伴侣
    */
    MarryPartner = 0;
    /*
    * 结婚纪念日秒级时间戳
    */
    MarryDay = 0;
    /*
    * 房屋档位
    */
    RoomGear = 0;
    /*
    * 戒指档位
    */
    RingGear = 0;
    /*
    * 仙缘副本已领取奖励次数
    */
    WeddingInsRecvTimes = 0;
    /*
    * 结婚誓言
    */
    WeddingVows = '';
    /*
    * 婚姻伴侣区服Id
    */
    MarryPartnerSid = 0;
    /*
    * 婚姻伴侣名字
    */
    MarryPartnerName = '';
    /*
    * 婚姻伴侣信物等阶
    */
    MarryPartnerTokenGear = '';
    /*
    * 婚姻伴侣世界
    */
    MarryPartnerWorldName = '';
    /*
    * 仙缘副本通关最高层数
    */
    MaxLevel = 0;
    /*
    * 阿拉丁神灯开启
    */
    AladdinLampOpen = 0;
    /*
    * 招财貔貅开启
    */
    ZhaoCaiPiXiuOpen = 0;
    /*
    * 战力护符开启
    */
    ZhanLiHuFuOpen = 0;
    /*
    * 神灯许愿时间戳
    */
    LampWishTimestamp = 0;
    /*
    * 试炼副本-经验副本-最大击杀
    */
    SLExpMax = 0;
    /*
    * 试炼副本-金币副本-最大击杀
    */
    SLGoldMax = 0;
    /*
    * 经验试炼副本-仙玉鼓舞次数
    */
    SL_Exp_Coin3Times = 0;
    /*
    * 经验试炼副本-元宝鼓舞次数
    */
    SL_Exp_Coin4Times = 0;
    /*
    * 经验试炼副本-仙玉自动鼓舞
    */
    SL_Exp_Coin3Auto = 0;
    /*
    * 经验试炼副本-元宝自动鼓舞
    */
    SL_Exp_Coin4Auto = 0;
    /*
    * 金币试炼副本-仙玉鼓舞次数
    */
    SL_Gold_Coin3Times = 0;
    /*
    * 金币试炼副本-元宝鼓舞次数
    */
    SL_Gold_Coin4Times = 0;
    /*
    * 金币试炼副本-仙玉自动鼓舞
    */
    SL_Gold_Coin3Auto = 0;
    /*
    * 金币试炼副本-元宝自动鼓舞
    */
    SL_Gold_Coin4Auto = 0;
    /*
    * 经验试炼副本-自动挑战
    */
    SL_Exp_Auto = 0;
    /*
    * 金币试炼副本-自动挑战
    */
    SL_Gold_Auto = 0;
    /*
    * 今日跑商次数
    */
    BusinessToday = 0;
    /*
    * 是否进化过美猴王
    */
    Pet2_Monkey = 0;
    /*
    * 是否进化过猪八戒
    */
    Pet2_Pig = 0;
    /*
    * 是否进化过二郎神
    */
    Pet2_ErLang = 0;
    /*
    * 是否有银钥匙
    */
    JXSC_Have_Silverkey = 0;
    /*
    * 是否有金钥匙
    */
    JXSC_Have_Goldenkey = 0;
    /*
    * 玩家每天参加极限生存活动次数
    */
    JXSC_Join_Times = 0;
    /*
    * 极限生存中换装皮肤Id
    */
    JXSC_SkinId = 0;
    /*
    * 首充礼包开启时间戳
    */
    FirstRechargeOpenTimestamp = 0;
    /*
    * 新首充礼包状态(0不能领1能领2已领)
    */
    FirstRechargeGiftStateNew = 0;
    /*
    * 完成首充活动的日期
    */
    FirstRechargeDate = '';
    /*
    * 完成首充活动后，发放邮件奖励的天数
    */
    FirstRechargeSendPrizeDays = 0;
    /*
    * 完成累充2档活动的日期
    */
    TotalRecharge_2_Date = '';
    /*
    * 完成累充3档活动的日期
    */
    TotalRecharge_3_Date = '';
    /*
    * 累充3天豪礼的状态(1:1:1|2:1:2|档位:天数:状态)
    */
    TotalRechargeState = '';
    /*
    * 完成累充3天豪礼全部领奖
    */
    TotalRechargeComplete = 0;
    /*
    * 参加登录有礼活动内登录天数
    */
    DengLuYouLiDays = 0;
    /*
    * 遗迹探宝本周总步数
    */
    YJTB_ThisWeekSteps = 0;
    /*
    * 遗迹探宝今天剩余次数
    */
    YJTB_TodayLuckDiceTimes = 0;
    /*
    * 遗迹探宝重置时间戳
    */
    YJTB_ResetTimestamp = 0;
    /*
    * 声音设置 音乐音效开关
    */
    SheZhi_Sound = 0;
    /*
    * 声音设置 背景音乐
    */
    SheZhi_BeiJingYinYue = 0;
    /*
    * 声音设置 音效
    */
    SheZhi_YinXiao = 0;
    /*
    * 屏蔽设置 其他玩家技能特效
    */
    PingBi_OtherSkill = 0;
    /*
    * 屏蔽设置 其他玩家助战
    */
    PingBi_OtherHelp = 0;
    /*
    * 屏蔽设置 其他玩家翅膀
    */
    PingBi_OtherWing = 0;
    /*
    * 屏蔽设置 其他玩家法宝
    */
    PingBi_OtherPrecious = 0;
    /*
    * 屏蔽设置 屏蔽自己VIP等级
    */
    PingBi_SelfVipLevel = 0;
    /*
    * 屏蔽设置 其他玩家法阵
    */
    PingBi_OtherFaZheng = 0;
    /*
    * 低性能模式
    */
    LowPerformanceMode = 0;
    /*
    * 提示气泡
    */
    TipsBubble = 0;
    /*
    * 屏蔽自己的宠物
    */
    PingBi_OwnPet = 0;
    /*
    * 屏蔽自己的天仙
    */
    PingBi_OwnPetA = 0;
    /*
    * 屏蔽自己的战神
    */
    PingBi_OwnWarrior = 0;
    /*
    * 屏蔽自己的仙童
    */
    PingBi_OwnKid = 0;
    /*
    * 屏蔽自己的英雄
    */
    PingBi_OwnHero = 0;
    /*
    * 屏蔽自己的偃甲
    */
    PingBi_OwnYanJia = 0;
    /*
    * 屏蔽自己的异兽
    */
    PingBi_OwnAlien = 0;
    /*
    * 屏蔽其他玩家
    */
    PingBi_OtherPlayers = 0;
    /*
    * 屏蔽挂机战斗
    */
    PingBi_AFKFight = 0;
    /*
    * 屏蔽自己的助战跟随
    */
    PingBi_OwnHelp = 0;
    /*
    * 屏蔽自己的神龙
    */
    PingBi_OwnSL = 0;
    /*
    * 冲榜积分
    */
    RankTurnTabIntegral = 0;
    /*
    * 玩具大师等级
    */
    ToyMasterLev = 0;
    /*
    * 遗迹争夺归属次数
    */
    YiJiAdscTimes = 0;
    /*
    * 遗迹争夺每天委托次数
    */
    YiJiDayEntrustTimes = 0;
    /*
    * 遗迹争夺每天接受别人委托次数
    */
    YiJiDayBeEntrustedTimes = 0;
    /*
    * 遗迹争夺玩家接受的委托的个数
    */
    YiJiBeEntrustedNum = 0;
    /*
    * 仙宗悬赏每日协助奖励次数
    */
    XZXSDayHelpPrizeTimes = 0;
    /*
    * 仙宗悬赏每日手动刷新任务次数
    */
    XZXSDayRefreshTimes = 0;
    /*
    * 王权荣誉点赞日期,活动日期
    */
    SectHonorPraiseDay = 0;
    /*
    * 王权荣誉点赞数量
    */
    SectHonorPraiseNum = 0;
    /*
    * 王权荣誉今日是否点赞
    */
    SectHonorPraiseOpp = 0;
    /*
    * 王权荣誉今日是否领取俸禄
    */
    SectHonorPrizeOpp = 0;
    /*
    * 天仙幻境通关章节关卡(章节*100+关卡)
    */
    PetAChapterCheckpoint = 0;
    /*
    * 仙童幻境通关章节关卡(章节*100+关卡)
    */
    KidChapterCheckpoint = 0;
    /*
    * 凶灵岛Boss每天委托次数
    */
    XldDayEntrustTimes = 0;
    /*
    * 凶兽岛复活提醒提示配置
    */
    XsdBoss_Cfg = '';
    /*
    * 凶兽岛凶煞岛每天挑战次数
    */
    XsdXsdDayFightTimes = 0;
    /*
    * 凶兽岛凶冥岛每天挑战次数
    */
    XsdXmdDayFightTimes = 0;
    /*
    * 凶兽岛凶煞岛每天剩余购买次数
    */
    XsdXsdDayLBTimes = 0;
    /*
    * 凶兽岛凶冥岛每天剩余购买次数
    */
    XsdXmdDayLBTimes = 0;
    /*
    * 凶兽岛凶煞岛每天已经购买次数
    */
    XsdXsdDayHaveBuyTimes = 0;
    /*
    * 凶兽岛凶冥岛每天已经购买次数
    */
    XsdXmdDayHaveBuyTimes = 0;
    /*
    * 凶兽岛凶煞岛每天采集次数
    */
    XsdXsdDayCollectTimes = 0;
    /*
    * 凶兽岛凶冥岛每天采集次数
    */
    XsdXmdDayCollectTimes = 0;
    /*
    * 幻灵秘境体力
    */
    HLPower = 0;
    /*
    * 幻灵秘境体力是否重置
    */
    ResetHLPower_Time = 0;
    /*
    * 幻灵秘境自动恢复体力
    */
    AutoReplyPower = 0;
    /*
    * 偃甲副本体力
    */
    YJFBPower = 0;
    /*
    * 偃甲副本恢复体力时间戳
    */
    YJFBAddPowerTimestamp = 0;
    /*
    * 偃甲副本自动使用聚神丹
    */
    YJFBAutoUseJuShenDan = 0;
    /*
    * 飞升id
    */
    FeiShengId = 0;
    /*
    * 当前主角法阵
    */
    Show_FaZheng_Role = 0;
    /*
    * 当前战神法阵
    */
    Show_FaZheng_Warrior = 0;
    /*
    * 当前天仙法阵
    */
    Show_FaZheng_PetA = 0;
    /*
    * 当前仙童法阵
    */
    Show_FaZheng_Kid = 0;
    /*
    * 当前宠物法阵
    */
    Show_FaZheng_Pet = 0;
    /*
    * 当前偃甲法阵
    */
    Show_FaZheng_YanJia = 0;
    /*
    * 当前英雄法阵
    */
    Show_FaZheng_Hero = 0;
    /*
    * 家族竞技剩余挑战次数
    */
    FamilyJJC_TimesLeft = 0;
    /*
    * 家族竞技已挑战次数
    */
    FamilyJJC_Times = 0;
    /*
    * 家族竞技积分
    */
    FamilyJJC_Score = 0;
    /*
    * 神域商店刷新次数
    */
    ShenyuShop_RefreshCount = 0;
    /*
    * 神域商店领取免费道具,0未领取，1已领取
    */
    ShenyuShop_FreeGood = 0;
    /*
    * 新业务开始时间
    */
    Helper_Time = 0;
    /*
    * 神域战功
    */
    Shenyu_Military = 0;
    /*
    * 神域副本皮肤id(客户端自己随机)
    */
    Shenyu_FBSkikId = 0;
    /*
    * 当前加入的神域id
    */
    Shenyu_Id = 0;
    /*
    * 圣物总战力
    */
    ShengWu_FV = 0;
    /*
    * 神域殿堂开箱子数量
    */
    Shenyu_HallBox = 0;
    /*
    * 当前出站英雄等级
    */
    Show_HeroLevel = 0;
    /*
    * 当前出站英雄品质
    */
    Show_HeroQuality = 0;
    /*
    * 当前出站英雄阶级
    */
    Show_HeroGrade = 0;
    /*
    * 当前出站英雄星级
    */
    Show_HeroStar = 0;
    /*
    * 仙林狩猎剩余免费重置次数
    */
    JungleHunt_LeftFreeResetTimes = 0;
    /*
    * 仙林狩猎剩余收费重置次数
    */
    JungleHunt_LeftResetTimes = 0;
    /*
    * 仙林狩猎当前跟随宠物ID1字符串
    */
    JungleHunt_Show_Pet1_StrId = '';
    /*
    * 仙林狩猎当前跟随宠物ID2字符串
    */
    JungleHunt_Show_Pet2_StrId = '';
    /*
    * 仙林狩猎当前跟随宠物ID3字符串
    */
    JungleHunt_Show_Pet3_StrId = '';
    /*
    * 仙林狩猎当前跟随天仙ID
    */
    JungleHunt_Show_PetAId = 0;
    /*
    * 仙林狩猎当前出站英雄ID
    */
    JungleHunt_Show_HeroId = 0;
    /*
    * 仙林狩猎已经收费重置次数
    */
    JungleHunt_AlreadyResetTimes = 0;
    /*
    * 仙林狩猎当前出战异兽Id
    */
    JungleHunt_Show_Alien_Id = 0;
    /*
    * 仙林狩猎副本玩家生命状态(0复活 1死亡)
    */
    JungleHunt_Life_State = 0;
    /*
    * 拍卖行竞价被超出
    */
    Auction_BeOvertaken = '';
    /*
    * 源出生服ID
    */
    Src_Server_Id = 0;
    /*
    * 奇门遁甲幻化阵法Id
    */
    HuanHua_ZhenFaId = 0;
    /*
    * 奇门遁甲幻化阵法星级
    */
    HuanHua_ZhenFaStar = 0;
    /*
    * redis邮件每天检查一次的时间
    */
    CheckRedisMailTimes = 0;
    /*
    * 首充投资开启时间戳
    */
    FirstRechargeInvest_Timestamp = 0;
    /*
    * 首充投资期间充值
    */
    FirstRechargeInvest_Charge = 0;
    /*
    * 首充投资领奖标记
    */
    FirstRechargeInvest_FinishFlag = 0;
    /*
    * 神域行动丹购买类型次数1
    */
    ShenYuGodActionBuy_Type1 = 0;
    /*
    * 神域行动丹购买类型次数2
    */
    ShenYuGodActionBuy_Type2 = 0;
    /*
    * 切磋功能是否开启 0未开启 1开启
    */
    QieCuo_FuncOpen = 0;
    /*
    * 切磋时间戳
    */
    QieCuo_Timestamp = 0;
    /*
    * 请求切磋战报时间戳
    */
    QieCuo_Require_Timestamp = 0;
    /*
    * 风雨同舟绑定玩家Id
    */
    FYTZ_BindUserId = 0;
    /*
    * 风雨同舟绑定玩家在绑定期间的充值
    */
    FYTZ_Recharge = 0;
    /*
    * 派对礼包，连续购买次数
    */
    ActTheme3BuyTimes = 0;
    /*
    * 派对礼包，本期是否购买(0没购买，1已经购买)
    */
    ActTheme3HaveBuy = 0;
    /*
    * 炼化等级
    */
    LianHuaLevel = 0;
    /*
    * 炼化经验
    */
    LianHuaExp = 0;
}
