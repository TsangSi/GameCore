/*
 * @Author: wx
 * @Date: 2022-07-08 19:43:20
 * @FilePath: \SanGuo\assets\script\game\module\gradeGift\GradeGiftVoCfg.ts
 * @Description: 进阶视图配置
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
    id: ViewConst.GradeGiftPage,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.GradeController,
    childPath: UI_PATH_ENUM.GradeGiftPage,
    childView: 'GradeGiftPage',
    title: i18n.tt(Lang.grade_gift),
    size: cc.size(720, 1060),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});

WinMgr.I.addConfig({
    id: ViewConst.GradeGiftWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.GradeGiftWin,
    mid: ControllerIds.GradeController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('GradeGiftWin') as BaseUiView,
});
