/** import {' cc.Node, cc.size } 'from 'cc';  // */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import WinBase from '../../com/win/WinBase';
import { WinSmallType } from '../../com/win/WinSmall';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

/*
 * @Author: zs
 * @Date: 2022-07-12 16:40:05
 * @FilePath: \SanGuo2.4-zengsi\assets\script\game\module\roleskin\RoleSkinVoCfg.ts
 * @Description:
 *
 */
WinMgr.I.addConfig({
    id: ViewConst.RoleSkinWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleSkinWin,
    mid: ControllerIds.RoleSkinController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleSkinWin') as BaseUiView,
});
WinMgr.I.addConfig({
    id: ViewConst.RoleSkinPage,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleSkinPage,
    mid: ControllerIds.RoleSkinController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleSkinPage') as BaseUiView,
});
WinMgr.I.addConfig({
    id: ViewConst.RoleSkinSuitPage,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleSkinSuitPage,
    mid: ControllerIds.RoleSkinController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleSkinSuitPage') as BaseUiView,
});
WinMgr.I.addConfig({
    id: ViewConst.RoleActivitySuitPage,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleActivitySuitPage,
    mid: ControllerIds.RoleSkinController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleActivitySuitPage') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.RoleSuitPartWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BagController,
    childPath: UI_PATH_ENUM.RoleSuitPartWin,
    childView: 'RoleSuitPartWin',
    title: i18n.tt(Lang.roleskin_suit_win_title),
    size: cc.size(650, 960),
    isShowAll: false,
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.RoleSpecialSuitWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleSpecialSuitWin,
    mid: ControllerIds.RoleSpecialSuitController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleSpecialSuitWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.RoleSpecialCollectWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.RoleSpecialCollectWin,
    mid: ControllerIds.RoleSpecialSuitController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleSpecialCollectWin') as BaseUiView,
});
