/*
 * @Author: hwx
 * @Date: 2022-06-09 18:11:09
 * @FilePath: \SanGuo2.4\assets\script\game\module\bag\BagConst.ts
 * @Description: 背包常量
 */

import { i18n, Lang } from '../../../i18n/i18n';
import ItemModel from '../../com/item/ItemModel';
import { TabData } from '../../com/tab/TabData';
import { RES_ENUM } from '../../const/ResPath';
import { RID } from '../reddot/RedDotConst';

/** 背包物品变更类型枚举 */
export enum BagItemChangeType {
    /** 删除 */
    Del = -1,
    /** 新增 */
    New = 0,
    /** 数量增加 */
    Add = 1,
    /** 减少 */
    Reduce = 2,
}

/** 背包窗口TAB类型 */
export enum BagWinTabType {
    /** 背包 */
    BAG = 0,
    /** 邮件 */
    EMAIL = 1,
    /** 合成材料 */
    Material = 2,
}

/** 背包页TAB类型 */
export enum BagPageItemType {
    /** 装备 */
    EQUIP = 1,
    /** 道具 */
    GENERAL = 2,
    /** 宝石 */
    GEM = 3,
}

/** 背包页道具页签类别 */
export const BagPageItemTabs: TabData[] = [
    {
        id: BagPageItemType.EQUIP,
        title: i18n.tt(Lang.bag_item_tab_equip),
    },
    {
        id: BagPageItemType.GENERAL,
        title: i18n.tt(Lang.bag_item_tab_general),
        redId: RID.Bag.Item,
    },
    {
        id: BagPageItemType.GEM,
        title: i18n.tt(Lang.bag_item_tab_gem),
    },
];

/** 背包页装备类型 */
export enum BagPageEquipType {
    /** 角色套装 */
    ROLE = 1,
    /** 凶兽套装 */
    BEAST = 2,
    /** 合体装备 */
    FAIRY = 3,
    /** 幻灵套装 */
    GHOST = 4,
    /** 王者套装 */
    KING = 5,
}

/** 背包页装备页签列表 */
export const BagPageEquipTabs: TabData[] = [
    {
        id: BagPageEquipType.ROLE,
        title: i18n.tt(Lang.bag_equip_tab_role),
        icon: RES_ENUM.Bag_Icon_Beibaoi_Jszb,
    },
    // {
    //     id: BagPageEquipType.BEAST,
    //     title: i18n.tt(Lang.bag_equip_tab_beast),
    //     icon: RES_ENUM.Bag_Icon_Beibaoi_Jszb,
    // },
    // {
    //     id: BagPageEquipType.FAIRY,
    //     title: i18n.tt(Lang.bag_equip_tab_fairy),
    //     icon: RES_ENUM.Bag_Icon_Beibaoi_Jszb,
    // },
    // {
    //     id: BagPageEquipType.GHOST,
    //     title: i18n.tt(Lang.bag_equip_tab_ghost),
    //     icon: RES_ENUM.Bag_Icon_Beibaoi_Jszb,
    // },
    // {
    //     id: BagPageEquipType.KING,
    //     title: i18n.tt(Lang.bag_equip_tab_king),
    //     icon: RES_ENUM.Bag_Icon_Beibaoi_Jszb,
    // },
];

export type BagItemChangeInfo = { itemModel: ItemModel, status: number }
