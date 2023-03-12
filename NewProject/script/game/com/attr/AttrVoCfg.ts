/*
 * @Author: kexd
 * @Date: 2022-07-14 11:57:14
 * @FilePath: \SanGuo\assets\script\game\com\attr\AttrVoCfg.ts
 * @Description:
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.AttrTips,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.AttrTips,
    mid: ControllerIds.AttrFvController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('AttrTips') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.AttrDetailTips,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.AttrDetailTips,
    mid: ControllerIds.AttrFvController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('AttrDetailTips') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.AttrSimpleWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.AttrSimpleWin,
    mid: ControllerIds.AttrFvController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('AttrSimpleWin') as BaseUiView,
});
