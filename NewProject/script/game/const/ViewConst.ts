/*
 * @Author: hrd
 * @Date: 2022-03-31 18:40:40
 * @Description: 视图唯一id配置表
 */
export enum ViewConst {
    /** GM */
    GMWin = 99999,
    /** 活动 */
    ActivityWin = 100000,

    /** 登录界面 */
    LoginView = 1,
    /** 创角界面 */
    CreateRoleView,
    /** 选服列表界面 */
    SelServerView,
    /** 开始游戏界面 */
    StartGameView,
    /** 账号登录界面 */
    AccountLoginView,
    /** 账号注册界面 */
    AccountRegView,
    /** 游戏公告界面 */
    GameNoticeView,
    /** 游戏首次欢迎界面 */
    GameWelcomeWin,
    /** 资源加载 */
    ResLoading,
    /** 主角界面 */
    RoleView,
    /** 背包界面 */
    BagWin,
    /** 角色界面 */
    RoleWin,
    /** 角色属性界面 */
    RoleAttrWin,
    /** 充值界面 */
    RechargeWin,
    /** 物品来源 */
    ItemSourceWin,
    /** 兑换界面 */
    ExchangeWin,
    /** 二次确认框 */
    ConfirmBox,
    /** 邮件详情 */
    MailDetail,
    /** 道具提示 */
    ItemTipsWin,
    /** 背包扩容 */
    BagExpansionWin,
    /** 熔炼主窗口 */
    SmeltWin,
    /** 强化主窗口 */
    EquipWin,
    /** 强化共鸣窗口 */
    ResonanceWin,
    /** 道具提示自选宝箱弹框 */
    ItemTipsPickChestWin,
    /** 首领界面 */
    BossWin,
    /** 首领排行榜 */
    BossRankList,
    /** boss鼓舞 */
    BossInspireWin,
    /** 多人boss奖励预览 */
    BossAwardPriew,
    /** 跨服首领 */
    WorldBossPage,
    /** 名将来袭 */
    WorldBossMJPage,
    /** 名将鼓舞 */
    WorldBossInspireWin,
    /** 名将抢夺 */
    WorldBossGrabWin,
    /** 名将奖励预览 */
    WorldBossRewardPreview,
    /** 烽火连城 */
    BeaconWarPage,
    BeaconWarInspireWin,
    BeaconWarRePreWin,
    BeaconWarQuickWin,
    BeaconWarTreatWin,
    /** 恭喜获得 */
    GetRewardWin,
    /** 聊天界面 */
    ChatWin,
    /** 表情包 */
    ChatEmoji,
    /** 公告 */
    NoticeWin,

    /** 背包扩容 */
    BagOneKeyUseWin,
    /** 收益包裹 */
    PackageWin,
    /** 道具快捷使用弹框 */
    ItemQuickUseWin,
    /** 战力细节弹框 */
    FightValueDetailWin,
    /** 称号 */
    TitleWin,
    TitleDetail,
    /** 打造功能单独有个tip */
    ItemTipsBuildWin,
    /** 主城界面 */
    MainCity,
    /** 进阶弹框 */
    GradeWin,
    /** 升星选择装备弹窗 */
    UpStarSelectEquipWin,
    /** 进阶一键购买弹窗 */
    WinComQuickPay,
    /** 进阶化金弹窗 */
    GradeToGoldWin,
    /** 进阶豪礼窗口 */
    GradeGiftWin,
    /** 进阶豪礼页面 */
    GradeGiftPage,
    /** 时装注灵 */
    GradeSoulWin,
    /** 升星结果弹窗 */
    UpStarRewardWin,
    /** 属性界面 */
    AttrTips,
    /** 角色时装窗口 */
    RoleSkinWin,
    /** 角色时装页面 */
    RoleSkinPage,
    /** 角色时装套装页面 */
    RoleSkinSuitPage,
    /** 角色活动套装页面 */
    RoleActivitySuitPage,
    /** 进阶吞噬窗口 */
    GradeGodWin,
    /** 角色技能 */
    RoleSkillPage,
    /** 进阶恭喜获得窗口 */
    GradeGetAwardsWin,
    /** 进阶恭喜获得窗口 */
    GetAwardsHightWin,
    /** 获取奖励窗口 */
    TipsGetAwards,
    /** 进阶自动购买提示 */
    WinAutoPayTips,
    /** 技能详情窗口 */
    TipsSkillWin,
    /** 竞技场 */
    ArenaWin,
    /** 竞技场排名奖励 */
    ArenaRankRewardView,
    /** 竞技场排行榜界面 */
    ArenaRankListView,

