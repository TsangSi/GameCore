/*
 * @Author: myl
 * @Date: 2022-11-24 10:16:01
 * @Description:
 */

import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinBase from '../../com/win/WinBase';
import WinTabFrame from '../../com/win/WinTabFrame';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.FriendWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FriendWin,
    mid: ControllerIds.FriendController,
    resClass: (node: cc.Node): WinTabFrame => node.getComponent('FriendWin') as WinTabFrame,
});

WinMgr.I.addConfig({
    id: ViewConst.FriendChatWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.FriendChatWin,
    mid: ControllerIds.FriendController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FriendChatWin') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.FriendAddWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.FriendAddWin,
    mid: ControllerIds.FriendController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FriendAddWin') as WinBase,
});
