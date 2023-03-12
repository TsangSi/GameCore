/*
 * @Author: hrd
 * @Date: 2022-06-21 14:35:31
 * @FilePath: \SanGuo2.4\assets\script\game\battle\WarConst.ts
 * @Description:
 *
 */

/**  */
export const zOrder: number = 200;

/** 行为类型 */
export enum ActionType {
    /** 技能行为 */
    Skill = 1,
    /** 攻击行为 */
    ATK = 2,
    /** Buff行为 */
    Buff = 3,
    /** 受击 */
    Hit = 4,
    /** 伤害(扣血、加血) */
    Damage = 5,
    /** 死亡 */
    Die = 6,
    /** 反击 */
    Revolt = 7,
}

/** 执行类型 */
export enum ExecuteType {
    /** 顺序串行 */
    Series = 1,
    /** 并行 */
    Parallel = 2,
}

/** 行为返回状态 */
export enum ActionReturn {
    /** 继续 */
    CONTINUE = 0,
    /** 下一个 */
    NEXT = 1,
    /** 中断结束 */
    BREAK = 2,
}

/** 攻击类型 */
export enum AtkType {
    Normall = 0,
    /** 近战 */
    Short = 1,
    /** 远程 */
    Long = 2,
    /** 中程 屏中间 */
    Centre = 3,
}

/** 站位枚举 */
export enum WarPos {
    /** 第二排坐标 */
    SecondB = 100,
    /** boss 站位 */
    BOSS_POS = 18,
    /** 玩家站位 */
    ROLE_POS = 3,
}

/** 伤害结算类型 */
export enum DamagResultType {
    /** 加血 */
    AddHp = 1,
    /** 减血 */
    SubHp = 2,

}

/** 战斗间隔时间 */
export enum AtkTimeKey {
    /** 战斗开始准备时间 毫秒 */
    WarReadyTime = 'WarReadyTime',
    /** * 攻击完成 近战在对方跟前停留时间 */
    AtkStayTime = 'AtkStayTime',
    /** * 近战打完后返回时间 */
    AtkOverMoveBackTime = 'AtkOverMoveBackTime',
    /** * 连续攻击 攻击一轮后的间隔 */
    AtkOverSleepTime = 'AtkOverSleepTime',
    /** 受击位移 时间 */
    AtkHitTime = 'AtkHitTime',
    /** 远程默认 受击间隔时间 */
    AtkHitTime1 = 'AtkHitTime1',
    /** 攻击结束等待 */
    AtkEndTime = 'AtkEndTime',
    /** 回合间隔时间 */
    TurnDeltaTime = 'TurnDeltaTime',
    /** 技能起手飘字时间 */
    SkillNameTime = 'SkillNameTime',
}

/** 特效类型 */
export enum EffectType {
    /** 定点特效 */
    FxedPoint = 1,
    /** 持续特效  */
    Duration = 2,
    /** 飞行特效 */
    FlyMove = 3,
}

/** 特效挂载点 */
export enum TargerPosType {
    /** 目标对象身上 */
    TargerBody = 0,
    /** 目标对象地面 */
    TargerFloor = 1,
    /** 屏幕中心 */
    SceneCentre = 2,
    /** 目标方阵中心 */
    CampCentre = 3,
    /** 目标对象上层 */
    TargerPos = 4,
}

/** 模型挂载点索引  Cfg_Mod */
export enum MountPointIndex {
    /** 脚 */
    foot = 0,
    /** 身体 */
    body = 1,
    /** 头 */
    head = 2,
}

/** buff挂载类型 */
export enum BuffTargerPosType {
    /** 目标对象头上 */
    head = 1,
    /** 目标对象身上 */
    body = 2,
    /** 目标对象脚下 */
    foot = 3,
    /** 目标对象地面 */
    ground = 4,
}

/** 战斗UI类型 */
export enum EFightUIType {
    /** 世界boss-PVE */
    WorldBoss_PVE = 6,
    /** 世界boss-PVP */
    WorldBoss_PVP = 7,
    /** 多人首领PVE */
    MutilBoss_PvP = 8,
}
/** 战斗阵营攻击信息 */
export interface IBattleCampAtkInfo {
    /** 阵营id */
    campId?: number;
    /** 我方攻击伤害 */
    campAtkDamage?: number;
}

/** 战斗开场 类型 */
export enum WarStartType {
    /** PVE boss来袭 */
    boss = 1,
    /** 虎符威慑 */
    amulet = 2,
    /** 组队副本 连续战报 */
    Continue = 3,
}

/** 战斗站位类型 */
export enum FightPosType {
    /** 常规站位 */
    Normall = 0,
    /** 组队 pve */
    TeamPVE = 1,
    /** 组队 pvp */
    TeamPVP = 2,
}

/** 战报类型 */
export enum ReportType {
    /** 常规战报 */
    Normall = 0,
    /** 连续战报 */
    Continue = 1
}

/** 飘字专属类型 */
export enum WordVType {
    /** 没有专属 默认 */
    Normall = 0,
    /** 出战单位类型 */
    Unit = 1
}
export interface IfloatWord {
    effKey: string,
    wordStr: string,
    targetNd: cc.Node,
    mTagPos: cc.Vec2,
    posNum: number
}
