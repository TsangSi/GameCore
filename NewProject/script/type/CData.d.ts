//Boss常量
declare class Cfg_Boss_Config {
	Key: string; // 配置字段（红色表示重复）
	Value: string; // 配置值
}
//个人首领
declare class Cfg_Boss_Personal {
	Id: number; // Id
	BossId: number; // BOSS编号
	RefreshId: number; // 怪物刷新ID
	ShowLabel: string; // 界面显示军衔等级
	ShowName: string; // 界面显示怪物名称
	NeedLevel: number; // 挑战军衔等级
	ExtCond: number; // 额外条件
	ShowPrize: string; // 显示奖励道具id数组
	DropId: number; // 掉落ID
	LimitTimesId: number; // 挑战限制次数ID
}
//至尊boss
declare class Cfg_Boss_VIP {
	Id: number; // Id
	BossId: number; // BOSS编号
	RefreshId: number; // 怪物刷新ID
	ShowLabel: string; // 界面显示等级
	ShowName: string; // 界面显示怪物名称
	NeedLevel: number; // 挑战军衔等级
	NeedVipLevel: number; // 需要vip等级
	ShowPrize: string; // 掉落展示
	DropId: number; // 掉落奖励ID
	LimitId: number; // 挑战限制次数ID
}
//多人首领
declare class Cfg_Boss_Multi {
	Id: number; // Id
	BossId: number; // BOSS编号
	RefreshId: number; // 怪物刷新ID
	ShowLabel: string; // 界面显示等级
	ShowName: string; // 界面显示怪物名称
	NeedLevel: number; // 挑战军衔等级
	ShowBestPrize: string; // 归属奖励展示
	ShowChallengePrize: string; // 参与奖励展示
	BestPrize: number; // 归属奖励掉落id
	ChallengePrize: number; // 参与奖励掉落id
	RunTime: number; // 逃跑时间（秒）
	ReliveTime: number; // 复活时间（秒）
	Order1PrizeShow: string; // 第1名排名奖励展示
	Order2PrizeShow: string; // 第2名排名奖励展示
	Order3PrizeShow: string; // 第3名排名奖励展示
	Order4PrizeShow: string; // 第4名排名奖励展示
	Order5PrizeShow: string; // 第5名排名奖励展示
	Order1PrizeId: string; // 第1名排名奖励掉落Id
	Order2PrizeId: string; // 第2名排名奖励掉落Id
	Order3PrizeId: string; // 第3名排名奖励掉落Id
	Order4PrizeId: string; // 第4名排名奖励掉落Id
	Order5PrizeId: string; // 第5名排名奖励掉落Id
	ReliveCost: string; // 复活令消耗
}
//烽火连城
declare class Cfg_BeaconWar {
	CityID: number; // 城池层数
	CityName: string; // 城池名称
	MapId: number; // 场景ID
	MiniMapId: number; // 缩略图编号ID
	MiniIconId: number; // 城池列表底图ID
	ArmyLevel: number; // 军衔阶级
	ArmyStar: number; // 军衔等级
	ShowOwnerDrop: string; // 归属奖励展示
	ShowLuckDrop: string; // 最后一击奖励展示
	ShowDrop: string; // 挑战奖励展示
	OwnerDropReward: string; // 归属奖励掉落
	LuckDropReward: string; // 最后一击掉落奖励
	DropReward: number; // 协助奖励
	Recommend: number; // 推荐战力
}
//名将来袭排名奖励表
declare class Cfg_WorldBoss_Rank {
	KEY: number; // id
	RankType: number; // 排行类型
	MinRank: number; // 最小排名
	MaxRank: number; // 最大排名
	GroupId: number; // 奖励组id
}
//名将来袭首领表
declare class Cfg_WorldBoss {
	Id: number; // 首领id
	Name: string; // 首领名称
	ResId: number; // 资源id
	RefreshId: number; // 刷新id
	Camp: number; // 阵营
	Skill1: number; // 普攻技能
	Skill2: number; // 终极技能
}
//名将来袭鼓舞
declare class Cfg_WorldBoss_Inspire {
	Times: number; // 次数
	Cost: string; // 消耗货币
	InspireRatio: number; // 攻击增幅（万分比）
	InspireBuffId: number; // 鼓舞BUFFID
}
//博物升星表
declare class Cfg_CollectionBookStar {
	Key: number; // 唯一编号
	FuncId: number; // 功能ID
	MinLevel: number; // 最小等级
	MaxLevel: number; // 最大等级
	LevelUpItem: number; // 升级所需道具数量
	AttrRatio: number; // 属性加成（万分比）
	TotalRatio: number; // 等级段总万分比
}
//博物常量表
declare class Cfg_CollectionBookConfig {
	Key: string; // 配置字段（红色表示重复）
	Value: string; // 配置值
}
//博物志类型表
declare class Cfg_CollectionBookType {
	ID: number; // 唯一ID
	Class: number; // 大类别
	SubType: number; // 小类别
	Name: string; // 类型名称
}
//博物志表
declare class Cfg_CollectionBook {
	Id: number; // ID
	Name: string; // 道具名称
	Class: number; // 大类别
	SubType: number; // 小类别
	Type: number; // 图鉴类型
	Quality: number; // 品质
	Sort: number; // 排序
	Unlockitem: number; // 解锁所需道具ID
	UnlockParam: number; // 解锁所需参数
	AddExp: number; // 解锁增加见闻评分
	Attr: number; // 基础属性ID
	StarUpItem: number; // 升星所需道具（自身）ID
	AnimId: string; // 图片资源ID
	Prize: string; // 分享/激活奖励
	Text: string; // 描述文本
}
//见闻任务表
declare class Cfg_CollectionBookTask {
	Id: number; // 任务ID
	Type: number; // 任务类型序号
	CountType: number; // 任务计数类型
	SubType: number; // 子类型
	Independent: number; // 是否独立计数
	Param: string; // 完成条件
	TargetCount: number; // 任务完成条件
	Priority: number; // 优先级
	Prize: string; // 完成任务奖励方案id数组
	AddPoint: number; // 完成任务增加评分
	FuncId: number; // 跳转页面
	SortIdx: number; // 不同类型任务的显示排序
	Point: string; // 图片路径
}
//见闻等级表
declare class Cfg_CollectionBookLevel {
	Level: number; // 等级
	Name: string; // 见闻等级名称
	AttrId: number; // 属性ID
	ExpMax: number; // 所需经验值
	DropReward: string; // 等级奖励
	AnimId: string; // 图片资源ID
}
//表情包
declare class Cfg_Emoji {
	Id: number; // 唯一ID
	Group: number; // 所属分组
	IsGif: number; // 是否动图
	Code: string; // 代码
	ResId: string; // 美术资源id
}
//材料副本
declare class Cfg_FB_Material {
	Id: number; // Id
	Name: string; // 名字
	MaxStar: number; // 最高星级
	StarUp: string; // 升星所需打副本次数
	Unlock: string; // 解锁条件
	LimitTimesId: number; // 限制次数ID
	DropPrize: string; // 固定掉落道具
	DropInc: string; // 固定掉落随星级递增值
	RefreshId: number; // 刷新ID
	FuncId: number; // 对应功能ID
	OpenSort: number; // 展示顺序
	ClientMsg: number; // 玩法说明
	JumpId: number; // 跳转ID
}
//材料副本购买次数收费
declare class Cfg_MaterialCoin {
	Id: number; // ID
	Coin: string; // 购买初始价格
}
//称号页签表
declare class Cfg_TitleTab {
	Id: number; // 页签ID
	TabName: string; // 页签名字
}
//称号升星表
declare class Cfg_TitleLevelUp {
	Key: number; // 唯一编号
	FuncId: number; // 功能ID
	MinLevel: number; // 最小等级
	MaxLevel: number; // 最大等级
	LevelUpItem: number; // 升级所需道具数量
	AttrRatio: number; // 属性加成（万分比）
	TotalRatio: number; // 等级段总万分比
}
//称号表
declare class Cfg_Title {
	Id: number; // key
	Desc: string; // 描述
	Type: number; // 类型
	Name: string; // 名称
	NeedItem: number; // 激活所需道具
	AttrId: number; // 激活属性id
	Quality: number; // 品质
	AutoWear: number; // 是否自动穿戴0否 1是
	IsLevelUp: number; // 是否可升级0否 1是
	AnimID: string; // 静态美术资源id
	Dynamic: string; // 动态美术资源id
	ShowLimitId: number; // 显示条件ID
	UISetY: number; // UI中Y轴偏移
	UIScale: number; // UI中缩放倍率
	MapSetY: number; // 场景中Y轴偏移
	MapScale: number; // 场景中缩放倍率
	SpecialFrom: number; // 特殊获取途径（无道具解锁的称号）
	FromDesc: string; // 获取来源描述
	TimeType: number; // 时间类型1持续时间2活动时间
	TimeParam: number; // 时效参数
	Rate: number; // 激活占比（万分比）
	TabId1: number; // 一级页签
}
//FB常量表
declare class Cfg_FB_Config {
	Key: string; // 配置字段（红色表示重复）
	Value: string; // 配置值
}
//宝石秘矿
declare class Cfg_FB_ExploreGem {
	Id: number; // id
	Level: number; // 难度
	Part: number; // 阶段
	Stage: number; // 关卡
	ExploreType: number; // 探险类型
	BossId: number; // 怪物编号
	RefreshId: number; // 刷新ID
	StagePrize: string; // 通关奖励
	StageFirstPrize: string; // 通关首通奖励
	Limit: number; // 挑战限制条件
	FX: number; // Boss朝向
	DailyPrize: string; // 每日邮件奖励
	MsgId: number; // 是否发送公告
}
//宝石秘矿
declare class Cfg_FB_ExploreGemStage {
	Id: number; // id
	Level: number; // 难度
	Part: number; // 阶段
	PartFirstPrize: string; // 阶段首通奖励
	ShowPartPrize: string; // 展示阶段首通奖励
}
//三国探险
declare class Cfg_FB_Explore {
	ExploreType: number; // 探险类型
	ExploreName: string; // 探险名称
	IsReset: number; // 是否重置难度
	DailyMail: number; // 每日奖励邮件id
	FightScene: number; // 战斗场景类型
	FuncId: number; // 功能id
}
//组队副本表
declare class Cfg_TeamBoss {
	Id: number; // 副本类型
	Name: string; // 副本名称
	ResId: number; // 入口图标
	FunctionLimit: number; // 功能开启
	ReflexNO: number; // 每天恢复次数
	BuyCost: string; // 购买次数消耗
	NOLimit: number; // 次数上限
	HelpNO: number; // 助战次数
	HelpReward: string; // 助战奖励
}
//怪物表
declare class Cfg_TeamBoss_Monster {
	InstanceType: number; // Id
	Level: number; // 关数
	RefreshId: number; // 刷新ID
	Prize: string; // 奖励
	Drop: string; // 掉落表ID
	ShowReward: string; // 奖励展示
}
//组队等级副本表
declare class Cfg_TeamBoss_Level {
	Id: number; // 副本id
	FBId: number; // 副本类型
	LevelLimit: number; // 主角等级限制
	ShowReward: string; // 奖励展示
	SweepLimit: number; // 扫荡限制条件
	Jump: string; // 跳关
	END: number; // 最高波数
}
//充值商城
declare class Cfg_ChargeMall {
	GoodsId: number; // 商品id
	MallType: number; // 商城类型
	GoodsTitle: string; // 商品名称
	ItemString: string; // 道具配置
	Sort: number; // 排序
	PicId: number; // 图片编号
	Money: number; // 消耗需求(分)
	Diamond: number; // 消耗金钻
	BuyTimes: number; // 购买次数
	GoodsType: number; // 商品类型
	DoubleForever: number; // 永久双倍
	IsReabte: number; // 是否返利
	IsSingle: number; // 是否触发单笔
	Pf: number; // 
	IsH5: number; // 是否h5可以购买
	CanReturn: number; // 是否算入充值返利转盘档位
	FuncId: number; // 执行功能id
	GoodsTag: string; // 标识
	AddFightValue: number; // 增加的战力(显示使用)
	AdminType: number; // 后台归类类型
	WechatType: number; // 公众号充值页签类型
	WechatOrder: number; // 公众号充值显示排序
	WechatDesc: string; // 公众号充值商品描述
}
//充值商城Admin
declare class Cfg_ChargeMallAdmin {
	AdminType: number; // 1
	AdminName: string; // 特权卡
}
//兑换表
declare class Cfg_DH {
	Id: number; // Id（不可修改）
	Desc: string; // 备注（程序不用）
	TargetId: number; // 目标道具ID
	TargetNum: number; // 目标道具数量
	CurrentId: number; // 兑换道具ID
	CurrentNum: number; // 兑换道具数量
}
//地图刷新组表
declare class Cfg_MapRefreshGroup {
	RefreshGroup: number; // 刷新组
	Desc: string; // 描述
	MapId: number; // 地图编号
	RefreshGroupMax: number; // 刷新组最大数量
	ReliveTime: number; // 复活时间（秒）
	IsKillAll: number; // 死亡是否全部删除
	Self: number; // 是否是个人刷新
	TaskId: string; // 当玩家有某个类型任务ID时才刷怪
}
//地图刷新表
declare class Cfg_MapRefresh {
	Id: number; // 刷新id
	GroupId: number; // 刷新组
	Desc: string; // 描述
	MapX: number; // X
	MapY: number; // Y
	MonsterId: string; // 怪物编号
	FightId: number; // 战斗编号
	TalkId: string; // 喊话编号
	TalkInterval: number; // 喊话间隔时间（秒）
	Fx: number; // 方向（1-8）
}
//NPC说话
declare class Cfg_NpcTalk {
	Id: number; // 喊话ID
	Word: string; // 战斗喊话
}
//关卡表
declare class Cfg_Stage {
	MapId: number; // 地图编号
	MapName: string; // 场景名
	MaxStageNum: number; // 当前地图累计关卡数
	StartChapter: number; // 当前地图起始章节+（（当前关卡-上一地图关卡最大值-1）/每章最小关数，向下取整）起始章节
	MaxSection: number; // （当前关卡-上一地图关卡最大值-1）/每章最小关数，求余)+1每章小关数
	BossGroup: string; // BossIds
	MonsterGroup: string; // 小怪
	MonsterLevel: number; // 怪物等级
	AttrId_Boss: number; // boss(属性ID)
	Level_3: number; // 成长系数
	LastCondition: number; // 打场景最后一关关卡所需满足条件限制条件id
}
//地图章节名表
declare class Cfg_StageName {
	Chapter: number; // 章（城池ID）
	MapId: string; // 地图id
	MapSort: number; // 地图切换顺序
	Name: string; // 城池名称
	CityPos: string; // 城池坐标
	Position: string; // 界面UI坐标
	LockPos: string; // 镜头锁定中心点坐标
	Road: string; // 寻路路径
	MonPos: string; // 怪物坐标
	StartRunPos: string; // 怪物跑出起始坐标
	AreaId: number; // 所属区域id
}
//关卡抽奖奖品
declare class Cfg_StageDrawPrize {
	Id: number; // 奖励编号，不可重复
	Group: number; // 抽奖组，前一组抽完后切换至下一组
	Prize: string; // 奖品
}
//地图巡逻点
declare class Cfg_Map_Patrol {
	ID: number; // 编号
	MapID: number; // 地图ID
	X1: number; // 开始点X
	Y1: number; // 开始点Y
	X2: number; // 结束点X
	Y2: number; // 结束点Y
}
//地图BGM
declare class Cfg_MapBgm {
	Id: number; // id
	Name: string; // 名字
	Vol: string; // 音量
	Des: string; // 备注（程序不用）
}
//地图表
declare class Cfg_Map {
	MapId: number; // 地图编号
	Name: string; // 地图名称
	NeedLevel: number; // 进入等级
	NeedStageId: number; // 完成关卡数量（累计小关数量）
	MapType: number; // 地图类型
	InstanceType: number; // 副本类型
	IsCross: number; // 是否是跨服地图
	InstanceTime: number; // 没有人:删除时间0不限制（秒）
	RelivePoint: string; // 复活坐标
	FX: number; // 出生朝向
	ResId: number; // 地图资源编号
	HideFollower: number; // 是否屏蔽跟随伙伴
	IsRespawnXY: number; // 死后是否在当前地图复活坐标复活前端用
	BattleType: number; // 在该地图中点目标是否有弹出确认框0-代表 点啥都无反应1-代表 点PVE怪弹确认框2-代表 点PVP玩家弹确认框3- 点PVE怪 进战斗不弹框4-点PVP玩家 进战斗不弹框5- 1、2组合6-1、4组合7-2、3组合8-3、4组合
	WalkType: number; // 是否寻路至目标再进入战斗1-是0-否
	AttackType: number; // 玩家是否能相互攻击0-否1-可
	MaxNum: number; // 同场景人数0：不限制
	DeathReviveTime: string; // 战斗失败后复活时间0:不死亡（秒）
	ReliveMap: number; // 复活地图
	ReliveCoin3: number; // 复活需要元宝
	ReliveItem: string; // 复活需要道具:数量
	ReliveInvincible: number; // 复活后的无敌时间秒
	HpType: number; // 记录血类型
	TreatCoin3: number; // 治疗需要仙玉
	TreatItem: string; // 治疗需要道具:数量
	FightType_PVE: number; // 战斗类型
	FightType_PVP: number; // 战斗类型
	MapTrace: string; // 寻路点
	NeedRobot: number; // 是否需要机器人填充场景0或不填  不要>0 场景人数不足N时加机器人
	RobotType: number; // 机器人类型
	MaxPlayerNum: number; // 同屏最大玩家数限制
	MonsterHP: string; // 怪物血量区间
	LostHP: string; // 怪物失血区间
	MonsterNum: number; // 刷怪数量
	JumpNFrame: number; // 跳转场景需要弹框确认
	BattleBg: number; // 战斗背景ID
	BgMusic: string; // 背景音乐
}
//地图区域表
declare class Cfg_StageArea {
	AreaId: number; // 地图区域
	AreaPos: string; // 区域坐标
}
//指定关卡怪物属性
declare class Cfg_StageAttr {
	Stage: number; // 指定章节
	MonsterLevel: number; // 怪物等级
	AttrId_Common: number; // 普通怪物(属性ID)
	AttrId_Elites: number; // 精英(属性ID)
	AttrId_Boss: number; // boss(属性ID)
}
//地图明怪表
declare class Cfg_Map_Monster {
	Id: number; // 编号
	MapId: number; // 地图编号
	Point: string; // 怪物坐标
	RefreshId: number; // 刷新编号
	ReliveTime: number; // BOSS复活时间(秒)
	Direction: number; // 怪物朝向
	Scale: number; // 怪物放大比例（万分比形式）
}
//定时活动表
declare class Cfg_Active {
	ActId: number; // 活动编号
	ActName: string; // 活动名称
	FuncId: number; // 功能id
	ReadyMin: number; // 准备时间（分钟）
	ReadyNoticeId: number; // 活动准备开启公告Id公告不能带参数
	StartNoticeId: number; // 活动开始公告Id公告不能带参数
	NoticeId: number; // 进行中轮播公告Id公告不能带参数
	Interval: number; // 公告间隔(s)
	EndNoticeId: number; // 活动结束公告Id公告不能带参数
	Week: string; // 星期几
	ActTime: string; // 活动时间
	StartDay: number; // 开服第几天开启活动
	MergeDay: number; // 合服后第几天开启活动
	EndDay: number; // 开服第几天截至（0：表示无穷大）
	Cross: number; // 是否跨服
	Priority: number; // 活动日历推送优先级
}
//奖励掉落
declare class Cfg_DropReward {
	Id: number; // 序号Id
	CheckRepeat: string; // 检查id是否重复
	GroupId: number; // 组Id（只能用十亿以内，10亿以上给活动）
	Desc: string; // 注释列（程序不用）
	RefType: number; // 世界等级（未实现）-刷新类型
	MinRoleLevel: number; // 角色自身等级
	MaxRoleLevel: number; // 角色自身等级
	MinLevel: number; // 世界等级（未实现）
	MaxLevel: number; // 世界等级（未实现）
	MinDay: number; // 开服天数
	MaxDay: number; // 开服天数
	ShowItems: string; // 奖励（前端显示）
}
//掉落表
declare class Cfg_Drop {
	Id: number; // 掉落ID
	Name: string; // 名称
	DropType: number; // 掉落类型
	DropDataType: number; // 掉落数据类型
	DropItemId: number; // 掉落编号
	ItemName: string; // 道具名称
	RandNum: number; // 随机次数
	DropMinNum: number; // 最小掉落数量
	DropMaxNum: number; // 最大掉落数量
	ItemRuler: number; // 绑定类型
	Odd: number; // 几率（万分比）
	Param: number; // 通用掉落掉落等级
}
//道具类型对照表
declare class Cfg_Item_Type {
	Id: number; // 道具类型描述编号
	Desc: string; // 道具类型描述
}
//使用功能表
declare class Cfg_UseFunc {
	UseId: number; // 使用ID
	Type: number; // 使用类型
	Param1: number; // 参数1
	Param2: number; // 参数2
	Param3: number; // 参数3
	Param4: number; // 参数4
	Param5: number; // 参数5
	Param6: string; // 参数6
}
//新功能开放表
declare class Cfg_Client_Func {
	FuncId: number; // 功能id
	Desc: string; // 功能名称
	Parent: number; // 父级关系
	UI: number; // 功能或UI
	Tab: number; // 标签
	Param1: number; // 参数1
	Param2: number; // 参数2
	Param3: number; // 参数3
	Param4: number; // 参数4
	ShowLv: number; // 显示等级
	ShowStage: number; // 显示通关关卡数
	ArmyLevel: number; // 军衔阶级
	ArmyStar: number; // 军衔等级
	OfficialLv: number; // 官职等级
	LimitLv: number; // 开启等级
	Realm: number; // 境界
	LimitDay: number; // 开服天数
	LimitUnionDay: number; // 合服后，开服天数是否以连服首区天数为准0或不填否   1是
	MergeDay: number; // 合服天数
	ShowVIP: number; // 显示VIP等级
	LimitVIP: number; // VIP等级
	FeiSheng: number; // 飞升Id达到
	LimitStage: number; // 需要通关关卡数
	MontyCard: number; // 是否需要月卡
	LifeCard: number; // 是否需要终身卡
	LimitMoney: number; // 个人充值总额度（元）
	LimitTask: number; // 需要完成的主线任务ID
	ServerParam: string; // 后端参数
	FuncShowDes: string; // 功能开启弹窗飘图标目标位置特效显示条件
	Pos1: number; // 功能开启预告飘特效指向位置
	Pos: number; // 功能开启主城功能按钮位置
	ShowDes: number; // 功能开启光圈指引显示条件
	Sort: number; // ”更多“里面的入口排序
	TabId: number; // 页签图片
}
//技功能预告
declare class Cfg_FuncPreview {
	FuncId: number; // 功能id
	MSG: string; // 开启条件优先级显示
	IFShow: number; // 是否主界面预告
	Reward: string; // 功能奖励
}
//页签图片表
declare class Cfg_TabPicture {
	Id: number; // 页签ID
	PictureName: string; // 图片名称
	TitlePicName: string; // 标题名称
}
//怪物表
declare class Cfg_Monster {
	MonsterId: number; // 怪物id
	Desc: string; // 注释列（程序不用）
	Name: string; // 怪物中文名称
	ShowName: number; // 地图展示名字
	UnitType: number; // 单位类型
	MonsterType: number; // 怪物类型
	PosType: number; // 怪物位置
	AnimId: number; // 美术资源id
	Hight: number; // 怪物身高
	Quality: number; // 怪物品质
	SkillId: string; // 怪物技能id
	NpcFunc: number; // npc点击功能id
	CollectTimes: number; // 采集时间（毫秒）
	MustRide: number; // 是否有无坐骑为一个形像
	Scale: number; // 地图、副本场景怪物放大
	Collect: string; // 采集动画
	ResType: string; // 资源类型
}
//合成
declare class Cfg_Stick {
	Id: number; // ID
	ItemId: number; // 合成道具ID
	FirstType: number; // 一级标签ID
	SecondType: number; // 二级标签ID
	ThirdType: number; // 三级标签ID
	NeedItem: string; // 所需道具ID及数量
	FuncId: number; // 功能开放ID
}
//标签名
declare class Cfg_StickType {
	Type: number; // 标签页类型
	Name: string; // 标签名称
	FirstType: number; // 上一级标签
}
//合成
declare class Cfg_BagStick {
	ItemId: number; // 合成的道具ID
	NeedItem: string; // 所需道具ID及数量
	OpenItemId: number; // 触发合成的道具Id
}
//物品来源
declare class Cfg_ItemSource {
	Id: number; // 来源ID
	Desc: string; // 描述
	PF: string; // 平台替换
	Desc2: string; // 无法跳转时弹出的文字消息
	FuncId: number; // 功能ID
	FuncParam: number; // 跳转参数
	RMB: number; // 此活动涉及人民币充值，特殊情况需屏蔽填1
	Icon: string; // 来源Icon
	Recommend: string; // 是否强烈推荐
}
//技能描述表
declare class Cfg_SkillDesc {
	Index: string; // 唯一流水号
	SkillId: number; // 技能ID
	SkillMinLevel: number; // 最小等级（等级段对应的描述）
	SkillMaxLevel: number; // 最大等级（等级段对应的描述）
	Comment: string; // 注释列（程序不用）
	Quality: number; // 技能品质
	Flash_Quality: number; // 品质边框特效
	SkillTag: number; // 技能标签
	SkillIconID: number; // 技能iconID
	SkillName: string; // 技能名字ID（调用语言表）
	Effect_Type: number; // （要与总表一致）1主动技能2被动技能
	SkillDesc: string; // 技能描述ID（调用语言表）
	DescType: number; // 描述显示类型0 或 空 =读取SkillDesc描述字段1 = 读取程序并接描述
	Param1: string; // 参数1当显示类型为1时，开始等级：结束等级：初始值：递增值：属性ID：加减类型（1是+2是-）：百分号（0是空1是%）
	Param2: string; // 参数2格式与参数1相同
	Param3: string; // 参数3格式与参数1相同
	Param4: string; // 参数4格式与参数1相同
	Param5: string; // 参数5格式与参数1相同
}
//技能表
declare class Cfg_Skill {
	SkillId: number; // 技能ID
	SkillTag: number; // 技能标签
	SkillIconID: number; // 技能iconID
	Effect_Type: number; // 效果1主动技能2被动技能
	AtkType: number; // 攻击类型(默认是近战)
	ClientSkillName: number; // 技能名称战斗中是否显示
	TargetNum: string; // 攻击目标数量
	AddAttackNum: string; // 连击次数（万分比）
	TargetRepeat: number; // 是否允许重复目标
	GiveAll: number; // 当此技能在人物身上时是否对附属角色都生效
	LockTargetMode: number; // 主动技能选择目标模式
	SkillLevelMax: number; // 主/被动技的最高等级
	ActionId: number; // 技能行为id
}
//技能特效表
declare class Cfg_SkillEffect {
	EffId: number; // 特效名
	Scale: number; // 缩放
	Dir: number; // 是否有反方向文件
	Transform: number; // 技能爆点特效是否根据角色朝向进行翻转
	IsCocosAnim: number; // 是否Cocos动画
	AnimName: string; // 特效动画名（没有默认不填）
}
//攻击效果表
declare class Cfg_AtkEffect {
	EffId: number; // 攻击效果ID
	ResultType: number; // 结算类型
	ResultAttr: number; // 结算属性id（ID是写死）
	PercentSign: number; // 是否显示百分比
	NotHit: number; // 不需要播报受击动作
	NotHitEff: number; // 不需要播报受击特效
}
//技能buff
declare class Cfg_Buff {
	BuffId: number; // buffid
	BuffGroup: number; // buff组
	FightType: number; // 用于判断PVP或者PVE生效
	FbType: string; // 不生效的战斗场景（不填默认所有场景起效）
	AddCondition: string; // buff添加条件
	Round: number; // 持续回合（-1）永久
	ActionTrigger: string; // 触发时机（超链看说明）
	ActionParam: string; // 触发参数
	RemoveTrigger: string; // 移除时机（超链看说明）
	RemoveParam: string; // 移除参数
	BuffCondition: string; // Buff生效条件（超链看说明）
	BuffEffect: number; // Buff效果类型（超链看说明）
	BuffEffectValue: string; // Buff效果值
	IsClient: number; // 是否通知客户端(暂无用）
	BuffClient: string; // BUFf的前端表现（超链去前端状态表）
}
//Buff常量表
declare class Cfg_BuffNormal {
}
//飘字特效表
declare class Cfg_WordEffect {
	Index: number; // 序号（此表写死不与其他表关联）
	EffId: number; // 攻击效果表ID
	CType: number; // 子类型
	VType: number; // 专属类型
	BeginX: number; // X坐标
	BeginY: number; // Y坐标
	PrefabName: string; // 动画预制文件名
	Font: string; // 字体资源名(数字)
	FormatTxt: number; // 格式化文本类型（拆字组合）
	FontImg1: string; // 字体图片资源名（飘字动画中FontImg1）
	FontImg2: string; // 字体图片资源名（飘字动画中FontImg2）
	FontImg3: string; // 字体图片资源名（飘字动画中FontImg3）
}
//技能行为表
declare class Cfg_SkillActions {
	ID: number; // 技能行为id
	AtkType: number; // 攻击类型
	IsDouble: number; // 是否连续攻击
	AtkAction: string; // 攻击动作
	StartEffId: string; // 起手特效
	StartWordEffId: number; // 起手飘字特效
	KnifeLight: string; // 刀光特效
	AttackPoint: number; // 攻击前摇时间
	EffType: number; // 特效类型
	BlastEffMulti: number; // 是否创建多个爆点
	BlastEffId: string; // 爆点特效
	FlyEffId: number; // 飞行特效
	TargerPos: number; // 目标挂载点
	HitEffId: number; // 受击特效
	IsShake: number; // 震屏
	skillTime: number; // 技能持续时间
	FlyTime: number; // 飞行时间
	HitTime: string; // 受击时间（毫秒）
	SkillSound: string; // 音效
}
//技能数据表
declare class Cfg_SkillData {
	Id: string; // ID技能ID*1000+等级
	SkillId: number; // 技能编号
	SkillLevel: number; // 技能等级
	SkillQuality: number; // 技能品质
	AtkBuff: string; // 主动技能攻击时添加BUFF生效时机取决于配置（格式看链接）
	SkillBuff: string; // 被动技能BUFF初始化时添加BUFF生效时机取决于配置（超链去BUFF表）
	Param1: string; // 百分比伤害参数1
	Param2: string; // 固定伤害参数2
}
//buff前端状态表
declare class Cfg_BuffClint {
	EffId: number; // 攻击效果表ID
	TargerPos: number; // 目标挂载点
	IsShowIcon: number; // 是否血条上显示图标
	BuffIcon: number; // BUFFi小图标ID
	BuffType: number; // 表现类型
	Level: number; // 相同类型显示优先级
	PosY: number; // 坐标
	EffectId: string; // 特效名
	WordEffId: number; // 飘字特效ID
	EffLoop: number; // 特效是否循环播放
	EffAgain: number; // BUFF是否只添加不移除
}
//加成技能总表
declare class Cfg_IncreaseSkill {
	SkillId: number; // 技能id
	SkillType: number; // 技能类型
	SkillLevel: number; // 技能等级
	Jump: number; // 界面跳转
	SkillIconID: number; // 技能图标
	SkillName: string; // 技能名称语言包
	SkillDesc: string; // 技能描述语言包
	SkillEffect: string; // 效果加成类型
	Time: number; // 持续时间
	ShowBuff: number; // 是否在buff列表显示
}
//类型定义
declare class Cfg_IncreaseType {
	Id: number; // 加成类型
}
//主角模型表
declare class Cfg_Mod {
	ID: number; // 模型ID
	ModNodeDev: string; // 挂载点偏移量
}
//品质名称表
declare class Cfg_QualitytName {
	QualityId: number; // 品质id
	Name: string; // 品质名称
}
//配置表
declare class Cfg_Config {
	CfgKey: string; // key
	CfgValue: string; // 值
	STRING: string; // 描述
}
//刷新次数表
declare class Cfg_CycleTimes {
	LimitId: number; // 限制ID
	Cyc: number; // 刷新周期
	MaxTimes: number; // 免费次数
}
//刷新表
declare class Cfg_Refresh {
	RefreshId: number; // 刷新id
	MonsterIds: string; // 怪物组
	FormationId: string; // 阵型编号
	MonsterLevel: number; // 怪物等级
	AttrId_Common: number; // 普通怪物属性
	AttrId_Elites: number; // 精英怪物属性
	AttrId_Boss: number; // BOSS怪物属性
	AtkedHpMax: number; // 普通怪是否根据受击次数判定死亡
	Skill_Common: string; // 普通怪物携带技能
	Skill_Elites: string; // 精英怪物携带技能
	Skill_Boss: string; // BOSS怪物携带技能
	ShieldMath: number; // 护盾参数（万分比）
	Cd: number; // 秒
	HelpPos: number; // 助战位置
	HelpUnit: number; // 助战单位
}
//阵型
declare class Cfg_Formation {
	FormationId: number; // 刷新编号
	Name: string; // 关卡boss
	Pos_16: number; // 位置1
	Pos_17: number; // 位置2
	Pos_18: number; // 位置3
	Pos_19: number; // 位置4
	Pos_20: number; // 位置5
	Pos_21: number; // 位置6
	Pos_22: number; // 位置7
	Pos_23: number; // 位置8
	Pos_24: number; // 位置9
	Pos_25: number; // 位置10
}
//属性表
declare class Cfg_Attr_Monster {
	Id: number; // 属性编号
	Level: number; // 等级
	FightValue: string; // 战力
	Attr_1: string; // 生命
	Attr_2: string; // 攻击
	Attr_3: string; // 防御
	Attr_4: string; // 命中(万分比)
	Attr_5: string; // 闪避(万分比)
	Attr_6: string; // 暴击(万分比)
	Attr_7: string; // 抗暴(万分比)
	Attr_8: string; // 攻速
	Attr_9: string; // 无视防御
	Attr_10: string; // 减免无视
	Attr_11: string; // 伤害加深
	Attr_12: string; // 伤害减少
	Attr_13: string; // 伤害增加%
	Attr_14: string; // 伤害减少%
	Attr_15: string; // 暴击伤害增加
	Attr_16: string; // 暴击伤害减少
	Attr_17: string; // 重创概率增加
	Attr_18: string; // 重创概率减少
	Attr_19: string; // PVP伤害增加(万分比)
	Attr_20: string; // PVP伤害减少(万分比)
	Attr_21: string; // PVE伤害增加(万分比)
	Attr_22: string; // PVE伤害减少(万分比)
	Attr_23: string; // 额外伤害
	Attr_24: string; // 仙击概率增加
	Attr_25: string; // 仙击概率减少
	Attr_26: string; // 金攻击
	Attr_27: string; // 金防御
	Attr_28: string; // 木攻击
	Attr_29: string; // 木防御
	Attr_30: string; // 水攻击
	Attr_31: string; // 水防御
	Attr_32: string; // 火攻击
	Attr_33: string; // 火防御
	Attr_34: string; // 土攻击
	Attr_35: string; // 土防御
	Attr_36: string; // 全系攻击
	Attr_37: string; // 全系防御
}
//属性关联
declare class Cfg_Attr_Relation {
	Attr: number; // 属性编号
	FightValue: number; // 战力评分
	ItemAttr: number; // 基础属性
	Fun_Name1: string; // 基础属性名
	AttrType: number; // 属性类型：1. 基础属性；2. 高级属性3. 特殊属性
	Sort: number; // 排序
	IsShow: number; // 是否显示 : 0或空表示显示 1表示不显示
	ItemPrecentAttr: number; // 属性百分比类型
	PercentType: number; // 前端显示为百分比或者具体值
}
//战斗系数表
declare class Cfg_Attr_Coefficient {
	AttrKey: string; // key
	CfgValue: string; // 值
}
//属性表
declare class Cfg_Attribute {
	Id: number; // 属性编号
	FightValue: string; // 战力
	Attr_2: string; // 攻击
	Attr_3: string; // 防御
	Attr_1: string; // 生命
	Attr_4: string; // 命中(万分比)
	Attr_5: string; // 闪避(万分比)
	Attr_6: string; // 暴击(万分比)
	Attr_7: string; // 抗暴(万分比)
	Attr_8: string; // 攻速
	Attr_9: string; // 无视防御
	Attr_10: string; // 减免无视
	Attr_11: string; // 伤害加深
	Attr_12: string; // 伤害减少
	Attr_13: string; // 伤害增加%
	Attr_14: string; // 伤害减少%
	Attr_15: string; // 暴击伤害增加
	Attr_16: string; // 暴击伤害减少
	Attr_17: string; // 重创概率增加
	Attr_18: string; // 重创概率减少
	Attr_19: string; // PVP伤害增加(万分比)
	Attr_20: string; // PVP伤害减少(万分比)
	Attr_21: string; // PVE伤害增加(万分比)
	Attr_22: string; // PVE伤害减少(万分比)
	Attr_23: string; // 额外伤害（没用）
	Attr_24: string; // 仙击概率增加
	Attr_25: string; // 仙击概率减少
	Attr_26: string; // 金攻击
	Attr_27: string; // 金防御
	Attr_28: string; // 木攻击
	Attr_29: string; // 木防御
	Attr_30: string; // 水攻击
	Attr_31: string; // 水防御
	Attr_32: string; // 火攻击
	Attr_33: string; // 火防御
	Attr_34: string; // 土攻击
	Attr_35: string; // 土防御
	Attr_36: string; // 金伤害加深
	Attr_37: string; // 金伤害减免
	Attr_38: string; // 木伤害加深
	Attr_39: string; // 木伤害减免
	Attr_40: string; // 水伤害加深
	Attr_41: string; // 水伤害减免
	Attr_42: string; // 火伤害加深
	Attr_43: string; // 火伤害减免
	Attr_44: string; // 土伤害加深
	Attr_45: string; // 土伤害减免
	Attr_46: string; // 全系攻击
	Attr_47: string; // 全系防御
	Attr_48: string; // 全系伤害加深
	Attr_49: string; // 全系伤害减免
	Attr_101: string; // 真实命中
	Attr_102: string; // 真实暴击
	Attr_103: string; // 神击概率增加
	Attr_104: string; // 神击概率减少（神抗）
	Attr_1001: string; // 生命百分比
	Attr_1002: string; // 攻击百分比
	Attr_1003: string; // 防御百分比
	Attr_1004: string; // 命中(万分比)百分比
	Attr_1005: string; // 闪避(万分比)百分比
	Attr_1006: string; // 暴击(万分比)百分比
	Attr_1007: string; // 抗暴(万分比)百分比
	Attr_1008: string; // 速度百分比
	Attr_1009: string; // 无视防御百分比
	Attr_1010: string; // 减免无视百分比
	Attr_1011: string; // 伤害加深百分比
	Attr_1012: string; // 伤害减少百分比
	Attr_1013: string; // 伤害增加%百分比
	Attr_1014: string; // 伤害减少%百分比
	Attr_1015: string; // 暴击伤害增加百分比
	Attr_1016: string; // 暴击伤害减少百分比
	Attr_1017: string; // 魂概率增加百分比
	Attr_1018: string; // 魂概率减少百分比
	Attr_1019: string; // PVP伤害增加(万分比)百分比
	Attr_1020: string; // PVP伤害减少(万分比)百分比
	Attr_1021: string; // PVE伤害增加(万分比)百分比
	Attr_1022: string; // PVE伤害减少(万分比)百分比
	Attr_1023: string; // 额外伤害百分比
	Attr_1024: string; // 仙击概率增加百分比
	Attr_1025: string; // 仙击概率减少百分比
	Attr_1026: string; // 金攻击百分比
	Attr_1027: string; // 金防御百分比
	Attr_1028: string; // 木攻击百分比
	Attr_1029: string; // 木防御百分比
	Attr_1030: string; // 水攻击百分比
	Attr_1031: string; // 水防御百分比
	Attr_1032: string; // 火攻击百分比
	Attr_1033: string; // 火防御百分比
	Attr_1034: string; // 土攻击百分比
	Attr_1035: string; // 土防御百分比
	Attr_1036: string; // 全系攻击百分比
	Attr_1037: string; // 全系防御百分比
	Attr_1038: string; // 金伤害加深百分比
	Attr_1039: string; // 金伤害减免百分比
	Attr_1040: string; // 木伤害加深百分比
	Attr_1041: string; // 木伤害减免百分比
	Attr_1042: string; // 水伤害加深百分比
	Attr_1043: string; // 水伤害减免百分比
	Attr_1044: string; // 火伤害加深百分比
	Attr_1045: string; // 火伤害减免百分比
	Attr_1046: string; // 土伤害加深百分比
	Attr_1047: string; // 土伤害减免百分比
	Attr_1048: string; // 全系伤害加深百分比
	Attr_1049: string; // 全系伤害减免百分比
	Attr_1103: string; // 神击概率增加百分比
	Attr_1104: string; // 神击概率减少百分比（神抗百分比）
	ExtraAttr: string; // 特殊属性
}
//提示
declare class Cfg_Tips {
	Id: number; // 编号
	Msg: string; // 内容
}
//提示消息表
declare class Cfg_ClientMsg {
	Id: number; // 说明ID
	Module: string; // 功能
	MSG: string; // 描述
	ActId: number; // 活动ID
	Img: string; // 插图
}
//提示消息表
declare class Cfg_Err {
	Id: number; // 编号
	Module: string; // 模块
	Name: string; // 程序名称
	MSG: string; // 提示内容
}
//系统公告表
declare class Cfg_Notice {
	Id: number; // 编号
	Module: string; // 模块
	Range: number; // 范围
	Range_Client: string; // 客户端频道
	Level: number; // 公告优先级
	Important: number; // 是否为重要公告0否1是
	IsDelay: number; // 是否延迟发送
	MSG: string; // 公告文本信息
	MSG1: string; // 公告超链
}
//限制条件表
declare class Cfg_LimitCondition {
	ConditionId: number; // 编号
	Sort: number; // 条件判断类型
	ConditionFunc: number; // 限制条件类型
	Relation: number; // 关系
	Param1: number; // 参数1
	Param2: number; // 参数2
}
//限制条件描述
declare class Cfg_LCDesc {
	Condition_func: number; // 序号
	Desc: string; // 限制条件描述
}
//提示消息表
declare class Cfg_Mail {
	Tpl_ID: number; // 模板ID
	Tpl_Type: number; // 邮件所属类型
	Tpl_Title: string; // 标题
	Tpl_Content: string; // 正文内容
	Tpl_ExpriyTime: number; // 有效期
}
//来源参数
declare class Cfg_ItemChangeType {
	ChangeType: number; // Id
	Desc: string; // 副本名称
}
//战斗站位坐标配置
declare class Cfg_FightPosition {
	id: number; // id
	Priority: number; // 阵容类型
	Desc: string; // 注释列
	Pos_x: number; // x坐标
	Pos_y: number; // y坐标
	isUp: number; // 是上方站位
}
//战斗场景
declare class Cfg_FightScene {
	Id: number; // id
	FBType: number; // 副本类型
	Name: string; // 名字
	InstanceType: string; // 地图副本类型
	KillFight: number; // 战斗屏蔽
	FightPos: number; // 阵容类型
	BossBig: number; // BOSS放大
	JingyingBig: number; // 精英放大
	XiaoguaiBig: number; // 小怪放大
	BattleBg: number; // 战斗背景ID
	Sound: string; // 战斗场景音效
	Jump: number; // 非特权卡允许跳过的回合
	MonthCardSkip: number; // 特权卡是否允许跳过此字段废弃代码中写死2回合
	NeedShield: number; // 有护盾条逻辑的场景
	NoWait: number; // 战斗结束不需要等待的战斗类型
	AutoJump: number; // 是否自动勾选自动跳过0或不填-默认不勾选自动跳过，玩家手动勾选后才能自动跳过。本次登录记录勾选状态1-默认勾选自动跳过。玩家可手动取消勾选。本次登录记录勾选状态
	AllJump: number; // 跳过全局
	FightUIType: number; // 战斗UI类型
	CheckFightCD: number; // 战斗间隔内置CD (单位：秒)填值生效如果连续两次战斗时间低于CD则不能发起战斗
	ShowFightCD: number; // 是否显示战斗间隔内置CD，默认不显示，1显示
	FightReportWin: string; // 战报显示格式胜利
	FightReportFail: string; // 战报显示格式失败
	FightReportTimeout: string; // 战斗结束显示格式
	FightReportSweep: string; // 战报显示格式扫荡
	RankAttr: number; // 排行榜属性
	NoDropHp: number; // 不掉血只飘字只针对boss（0否；1是）
	TalkId: number; // 喊话组ID
	OpeningAni: string; // 动画类型组
	BgMusic: string; // 背景音乐
	ReportType: number; // 战报类型
}
//战斗位置
declare class Cfg_FightPos {
	Id: number; // id
	Name: string; // 描述
	Pos: number; // 位置(1-10)
	RePos: number; // 对应的敌方位置
	UnitType: number; // 出战类型
	PlayerIdx: number; // 玩家（0-2）
	TeamPos: number; // 组队时出战自定义对应位置
}
//常量表
declare class Cfg_FightNormal {
	FightKey: string; // KEY
	FightValue: number; // 赋值
}
//官印虎符淬炼表
declare class Cfg_SAQuality {
	Id: number; // 序号
	Tpye: number; // 装备类型
	Star: number; // 品质
	Name: string; // 品质名称
	Stage: number; // 阶段
	Activation: number; // 孔位
	NeedItem: string; // 道具id：数量
	ProtectItem: string; // 道具id：数量
	SuccessProbability: number; // 成功概率（万分比）
	Attr: number; // 属性
	SkillId: string; // 战斗类技能ID
	SkillId2: number; // 状态类技能ID
	SkillDescribe: string; // 技能描述
	SkillLv: number; // 技能等级
	HangingRevenue: string; // 挂机收益万分比
	Picture: string; // 图片
	Limit: number; // 限制
}
//官印虎符技能条件表
declare class Cfg_SAPvpSkill {
	Id: number; // 由技能表调用的ID
	Difference: number; // 对战双方虎符阶段差值
	SecKillPro: number; // 秒杀触发概率(万分比）
}
//官职常量表
declare class Cfg_OfficialConstant {
	CfgKey: string; // KEY
	CfgValue: string; // 值
}
//官职表
declare class Cfg_Official {
	Id: number; // 序号
	OfficialLevel: number; // 官职阶级
	OfficialStar: number; // 官职等级
	Attr: number; // 属性
	Exp: number; // 升级官职经验
	Salary: string; // 每日俸禄
	Gift: string; // 官职贺礼
	GiftLimit: string; // 限时奖励
	DayLimit: number; // 限时时间（单位:天）
	Picture: number; // 图片
	NamePicture: number; // 图片
	Quality: number; // 官职品质
}
//官印虎符升级表
declare class Cfg_SAGrade {
	Id: number; // 序号
	Tpye: number; // 装备类型
	Level: number; // 等级
	Exp: number; // 经验
	NeedItem: string; // 消耗
	SingleExp: number; // 道具经验
	Attr: number; // 属性
	Limit: number; // 限制
}
//官印虎符升星表
declare class Cfg_SAStar {
	Id: number; // 序号
	Tpye: number; // 装备类型
	Star: number; // 星级
	Activation: number; // 孔位
	Exp: number; // 经验
	NeedItem: string; // 道具id：数量
	SingleExp: number; // 道具经验
	Attr: number; // 属性
	Limit: number; // 限制
}
//官职任务表
declare class Cfg_OfficialTask {
	Id: number; // 任务ID
	Type: number; // 任务类型序号
	CountType: number; // 任务计数类型
	SubType: number; // 子类型
	Param: string; // 参数
	Independent: number; // 是否独立计数
	TargetCount: number; // 任务完成条件
	TaskTag: number; // 任务标识
	Prize: string; // 完成任务奖励方案id数组
	FuncId: number; // 跳转页面
	SortIdx: number; // 不同类型任务的显示排序
	Point: string; // 图片路径
}
//关卡通行证等级
declare class Cfg_Stage_PassLevel {
	Key: number; // 唯一ID
	PassId: number; // 通行证id
	MaxStageNum: number; // 关卡
	Prize1: string; // 普通奖励
	Prize2: string; // 付费奖励
	ShowBigPrize: number; // 此级奖励是否为节点奖励
}
//关卡通行证ID
declare class Cfg_Stage_PassName {
	PassId: number; // 通行证Id
	Name: string; // 通行证名称
	GoodsId: number; // 商品Id
	MinStage: number; // 最小关卡
}
//挂机配置
declare class Cfg_Config_AFK {
	CfgKey: string; // key
	CfgValue: string; // 值
	STRING: string; // 描述
}
//喊话表
declare class Cfg_TalkWord {
	Id: number; // 唯一ID
	TalkId: number; // 喊话组ID
	Word: string; // 战斗喊话
	Word1: string; // 试炼首领喊话
	Word2: string; // 主线喊话
	WxGame: string; // 
	WxGame1: string; // 
}
//常驻招募表
declare class Cfg_Server_ActZhaoMu {
	Key: number; // 唯一id
	ArgsGroup: string; // 活动逻辑参数
	WareHouseId: number; // 仓库id
	OneTimeCost: string; // 招募1次消耗道具
	FiftyTimeCost: string; // 招募50次的折扣
	TenTimeCost: string; // 招募10次的折扣
	WishGroupOpen: number; // 是否开启心愿库
	WishGroupTimes: number; // 心愿库开启次数
	WishGroupParam: string; // 心愿单选取配置心愿类型1id:可选数量|心愿类型2id:可选数量
	DoubleDay: string; // 开服第X天到Y天双倍奖励
	Score: string; // 招募一次获得的积分
	FreeTime: number; // 每日免费次数
	BuyTimes: number; // 每日购买次数上限
	NoticeId: number; // 招募公告Id
	LogMax: number; // 招募日志上限
	ShowSpecialGroup: string; // 明保条件显示
	LogDesc: string; // 武将招募日志文本1
}
//招募常量表
declare class Cfg_Server_ZhaoMuConfig {
	ID: number; // 唯一ID
	ArgsGroup: string; // 活动逻辑参数
	CfgKey: string; // key
	CfgValue: string; // 值
	STRING: string; // 描述
}
//武将招募表
declare class Cfg_Server_GeneralZhaoMu {
	Id: number; // ID
	ArgsGroup: string; // 活动逻辑参数
	GroupType: number; // 库类型
	ItemId: number; // 道具Id
	ItemNum: number; // 道具数量
	Odd: number; // 抽中权重
	WishType: number; // 心愿类型
	WishOdd: number; // 心愿权重
	OddClient: string; // 显示概率
	Sort: number; // 概率tip排序
	Quality: number; // 奖品品质
	AddLog: number; // 是否加日志
	AddNotice: number; // 是否加公告
	ShowOrder: number; // 界面轮播展示顺序
}
//库概率表
declare class Cfg_ActGeneralZhaoMuRate {
	Key: number; // 唯一ID
	ArgsGroup: string; // 活动逻辑参数
	MinTimes: number; // 最小招募次数
	MaxTimes: number; // 最大招募次数
	FirstGroupRate: string; // 库随机概率
}
//暗保奖励表
declare class Cfg_ActZhaoMuHideReward {
	Key: number; // 唯一ID
	ArgsGroup: string; // 活动逻辑参数
	HideType: number; // 暗保类型
	Times: number; // 招募次数
	Reward: string; // 奖励id:数量
}
//
declare class Cfg_Server_ZhaoMuStageReward {
	Key: number; // 唯一ID
	ArgsGroup: string; // 活动逻辑参数
	Times: number; // 抽奖次数
	Reward: string; // 阶段奖励id:数量
}
//活动奖励表
declare class Cfg_Server_EventReward {
	Id: number; // 序号Id
	CheckRepeat: string; // 检查id是否重复
	GroupId: number; // 组Id（只能用十亿以内，10亿以上给活动）
	Desc: string; // 注释列（程序不用）
	RefType: number; // 世界等级-刷新类型
	MinRoleLevel: number; // 角色自身等级
	MaxRoleLevel: number; // 角色自身等级
	MinLevel: number; // 世界等级
	MaxLevel: number; // 世界等级
	MinDay: number; // 开服天数
	MaxDay: number; // 开服天数
	ShowItems: string; // 奖励（前端显示）
}
//活动表
declare class Cfg_Server_Activity {
	Id: string; // 唯一ID客户端不用
	FuncId: number; // 活动功能ID(不能超过9位）
	CycNo: number; // 期号（不能超过9位）
	ContainerId: number; // 所属活动容器活动ID如以开服活动为容器，其活动id为1，则本字段填1
	Desc: string; // 活动备注（策划用）
	Name: string; // 活动名称
	ActType: number; // 活动类型
	ArgsGroup: string; // 活动逻辑参数组
	Param1: string; // 通用参数
	UseArea: string; // 生效区id0为所有区
	StartDay: number; // 活动开启开服天数（一级条件）
	MergeDay: number; // 活动开启合服天数（一级条件）
	Date: string; // 固定开启日期（二级条件）
	PlayerCondition: string; // 活动参与个人条件(三级条件)
	Duration: string; // 活动持续时间
	CrossType: number; // 联区场景ID
	CleanDataAfterMerge: number; // 合服之后强制清除玩家数据0  否1  是
	IsMergeServerSettle: number; // 合服结算活动标记0：不需要结算1：需要结算
	CountDownNotice: string; // 发送倒计时公告
	CloseTag: number; // 是否关闭填1则此活动不生效
	RMB: number; // 此活动涉及人民币充值特殊情况需屏蔽填1
	Pos: number; // 活动图标显示位置2界面正上方第1排（上排活动区域）3界面左侧（直购礼包、商城礼包）
	PosIcon: number; // 主界面图标ID
	PosCircle: number; // 界面区域是否显示旋转光圈填特效id如不填则代表无光圈
	ContainerIcon: number; // 面板图标ID
	Tap1: number; // 一级页签编号
	Order: number; // 活动图标排序图标ID大小绝对排序，同ID以活动ID大小排序
	HideTimestamp: number; // 隐藏Icon下的时间戳  1:隐藏  0:默认显示
	BannerPath: string; // banner图路径
	WinPicName: number; // 页签图片名称
	ClientMsg: number; // 玩法说明id
}
//活动前端显示
declare class Cfg_StageRewardsUI {
	Id: string; // 活动分组（唯一key）
	ConditionType: number; // 条件类型
	Desc1: string; // title描述
	Desc2: string; // 要求条件描述
	Desc3: string; // 当前条件描述
}
//活动配置
declare class Cfg_Server_StageRewards {
	Id: number; // 唯一ID
	Group: string; // 分组
	ConditionType: number; // 条件类型
	Value: number; // 值
	RewardID: number; // 活动奖励掉落ID
	Uireward: string; // 活动奖励
	FuncId: number; // 功能跳转id
}
//每日签到
declare class Cfg_Server_DailySignConst {
	Id: number; // 唯一ID
	Group: string; // 分组
	CfgKey: string; // key
	CfgValue: string; // 值
	Desc: string; // 描述
}
//奖励表
declare class Cfg_Server_DailySignReward {
	Id: number; // 唯一ID
	Group: string; // 分组
	StartTurn: number; // 开始轮次
	EndTurn: number; // 结束轮次
	SignDay: number; // 签到天数
	Prize: string; // 奖励
}
//
declare class Cfg_Server_DailySignNumReward {
	Id: number; // 唯一ID
	Group: string; // 分组
	StartTurn: number; // 开始轮次
	EndTurn: number; // 结束轮次
	DayNum: number; // 累签天数
	Prize: string; // 奖励
}
//通行证配置
declare class Cfg_Server_GeneralPass {
	PassId: number; // 通行证Id
	ConditionType: number; // 活动类型
	Group: string; // 分组
	Value: string; // 通行证条件值
	Name: string; // 通行证名称
	GoodsId: number; // 付费商品Id
	Popup: number; // 是否展示弹窗
	RewardShow: number; // 是否展示奖励
	GoodName: string; // 付费道具名称
	Condition: string; // 条件要求
	Desc: string; // 商品描述
	DescPic: string; // 付费图片名称
	DescNum: string; // 参数
}
//奖励配置
declare class Cfg_Server_GeneralPassRd {
	Id: number; // 唯一ID
	PassId: number; // 通行证Id
	Group: string; // 分组
	ConditionType: number; // 活动类型
	Value: number; // 值
	Prize1: string; // 普通奖励
	Prize2: string; // 付费奖励
}
//全民福利活动
declare class Cfg_Server_Welfare {
	Id: number; // 唯一ID
	Group: string; // 分组
	ConditionType: number; // 活动类型
	Value: number; // 购买次数
	Prize: string; // 奖励
}
//常量配置
declare class Cfg_Server_CashCowNormal {
	Id: number; // 唯一ID
	Group: string; // 分组
	CfgKey: string; // key
	CfgValue: string; // 值
	STRING: string; // 描述
}
//摇钱树等级
declare class Cfg_Server_CashCow {
	Id: number; // 唯一id
	Group: string; // 分组
	Level: number; // 摇钱树等级
	Exp: number; // 升级经验
	Reward: string; // 摇树奖励
	Time: string; // 翻倍倍数
}
//资源配置
declare class Cfg_Server_CashCowEffect {
	Id: number; // 唯一id
	Group: string; // 分组
	Levelmin: number; // 摇钱树最小等级
	Levelmax: number; // 摇钱树最大等级
	EffectUI: number; // 图片资源
	Effect: number; // 特效资源
	EffectY: number; // 偏移量
}
//在线奖励
declare class Cfg_Server_OnlineRewards {
	Id: number; // 唯一ID
	Group: string; // 分组
	TimeRequest: number; // 区间时间要求
	RewardID: number; // 活动奖励掉落ID
}
//红颜升星表
declare class Cfg_BeautyStar {
	Id: number; // ID
	BeautyId: number; // 天仙ID
	Star: number; // 星级
	NeedItemCount: number; // 所需碎片数量
	Attr: number; // 对应星级属性ID
	SkillId: string; // 升星技能ID
	PassiveSkills: string; // 被动技能ID和等级列表
}
//红颜升级表
declare class Cfg_BeautyLevel {
	Id: number; // 编号
	Level: number; // 等级
	AttrId: number; // 属性ID
	AddExp: number; // 吃丹增加经验
	NeedTotalExp: number; // 升级需要经验
	NeedItem: number; // 需要道具
}
//红颜表
declare class Cfg_Beauty {
	PetAId: number; // 红颜id
	Name: string; // 红颜名称
	Type: number; // 类型
	Quality: number; // 品质
	Attr: number; // 基础属性ID
	UnlockItem: string; // 激活所需道具（精魄）ID
	UnlockItemTatter: string; // 碎片激活道具Id:数量
	StarUpItem: number; // 升星所需道具（碎片）ID
	RareB: number; // 是否绝版
	AnimId: number; // 美术资源id
	IsVisible: number; // 是否在列表中可见
	UpLev: number; // 合体等级限制
}
//常量表
declare class Cfg_EscortNormal {
	CfgKey: string; // KEY
	CfgValue: string; // 赋值
}
//运输船
declare class Cfg_Escort {
	Id: number; // id
	Quality: number; // 护送品质
	Name: string; // 语言表ID
	Img: number; // 人物图片
	Priority: number; // 刷新权重
}
//护送奖励
declare class Cfg_EscortReward {
	Id: number; // id
	Quality: number; // 品质id
	LevelMin: number; // 人物等级下限包含
	LevelMax: number; // 人物等级上限包含
	Reward: string; // 护送奖励
}
//军师专精表
declare class Cfg_AdviserMastery {
	Id: number; // 专精id
	Name: string; // 校场名称
	MaxLv: number; // 最大等级
	MasteryType: number; // 专精类型
	AttrId: number; // 属性ID
	AttrIdAdd: number; // 属性ID
}
//专精升级消耗表
declare class Cfg_AdviserMasteryCost {
	ID: number; // ID
	MasteryType: number; // 专精类型
	Level: number; // 等级
	Cost: string; // 消耗资源
	Limit: string; // 限制条件
	SkillId: number; // 技能效果
}
//军师升级表
declare class Cfg_AdviserLevel {
	Id: number; // 编号
	Level: number; // 等级
	AttrId: number; // 属性ID
	NeedTotalExp: number; // 升级需要经验(为升级总经验）
}
//军师配置
declare class Cfg_Adviser_Cfg {
	CfgKey: string; // key
	CfgValue: string; // 值
	STRING: string; // 描述
}
//军师本体表
declare class Cfg_AdviserBody {
	Id: number; // id
	Skin: number; // 皮肤
	Name: string; // 名称
	Quality: number; // 品质
	Skill: number; // 计谋
}
//军师神变
declare class Cfg_Adviser_Warrior {
	SkinId: number; // 神变皮肤ID
	Name: string; // 皮肤名称策划自己看
	CondStar: number; // 激活神变星级
	GCGrade: number; // 神变等阶
	GCLevel: number; // 神变等级
	LimitStar: number; // 可升星上限
	LimitNum: string; // 升星到此阶级需要X个任意战神达到Y阶Z级格式X:Y:Z
	AttrId: number; // 增加属性
	ShowSkillId: string; // 技能提升前端展示
	SkillId: string; // 技能提升实际生效
	CostItem: string; // 道具消耗
	CostSkin: number; // 自选皮肤消耗
	ShowSkilDesc: string; // 神变技能描述
	SkillLv: string; // 神通技升级条件
	PassiveSkillId: string; // 升仙被动技能
	Fattr: number; // 激活助战羁绊
}
//军师神变皮肤配置
declare class Cfg_Adviser_Skin {
	SkinId: number; // 皮肤id
	Item: number; // 道具id
	Quality: number; // 品质
	RedId: number; // 对应红点id
	Aid: number; // 神变1阶资源
}
//军衔任务表
declare class Cfg_ArmyTask {
	Id: number; // 任务id
	Type: number; // 任务类型
	CountType: number; // 任务计数类型
	SubType: number; // 子类型
	Param: string; // 参数
	Independent: number; // 是否独立计数1:独立计数
	TargetCount: number; // 任务完成条件
	Prize: string; // 任务奖励道具id:数量
	FuncId: number; // 功能跳转（功能id）
}
//军衔阶级
declare class Cfg_ArmyGrade {
	Key: number; // 唯一id
	ArmyLevel: number; // 军衔阶级
	ArmyStar: number; // 军衔等级
	Attr: number; // 此等级对应属性id
	SkillId: number; // 此等级解锁技能id
	NeedItem: string; // 升到下一级所需的道具id:数量
	Detail: string; // 达到此军衔等级将要开启的新系统描述
	LogoIcon: string; // 此阶级对应的军衔徽章资源
	TaskId: string; // 升到下一级需完成的任务id
}
//绝学技能
declare class Cfg_ArmySkill {
	Key: number; // 唯一id
	Desc: string; // 注释列（程序不用）
	SkillId: number; // 技能表ID
	Army: string; // 开启军衔阶级阶|级
}
//军衔名称
declare class Cfg_ArmyName {
	Key: number; // 唯一id
	ArmyName: string; // 军衔阶级名称
}
//剧情组表
declare class Cfg_NewPlot_Group {
	Id: number; // 剧情组ID
	PlotType: number; // 剧情类型
	PlotID: string; // 剧情ID
	Level: number; // 关卡
}
//剧情文本表
declare class Cfg_NewPlot {
	PlotID: number; // 剧情ID
	ResourceType: string; // 资源类型
	AnimId: number; // 模型资源ID
	Name: string; // 名称
	Position: number; // 位置
	Text: string; // 剧情文本
}
//竞技场结算奖励
declare class Cfg_ArenaRewards {
	RankId: number; // ID
	RankMin: number; // 排名区间下限
	RankMax: number; // 排名区间上限
	GroupId: number; // 掉落ID
}
//历史最高排名奖励
declare class Cfg_ArenaCoinRewards {
	RankId: number; // ID
	RankMin: number; // 历史最高排名区间下限
	RankMax: number; // 历史最高排名区间上限
	Rewards: string; // 区间每提升1名获得奖励
}
//竞技场常量表
declare class Cfg_Config_Arena {
	CfgKey: string; // KEY
	CfgValue: string; // 值
	CfgValue2: string; // 文本内容
	CfgDesc: string; // 描述
}
//竞技场机器人表
declare class Cfg_ArenaRobot {
	RobotId: number; // 机器人ID
	RankMin: number; // 排名区间下限
	RankMax: number; // 排名区间上限
	ValueMin: number; // 战斗力下限
	ValueMax: number; // 战斗力上限
	General: number; // 武将数量
	GeneralId: string; // 武将模型ID（随机抽模型）
	Beauty: number; // 红颜数量
	BeautyId: string; // 红颜模型ID（随机抽模型）
}
//竞技场购买次数收费
declare class Cfg_ArenaCoin {
	Id: number; // ID
	Coin: string; // 购买初始价格
}
//等级表
declare class Cfg_Level {
	Level: number; // 等级
	NeedExp: string; // 需要经验
}
//角色技能表
declare class Cfg_RoleSkill {
	SkillId: number; // 技能ID
	Desc: string; // 注释
	OpenLevel: number; // 开启等级
	AttrType: number; // 属性类型（查表获取）!Cfg_Attr_Relation!属性关联
	AttrBase: number; // 基础属性值
	AttrLevel: number; // 属性系数1
	AttrCoeff: number; // 属性系数2
	SkillUpBase: number; // 技能升级消耗基数
	SkillUpCoeff1: number; // 技能升级消耗系数1
	SkillUpCoeff2: number; // 技能升级消耗系数2
	RoleSkillUpItem: number; // 消耗道具
}
//角色武艺表
declare class Cfg_RoleMartial {
	Id: number; // 武艺Id
	Quality: number; // 品质
	Name: string; // 武艺名称
	MaxLv: number; // 最大等级
	CoinBase: number; // 解锁/升级所需金币基数
	CoinLevel: number; // 升级所需金币递增值
	AttrBase: string; // 激活属性
	ArmyLevel: number; // 解锁条件军衔等级
	ArmyStar: number; // 解锁条件军衔阶级
}
//武艺点位表
declare class Cfg_RoleMartialPoint {
	Id: number; // 武艺Id
	Point: number; // 点位
	AttrLevel: string; // 升阶属性
}
//角色武艺升级表
declare class Cfg_RoleMartialLevel {
	Id: number; // 角色武艺Id
	Min: number; // 此阶段初始等级
	Max: number; // 最高等级
	AttrGrowth: number; // 属性成长系数
	LevelLimit: string; // 前置武艺等级限制
}
//角色表
declare class Cfg_Job {
	RoleID: number; // 角色id
	RaceName: string; // 种族
	Sex: number; // 性别
	SexImg: string; // 性别图片
	RoleImg: string; // 角色图片
	RaceID: number; // 种族id
	HeadImg: string; // 头像
	RaceImg: string; // 种族图片
	Sort: number; // 排序
	IsDefault: number; // 默认
	AnimID: string; // 角色动画资源id
	WeaponID: number; // 默认武器资源id
	SkillsOrder: string; // 技能默认配置面板
	Skills: string; // 技能解锁面板
	OffsetSY: number; // 角色展示Y轴偏移
}
//角色初始化表
declare class Cfg_RoleInit {
	ID: number; // 编号
	Type: number; // 类别：1物品
	P1: number; // 参数1
	P2: number; // 参数2
	P3: number; // 参数3
	Bind: number; // 绑定类型
}
//进阶奖励表
declare class Cfg_GradePrize {
	Key: number; // 唯一id
	FuncId: number; // 功能ID
	Level: number; // 等级
	SkinId: number; // 展示的皮肤ID
	Prize: string; // 奖励
	PrizeCost: string; // 3倍奖励花费
}
//进阶注灵表
declare class Cfg_GradeZL {
	Level: number; // 注灵等级
	EXP: number; // 升级所需注灵值
	AttrId: number; // 升至此级时属性ID
	Ratio: number; // 注灵技能提升注灵总属性的参数基数（万分比）
	SkillId: number; // 注灵技能ID
}
//进阶淬炼表
declare class Cfg_GradeCL {
	Level: number; // 1
	Exp: number; // 20000
	AttrId: number; // 
}
//进阶皮肤表
declare class Cfg_GradeSkin {
	Key: number; // 唯一ID
	FuncId: number; // 所属功能ID
	Name: string; // 皮肤名称
	NeedItem: number; // 激活所需道具道具ID
	TapId: number; // 所属页签ID
	AttrId: number; // 属性ID
	IsAutoWear: number; // 是否自动穿戴0否    1是
	IsLevelUP: number; // 是否自动升级0否    1是
	LianshenUp: number; // 激活后增加炼神吞噬上限
	AttrSkillQuality: number; // 属性技能品质
	AttrSkill: string; // 属性技能名称:iconID（数组）
	ActiveSkill: string; // 主动技能
	PassiveSkill: string; // 被动技能
	GainSkill: string; // 增益技能
	AnimId: number; // 美术资源ID
	SkillPic: number; // 技能图片
	ShowLimitId: number; // 显示条件ID
	XY: string; // 场景资源偏移坐标
}
//进阶皮肤技能表
declare class Cfg_GradeSkinSkill {
	Key: number; // 唯一ID
	Quality: number; // Quality
	Part: number; // 技能栏位
	Level: number; // 技能等级
	AttrId: number; // 技能属性ID
	Limit: number; // 解锁的皮肤星级
}
//进阶皮肤升星表
declare class Cfg_GradeSkinStar {
	Key: number; // 唯一ID
	FuncId: number; // 功能ID
	MinLevel: number; // 最小等级
	MaxLevel: number; // 最大等级
	LevelUpItem: number; // 升级所需道具数量
	AttrRatio: number; // 属性加成（万分比）
	TotalRatio: number; // 等级段总万分比
}
//进阶道具表
declare class Cfg_GradeItem {
	Key: number; // 唯一ID
	FuncId: number; // 功能ID
	Desc: string; // 描述
	LSItem: number; // 炼神所需道具ID
	TLItem: number; // 通灵所需道具ID
	ZLItem: number; // 注灵所需道具ID
	ZLExp: number; // 单个注灵丹增加经验值
	ForgeItem: number; // 淬炼所需道具
	ForgeExp: number; // 单个淬炼道具增加经验值
}
//光武进阶表
declare class Cfg_Grade_Weapon {
	Key: number; // 唯一ID
	Name: string; // 名称
	NamePic: string; // 名称图片
	FuncId: number; // 功能id（关联功能表）
	Level: number; // 阶级
	Star: number; // 星级
	AttrId: number; // 处于此等级属性ID
	TotalExp: number; // 处于此等级经验进度条上限
	NeedItem: string; // 处于此等级单次升级需要道具ID:数量
	SingleExp: number; // 单次升级增加经验值
	SkinId: number; // 达到此等级激活皮肤id
	SkillPart: number; // 达到此等级解锁技能栏位
	TLLimit: number; // 通灵次数上限
}
//光武进阶表
declare class Cfg_GradeSkill_Weapon {
	Key: number; // 唯一ID
	SkillName: string; // 技能名称
	IconId: number; // 技能icon
	FuncId: number; // 功能ID
	Part: number; // 技能位置
	Level: number; // 技能等级
	AttrId: number; // 属性ID
	NeedItem: string; // 升级所需道具
}
//军师进阶表
declare class Cfg_Grade_Adviser {
	Key: number; // 唯一ID
	Name: string; // 名称
	NamePic: string; // 名称图片
	FuncId: number; // 功能id（关联功能表）
	Level: number; // 阶级
	Star: number; // 星级
	AttrId: number; // 处于此等级属性ID
	TotalExp: number; // 处于此等级经验进度条上限
	NeedItem: string; // 处于此等级单次升级需要道具ID:数量
	SingleExp: number; // 单次升级增加经验值
	SkinId: number; // 达到此等级激活皮肤id
	SkillPart: number; // 达到此等级解锁技能栏位
	TLLimit: number; // 通灵次数上限
}
//军师进阶技能表
declare class Cfg_GradeSkill_Adviser {
	Key: number; // 唯一ID
	SkillName: string; // 技能名称
	IconId: number; // 技能icon
	FuncId: number; // 功能ID
	Part: number; // 技能位置
	Level: number; // 技能等级
	AttrId: number; // 属性ID
	NeedItem: string; // 升级所需道具
}
//坐骑进阶表
declare class Cfg_Grade_Horse {
	Key: number; // 唯一ID
	Name: string; // 名称
	NamePic: string; // 名称图片
	FuncId: number; // 功能id（关联功能表）
	Level: number; // 阶级
	Star: number; // 星级
	AttrId: number; // 处于此等级属性ID
	TotalExp: number; // 处于此等级经验进度条上限
	NeedItem: string; // 处于此等级单次升级需要道具ID:数量
	SingleExp: number; // 单次升级增加经验值
	SkinId: number; // 达到此等级激活皮肤id
	SkillPart: number; // 达到此等级解锁技能栏位
	TLLimit: number; // 通灵次数上限
}
//坐骑进阶表
declare class Cfg_GradeSkill_Horse {
	Key: number; // 唯一ID
	SkillName: string; // 技能名称
	IconId: number; // 技能icon
	FuncId: number; // 功能ID
	Part: number; // 技能位置
	Level: number; // 技能等级
	AttrId: number; // 属性ID
	NeedItem: string; // 升级所需道具
}
//红颜进阶表
declare class Cfg_Grade_Beauty {
	Key: number; // 唯一ID
	Name: string; // 名称
	NamePic: string; // 名称图片
	FuncId: number; // 功能id（关联功能表）
	Level: number; // 阶级
	Star: number; // 星级
	AttrId: number; // 处于此等级属性ID
	TotalExp: number; // 处于此等级经验进度条上限
	NeedItem: string; // 处于此等级单次升级需要道具ID:数量
	SingleExp: number; // 单次升级增加经验值
	SkinId: number; // 达到此等级激活皮肤id
	SkillPart: number; // 达到此等级解锁技能栏位
	TLLimit: number; // 通灵次数上限
}
//红颜进阶技能表
declare class Cfg_GradeSkill_Beauty {
	Key: number; // 唯一ID
	SkillName: string; // 技能名称
	IconId: number; // 技能icon
	FuncId: number; // 功能ID
	Part: number; // 技能位置
	Level: number; // 技能等级
	AttrId: number; // 属性ID
	NeedItem: string; // 升级所需道具
}
//背饰进阶表
declare class Cfg_Grade_Wing {
	Key: number; // 唯一ID
	Name: string; // 名称
	NamePic: string; // 名称图片
	FuncId: number; // 功能id（关联功能表）
	Level: number; // 阶级
	Star: number; // 星级
	AttrId: number; // 处于此等级属性ID
	TotalExp: number; // 处于此等级经验进度条上限
	NeedItem: string; // 处于此等级单次升级需要道具ID:数量
	SingleExp: number; // 单次升级增加经验值
	SkinId: number; // 达到此等级激活皮肤id
	SkillPart: number; // 达到此等级解锁技能栏位
	TLLimit: number; // 通灵次数上限
}
//背饰进阶表
declare class Cfg_GradeSkill_Wing {
	Key: number; // 唯一ID
	SkillName: string; // 技能名称
	IconId: number; // 技能icon
	FuncId: number; // 功能ID
	Part: number; // 技能位置
	Level: number; // 技能等级
	AttrId: number; // 属性ID
	NeedItem: string; // 升级所需道具
}
//萌宠进阶表
declare class Cfg_Grade_Pet {
	Key: number; // 唯一ID
	Name: string; // 名称
	NamePic: string; // 名称图片
	FuncId: number; // 功能id（关联功能表）
	Level: number; // 阶级
	Star: number; // 星级
	AttrId: number; // 处于此等级属性ID
	TotalExp: number; // 处于此等级经验进度条上限
	NeedItem: string; // 处于此等级单次升级需要道具ID:数量
	SingleExp: number; // 单次升级增加经验值
	SkinId: number; // 达到此等级激活皮肤id
	SkillPart: number; // 达到此等级解锁技能栏位
	TLLimit: number; // 通灵次数上限
}
//萌宠进阶表
declare class Cfg_GradeSkill_Pet {
	Key: number; // 唯一ID
	SkillName: string; // 技能名称
	IconId: number; // 技能icon
	FuncId: number; // 功能ID
	Part: number; // 技能位置
	Level: number; // 技能等级
	AttrId: number; // 属性ID
	NeedItem: string; // 升级所需道具
}
//进阶系统装备化金表
declare class Cfg_GradeHJ {
	Key: number; // 唯一ID
	FuncId: number; // 功能ID
	Part: number; // 装备部位
	Level: number; // 化金等级
	AttrId: number; // 属性ID
	CostItem: string; // 消耗道具ID:数量
}
//进阶系统装备强化表
declare class Cfg_GradeStrength {
	Key: number; // 唯一ID
	Pos: number; // 强化部位
	LevelMin: number; // 强化等级下限
	LevelMax: number; // 强化等级上限
	BaseAttrId: number; // 此区间的基础属性ID
	AddAttrId: number; // 每升一级累加属性ID
	NeedItem: string; // 消耗道具ID:数量
	LevelCondition: number; // 阶级条件
}
//进阶豪礼表
declare class Cfg_GradeJJHL {
	Key: number; // 唯一ID
	FuncId: number; // 功能ID
	Desc: string; // 描述
	TargetLevel: number; // 要求阶级
	Prize: string; // 奖励（数组）
}
//进阶通灵表
declare class Cfg_GradeTL {
	Key: number; // 等级
	Level: number; // 通灵次数上限
	TLCount: number; // 皮肤
	AnimId: number; // 资源id
	NameIcon: number; // 名称资源
}
//聊天配置表
declare class Cfg_ChatSet {
	Key: string; // Key
	Value: string; // 参数
	Desc: string; // 描述
}
//常量表
declare class Cfg_RankMatchNormal {
	CfgKey: string; // KEY
	CfgValue: string; // 赋值
	CfgValue2: string; // 赋值2
}
//排位赛段位表
declare class Cfg_RankMatchPos {
	Id: number; // Id
	Name: string; // 段位名称
	Icon: number; // 段位图标
	GoalMin: number; // 段位积分下限
	GoalMax: number; // 段位积分上限
	Reward: string; // 段位奖励
	RewardID: number; // 读取奖励掉落组ID
	WinGoals: number; // 胜利增加基础分
	LostGoals: number; // 失败扣除基础分
	RankSection: string; // 匹配积分区间
	RankNum: number; // 随机抽取人数
	ResetRank: number; // 重置后段位
}
//排位赛段位表
declare class Cfg_RankMatchIntegral {
	Id: number; // Id
	IntegralMin: number; // 积分差下限
	IntegralMax: number; // 积分差上限
	WinIntegral: number; // 胜利增加
	LostIntegral: number; // 失败扣除
}
//排位赛排行奖励
declare class Cfg_RankMatchReward {
	RankId: number; // ID
	RankMin: number; // 排名区间下限
	RankMax: number; // 排名区间上限
	Reward: string; // 奖励内容
	RewardId: number; // 读取奖励掉落组ID
	RankLimit: number; // 上榜分数限制
}
//排位赛次数收费
declare class Cfg_RankMatchCoin {
	Id: number; // ID
	Coin: string; // 购买初始价格
}
//排位赛胜场奖励
declare class Cfg_RankMatchWinReward {
	Id: number; // ID
	WinNum: number; // 胜利场数
	Reward: string; // 奖励内容
	RewardId: number; // 读取奖励掉落组ID
}
//常驻排行榜常量表
declare class Cfg_NormalRank_Config {
	CfgKey: string; // key
	CfgValue: string; // 值
	STRING: string; // 描述
}
//常驻排行榜表
declare class Cfg_NormalRank {
	Key: number; // 唯一id
	RankType: number; // 排行榜类型
	MinRank: number; // 排名下限
	MaxRank: number; // 排名上限
	TitleItem: number; // 称号道具id
	TitleID: number; // 称号id
	MsgId: number; // 公告编号
	Param: number; // 排行榜参数
}
//排行榜类型表
declare class Cfg_NormalRankType {
	Key: number; // 唯一id
	Param: number; // 排行榜参数
	RankType: number; // 排行榜类型
	FuncId: number; // 功能id（控制页签开启）
	Name: string; // 排行榜名称
	Name2: string; // 邮件用排行榜名称
	Desc1: string; // 排行榜描述
}
//取名库
declare class Cfg_Kingname {
	Sort: number; // 类型：1形容词/地名（不得超过3个字）；2姓名/雅号/称号（不得超过3个字）
	Param: string; // 内容
}
//取名库
declare class Cfg_Kingname_Rule {
	Sort: string; // 
	Odd: number; // 几率
	Symbol: number; // 符号出现几率（4）
}
//机器人测试
declare class Cfg_RobotTest {
	Key: string; // Key
	Param1: string; // 字符串参数
}
//任务指引表
declare class Cfg_TaskGuide {
	Key: number; // 唯一ID
	ButtonID: number; // 按钮ID
	TipsContent: string; // 引导提示语（是否需要提示语）
	Ren: number; // 立绘方向
	Direct: number; // 摆放位置
}
//任务类型表
declare class Cfg_TaskType {
	CountType: number; // 计数类型
	Desc: string; // 任务描述
}
//主线任务
declare class Cfg_LinkTask {
	Id: number; // 任务ID
	GetCondition: number; // 接取任务前置任务ID
	StageCondition: number; // 接取任务条件前置关卡ID
	Army: number; // 任务进行条件：军衔阶级
	FuncId: number; // 客户端功能id
	Finger: number; // 是否显示引导手势
	TipsType: number; // 引导类型
	TipsContent: string; // 引导提示语（是否需要提示语）
	GuideType: number; // 引导要点击的按钮
	TaskGuid: string; // 前端引导按钮
	CountType: number; // 任务计数类型
	SubType: number; // 计数器子类型
	Param: string; // 参数（如指定某个ID）任务专用字段
	Independent: number; // 是否独立计数（0：否，不独立计数。1：是，独立计数）
	TargetCount: number; // 任务完成条件
	Prize: string; // 完成任务奖励方案id数组
}
//地图通关任务
declare class Cfg_MapTask {
	MapId: number; // 地图ID
	Note: string; // 注释列(程序不用)
	Prize: string; // 完成任务奖励道具及数量
}
//日常常量表
declare class Cfg_Daily_Config {
	Key: string; // 配置字段（红色表示重复）
	Value: string; // 配置值
}
//日常任务
declare class Cfg_DailyTasks {
	Id: number; // 任务ID
	TaskType: number; // 类型1每日2每周
	Name: string; // 任务名
	Type: number; // 任务类型
	CountType: number; // 任务计数类型
	SubType: number; // 子类型
	Param: string; // 参数
	Independent: number; // 是否独立计数1:独立计数
	TargetCount: number; // 任务完成条件
	Prize: number; // 奖励掉落
	WeekReward: number; // 周末奖励掉落
	FuncId: number; // 界面跳转ID填:功能id
}
//阶段奖励
declare class Cfg_StageReward {
	Id: number; // 序号
	Type: number; // 类型1每日2每周
	Activity: number; // 活跃值
	StageReward: number; // 奖励掉落组
}
//资源找回
declare class Cfg_Resource {
	Id: number; // ID
	Des: string; // 类型名称
	Des1: string; // 类型描述
	Type: number; // 类型参数
	Param: number; // 功能类型
	CostItemId: number; // 找回消耗道具id
	CostItemNum: number; // 单次找回消耗道具数量
	FuncId: number; // 对应系统的功能Id
}
//图腾表
declare class Cfg_Totem {
	Id: number; // 图腾ID
	Name: string; // 图腾名称
	MaxLv: number; // 最大等级
	LevelLimit: string; // 解锁条件
	AttrId: number; // 激活属性
	CostItem: number; // 消耗道具ID
	CostLevelRatio: number; // 升级进度条万分比
	SkillID: number; // 激活技能ID
}
//图腾等级表
declare class Cfg_TotemLevel {
	Id: number; // 图腾ID
	Level: number; // 等级
	AttrRatio: number; // 升级万分比
	CostLevel: number; // 升级进度条
	SkillLevel: number; // 技能提升等级
	NextSkillLevel: number; // 下一等级(程序读表用）
}
//常量表
declare class Cfg_FamilyNormal {
	CfgKey: string; // KEY
	CfgValue: string; // 赋值
	CfgValue2: string; // 赋值2
}
//族长争霸BUFF
declare class Cfg_FNPatrBuff {
	ID: string; // 序号
	Type: number; // 类型
	Times: string; // 次数/时间
	InspireBuffId: number; // 连任/离线BUFFID
}
//校场表
declare class Cfg_DrillGround {
	Id: number; // 校场id
	Name: string; // 校场名称
	MaxLv: number; // 最大等级
	CostId: number; // 升级消耗ID
}
//校场升级表
declare class Cfg_DrillGroundLevel {
	ID: number; // ID
	DrillGroundId: number; // ID
	Level: number; // 校场等级
	AttrId: number; // 升级增加属性ID
	Mod: number; // 除以5的余数值
}
//校场升级消耗表
declare class Cfg_DrillGroundCost {
	ID: number; // ID
	CostId: number; // 校场id
	Min: number; // 此阶段初始等级
	Max: number; // 最高等级
	Cost: string; // 消耗资源
}
//校场共鸣表
declare class Cfg_DrillGroundMaster {
	ID: number; // ID
	MasterLevel: number; // 共鸣等级
	AttrId: number; // 共鸣属性id
	LevelLimit: number; // 升级需其他校场等级达到
}
//校场升级限制
declare class Cfg_DrillGroundLimit {
	ID: number; // ID
	Level: number; // 统校场等级
	LevelLimit: number; // 升级需其他校场等级达到
}
//世家表
declare class Cfg_Family {
	Level: number; // Id
	Exp: number; // 升级所需经验
	Buff: string; // BUFF加成
}
//世家职位表
declare class Cfg_FamilyPos {
	Id: number; // Id
	Star: number; // 职位品质
	PosName: string; // 职位名称
	Count: number; // 职位人数
	SkillId: number; // 经验技能ID
	HangingRevenue: string; // 挂机收益万分比
	SalarReward: string; // 俸禄奖励
	Reward1: string; // 新服第一届奖励
	Reward2: string; // 合服第一届奖励
	Reward3: string; // 通用奖励
}
//试炼副本排行奖励表
declare class Cfg_TrialCopyRank {
	RankId: number; // 排名
	Reward: string; // 奖励内容
}
//试炼副本怪物表
declare class Cfg_TrialCopyMonster {
	ID: number; // 关数
	RefreshId: number; // 刷新ID
	Reward: string; // 奖励
	RedRewardID: number; // 红包ID
}
//试炼副本红包表
declare class Cfg_TrialCopyRed {
	ID: number; // 唯一ID
	RewardID: number; // 红包ID
	Item: number; // 道具ID
	Num: number; // 道具数量
	Priority: number; // 道具权重
	MiniCount: number; // 保底数量
	IsNotice: number; // 是否发广播
}
//事务表
declare class Cfg_TaskName {
	Id: number; // Id
	TaskQuality: number; // 品质
	Odd: number; // 权重
	TaskName: string; // 任务名称
	TaskText: string; // 任务文字描述
}
//事务-奖励
declare class Cfg_TaskReward {
	Id: number; // 唯一ID
	Level: number; // 事务等级
	TaskQuality: number; // 事务品质
	TaskReward: string; // 任务奖励
	BoxReward: string; // 宝箱配置
	DropReward: string; // 掉落ID
}
//事务派遣表
declare class Cfg_TaskCondition {
	Id: number; // 条件Id
	TaskQuality: number; // 任务品质
	PartnerType: number; // 伙伴类型2-武将-功能ID30013-红颜-功能ID3101
	TCType: number; // 派遣伙伴类型1-XX阵营武将2-XX稀有度武将3-XX头衔武将4-XX品质武将5-XX品质红颜
	PartnerNum: number; // 上阵伙伴数量
	Camp: number; // 武将阵营1 蜀2 魏3 吴4 群
	Rarity: number; // 武将稀有度1大将2勇将3良将4虎将5名将
	Title: number; // 武将头衔1草芥2精英3非凡4入世5盖世6无双
	Quality: number; // 单位品质1.绿色2.蓝色3.紫色4.橙色5.红色6.金色7.七彩
	Priority: number; // 条件刷新权重
	OpenId: number; // 功能开放id
}
//事务派遣权重配置表
declare class Cfg_TCPriority {
	Quality: number; // 品质
	TCType1: number; // 武将阵营权重（类型1）
	TCType2: number; // 武将稀有度权重（类型2）
	TCType3: number; // 武将头衔权重（类型3）
	TCType4: number; // 武将品质权重（类型4）
	TCType5: number; // 红颜品质权重（类型5）
	ConNumPriority: string; // 派遣条件数量权重（1个条件权重:2个条件权重）
}
//事务-等级
declare class Cfg_FNTask {
	Level: number; // 事务等级
	Exp: number; // 升级所需经验
	TaskNum: number; // 生成事务总数量
	TaskQuality: number; // 事务最高品质
	RandQuality: string; // 事务品质概率
	FNTFateRam: string; // 世家事务刷新出缘分的权重
	FNTNotice: number; // 广播品质要求
}
//事务缘分表
declare class Cfg_TaskFateCondition {
	Id: number; // 缘分Id
	TaskQuality: number; // 任务品质
	PartnerNum: number; // 缘分伙伴数量
	PartnerTypes: string; // 伙伴类型数组2-武将3-红颜
	PartnerIds: string; // 伙伴Id数组需对应前方伙伴类型数组字段中的类型
	Priority: number; // 条件刷新权重
	Reward: string; // 缘分奖励道具id：数量
	OpenId: number; // 功能开放id
}
//商店
declare class Cfg_ShopCity {
	GoodsID: number; // 商品id
	Desc: string; // 注释列（程序不用）
	ItemID: number; // 商品道具id
	MallType: number; // 商店标签
	GoldType: number; // 结算货币道具编号
	BuyNum: number; // 单个商品包含道具数量
	GoodsPrice: number; // 结算货币数量
	SalePrice: number; // 打折价格
	Sale: string; // 折扣文本为10表示没折扣，价格按照GoddsPrice小于十，价格按照SalePrice
	Sort: number; // 排列次序
	LimTimeID: number; // 限制次数id
	LimConID: number; // 限制条件id
	ShowLimConID: number; // 显示限制条件id
}
//商店类型
declare class Cfg_ShopCityType {
	MallTypeID: number; // 类型id
	MallTypeName: string; // 商城名称
	ShopId: number; // 商城分类
	GoldType: string; // 关联货币类型
	Sort: number; // 商城排序
	FuncId: number; // 开启条件走功能表
	Show: number; // 开启后，该商店页签是否显示
}
//神秘商店配置
declare class Cfg_SecretMallCfg {
	CfgKey: string; // key
	CfgValue: string; // 值
	STRING: string; // 描述
}
//神秘商店
declare class Cfg_SecretMall {
	Id: number; // id
	GoodsTitle: string; // 商品名称
	ItemString: string; // 道具配置
	CostItem: number; // 消耗道具类型2仙玉3 元宝4 金币
	OldPrize: number; // 原价消耗货币数量
	Prize: number; // 现价消耗货币数量
	Sale: string; // 折扣文本为10表示没折扣，价格按照GoddsPrice小于十，价格按照SalePrice
	Rate: number; // 此商品刷新概率万分比
	LimTimeID: number; // 限制次数id
	LimConID: number; // 限制条件id
	Open: number; // 开关为0则永远不显示
	MustShow: string; // 在某一栏随机商品时，必定会从指定的商品组中随机比如有5个商品此值为1，则第一栏必定从这5个商品中随机
	ThemeConID: number; // 活动主题条件ID
}
//华服进阶
declare class Cfg_SpecialSuitUp {
	Level: number; // 华服套装阶级
	Part_Level: number; // 各部件星级
	AttrId: number; // 属性id
	Item_Id: string; // 升到此阶的消耗
	SkillLevel: number; // 技能等级
}
//时装注灵表
declare class Cfg_RoleSkinZL {
	Level: number; // 注灵等级
	EXP: number; // 升级所需注灵值
	AttrId: number; // 升至此级时属性ID
	Ratio: number; // 注灵技能提升注灵总属性的参数基数（万分比）
	SkillId: number; // 注灵技能ID
}
//皮肤套装表
declare class Cfg_SkinSuit {
	Id: number; // ID
	Type: number; // 套装type
	Name: string; // 套装名称
	SkinRequire: string; // 皮肤收集要求
	AttrId2: number; // 2件属性ID
	AttrId3: number; // 3件属性ID
	AttrId4: number; // 完美属性ID
	IconId: string; // 套装图标Id
	SortId: number; // 排序ID
	ShowLimitId: number; // 显示条件ID
	IncreaseId: string; // 增幅表ID
	SkillId: string; // 技能ID
	ActiveDesc: string; // 活动套装激活条件描述
	ActiveDesc1: string; // 套装获取途径描述
}
//时装皮肤表
declare class Cfg_RoleSkin {
	Id: number; // 皮肤ID
	FuncId: number; // 功能id
	Name: string; // 皮肤名称
	NeedItem: number; // 激活所需道具
	AttrId: number; // 激活属性ID
	IsSuit: number; // 部件所属类型
	IsShow: number; // 没有激活道具时是否显示
	IncreaseId: string; // 增幅表ID
	SkillId: string; // 技能表ID
	LianshenUp: number; // 激活后增加炼神吞噬上限
	IsAutoWear: number; // 是否自动穿戴0否    1是
	AnimId: string; // 美术资源ID男资源|女资源
	ShowLimitId: number; // 显示条件ID
	XY: string; // 场景资源偏移坐标
	FieldId: number; // 栏位的位置
}
//时装皮肤升星表
declare class Cfg_RoleSkinStar {
	Key: number; // 唯一编号
	FuncId: number; // 功能ID
	MinLevel: number; // 最小等级
	MaxLevel: number; // 最大等级
	LevelUpItem: number; // 升级所需道具数量
	AttrRatio: number; // 属性加成（万分比）
	TotalRatio: number; // 等级段总万分比
}
//时装相关道具表
declare class Cfg_RoleSkinItem {
	Key: number; // 唯一ID
	FuncId: number; // 功能ID
	Desc: string; // 描述
	LSItem: number; // 炼神所需道具ID
	LSLimit: number; // 初始炼神吞噬上限
	TLItem: number; // 通灵所需道具ID
	ZLItem: number; // 注灵所需道具ID
	ZLExp: number; // 单个注灵丹增加经验值
	ForgeItem: number; // 淬炼所需道具
	ForgeExp: number; // 单个淬炼道具增加经验值
}
//头像头像框表-升星表
declare class Cfg_PhotoStar {
	Key: number; // 唯一编号
	FuncId: number; // 功能ID
	MinLevel: number; // 最小等级
	MaxLevel: number; // 最大等级
	LevelUpItem: number; // 升级所需道具数量
	AttrRatio: number; // 属性加成（万分比）
	TotalRatio: number; // 等级段总万分比
}
//头像头像框表 
declare class Cfg_Photo {
	Id: number; // 头像和框id
	Sort: number; // 排序用
	Name: string; // 头像名称
	Type: number; // 类型
	Quality: number; // 品质
	Attr: number; // 基础属性ID
	FuncId: number; // 升星读取配置
	Unlock: number; // 激活判断
	UnlockItem: string; // 激活所需道具（自身）ID
	StarUpItem: number; // 升星所需道具（自身）ID
	AnimId: string; // 美术资源id
	EffectUnlock: string; // 动态效果解锁
}
//VIP等级表
declare class Cfg_VIP {
	VIPLevel: number; // vip等级
	VIPName: string; // 显示名称
	Exp: number; // 升到此等级需要的VIP经验值
	Prize: string; // 到达等级奖励
	isShowFv: number; // 是否显示战力
	NamePic: string; // 奖励名称图片资源
	PrizeName: string; // 奖励名称
	PrizeType: number; // 奖励资源类型
	PrizeResId: string; // 奖励展示资源ID
	UnlockFunc: string; // 解锁功能
	MITime: string; // 材料副本购买次数
	ArenaTimes: string; // 竞技场购买次数
	AFKTimes: string; // 快速挂机购买次数
	MTBoss: string; // 多人首领购买次数
	DayPrize: string; // 每日礼包奖励
	PgCount: number; // 主页新增特权显示数量
	BeaconWarStrength: string; // 烽火连城体力上限
	TeamDun1: string; // 兵法组队副本可购买次数
	TeamDun2: string; // 进阶组队副本可购买次数
	Family1: string; // 事务特权1
	Family2: string; // 事务特权2
	CashCow1: string; // 摇钱树免费次数
	CashCow2: string; // 摇钱树元宝次数
	CashCow3: string; // 摇钱树玉璧次数
	RankMatchDun: string; // 排位赛可购买次数上限
	TrialCopyCount: string; // 试炼副本购买次数
	SilkRoadCount: string; // 丝绸之路购买次数
}
//VIP特权描述
declare class Cfg_VIP_Desc {
	ID: number; // 描述id
	Desc: string; // 描述内容
}
//武将配置表
declare class Cfg_Config_General {
	CfgKey: string; // key
	CfgValue: string; // 值
	STRING: string; // 描述
}
//武将升级属性表
declare class Cfg_GeneralLevelUp {
	Level: number; // 等级
	ExpMax: number; // 最大经验值
	H_Attr: number; // 血量属性
	A_Attr: number; // 攻击属性
	D_Attr: number; // 防御属性
}
//武将升阶配置
declare class Cfg_GeneralGradeUp {
	ID: number; // 唯一ID
	Rarity: number; // 稀有度
	Grade: number; // 阶数
	ItemCost: string; // 消耗道具道具ID:数量|道具ID:数量
	CostNum: number; // 消耗本身数量
	Attr: number; // 固定属性属性ID
	Ratio: number; // 武将品质属性万分比
	TallentSkillLv: number; // 天赋技能等级
}
//武将品质表
declare class Cfg_GeneralQuality {
	Quality: number; // 品质
	Cost: number; // 消耗副武将数量
	Tax: string; // 升品手续费
	Coefficient: number; // 品质战力系数(万分比)
	QualityItem: string; // 武将提品丹
}
//武将头衔增幅配置
declare class Cfg_GeneralTitleUp {
	Id: number; // 序号
	Prob: number; // 概率
	TalentA_Min: number; // 攻击资质下限
	TalentA_Max: number; // 攻击资质上限
	TalenA: string; // 攻击资质区间
	TalentD_Min: number; // 防御资质下限
	TalentD_Max: number; // 防御资质上限
	TalenD: string; // 防御资质区间
	TalentH_Min: number; // 血量资质下限
	TalentH_Max: number; // 血量资质上限
	TalenH: string; // 血量资质区间
	Grow_Min: number; // 成长下限(万倍)
	Grow_Max: number; // 成长上限(万倍)
	Grow: string; // 成长区间(万倍)
}
//武将头衔配置
declare class Cfg_GeneralTitle {
	Title: number; // 头衔
	Group: number; // 头衔组
	Rate: number; // 普通觉醒概率
	RateInc: number; // 超级觉醒概率
	TallentInc: number; // 当前资质增幅
	MaxTallentInc: number; // 资质上限增幅
	SkillMax: number; // 公共技能上限 
	SkillLockMax: number; // 锁定技能上限
	TriggerBaseCount: number; // 触发保底次数
	BaseCountMin: number; // 保底次数最小值
	MaxBaseCount: string; // 开服N天内保底次数最大值
}
//武将稀有度配置
declare class Cfg_GeneralRarity {
	Rarity: number; // 稀有度
	Name: string; // 稀有度名称
	MaxQuality: number; // 最高品质
	AwakenCost: string; // 觉醒道具ID：数量
	AwakenSuperCost: string; // 超级觉醒道具ID：数量
	Title: number; // 初始头衔
	ReleaseDropItem: string; // 遣散返还道具
}
//技能新增概率表
declare class Cfg_G_SkillStudyProb {
	Count: number; // 技能数
	Probability: number; // 新增技能概率(万倍)
}
//技能锁定配置
declare class Cfg_G_SkillLock {
	Count: number; // 个数
	Cost: string; // 学习技能花费
}
//初始技能个数
declare class Cfg_G_InitSkillC {
	Count: number; // 个数
	Rarity: number; // 稀有度
	Rate: number; // 初始获得宠物时的技能个数概率万分比
}
//武将技能品质表
declare class Cfg_G_SkillQuality {
	Quality: number; // 技能品质
	AttrInc: number; // 属性提升百分比(万倍)
	ReleaseDropPer: number; // 遣散掉落万分比
	Recycled: string; // 技能回收
}
//武将技能推荐表
declare class Cfg_G_RecommenSkill {
	RecomSkilId: number; // ID
	Name: string; // 名称
	Combination: string; // 组合
}
//武将皮肤表
declare class Cfg_GeneralSkin {
	Key: number; // 唯一ID
	Desc: string; // 描述
	FuncId: number; // 所属功能ID
	GeneralId: number; // 所属武将ID
	Name: string; // 皮肤名称
	IsTitle: number; // 是否无双皮肤0否 1是
	NeedItem: number; // 激活所需道具道具ID
	AttrId: number; // 属性ID
	IsAutoWear: number; // 是否自动穿戴0否    1是
	IsLevelUP: number; // 是否自动升级0否    1是
	AnimId: number; // 美术资源ID
	ShowLimitId: number; // 显示条件ID
	XY: string; // 偏移坐标
	FromDesc: string; // 获取条件描述
	GetDesc: string; // 激活条件描述
}
//武将皮肤升星表
declare class Cfg_GeneralSkinStar {
	Key: number; // 唯一ID
	FuncId: number; // 功能ID
	MinLevel: number; // 最小等级
	MaxLevel: number; // 最大等级
	LevelUpItem: number; // 升级所需道具数量
	AttrRatio: number; // 属性加成（万分比）
	TotalRatio: number; // 等级段总万分比
}
//武将表
declare class Cfg_General {
	Id: number; // 武将id
	Name: string; // 武将中文名称
	Quality: number; // 初始品质影响颜色
	Rarity: number; // 稀有度
	Camp: number; // 阵营
	Attr: number; // 基础属性ID
	BaseSkillId: string; // 专属技能ID
	TalentSkillID: string; // 天赋技能ID
	AwakenSkillID: string; // 觉醒技能ID
	RecomSkilId: number; // 推荐技能
	TalentA_Min: string; // 攻击资质下限区间
	TalentA_Max: string; // 攻击资质对应品质上限
	TalentD_Min: string; // 防御资质下限区间
	TalentD_Max: string; // 防御资质对应品质上限
	TalentH_Min: string; // 血量下限区间
	TalentH_Max: string; // 血量资质对应品质上限初始资质|+1|+2|+3
	Grow_Min: string; // 成长值下限区间(万倍)
	Grow_Max: string; // 成长值对应品质上限
	RandCommonSkills: string; // 随机公共技能组
	CommonSkillsTemp: string; // 模板公共技能组
	AnimId: string; // 武将的类型对应资源ID第一位即为普通类型后形象
	RebornPetHeadIcon: string; // 武将的类型对应头像资源ID第一位即为普通类型后头像形象
	IsVisible: number; // 是否在列表和图鉴中可见
	FromID: string; // 获得途径（同道具表）
	YPara: number; // 武将头顶挂件Y轴偏移值（像素）
	StickCost: string; // 合成所需消耗
}
//武将表装备表
declare class Cfg_Genera_Equip {
	Id: number; // ID
	Part: number; // 装备部位
	Level: number; // 阶数
	Star: number; // 星数
	Attr: number; // 属性ID
	Cost: string; // 合成消耗
	Name: string; // 装备名称
	Quality: number; // 品质
	Icon: number; // 装备图标id
}
//武将装备升星表
declare class Cfg_Genera_EquipStarUp {
	Id: number; // ID
	Level: number; // 阶数
	Star: number; // 星数
	Cost: string; // 升下一星消耗（道具id:数量）
	CostMyself: number; // 本体卡消耗数量
	AttrPer: number; // 升级属性提升万分比
	GrowPer: number; // 成长值提升万分比
	LimitId: number; // 升星限制条件ID
	Attr: number; // 属性ID
}
//常量表
declare class Cfg_SilkRoadNormal {
	CfgKey: string; // KEY
	CfgValue: string; // 赋值
}
//西域行商
declare class Cfg_SilkRoad {
	Id: number; // id
	Quality: number; // 行商品质
	Name: string; // 行商名称
	Img: number; // 模型ID
	Road: string; // 路线图
	EventPriority: number; // 事件概率
	EventLimit: number; // 事件上限
	EventReward: string; // 事件奖励
	Cost: string; // 消耗
}
//基础奖励
declare class Cfg_SilkRoadReward {
	Id: number; // id
	SilkRoadId: number; // 行商类型
	LevelMin: number; // 人物等级下限包含
	LevelMax: number; // 人物等级上限包含
	Reward: string; // 护送奖励
}
//城镇
declare class Cfg_SilkRoadTown {
	Id: number; // id
	Name: string; // 城镇名称
	NextTown: string; // 相邻城池
	NextTownCD: string; // 相邻城池距离(单位:秒)
	EventGroup: string; // 事件组
}
//事件
declare class Cfg_SilkRoadEvent {
	Id: number; // id
	Name: string; // 事件名称
	Desc: string; // 事件描述
}
//常量表
declare class Cfg_AdventureNormal {
	CfgKey: string; // KEY
	CfgValue: string; // 赋值
}
//格子奖励
declare class Cfg_AdventureBlock {
	KEY: number; // ID
	NameId: number; // 格子类型
	BgId: number; // 层级
	Originate: number; // 起始格子
	Aborted: number; // 终止格子
	DropId: number; // 掉落ID
	LimitBg: number; // 限制层数
	RoundBg: number; // 循环初始层
}
//层数基础配置
declare class Cfg_AdventureBg {
	Id: number; // id
	AdventureGroup: string; // 事件组
	AdventureEnd: string; // 普通通道终点格子事件
	EndReward: string; // 普通通道终点奖励
}
//事件
declare class Cfg_AdventureEvent {
	Id: number; // id
	Name: string; // 事件名称
	Desc: string; // 事件描述
	CD: number; // 事件时间(单位:秒）
	Icon: number; // 事件表现图标
	MallType: number; // 商店类型
	Limit: number; // 事件出现条件
}
//商品配置
declare class Cfg_AdventureShop {
	Id: number; // id
	MallType: number; // 类型1、流浪商人2、千金台3、许愿奖励
	GoodsTitle: string; // 商品名称
	ItemString: string; // 商品配置
	CostItem: number; // 消耗道具类型2仙玉3 元宝4 金币
	OldPrize: number; // 原价消耗货币数量
	Prize: number; // 现价消耗货币数量
	Sale: string; // 折扣文本为10表示没折扣，价格按照GoddsPrice小于十，价格按照SalePrice
	Rate: number; // 此商品刷新概率（权重）
	Index: number; // 商品排序
	LimTimeID: number; // 购买次数id
	LimConID: number; // 商品出现条件id
}
//百晓堂题库
declare class Cfg_AdventureQuestion {
	Id: number; // 唯一ID
	Type: number; // 题库类型
	Question: string; // 问题描述
	Answer: number; // 正确答案
	Point: number; // 分值
	QuestionType: number; // 题目类型
	Param: number; // 参数
	Rank: number; // 名次
	RightOdd: number; // 正确答案是“是”的几率（万分比）
	FuncId: number; // 该题目开启功能ID
}
//地图背景节日表
declare class Cfg_MainCity_Date {
	Key: number; // 唯一id
	StartDate: string; // 开始日期
	EndDate: string; // 结束日期
	Ids: string; // 地图背景列表
}
//地图背景表
declare class Cfg_MainCity {
	Id: number; // 主城背景id
	Width: number; // 背景宽度
	SliceWidth: number; // 切片宽度
	ShowTime: string; // 显示时间
	ShowPos: string; // 雕像显示位置
	Npc: string; // 会动的npc
	Effect: string; // 烟花特效
	EffectPos: string; // 烟花特效位置
	Build: string; // 建筑
}
//地图NPC
declare class Cfg_MainCity_Npc {
	Id: number; // NpcId
	Restype: string; // 资源类型
	ResId: number; // 资源id
	EndPos: string; // 路径点
	Say: string; // NPC随机言语
}
//地图建筑按钮
declare class Cfg_MainCity_Build {
	Id: number; // 建筑id
	Pos: string; // 位置
	Name: string; // 名字
	NameBg: string; // 名字背景
	FuncId: number; // 功能ID
}
//装备升星表
declare class Cfg_Equip_Star {
	Id: number; // 编号
	ArmyLevel: number; // 军衔阶级
	ArmyStar: number; // 军衔等级
	Item: string; // 消耗道具及数量
}
//宝石类型表
declare class Cfg_EquipGemType {
	Type: number; // 类型
	Name: string; // 类型名称
	MaxLv: number; // 宝石最高等级
}
//宝石道具表
declare class Cfg_EquipGemItem {
	ItemId: number; // 对应道具id
	Type: number; // 宝石类型
	Level: number; // 宝石等级
	LevelCostNum: number; // 升级所需同等级道具数量
	Skill: string; // 特性技能（技能id:等级）
}
//宝石镶嵌部位表
declare class Cfg_EquipGemPos {
	EquipPos: number; // 装备部位
	GemType: string; // 允许镶嵌宝石类型
	LimitId: string; // 孔位开启条
}
//装备强化配置新
declare class Cfg_EquipStrengthC {
	ArmyLevel: number; // 装备军衔阶级
	Min: number; // 此阶段强化初始等级
	Max: number; // 强化最高等级
	CoinBase: number; // 消耗银两基数
	CoinUp: number; // 每级消耗银两递增系数
	StoneBase: number; // 消耗强化石基数
	StoneUp: string; // 每级消耗强化石递增系数
}
//装备强化共鸣
declare class Cfg_EquipStrengthS {
	Level: number; // 强化共鸣等级
	AttrId: number; // 属性ID
	LevelLimit: number; // 所有部位最低强化等级需达到
}
//装备强化属性
declare class Cfg_EquipStrengthA {
	Id: number; // ID
	Pos: number; // 强化部位
	Desc: string; // 备注，程序不读
	LevelMin: number; // 强化等级下限包括
	LevelMax: number; // 强化等级上限包括
	BaseAttrId: number; // 等级在此区间时的基础属性ID
	AddAttrId: number; // 等级在此区间时，每升一级累加属性ID
}
//装备强化配置
declare class Cfg_Config_Strength {
	CfgKey: string; // key
	CfgValue: string; // 值
	STRING: string; // 描述
}
//装备打造
declare class Cfg_EquipBuildNew {
	Id: number; // 编号
	EquipSys: number; // 装备系统
	EquipSysStr: string; // 装备系统描述
	EquipLevel: number; // 装备军衔等级
	EquipLevelStr: string; // 装备军衔等级描述
	EquipPart: number; // 装备部位
	NeedItem1: string; // 装备碎片
	NeedItem2: string; // 装备图纸
	PrefBuildStone: string; // 打造石
	ExcAttrStone: string; // 天火
	CostMoney: string; // 消耗货币
	ShowItemId: number; // 展示道具Id
	Rd: number; // 红点类型
}
//装备打造星概率
declare class Cfg_EquipBuildStar {
	Star: number; // 星数
	NPrefOdd: number; // 非完美概率
	PrefOdd: number; // 完美概率
}
//装备材料
declare class Cfg_Equip_Material {
	Id: number; // 材料类型ID
	Type: number; // 材料类型
	ArmyLevel: number; // 军衔等级
	ItemId: number; // 材料道具ID
}
//进阶装备熔炼
declare class Cfg_MeltGrade {
	Quality: number; // 品质
	Tatter1: string; // 碎片1(自身阶数)
	Tatter2: string; // 碎片2(自身阶数+1)
	BuildStone1: string; // 装备打造石1(自身阶数)
	BuildStone2: string; // 装备打造石2(自身阶数+1)
}
//进阶系统到碎片类型
declare class Cfg_MeltSysToType {
	EquipSys: number; // 装备系统
	EquipMaterialType: number; // 碎片类型
}
//普通装备熔炼
declare class Cfg_MeltCom {
	Quality: number; // 装备品质
	CoinNum: number; // 产出金币数量
	StoneNum: number; // 产出装备强化石数量
}
//红装熔炼
declare class Cfg_MeltRed {
	Star: number; // 星级
	Tatter1: string; // 碎片1(装备军衔)
	Tatter2: string; // 碎片2(装备军衔+1)
	BuildStone1: string; // 装备图纸1(装备军衔)
	BuildStone2: string; // 装备图纸2(装备军衔+1)
	StarStone1: string; // 升星石1(装备军衔)
	StarStone2: string; // 升星石2(装备军衔+1)
	ExcAttrStone: string; // 天火数量
	PrefBuildStone: string; // 打造石数量
}
//熔炼部位到类型
declare class Cfg_MeltPartToType {
	EquipPart: number; // 装备部位
	EquipMaterialType: number; // 碎片类型
}
//装备部位类型
declare class Cfg_EquipPartName {
	EquipPart: number; // 装备部位
	Name: string; // 装备部位描述
}
//
declare class Cfg_EquipGem_Config {
	CfgKey: string; // key
	CfgValue: string; // 值
	STRING: string; // 描述
}
//附加属性基础值
declare class Cfg_AdditionAttrB {
	Id: number; // 唯一ID
	RankLv: number; // 军衔等级
	AdditionAttrId: number; // 属性ID
	Weight: number; // 权重（同条属性只能出现1次）
}
//附加属性品质随机
declare class Cfg_AdditionAttrR {
	Id: number; // 属性品质
	RankLv: number; // 开启所需军衔等级
	Weight: number; // 品质权重
	CoefficientMin: number; // 基础属性放大系数（最小值）万分比
	CoefficientMAX: number; // 基础属性放大系数（最大值）万分比
}
//常量配置
declare class Cfg_WorldNormal {
	CfgKey: string; // KEY
	CfgValue: string; // 赋值
}
//世界buff
declare class Cfg_WorldSkill {
	ID: number; // 世界buff技能id
	LevelDiff: number; // 获取差值
	BuffId1: number; // 本服技能效果id
	BuffId2: number; // 连服经验技能效果id
	BuffId3: number; // 合服经验技能效果id
}
//道具表
declare class Cfg_Item {
	Id: number; // 道具编号
	Name: string; // 道具名称
	Description: string; // 道具描述
	CoinType: number; // 货币类型（对应人物属性）
	DetailType: number; // tip类型
	DetailId: number; // tip类型参数
	PicID: string; // 道具图片
	IsPile: number; // 是否可以叠加
	PileNum: number; // 堆叠数量
	BagType: number; // 背包类型
	Type: number; // 类型
	SubType: number; // 子类
	LeftLogo: number; // 左上角标
	RightLogo: number; // 右上角标
	Quality: number; // 品质
	Flash_Quality: number; // 闪烁特效
	Bind: number; // 绑定类型
	ArmyLevel: number; // 道具军衔阶级
	AttrId: number; // 属性编号
	GetFunc: number; // 获得时执行function
	UseFunc: number; // 使用时执行function
	ClientFunc: string; // 是否可用
	FromID: string; // 获取途径
	NeedNum: number; // 碎片合成需要总数量
	BestQuality: number; // 极品飘窗0无 1有
	IsFastShow: number; // 是否快速显示1显示 0不显示
	IsFastParam: number; // 快速使用排序
	FastLimit: string; // 快速显示功能限制（用于功能未开启限制）
	Contain: string; // 包含物品
	IsKey: number; // 是否是关键道具（一般是可以交易的道具）
	OneKeyUse: number; // 能否一键使用
	IsHide: number; // 是否在背包中隐藏该道具0不隐藏 1隐藏
	ItemSort: number; // 背包中道具排序
	Param: number; // 参数
	EquipPart: number; // 装备部位
	Level: number; // 道具等级
	Star: number; // 道具星级
	AdditionAttrId: number; // 装备附加属性ID
	AdditionAttrMin: number; // 装备附加属性最小条数
	AdditionAttrMax: number; // 装备附加属性最大条数
	EquipType: number; // 装备类型(用于区分套装/神装/普通)
	NoMsg: number; // 道具不足，提示消息
}
