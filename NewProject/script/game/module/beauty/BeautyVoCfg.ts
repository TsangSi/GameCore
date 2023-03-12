/*
 * @Author: zs
 * @Date: 2022-10-27 20:23:28
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\beauty\BeautyVoCfg.ts
 * @Description:
 *
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.BeautyWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.BeautyWin,
    mid: ControllerIds.BeautyController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('BeautyWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.BeautyTipsView,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.BeautyTipsView,
    mid: ControllerIds.BeautyController,
    isShowAll: false,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('BeautyTipsView') as BaseUiView,
});

export enum EBeautyIndexId {
    /** 等级 */
    Level = 0,
    /** 星级 */
    Star = 1,
    /** 才艺 */
    Grade = 2,
}
