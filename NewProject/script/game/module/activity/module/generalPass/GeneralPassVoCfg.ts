import { GameLayerEnum } from '../../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import WinBase from '../../../../com/win/WinBase';
import { ControllerIds } from '../../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';

/*
 * @Author: myl
 * @Date: 2022-12-07 10:21:12
 * @Description:
 */
WinMgr.I.addConfig({
    id: ViewConst.WelfareWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WelfareWin,
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WelfareWin') as WinBase,
});
