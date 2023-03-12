/*
 * @Author: myl
 * @Date: 2022-09-14 14:40:10
 * @Description:
 */
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinBase from '../../com/win/WinBase';
import WinTabFrame from '../../com/win/WinTabFrame';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.GameLevelWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GameLevelWin,
    mid: ControllerIds.GameLevelController,
    resClass: (node: cc.Node): WinTabFrame => node.getComponent('GameLevelWin') as WinTabFrame,
});

WinMgr.I.addConfig({
    id: ViewConst.GameLevelNewChapterView,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.GameLevelNewChapterView,
    mid: ControllerIds.GameLevelController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GameLevelNewChapterView') as WinBase,
});
