/*
 * @Author: kexd
 * @Date: 2023-01-16 10:21:57
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\EscortConst.ts
 * @Description:
 *
 */

import { RoleInfo } from '../role/RoleInfo';

export enum EscortState {
    /** 未开始押镖-显示押镖按钮 */
    Start = 0,
    /** 押镖中-显示快速完成按钮 */
    Escorting = 1,
    /** 已完成-显示领取奖励按钮 */
    Finish = 2,
}

export interface ICarMsg {
    carData: CarData,
    cfgEscort: Cfg_Escort,
    info: RoleInfo,
    canRob?: ERobState,
    state?: EscortState,
}

/** 拦截的条件类型 */
export enum ERobState {
    /** 可拦截 */
    CanRob = 0,
    /** 没有拦截次数了 */
    NoRobNum = 1,
    /** 是自己 */
    IsSelf = 2,
    /** 已拦截过了 */
    HaveRob = 3,
    /** 该镖车被拦截次数到了 */
    OverTimes = 4,
}
