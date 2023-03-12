/*
 * @Author: hwx
 * @Date: 2022-07-06 14:43:17
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\grade\GradeVoCfg.ts
 * @Description: 进阶视图配置
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
    id: ViewConst.GradeWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GradeWin,
    mid: ControllerIds.GradeController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('GradeWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.WinComQuickPay,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.GradeController,
    childPath: UI_PATH_ENUM.WinComQuickPay,
    childView: 'WinComQuickPay',
    title: i18n.tt(Lang.grade_quick_pay),
    size: cc.size(690, 695),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.GradeToGoldWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.GradeController,
    childPath: UI_PATH_ENUM.GradeToGoldWin,
    childView: 'GradeToGoldWin',
    title: i18n.tt(Lang.grade_to_gold),
    size: cc.size(682, 953),
    isShowAll: false,
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.GradeSoulWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.GradeController,
    childPath: UI_PATH_ENUM.GradeSoulWin,
    childView: 'GradeSoulWin',
    title: i18n.tt(Lang.grade_zl),
    size: cc.size(682, 708),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.GradeGodWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.GradeController,
    childPath: UI_PATH_ENUM.GradeGodWin,
    childView: 'GradeGodWin',
    title: i18n.tt(Lang.grade_god_swallow),
    size: cc.size(682, 586),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.GradeGetAwardsWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GradeGetAwardsWin,
    mid: ControllerIds.GradeController,
    // backBgAlpha: 0.1,
    // blackBg: true,
    isShowAll: false,
    isPopup: PopupType.Last,
    resClass: (node: cc.Node): WinBase => node.getComponent('GradeGetAwardsWin') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.WinAutoPayTips,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.GradeController,
    childPath: UI_PATH_ENUM.WinAutoPayTips,
    childView: 'WinAutoPayTips',
    title: i18n.tt(Lang.grade_god_swallow),
    size: cc.size(661, 423),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});
