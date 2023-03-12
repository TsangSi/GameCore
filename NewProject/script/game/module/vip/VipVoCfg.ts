/*
 * @Author: myl
 * @Date: 2022-10-26 10:29:36
 * @Description:
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import WinBase from '../../com/win/WinBase';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.VipWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.VipWin,
    mid: ControllerIds.VipController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('VipWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.VipSuperWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.VipSuperWin,
    mid: ControllerIds.VipController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('VipSuperWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.WinReward,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.VipController,
    childPath: UI_PATH_ENUM.WinReward,
    childView: 'WinReward',
    title: i18n.tt(Lang.vip_funcs),
    size: cc.size(682, 425),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,

});

WinMgr.I.addConfig({
    id: ViewConst.VipContentTipWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.VipController,
    childPath: UI_PATH_ENUM.VipContentTipWin,
    childView: 'VipContentTipWin',
    title: i18n.tt(Lang.vip_funcs),
    size: cc.size(682, 410),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,

});

WinMgr.I.addConfig({
    id: ViewConst.VipUpdateWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.VipUpdateWin,
    mid: ControllerIds.VipController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('VipUpdateWin') as BaseUiView,
});
