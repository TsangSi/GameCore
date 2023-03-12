/*
 * @Author: hwx
 * @Date: 2022-05-20 15:34:22
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\bag\BagVoCfg.ts
 * @Description:
 */

import { PopupType } from '../../../app/core/mvc/BaseVo';
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
    id: ViewConst.BagWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.BagWin,
    mid: ControllerIds.BagController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('BagWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.ItemSourceWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BagController,
    childPath: UI_PATH_ENUM.ItemSourceWin,
    childView: 'ItemSourceWin',
    title: i18n.tt(Lang.itemsource_title),
    size: cc.size(650, 625),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.ItemTipsWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.ItemTipsWin,
    mid: ControllerIds.BagController,
    isShowAll: false,
    isPopup: PopupType.Nwe,
    resClass: (node: cc.Node): WinBase => node.getComponent('ItemTipsWin') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.ItemTipsPickChestWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.ItemTipsPickChestWin,
    mid: ControllerIds.BagController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('ItemTipsPickChestWin') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.BagExpansionWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BagController,
    childPath: UI_PATH_ENUM.BagExpansionWin,
    childView: 'BagExpansionWin',
    title: i18n.tt(Lang.bag_expansion_win_title),
    size: cc.size(650, 380),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.BagOneKeyUseWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BagController,
    childPath: UI_PATH_ENUM.BagOneKeyUseWin,
    childView: 'BagOneKeyUseWin',
    title: i18n.tt(Lang.bag_one_key_use_win_title),
    size: cc.size(650, 655),
    isShowAll: false,
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.ItemQuickUseWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.ItemQuickUseWin,
    mid: ControllerIds.BagController,
    isShowAll: false,
    isNotHide: true,
    resClass: (node: cc.Node): WinBase => node.getComponent('ItemQuickUseWin') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.FightValueDetailWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.FightValueDetailWin,
    mid: ControllerIds.BagController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FightValueDetailWin') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.TipsSkillWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.TipsSkillWin,
    mid: ControllerIds.BagController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('TipsSkillWin') as WinBase,
    zIndex: 1,
});

WinMgr.I.addConfig({
    id: ViewConst.PackageWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BagController,
    childPath: UI_PATH_ENUM.PackageWin,
    childView: 'PackageWin',
    title: i18n.tt(Lang.package_title),
    size: cc.size(676, 652),
    winSmallType: WinSmallType.TypeC,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.WinRwShow,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BagController,
    childPath: UI_PATH_ENUM.WinRwShow,
    childView: 'WinRwShow',
    title: i18n.tt(Lang.reward_show),
    size: cc.size(676, 662),
    winSmallType: WinSmallType.TypeC,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});
