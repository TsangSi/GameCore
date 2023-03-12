/*
 * @Author: kexd
 * @Date: 2022-10-31 20:31:05
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\beaconWar\BeaconWarConst.ts
 * @Description:
 *
 */

// 烽火连城常量配置
export enum BeaconWarCfgKey {
    /** 鼓舞消耗 */
    BeaconWarInspireCost = 'BeaconWarInspireCost',
    /** 鼓舞增加时间 */
    BeaconWarAddSeconds = 'BeaconWarAddSeconds',
    /** 鼓舞增加攻击万分比 */
    BeaconWarAddAtt = 'BeaconWarAddAtt',
    /** 鼓舞攻击上限 */
    BeaconWarMaxAtt = 'BeaconWarMaxAtt',
    /** 鼓舞时间上限（秒） */
    BeaconWarTimeLimit = 'BeaconWarTimeLimit',
    /** 道具恢复体力数量 */
    BeaconWarStrengthReply = 'BeaconWarStrengthReply',
    /** 恢复体力道具信息 */
    BeaconWarStrengthCost = 'BeaconWarStrengthCost',
    /** 击杀首领扣除体力 */
    BeaconWarStrengthKill = 'BeaconWarStrengthKill',
    /** 治疗消耗的道具 */
    BeaconWarTreatCost = 'BeaconWarTreatCost'
}

export enum EBeaconState {
    /** 死亡 */
    Die = 0,
    /** 活 */
    Alive = 1
}

export enum ISTATE_BATTLE {
    /** 我没被打死 */
    BATTLE_DIE_NOT = 0,
    /** 我被打死 */
    BATTLE_DIE = 1
}
