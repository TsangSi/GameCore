/*
 * @Author: zs
 * @Date: 2022-06-06 16:30:10
 * @LastEditors: zs
 * @LastEditTime: 2022-06-10 15:03:42
 * @FilePath: \SanGuo\assets\script\game\module\exchange\ExchangeVoCfg.ts
 * @Description:
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.ExchangeWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ExchangeWin,
    mid: ControllerIds.ExchangeController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('ExchangeWin') as BaseUiView,
});
