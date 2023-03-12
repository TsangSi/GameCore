/** import {' cc.Node, cc.size } 'from 'cc';  // */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import WinBase from '../../com/win/WinBase';
import { WinSmallType } from '../../com/win/WinSmall';
import { WinTabPage } from '../../com/win/WinTabPage';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.RoleExerciseWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleExerciseWin,
    mid: ControllerIds.RoleExerciseController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleExerciseWin') as BaseUiView,
});
