/*
 * @Author: kexd
 * @Date: 2022-10-31 20:22:05
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\beaconWar\BeaconWarVoCfg.ts
 * @Description: 烽火连城
 *
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import WinBase from '../../com/win/WinBase';
import { WinSmallType } from '../../com/win/WinSmall';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.BeaconWarPage,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.BeaconWarPage,
    mid: ControllerIds.BeaconWarController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('BeaconWarPage') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.BeaconWarInspireWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BeaconWarController,
    childPath: UI_PATH_ENUM.BeaconWarInspireWin,
    childView: 'BeaconWarInspireWin',
    title: i18n.tt(Lang.boss_inspireWin),
    size: cc.size(650, 453),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.BeaconWarRePreWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BeaconWarController,
    childPath: UI_PATH_ENUM.BeaconWarRePreWin,
    childView: 'BeaconWarRePreWin',
    title: i18n.tt(Lang.boss_reward_preview),
    size: cc.size(676, 601),
    winSmallType: WinSmallType.TypeC,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.BeaconWarQuickWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BeaconWarController,
    childPath: UI_PATH_ENUM.BeaconWarQuickWin,
    childView: 'BeaconWarQuickWin',
    title: i18n.tt(Lang.beaconWar_quick),
    size: cc.size(650, 403),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.BeaconWarTreatWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BeaconWarController,
    childPath: UI_PATH_ENUM.BeaconWarTreatWin,
    childView: 'BeaconWarTreatWin',
    title: i18n.tt(Lang.beaconWar_treat),
    size: cc.size(650, 453),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});
