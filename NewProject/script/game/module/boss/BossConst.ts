/*
 * @Author: kexd
 * @Date: 2022-06-22 18:42:39
 * @FilePath: \SanGuo2.4\assets\script\game\module\boss\BossConst.ts
 * @Description:
 */
import { IWinTabData } from '../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../i18n/i18n';
import { GuideBtnIds } from '../../com/guide/GuideConst';
import { TabData } from '../../com/tab/TabData';
import { FuncId } from '../../const/FuncConst';
import { FuncDescConst } from '../../const/FuncDescConst';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { RID } from '../reddot/RedDotConst';

/** 首领页签 */
export enum BossPageType {
    /** 本服首领 */
    Local = 0,
    /** 跨服首领 */
    Cross = 1,
    /** 新增待添加 */

}
/** Boss状态 */
export enum MultiBossState {
    //  0:初始
    Begin = 0,
    // 1:挑战中
    Fighting = 1,
    // 2:复活中
    relive = 2,
}

/** 本服首领下的页签 */
export enum LocalBossPageType {
    /** 个人首领 */
    Personal = 0,
    /** 至尊首领 */
    Vip = 1,
    /** 多人boos */
    MultiBoss = 2,
    /** 有新页签往下添加 */
}

/** 本服首领的二级页签 */
export const BossPageTabs: TabData[] = [
    {
        id: LocalBossPageType.Personal,
        title: i18n.tt(Lang.boss_tab_0),
        redId: RID.Boss.LocalBoss.Personal,
        funcId: FuncId.BossPersonal,
    },
    {
        id: LocalBossPageType.Vip,
        title: i18n.tt(Lang.boss_tab_1),
        redId: RID.Boss.LocalBoss.Vip,
        funcId: FuncId.BossVip,
        guideId: GuideBtnIds.LeaderSupreme,
    },
    {
        id: LocalBossPageType.MultiBoss,
        title: i18n.tt(Lang.boss_tab_2),
        funcId: FuncId.MulitBoss,
        // guideId: GuideBtnIds.LeaderSupreme,
        redId: RID.Boss.LocalBoss.MultiBoss,
        // funcId: FuncId.MulitBoss,
        // guideId: GuideBtnIds.LeaderSupreme,
    },
    /** 有新页签往下添加 */
];

export enum WorldBossPageType {
    /** 名将来袭 */
    MJBoss = 0,
    /** 烽火连城 */
    BeaconWar,
}

/** 页签类别 */
export const WorldBossPageTabs: TabData[] = [
    {
        id: WorldBossPageType.MJBoss,
        uiPath: UI_PATH_ENUM.WorldBossMJPage,
        title: i18n.tt(Lang.cross_title1),
        redId: RID.Boss.CrossBoss.WorldBoss,
        funcId: FuncId.WorldBoss,
        descId: FuncDescConst.WorldBoss,
    },
    {
        id: WorldBossPageType.BeaconWar,
        uiPath: UI_PATH_ENUM.BeaconWarPage,
        title: i18n.tt(Lang.cross_title2),
        redId: RID.Boss.CrossBoss.BeaconWar.Id,
        funcId: FuncId.BeaconWar,
        descId: FuncDescConst.BeaconWar,
    },
];

/** 首领一级页签 */
export const bossTabDataArr: IWinTabData[] = [
    {
        TabId: BossPageType.Local,
        className: 'BossPage',
        prefabPath: UI_PATH_ENUM.BossPage,
        redId: RID.Boss.LocalBoss.Id,
        funcId: FuncId.BossLocal,
    },
    {
        TabId: BossPageType.Cross,
        className: 'WorldBossPage',
        prefabPath: UI_PATH_ENUM.WorldBossPage,
        redId: RID.Boss.CrossBoss.Id,
        funcId: FuncId.WorldBoss,
    },
];
