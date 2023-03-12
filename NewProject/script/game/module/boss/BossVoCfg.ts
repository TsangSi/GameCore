/*
 * @Author: kexd
 * @Date: 2022-06-22 18:51:59
 * @FilePath: \SanGuo2.4\assets\script\game\module\boss\BossVoCfg.ts
 * @Description:
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
    id: ViewConst.BossWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.BossWin,
    mid: ControllerIds.BossController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('BossWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.BossRankList,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BossController,
    childPath: UI_PATH_ENUM.BossRankList,
    childView: 'BossRankList',
    title: i18n.tt(Lang.boss_rank_title),
    size: cc.size(682, 895),
    isShowAll: false,
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.BossInspireWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BossController,
    childPath: UI_PATH_ENUM.BossInspireWin,
    childView: 'BossInspireWin',
    title: i18n.tt(Lang.boss_inspireWin),
    size: cc.size(650, 453),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.BossAwardPriew,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.BossController,
    childPath: UI_PATH_ENUM.BossAwardPriew,
    childView: 'BossAwardPriew',
    title: i18n.tt(Lang.com_prize_view),
    size: cc.size(650, 443),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});
