/** import {' cc.Node, cc.size } 'from 'cc';  //*/
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

/*
 * @Author: zs
 * @Date: 2022-05-25 11:01:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-29 16:16:47
 * @FilePath: \SanGuo\assets\script\game\module\role\RoleVoCfg.ts
 * @Description:
 *
 */

WinMgr.I.addConfig({
    id: ViewConst.RoleView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleView,
    isShowAll: true,
    mid: ControllerIds.RoleController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleView') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.RoleWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleWin,
    isShowAll: true,
    mid: ControllerIds.RoleController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.RoleAttrWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleAttrWin,
    mid: ControllerIds.RoleController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleAttrWin') as BaseUiView,
});
