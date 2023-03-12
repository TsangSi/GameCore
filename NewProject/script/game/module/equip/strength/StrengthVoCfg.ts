import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import WinBase from '../../../com/win/WinBase';
import { ControllerIds } from '../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.EquipWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.EquipWin,
    mid: ControllerIds.StrengthController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('EquipWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.ResonanceWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ResonanceWin,
    mid: ControllerIds.StrengthController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('ResonanceWin') as WinBase,
});
