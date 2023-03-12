/*
 * @Author: kexd
 * @Date: 2022-06-15 11:54:18
 * @FilePath: \SanGuo2.4\assets\script\game\module\title\TitleVoCfg.ts
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
    id: ViewConst.TitleWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.TitleWin,
    mid: ControllerIds.TitleController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('TitleWin') as BaseUiView,
});

WinMgr.I.addConfig({
    id: ViewConst.TitleDetail,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.TitleDetail,
    childView: 'TitleDetail',
    mid: ControllerIds.TitleController,
    isShowAll: false,
    title: i18n.tt(Lang.title_title),
    size: cc.size(650, 964),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});
