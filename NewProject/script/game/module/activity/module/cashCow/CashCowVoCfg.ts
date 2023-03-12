import BaseUiView from '../../../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import WinBase from '../../../../com/win/WinBase';
import { ControllerIds } from '../../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';

/*
 * @Author: myl
 * @Date: 2022-12-22 16:31:51
 * @Description:
 */
WinMgr.I.addConfig({
    id: ViewConst.CashCowBuyWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.CashCowBuyWin,
    mid: ControllerIds.ActivityController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('CashCowBuyWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.CashCowRateWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.CashCowRateWin,
    mid: ControllerIds.ActivityController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('CashCowRateWin') as WinBase,
});
