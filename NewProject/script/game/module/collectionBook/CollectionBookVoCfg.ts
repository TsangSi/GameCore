/*
 * @Author: zs
 * @Date: 2022-12-01 17:42:46
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\CollectionBookVoCfg.ts
 * @Description:
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

/** 博物志 */
WinMgr.I.addConfig({
    id: ViewConst.CollectionBookWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.CollectionBookWin,
    mid: ControllerIds.CollectionBookController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('CollectionBookWin') as BaseUiView,
});

/** 博物志-生涯插画界面 */
WinMgr.I.addConfig({
    id: ViewConst.CollectionPicDetailsWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.CollectionPicDetailsWin,
    mid: ControllerIds.CollectionBookController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('CollectionPicDetailsWin') as WinBase,
});

// 奇物、人物详情
WinMgr.I.addConfig({
    id: ViewConst.CollectionUpDetailsWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.CollectionUpDetailsWin,
    mid: ControllerIds.CollectionBookController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('CollectionUpDetailsWin') as WinBase,
});

// 见闻属性提升弹窗
WinMgr.I.addConfig({
    id: ViewConst.CollectionAttrUpWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.CollectionAttrUpWin,
    mid: ControllerIds.CollectionBookController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('CollectionAttrUpWin') as BaseUiView,
});
/** 奖励预览界面 */
WinMgr.I.addConfig({
    id: ViewConst.CollectionBookRw,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.CollectionBookRw,
    mid: ControllerIds.CollectionBookController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('CollectionBookRw') as BaseUiView,
});
