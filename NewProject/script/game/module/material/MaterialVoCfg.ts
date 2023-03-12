/*
 * @Author: myl
 * @Date: 2022-08-03 20:31:08
 * @Description:
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.MaterialWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.MaterialWin,
    mid: ControllerIds.MaterialController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('MaterialWin') as BaseUiView,
});
WinMgr.I.addConfig({
    id: ViewConst.MaterialRewardScanWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.MaterialRewardScanWin,
    mid: ControllerIds.MaterialController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('MaterialRewardScanWin') as BaseUiView,
});
