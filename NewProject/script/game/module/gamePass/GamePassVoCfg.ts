/*
 * @Author: zs
 * @Date: 2022-09-20 11:47:02
 * @FilePath: \SanGuo\assets\script\game\module\gamePass\GamePassVoCfg.ts
 * @Description:
 *
 */
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinBase from '../../com/win/WinBase';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

// 挂机界面
WinMgr.I.addConfig({
    id: ViewConst.GamePassWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GamePassWin,
    mid: ControllerIds.GamePassController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GamePassWin') as WinBase,
});
