import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

/*
 * @Author: zs
 * @Date: 2022-07-06 15:57:51
 * @FilePath: \SanGuo\assets\script\game\module\maincity\MainCityVoCfg.ts
 * @Description:
 *
 */
WinMgr.I.addConfig({
    id: ViewConst.MainCity,
    layerType: GameLayerEnum.MAIN_CITY_LAYER,
    prefabPath: UI_PATH_ENUM.MainCity,
    mid: 1,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('MainCity') as BaseUiView,
});
