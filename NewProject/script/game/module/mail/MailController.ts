/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/*
 * @Author: kexd
 * @Date: 2022-06-13 10:49:04
 * @FilePath: \SanGuo2\assets\script\game\module\mail\MailController.ts
 * @Description: sendmail@1@2:1000
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { BagWinTabType } from '../bag/BagConst';

const { ccclass } = cc._decorator;
@ccclass('MailController')
export default class MailController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CMailList_ID, this.onS2CMailList, this);
        EventProto.I.on(ProtoId.S2CAddMail_ID, this.onS2CAddMail, this);
        EventProto.I.on(ProtoId.S2CGetMailAttachRep_ID, this.onS2CGetMailAttach, this);
        EventProto.I.on(ProtoId.S2CReadMailRep_ID, this.onS2CReadMail, this);
        EventProto.I.on(ProtoId.S2CDelMail_ID, this.onS2CDelMail, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CMailList_ID, this.onS2CMailList, this);
        EventProto.I.off(ProtoId.S2CAddMail_ID, this.onS2CAddMail, this);
        EventProto.I.off(ProtoId.S2CGetMailAttachRep_ID, this.onS2CGetMailAttach, this);
        EventProto.I.off(ProtoId.S2CReadMailRep_ID, this.onS2CReadMail, this);
        EventProto.I.off(ProtoId.S2CDelMail_ID, this.onS2CDelMail, this);
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        if (UtilFunOpen.isOpen(FuncId.Mail, true)) {
            ControllerMgr.I.BagController.linkOpen(BagWinTabType.EMAIL);
        }
        ControllerMgr.I.BagController.linkOpen(BagWinTabType.EMAIL);
        return true;
    }

    /** 事件监听 */
    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.reqMailList, this);
    }
    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.reqMailList, this);
    }
    public clearAll(): void {
        // console.log('clearAll');
    }

    private reqMailList() {
        NetMgr.I.sendMessage(ProtoId.C2SMailList_ID, {});
    }

    /** 请求领取附件 */
    public reqC2SGetMailAttach(mailId: number, mailType: number): void {
        const d: C2SGetMailAttachReq = {
            MailId: mailId,
            MailType: mailType,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetMailAttachReq_ID, d);
        // console.log('请求领取附件:', mailId, mailType);
    }
    /** 邮件已读 */
    public reqC2SReadMailReq(mailId: number, mailType: number): void {
        const d: C2SReadMailReq = {
            MailId: mailId,
            MailType: mailType,
        };
        NetMgr.I.sendMessage(ProtoId.C2SReadMailReq_ID, d);
        // console.log('请求邮件已读:', mailId, mailType);
    }
    /** 请求删邮件 */
    public reqC2SDelMail(mailId: number, mailType: number): void {
        const d: C2SDelMail = {
            MailId: mailId,
            MailType: mailType,
        };
        NetMgr.I.sendMessage(ProtoId.C2SDelMail_ID, d);
        // console.log('请求删邮件:', mailId, mailType);
    }

    /** 邮件列表 */
    private onS2CMailList(data: S2CMailList): void {
        // console.log('+收到邮件列表:', data);
        if (data) {
            ModelMgr.I.MailModel.setMailList(data.Mails);
        }
    }
    /** 新增邮件 */
    private onS2CAddMail(data: S2CAddMail): void {
        // console.log('+收到新增邮件:', data);
        if (data) {
            ModelMgr.I.MailModel.addMail(data.Mail);
        }
    }
    /** 领取附件 */
    private onS2CGetMailAttach(data: S2CGetMailAttachRep): void {
        // console.log('+收到领取附件:', data);
        if (data) {
            if (data.Tag === 0) {
                ModelMgr.I.MailModel.setAttach(data.MailIds);
            } else if (data.Tag === 501) {
                // MsgBox.Show(
                //     '<color=#8D5D2C>装备背包已满，是否前往熔炼？</color>',
                //     {
                //         btnType: MsgBoxBtnType.Close_Cancel_Confirm,
                //         btnConfirm: {
                //             text: '确定',
                //             func() {
                //                 Link.To(49);
                //             },
                //             param: null,
                //         },
                //     },
                // );
            }
        }
    }
    /** 邮件已读回包 */
    private onS2CReadMail(data: S2CReadMailRep): void {
        // console.log('+收到邮件已读回包:', data);
        if (data && data.Tag === 0) {
            ModelMgr.I.MailModel.setRead(data.MailIds);
        }
    }
    /** 删邮件 */
    private onS2CDelMail(data: S2CDelMail): void {
        // console.log('+收到删邮件:', data);
        if (data && data.Tag === 0) {
            ModelMgr.I.MailModel.remMail(data.MailIds);
        }
    }
}
