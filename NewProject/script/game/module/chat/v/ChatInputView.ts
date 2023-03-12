/*
 * @Author: myl
 * @Date: 2022-08-09 14:50:38
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import { ChatCdMgr } from '../ChatCdMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatInputView extends cc.Component {
    @property(cc.EditBox)
    private EdBox: cc.EditBox = null;

    @property(cc.Node)
    private btnOpenEmoji: cc.Node = null;

    @property(cc.Node)
    private btnSend: cc.Node = null;

    /** 发送回调 */
    private senderCall: (inputString: string, n: number, big: number) => void;

    protected onLoad(): void {
        EventClient.I.on(E.Chat.InputContent, this.onInputContent, this);
    }

    protected start(): void {
        UtilGame.Click(this.btnOpenEmoji, () => {
            this.openEmojiView();
        }, this);
        UtilGame.Click(this.btnSend, () => {
            this.sendClick();
        }, this);

        EventClient.I.on(E.Chat.SelectEmoji, this.selectEmoji, this);
        EventClient.I.on(E.Chat.AtUser, this.atUser, this);
    }

    private onInputContent(str: string) {
        this.EdBox.string = str;
    }

    protected onDestroy(): void {
        this.atString = '';
        this.atUid = 0;
        EventClient.I.off(E.Chat.SelectEmoji, this.selectEmoji, this);
        EventClient.I.off(E.Chat.AtUser, this.atUser, this);
        EventClient.I.off(E.Chat.InputContent, this.onInputContent, this);
    }

    // 传递的参数为用户的信息
    private atUid = 0;
    private atString = '';
    private atUser(_data: ChatPlayerInfo): void {
        if (this.atUid === 0) {
            this.atUid = _data.UserId;
            this.atString = `@[${_data.UserId}]`;
        } else {
            this.EdBox.string = this.EdBox.string.replace(this.atString, '');
            this.atUid = _data.UserId;
            this.atString = `@[${_data.UserId}]`;
            // this.EdBox.string = this.atString + this.EdBox.string;
        }
        this.EdBox.string = this.atString + this.EdBox.string;
    }

    private selectEmoji(idx: number) {
        const config: Cfg_Emoji = Config.Get(Config.Type.Cfg_Emoji).getValueByIndex(idx);
        if (config.Group === 2) { // 大表情
            if (ChatCdMgr.I.canWorldSend) {
                this.EdBox.string = '';
                if (this.senderCall) {
                    this.senderCall(config.Code, this.atUid, config.Id);
                    this.atUid = 0; // 重置at信息
                }
                ChatCdMgr.I.resetWorldCd();
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.chat_cd_tip));
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const inputTxt = this.EdBox.string += `${config.Code}`;
            this.EdBox.string = inputTxt;
        }
    }

    public configSendCallBack(cb: (inputString: string, n: number, k: number) => void): void {
        this.senderCall = cb;
    }

    /** 过滤掉系统表情 */
    private filterEmoji(content: string): string {
        // eslint-disable-next-line max-len
        return content.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, '');
    }

    /** 输入过程调用 */
    private editBoxEditing(txt) {
        const nTxt = this.filterEmoji(txt);
        this.EdBox.string = nTxt;
    }

    private openEmojiView() {
        WinMgr.I.open(ViewConst.ChatEmoji);
    }

    private sendClick() {
        if (ChatCdMgr.I.canWorldSend) {
            const chatMsg = this.EdBox.string;
            const noEmojiMsg = this.filterEmoji(chatMsg);
            if (!this.checkAllKong(noEmojiMsg)) {
                if (this.senderCall) {
                    this.senderCall(noEmojiMsg, this.atUid, 0);
                    this.atUid = 0; // 重置at信息
                }
                ChatCdMgr.I.resetWorldCd();
                // 清空上次发言信息
                this.clearInput();
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.chat_null_msg));
            }
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.chat_cd_tip));
        }
    }

    /** 检查是否时纯空格 */
    private checkAllKong(str: string): boolean {
        if (str.length <= 0) return true;
        const regu = '^[ ]+$';
        const reg = new RegExp(regu);
        return reg.test(str);
    }

    /** 转化富文本图片
     * str 格式为 #abg#  图片名称则为abg
     */
    private transformTextToRichTextImg(str: string): string {
        const richTxt = `<img src='${str.slice(1, str.length - 1)}' />`;
        // const richTxt = `${str.slice(1, str.length - 1)}`;
        return richTxt;
    }

    /** 普通文字转化为富文本 */
    private transformTextToRichText(str: string): any {
        // /#.#/g
        // const match = str.match(/#(.|..|...)#/g);
        const match = str.match(/#([0-9]+)#/g);
        let result = str;
        if (!match) return result;
        for (let i = 0; i < match.length; i++) {
            const char = match[i];
            const ar = this.transformTextToRichTextImg(char);
            result = result.replace(char, ar);
        }
        return result;
    }

    private clearInput() {
        this.EdBox.string = '';
    }
}
