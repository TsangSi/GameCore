/*
 * @Author: hrd
 * @Date: 2022-05-12 17:15:23
 * @LastEditors: Please set LastEditors
 *
 */

import { ANIM_TYPE, ACTION_DIRECT, ACTION_TYPE } from '../base/anim/AnimCfg';

/** 实体动画挂件名 */
export enum EntityAnimName {
    ALL = 'all',

    BODY = 'body',
    WEAPON = 'weapon',
    HORSE = 'horse',
    HORSE_HEAD = 'horseHead',
    WING = 'wing',
    TITLE = 'title',
}

/** 角色动作名 跟动画编辑器匹配 */
export enum EntityAcionName {
    /** 待机 */
    stand = 'stand',
    /** 跑动 */
    run = 'run',
    /** 死亡 */
    die = 'die',
    /** 受几 */
    hit = 'hit',
    /** 默认攻击 */
    atk0 = 'atk0',
    /** 攻击1 */
    atk1 = 'atk1',
    /** 攻击2 */
    atk2 = 'atk2',
    /** 攻击3 */
    atk3 = 'atk3',
    /** 攻击4 */
    atk4 = 'atk4',
}

/** 皮肤资源id数据结构 */
export interface IEntitySkin {
    /** 出战的模型id */
    id?: number;
    /** 出战类型 */
    unitType?: EntityUnitType;
    /** 出战的位置 */
    pos?: number,
    /** 角色模型资源id */
    bodyResID?: number | string;
    /** 武器模型资源id */
    weaponResID?: number;
    /** 坐骑模型资源id */
    horseResID?: number;
    /** 翅膀模型资源id */
    wingResID?: number;
    /** 称号 */
    titleResID?: number;
    /** 称号缩放 */
    titleScale?: number;
}

export interface IEntityData {
    /** 是否是主玩家自己的时装 */
    isMainRole?: boolean,
    /** 动画/模型id */
    resId?: number | string,
    /** 动画/模型类型 */
    resType?: ANIM_TYPE,
    /** 动作方向 */
    resDir?: ACTION_DIRECT,
    /** 动作类型 */
    resAction?: ACTION_TYPE,

    /** 是否展示称号 */
    isShowTitle?: boolean,
    /** Y偏移 */
    offsetY?: number,
    /** 是否播放展示动作us，播完才展示正面站立模型 */
    isPlayUs?: boolean,
    /** 套装id */
    suitId?: number,
    /** 只显示单个动画 */
    singleAnim?: boolean,
}

/** 助战类型，取名最好是对应上FuncId的模块名，参考FuncId */
export enum EntityUnitType {
    /** 预留-玩家自定义 */
    Diy = -2,
    /** 没有 */
    None = -1,
    /** 怪物 */
    Monster = 0,
    /** 玩家 */
    Player = 1,
    /** 武将（不能改为其他数值，会对应着出战协议里的类型LineupUnit） */
    General = 2,
    /** 红颜 */
    Beauty = 3,
    /** 军师 */
    // Army = 3,
}

/** 出战位置 */
export enum EntityUnitPos {
    /** 红颜 */
    Beauty = 6
}

/** 攻击动作特殊帧 */
export enum AtkActionFrame {
    /** 死亡倒数第1帧 */
    Die = -1,
    /** 受击倒数第2帧 */
    Hit = -2
}

/** 怪物类型 */
export enum MonsterType {
    /** 普通怪 */
    Normall = 1,
    /** 精英怪 */
    Elite = 2,
    /** boss */
    Boss = 3,
}

export enum EntityChallengeState {
    /** 死亡（显示“复活中”） */
    Die = 0,
    /** 正常 */
    Normal = 1,

}

/** 寻路过程里的范围检测：距离目的地小于该值就认为已经到达 */
export const Distance = 10000; // 距离64.这里换算为64*64 改为100*100
