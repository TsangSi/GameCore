/*
 * @Author: myl
 * @Date: 2022-11-24 10:16:21
 * @Description:
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { RoleMgr } from '../role/RoleMgr';
import { FriendViewType } from './FriendConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendController extends BaseController {
    public addNetEvent(): void {
        // 获取好友列表/好友申请列表
        EventProto.I.on(ProtoId.S2CRelationInfo_ID, this.onS2CRelationInfo, this);
        // 申请添加好友
        EventProto.I.on(ProtoId.S2CApplyAddFriend_ID, this.onS2CApplyAddFriend, this);
        // 好友申请回复(同意或者拒绝)
        EventProto.I.on(ProtoId.S2CApplyOperation_ID, this.onS2CApplyOperation, this);
        // 删除好友
        EventProto.I.on(ProtoId.S2CDelFriend_ID, this.onS2CDelFriend, this);
        // 赠送好友礼物
        EventProto.I.on(ProtoId.S2CFriendGifts_ID, this.onS2CFriendGifts, this);
        // 领取好友送礼
        EventProto.I.on(ProtoId.S2CGetFriendGifts_ID, this.onS2CGetFriendGifts, this);
        // 查询列表
        EventProto.I.on(ProtoId.S2CFindPlayerInfo_ID, this.onS2CFindPlayerInfo, this);
        // 推荐好友列表
        EventProto.I.on(ProtoId.S2CRecommendList_ID, this.onS2CRecommendList, this);
        // 这个是不是同意之后更新列表用的
        EventProto.I.on(ProtoId.S2CAddRelation_ID, this.onS2CAddRelation, this);
        // 好友聊天列表
        EventProto.I.on(ProtoId.S2CFriendPrivateChat_ID, this.onS2CFriendPrivateChat, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CRelationInfo_ID, this.onS2CRelationInfo, this);
        EventProto.I.off(ProtoId.S2CApplyAddFriend_ID, this.onS2CApplyAddFriend, this);
        EventProto.I.off(ProtoId.S2CApplyOperation_ID, this.onS2CApplyOperation, this);
        EventProto.I.off(ProtoId.S2CDelFriend_ID, this.onS2CDelFriend, this);
        EventProto.I.off(ProtoId.S2CFriendGifts_ID, this.onS2CFriendGifts, this);
        EventProto.I.off(ProtoId.S2CFindPlayerInfo_ID, this.onS2CFindPlayerInfo, this);
        EventProto.I.off(ProtoId.S2CRecommendList_ID, this.onS2CRecommendList, this);
        EventProto.I.off(ProtoId.S2CAddRelation_ID, this.onS2CAddRelation, this);
        EventProto.I.off(ProtoId.S2CGetFriendGifts_ID, this.onS2CGetFriendGifts, this);
        EventProto.I.off(ProtoId.S2CFriendPrivateChat_ID, this.onS2CFriendPrivateChat, this);
    }

    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.gameStart, this);
    }
    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.gameStart, this);
    }
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }
    private gameStart() {
        // 进入游戏计算红点
        ModelMgr.I.FriendModel.ChatRed();
    }

    /** 获取好友列表 */
    public GetFriendList(Relationype: FriendViewType = FriendViewType.FriendList): void {
        const d: C2SRelationInfo = {
            Relationype,
        };
        NetMgr.I.sendMessage(ProtoId.C2SRelationInfo_ID, d);
    }

    /** 赠送礼物 */
    public GiveGift(uid: number): void {
        const d: C2SFriendGifts = {
            UserId: uid,
        };
        NetMgr.I.sendMessage(ProtoId.C2SFriendGifts_ID, d);
    }

    /** 收取礼物 */
    public GetGift(uid: number): void {
        const d: C2SGetFriendGifts = {
            UserId: uid,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetFriendGifts_ID, d);
    }

    /** 获取推荐好友 */
    public recommendList(): void {
        const d: C2SRecommendList = {

        };
        NetMgr.I.sendMessage(ProtoId.C2SRecommendList_ID, d);
    }

    /** 申请添加其他人为好友 */
    public addApply(uId: number): void {
        const d: C2SApplyAddFriend = {
            UserId: uId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SApplyAddFriend_ID, d);
    }

    /** 删除好友 */
    public DelFriend(uId: number): void {
        const d: C2SDelFriend = {
            UserId: uId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SDelFriend_ID, d);
    }

    /** 统一或者拒绝一个添加 */
    public agreeOrRefuse(id: number, type: number): void {
        const d: C2SApplyOperation = {
            UserId: id,
            Opt: type,
        };
        NetMgr.I.sendMessage(ProtoId.C2SApplyOperation_ID, d);
    }

    /** 搜索添加 */
    public searchFriend(keyword: string): void {
        const d: C2SFindPlayerInfo = {
            FindInfo: keyword,
        };
        NetMgr.I.sendMessage(ProtoId.C2SFindPlayerInfo_ID, d);
    }

    private onS2CRelationInfo(data: S2CRelationInfo): void {
        if (data && data.Tag === 0) {
            ModelMgr.I.FriendModel.giftNum = data.FetchGiftCount;
            ModelMgr.I.FriendModel.setFriendList(data);
            // 好友列表
        }
    }

    private onS2CApplyAddFriend(data: S2CApplyAddFriend): void {
        // 好友申请
        if (data.Tag === null || data.Tag === 0) {
            //
            MsgToastMgr.Show(i18n.tt(Lang.friend_apply_success));
        } else {
            //
        }
    }

    private onS2CApplyOperation(data: S2CApplyOperation): void {
        // 好友申请处理
        this.GetFriendList(FriendViewType.FriendApplyList);
    }

    private onS2CDelFriend(data: S2CDelFriend): void {
        // 删除
        ModelMgr.I.FriendModel.delFriend(data.UserId);
        MsgToastMgr.Show(i18n.tt(Lang.friend_del_success));
    }

    private onS2CFriendGifts(data: S2CFriendGifts): void {
        // 赠送礼物
        if (data.Tag === null || data.Tag === 0) {
            if (data.PlayerData.UserId === RoleMgr.I.d.UserId) {
                MsgToastMgr.Show(i18n.tt(Lang.friend_gift_tip));
            } else {
                // 如果是在当前界面 则要处理刷新列表
                this.GetFriendList(FriendViewType.FriendList);
            }
        }
    }

    private onS2CGetFriendGifts(data: S2CGetFriendGifts): void {
        // 收到礼物
        this.GetFriendList(FriendViewType.FriendList);
    }

    private onS2CFindPlayerInfo(data: S2CFindPlayerInfo): void {
        // 查询
        ModelMgr.I.FriendModel.findList = data.PlayerData;
    }

    private onS2CRecommendList(data: S2CRecommendList): void {
        // 推荐
        ModelMgr.I.FriendModel.recommendList = data.PlayerDataList;
    }

    private onS2CAddRelation(data: S2CAddRelation): void {
        // 同意/拒绝 添加好友
        // MsgToastMgr.Show(i18n.tt(Lang.friend_add_success));
        // ModelMgr.I.FriendModel.removeApplyItem(data.PlayerData);
    }

    public sendMsg(content: string, userId: number): void {
        const d: C2SFriendPrivateChat = {
            FriendUserId: userId,
            Content: content,
        };
        NetMgr.I.sendMessage(ProtoId.C2SFriendPrivateChat_ID, d);
    }
    private onS2CFriendPrivateChat(data: S2CFriendPrivateChat): void {
        if (data && data.Tag === 0) {
            // 好友聊天
            if (WinMgr.I.checkIsOpen(ViewConst.FriendChatWin)) {
                EventClient.I.emit(E.Friend.ChatMsg, data.ChatData);
            } else {
                ModelMgr.I.FriendModel.addChatData(data.ChatData);
                ModelMgr.I.FriendModel.UpdateCacheRed(data.ChatData);
            }
        }
    }
}
