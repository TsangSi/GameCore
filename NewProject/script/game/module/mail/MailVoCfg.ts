/*
 * @Author: kexd
 * @Date: 2022-06-15 11:54:18
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\mail\MailVoCfg.ts
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

WinMgr.I.addConfig({
    id: ViewConst.MailDetail,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.MailDetail,
    childView: 'MailDetail',
    mid: ControllerIds.MailController,
    isShowAll: false,
    title: i18n.tt(Lang.mail_title),
    size: cc.size(650, 652),
    winSmallType: WinSmallType.TypeC,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});
