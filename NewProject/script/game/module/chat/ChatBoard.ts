/*
 * @Author: hwx
 * @Date: 2022-05-17 14:20:21
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-08 11:55:07
 * @FilePath: \SanGuo\assets\script\game\module\chat\ChatBoard.ts
 * @Description: 大厅聊天看板
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilRichString } from '../../../app/base/utils/UtilRichString';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { UtilGame } from '../../base/utils/UtilGame';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import { CHAT_CHANNEL_ENUM, NoticeMsg } from './ChatConst';
import { NoticeMsgMgr } from './NoticeMsgMgr';
import { ChatItem } from './v/ChatItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatBoard extends BaseCmp {
    @property({ type: cc.Node })
    private NdAtMe: cc.Node = null;

    @property({ type: cc.Node })
    private BtnAtMe: cc.Node = null;

    @property({ type: cc.Prefab })
    private itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    private NdContent: cc.Node = null;
    @property(cc.Node)
    private NdContainer: cc.Node = null;

    /** 展示的内容 最多2条 */
    private _contentList: Array<ChatData | NoticeMsg> = [];

    private node_pool: cc.NodePool = new cc.NodePool();
    public onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnAtMe, this.clickMe, this);
        EventClient.I.on(E.Chat.ConnectUser, this.someoneCallMe, this);
        EventClient.I.on(E.Chat.LobbyMsgUpdate, this.updateData, this);
        EventClient.I.on(E.Chat.ShowNoticeWin, this.openNoticeWin, this);

        // 请求黑名单 前端处理过滤
        ControllerMgr.I.ChatController.getBlackList();
        // 获取聊天列表
        ControllerMgr.I.ChatController.getChatData();
    }

    public closeAtMe(): void {
        this.clickMe();
    }

    private openNoticeWin() {
        if (!WinMgr.I.checkIsOpen(ViewConst.NoticeWin)) {
            WinMgr.I.open(ViewConst.NoticeWin);
        }
    }

    private getItem(): cc.Node {
        let nd = this.node_pool.get();
        if (!nd) {
            nd = cc.instantiate(this.itemPrefab);
        }
        return nd;
    }

    private pushData(chatData: ChatData | NoticeMsg): void {
        if (chatData) {
            this._contentList.push(chatData);
        }
        if (this._contentList.length > 2) {
            this._contentList.shift();
        }
    }

    protected start(): void {
        super.start();
        NoticeMsgMgr.I.defaultPlay();
        // 获取登录时未播放的系统消息
        const hisChatData = ModelMgr.I.ChatModel.sysListData;
        hisChatData.forEach((sysHistoryMsg) => {
            this.updateData(sysHistoryMsg);
        });
    }

    private updateData(dta: ChatData[] | NoticeMsg) {
        const blackListIds = ModelMgr.I.ChatModel.blackListIds;
        if (dta instanceof Array) {
            dta.forEach((elemt) => {
                if (elemt && elemt.SenderInfo && blackListIds.indexOf(elemt.SenderInfo.UserId) < 0) {
                    if (elemt.ChatType === CHAT_CHANNEL_ENUM.Current && !UtilFunOpen.isOpen(FuncId.FamilyHome)) {
                        // 不接收世家消息
                    } else {
                        this.pushData(elemt);
                    }
                }
            });
        } else {
            this.pushData(dta);
        }
        this.updateUI();
    }

    private _canRef = true;
    public updateUI(): void {
        if (!this._canRef) {
            return;
        }
        this._canRef = false;
        this.scheduleOnce(() => {
            this._canRef = true;
        }, 0.3);
        if (!cc.isValid(this.node)) {
            return;
        }
        const len = this.NdContent.children.length;
        for (let i = 0; i < len; i++) {
            const childNd = this.NdContent.children[0];
            this.node_pool.put(childNd);
        }

        if (this._contentList.length === 1) {
            const itm = this._contentList[0];
            const nd = this.getItem();
            const ctm = nd.getComponent(ChatItem);
            if (ctm) {
                this.NdContent.addChild(nd);
                ctm.setLobby(itm);
            } else {
                //
            }
        } else {
            if (this._contentList.length <= 0) return;
            const itm = this._contentList[0];
            const nd = this.getItem();
            const ctm = nd.getComponent(ChatItem);
            const showString = ctm.setLobby(itm);
            const cfg = {
                fSize: 18,
                maxWidth: 520,
                lineHeight: 25,
                richString: showString, // UtilRichString.RichPureText(showString),
                tipImgWidth: 58,
                emojiWidth: 35,
            };
            const lineNum = UtilRichString.RichStringLineNumWithConfig(cfg);
            const itm1 = this._contentList[1];
            const nd1 = this.getItem();
            const ctm1 = nd1.getComponent(ChatItem);
            const showString1 = ctm1.setLobby(itm1);
            const cfg1 = {
                fSize: 18,
                maxWidth: 520,
                lineHeight: 25,
                richString: showString1, // UtilRichString.RichPureText(showString1),
                tipImgWidth: 58,
                emojiWidth: 35,
            };
            const lineNum1 = UtilRichString.RichStringLineNumWithConfig(cfg1);
            if (lineNum === 1 && lineNum1 === 1) {
                this.NdContent.addChild(nd);
                this.NdContent.addChild(nd1);
            } else {
                this.NdContent.addChild(nd1);
            }
        }

        this.updateLayout();
    }

    private updateLayout() {
        // this.NdContent.getComponent(cc.Layout).updateLayout();
        // const containerHeight = this.NdContainer.height;
        // const contentHeight = this.NdContent.height;
        // const containerLayout = this.NdContainer.getComponent(cc.Layout);
        // if (contentHeight < containerHeight) {
        //     containerLayout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
        // } else {
        //     containerLayout.verticalDirection = cc.Layout.VerticalDirection.BOTTOM_TO_TOP;
        // }

        // containerLayout.updateLayout();

    }

    private _chatData: ChatData = null;
    private someoneCallMe(data: ChatData) {
        console.log('data=', data);

        if (!WinMgr.I.checkIsOpen(ViewConst.ChatWin)) {
            this.NdAtMe.active = true;
            this._chatData = data;
        }
    }

    private clickMe() {
        if (this._chatData === null) {
            // 默认跳转世界频道
            WinMgr.I.open(ViewConst.ChatWin);
            return;
        }
        this.NdAtMe.active = false;
        // 传递的参数为 频道类型和滚动位置
        const chatType = this._chatData.ChatType;
        const cl = ModelMgr.I.ChatModel.searchListType(1); // 当前世界频道
        const chatMsgIndex = cl.indexOf(this._chatData);
        console.log(chatMsgIndex, cl.length);

        WinMgr.I.open(ViewConst.ChatWin, chatType, chatMsgIndex);
        this._chatData = null;
    }

    public close(): void {
        super.close();
        EventClient.I.off(E.Chat.LobbyMsgUpdate, this.updateData, this);
        EventClient.I.off(E.Chat.ConnectUser, this.someoneCallMe, this);
        EventClient.I.off(E.Chat.ShowNoticeWin, this.openNoticeWin, this);
    }
}
