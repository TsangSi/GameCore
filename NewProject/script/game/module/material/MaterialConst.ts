/*
 * @Author: myl
 * @Date: 2022-08-03 20:31:20
 * @Description:
 */

import { i18n, Lang } from '../../../i18n/i18n';
import { TabData } from '../../com/tab/TabData';
import { RID } from '../reddot/RedDotConst';

/** 材料副本页签id */
export enum MaterialTabId {
    /** 材料副本 */
    Material = 0,
    /** 组队副本 */
    Team = 1,
    /** 三国探险 */
    FBExplore = 2,
}

export enum MaterialFBType {
    Horse,
    Weapon,
    Wing,
    Lingqi,
}

export enum MaterialPageTabItemType {
    /** 材料副本 */
    Material = 0,
    /** 仙术 */
    Theurgy
}
/** 页签类别 */
export const MaterialPageTabs: TabData[] = [
    {
        id: MaterialPageTabItemType.Material,
        title: i18n.tt(Lang.material_title),
        redId: RID.MaterialFB.Material.MaterialView,
    },
    {
        id: MaterialPageTabItemType.Theurgy,
        title: i18n.tt(Lang.material_title2),
        // redId: RedDotType.Boss.LocalBoss.Personal,
    },
    /** 有新页签往下添加 */
];

/** 材料副本相应副本开启条件 */
export enum MaterialUnlockConditionType {
    /** 军衔 */
    Army = 1,
    /** 关卡 */
    Level = 2,
    /** 开服天数 */
    ServerDays = 3
}
