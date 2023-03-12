/*
 * @Author: myl
 * @Date: 2022-11-24 10:17:46
 * @Description:
 */

export enum FriendPageType {
    /** 好友界面 */
    Friend,
}

export enum FriendViewType {
    /** 好友列表 */
    FriendList = 1,
    /** 好友申请列表 */
    FriendApplyList = 2,
}

/** 好友中私聊信息本地存储
 *  列表中有没有红点根据本地的信息来做处理
*/
export const FriendChatStorageKey = 'FriendChatStorageKey';
/** 私聊红点 */
export const FriendChatRedStorageKey = 'FriendChatRedStorageKey';

export type FriendChatModel = { data: FriendPrivateChatInfo, info: RelationPlayerData }

/** 每日最大可领取礼物次数 */
export const MaxGiftNum = 10;
