/*
 * @Author: wangxin
 * @Date: 2022-09-28 15:11:36
 * @FilePath: \SanGuo2.4\assets\script\game\module\DaySign\DaySignVoCfg.ts
 */
import { GameLayerEnum } from '../../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import WinBase from '../../../../com/win/WinBase';
import { ControllerIds } from '../../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.DaySignRe,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.GradeController,
    childPath: UI_PATH_ENUM.DaySignRe,
    childView: 'DaySignRe',
    title: i18n.tt(Lang.day_resign),
    size: cc.size(650, 595),
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});
