import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

const { ccclass, property } = cc._decorator;

WinMgr.I.addConfig({
    id: ViewConst.ChatWin,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ChatWin,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('ChatWin') as BaseUiView,
    mid: ControllerIds.ChatController,
    isShowAll: false,
});

WinMgr.I.addConfig({
    id: ViewConst.ChatEmoji,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.ChatEmoji,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('ChatEmojiView') as BaseUiView,
    mid: ControllerIds.ChatController,
    isShowAll: false,
    backBgAlpha: 0.1,
    blackBgClickClose: true,
    blackBg: true,
});

WinMgr.I.addConfig({
    id: ViewConst.NoticeWin,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.NoticeWin,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('NoticeWin') as BaseUiView,
    mid: ControllerIds.ChatController,
    isShowAll: false,
    backBgAlpha: 0.1,
    blackBgClickClose: false,
    blackBg: false,

});
