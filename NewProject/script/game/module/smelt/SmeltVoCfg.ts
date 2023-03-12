/*
 * @Author: ylj
 * @Date: 2022-06-15 16:07
 * @FilePath: \SanGuo\assets\script\game\module\smelting\SmeltVoCfg.ts
 * @Description:熔炼配置
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.SmeltWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.SmeltWin,
    mid: ControllerIds.SmeltController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('SmeltWin') as BaseUiView,
});
