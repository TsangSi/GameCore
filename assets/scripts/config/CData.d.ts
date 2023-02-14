/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable camelcase */
// 首领之家
declare class Cfg_Boss_Home {
	HomeId: number ; // 首领之家Id(层)
	MapId: number ; // 地图编号
	ShowLabel: string ; // 界面显示层级
	RebornLevel: number ; // 对应首领转生等级
}
// 首领之家Boss
declare class Cfg_Boss_Home_Boss {
	HomeId: number ; // 首领之家Id(层)
	BossId: number ; // Boss序号
	MonsterId: number ; // BOSS编号
	RefreshId: number ; // 怪物刷新ID
	FightValue: number ; // Boss战力
	ShowPrize1: string ; // 归属奖励展示
	ShowPrize2: string ; // 幸运奖励展示
	ShowPrize3: string ; // 掉落奖励展示
	OwnerDropPrize: string ; // 归属奖励掉落
	LuckDropPrize: string ; // 幸运掉落奖励
}
// 首领之家配置
declare class Cfg_Boss_Home_Cfg {
	BodyPower: number ; // 每天恢复体力
	RestoreBP: number ; // 道具恢复体力
	CostItemId: number ; // 恢复体力道具Id
	CostNum: number ; // 道具数量
	KillDeductBP: number ; // 击杀首领扣除体力
	VipBPLimit: string ; // Vip添加体力上限
}
// 极品掉落
declare class Cfg_Boss_GoodDrop {
	Quality: number ; // 装备品质
	Star: number ; // 装备星级
	Up: number ; // 是否置顶
}
// 极品掉落配置
declare class Cfg_Config_GD {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// Boss禁地
declare class Cfg_MiJing_Boss {
	LayerId: number ; // 秘境Boss层Id
	BossId: number ; // BossID
	MonsterId: number ; // BOSS怪物id
	RefreshId: number ; // BOSS怪物刷新ID
	FightValue: number ; // Boss战力
	ShowPrize1: string ; // 归属宝箱奖励展示
	ShowPrize2: string ; // 击杀BOSS奖励展示
	ShowPrize3: string ; // 主界面奖励展示
	ShowPrize4: string ; // 参与奖展示
}
// Boss禁地宝箱
declare class Cfg_MiJing_Boss_Box {
	Id: number ; // 宝箱Id
	MonsterId: number ; // 宝箱怪物编号
	OpenTimesBase: number ; // 宝箱开启次数(基数)
	GeneralOpenCostItem: string ; // 普通开启消耗道具:数量
	GeneralDropId: number ; // 普通开启掉落Id
	SupremeOpenCostItem: string ; // 至尊开启消耗道具：数量
	SupremeDropId: number ; // 至尊开启掉落Id
	ShowDropId: number ; // 展示用掉落Id
}
// 宝箱额外次数
declare class Cfg_MiJing_Box_Vip {
	VipLevel: number ; // vip等级
	ExtOpenTimes: number ; // 宝箱额外开启次数
}
// Boss禁地层
declare class Cfg_MiJing_Boss_Layer {
	LayerId: number ; // 秘境Boss层Id
	MapId: number ; // 地图编号
	ShowLabel: string ; // 界面显示层级
	RebornLevel: number ; // 对应首领转生等级
	JoinVipLevel: number ; // 进入场景要求VIP等级
	JoinPayItem: string ; // 未满足VIP条件每次进入该层场景需要支付道具
	LimitLevel: number ; // 关卡极限等级
	RedId: number ; // 红点Id
}
// 首领配置
declare class Cfg_Boss_CfgCfg {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 首领鼓舞
declare class Cfg_Boss_Inspire {
	Id: number ; // Id
	Desc: string ; // 描述
	InspireType: number ; // 鼓舞类型
	NeedItemId: number ; // 消耗道具Id
	NeedNum: number ; // 消耗道具数量
	AddSeconds: number ; // 单次鼓舞增加时间(秒)
	Enable: number ; // 是否启用
	InstanceType: number ; // Id
}
// 首领鼓舞Buff
declare class Cfg_Boss_Inspire_Buff {
	Id: number ; // Id
	Second: number ; // 持续时间(秒)
	AddValue: number ; // 鼓舞攻击加层(%)
	SecondsLimit: number ; // 鼓舞时间上限
	InspireState: number ; // 鼓舞状态
}
// 组队鼓舞
declare class Cfg_Team_Inspire {
	Id: number ; // Id
	Desc: string ; // 描述
	FuncId: number ; // 组队关联功能表Id
	NeedItemId: number ; // 消耗道具Id
	NeedNum: number ; // 消耗道具数量
	MaxTimes: number ; // 玩家鼓舞次数上限
	TeamMaxTimes: number ; // 队伍有效鼓舞次数上限（组成员总和）
	InspAddNum: number ; // 每次鼓舞添加百分比
	InspireDesc: string ; // 鼓舞描述
}
// 世界Boss
declare class Cfg_Act_WorldBoss {
	MonsterId: number ; // boss编号
	ShieldTrigger: string ; // 护盾触发
	ShieldPrize: number ; // 破盾奖励组
	TotalShieldMath: number ; // 总护盾值
	OnceShieldMath: number ; // 护盾单次衰减值
	DiceTime: number ; // 自动拼点倒计时
	CloseTime: number ; // 拼点时间（秒）
	ShowPrize1: number ; // 归属奖励展示
	ShowPrize2: number ; // BOSS主界面奖励展示
	ShowPrize3: number ; // 最后一击幸运奖励展示
	LuckPrize: number ; // 最后一击幸运奖励
}
// 达标奖励
declare class Cfg_Act_WorldBoss_RGPrize {
	Id: number ; // 奖励id
	FightTimes: number ; // 挑战首领次数
	Desc: string ; // 描述
	Prize: number ; // 奖励
}
// 凶煞岛采集配置
declare class Cfg_XSD_Collect {
	XsdId: number ; // 凶兽岛Id
	MonsterId: number ; // 采集怪id
	MaxTimes: number ; // 每日最大采集次数
	CollectCD: number ; // 采集所需时间（秒）
}
// 凶兽岛配置信息
declare class Cfg_Xsd_All {
	XsdId: number ; // 凶兽岛Id
	MapId: number ; // 地图Id
	LimitTimesId: number ; // 限制次数ID
	Name: string ; // 凶兽岛名称
}
// 凶兽岛Boss
declare class Cfg_Xsd_Boss {
	XsdId: number ; // 凶兽岛Id
	BeastId: number ; // 凶兽表Id
	Unlock: string ; // 解锁条件
	MapId: number ; // 地图Id--作废
	BossId: number ; // Boss序号
	MonsterType: number ; // 怪物类型
	MonsterId: number ; // BOSS编号
	RefreshId: number ; // 怪物刷新ID
	FightValue: number ; // Boss战力
	ShowPrize1: number ; // 归属奖励展示
	ShowPrize2: number ; // 幸运奖励展示
	ShowPrize3: number ; // 掉落奖励展示
	OwnerDropPrize: number ; // 归属奖励掉落
	LuckDropPrize: number ; // 幸运掉落奖励
}
// 凶灵岛Boss
declare class Cfg_XSD_Boss_XL {
	Id: number ; // Id
	MaxStar: number ; // 最高星级
	StartUp: string ; // 升星所需打副本次数
	Unlock: string ; // 解锁条件
	LimitTimesId: number ; // 限制次数ID
	TextPic_id: string ; // 文本资源id
	Pic_id: string ; // 背景图片id
	ShowPrize1: number ; // 归属奖励展示
	DropInc: number ; // 固定掉落随星级递增值
	DropPrize: number ; // 固定掉落道具
	BossId: number ; // BOSS编号
	RefreshId: number ; // 刷新ID
	RefreshInc: number ; // 刷新随星级递增值
	BeastId: number ; // 对应凶兽ID
	IntervalTime: number ; // 挑战间隔时间（秒）
	EntrustId: number ; // 委托表Id
	EntrustPrize: number ; // 委托奖励
}
// 个人boss
declare class Cfg_Boss_Personal {
	Id: number ; // Id
	BossId: number ; // BOSS编号
	ShowLabel: string ; // 界面显示转生等级
	NeedLevel: number ; // 挑战转生等级
	ExtCond: number ; // 额外条件
	ShowPrize: string ; // 显示奖励道具id数组
	IntervalTime: number ; // 挑战间隔时间（秒）
}
// 至尊boss
declare class Cfg_Boss_VIP {
	Id: number ; // Id
	BossId: number ; // BOSS编号
	ShowLabel: string ; // 界面显示等级
	NeedLevel: number ; // 挑战等级
	NeedVipLevel: number ; // 需要vip等级
	ShowPrize: string ; // 掉落展示
	DropId: number ; // 掉落奖励ID
	IntervalTime: number ; // 挑战间隔时间（秒）
}
// 多人首领
declare class Cfg_Boss_Multi {
	Id: number ; // Id
	BossId: number ; // BOSS编号
	MapId: number ; // 地图编号
	ShowLabel: string ; // 界面显示等级
	NeedLevel: number ; // 挑战等级
	ShowPrize1: string ; // 归属奖励展示
	ShowPrize2: string ; // 概率掉落奖励展示
	Order1PrizeShow: string ; // 第1名排名奖励展示
	Order2PrizeShow: string ; // 第2名排名奖励展示
	Order3PrizeShow: string ; // 第3名排名奖励展示
	Order4PrizeShow: string ; // 第4名排名奖励展示
	Order5PrizeShow: string ; // 第5名排名奖励展示
}
// 悬赏列表
declare class Cfg_Boss_XuanShangList {
	XuanShangID: number ; // 悬赏id
	Quality: number ; // 悬赏品质
	QualityName: string ; // 品质描述
	RewardScore: number ; // 奖励积分
	RewardDisplay: string ; // 展示掉落道具
	AllowHelp: number ; // 是否可召唤帮手
	MapID: number ; // 地图id
	MonsterX: number ; // x坐标
	MonsterY: number ; // y坐标
	MonsterID: number ; // boss编号
	QualityColor: string ; // 品质描述
}
// 掉落
declare class Cfg_Boss_XuanShangDrop {
	Reborn: number ; // 转生等级
	XuanShangID: number ; // 悬赏id
	RewardDisplay: string ; // 展示掉落道具
}
// 配置
declare class Cfg_Boss_XuanShangCfg {
	FunID: number ; // 功能表id
	MaxFreeRefreshTimes: number ; // 免费次数储存上限
	QualityUpCost: string ; // 悬赏提品消耗
	QualityMaxCost: string ; // 一键传说消耗
	BossLimitTime: number ; // boss讨伐限时,秒
	KillTimesLimitID: number ; // 可击杀次数限制id
	ExchangeItemID: number ; // 兑换击杀次数道具ID
	MaxFreeFightTimes: number ; // 每日免费讨伐上限数
	TeamSkillID: number ; // 组队伤害加成技能id
	TeamSkillLevel: number ; // 组队伤害加成技能等级
	FamilySkillDesc: string ; // 家族成员掉率增加描述
}
// 积分
declare class Cfg_Boss_XuanShangScore {
	ID: number ; // 奖励id
	NeedScore: number ; // 需要积分
	Reward: string ; // 奖励
}
// 通天Boss阶段
declare class Cfg_TTBos_Stage {
	Id: number ; // Id
	Name: string ; // 名字
	Time: number ; // 阶段持续时间（秒）
}
// 通天Boss阶段配置
declare class Cfg_TTBoss {
	StageId: number ; // 阶段Id
	BossId: number ; // Id
	MonsterId: number ; // BossId
	RefreshId: number ; // 刷新ID
	MonsterX: number ; // X坐标
	MonsterY: number ; // Y坐标
	Fx: number ; // Boss朝向
	BeDropId: number ; // 归属奖励掉落id
	KillDropId: number ; // 击杀奖掉落id
}
// 通天Boss排行奖励
declare class Cfg_TTBos_RkRwd {
	StageId: number ; // 阶段Id
	BossId: number ; // Id
	RankMin: number ; // 排名最小值
	RankMax: number ; // 排名最大值
	RankPrize: number ; // 掉落id
}
// 通天Boss配置
declare class Cfg_TTBos_Cfg {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 战力护符任务
declare class Cfg_ZhanLiHuFu {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	TargetReborn: number ; // 目标转数
	TargetB: number ; // 目标重数
	AttrId: number ; // 完成任务增加战力对应属性id
}
// 招财猫任务
declare class Cfg_ZhaoCaiPiXiu {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	TargetReborn: number ; // 目标转数
	TargetB: number ; // 目标重数
	Prize: string ; // 完成任务奖励方案id数组
}
// 神灯原石升级表
declare class Cfg_LampStoneLevel {
	Id: number ; // 原石ID
	Pos: number ; // 原石位置
	Name: string ; // 原石名称
	Level: number ; // 原石等级
	Picture: number ; // 原石图标
	Desc1: string ; // 原石描述1
	SkillDesc: string ; // 原石技能加成数值描述
	Desc2: string ; // 原石描述2
	AttrPresent: number ; // 属性加成万分比
	SkillDataID: number ; // 技能数据ID
	NeedItemId: number ; // 升级使用道具Id
	NeedItemNum: number ; // 升级使用道具数量
	ErrMsg: number ; // 道具不足提示
}
// 神灯许愿表
declare class Cfg_LampWish {
	Id: number ; // ID
	Name: string ; // 名称
	Effect: string ; // 作用
	Pos: number ; // 宝石位置
	Level: number ; // 宝石等级
	SkillDataId: number ; // 技能数据Id
	IncreaseID: number ; // 增幅Id
	Origin: string ; // 来源
	Decs: string ; // 描述
	BuffPicture: number ; // BUFF图标
}
// 宝物表
declare class Cfg_Baowu {
	Id: number ; // 宝物ID
	Name: string ; // 宝物名称
	AttrId: number ; // 基础属性ID
	SkillId: number ; // 技能
	NeedItemId: number ; // 激活道具Id
	NeedItemNum: number ; // 激活道具数量
	IncreaseId: number ; // 增幅技能ID
}
// 榜单竞技排名
declare class Cfg_BangDanJJ_RankPrize {
	Id: number ; // id
	BossId: number ; // 所属BOSSid
	Min: number ; // 排行段下限
	Max: number ; // 排行段上限
	DropId: number ; // 排行奖励组ID
}
// 榜单竞技配置
declare class Cfg_BangDanJJ {
	CfgKey: string ; // 唯一值
	CfgValue: string ; // 配置值
}
// 榜单竞技BOSS配置
declare class Cfg_BangDanJJ_Boss {
	Id: number ; // 编号
	ActId: number ; // 定时活动(周)id
	RefreshId: number ; // 刷新id
	DamageReduction: string ; // BOSS伤害减免类型|减免百分比（填写万分比值）
	DropID: number ; // BOSS挑战奖励配置奖励组
	DailyPrizeTimes: number ; // BOSS挑战奖励每日可获得次数
	Awards: string ; // BOSS攻略页面奖励道具展示
	Intro: string ; // BOSS攻略页面简介文字
	Handbook: string ; // BOSS攻略页面攻略文字
}
// 充值商城
declare class Cfg_ChargeMall {
	GoodsId: number ; // 商品id
	MallType: number ; // 商城类型
	GoodsTitle: string ; // 商品名称
	ItemString: string ; // 道具配置
	Sort: number ; // 排序
	PicId: number ; // 图片编号
	Money: number ; // 消耗需求(分)
	BuyTimes: number ; // 购买次数
	GoodsType: number ; // 商品类型
	LimitId: number ; // 限制次数id
	AddFightValue: number ; // 增加的战力(显示使用)
}
//
declare class Cfg_PetEquip_ExclusiveEffect {
	Key: number ; // 标志
	EffectId: number ; // 效果编号
	Name: string ; // 属性名称
	Quality: number ; // 品质
	SkillId: string ; // 技能
	PetId: number ; // 生效宠物ID
	Desc: string ; // 描述
}
// 分解
declare class Cfg_PetEquip_Smelt {
	Id: number ; // 标志
	Part: number ; // 部位
	Quality: number ; // 品质
	Star: number ; // 星级
	Awards: string ; // 返还奖励
}
// 升星
declare class Cfg_PetEquip_StartUp {
	Id: number ; // 标志
	Part: number ; // 部位
	Quality: number ; // 品质
	Star: number ; // 星级
	CostList: string ; // 消耗
	BaseAttrId: number ; // 升星后的基础属性ID
}
// 合成
declare class Cfg_PetEquip_Stick {
	ItemId: number ; // 合成道具ID
	Desc: string ; // 合成名字
	Level: number ; // 等级
	Type: number ; // 标签页类型
	Type2: number ; // 二级页签
	NeedItem: string ; // 所需道具ID及数量
	Rate: number ; // 合成万分比
	RateShow: number ; // 合成万分比
	RedPoint: number ; // （后端）红点是否处理
}
// 二级标签
declare class Cfg_PetEquip_StickType {
	Type: number ; // 标签页类型
	Title: string ; // 类型名称
	P: number ; // 父页签
	GN: number ; // 功能关联
}
// 宠物装备套装
declare class Cfg_PetEquip_Suit {
	Key: number ; // 标志
	Id: number ; // 套装属性编号
	Name: string ; // 套装名称
	Quality: number ; // 品质
	Num: number ; // 生效数量
	HPRatio: number ; // 血量万分比
	ATKRatio: number ; // 攻击万分比
	DEFRatio: number ; // 防御万分比
	AttrId: number ; // 属性Id
}
// 提品
declare class Cfg_PetEquip_QualityUp {
	Id: number ; // 标志
	Part: number ; // 部位
	Quality: number ; // 提品前品质
	AddRandomAttr: string ; // 增加随机属性值
	CostList: string ; // 消耗
	TargetId: number ; // 目标装备Id
}
// 宠物装备配置
declare class Cfg_PetEquip_Config {
	CfgKey: string ; // 唯一值
	CfgValue: string ; // 配置值
}
// 锻造表
declare class Cfg_PetEquip_Forge {
	Id: number ; // ID
	Kind: number ; // 锻造类型
	Desc: string ; // 描述
	Part: number ; // 部位
	CostList: string ; // 消耗成本
	RandomItemList: string ; // 物品随机列表
}
// 随机属性池
declare class Cfg_PetEquip_AttrPool {
	Id: number ; // 标志
	Quality: number ; // 品质
	Weight: number ; // 权重
	AttrId: number ; // 属性Id
	Min: number ; // 属性值
	Max: number ; // 属性值
}
// 套装属性池
declare class Cfg_PetEquip_SuitPool {
	Id: number ; // 标志
	Quality: number ; // 品质
	SuitId: number ; // 套装属性编号
	Weight: number ; // 权重
}
// 专属效果池
declare class Cfg_PetEquip_EffectPool {
	Id: number ; // 标志
	Quality: number ; // 品质
	Weight: number ; // 权重
	EffectId: number ; // 专属效果Id
}
// 宠物图腾
declare class Cfg_Pet_Totem {
	TotemId: number ; // 图腾编号
	TotemName: string ; // 图腾名字
	TotemQuality: number ; // 图腾品质
	MaxPetNum: number ; // 阵位数量
	UnlockId: number ; // 解锁条件
	UnlockDesc: string ; // 解锁提示
	TotemPicID: number ; // 图标资源
	AnimId: string ; // 美术资源id
	TagUI: string ; // 左上角标签美术资源id
	ItemId: number ; // 附灵道具
	Attr: number ; // 图腾基础属性
	Gear: number ; // 动态资源激活等阶
	DAnimId: number ; // 动态美术资源id
	MaxGear: number ; // 激活等阶上限
}
// 图腾之力
declare class Cfg_Pet_Totem_Power {
	TotemId: number ; // 图腾编号
	PowerId: number ; // 图腾之力id
	Desc: string ; // 描述
	PetNum: number ; // 宠物数量
	PetQuality: number ; // 宠物品质
	PetRarity: number ; // 宠物稀有度
	AttrId: number ; // 属性id
}
// 图腾附灵
declare class Cfg_Pet_Totem_GearUp {
	Quality: number ; // 品质
	Gear: number ; // 等阶
	Attr: number ; // 属性翻倍万分比
	NeedNum: number ; // 需要道具数量
}
// 宠物品质表
declare class Cfg_Pet2Quality {
	Quality: number ; // 品质
	Positive_Grow: string ; // 正值成长区间(万倍)
	Positive_Talent: string ; // 生命正值资质区间
	Positive_Talent1: string ; // 攻击正值资质区间
	Positive_Talent2: string ; // 防御正值资质区间
	Compose_Item: string ; // 炼妖石
	Compose_Protect: string ; // 炼妖保护丹
	Devour_Num: number ; // 吞噬副宠数量
	Devour_Tax: string ; // 吞噬手续费
	Compose_Inc: number ; // 炼妖值增量
	Coefficient: number ; // 品质战力系数(万分比)
	QualityItem: string ; // 宠物提品丹
}
// 宠物培养升级使用道具配置表
declare class Cfg_Pet2LvUpItem {
	Pos: number ; // 道具位置
	Id: number ; // 道具名称
}
// 宠物培养改造使用道具配置表
declare class Cfg_Pet2PrUpItem {
	Pos: number ; // 道具位置
	Id: number ; // 道具名称
}
// 宠物培养道具配置表
declare class Cfg_Pet2Foster {
    Id: number ; // 道具编号
    Name: string ; // 道具名称
	Category: number ; // 类型
	Quality: number ; // 品质
	Positive_Rate: number ; // 正值概率
	Negative_Rate: number ; // 负值概率
	Positive_Zone: string ; // 正值区间(成长万倍)
	Negative_Zone: string ; // 负值区间
	Exp: number ; // 经验值
}
// 宠物金柳露培养配置表
declare class Cfg_Pet2RaiseUp {
	Id: number ; // 序号
	Prob: number ; // 概率
	TalentA_Min: number ; // 攻击资质下限
	TalentA_Max: number ; // 攻击资质上限
	TalenA: string ; // 攻击资质区间
	TalentD_Min: number ; // 防御资质下限
	TalentD_Max: number ; // 防御资质上限
	TalenD: string ; // 防御资质区间
	TalentH_Min: number ; // 血量资质下限
	TalentH_Max: number ; // 血量资质上限
	TalenH: string ; // 血量资质区间
	Grow_Min: number ; // 成长下限(万倍)
	Grow_Max: number ; // 成长上限(万倍)
	Grow: string ; // 成长区间(万倍)
}
// 宠物初始技能个数
declare class Cfg_Pet2InitSkillC {
	Count: number ; // 个数
	Rarity: number ; // 稀有度
	Rate: number ; // 初始获得宠物时的技能个数概率万分比
}
// 技能锁定配置
declare class Cfg_Pet2SkillLock {
	Count: number ; // 个数
	Cost: string ; // 学习技能花费
}
// 炼妖技能阈值
declare class Cfg_Pet2ComposeBoundary {
	Id: number ; // ID
	Skill_Num: number ; // 技能数
	Boundary_Min: number ; // 阈值最小值
	Boundary_Max: number ; // 阈值最大值
}
// 宠物携带个数
declare class Cfg_Pet2Count {
	Count: number ; // 个数
	Level: number ; // 人物等级
	VIP: number ; // VIP等级
}
// 宠物觉醒技能
declare class Cfg_PetAwakenSkill {
	PetId: number ; // 神宠Id
	Star: number ; // 星耀
	Skills: string ; // 技能
	Attr: number ; // 属性提升万分比
}
// 技能觉醒效果
declare class Cfg_SkillAwakenEff {
	SkillId: number ; // 技能id
	Type: number ; // 类型
	SkillEff: string ; // 技能效果
}
// 宠物觉醒配置
declare class Cfg_PetAwaken {
	Star: number ; // 星耀
	Cost: string ; // 材料
	BackCost: string ; // 回退消耗
	BackReturn: number ; // 是否可回退
	AnimId: string ; // 觉醒特效资源ID
}
// 宠物觉醒道具
declare class Cfg_PetAwaken_Item {
	Type: number ; // 星耀类型
	Item: string ; // 道具Id
}
// 宠物转生
declare class Cfg_Pet2Reborn {
	Rarity: number ; // 稀有度
	Times: number ; // 转生第几次
	GrowUp: number ; // 成长上限单次提升点数（万倍）
	AttrUp: number ; // 基础属性总提升比例（万倍）
	TalentAUp: number ; // 攻击资质上限单次提升点数（仅神兽）
	TalentDUp: number ; // 防御资质上限单次提升点数（仅神兽）
	TalentHUp: number ; // 血量资质上限单次提升点数（仅神兽）
	NeedItem: string ; // 转生/飞升消耗道具ID:数量
}
// 宠物转生条件
declare class Cfg_Pet2RebornCond {
	Times: number ; // 转生次数
	Condition: string ; // 转生条件
}
// 宠物重置消耗
declare class Cfg_Pet2Reset {
	Rarity: number ; // 稀有度
	NeedItem: string ; // 消耗道具:数量
}
// 宠物品质拆解表
declare class Cfg_Pet2UnDevour {
	Id: number ; // 序号ID
	From: number ; // 当前品质
	To: number ; // 目标品质
	PetId: number ; // 宠物Id
	Num: number ; // 数量
}
// 宠物配置表
declare class Cfg_Config_Pet2 {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 宠物出战位解锁配置表
declare class Cfg_PosUnlock {
	PosId: number ; // 位置编号
	Condition: string ; // 解锁条件
}
// 新宠物升级属性表
declare class Cfg_Pet2Level {
	Level: number ; // 等级
	NeedGold: number ; // 升级所需银两
	ExpMax: number ; // 最大经验值
	H_Attr: number ; // 血量属性
	A_Attr: number ; // 攻击属性
	D_Attr: number ; // 防御属性
}
// 宠物基因突变配置
declare class Cfg_Pet2_Mutation {
	Type: number ; // 类别
	Prob: number ; // 概率
	ProbInc: number ; // 概率增幅
	Increase: number ; // 资质增幅
	SkillMax: number ; // 公共技能上限
	SkillLockMax: number ; // 锁定技能上限
}
// 宠物稀有度配置
declare class Cfg_Pet2_Devour {
	Rarity: number ; // 稀有度
	MaxQuality: number ; // 最高品质
	MaxReborn: number ; // 最大转生数
	MaxLevel: number ; // 宠物最高级别
	ItemId: number ; // 洗练道具ID
	ItemNum: number ; // 数量
	Compose_Num: number ; // 合成宠物所需碎片数量
	Item2Id: number ; // 超级金流露
	Item2Num: number ; // 超级金流露数量
}
// 技能新增概率表
declare class Cfg_Pet2SkillStudyProb {
	Count: number ; // 技能数
	Probability: number ; // 新增技能概率(万倍)
}
// 新宠物技能附属表
declare class Cfg_Pet2Skill {
	Id: number ; // 技能id
	Name: string ; // 技能名称
	Quality: number ; // 技能品质
	Type: number ; // 技能类型
	Summary: string ; // 技能中文描述
	AttrInc: number ; // 属性提升百分比(万倍)
	ItemId: number ; // 技能书Id
	DropProb: number ; // 放生掉落万分比
	RetrieveItem: string ; // 技能回收
	ShowLevel: string ; // 是否展示等级|升级所需觉醒等级
}
// 新宠物技能推荐表
declare class Cfg_Pet2RecommenSkill {
	RecomSkilId: number ; // ID
	Name: string ; // 名称
	Combination: string ; // 组合
}
// 宠物资质区间配置(废弃)
declare class Cfg_Pet2Zone {
	Quality: string ; // 品质
	Weight: number ; // 权重
}
// 宠物表
declare class Cfg_Pet2 {
	PetId: number ; // 宠物id
	Name: string ; // 宠物中文名称
	Type: number ; // 初始类型普通|神兽
	Quality: number ; // 初始品质影响颜色
	Rarity: number ; // 稀有度
	IsMaterial: number ; // 是否为材料宠物
	Attr: number ; // 基础属性ID
	ChangeItem: string ; // 转换道具道具ID:道具数量:觉醒等级Min:觉醒等级Max
	BaseSkillId: string ; // 专属技能ID
	BaseSkillId2: string ; // 主动技能附带每回合开启前释放被动
	RecomSkilId: number ; // 推荐技能
	TalentA_Min: string ; // 攻击资质下限区间
	TalentA_Max: string ; // 攻击资质对应品质上限
	TalentD_Min: string ; // 防御资质下限区间
	TalentD_Max: string ; // 防御资质对应品质上限
	TalentH_Min: string ; // 血量下限区间
	TalentH_Max: string ; // 血量资质对应品质上限初始资质|+1|+2|+3
	Grow_Min: string ; // 成长值下限区间(万倍)
	Grow_Max: string ; // 成长值对应品质上限
	RandCommonSkills: string ; // 随机公共技能组
	AttrTemp: string ; // 模板属性(血|攻|防|成长万倍)
	CommonSkillsTemp: string ; // 模板公共技能组
	Compose: number ; // 初始炼妖阈值
	UnlockItem: number ; // 宠物碎片道具ID
	AnimId: number ; // 美术资源id
	RebornAnimId: string ; // 宠物的类型对应资源ID第一位即为普通类型后形象
	RebornAnimId2: string ; // 随从资源
	RebornPetHeadIcon: string ; // 宠物的类型对应头像资源ID第一位即为普通类型后头像形象
	IsVisible: number ; // 是否在列表中可见
	TitleId: number ; // 品质称号id
	RefreshId: number ; // 灵兽园宠物场景刷新Id
	UnitType: number ; // 战斗单位类型
	FromID: string ; // 来源ID
	YPara: number ; // 宠物头顶挂件Y轴偏移值（像素）
}
// 宠物进化配置
declare class Cfg_PetEvolution {
	PetId: number ; // 宠物id
	PetName: string ; // 宠物名字
	ToPetId: number ; // 进化宠物Id
	Item: string ; // 消耗道具
	DetailType: number ; // tip类型
	AttrTypeId: number ; // 玩家属性Id
	IsMulti: number ; // 是否可以多次合成
	EntryIcon: number ; // 入口资源ID
	TitleName: string ; // 标题名称
	ItemEnter: string ; // 道具显示神兽合成入口
	Msg: number ; // 说明文档id
}
// 随机系统宠物表
declare class Cfg_SysPet2 {
	Id: number ; // 编号
	Name: string ; // 名字
	Quality: number ; // 品质
	Skill_Num: number ; // 技能数
	Weight: number ; // 权重
	Show_Id: number ; // 头像
}
// 称号表
declare class Cfg_SkinTitle {
	Id: number ; // 主键注意与其他类型皮肤表的ID不要重复
	Type: number ; // 皮肤类型
	Name: string ; // 皮肤名称
	UnlockItem: number ; // 解锁激活所需道具ID
	Quality: number ; // 称号品质
	AttrId: number ; // 激活属性ID
	AutoWear: number ; // 是否自动穿戴0否1是
	CanLevelUp: number ; // 是否可升级0否1是
	Cmd: number ; // 客户端界面跳转ID
	AnimId: string ; // 静态美术资源ID
	Level: number ; // 到达此等级时切换动态资源
	Dynamic: number ; // 动态美术资源ID
	IsHide: number ; // 是否隐藏
	OffsetY: string ; // Y轴偏移高度
	SpecialFrom: string ; // 特殊获取途径用于没有解锁道具的皮肤
	ActiveDisplayLabel: string ; // 激活时显示的来源
}
// 兑换功能表
declare class Cfg_Func {
	FuncId: number ; // 功能id
	Param1: number ; // 参数1
}
// 兑换表
declare class Cfg_DH {
	Id: number ; // Id（不可修改）
	TargetId: number ; // 目标道具ID
	TargetNum: number ; // 目标道具数量
	CurrentId: number ; // 兑换道具ID
	CurrentNum: number ; // 兑换道具数量
}
// NPC说话
declare class Cfg_NpcTalk {
	Id: number ; // 喊话ID
	Word: string ; // 战斗喊话
}
// 地图表
declare class Cfg_Map {
	MapId: number ; // 地图编号
	Name: string ; // 地图名称
	NeedLevel: number ; // 进入等级
	MapType: number ; // 地图类型
	InstanceType: number ; // 副本类型
	IsCross: number ; // 是否是跨服地图
	Relive_X: number ; // 复活坐标
	Relive_Y: number ; // 复活坐标
	FX: number ; // 出生朝向
	ResId: number ; // 地图资源编号
	HideFollower: number ; // 是否屏蔽跟随伙伴
	IsRespawnXY: number ; // 死后是否在当前地图复活坐标复活前端用
	BattleType: number ; // 在该地图中点目标是否有弹出确认框0-代表 点啥都无反应1-代表 点PVE怪弹确认框2-代表 点PVP玩家弹确认框3- 点PVE怪 进战斗不弹框4-点PVP玩家 进战斗不弹框5- 1、2组合6-1、4组合7-2、3组合8-3、4组合
	WalkType: number ; // 是否寻路至目标再进入战斗1-是0-否
	AttackType: number ; // 玩家是否能相互攻击0-否1-可
	MaxNum: number ; // 同场景人数0：不限制
	DeathReviveTime: string ; // 战斗失败后复活时间0，不死亡（秒）
	ReliveCoin3: number ; // 复活需要元宝
	ReliveItem: string ; // 复活需要道具:数量
	TreatCoin3: number ; // 治疗需要仙玉
	TreatItem: string ; // 治疗需要道具:数量
	MapTrace: string ; // 寻路点
	MaxPlayerNum: number ; // 同屏最大玩家数限制
	MonsterHP: string ; // 怪物血量区间
	LostHP: string ; // 怪物失血区间
	MonsterNum: number ; // 刷怪数量
	JumpNFrame: number ; // 跳转场景需要弹框确认
	BossMap: string ; // 特殊战斗场景
	BgMusic: string ; // 背景音乐
}
// 指定关卡怪物属性
declare class Cfg_StageAttr {
	Stage: number ; // 第几小关
	MonsterLevel: number ; // 怪物等级
	AttrId_Common: number ; // 普通怪物(属性ID)
	AttrId_Elites: number ; // 精英(属性ID)
	AttrId_Boss: number ; // boss(属性ID)
}
// 地图BGM
declare class Cfg_MapBgm {
	Id: number ; // id
	Name: string ; // 名字
	Vol: string ; // 音量
	Des: string ; // 备注（程序不用）
}
// 关卡表
declare class Cfg_Stage {
	MapId: number ; // 场景编号
	MapName: string ; // 场景名
	MinStageNum: number ; // 当前地图拥有关卡数
	BossGroup: string ; // BossIds
	Boss2Id: string ; // 精英id（新增）
	MonsterGroup: string ; // 小怪
	BossRefreshId: string ; // 关卡怪物阵型
	MonsterLevel: number ; // 怪物等级
	AttrId_Common: number ; // 普通怪物(属性ID)
	Level_1: number ; // 成长系数
	AttrId_Elites: number ; // 精英(属性ID)
	Level_2: number ; // 成长系数
	AttrId_Boss: number ; // boss(属性ID)
	Level_3: number ; // 成长系数
	DropGold: number ; // 挂机掉落金币
	Level_4: number ; // 挂机掉落金币成长系数
	DropExp: number ; // 挂机掉落经验
	Level_5: number ; // 挂机掉落经验成长系数
	DropLQ: number ; // 挂机掉落灵气
	Level_LQ: number ; // 挂机掉落灵气成长系数
	DropPetPill: number ; // 挂机掉落宠物经验丹掉落ID
	DropLevel: number ; // 挂机掉落装备综合等级（带转数的）
	DropId: number ; // 挂机装备通用掉落id
	BossDropGold: number ; // Boss掉落金币
	Level_6: number ; // 成长系数
	BossDropExp: number ; // boss掉落经验
	Level_7: number ; // 成长系数
	BossCoin4: number ; // BOSS掉落元宝（绑元）每个关卡掉落元宝
	ShowDropId: number ; // 关卡显示掉落id特殊处理，不显示奖励数量
	DropId10: string ; // 本张地图最后一关额外奖励配置奖励道具id：奖励数量
	LastCondition: string ; // 打场景最后一关关卡所需满足条件限制条件id
	StageNameId: string ; // 地图名标签资源名称
	StagePoemId: string ; // 地图诗句资源名称
}
// 关卡抽奖奖品
declare class Cfg_StageDrawPrize {
	Id: number ; // 奖励编号，不可重复
	Group: number ; // 抽奖组，前一组抽完后切换至下一组
	Prize: string ; // 奖品
}
// 周定时活动表
declare class Cfg_ActiveWeekly {
	ActId: number ; // 活动编号
	ActName: string ; // 活动名称
	ActType: number ; // 活动类型
	Order: number ; // 排序参数
	ReadyMin: number ; // 准备时间
	StartTime: string ; // 开始时间
	EndTime: string ; // 结束时间
	OpenTimeDesc: string ; // 开启时间描述
	ShowDesc: string ; // 定时活动奖励说明
	ActDays: number ; // 活动天数
	StartDay: number ; // 开服第几天开启活动
	Week: string ; // 星期几
	Prize: string ; // 奖励展示
	NamePic: string ; // 名称图片，显示在活动预告面板中
	BGPic: string ; // 背景底图，显示在活动预告列表中
	AssetId1: string ; // 标题资源ID
	AssetId2: number ; // 副标题资源ID
	EntranceIcon: number ; // 主界面侧边栏功能预告图标
	Icon: number ; // 显示入口图
	Rueume: number ; // 玩法说明id
	ClientFuncId: number ; // 前端funcId
	Cross: number ; // 是否跨服
}
// 定时活动表-游戏内玩法
declare class Cfg_Active {
	ActId: number ; // 活动编号
	ActName: string ; // 活动名称
	ActType: number ; // 活动类型
	ReadyMin: number ; // 准备时间（分钟）
	StartTime: string ; // 开始时间
	EndTime: string ; // 结束时间
	OpenTimeDesc: string ; // 开启时间描述
	Week: string ; // 星期几
	ActTime: string ; // 活动时间
	StartDay: number ; // 开服第几天开启活动
	EndDay: number ; // 开服第几天挂你活动（0：表示无穷大）
	Prize: number ; // 奖励展示
	NamePic: number ; // 名称图片，显示在活动预告面板中
	AssetId1: number ; // 主标题资源ID
	AssetId2: number ; // 副标题资源ID
	EntranceIcon: number ; // 主界面侧边栏功能预告图标
	ClientFuncId: number ; // 前端funcId
	Cross: number ; // 是否跨服
	ShowDesc: string ; // 定时活动奖励说明
	Priority: number ; // 活动日历推送优先级
	Type: number ; // 活动类型
}
// 巅峰竞技最终奖励
declare class Cfg_NBAFinalPrize {
	Id: number ; // 名次id
	Name: string ; // 名称
	Prize: number ; // 奖励
}
// 巅峰竞技竞猜奖励
declare class Cfg_NBAGuessPrize {
	Id: number ; // 名次id
	Name: string ; // 名称
	Cost: string ; // 下注消耗
	WinPrize: number ; // 成功奖励
	FailPrize: number ; // 失败返还下注比例万分比
}
// 巅峰竞技配置表
declare class Cfg_Config_NBA {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 分享
declare class Cfg_Share {
	FunId: number ; // 功能id
	Platform1: number ; // h5平台是否开启
	Platform2: number ; // 微信小游戏android平台是否开启
	Platform3: number ; // 微信小游戏ios平台是否开启
	Platform4: number ; // ios原生平台
	Platform5: number ; // android原生平台
}
// 仙童塔
declare class Cfg_Instance_KidTower {
	Id: number ; // Id
	TowerType: number ; // 爬塔类型
	BossId: number ; // boss编号
	RefreshId: number ; // 刷新ID
	ShowPrize: string ; // 展示掉落奖励
	NeedLv: number ; // 挑战等级限制
	LayerType: number ; // 关卡类型
	SepPrize: string ; // 特殊奖励
	ShowPrize1: string ; // 每日邮件奖励
}
// 剑魂塔
declare class Cfg_Instance_SwordTower {
	Id: number ; // Id
	TowerType: number ; // 爬塔类型
	BossId: number ; // boss编号
	RefreshId: number ; // 刷新ID
	ShowPrize: string ; // 展示掉落奖励
	NeedLv: number ; // 挑战等级限制
	LayerType: number ; // 关卡类型
	SepPrize: string ; // 特殊奖励
	DayGetPrize: string ; // 玩家每日手动领取奖励
	ExtraParam1: string ; // 特殊参数(奖励转盘次数)
	ExtraParam2: string ; // 特殊参数2(解锁剑魂)
}
// 剑魂转盘
declare class Cfg_SwordTower_Circle {
	Id: number ; // Id
	RewardItem: string ; // 奖励内容
	IsSuper: number ; // 是否是超级大奖
	Rate: string ; // 获得权重（万分比）
	Group: number ; // 抽奖组，前一组抽完后切换至下一组
}
// 层数
declare class Cfg_SwordTower_CircleStage {
	Group: number ; // 抽奖组
	Stage: number ; // 适用于多少层以前(含)
}
// 天仙塔
declare class Cfg_Instance_PetaATower {
	Id: number ; // Id
	TowerType: number ; // 爬塔类型
	BossId: number ; // boss编号
	RefreshId: number ; // 刷新ID
	ShowPrize: string ; // 展示掉落奖励
	NeedLv: number ; // 挑战等级限制
	LayerType: number ; // 关卡类型
	SepPrize: string ; // 特殊奖励
	ShowPrize1: string ; // 每日邮件奖励
}
// 宝石塔
declare class Cfg_Instance_GemTower {
	Id: number ; // Id
	TowerType: number ; // 爬塔类型
	BossId: number ; // boss编号
	RefreshId: number ; // 刷新ID
	ShowPrize: string ; // 展示掉落奖励
	NeedLv: number ; // 挑战等级限制
	LayerType: number ; // 关卡类型
	SepPrize: string ; // 特殊奖励
	ShowPrize1: string ; // 每日邮件奖励
}
// 战神塔
declare class Cfg_Instance_GodTower {
	Id: number ; // Id
	TowerType: number ; // 爬塔类型
	BossId: number ; // boss编号
	RefreshId: number ; // 刷新ID
	ShowPrize: string ; // 展示掉落奖励
	NeedLv: number ; // 挑战等级限制
	LayerType: number ; // 关卡类型
	SepPrize: string ; // 特殊奖励
	ShowPrize1: string ; // 每日邮件奖励
}
// 仙界宝藏
declare class Cfg_FairyTreasure {
	Id: number ; // Id
	Name: string ; // 挖宝场景名称
	MapId: number ; // 地图编号
	NeedItemId: number ; // 消耗道具Id
	NeedNum: number ; // 消耗数量
	DigTime: number ; // 挖宝时长
	ShowPrize: number ; // 展示奖励组
	SceneDesc: string ; // 场景描述
	DigAniId: number ; // 角色头顶挖宝标识
}
// 挖宝结果
declare class Cfg_DigTreasure {
	Id: number ; // Id
	Odd: number ; // 概率
	DropId: number ; // 奖励组
	DigType: number ; // 挖宝结果类型
	Desc: string ; // 挖宝结果描述
}
// 挖出的怪物
declare class Cfg_DigTreasureMonster {
	Id: number ; // Id
	GroupId: number ; // 挖宝场景Id
	MonsterId: number ; // 怪物编号
}
// 材料副本
declare class Cfg_Instance_Material {
	Id: number ; // Id
	Name: string ; // 名字
	MaxStar: number ; // 最高星级
	StartUp: string ; // 升星所需打副本次数
	Unlock: string ; // 解锁条件
	LimitTimesId: number ; // 限制次数ID
	TextPic_id: string ; // 文本资源id
	Pic_id: string ; // 背景图片id
	DropPrize: string ; // 固定掉落道具
	DropId: number ; // 掉落道具
	DropInc: string ; // 固定掉落随星级递增值
	RefreshId: number ; // 刷新ID
	FuncId: number ; // 对应功能ID
	OpenSort: number ; // 展示顺序
}
// 爬塔
declare class Cfg_Instance_ClimbingTower {
	TowerType: number ; // 爬塔类型
	TowerName: string ; // 塔的名称
	MapId: number ; // 地图Id
	InsType: number ; // 战斗类型
	ItemChangeType: number ; // 道具变动类型
	MonsterX: number ; // 怪物刷新点X
	MonsterY: number ; // 怪物刷新点Y
	NextLayerX1: number ; // 离开引导点X
	NextLayerY1: number ; // 离开引导点Y
	NextLayerX2: number ; // 离开点X（进入下一层）
	NextLayerY2: number ; // 离开点Y（进入下一层）
}
// 组队副本配置
declare class Cfg_Instance_Team_Cfg {
	InstanceType: number ; // Id
	FreeTimes: number ; // 免费次数
	BuyTimes: string ; // 购买次数
	NewBuyTimes: number ; // 免费+购买次数
	NeedItem: string ; // 购买需要道具
	Jump: string ; // 跳关
	BG: string ; // 背景大图
	ShowPrize: string ; // 奖励预览
	MaxLevel: number ; // 最大关卡数
	SweepLevel: number ; // 扫荡需求关数
	SweepSVip: number ; // 扫荡需要svip等级
	RankAttr: number ; // 排行榜属性编号
	TeamPrize: string ; // 队长宝箱
}
// 试炼副本
declare class Cfg_Instance_SL {
	Id: number ; // Id
	Name: string ; // 名字
	Unlock: string ; // 解锁条件
	LimitTimesId: number ; // 限制次数ID
	FuncId: number ; // 对应功能ID
	MapId: number ; // 地图ID
	MonsterX: number ; // X坐标
	MonsterY: number ; // Y坐标
}
// 试炼副本等级配置
declare class Cfg_Instance_SL_Level {
	Id: number ; // Id
	InsType: number ; // 副本类型
	MinLevel: number ; // 最小等级
	MaxLevel: number ; // 最大等级
	DropGold: string ; // 掉落金币
	DropExp: string ; // 掉落经验
	DropId: number ; // 掉落道具
	BossId: number ; // BossId
	Fx: number ; // Boss朝向
	RefreshId: number ; // 刷新ID
}
// 试炼副本鼓舞
declare class Cfg_SLIns_Inspire {
	Times: number ; // 鼓舞次数
	Coin3: number ; // 仙玉鼓舞单价
	Coin4: number ; // 元宝鼓舞单价
}
// 副本配置
declare class Cfg_Config_Instance {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 法阵表
declare class Cfg_FaZheng {
	Id: number ; // 主键注意与其他类型皮肤表的ID不要重复
	FieldId: number ; // 栏位的位置
	Type: number ; // 皮肤所属功能ID
	Level: number ; // 阶级
	AttrId: number ; // 升到此阶加属性Id
	NeedItem: string ; // 升到此阶需要道具
	Limit: number ; // 升阶上限
	Name: string ; // 皮肤名称
	Icon: number ; // 法阵图标
	AnimId: string ; // 美术资源ID
	IsShow: number ; // 是否显示
	OffsetY: string ; // Y轴偏移高度
}
// 法阵认主表
declare class Cfg_FaZhengRZ {
	Id: number ; // 法阵id
	Name: string ; // 阶段名称
	RZLevel: number ; // 认主阶段
	NeedLevel: number ; // 需要法阵阶级
	AttrId: number ; // 升到此阶加属性Id
	NeedItem: string ; // 升到此阶需要道具
	SkillId: string ; // 技能ID
}
// 飞升表
declare class Cfg_FeiSheng {
	Id: number ; // 飞升id
	StageName: string ; // 阶段名称
	Stage: number ; // 飞升阶段
	LevelName: string ; // 重数名称
	Level: number ; // 飞升重数
	TaskId: string ; // 从上一级升到此阶需要完成任务id
	NeedItemId: number ; // 从上一级升到此阶需要飞升丹id
	NeedItemNum: number ; // 从上一级升到此阶需要飞升丹数量
	BossId: number ; // Boss编号
	RefreshId: number ; // 升到此阶段需要挑战的刷新id
	Prize: string ; // 飞升到此阶奖励道具
	AttrId: number ; // 处于此阶属性ID
	HurtIncr1: number ; // 高1飞升减免伤害
	HurtIncr3: number ; // 高3飞升减免伤害
	SpikeProb: number ; // 高3飞升免疫秒杀概率（万分比）
	IconId: number ; // 技能IconId
	SkillName: string ; // 技能名称
	SkillType: number ; // 技能类型
	SkillDesc: string ; // 技能描述
}
// 任务表
declare class Cfg_FeiShengTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	Type: number ; // 任务类型序号
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	Independent: number ; // 是否独立计数（接取任务时的计数为0，或为当前的累加值）
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励方案id数组
	ClientFuncId: number ; // 跳转页面填：功能表，功能id
}
// 新功能开放表
declare class Cfg_Client_Func {
	FuncId: number ; // 功能id
	UI: number ; // 功能或UI
	GradeType: number ; // 对应升阶系统类型
	Tab: number ; // 标签
	Param1: number ; // 参数1
	Param2: number ; // 参数2
	Param3: number ; // 参数3
	Param4: string ; // 参数4
	ShowLv: number ; // 显示等级
	ShowStage: number ; // 显示通关关卡数
	Reborn: number ; // 转生转数
	Break: number ; // 转生重数
	LimitLv: number ; // 开启等级
	Realm: number ; // 境界
	LimitDay: number ; // 开服天数
	LimitUnionDay: number ; // 合服后，开服天数是否以连服首区天数为准0或不填否   1是
	MergeDay: number ; // 合服天数
	ShowVIP: number ; // 显示VIP等级
	LimitVIP: number ; // VIP等级
	FeiSheng: number ; // 飞升Id达到
	LimitStage: number ; // 需要通关关卡数
	MontyCard: number ; // 是否需要月卡
	LifeCard: number ; // 是否需要终身卡
	LimitMoney: number ; // 个人充值总额度（元）
	LimitTask: number ; // 需要完成的主线任务ID
	Smelt: number ; // 是否开启熔炼提示
	FuncIconID: number ; // 飘图标 图标资源id
	FuncShowDes: string ; // 功能开启弹窗飘图标目标位置特效显示条件
	Pos1: number ; // 功能开启预告飘特效指向位置
	Pos: number ; // 功能开启主城功能按钮位置
	ShowDes: string ; // 功能开启光圈指引显示条件
	RandTalk: number ; // 功能开启随机喊话组id
	Sort: number ; // ”更多“里面的入口排序
	Res: string ; // 资源名称
}
// 引导提示
declare class Cfg_Client_Tips {
	FuncId: number ; // 功能id
	UI: number ; // 功能或UI
	Tab: number ; // 标签
	Param1: number ; // 参数1
	Param2: number ; // 参数2
	Param3: number ; // 参数3
	Param4: number ; // 参数4
}
// 新功能开放表
declare class Cfg_Client_Fn {
	ID: number ; // 编号ID
	PicId: string ; // 功能图标id
	PicDec: string ; // 功能描述图片
	Condition1: number ; // 开放条件1创建天数
	Condition2: number ; // 开放条件2角色等级
	Condition3: number ; // 开放条件3关卡数
	Condition4: string ; // 开放条件4角色转生[转生|重数]
	Condition5: string ; // 开放条件5开服天数
	Sort: number ; // 列表排序
	Link: number ; // 跳转位置
	Notice: number ; // 是否预告（0预告，1不预告）
	Decs: string ; // 条件描述
	Animation: number ; // 表现形式（0弹出表现，1不弹出）
	Item: string ; // 奖励道具
	Pos: number ; // 功能开启预告飘特效指向位置
}
// 怪物表
declare class Cfg_Monster {
	MonsterId: number ; // 怪物id
	Name: string ; // 怪物中文名称
	ShowName: number ; // 地图展示名字
	UnitType: number ; // 单位类型
	MonsterType: number ; // 怪物类型
	AnimId: number ; // 美术资源id
	Hight: number ; // 怪物身高
	Quality: number ; // 怪物品质
	NpcFunc: number ; // npc点击功能id
	CollectTimes: number ; // 采集时间（毫秒）
	MustRide: number ; // 是否有无坐骑为一个形像
	Scale: number ; // 地图、副本场景怪物放大
	Collect: string ; // 采集动画
	ResType: string ; // 资源类型
}
// 挂机配置
declare class Cfg_Config_AFK {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 伙伴技能
declare class Cfg_PartnerSkill {
	SkillId: number ; // 派生技能Id
	SkillName: string ; // 派生技能名称
	SkillType: number ; // 技能类型
	SkillTagId: number ; // 技能关联Id
	SkillIncId: number ; // 技能参数
	SkillIcon: string ; // 技能图标
	Desc: string ; // 技能描述
	SkillQuality: string ; // 技能品质
}
// 伙伴羁绊
declare class Cfg_PartnerRelation {
	GroupId: number ; // 羁绊组Id
	Desc: string ; // 备注（程序不用）
	UnitType: number ; // 出战单位类型0主角 1宠物2仙侣 3战神4仙童 5偃甲6幻灵
	Id: number ; // 出战单位关联Id根据前面出战单位类型，填入对应的出战单位id
	Param: number ; // 参数如果是宠物，这个参数表示觉醒等级
	SkillId: string ; // 技能Id组，竖杠分割需要把所有羁绊技能都填上，不能只填对应伙伴拥有的羁绊技能
	Func: number ; // 羁绊生效类型1同时出战2同时存活（2包含同时出战这种情况）
}
// 伙伴表
declare class Cfg_Partner {
	Id: number ; // 伙伴Id
	Name: string ; // 伙伴名称
	Type: number ; // 伙伴类型填功能id
	Sex: number ; // 性别
	Quality: number ; // 伙伴品质
	Attr: number ; // 基础属性ID
	Rarity: number ; // 稀有度
	UnlockCond: string ; // 解锁条件
	ActiveSkillId: string ; // 仙童升阶技能ID和等级
	PassiveSkills: string ; // 升级技能ID和等级
	UnlockItem: number ; // 激活所需道具（精魄）ID
	UnlockItemTatter: string ; // 碎片激活道具Id:数量
	StarUpItem: number ; // 升星（进阶）所需道具（碎片）ID
	RareB: number ; // 是否绝版
	SkinId: number ; // 默认皮肤id
	IsVisible: number ; // 是否在列表中可见
}
// 伙伴升级表
declare class Cfg_PartnerLevel {
	Id: number ; // 编号
	GradeType: number ; // 系统类型
	PartnerId: number ; // 伙伴Id
	Level: number ; // 等级
	AttrId: number ; // 属性ID
	AddExp: string ; // 吃丹增加经验
	NeedTotalExp: number ; // 升级需要经验
	NeedItem: string ; // 需要道具
	SkillId: string ; // 升级技能Id
	StarLimit: number ; // 星级限制
	LimitDesc: string ; // 限制描述
}
// 伙伴升星表
declare class Cfg_PartnerStar {
	Id: number ; // Id
	PartnerId: number ; // 伙伴Id
	Star: number ; // 星级
	NeedItemCount: number ; // 所需道具数量
	Attr: number ; // 对应星级属性Id
	SkillId: string ; // 升星技能Id
	LevelLimit: number ; // 等级限制
	LimitDesc: string ; // 限制描述
}
// 伙伴表
declare class Cfg_PartnerConfig {
	Id: number ; // Id
	LinkId: number ; // 跳转功能id
}
// 仙童潜能
declare class Cfg_Partner_QianNeng {
	SkinId: number ; // 潜能皮肤ID
	CondStar: number ; // 激活潜能星级
	GCGrade: number ; // 潜能等阶
	GCLevel: number ; // 潜能等级
	LimitStar: number ; // 可升星上限
	AttrId: number ; // 增加属性
	ShowSkillId: string ; // 技能提升前端展示
	SkillId: string ; // 技能提升实际生效
	ShowPassiveSkillId: string ; // 潜能被动技能展示
	PassiveSkillId: string ; // 潜能被动技能
	CostItem: string ; // 道具消耗
}
// 仙童潜能皮肤配置
declare class Cfg_Partner_Peizhi {
	SkinId: number ; // 皮肤id
	Item: number ; // 道具id
	Aid: number ; // 潜能1阶资源
}
// 仙童皮肤技能孔位对
declare class Cfg_Partner_QN_Skill {
	Skills: number ; // 仙童皮肤技能
	Level: number ; // 技能对应解锁等级
	SkinExtSKill: number ; // 仙童潜能技能id
}
// 合成
declare class Cfg_Stick {
	ItemId: number ; // 合成道具ID
	Desc: string ; // 合成名字
	Level: number ; // 等级
	Type: number ; // 标签页类型
	Type2: number ; // 二级页签
	NeedItem: string ; // 所需道具ID及数量
	Rate: number ; // 合成万分比
	RateShow: number ; // 合成万分比
	RedPoint: number ; // （后端）红点是否处理
}
// 二级标签
declare class Cfg_StickType {
	Type: number ; // 标签页类型
	Title: string ; // 类型名称
	P: number ; // 父页签
	GN: number ; // 功能关联
}
// 合成
declare class Cfg_BagStick {
	ItemId: number ; // 合成的道具ID
	Desc: string ; // 注释
	NeedItem: string ; // 所需道具ID及数量
	OpenItemId: number ; // 触发合成的道具Id
}
// 好友配置表
declare class Cfg_Friend {
	ID: number ; // id
	VipMin: number ; // 最低vip
	VipMax: number ; // 最高vip
	FriendNum: number ; // 关注上限
	FanNum: number ; // 粉丝上限
	SendCoin: number ; // 每日赠送上限
	ReceiveCoin: number ; // 每日接受上限
	BlackList: number ; // 黑名单上限
	Recommend: number ; // 推荐数
	EnemyList: number ; // 仇人上限
}
// 幻境任务表
declare class Cfg_IllusionTask {
	Id: number ; // 任务ID
	IsType: number ; // 幻境类型
	Type: number ; // 任务类型
	Name: string ; // 任务名
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数
	Independent: number ; // 是否独立计数
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 章节奖励
}
// 幻境关卡表
declare class Cfg_IllusionCheckPoint {
	Id: number ; // Id
	IsType: number ; // 幻境类型
	Chapter: number ; // 章节
	CheckPoint: number ; // 关卡
	Name: string ; // 关卡名称
	UnionFirstPassPrize: string ; // 连服首通奖励
	FirstPassPrize: string ; // 首通奖励
	SweepPrize: string ; // 通关(扫荡)奖励
	FirstPassDropPrize: number ; // 首通奖励掉落ID
	SweepDropPrize: number ; // 通关(扫荡)奖励掉落ID
	AassistDropPrize: number ; // 协助奖励掉落ID
	CoverName: string ; // 封面图
	BossId: number ; // BOSS编号
	RefreshId: number ; // 怪物刷新ID
	RecFv: number ; // 推荐战力
}
// 幻境章节表
declare class Cfg_IllusionChapter {
	IsType: number ; // 幻境类型
	IsName: string ; // 幻境名字
	Chapter: number ; // 章节
	FightType: number ; // 挑战条件类型
	FightCond: number ; // 挑战条件参数
	FightCondDesc: string ; // 挑战条件描述
	CoverName: string ; // 封面图
	ChapterRD: number ; // 章节红点
	TeamMinFv: number ; // 组队默认最低战力
}
// 幻境配置表
declare class Cfg_IllusionCfg {
	CfgKey: string ; // 键
	CfgValue: string ; // 值
}
// 幻境类型
declare class Cfg_IllusionType {
	IsType: number ; // 幻境类型
	TabId: number ; // 标签Id
	Level: number ; // 困难等级
	PreIsType: number ; // 前置幻境类型
	Name: string ; // 幻境名字
	InstanceType: number ; // 副本战斗类型
	AllRD: number ; // 幻境副本总红点Id
	PrizeRD: number ; // 奖励红点Id
	SweepRD: number ; // 一键扫荡红点Id
	FuncId: number ; // 功能表功能Id
	Open: number ; // 是否启用
}
// 幻境页签
declare class Cfg_IllusionTab {
	TabId: number ; // 标签Id
	Name: string ; // 幻境名字
	TabRD: number ; // 幻境副本页签总红点Id
}
// 幻灵秘境类型
declare class Cfg_HuanLingInsType {
	Id: number ; // Id
	Name: string ; // 名字
	RedPointId: number ; // 红点Id
	TittleID: number ; // 抬头
}
// 幻灵秘境配置
declare class Cfg_HuanLingIns {
	Id: number ; // Id
	Name: string ; // 名字
	Type: number ; // 类型
	HLId: number ; // 幻灵Id
	Unlock: string ; // 解锁条件
	MapId: number ; // 地图ID
	PVP: number ; // 是否允许PVP
}
// 幻灵秘境配置
declare class Cfg_HuanLingBoss {
	Id: number ; // Id
	InsId: number ; // 秘境Id
	MonsterX: number ; // X坐标
	MonsterY: number ; // Y坐标
	BossId: number ; // BossId
	Fx: number ; // Boss朝向
	RefreshId: number ; // 刷新ID
	DropId1: number ; // 归属奖
	DropId2: number ; // 参与奖
	Reward1: number ; // 归属奖
	Reward2: number ; // 参与奖
	ReviveCD: number ; // 复活CD
}
// 幻灵技能配置
declare class Cfg_HuanLing_Skill {
	Id: number ; // 幻灵技能Id
	ObjId: number ; // 幻灵Id
	Name: string ; // 名称
	Desc: string ; // 技能描述
	IsSelf: number ; // 技能所属
	Type: number ; // 技能类型
	SkillId: number ; // 技能Id
	RoleSkillId: number ; // 人物技能Id
	UnlockItem: number ; // 解锁道具
	UnlockItemNum: number ; // 解锁道具数量
	Unlock: number ; // 解锁所需幻灵等级
	ItemId: number ; // 升级道具Id
	ItemNum: number ; // 升级道具基础数量
	ItemNumInc: number ; // 升级道具递增数量
	AttrBase: number ; // 基础属性
	AttrLevel: number ; // 每级递增属性
	MinLevel: number ; // 最小等级
	MaxLevel: number ; // 最大等级
}
// 幻灵灵武配置
declare class Cfg_HuanLing_LW {
	Id: number ; // 灵武Id
	Name: string ; // 灵武名称
	HLId: number ; // 所属幻灵
	AttrId: number ; // 属性Id
	UnlockItem: number ; // 解锁道具
	UnlockItemNum: number ; // 解锁道具数量
	Type: number ; // 技能类型
	SkillId: number ; // 技能Id
	Show: string ; // 灵武模型资源
}
// 幻灵灵武升阶
declare class Cfg_HL_LW_Level {
	Id: number ; // 序号Id
	LWld: number ; // 灵武Id
	HLId: number ; // 所属幻灵
	Level: number ; // 等阶
	AttrId: number ; // 等阶累加属性
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
}
// 幻灵等级配置
declare class Cfg_HuanLing_Level {
	Id: number ; // 序号Id
	HLld: number ; // 幻灵Id
	Level: number ; // 等级
	Exp: number ; // 升级所需经验值
	AttrId: number ; // 等级属性
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	DevourMax: number ; // 吞噬上限
}
// 幻灵配置
declare class Cfg_HLConfig {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 幻灵配置
declare class Cfg_HuanLing {
	Id: number ; // 幻灵Id
	Name: string ; // 幻灵名称
	PrevHLId: number ; // 前置幻灵
	Unlock: string ; // 解锁条件
	UnlockItem: number ; // 解锁道具
	UnlockItemNum: number ; // 解锁道具数量
	AttrId: number ; // 属性Id
	SkinId: number ; // 皮肤Id
	Tittle: string ; // 头像
	Weapon: number ; // 灵武Id
	Devour: number ; // 吞噬丹药Id
}
// 护送神女配置表
declare class Cfg_WestExp {
	Id: number ; // 序号
	ProTime: number ; // 护送倒计时(分钟)
	StartTime: string ; // 开启护送时间
	DoubleTime: string ; // 双倍时间
	QuickCost: string ; // 快速完成花费
	NormalRefresh: string ; // 普通刷新
	GoldRefresh: string ; // 一键刷橙
	Intercept: number ; // 拦截百分比
	VIPUnlockFunc: number ; // 一件刷红VIP限制
}
// 护送人物
declare class Cfg_WestBoss {
	Id: number ; // id
	Name: string ; // 人物名称
	Img: string ; // 人物图片
	Prize: string ; // 护送奖励
	NameImg: string ; // 名字图片
	Quality: number ; // 神女品质
}
// 护送祈福
declare class Cfg_WestPray {
	Id: number ; // 祈福id
	Name: string ; // 名称
	Img: string ; // 图片ID
	Icon: string ; // 人物头上标记图片ID
	Prize: number ; // 奖励加成万分比
	Protect: number ; // 被劫保护万分比
	Cost: string ; // 消耗道具及数量
}
// 护送奖励
declare class Cfg_WestPrize {
	Id: number ; // id
	LevelMin: number ; // 人物等级下限包含
	LevelMax: number ; // 人物等级上限包含
	Prize: string ; // 护送奖励
}
// 活动Banner
declare class Cfg_ActBanner {
	Id: number ; // ID
	Sort: number ; // 唯一值
	Value: number ; // 配置值
	FuncId: number ; // 跳转功能ID
	BgPic: string ; // banner底图的名字
	DesPic: string ; // banner图的描述文字图片的名字
	IconPic: string ; // banner图的icon图片的名字
	BgPic1: string ; // banner底图的名字
	DesPic1: string ; // banner图的描述文字图片的名字
	IconPic1: string ; // banner图的icon图片的名字
}
// 活动累充类Banner
declare class Cfg_ActTabPage {
	ActId: number ; // 活动ID
	ActType: number ; // 活动类别
	BrPath: string ; // banner资源地址
	Desc1: string ; // 倒计时后的描述值（有就显示无隐藏）
	Desc2: string ; // 活动描述
	Cartoon: string ; //
}
// 超级VIP客服配置
declare class Cfg_SurperVIPInfo {
	Index: number ; // 索引
	Id: number ; // 区服ID未配置的默认显示同渠道最小区服的配置
	ChannelId: string ; // 渠道编号
	WeiXin: string ; // 微信号
	QQ: string ; // QQ号
}
// 超级VIP渠道配置
declare class Cfg_SurperVIPChannel {
	ChannelId: number ; // 渠道编号
	TodayRecharge: number ; // 单日充值
	TotalRecharge: number ; // 历史累计充值
	Reward: string ; // 奖励
}
// 活动面板页签表
declare class Cfg_WinAct {
	Id: number ; // 面板ID主页活动id
	Title: string ; // 标题名称标题字
	Image: string ; // 选中图片切页按钮图片资源
	Mark: string ; // 角标切页按钮上的图标
	ActivityId: number ; // 包含活动id所属活动id
	TitleImg: string ; // 抬头标题名称图片名
	IsFuncCls: number ; // 是否是功能模板
}
// 筛子奖励配置
declare class Cfg_PlayDice_Reward {
	Id: number ; // 序号Id
	ActId: number ; // 活动id
	Floor: number ; // 层数
	Reward: string ; // 本层奖励
}
// 筛子活动道具配置
declare class Cfg_PlayDice {
	Id: number ; // 序号Id
	ActId: number ; // 活动Id
	Name: string ; // 活动名称
	ItemId: number ; // 消耗道具Id
	GoldType: number ; // 购买道具货币编号
	GoldNum: number ; // 购买道具消耗数量
	FreeTimes: number ; // 每日免费次数
	Type: number ; // 道具类型
	AniId: number ; // 动画id
}
// 筛子活动配置
declare class Cfg_PlayDice_Item {
	Id: number ; // 序号Id
	ActId: number ; // 活动id
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	Sort: number ; // 排序
	Quality: number ; // 品质
	IsImprint: number ; // 是否是印记
}
// 主题活动奖品
declare class Cfg_ActTheme2Reward {
	Id: number ; // 序号Id
	ActId: number ; // 活动Id
	Type: number ; // 奖池类型
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	PrizeType: number ; // 奖励类型
	OddClient: string ; // 抽中概率
	Sort: number ; // 排序
}
// 主题活动3配置
declare class Cfg_ActTheme3Cfg {
	ActId: number ; // 活动ID
	RechargeRMB: number ; // 每充值X元可获得积分
	RechargePoint: number ; // 每次可获得X积分
	TaskPoint: number ; // 快速完成任务消耗X积分
	UnlockGoodsId: number ; // 激活购买商品Id不同类型不能重复
	DiscountUnlockGoodsId: number ; // 打折后的激活购买商品Id
	UnlockCost: number ; // 激活购买商品价格（显示用）
	DiscounUnlockCost: number ; // 激活购买商品价格（显示用）
	PointName: string ; // 积分名称（用于前端显示和错误提示）
	TaskName: string ; // 任务列表名称(显示用)
}
// 主题活动3资源
declare class Cfg_ActTheme3Bg {
	ActId: number ; // 活动ID
	ActName: string ; // 活动名称
	BgName1: string ; // 任务界面背景图
	BgName2: string ; // 任务界面进度条背景图
	BgName3: string ; // 任务界面进度条底图
	BgName4: string ; // 任务界面进度条奖励底图
	BgName5: string ; // 任务界面大奖背景图
	BgName6: string ; // 任务界面任务列表背景图
	BgName7: string ; // 任务界面亮按钮
	BgName8: string ; // 任务界面暗按钮
	BtnName1: string ; // 派对界面激活/领取按钮背景图
	BtnLabelColor1: string ; // 派对界面激活/领取按钮字颜色
	BtnLabelOutLine1: string ; // 派对界面激活/领取按钮字描边
	BgName9: string ; // 大奖界面背景图
	BgName10: string ; // 任务关闭按钮
	Color1: string ; // 任务倒计时描边
	Color2: string ; // 任务描述1
	Color3: string ; // 任务描述2
	Color4: string ; // 任务按钮亮
	Color5: string ; // 任务按钮暗
	Color6: string ; // 大奖描述描边
	Color7: string ; // 派对值
	moveX: number ; // 描述移动坐标
	moveY: number ; // 描述移动坐标
	RewardDesc: string ; // 奖励描述
	showReturn: number ; // 派对界面是否显示返回按钮
	isDiscount: number ; // 是否显示惊爆价
}
// 主题活动
declare class Cfg_ActTheme2 {
	Id: number ; // 序号ID
	ActId: number ; // 活动ID
	Type: number ; // 奖池类型
	Name: string ; // 活动名称
	ItemCost: string ; // 道具消耗
	Integral: number ; // 积分
	Item: string ; // 获得道具
	Lucky: number ; // 幸运值
	LuckTips: string ; // 获奖提示
}
// 幸运概率
declare class Cfg_ActTheme2Lucky {
	Id: number ; // 序号Id
	ActId: number ; // 活动Id
	Type: number ; // 奖池类型
	LuckyMin: number ; // 最小值
	LuckyMax: number ; // 最大值
	LuckyProb: number ; // 幸运概率（万分比）
}
// 仙装收集表
declare class Cfg_ActGodSuit {
	ActId: number ; // 活动ID
	ItemID: string ; // 道具ID
	AId: number ; // 形象ID
	ShowType: number ; // 展示类型类型1：青春飞絮类型；默认展示4个选择按钮，集齐部件为6件类型2：侠骨柔性类型，默认不展示选择按钮，集齐部件为4件
	BgSpr: string ; // 背景图资源
	RolePosY: number ; // 人物形象Y轴位置
}
// 活动任务表
declare class Cfg_ActTask {
	Id: number ; // 任务ID
	Type: number ; // 活动ID
	Name: string ; // 任务名（程序在用的）
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID、系统类型）
	TargetCount: number ; // 任务完成条件
	ServerCountType: number ; // 全服累计值类型
	ServerCount: number ; // 全服累计值
	GroupPrize: number ; // 奖励组
	Prize: string ; // 完成任务奖励方案id数组
	Order: number ; // 任务排序序号
	Group: number ; // 轮循组ID
	ClientFuncId: number ; // 新功能开放表功能id
	AnimId: string ; // 各种资源ID用于前端显示界面从上往下所需的所有资源ID，用|分割
	RevelValue: number ; // 狂欢值
	ShowCond: number ; // 显示条件：任务ID此字段有值时，完成填写任务才会显示该任务
}
// 每日分享任务表
declare class Cfg_DayShareActTask {
	Id: number ; // 任务ID
	Type: number ; // 活动ID
	Name: string ; // 任务名（程序在用的）
	RefreshType: number ; // 任务刷新类型(1每天刷新 2每周刷新)
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID、系统类型）
	TargetCount: number ; // 任务完成条件
	ServerCountType: number ; // 全服累计值类型
	ServerCount: number ; // 全服累计值
	GroupPrize: number ; // 奖励组
	Prize: string ; // 完成任务奖励方案id数组
	Order: number ; // 任务排序序号
	Group: number ; // 轮循组ID
	ClientFuncId: number ; // 新功能开放表功能id
	AnimId: string ; // 各种资源ID用于前端显示界面从上往下所需的所有资源ID，用|分割
	RevelValue: number ; // 狂欢值
	ShowCond: number ; // 显示条件：任务ID此字段有值时，完成填写任务才会显示该任务
}
// 活动礼包新
declare class Cfg_ActGiftNew {
	GoodID: number ; // 商品id
	GoodName: string ; // 商品名字
	GoodType: number ; // 商品类型
	GoodList: string ; // 商品Id列表
	GroupPrize: number ; // 奖励组
	ItemStr: string ; // 礼包内容
	ActId: number ; // 活动数据库id
	CostType: number ; // 消耗道具类型
	CostNum: number ; // 实际购买价格
	Price: number ; // 原价
	Items: string ; // 兑换道具
	DayLimitId: number ; // 单日限制次数
	LifeLimitId: number ; // 终身限制次数
	LimConId: number ; // 限制条件Id
	LimConDes: string ; // X限制条件描述
	Sort: number ; // 排序
	IsShow: number ; // 是否在流年仙阁中显示
	ShopShowDays: number ; // 商城中的天数限制
}
// 活动充值转盘
declare class Cfg_ActReTurntab {
	ActId: number ; // 活动id
	MoneyCount: number ; // 充值
	MoneyPoint: number ; // 充值
}
// 活动充值转盘道具
declare class Cfg_ActReTurntabItem {
	Id: number ; // ID
	ActId: number ; // 活动id
	SortId: number ; // 序号
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	OddClient: string ; // 抽中概率
}
// 活动充值转盘奖励
declare class Cfg_ActReTurntabRewad {
	Id: number ; // ID
	ActId: number ; // 活动id
	MoneyPoint: number ; // 财富点
	Prize: string ; // 奖励
}
// 遗迹探秘层级配置
declare class Cfg_Ruins_Floor {
	Id: number ; // 序号Id
	ActId: number ; // 活动Id
	Name: string ; // 活动名称
	Item: string ; // 消耗道具
	Min: number ; // 最小层数
	Max: number ; // 最大层数
	LimitMin: number ; // 大奖限制
	LimitMax: number ; // 大奖限制
	Rewards: string ; // 大奖集合
	Prob: number ; // 大奖权重
	Triple: number ; // 三倍权重
	Double: number ; // 双倍权重
	Funcs: string ; // 大奖涉及系统功能Id
}
// 遗迹探秘奖励配置
declare class Cfg_Ruins_Grid {
	ActId: number ; // 活动Id
	Id: number ; // 格子Id
	Name: string ; // 活动名称
	Item: string ; // 格子奖励
}
// 遗迹探秘奖励概率
declare class Cfg_Ruins_Odd {
	Id: number ; // 顺序ID
	Name: string ; // 奖励名称
	OddClient: string ; // 概率
}
// 合服首战奖品配置
declare class Cfg_MergeFirst {
	Id: number ; // 奖品ID
	Func_Type: number ; // 功能类型
	Reward_Type: number ; // 奖品类型
	Reward: string ; // 奖品配置
	Act_Name: string ; // 活动名称
	Prize_Name: string ; // 奖励名称
}
// 许愿树
declare class Cfg_ActWishTree {
	Id: number ; // 序号ID
	ActId: number ; // 活动ID
	Name: string ; // 活动名称
	Type: number ; // 奖池类型
	ItemId: number ; // 道具ID
	ItemNum: number ; // 道具数量
	Weight: number ; // 权值
	MinDay: number ; // 开服天数
	MaxDay: number ; // 开服天数
	TagType: number ; // 道具类型
}
// 神兽PK道具配置
declare class Cfg_CampItem {
	Id: number ; // 序号ID
	ActId: number ; // 活动Id
	ItemId: number ; // 道具Id
	Score: number ; // 积分
	Name: string ; // 名称
	FunId: number ; // 获取道具跳转功能id(和GoldType互斥)
	Model: string ; // 模型展示配置
	AName: string ; // 名称
	BName: string ; // 名称
	AWin: string ; // A神兽胜者奖励
	AFail: string ; // A神兽败者奖励
	BWin: string ; // B神兽胜者奖励
	BFail: string ; // B神兽败者奖励
	RewardDsc: string ; // 奖励预览页面描述文字
}
// 1元神兽
declare class Cfg_1RMBPet {
	Id: number ; // 序号ID
	ActId: number ; // 活动ID
	PetId: number ; // 宠物ID
	PetName: string ; // 宠物名称
	Amount: number ; // 开奖份额
	LimitAmount: number ; // 玩家购买份额上限
	PetCycle: number ; // 刷新周期(单位:时)
	PublicityTime: number ; // 开奖公示时间(单位:秒)
	Items: string ; // 大奖
}
// 普天同庆
declare class Cfg_PuTianTongQing {
	ActId: number ; // 活动Id
	Name: string ; // 活动名称
	Types: number ; // 类型
	Day: number ; // 天数
	MinDay: number ; // 最小开服天数
	MaxDay: number ; // 最大开服天数
	Items: string ; // 道具ID和数量
	BrPath: string ; // 当日奖励的大图放置在页面中
}
// 一路有你
declare class Cfg_YiLuYouNi {
	ActId: number ; // 活动Id
	Name: string ; // 活动名称
	MinDay: number ; // 最小创角天数
	MaxDay: number ; // 最大创角天数
	Items: string ; // 道具ID和数量
}
// 周年时光机
declare class Cfg_YearTimer {
	GoodID: number ; // 商品id与充值商城表ID对应
	GoodName: string ; // 商品名字
	CostNum: number ; // 实际购买价格
	Price: number ; // 原价
	Contains: string ; // 包含道具
	Items: string ; // 兑换道具
	SkinId: number ; // 皮肤展示ID
	ActId: number ; // 活动数据库id
}
// 活动商店
declare class Cfg_ActShop {
	GoodID: number ; // ID
	Name: string ; // 礼包名称
	ItemStr: string ; // 礼包内容
	CostItemId: number ; // 消耗道具Id
	Price: number ; // 原价
	CostItemNum: number ; // 实际购买价格
	DisCount: number ; // 折扣
	Spike: number ; // 秒杀
	Sort: number ; // 排序
	LimitTimeID: number ; // 限制次数id
	LimConID: number ; // 限制条件id
	MinDay: number ; // 显示-开服天数
	MaxDay: number ; // 显示-开服天数
	ActId: number ; // 活动ID
	Group: number ; // 轮询组Id
	LimConDes: string ; // 限制条件中文描述
	ReturnDay: number ; // 第N天返利
	Params: string ; // 展示参数
	LimDayCon: number ; // [仅限1天]图片资源是否显示
}
// 福袋
declare class Cfg_FuDai {
	ActId: number ; // 活动Id
	LittleName: string ; // 小福袋名称
	Types: number ; // 类型
	Id: number ; // 福袋编号
	BuyType: number ; // 类型
	CostItems: string ; // 消耗道具
	GoodsId: number ; // 充值商品ID
	DayLimit: number ; // 单日购买次数限制
	LifeLimit: number ; // 终身购买次数限制
	RewardItems: string ; // 道具ID和数量
	ShowDropItems: string ; // 展示概率掉落(道具ID:数量:权重) 显示概率=权重/10000+%
	Desc: string ; // 描述
}
// 烟花之夜
declare class Cfg_Night {
	ActId: number ; // 活动Id
	LittleName: string ; // 小烟花名称
	Id: number ; // 烟花编号
	CostItems: string ; // 消耗道具
	FixedItems: string ; // 固定道具ID和数量
	ShowDropItems: string ; // 展示概率掉落(道具ID:数量:权重) 显示概率=权重/10000+%
	DropId: number ; // 掉落ID
	Showeffect: string ; // 烟花播放的动画
	Showpics: string ; // 烟花配置的图片
}
// 宠物大师组数据
declare class Cfg_PetMaster {
	ActId: number ; // 活动ID
	GroupName: string ; // 任务组名称
	GroupIcon: number ; // 任务组icon（圆）
	PrizeText: string ; // 任务组文本描述
	QulityColor: number ; // icon+文本描述颜色填品质值
	ShowAnimaID: number ; // 展示形象animaID
}
// 助力寻宝
declare class Cfg_ActXunBaoHelp {
	Id: number ; // ID
	ActId: number ; // 活动id
	ItemType: number ; // 抽奖类型
	SortId: number ; // 序号
	ExtParam: number ; // 额外参数
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	PrizeType: number ; // 奖励类型
	PrizeParam: number ; // 奖励参数
	Odd: number ; // 抽中概率
	OddClient: string ; // 抽中概率TIPS展示
	Sort: number ; // 抽中概率tip排序
	Quality: number ; // 奖品品质
	Category: number ; // 奖品角签
	AddNotice: number ; // 是否加公告
}
// 心愿库
declare class Cfg_ActXBWishList {
	Id: number ; // Id
	Group: number ; // 心愿组
	ItemId: number ; // 道具Id
	WishItemShow: string ; // 心愿道具展示类型|参数
	ItemNum: number ; // 道具数量
	FuncId: number ; // 功能Id
	Multiple: number ; // 是否可重复选取
	Times: number ; // 保底次数
	MinDay: number ; // 天数
	MaxDay: number ; // 天数
}
// 神龙许愿
declare class Cfg_ActXunBaoDragon {
	Id: number ; // ID
	ActId: number ; // 活动id
	ItemType: number ; // 抽奖类型
	SortId: number ; // 序号
	ExtParam: number ; // 额外参数
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	PrizeType: number ; // 奖励类型
	PrizeParam: number ; // 奖励参数
	IsHot: number ; // 是否是热点道具
	Odd: number ; // 抽中概率
	Odd1: number ; // 热点模式抽中概率
	OddClient: string ; // 抽中概率TIPS展示
	OddClient1: string ; // 抽中概率TIPS展示
	Sort: number ; // 抽中概率tip排序
	Quality: number ; // 奖品品质
	Category: number ; // 奖品角签
	AddNotice: number ; // 是否加公告
	MinDay: number ; // 天数
	MaxDay: number ; // 天数
}
// 仙玉夺宝
declare class Cfg_ActXianYuDuoBao {
	Id: number ; // ID
	ActId: number ; // 活动id
	ItemType: number ; // 抽奖类型
	SortId: number ; // 序号
	ExtParam: number ; // 额外参数
	ItemId: number ; // 道具Id
	Alias: string ; // 道具别名
	ItemNum: number ; // 道具数量
	PrizeType: number ; // 奖励类型
	PrizeParam: number ; // 奖励参数
	Odd: number ; // 常规抽中概率
	Odd1: number ; // 奖池选项抽水阶段抽中概率
	Odd2: number ; // 奖池选项放水阶段抽中概率
	OddClient: string ; // 抽中概率TIPS展示
	Sort: number ; // 抽中概率tip排序
	Quality: number ; // 奖品品质
	Category: number ; // 奖品角签
	AddNotice: number ; // 是否加公告
	MinDay: number ; // 天数
	MaxDay: number ; // 天数
}
// 活动宠物寻宝
declare class Cfg_ActXunBaoPet {
	Id: number ; // ID
	ActId: number ; // 活动id
	ItemType: number ; // 抽奖类型
	SortId: number ; // 序号
	ExtParam: number ; // 额外参数
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	PrizeType: number ; // 奖励类型
	PrizeParam: number ; // 奖励参数
	IsHot: number ; // 是否是热点道具
	Odd: number ; // 抽中概率
	Odd1: number ; // 奖池选项抽水阶段抽中概率
	Odd2: number ; // 奖池选项放水阶段抽中概率
	OddClient: string ; // 抽中概率
	OddClient1: string ; // 抽中概率
	Sort: number ; // 概率tip排序
	Quality: number ; // 奖品品质
	Category: number ; // 奖品角签
	AddNotice: number ; // 是否加公告
	MinDay: number ; // 天数
	MaxDay: number ; // 天数
}
// 技能书寻
declare class Cfg_ActXunBaoSkillBook {
	Id: number ; // ID
	ActId: number ; // 活动id
	ItemType: number ; // 抽奖类型
	SortId: number ; // 序号
	ExtParam: number ; // 额外参数
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	PrizeType: number ; // 奖励类型
	PrizeParam: number ; // 奖励参数
	Odd: number ; // 抽中概率
	OddClient: string ; // 抽中概率TIPS展示
	Sort: number ; // 抽中概率tip排序
	Quality: number ; // 奖品品质
	Category: number ; // 奖品角签
	AddNotice: number ; // 是否加公告
}
// 寻宝积分兑换表
declare class Cfg_ActXunExchange {
	Id: number ; // ID
	ActId: number ; // 活动id
	ActName: string ; // 活动名称程序不用，检测用活动id
	SortId: number ; // 序号
	ItemStr: string ; // 兑换内容
	NeedScore: number ; // 单个道具兑换所需积分
	LimTimeID: number ; // 限制次数id
}
// 活动寻宝表
declare class Cfg_ActXunBao {
	Id: number ; // 活动ID
	Desc: string ; // 活动备注（策划用）
	Name: string ; // 活动名称
	XBType: number ; // 寻宝类型
	WhId: number ; // 收益仓库Id
	ExchangeDesc: string ; // 消耗之后给与玩家的物品
	OneTimeItemId: number ; // 寻宝1次消耗道具Id
	GoldType: number ; // 购买道具货币编号
	GoodsPrice: number ; // 不打折价格
	GoldBuyItem: number ; // 1：货币不可以购买道具0或不填：货币可以购买道具
	WishGroup: number ; // 心愿库
	BuyTimes: number ; // 心愿抽奖货币购买次数
	RecoverTime: number ; // 心愿抽奖免费次数恢复CD单位：s
	FiftyTimeDiscount: number ; // 寻宝50次的折扣
	TenTimeDiscount: number ; // 寻宝10次的折扣
	DoubleDay: string ; // 开服第X天到Y天双倍奖励
	Items: string ; // 寻宝一次获得的道具
	MaxKeepFree: number ; // 免费次数最大保有量
	MaxAmount: number ; // 奖池上限
	OncePercent: number ; // 单次抽取金额百分比
	RelatedCfg: string ; // 查头像关联的表名
	FndBg: string ; // 寻宝背景图资源
	FndTile: string ; // 宝物预览预览走马灯前方的美术字（竖排列）
	FndBtnName: string ; // 寻宝按钮名字
	FndFen: string ; // 积分名字
	SngTitle: string ; // 积分转盘的slogan图填slogan 资源名
	SngItemIcon: string ; // 积分转盘消耗道具icon ID
	FndTemplate: number ; // 模板类型
	ExChRedId: number ; // 兑换功能红点id
	ExChFunId: number ; // 兑换功能id
}
// 心愿寻宝
declare class Cfg_ActXunBaoWish {
	Id: number ; // ID
	ActId: number ; // 活动id
	ItemType: number ; // 抽奖类型
	SortId: number ; // 序号
	ExtParam: number ; // 额外参数
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	PrizeType: number ; // 奖励类型
	PrizeParam: number ; // 奖励参数
	Odd: number ; // 抽中概率
	OddClient: string ; // 抽中概率TIPS展示
	Sort: number ; // 抽中概率tip排序
	Quality: number ; // 奖品品质
	Category: number ; // 奖品角签
	AddNotice: number ; // 是否加公告
	MinDay: number ; // 天数
	MaxDay: number ; // 天数
}
// 新活动寻宝
declare class Cfg_ActXunBaoNew {
	Id: number ; // ID
	ActId: number ; // 活动id
	ItemType: number ; // 抽奖类型
	SortId: number ; // 序号
	ExtParam: number ; // 额外参数
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	PrizeType: number ; // 奖励类型
	PrizeParam: number ; // 奖励参数
	Odd: number ; // 抽中概率
	OddClient: string ; // 抽中概率TIPS展示
	Sort: number ; // 抽中概率tip排序
	Quality: number ; // 奖品品质
	Category: number ; // 奖品角签
	AddNotice: number ; // 是否加公告
	MinDay: number ; // 天数
	MaxDay: number ; // 天数
}
// 活动天仙寻宝
declare class Cfg_ActXunBaoPeta {
	Id: number ; // ID
	ActId: number ; // 活动id
	ItemType: number ; // 抽奖类型
	SortId: number ; // 序号
	ExtParam: number ; // 额外参数
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	PrizeType: number ; // 奖励类型
	PrizeParam: number ; // 奖励参数
	Odd: number ; // 抽中概率
	OddClient: string ; // 抽中概率
	Sort: number ; // 概率tip排序
	Quality: number ; // 奖品品质
	Category: number ; // 奖品角签
	AddNotice: number ; // 是否加公告
}
// 累充额度档位
declare class Cfg_TRGear {
	ActId: number ; // 活动Id
	Name: string ; // 活动名称
	Gear: number ; // 档位
	Amount: number ; // 额度
	Times: number ; // 次数
}
// 累充返利转盘
declare class Cfg_TRRT {
	Id: number ; // 序号
	ActId: number ; // 活动Id
	Name: string ; // 活动名称
	Gear: number ; // 档位
	ItemId: number ; // 道具ID
	ItemNum: number ; // 道具数量
	Quality: number ; // 道具品质
	Odd: number ; // 抽中概率
	OddClient: string ; // 抽中概率TIPS展示
	ShowPos: number ; // 位置
}
// 活动排行榜表
declare class Cfg_ActRank {
	Id: number ; // 活动ID此列的数值必须与活动数据库的活动ID一一对应
	Name: string ; // 排行榜名称
	RankType: number ; // 排行榜类型
	Param: number ; // 排行榜参数
	ParamClient: number ; // 排行榜参数(前端使用)
	GradeType: number ; // 排行榜升阶类型
	RankCond: number ; // 上榜条件
	RankAll: number ; // 排行总名次
	FuncId: number ; // 功能跳转
	PushRank: number ; // 推送排行榜
	TomActId: number ; // 下一天活动
}
// 活动排行榜奖励表
declare class Cfg_ActRankPrize {
	Id: number ; // ID
	ActId: number ; // 活动ID此列的数值必须与活动数据库的活动ID一一对应
	BasicsAbility: number ; // 气泡提醒触发战力值
	RankLimit: number ; // 名次积分限制
	AssistsLimit: number ; // 多人冲榜的助攻上榜条件
	RankMin: number ; // 排名下限（包含）
	RankMax: number ; // 排名上限（包含）
	GroupPrize: number ; // 奖励组
	BasePrize: string ; // 基础奖励道具ID:数量|
	AddPrize: string ; // 附加奖励满足特殊条件才可以领取道具ID:数量|
	Condition: number ; // 附加奖励领取条件ID限制条件表ID
	PrizeTitle: string ; // 附加奖励的条件的文字说明（前端显示）
	PrizeContent: string ; // 附加奖励的内容的文字说明（前端显示）
	GroupPrize2: number ; // 多人冲榜的助攻奖励组
	AssistsPrize: string ; // 多人冲榜的助攻奖励
}
// 多人冲榜打赏
declare class Cfg_ActRushRankGive {
	ActId: number ; // 活动id
	GiveRankID: number ; // 赠送榜ID
	ReceiveRankID: number ; // 获得榜ID
	ThemeItemID: number ; // 打赏主体道具
	BannerIcon: string ; // 首页bannert图上的icon
	RushSex: number ; // 冲榜性别
	HelpDesc: string ; // 助攻描述
	HelpLogD: string ; // 赠送信息描述
	BannerUrl: string ; // 首页banner图
	ThemeIcon: string ; // 赠送页icon图标
	ThemeBg: string ; // 赠送界面背景
	ThemeItemBg1: string ; // 赠送页推荐人背景1
	ThemeItemBg2: string ; // 赠送页推荐人背景2
	Tag1: string ; // 展示标签
	Tag2: string ; // 展示标签
	Tag3: string ; // 展示标签
	PriceBanner: string ; // 奖励预览榜单banner
	PriceTti: string ; // 奖励预览榜单标题
	MHelpSlider: string ; // 主榜上助攻得边框图片
}
// 活动投资计划表
declare class Cfg_ActInvest {
	ActId: number ; // 活动ID
	Desc: string ; // 投资备注（策划用）
	Name: string ; // 投资名称
	AnimId: number ; // 顶部图片资源ID
	Times: number ; // 返利倍数
	UseYuan: number ; // 是否使用人民币购买
	NeedItemId: number ; // 购买消耗道具ID
	NeedItemNum: number ; // 购买消耗道具数量
	NeedVipLevel: number ; // 购买所需VIP等级
	RebateItems: string ; // 百倍返利1、2banner最下方返利道具显示参数
}
// 活动拼图表
declare class Cfg_AcPicturet {
	ActId: number ; // 活动ID
	Desc: string ; // 备注（程序不用
	PicAnimId: number ; // 顶部图片资源ID
	PartCount: number ; // 部位数量
	PartAnimId: string ; // 每个部位对应的图片资源ID数组用“|”分割个数需与部位数量相同
	PartItem: string ; // 每个部位对应的碎片道具ID
	StickCount: number ; // 点亮单个部位所需碎片数量
	PartPrize: number ; // 点亮单个部位随机奖励掉落ID
	Prize: number ; // 最终奖励道具ID
	Intro: number ; // 玩法介绍
}
// 推送礼包条件
declare class Cfg_PushGiftCondition {
	Id: number ; // 唯一ID
	Name: string ; // 礼包名
	Type: number ; // 类别
	Condition: number ; // 条件
	Param1: number ; // 参数1
	Param2: number ; // 参数2
	OpenDayStart: number ; // 本服开服天数开始
	OpenDayEnd: number ; // 本服开服天数结束
	UnionOpenDayStart: number ; // 连服开服天数开始
	UnionOpenDayEnd: number ; // 连服开服天数结束
	IconSrc: string ; // 图标资源名称
	TimeType: number ; // 时间类型
	GiftType: number ; // 礼包类型
	GiftId: number ; // 礼包ID
	ShowTime: number ; // 展示时间（秒）
	ChatTips: string ; // 展示提示
	Ratio: string ; // 超值比例
	LimitVip: number ; // 礼包限制vip
}
// 推送礼包列表
declare class Cfg_PushGiftList {
	GoodID: number ; // ID
	Name: string ; // 礼包名称
	ItemStr: string ; // 礼包内容
	CostItemId: number ; // 消耗道具Id
	Price: number ; // 原价
	CostItemNum: number ; // 实际购买价格
	DisCount: number ; // 折扣
	Spike: number ; // 秒杀
	Sort: number ; // 排序
	LimitTimeID: number ; // 限制次数id
	LimConID: number ; // 限制条件id
	ActId: number ; // 活动ID
	Group: number ; // 轮询组Id
	LimConDes: string ; // 限制条件中文描述
	ReturnDay: number ; // 第N天返利
	Params: string ; // 展示参数
	LimDayCon: number ; // [仅限1天]图片资源是否显示
}
// 活动图标整合
declare class Cfg_ActMore {
	Id: number ; // 序号id
	ActId: string ; // 活动id列表
	ActType: number ; // 活动类型（10000）
	Icon: number ; // 界面活动图标
	Order: number ; // 排序（跟活动排序公用）
	Pos: number ; // 活动图标显示界面区域位置
	OnceCircle: number ; // 显示光效是否是一次性的，如果不为0，点击一次后光效消失
	PosCircle: number ; // 界面区域是否显示旋转光圈填特效id如不填则代表无光圈
}
// 购买次数
declare class Cfg_CelebrateShopBuyTimes {
	Id: number ; // 序号ID
	MinDay: number ; // 开服最小天数
	MaxDay: number ; // 开服最大天数
	Times: number ; // 购买次数
}
// 购买次数
declare class Cfg_CelebrateShopBglmg {
	GoodID: number ; // 商品id与充值商城表ID对应
	AdvImg: string ; // 广告语资源ID
	BgImg: string ; // 背景资源ID
	PrizeShow: string ; // 展示类型和资源
}
// 活动渠道屏蔽
declare class Cfg_ActChannel {
	ActId: number ; // 活动ID
	Desc: string ; // 备注
	ShowChannel: string ; // 显示渠道类型编码多个渠道之间用 | 分割
}
// 祭拜道具消耗
declare class Cfg_Worship_Cost {
	ActId: number ; // 活动Id
	ItemId: number ; // 祭拜1次消耗道具Id
	ItemNum: number ; // 单次使用数量
	Name: string ; // 名称
	GoldType: number ; // 购买道具货币编号
	GoodsPrice: number ; // 不打折价格
	FunId: number ; // 获取道具跳转功能id(和GoldType互斥)
}
// 祭拜抽奖
declare class Cfg_Worship_Draw {
	Id: number ; // 序号Id
	ActId: number ; // 活动Id
	Type: number ; // 奖池类型
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	PrizeType: number ; // 奖励类型
	OddClient: string ; // 抽中概率
	Sort: number ; // 排序
}
// 祭拜活动
declare class Cfg_Worship {
	Id: number ; // Id
	ActId: number ; // 活动Id
	Name: string ; // 名称
	Power: number ; // 能量值
	Speed: number ; // 虔诚之心
	ObjType: number ; // 道具ID对应的类型
	ObjId: number ; // 展示形象的归属道具ID
	AniPath: string ; // 本地动画的资源地址
	AniPath1: string ; // 远程动画资源名称
	AniName: string ; // 动画名称
	ProName: string ; // 祭拜效果的进度名称
	AwardName: string ; // 奖励人的图片名称
	SkillName: string ; // 大招的图片名称
}
// 祭拜活动进阶
declare class Cfg_Worship_Step {
	Id: number ; // 序号Id
	WorshipId: number ; // 祭拜对象Id
	ActId: number ; // 活动Id
	Step: number ; // 阶段
	MinScore: number ; // 最小进度值
	MaxScore: number ; // 最大进度值
	Reward1: string ; // 达标奖励
	Reward2: string ; // 虔诚奖励
	Reward3: string ; // 诚心奖励
	GroupPrize1: number ; // 达标-奖励组
	GroupPrize2: number ; // 虔诚-奖励组
	GroupPrize3: number ; // 诚心-奖励组
}
// 充值档位
declare class Cfg_RechargeGear {
	ActId: number ; // 活动Id
	Name: string ; // 活动名称
	Gear: number ; // 档位
	Amount: number ; // 额度
	Basic: number ; // 基数
	Times: number ; // 次数
	ItemId: number ; // 道具ID
}
// 充值返利转盘
declare class Cfg_RebateTurntab {
	Id: number ; // 序号
	ActId: number ; // 活动Id
	Name: string ; // 活动名称
	Gear: number ; // 档位
	Multiple: number ; // 返还倍率(万分比)
	Odd: number ; // 抽中概率
	OddClient: string ; // 抽中概率TIPS展示
	ShowPos: number ; // 位置
}
// 活动转盘
declare class Cfg_ActTurntabItem {
	Id: number ; // ID
	ActId: number ; // 活动id
	SortId: number ; // 序号
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	Odd: number ; // 抽中概率
	OddClient: string ; // 抽中概率
	TurnGroup: number ; // 选项组
}
// 活动转盘积分挡位
declare class Cfg_ActTurntabGear {
	Id: number ; // 序号id
	ActId: number ; // 活动id
	Gear: number ; // 挡位
	Integral: number ; // 积分
	Prize: string ; // 档位奖励
}
// 通行证任务
declare class Cfg_ActPassCheckTask {
	Id: number ; // 任务ID
	ActTaskId: number ; // 通行证任务活动ID
	Group: number ; // 任务组ID
	Type: number ; // 是否是每日刷新任务40：阶段任务每日刷新41：赛季任务42: 全民福利任务
	Desc: string ; // 任务标题
	Name: string ; // 任务详细名称
	CounterType: number ; // 任务计数类型
	Param: number ; // 任务计数类型参数
	Independent: number ; // 是否独立计数
	TargetCount: number ; // 任务完成条件
	Exp: number ; // 奖励经验值
	Prize2: string ; // 道具奖励全民福利用到
	Order: number ; // 排序号
	ClientFuncId: number ; // 客户端功能跳转ID
}
// 通行证
declare class Cfg_ActPassCheck {
	ActId: number ; // 通行证活动ID
	ActTaskId: number ; // 通行证任务活动ID
	SessionInternal: number ; // 赛季持续天数
	GoodsId: number ; // 金令解锁对应商品Id
	BuyMax: number ; // 购买经验可达到最大等级
	AddBuyInternal: number ; // 增加假的购买人数间隔时间（秒）
	AddBuyRate: number ; // 增加假的购买人数概率万分比
	AddBuyMax: number ; // 增加假的购买人数最大上限
	ExpBox: number ; // 金令每日额外经验包奖励经验值
}
// 通行证等级
declare class Cfg_ActPassCheckLevel {
	ActId: number ; // 通行证活动ID
	Group: number ; // 奖励轮循组ID
	Level: number ; // 等级
	Prize1: string ; // 普通奖励
	Prize2: string ; // 金令奖励
	Exp: number ; // 上一级升到此级所需经验
	BuyLevelCost: string ; // 上一级购买到此级所需货币id:数量
	ShowBigPrize: number ; // 此级奖励是否为节点奖励同时需要展示到大奖
	ShowModel: number ; // 此等级的金令奖励道具展示为大奖模型
}
// 阵营宝箱数量配置
declare class Cfg_CampBox {
	Id: number ; // 序号ID
	Score: number ; // 分段
	Num: number ; // 数量
}
// 阵营PK配置
declare class Cfg_CampPK {
	Id: number ; // 序号ID
	ActId: number ; // 活动Id
	ABoxId: number ; // 宝箱Id
	BBoxId: number ; // 宝箱Id
	AName: string ; // 名称
	BName: string ; // 名称
	AModel: string ; // 模型展示配置
	BModel: string ; // 模型展示配置
	EndTime: string ; // 结算时间
}
// 首充
declare class Cfg_ActFirstRecharge {
	Id: number ; // 编号
	Day: number ; // 天数
	ItemStr: string ; // 礼包内容
}
// 首充新
declare class Cfg_ActFirstRecharge2 {
	Id: number ; // 编号
	Type: number ; // 类型
	Day: number ; // 天数
	ItemStr: string ; // 礼包内容
}
// 累充豪礼领三天
declare class Cfg_TotalRecharge {
	Id: number ; // 编号
	Stage: number ; // 档位
	Recharge: number ; // 累充金额
	Day: number ; // 天数
	ItemStr: string ; // 礼包内容
	ResId: string ; // 资源id
	ResType: number ; // 资源类型
	AniType: number ; // 动画展示类型
}
// 首冲投资
declare class Cfg_FirstRechargeInvest {
	Id: number ; // 编号
	Min: number ; // 最小金额
	Max: number ; // 最大金额
	Ratio: number ; // 返利比例
}
// 首冲通用配置
declare class Cfg_ActFirstRechargeCfg {
	CfgKey: string ; // 唯一值
	CfgValue: string ; // 配置值
	STRING: string ; // 说明
}
// 运营活动入口表）
declare class Cfg_ActivityOld1 {
	Id: number ; // 活动模板ID不重复勿动
	Name: string ; // 活动名称
	Duration: string ; // 持续时间
	OnceCircle: number ; // 显示光效是否是一次性的，如果不为0，点击一次后光效消失
	PosCircle: number ; // 界面区域是否显示旋转光圈填特效id如不填则代表无光圈
	ContainerId: number ; // 所属活动容器活动ID
	ContainerCircle: number ; // 处于活动容器是否显示旋转光圈填特效id如不填则代表无光圈
}
// 运营活动入口表
declare class Cfg_ActivityCircleOld2 {
	Id: number ; // 活动模板ID不重复勿动
	OnceCircle: number ; // 显示光效是否是一次性的，如果不为0，点击一次后光效消失
	PosCircle: number ; // 界面区域是否显示旋转光圈填特效id如不填则代表无光圈
	ContainerCircle: number ; // 处于活动容器是否显示旋转光圈填特效id如不填则代表无光圈
}
// 活动达标奖励配置
declare class Cfg_ActReachReward {
	Id: number ; // Id
	ActId: number ; // 活动Id
	Type: number ; // 类型
	Param: number ; // 功能参数
	Score: number ; // 积分积分达标后，可领取
	GroupPrize: number ; // 奖励组
	Items: string ; // 奖励
}
// 活动配置
declare class Cfg_ActCfg {
	CfgKey: string ; // 唯一值
	CfgValue: string ; // 配置值
}
// 活动积分
declare class Cfg_ActScore {
	ActId: number ; // 活动Id
	FuncId: number ; // 功能Id
	ItemId: number ; // 道具ID
	AddScore: number ; // 活动积分
	CheckRedPoint: number ; // 是否检测红点
}
// 活动掉落
declare class Cfg_ActDrop {
	ItemId: number ; // 道具ID
	ActIds: string ; // 掉落道具活动Ids
}
// 活动红点
declare class Cfg_ActRed {
	ActId: number ; // 活动Id
	ItemId: number ; // 道具ID
	LoginCheck: number ; // 登录检测
	DayCheck: number ; // 跨天检测
	ChangeCheck: number ; // 变动时候检测
}
// 公众号
declare class Cfg_MpFocus {
	ActId: number ; // 活动id
	Type: number ; // 界面类型
	App_id: number ; // 游戏id
	Channel_id: number ; // 渠道id
	Img_name: string ; // 公众号二维码
	Mp_name: string ; // 公众号名称
	Img_reward: string ; // 关注公众号奖励
	Desc: string ; // 描述
}
// 意见反馈
declare class Cfg_YiJianFanKui {
	ActId: number ; // 活动id
	App_id: number ; // 游戏id
	Channel_id: number ; // 渠道id
	Desc: string ; // 客服工作时间
	Number: number ; // 意见反馈字符上限
	Max: number ; // 意见反馈未结束最大条数上限
	Internal: number ; // 意见反馈提交时间间隔（秒
}
// 绑定手机号
declare class Cfg_BindPhone {
	ActId: number ; // 活动id
	App_id: number ; // 游戏id
	Channel_id: number ; // 渠道id
	Img_reward: string ; // 绑定手机号的奖励
	Img_name: string ; // 界面底图
}
// 谪仙蟠桃抽奖临时控制
declare class Cfg_ZXDrawControl {
	ActId: number ; // 活动id
}
// 谪仙蟠桃抽奖参数
declare class Cfg_ZXDrawParam {
	CfgKey: string ; // 唯一值
	CfgValue: string ; // 配置值
}
// 累计签到奖励
declare class Cfg_TotalSignPrize {
	Id: number ; // id
	SignTimes: number ; // 每日签到累计次数
	Prize: string ; // 可领奖励道具id及数量
	Group: number ; // 签到组
}
// 每日签到（20次重置）
declare class Cfg_DailySign {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	Group: number ; // 签到组
	Prize: string ; // 完成任务奖励方案id数组
	MakeUpPrize: string ; // 补签奖励
	CostId: number ; // 补签消耗道具Id
	CostNum: number ; // 补签消耗道具数量
}
// 活动特权卡参数
declare class Cfg_Config_HDCard {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 主题礼包
declare class Cfg_ThemeGift {
	GoodID: number ; // 商品id
	GoodName: string ; // 商品名字
	TemplateId: number ; // 模板编号
	TemplateRes: string ; // 模板资源
	ResPath: string ; // 模板资源的文件夹名字
	AniResType: number ; // 模型显示类型
	ItemStr: string ; // 礼包内容
	CostType: number ; // 消耗道具类型
	CostNum: number ; // 实际购买价格
	Price: number ; // 原价
	GiveType: number ; // 发放方式
	Icon: number ; // 礼包ICON
	Btn_Desc: string ; // 按钮文字
	Desc1: string ; // 奖励描述
	Desc2: string ; // 按钮下方描述
}
// 活动通用弹框
declare class Cfg_ActivityPush {
	Id: number ; // ID不重复勿动
	ActId: number ; // 活动模板ID
	FunType: number ; // 类型
	ResType: number ; // 资源类型
	ResPath: string ; // 资源路径
	Desc1: string ; // 资源图片1
	Desc2: string ; // 资源图片2
	FunId: number ; // 功能ID
}
// 自选奖励组
declare class Cfg_ChoosePrizeGroup {
	Id: number ; // 组ID
	Items: string ; // 可选道具数组。格式：道具ID:数量|道具ID:数量|道具ID:数量
}
// 物品来源
declare class Cfg_ItemSource {
	Id: number ; // 来源ID
	Desc: string ; // 描述
	PF: string ; // 平台替换
	Desc2: string ; // 无法跳转时弹出的文字消息
	FuncId: number ; // 跳转ID
	FuncParam: number ; // 跳转参数
	RMB: number ; // 此活动涉及人民币充值，特殊情况需屏蔽填1
	Icon: string ; // 来源Icon
}
// 剑阵
declare class Cfg_SwordZhen {
	Id: number ; // 剑阵id
	Quality: number ; // 品质
	ActCond: number ; // 剑阵激活条件（限制条件ID）
	ActCondShow: string ; // 剑阵激活条件（前端显示）
	Name: string ; // 名字
	NameIcon: string ; // 名称资源
	Source: number ; // 剑阵形象资源
	Icon: number ; // 剑阵图标
	ClientSkill: number ; // 客户端技能id
}
// 剑阵升级
declare class Cfg_SwordZhenLevel {
	Quality: number ; // 品质
	Grade: number ; // 当前阶
	Level: number ; // 当前级
	Name: string ; // 当前阶名字
	Cost: string ; // 单次修炼消耗剑魂道具id
	Exp: number ; // 当前级进度条总值
	AttrId: number ; // 属性
	SkillLevel: number ; // 技能等级
	AttrId2: number ; // 剑阵技能属性倍率
}
// 剑阵升阶
declare class Cfg_SwordZhenGrade {
	Id: number ; // 剑阵id
	Grade: number ; // 当前阶
	Cost: string ; // 消耗道具
}
// 剑阵升星
declare class Cfg_SwordZhenStar {
	Id: number ; // 剑阵id
	Cost: string ; // 消耗剑魂道具id
	Star: number ; // 星级
	AttrId: number ; // 属性
	ClientSkill: string ; // 客户端技能id
	AttrId2: number ; // 属性倍率
}
// 剑魂配置
declare class Cfg_Config_SwordSoul {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 剑魂孔位
declare class Cfg_SwordSoul_Cell {
	Id: number ; // 位置
	LimitConditionId: number ; // 孔位解锁条件
	LimitCoreType: string ; // 限制核心类型
}
// 剑魂升级
declare class Cfg_SwordSoul_LevelUp {
	Level: number ; // 剑魂等级
	Quality_1: string ; // 蓝色单属性升级材料
	Quality_2: string ; // 蓝色双属性升级材料
	Quality_3: string ; // 紫色单属性升级材料
	Quality_4: string ; // 紫色双属性升级材料
	Quality_5: string ; // 橙色单属性升级材料
	Quality_6: string ; // 橙色双属性升级材料
	Quality_7: string ; // 红色单属性升级材料
	Quality_8: string ; // 红色双属性升级材料
	Quality_9: string ; // 彩色核心属性升级材料
	Quality_10: string ; // 粉色核心属性升级材料
	Quality_11: string ; // 金色单属性升级材料
	Quality_12: string ; // 金色双属性升级材料
	AttrPercent: number ; // 提升道具属性万分比
	IncreaseLevel: number ; // 增幅等级
}
// 圣魂合成
declare class Cfg_SwordSoul_HeCheng {
	Id: number ; // 目标圣魂id
	NeedItem: string ; // 需要消耗材料
	Qualit: string ; // 材料
}
// 图录升星
declare class Cfg_SwordSoul_StarUp {
	Id: number ; // 图录等级id
	Level: number ; // 等阶
	Star: number ; // 星级
	NeedItem: number ; // 升到下一级需要消耗相同道具的个数
	AttrPercent: number ; // 提升图录属性万分比
}
// 图录大师
declare class Cfg_SwordSoul_Strength {
	Level: number ; // 强化大师等级
	AttrPercent: number ; // 提升图录属性万分比
	NumLimit: number ; // 最低多少件图录
	LevelIdLimit: number ; // 最低图录等级id
}
// 图鉴
declare class Cfg_SwordSoul_TuJian {
	Id: number ; // 图鉴id
	Desc: string ; // 描述
	SwordSoulId: string ; // 包含剑魂id
	LimitConditionId: number ; // 解锁条件id
}
// 剑魂晶石分解
declare class Cfg_SwordSoul_JingShi {
	Id: number ; // 剑魂晶石id
	ResolveItem: string ; // 分解后获得
}
// 剑魂
declare class Cfg_SwordSoul {
	Id: number ; // 剑魂id
	Name: string ; // 名字
	CoreType: number ; // 核心类型
	AttrType: string ; // 属性类型
	TuluType: number ; // 是否可在图录升星
	TuluAttrId: number ; // 图录属性id
	LevelUpField: string ; // 升级对应配置
	FeatureId: number ; // 特性组ID
	AttrAdd: string ; // 剑魂属性增幅万分比格式：属性Id:万分比|属性Id:万分比
}
// 剧情
declare class Cfg_PlotDetail {
	Id: number ; // Id
	Role: number ; // 角色区分
	TalkContent: string ; // 对话内容
	Emoji: string ; // 表情符号
	POS_LR: number ; // 角色左右区分
	ChatName: string ; // 角色名称
	ActId: number ; // 奇缘ID
	DropID: number ; // 掉落ID
	PicID: string ; // 资源立绘文件名
}
// 对话内容
declare class Cfg_PlotContent {
	Id: number ; // Id
	Content: string ; // 对话语句
}
// 剧情战斗
declare class Cfg_PlotFight {
	RoleId: number ; // 种族编号
	Times: number ; // 场次
	Content: string ; // 战报1
}
// 境界任务
declare class Cfg_RealmTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	Type: number ; // 任务类型序号
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数
	Independent: number ; // 是否独立计数
	TargetCount: number ; // 任务完成条件
	TaskTag: number ; // 任务标识
	PrizeExp: string ; // 完成任务奖励境界经验值
	Prize: string ; // 完成任务奖励方案id数组
	ClientFuncId: number ; // 跳转页面填：功能表，功能id
	SortIdx: number ; // 不同类型任务的显示排序
}
// 境界等级表
declare class Cfg_RealmLevel {
	Level: number ; // 境界等级
	RealmLevel: number ; // 大境界等级
	RealmName: string ; // 境界名称
	RealmPeriod: string ; // 境界期
	Exp: string ; // 升级所需经验
	DayPrize: string ; // 每日奖励
	AttrId: number ; // 境界属性Id
	ExpIncrId: number ; // 增幅表Id
	Descr: string ; // 描述
}
// 境界等阶表
declare class Cfg_RealmOrder {
	RealmLevel: number ; // 境界大等级
	RealmQuality: number ; // 境界品质
	Prize: string ; // 普通奖励(境界大奖)
	LimitPrize: string ; // 限时奖励(境界大奖)
	LimitTime: number ; // 限时时长(天)
	ResMId: number ; // 资源Id(男)
	ResFId: number ; // 资源Id(女)
	HurtIncr1: number ; // 高1境界提升伤害
	HurtIncr3: number ; // 高3境界提升伤害
	SpikeProb: number ; // 高3境界秒杀概率（万分比）
	IconId: number ; // 技能IconId
	SkillName: string ; // 技能名称
	SkillType: number ; // 技能类型
	SkillDesc: string ; // 技能描述
}
// 家族光环
declare class Cfg_Family_Halo {
	SkillId: number ; // id
	SkillName: string ; // 光环名
	UnlockLevel: string ; // 各个等级解锁需要的家族等级
}
// 家族创建条件
declare class Cfg_Config_Family {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 家族族徽
declare class Cfg_Family_Symbol {
	Id: number ; // ID
	PicPath: string ; // 族徽图片地址
	AniId: number ; // 特效ID
}
// 家族捐献
declare class Cfg_Family_Give {
	ItemId: number ; // 捐献道具ID
	ItemNum: number ; // 捐献道具数量
	Value: number ; // 可获得繁荣度
	GetItem: string ; // 捐献可获得道具
	LimitTimesId: number ; // 每天限制次数id
	ItemDesc: string ; // 捐献界面道具描述
}
// 家族特权
declare class Cfg_Family_Right {
	Id: number ; // id
	FamilyLevel: number ; // 所需家族等级
	IncreaseId: string ; // 增幅表ID、等级组
	Icon: number ; // 特权Icon
	Desc: string ; // 特权描述
	AttrId: number ; // 加成属性id
}
// 家族Buff
declare class Cfg_Family_Buff {
	IncreaseId: number ; // 增幅表ID
	UnlockLevel: string ; // 各个等级解锁需要的家族等级
}
// 家族等级
declare class Cfg_Family_Level {
	Level: number ; // 等级
	MaxNum: number ; // 成员人数上限
	Exp: number ; // 升级所需繁荣度
	Prize: string ; // 等级宝箱奖励内容
}
// 家族竞技
declare class Cfg_Family_Sport {
	WorldLevelMin: number ; // 世界等级下限
	WorldLevelMax: number ; // 世界等级上限
	MinNum: number ; // 最小值
	MaxNum: number ; // 最大值
	Reward1: string ; // 个人积分奖励
	Reward2: string ; // 家族积分奖励
}
// 机器人配置
declare class Cfg_RobotCfg {
	Type: number ; // 机器人类型
}
// 机型屏蔽表
declare class Cfg_PB {
	Id: number ; // 编号
	OS: string ; // 操作系统
	Type: string ; // 机型型号
	PBLevel: string ; // 屏蔽等级
	PBType: string ; // 屏蔽类型
	Max: number ; // 设定的最大内存
	RateH: string ; // 屏蔽百分比
	PBTypeH1: string ; // 持续时间1屏蔽类型
	PBTypeH2: string ; // 持续时间2屏蔽类型
	RateL: string ; // 放开百分比
	PBTypeL1: string ; // 持续时间1屏蔽类型
	PBTypeL2: string ; // 持续时间2屏蔽类型
}
// 极限生存配置
declare class Cfg_Config_JXSC {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 极限生存变身
declare class Cfg_Act_JXSC_ChangeSkin {
	Id: number ; // Id
	ResourceId: number ; // 资源ID
	ResourceType: number ; // 资源类型
	HeadType: number ; // 头像类型
}
// 极限生存怪物
declare class Cfg_JXSC_Monster {
	Id: number ; // Id
	GroupId: number ; // 生存阶段Id
	MonsterType: number ; // 怪物类型
	MonsterId: number ; // 怪物编号
	PosX: number ; // x坐标
	PosY: number ; // y坐标
}
// 极限生存排名奖
declare class Cfg_Act_JXSC_RankPrize {
	Id: number ; // 奖励id
	Rank: string ; // 排名区间
	FuirstRewards: number ; // 排名奖励道具id及数量数组
	SecondRewards: number ; // 排名奖励道具id及数量数组
}
// 激活码
declare class Cfg_RedeemCode {
	Charge: string ; // 自动购买商品id|id|id
}
// 竞技场9点奖励
declare class Cfg_JJCPrize {
	RankMin: number ; // 排名区间下限（包含，必填）
	RankMax: number ; // 排名区间上限（包含，不填表示无上限）
	Prize: number ; // 奖励：道具id:数量|道具id:数量
}
// 竞技场配置表
declare class Cfg_Config_JJC {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 等级表
declare class Cfg_Level {
	Level: number ; // 等级
	NeedExp: string ; // 需要经验
}
// 角色技能附加属性
declare class Cfg_RoleSkillAttr {
	SkillId: number ; // 技能ID
	HLId: number ; // 幻灵ID
	Desc: string ; // 注释
	AttrType: number ; // 属性类型（查表获取）!Cfg_Attr_Relation!属性关联
	AttrBase: number ; // 基础属性值
	AttrLevel: number ; // 每级递增属性值
}
// 角色炼体表
declare class Cfg_RoleBody {
	Id: number ; // 体术Id
	Quality: number ; // 品质
	Name: string ; // 名称
	Max: number ; // 最大阶数
	CoinBase: number ; // 解锁/升级所需金币基数
	CoinLevel: number ; // 升级所需金币递增值
	AttrType1: number ; // 属性类型1（查表获取）!Cfg_Attr_Relation!属性关联
	BaseAttr1: number ; // 处于此阶时基础属性值
	LevelAttr1: number ; // 处于此阶时每升一级累加属性值
	AttrType2: number ; // 属性类型2（查表获取）!Cfg_Attr_Relation!属性关联
	BaseAttr2: number ; // 处于此阶时基础属性值
	LevelAttr2: number ; // 处于此阶时每升一级累加属性值
	IconName: string ; // icon名字
	ImgName: string ; // img名字
}
// 角色炼体升级表
declare class Cfg_RoleBodyLevel {
	Id: number ; // 体术Id
	Grade: number ; // 阶
	RoleLevel: number ; // 处于此阶升级时限制人物等级
	RoleReborn: string ; // 处于此阶升级时限制人物转生
	RoleRealm: number ; // 处于此阶升级时限制人物境界
}
// 技能配置表
declare class Cfg_Config_RoleSkill {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 角色天赋表
declare class Cfg_RoleTalent {
	Id: number ; // 天赋Id
	Level: number ; // 天赋等级
	Desc: string ; // 注释列（程序不用）
	Type: number ; // 天赋类型1 常驻增幅，读增幅表ID2 战斗技能，读技能表ID
	OutId: number ; // 关联ID对应增幅表或技能表ID
	OutLevel: number ; // 关联等级对应增幅表或技能表等级
	Group: number ; // 所属分类1辅助 2挑战 3卓越 4传奇
	AttrType: number ; // 属性类型（查表获取）!Cfg_Attr_Relation!属性关联
	Attr: number ; // 属性值
	NeedItem: string ; // 升到此级所需道具ID:数量
}
// 角色天赋精通
declare class Cfg_RoleTalentSuit {
	Level: number ; // 天赋精通等级
	Total: number ; // 所需天赋总等级
	Attr: number ; // 属性ID
}
// 角色仙术表
declare class Cfg_RoleGodSkill {
	Id: number ; // 仙术ID
	Desc: string ; // 注释列（程序不用）
	SkillId: number ; // 技能表ID
	RoleGodSkillType: number ; // 仙术类型
	Reborn: string ; // 开启转生等级
	Realm: number ; // 开启境界
}
// 收益增幅表
declare class Cfg_Increase {
	Id: number ; // 增幅编号
	Level: number ; // 增幅等级
	Group: number ; // 合并分组标记
	Name: string ; // 增幅名称
	Icon: number ; // 显示图标
	Type: string ; // 增幅类型组详情见页签2与后一列参数长度一致
	Value: string ; // 增幅参数组与前一列类型长度一致
	Time: number ; // 持续时间（秒）0或不填表示永久
	Quality: number ; // 显示品质仅做显示用
	Circle: number ; // 光圈特效ID仅做显示用
	IsShowBuff: number ; // 是否在BUFF列表中显示
	IsShowLv: number ; // BUFF列表中不显示等级
}
// 描述
declare class Cfg_IncreaseDesc {
	ID: number ; // 增幅类型
	Desc: string ; // 文字描述
}
// 角色表
declare class Cfg_Job {
	RoleID: number ; // 角色id
	RaceName: string ; // 种族
	Sex: number ; // 性别
	SexImg: string ; // 性别图片
	RoleImg: string ; // 角色图片
	RaceID: number ; // 种族id
	HeadImg: string ; // 头像
	RaceImg: string ; // 种族图片
	Sort: number ; // 排序
	IsDefault: number ; // 默认
	AnimID: number ; // 角色动画资源id
	WeaponID: number ; // 默认武器资源id
	Skills: string ; // 技能解锁面板
	OffsetSY: number ; // 角色展示Y轴偏移
}
// 角色初始化表
declare class Cfg_RoleInit {
	ID: number ; // 编号
	Type: number ; // 类别：1物品，3任务，4宠物，5仙侣
	P1: number ; // 参数1
	P2: number ; // 参数2
	P3: number ; // 参数3
	Bind: number ; // 绑定类型
}
// 领地战击杀奖励
declare class Cfg_CityWarKillPrize {
	RankMin: number ; // 名次最小值（包含）
	RankMax: number ; // 名次最大值（包含）
	Prize: number ; // 奖励组
}
// 领地战商人捐献
declare class Cfg_CityWarGive {
	Id: number ; // 活动阶段
	ItemId: number ; // 可捐献道具ID
	Name: string ; // 道具名称
	Score: number ; // 每捐一组道具可获得积分
}
// 领地战地图
declare class Cfg_CityWarMap {
	Id: number ; // 城池ID
	Name: string ; // 名称
	Layer: number ; // 所属层数
	MapId: number ; // 地图表ID
}
// 领地战地图刷新
declare class Cfg_CityWarMapRe {
	Id: number ; // 活动阶段
	Type: number ; // 刷新类型1  草药2  银宝箱3  金宝箱4  守护兽5  水晶6  商人
	Name: string ; // 名称
	ReliveTime: number ; // 重刷时间（秒）
	MonsterId: number ; // 怪物编号
	MonsterRefreshId: number ; // 怪物刷新表ID
	DropId: number ; // 完成获得道具掉落ID
	Auto: number ; // 是否可以自动挂机进行1 可以
}
// 领地战配置表
declare class Cfg_Config_CityWar {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 领地战阶段
declare class Cfg_CityWarLayer {
	LayerId: number ; // 阶段
	Name: string ; // 名称
	StartTime: string ; // 本轮开始时间
	EndTime: string ; // 本轮结束时间
	FamilyCount: number ; // 宣战家族数量
	ScoreMax: number ; // 积分达到N直接胜利
	WinPrize: number ; // 胜利家族奖励组
	FailPrize: number ; // 失败家族奖励组
	CrystalScore: number ; // 水晶持续获得的积分数
	CrystalInternal: number ; // 水晶持续获得积分间隔时间（秒）
	CountDown: number ; // 开始倒计时
	Desc: string ; // 说明文字，显示在城池的展示弹窗中
}
// 模型缩放
declare class Cfg_Model_Scale {
	ID: number ; // 唯一ID
	ResType: string ; // 资源类型
	AnimId: string ; // 动画ID
	NoActLiist: string ; // 不需要缩放的动作
	Scale: number ; // 缩放值
}
// 模型设置
declare class Cfg_Model_Set {
	ID: number ; // 1
	TableName: string ; // Cfg_SkinGrade
	AnimId: string ; // horse/action_4040
	Scale: number ; // 65
	ResType: number ; // 3
}
// QQ红包
declare class Cfg_QQRedPkg {
	Id: number ; // 档位ID
	NeedRMB: number ; // 仅需xx元即可瓜分红包
	RedPkgRMB: number ; // 红包(xx元)
	Multiple: number ; // 元宝倍数
	MinGetRMB: number ; // 最低可领取xx元(单位分)
	GoodsId: number ; // 充值商品Id
	YBCount: number ; // 元宝数
}
// 红包奖励
declare class Cfg_Red_Reward {
	Id: number ; // 序号Id
	GoodsId: number ; // 充值商品Id
	ActId: number ; // 冲榜活动Id
	Rewards: string ; // 奖励
}
// 小程序直播任务表
declare class Cfg_XCXTask {
	Id: number ; // 任务ID
	Prize: string ; // 完成任务奖励
}
// 拍卖行
declare class Cfg_Auction {
	Id: number ; // id
	Name: string ; // 名字
	ReadyTime: number ; // 开启准备时间(s)
	Time: number ; // 拍卖持续时间(s)
	DataKeepTime: number ; // 拍卖结束后数据保留时间(s)
	MaxAucNum: number ; // 同时竞拍数量
	TotalNum: number ; // 竞品总数量
	NoticeParam1: number ; // 公告跳转参数（填功能id）
}
// 拍卖道具
declare class Cfg_Auction_Item {
	Id: number ; // id
	AucId: number ; // 拍卖行Id
	Rank: number ; // 排序
	ItemID: number ; // 商品道具id
	ItemNum: number ; // 商品道具数量
	CostItemId: number ; // 货币道具id
	CostMinNum: number ; // 拍卖底价
	CostMaxNum: number ; // 拍卖一口价
	CostAddNum: number ; // 加价数
	IsShow: number ; // 公告
}
// 排行榜称号
declare class Cfg_Rank_Title {
	RankType: number ; // 排行榜类型
	RankParam: number ; // ID
	SkinId: number ; // 皮肤ID
}
// 皮肤增幅表
declare class Cfg_SkinIncrease {
	SkinId: number ; // 皮肤ID
	Desc: string ; // 注释列（程序不用）
	SkinLevel: number ; // 皮肤等级
	IncreaseId: string ; // 增幅ID数组竖线分割与后一列长度保持一致
	IncreaseLevel: string ; // 增幅等级数组竖线分割与前一列长度保持一致
	SkillId: string ; // 技能ID数组竖线分割与后一列长度保持一致
	SkillLevel: string ; // 技能等级数组竖线分割与前一列长度保持一致
}
// 套装增幅表
declare class Cfg_SkinSuitIncrease {
	SuitId: number ; // 套装ID
	Desc: string ; // 注释列（程序不用）
	SuitLevel: number ; // 套装等级
	IncreaseId: string ; // 增幅ID数组竖线分割与后一列长度保持一致
	IncreaseLevel: string ; // 增幅等级数组竖线分割与前一列长度保持一致
	SkillId: string ; // 技能ID数组竖线分割与后一列长度保持一致
	SkillLevel: string ; // 技能等级数组竖线分割与前一列长度保持一致
}
// 皮肤表
declare class Cfg_Skin {
	Id: number ; // 皮肤ID
	Type: number ; // 功能id
	Name: string ; // 皮肤名称
	NamePic: number ; // 皮肤名称在某些界面显示图片
	UnlockItem: number ; // 解锁激活所需道具ID
	SpecialSuit: string ; // 部件iconID套装用
	IsSuit: number ; // 是否为仙装部件
	AttrId: number ; // 激活属性ID
	IncreaseId: string ; // 增幅表ID
	SkillId: string ; // 技能表ID
	Prize: number ; // 炼神丹上限增量
	AutoWear: number ; // 是否自动穿戴，0否1是
	Cmd: number ; // 客户端界面跳转ID
	AnimId: string ; // 美术资源ID男资源|女资源
	IsShow: number ; // 没有激活道具时是否显示
	OffsetY: string ; // 坐骑Y轴偏移高度
	OffsetSY: string ; // 角色展示Y轴偏移高度
	FuncType: number ; // 装备的类型
	SpeFuncType: number ; // 是否有特殊功能
	BelongToId: number ; // 皮肤所属
	FieldId: number ; // 栏位的位置
}
// 皮肤套装表
declare class Cfg_SkinSuit {
	Id: number ; // ID
	Type: number ; // 套装type
	Name: string ; // 套装名称
	SkinRequire: string ; // 皮肤收集要求
	AttrId2: number ; // 2件属性ID
	AttrId3: number ; // 3件属性ID
	AttrId4: number ; // 完美属性ID
	IconId: string ; // 套装图标Id
	SortId: number ; // 排序ID
	IsShow: number ; // 是否显示
	IncreaseId: string ; // 增幅表ID
	SkillId: string ; // 技能ID
	TitleY: string ; // 套装装称号高度
	ActiveDesc: string ; // 宗主套装激活条件描述
	ActiveDesc1: string ; // 套装获取途径描述
}
// 跑商配置
declare class Cfg_Config_Business {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 跑商地图
declare class Cfg_BusinessMap {
	Id: number ; // 地点ID
	Name: string ; // 地点名称
	Goods: string ; // 贩卖物品道具表ID
}
// 跑商意外奖励
declare class Cfg_BusinessPrize {
	Id: number ; // 到达某节点概率获得道具ID
	Count: number ; // 到达某节点概率获得道具数量
	Note: string ; // 显示的文案
}
// 跑商结算
declare class Cfg_BusinessCount {
	Id: number ; // 结算情况ID
	Name: string ; // 结算名称
	Note: string ; // 提示
	Rate: number ; // 出现概率万分比
	CountMin: number ; // 盈利下限万分比
	CountMax: number ; // 盈利上限万分比
}
// 跑商两点距离
declare class Cfg_BusinessDistance {
	Point1: number ; // 始点
	Point2: number ; // 终点
	Desc: string ; // 备注（程序不用）
	Distance: number ; // 两点距离（移动时间秒）
}
// 跑商商品价格
declare class Cfg_BusinessGoods {
	Id: number ; // 商品 道具表ID
	Desc: string ; // 备注（程序不用）
	Picture: string ; // 备注（程序不用）
	BuyMin: number ; // 买进价格下限
}
// 跑商银票
declare class Cfg_BusinessTicket {
	Id: number ; // 银票ID
	Name: string ; // 银票名称
	Icon: string ; // 银票图标
	Buy: string ; // 购买消耗道具ID:数量
	InitGold: number ; // 初始资金
	TargetGold: number ; // 交票金额
	Prize: string ; // 完成跑商奖励
}
// 配置表
declare class Cfg_Config {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 切磋配置表
declare class Cfg_Config_QieCuo {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 奇缘
declare class Cfg_Instance_ActLuck {
	ActId: number ; // Id
	Name: string ; // 名称
	TitleID: string ; // 面板标题资源
	NameIcon: string ; // 功能ICON
	PicID: string ; // 面板Banner资源
	BossId: number ; // boss编号
	RefreshId: number ; // 刷新ID
	MapId: number ; // 地图ID
	ShowPrize: string ; // 展示掉落奖励
}
// 阵位表
declare class Cfg_QMDJ_ZhenWei {
	Id: number ; // 阵法Id
	Name: string ; // 阵法名称
	Pos: number ; // 阵位位置
	PType: number ; // 阵法伙伴类型
	PId: number ; // 阵法伙伴Id
	Color: number ; // 阵位颜色
	Param1: number ; // 伙伴的上阵条件
}
// 阵法升星表
declare class Cfg_QMDJ_ZhenFaStarUp {
	Star: number ; // 阵法星级
	StarUpItemNum: number ; // 升级所需道具数量
	AttrPresent: number ; // 属性加成万分比
	SkillLevel: number ; // 阵法对应技能等级
}
// 阵法等级表
declare class Cfg_QMDJ_ZhenFaLeve {
	Id: number ; // 阵法Id
	Name: string ; // 阵法名称
	Level: number ; // 等级
	LevItemId: number ; // 升级所需道具Id
	LevItemNum: number ; // 升级所需道具数量
	AttrId: number ; // 等级属性Id
	EatDrugMax: number ; // 吃丹上限
	AttrPresent: number ; // 属性加成万分比
}
// 阵法表
declare class Cfg_QMDJ_ZhenFa {
	ListId: number ; // 阵法排序Id
	Id: number ; // 阵法Id
	Name: string ; // 阵法名称
	NeedItem: string ; // 解锁道具
	UnlockAttrId: number ; // 阵法解锁属性Id
	DrugItemId: number ; // 丹药道具Id
	DrugAttrId: number ; // 单个丹药属性Id
	ZhenFaRedId: number ; // 阵法入口红点
	LevelUpRedId: number ; // 阵法升级红点
	DrugRedId: number ; // 遁甲之魂红点
	ZhenFaDsc1: string ; // 阵法特性
	ZhenFaDsc2: string ; // 特性详细说明1
	ZhenFaSkills: string ; // 阵法升星效果
	ZhenFaDsc3: string ; // 特性详细说明2
	ZhenFaDsc4: string ; // 特性详细说明3
	ZhenFaSkill: number ; // 阵法技能Id
}
// 阵法克制表
declare class Cfg_QMDJ_ZFRestraint2 {
	Id: number ; // 索引
	ASkill1: number ; // 我方增益技能效果
	DSkill1: number ; // 敌方增益技能效果
}
// 主线任务
declare class Cfg_LinkTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名（程序在用的）
	Reborn: number ; // 任务进行条件：转生等级
	Realm: number ; // 执行任务条件：境界等级
	ClientFuncId: number ; // 客户端功能id
	ClientTipsId: number ; // 引导提示id
	Finger: number ; // 是否显示引导手势
	TipsType: number ; // 引导类型
	TipsContent: string ; // 引导提示语（是否需要提示语）
	GuideType: number ; // 引导要点击的按钮
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）任务专用字段
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励方案id数组
}
// 地图通关任务
declare class Cfg_MapTask {
	MapId: number ; // 地图ID
	Prize: string ; // 完成任务奖励道具及数量
}
// 分享奖励
declare class Cfg_ShareTask {
	Id: number ; // 任务ID
	Note: string ; // 注释列
	Name: string ; // 任务名
	Desc: string ; // 任务描述
	TargetDesc: string ; // 任务目标描述
	Type: number ; // 任务类型序号
	GetCondition: string ; // 第1行特殊处理填刷新时间
	ServiceType: number ; // 容器id
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	Independent: number ; // 是否独立计数（接取任务时的计数为0，或为当前的累加值）
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励方案id数组
	Multiple: number ; // 允许多倍奖励
	Order: number ; // 任务序号
}
// 恭迎宗主任务
declare class Cfg_SectTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	Type: number ; // 任务类型序号
	CounterType: number ; // 任务计数类型
	TargetCount: number ; // 任务完成条件
	Anim: string ; // 美术资源ID
	ClientFuncId: number ; // 跳转页面填：功能表，功能id
}
// 每日签到（登录送丹）
declare class Cfg_LoginDaily {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	Desc: string ; // 任务描述
	Type: number ; // 任务类型序号
	GetCondition: string ; // 任务接取(刷新)条件
	ContainerId: number ; // 容器参数
	CounterType: number ; // 任务计数类型
	Prize: string ; // 完成任务奖励方案id数组
}
// 活动额外掉落
declare class Cfg_ActExtraDrop {
	Id: number ; // 序号Id
	ActId: number ; // 活动Id
	Type: number ; // 掉落类型
	DropId: string ; // 活动掉落Id
	DropItemId: string ; // 掉落道具
	DropProb: string ; // 掉落概率
	LimitId: string ; // 限制次数Id
	TargetProp: string ; // 目标道具
	AddDesc: string ; // 自定义描述
}
// 掉落配置
declare class Cfg_ExtraDrop {
	Id: number ; // 序号Id
	FuncId: number ; // 功能Id
	AnimId: string ; // 活动名称资源
	IsUse: number ; // 是否启用
}
// 世界等级表
declare class Cfg_WorldLevel {
	Min: number ; // 与世界等级相差下限（包含）
	Max: number ; // 与世界等级相差上限（包含）
	IncreaseId: number ; // 增幅表ID
	IncreaseLevel: number ; // 增幅等级
	IncreaseId2: number ; // 合服后增幅表ID
}
// 刷新表
declare class Cfg_Refresh {
	RefreshId: number ; // 刷新id
	MonsterIds: string ; // 怪物组
	MonsterLevel: number ; // 怪物等级
	AttrId_Common: number ; // 普通怪物属性
	AttrId_Elites: number ; // 精英怪物属性
	AttrId_Boss: number ; // BOSS怪物属性
}
// 进阶奖励
declare class Cfg_GradePrize {
	Number: number ; // 序号
	FuncId: number ; // 功能ID
	Level: number ; // 等级
	Modelling: number ; // 展示造型
	Prize: string ; // 奖励道具id:数量无奖励就空着不填
	MultiCost: string ; // 三倍领取消耗货币id:数量
}
// 进阶奖励任务
declare class Cfg_AchieveTask_Grade {
	Id: number ; // 任务ID
	Name: string ; // 任务名称
	TargetDesc: string ; // 任务描述
	Type: number ; // 任务类型
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励方案id数组
	ClientFuncId: number ; // 新功能开放表功能id
}
// 通灵升阶表
declare class Cfg_GradeTongLing {
	Level: number ; // 等级
	TongLingCount: number ; // 通灵总次数上限
	SkinId: number ; // 皮肤ID
	NameIcon: number ; // 名称资源
}
// 装备化金
declare class Cfg_GradeHuaJin {
	Type: number ; // 系统类型
	Part: number ; // 装备位置
	Level: number ; // 化金等级
	AttrId: number ; // 属性ID
	CostItem: string ; // 消耗道具ID:数量
	ShowItemId: number ; // 目标道具Id
}
// 炼神丹注灵丹
declare class Cfg_GradePill {
	Type: number ; // 系统类型
	Decs: string ; // 系统名称
	MindPill: number ; // 炼神丹道具ID
	TongLingPill: number ; // 通灵丹道具id
	SoulPill: number ; // 注灵丹道具ID
	SoulPillAdd: number ; // 注灵丹道具单次增加经验值
	ForgePill: number ; // 淬炼道具ID
	ForgePillAdd: number ; // 淬炼道具单次增加经验值
}
// 升阶属性表
declare class Cfg_Attribute_Grade {
	Id: number ; // 属性编号
	Attr_1: string ; // 生命
	Attr_2: string ; // 攻击
	Attr_3: string ; // 防御
	Attr_4: string ; // 命中(万分比)
	Attr_5: string ; // 闪避(万分比)
	Attr_6: string ; // 暴击(万分比)
	Attr_7: string ; // 抗暴(万分比)
	Attr_8: string ; // 攻速
	Attr_9: string ; // 无视防御
	Attr_10: string ; // 减免无视
	Attr_11: string ; // 伤害加深
	Attr_12: string ; // 伤害减少
	Attr_13: string ; // 伤害增加%
	Attr_14: string ; // 伤害减少%
	Attr_15: string ; // 暴击伤害增加
	Attr_16: string ; // 暴击伤害减少
	Attr_17: string ; // 魂概率增加
	Attr_18: string ; // 魂概率减少
	Attr_19: string ; // PVP伤害增加(万分比)
	Attr_20: string ; // PVP伤害减少(万分比)
	Attr_21: string ; // PVE伤害增加(万分比)
	Attr_22: string ; // PVE伤害减少(万分比)
	Attr_51: string ; // 生命百分比
	Attr_52: string ; // 攻击百分比
	Attr_53: string ; // 防御百分比
	Attr_54: string ; // 命中(万分比)百分比
	Attr_55: string ; // 闪避(万分比)百分比
	Attr_56: string ; // 暴击(万分比)百分比
	Attr_57: string ; // 抗暴(万分比)百分比
	Attr_58: string ; // 速度百分比
	Attr_59: string ; // 无视防御百分比
	Attr_60: string ; // 减免无视百分比
	Attr_61: string ; // 伤害加深百分比
	Attr_62: string ; // 伤害减少百分比
	Attr_63: string ; // 伤害增加%百分比
	Attr_64: string ; // 伤害减少%百分比
	Attr_65: string ; // 暴击伤害增加百分比
	Attr_66: string ; // 暴击伤害减少百分比
	Attr_67: string ; // 魂概率增加百分比
	Attr_68: string ; // 魂概率减少百分比
	Attr_69: string ; // PVP伤害增加(万分比)百分比
	Attr_70: string ; // PVP伤害减少(万分比)百分比
	Attr_71: string ; // PVE伤害增加(万分比)百分比
	Attr_72: string ; // PVE伤害减少(万分比)百分比
	GradeType: number ; // 升阶系统类型
	GradeAdd: number ; // 万分比加成
}
// 升阶注灵表
declare class Cfg_GradeSoul {
	Level: number ; // 注灵等级
	Exp: number ; // 升级所需注灵值
	AttrId: number ; // 属性ID
}
// 升阶淬炼表
declare class Cfg_GradeForge {
	Level: number ; // 淬炼等级
	Exp: number ; // 此级升到下级所需淬炼值
	AttrId: number ; // 此级属性ID
}
// 升阶皮肤表
declare class Cfg_SkinGrade {
	Id: number ; // 主键注意与其他类型皮肤表的ID不要重复
	Type: number ; // 皮肤所属功能ID
	Name: string ; // 皮肤名称
	NamePic: string ; // 名称图片
	UnlockItem: number ; // 解锁激活所需道具ID
	Quality: number ; // 称号品质
	AttrId: number ; // 激活属性ID
	BelongToId: number ; // 皮肤所属
	FieldId: number ; // 栏位的位置
	AutoWear: number ; // 是否自动穿戴0否1是
	CanLevelUp: number ; // 是否可升级0否1是
	Prize: number ; // 解锁后增加炼神次数上限
	Cmd: number ; // 客户端界面跳转ID
	AnimId: string ; // 美术资源ID
	HeadPic: string ; // 技能飘字对应半身像资源
	IsShow: number ; // 是否显示
	OffsetY: string ; // Y轴偏移高度
	SpecialFrom: string ; // 特殊获取途径用于没有解锁道具的皮肤
	FuncType: number ; // 装备的类型
	SpeFuncType: number ; // 是否有特殊功能
}
// 升阶皮肤技能表
declare class Cfg_SkinGradeSkill {
	Id: number ; // 皮肤ID
	Name: string ; // 技能名称
	Part: number ; // 技能栏位
	Star: number ; // 技能等级
	Icon: number ; // 技能ICON
	AttrId: number ; // 属性ID
	ActiveSkillIds: string ; // 主动技能
	PassiveSkills: string ; // 被动技能
	GainBuffs: string ; // 增益技能
	Limit: number ; // 解锁的皮肤星级
	SkillQuality: number ; // 技能品质
}
// 仙阶升阶
declare class Cfg_Grade_FailyClass {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 神阶技能
declare class Cfg_SkillGrade_FailyClass {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 兵卫升阶
declare class Cfg_Grade_YanJia {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 兵卫技能
declare class Cfg_SkillGrade_YanJia {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 神兵升阶
declare class Cfg_Grade_Weapon {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 神兵技能
declare class Cfg_SkillGrade_Weapon {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 兽灵升阶
declare class Cfg_Grade_Beast {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 兽灵技能
declare class Cfg_SkillGrade_Beast {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 坐骑技能
declare class Cfg_SkillGrade_Horse {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 坐骑升阶
declare class Cfg_Grade_Horse {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
	TongLingCount: number ; // 通灵总次数上限
}
// 天仙法器升阶
declare class Cfg_Grade_Dharma {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 天仙法器技能
declare class Cfg_SkillGrade_Dharma {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 升阶总表
declare class Cfg_Grade {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Star: number ; // 星级
	Level: number ; // 等级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
	TongLingCount: number ; // 通灵总次数上限
}
// 升阶技能总表
declare class Cfg_SkillGrade {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 升至下一级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 战神宝宝升阶
declare class Cfg_Grade_Baby {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 战神宝宝技能
declare class Cfg_SkillGrade_Baby {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 战神战骑升阶
declare class Cfg_Grade_WarriorPet {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 战骑技能
declare class Cfg_SkillGrade_WarriorPet {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 战神升阶
declare class Cfg_Grade_Warrior {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 法宝升阶
declare class Cfg_Grade_Precious {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 法宝技能
declare class Cfg_SkillGrade_Precious {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 法阵升阶
declare class Cfg_Grade_Circle {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 法阵技能
declare class Cfg_SkillGrade_Circle {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 神阶升阶
declare class Cfg_Grade_GodClass {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 神阶技能
declare class Cfg_SkillGrade_GodClass {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 翅膀升阶
declare class Cfg_Grade_Wing {
	Name: string ; // 名称
	NamePic: string ; // 名称图片
	Type: number ; // 功能ID，对应功能表
	Level: number ; // 等级
	Star: number ; // 星级
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
	SkinId: number ; // 升到此级之后赠送皮肤编号
	SkillPart: number ; // 升到此级之后解锁技能栏位
	PillCount: number ; // 处于此等级炼神总次数上限
}
// 翅膀技能
declare class Cfg_SkillGrade_Wing {
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Type: number ; // 功能ID，对应功能表
	Part: number ; // 栏位
	Level: number ; // 等级
	AttrId: number ; // 如果此技能是常驻属性属性ID
	Skill: string ; // 如果此技能是战斗技能技能表ID:等级
	Increase: string ; // 如果此技能是收益增幅增幅表ID:等级
	NeedItem: string ; // 从上一级升到此级需要道具ID：数量
	Client_ID: string ; // 唯一id
}
// 战神神变
declare class Cfg_GoldChange_Warrior {
	SkinId: number ; // 神变皮肤ID
	CondStar: number ; // 激活神变星级
	GCGrade: number ; // 神变等阶
	GCLevel: number ; // 神变等级
	LimitStar: number ; // 可升星上限
	AttrId: number ; // 增加属性
	ShowSkillId: string ; // 技能提升前端展示
	SkillId: string ; // 技能提升实际生效
	CostItem: string ; // 道具消耗
	CostSkin: number ; // 自选皮肤消耗
	ShowSkilDesc: string ; // 神变技能描述
	SkillLv: string ; // 神通技升级条件
	PassiveSkillId: string ; // 升仙被动技能
	Fattr: number ; // 激活助战羁绊
}
// 战神神变皮肤配置
declare class Cfg_GoldChange_Skin {
	SkinId: number ; // 皮肤id
	Item: number ; // 道具id
	Quality: number ; // 品质
	RedId: number ; // 对应红点id
	Aid: number ; // 神变1阶资源
}
// 战神配置
declare class Cfg_GoldChange_Cfg {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 商店
declare class Cfg_ShopCity {
	GoodsID: number ; // 商品id
	ItemID: number ; // 商品道具id
	MallType: number ; // 商店标签
	GoldType: number ; // 结算货币道具编号
	BuyNum: number ; // 单个商品包含道具数量
	GoodsPrice: number ; // 结算货币数量
	SalePrice: number ; // 打折价格
	Sale: string ; // 折扣文本为10表示没折扣，价格按照GoddsPrice小于十，价格按照SalePrice
	LimConID: number ; // 限制条件id
	ShowLimConID: number ; // 显示限制条件id
	LimConDes: string ; // 限制条件中文描述
	LimLevel: number ; // 开启条件
}
// 商店类型
declare class Cfg_ShopCityType {
	MallTypeID: number ; // 类型id
	MallTypeName: string ; // 商城名称
	ShopId: number ; // 商城分类
	GoldType: string ; // 关联货币类型
	Sort: number ; // 商城排序
	LimLevel: number ; // 开启条件
	RMB: number ; // 此活动涉及人民币充值，特殊情况需屏蔽填1
	FuncId: number ; // 开启条件走功能表
	Show: number ; // 开启后，该商店页签是否显示
}
// 圣物参数
declare class Cfg_Config_ShengWu {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 圣物分解
declare class Cfg_SWEquipBreak {
	Level: number ; // 阶级
	Star: number ; // 星级
	Itemnum: string ; // 产出圣物精华数量
}
// 圣物套装表
declare class Cfg_SW_Suit {
	SuitId: number ; // 套装编号
	Level: number ; // 阶级
	StarNum: number ; // 星级
	EquipNum: number ; // 装备件数
	AttrId: number ; // 属性id
}
// 圣物套装技能表
declare class Cfg_SW_SuitSkill {
	Id: number ; // 圣痕id
	SuitId: number ; // 套装编号
	SkillId: number ; // 助战单位额外技能id
	SkillLv: number ; // 助战单位额外技能等级
	Attr1: string ; // 战力增加（万分比）
	Description: string ; // 描述
}
// 圣物强化
declare class Cfg_SWEquipStrength {
	Pos: number ; // 强化部位
	LevelLimit: number ; // 阶级最低需达到
	LevelMin: number ; // 强化等级下限包括
	LevelMax: number ; // 强化等级上限包括
	BaseAttrId: number ; // 等级在此区间时的基础属性ID
	AddAttrId: number ; // 等级在此区间时，每升一级累加属性ID
	NeedItem: string ; // 消耗道具ID:数量
	PerItem: number ; // 消耗道具数量递增值
}
// 圣物部位表
declare class Cfg_SW_EquipName {
	EquipPart: number ; // 装备部位
	Name: string ; // 部位名称
	PicID: string ; // 栏位置灰用图片
	Id: number ; // 道具编号
}
// 圣痕配置
declare class Cfg_ShengHen {
	Id: number ; // 圣痕Id
	Name: string ; // 圣痕名称
	PrevSWId: number ; // 前置圣痕
	Unlock: number ; // 前置圣痕等级
	PicPath: string ; // 圣痕资源地址
	RedDot: number ; // 红点id
}
// 圣痕升级
declare class Cfg_Grade_ShengHen {
	Id: number ; // 圣痕Id
	Level: number ; // 等级
	AttrId: number ; // 处于此等级属性ID
	LevelLimit: number ; // 升到此等级需要满足的强化总等级条件
	NeedItem: string ; // 升到此等级需要道具ID:数量
}
// 圣痕技能表
declare class Cfg_SkillGrade_ShengHen {
	Id: number ; // 圣痕Id
	SkillName: string ; // 技能名字
	Part: number ; // 栏位
	SkillId: number ; // 神域外技能Id
	ShenYuSkillId: number ; // 神域内技能Id
	Level: number ; // 技能等级
	Unlock: number ; // 解锁需圣痕等级
}
// 守护精灵配置
declare class Cfg_Config_Guard {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 收益仓库表
declare class Cfg_WareHouse {
	WhId: number ; // 收益仓库Id
	MaxNum: number ; // 仓库容量
	ItemChangeType: number ; // 道具变动类型
	WhName: string ; // 收集仓库名字
	FuncId: number ; // 对应功能ID
	RedId: number ; // 红点Id
	ActId: string ; // 活动Id
}
// 时光贩卖机配置
declare class Cfg_Config_TimeShop {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 套装进阶表
declare class Cfg_SkinSuitUp {
	Level: number ; // 套装等阶
	Item_Id: string ; // 消耗道具
	Part_Level: number ; // 部件星级
	AttrId: number ; // 属性id
}
// 时装系统注灵表
declare class Cfg_SkinReiki {
	Level: number ; // 注灵等级
	Exp: string ; // 升级所需注灵值
	AttrId: number ; // 属性ID
}
// 时装道具配置表
declare class Cfg_SkinItem {
	Id: number ; // 道具编号
	Name: string ; // 道具名称
	Exp: number ; // 经验值
}
// 时装系统配置表
declare class Cfg_Config_Skin {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 神位表
declare class Cfg_ShenWei {
	Id: number ; // 神位id
	GodName: string ; // 神位名称
	Stage: number ; // 神位等级
	TaskId: string ; // 升阶需要完成任务id
	Prize: number ; // 飞升到此阶奖励组ID
	Power2: number ; // 行动值上限增加
	ResPower: string ; // 行动值恢复
	AltarLimit: number ; // 可开采祭坛上限
	Maxgod: number ; // 可占领神坛最大数量
	Icon: string ; // 神位图片配置
	MainIcon: string ; // 主界面图片配置
}
// 神位任务表
declare class Cfg_ShenWeiTask {
	Id: number ; // 任务ID
	Name: string ; // 任务描述
	CounterType: number ; // 任务计数类型
	Param: string ; // 参数
	TargetCount: number ; // 任务完成条件
	Independent: number ; // 是否独立计数
	Prize: string ; // 完成任务奖励
	ClientFuncId: number ; // 跳转功能id
}
// 神域活动
declare class Cfg_GodNotice {
	Id: number ; // 编号
	Time: string ; // 时间
	Season: number ; // 赛季期数
	NoticeId: number ; // 公告id
}
// 神域配置
declare class Cfg_ShenyuCfg {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 神域商店配置
declare class Cfg_ShenyuShopCfg {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 神域商店
declare class Cfg_ShenyuShopGood {
	GroupId: number ; // 组Id
	Id: number ; // id
	GoodsTitle: string ; // 商品名称
	ItemString: string ; // 道具配置
	CostItem: number ; // 消耗道具id
	OldPrize: number ; // 原价消耗货币数量
	Prize: number ; // 现价消耗货币数量
	Sale: number ; // 显示折扣0表示无折扣
	MustShow: string ; // 指定刷新格子位置
	BuffId: number ; // 对应BUFFid
}
// 地块表
declare class Cfg_SectionBlock {
	BlockId: string ; // 地块ID
	TypeId: number ; // 地块类型ID
	BuildingId: number ; // 建筑ID
}
// 地图表
declare class Cfg_SectionMap {
	ID: number ; // 地块类型ID
	Name: string ; // 地块名称
	Building: number ; // 是否为建筑
	Occupy: number ; // 是否可占领
	MainCity: number ; // 主城类型
	Horde: number ; // 阵营
	Coordinate: string ; // 地块坐标
	OutTime: number ; // 外域保护时间
	InnerTime: number ; // 内域保护时间
	Function: string ; // 功能列表
	MonsterId: string ; // 驻守怪物id
	AfkOut: number ; // 挂机产出
	PerQty: number ; // 产出个人数量
	HordeQty: number ; // 产出阵营数量
	SettleTime: number ; // 结算间隔
	ValidTime: number ; // 有效产出时间
	OutPutRatio: number ; // 圣物产出系数
	OutPutNode: number ; // 圣物产出节点
	Items: string ; // 圣物产出
	Type: string ; // 驻守类型
	Quality: number ; // 驻守品质
	OutAddNum: number ; // 驻守提升挂机百分比
	AttackUse: number ; // 占领/抢夺消耗行动值
	ExtractUse: number ; // 开采消耗行动值
	ReturnTime: number ; // 怪物血量恢复时间
	GodId: number ; // 可开采神位
	AddFeats: number ; // 获得战功
	Totem: string ; // 主城图腾
	Offset: string ; // 场景偏移值
	ShowPrize: string ; // 掉落奖励展示
	BeastBuff: string ; // 神兽携带BUFF
	BeastSeal: string ; // 阵营神兽封印特效
}
// 神域场景
declare class Cfg_GodScene {
	SeasonId: number ; // 赛季id
	ID: number ; // 场景id
	Name: string ; // 场景名称
	ResId: string ; // 场景资源名称
	ResId2: string ; // 替换资源
}
// 奖励组配置表
declare class Cfg_SY_RewardGroup {
	Id: number ; // 序号Id
	GroupId: number ; // 组Id
	MinTimes: number ; // 赛季最小次数
	MaxTimes: number ; // 赛季最大次数
	MinPlay: number ; // 最小参与次数
	MaxPlay: number ; // 最大参与次数
	ShowItems: string ; // 前端展示奖励
	Items: string ; // 后端实际奖励
}
// 神域小地图
declare class Cfg_SmallMap {
	ID: number ; // id
	Belong: number ; // 所属区域
	Coordinate: string ; // 坐标
	ShowLv: string ; // 显示等级
	SIZE: number ; // 字体大小
}
// 神域属性表
declare class Cfg_GodAttribute {
	ID: number ; // ID
	StringValue: string ; // 字符串值
	IntValue: number ; // int值
}
// 神域帮助说明
declare class Cfg_ShenyuHelp {
	Id: number ; // 标签序号
	Item: string ; // 免费领取道具
	Text: string ; // 说明文本
}
// 神域图文说明
declare class Cfg_ShenyuHelp_Picture {
	Id: number ; // 标签序号
	Number: number ; // 序号
	Desc: string ; // 描述（程序不用）
	Picture: string ; // 图片
	Help: string ; // 说明文本
}
// 建筑表
declare class Cfg_SectionBuild {
	BuildingId: number ; // 建筑ID
	TypeId: number ; // 地块类型ID
}
// 战报表
declare class Cfg_GodMail {
	Tpl_ID: number ; // 模板ID
	Tpl_Title: string ; // 标题
	Tpl_Content: string ; // 正文内容
}
// 神域排行榜表
declare class Cfg_GodRank {
	RankType: number ; // 排行榜类型
	Name: string ; // 排行榜名称
	Param: number ; // 排行榜参数
	ParamClient: number ; // 排行榜参数(前端使用)
	RankAll: number ; // 排行总名次
}
// 神域排行榜奖励表
declare class Cfg_GodRankPrize {
	ID: number ; // 奖励id
	RankType: number ; // 排行榜类型
	Desc: string ; // 排行榜名称
	RankMin: number ; // 排名下限（包含）
	RankMax: number ; // 排名上限（包含）
	BasePrize: number ; // 奖励组ID
}
// 神域模型
declare class Cfg_SY_Model {
	Sex: number ; // 性别
	ID: number ; // 模型ID
	Scale: number ; // 缩放比例
}
// 神域殿堂
declare class Cfg_SYDT_Map {
	ID: number ; // id
	Coordinate: string ; // 模型坐标
	FindLocation: string ; // 寻路坐标
	Direction: number ; // 方向
	Title: string ; // 称号
	RankTitle: string ; // 排行榜称号
	UITitle: string ; // 界面称号
	SYBZTitle: string ; // 神域宝藏界面称号
	FirstTitle: string ; //
}
// 神域编号
declare class Cfg_SYDT_Num {
	ID: number ; // 神域id
	ShowName: string ; // 显示所属神域
}
// 神域活动任务表
declare class Cfg_SY_ActTask {
	Id: number ; // 任务ID
	Type: number ; // 活动ID
	Name: string ; // 任务名（程序在用的）
	CounterType: number ; // 任务计数类型
	TargetCount: number ; // 任务完成条件
	GroupPrize: number ; // 奖励组
	Order: number ; // 任务排序序号
	ClientFuncId: number ; // 未完成任务时候跳转新功能开放表功能id
	ShowCond: number ; // 显示条件：任务ID此字段有值时，完成填写任务才会显示该任务
}
// 神域活动排行榜表
declare class Cfg_SY_ActRank {
	Id: number ; // 活动ID此列的数值必须与活动数据库的活动ID一一对应
	Name: string ; // 排行榜名称
	RankCond: number ; // 排行榜类型
	RankAll: number ; // 排行总名次
}
// 神域活动排行榜奖励表
declare class Cfg_SY_ActRankPrize {
	Id: number ; // ID
	ActId: number ; // 活动ID此列的数值必须与活动数据库的活动ID一一对应
	RankLimit: number ; // 名次积分限制
	RankMin: number ; // 排名下限（包含）
	RankMax: number ; // 排名上限（包含）
	GroupPrize: number ; // 奖励组
}
// 神域通行证等级
declare class Cfg_SY_PassCheckLevel {
	Level: number ; // 等级
	Prize1: string ; // 普通奖励
	Prize2: string ; // 金令奖励
	Exp: number ; // 上一级升到此级所需经验
	ShowBigPrize: number ; // 此级奖励是否为节点奖励
	ShowModel: number ; // 此等级的金令奖励道具展示为大奖模型
	ShowReward: number ; // 购买界面展示的奖励
}
// 神域通行证任务
declare class Cfg_SY_PassCheckTask {
	Id: number ; // 任务ID
	Type: number ; // 是否是每日刷新任务40：阶段任务每日刷新41：赛季任务42: 全民福利任务
	Desc: string ; // 任务标题
	Name: string ; // 任务详细名称
	CounterType: number ; // 任务类型
	Independent: number ; // 是否独立计数
	Param: string ; // 参数
	TargetCount: number ; // 任务完成条件
	Exp: number ; // 奖励经验值
	Prize2: string ; // 道具奖励全民福利用到
	Order: number ; // 排序号
	ClientFuncId: number ; // 客户端功能跳转ID
	TaskLock: number ; // 进阶宝藏解锁任务
}
// 神域通行证
declare class Cfg_SY_ActPassCheck {
	GoodsId: number ; // 金令解锁对应商品Id
	AddBuyInternal: number ; // 增加假的购买人数间隔时间（秒）
	AddBuyRate: number ; // 增加假的购买人数概率万分比
	AddBuyMax: number ; // 增加假的购买人数最大上限
	Propor: number ; // 仙玉比通行证比值1:10
	BuyMaxExp: number ; // 能够购买最大经验
	Loop: number ; // 循环开始等级
}
// 神营活动入口表
declare class Cfg_SY_Activity {
	Id: number ; // 活动模板ID不重复勿动
	Name: string ; // 活动名称
	ActType: number ; // 活动类型
	Duration: string ; // 活动持续时间
	ShowTime: string ; // 活动展示时间
	Pos: number ; // 活动图标显示位置
	Order: number ; // 图标排序
	PosIcon: number ; // 主界面图标ID
	OnceCircle: number ; // ICO光效控制0永久存在1点界面消失，刷新游戏重复
	ContainerCircle: number ; // 处于活动容器
}
// 成就任务表
declare class Cfg_GodFbAchiTask {
	Id: number ; // 任务ID
	Name: string ; // 任务描述
	CounterType: number ; // 任务计数类型
	Param: string ; // 参数
	TargetCount: number ; // 任务完成条件
	Independent: number ; // 是否独立计数
	Prize: number ; // 完成任务奖励组ID
	ClientFuncId: number ; // 跳转功能id
}
// 关卡天宫排名奖
declare class Cfg_GodTGRankPrize {
	Id: number ; // 奖励id
	Event: number ; // 所属活动
	Rank: string ; // 排名区间
	FuirstRewards: number ; // 排名奖励组ID
}
// 关卡天宫积分排名配置
declare class Cfg_GodTGRankPoint {
	ID: number ; // 奖励id
	Event: number ; // 副本
	Stage: number ; // 阶段
	Rank: string ; // 排名区间
	Point: number ; // 积分
}
// 神域活动
declare class Cfg_GodActivity {
	ID: number ; // id
	Name: string ; // 地点名称
	Belong: number ; // 所属副本
	AreaType: number ; // 区域类型
	Fight: number ; // 是否可以战斗
	Coordinate: string ; // 区域中心坐标
	Centre: string ; // 平台中心点
	Radius: number ; // 区域半径
	Adjoin: string ; // 相邻地块
	MonsterSeat: string ; // 怪物坐标
	MonsterRenovate: string ; // 怪物刷新id
	MonsterRevive: number ; // 怪物是否可自动复活
	MaxPlayer: string ; // 最大人数
	Guide: string ; // 路标
	MyRadius: number ; // 自己偏移半径
	NewCoor: string ; // 象限坐标
}
// 神域buff
declare class Cfg_GodBuff {
	BuffId: number ; // id
	Itmid: number ; // 对应道具id
	BuffName: string ; // buff名称
	BuffIcon: number ; // 图标id
	Character: number ; // 品质
	BuffType: number ; // buff类型
	BattleBuff: number ; // 是否为战斗buff
	IsPVP: number ; // 是否仅为pvp
	Priority: number ; // 优先级
	IsGroup: number ; // 是否同阵营
	IsFuben: number ; // 是否副本
	Round: number ; // 持续时间
	Times: number ; // 持续次数
	System: string ; // 生效的副本
	ParamClient: string ; // buff描述
	Index: number ; // 技能排序
	Param1: number ; // 效果类型1
	Param2: number ; // 效果类型2
}
// 神域神兽
declare class Cfg_ShenWeiShenShou {
	Id: number ; // 阶段id
	HPPercent: number ; // 首领血量百分比
	Prize: number ; // 阶段奖励
}
// 神域行动值购买表
declare class Cfg_GodActionBuy {
	Type: number ; // 购买类型
	BuyTimes: number ; // 购买次数
	Action: number ; // 行动值
	ShowAction: number ; // 行动值
	CoinType: number ; // 购买消耗货币类型
	CoinNum: number ; // 购买消耗货币数量
}
// 神域赛季表
declare class Cfg_GodSeason {
	GodName: number ; // 赛季阶段
	TaskId: string ; // 任务
	Prize: number ; // 阶段奖励组ID
}
// 赛季任务表
declare class Cfg_SeasonTask {
	Id: number ; // 任务ID
	Name: string ; // 任务描述
	CounterType: number ; // 任务计数类型
	Param: string ; // 参数
	TargetCount: number ; // 任务完成条件
	Independent: number ; // 是否独立计数
	Prize: number ; // 完成任务奖励组ID
	ClientFuncId: number ; // 跳转功能id
}
// 神域主线引导
declare class Cfg_SY_LinkTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名（程序在用的）
	Nextid: number ; // 下一个任务id
	ClientFuncId: number ; // 引导id
	CounterType: number ; // 任务计数类型
	Param: string ; // 参数
	Independent: number ; // 是否独立计数（0：否，不独立计数。1：是，独立计数）
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励
	Hand: number ; // 指引一次后不再显示手
}
// 神域引导任务
declare class Cfg_SY_GuideTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名（程序在用的）
	NextID: number ; // 接取任务条件下一任务ID
	instance: number ; // 是否副本
	ClientFuncId: number ; // 客户端功能id
	TipsType: number ; // 引导类型
	TipsContent: string ; // 引导提示语（是否需要提示语）
	Ren: number ; // 立绘方向
	Direct: number ; // 箭头方向
	Force: number ; // 是否需要强制引导
	GuideType: number ; // 引导要点击的按钮
	CounterType: number ; // 任务计数类型
	Param: string ; // 参数（如指定某个ID）任务专用字段
	Function: string ; // 功能列表
	Pos: string ; // 箭头指向的位置
	Time: number ; // 倒计时执行下一步(秒)
	Independent: number ; // 是否独立计数（0：否，不独立计数。1：是，独立计数）
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励组id
	ShowBg: number ; // 是否显示背景层
}
// 神域引导任务
declare class Cfg_SY_GuideLink {
	ClientFuncId: number ; // 指引id
	TaskId: number ; // 任务id
	NextID: number ; // 接取任务条件下一任务ID
	ButtonID: number ; // 按钮id
	TipsContent: string ; // 引导提示语（是否需要提示语）
	Ren: number ; // 立绘方向
	Direct: number ; // 箭头方向
	Force: number ; // 是否需要强制引导
	Time: number ; // 倒计时执行下一步(秒)
}
// 龙脉刷怪表
declare class Cfg_SYLM_Monster {
	Id: number ; // Id
	MonsterType: number ; // 怪物类型1.巡山小妖 2.百妖统领 3.三界妖将 4.嗜血狂魔 5.九天妖王 6.魔化阵营精英
	BornRate: number ; // 刷新权重
	MonsterId: number ; // 怪物编号
	FightRange: string ; // 血量放大的比例：小怪取的挑战者自身；精英怪取的镜像玩家
	FightRewardId: number ; // 参与奖奖励组编号
	KillRewardId: number ; // 击杀奖奖励组编号
	ExtraRewardId: number ; // 协战奖奖励组编号
	Location: string ; // 怪物坐标
	ExtraMission: number ; // 悬赏任务普通任务刷新数量（前端显示支持最多到3条）
	ShowDesc: number ; // 前端显示属性描述id
}
// 龙脉协战表
declare class Cfg_SYLM_FightTogether {
	Id: number ; // 条件Id
	Desc: string ; // 条件描述
	MonsterType: number ; // 怪物类型1.巡山小妖 2.百妖统领 3.三界妖将 4.嗜血狂魔 5.九天妖王 6.魔化阵营精英
	PartnerType: string ; // 伙伴类型1-宠物2-天仙3-战神4-仙童
	PartnerNum: number ; // 协战使用伙伴数量
	PartnerId: string ; // 伙伴Id
	Quality: number ; // 品质1.绿色2.蓝色3.紫色4.橙色5.红色6.金色7.七彩
	RewardId: number ; // 协战额外奖励奖励组
}
// 龙脉属性表
declare class Cfg_SYLM_Attribute {
	ID: number ; // ID
	StringValue: string ; // 字符串值
	IntValue: number ; // int值
}
// 龙脉属性表
declare class Cfg_SYLM_Inspire {
	ID: number ; // id
	Times: number ; // 次数
	CostType: number ; // 货币类型
	CostNum: number ; // 货币数量
	GetBuff: number ; // 获得buff
}
// 神秘商店配置
declare class Cfg_SecretMallCfg {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 神秘商店
declare class Cfg_SecretMall {
	Id: number ; // id
	GoodsTitle: string ; // 商品名称
	ItemString: string ; // 道具配置
	Sort: number ; // 排序2020-12-23注释该列前后端均不用。商品排序用MustShow字段。程序改完解析后可删除本字段
	CostItem: number ; // 消耗道具类型1 仙玉2 元宝3 金币
	OldPrize: number ; // 原价消耗货币数量
	Prize: number ; // 现价消耗货币数量
	Sale: number ; // 显示折扣0表示无折扣
}
// 神龙升星表
declare class Cfg_SL_Star {
	ID: number ; // 唯一ID
	Star: number ; // 星级
	Node: number ; // 节点
	AttrId: number ; // 处于此星级属性ID
	NodeIcon: string ; // 对应小节点图标
	BreakCostItem: string ; // 激活消耗道具
	StarCostItem: string ; // 升星消耗道具
	Skills: string ; // 激活技能
	SkillsBuff: string ; // 激活神域BUFF
	Indexs: string ; // 技能下一级索引
}
// 神龙升级道具表
declare class Cfg_SL_LevItem {
	Id: number ; // 道具编号
	Name: string ; // 道具名称
	Exp: number ; // 经验值
}
// 神龙许愿购买次数配置
declare class Cfg_DragonBuy {
	Id: number ; // 唯一值
	ItemId: number ; // 道具Id
	ItemNum: number ; // 道具数量
	GoldType: number ; // 货币类型
	Times_Min: number ; // 购买次数
	Times_Max: number ; // 购买次数
	Discount: number ; // 折扣
	Amount: number ; // 价格
}
// 配置表
declare class Cfg_Config_SL {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 神龙-龙魂升级表
declare class Cfg_SL_Soul_LevelUp {
	Level: number ; // 龙魂等级
	BaseAttrMulti: number ; // 基础属性加成万分比
	AddAttrNum: number ; // 增加随机属性条数
	Qty_Exp_1: number ; // 绿色龙魂升级经验
	Qty_Exp_2: number ; // 蓝色龙魂升级经验
	Qty_Exp_3: number ; // 紫色龙魂升级经验
	Qty_Exp_4: number ; // 橙色龙魂升级经验
	Qty_Exp_5: number ; // 红色龙魂升级经验
	Qty_Exp_6: number ; // 金色龙魂升级经验
	Qty_Exp_7: number ; // 七彩色龙魂升级经验
	SkillLevel: number ; // 龙魂技能等级
}
// 神龙-龙魂孔位表
declare class Cfg_SL_Soulkong {
	PosId: number ; // 龙魂孔位
	PosOdd: number ; // 孔位概率万分比
	SkinOdd: string ; // 皮肤ID:皮肤概率
	SoulLev: number ; // 龙魂等级限制
	SoulQuality: number ; // 龙魂品质限制
	LimitType: number ; // 孔位限制类型
}
// 神龙-龙魂表
declare class Cfg_SL_Soul {
	Id: number ; // 龙魂id
	Name: string ; // 名字
	SoulType: number ; // 龙魂类型
	Sort: number ; // 用途分类
	OutExp: number ; // 作为被吞噬的材料产生的经验值
	LevelUpField: string ; // 升级所需经验对应配置
	MaxLevel: number ; // 可升级最大等级
	OutItemInfo: string ; // 龙魂分解产出道具
	SkillId: number ; // 龙魂携带技能
	MinCount: number ; // 初始最小随机数量
	MaxCount: number ; // 初始最大随机数量
	MaxCount2: number ; // 该龙魂最大随机属性条数
	Attr: string ; // 属性编号库
}
// 神龙表
declare class Cfg_SL {
	Name: string ; // 神龙名称
	Grade: number ; // 阶级
	MaxLev: number ; // 等级
	GradePercent: number ; // 升阶属性万分比
	AttrId1: number ; // 处于此等级基础属性ID
	AttrId2: number ; // 处于此等级递增属性ID
	NextLevExp1: number ; // 处于此等级基础经验
	NextLevExp2: number ; // 处于此等级递增经验
	RankCostItem: string ; // 升阶道具
	Reborn: string ; // 升阶条件(转生|重数)
	Skills: string ; // 激活技能
	AnimId: string ; // 形象
}
// 表情包
declare class Cfg_Emoj {
	Id: number ; // 单个表情ID
	Group: number ; // 所属分组0普通，1VIP，2月卡，3终身卡
	Code: string ; // 发送代码
	Name: string ; // 表情名称
	AnimId: number ; // 美术资源ID
}
// 聊天配置表
declare class Cfg_Config_Chat {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 头像相关皮肤表
declare class Cfg_HeadFrameSkin {
	Id: number ; // ID不要与皮肤总表重复
	Type: number ; // 皮肤类型
	Name: string ; // 皮肤名称
	UnlockItem: number ; // 解锁激活所需道具ID
	AttrId: number ; // 激活属性ID
	AutoWear: number ; // 是否自动穿戴，0否1是
	CanLevelUp: number ; // 是否可升级0否1是
	AnimId: string ; // 美术资源ID男资源|女资源
	Level: number ; // 到达此等级时切换动态资源
	Dynamic: string ; // 动态美术资源ID
	IsHide: number ; // 是否隐藏
	OffsetY: string ; // Y轴偏移高度
}
// 游戏助手
declare class Cfg_GameAssistant {
	Id: number ; // 托管id
	GroupId: number ; // 组id
	Name: string ; // 托管姓名
	Order: number ; // 界面排序
	FunId: number ; // 对应功能表id
	Priority: number ; // 托管优先级
	AddSetState: number ; // 是否有额外设置
	isClose: number ; // 是否关闭
}
// 助手配置表
declare class Cfg_Config_Helper {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 图鉴表
declare class Cfg_PhotoBook {
	Id: number ; // ID
	Name: string ; // 中文名称
	Class: number ; // 大类
	Type: number ; // 类型
	Quality: number ; // 品质
	UnlockItem: number ; // 解锁所需道具ID
	StrengthItem: number ; // 强化所需道具ID
	AnimId: number ; // 图片资源id
	Attr: number ; // 属性ID
	ExtAttr: string ; // 额外属性
	SkillId: string ; // 技能
	IncreaseId: string ; // 增幅表ID
}
// 图鉴升星表
declare class Cfg_PhotoBookUp {
	Class: number ; // 类型
	Quality: number ; // 品质
	Level: number ; // 星级
	NeedNum: number ; // 需要道具数量
	Attr: number ; // 属性翻倍万分比
	NeedStrengthLev: number ; // 升星所需强化等级（仙童玩具）
}
// 图鉴套装表
declare class Cfg_PhotoBookSuit {
	Class: number ; // 大类
	Type: number ; // 类型
	Need: number ; // 所需同类图鉴个数
	Effect: string ; // 激活效果
	Attr: number ; // 属性ID
	Percent: number ; // 战力加成万分比
	SkillId: number ; // 技能ID
	Desc: string ; // 描述
}
// 图鉴收集奖励配置
declare class Cfg_PhotoBookPrize {
	Class: number ; // 大类
	Num: number ; // 数量
	Prize: string ; // 奖励
}
// 图鉴强化表
declare class Cfg_PhotoBookStrength {
	Class: number ; // 类型
	Quality: number ; // 品质
	Level: number ; // 强化等级
	NeedNum: number ; // 需要道具数量
	Attr: number ; // 属性ID
	NeedStarLev: number ; // 强化所需玩具星级
}
// 玩具大师
declare class Cfg_ToyMaster {
	Id: number ; // 编号
	Level: number ; // 等级
	Star: number ; // 星星数量
	Reborn: number ; // 转生转数
	Break: number ; // 转生重数
	Stage: number ; // 关卡
	Attr: number ; // 属性ID
	SkillId: string ; // 光环技能ID
	IncreaseId: string ; // 光环增幅ID
	SkillPos: string ; // 技能位置
}
// 合体天仙表
declare class Cfg_PetAMerge {
	PetAId: number ; // 合体仙侣id
	Name: string ; // 合体仙侣中文名称
	Quality: number ; // 品质
	Attr: number ; // 基础属性ID
	ActiveSkillId: string ; // 默认主动技能ID
	PassiveSkills: string ; // 默认被动技能ID
	SkillCount: number ; // 升到此品质解锁技能栏位
	AwakePos: number ; // 升到此品质解锁觉醒位
	AnimId: number ; // 美术资源id
}
// 合体天仙星级表
declare class Cfg_PetAMergeStar {
	Id: number ; // 编号
	Star: number ; // 星级
	SkillLev: number ; // 基础技能等级
}
// 合体天仙等级表
declare class Cfg_PetAMergeLev {
	Id: number ; // 编号
	Lev: number ; // 等级
	AttrPresent: number ; // 基础属性加成万分比
}
// 合体天仙觉醒表
declare class Cfg_PetAMergeAwake {
	Id: number ; // 编号
	Quality: number ; // 品质
	AwakeAttrId: number ; // 觉醒属性
	AwakeSkillId: number ; // 觉醒技能ID
}
// 配置表
declare class Cfg_Config_PetAM {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 升仙
declare class Cfg_FairySkinExt_ShengXian {
	SkinId: number ; // 升仙皮肤ID
	CondStar: number ; // 激活升仙星级
	GCGrade: number ; // 升仙等阶
	GCLevel: number ; // 升仙等级
	LimitStar: number ; // 可升星上限
	AttrId: number ; // 增加属性
	ShowSkillId: number ; // 技能提升前端展示
	ShowSkilDesc: string ; // 技能提升描述
	SkillId: string ; // 技能提升实际生效
	SkillId2: string ; // 技能提升实际生效
	CostItem: string ; // 道具消耗
	SkillLv: string ; // 神通技升级条件
	PassiveSkillId: string ; // 升仙被动技能
	Fattr: number ; // 激活助战羁绊
}
// 皮肤配置
declare class Cfg_FairySkinExt_Peizhi {
	SkinId: number ; // 皮肤id
	Item: number ; // 道具id
}
// 主动技能组
declare class Cfg_FairySkinExt_zdjn {
	SkillId: number ; // 当前主动技能ID
	ShowSkillId: number ; // 前端展示配置ID
}
// 觉醒等级表
declare class Cfg_PetAMerge_JXLevel {
	Quality: number ; // 合体天仙觉醒品质
	GCGrade: number ; // 升仙等阶
	GCLevel: number ; // 升仙等级
	Level: number ; // 技能等级
}
// 主被动等级表
declare class Cfg_PetAMerge_ZBDLevel {
	Star: number ; // 合体天仙星级
	GCGrade: number ; // 升仙等阶
	GCLevel: number ; // 升仙等级
	Level1: number ; // 主动技能等级
	Level2: string ; // 被动技能1等级
	Level3: string ; // 被动技能2等级
	Level4: string ; // 被动技能3等级
	Level5: string ; // 被动技能4等级
}
// 天仙升星表
declare class Cfg_PetAStar {
	Id: number ; // ID
	PetAId: number ; // 天仙ID
	Star: number ; // 星级
	NeedItemCount: number ; // 所需碎片数量
	Attr: number ; // 对应星级属性ID
	SkillId: number ; // 升星技能ID
}
// 天仙升级表
declare class Cfg_PetALevel {
	Id: number ; // 编号
	Name: string ; // 名称
	GradeType: number ; // 系统类型
	Level: number ; // 等级
	AttrId: number ; // 属性ID
	AddExp: number ; // 吃丹增加经验
	NeedTotalExp: number ; // 升级需要经验
	NeedItem: number ; // 需要道具
	UnlockSkill: number ; // 解锁技能栏位
	SkinId: number ; // 默认皮肤编号
}
// 天仙表
declare class Cfg_PetA {
	PetAId: number ; // 仙侣id
	Name: string ; // 仙侣中文名称
	Type: number ; // 类型
	Quality: number ; // 品质
	Attr: number ; // 基础属性ID
	ActiveSkillId: string ; // 默认主动技能ID和等级
	PassiveSkills: string ; // 默认被动技能ID和等级列表
	UnlockItem: number ; // 激活所需道具（精魄）ID
	UnlockItemTatter: string ; // 碎片激活道具Id:数量
	StarUpItem: number ; // 升星所需道具（碎片）ID
	RareB: number ; // 是否绝版
	AnimId: number ; // 美术资源id
	IsVisible: number ; // 是否在列表中可见
	Rarity: number ; // 稀有度
	UpLev: number ; // 上阵等级
}
// 提示消息表
declare class Cfg_ClientMsg {
	Id: number ; // 说明ID
	Module: string ; // 功能
	MSG: string ; // 描述
	ActId: number ; // 活动ID
	Img: string ; // 插图
}
// 提示消息表
declare class Cfg_Err {
	Id: number ; // 编号
	MSG: string ; // 提示内容
}
// 特性表
declare class Cfg_Feature {
	FeatureId: number ; // 特性组ID
	ObjType: number ; // 特性类型
	ObjId: number ; // 技能\属性\增幅id
	ObjLevel: number ; // 技能\属性\增幅等级
	Order: number ; // 组内显示排序值
	Desc: string ; // 特性描述
}
// 特殊技能表
declare class Cfg_Special_Skill {
	Id: number ; // Id
	EffectRound: string ; // 生效范围 [N|M]
	ActiveInterval: number ; // 起效间隔
	ActiveType: number ; // 起效时机
	SkillParam: string ; // 效果参数
	DeadResult: number ; // 死亡判定
	MsgC: string ; // 效果文字描述
}
// 特殊登录公告
declare class Cfg_SpecialLoginTips {
	Id: number ; // 序号
	TipsType: number ; // 荣誉类型
	Rank: number ; // 名次
	Priority: number ; // 优先级
	Type: number ; // 类型
	IsCross: number ; // 是否跨服
	TipCD: number ; // 提醒CD
	Title: number ; // 标题资源
	Icon: string ; // 图标
	Name: string ; // 名称
	Enable: number ; // 是否启用
	Desc: string ; // 描述
	Time: number ; // 弹窗持续时间（秒）
}
// 通用养成升级
declare class Cfg_Develop_Level {
	Desc: string ; // 注释（程序不用）
	FuncId: number ; // 系统Id功能表ID
	Type: string ; // 子系统类型自定义字符串
	ObjId: number ; // 对象Id单个培养对象填-1表示对此系统所有对象通用
	Part: number ; // 部位Id单个格子填-1表示对此系统\对象所有部位通用
	Level: number ; // 等级填-1表示所有等级通用
	Star: number ; // 星级填-1表示所有星级通用
	AttrId: number ; // 处于此等级属性ID
	Total: number ; // 处于此等级经验进度条上限
	NeedItem: string ; // 处于此等级单次升级需要道具ID:数量
}
// 通用养成吃丹
declare class Cfg_Develop_Drug {
	Desc: string ; // 注释（程序不用）
	FuncId: number ; // 系统Id功能表ID
	ObjId: number ; // 对象Id单个培养对象填-1表示对此系统所有对象通用
	Part: number ; // 部位Id单个格子填-1表示对此系统\对象所有部位通用
	NeedItem: number ; // 丹药道具ID
	Max: number ; // 最大使用数量
	Attr: number ; // 单个丹药属性ID若不填则读道具表的属性Id
}
// 通用养成解锁
declare class Cfg_Develop_Unlock {
	Desc: string ; // 注释（程序不用）
	FuncId: number ; // 系统Id功能表ID
	Type: string ; // 子系统类型自定义字符串
	ObjId: number ; // 对象Id单个培养对象填-1表示对此系统所有对象通用
	Part: number ; // 部位Id单个格子填-1表示对此系统\对象所有部位通用
	Level: number ; // 人物转重等级限制转生重数等级融合值
	VIP: number ; // 人物VIP等级限制
	NeedItem: string ; // 解锁需要道具ID:数量
}
// VIP特权描述
declare class Cfg_VIP_Desc {
	ID: number ; // 描述id
	Desc: string ; // 描述内容
}
// VIP等级表
declare class Cfg_VIP {
	VIPLevel: number ; // vip等级
	VIPName: string ; // 显示名称
	Exp: number ; // 升到此等级需要的VIP经验值
	Prize: string ; // 到达等级奖励
	Welfare: number ; // 每日vip经验奖励
	isShowFv: number ; // 是否显示战力
	NamePic: string ; // 奖励名称图片资源
	PrizeName: string ; // 奖励名称
	PrizeType: number ; // 奖励资源类型
	PrizeResId: string ; // 奖励展示资源ID
	UnlockFunc: string ; // 解锁功能
	MITime: string ; // 材料副本购买次数
	JJCTime: string ; // 竞技场购买次数
	BossTime: string ; // 多人BOSS购买次数
	BossTime2: string ; // 悬赏BOSS购买次数
	MITime2: string ; // 经验试炼购买次数
	MITime3: string ; // 金币试炼购买次数
	MITime4: string ; // 快速挂机购买次数
	MITime5: string ; // 组队副本购买次数
	XYCMTime: string ; // 降妖除魔购买次数
	XSTime: string ; // 凶灵岛购买次数
	XSTime2: string ; // 凶煞岛购买次数
	XSTime3: string ; // 凶冥岛购买次数
	XLSLTime: string ; // 仙林狩猎购买次数
	MeltCoinAdd: number ; // 熔炼所得元宝加成万分比
	DayPrize: string ; // 每日礼包奖励
	PgCount: number ; // 主页新增特权显示数量
}
// VIP等级表
declare class Cfg_VIPOLD {
	VIPLevel: number ; // vip等级
	VIPName: string ; // 显示名称
	Exp: number ; // 升到此等级需要的VIP经验值
	Prize: string ; // 到达等级奖励
	isShowFv: number ; // 是否显示战力
	NamePic: string ; // 奖励名称图片资源
	PrizeName: string ; // 奖励名称
	PrizeType: number ; // 奖励资源类型
	PrizeResId: string ; // 奖励展示资源ID
	UnlockFunc: string ; // 解锁功能
	MITime: string ; // 材料副本购买次数
	JJCTime: string ; // 竞技场购买次数
	BossTime: string ; // 多人BOSS购买次数
	BossTime2: string ; // 悬赏BOSS购买次数
	MITime2: string ; // 经验试炼购买次数
	MITime3: string ; // 金币试炼购买次数
	MITime4: string ; // 快速挂机购买次数
	MeltCoinAdd: number ; // 熔炼所得元宝加成万分比
}
// VIP关卡赠送经验
declare class Cfg_VIPStage {
	Stage: number ; // 通关总关卡数
	VIPExp: number ; // 赠送VIP经验值
}
// 委托表
declare class Cfg_Entrust {
	EntrustId: number ; // 编号
	Param1: number ; // 参数1
	Param2: number ; // 参数2
	Desc: string ; // 注释列
}
// 我要变强任务
declare class Cfg_IWantTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	Desc: string ; // 描述
	Type: number ; // 任务类型序号
	Star: number ; // 推荐星级
	IWantType: number ; // 我要变强类型
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	Independent: number ; // 是否独立计数（接取任务时的计数为0，或为当前的累加值）
	TargetCount: number ; // 任务完成条件
	Prize: number ; // 完成任务奖励积分
	Anim: string ; // 美术资源ID
	Cmd: number ; // 跳转页面
	Order: number ; // 任务序号
	ClientFuncId: number ; // 跳转页面填：功能表，功能id
	Visable: number ; // 是否可见
}
// 我要变强
declare class Cfg_IWant {
	Id: number ; // 任务ID
	Note: string ; // 注释列
	Type: number ; // 任务类型序号
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	GetCondition: string ; // 任务接取(刷新)条件
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励方案id数组
}
// 王者争霸周奖励
declare class Cfg_KingWeekPrize {
	Rank: number ; // 排名
	Prize: number ; // 奖励
}
// 王者争霸段位
declare class Cfg_KingRank {
	Id: number ; // 段位Id
	Name: string ; // 段位名称
	RankNum: number ; // 大段位中的小段位
	Rank: number ; // 大段位序号
	ShowStar: number ; // 前端显示此段位最高星级
	Star: number ; // 升至下段位所需星数
	RobotFV1: number ; // 匹配机器人名次上浮个数
	RobotRate1: number ; // 匹配机器人名次上浮动概率
	RobotFV2: number ; // 匹配机器人名次下浮个数
	RobotRate2: number ; // 匹配机器人名次下浮动概率
	WinPrize: number ; // 胜利奖励
	LosePrize: number ; // 失败奖励
	DayPrize: number ; // 周段位结算奖励
	Medal: number ; // 激活圣杯道具ID
}
// 王者争霸配置表
declare class Cfg_Config_King {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 王者之翼分解表
declare class Cfg_King_Wing_Break {
	ItemId: number ; // 玉石ID
	BreakItem: string ; // 获取道具及数量
}
// 王者之翼升星表
declare class Cfg_King_Wing_Star {
	Id: number ; // 套装id
	Name: string ; // 中文名称
	Star: number ; // 星级
	CostItem: string ; // 消耗道具及数量
	LifeLev: number ; // 条件--命格等级
	BaseAttr: number ; // 王者之翼基础属性Id
}
// 王者命格升阶表
declare class Cfg_King_Life_Lev {
	Id: number ; // 套装id
	Lev: number ; // 命格阶级
	CostItem: string ; // 消耗道具及数量
	AttrPect: number ; // 属性万分比加成
}
// 王者命格表
declare class Cfg_King_Life {
	Id: number ; // 套装id
	Pos: number ; // 命格位置
	BaseAttr: number ; // 属性Id
}
// 配置表
declare class Cfg_KingSuitConfig {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 王者套装升阶表
declare class Cfg_King_Suit_Lev {
	Id: number ; // 套装id
	Lev: number ; // 阶级
	BaseAttr: number ; // 套装属性id
}
// 王者套装收集表
declare class Cfg_King_Suit_Collect {
	Id: number ; // 套装id
	CollectId: number ; // 收集编号
	Lev: number ; // 阶级
	Count: number ; // 穿戴个数
	BaseAttr: number ; // 收集基础属性Id
	SuitSkillLev: number ; // 王者套装技能等级
}
// 王者套装表
declare class Cfg_King_Suit {
	Id: number ; // 套装id
	Name: string ; // 中文名称
	Quality: number ; // 品质
	FeiShengId: number ; // 开启条件-飞升条件Id
	SuitResId: number ; // 法相-美术资源id
	WingResId: number ; // 王者之翼美术资源id
	SuitSkillId: number ; // 王者套装技能ID
	KingLifeSkillId: number ; // 王者命格技能ID
	KingLifeLevDiff: number ; // 王者命格技能生效条件
	SrcItem: string ; // 提示道具（来源面板提示）
}
// 王者装备合成
declare class Cfg_KingEquipCompose {
	ItemId: number ; // 道具Id
	CostType: number ; // 消耗类型
	CostItem: string ; // 消耗道具及数量
	ExtraCostItem: string ; // 额外消耗及数量
}
// 神丹
declare class Cfg_GoldDrug {
	Type: number ; // 神丹类型1无视防御  2减免无视  3伤害加深  4伤害减免
	Grade: number ; // 等阶
	ItemId: number ; // 道具编号
	MaxExp: number ; // 神丹上限
	Cost: string ; // 突破消耗
	SpeAttrId: number ; // 特殊属性
	SpeAttrRate: number ; // 特殊属性万分比
}
// 丹药基础
declare class Cfg_DrugBase {
	Class: number ; // 大类型
	Type: number ; // 类型
	Name: string ; // 名称
	CostItemId: number ; // 消耗道具Id
	LimitCount: number ; // 基础次数上限
	AttrId: number ; // 基础属性Id
	PicId: string ; // icon的图片资源
	BgIconId: string ; // 背景图资源
	NameStr: string ; // 名字图片资源
}
// 丹药基础上限
declare class Cfg_DrugBaseLimit {
	Class: number ; // 大类型
	Type: number ; // 类型
	LevMin: number ; // 玩具大师最小等级
	LevMax: number ; // 玩具大师最大等级
	AddCount: number ; // 增加的数量
}
// 仙丹
declare class Cfg_Drug {
	Type: number ; // 仙丹类型1生命  2攻击  3攻速  4防御5抗暴  6暴击  7闪避  8命中
	Level: number ; // 等级
	ItemId: number ; // 道具编号
}
// 仙丹使用上限
declare class Cfg_DrugLimit {
	Level: number ; // 仙丹等级
	Count: number ; // 可使用上限
}
// 仙丹合成
declare class Cfg_DrugTwo {
	Level: number ; // 仙丹等级
	Count: number ; // 所需上级同类仙丹个数
}
// 仙宗天助Buff
declare class Cfg_SectBuff {
	Id: number ; // id
	SkillId: number ; // BUFFid
	Level: number ; // BUFF等级
	Days: string ; // 对应宗主连任时间天数，上下限[,]区间
	BuffId: number ; // 技能BUFF id
}
// 守护兽DeBuff
declare class Cfg_SectDeBuff {
	Id: number ; // id
	WeakenPer: number ; // 守护兽战力削弱比例万分比
	Days: string ; // 对应宗主连任时间天数，上下限[,]区间
}
// 仙山配置
declare class Cfg_Sect_ImmortalMountain {
	Id: number ; // 仙山ID
	Name: string ; // 仙山名称
	Items: string ; // 基础奖励
	Prestige: number ; // 基础声望
	Addition: number ; // 仙山加成万分比
	Pos1: number ; // 位置1奖励万分比
	Pos2: number ; // 位置2奖励万分比
	Pos3: number ; // 位置3奖励万分比
	Pos4: number ; // 位置4奖励万分比
	Pos5: number ; // 位置5奖励万分比
	Pos6: number ; // 位置6奖励万分比
	Pos7: number ; // 位置7奖励万分比
	Interval: number ; // 奖励周期(单位:秒)
}
// 同宗门占领人数加成配置
declare class Cfg_Sect_OccupyNum {
	Num: number ; // 人数
	Addition: number ; // 仙山人数加成万分比
}
// 仙宗公告表
declare class Cfg_SectNotice {
	Id: number ; // 公告ID
	ActId: number ; // 联动定时活动ID
	MSG: string ; // 公告内容
}
// 仙宗功法表
declare class Cfg_SectSkill {
	Id: number ; // 功法ID
	Name: string ; // 功法名称
	Skill_Type: number ; // 功法类型
	SkillBeginId: number ; // 技能初始值属性id
	SkillIncId: number ; // 技能递增值属性id
	Sect_level: number ; // 解锁所需宗门等级
	Max_Level: number ; // 最大等级
	SkillIcon: string ; // 技能图标
	Desc: string ; // 技能描述
}
// 功法大师等级表
declare class Cfg_SectMasterLevel {
	Master_Level: number ; // 大师等级
	Skill_Inc_Id: number ; // 功法大师属性id
	Sect_Min_level: number ; // 技能最小等级
	Sect_Max_level: number ; // 技能最大等级
}
// 仙宗功法升级消耗表
declare class Cfg_SectSkillLevel {
	Id: number ; // ID
	Min_Level: number ; // 最小等级
	Max_Level: number ; // 最大等级
	Item_Id: string ; // 消耗道具
}
// 飞鸟路径配置
declare class Cfg_BirdPath {
	Id: number ; // 路径id
	Start_pos: string ; // 出发点X|Y坐标
	End_pos: string ; // 终点X|Y坐标
}
// 仙宗声望
declare class Cfg_Sect_Prestige {
	Level: number ; // 声望等级
	Title: number ; // 称号资源Id
	AttrId: number ; // 属性Id
	Items: string ; // 道具奖励
	Prestige: number ; // 所需声望
}
// 仙宗奖品配置
declare class Cfg_SectReward {
	Id: number ; // 奖品ID
	Reward_Type: number ; // 奖品类型
	Reward: string ; // 奖品配置
	Status: number ; // 状态
	Rank: string ; // 排名
}
// 宗主守护兽
declare class Cfg_SectBoss {
	Id: number ; // Id
	BossId: number ; // boss编号
	ShowLabel: string ; // 界面显示等级
	NeedReborn: number ; // 转生次数
	NeedLevel: number ; // 挑战等级
	ShowPrize: string ; // 显示奖励道具id数组
	NeedItem: number ; // 挑战消耗道具
	IntervalTime: number ; // 挑战间隔时间（秒）
	NeedNum: number ; // 挑战消耗物品数量
}
// 神兽之怒BOSS
declare class Cfg_Sect_Animal_Rage {
	Id: number ; // id
	MonsterId: number ; // boss编号
	Fx: number ; // Boss朝向
	RefreshId: number ; // 刷新编号
	MapId: number ; // 地图编号
	MonsterX: number ; // x
	MonsterY: number ; // y
	ShieldTrigger: string ; // 护盾触发
	TotalShieldMath: number ; // 总护盾值
	OnceShieldMath: number ; // 护盾单次衰减值
	KillPrize: string ; // 击杀奖励展示
	ShowPrize: string ; // 参与奖励展示
}
// 灵兽园宠物库
declare class Cfg_Sect_Pets {
	Id: number ; // 序号
	GroupId: number ; // 宠物库ID
	PetId: number ; // 宠物ID
	Type: number ; // 类型
	Quality: number ; // 宠物品质
	Rarity: number ; // 稀有度
	Weight: number ; // 刷新权值
	IsCross: number ; // 是否跨服
	Unlock: string ; // 解锁所需玩家转生等级
	IsShow: number ; // 是否走马灯展示
	IsPreview: number ; // 是否预览界面中展示
	CatchRate: number ; // 抓捕成功率万分比
}
// 宠物抓捕掉落
declare class Cfg_Sect_Catch_Drop {
	Id: number ; // 序号
	Weight: number ; // 抓捕失败掉落权值
	DropId: number ; // 抓捕失败掉落ID
}
// 搜寻道具事件
declare class Cfg_Sect_Item {
	Id: number ; // 序号
	ItemId: number ; // 道具ID
	UseNum: number ; // 使用数量
	Integral: number ; // 灵兽积分
	Event: number ; // 触发事件id
	Weight: number ; // 事件触发权值
	Type: string ; // 类型
	Quality: string ; // 品质限制
}
// 灵兽园BUFF
declare class Cfg_Sect_Buff {
	Id: number ; // 增幅编号
	Level: number ; // 增幅等级
	Name: string ; // 增幅名称
	Icon: number ; // 显示图标
	Quality: number ; // 显示品质仅做显示用
	Circle: number ; // 光圈特效ID仅做显示用
	IsShowBuff: number ; // 是否在BUFF列表中显示
	Tips: string ; // BUFF Tips
}
// 展示掉落道具
declare class Cfg_Sect_ShowDrop {
	Id: number ; // 序号
	GroupId: number ; // 分组ID
	ItemId: number ; // 掉落道具ID
	Order: number ; // 排序
}
// 宠物品质配置
declare class Cfg_Sect_PetQuality {
	Id: number ; // 序号
	Event: number ; // 事件id
	Type: number ; // 类型
	Quality: number ; // 品质
	Rarity: number ; // 稀有度
	Weight: number ; // 权值
}
// 掉落库
declare class Cfg_Sect_Drop {
	Id: number ; // 序号
	GroupId: number ; // 分组ID
	DropId: number ; // 掉落ID
	Quality: number ; // 掉落品质
	IsCross: number ; // 是否跨服
	Event: number ; // 事件
}
// 事件
declare class Cfg_Sect_Event {
	Id: number ; // 事件ID
	Name: string ; // 事件名称
	EventType: number ; // 个人事件/全服事件
	CrossDay: number ; // 是否跨天
	IsCatch: number ; // 事件效果类型
	Result: number ; // 抓捕结果
	IsDrop: number ; // 是否掉落
	Trigger: string ; // 触发时间
	IsAdd: number ; // 是否可叠加
	IsReset: number ; // 是否可重置
	Tips: string ; // 提示信息
}
// 灵兽园宠物说话表
declare class Cfg_PetWords {
	PetId: number ; // 宠物id
	PetWords: string ; // 宠物说话
}
// 神兽等级
declare class Cfg_GodAnimalLevel {
	Id: number ; // Id
	Level: number ; // 神兽等级
	ActiveSkills: string ; // 主动技能
}
// 神兽被动技能
declare class Cfg_GAPassiveSkills {
	SkillId: number ; // 技能ID
	SkillQ: number ; // 技能品质
	SK_Level: number ; // 技能等级
	Level: number ; // 神兽等级
}
// 神兽衰减表
declare class Cfg_AGDebuff {
	Id: number ; // 唯一ID
	MinPassNum: number ; // 通关人数下限闭区间
	MaxPassNum: number ; // 通关人数上限闭区间
	WeakPre: number ; // 神兽属性衰减万分比
}
// 仙宗神兽
declare class Cfg_SectGodAnimal {
	Id: number ; // Id
	BossId: number ; // boss编号
	MaxLevel: number ; // 最大等级
}
// 试炼刷新表
declare class Cfg_SectGodAnimalRefresh {
	Id: number ; // Id
	Num: number ; // 魔障层数
	BossId: number ; // boss编号
	ShowLabel: string ; // 界面显示等级
	NeedReborn: number ; // 转生次数
	NeedLevel: number ; // 挑战等级
	ShowFirstPrize: string ; // 首通奖励
	ShowPrize: string ; // 通关奖励
	NeedItem: number ; // 挑战消耗道具
	IntervalTime: number ; // 挑战间隔时间（秒）
	NeedNum: number ; // 挑战消耗物品数量
}
// 宗门等级表
declare class Cfg_SectLevel {
	Level: number ; // 等级
	Exp: string ; // 升级所需经验（声望）
	Reward: string ; // 仙宗等级奖励
	Name: number ; // 仙宗称号资源id
}
// 仙宗徽记表
declare class Cfg_Sect_Symbol {
	Id: number ; // ID
	PicPath: string ; // 宗徽图片地址
	AniId: number ; // 特效ID
}
// 宗门职位表
declare class Cfg_SectJob {
	Id: number ; // 职位ID
	Name: string ; // 职位名称
	MaxNum: number ; // 最大数量
	IncreaseID: number ; // 宗门职位增幅ID
	IncreaseLevel: number ; // 宗门职位增幅等级
	Suit: number ; // 职位时装皮肤id
	Title: number ; // 职位称号皮肤id
	Weapon: number ; // 职位武器皮肤id
	Horse: number ; // 职位坐骑皮肤id
	Wing: number ; // 职位翅膀皮肤id
}
// 跨服灵兽园宠物配置
declare class Cfg_Sect_C_Pets {
	Id: number ; // 序号
	ItemId: number ; // 道具Id
	PetId: number ; // 宠物Id
	Type: number ; // 类型
	Quality: number ; // 宠物品质
	Rarity: number ; // 稀有度
	Weight: number ; // 刷新权值
	IsShow: number ; // 是否走马灯展示
	IsPreview: number ; // 是否预览界面中展示
	CatchRate: number ; // 抓捕成功率万分比
	Fail: string ; // 捕捉失败固定掉落
	FailDrop: number ; // 捕捉失败dropID
	AddLog: number ; // 是否需要添加捕捉记录
	GetPetUIEffect: number ; // 诱捕出特定宠物后播放动画UI资源id
	IsNotice: number ; // 诱捕抓获宠物成功后是否触发抓捕公告不填=不触发1-触发
}
// 跨服灵兽园随机抢夺宠物配置
declare class Cfg_Sect_C_Seize {
	Id: number ; // 序号
	GroupId: number ; // 组Id
	PetId: number ; // 宠物Id
	Type: number ; // 类型
	Quality: number ; // 宠物品质
	Rarity: number ; // 稀有度
	Reward: number ; // 奖励
	IsNotice: number ; // 夺取宠物后是否触发公告不填=不触发1-触发
}
// 跨服灵兽园道具配置
declare class Cfg_Sect_C_Item {
	ItemId: number ; // 道具ID
	Wait: number ; // 等待时间:秒
	MonsterId: number ; // 捕兽夹用于在场景中刷新陷阱形象
	AnimaID: number ; // 陷阱道具形象用于列表中序列帧的显示填写UI特效id
}
// 跨服灵兽园BOSS
declare class Cfg_Sect_C_Boss {
	Id: number ; // 序号
	BossId: number ; // BossId
	RefreshId: number ; // 刷新Id
	MonsterX: number ; // X坐标
	MonsterY: number ; // Y坐标
	Fx: number ; // Boss朝向
	RewardId: number ; // 挑战奖励掉落id
	Times: number ; // 挑战奖励次数
	BoxItemId: number ; // 宝箱Id
	MonsterId: number ; // 宝箱用于在场景中刷新宝箱形象
}
// 跨服灵兽园掉落配置
declare class Cfg_Sect_C_Drop {
	Id: number ; // 序号Id
	Type: number ; // 类型
	MinNum: number ; // 最小值
	MaxNum: number ; // 最大值
	Count: number ; // 宝箱数量
	Reward: number ; // 掉落Id
}
// 跨服灵兽展示掉落道具
declare class Cfg_Sect_C_ShowDrop {
	Id: number ; // 序号
	ItemId: number ; // 掉落道具ID
	Order: number ; // 排序
}
// 仙宗配置表
declare class Cfg_Config_Sect {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 仙宗城战地图
declare class Cfg_SectWarMap {
	Id: number ; // 城池ID
	Name: string ; // 名称
	Layer: number ; // 所属层数
	MapId: number ; // 地图表ID
}
// 仙宗城战地图刷新
declare class Cfg_SectWarMapRe {
	Id: number ; // 活动阶段
	Type: number ; // 刷新类型1 草药     2 银宝箱3 金宝箱   4 小怪5 战神雕像 6 神兽7 宗主雕像  8水晶
	Name: string ; // 名称
	ReliveTime: number ; // 重刷时间（秒）
	MonsterId: number ; // 怪物编号
	MonsterRefreshId: number ; // 怪物刷新表ID
	DropId: number ; // 完成获得道具掉落ID
	Auto: number ; // 是否可以自动挂机进行1 可以
}
// 场景内积分奖励
declare class Cfg_SWScorePrize {
	Score: number ; // 积分挡位
	Prize: number ; // 奖励
}
// 积分排名奖励
declare class Cfg_SWRankPrize {
	RankMin: number ; // 名次最小值（包含）
	RankMax: number ; // 名次最大值（包含）
	Prize1: number ; // 第一阶段奖励
	Prize2: number ; // 第二阶段奖励
	Prize3: number ; // 第三阶段奖励
}
// 仙宗城战buff
declare class Cfg_SectWarBuff {
	Id: string ; // 增幅编号
	Title: string ; // 增幅名称资源名称
	Name: string ; // 增幅名称
	Icon: string ; // 显示图标
	Tips: string ; // buff提示显示文字
	Quality: number ; // 品质
}
// 仙宗城战配置表
declare class Cfg_Config_SectWar {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 仙宗城战阶段
declare class Cfg_SectWarLayer {
	LayerId: number ; // 阶段
	Name: string ; // 名称
	StartTime: string ; // 本轮开始时间
	EndTime: string ; // 本轮结束时间
	SectCount: number ; // 宣战宗门数量
	ScoreMax: number ; // 积分达到N直接胜利
	WinPrize: number ; // 胜利宗门奖励
	FailPrize: number ; // 失败宗门奖励
	AutoScoreTime: number ; // 自动获得奖励间隔时间（秒)
	AutoPrize: string ; // 自动获得道具
	WarriorScore: number ; // 战神雕像持续获得的积分数
	WarriorInternal: number ; // 战神雕像持续获得积分间隔时间（秒）
	WarriorMax: number ; // 战神雕像战领需要获得积分数量
	WarriorOwnScore: number ; // 战神雕像战领后奖励积分数量
	WarriorOwnBuff: number ; // 战神雕像战领后BUFF技能Id
	AnimalBuff: number ; // 神兽击败后获得BUFF技能Id
	AnimalScore: number ; // 击杀神兽获得积分
	LeaderBuff: number ; // 宗主雕像击败获得BUFF技能Id
	LeaderScore: number ; // 击杀宗主雕像获得积分
	CrystalScore: number ; // 击杀水晶获得积分
	CountDown: number ; // 开始倒计时
	Desc: string ; // 说明文字，显示在城池的展示弹窗中
}
// 悬赏名称
declare class Cfg_XuanShangName {
	Id: number ; // Id
	TaskStar: number ; // 任务星级
	Odd: number ; // 权重
	TaskName: string ; // 任务名称
	TaskText: string ; // 任务文字描述
}
// 悬赏奖励
declare class Cfg_XuanShangPrize {
	Id: number ; // Id
	TaskStar: number ; // 任务星级
	TaskPrize: string ; // 任务奖励
	TaskExp: number ; // 悬赏经验奖励
}
// 悬赏时长
declare class Cfg_XuanShangDuration {
	Id: number ; // Id
	TaskStar: number ; // 任务星级
	TaskDuration: number ; // 任务时长
}
// 悬赏任务星级
declare class Cfg_XuanShangStar {
	Star: number ; // 任务星级
	PartnerNum: number ; // 所需上阵伙伴数量
}
// 伙伴特性条件
declare class Cfg_XuanShangCondition {
	Id: number ; // 条件Id
	Desc: string ; // 条件描述
	TaskStar: number ; // 任务星级
	PartnerType: number ; // 伙伴类型1-宠物2-天仙3-战神
	PartnerNum: number ; // 上阵伙伴数量
	PartnerId: number ; // 伙伴Id
	Quality: number ; // 品质1.绿色2.蓝色3.紫色4.橙色5.红色6.金色7.七彩
	Rarity: number ; // 稀有度宠物稀有度有对应的标签1 普通2 精英3 史诗4 传说5 神话
}
// 悬赏等级表
declare class Cfg_XuanShangLevel {
	Level: number ; // 悬赏等级
	Exp: number ; // 升级所需经验
	RefreshItem: string ; // 刷新任务所需道具
	GenTaskTotalNum: number ; // 生成任务总数量
	GenTaskMaxQuality: number ; // 生成任务的最高品质
}
// 悬赏缘分
declare class Cfg_XuanShangFate {
	Id: number ; // 缘分Id
	Desc: string ; // 缘分条件描述
	TaskStar: number ; // 任务星级
	PartnerNum: number ; // 缘分伙伴数量
	PartnerTypes: string ; // 伙伴类型数组1-宠物2-天仙3-战神
	PartnerIds: string ; // 伙伴Id数组需对应前方伙伴类型数组字段中的类型1对应 宠物id2对应 天仙id3对应 战神皮肤id
	Prize: string ; // 缘分奖励道具id：数量
}
// 悬赏配置表
declare class Cfg_Config_XuanShang {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 仙林狩猎付费重置表
declare class Cfg_Jungle_ResetCost {
	Times: number ; // 第几次重置次数
	Coin_Type: number ; // 货币类型
	Coin_Num: number ; // 货币数量
	VipLimit: number ; // vip等级
}
// 仙林狩猎关卡表
declare class Cfg_JungleHuntCp {
	Id: number ; // Id
	Name: string ; // 关卡名称
	Icon: string ; // 图片
	FirstPassBoxDropId: number ; // 首通宝箱奖励配置组
	BoxDropId: number ; // 通关宝箱奖励配置组
	PosX: number ; // 关卡x坐标
	PosY: number ; // 关卡y坐标
}
// 仙林狩猎精灵表
declare class Cfg_JungleElves {
	GoodsId: number ; // 商品id
	GroupId: number ; // 奖励组
	CostItemId: number ; // 消耗道具
	CostItemNum1: number ; // 消耗道具原价
	CostItemNum2: number ; // 消耗道具现价
	Discount: number ; // 折扣
	AppearCp: string ; // 可出现关卡
}
// 仙林狩猎配置表
declare class Cfg_JungleHuntCfg {
	CfgKey: string ; // 键
	CfgValue: string ; // 值
}
//
declare class Cfg_Intimacy_LevelUp {
	Level: number ; // 等级
	Exp: number ; // 亲密度
	Prize: string ; // 奖励
	AttrId: number ; // 属性ID
}
// 仙缘日常任务
declare class Cfg_WeddingDayTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	Type: number ; // 任务类型序号
	CounterType: number ; // 任务计数类型仙缘专用计数类型由两人的基础计数类型通过逻辑运算得出具体值问后端
	Param: number ; // 参数（如指定某个ID）
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励方案id数组
	Cmd: number ; // 界面跳转ID填:功能id
	Order: number ; // 任务序号
	ItemId: number ; // 任务宝箱
}
// 仙缘单次任务
declare class Cfg_WeddingOneTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	Type: number ; // 任务类型序号
	CounterType: number ; // 任务计数类型仙缘专用计数类型由两人的基础计数类型通过逻辑运算得出具体值问后端
	Param: number ; // 参数（如指定某个ID）
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励方案id数组
	Cmd: number ; // 界面跳转ID填:功能id
	Order: number ; // 任务序号
	ItemId: number ; // 任务宝箱
}
// 仙缘信物
declare class Cfg_WeddingToken {
	Id: number ; // 信物ID
	Name: string ; // 信物名称
	UnlockItem: number ; // 激活道具
	Icon: number ; // 资源
}
// 信物升阶
declare class Cfg_WeddingTokenGear {
	Id: number ; // 信物ID
	Gear: number ; // 等阶
	ItemId: number ; // 道具ID
	AttrId: number ; // 属性
	BuffName: string ; // Buff名称
	BuffEffect: number ; // Buff效果
	BuffLevel: number ; // Buff等级
	Desc: string ; // BUFF描述
}
// 信物升级
declare class Cfg_WeddingTokenLevel {
	Id: number ; // 信物ID
	Level: number ; // 等级
	ItemId: number ; // 道具ID
	ItemNum: number ; // 单次消耗数量
	AttrId: number ; // 属性
	Exp: number ; // 经验
}
// 信物技能
declare class Cfg_WeddingTokenSkill {
	Id: number ; // 序号ID
	TokenId: number ; // 信物ID
	SkillId: number ; // 技能ID
	Name: string ; // 技能名称
	Gear: number ; // 激活条件
	ItemId: number ; // 道具ID
	ItemNum: number ; // 道具数量
	AttrId: number ; // 属性id
	Level: number ; // 技能等级
	SkillIcon: string ; // 技能图标
	Desc: string ; // 技能描述
}
// 仙缘副本
declare class Cfg_WeddingInstance {
	Level: number ; // 关数
	RefreshId: number ; // 刷新ID
	Prize: number ; // 奖励(掉落ID)
}
// 仙缘副本跳关设置
declare class Cfg_WeddingInsJump {
	Id: number ; // 档位
	Round: number ; // 指定回合数内通关
	Jump: number ; // 跳关数
}
// 婚戒系统档位
declare class Cfg_WeddingRingGear {
	ItemId: number ; // 道具Id
	Level: number ; // 挡位
	AttrId: number ; // 属性
	AnimId: number ; // 美术资源ID
	Exp: number ; // 共鸣经验
}
// 婚戒共鸣
declare class Cfg_WeddingRingGMLevel {
	Level: number ; // 等级
	AttrId: number ; // 属性
	Exp: number ; // 共鸣经验
	LevelAdd: number ; // 戒指额外可升等级
}
// 婚戒升级
declare class Cfg_WeddingRingLevel {
	Level: number ; // 等级
	Exp: number ; // 升级经验
	AttrId: number ; // 属性
	Num: number ; // 单次升级消耗道具数
}
// 婚戒技能激活
declare class Cfg_WeddingRingSkill {
	SkillId: number ; // 技能ID
	Skill_Type: number ; // 技能类型
	Unlock: string ; // 激活条件
	Name: string ; // 技能名称
	SkillIncId: number ; // 技能递增值属性id
	Max_Level: number ; // 最大等级
	SkillIcon: string ; // 技能图标
	Desc: string ; // 技能描述
}
// 婚戒技能升级消耗
declare class Cfg_RingSkillLevel {
	Id: number ; // ID
	Min_Level: number ; // 最小等级
	Max_Level: number ; // 最大等级
	Item_Id: string ; // 消耗道具
}
// 婚房等级配置
declare class Cfg_WeddingRoomLevel {
	Level: number ; // 等级
	AttrId: number ; // 属性
	Item: string ; // 升级所需经验值
	Num: number ; // 单次升级消耗道具数
}
// 婚房档位配置
declare class Cfg_WeddingRoomGear {
	Level: number ; // 挡位
	Name: string ; // 名称
	AttrId: number ; // 属性
	AnimId: string ; // 美术资源ID
	ItemID: string ; // 装修消耗
}
// 征婚誓言
declare class Cfg_WeddingVows {
	Id: number ; // 序号
	Vows: string ; // 誓言
}
// 仙缘道具配置
declare class Cfg_WeddingItem {
	ItemId: number ; // 道具ID
	Exp: number ; // 提供经验
	Use: number ; // 用途
}
// 仙缘配置
declare class Cfg_Config_Wedding {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 修炼配置
declare class Cfg_Config_Practice {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 每周修炼任务
declare class Cfg_WeekPracticeTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名（界面显示用）
	Desc: string ; // 描述（程序不用）
	Type: number ; // 任务类型序号
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	TargetCount: number ; // 任务完成条件目标次数
	TimesLimit: number ; // 限制次数ID
	Prize: number ; // 完成任务奖励周历练值
	Order: number ; // 任务序号
	ClientFuncId: number ; // 跳转页面填：功能表，功能id
}
// 每周修炼奖励
declare class Cfg_WeekPracticePrize {
	Id: number ; // 任务ID
	Note: string ; // 注释列
	Type: number ; // 任务类型序号
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	GetCondition: string ; // 任务接取(刷新)条件
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励方案id数组
}
// 每日修炼任务
declare class Cfg_DayPracticeTask {
	Id: number ; // 任务ID
	Note: string ; // 注释列
	Name: string ; // 任务名
	Type: number ; // 任务类型序号
	GetCondition: string ; // 刷新时间
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	TargetCount: number ; // 任务完成条件目标次数
	Prize: number ; // 单次任务计数奖励每日历练值
	TimesLimit: number ; // 限制次数ID
	Order: number ; // 任务序号
	FindType: number ; // 每日修炼找回类型
	FindCost: number ; // 单次找回消耗数量
	HalfCostId: number ; // 半价所需VIP等级
	FindTimes: number ; // 找回次数限制
	ClientFuncId: number ; // 界面跳转ID填:功能id
}
// 每日修炼点达标奖励
declare class Cfg_DayPracticePrize {
	Id: number ; // 任务ID
	Note: string ; // 注释列
	Name: string ; // 任务名
	Desc: string ; // 任务描述
	TargetDesc: string ; // 任务目标描述
	Type: number ; // 任务类型序号
	GetCondition: string ; // 任务接取(刷新)条件
	ContainerId: number ; // 容器参数
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	Independent: number ; // 是否独立计数（接取任务时的计数为0，或为当前的累加值）
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 完成任务奖励方案id数组
	Multiple: number ; // 允许多倍奖励
	Order: number ; // 任务序号
}
// 修炼等级
declare class Cfg_PracticeLevel {
	Level: number ; // 等级
	Exp: number ; // 升级所需经验
	Multi: number ; // 处于此等级时基础属性加成万分比
	PrecentAttrIdList: string ; // 给其他系统基础属性加成
	Desc: string ; // 天书阶数描述描述
	GodBookId: number ; // 天书形象资源Id
}
// 资源找回
declare class Cfg_ResourceFind {
	Id: number ; // ID
	Des: string ; // 描述
	Type: number ; // 找回系统
	Param: number ; // 类型参数
	CostItemId: number ; // 找回消耗道具id
	CostItemNum: number ; // 单次找回消耗道具数量
	HalfCostId: number ; // 半价所需达到VIP等级
	FuncId: number ; // 对应系统的功能Id
}
// 八荒凶兽
declare class Cfg_Beast {
	Id: number ; // 凶兽id
	Name: string ; // 名称
	EquipId: string ; // 默认装备Id
	Attr: number ; // 属性Id
	Condition: number ; // 解锁条件转*1000000+重*10000+等级
	UnlockItem: string ; // 解锁道具Id
	Icon: number ; // 图标及背景资源ID
	SpineId: number ; // UI上的动画ID
	ShowId: number ; // 角色外显特效ID
	Quality: number ; // 品质
	StarItemId: number ; // 凶兽升星所需道具
}
// 八荒凶兽出战
declare class Cfg_BeastFight {
	Count: number ; // 出战个数
	Cost: string ; // 提升至此数量消耗道具ID:数量
}
// 八荒凶兽升星
declare class Cfg_BeastStar {
	No: number ; // 序号
	Id: number ; // 凶兽id
	Star: number ; // 星级
	AttrInc: number ; // 凶兽属性星级加成
	ItemCount: number ; // 消耗凶兽数量
}
// 八荒凶兽技能
declare class Cfg_BeastSkill {
	Id: number ; // Id
	BeastId: number ; // 所属凶兽Id
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Part: number ; // 栏位
	MaxLevel: number ; // 技能最大等级
	SkillId: number ; // 技能ID
	Quality: number ; // 技能品质
	AttrId: number ; // 基础属性ID每升一级ID+1
	EquipAttrAddBaseShow: number ; // 对应部位装备属性增加万分比基础值
	EquipAttrAddBase: number ; // 对应部位装备属性增加万分比基础值
	EquipAttrAddShow: number ; // 对应部位装备属性增加万分比每级递增值
	EquipAttrAdd: number ; // 对应部位装备属性增加万分比每级递增值
	NeedItem: number ; // 升级需要道具ID
	CostBase: number ; // 升级需要道具数量基础值
	CostAdd: number ; // 升级需要道具数量每级递增值
}
// 八荒凶兽装备强化
declare class Cfg_BeastEquipStar {
	Star: number ; // 星级
	AttrInc: number ; // 装备属性星级加成
	NeedItem: string ; // 消耗道具ID:数量
}
// 八荒凶兽装备强化
declare class Cfg_BeastEquip {
	Level: number ; // 等级
	AttrId: number ; // 装备属性强化属性ID
	NeedItem: string ; // 消耗道具ID:数量
}
// 勋章
declare class Cfg_Medal {
	ID: number ; // 勋章ID
	Name: string ; // 勋章名称
	Type: number ; // 所属类型1荣誉 2特殊 3隐藏
	Icon: string ; // 图标资源ID
	Font: string ; // 名称资源ID
	Desc: string ; // 描述资源ID
	FromId: number ; // 来源ID
}
// 勋章目标
declare class Cfg_MedalTarget {
	ID: number ; // 勋章ID
	Level: number ; // 等级
	Note: string ; // 条件描述用于前端显示
	Type: number ; // 生效类型1 排行榜第一名。参数1：排行榜类型，参数2：排行榜参数2 任务。参数1：特殊勋章任务表ID3 特殊逻辑，业务写死，参数1：完成目标
	Param1: number ; // 参数1
	Attr: number ; // 此等级属性ID
	Prize: string ; // 此等级奖励道具
}
// 特殊勋章任务
declare class Cfg_MedalTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	Type: number ; // 任务类型序号
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	Independent: number ; // 是否独立计数（接取任务时的计数为0，或为当前的累加值）
	TargetCount: string ; // 任务完成条件
	ClientFuncId: number ; // 跳转页面填：功能表，功能id
}
// 寻龙点穴阶段奖
declare class Cfg_SeekingDragonPrize {
	Id: number ; // 编号
	Floor: number ; // 层数
	Prize: string ; // 奖励
	State: number ; // 领取状态
}
// 寻龙点穴阶事件
declare class Cfg_SDEvent {
	EventId: number ; // 编号
	Name: string ; // 名称
	EventType: number ; // 事件类型
	LimitDay: number ; // 开服天数
	Random: number ; // 单事件类型各个类权重
	DurationTime: number ; // 持续时间
	ReturnTime: number ; // 返还时间
	CurrencyType: number ; // 购买道具类型
	CurrencyNum: number ; // 价格
	Prize: string ; // 礼包内容
	Multiple: number ; // 几倍返还
	GoodsId: number ; // 商品id
	ModelType: number ; // 事件显示形象的类型
	AniType: number ; // 模型动画类型
	ModelScale: number ; // 模型放大缩小倍数
	ModelPos: string ; // 相对父节点位置
	Model: string ; // 事件显示形象
	Record: string ; // 事件记录显示
}
// 寻龙点穴坐标
declare class Cfg_SeekingDragonPos {
	Id: number ; // 编号
	X: number ; // x
	Y: number ; // y
	FX: number ; // 方向
}
// 新手目标牵引表
declare class Cfg_LeadTo {
	Id: number ; // 编号
	Order: number ; // 展示序列主界面出现顺序
	Desc: string ; // 策划备注
	Msg: string ; // 获取条件说明支持富文本格式倒计时获取的空置
	Condition: string ; // 激活条件类型1|关卡数2|任务ID3|创角时间4|等级5|转生等级:转生等级|重数6|集齐装备:转生等级|重数7|双条件：开服天数|等级8|或条件：等级|VIP等级9|三条件：开服天数|等级|飞升Id
	FuncId: number ; // 相关功能表ID当此功能玩家已经解锁时也视作目标牵引完成
	LinkId: string ; // 跳转界面功能表ID
	Bicon: string ; // 弹出的模型展示Icon
	Icon: string ; // 图标ID界面图标用与后边的序列帧ID不能同时填
	BAnim: string ; // 弹出的模型展示序列帧1-武器：aid2-战马：aid3-人物：aid4-翅膀：aid5-boss（宠物）：aid6-称号7-小精灵8-头像9-天仙、战神、仙童、偃甲 ：aid10-战骑：aid11-法宝：aid12-宠物站位:资源名13-功能图标资源名称14-王者羽翼:法相15-异兽：异兽id16-英雄
	Anim: string ; // 序列帧ID界面图标用与前边的图标ID不能同时填
	Item: number ; // 奖励道具ID
	GetType: number ; // 领取方式0  自动发1  手动领
	TitResName: string ; // 标题资源
	ItemResName: string ; // 道具名
	DescResName: string ; // 宣传语资源
	BtnDesc: string ; // 点击按钮文字描述
}
// 系统公告表
declare class Cfg_Notice {
	Id: number ; // 编号
	Range: number ; // 范围
	Range_Client: string ; // 客户端频道
	POS: number ; // 位置（废弃列，可删除）
	Level: number ; // 公告等级
	Important: number ; // 是否为重要公告0否1是
	IsDelay: number ; // 是否延迟发送
	MSG: string ; // 公告文本信息
	MSG1: string ; // 公告超链
}
// 个人排行奖励
declare class Cfg_LimitIntegralRank {
	Id: number ; // id
	Sort: number ; // 排行区间值
	ShowItemStr: string ; // 排行奖励展示
}
// 仙宗排行奖励
declare class Cfg_LimitSectRank {
	Id: number ; // id
	Sort: number ; // 排行区间值
	ItemStr: string ; // 排行奖励
}
// 仙宗闯关进度奖励
declare class Cfg_LimitSpeedReward {
	Id: number ; // id
	Layer: number ; // 闯关进度
	ItemStr: string ; // 闯关进度奖励
}
// 配置表
declare class Cfg_LimitFightConfig {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 怪物刷新表
declare class Cfg_LimitFightMoster {
	Id: number ; // Id
	Layer: number ; // 第X境
	BossId: number ; // boss编号
	RefreshId: number ; // 刷新ID
	BattlePrize: string ; // 战斗获胜奖励
	Prize: string ; // 通关奖励
}
// 怪物战力加成系数
declare class Cfg_LimitFightPara {
	Id: number ; // 通关累积次数
	Para: number ; // 战力加成系数
}
// 奖励加成系数
declare class Cfg_LimitRewardPara {
	Id: number ; // 通关累积次数
	Para1: number ; // 战斗奖励加成系数
	Para2: number ; // 通关奖励加成系数
	Para3: number ; // 仙宗闯关进度奖励加成系数
}
// 限制条件表
declare class Cfg_LimitCondition {
	ConditionId: number ; // 编号
	Sort: number ; // 条件判断类型
	ConditionFunc: number ; // 限制条件类型
	Relation: number ; // 关系
	Param1: number ; // 参数1
	Param2: number ; // 参数2
}
// 限制次数表
declare class Cfg_LimitTimes {
	LimitId: number ; // 限制ID
	MaxTimes: number ; // 免费次数
	VipFreeTimes: string ; // vip免费次数
	VipBuyTimes: string ; // RMB可增加次数
	BuyValue: number ; // 单次购买增加次数
	CoinId: number ; // 多货币购买次数消耗ID
	Coin_Type: number ; // 单货币购买货币道具ID
	Coin: number ; // 购买初始价格
	Coin_Add: number ; // 购买递增值
}
// 限制次数货币表
declare class Cfg_LimitTimesCoin {
	Id: number ; // 购买消耗ID
	Times: number ; // 次数
	Coin_Type: number ; // 货币类型
	Coin_Num: number ; // 货币数量
}
// 偃甲配置表
declare class Cfg_Config_YanJia {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 偃甲兵魂表
declare class Cfg_YanJia_SoldierSoul {
	Id: number ; // id
	Name: string ; // 中文名称
	Lev: number ; // 丹药阶数
	BaseAttr: number ; // 基础属性ID
	ItemId: number ; // 丹药id
	ItemCount: number ; // 丹药数量
}
// 偃甲套装表
declare class Cfg_YanJiaSuit {
	Typ: number ; // 套装类型
	Name: string ; // 中文名称
	PicID: string ; // 套装图标
	Quality: number ; // 品质
	SuitItemId: string ; // 道具Id数组
	SuitAttr: number ; // 套装属性ID
}
// 偃甲核心星级表
declare class Cfg_YanJiaCore_Star {
	Id: number ; // 核心Id
	Star: number ; // 星级
	CostItem: string ; // 消耗道具及数量
	AttrPect: string ; // 属性万分比加成
	SuitSkillLev: number ; // 天赋技能等级加成
}
// 偃甲核心等级表
declare class Cfg_YanJiaCore_Lev {
	Id: number ; // 核心Id
	Lev: number ; // 等级
	CostItem: string ; // 消耗道具及数量
	AttrPerct: number ; // 基础属性万分比
}
// 偃甲核心表
declare class Cfg_YanJiaCore {
	Id: number ; // 核心Id
	Name: string ; // 中文名称
	Quality: number ; // 品质
	UnLockItem: number ; // 解锁道具ID
	BaseAttr: number ; // 基础属性ID
	AnimId: number ; // 美术资源id
	SkillName: string ; // 特技名称
	SkillDesc: string ; // 描述
}
// 偃甲等级表
declare class Cfg_YanJia_Lev {
	Lev: number ; // 等级
	AttrPerct: number ; // 基础属性万分比
}
// 偃甲表
declare class Cfg_YanJia {
	Id: number ; // id
	Name: string ; // 中文名称
	Quality: number ; // 品质
	BaseAttr: number ; // 基础属性ID
	ActiveSkills: string ; // 主动技能ID和等级
	BaseSkills: string ; // 天赋技能ID和等级
	AnimId: number ; // 美术资源id
	SkinId: number ; // 皮肤升阶表默认皮肤id
}
// 铸甲
declare class Cfg_YanJia_zhujia {
	SkinId: number ; // 铸甲皮肤ID
	CondStar: number ; // 激活铸甲星级
	GCGrade: number ; // 铸甲等阶
	GCLevel: number ; // 铸甲等级
	LimitStar: number ; // 可升星上限
	AttrId: number ; // 增加属性
	ShowSkillId: number ; // 技能提升前端展示
	ShowSkilDesc: string ; // 技能提升描述
	SkillId: string ; // 技能提升实际生效
	CostItem: string ; // 道具消耗
	SkillLv: string ; // 神通技升级条件
	PassiveSkillId: string ; // 铸甲被动技能
}
// 皮肤配置
declare class Cfg_YanJia_Peizhi {
	SkinId: number ; // 皮肤id
	Item: number ; // 道具id
	Aid: number ; // 潜能1阶资源
}
// 偃甲关卡
declare class Cfg_YanJiaGuanQia {
	FBId: number ; // 偃甲副本Id
	GQId: number ; // 偃甲关卡Id
	GQType: number ; // 关卡类型
	BGMap: string ; // 关卡框背景图id
	MapX: number ; // 地图X上限
	MapY: number ; // 地图Y上限
	PlayerGrid : string ; // 玩家初始位置
	SweepPrize: number ; // 扫荡奖励展示+发奖用
	ExplorePrize: number ; // 探索奖励仅展示用
	FirstPassPrize: string ; // 首通奖励
}
// 偃甲事件刷新点
declare class Cfg_YanJiaEventPoint {
	FBId: number ; // 偃甲副本Id
	GQId: number ; // 偃甲关卡Id
	EventType: number ; // 事件类型
	EventNum: number ; // 事件数量
	EventFixPoint: string ; // 事件刷新固定点
	EventRange: string ; // 事件刷新范围
}
// 偃甲事件详情
declare class Cfg_YanJiaEventDetail {
	Id: number ; // 事件Id
	FBId: number ; // 偃甲副本Id
	GQId: number ; // 偃甲关卡Id
	EventType: number ; // 事件类型
	MonsterId: number ; // 怪物编号
	RefreshId: number ; // 怪物刷新ID
	ResID: string ; // UI序列帧资源id
	Prize: number ; // 完成事件奖励
	PowerCost: number ; // 完成事件消耗体力
	ActHeadIcon: string ; // 神秘人事件交互界面头像ID
	ActText1: string ; // 神秘人事件界面交互文本
	ActText: string ; // 普通事件交互界面文本
}
// 偃甲副本
declare class Cfg_YanJiaFuBen {
	Id: number ; // 偃甲副本Id
	Name: string ; // 副本名字
	Icon: string ; // 图片
	LimitStage: number ; // 限制关卡
	LimitFBId: number ; // 限制通关副本Id
}
// 偃甲副本配置
declare class Cfg_YJFB_Cfg {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 异兽升星表
declare class Cfg_AlienStar {
	Id: number ; // 銘牌Id
	Star: number ; // 星级
	SkillLev: number ; // 技能等级
}
// 异兽升级表
declare class Cfg_AlienLevel {
	Level: number ; // 等级
	ExpMax: number ; // 最大经验值
	AttrId: number ; // 属性ID
}
// 异兽升级消耗道具表
declare class Cfg_AlienLevelItem {
	Id: number ; // 道具编号
	Name: string ; // 道具名称
	Exp: number ; // 经验值
}
// 异兽表
declare class Cfg_Alien {
	Id: number ; // 异兽id
	Name: string ; // 异兽名称
	Quality: number ; // 品质
	SkillAId: string ; // 萌宠技能Id
	ShowSkillBId: string ; // 猛兽技能Id
	MPId: number ; // 对应的铭牌Id
	AnimId: string ; // 形象
	PvpAngerMax: number ; // PVP怒气值上限
	PveAngerMax: number ; // PVE怒气值上限
	ActiveAttr: number ; // 激活属性
}
// 异兽配置表
declare class Cfg_Config_Alien {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 铭牌升星表
declare class Cfg_MP_Star {
	Id: number ; // 铭牌Id
	Pos: number ; // 位置
	Star: number ; // 星级
	CostItem: string ; // 消耗道具配置
	AttrId: number ; // 属性ID
	UnLockDes: string ; // 未解锁说明
}
// 铭牌套装表
declare class Cfg_MP_Suit {
	Id: number ; // 类型
	Count: number ; // 收集数量
	Effect: string ; // 激活效果
	AttrId: number ; // 属性ID
	Percent: number ; // 銘牌属性加成万分比
	SkillId: number ; // 套装技能Id
}
// 铭牌强化大师
declare class Cfg_MP_StrengthMaster {
	Lev: number ; // 强化大师等级
	Attr: number ; // 属性ID
	LevelLimit: number ; // 所有部位最低强化等级需达到
	CountLimit: number ; // 激活数量限制
}
// 铭牌强化
declare class Cfg_MP_Strength {
	Pos: number ; // 装备位置
	MinLev: number ; // 最小等级
	MaxLev: number ; // 最大等级
	BaseAttr: number ; // 装备属性强化属性ID
	PerAttr: number ; // 装备属性强化递增值
	NeedItem: string ; // 消耗道具ID:数量
	PerItem: number ; // 消耗道具数量递增值
}
// 铭牌部位表
declare class Cfg_MP_Pos {
	Id: number ; // 铭牌Id
	Pos: number ; // 位置
	ActiveItem: string ; // 激活道具Id
	BaseAttrId: number ; // 基础属性Id
}
// 铭牌表
declare class Cfg_MP {
	Id: number ; // 铭牌Id
	Name: string ; // 铭牌名称
	Quality: number ; // 铭牌品质
	OpenDay: number ; // 开服天数
	LimitUnionDay: number ; // 合服后，开服天数是否以连服首区天数为准0或不填否   1是
}
// 异界妖门
declare class Cfg_YJYMNotice {
	Id: number ; // 编号
	Time: string ; // 时间
	NoticeId: number ; // 公告id
}
// 奖励组配置表
declare class Cfg_YJYM_RewardGroup {
	Id: number ; // 序号Id
	GroupId: number ; // 组Id
	MinTimes: number ; // 赛季最小次数
	MaxTimes: number ; // 赛季最大次数
	ShowItems: string ; // 前端展示奖励
	Items: string ; // 后端实际奖励
	DropId: number ; // 掉落id
}
// 妖王之怒表
declare class Cfg_Anger {
	Level: number ; // 妖王之怒等级
	Exp: number ; // 升级需要怒气值（累计）
	Amount: number ; // 对应刷新妖王数量
}
// 异界妖门属性表
declare class Cfg_YJYM {
	ID: number ; // ID
	StringValue: string ; // 字符串值
	IntValue: number ; // int值
}
// 异界妖门怪物
declare class Cfg_YJYM_Monster {
	Id: number ; // Id
	GroupId: number ; // 生存阶段Id
	MonsterType: number ; // 怪物类型1.小怪 2.精英怪 3.驱魔草4.天罡石 5.妖王 6.金宝箱7.银宝箱 8.铜宝箱
	MonsterId: number ; // 怪物编号
	RewardType: number ; // 奖励类型
	SuperShield: string ; // 触发超级护盾[触发血量比,持续秒数]
}
// 异界妖门排名奖励
declare class Cfg_YJYM_RankPrize {
	Id: number ; // 奖励id
	GroupId: number ; // 阶段id
	Rank: number ; // 排名
	Rewards: string ; // 排名奖励道具id及数量数组[钥匙编号,数量]
}
// boss表
declare class Cfg_YJFX_Boss {
	Id: number ; // Id
	BossId: number ; // Boss编号
	RefreshId: number ; // 刷新ID
	Pos: number ; // 触发位置（米数）
	DownSpeed: number ; // BOSS阶段减速百分比
	DownTimes: number ; // 减速持续时间sBOSS持续时间
	UpSpeed: number ; // 击败BOSS后加速百分比(同运功)
	UpTimes: number ; // 加速持续时间s
	ChallengeRewardId: number ; // 挑战奖励-奖励组ID
	KillReward: string ; // 击败BOSS-奖励活动内道具（非真实道具）ID：数量
	KillRewardId: number ; // 击败BOSS-奖励组ID
	NoKillRewardId: number ; // 未击败BOSS-奖励组ID
}
// 排名奖励表
declare class Cfg_YJFX_RankReward {
	Min: number ; // 排行区最小值
	Max: number ; // 排行区最大值
	RewardId: number ; // 排行奖励组ID
}
// 道具使用表
declare class Cfg_YJFX_ItemUse {
	ItemId: number ; // 道具Id
	Name: string ; // 道具名称
	Explain: string ; // 说明
	Times: number ; // 持续时间
	TimesLimit: number ; // 持续总时间上限
	Effect: number ; // 效果
}
// 道具随机表
declare class Cfg_YJFX_ItemRand {
	FType: number ; // 类型
	Rand: number ; // 权重
	Prize: string ; // 奖励
}
// 配置表
declare class Cfg_Config_YJFX {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 英雄升星表
declare class Cfg_HeroStarUp {
	HeroId: number ; // 英雄ID
	Quality: number ; // 品质
	Star: number ; // 星级
	ItemData: string ; // 道具配置
	AttrId: number ; // 属性ID
	NeedHeroLevel: number ; // 需求英雄等级
}
// 英雄升星表
declare class Cfg_HeroStarUpBak {
	HeroId: number ; // 英雄ID
	Quality: number ; // 品质
	Star: number ; // 星级
	ItemData: string ; // 道具配置
	AttrId: number ; // 属性ID
	NeedHeroLevel: number ; // 需求英雄等级
}
// 英雄升级表
declare class Cfg_HeroLevel {
	Level: number ; // 等级
	ExpMax: number ; // 最大经验值
	AttrId: number ; // 属性ID
}
// 英雄羁绊-战阵升级表
declare class Cfg_HeroBondLevelUp {
	BondId: number ; // id
	Level: number ; // 等级
	ExpMax: number ; // 最大经验值
	ItemData: string ; // 需求道具
	AttrId: number ; // 基础属性ID
}
// 英雄战阵-特性升级表
declare class Cfg_BondSkilLevelUp {
	BondId: number ; // id
	Level: number ; // 等级
	ItemData: string ; // 需求道具
	SkillId: number ; // 技能ID
}
// 英雄技能
declare class Cfg_HeroSkill {
	Id: number ; // Id
	HeroId: number ; // 英雄Id
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	Part: number ; // 栏位
	MaxLevel: number ; // 技能最大等级
	SkillId: number ; // 技能ID
	NewSkillid: string ; // 新技能id
	Quality: number ; // 技能品质
	AttrId: number ; // 基础属性ID每升一级ID+1
	NeedItem: number ; // 升级需要道具ID
	CostBase: number ; // 升级需要道具数量基础值
	CostAdd: number ; // 升级需要道具数量每级递增值
	NeedHeroLevel: number ; // 解锁需要的英雄等级
}
// 英雄武圣
declare class Cfg_Hero_WuSheng {
	SkinId: number ; // 武圣皮肤ID
	Name: string ; // 皮肤名称
	CondStar: number ; // 激活武圣星级
	GCGrade: number ; // 武圣等阶
	GCLevel: number ; // 武圣等级
	LimitStar: number ; // 可升星上限
	AttrId: number ; // 增加属性
	CostItem: string ; // 道具消耗
	ShowSkillId: string ; // 技能提升前端展示
	ShowSkilDesc: string ; // 技能提升描述
	SkillId: string ; // 原有技能提升实际生效
	SkillId2: string ; // 原有技能提升实际生效2
	SkillId3: string ; // 原有技能提升实际生效3
	ShenQiSkillAdd: string ; // 新增神器技能提升实际生效
	ShenQiSkillShow: string ; // 新增神器技能提升加成记录
}
// 英雄武圣皮肤配置
declare class Cfg_Hero_Peizhi {
	SkinId: number ; // 皮肤id
	Item: number ; // 道具id
	Ani: number ; // 模型id
}
// 被动技能映射
declare class CfgHero_Bdjn {
	SkillID: number ; // 原技能
	NewSkillID: number ; // 新技能
}
// 英雄技能分类
declare class CfgHero_SkillType {
	SkillID: number ; // 技能id
	TYPE: number ; // 技能类型
}
// 英雄神羁绊成就表
declare class Cfg_HeroWeaponAchieve {
	Type: string ; // 羁绊类别
	Name: string ; // 羁绊名称
	Condition: number ; // 任务条件
	Skill1: string ; // 技能1
	Skill2: string ; // 技能2
	Skill3: string ; // 技能3
	Desc: string ; // 羁绊描述
	Count: number ; // 技能3
}
// 神器关联英雄羁绊表
declare class Cfg_HeroWeaponList {
	WeaponId: number ; // 神器id
	Name: string ; // 神器名
	BoundId: number ; // 羁绊id
	ShowWeapon: string ; // 资源路径
	SkillID: number ; // 技能id
	Desc1: string ; // 参数1描述
	Desc2: string ; // 参数2描述
}
// 英雄组合技能
declare class Cfg_HeroGroupSkill {
	BondId: number ; // Id
	Level: number ; // 技能等级
	SkillName: string ; // 技能名字
	IconID: number ; // 技能icon
	SkillId: number ; // 技能ID
	AttrId: number ; // 基础属性ID
	ItemData: string ; // 需求道具
	PS1HeroIds: string ; // 额外被动技能1英雄ID
	PassiveSkillId1: number ; // 额外被动技能ID1
	PS2HeroIds: string ; // 额外被动技能2英雄ID
	PassiveSkillId2: number ; // 额外被动技能ID2
}
// 英雄羁绊成就表
declare class Cfg_HeroBondAchieve {
	Id: number ; // 成就id
	BondId: number ; // 羁绊id
	Name: string ; // 成就名称
	AchDsc: string ; // 成就描述
	Type: number ; // 任务类型
	HeroIds: string ; // 英雄ID
	Condition: number ; // 任务条件
	Count: number ; // 任务数量
	PrizeType: number ; // 奖励类型
	Prizes: string ; // 奖励id和奖励数量
	AttrId: number ; // 奖励给与属性
}
// 英雄羁绊战阵表
declare class Cfg_HeroBond {
	BondId: number ; // id
	Name: string ; // 羁绊名称
	HeroIds: string ; // 英雄ID
	AttrId: number ; // 基础属性ID
}
// 英雄表
declare class Cfg_Hero {
	Id: number ; // id
	Name: string ; // 中文名称
	Quality: number ; // 职位
	UnLockItem: number ; // 解锁道具ID
	AnimId: number ; // 美术资源id
	AttrId: number ; // 基础属性ID
	ActiveSkillId: string ; // 默认主动技能ID和等级
	PassiveSkills: string ; // 默认被动技能ID和等级列表
	DefaultEquips: string ; // 默认装备列表
	GodWeaponSkill: number ; // 神器技能
}
// 英雄升阶表
declare class Cfg_HeroGradeUp {
	Grade: number ; // 阶数
	HeroId: number ; // 英雄Id
	AttrId: number ; // 属性ID
	ItemData: string ; // 道具配置
	NeedLevel: number ; // 要求等级
}
// 英雄升级道具配置表
declare class Cfg_HeroLevelUpItem {
	Id: number ; // 道具编号
	Name: string ; // 道具名称
	Exp: number ; // 经验值
}
// 英雄战阵升级道具
declare class Cfg_HBLevelUpItem {
	BondId: number ; // 战阵编号
	Id: number ; // 道具编号
	Name: string ; // 道具名称
	Exp: number ; // 经验值
}
// 英雄道具分解
declare class Cfg_HeroItemDecompose {
	UnlockItem: number ; // 解锁道具
	ItemData: string ; // 道具配置
}
// 遗迹争夺信息
declare class Cfg_YJZDInfo {
	Id: number ; // 遗迹Id
	Name: string ; // 遗迹名称
	ZdType: number ; // 遗迹类型(1外围，2内部)
	MapId: number ; // 地图编号
	MonsterId: number ; // boss编号
	AdscPrize: number ; // 归属奖励
	EntrustPrize: number ; // 委托奖励
	OccupiedPrize: number ; // 占领奖励
	RelivePoints1: string ; // 玩家复活随机刷新点
	RelivePoints2: string ; // 挑战Boss后未死亡随机刷新点
}
// 遗迹争夺开启配置信息
declare class Cfg_YJZDOpenCfg {
	UnionAreaNum: number ; // 连区数量
	YJIdArr: string ; // 遗迹id
}
// 遗迹争夺配置表
declare class Cfg_Config_YJZD {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 提示消息表
declare class Cfg_Mail {
	Tpl_ID: number ; // 模板ID
	Tpl_Type: number ; // 邮件所属类型
	Tpl_Title: string ; // 标题
	Tpl_Content: string ; // 正文内容
}
// 功能开启喊话
declare class Cfg_Shouting {
	TalkId: number ; // 喊话组id
	Description: string ; // 喊话内容
	WxGame: number ; // 微信小游戏
}
// 脚印皮肤表
declare class Cfg_Ride_Track {
	Id: number ; // 主键注意与其他类型皮肤表的ID不要重复
	Type: number ; // 皮肤所属功能ID
	Name: string ; // 皮肤名称
	UnlockItem: string ; // 解锁激活所需道具
	AttrId: number ; // 激活属性ID
	AutoWear: number ; // 是否自动穿戴0否1是
	AnimId: string ; // 美术资源ID
	IsShow: number ; // 是否显示
}
// 征战九州任务表
declare class Cfg_PrefectWarTask {
	Id: number ; // 任务ID
	Type: number ; // 任务类型
	Name: string ; // 任务名
	CounterType: number ; // 任务计数类型
	Param: number ; // 任务计数类型参数(副本页签Id)
	Independent: number ; // 是否独立计数
	TargetCount: number ; // 任务完成条件
	Prize: string ; // 章节奖励
}
// 征战九州关卡表
declare class Cfg_PrefectWarCp {
	TabId: number ; // 副本页签Id
	Id: number ; // Id
}
// 征战九州关卡Boss表
declare class Cfg_PrefectWarBoss {
	TabId: number ; // 副本页签Id
	CpId: number ; // 关卡ID
	Name: string ; // 关卡名称
	BossId: number ; // bossId
	Star: number ; // Boss星星数
	CoverName: string ; // 封面图
	FightPrize: number ; // 战斗奖励组ID
	HelpPrize: number ; // 协助奖励组ID
	HirePrize: number ; // 雇佣奖励组ID
	MonsterId: number ; // 怪物编号
	RefreshId: number ; // 怪物刷新ID
	BossFeatur: number ; // boss技能特性
	RemmendHero: number ; // 推荐英雄的BondId
	ReHeroSkill: number ; // 推荐英雄的技能等级
}
// Boss战力加层表
declare class Cfg_PrefectWarBossFv {
	Id: number ; // 通关累积次数
	MinId: number ; // 通关累积次数
	MaxId: number ; // 通关累积次数
	Para: number ; // 战力加成系数
}
// 征战九州副本页签表
declare class Cfg_PrefectWarTab {
	TabId: number ; // 副本页签Id
	Name: string ; // 副本名字
	MaxCpId: number ; // 最大关卡Id
	PreTabId: number ; // 前置副本页签Id
	HeroBondId: number ; // 英雄羁绊Id
}
// 征战九州配置表
declare class Cfg_PrefectWarCfg {
	CfgKey: string ; // 键
	CfgValue: string ; // 值
}
// 战斗站位坐标配置
declare class Cfg_FightPosition {
	id: number ; // id
	Desc: string ; // 注释列
	Pos_x: number ; // x坐标
	Pos_y: number ; // y坐标
}
// 战斗场景
declare class Cfg_FightScene {
	Id: number ; // id
	FBType: string ; // 副本类型
	WinCheck: number ; // 超过回合数胜利判断条件0或不填：进攻方失败1：进攻方胜利2：剩余总血量高者胜利，血量相同比较战力
	SpecialSkill: string ; // 特殊机制 id天罚|激励
	Priority: number ; // 战斗优先级
	KillFight: number ; // 战斗屏蔽
	BossBig: number ; // BOSS放大
	JingyingBig: number ; // 精英放大
	XiaoguaiBig: number ; // 小怪放大
	Sound: string ; // 战斗场景音效
	IsBoss: number ; // 首领来袭
	Jump: number ; // 非特权卡允许跳过的回合
	MonthCardSkip: number ; // 月卡是否允许跳过此字段废弃代码中写死2回合
	NeedShield: number ; // 有护盾条逻辑的场景
	NoWait: number ; // 战斗结束不需要等待的战斗类型
	AutoJump: number ; // 是否自动勾选自动跳过0或不填-默认不勾选自动跳过，玩家手动勾选后才能自动跳过。本次登录记录勾选状态1-默认勾选自动跳过。玩家可手动取消勾选。本次登录记录勾选状态
	AllJump: number ; // 跳过全局
	FightUIType: number ; // 战斗UI类型
	CheckFightCD: number ; // 战斗间隔内置CD (单位：秒)填值生效如果连续两次战斗时间低于CD则不能发起战斗
	ShowFightCD: number ; // 是否显示战斗间隔内置CD，默认不显示，1显示
	FightTextImg: string ; // 文本图片
	FightText: string ; // 文本
	FightReportWin: number ; // 战报显示格式
	FightReportFail: number ; // 战报显示格式
	FightReportSweep: number ; // 战报显示格式
	RankAttr: number ; // 排行榜属性
	NoDropHp: number ; // 不掉血只飘字
}
// 战斗位置
declare class Cfg_FightPos {
	Id: number ; // id
	PlayerIdx: number ; // 玩家（0-2）
	TeamPos: number ; // 组队时出战自定义对应位置
}
// 战斗喊话
declare class Cfg_FightScenes {
	Id: number ; // 喊话ID
	Word: string ; // 战斗喊话
	Word1: string ; // 试炼BOSS喊话
	WxGame: string ; //
	WxGame1: string ; //
}
// 战队光环
declare class Cfg_FT_Halo {
	SkillId: number ; // 技能id
	SkillName: string ; // 技能名称
	PeopleNum: number ; // 需战队中在线人数
}
// 战队宣言
declare class Cfg_FT {
	Id: number ; // 序号
	Vows: string ; // 战队宣言
}
// 配置表
declare class Cfg_Config_FT {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 直购礼包
declare class Cfg_DirectBuyGift {
	GoodID: number ; // 商品id与充值商城表ID对应
	GoodName: string ; // 商品名字
	ItemStr: string ; // 礼包内容
	BuyTimes: number ; // 购买次数
	AdvImg: string ; // 广告语资源ID
	BgImg: string ; // 背景资源ID
	PrizeShow: string ; // 大奖展示类型和资源格式    资源ID:类型:缩放比
	NextGId: number ; // 关联下一个商品id前端查找展示下一个目标商品
	AnimationShow: string ; // 动画展示
}
// 推送礼包
declare class Cfg_DirectBuyGift2 {
	BuyTimes: number ; // 购买次数
}
// 月光宝盒礼包
declare class Cfg_MoonGift {
	GoodID: number ; // 商品id与充值商城表ID对应
	GoodName: string ; // 商品名字
	ItemStr: string ; // 礼包内容
	BuyTimes: number ; // 购买次数
	AdvImg: string ; // 广告语资源ID
	BgImg: string ; // 背景资源ID
	PrizeShow: string ; // 大奖展示类型和资源格式    资源ID:类型:缩放比
}
// 装备升星表
declare class Cfg_Equip_Star {
	Reborn: number ; // 转生数
	Star: number ; // 星星等级
	Item: string ; // 消耗道具及数量
}
// 套装属性
declare class Cfg_Equip_Suit_Attr {
	SuitId: number ; // 套装编号
	Reborn: number ; // 转生等级
	StarNum: number ; // 星级
	EquipNum: number ; // 装备件数
	AttrId: number ; // 属性id
}
// 套装精炼升级
declare class Cfg_Equip_Suit_Upgrade {
	JingLianLevel: number ; // 精炼等级
	NeedExp: number ; // 升到下一级需要的经验
	AttrPercent: number ; // 套装属性加成万分比
}
// 套装精炼道具
declare class Cfg_Equip_Suit_ItemExp {
	CostItemID: number ; // 精炼消耗道具
	ItemExp: number ; // 每个道具增加经验
}
// 装备宝石
declare class Cfg_EquipStone {
	Type: number ; // 宝石类型:1生命  2攻击  3防御
	Level: number ; // 宝石等级
	ItemId: number ; // 对应道具ID
}
// 装备宝石部位
declare class Cfg_EquipPosStone {
	Pos: number ; // 装备部位
	Stone: number ; // 允许镶嵌宝石类型
}
// 装备宝石孔
declare class Cfg_EquipStonePos {
	Reborn: number ; // 装备转生等级
	Count: number ; // 开放宝石孔数
}
// 装备宝石合成
declare class Cfg_EquipStoneTwo {
	Level: number ; // 宝石等级
	Count: number ; // 所需上级同类宝石个数
}
// 装备强化大师
declare class Cfg_EquipStrengthS {
	Level: number ; // 强化大师等级
	AttrId: number ; // 属性ID
	LevelLimit: number ; // 所有部位最低强化等级需达到
}
// 装备强化属性
declare class Cfg_EquipStrengthA {
	Pos: number ; // 强化部位
	LevelMin: number ; // 强化等级下限包括
	LevelMax: number ; // 强化等级上限包括
	BaseAttrId: number ; // 等级在此区间时的基础属性ID
	AddAttrId: number ; // 等级在此区间时，每升一级累加属性ID
}
// 装备强化配置
declare class Cfg_Config_Strength {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 装备强化配置新
declare class Cfg_EquipStrengthC {
	Reborn: number ; // 玩家转生等级
	Min: number ; // 此阶段强化初始等级
	Max: number ; // 强化最高等级
	CoinBase: number ; // 消耗银两基数
	CoinUp: number ; // 每级消耗银两递增系数
	StoneBase: number ; // 消耗强化石基数
	StoneUp: string ; // 每级消耗强化石递增系数
}
// 装备打造
declare class Cfg_EquipBuildNew {
	EquipSys: number ; // 装备系统
	EquipSysStr: string ; // 装备系统描述
	EquipLevel: number ; // 装备等级
	EquipLevelStr: string ; // 装备等级描述
	EquipPart: number ; // 装备部位
	EquipPartStr: string ; // 装备部位描述
	NeedItem1: string ; // 打造原料1
	NeedItem2: string ; // 打造原料2
	PrefBuildStone: string ; // 完美打造石
	ExcAttrStone: string ; // 卓越属性石
	CostMoney: string ; // 消耗货币
	ShowItemId: number ; // 展示道具Id
	Rd: number ; // 红点类型
}
// 装备打造星概率
declare class Cfg_EquipBuildStar {
	Star: number ; // 星数
	NPrefOdd: number ; // 非完美概率
	PrefOdd: number ; // 完美概率
}
// 装备材料
declare class Cfg_Equip_Material {
	Type: number ; // 材料类型
	Reborn: number ; // 转生数
	ItemId: number ; // 材料道具ID
}
// 装备模板
declare class Cfg_Equip_Model {
	ModelItemId: number ; // 对应模板装备的道具表ID
	ItemId: number ; // 对应通用装备的道具表ID
	Star: number ; // 星级
	AddAttr: string ; // 附加属性。格式：属性ID:值|属性ID:值
}
// 装备洗炼
declare class Cfg_EquipForge {
	Level: number ; // 阶数
	AttrId: number ; // 属性ID
	AttrName: string ; // 属性名称
	Quality: string ; // 品质数值范围，品质:最小值:最大值|
	AttrRelationId: number ; // 属性查询战力id
	Rate: number ; // 获得此属性概率万分比
}
// 装备洗炼等阶
declare class Cfg_EquipForgeLevel {
	Level: number ; // 阶数
	Quality: number ; // 升至此阶所需所有属性品质
}
// 装备洗炼锁定
declare class Cfg_EquipForgeLock {
	Count: number ; // 锁定条数
	NeedItem: string ; // 所需道具
}
// 洗炼位开启
declare class Cfg_EquipForgeOpenP {
	Pos: number ; // 装备位置
	Reborn: number ; // 装备位置开启所需玩家转生等级
}
// 洗炼条开启
declare class Cfg_EquipForgeOpenA {
	AttrCount: number ; // 属性栏
	VIP: number ; // 属性栏开启所需VIP
}
// 洗炼配置
declare class Cfg_Config_Forge {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 装备洗炼品质
declare class Cfg_EquipForgeQuality {
	Quality: number ; // 品质
	Rate: number ; // 概率万分比
}
// 装备升星表
declare class Cfg_Equip_Steel {
	Level: number ; // 星星等级
	Reborn: number ; // 所需装备转生等级
	Item: string ; // 消耗道具及数量
	Rate: number ; // 成功率万分比
	AttrAdd: number ; // 基础属性加成万分比
	GoldCost: string ; // 神符消耗
	GoldRate: number ; // 额外提升概率
}
// 装备升星配置
declare class Cfg_Config_EquipSteel {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 装备升星套装
declare class Cfg_EquipSteelSuit {
	Level: number ; // 套装等级
	EquipLevel: number ; // 所需全身所有装备达到几星
	Attr: number ; // 套装属性ID
	Anim: number ; // 周身环绕光效资源ID
	WeaponAnim: number ; // 武器达到此星级环绕光效资源ID
}
// 进阶系统到碎片类型
declare class Cfg_MeltSysToType {
	EquipSys: number ; // 装备系统
	EquipMaterialType: number ; // 碎片类型
}
// 普通装备熔炼
declare class Cfg_MeltCom {
	Quality: number ; // 装备品质
	CoinNum: number ; // 产出金币数量
	StoneNum: number ; // 产出装备强化石数量
}
// 红装熔炼
declare class Cfg_MeltRed {
	Star: number ; // 星级
	Tatter1: string ; // 碎片1(自身转数)
	Tatter2: string ; // 碎片2(自身阶数+1)
	BuildStone1: string ; // 装备打造石1(自身阶数)
	BuildStone2: string ; // 装备打造石2(自身阶数+1)
	StarStone1: string ; // 升星石1(自身阶数)
	StarStone2: string ; // 升星石2(自身阶数+1)
	ExcAttrStone: string ; // 卓越属性石数量
	PrefBuildStone: string ; // 完美打造石数量
}
// 熔炼部位到类型
declare class Cfg_MeltPartToType {
	EquipPart: number ; // 装备部位
	EquipMaterialType: number ; // 碎片类型
}
// 进阶装备熔炼
declare class Cfg_MeltGrade {
	Quality: number ; // 品质
	Tatter1: string ; // 碎片1(自身阶数)
	Tatter2: string ; // 碎片2(自身阶数+1)
	BuildStone1: string ; // 装备打造石1(自身阶数)
	BuildStone2: string ; // 装备打造石2(自身阶数+1)
}
// 装备熔炼表
declare class Cfg_Melt {
	Quality: number ; // 装备品质
	EquipToItem: string ; // 装备熔炼得元宝数量
}
// 装备熔炼掉落组
declare class Cfg_MeltLuckDrop {
	Id: number ; // ID无实际意义，只做区分
	LevelMin: number ; // 人物等级下限包含
	LevelMax: number ; // 人物等级上限包含
	DropId: number ; // 装备掉落组ID
}
// 星级装备熔炼表
declare class Cfg_MeltStar {
	Star: number ; // 装备星级
	EquipToItem: string ; // 装备熔炼得道具ID:数量
}
// 自动熔炼条件
declare class Cfg_Config_Melt {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 等级属性
declare class Cfg_Equip_ZhuHun_Level {
	MingHunID: number ; // 命魂id
	HunShiItemID: number ; // 魂石道具id
	MingHunName: string ; // 命魂名字
	Level: number ; // 等级
	AttrId: number ; // 属性id
	NeedHunShi: number ; // 升到下一级需要的魂石个数
}
// 命魂之力
declare class Cfg_Equip_ZhuHun_Suit {
	SuitId: number ; // 命魂之力编号
	MingHunID: number ; // 对应命魂ID
	SuitName: string ; // 名字
	EquipNum: number ; // 装备件数
	SkillID: number ; // 触发技能
	AttrId: string ; // 属性id（ 等阶:属性|等阶:属性）
}
// 装备镀金属性
declare class Cfg_Equip_DuJin_Attr {
	DuJinLevel: number ; // 镀金等级
	EquipPart: string ; // 装备部位
	AttrId: number ; // 属性id
}
// 装备镀金消耗
declare class Cfg_Equip_DuJin_Cost {
	DuJinLevel: number ; // 镀金等级
	CostItem: string ; // 升到下一级需要道具数量
}
// 装备随机属性
declare class Cfg_Equip_RandAttr {
	Reborn: number ; // 转生
	RepNum: number ; // 重数
	Level: number ; // 等级
	Q: number ; // 品质
	AttrId: number ; // 属性编号
	Min: number ; // 属性最小值
	Max: number ; // 属性最大值
}
// 装备随机属性数量
declare class Cfg_Equip_RandomNum {
	LevelMin: number ; // 最小等级包含
	LevelMax: number ; // 最大等级包含
	AttrNum: string ; // 随机属性数量
}
// 符文特性表
declare class Cfg_WordsFeature {
	Quality: number ; // 符文品质
	Typ: number ; // 符文类型
	FeatureCount: number ; // 特性数量
	FeaturePrefab: string ; // 预设特性
}
// 装备分解
declare class Cfg_EquipBreak {
	Typ: number ; // 类型
	Quality: number ; // 品质
	Star: number ; // 星级
	CoinItem: string ; // 产出货币数量
	StoneItem: string ; // 产出石头数量
}
// 背包装备分解
declare class Cfg_BagEquipBreak {
	Typ: number ; // 类型
	ObjId: number ; // 对象ID
	Star: number ; // 星级
	Seat: number ; // 部位
	BreakItem: string ; // 产出道具
}
// 装备升品
declare class Cfg_EquipQuality {
	FuncId: number ; // 功能Id
	ObjId: number ; // 对应对象ID
	ItemId: number ; // 目标装备Id
	CostItem: string ; // 消耗道具及数量
	CostEquipId: number ; // 消耗装备ID
	StrengthSLev: number ; // 限制条件--强化等级
}
// 装备升星表
declare class Cfg_EquipStars {
	FuncId: number ; // 功能Id
	ObjId: number ; // 对应对象ID
	Quality: number ; // 品质
	Star: number ; // 星星等级
	IsSamePos: number ; // 是否消耗同位置装备
	Item: string ; // 额外消耗道具及数量
	AttrInc: number ; // 装备属性星级加成
}
// 装备升级
declare class Cfg_EquipUpLev {
	FuncId: number ; // 功能Id
	ObjId: number ; // 对应对象ID
	Typ: number ; // 套装类型
	Lev: number ; // 等级
	Star: number ; // 星星等级
	CostItem: string ; // 消耗道具及数量
	AttrPerct: number ; // 基础属性万分比
}
// 装备合成
declare class Cfg_EquipCompose {
	FuncId: number ; // 功能Id
	ObjId: number ; // 对应对象ID
	ItemId: number ; // 道具Id
	CostItem: string ; // 消耗道具及数量
	CostMoney: string ; // 消耗道具及数量
}
// 装备套装
declare class Cfg_EquipSuit {
	FuncId: number ; // 功能表Id
	ObjId: number ; // 对应对象ID
	Lev: number ; // 套装等级
	Quality: number ; // 品质
	Star: number ; // 星级
	Count: number ; // 数量
	AttrMethod: number ; // 属性叠加
	Attr: number ; // 属性
	AttrPerct: number ; // 基础装备属性万分比
}
// 装备强化大师
declare class Cfg_StrengthMaster {
	FuncId: number ; // 功能Id
	ObjId: number ; // 对应对象ID
	Lev: number ; // 强化大师等级
	Attr: number ; // 属性ID
	LevelLimit: number ; // 所有部位最低强化等级需达到
	CountLimit: number ; // 装备数量限制
}
// 装备强化
declare class Cfg_EquipStrengthSS {
	FuncId: number ; // 功能Id
	ObjId: number ; // 对应对象ID
	Pos: number ; // 装备位置
	MinLev: number ; // 最小等级
	MaxLev: number ; // 最大等级
	BaseAttr: number ; // 装备属性强化属性ID
	PerAttr: number ; // 装备属性强化递增值
	NeedItem: string ; // 消耗道具ID:数量
	PerItem: number ; // 消耗道具数量递增值
}
// 装备精炼
declare class Cfg_EquipRefine {
	FuncId: number ; // 功能Id
	ObjId: number ; // 对应对象ID
	Pos: number ; // 位置
	Lev: number ; // 精炼等级
	MaxExp: number ; // 精炼升级经验
	StrengthSLev: number ; // 限制条件--强化等级
	AttrId: number ; // 属性Id
}
// 装备解锁
declare class Cfg_EquipUnLock {
	FuncId: number ; // 功能表Id
	ObjId: number ; // 对应对象ID
	Pos: number ; // 位置
	Name: string ; // 名称
	ContionId: number ; // 限制条件ID
}
// 配置表
declare class Cfg_EquipConfig {
	CfgKey: string ; // key
	CfgValue: string ; // 值
}
// 装备随机属性_幻灵表
declare class Cfg_EquipAttr_HL {
	Id: number ; // 幻灵Id
	Star: number ; // 星星等级
	Count: number ; // 数量
	Attr: string ; // 属性编号
	Skills: string ; // 技能信息
	YQCost: string ; // 元气消耗
	Show: string ; // 显示
}
// 装备随机属性表
declare class Cfg_EquipAttr {
	Id: number ; // 装备位置
	Level: number ; // 装备等级
	Count: number ; // 数量
	Attr: string ; // 属性编号
	Show: string ; // 未获得时候显示
}
// 镶嵌道具升级表
declare class Cfg_MosaicItemUpLev {
	FuncId: number ; // 功能Id
	ObjId: number ; // 对应对象ID
	Lev: number ; // 等级
	NeedItem: string ; // 基础消耗道具
	AttrPer: number ; // 属性成长万分比
}
// 镶嵌道具解锁表
declare class Cfg_MosaicItemUnLock {
	FuncId: number ; // 功能Id
	ObjId: number ; // 对应对象ID
	Quality: number ; // 装备品质
	Star: number ; // 星级
	Count: number ; // 解锁数量
}
// 转生任务
declare class Cfg_RebornTask {
	Id: number ; // 任务ID
	Name: string ; // 任务名
	Type: number ; // 任务类型序号
	CounterType: number ; // 任务计数类型
	Param: number ; // 参数（如指定某个ID）
	Independent: number ; // 是否独立计数（接取任务时的计数为0，或为当前的累加值）
	TargetCount: number ; // 任务完成条件
	Reborn: string ; // 对应任务所属转生|重数
	Prize: string ; // 完成任务奖励方案id数组
	ClientFuncId: number ; // 跳转页面填：功能表，功能id
}
// 转生等级表
declare class Cfg_Reborn {
	Reborn: number ; // 转生等级
	Break: number ; // 重数
	Attr: number ; // 此等级对应属性ID
	SkillId: number ; // 此等级对应技能ID
	NeedItemId: number ; // 处于此等级时，对应转生丹ID
	NeedItemCount: number ; // 处于此等级时，使用转生丹所需数量
	Detail: string ; // 当前转生重数将要开启新系统描述
}
// 炼化类别表
declare class Cfg_LianHua_Type {
	Type: number ; // 大类ID
	Name: string ; // 类名称
}
// 炼化气泡表
declare class Cfg_LianHua_Word {
	State: number ; // 状态1待命2吞噬
	Content: string ; // 气泡内容
	Time: number ; // 播放时间
	Right: number ; // 切换权重
}
// 炼化等级表
declare class Cfg_LianHua_Level {
	Level: number ; // 等级
	NeedExp: number ; // 升到当前级所需经验
	AttrId: number ; // 属性id
}
// 炼化表
declare class Cfg_LianHua_Item {
	ItemId: number ; // 物品id
	ItemName: string ; // 物品名称（程序不用）
	Value: number ; // 炼化值
	Type: number ; // 大类
	ConditionType: number ; // 条件类型
	ConditionValue: string ; // 条件值
}
// 掉落
declare class Cfg_Drop {
	Id: number ; // 掉落ID
	DropDataType: number ; // 掉落数据类型
	DropItemId: number ; // 掉落编号
	DropNum: number ; // 数量
}
// 道具表
declare class Cfg_Item {
	Id: number ; // 道具编号
	Name: string ; // 道具名称
	Description: string ; // 道具描述
	Detail: string ; // 道具简介
	CoinType: number ; // 货币类型（对应人物属性）
	DetailType: number ; // tip类型
	DetailId: number ; // tip类型参数
	AtlasId: number ; // 图集id（无用字段）
	PicID: string ; // 道具图片
	IsPlie: number ; // 是否可以叠加
	PlieNum: number ; // 堆叠数量
	TypeDes: number ; // 道具类型描述
	Type: number ; // 类型
	Quality: number ; // 品质
	Flash_Quality: number ; // 闪烁特效
	Bind: number ; // 绑定类型
	ObjType: number ; // 所属系统类型填功能表ID
	ObjId: number ; // 对应对象ID
	EquipPart: number ; // 装备部位
	Level: number ; // 道具等级
	Reborn: number ; // 道具转生等级
	Star: number ; // 道具星级
	AttrId: number ; // 属性编号
	AdditionAttrId: number ; // 装备附加属性ID
	GetFunc: number ; // 获得时执行function
	UseFunc: number ; // 使用时执行function
	EquipType: number ; // 装备类型(用于区分套装/神装/普通)
	FromID: string ; // 来源ID
	ClientFunc: string ; // 是否可用
	LinkFunc: number ; // 使用功能的跳转FunID
	NeedNum: number ; // 碎片合成需要总数量
	BestQuality: number ; // 极品飘窗
	CanSend: number ; // 1.可赠送(姻缘)2.可邮寄
	SendGroupNum: number ; // 邮寄一组数量
	IsFastShow: number ; // 是否快速显示
	IsFastParam: number ; // 快速显示参数（用于显示顺序）
	FastLimit: string ; // 快速显示功能限制（用于功能未开启限制）
	Contain: string ; // 包含物品
	OneKeyUse: number ; // 能否一键使用
	IsHide: number ; // 是否在背包中隐藏该道具
	ItemSort: number ; // 背包中道具排序
	SellCon: string ; // 是否可以出售，并且出售之后兑换成的物品
	ShowItemShape: string ; // 形象展示字段用途：用于展示包含道具中皮肤道具对应的皮肤穿戴形象；用于展示包含道具中伙伴道具对应伙伴形象
	ShowItemShapeTBName: string ; // 道具形象展示按钮/展示界面标题文字
}
// 道具类型描述对照表
declare class Cfg_Item_Map {
	Id: number ; // 道具类型描述编号
	Desc: string ; // 道具类型描述
}
// 活动奖励配置表
declare class Cfg_ActRewardGroup {
	Id: number ; // 序号Id
	GroupId: number ; // 组Id
	MinLevel: number ; // 世界等级
	MaxLevel: number ; // 世界等级
	MinDay: number ; // 开服天数注意：天数不能为 0
	MaxDay: number ; // 开服天数注意：天数不能为 0
	Items: string ; // 奖励
}
// 运营活动入口表（活动ICO）
declare class Cfg_Activity {
	Id: number ; // 活动模板ID不重复勿动
	Name: string ; // 活动名称
	ActType: number ; // 活动逻辑类型对照页签2【所有活动类型】活动ID进行填写，页签2的名字要对应功能的名字
	Duration: string ; // 活动持续时间1.天2.小时3.分钟格式：类型:数值例如：1:3 表示持续3天 3:90 表示持续一个半小时注意：假如此任务的开启时刻是每小时开一次，但是持续时间大于1小时，则再判断下次是否开始的时候检测到任务还没结束，则不会再次开启
	Cross: number ; // 是否跨服
	SyncUnionDay: number ; // 是否要求本区时间达到活动开启配置天数
	OnceCircle: number ; // ICO光效控制0永久存在1点界面消失，刷新游戏重复
	PosCircle: number ; // 界面区域是否显示旋转光圈填特效id如不填则代表无光圈
	ContainerId: number ; // 所属活动容器活动ID如以开服活动为容器，其活动id为1，则本字段填1
	ContainerCircle: number ; // 处于活动容器是否显示旋转光圈填特效id如不填则代表无光圈
	BannerPath: string ; // banner图路径
	FuncId1: string ; // 功能跳转1需要到功能表添加活动对应的功能
	ActDsc: number ; // 主题活动问号内说明文字
}
// 奖励组配置表
declare class Cfg_RewardGroup {
	Id: number ; // 序号Id
	GroupId: number ; // 组Id
	RefType: number ; // 世界等级-刷新类型
	ServerType: number ; // 服务器类型
	MinLevel: number ; // 世界等级
	MaxLevel: number ; // 世界等级
	MinDay: number ; // 开服天数
	MaxDay: number ; // 开服天数
	ShowItems: string ; // 奖励
	Items: string ; // 奖励
	DropId: number ; // 掉落奖励(只支持在线玩家)
}
// 技能表
declare class Cfg_Skill {
	SkillId: number ; // 技能ID
	SkillIconID: number ; // 技能iconID
	SkillName: string ; // 技能名字
	ClientSkillName: number ; // 技能名称战斗显示
	SkillDesc: string ; // 技能描述
	SkillTime: number ; // 技能时间(修正)
	TargetNum: number ; // 攻击目标数量
	TargetMaxNum: number ; // 攻击目标数量
	AtkBuff: string ; // 使用主动技能攻击时附加BUFF只在本次攻击生效
	AtkBuffArr: string ; // 使用主动技能攻击时附加BUFF（此BUFF可配置技能等级）只在本次攻击生效
	SkillType: number ; // 技能类型
	OpenLevel: number ; // 角色主动技能开启等级
	AnimId: number ; // 技能特效爆点美术资源id（敌方爆点）
	AnimSID: number ; // 技能特效爆点美术资源id（我方单位爆点）
	AnimPId: string ; // 技能过程特效美术资源id
	AnimPDir: number ; // 技能过程特效是否有方向
	AnimPPlayTime: number ; // 技能过程特效播放时间（毫秒）
	AnimPPlayTimeDelay: number ; // 技能过程特效播放时间延时（毫秒）
	AnimPPlayTime2: number ; // 技能过程特效第2段播放时间（毫秒）
	AnimPUseCenter: string ; // 相对场景中心点偏移点
	IsShake: number ; // 技能释放时是否震屏
	Transform: number ; // 技能爆点特效是否根据角色朝向进行翻转
	AnimEnlarge: number ; // 技能爆点特效缩放
	AnimEnlarge1: number ; // 技能过程特效缩放
	AttackType: number ; // 攻击类型
	AttackFenShen: number ; // 近战攻击是否使用分身效果0或不填-不使用1-使用
	AttackTime: number ; // 受击时间
	SkillSound: string ; // 音效
	IsShowBuff: number ; // 是否在BUFF列表中显示
}
// 技能数据表
declare class Cfg_SkillData {
	Id: number ; // ID
	SkillId: number ; // 技能编号
	SkillLevel: number ; // 技能等级
	Quality: number ; // 技能品质
	Flash_Quality: number ; // 品质边框闪烁特效
	Effect_Type: number ; // 效果1主动技能2被动技能
	Cparam: string ; // 前端显示参数
	Param1: string ; // 参数1
	Param2: string ; // 参数2
	Param3: string ; // 参数3
	Param4: string ; // 参数4
	ShowLevel: number ; // 觉醒技能等级显示
}
// 技能buff
declare class Cfg_Buff {
	BuffId: number ; // buffid
	BuffEffect: number ; // 效果
	Round: number ; // 持续回合（-1）永久
	BuffLife: number ; // 状态表现是否常显
	BuffName: string ; // buff名称
	ParamClient: string ; // buff描述
	Param1: number ; // 参数1
	Param2: number ; // 参数2
	Param3: number ; // 参数3
	Param4: number ; // 参数4
	Param5: number ; // 参数5
	Param6: number ; // 参数6
	Param7: number ; // 参数7
	Param8: number ; // 参数8
	Param9: number ; // 参数9
	Param10: number ; // 参数10
	ClientEffect: number ; // 技能前端ID
}
// 前端技能展示表
declare class Cfg_ClientSkill {
	ID: number ; // 序号
	Name: string ; // 前端显示名称
	BeginY: number ; // 坐标
	Result: number ; // 结算
	ForObj: number ; // 對象
	Font: string ; // 字体路径
}
// 属性表
declare class Cfg_Attribute {
	Id: number ; // 属性编号
	FightValue: string ; // 战力
	Attr_1: string ; // 生命
	Attr_2: string ; // 攻击
	Attr_3: string ; // 防御
	Attr_4: string ; // 命中(万分比)
	Attr_5: string ; // 闪避(万分比)
	Attr_6: string ; // 暴击(万分比)
	Attr_7: string ; // 抗暴(万分比)
	Attr_8: string ; // 攻速
	Attr_9: string ; // 无视防御
	Attr_10: string ; // 减免无视
	Attr_11: string ; // 伤害加深
	Attr_12: string ; // 伤害减少
	Attr_13: string ; // 伤害增加%
	Attr_14: string ; // 伤害减少%
	Attr_15: string ; // 暴击伤害增加
	Attr_16: string ; // 暴击伤害减少
	Attr_17: string ; // 致命一击概率增加
	Attr_18: string ; // 致命一击概率减少
	Attr_19: string ; // PVP伤害增加(万分比)
	Attr_20: string ; // PVP伤害减少(万分比)
	Attr_21: string ; // PVE伤害增加(万分比)
	Attr_22: string ; // PVE伤害减少(万分比)
	Attr_23: string ; // 额外伤害（没用）
	Attr_24: string ; // 仙击概率增加
	Attr_25: string ; // 仙击概率减少
	Attr_26: string ; // 金攻击
	Attr_27: string ; // 金防御
	Attr_28: string ; // 木攻击
	Attr_29: string ; // 木防御
	Attr_30: string ; // 水攻击
	Attr_31: string ; // 水防御
	Attr_32: string ; // 火攻击
	Attr_33: string ; // 火防御
	Attr_34: string ; // 土攻击
	Attr_35: string ; // 土防御
	Attr_36: string ; // 金伤害加深
	Attr_37: string ; // 金伤害减免
	Attr_38: string ; // 木伤害加深
	Attr_39: string ; // 木伤害减免
	Attr_40: string ; // 水伤害加深
	Attr_41: string ; // 水伤害减免
	Attr_42: string ; // 火伤害加深
	Attr_43: string ; // 火伤害减免
	Attr_44: string ; // 土伤害加深
	Attr_45: string ; // 土伤害减免
	Attr_46: string ; // 全系攻击
	Attr_47: string ; // 全系防御
	Attr_48: string ; // 全系伤害加深
	Attr_49: string ; // 全系伤害减免
	Attr_321: string ; // 真实命中
	Attr_322: string ; // 真实暴击
	Attr_51: string ; // 生命百分比
	Attr_52: string ; // 攻击百分比
	Attr_53: string ; // 防御百分比
	Attr_54: string ; // 命中(万分比)百分比
	Attr_55: string ; // 闪避(万分比)百分比
	Attr_56: string ; // 暴击(万分比)百分比
	Attr_57: string ; // 抗暴(万分比)百分比
	Attr_58: string ; // 速度百分比
	Attr_59: string ; // 无视防御百分比
	Attr_60: string ; // 减免无视百分比
	Attr_61: string ; // 伤害加深百分比
	Attr_62: string ; // 伤害减少百分比
	Attr_63: string ; // 伤害增加%百分比
	Attr_64: string ; // 伤害减少%百分比
	Attr_65: string ; // 暴击伤害增加百分比
	Attr_66: string ; // 暴击伤害减少百分比
	Attr_67: string ; // 魂概率增加百分比
	Attr_68: string ; // 魂概率减少百分比
	Attr_69: string ; // PVP伤害增加(万分比)百分比
	Attr_70: string ; // PVP伤害减少(万分比)百分比
	Attr_71: string ; // PVE伤害增加(万分比)百分比
	Attr_72: string ; // PVE伤害减少(万分比)百分比
	Attr_73: string ; // 额外伤害百分比
	Attr_74: string ; // 仙击概率增加百分比
	Attr_75: string ; // 仙击概率减少百分比
	Attr_76: string ; // 金攻击百分比
	Attr_77: string ; // 金防御百分比
	Attr_78: string ; // 木攻击百分比
	Attr_79: string ; // 木防御百分比
	Attr_80: string ; // 水攻击百分比
	Attr_81: string ; // 水防御百分比
	Attr_82: string ; // 火攻击百分比
	Attr_83: string ; // 火防御百分比
	Attr_84: string ; // 土攻击百分比
	Attr_85: string ; // 土防御百分比
	Attr_86: string ; // 全系攻击百分比
	Attr_87: string ; // 全系防御百分比
	Attr_88: string ; // 金伤害加深百分比
	Attr_89: string ; // 金伤害减免百分比
	Attr_90: string ; // 木伤害加深百分比
	Attr_91: string ; // 木伤害减免百分比
	Attr_92: string ; // 水伤害加深百分比
	Attr_93: string ; // 水伤害减免百分比
	Attr_94: string ; // 火伤害加深百分比
	Attr_95: string ; // 火伤害减免百分比
	Attr_96: string ; // 土伤害加深百分比
	Attr_97: string ; // 土伤害减免百分比
	Attr_98: string ; // 全系伤害加深百分比
	Attr_99: string ; // 全系伤害减免百分比
	GradeType: number ; // 升阶系统类型
	GradeAdd: number ; // 万分比加成
	ExtraAttr: string ; // 特殊属性
}
// 属性表
declare class Cfg_Attr_Monster {
	Id: number ; // 属性编号
	Level: number ; // 等级
	Name: string ; // 属性名
	FightValue: string ; // 战力
	Attr_1: string ; // 生命
	Attr_2: string ; // 攻击
	Attr_3: string ; // 防御
	Attr_4: string ; // 命中(万分比)
	Attr_5: string ; // 闪避(万分比)
	Attr_6: string ; // 暴击(万分比)
	Attr_7: string ; // 抗暴(万分比)
	Attr_8: string ; // 攻速
	Attr_9: string ; // 无视防御
	Attr_10: string ; // 减免无视
	Attr_11: string ; // 伤害加深
	Attr_12: string ; // 伤害减少
	Attr_13: string ; // 伤害增加%
	Attr_14: string ; // 伤害减少%
	Attr_15: string ; // 暴击伤害增加
	Attr_16: string ; // 暴击伤害减少
	Attr_17: string ; // 致命一击概率增加
	Attr_18: string ; // 致命一击概率减少
	Attr_19: string ; // PVP伤害增加(万分比)
	Attr_20: string ; // PVP伤害减少(万分比)
	Attr_21: string ; // PVE伤害增加(万分比)
	Attr_22: string ; // PVE伤害减少(万分比)
	Attr_23: string ; // 额外伤害
	Attr_24: string ; // 仙击概率增加
	Attr_25: string ; // 仙击概率减少
	Attr_26: string ; // 金攻击
	Attr_27: string ; // 金防御
	Attr_28: string ; // 木攻击
	Attr_29: string ; // 木防御
	Attr_30: string ; // 水攻击
	Attr_31: string ; // 水防御
	Attr_32: string ; // 火攻击
	Attr_33: string ; // 火防御
	Attr_34: string ; // 土攻击
	Attr_35: string ; // 土防御
	Attr_36: string ; // 全系攻击
	Attr_37: string ; // 全系防御
}
// 宠物属性表
declare class Cfg_Attr_Pet {
	Id: number ; // 属性编号
	FightValue: number ; // 战力
	Attr_1: number ; // 生命
	Attr_2: number ; // 攻击
	Attr_3: number ; // 防御
	Attr_4: number ; // 命中(万分比)
	Attr_5: number ; // 闪避(万分比)
	Attr_6: number ; // 暴击(万分比)
	Attr_7: number ; // 抗暴(万分比)
	Attr_8: number ; // 攻速
	Attr_9: number ; // 无视防御
	Attr_10: number ; // 减免无视
	Attr_11: number ; // 伤害加深
	Attr_12: number ; // 伤害减少
	Attr_13: number ; // 伤害增加%
	Attr_14: number ; // 伤害减少%
	Attr_15: number ; // 暴击伤害增加
	Attr_16: number ; // 暴击伤害减少
	Attr_17: number ; // 魂概率增加
	Attr_18: number ; // 魂概率减少
	Attr_19: number ; // PVP伤害增加(万分比)
	Attr_20: number ; // PVP伤害减少(万分比)
	Attr_21: number ; // PVE伤害增加(万分比)
	Attr_22: number ; // PVE伤害减少(万分比)
	Attr_23: number ; // 额外伤害
	Attr_24: number ; // 仙击概率增加
	Attr_25: number ; // 仙击概率减少
}
// 仙侣属性表
declare class Cfg_Attr_PetA {
	Id: number ; // 属性编号
	FightValue: number ; // 战力
	Attr_1: number ; // 生命
	Attr_2: number ; // 攻击
	Attr_3: number ; // 防御
	Attr_4: number ; // 命中(万分比)
	Attr_5: number ; // 闪避(万分比)
	Attr_6: number ; // 暴击(万分比)
	Attr_7: number ; // 抗暴(万分比)
	Attr_8: number ; // 攻速
	Attr_9: number ; // 无视防御
	Attr_10: number ; // 减免无视
	Attr_11: number ; // 伤害加深
	Attr_12: number ; // 伤害减少
	Attr_13: number ; // 伤害增加%
	Attr_14: number ; // 伤害减少%
	Attr_15: number ; // 暴击伤害增加
	Attr_16: number ; // 暴击伤害减少
	Attr_17: number ; // 魂概率增加
	Attr_18: number ; // 魂概率减少
	Attr_19: number ; // PVP伤害增加(万分比)
	Attr_20: number ; // PVP伤害减少(万分比)
	Attr_21: number ; // PVE伤害增加(万分比)
	Attr_22: number ; // PVE伤害减少(万分比)
	Attr_23: number ; // 额外伤害
	Attr_24: number ; // 仙击概率增加
	Attr_25: number ; // 仙击概率减少
}
// 属性关联
declare class Cfg_Attr_Relation {
	Attr: number ; // 属性编号
	FightValue: number ; // 战力评分
	Fun_Name1: string ; // 基础属性名
	ItemPrecentAttr: number ; // 属性百分比类型
	Fun_Name2: string ; // 属性百分比类型name
	PercentType: number ; // 前端显示为百分比或者具体值
}
