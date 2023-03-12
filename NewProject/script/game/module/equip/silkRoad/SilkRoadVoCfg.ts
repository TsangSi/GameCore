import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import WinBase from '../../../com/win/WinBase';
import { ControllerIds } from '../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';

/** 奖励结算界面 */
WinMgr.I.addConfig({
    id: ViewConst.SilkRoadReward,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.SilkRoadReward,
    mid: ControllerIds.SilkRoadController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('SilkRoadReward') as WinBase,
});

/** 事件奖励预览界面 */
WinMgr.I.addConfig({
    id: ViewConst.SilkRoadEventReward,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.SilkRoadEventReward,
    mid: ControllerIds.SilkRoadController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('CollectionBookRw') as WinBase,
});
