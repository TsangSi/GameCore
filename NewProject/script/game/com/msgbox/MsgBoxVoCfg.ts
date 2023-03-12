import { PopupType } from '../../../app/core/mvc/BaseVo';
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';
import WinBase from '../win/WinBase';

/*
 * @Author: zs
 * @Date: 2022-06-14 16:49:17
 * @FilePath: \SanGuo2.4\assets\script\game\com\msgbox\MsgBoxVoCfg.ts
 * @Description:
 */
WinMgr.I.addConfig({
    id: ViewConst.ConfirmBox,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    mid: ControllerIds.ExchangeController,
    childPath: UI_PATH_ENUM.ConfirmBox,
    childView: 'ConfirmBox',
    title: i18n.tt(Lang.com_tips),
    size: cc.size(720, 420),
    isShowAll: false,
    isPopup: PopupType.Last,
    resClass: (node: cc.Node): WinBase => node.getComponent('WinSmall') as WinBase,
});
