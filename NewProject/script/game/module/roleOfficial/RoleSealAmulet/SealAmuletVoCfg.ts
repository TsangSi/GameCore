/*
 * @Author: myl
 * @Date: 2022-10-11 22:10:00
 * @Description:
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import WinBase from '../../../com/win/WinBase';
import { ControllerIds } from '../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.SealAmuletWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.SealAmuletWin,
    mid: ControllerIds.SealAmuletController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('SealAmuletWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.SealAmuletTipWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.SealAmuletTipWin,
    mid: ControllerIds.SealAmuletController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('SealAmuletTipWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.SealAmuletUpWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.SealAmuletUpWin,
    mid: ControllerIds.SealAmuletController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('SealAmuletUpWin') as WinBase,
});
