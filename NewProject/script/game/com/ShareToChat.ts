/*
 * @Author: kexd
 * @Date: 2022-07-07 17:16:13
 * @FilePath: \SanGuo2.4\assets\script\game\com\ShareToChat.ts
 * @Description: 分享到聊天
 *
 */
import { UtilGame } from '../base/utils/UtilGame';
import ControllerMgr from '../manager/ControllerMgr';
import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import { ResMgr } from '../../app/core/res/ResMgr';
import { UI_PATH_ENUM } from '../const/UIPath';
import { GameLayerEnum } from '../../app/core/mvc/WinConst';
import { LayerMgr } from '../base/main/LayerMgr';
import { ChatShowItemType, CHAT_CHANNEL_ENUM } from '../module/chat/ChatConst';
import MsgToastMgr from '../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../i18n/i18n';
import UtilFunOpen from '../base/utils/UtilFunOpen';
import { FuncId } from '../const/FuncConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class ShareToChat extends BaseUiView {
    @property(cc.Node)
    private NdBg: cc.Node = null;
    @property(cc.Node)
    private NdContent: cc.Node = null;
    @property(cc.Node)
    private BtnWorld: cc.Node = null;
    @property(cc.Node)
    private BtnLocal: cc.Node = null;
    @property(cc.Node)
    private BtnKua: cc.Node = null;

    /** 类型 */
    private _type: number = 0;
    /** 道具id */
    private _itemId: number | string = 0;
    private static nodeShare: cc.Node = null;
    public static show(type: ChatShowItemType, itemId: number | string, pos: cc.Vec2): void {
        ResMgr.I.loadLocal(UI_PATH_ENUM.ShareToChat, cc.Prefab, (err, p: cc.Prefab) => {
            if (err) return;
            if (p && (!this.nodeShare || !this.nodeShare.isValid)) {
                const nd = cc.instantiate(p);
                this.nodeShare = nd;
                LayerMgr.I.addToLayer(GameLayerEnum.POP_LAYER, nd);
                nd.getComponent(ShareToChat).initData(type, itemId, pos);
            }
        });
    }

    /**
     * initData
     */
    public initData(type: ChatShowItemType, itemId: number | string, pos: cc.Vec2): void {
        this._type = type;
        this._itemId = itemId;
        // 传入的值为世界坐标点
        const pos1 = this.node.convertToNodeSpaceAR(pos);
        this.NdContent.setPosition(pos1);
    }

    protected start(): void {
        UtilGame.Click(this.NdBg, () => {
            this.onClose();
        }, this);

        UtilGame.Click(this.BtnWorld, () => {
            console.log('分享到世界');
            this.sendToChat(CHAT_CHANNEL_ENUM.World);
            this.onClose();
        }, this);

        UtilGame.Click(this.BtnLocal, () => {
            console.log('分享到本服');
            if (UtilFunOpen.isOpen(FuncId.FamilyHome, true)) { // 做世家开启判断
                this.sendToChat(CHAT_CHANNEL_ENUM.Current);
            }
            this.onClose();
        }, this);
    }

    private sendToChat(channalType: CHAT_CHANNEL_ENUM) {
        ControllerMgr.I.ChatController.showItem(this._type, this._itemId, channalType);
    }

    private onClose() {
        this.node.destroy();
    }
}
