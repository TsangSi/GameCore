/*
 * @Author: wangxin
 * @Date: 2022-10-11 10:44:02
 * @FilePath: \SanGuo2.4\assets\script\game\module\rankList\RankListVoCfg.ts
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
    id: ViewConst.RankListWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RankListWin,
    mid: ControllerIds.RankListController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RankListWin') as BaseUiView,
});

// buff列表
WinMgr.I.addConfig({
    id: ViewConst.BuffListWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.BuffListWin,
    childView: 'BuffListWin',
    mid: ControllerIds.RankListController,
    isShowAll: false,
    title: i18n.tt(Lang.bufflist_title),
    size: cc.size(682, 890),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 世界等级
WinMgr.I.addConfig({
    id: ViewConst.WorldLevelWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.WorldLevelWin,
    childView: 'WorldLevelWin',
    mid: ControllerIds.RankListController,
    isShowAll: false,
    title: i18n.tt(Lang.worldlevel_title),
    size: cc.size(700, 684),
    winSmallType: WinSmallType.TypeA,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});
