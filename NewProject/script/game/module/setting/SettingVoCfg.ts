import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinBase from '../../com/win/WinBase';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.SettingWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.SettingWin,
    mid: ControllerIds.SettingController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('SettingWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.ModifyNamePage,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ModifyNamePage,
    mid: ControllerIds.SettingController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('ModifyNamePage') as WinBase,
});
