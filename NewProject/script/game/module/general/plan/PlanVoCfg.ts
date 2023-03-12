/*
 * @Author: kexd
 * @Date: 2022-08-15 16:31:59
 * @FilePath: \SanGuo\assets\script\game\module\general\plan\PlanVoCfg.ts
 * @Description: 武将-布阵
 */
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.PlanWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.PlanWin,
    mid: ControllerIds.GeneralController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('PlanWin') as BaseUiView,
});
