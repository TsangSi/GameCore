import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import WinBase from '../../../com/win/WinBase';
import { ControllerIds } from '../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.UpStarSelectEquipWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.UpStarSelectEquipWin,
    mid: ControllerIds.UpStarController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('UpStarSelectEquipWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.UpStarRewardWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.UpStarRewardWin,
    mid: ControllerIds.UpStarController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('UpStarRewardWin') as WinBase,
});
