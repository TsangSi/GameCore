/*
 * @Author: zs
 * @Date: 2023-01-18 09:56:51
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
    id: ViewConst.ArenaWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ArenaWin,
    mid: ControllerIds.ArenaController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('ArenaWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.ArenaRankRewardView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ArenaRankRewardView,
    mid: ControllerIds.ArenaController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('ArenaRankRewardView') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.ArenaRankListView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ArenaRankListView,
    mid: ControllerIds.ArenaController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('ArenaRankListView') as BaseUiView,
});

// 排位赛-奖励
WinMgr.I.addConfig({
    id: ViewConst.RankMatchAwardWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RankMatchAwardWin,
    mid: ControllerIds.RankMatchController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RankMatchAwardWin') as BaseUiView,
});

// 排位赛-战报
WinMgr.I.addConfig({
    id: ViewConst.RankMatchReportWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.RankMatchReportWin,
    childView: 'RankMatchReportWin',
    mid: ControllerIds.RankMatchController,
    isShowAll: false,
    title: i18n.tt(Lang.rankmatch_report_title),
    size: cc.size(682, 850),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 排位赛-排行榜
WinMgr.I.addConfig({
    id: ViewConst.RankMatchRankWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RankMatchRankWin,
    mid: ControllerIds.RankMatchController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RankMatchRankWin') as BaseUiView,
});

// 排位赛-匹配
WinMgr.I.addConfig({
    id: ViewConst.RankMatchDuel,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RankMatchDuel,
    mid: ControllerIds.RankMatchController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('RankMatchDuel') as WinBase,
});

// 排位赛-匹配
WinMgr.I.addConfig({
    id: ViewConst.RankMatchReset,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RankMatchReset,
    mid: ControllerIds.RankMatchController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('RankMatchReset') as WinBase,
});
