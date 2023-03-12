/*
 * @Author: zs
 * @Date: 2023-03-06 10:50:47
 * @Description:
 *
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.AdviserWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.AdviserWin,
    mid: ControllerIds.AdviserController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('AdviserWin') as BaseUiView,
});
