/*
 * @Author: myl
 * @Date: 2022-10-11 21:55:57
 * @Description:
 */


import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import WinBase from '../../../com/win/WinBase';
import { ControllerIds } from '../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.RoleOfficialRewardWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleOfficialRewardWin,
    mid: ControllerIds.RoleOfficialController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('RoleOfficialRewardWin') as WinBase,
});
