/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/*
 * @Author: hrd
 * @Date: 2022-03-31 16:38:53
 * @Description:
 */
export const E = {
    UI: {
        NotchHeightChange: 'UI_NotchHeightChange',
    },
    Win: {
        /** 每一个窗口打开时发送事件 */
        WinOpen: 'Win_Open_Event',
    },
    Lobby: {
        /** 隐藏上方的功能按钮 */
        TopFuncBtnHide: 'Lobby_TopFuncBtnHide',
        /** 显示上方的功能按钮 */
        TopFuncBtnShow: 'Lobby_TopFuncBtnShow',
        /** 隐藏通知栏 */
        LobbyEasyHide: 'Lobby_LobbyEasyHide',
        /** 显示通知栏 */
        LobbyEasyShow: 'Lobby_LobbyEasyShow',
        /** 隐藏下方的吸金 */
        BootomSuctionGoldHide: 'Lobby_BootomSuctionGoldHide',
        /** 显示下方的吸金 */
        BootomSuctionGoldShow: 'Lobby_BootomSuctionGoldShow',
        /** 第一次显示 */
        FirstShow: 'Lobby_FirstShow',
        /** 改变视图类型(type: ELobbyViewType) */
        ChangeViewType: 'Lobby_ChangeViewType',
    },
    Sdk: {
        /** 打开健康游戏公告 */
        Health: 'SDK_Health',
    },
    Role: {
        /** 单个属性更新 */
        /** 更新用户属性 */
        UpdateRoleInfo: 'Role_UpdateRoleInfo',
        /** 穿戴装备成功 */
        WearEquipSuccess: 'WearEquipSuccess',
    },
    Config: {
        /** 初始配置表开始 */
        InitConfigStart: 'Config_InitConfigStart',
        /** 初始化配置表成功 */
        InitConfigSuccess: 'Config_InitConfigSuccess',
    },
    Game: {
        /** 开始游戏 */
        Start: 'Game_Start',
        /** 游戏结束 */
        Exit: 'Game_Exit',
        /** 游戏主循环 */
        MainUpdate: 'Game_MainUpdate',

        // 实际功能未开发>>>>
        // 实际功能未开发>>>>
        /** 跨某个时间点 有可能 0点 1点 2点 3点半 .... 先按整点发送这个事件通知，如有半点的例如5点半 那么特殊处理 */
        TimeChange: 'TimeChange',
        // 实际功能未开发>>>>
        /** 跨天 */
        DayChange: 'DayChange',

        ItemTipChangeSize: 'ItemTipChangeSize',
    },
    Net: {
        /** 需要重链 */
        NeedReconnect: 'Net_NeedReconnect',
    },
    Login: {
        /** 点击选服 */
        ClickServerItem: 'Login_ClickServerItem',
        /** 登录成功 */
        Succ: 'Login_Succ',
        /** 请求登录 */
        ReqLogin: 'Login_ReqLogin',
        /** 请求注册 */
        ReqRegister: 'Login_ReqRegister',
        /** 请求角色昵称 */
        ReqRoleNick: 'Login_ReqRoleNick',
        /** 返回角色昵称 */
        ResultRoleNick: 'Login_ResultRoleNick',
        /** 请求创角 */
        ReqCreateRole: 'Login_ReqCreateRole',
        /** 请求网关地址 */
        ReqGetgateaddr: 'Login_ReqGetgateaddr',
        /** 开始加载游戏 */
        GameLoading: 'Login_GameLoading',
        /** 重连 */
        ReConnect: 'Login_ReConnect',
        /** 返回登录 */
        BacktoLogin: 'Login_BacktoLogin',
        /** 强制下线 */
        ForceLogout: 'ForceLogout',
        /** 请求实名认证 */
        ReqRealName: 'ReqRealName',
        /** 打开实名认证窗口 */
        openRealNameWin: 'openRealNameWin',
        /** 自动登录 */
        AutoLogin: 'AutoLogin',
    },
    Map: {
        /** 初始化完寻路数据 */
        InitPathFinding: 'Map_InitPathFinding',
        /** 初始化完地图数据 */
        InitMapLoaded: 'Map_InitMapLoaded',
        /** 添加野外怪物到场景 */
        AddVMMonsterToMap: 'Map_AddVMMonsterToMap',
        /** 移除野外怪物出场景 */
        RemoveVMMonsterToMap: 'Map_RemoveVMMonsterToMap',
        /** 添加周围玩家到场景 */
        AddPlayerToMap: 'Map_AddPlayerToMap',
        /** 移除周围玩家出场景 */
        RemovePlayerToMap: 'Map_RemovePlayerToMap',
        /** 移动到目的地 */
        MoveEnd: 'Map_MoveEnd',
        /** 开始移动 */
        MoveStart: 'Map_MoveStart',
        /** 重置位置 */
        ResetPos: 'Map_ResetPos',
        /** 开始切换地图 */
        ChangeMapStart: 'Map_ChangeMapStart',
        /** 切换地图结束 */
        ChangeMapEnd: 'Map_ChangeMapEnd',
        /** 野外地图Id变更 */
        ChangeMapIdYW: 'Map_ChangeMapIdYW',
        /** 点击了地图 */
        ClickMap: 'Map_ClickMap',
    },
    Bag: {
        /** 获得了快捷使用的道具 */
        Inited: 'Bag_Inited',
        /** 背包物品变化 */
        ItemChange: 'Bag_ItemChange',
        /** 背包物品ID的变化，组合Key需要+道具Id使用 */
        ItemChangeOfId: 'Bag_ItemChangeOfId',
        /** 背包物品类型的变化，组合Key需要+道具SubType使用 */
        ItemChangeOfType: 'Bag_ItemChangeOfType',
        /** 背包格子扩容 */
        GridExtendSize: 'Bag_GridExtendSize',
        /** 背包已满 */
        FullStateChange: 'Bag_FullStateChange',
    },
    /** 包裹 */
    Package: {
        /** 更新包裹 */
        UptPackage: 'Update_Package',
    },
    /** 充值 */
    Recharge: {
        /** 购买商品成功 参数1: Gid（商品id） */
        BuyShopSuccess: 'Recharge_BuyShopSuccess',
        /** 更新商品列表 参数1：T（商城类型） */
        UpdateGoodsDataList: 'Recharge_UpdateGoodsDataList',
        /** 获取同一个身份证账号的充值数量 */
        GetIDCardChargeRMB: 'GetIDCardChargeRMB',
    },
    /** gm命令 */
    GM: {
        /** 请求发送gm命令,参数1：additem，参数2：1,100 */
        SendGMMsg: 'GM_SendGMMsg',
    },
    Mail: {
        /** 有新邮件 */
        NewMail: 'Mail_NewMail',
        /** 更新邮件 */
        UptMail: 'Mail_UptMail',
    },
    Boss: {
        /** 更新个人首领 */
        UptPersonal: 'Boss_UptPersonal',
        /** 更新至尊首领 */
        UptVip: 'Boss_UptVip',
        /** 跟新多人首领 */
        UptMulitBoss: 'Boss_MulitBoss',
        /** 更新多人首领玩家状态 */
        UptMulitBossPlayData: 'Boss_MuliPlayData',
        /** 多人boss购买次数 */
        MultiBossBuyChage: 'MultiBossBuyChage',
        /** MultiBoss rankList */
        MultiBossRank: 'MultiBossRank',
        /**  multiboss relive time list */
        MultiBossReliveList: 'MultiBossReliveList',
        MtBossInspirem: 'MtBossInspirem',
        BossUpdateState: 'BossUpdateState',
    },
    Title: {
        /** 更新称号界面 */
        UptTitle: 'Title_UptTitle',
    },
    MsgBox: {
        /** 添加勾选标记，参数1：勾选框key */
        AddTogleFlag: 'MsgBox_AddTogleFlag',
        /** 刷新 */
        Refresh: 'MsgBox_Refresh',
        /** 手动关闭 */
        Close: 'MsgBox_Close',
        /** force colse */
        ForceClose: 'MsgBox_ForceClose',
    },
    res: {
        /** 获得奖励弹窗 */
        GetReward: 'Bag_GetReward',
    },
    Strength: {
        /** 强化基础信息 */
        StrengthInfo: 'Strength_StrengthInfo',
        /** 强化成功 */
        StrengthSuccess: 'Strength_StrengthSuccess',
        /** 强化里的共鸣 */
        UpRsonateSuccess: 'Strength_UpRsonateSuccess',
    },
    SilkRoad: {
        /** 加载界面 */
        loadInfo: 'SilkRoad_loadInfo',
        /** 开始 */
        start: 'SilkRoad_start',
        /** 结束 */
        finish: 'SilkRoad_finfish',
        /** 购买次数更新 */
        buyCount: 'SilkRoad_buyCount',
    },
    Exercise: {
        /** 同步界面 */
        syncUi: 'Exercise_SyncUi',

    },
    Adventure: {
        /** 加载界面 */
        loadInfo: 'Adventure_loadInfo',
        /** 骰子移动 */
        ComDiceEvent: 'Adventure_ComdiceEvent',
        GoldDiceEvent: 'Adventure_GoldDiceEvent',
        /** 刷新事件 */
        syncEventList: 'syncEventList',
        /** 刷新事件 */
        syncEventCount: 'syncEventCount',
        /** 改变本地黄金骰子 */
        SelectGoldDice: 'Adventure_SelectGoldDice',
    },

    Gem: {
        /** 镶嵌 */
        Inlay: 'Inlay',
        /** 一键镶嵌 */
        OneKeyInlay: 'OneKeyInlay',
        /** 一键升级 */
        OneKeyLevelUp: 'OneKeyLevelUp',
    },
    Build: {
        /** 打造 */
        BuildEquip: 'Build_BuildEquip',
    },
    Chat: {
        /** 操作聊天信息 拉黑其他user  */
        DeleteUser: 'Chat_DeleteUser',
        /** 查看用户信息 */
        ScanUserInfo: 'Chat_ScanUserInfo',
        /** 艾特一名用户 */
        ConnectUser: 'Chat_ConnectUser',
        /** 选中一个表情 */
        SelectEmoji: 'Chat_SelectEmoji',
        /** 刷新聊天列表 */
        UpdateChatList: 'Chat_UpdateChatList',
        /** 通知显示 */
        ShowNoticeWin: 'Notice_ShowNoticeWin',
        /** lobbyuibottom msg update */
        LobbyMsgUpdate: 'chat_LobbyMsgUpdate',
        /** lobby show bottom */
        LobbyShowBoard: 'chat_LobbyShowBoard',
        /** close chatview */
        CloseChatView: 'chat_CloseChatView',
        /** at一名用户(操作) */
        AtUser: 'Chat_AtUser',
        /** 去掉copy按钮 */
        RemoveCopyBtn: 'Chat_RemoveCopyBtn',
        /** 输入内容到聊天框(str: string) */
        InputContent: 'Chat_InputContent',
        CloseChatWin: 'Chat_CloseChatWin',
        OpenChatWinState: 'Chat_OpenChatWinState',
        /** 聊天红点 */
        RedUpdate: 'Chat_RedUpdate',
    },

    Battle: {
        /** 回合数变化 */
        TurnNumChange: 'Battle_TurnNumChange',
        /** 战斗波数变化 */
        BacthNumChange: 'Battle_BacthNumChange',
        /** 战斗描述变化 */
        DescChange: 'Battle_DescChange',
        Start: 'Battle_Start',
        End: 'Battle_End',
        /** 我方阵营攻击 */
        MyCampAtkCount: 'Battle_MyCampAtkCount',
        /** 更新Boss实体血量 (data: { currHp: number, maxHp: number }) */
        UpBossEnittyHp: 'Battle_UpBossEnittyHp',
        /** 通知Boss护盾值 */
        NoticeBossShieldVal: 'Battle_NoticeBossShieldVal',
        /** 战斗中Boss血量变化 */
        BossHpChange: 'Battle_BossHpChange',
        /** 战斗初始化完成 */
        InitEnd: 'Battle_InitEnd',
        /** 测试战报 */
        Test: 'Battle_Test',
        /** 测试战报 */
        TestSpeed: 'Battle_TestSpeed',
        /** 播放战报(report: S2CBattlefieldReport) */
        PlayReport: 'Battle_PlayReport',

    },
    /** 主城界面 */
    MainCity: {
        /** 更新主城界面地图 */
        ChangeMap: 'MainCity_ChangeMap',
        /** 显示 */
        Show: 'MainCity_Show',
        /** 关闭 */
        Close: 'MainCity_Close',
    },
    UpStar: {
        /** 点击选择装备 */
        ClickSelectEquip: 'UpStar_ClickSelectEquip',
        /** 选中、取消选中装备 */
        SelectEquip: 'UpStar_SelectEquip',
        /** 选择完成 */
        SelectFinish: 'UpStar_SelectFinish',
        UpStarSuccess: 'UpStar_UpStarSuccess',
    },
    AttrFv: {
        /** 系统总属性和战力变化 */
        UptAttrFv: 'AttrFv_UptAttrFv',
    },
    Grade: {
        /** 更新进阶信息 */
        UpdateInfo: 'Grade_UpdateInfo',
        /** 升阶 */
        UpLevel: 'Grade_UpLevel',
        /** 皮肤激活 */
        SkinActive: 'Grade_SkinActive',
        /** 技能信息刷新 */
        SkillsInfo: 'Grade_SkillsInfo',
        /** 进阶道具数量变化 */
        GradeItemNumChange: {
            // 进阶丹
            GradeDang: 'GradeDang',
            // 注灵丹
            SoulDang: 'SoulDang',
            // 练神丹
            GodDang: 'GodDang',
            // 技能数
            SkillBook: 'SkillBook',
        },
        GradeSkinChange: 'Grade_SkinChange',
        GradeEquipChange: 'Grade_EquipChange',
        GradeEquipItemNum: 'Grade_EquipItemNum',
    },
    TipsSkill: {
        /** 技能详情面板刷新 */
        updateSkill: 'TipsSkill_UpdateInfo',
    },
    Arena: {
        /** 刷新挑战数据 */
        RefreshChallengeData: 'Arena_RefreshChallengeData',
        /** 竞技排行榜 */
        RankList: 'Arena_RankList',
        /** 竞技场挑战结果 */
        ArenaFightResult: 'Arena_ArenaFightResult',
        /** 扫荡结果 */
        SweepResult: 'Arena_SweepResult',
        /** 竞技场次数购买 */
        ArenaBuyTimes: 'Arena_ArenaBuyTimes',
        /** 竞技场购买提示 */
        ArenaBuyTip: 'Arena_ArenaBuyTip',
    },
    RoleSkill: {
        /** 更新角色技能界面 */
        UptSkill: 'RoleSkill_UptSkill',
        UptMartial: 'RoleSkill_UptMartial',
    },
    RoleSkin: {
        /** 皮肤信息 */
        SkinInfo: 'RoleSkin_SkinInfo',
        /** 套装信息 */
        SuitInfo: 'RoleSkin_SuitInfo',
        /** 新增激活的皮肤，带参数：皮肤id */
        NewAddSkin: 'RoleSkin_NewAddSkin',
        /** 皮肤升星 ，带参数：皮肤id */
        SkinUpStar: 'RoleSkin_SkinUpStar',
        /** 套装件数激活,参数(suitId:套装id) */
        SuitActive: 'RoleSkin_SuitActive',
        /** 飞天同庆改变, 带参数：改变后的值 */
        FTTQChange: 'RoleSkin_FTTQChange',
        /** 注灵改变 */
        ZhuLingChange: 'RoleSkin_ZhuLingChange',
        /** 炼神改变, 带参数：改变后的值 */
        LianShenChange: 'RoleSkin_LianShenChange',
        /** 穿戴皮肤变更 */
        WearSkinIdChange: 'RoleSkin_WearSkinIdChange',
        /** 改变页面选中某个皮肤 */
        ChangePageSelectSkinId: 'RoleSkin_ChangePageSelectSkinId',
        /** 华服套装升阶成功 */
        SpecialGradeSuccess: 'RoleSkin_SpecialGradeSuccess',
    },
    /** 任务模块 */
    Task: {
        /** 上线后的第一次初始化任务，带参数，任务id列表 */
        InitTask: 'Task_InitTask',
        /** 更新任务,带参数：任务id列表 */
        UpdateTask: 'Task_UpdateTask',
        /** 完成某个任务的事件(taskIds: number[]) */
        CompletedTask: 'Task_CompletedTask',
        /** 主线任务ID变更 (mainTaskId: number) */
        ChangeMainTaskId: 'Task_ChangeMainTaskId',
        /** 检查指引是否需要显示 */
        CheckGuide: 'Task_CheckGuide',
    },
    ArmyLevel: {
        /** 军衔 一键晋升完成 */
        AutoLvUp: 'Army_AutoLvUp',
        /** 晋升 */
        ArmyUp: 'Army_ArmyUp',
        /** 军衔领取奖励 */
        ArmyReward: 'Army_ArmyReward',
        /** 军衔技能激活 */
        ArmySkillActive: 'Army_ArmySkillActive',
    },
    MergeMat: {
        /** 合成材料 */
        MergeSuccess: 'MergeSuccess', // 合成成功
        SuccessUpdateUI: 'SuccessUpdateUI', // 合成成功
    },
    BattleResult: {
        /** 打开结算界面 */
        OpenView: 'BattleResult_OpenView',
        /** 关闭结算 */
        CloseView: 'BattleResult_CloseView',
        /** 战斗结算界面关闭后会抛这个事件 */
        SettleCloseView: 'BattleResult_SettleCloseView',
    },
    BattleUnit: {
        /** 设置出战 */
        UptUnit: 'BattleUnit_UptUnit',
    },
    General: {
        /** 锁 */
        Lock: 'General_Lock',
        /** 增 */
        Add: 'General_Add',
        /** 删 */
        Del: 'General_Del',
        /** 升级 */
        LevelUp: 'General_LevelUp',
        /** 升品 */
        QualityUp: 'General_QualityUp',
        /** 属性 */
        UptAttr: 'General_UptAttr',
        /** 更新模型 */
        UptEntity: 'General_UptEntity',
        /** 信息界面点击头像 */
        InfoHead: 'General_InfoHead',
        /** 升品点击头像 */
        QualityUpHead: 'General_QualityUpHead',
        /** 布阵点击头像 */
        PlanHead: 'General_PlanHead',
        /** 一键升品的选择 */
        ClickOnekey: 'General_ClickOnekey',
        /** 头衔更新 */
        UptTitle: 'General_UptTitle',
        /** 觉醒更新 */
        UptAwaken: 'General_UptAwaken',
        /** 升阶更新 */
        UptGradeUp: 'General_UptGradeUp',
        /** 升阶点击头像 */
        GradeHead: 'General_GradeHead',
        /** 升阶选择点击头像 */
        GradeChooseHead: 'General_GradeChooseHead',
        /** 升阶选择头像刷新 */
        UptGradeChoose: 'General_UptGradeChoose',
        /** 激活了新皮肤 */
        GetNewSkin: 'General_GetNewSkin',
        /** 皮肤更新 */
        UptGskin: 'General_UptGskin',
        /** 皮肤穿戴 */
        GskinWear: 'General_GskinWear',
        /** 装备穿戴 */
        GEquipWear: 'General_GEquipWear',
        /** 装备升星 */
        GEquipStarUp: 'General_GEquipStarUp',
        /** 装备升星点击头像 */
        EquipHead: 'General_EquipHead',
        /** 装备选择头像刷新 */
        UptEquipChoose: 'General_UptEquipChoose',
        /** 技能学习 */
        GSkillStudy: 'General_GSkillStudy',
        /** 激活了觉醒技能 */
        GSkillAwaken: 'General_GSkillAwaken',
        /** 技能选择 */
        GSkillChoose: 'General_GSkillChoose',
        /** 技能锁定 */
        GSkillLock: 'General_GSkillLock',
        /** 武将重生奖励 */
        GReturn: 'General_GReturn',
        GReturnChoose: 'General_GReturnChoose',
        /** 武将重生返还 */
        GReborn: 'General_GReborn',
        /** 武将遣散 */
        GDisband: 'General_GDisband',
        /** 武将合成 */
        GCompose: 'General_GCompose',
        /** 回收 */
        GRecycle: 'General_GRecycle',
    },
    MaterialFuBen: {
        /** 材料副本刷新UI */
        MaterialUpdateUI: 'MaterialFuBen_MaterialUpdateUI',
    },
    /** 副本 */
    FuBen: {
        /** 进入 */
        EnterSuccess: 'FuBen_EnterSuccess',
        /** 进入失败 */
        EnterFail: 'FuBen_EnterFail',
        /** 退出 */
        Exit: 'FuBen_Exit',
    },
    Vip: {
        /** vip 页签发生改变 */
        VipPageChange: 'Vip_VipPageChange',
        /** vip 等级奖励领取 */
        VipLvReward: 'Vip_VipLvReward',
        /** vip 每日奖励领取 */
        VipDayReward: 'Vip_VipDayReward',
        /** vip 红点 */
        VipRedDot: 'Vip_VipRedDot',
    },
    Shop: {
        /** 神秘商城更新 */
        SecretShopUpdate: 'Shop_SecretShopUpdate',
        /** 商城更新 */
        ShopUpdate: 'Shop_ShopUpdate',
    },
    BossBigHp: {
        /** 开始boss事件（type: EBossEventType, index: number） */
        StartBossEvent: 'BossBigHp_StartBossEvent',
        /** 结束boss事件（type: EBossEventType, index: number） */
        EndBossEvent: 'BossBigHp_EndBossEvent',
    },

    RollFrame: {
        /** 更新拼点最高值 (name: string, value: number, userId: number) */
        UpdateTopRoll: 'RollFrame_UpdateTopRoll',
        /** 更新拼点值（value: number） */
        UpdateRoll: 'RollFrame_UpdateRoll',
        /** 更新设置自动拼点（autoRoll: boolean） */
        UpdateAutoRoll: 'RollFrame_UpdateAutoRoll',
        /** 设置自动拼点的记录（autoRoll: boolean） */
        SetAutoRoll: 'RollFrame_SetAutoRoll',
        /** 清除当前拼点值 */
        ClearCurRollValue: 'RollFrame_ClearCurRollValue',
    },
    ShieldFrame: {
        /** 更新进度 (curNum: number, maxNum: number) */
        UpdateProgress: 'ShieldFrame_UpdateProgress',
    },
    WorldBoss: {
        /** 更新boss页面基础数据 */
        UpdateBossPageData: 'WorldBoss_UpdateBossPageData',
        /** 更新boss数据 */
        UpdateBossData: 'WorldBoss_UpdateBossData',
        /** 更新pve战斗结果 */
        UpdateFightResultPVE: 'WorldBoss_UpdateFightResultPVE',
        /** 更新pvp战斗结果 */
        UpdateFightResultPVP: 'WorldBoss_UpdateFightResultPVP',
        /** 更新自己的拼点值 (value: number) */
        UpdateRollValue: 'WorldBoss_UpdateRollValue',
        /** 更新左侧排行榜数据 */
        UpdateRankData: 'WorldBoss_UpdateRankData',
        /** 更新鼓舞数据 */
        UpdateInspireWin: 'WorldBoss_UpdateInspireWin',
        /** 更新拼点弹窗状态 (isOpen: boolean, endTime: number) */
        UpdateRollFrameStatus: 'WorldBoss_UpdateRollFrameStatus',
        /** 更新护盾弹窗状态 (isOpen: boolean, endTime: number) */
        UpdateShieldFrameStatus: 'WorldBoss_UpdateShieldFrameStatus',
    },
    BeaconWar: {
        /** 展示复活节点 */
        ShowRelive: 'BeaconWar_ShowRelive',
        /** 展示归属节点 */
        ShowBelong: 'BeaconWar_ShowBelong',
        /** 更新主界面数据 */
        UptMain: 'BeaconWar_UptMain',
        /** 更新主场景的boss数据 */
        UptBossData: 'BeaconWar_UptBossData',
        /** 有周围玩家数据更新 */
        UptPlayerData: 'BeaconWar_UptPlayerData',
        /** 通知主玩家跑去某个点 */
        MoveToPlayerPos: 'BeaconWar_MoveToPlayerPos',
        /** 玩家伤害排行榜 */
        PlayerDamageRank: 'BeaconWar_PlayerDamageRank',
        /** 体力变化 */
        UptEnergy: 'BeaconWar_UptEnergy',
        /** 更新鼓舞 */
        UptInspire: 'BeaconWar_UptInspire',
        /** 更新治疗返回 */
        UptTreat: 'BeaconWar_UptTreat',
        /** 玩家队伍详情返回 */
        UptTreatHpList: 'BeaconWar_UptTreatHpList',
        /** 奖励 */
        UptAward: 'BeaconWar_UptAward',

        /** 周围玩家血变化 */
        PlayerHp: 'BeaconWar_PlayerHp',
        /** 周围玩家状态变化 */
        PlayerState: 'BeaconWar_PlayerState',
        /** 周围玩家位置重置 */
        PlayerResetPos: 'BeaconWar_PlayerResetPos',

        /** 怪血变化 */
        MonsterHp: 'BeaconWar_MonsterHp',
        /** 怪状态变化 */
        MonsterState: 'BeaconWar_MonsterState',
        /** 怪物归属变化 */
        MonsterBelong: 'BeaconWar_MonsterBelong',

        /** 隐藏点击特效 */
        HideClickAnim: 'BeaconWar_HideClickAnim',
    },
    OnHook: {
        /** 领取了挂机奖励 */
        GetAward: 'OnHook_GetAward',
        /** 挂机信息 */
        AFKInfo: 'OnHook_AFKInfo',
        /** 挂机增益信息 */
        RewardAdd: 'OnHook_RewardAdd',
        /** 快速挂机信息 */
        QuickAFK: 'OnHook_QuickAFK',
        /** 获得收益的飞金币和经验效果 */
        FlyCoinExp: 'OnHook_FlyCoinExp',
    },
    Escort: {
        /** 打开主界面 */
        MainUI: 'Escort_MainUI',
        /** 刷新主界面 */
        RefreshMainUI: 'Escort_RefreshMainUI',
        /** 开始押镖 */
        Start: 'Escort_Start',
        /** 快速完成 */
        Quick: 'Escort_Quick',
        /** 打开拦截界面 */
        RobUI: 'Escort_RobUI',
        /** 拦截 */
        Rob: 'Escort_Rob',
        /** 已拦截过该镖车 */
        HaveRob: 'Escort_HaveRob',
        /** 被劫记录 */
        RobbedRecord: 'Escort_RobbedRecord',
        /** 刷新品质 */
        RefreshQuality: 'Escort_RefreshQuality',
        /** 领取奖励 */
        GetReward: 'Escort_GetReward',
        /** 镖车移动到终点 */
        MoveToEnd: 'Escort_MoveToEnd',
        /** 押镖时间到 */
        TimeOut: 'Escort_TimeOut',
        /** 有奖励未领-主界面有个护图标 */
        EasyReward: 'Escort_EasyReward',
        /** 有新的被劫记录-主界面有个劫图标 */
        EasyRobbed: 'Escort_EasyRobbed',
    },
    FuncPreview: {
        /** 登录后端就推送下来的已开放的功能id列表 */
        FuncOpenInit: 'FuncPreview_FuncOpenInit',
        /** 有新的功能开启 */
        FuncOpenUpt: 'FuncPreview_FuncOpenUpt',

        /** 有新的功能开启(策划加了限制要弹了新功能开启窗口才显示‘新’标签和刷新预告) */
        FuncOpenNew: 'FuncPreview_FuncOpenNew',
        /** 点击了新开的功能 */
        FuncOpenDel: 'FuncPreview_FuncOpenDel',
        /** 领取 */
        Got: 'FuncPreview_Got',
    },
    GameLevel: {
        /** 关卡排行榜数据 */
        GetRankData: 'GameLevel_GetRankData',
        /** 自动战斗消息 */
        AutoFight: 'GameLevel_AutoFight',
        /** 战斗结束后的新手剧情  */
        NewPlotPlayAfter: 'GameLebel_NewPlotPlayAfter',
    },
    Rank: {
        GameLevelRank: 'Rank_GameLevelRank',
        Workshio: 'Rank_Workshio',
    },
    GamePass: {
        /** 更新信息 */
        UpdateInfo: 'GamePass_UpdateInfo',
        /** 获得奖励 */
        GetReward: 'GamePass_GetReward',
    },
    /** 引导 */
    Guide: {
        /** 显示 */
        Show: 'Guide_Show',
        /** 完成清除指引(taskId: number) */
        ClearGuideComplete: 'Guide_ClearGuideComplete',
        /** 关闭 */
        Close: 'Guide_Close',
    },

    /** 快捷使用道具 */
    ItemQU: {
        GetBox: 'GetBox',
        GetEquip: 'GetEquip',
    },
    /** 活动 */
    Activity: {
        /** 配置数据更新 */
        Cfg: 'Activity_Cfg',
        /** 新增一个或多个活动(actIds: number[]) */
        Add: 'Activity_Add',
        /** 更新一个或多个活动(actIds: number[]) */
        Update: 'Activity_Update',
        /** 删除一个或多个活动(actIds: number[]) */
        Del: 'Activity_Del',
        /** 红点 */
        Red: 'Activity_Red',
        /** 根据fundid 和 cycNo 获取到的玩家数据 */
        Data: 'Activity_Data',
    },
    /** (活动)每日签到 */
    DaySign: {
        /** 更新UI数据 */
        UpdataUI: 'DaySign_Updata',
        /** 更新单个对象 */
        UpdateOne: 'DaySign_UpdateOne',
    },
    /** (活动)武将招募 */
    GeneralRecruit: {
        InitData: 'GeneralRecruit_InitData', // 初始UI基础数据
        getStageReward: 'GeneralRecruit_getStageReward', // 阶段奖励获取成功
        getZhaoMuLog: 'GeneralRecruit_getZhaoMuLog', // 招募日志获取成功
        ZhaoMuSuccess: 'GeneralRecruit_ZhaoMuSuccess', // 招募日志获取成功
        ZhaoMuBagInfo: 'GeneralRecruit_ZhaoMuBagInfo', // 获得背包数据
        TakeOutSuccess: 'GeneralRecruit_TakeOutSuccess', // 背包取出
        SetWish: 'GeneralRecruit_SetWish', // 设置许愿
        UpdateWishSelectNum: 'GeneralRecruit_UpdateWishSelectNum', // 更新武将心愿选中
    },
    /** (活动)每天在线活动 */
    OnlineReward: {
        /** 更新UI数据 */
        UptData: 'OnlineReward_UptData',
    },
    /** (活动)等级战力奖励 */
    StageReward: {
        /** 更新(等级、战力等等）奖励数据 */
        UptStage: 'StageReward_UptStage',
    },
    /** 用户官职 */
    RoleOfficial: {
        /** 用户官职变化 */
        OfficialChange: 'RoleOfficial_OfficialChange',
        /** 用户每日奖励领取 */
        OfficialDayReward: 'RoleOfficial_OfficialDayReward',
        /** 用户等级任务领取 */
        OfficialRankReward: 'OfficialChange_OfficialRankReward',
        /** 用户普通任务奖励 */
        OfficialTask: 'RoleOfficial_OfficialTask',
    },
    /** 官印虎符 */
    SealAmulet: {
        /** 官印虎符升级 */
        UpGrade: 'SealAmulet_UpGrade',
        /** 升星 */
        UpStar: 'SealAmulet_UpStar',
        /** 淬炼 */
        Quality: 'SealAmulet_Quality',
    },
    /** 红颜 */
    Beauty: {
        /** 初始化 */
        Init: 'Beauty_Init',
        /** 新增(ids: number[]) */
        Add: 'Beauty_Add',
        /** 更新(ids: number[]) */
        Update: 'Beauty_Update',
        /** 更新星级(id: number) */
        UpdateStar: 'Beauty_UpdateStar',
        /** 更新等级经验值(id: number) */
        UpdateExpLevel: 'Beauty_UpdateExpLevel',
        /** 更新头像(id: number) */
        UpdateHead: 'UpdateHead',
    },
    /** 系统设置 */
    SysSetting: {
        /** 改名 */
        ModifyName: 'SysSetting_ModifyName',
    },
    Team: {
        /** 创建队伍(teamId: number) */
        Create: 'Team_Create',
        /** 加入队伍(teamId: number) */
        Join: 'Team_Join',
        /** 加入队伍失败(teamId: number) */
        JoinFail: 'Team_JoinFail',
        /** 解散队伍 */
        Dissolve: 'Team_Dissolve',
        /** 离开队伍 */
        Leave: 'Team_Leave',
        /** 踢出队伍(userId: number)  */
        Kick: 'Team_Kick',
        /** 进入副本 */
        EnterFB: 'Team_EnterFB',
        /** 扫荡副本(fbId: number) */
        SweepFB: 'Team_SweepFB',
        /** 自动匹配结果(members: TeamViewPlayer[]) */
        AutoMatch: 'Team_AutoMatch',
        /** 添加成员(userId: number) */
        AddMember: 'Team_AddMember',
        /** 移除成员(userId: number) */
        RemoveMember: 'Team_RemoveMember',
        UpdateMember: 'Team_UpdateMember',
        /** 更新队伍列表(teamList: TeamView[]) */
        UpdateTeamList: 'Team_UpdateTeamList',
        /** 更新购买次数(fbType: number) */
        UpdateBuyPassTime: 'Team_UpdateBuyPassTime',
        /** 更新队伍的限制战力 */
        UpdatePowerLimit: 'Team_UpdatePowerLimit',
        /** 更新组队副本阵容 */
        // UpdateTeamPlan: 'Team_UpdateTeamPlan',
        /** 组队副本阵容列表() */
        PlanList: 'Team_PlanList',
        /** 组队副本阵容下阵(pos: number, onlyId: number) */
        PlanDown: 'Team_PlanDown',
        /** 组队副本阵容上阵(pos: number, onlyId: number, type: number) */
        PlanUp: 'Team_PlanUp',
        /** 组队副本阵容改变位置(pos: number, onlyId: number, type: number) */
        PlanChange: 'Team_PlanChange',
        /** 组队副本阵容替换(pos: number, onlyId: number, type: number, pos2: number) */
        PlanReplace: 'Team_PlanPlanReplace',
        /** 开始自动匹配 */
        BeginAutoMatch: 'Team_BeginAutoMatch',
        /** 停止自动匹配 */
        EndAutoMatch: 'Team_EndAutoMatch',
        /** 开始满人自动开始的倒计时 */
        BeginAutoStart: 'Team_BeginAutoStart',
        /** 停止满人自动开始的倒计时 */
        EndAutoStart: 'Team_EndAutoStart',
        /** 更新邀请界面的玩家列表(type: 类型) */
        UpdateMathPlayers: 'Team_UpdateMathPlayers',
        /** 更新组队信息 */
        UpdateTeamInfo: 'Team_UpdateTeamInfo',
        /** 邀请失败 */
        InviteFail: 'Team_InviteFail',
        /** 更新一键邀请 */
        UpdateAllInvite: 'Team_UpdateAllInvite',
    },
    Music: {
        FightEnd: 'Music_FightEnd',
    },
    /** 头像头像框 */
    Head: {
        /** 获取列表信息 */
        List: 'Head_List',
        /** 更新 */
        Update: 'Head_Update',
        /** 选中 */
        Select: 'Head_Select',

    },
    Friend: {
        /** （好友/申请）列表 */
        List: 'Friend_List',
        /** 推荐好友列表 */
        RecommendList: 'Friend_RecommendList',
        /** 搜索返回 */
        Find: 'Friend_Find',
        /** 收到礼物 */
        GetGift: 'Friend_GetGift',
        /** 赠送礼物 */
        GiveGift: 'Friend_GiveGift',
        /** 拉黑 */
        Delete: 'Friend_Delete',
        /** 添加好友 */
        AddApply: ' Friend_AddApply',
        /** 同意或者拒绝其他好友申请 */
        Operate: 'Friend_Operate',
        /** 收到好友私聊消息 */
        ChatMsg: 'Friend_ChatMsg',
        /** 好友私聊红点更新 */
        ChatRed: 'Friend_ChatRed',
    },
    /** 博物志 */
    CollectionBook: {
        /** 更新经验值 */
        UpdateExp: 'CollectionBook_UpdateExp',
        /** 更新等级 */
        UpdateLevel: 'CollectionBook_UpdateLevel',
        /** 新激活 */
        NewActive: 'CollectionBook_NewActive',
        /** 更新星级 */
        UpdateStar: 'CollectionBook_UpdateStar',
        /** 更新生涯图鉴 */
        UpdateCareer: 'CollectionBook_UpdateCareer',
        /** 更新任务 */
        UpdateTask: 'CollectionBook_UpdateTask',
        /** 更新生涯图鉴分享状态 */
        UpdateCareerShare: 'CollectionBook_UpdateCareerShare',
    },
    Family: {
        /** 世家基础信息 */
        FamilyInfo: 'Family_FamilyInfo',
        /** 事务基础信息 */
        FamilyTaks: 'Family_FamilyTasks',
        /** 刷新事务 */
        FamilyRefreshTask: 'Family_FamilyRefreshTask',
        /** 世家成员列表 */
        FamilyMemberList: 'Family_FamilyMemberList',
        /** 设置协助成功 */
        FamilySetAssist: 'Family_SetAssist',
        /** 加速成功 */
        FamilySpeedUpCD: 'Family_FamilySpeedUpCD',
        /** 领取奖励成功 */
        FamilyGetReward: 'Family_FamilyGetReward',
        /** 可派遣列表 */
        FamilyCanStartList: 'Family_FamilyCanStartList',
        /** 获得其他人的协助伙伴列表 */
        FamilyGetHelpPL: 'Family_FamilyGetHelpPL',
        /** 一键派遣成功 */
        FamilyOneKeySuccess: 'Family_FamilyOneKeySuccess',
        /** 单独派遣成功 */
        FamilySingleSendSuccess: 'Family_FamilySingleSendSuccess',
        /** 主页展示英雄数据 */
        FamilyHomeHeroData: 'Family_FamilyHomeHeroData',
        /** 修改昵称-宣言 */
        FamilyModify: 'Family_FamilyModify',
        /** 昵称宣言变化 */
        FamilyNameUpdate: 'Family_FamilyNameUpdate',
        /** 膜拜成功 */
        FamilyWorship: 'Family_FamilyWorship',
        /** 俸禄成功 */
        FamilySalary: 'Family_FamilySalary',
        /** 玩家基础信息 */
        FamilyRoleInfo: 'Family_FamilyRoleInfo',
        /** 玩家争夺信息 */
        FamilyPatriInfo: 'Family_FamilyPatriInfo',
        /** 族长争夺-我的排名信息 */
        FamilyGetMyRank: 'Family_FamilyGetMyRank',
        /** 族长争夺-伤害排行 */
        FamilyDamageRank: 'Family_FamilyDamageRank',
        /** 族长争夺-二阶段基础信息 */
        FamilyPatriLeaderInfo: 'Family_FamilyPatriLeaderInfo',
        /** 校场基础信息 */
        FamilyDrillGroundInfo: 'Family_FamilyDrillGroundInfo',
        /** 校场升级 */
        FamilyDrillGroundLvUp: 'Family_FamilyDrillGroundLvUp',
        /** 校场升级 */
        FamilyTotemInfo: 'Family_FamilyTotemInfo',
        /** 试炼副本基础信息 */
        FamilyTrialCopyInfo: 'Family_FamilyTrialCopyInfo',
        /** 试炼Boss基础信息 */
        FamilyTrialBossInfo: 'Family_FamilyTrialBossInfo',
        /** 试炼副本-领取通关奖励 */
        FamilyTrialGetReward: 'Family_FamilyTrialGetReward',
        /** 试炼副本-红包排行版 */
        FamilyRedPacketRankList: 'Family_FamilyRedPacketRankList',
        /** 试炼副本-红包领取奖励成功 */
        FamilyRedPacketReward: 'Family_FamilyRedPacketReward',
        /** 试炼副本-购买次数 */
        FamilyTiralBuyNm: 'Family_FamilyTiralBuyNm',
        /** 试炼副本-排行榜信息 */
        FamilyTrialRankInfo: 'Family_FamilyTrialRankInfo',
        /** 试炼副本-挑战成功 */
        FamilyTrialFightSuccess: 'Family_FamilyTrialFightSuccess',
    },
    /** 摇钱树 */
    CashCow: {
        /** 获取到玩家数据 */
        Data: 'CashCow_Data',
        /**  摇一摇 */
        Shake: 'CashCow_Shake',
    },
    /** 排位赛 */
    RankMatch: {
        /** 更新分数 */
        UpdateScore: 'RankMatch_UpdateScore',
        /** 更新数据 */
        UpdateData: 'RankMatch_UpdateData',
        /** 更新剩余次数(isAutoMatch: boolean) */
        UpdateChallengeNum: 'RankMatch_UpdateChallengeNum',
        /** 匹配成功（players: BaseUserInfo[]） */
        MatchSucess: 'RankMatch_MatchSucess',
        /** 战斗数据(logs: RankMatchFightLog[]) */
        FightLog: 'RankMatch_FightLog',
        /** 更新每日首胜奖励状态(isYlq: boolean) */
        UpdateDayWinReward: 'RankMatch_UpdateDayWinReward',
        /** 更新总胜场奖励 */
        UpdateSessionGetRwList: 'RankMatch_UpdateSessionGetRwList',
        /** 更新段位奖励状态(changeIds: number[]) */
        UpdateLevelGetRwList: 'RankMatch_UpdateLevelGetRwList',
        /** 更新排行榜数据 */
        UpdateRankData: 'RankMatch_UpdateRankData',
        /** 更新恢复次数的时间 */
        UpdateNextRefreshTime: 'RankMatch_UpdateNextRefreshTime',
    },
    /** 等级战力通行证 */
    GeneralPass: {
        /** 获取到玩家数据 */
        Data: 'GeneralPass_Data',
        /** 更新数据 */
        UpdateData: 'GeneralPass_UpdateData',
        /** 全民奖励数据处理 */
        WelfareData: 'GeneralPass_WelfareData',
    },
    /** buff */
    Buff: {
        /** 新增一个buff */
        Add: 'Buff_Add',
        /** 删除一个buff */
        Del: 'Buff_Del',
        /** 更新一个buff */
        Update: 'Buff_Update',
    },
    DailyTask: {
        /** 获取到任务信息 */
        Data: 'DailyTask_Data',
        /** 找回 */
        ResData: 'DailyTask_ResData',
        /** 找回领取奖励 */
        ResReward: 'DailyTask_ResReward',
        /** 阶段奖励领取 */
        StageReward: 'DailyTask_StageReward',
    },

    /** cdkey */
    CdKey: {
        /** 领取结果 */
        Result: 'CdKey_Result',
    },
    /** 军师 */
    Adviser: {
        UpdateInfo: 'Adviser_UpdateInfo',
        /** 更新军师等级(level: number, exp: numeber) */
        UpdateExpLevel: 'Adviser_UpdateExpLevel',
        /** 更新专精等级(ids: number[], levels: number[]) */
        UpdateMasteryLevel: 'Adviser_UpdateMasteryLevel',

    },

    /** 华容道 */
    Huarongdao: {
        /** 刷新界面 */
        UpdateView: 'Huarongdao_UpdateView',
        /** 支持率请求结果 */
        SupportRateData: 'Huarongdao_SupportRateData',
        /** 支持结果 */
        SupportResult: 'Huarongdao_SupportResult',
        /** 支持状态刷新 */
        SupportStateUpdate: 'Huarongdao_SupportStateUpdate',
        /** 礼券购买次数刷新 */
        GiftTimesUpdate: 'Huarongdao_GiftTimesUpdate',
        /** 礼券购买结果 */
        GiftBuyResult: 'Huarongdao_GiftBuyResult',
        /** 弹幕事件 */
        BulletChat: 'Huarongdao_bullet_chat',
        /** 押注记录 */
        SupportLog: 'Huarongdao_SupportLog',
        /** 弹幕开关 */
        ToggleBulletChat: 'Huarongdao_ToggleBulletChat',
    },
};
