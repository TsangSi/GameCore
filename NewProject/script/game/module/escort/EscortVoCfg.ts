/*
 * @Author: kexd
 * @Date: 2023-01-14 18:52:28
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\EscortVoCfg.ts
 * @Description:
 *
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { WinSmallType } from '../../com/win/WinSmall';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

// 被劫记录
WinMgr.I.addConfig({
    id: ViewConst.RobbedWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.RobbedWin,
    childView: 'RobbedWin',
    mid: ControllerIds.EscortController,
    isShowAll: false,
    title: i18n.tt(Lang.escort_robbed_title),
    size: cc.size(682, 920),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 拦截
WinMgr.I.addConfig({
    id: ViewConst.RobWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.RobWin,
    childView: 'RobWin',
    mid: ControllerIds.EscortController,
    isShowAll: false,
    title: i18n.tt(Lang.escort_rob_title),
    size: cc.size(682, 900),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 选择镖车
WinMgr.I.addConfig({
    id: ViewConst.ChooseBoardWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.ChooseBoardWin,
    childView: 'ChooseBoardWin',
    mid: ControllerIds.EscortController,
    isShowAll: false,
    title: i18n.tt(Lang.escort_board),
    size: cc.size(682, 980),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 押镖奖励
WinMgr.I.addConfig({
    id: ViewConst.EscortRewardWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.EscortRewardWin,
    childView: 'EscortRewardWin',
    mid: ControllerIds.EscortController,
    isShowAll: false,
    title: i18n.tt(Lang.escort_reward),
    size: cc.size(682, 880),
    winSmallType: WinSmallType.TypeC,
    isShowTips: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});
