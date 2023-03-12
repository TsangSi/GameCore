/*
 * @Author: myl
 * @Date: 2023-02-07 15:15:30
 * @Description:
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinTabFrame from '../../com/win/WinTabFrame';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.ResRecoveryBuyWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ResRecoveryBuyWin,
    mid: ControllerIds.DailyTaskController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('ResRecoveryBuyWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.ComItemsScanWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ComItemsScanWin,
    mid: ControllerIds.DailyTaskController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('ComItemsScanWin') as BaseUiView,
});