    /** 角色官职主窗口 */
    RoleArmyOfficialPage,
    /** 官职 */
    RoleOfficialPage,
    /** 军衔 */
    RoleArmyLevelPage,
    /** 角色活动套装页面 */
    RoleExoticSuitPage,
    /** 技能绝学 */
    UniqueSkillPage,
    /** 技能武艺 */
    RoleMartialPage,
    /** 特性提升 */
    GemCompare,
    /** 军衔预览 */
    ArmyPreviewTip,
    /** 角色套装部件窗口 */
    RoleSuitPartWin,
    /** 激活绝学 */
    ActiveSkillTip,
    /** 军衔提升 */
    ArmyLevelUpTip,
    /** 玩法说明 */
    DescWinTip,
    /** 材料副本 */
    MaterialWin,
    /** 材料副本奖励预览 */
    MaterialRewardScanWin,
    /** 武将系统 */
    GeneralWin,
    /** 武将布阵系统 */
    PlanWin,
    /** 武将-皮肤 */
    GskinWin,
    /** 一键升品 */
    QualityOnekeyUp,
    /** 升品预览 */
    QualityUpPreview,
    /** 升品成功 */
    QualityUpSucess,
    /** 一键升品成功 */
    GeneralRewardWin,
    /** 选择武将弹窗 */
    GeneralChooseWin,
    /** 武将升阶选择界面 */
    GradeUpChooseWin,
    /** 武将重生选择界面 */
    GRebornChooseWin,
    /** 武将技能展示 */
    GeneralSkillWin,
    /** 武将装备展示win */
    GEquipTipsWin,
    /** 武将技能选择 */
    GSkillChooseWin,
    /** 武将技能回收 */
    GSkillRecycleWin,
    /** 武将技能推荐 */
    GSkillRecomWin,
    /** 武将羁绊 */
    GFetters,
    /** 武将图鉴 */
    GBookWin,
    /** 武将图鉴详情 */
    GBookDetailWin,
    /** 通用奖励弹窗展示，格子形式 */
    WinRwShow,
    /** vip界面 */
    VipWin,
    /** 奖励展示弹窗 */
    WinReward,
    /** vip 特权展示窗口 */
    VipContentTipWin,
    /** vip升级弹窗 */
    VipUpdateWin,
    /** vipSuperWin 充值和vip界面的父级win */
    VipSuperWin,
    /** 商城界面 */
    ShopWin,
    /** 购买弹窗 */
    WinQuickPay,
    /** 挂机 */
    OnHookWin,
    OnHoolTips,
    /** 关卡界面win */
    GameLevelWin,
    /** 关卡通行证界面 */
    GamePassWin,
    /** 战斗结算相关界面 */
    BattleSettleWin,
    /** 重连警告提示窗 */
    ReqLoginWarnWin,

    /** 每日签到 */
    DaySigPage,
    DaySignRe,
    /** 关卡新章节开启 */
    GameLevelNewChapterView,
    /** 常驻排行榜 */
    RankListWin,
    RankListLocalPage,
    /** 实名认证弹窗 */
    RealNameWin,
    IdentitykBox,
    /** 官职奖励界面 */
    RoleOfficialRewardWin,
    /** 虎符官印win */
    SealAmuletWin,
    /** 战力详情界面（扩展） */
    AttrDetailTips,
    /** 虎符官印展示界面 */
    SealAmuletTipWin,
    /** 官职升级 */
    SealAmuletUpWin,
    /** 红颜界面 */
    BeautyWin,
    /** 红颜tips视图 */
    BeautyTipsView,
    /** 系统设置 */
    SettingWin,
    /** 改名 */
    ModifyNamePage,
    /** 组队列表&我的队伍界面 */
    TeamWin,
    /** 邀请玩家界面 */
    InvitePlayerWin,
    /** 邀请确认框 */
    InvitationBox,
    /** 组队阵容预览界面 */
    TeamPlanPreView,
    /** 组队阵容奖励界面 */
    TeamRewardWin,
    /** 武将招募 */
    GeneralRecruitWin,
    /** 武将招募- 日志概率 */
    RandomLogTip,
    /** 武将招募 进度奖励 */
    GeneralAwardTip,
    /* 武将招募-武将心愿 */
    GeneralWishTip,
    /** 头像头像框 */
    HeadPage,
    /** 属性信息简单展示 */
    AttrSimpleWin,

