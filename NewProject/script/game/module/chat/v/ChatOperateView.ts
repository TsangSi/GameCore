/*
 * @Author: myl
 * @Date: 2022-08-09 14:51:09
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatOperateView extends cc.Component {
    @property(cc.Node)
    private btnConnect: cc.Node = null;
    @property(cc.Node)
    private btnCheck: cc.Node = null;
    @property(cc.Node)
    private btnDelete: cc.Node = null;
    @property(cc.Node)
    private bg: cc.Node = null;

    protected start(): void {
        UtilGame.Click(this.btnConnect, () => {
            if (this._data && this._data.SenderInfo) {
                EventClient.I.emit(E.Chat.AtUser, this._data.SenderInfo);
            }
            this.node.destroy();
        }, this);

        UtilGame.Click(this.btnCheck, () => {
            // console.log('查看其他用户信息', this._data.SenderInfo.UserId);
            MsgToastMgr.Show('功能开发中');
            this.node.destroy();
        }, this);

        UtilGame.Click(this.btnDelete, () => {
            this.deleteUser();
            this.node.destroy();
        }, this);

        UtilGame.Click(this.node, () => {
            this.node.destroy();
        }, this, { scale: 1 });
    }

    private _data: ChatData = null;
    public setData(data: ChatData): void {
        this._data = data;
    }

    public contentPos(pos: cc.Vec2): void {
        this.bg.setPosition(pos);
    }

    private deleteUser() {
        const uInfo: ChatPlayerInfo = this._data.SenderInfo;
        ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.chat_blacklist_tip), UtilColor.NorV), () => {
            ControllerMgr.I.ChatController.deleteUser(1, uInfo.UserId);
        }, { showToggle: '' });
    }
}
