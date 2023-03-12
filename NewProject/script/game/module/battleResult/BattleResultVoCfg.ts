/*
 * @Author: kexd
 * @Date: 2022-06-27 12:00:08
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\battleResult\BattleResultVoCfg.ts
 * @Description:
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinBase from '../../com/win/WinBase';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

// WinMgr.I.addConfig({
//     id: ViewConst.BattleRewardView,
//     layerType: GameLayerEnum.TIPS_LAYER,
//     prefabPath: UI_PATH_ENUM.BattleRewardView,
//     mid: ControllerIds.BattleResultController,
//     isShowAll: false,
//     resClass: (node: cc.Node): BaseUiView => node.getComponent('BattleRewardView') as BaseUiView,
// });
// 1
// WinMgr.I.addConfig({
//     id: ViewConst.BattleResult1,
//     layerType: GameLayerEnum.TIPS_LAYER,
//     prefabPath: UI_PATH_ENUM.BattleResult1,
//     mid: ControllerIds.BattleResultController,
//     isShowAll: false,
//     resClass: (node: cc.Node): BaseUiView => node.getComponent('BattleResult1') as BaseUiView,
// });

WinMgr.I.addConfig({
    id: ViewConst.BattleSettleWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.BattleSettleWin,
    mid: ControllerIds.BattleResultController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('BattleSettleWin') as WinBase,
});
