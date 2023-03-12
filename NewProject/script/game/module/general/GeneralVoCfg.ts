/*
 * @Author: kexd
 * @Date: 2022-08-16 12:19:32
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\GeneralVoCfg.ts
 * @Description: 武将
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
    id: ViewConst.GeneralWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GeneralWin,
    mid: ControllerIds.GeneralController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('GeneralWin') as BaseUiView,
});

// 升品
WinMgr.I.addConfig({
    id: ViewConst.QualityOnekeyUp,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.QualityOnekeyUp,
    childView: 'QualityOnekeyUp',
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    title: i18n.tt(Lang.general_onekey),
    size: cc.size(650, 900),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 升品预览
WinMgr.I.addConfig({
    id: ViewConst.QualityUpPreview,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.QualityUpPreview,
    childView: 'QualityUpPreview',
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    title: i18n.tt(Lang.general_preview),
    size: cc.size(650, 655),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 升品成功
WinMgr.I.addConfig({
    id: ViewConst.QualityUpSucess,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.QualityUpSucess,
    mid: ControllerIds.TitleController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('QualityUpSucess') as WinBase,
});

// 一键升品成功
WinMgr.I.addConfig({
    id: ViewConst.GeneralRewardWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GeneralRewardWin,
    mid: ControllerIds.BagController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GeneralRewardWin') as WinBase,
});

// 选择武将弹窗
WinMgr.I.addConfig({
    id: ViewConst.GeneralChooseWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.GeneralController,
    childPath: UI_PATH_ENUM.GeneralChooseWin,
    childView: 'GeneralChooseWin',
    title: i18n.tt(Lang.general_choose),
    size: cc.size(650, 695),
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 武将-升阶-选择
WinMgr.I.addConfig({
    id: ViewConst.GradeUpChooseWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.GradeUpChooseWin,
    childView: 'GradeUpChooseWin',
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    title: i18n.tt(Lang.general_grade_title),
    size: cc.size(598, 620),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 武将技能展示
WinMgr.I.addConfig({
    id: ViewConst.GeneralSkillWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GeneralSkillWin,
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GeneralSkillWin') as WinBase,
    zIndex: 1,
});

// 武将技能展示
WinMgr.I.addConfig({
    id: ViewConst.GEquipTipsWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GEquipTipsWin,
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GEquipTipsWin') as WinBase,
    zIndex: 1,
});
// 武将-技能-选择
WinMgr.I.addConfig({
    id: ViewConst.GSkillChooseWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.GSkillChooseWin,
    childView: 'GSkillChooseWin',
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    title: i18n.tt(Lang.general_skill_title),
    size: cc.size(598, 860),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});
// 武将-技能-回收
WinMgr.I.addConfig({
    id: ViewConst.GSkillRecycleWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.GSkillRecycleWin,
    childView: 'GSkillRecycleWin',
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    title: i18n.tt(Lang.general_skill_title),
    size: cc.size(598, 640),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});
// 武将-技能-推荐
WinMgr.I.addConfig({
    id: ViewConst.GSkillRecomWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GSkillRecomWin,
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('GSkillRecomWin') as WinBase,
    zIndex: 1,
});
/** 羁绊 */
WinMgr.I.addConfig({
    id: ViewConst.GFetters,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.GFetters,
    childView: 'GFetters',
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    title: i18n.tt(Lang.general_fetters),
    size: cc.size(650, 860),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

/** 武将重生-选择 */
WinMgr.I.addConfig({
    id: ViewConst.GRebornChooseWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.GRebornChooseWin,
    childView: 'GRebornChooseWin',
    mid: ControllerIds.GeneralController,
    isShowAll: false,
    title: i18n.tt(Lang.general_reborn_title),
    size: cc.size(598, 830),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.GBookWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GBookWin,
    mid: ControllerIds.GeneralController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('GBookWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.GBookDetailWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GBookDetailWin,
    mid: ControllerIds.GeneralController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('GBookDetailWin') as BaseUiView,
});
