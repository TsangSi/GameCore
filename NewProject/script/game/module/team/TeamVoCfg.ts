/*
 * @Author: zs
 * @Date: 2022-11-18 09:49:48
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\team\TeamVoCfg.ts
 * @Description:
 *
 */
import { PopupType } from '../../../app/core/mvc/BaseVo';
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.TeamWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.TeamWin,
    mid: ControllerIds.TeamController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('TeamWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.InvitePlayerWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.InvitePlayerWin,
    mid: ControllerIds.TeamController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('InvitePlayerWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.InvitationBox,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.InvitationBox,
    mid: ControllerIds.TeamController,
    isShowAll: false,
    isPopup: PopupType.Last,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('InvitationBox') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.TeamPlanPreView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.TeamPlanPreView,
    mid: ControllerIds.TeamController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('TeamPlanPreView') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.TeamRewardWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.TeamRewardWin,
    mid: ControllerIds.TeamController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('TeamRewardWin') as BaseUiView,
});
