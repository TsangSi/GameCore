/*
 * @Author: hwx
 * @Date: 2022-06-08 17:11:58
 * @FilePath: \SanGuo\assets\script\game\gm\GMVoCfg.ts
 * @Description: GM视图配置
 */

import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../app/core/mvc/WinConst';
import WinMgr from '../../app/core/mvc/WinMgr';
import { ControllerIds } from '../const/ControllerIds';
import { UI_PATH_ENUM } from '../const/UIPath';
import { ViewConst } from '../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.GMWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GMWin,
    mid: ControllerIds.GMController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('GMWin') as BaseUiView,
});
