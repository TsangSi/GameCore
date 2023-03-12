/* eslint-disable object-curly-newline */
/*
 * @Author: zs
 * @Date: 2022-05-09 12:02:07
 * @Description:
 *
 */

import { ConfigIndexer } from './indexer/ConfigIndexer';

export interface ConfigInfoEx {
    /** 类型 */
    types?: string[],
    /** 区间key */
    intervalKey?: string,
    /** 是否删除原始表 */
    deleteSource?: boolean,
}
export interface ConfigInfo {
    /** 表名 */
    name: string,
    /** 映射key */
    key: string,
    /** 索引类名 */
    indexerName?: string,
    /** 索引类 */
    indexer?: ConfigIndexer,
    ex?: ConfigInfoEx,
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

export type CfgData = { [key: string]: CfgData | string } | string;

/**
 * 事例
// 顺序存储，导表出来的结构
const Cfg_Test = [];
Cfg_Test[0] = { Id: 1001, Type: 28, ObjId: 3, name: '数据1' };
Cfg_Test[1] = { Id: 1002, Type: 28, ObjId: 4, name: '数据2' };
Cfg_Test[2] = { Id: 1003, Type: 30, ObjId: 8, name: '数据3' };
Cfg_Test[3] = { Id: 1004, Type: 40, ObjId: 8, name: '数据4' };
Cfg_Test[4] = { Id: 1005, Type: 40, ObjId: 8, name: '数据5' };

1. makeInfo('Cfg_Test', 'Id')
   映射表：[1001, 1002, 1003, 1004, 1005]
2. makeInfo('Cfg_Test', 'Type>ObjId>')
   多维嵌套数组表：{
       28: {
           3: [0],
           4: [1]
       },
       30: {
           8: [2]
       },
       40: {
           8: [3, 4]
       }
   }
3. makeInfo('Cfg_Test', 'Type>ObjId>Id')
   多维嵌套表：{
       28: {
           3: {
               1001: 0
           },
           4: {
               1002: 1
           },
       },
       30: {
           8: {
               1003: 2
           }
       },
       40: {
           8: {
               1004: 3,
               1005: 4,
           }
       }
   }
4. 还有一些特殊需求的，可以新建索引器类，继承ConfigIndexer，自定义映射
 */

/**
 * 生成info信息
 * @param tableName 表名
 * @param key 键值，可选参数
 * * 1.'Id'：单键值，传入唯一值的字段名，将会把每一条数据Id字段的值push到映射表内
 * * 2.'Type>ObjId>'：多维嵌套数组，最后一维是数组：传入嵌套的关键字'>'隔开，最后一定要是'>'结尾
 * * 3.'Type>ObjId>Id'：多维嵌套表，传入嵌套的关键字用'>'隔开。所有被>分割开的键将产生多维键，顺序同'>'分割顺序
 * @param indexer 扩展的索引器，可选参数，用于特殊的表需要另外新建类来扩展的索引器
 * @param ex 扩展参数 { intervalKey?: string }
 * @returns
 */
const makeInfo = (name: string, key?: string, indexerName?: string, ex?: ConfigInfoEx) => {
    const obj: ConfigInfo = cc.js.createMap(true);
    obj.name = name;
    obj.key = key;
    obj.indexerName = indexerName;
    obj.ex = ex;
    return obj;
};

export const ConfigConst = {
    /** 物品表 */
    Cfg_Item: makeInfo('Cfg_Item', 'Id', 'ConfigItemIndexer'),
    /** 地图表 */
    Cfg_Map: makeInfo('Cfg_Map', 'MapId'),
    /** 关卡表 */
    Cfg_Stage: makeInfo('Cfg_Stage', 'MapId', 'ConfigStageIndexer', { intervalKey: 'MaxStageNum' }),
    /** 怪物表 */
    Cfg_Monster: makeInfo('Cfg_Monster', 'MonsterId'),
    /** 刷新表 */
    Cfg_Refresh: makeInfo('Cfg_Refresh', 'RefreshId'),
    /** 地图明怪表（烽火连城等系统会用） */
    Cfg_Map_Monster: makeInfo('Cfg_Map_Monster', 'Id'),
    /** 宠物表 */
    Cfg_Pet: makeInfo('Cfg_Pet', 'PetId'),
    /** 职业表 */
    Cfg_Job: makeInfo('Cfg_Job', 'RoleID'),
    /** 合成表 */
    Cfg_Stick: makeInfo('Cfg_Stick', 'FirstType>SecondType>ThirdType', 'ConfigStickIndexer'),
    /** 合成页签名称 */
    Cfg_StickType: makeInfo('Cfg_StickType', 'Type'),
    /** 幻灵配置 */
    Cfg_HuanLing: makeInfo('Cfg_HuanLing', 'Id'),
    /** 充值商城 */
    Cfg_ChargeMall: makeInfo('Cfg_ChargeMall', 'GoodsId'),
    /** VIP表 */
    Cfg_VIP: makeInfo('Cfg_VIP', 'VIPLevel'),
    /** 物品来源表 */
    Cfg_ItemSource: makeInfo('Cfg_ItemSource', 'Id'),
    /** 功能表 */
    Cfg_Client_Func: makeInfo('Cfg_Client_Func', 'FuncId'),
    /** 功能预告 */
    Cfg_FuncPreview: makeInfo('Cfg_FuncPreview', 'FuncId'),
    /** 角色等级经验 */
    Cfg_Level: makeInfo('Cfg_Level', 'Level'),
    /** 兑换 */
    Cfg_DH: makeInfo('Cfg_DH', 'FuncId'),
    /** 公告 */
    Cfg_Notice: makeInfo('Cfg_Notice', 'Id'),
    /** 邮件 */
    Cfg_Mail: makeInfo('Cfg_Mail', 'Tpl_ID'),
    /** 参数配置表 */
    Cfg_Config: makeInfo('Cfg_Config', 'CfgKey'),
    /** 提示表 */
    Cfg_Tips: makeInfo('Cfg_Tips', 'Id'),
    /** 普通装备熔炼 */
    Cfg_MeltCom: makeInfo('Cfg_MeltCom', 'Quality'),
    /** 属性表 */
    Cfg_Attribute: makeInfo('Cfg_Attribute', 'Id', 'ConfigAttributeIndexer', { deleteSource: true }),
    /** 属性关联表 */
    Cfg_Attr_Relation: makeInfo('Cfg_Attr_Relation', 'Attr', 'ConfigAttrRelationIndexer'),
    /** 使用功能表 */
    Cfg_UseFunc: makeInfo('Cfg_UseFunc', 'UseId'),
    /** 掉落表 */
    Cfg_Drop: makeInfo('Cfg_Drop', 'Id>'),
    /** 道具类型描述对照表 */
    Cfg_Item_Type: makeInfo('Cfg_Item_Type', 'Id'),
    /** 普通装备熔炼 */
    Cfg_Equip_Material: makeInfo('Cfg_Equip_Material', 'Type>ArmyLevel'),
    /** 红装装备熔炼 */
    Cfg_MeltRed: makeInfo('Cfg_MeltRed', 'Star'),
    /** 红装熔炼部位-碎片 */
    Cfg_MeltPartToType: makeInfo('Cfg_MeltPartToType', 'EquipPart'),
    /** 进阶装备熔炼 */
    Cfg_MeltGrade: makeInfo('Cfg_MeltGrade', 'Quality'),
    /** 进阶熔炼部位-碎片 */
    Cfg_MeltSysToType: makeInfo('Cfg_MeltSysToType', 'EquipSys'),
    /** 首领 */
    Cfg_Boss_Config: makeInfo('Cfg_Boss_Config', 'Key'),
    Cfg_Boss_Personal: makeInfo('Cfg_Boss_Personal', 'Id'),
    Cfg_Boss_VIP: makeInfo('Cfg_Boss_VIP', 'Id'),
    Cfg_Boss_Multi: makeInfo('Cfg_Boss_Multi', 'Id'),
    /** 称号 */
    Cfg_Title: makeInfo('Cfg_Title', 'Id', 'ConfigTitleIndexer'),
    Cfg_TitleTab: makeInfo('Cfg_TitleTab', 'Id'),
    Cfg_TitleLevelUp: makeInfo('Cfg_TitleLevelUp', 'Key', 'ConfigTitleLevelUpIndexer'),
    /** 武将 */
    Cfg_Config_General: makeInfo('Cfg_Config_General', 'CfgKey'),
    Cfg_General: makeInfo('Cfg_General', 'Id'),
    Cfg_GeneralQuality: makeInfo('Cfg_GeneralQuality', 'Quality'),
    Cfg_GeneralLevelUp: makeInfo('Cfg_GeneralLevelUp', 'Level'),
    Cfg_GeneralTitle: makeInfo('Cfg_GeneralTitle', 'Title'),
    Cfg_GeneralRarity: makeInfo('Cfg_GeneralRarity', 'Rarity'),
    Cfg_GeneralGradeUp: makeInfo('Cfg_GeneralGradeUp', 'Rarity>Grade'),
    Cfg_GeneralSkin: makeInfo('Cfg_GeneralSkin', 'Key', 'ConfigGeneralSkinIndexer'),
    Cfg_GeneralSkinStar: makeInfo('Cfg_GeneralSkinStar', 'Key', undefined, { intervalKey: 'MaxLevel' }),
    // 武将装备
    Cfg_Genera_Equip: makeInfo('Cfg_Genera_Equip', 'Id', 'ConfigGeneralEquipIndexer'),
    Cfg_Genera_EquipStarUp: makeInfo('Cfg_Genera_EquipStarUp', 'Level>Star'),
    // 武将技能
    Cfg_G_SkillQuality: makeInfo('Cfg_G_SkillQuality', 'Quality'),
    Cfg_G_RecommenSkill: makeInfo('Cfg_G_RecommenSkill', 'RecomSkilId'),
    Cfg_G_SkillLock: makeInfo('Cfg_G_SkillLock', 'Count'),

    /** 表情包 */
    Cfg_Emoji: makeInfo('Cfg_Emoji', 'Id'),
    /** 装备消耗 */
    Cfg_EquipStrengthC: makeInfo('Cfg_EquipStrengthC', 'ArmyLevel', undefined, { intervalKey: 'Max' }),
    /** 装备属性 */
    Cfg_EquipStrengthA: makeInfo('Cfg_EquipStrengthA', 'Pos', 'ConfigEquipIndexer', { intervalKey: 'LevelMax', types: ['Pos'] }),
    /** 共鸣等级获取属性 */
    Cfg_EquipStrengthS: makeInfo('Cfg_EquipStrengthS', 'Level'),
    /** 聊天配置表 */
    Cfg_ChatSet: makeInfo('Cfg_ChatSet', 'Key'),
    Cfg_EquipBuildNew: makeInfo('Cfg_EquipBuildNew', 'EquipSys>EquipLevel>'),
    Cfg_EquipPartName: makeInfo('Cfg_EquipPartName', 'EquipPart'),
    /** 升星配置表 */
    Cfg_Equip_Star: makeInfo('Cfg_Equip_Star', 'Id'),
    /** 进阶皮肤表 */
    Cfg_GradeSkin: makeInfo('Cfg_GradeSkin', 'Key', 'ConfigGradeSkinIndexer'),
    /** 进阶皮肤技能表 */
    Cfg_GradeSkinSkill: makeInfo('Cfg_GradeSkinSkill', 'Key', 'ConfigGradeSkinSkillIndexer'),
    /** 进阶皮肤升星表 */
    Cfg_GradeSkinStar: makeInfo('Cfg_GradeSkinStar', 'FuncId>', undefined, { intervalKey: 'MaxLevel', types: ['FuncId'] }),
    /** 进阶系统装备化金表 */
    Cfg_GradeHJ: makeInfo('Cfg_GradeHJ', 'FuncId>Part>Level'),
    /** 进阶系统坐骑表 */
    Cfg_Grade_Horse: makeInfo('Cfg_Grade_Horse', 'Level>Star'),
    /** 进阶系统坐骑技能表 */
    Cfg_GradeSkill_Horse: makeInfo('Cfg_GradeSkill_Horse', 'Part>Level'),
    /** 进阶系统羽翼表 */
    Cfg_Grade_Wing: makeInfo('Cfg_Grade_Wing', 'Level>Star'),
    /** 进阶系统羽翼技能表 */
    Cfg_GradeSkill_Wing: makeInfo('Cfg_GradeSkill_Wing', 'Part>Level'),
    /** 进阶系统光武表 */
    Cfg_Grade_Weapon: makeInfo('Cfg_Grade_Weapon', 'Level>Star'),
    /** 进阶系统光武技能表 */
    Cfg_GradeSkill_Weapon: makeInfo('Cfg_GradeSkill_Weapon', 'Part>Level'),
    /** 进阶系统萌宠表 */
    Cfg_Grade_Pet: makeInfo('Cfg_Grade_Pet', 'Level>Star'),
    /** 进阶系统萌宠技能表 */
    Cfg_GradeSkill_Pet: makeInfo('Cfg_GradeSkill_Pet', 'Part>Level'),
    /** 进阶系统红颜表 */
    Cfg_Grade_Beauty: makeInfo('Cfg_Grade_Beauty', 'Level>Star'),
    /** 进阶系统红颜技能表 */
    Cfg_GradeSkill_Beauty: makeInfo('Cfg_GradeSkill_Beauty', 'Part>Level'),
    /** 进阶系统军师表 */
    Cfg_Grade_Adviser: makeInfo('Cfg_Grade_Adviser', 'Level>Star'),
    /** 进阶系统军师技能表 */
    Cfg_GradeSkill_Adviser: makeInfo('Cfg_GradeSkill_Adviser', 'Part>Level'),
    /** 进阶豪礼表 */
    Cfg_Grade_JJHL: makeInfo('Cfg_GradeJJHL', 'FuncId>'),
    /** 进阶奖励表 */
    Cfg_GradePrize: makeInfo('Cfg_GradePrize', 'FuncId>'),
    /** 进阶消耗道具表 */
    Cfg_GradeItem: makeInfo('Cfg_GradeItem', 'FuncId'),
    /** 进阶系统装备强化表 */
    Cfg_GradeStrength: makeInfo('Cfg_GradeStrength', 'Pos>'),
    /** 进阶系统装备宝石镶嵌部位表 */
    Cfg_EquipGemPos: makeInfo('Cfg_EquipGemPos', 'EquipPos'),
    /** 进阶系统装备宝石道具表 */
    Cfg_EquipGemItem: makeInfo('Cfg_EquipGemItem', 'Type>Level'),
    /** 进阶系统装备宝石类型表 */
    Cfg_EquipGemType: makeInfo('Cfg_EquipGemType', 'Type'),
    /** 进阶系统装备宝石常量 */
    Cfg_EquipGem_Config: makeInfo('Cfg_EquipGem_Config', 'CfgKey'),

    /** 进阶系统通灵表 */
    Cfg_GradeTL: makeInfo('Cfg_GradeTL', 'Key'),
    /** 进阶系统注灵表 */
    Cfg_GradeZL: makeInfo('Cfg_GradeZL', 'Level'),
    /** 进阶系统淬炼表 */
    Cfg_GradeForge: makeInfo('Cfg_GradeForge', 'Level'),
    /** 装备表 */
    Cfg_Item_Equip: makeInfo('Cfg_Item_Equip', 'Id'),
    /** 主城地图背景节日表 */
    Cfg_MainCity_Date: makeInfo('Cfg_MainCity_Date', 'Key'),
    /** 主城地图背景表 */
    Cfg_MainCity: makeInfo('Cfg_MainCity', 'Id'),
    /** 主城地图NPC */
    Cfg_MainCity_Npc: makeInfo('Cfg_MainCity_Npc', 'Id'),
    /** 主城地图建筑按钮 */
    Cfg_MainCity_Build: makeInfo('Cfg_MainCity_Build', 'Id'),
    /** 时装配置表 */
    Cfg_RoleSkinConfig: makeInfo('Cfg_RoleSkinConfig', 'CfgKey'),
    /** 时装皮肤表 */
    Cfg_RoleSkin: makeInfo('Cfg_RoleSkin', 'Id', 'ConfigRoleSkinIndexer'),
    /** 时装升星表 */
    Cfg_RoleSkinStar: makeInfo('Cfg_RoleSkinStar', 'Key', undefined, { intervalKey: 'MaxLevel' }),
    /** 皮肤套装表 */
    Cfg_SkinSuit: makeInfo('Cfg_SkinSuit', 'Id'),
    /** 时装相关道具表 方便和进阶整和用funcid */
    Cfg_RoleSkinItem: makeInfo('Cfg_RoleSkinItem', 'FuncId'),
    /** 时装注灵表 */
    Cfg_RoleSkinZL: makeInfo('Cfg_RoleSkinZL', 'Level'),
    /** 角色技能表 */
    Cfg_RoleSkill: makeInfo('Cfg_RoleSkill', 'SkillId'),
    /** 技能表 */
    Cfg_Skill: makeInfo('Cfg_Skill', 'SkillId'),
    /** 技能描述表 */
    Cfg_SkillDesc: makeInfo('Cfg_SkillDesc', 'SkillId>', undefined, { intervalKey: 'SkillMaxLevel', types: ['SkillId'] }),
    /** 技能数据表 */
    Cfg_SkillData: makeInfo('Cfg_SkillData', 'Id'),
    /** 技能行为表 */
    Cfg_SkillActions: makeInfo('Cfg_SkillActions', 'ID'),
    /** 技能特效 */
    Cfg_SkillEffect: makeInfo('Cfg_SkillEffect', 'EffId'),
    /** 飘字特效表 */
    Cfg_WordEffect: makeInfo('Cfg_WordEffect', 'EffId>CType'),
    /** buff前端状态表 */
    Cfg_BuffClint: makeInfo('Cfg_BuffClint', 'EffId'),
    /** buff技能表 */
    Cfg_Buff: makeInfo('Cfg_Buff', 'BuffId'),
    /** 攻击效果表 */
    Cfg_AtkEffect: makeInfo('Cfg_AtkEffect', 'EffId'),
    /** 战斗场景表 */
    Cfg_FightScene: makeInfo('Cfg_FightScene', 'FBType'),
    /** 战斗位置 */
    Cfg_FightPos: makeInfo('Cfg_FightPos', 'Id>Pos'),
    /** 战斗站位坐标配置 */
    Cfg_FightPosition: makeInfo('Cfg_FightPosition', 'Priority>id'),
    /** 战斗喊话 */
    // Cfg_FightScenes: makeInfo('Cfg_FightScenes', 'TalkId>'),
    /** 战斗常量表 */
    Cfg_FightNormal: makeInfo('Cfg_FightNormal', 'FightKey'),
    /** 竞技场排名奖励表 */
    Cfg_ArenaRewards: makeInfo('Cfg_ArenaRewards', 'RankId'),
    /** 竞技场常量 */
    Cfg_Config_Arena: makeInfo('Cfg_Config_Arena', 'CfgKey'),
    /** 竞技场购买次数消耗 */
    Cfg_ArenaCoin: makeInfo('Cfg_ArenaCoin', 'Id'),
    /** 奖励掉落 */
    Cfg_DropReward: makeInfo('Cfg_DropReward', 'Id', 'ConfigDropRewardIndexer'),
    /** 个人竞技场历史最高排名奖励 */
    Cfg_ArenaCoinRewards: makeInfo('Cfg_ArenaCoinRewards', 'RankId'),
    /** 军衔等级表格 */
    Cfg_ArmyGrade: makeInfo('Cfg_ArmyGrade', 'ArmyLevel>ArmyStar'),
    /** 军衔技能 */
    Cfg_ArmySkill: makeInfo('Cfg_ArmySkill', 'Key'),
    /** 军衔名称 */
    Cfg_ArmyName: makeInfo('Cfg_ArmyName', 'Key'),
    /** 玩法说明表 */
    Cfg_ClientMsg: makeInfo('Cfg_ClientMsg', 'Id'),
    /** 后端错误提示表 */
    Cfg_Err: makeInfo('Cfg_Err', 'Id'),
    /** 材料副本 */
    Cfg_FB_Material: makeInfo('Cfg_FB_Material', 'Id'),
    /** 材料副本次数购买消耗 */
    Cfg_MaterialCoin: makeInfo('Cfg_MaterialCoin', 'Id'),
    /** vip 功能描述 */
    Cfg_VIP_Desc: makeInfo('Cfg_VIP_Desc', 'ID'),
    /** 通用商城表 */
    Cfg_ShopCity: makeInfo('Cfg_ShopCity', 'GoodsID', 'ConfigShopIndexer'),
    /** 世界BOSS- 鼓舞 */
    Cfg_WorldBoss_Inspire: makeInfo('Cfg_WorldBoss_Inspire', 'Times'),
    /** 世界BOSS- 排名 */
    Cfg_WorldBoss_Rank: makeInfo('Cfg_WorldBoss_Rank', 'KEY'),
    /** 世界BOSS- 功能项 */
    // Cfg_WorldBoss_Config: makeInfo('Cfg_WorldBoss_Config', 'CfgKey'),
    /** 世界BOSS- BOSS信息 */
    Cfg_WorldBoss: makeInfo('Cfg_WorldBoss', 'Id'),
    /** 定时活动表 */
    Cfg_Active: makeInfo('Cfg_Active', 'ActId'),
    /** 商城常量 */
    Cfg_SecretMallCfg: makeInfo('Cfg_SecretMallCfg', 'CfgKey'),
    /** 商城类别配置表 */
    Cfg_ShopCityType: makeInfo('Cfg_ShopCityType', 'MallTypeID'),
    /** 神秘商城商品配置表 */
    Cfg_SecretMall: makeInfo('Cfg_SecretMall', 'Id'),
    /** 限制条件表 */
    Cfg_LimitCondition: makeInfo('Cfg_LimitCondition', 'ConditionId', 'ConfigLimitConditionIndexer'),
    /** 刷新次数表 */
    Cfg_CycleTimes: makeInfo('Cfg_CycleTimes', 'LimitId', 'ConfigCycleTimesIndexer'),
    /** 主角模型表 */
    Cfg_Mod: makeInfo('Cfg_Mod', 'ID', 'ConfigModIndexer'),
    /** 挂机表 */
    Cfg_Config_AFK: makeInfo('Cfg_Config_AFK', 'CfgKey'),
    /** 军衔任务 */
    Cfg_ArmyTask: makeInfo('Cfg_ArmyTask', 'Id'),
    /** 主线任务 */
    Cfg_LinkTask: makeInfo('Cfg_LinkTask', 'Id'),
    /** 官职任务表 */
    Cfg_OfficialTask: makeInfo('Cfg_OfficialTask', 'Id'),
    /** 博物志-见闻任务 */
    Cfg_CollectionBookTask: makeInfo('Cfg_CollectionBookTask', 'Id'),
    /** 任务类型表 */
    Cfg_TaskType: makeInfo('Cfg_TaskType', 'CountType'),
    /** 地图通关任务 */
    Cfg_MapTask: makeInfo('Cfg_MapTask', 'MapId'),
    // Cfg_Config_AFK: makeInfo('Cfg_SecretMall', 'CfgKey'),
    /** 关卡章节名称信息 */
    Cfg_StageName: makeInfo('Cfg_StageName', 'Chapter'),
    /** 关卡迷雾 */
    Cfg_StageArea: makeInfo('Cfg_StageArea', 'AreaId'),
    /** 怪物属性表 */
    Cfg_Attr_Monster: makeInfo('Cfg_Attr_Monster', 'Id>Level'),
    /** 关卡通行证ID */
    Cfg_Stage_PassName: makeInfo('Cfg_Stage_PassName', 'PassId'),
    /** 关卡通行证等级 */
    Cfg_Stage_PassLevel: makeInfo('Cfg_Stage_PassLevel', 'PassId>', 'ConfigPassLevelIndexer'),
    /** 喊话表 */
    Cfg_TalkWord: makeInfo('Cfg_TalkWord', 'TalkId>'),
    /** 前端任务引导按钮 */
    Cfg_TaskGuide: makeInfo('Cfg_TaskGuide', 'Key'),
    /** 官职表 */
    Cfg_Official: makeInfo('Cfg_Official', 'Id'),
    /** 虎符官印升级表 */
    Cfg_SAGrade: makeInfo('Cfg_SAGrade', 'Id', 'ConfigSAGradeIndexer'),
    /** 虎符官印升星表 */
    Cfg_SAStar: makeInfo('Cfg_SAStar', 'Id', 'ConfigSAStarIndexer'),
    /** 虎符官印淬炼表 */
    Cfg_SAQuality: makeInfo('Cfg_SAQuality', 'Id', 'ConfigSAQualityIndexer'),
    /** 官职常量表 */
    Cfg_OfficialConstant: makeInfo('Cfg_OfficialConstant', 'CfgKey'),
    /** 常驻排行榜常量表 */
    Cfg_NormalRankConfig: makeInfo('Cfg_NormalRank_Config', 'CfgKey'),
    /** 常驻排行榜 */
    Cfg_NormalRank: makeInfo('Cfg_NormalRank', 'Key'),
    /** 排行榜类型表 */
    Cfg_NormalRankType: makeInfo('Cfg_NormalRankType', 'Key'),
    /** 红颜表 */
    Cfg_Beauty: makeInfo('Cfg_Beauty', 'PetAId', 'ConfigBeautyIndexer'),
    /** 红颜升星表 */
    Cfg_BeautyStar: makeInfo('Cfg_BeautyStar', 'BeautyId>Star'),
    /** 红颜升级表 */
    Cfg_BeautyLevel: makeInfo('Cfg_BeautyLevel', 'Level'),
    /** 组队副本表 */
    Cfg_TeamBoss: makeInfo('Cfg_TeamBoss', 'Id', 'ConfigTeamBossIndexer'),
    /** 组队等级副本表 */
    Cfg_TeamBoss_Level: makeInfo('Cfg_TeamBoss_Level', 'Id', 'ConfigTeamBossIndexer'),
    /** 组队副本怪物表 */
    Cfg_TeamBoss_Monster: makeInfo('Cfg_TeamBoss_Monster', 'InstanceType>', 'ConfigTeamBossIndexer'),
    /** 组队副本常量表 */
    Cfg_FB_Config: makeInfo('Cfg_FB_Config', 'Key'),
    /** 世界BOSS- 烽火连城 */
    Cfg_BeaconWar: makeInfo('Cfg_BeaconWar', 'CityID', 'ConfigBeaconWarIndexer'),
    // Cfg_BeaconWar: makeInfo('Cfg_BeaconWar', 'CityID'),
    /** 页签图片表 */
    Cfg_TabPicture: makeInfo('Cfg_TabPicture', 'Id', 'ConfigTabPictureIndexer'),
    /** 头像头像框 */
    Cfg_Photo: makeInfo('Cfg_Photo', 'Id', 'ConfigPhotoIndexer'),
    Cfg_PhotoStar: makeInfo('Cfg_PhotoStar', 'Key', 'ConfigPhotoIndexer', { intervalKey: 'MaxLevel', types: ['FuncId'] }),
    /** 新手剧情 */
    Cfg_NewPlot: makeInfo('Cfg_NewPlot', 'PlotID'),
    /** 新手剧情组 */
    Cfg_NewPlot_Group: makeInfo('Cfg_NewPlot_Group', 'PlotType>Level'),
    /** 博物志 */
    Cfg_CollectionBook: makeInfo('Cfg_CollectionBook', 'Id', 'ConfigCollectionBookIndexer'),
    /** 博物志-升星表 */
    Cfg_CollectionBookStar: makeInfo('Cfg_CollectionBookStar', 'Class>', undefined, { intervalKey: 'MaxLevel' }),
    /** 博物志-见闻等级表 */
    Cfg_CollectionBookLevel: makeInfo('Cfg_CollectionBookLevel', 'Level'),
    /** 博物志-常量表 */
    Cfg_CollectionBookConfig: makeInfo('Cfg_CollectionBookConfig, Key'),
    /** 博物志 */
    Cfg_CollectionBookType: makeInfo('Cfg_CollectionBookType', 'ID', 'ConfigCollectionBookIndexer'),
    /** *-----------世家系统----------- */
    /** 世家系统-常量表 */
    Cfg_FamilyNormal: makeInfo('Cfg_FamilyNormal', 'CfgKey'),
    /** 世家系统 - 奖励表 */
    Cfg_TaskReward: makeInfo('Cfg_TaskReward', 'Id'),
    /** 世家系统-等级经验 */
    Cfg_Family: makeInfo('Cfg_Family', 'Level'),
    /** 世家系统-事务 */
    Cfg_TaskName: makeInfo('Cfg_TaskName', 'Id'),
    /** 世家系统-事务等级 */
    Cfg_FNTask: makeInfo('Cfg_FNTask', 'Level'),
    /** 世家系统-派遣条件 */
    Cfg_TaskCondition: makeInfo('Cfg_TaskCondition', 'Id'),
    /** 世家系统-缘分条件 */
    Cfg_TaskFateCondition: makeInfo('Cfg_TaskFateCondition', 'Id'),
    /** 世家职位奖励表 */
    Cfg_FamilyPos: makeInfo('Cfg_FamilyPos', 'Id'),
    /** 世家族长争霸-buff表 */
    Cfg_FNPatrBuff: makeInfo('Cfg_FNPatrBuff', 'Type>'),
    /** 世家-校场升级表 */
    Cfg_DrillGroundLevel: makeInfo('Cfg_DrillGroundLevel', 'DrillGroundId>'),
    /** 世家-校场表 */
    Cfg_DrillGround: makeInfo('Cfg_DrillGround', 'Id'),
    /** 世家-校场表 */
    Cfg_DrillGroundLimit: makeInfo('Cfg_DrillGroundLimit', 'Level'),
    /** 世家-校场升级消耗 */
    Cfg_DrillGroundCost: makeInfo('Cfg_DrillGroundCost', 'CostId>'),
    /** 世家-校场共鸣 */
    Cfg_DrillGroundMaster: makeInfo('Cfg_DrillGroundMaster', 'MasterLevel'),
    /** 世家-图腾表 */
    Cfg_Totem: makeInfo('Cfg_Totem', 'Id'),
    /** 世家-图腾等级表 */
    Cfg_TotemLevel: makeInfo('Cfg_TotemLevel', 'Level'),

    /** 世家-试炼副本 */
    Cfg_TrialCopyMonster: makeInfo('Cfg_TrialCopyMonster', 'ID'),
    /** 世家-试炼副本-排行奖励 */
    Cfg_TrialCopyRank: makeInfo('Cfg_TrialCopyRank', 'RankId'),

    /** 华服升星表 */
    Cfg_SpecialSuitUp: makeInfo('Cfg_SpecialSuitUp', 'Level'),
    /** 角色武艺表 */
    Cfg_RoleMartial: makeInfo('Cfg_RoleMartial', 'Id'),
    /** 武艺点位表 */
    Cfg_RoleMartialPoint: makeInfo('Cfg_RoleMartialPoint', 'Id>'),
    /** 角色武艺升级表 */
    Cfg_RoleMartialLevel: makeInfo('Cfg_RoleMartialLevel', 'Id>', undefined, { intervalKey: 'Max', types: ['Id'] }),
    /** 排位赛段位表 */
    Cfg_RankMatchPos: makeInfo('Cfg_RankMatchPos', 'Id', undefined, { intervalKey: 'GoalMax' }),
    /** 排位赛排行奖励 */
    Cfg_RankMatchReward: makeInfo('Cfg_RankMatchReward', 'RankId', undefined, { intervalKey: 'RankMax' }),
    /** 排位赛胜场奖励 */
    Cfg_RankMatchWinReward: makeInfo('Cfg_RankMatchWinReward', 'Id', undefined, { intervalKey: 'WinNum' }),
    /** 排位赛次数收费 */
    Cfg_RankMatchCoin: makeInfo('Cfg_RankMatchCoin', 'Id'),
    /** 排位赛常量表 */
    Cfg_RankMatchNormal: makeInfo('Cfg_RankMatchNormal', 'CfgKey'),
    /** 押送粮草常量 */
    Cfg_EscortNormal: makeInfo('Cfg_EscortNormal', 'CfgKey'),
    /** 押送粮草 */
    Cfg_Escort: makeInfo('Cfg_Escort', 'Id'),
    /** 押送粮草奖励 */
    Cfg_EscortReward: makeInfo('Cfg_EscortReward', 'Id', 'ConfigEscortRewardIndexer'),

    // ---------------------------------西域行商---------------------------------------

    Cfg_SilkRoad: makeInfo('Cfg_SilkRoad', 'Id'),
    Cfg_SilkRoadNormal: makeInfo('Cfg_SilkRoadNormal', 'CfgKey'),
    Cfg_SilkRoadTown: makeInfo('Cfg_SilkRoadTown', 'Id'),
    Cfg_SilkRoadEvent: makeInfo('Cfg_SilkRoadEvent', 'Id'),
    Cfg_SilkRoadReward: makeInfo('Cfg_SilkRoadReward', 'Id>', undefined, { intervalKey: 'LevelMax', types: ['SilkRoadId'] }),

    // ---------------------------------活动类的配置表---------------------------------------
    /** 每日签到基础表 */
    Cfg_Server_DailySignConst: makeInfo('Cfg_Server_DailySignConst', 'CfgKey'),
    /** 每日签到奖励 */
    Cfg_Server_DailySignNumReward: makeInfo('Cfg_Server_DailySignNumReward', 'StartTurn'),
    /** 签到累计奖励 */
    Cfg_Server_DailySignReward: makeInfo('Cfg_Server_DailySignReward', 'StartTurn>'),
    /** 在线奖励 */
    Cfg_Server_OnlineRewards: makeInfo('Cfg_Server_OnlineRewards', 'Id>Group'),
    /** 阶段奖励（等级战力vip等） */
    Cfg_Server_StageRewards: makeInfo('Cfg_Server_StageRewards', 'Id', 'ConfigStageRewardsIndexer'),
    /** 阶段奖励的类型配置(前端直接读) */
    Cfg_StageRewardsUI: makeInfo('Cfg_StageRewardsUI', 'Id'),
    /** 活动奖励表 */
    Cfg_Server_EventReward: makeInfo('Cfg_Server_EventReward', 'Id', 'ConfigActEventRewardIndexer'),
    /** 武将招募 */
    Cfg_Server_ActZhaoMu: makeInfo('Cfg_Server_ActZhaoMu', 'ArgsGroup>'),
    Cfg_Server_GeneralZhaoMu: makeInfo('Cfg_Server_GeneralZhaoMu', 'ArgsGroup>'),
    Cfg_Server_ZhaoMuStageReward: makeInfo('Cfg_Server_ZhaoMuStageReward', 'ArgsGroup>'),
    Cfg_Server_ZhaoMuConfig: makeInfo('Cfg_Server_ZhaoMuConfig', 'CfgKey'),
    /** 摇钱树 */
    Cfg_Server_CashCow: makeInfo('Cfg_Server_CashCow', 'Level'),
    /** 摇钱树常量 */
    Cfg_Server_CashCowNormal: makeInfo('Cfg_Server_CashCowNormal', 'CfgKey'),
    /** 摇钱树资源配置表 */
    Cfg_Server_CashCowEffect: makeInfo('Cfg_Server_CashCowEffect', 'Id', undefined, { intervalKey: 'Levelmax' }),

    /** 日常周常任务 */
    Cfg_DailyTasks: makeInfo('Cfg_DailyTasks', 'TaskType>Id'),
    /** 日常任务阶段奖励 */
    Cfg_StageReward: makeInfo('Cfg_StageReward', 'Type>Id'),
    /** 资源找回 */
    Cfg_Resource: makeInfo('Cfg_Resource', 'Type>Id'),
    /** 日常任务常量表 */
    Cfg_Daily_Config: makeInfo('Cfg_Daily_Config', 'Key'),

    /** 三国探险 */
    Cfg_FB_Explore: makeInfo('Cfg_FB_Explore', 'ExploreType'),
    /** 三国探险-宝石秘矿 */
    Cfg_FB_ExploreGem: makeInfo('Cfg_FB_ExploreGem', 'ExploreType>Level>Part>', undefined, { intervalKey: 'Id' }),
    /** 三国探险-宝石秘矿阶段奖励 */
    Cfg_FB_ExploreGemStage: makeInfo('Cfg_FB_ExploreGemStage', 'Level>'),
    /** 战力等级通行证 */
    Cfg_Server_GeneralPass: makeInfo('Cfg_Server_GeneralPass', 'PassId', 'ConfigGeneralPassIndexer'),
    Cfg_Server_GeneralPassRd: makeInfo('Cfg_Server_GeneralPassRd', 'Id', 'ConfigGeneralPassIndexer'),
    /** 全民福利 */
    Cfg_Server_Welfare: makeInfo('Cfg_Server_Welfare', 'Id', 'ConfigGeneralPassIndexer'),

    // ---------------------------------游历天下---------------------------------------

    Cfg_AdventureQuestion: makeInfo('Cfg_AdventureQuestion', 'Id'),

    Cfg_AdventureNormal: makeInfo('Cfg_AdventureNormal', 'CfgKey'),

    Cfg_AdventureShop: makeInfo('Cfg_AdventureShop', 'Id'),

    Cfg_AdventureEvent: makeInfo('Cfg_AdventureEvent', 'Id'),

    Cfg_AdventureBg: makeInfo('Cfg_AdventureBg', 'Id'),

    // ---------------------------------游历天下---------------------------------------

    /** 世界buff */
    Cfg_WorldSkill: makeInfo('Cfg_WorldSkill', 'ID'),
    /** 加成技能总表 */
    Cfg_IncreaseSkill: makeInfo('Cfg_IncreaseSkill', 'SkillId'),
    /** 世界等级常量配置 */
    Cfg_WorldNormal: makeInfo('Cfg_WorldNormal', 'CfgKey'),
    /** 限制条件名称表 */
    Cfg_LCDesc: makeInfo('Cfg_LCDesc', 'Condition_func'),

    // ---------------------------------军师---------------------------------------
    /** 军师升级表 */
    Cfg_AdviserLevel: makeInfo('Cfg_AdviserLevel', 'Level'),
    /** 军师神变 */
    Cfg_Adviser_Warrior: makeInfo('Cfg_Adviser_Warrior', 'SkinId'),
    /** 军师神变皮肤配置 */
    Cfg_Adviser_Skin: makeInfo('Cfg_Adviser_Skin', 'SkinId'),
    /** 军师专精表 */
    Cfg_AdviserMastery: makeInfo('Cfg_AdviserMastery', 'Id'),
    /** 军师专精升级消耗表 */
    Cfg_AdviserMasteryCost: makeInfo('Cfg_AdviserMasteryCost', 'MasteryType>Level'),
    /** 军师配置表 */
    Cfg_Adviser_Cfg: makeInfo('Cfg_Adviser_Cfg', 'CfgKey'),
    /** 军师本体 */
    Cfg_AdviserBody: makeInfo('Cfg_AdviserBody', 'Id'),
    // ---------------------------------军师---------------------------------------

    // ---------------------------------炼体---------------------------------------
    // 炼体属性表
    Cfg_ExerciseAttr: makeInfo('Cfg_ExerciseAttr', 'Type>'),
    Cfg_ExerciseLv: makeInfo('Cfg_ExerciseLv', 'Type>'),
    /** 华容道常量表 */
    Cfg_HuarongdaoNormal: makeInfo('Cfg_HuarongdaoNormal', 'CfgKey'),
    /** 华容道地图 */
    Cfg_HuarongdaoMap: makeInfo('Cfg_HuarongdaoMap', 'Id'),
    /** 华容道事件 */
    Cfg_HuarongdaoChat: makeInfo('Cfg_HuarongdaoChat', 'ID'),
    /** 华容道气泡 */
    Cfg_HuarongdaoBubble: makeInfo('Cfg_HuarongdaoBubble', 'ID'),
    /** 华容道武将 */
    Cfg_HuarongdaoGen: makeInfo('Cfg_HuarongdaoGen', 'ID'),

};
