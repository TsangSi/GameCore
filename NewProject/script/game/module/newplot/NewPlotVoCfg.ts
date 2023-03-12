import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

/*
 * @Author: zs
 * @Date: 2022-11-23 18:51:44
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\newplot\NewPlotVoCfg.ts
 * @Description:
 *
 */
WinMgr.I.addConfig({
    id: ViewConst.NewPlotPanel,
    layerType: GameLayerEnum.POP_LAYER,
    prefabPath: UI_PATH_ENUM.NewPlotPanel,
    mid: ControllerIds.MaterialController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('NewPlotPanel') as BaseUiView,
});
