/*
 * @Author: myl
 * @Date: 2022-08-30 16:25:15
 * @Description:
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import WinBase from '../../com/win/WinBase';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.ShopWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ShopWin,
    mid: ControllerIds.ShopController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('ShopWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.WinQuickPay,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.GradeController,
    childPath: UI_PATH_ENUM.WinQuickPay,
    childView: 'WinQuickPay',
    title: i18n.tt(Lang.com_pay),
    size: cc.size(720, 700),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,

});
