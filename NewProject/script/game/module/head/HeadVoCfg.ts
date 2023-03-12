/*
 * @Author: myl
 * @Date: 2022-11-16 11:16:57
 * @Description:
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.HeadPage,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.HeadPage,
    mid: ControllerIds.HeadController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('HeadPage') as BaseUiView,
});
