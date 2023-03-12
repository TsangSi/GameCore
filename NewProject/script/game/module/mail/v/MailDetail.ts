/*
 * @Author: kexd
 * @Date: 2022-06-14 15:43:17
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\mail\v\MailDetail.ts
 * @Description: 邮件详情
 *
 */

import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { WinCmp } from '../../../com/win/WinCmp';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import UtilItemList from '../../../base/utils/UtilItemList';
import { IItemMsg } from '../../../com/item/ItemConst';
import ItemModel from '../../../com/item/ItemModel';
import UtilItem from '../../../base/utils/UtilItem';
import ModelMgr from '../../../manager/ModelMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { EMailState } from '../MailConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MailDetail extends WinCmp {
    @property(cc.RichText)
    private RichText: cc.RichText = null;
    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(cc.Label)
    private LabOverdue: cc.Label = null;
    @property(cc.Node)
    private NdAttach: cc.Node = null;
    @property(cc.Node)
    private NdPrize: cc.Node = null;
    @property(cc.Node)
    private BtnGet: cc.Node = null;
    @property(cc.Node)
    private BtnDel: cc.Node = null;
    @property(cc.Node)
    private SvItem: cc.Node = null;
    @property(cc.Node)
    private NdItem: cc.Node = null;

    /** 邮件数据 */
    private _mailData: MailData = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.BtnGet, () => {
            if (this._mailData) {
                ControllerMgr.I.MailController.reqC2SGetMailAttach(this._mailData.MailId, this._mailData.MailType);
            }
        }, this);

        UtilGame.Click(this.BtnDel, () => {
            if (this._mailData) {
                ControllerMgr.I.MailController.reqC2SDelMail(this._mailData.MailId, this._mailData.MailType);
            }
            WinMgr.I.close(ViewConst.MailDetail);
        }, this);

        this.addE();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    private addE() {
        EventClient.I.on(E.Mail.NewMail, this.uptMail, this);
        EventClient.I.on(E.Mail.UptMail, this.uptMail, this);
    }

    private remE() {
        EventClient.I.off(E.Mail.NewMail, this.uptMail, this);
        EventClient.I.off(E.Mail.UptMail, this.uptMail, this);
    }

    public init(data: unknown): void {
        if (data && data[0]) {
            this._mailData = data[0];
            this.uptUI();
        }
    }

    private uptMail() {
        this._mailData = ModelMgr.I.MailModel.getMailInfo(this._mailData.MailId, this._mailData.MailType);
        this.uptUI();
    }

    private uptUI(): void {
        if (!this._mailData) return;
        this.RichText.string = this._mailData.Content;
        this.LabTitle.string = UtilString.GetLimitStr(this._mailData.Title, 7);
        if (this._mailData.LifeTime > 0) {
            const costTime = UtilTime.NowSec() - this._mailData.ReceiveTime;
            let leftTime = this._mailData.LifeTime - costTime;
            if (leftTime < 0) {
                leftTime = 0;
            }
            this.LabOverdue.string = `${UtilTime.TimeLimit(leftTime)}${i18n.tt(Lang.mail_timeout)}`;
        } else {
            this.LabOverdue.string = '';
        }

        if (this._mailData.AttachInfo.length > 0 || this._mailData.AttachData.length > 0) {
            this.NdAttach.active = true;
            this.NdPrize.active = true;
            this.BtnGet.active = this._mailData.IsReceive === EMailState.UnreadOrUnReceive;
            this.BtnDel.active = this._mailData.IsReceive === EMailState.ReadedOrReceived;
            // todo 展示奖励列表
            const arr: ItemModel[] = [];
            if (this._mailData.AttachData && this._mailData.AttachData.length > 0) {
                for (let i = 0; i < this._mailData.AttachData.length; i++) {
                    const itemModel = UtilItem.NewItemModel(this._mailData.AttachData[i].ItemId, this._mailData.AttachData[i].ItemNum);
                    arr.push(itemModel);
                }
            }
            if (this._mailData.AttachInfo && this._mailData.AttachInfo.length > 0) {
                for (let i = 0; i < this._mailData.AttachInfo.length; i++) {
                    const itemModel = UtilItem.NewItemModel(this._mailData.AttachInfo[i].ItemId, this._mailData.AttachInfo[i].ItemNum);
                    arr.push(itemModel);
                }
            }
            const msg: IItemMsg = {
                option: { needNum: true, needName: true },
                needGot: this._mailData.IsReceive === EMailState.ReadedOrReceived,
                needGotBg: this._mailData.IsReceive === EMailState.ReadedOrReceived,
            };
            if (arr.length >= 5) {
                this.SvItem.active = true;
                this.NdItem.active = true;
                this.NdPrize.active = false;
                UtilItemList.ShowItemArr(this.NdItem, arr, msg);
                // this.SvItem.getComponent(cc.ScrollView).scrollToLeft();
            } else {
                this.SvItem.active = false;
                this.NdItem.active = false;
                this.NdPrize.active = true;
                UtilItemList.ShowItemArr(this.NdPrize, arr, msg);
            }
        } else {
            this.NdAttach.active = false;
            this.SvItem.active = false;
            this.NdItem.active = false;
            this.NdPrize.active = false;
            this.BtnDel.active = true;
            this.BtnGet.active = false;// this._mailData.IsReceive === EMailState.UnreadOrUnReceive;
        }
    }
}
