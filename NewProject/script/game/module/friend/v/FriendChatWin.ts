/*
 * @Author: myl
 * @Date: 2022-11-24 10:22:58
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { FriendChatModel } from '../FriendConst';
import FriendChatItem from './FriendChatItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendChatWin extends WinBase {
    @property(ListView)
    private list: ListView = null;

    private _data: RelationPlayerData = null;

    @property(cc.Node)
    private BtnSender: cc.Node = null;

    @property(cc.Label)
    private LabNick: cc.Label = null;
    @property(cc.EditBox)
    private EdBox: cc.EditBox = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    private _listData: FriendChatModel[] = [];

    protected start(): void {
        super.start();
        UtilGame.Click(this.node, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.BtnSender, () => {
            if (this.EdBox.string.length < 1) {
                MsgToastMgr.Show(i18n.tt(Lang.friend_chat_null_tip));
                return;
            }
            ControllerMgr.I.FriendController.sendMsg(this.EdBox.string, this._data.UserId);
        }, this);
        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
    }

    public init(param: unknown[]): void {
        super.init(param);
        EventClient.I.on(E.Friend.ChatMsg, this.msgUpdate, this);
        this._data = param[0] as RelationPlayerData;

        this.LabNick.string = `${i18n.tt(Lang.friend_yu)}${this._data.Name}${i18n.tt(Lang.friend_chatting)}`;
        // this.list.setNumItems(this._data.PrivateChatList.length);
        const lists1 = ModelMgr.I.FriendModel.getFriendChatData(this._data.UserId);
        for (let j = 0; j < lists1.length; j++) {
            const element = lists1[j];
            const d = { data: element, info: this._data };
            this._listData.push(d);
        }

        for (let i = 0; i < this._data.PrivateChatList.length; i++) {
            const element = this._data.PrivateChatList[i];
            const d = { data: element, info: this._data };
            this._listData.push(d);
        }
        // this._listData = this._data.PrivateChatList;
        this.list.setNumItems(this._listData.length);
        this.list.scrollTo(this._listData.length - 1);
    }

    private scrollEvent(nd: cc.Node, index: number): void {
        const item = nd.getComponent(FriendChatItem);
        item.setData(this._listData[index]);
    }

    /** 收到聊天信息 */
    public msgUpdate(dta: FriendPrivateChatInfo): void {
        if (dta.SendUserId === this._data.UserId || dta.ReceiveUserId === this._data.UserId) {
            // 当前自己的聊天信息
            const dt = { data: dta, info: this._data };
            this._listData.push(dt);
            this.list.setNumItems(this._listData.length);
            this.list.scrollTo(this._listData.length - 1);
        } else {
            // 其他人的私聊信息 刷新外部列表红点(只用做界面处理就可以)
            ModelMgr.I.FriendModel.UpdateCacheRed(dta); // 更新为有红点状态
        }
        ModelMgr.I.FriendModel.addChatData(dta);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Friend.ChatMsg, this.msgUpdate, this);
    }
}
