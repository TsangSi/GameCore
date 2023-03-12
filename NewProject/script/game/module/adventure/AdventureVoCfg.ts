import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinBase from '../../com/win/WinBase';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

/** 奖励结算界面 */
WinMgr.I.addConfig({
    id: ViewConst.AdventureReward,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.AdventureReward,
    mid: ControllerIds.AdventureController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('AdventureReward') as WinBase,
});

/** 事件列表界面 */
WinMgr.I.addConfig({
    id: ViewConst.AdventureEventView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.AdventureEventView,
    mid: ControllerIds.AdventureController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('AdventureEventView') as WinBase,
});

/** 黄金骰子 */
WinMgr.I.addConfig({
    id: ViewConst.AdventureGoldDice,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.AdventureGoldDice,
    mid: ControllerIds.AdventureController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('AdventureGoldDice') as WinBase,
});
