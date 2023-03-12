/*
 * @Author: zs
 * @Date: 2022-06-06 16:30:10
 * @LastEditors: zs
 * @LastEditTime: 2022-06-07 15:06:19
 * @FilePath: \SanGuo\assets\script\game\module\recharge\RechargeVoCfg.ts
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
    id: ViewConst.RechargeWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RechargeWin,
    mid: ControllerIds.BagController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RechargeWin') as BaseUiView,
});
