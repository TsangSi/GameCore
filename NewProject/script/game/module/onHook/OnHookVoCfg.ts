/*
 * @Author: kexd
 * @Date: 2022-09-15 11:43:14
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\onHook\OnHookVoCfg.ts
 * @Description:
 *
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinBase from '../../com/win/WinBase';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

// 挂机界面
WinMgr.I.addConfig({
    id: ViewConst.OnHookWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.OnHookWin,
    mid: ControllerIds.OnHookController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('OnHookWin') as WinBase,
});

// 增益界面
WinMgr.I.addConfig({
    id: ViewConst.OnHoolTips,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.OnHoolTips,
    mid: ControllerIds.OnHookController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('OnHoolTips') as BaseUiView,
});
