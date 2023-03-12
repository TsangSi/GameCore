import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilRichString } from '../../../../app/base/utils/UtilRichString';
import BaseVo from '../../../../app/core/mvc/BaseVo';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import ScrollViewMult from '../../../base/components/listview/ScrollViewMult';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { ChatCdMgr } from '../ChatCdMgr';
import {
    CHAT_CHANNEL_ENUM, CHAT_DEFAULT_ITEM_HEIGHT_CONFIG, CHAT_RICH_NORMAL_CONFIG, CHAT_RICH_SYS_CONFIG, CHAT_SYS_ITEM_HEIGHT_CONFIG, NoticeMsg,
} from '../ChatConst';
import { ChatBlackListItem } from './ChatBlackListItem';
import { ChatDefaultItem } from './ChatDefaultItem';
import { ChatInputView } from './ChatInputView';
import { ChatMenuBar } from './ChatMenuBar';
import { ChatOperateView } from './ChatOperateView';
import { ChatSysItem } from './ChatSysItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatWin extends BaseUiView {
    @property({ type: cc.Node })
    private NdCloseButton: cc.Node = null;
    @property({ type: cc.Node })
    private NdBlackList: cc.Node = null;

    @property({ type: ScrollViewMult })
    private List: ScrollViewMult = null;

    @property({ type: ListView })
    private BlackList: ListView = null;

    @property({ type: cc.Label })
    private LabBlackListCount: cc.Label = null;

    @property({ type: cc.Node })
    private BtnScrollFooter: cc.Node = null;

    @property(cc.Node)
    private barNd: cc.Node = null;
    @property(cc.Node)
    private inputNd: cc.Node = null;
    @property(cc.Node)
    private unInputNd: cc.Node = null;

    /** 两种样式的item */
    private normalChatItem: cc.Node = null;
    private normalChatMeItem: cc.Node = null;
    private sysChatItem: cc.Node = null;

    private _selectType: CHAT_CHANNEL_ENUM = CHAT_CHANNEL_ENUM.All;
    private _scrollIndex: number = 0; // 滚动位置

    protected start(): void {
        super.start();
        EventClient.I.emit(E.Chat.LobbyShowBoard, false);
        EventClient.I.emit(E.Chat.OpenChatWinState, true);
        UtilGame.Click(this.NdCloseButton, () => {
            this.close();
        }, this);

        UtilGame.Click(this.BtnScrollFooter, () => {
            this.BtnScrollFooter.active = false;
            this.List.scrollToEnd(0.618);
        }, this);

        EventClient.I.on(E.Chat.ScanUserInfo, this.scan, this);
        EventClient.I.on(E.Chat.UpdateChatList, this.updateList, this);
        EventClient.I.on(E.Win.WinOpen, this.readyToClose, this);

        this.scheduleOnce(() => {
            /** 动态加载item */
            ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Chat_ChatDefaultIem, null, (err, nd: cc.Node) => {
                if (!err) {
                    this.normalChatItem = nd;
                    this.refreshList();
                }
            });
            ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Chat_ChatSysItem, null, (err, nd: cc.Node) => {
                if (!err) {
                    this.sysChatItem = nd;
                    this.refreshList();
                }
            });

            ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Chat_ChatDefaultMeIem, null, (err, nd: cc.Node) => {
                if (!err) {
                    this.normalChatMeItem = nd;
                    this.refreshList();
                }
            });

            // input
            ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Chat_ChatInputView, this.inputNd, (err, nd: cc.Node) => {
                if (!err) {
                    const input = nd.getComponent(ChatInputView);
                    input.configSendCallBack((msg: string, atuid: number, BigIcon: number) => {
                        this.sendMsg(msg, atuid, BigIcon);
                    });
                }
            });
        }, 0.1);
    }

    public init(param: unknown[]): void {
        super.init(param);
        // 频道类型  默认为全服频道
        const args1 = param[0] ? Number(param[0]) : ModelMgr.I.ChatModel.currentChatChannel;
        // 滚动位置 默认为滚动到顶部
        const args2 = param[1] ? param[1] : 0;
        this._scrollIndex = Number(args2);

        /** 注意事件的注册 一定要在set数据之前 */
        this.List.registerNodeGetCall(this.differentItem.bind(this));
        this.List.registerItemNodeHeightCall(this.itemHeight.bind(this));

        // this.scheduleOnce(() => {
        this._selectType = Number(args1);
        ModelMgr.I.ChatModel.currentChatChannel = this._selectType;
        // }, 0.1);
    }

    private refreshList() {
        if (this.sysChatItem == null || this.normalChatItem == null || this.normalChatMeItem === null) return;
        // menubar
        const sType = this._selectType;
        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Chat_ChatMenuBar, this.barNd, (err, nd: cc.Node) => {
            if (!err) {
                const bar = nd.getComponent(ChatMenuBar);
                bar.setSelectCall((idx: number) => {
                    this.selectBar(idx);
                }, sType);
                // bar.selectIndex(sType);
            }
        });
    }

    /** menu 选中回调 */
    private selectBar(idx: number) {
        this._selectType = idx;
        ModelMgr.I.ChatModel.currentChatChannel = this._selectType;
        this.inputNd.active = !(idx === CHAT_CHANNEL_ENUM.BlackList || idx === CHAT_CHANNEL_ENUM.Sys);
        this.unInputNd.active = !this.inputNd.active;
        this.List.node.active = idx !== CHAT_CHANNEL_ENUM.BlackList;
        this.NdBlackList.active = idx === CHAT_CHANNEL_ENUM.BlackList;

        this.updateList();
    }

    /** 发送一个聊天信息 */
    private sendMsg(msg: string, atuid: number, BigIcon: number) {
        ControllerMgr.I.ChatController.sendChatMsg(msg, this._selectType, atuid, BigIcon);
    }

    /** 复用时选择的itemnode */
    private differentItem(index: number): cc.Node | cc.Prefab {
        const fab: cc.Node = this.getPrefabByIndex(index);
        if (!fab || !fab.name) {
            return null;
        }
        // 1. 从list回收池 获取特定的节点
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        let itemNd = this.List.getPoolNode(fab.name);
        if (itemNd === null) {
            itemNd = cc.instantiate(fab);
        }
        return itemNd;
    }

    /** 复用时每个item的高度返回 */
    private itemHeight(index: number): cc.Size {
        if (this._selectType === CHAT_CHANNEL_ENUM.Sys) {
            const item = this._sysListData[index];
            CHAT_RICH_SYS_CONFIG.richString = UtilRichString.RichPureText(item.msg);
            const h2 = UtilRichString.RichStringLineNumWithConfig(CHAT_RICH_SYS_CONFIG);
            return cc.size(650, CHAT_SYS_ITEM_HEIGHT_CONFIG[h2]);
        }
        const item = this._listData[index] as ChatData;
        if (item.SenderInfo) {
            // 普通聊天消息
            if (item.BigIcon > 0) {
                return cc.size(614, 140);
            }
            // CHAT_RICH_NORMAL_CONFIG.richString = item.Content;
            // const h = UtilRichString.RichStringLineNumWithConfig(CHAT_RICH_NORMAL_CONFIG);
            // return cc.size(614, CHAT_DEFAULT_ITEM_HEIGHT_CONFIG[h]);
            return cc.size(614, 120);
        } else {
            // 系统消息
            const sysMsg = this._listData[index] as NoticeMsg;
            CHAT_RICH_SYS_CONFIG.richString = UtilRichString.RichPureText(sysMsg.msg);
            const h2 = UtilRichString.RichStringLineNumWithConfig(CHAT_RICH_SYS_CONFIG);
            return cc.size(650, CHAT_SYS_ITEM_HEIGHT_CONFIG[h2]);
        }
    }

    private getPrefabByIndex(idx: number): cc.Node {
        if (this._selectType === CHAT_CHANNEL_ENUM.Sys) {
            return this.sysChatItem;
        } else {
            const dta = this._listData[idx];
            const data = dta as ChatData;
            if (data && data.SenderInfo) {
                if (data.SenderInfo.UserId === RoleMgr.I.d.UserId) {
                    return this.normalChatMeItem;
                }
                return this.normalChatItem;
            } else {
                return this.sysChatItem;
            }
        }
    }

    private _listData: Array<ChatData | NoticeMsg> = [];
    private _blackData: BlackInfo[] = [];
    private _sysListData: NoticeMsg[] = [];

    private updateList(data?: ChatData[] | NoticeMsg[]) {
        const model = ModelMgr.I.ChatModel;
        // 黑名单
        if (this._selectType === CHAT_CHANNEL_ENUM.BlackList) {
            this._blackData = model.blackListData;
            this.BlackList.setNumItems(this._blackData.length, 0);
            // 上限先显示处理
            this.LabBlackListCount.string = `${i18n.tt(Lang.chat_max_blacklist)}${this._blackData.length}/${ChatCdMgr.I.getBlackListMax()}`;
            if (data) {
                this._listData = this._listData.concat(data);
            }
        } else if (this._selectType === CHAT_CHANNEL_ENUM.Sys) { // 系统消息
            this._sysListData = model.sysListData;
            this.List.setTemplateItemData(
                this._sysListData,
                { layoutList: ['self'], richList: ['RichText'] },
            );
            this.List.scrollToIndex(this._sysListData.length - 1, 0.2);
            if (data) {
                this._listData = this._listData.concat(data);
            }
        } else { // 其他消息
            // eslint-disable-next-line no-lonely-if
            if (data === null || data === undefined) {
                // 未传值
                const ld = model.searchListType(this._selectType);
                this._listData = ld;
                this.List.setTemplateItemData(
                    this._listData,
                    {
                        layoutList: ['NdDefaultContainer', 'self'],
                        richList: ['NdDefaultContainer/NdContent/RichText', 'RichText'],
                    },
                );
                if (this._scrollIndex > 0) {
                    this.List.scrollToIndex(this._scrollIndex, 0.1);
                    this._scrollIndex = 0; // 滚动一次之后 当前页面为滚动到最新信息
                } else {
                    this.List.scrollToBottom();
                    // this.List.scrollToIndex(this._listData.length - 1, 0.1);
                }
            } else {
                if (model.dataInBlack(data)) {
                    // 黑名单消息 不处理
                    return;
                }
                for (let k = 0; k < data.length; k++) {
                    const kData = data[k];
                    if (ModelMgr.I.ChatModel.dataCanInsertList(kData, this._selectType)) {
                        this._listData.push(kData);
                        this.List.addData(data);
                        this.List.scrollToBottom(0.2);
                    }
                }

                // this.List.scrollToIndex(this._listData.length - 1, 0.1);
            }
        }
    }

    private scan(dta: object[]) {
        const wPos = dta[0] as cc.Vec2;
        const cdata = dta[1] as ChatData;
        const pos = this.node.convertToNodeSpaceAR(wPos);
        ResMgr.I.showPrefab('/prefab/module/chat/ChatOperateView', this.node, (err, nd) => {
            if (!err) {
                const operate = nd.getComponent(ChatOperateView);
                operate.setData(cdata);
                operate.contentPos(pos); // 设置内容的位置
            }
        });
    }

    private scrollEvent(nd: cc.Node, dta: any, index: number): void {
        let itm: ChatSysItem | ChatDefaultItem = null;
        if (this._selectType === CHAT_CHANNEL_ENUM.Sys) {
            itm = nd.getComponent(ChatSysItem);
            itm.setData(dta, index);
            const idx = this._sysListData.length - this._sysListData.indexOf(dta);
            this.BtnScrollFooter.active = idx > 5;
        } else {
            const data = dta as ChatData;
            if (data && data.SenderInfo) {
                itm = nd.getComponent(ChatDefaultItem);
                itm.setData(dta, index, this._selectType);
            } else {
                itm = nd.getComponent(ChatSysItem);
                itm.setData(dta, index);
            }
            const idx = this._listData.length - this._listData.indexOf(dta);
            this.BtnScrollFooter.active = idx > 5;
        }
    }

    private blackScrollEvent(nd: cc.Node, idx: number) {
        const data: BlackInfo = this._blackData[idx];
        nd.getComponent(ChatBlackListItem).setData(data, idx);
    }

    public readyToClose(viewVo: BaseVo): void {
        if (viewVo && viewVo.id === ViewConst.ChatEmoji
            || viewVo && viewVo.id === ViewConst.ConfirmBox
            || viewVo && viewVo.id === ViewConst.NoticeWin) {
            // 打开界面为表情包界面 拉黑提示  系统公告

        } else {
            this.close();
        }
    }

    protected onDisable(): void {
        super.onDisable();
        EventClient.I.emit(E.Chat.LobbyShowBoard, true);
        EventClient.I.emit(E.Chat.OpenChatWinState, false);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Chat.ScanUserInfo, this.scan, this);
        EventClient.I.off(E.Chat.UpdateChatList, this.updateList, this);
        EventClient.I.off(E.Win.WinOpen, this.readyToClose, this);
    }
}
