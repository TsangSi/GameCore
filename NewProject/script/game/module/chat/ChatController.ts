import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import { i18n, Lang } from '../../../i18n/i18n';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { E } from '../../const/EventName';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { ChatCdMgr } from './ChatCdMgr';
import {
    ChatShowItemType, ChatShowRang, CHAT_CHANNEL_ENUM, NoticeMsg,
} from './ChatConst';
import { NoticeMsgMgr } from './NoticeMsgMgr';

const { ccclass } = cc._decorator;
@ccclass('ChatController')
export class ChatController extends BaseController {
    public addNetEvent(): void {
        // 发送聊天信息
        EventProto.I.on(ProtoId.S2CPushChat_ID, this.onS2CPushChat, this);
        // 聊天列表
        EventProto.I.on(ProtoId.S2CGetHistoryChat_ID, this.onS2CGetHistoryChat, this);
        // 拉黑
        EventProto.I.on(ProtoId.S2CBlack_ID, this.onS2CBlack, this);
        // 公告
        EventProto.I.on(ProtoId.S2CSendNotice_ID, this.onS2CSendNotice, this);
        // 黑名单
        EventProto.I.on(ProtoId.S2CGetBlackList_ID, this.onS2CGetBlackList, this);
        // 展示物品
        EventProto.I.on(ProtoId.S2CShowItem_ID, this.onS2CShowItem, this);
    }

    public delNetEvent(): void {
        // 发送聊天信息
        EventProto.I.off(ProtoId.S2CPushChat_ID, this.onS2CPushChat, this);
        // 聊天列表
        EventProto.I.off(ProtoId.S2CGetHistoryChat_ID, this.onS2CGetHistoryChat, this);
        // 拉黑
        EventProto.I.off(ProtoId.S2CBlack_ID, this.onS2CBlack, this);
        // 公告
        EventProto.I.off(ProtoId.S2CSendNotice_ID, this.onS2CSendNotice, this);
        // 黑名单
        EventProto.I.off(ProtoId.S2CGetBlackList_ID, this.onS2CGetBlackList, this);
        // 展示物品
        EventProto.I.off(ProtoId.S2CShowItem_ID, this.onS2CShowItem, this);
    }

    public addClientEvent(): void {
        //
    }

    public delClientEvent(): void {
        //
    }

    public clearAll(): void {
        //
    }
    public init(): void {
        //
    }

    /** 俩天列表 */
    public getChatData(): void {
        const d: C2SGetHistoryChat = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetHistoryChat_ID, d);
    }

    private onS2CGetHistoryChat(data: S2CGetHistoryChat) {
        ModelMgr.I.ChatModel.setListData(data.Messages);
    }

    /**
     * 发送一个聊天信息
     *  atUid @用户的 userid
     * */
    public sendChatMsg(content: string, type: CHAT_CHANNEL_ENUM, atUid: number = 0, BigIcon: number = 0): void {
        if (type === 0) { // 当在全部发言时 改为世界发言
            type = 3;
        }
        const d: C2SSendChatMsg = {
            ChatType: type,
            Content: content,
            AtUserId: atUid,
            BigIcon,
        };
        NetMgr.I.sendMessage(ProtoId.C2SSendChatMsg_ID, d);
    }

    /** 收到新的聊天信息 */
    private onS2CPushChat(data: S2CPushChat) {
        if (data.ChatData.length > 0) {
            ModelMgr.I.ChatModel.addListData(data.ChatData);

            /** 过滤世家相关 */
            const showMsgs: ChatData[] = [];
            data.ChatData.forEach((a) => {
                if (ModelMgr.I.ChatModel.msgCanAdd(a)) {
                    showMsgs.push(a);
                }
            });

            EventClient.I.emit(E.Chat.UpdateChatList, showMsgs);
            // 首页刷新
            EventClient.I.emit(E.Chat.LobbyMsgUpdate, data.ChatData);
        } else {
            console.log('收到的聊天信息为空');
        }
    }

    /**
     * 拉黑用户
     * type : 1拉黑 ，2取消拉黑
     */
    public deleteUser(type: number, uid: number): void {
        const d: C2SBlack = {
            Typ: type,
            UserId: uid,
        };
        NetMgr.I.sendMessage(ProtoId.C2SBlack_ID, d);
    }

    public onS2CBlack(data: S2CBlack): void {
        const typ = data.Typ;
        if (typ === 1) {
            this.isBlackOperate = true;
            MsgToastMgr.Show(i18n.tt(Lang.chat_black_success));
        } else {
            this.isBlackOperate = false;
        }
        this.getBlackList();
    }

    /** 获取黑名单 */
    public getBlackList(): void {
        const d = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetBlackList_ID, d);
    }

    private isBlackOperate = false;
    public onS2CGetBlackList(data: S2CGetBlackList): void {
        ModelMgr.I.ChatModel.setBlackList(data);
        if (!this.isBlackOperate) {
            EventClient.I.emit(E.Chat.UpdateChatList);
        }
    }

    /**
     * 收到一条公告信息
     * @param data 公告内容
     */
    private onS2CSendNotice(data: S2CSendNotice) {
        const notice: NoticeMsg = ModelMgr.I.ChatModel.GetNotice(data, UtilColor.WhiteD);
        ModelMgr.I.ChatModel.addSysNoticeData(notice);
        EventClient.I.emit(E.Chat.UpdateChatList, [notice]);
        this.noticeMessage(notice);
    }

    /** 收到一条公告消息 */
    public noticeMessage(dta: NoticeMsg): void {
        const range = dta.cfg.Range_Client.split('|');
        // 枚举值为字符串
        const index = range.indexOf(ChatShowRang.Marquee);
        if (index >= 0) {
            // 需要显示在跑马灯内
            NoticeMsgMgr.I.insertMsg(dta.cfg, dta.msg);
        }
        EventClient.I.emit(E.Chat.LobbyMsgUpdate, dta);
    }

    /**
     * 展示一个物品至聊天栏
     * @param itemType 物品类型 （如道具、装备、称号...)
     * @param itemId 物品id (物品唯一id)
     * @param channalType 聊天频道
     */
    public showItem(itemType: ChatShowItemType, OnlyId: string | number, channalType: CHAT_CHANNEL_ENUM = CHAT_CHANNEL_ENUM.World): void {
        // 展示物品至聊天栏
        if (!ChatCdMgr.I.canWorldSend) {
            MsgToastMgr.Show(i18n.tt(Lang.chat_cd_tip));
            return;
        }
        switch (itemType) {
            case ChatShowItemType.team:
                MsgToastMgr.Show(i18n.tt(Lang.com_show_say_success));
                break;
            case ChatShowItemType.plot:
                MsgToastMgr.Show(i18n.tt(Lang.com_show_share_success));
                break;
            default:
                MsgToastMgr.Show(i18n.tt(Lang.com_show_success));
                break;
        }
        ChatCdMgr.I.resetWorldCd();

        let oid = 0;
        let oids = '';
        if (typeof OnlyId === 'number') {
            oid = OnlyId;
        } else {
            oids = OnlyId;
        }
        const d: C2SShowItem = {
            ChatType: channalType,
            Type: itemType,
            Param1: oid,
            Param2: oids,
        };
        console.log('物品分享参数', d);

        NetMgr.I.sendMessage(ProtoId.C2SShowItem_ID, d);
    }

    private onS2CShowItem(d): void {
        console.log('展示物品成功', d);
    }
}
