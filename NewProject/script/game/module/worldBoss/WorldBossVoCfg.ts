/*
 * @Author: dcj
 * @Date: 2022-08-25 18:51:47
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\worldBoss\WorldBossVoCfg.ts
 * @Description:
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { WinSmallType } from '../../com/win/WinSmall';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.WorldBossPage,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WorldBossPage,
    mid: ControllerIds.WorldBossController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WorldBossPage') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.WorldBossInspireWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BagController,
    childPath: UI_PATH_ENUM.WorldBossInspireWin,
    childView: 'WorldBossInspireWin',
    title: i18n.tt(Lang.boss_inspireWin),
    size: cc.size(650, 430),
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.WorldBossGrabWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.WorldBossController,
    childPath: UI_PATH_ENUM.WorldBossGrabWin,
    childView: 'WorldBossGrabWin',
    title: i18n.tt(Lang.world_boss_grab),
    size: cc.size(650, 864),
    isShowAll: false,
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.WorldBossRewardPreview,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.WorldBossController,
    childPath: UI_PATH_ENUM.WorldBossRewardPreview,
    childView: 'WbRewardPreviewWin',
    title: i18n.tt(Lang.boss_reward_preview),
    size: cc.size(650, 864),
    winSmallType: WinSmallType.TypeC,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});
