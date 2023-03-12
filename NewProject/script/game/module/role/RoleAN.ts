/* eslint-disable padded-blocks */
/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable spaced-comment */
/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export class RoleAN {
	/*N： 属性名*/
	static N = {
		/** 生命 */
		Hp: "Hp",
		/** 攻击 */
		Atk: "Atk",
		/** 防御 */
		Def: "Def",
		/** 命中 */
		Hit: "Hit",
		/** 闪避 */
		Avd: "Avd",
		/** 暴击 */
		Cri: "Cri",
		/** 防暴击 */
		ACri: "ACri",
		/** 速度 */
		Speed: "Speed",
		/** 无视防御 */
		Atk1: "Atk1",
		/** 减免无视 */
		Def1: "Def1",
		/** 伤害加深 */
		Atk2: "Atk2",
		/** 伤害减少 */
		Def2: "Def2",
		/** 伤害增加% */
		Atk3: "Atk3",
		/** 伤害减少% */
		Def3: "Def3",
		/** 暴击伤害增加 */
		Atk4: "Atk4",
		/** 暴击伤害减少 */
		Def4: "Def4",
		/** 致命一击概率增加 */
		Atk5: "Atk5",
		/** 致命一击概率减少 */
		Def5: "Def5",
		/** PVP伤害增加(万分比) */
		Atk6: "Atk6",
		/** VP伤害减少(万分比) */
		Def6: "Def6",
		/** PVE伤害增加(万分比) */
		Atk7: "Atk7",
		/** PVE伤害减少(万分比) */
		Def7: "Def7",
		/** 额外伤害 */
		ExtraHurt: "ExtraHurt",
		/** 仙击概率增加 */
		Atk8: "Atk8",
		/** 仙击概率减少 */
		Def8: "Def8",
		/** 真实命中 */
		Hit_Real: "Hit_Real",
		/** 真实暴击 */
		Cri_Real: "Cri_Real",
		/** 神击概率增加 */
		AtkGod: "AtkGod",
		/** 神击概率减少 */
		DefGod: "DefGod",
		/** 生命 */
		Hp_P: "Hp_P",
		/** 攻击 */
		Atk_P: "Atk_P",
		/** 防御 */
		Def_P: "Def_P",
		/** 命中 */
		Hit_P: "Hit_P",
		/** 闪避 */
		Avd_P: "Avd_P",
		/** 暴击 */
		Cri_P: "Cri_P",
		/** 防暴击 */
		ACri_P: "ACri_P",
		/** 速度 */
		Speed_P: "Speed_P",
		/** 无视防御 */
		Atk1_P: "Atk1_P",
		/** 减免无视 */
		Def1_P: "Def1_P",
		/** 伤害加深 */
		Atk2_P: "Atk2_P",
		/** 伤害减少 */
		Def2_P: "Def2_P",
		/** 伤害增加% */
		Atk3_P: "Atk3_P",
		/** 伤害减少% */
		Def3_P: "Def3_P",
		/** 暴击伤害增加 */
		Atk4_P: "Atk4_P",
		/** 暴击伤害减少 */
		Def4_P: "Def4_P",
		/** 致命一击概率增加 */
		Atk5_P: "Atk5_P",
		/** 致命一击概率减少 */
		Def5_P: "Def5_P",
		/** PVP伤害增加(万分比) */
		Atk6_P: "Atk6_P",
		/** VP伤害减少(万分比) */
		Def6_P: "Def6_P",
		/** PVE伤害增加(万分比) */
		Atk7_P: "Atk7_P",
		/** PVE伤害减少(万分比) */
		Def7_P: "Def7_P",
		/** 额外伤害 */
		ExtraHurt_P: "ExtraHurt_P",
		/** 仙击概率增加 */
		Atk8_P: "Atk8_P",
		/** 仙击概率减少 */
		Def8_P: "Def8_P",
		/** 真实命中 */
		Hit_Real_P: "Hit_Real_P",
		/** 真实暴击 */
		Cri_Real_P: "Cri_Real_P",
		/** 神击概率增加 */
		AtkGod_P: "AtkGod_P",
		/** 神击概率减少 */
		DefGod_P: "DefGod_P",
		/** 帐号ID */
		AccountId: "AccountId",
		/** 用户所属于的渠道 */
		ChannelId: "ChannelId",
		/** 服务器名称 */
		AreaName: "AreaName",
		/** 创建区编号 */
		CreateAreaId: "CreateAreaId",
		/** 登录区编号 */
		LoginAreaId: "LoginAreaId",
		/** 显示区编号 */
		ShowAreaId: "ShowAreaId",
		/** 战区编号 */
		FightAreaId: "FightAreaId",
		/** 用户离线时间 */
		LogoutTime: "LogoutTime",
		/** 最后一次登录天：用于onDayChange 计算 */
		LastDay: "LastDay",
		/** 最后一次登周：用于onWeekChange 计算 */
		LastWeek: "LastWeek",
		/** 最后一次登月：用于onMonthChange 计算 */
		LastMonth: "LastMonth",
		/** 今日在线时间 */
		DayOnlineTime: "DayOnlineTime",
		/** 累计登录天数 */
		LoginDay: "LoginDay",
		/** 当月累计登录天数 */
		LoginDayInMonth: "LoginDayInMonth",
		/** 人物等级 */
		Level: "Level",
		/** 昵称 */
		Nick: "Nick",
		/** 性别 */
		Sex: "Sex",
		/** 用户头像 */
		HeadIcon: "HeadIcon",
		/** 战力值 */
		FightValue: "FightValue",
		/** 用户头像框 */
		HeadFrame: "HeadFrame",
		/** 用户称号 */
		Title: "Title",
		/** 玩家形象 */
		PlayerSkin: "PlayerSkin",
		/** 玩家的展示形象 */
		ShowId: "ShowId",
		/** 是否在线 */
		IsOnline: "IsOnline",
		/** 是否自动战斗 */
		AutoFight: "AutoFight",
		/** 共充值多少rmb，分 */
		ChargeRmb: "ChargeRmb",
		/** 目前上阵的阵容编号 */
		LineUpId: "LineUpId",
		/** 地图所在的坐标x */
		Map_X: "Map_X",
		/** 地图所在的坐标Y */
		Map_Y: "Map_Y",
		/** 开始移动时间 */
		Map_StartMoveTime: "Map_StartMoveTime",
		/** 修改名字的次数 */
		ChangeNickTimes: "ChangeNickTimes",
		/** 下次修改名字的时间 */
		ChangeNickCd: "ChangeNickCd",
		/** 军衔阶级 */
		ArmyLevel: "ArmyLevel",
		/** 月卡 */
		MonthCard: "MonthCard",
		/** 军衔星数 */
		ArmyStar: "ArmyStar",
		/** 通关关卡 */
		Stage: "Stage",
		/** 实名认证防沉迷状态 */
		RealNameRealAuth: "RealNameRealAuth",
		/** vip等级 */
		VipLevel: "VipLevel",
		/** 总充值额度 */
		Recharge: "Recharge",
		/** 今日充值额度 */
		RechargeToday: "RechargeToday",
		/** 当月充值额度 */
		RechargeMonth: "RechargeMonth",
		/** 充值次数记录 */
		RechargeTimes: "RechargeTimes",
		/** 是否打开过欢迎界面 */
		Welcome: "Welcome",
		/** 坐骑幻化id */
		GradeHorse: "GradeHorse",
		/** 羽翼幻化id */
		GradeWing: "GradeWing",
		/** 光武幻化id */
		GradeWeapon: "GradeWeapon",
		/** 幻化套装id */
		GradeSuitId: "GradeSuitId",
		/** 萌宠幻化id */
		GradePet: "GradePet",
		/** 竞技场挑战次数 */
		ArenaTimes: "ArenaTimes",
		/** 竞技场挑战下次增加时间(秒) */
		ArenaNextTime: "ArenaNextTime",
		/** 当前竞技sah场排名(不保存) */
		ArenaRank: "ArenaRank",
		/** 竞技场历史排名 */
		ArenaHistoryRank: "ArenaHistoryRank",
		/** 竞技场今日购买次数 */
		ArenaBuyTimes: "ArenaBuyTimes",
		/** 登录地区 */
		RegionName: "RegionName",
		/** 地图状态 0,死亡，1复活 */
		Map_State: "Map_State",
		/** 复活时间戳 */
		Map_ReliveTime: "Map_ReliveTime",
		/** boss之家（烽火连城）体力值 */
		BossHomeEnergyVal: "BossHomeEnergyVal",
		/** boss之家（烽火连城）对手玩家id */
		BossHomeFightUserId: "BossHomeFightUserId",
		/** 排位赛积分 */
		RankMatchScore: "RankMatchScore",
		/** 排位赛排名 */
		RankMatchRank: "RankMatchRank",
		/** 本服排行榜膜拜 */
		RankWorship: "RankWorship",
		/** 跨服排行榜膜拜 */
		RankWorshipUnion: "RankWorshipUnion",
		/** 多人boss今日购买次数 */
		MTBossDayBuyTimes: "MTBossDayBuyTimes",
		/** 官职等级 */
		OfficeLevel: "OfficeLevel",
		/** 角色Id */
		UserId: "UserId",
		/** 组队副本时候默认接受 */
		TeamDunAccept: "TeamDunAccept",
		/** 世家事务等级 */
		FamilyTaskLevel: "FamilyTaskLevel",
		/** 气泡框 */
		Bubble: "Bubble",
		/** 历史最大战力值 */
		FightValueMax: "FightValueMax",
		/** 当前世界等级 */
		WorldLevel: "WorldLevel",
		/** 九江粮道押镖次数 */
		EscortNum: "EscortNum",
		/** 玩家经验 */
		RoleExp: "RoleExp",
		/** 玉璧(充值货币) */
		ItemType_Coin2: "ItemType_Coin2",
		/** 元宝(绑元) */
		ItemType_Coin3: "ItemType_Coin3",
		/** 金币(游戏币) */
		ItemType_Coin4: "ItemType_Coin4",
		/** vip经验 */
		VipExp: "VipExp",
		/** 世家币 */
		FamilyCoin: "FamilyCoin",
		/** 技能经验 */
		SkillExp: "SkillExp",
		/** 竞技勋章 */
		ArenaMedal: "ArenaMedal",
		/** 官职经验 */
		OfficeExp: "OfficeExp",
		/** 战技积分 */
		SkillCoin: "SkillCoin",
		/** 武将招募积分 */
		WJZhaoMuScore: "WJZhaoMuScore",
		/** 世家事务exp */
		FamilyTaskExp: "FamilyTaskExp",
		/** 日常活跃度 */
		DailyActVal: "DailyActVal",
		/** 周常活跃度 */
		WeekActVal: "WeekActVal",
		/** 华容道券 */
		HuarongTicket: "HuarongTicket",
		/** 三国探险-宝石秘矿-最高通过关卡 */
		ExploreGemMaxStage: "ExploreGemMaxStage",
		/** 三国探险-宝石秘矿-当前挑战关卡 */
		ExploreGemCurrStage: "ExploreGemCurrStage",
		/** 地图所在的坐标x */
		Monster_Map_X: "Monster_Map_X",
		/** 地图所在的坐标Y */
		Monster_Map_Y: "Monster_Map_Y",
		/** 怪物的战斗cd */
		Monster_FightCdEndTime: "Monster_FightCdEndTime",
		/** 怪物状态 0,死亡，1复活 */
		Monster_State: "Monster_State",
		/** 怪物复活时间戳 */
		Monster_ReliveTime: "Monster_ReliveTime",
		/** 怪物归属玩家id */
		Monster_OwnerId: "Monster_OwnerId",
		/** 战斗当前血量 */
		FCurrHp: "FCurrHp",
		/** 战斗最大血量 */
		FMaxHp: "FMaxHp",
		/** 战斗武将id */
		FGeneralId: "FGeneralId",
		/** 战斗武将幻化id */
		FGeneralSkin: "FGeneralSkin",
		/** 战斗怪物id */
		FMonsterId: "FMonsterId",
		/** 战斗阵营id(魏蜀吴群) */
		FCampId: "FCampId",
		/** 世界boss盾值 */
		FBossShield: "FBossShield",
		/** 世界boss攻击系数 */
		FBossParam: "FBossParam",
		/** 世界bossdebuff */
		FBossDebuff: "FBossDebuff",
		/** 红颜id */
		FBeautyId: "FBeautyId",
		/** 系统设置 */
		SysSettingsInfo: "SysSettingsInfo",
	}
	
}
