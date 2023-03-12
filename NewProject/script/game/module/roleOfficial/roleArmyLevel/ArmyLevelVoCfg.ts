import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import WinBase from '../../../com/win/WinBase';
import { ControllerIds } from '../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.ArmyPreviewTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ArmyPreviewTip,
    mid: ControllerIds.ArmyLevelController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('ArmyPreviewTip') as WinBase,
});
WinMgr.I.addConfig({
    id: ViewConst.ArmyLevelUpTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ArmyLevelUpTip,
    mid: ControllerIds.ArmyLevelController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('ArmyLevelUpTip') as WinBase,
});
