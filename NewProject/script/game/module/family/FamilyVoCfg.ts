import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinBase from '../../com/win/WinBase';
import WinTabFrame from '../../com/win/WinTabFrame';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';
// 世家主页
WinMgr.I.addConfig({
    id: ViewConst.FamilyHomePage,
    layerType: GameLayerEnum.MAIN_CITY_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyHomePage,
    mid: ControllerIds.FamilyController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('FamilyHomePage') as BaseUiView,
});

// 世家-【世家|成员】
WinMgr.I.addConfig({
    id: ViewConst.FamilyWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyWin,
    mid: ControllerIds.FamilyController,
    resClass: (node: cc.Node): WinTabFrame => node.getComponent('FamilyWin') as WinTabFrame,
});

// 世家事务
WinMgr.I.addConfig({
    id: ViewConst.FamilyTaskWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyTaskWin,
    mid: ControllerIds.FamilyController,
    resClass: (node: cc.Node): WinTabFrame => node.getComponent('FamilyTaskWin') as WinTabFrame,
});
// 设置协助
WinMgr.I.addConfig({
    id: ViewConst.FamilySetAssistTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilySetAssistTip,
    mid: ControllerIds.FamilyController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FamilySetAssistTip') as WinBase,
});
// 设置协助
WinMgr.I.addConfig({
    id: ViewConst.FamilyAutoDispathTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyAutoDispathTip,
    mid: ControllerIds.FamilyController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FamilyAutoDispathTip') as WinBase,
});
// 设置协助
WinMgr.I.addConfig({
    id: ViewConst.FamilyUpTipsWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyUpTipsWin,
    mid: ControllerIds.FamilyController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FamilyUpTipsWin') as WinBase,
});
/** 世家详细信息 */
WinMgr.I.addConfig({
    id: ViewConst.FamilyLevelTips,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyLevelTips,
    mid: ControllerIds.FamilyController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FamilyLevelTips') as WinBase,
});
/** 族长争夺 */
WinMgr.I.addConfig({
    id: ViewConst.FamilyPatriarchWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyPatriarchWin,
    mid: ControllerIds.FamilyController,
    resClass: (node: cc.Node): WinTabFrame => node.getComponent('FamilyPatriarchWin') as WinTabFrame,
});
/** 试炼副本 */
WinMgr.I.addConfig({
    id: ViewConst.FamilyTrialCopyWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyTrialCopyWin,
    mid: ControllerIds.FamilyController,
    resClass: (node: cc.Node): WinTabFrame => node.getComponent('FamilyTrialCopyWin') as WinTabFrame,
});

// 世家特权
WinMgr.I.addConfig({
    id: ViewConst.FamilyPowerTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyPowerTip,
    mid: ControllerIds.FamilyController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FamilyPowerTip') as WinBase,
});
// 族长俸禄
WinMgr.I.addConfig({
    id: ViewConst.FamilyAwardTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyAwardTip,
    mid: ControllerIds.FamilyController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FamilyAwardTip') as WinBase,
});
// 试炼副本通关奖励
WinMgr.I.addConfig({
    id: ViewConst.FamilyTrialAwardTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyTrialAwardTip,
    mid: ControllerIds.FamilyController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FamilyTrialAwardTip') as WinBase,
});
/** 试炼副本-红包 */
WinMgr.I.addConfig({
    id: ViewConst.FamilyTrialRedPackTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyTrialRedPackTip,
    mid: ControllerIds.FamilyController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FamilyTrialRedPackTip') as WinBase,
});
// 修改世家名称 宣言
WinMgr.I.addConfig({
    id: ViewConst.FamilyModifyTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyModifyTip,
    mid: ControllerIds.FamilyController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FamilyModifyTip') as WinBase,
});

// 世家-试炼副本-排行榜tip
WinMgr.I.addConfig({
    id: ViewConst.FamilyTrialRankTip,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.FamilyTrialRankTip,
    mid: ControllerIds.FamilyController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('FamilyTrialRankTip') as WinBase,
});

export enum FamilyUIType {
    TaskDetail = 1, // 任务详情
    SetAssist = 2, // 设置协助
}
