/*
 * @Author: kexd
 * @Date: 2022-08-16 14:19:51
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\general\plan\PlanConst.ts
 * @Description: 武将-布阵
 */
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { FuncId } from '../../../const/FuncConst';
import { EntityUnitType } from '../../../entity/EntityConst';

export enum PlanState {
    /** 没有按钮 */
    None = 0,
    /** 显示出战按钮(未出战) */
    UpFight = 1,
    /** 显示下阵按钮（已出战,且选中自己） */
    DownFight = 2,
    /** 显示替换按钮（已出战，选中其它武将） */
    Replace = 3,
}

export interface IPlanMsg {
    /** 类型：武将、仙童等 */
    planType?: EntityUnitType,
    /** 位置 */
    pos?: number,
    /** 该位置已上阵的唯一id */
    onlyId?: string,
    /** 当前选中的唯一id */
    selectId?: string,
    /** 当前显示的类型（武将、红颜、军师) */
    selectFuncId: FuncId,
    /** 是否锁定 */
    isLock?: boolean,
    /** 锁定的提示语 */
    lockStr?: string,
    /** 标题字 */
    title?: string,
    /** 战力 */
    fv?: number,
    /** 选中的战力 */
    selectFv?: number,
    /** 按钮红点 */
    btnRed?: boolean,
    /** 动画资源id */
    resId?: number | string,
    /** 动画类型 */
    resType?: ANIM_TYPE,
}

/** 武将布阵页签 */
export enum PlanPageType {
    /** 布阵界面 */
    Plan = 0,
    /** 组队阵容 */
    TeamPlan = 1,
}
