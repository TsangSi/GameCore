/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: myl
 * @Date: 2022-11-24 10:16:13
 * @Description:
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { StorageMgr } from '../../../app/base/manager/StorageMgr';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { E } from '../../const/EventName';
import { RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleMgr } from '../role/RoleMgr';
import { FriendChatRedStorageKey, FriendChatStorageKey, FriendViewType } from './FriendConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendModel extends BaseModel {
    public clearAll(): void {
        //
    }
    // 好友列表
    private friendList: RelationPlayerData[] = [];
    // 好友申请列表
    private friendApplyList: RelationPlayerData[] = [];
    // 推荐列表
    private _recommendList: RelationPlayerData[] = [];
    // 查询列表
    private _findList: RelationPlayerData[] = [];

    /** 获取到好友或者申请列表 */
    public setFriendList(data: S2CRelationInfo): void {
        if (data.Relationype === FriendViewType.FriendList) {
            // 判断聊天红点
            for (let i = 0; i < data.PlayerInfoList.length; i++) {
                const element = data.PlayerInfoList[i];
                if (element.PrivateChatList.length > 0) {
                    // 有红点
                    this.UpdateCacheRed(element.PrivateChatList[i]);
                    this.addChatDatas(element.PrivateChatList); // 做存储
                } else {
                    // this.clearCacheRed(element.UserId);
                }
            }
            this.friendList = data.PlayerInfoList;
            this.friendList.sort(
                (param1, param2) => param1.Name.localeCompare(param2.Name, 'zh'),
            );
            this.friendList.sort((a, b) => a.Online - b.Online);
        } else {
            this.friendApplyList = data.PlayerInfoList;
            this.friendApplyList.sort((a, b) => a.Online - b.Online);
        }
        EventClient.I.emit(E.Friend.List, data.Relationype);
    }

    public removeApplyItem(item: RelationPlayerData): void {
        const index = this.friendApplyList.indexOf(item);
        this.friendList.splice(index, 1);
        EventClient.I.emit(E.Friend.List, FriendViewType.FriendApplyList);
    }

    /** 删除一个好友 */
    public delFriend(id: number): void {
        let relationData: RelationPlayerData = null;
        this.friendList.forEach((friend) => {
            if (friend.UserId === id) {
                relationData = friend;
            }
        });
        if (relationData) {
            const index = this.friendList.indexOf(relationData);
            this.friendList.splice(index, 1);
            EventClient.I.emit(E.Friend.List);
        }
    }

    public getFriendList(type: FriendViewType = FriendViewType.FriendList): RelationPlayerData[] {
        return type === FriendViewType.FriendList ? this.friendList : this.friendApplyList;
    }

    public set recommendList(v: RelationPlayerData[]) {
        this._recommendList = v;
        EventClient.I.emit(E.Friend.RecommendList);
    }

    public get recommendList(): RelationPlayerData[] {
        return this._recommendList;
    }

    public set findList(v: RelationPlayerData[]) {
        this._findList = v;
        EventClient.I.emit(E.Friend.Find);
    }

    public get findList(): RelationPlayerData[] {
        return this._findList;
    }

    // 添加聊天数据到缓存里面
    public addChatDatas(data: FriendPrivateChatInfo[]): void {
        for (let i = 0; i < data.length; i++) {
            const dta = data[i];
            this.addChatData(dta);
        }
    }

    /**
     * 通过 userId ：data列表处理存储
     */
    // 好友聊天列表是在好友列表中嵌套的所以处理在好友列表中 (以收发者的id组成唯一字符)

    public addChatData(data: FriendPrivateChatInfo): void {
        const cacheMsg: string = StorageMgr.I.getValue(`${FriendChatStorageKey}_${RoleMgr.I.d.UserId}`, '');
        const cacheMap = cacheMsg.length > 10 ? JSON.parse(cacheMsg) : {};
        const key = data.SendUserId === RoleMgr.I.d.UserId ? data.ReceiveUserId : data.SendUserId;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        let storeInfo: FriendPrivateChatInfo[] = cacheMap[key];
        if (storeInfo) {
            storeInfo.push(data);
        } else {
            storeInfo = [data];
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        cacheMap[key] = storeInfo;
        StorageMgr.I.setValue(`${FriendChatStorageKey}_${RoleMgr.I.d.UserId}`, JSON.stringify(cacheMap));
    }

    /** 从缓存中读取历史的列表数据 */
    public getChatDataFromCache(): any {
        const cacheMsg: string = StorageMgr.I.getValue(`${FriendChatStorageKey}_${RoleMgr.I.d.UserId}`, '');
        const cacheMap = cacheMsg.length > 10 ? JSON.parse(cacheMsg) : new Map();
        return cacheMap;
    }

    /** 获取好友聊天信息 */
    public getFriendChatData(FriendUserId: number): FriendPrivateChatInfo[] {
        const map = this.getChatDataFromCache();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        const list = map[FriendUserId] as FriendPrivateChatInfo[];
        if (!list) {
            return [];
        }
        const result: FriendPrivateChatInfo[] = [];
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            const mod = new FriendPrivateChatInfo(element);
            result.push(mod);
        }
        return result;
    }

    /**
     * 私聊红点原则  当列表里面有数据 或者 本地缓存里面有数据就显示红点
     * @param data
     */
    public UpdateCacheRed(data: FriendPrivateChatInfo): void {
        const key = data.SendUserId === RoleMgr.I.d.UserId ? data.ReceiveUserId : data.SendUserId;
        const cacheMsg: string = StorageMgr.I.getValue(`${FriendChatRedStorageKey}_${RoleMgr.I.d.UserId}`, '');
        const cacheMap = cacheMsg.length > 10 ? JSON.parse(cacheMsg) : {};
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const red = cacheMap[key];
        if (!red) {
            cacheMap[key] = 1;
        }
        StorageMgr.I.setValue(`${FriendChatRedStorageKey}_${RoleMgr.I.d.UserId}`, JSON.stringify(cacheMap));
        EventClient.I.emit(E.Friend.ChatRed, data); // 发送事件修改界面红点

        const redDot = RedDotMgr.I;
        if (redDot.getStatus(RID.More.Friend.MyFriend.Chat)) {
            // 本就是红点 不处理页签红点
        } else {
            RedDotMgr.I.updateRedDot(RID.More.Friend.MyFriend.Chat, true);
        }
    }

    /**
     * 清除掉一个好友聊天的红点 (当点击该聊天按钮的时候)
     * @param FriendUserId
     */
    public clearCacheRed(FriendUserId: number): void {
        const cacheMsg: string = StorageMgr.I.getValue(`${FriendChatRedStorageKey}_${RoleMgr.I.d.UserId}`, '');
        const cacheMap = cacheMsg.length > 10 ? JSON.parse(cacheMsg) : {};
        cacheMap[FriendUserId] = 0;
        StorageMgr.I.setValue(`${FriendChatRedStorageKey}_${RoleMgr.I.d.UserId}`, JSON.stringify(cacheMap));
        EventClient.I.emit(E.Friend.ChatRed); // 发送事件修改界面红点
        let redState = false;
        for (const key in cacheMap) {
            if (cacheMap[key] === 1) {
                redState = true;
                break;
            }
        }
        RedDotMgr.I.updateRedDot(RID.More.Friend.MyFriend.Chat, redState);
    }

    public getCacheRed(FriendUserId: number): boolean {
        const cacheMsg: string = StorageMgr.I.getValue(`${FriendChatRedStorageKey}_${RoleMgr.I.d.UserId}`, '');
        const cacheMap = cacheMsg.length > 10 ? JSON.parse(cacheMsg) : {};
        const red = cacheMap[FriendUserId];
        if (red === 1) {
            return true;
        } else {
            return false;
        }
    }

    /** 初始计算聊天红点 */
    public ChatRed(): void {
        const cacheMsg: string = StorageMgr.I.getValue(`${FriendChatRedStorageKey}_${RoleMgr.I.d.UserId}`, '');
        const cacheMap = cacheMsg.length > 10 ? JSON.parse(cacheMsg) : {};
        let redState = false;
        for (const key in cacheMap) {
            if (cacheMap[key] === 1) {
                redState = true;
                break;
            }
        }
        RedDotMgr.I.updateRedDot(RID.More.Friend.MyFriend.Chat, redState);
    }

    private _giftNum: number = 0;
    /** 收礼物次数 */
    public get giftNum(): number {
        return this._giftNum;
    }

    public set giftNum(v: number) {
        this._giftNum = v;
    }
}
