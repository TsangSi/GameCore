import BaseUiView from '../../../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import WinBase from '../../../../com/win/WinBase';
import { ControllerIds } from '../../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.GeneralRecruitWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GeneralRecruitWin,
    mid: ControllerIds.GeneralRecruitController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('GeneralRecruitWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.RandomLogTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RandomLogTip,
    mid: ControllerIds.GeneralRecruitController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('RandomLogTip') as WinBase,
});
WinMgr.I.addConfig({
    id: ViewConst.GeneralAwardTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GeneralAwardTip,
    mid: ControllerIds.GeneralRecruitController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GeneralAwardTip') as WinBase,
});
WinMgr.I.addConfig({
    id: ViewConst.GeneralWishTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GeneralWishTip,
    mid: ControllerIds.GeneralRecruitController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GeneralWishTip') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.GeneralAutoBuyTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GeneralAutoBuyTip,
    mid: ControllerIds.GeneralRecruitController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GeneralAutoBuyTip') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.GeneralRecRewardWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GeneralRecRewardWin,
    mid: ControllerIds.GeneralRecruitController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GeneralRecRewardWin') as WinBase,
});