    /** 炼体窗口 */
    RoleExerciseWin,
    /** 炼体页面 */
    RoleExercisePage,

    /** 好友界面 win */
    FriendWin,
    FriendChatWin,
    FriendAddWin,

    /** 西域行商结算奖励 */
    SilkRoadReward,
    /** 西域行商事件奖励 */
    SilkRoadEventReward,

    /** 游历天下结算奖励 */
    AdventureReward,
    /** 游历天下事件 */
    AdventureEventView,
    /** 黄金骰子界面 */
    AdventureGoldDice,

    /** 新手剧情 */
    NewPlotPanel,
    /* 武将招募-武将奖励 */
    GeneralRecRewardWin,
    /** 武将招募-自动购买 */
    GeneralAutoBuyTip,
    /** 世家系统主页 */
    FamilyHomePage,
    /** 世家-[世家 成员] */
    FamilyWin,
    /** 博物志-奖励预览 */
    CollectionBookRw,
    /** 世家-事务 */
    FamilyTaskWin,
    /** 世家-设置协助 */
    FamilySetAssistTip,
    /** 世家-一键派遣 */
    FamilyAutoDispathTip,
    /** 族长特权 */
    FamilyPowerTip,
    /** 世家-族长争夺 */
    FamilyPatriarchWin,
    /** 试炼副本 */
    FamilyTrialCopyWin,
    /** 博物志 */
    CollectionBookWin,
    /** 博物志-生涯插画界面 */
    CollectionPicDetailsWin,
    /** 博物志-见闻升级成功界面 */
    CollectionAttrUpWin,
    /** 博物志-人物/奇物详情界面 */
    CollectionUpDetailsWin,
    CollectionDetailsWin,
    /** 事务-等级提升 */
    FamilyUpTipsWin,
    /** 世家-详细信息 */
    FamilyLevelTips,
    /** 世家-修改名称宣言 */
    FamilyModifyTip,
    /** 世家-俸禄 */
    FamilyAwardTip,
    /** 世家-红包 */
    FamilyTrialRedPackTip,
    /** 世家-试炼副本-通关奖励 */
    FamilyTrialAwardTip,
    /** 世家试炼副本-排行榜tip */
    FamilyTrialRankTip,
    /** 摇一摇购买弹窗 */
    CashCowBuyWin,
    /** 仙装 */
    RoleSpecialSuitWin,
    /** 仙装激活 */
    RoleSpecialCollectWin,
    /** 摇一摇概率 */
    CashCowRateWin,
    /** 日常周常任务 资源找回 */
    DailyTaskWin,
    /** 排位赛-奖励窗口 */
    RankMatchAwardWin,
    /** 排位赛-战报 */
    RankMatchReportWin,
    /** 排位赛-排行榜 */
    RankMatchRankWin,
    /** 排位赛-匹配对决界面 */
    RankMatchDuel,
    /** 排位赛-赛季重置界面 */
    RankMatchReset,
    /** 排行榜 */
    FBExploreRank,
    /** 战报 */
    FBExploreReport,
    /** 重置 */
    FBExploreReset,
    /** 全民福利 */
    WelfareWin,
    /** 资源找回购买win */
    ResRecoveryBuyWin,
    /** 日常 */
    DailyWin,
    /** 劫镖 */
    RobbedWin,
    /** 拦截 */
    RobWin,
    /** 选择镖车 */
    ChooseBoardWin,
    /** 押镖奖励 */
    EscortRewardWin,
    /** 新功能开启 */
    FuncOpenWin,
    /** buff列表，状态显示 */
    BuffListWin,
    /** 世界等级 */
    WorldLevelWin,
    /** 物品预览 */
    ComItemsScanWin,
    /** 军师 */
    AdviserWin,
    /** 华容道支持 */
    HuarongdaoSupport,
    /** 华容道支持 */
    HuarongdaoGiftBuy,
    /** 华容道活动记录 */
    HuarongdaoRecord,
    /** 华容道结算 */
    HuarongdaoResult,
}
