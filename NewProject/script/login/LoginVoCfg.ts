/*
 * @Author: hrd
 * @Date: 2022-04-29 09:23:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-13 17:08:48
 * @FilePath: \SanGuo-2.4-main\assets\script\login\LoginVoCfg.ts
 * @Description:
 *
 */

import BaseUiView from '../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../app/core/mvc/WinConst';
import WinMgr from '../app/core/mvc/WinMgr';
import WinBase from '../game/com/win/WinBase';
import { WinSmallType } from '../game/com/win/WinSmall';
import { ControllerIds } from '../game/const/ControllerIds';
import { UI_PATH_ENUM } from '../game/const/UIPath';
import { ViewConst } from '../game/const/ViewConst';
import { i18n, Lang } from '../i18n/i18n';

WinMgr.I.addConfig({
    id: ViewConst.LoginView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.LoginView,
    mid: ControllerIds.LoginController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('LoginView') as BaseUiView,
});

// 创角界面
WinMgr.I.addConfig({
    id: ViewConst.CreateRoleView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.CreateRoleView,
    mid: ControllerIds.LoginController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('CreateRoleView') as BaseUiView,
});

// 选服界面
WinMgr.I.addConfig({
    id: ViewConst.SelServerView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall, // UI_PATH_ENUM.SelServerView,
    childPath: UI_PATH_ENUM.SelServerView,
    mid: ControllerIds.LoginController,
    childView: 'SelServerView',
    title: i18n.tt(Lang.server_list),
    size: cc.size(635, 806),
    winSmallType: WinSmallType.TypeC,
    // resClass: (node: cc.Node): BaseUiView => node.getComponent('SelServerView') as BaseUiView,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

// 账号注册界面
WinMgr.I.addConfig({
    id: ViewConst.AccountRegView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.AccountRegView,
    isShowAll: false,
    mid: ControllerIds.LoginController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('AccRegBox') as BaseUiView,
});

// 账号登录界面
WinMgr.I.addConfig({
    id: ViewConst.AccountLoginView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.AccountLoginView,
    isShowAll: false,
    mid: ControllerIds.LoginController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('AccLoginBox') as BaseUiView,
});

// 资源加载界面
WinMgr.I.addConfig({
    id: ViewConst.ResLoading,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ResLoading,
    isShowAll: false,
    mid: ControllerIds.LoginController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('ResLoading') as BaseUiView,
});

/** 警告提示窗 */
WinMgr.I.addConfig({
    id: ViewConst.ReqLoginWarnWin,
    layerType: GameLayerEnum.WARN_LAYER,
    prefabPath: UI_PATH_ENUM.NetConfirmBox,
    mid: ControllerIds.LoginController,
    isShowAll: false,
    isShowTips: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('NetConfirmBox') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.IdentitykBox,
    layerType: GameLayerEnum.WARN_LAYER,
    prefabPath: UI_PATH_ENUM.IdentitykBox,
    mid: ControllerIds.LoginController,
    size: cc.size(650, 600),
    isShowAll: false,
    isPopup: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('IdentitykBox') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.RealNameWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.RealNameWin,
    mid: ControllerIds.LoginController,
    isShowAll: false,
    isShowTips: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('RealNameWin') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.GameWelcomeWin,
    layerType: GameLayerEnum.WARN_LAYER,
    prefabPath: UI_PATH_ENUM.GameWelcomeWin,
    mid: ControllerIds.LoginController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GameWelcomeWin') as WinBase,
});
