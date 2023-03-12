/*
 * @Author: zs
 * @Date: 2023-02-07 14:32:36
 * @Description:
 *
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import WinBase from '../../com/win/WinBase';
import { WinSmallType } from '../../com/win/WinSmall';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.FBExploreRank,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.MaterialController,
    childPath: UI_PATH_ENUM.FBExploreRank,
    childView: 'FBExploreRank',
    title: i18n.tt(Lang.com_text_paihangbang),
    size: cc.size(682, 860),
    winSmallType: WinSmallType.TypeC,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.FBExploreReport,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.MaterialController,
    childPath: UI_PATH_ENUM.FBExploreReport,
    childView: 'FBExploreReport',
    title: i18n.tt(Lang.com_text_zhanbao),
    size: cc.size(682, 925),
    isShowAll: false,
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.FBExploreReset,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FBExploreReset,
    mid: ControllerIds.MaterialController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('FBExploreReset') as BaseUiView,
});
