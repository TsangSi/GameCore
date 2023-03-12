/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-13 10:48:45
 * @FilePath: \SanGuo2.4\assets\script\game\module\mail\MailModel.ts
 * @Description:
 *
 */

import { E } from '../../const/EventName';
import { EventClient } from '../../../app/base/event/EventClient';
import { Config } from '../../base/config/Config';
import { UtilString } from '../../../app/base/utils/UtilString';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { EMailState } from './MailConst';
import { ViewConst } from '../../const/ViewConst';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { FuncId } from '../../const/FuncConst';

const { ccclass } = cc._decorator;
@ccclass('MailModel')
export class MailModel extends BaseModel {
    /** 按类型分类 0普通邮件 1重要邮件 */
    private _mailList: { [key: number]: MailData[]; } = cc.js.createMap(true);

    public clearAll(): void {
        //
    }

    public init(): void {
        // 检测
        RedDotCheckMgr.I.on(RID.Bag.Mail.Id, this.checkMainRed, this);
        // UI打开的时候，走如下的几个监听
        RedDotCheckMgr.I.on(RID.Bag.Mail.Normal, this.checkMailRed, this);
        RedDotCheckMgr.I.on(RID.Bag.Mail.Importance, this.checkMailRed, this);
    }

    public registerRedDotListen(): void {
        const listenInfo: IListenInfo = {
            // 协议 ProtoId.S2CMailList_ID,
            ProtoId: [ProtoId.S2CAddMail_ID, ProtoId.S2CGetMailAttachRep_ID, ProtoId.S2CReadMailRep_ID, ProtoId.S2CDelMail_ID],
            // 事件
            EventClient: [E.Mail.NewMail],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.BagWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
            ProxyRid: [RID.Bag.Mail.Id],
        };
        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: RID.Bag.Mail.Normal, info: listenInfo },
            { rid: RID.Bag.Mail.Importance, info: listenInfo },
        );
    }

    /** 根据类型获取邮件列表 */
    public mailList(mailType: number): MailData[] {
        if (this._mailList && this._mailList[mailType]) {
            return this._mailList[mailType];
        }
        return [];
    }

    /**
     * 根据邮件id获取邮件的详细信息
     * @param mailId
     */
    public getMailInfo(mailId: number, mailType: number): MailData {
        if (this._mailList && this._mailList[mailType]) {
            for (let i = 0; i < this._mailList[mailType].length; i++) {
                if (mailId === this._mailList[mailType][i].MailId) {
                    return this._mailList[mailType][i];
                }
            }
        }

        return null;
    }

    /**
     * 是否有未读的邮件
    */
    public isUnRead(): boolean {
        if (this._mailList) {
            for (const k in this._mailList) {
                if (this._mailList[k] && this._mailList[k].length > 0) {
                    for (let i = this._mailList[k].length - 1; i >= 0; i--) {
                        if (this._mailList[k][i] && this._mailList[k][i].IsRead === EMailState.UnreadOrUnReceive) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /** 有未读邮件，判断最近的邮件是普通邮件还是重要邮件 */
    public latestMailType(): number {
        const mailArr: MailData[] = [];
        if (this._mailList) {
            for (const k in this._mailList) {
                if (this._mailList[k] && this._mailList[k].length > 0) {
                    for (let i = this._mailList[k].length - 1; i >= 0; i--) {
                        if (this._mailList[k][i] && this._mailList[k][i].IsRead === EMailState.UnreadOrUnReceive) {
                            mailArr.push(this._mailList[k][i]);
                        }
                    }
                }
            }
        }
        mailArr.sort((a, b) => b.ReceiveTime - a.ReceiveTime);
        if (mailArr.length > 0) {
            return mailArr[0].MailType;
        }
        return 0;
    }

    /**
     * 是否有红点
     * @param mailType 邮件类型（0普通邮件 1重要邮件）
     */
    public isMailTypeRed(mailType: number): boolean {
        if (this._mailList && this._mailList[mailType]) {
            for (let i = this._mailList[mailType].length - 1; i >= 0; i--) {
                if (this._mailList[mailType][i].IsRead === EMailState.UnreadOrUnReceive
                    || (this._mailList[mailType][i].IsReceive === EMailState.UnreadOrUnReceive && (this._mailList[mailType][i].AttachData.length > 0 || this._mailList[mailType][i].AttachInfo.length > 0))) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 入口是否有红点
     */
    public checkMainRed(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.Mail)) {
            return false;
        }
        if (this._mailList) {
            for (const k in this._mailList) {
                const isRed = this.isMailTypeRed(+k);
                if (isRed) {
                    if (+k === 0) {
                        RedDotMgr.I.updateRedDot(RID.Bag.Mail.Normal, isRed);
                    } else {
                        RedDotMgr.I.updateRedDot(RID.Bag.Mail.Importance, isRed);
                    }
                    return true;
                }
            }
        }
        RedDotMgr.I.updateRedDot(RID.Bag.Mail.Normal, false);
        RedDotMgr.I.updateRedDot(RID.Bag.Mail.Importance, false);
        return false;
    }

    public checkMailRed(): void {
        if (this._mailList) {
            for (const k in this._mailList) {
                const type: number = +k;
                const isRed = this.isMailTypeRed(type);
                if (type === 0) {
                    RedDotMgr.I.updateRedDot(RID.Bag.Mail.Normal, isRed);
                } else if (type === 1) {
                    RedDotMgr.I.updateRedDot(RID.Bag.Mail.Importance, isRed);
                }
            }
        }
    }

    private setMailData(__mail: MailData): MailData {
        const mail: MailData = __mail;
        if (!mail.Title || mail.Title === '') {
            if (mail.TplId) {
                const t: Cfg_Mail = Config.Get(Config.Type.Cfg_Mail).getValueByKey(mail.TplId);
                if (t) {
                    const param: string[] = mail.TitleParam.split('|');
                    mail.Title = UtilString.FormatArray(t.Tpl_Title, param);
                }
            }
        }
        if (!mail.Content || mail.Content === '') {
            if (mail.TplId) {
                const t: Cfg_Mail = Config.Get(Config.Type.Cfg_Mail).getValueByKey(mail.TplId);
                if (t) {
                    const param = mail.MailTplParam.split('|');
                    mail.Content = UtilString.FormatArray(t.Tpl_Content, param);
                    if (mail.Content.indexOf('<') === -1 && mail.Content.indexOf('>') === -1) {
                        mail.Content = `<color=${UtilColor.NorV}>${mail.Content}</c>`;
                    }
                }
            }
        }
        return mail;
    }

    public setMailList(mails: MailData[]): void {
        this._mailList = {};

        let isNew: boolean = false;
        // 判断Content和Title有没有内容，如果没有，就按表中的模板来设置
        for (let i = 0; i < mails.length; i++) {
            const mail = this.setMailData(mails[i]);

            if (!this._mailList[mail.MailType]) {
                this._mailList[mail.MailType] = [];
            }
            this._mailList[mail.MailType].push(mail);

            // 若没有附件，这里直接改下其状态
            if (mail.AttachData.length === 0 && mail.AttachInfo.length === 0) {
                mail.IsReceive = EMailState.ReadedOrReceived;
            }

            if (mail.IsRead === EMailState.UnreadOrUnReceive
                || (mail.IsReceive === EMailState.UnreadOrUnReceive && (mail.AttachData.length > 0 || mail.AttachInfo.length > 0))) {
                isNew = true;
            }
        }

        // 排序
        this.sortMails();

        if (isNew) {
            EventClient.I.emit(E.Mail.NewMail);
        }
    }

    private sortMails() {
        if (this._mailList) {
            for (const k in this._mailList) {
                this._mailList[k].sort(this.sort);
            }
        }
    }

    private sortMailsByType(mailType: number) {
        if (this._mailList && this._mailList[mailType]) {
            this._mailList[mailType].sort(this.sort);
        }
    }

    /** 未读（未领取-无附件）- 已读（未领取-已领取-无附件） */
    private sort(a: MailData, b: MailData): number {
        const aAttach: number = a.AttachData.length > 0 || a.AttachInfo.length > 0 ? 10 : 0;
        const bAttach: number = b.AttachData.length > 0 || b.AttachInfo.length > 0 ? 10 : 0;
        const aw: number = (a.IsRead === EMailState.UnreadOrUnReceive ? 2 : 1) * 100 + aAttach + (a.IsReceive === EMailState.UnreadOrUnReceive ? 2 : 1);
        const bw: number = (b.IsRead === EMailState.UnreadOrUnReceive ? 2 : 1) * 100 + bAttach + (b.IsReceive === EMailState.UnreadOrUnReceive ? 2 : 1);

        if (aw !== bw) {
            return bw - aw;
        }
        const _t1 = new Date(a.ReceiveTime).getTime();
        const _t2 = new Date(b.ReceiveTime).getTime();
        return _t2 - _t1;
    }

    /**
     * 新增邮件
     */
    public addMail(data: MailData): void {
        if (data) {
            const mail = this.setMailData(data);
            if (!this._mailList) {
                this._mailList = {};
            }
            if (!this._mailList[mail.MailType]) {
                this._mailList[mail.MailType] = [];
            }
            this._mailList[mail.MailType].push(mail);

            this.sortMailsByType(mail.MailType);

            EventClient.I.emit(E.Mail.NewMail);
        }
    }

    /**
     * 删邮件
     */
    public remMail(mailIds: number[]): void {
        // 一定要逆序才不会漏，并注意防空
        let isExist: boolean = false;
        if (mailIds && mailIds.length > 0 && this._mailList) {
            for (let j = 0; j < mailIds.length; j++) {
                for (const k in this._mailList) {
                    if (this._mailList[k] && this._mailList[k].length > 0) {
                        for (let i = this._mailList[k].length - 1; i >= 0; i--) {
                            if (this._mailList[k][i] && this._mailList[k][i].MailId === mailIds[j]) {
                                this._mailList[k].splice(i, 1);
                                isExist = true;
                            }
                        }
                    }
                }
            }
        }
        if (isExist) {
            this.sortMails();
            EventClient.I.emit(E.Mail.UptMail);
        }
    }

    /**
     * 设置读取邮件状态
     * @param mailIds
     */
    public setRead(mailIds: number[]): void {
        let isExist: boolean = false;
        if (mailIds && mailIds.length > 0) {
            for (let j = 0; j < mailIds.length; j++) {
                for (const k in this._mailList) {
                    if (this._mailList[k] && this._mailList[k].length > 0) {
                        for (let i = this._mailList[k].length - 1; i >= 0; i--) {
                            if (this._mailList[k][i] && this._mailList[k][i].MailId === mailIds[j]) {
                                this._mailList[k][i].IsRead = EMailState.ReadedOrReceived;
                                if (this._mailList[k][i].AttachData.length === 0 && this._mailList[k][i].AttachInfo.length === 0) {
                                    this._mailList[k][i].IsReceive = EMailState.ReadedOrReceived;
                                }
                                isExist = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (isExist) {
            this.sortMails();
            EventClient.I.emit(E.Mail.UptMail);
        }
    }

    /**
     * 设置邮件附件领取状态
     * @param mailIds
     */
    public setAttach(mailIds: number[]): void {
        let isExist: boolean = false;
        if (mailIds && mailIds.length > 0) {
            for (let j = 0; j < mailIds.length; j++) {
                for (const k in this._mailList) {
                    if (this._mailList[k] && this._mailList[k].length > 0) {
                        for (let i = this._mailList[k].length - 1; i >= 0; i--) {
                            if (this._mailList[k][i] && this._mailList[k][i].MailId === mailIds[j]) {
                                this._mailList[k][i].IsReceive = EMailState.ReadedOrReceived;
                                if (this._mailList[k][i].AttachData.length > 0 || this._mailList[k][i].AttachInfo.length > 0) {
                                    this._mailList[k][i].IsRead = EMailState.ReadedOrReceived;
                                }
                                isExist = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (isExist) {
            this.sortMails();
            EventClient.I.emit(E.Mail.UptMail);
            // this.checkMailRed();
        }
    }
}
