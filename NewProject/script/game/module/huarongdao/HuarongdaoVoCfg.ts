/*
 * @Author: lijun
 * @Date: 2023-02-20 21:29:23
 * @Description:
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { WinSmallType } from '../../com/win/WinSmall';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

// 华容道支持
WinMgr.I.addConfig({
    id: ViewConst.HuarongdaoSupport,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.HuarongdaoSupport,
    childView: 'HuarongdaoSupport',
    mid: ControllerIds.HuarongdaoController,
    isShowAll: false,
    title: i18n.tt(Lang.huarongdao_support_title),
    size: cc.size(661, 409),
    winSmallType: WinSmallType.TypeA,
    isShowTips: false,
    isBlackClose: true,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 华容道记录
WinMgr.I.addConfig({
    id: ViewConst.HuarongdaoRecord,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.HuarongdaoRecord,
    childView: 'HuarongdaoRecord',
    mid: ControllerIds.HuarongdaoController,
    isShowAll: false,
    title: i18n.tt(Lang.huarongdao_record_title),
    size: cc.size(682, 808),
    winSmallType: WinSmallType.TypeC,
    isShowTips: false,
    isBlackClose: true,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});

// 华容道礼券购买
WinMgr.I.addConfig({
    id: ViewConst.HuarongdaoGiftBuy,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.WinSmall,
    childPath: UI_PATH_ENUM.HuarongdaoGiftBuy,
    childView: 'HuarongdaoGiftBuy',
    mid: ControllerIds.HuarongdaoController,
    isShowAll: false,
    title: i18n.tt(Lang.huarongdao_gift_buy_title),
    size: cc.size(661, 409),
    winSmallType: WinSmallType.TypeA,
    isShowTips: false,
    isBlackClose: true,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('WinSmall') as BaseUiView,
});
