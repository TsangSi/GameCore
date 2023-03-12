/*
 * @Author: kexd
 * @Date: 2022-09-22 16:42:59
 * @FilePath: \SanGuo\assets\script\game\module\general\gskin\GskinVoCfg.ts
 * @Description: 武将-皮肤
 */
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.GskinWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GskinWin,
    mid: ControllerIds.GeneralController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('GskinWin') as BaseUiView,
});
