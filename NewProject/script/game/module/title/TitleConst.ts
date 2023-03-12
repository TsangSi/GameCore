/*
 * @Author: kexd
 * @Date: 2022-06-14 16:11:10
 * @Description: 称号常量
 */
import { TabData } from '../../com/tab/TabData';
import { RID } from '../reddot/RedDotConst';
import { i18n, Lang } from '../../../i18n/i18n';

export enum TitlePageType {
    /** 称号 */
    Title = 0,
    /** 有新页签往下加 */
}

/** 邮件页签类别 */
export const TitlePageTabs: TabData[] = [
    {
        id: 0,
        title: i18n.tt(Lang.attr_title),
        redId: RID.Role.Role.Title,
    },
];

export interface ITitleCfg {
    /** 称号id */
    Id: number,
    /** 是否选中 */
    // IsSelected?:boolean,
    /** TitleState 状态  */
    State: TitleState,
    /** 是否已激活（影响是否置灰） */
    IsActive: boolean,
    /** 是否已佩戴（有个佩戴的图标） */
    IsWeared: boolean,
}

export enum TitleState {
    /** 未激活并且不能激活 */
    UnActive = 0,
    /** 未激活并且可以激活 */
    CanActive = 1,
    /** 已激活但未穿戴 */
    Active = 2,
    /** 已激活已穿戴 */
    Wear = 3,
}

export interface ITitleStar {
    /** id */
    Id: number,
    /** 上一区间最大等级 */
    LastMax: number,
    /** 属性加成万分比 */
    AttrRatio?: number,
    /** 上一段等级总万分比 */
    LastTotal?: number,
}
