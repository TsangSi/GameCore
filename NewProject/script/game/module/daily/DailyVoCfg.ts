/*
 * @Author: kexd
 * @Date: 2023-02-01 15:33:04
 * @FilePath: \SanGuo2.4\assets\script\game\module\daily\DailyVoCfg.ts
 * @Description: 日常
 *
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.DailyWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.DailyWin,
    mid: ControllerIds.EscortController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('DailyWin') as BaseUiView,
});
