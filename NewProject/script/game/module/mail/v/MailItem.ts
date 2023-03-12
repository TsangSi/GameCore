/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-06-13 11:01:01
 * @FilePath: \SanGuo2.4\assets\script\game\module\mail\v\MailItem.ts
 * @Description: 邮件子项
 *
 */

import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { IItemMsg } from '../../../com/item/ItemConst';
import UtilItemList from '../../../base/utils/UtilItemList';
import ItemModel from '../../../com/item/ItemModel';
import UtilItem from '../../../base/utils/UtilItem';
import { EMailState } from '../MailConst';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MailItem extends BaseCmp {
    @property(cc.Sprite)
    private SpState: cc.Sprite = null;
    @property(cc.Node)
    private NdNew: cc.Node = null;
    @property(cc.Node)
    private NdPrize: cc.Node = null;
    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(cc.Label)
    private LabTime: cc.Label = null;
    @property(cc.Label)
    private LabOverdue: cc.Label = null;
    @property(cc.Node)
    private NdRed: cc.Node = null;
    @property(cc.Node)
    private SvItem: cc.Node = null;
    @property(cc.Node)
    private NdItem: cc.Node = null;

    /** 邮件数据 */
    private _mailData: MailData = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.node, () => {
            if (this._mailData) {
                // 未读才需要请求
                if (this._mailData.IsRead === EMailState.UnreadOrUnReceive) {
                    ControllerMgr.I.MailController.reqC2SReadMailReq(this._mailData.MailId, this._mailData.MailType);
                }
                WinMgr.I.open(ViewConst.MailDetail, this._mailData);
            }
        }, this);
    }

    public loadItem(data: MailData): void {
        if (this.node && this.node.isValid) {
            this.setData(data);
        }
    }

    public clearItem(): void {
        // if (this.node) {
        //     this.node.destroy();
        // }
    }

    public setData(data: MailData): void {
        if (data) {
            this._mailData = data;
            this.uptUI();
        }
    }

    private uptUI(): void {
        // const day:number = Config.Get(Config.Type.Cfg_Mail).getValueByKey(this._mailData.TplId, 'Tpl_ExpriyTime');
        this.LabTitle.string = UtilString.GetLimitStr(this._mailData.Title, 15);
        this.LabTime.string = UtilTime.FormatToDate(this._mailData.ReceiveTime * 1000, '%yyyy-%MM-%dd %HH:%mm:%ss', true);
        if (this._mailData.LifeTime > 0) {
            const costTime = UtilTime.NowSec() - this._mailData.ReceiveTime;
            let leftTime = this._mailData.LifeTime - costTime;
            if (leftTime < 0) {
                leftTime = 0;
            }
            this.LabOverdue.string = `${UtilTime.TimeLimit(leftTime)}后过期`;
        } else {
            this.LabOverdue.string = '';
        }

        // 未读
        if (this._mailData.IsRead === EMailState.UnreadOrUnReceive) {
            this.NdNew.active = true;
            this.NdNew.setScale(1, 1, 1);
            cc.Tween.stopAllByTarget(this.NdNew);
            cc.tween(this.NdNew)
                .by(0.7, { scale: 0.15 })
                .by(0.7, { scale: -0.15 }, { easing: 'sineIn' })
                .union()
                .repeatForever()
                .start();

            UtilCocos.LoadSpriteFrame(this.SpState, RES_ENUM.Mail_Icon_Yj_Tb);
        } else {
            this.NdNew.active = false;
            UtilCocos.LoadSpriteFrame(this.SpState, RES_ENUM.Mail_Icon_Yj_Tb2);
        }
        this.NdRed.active = this._mailData.IsRead === EMailState.UnreadOrUnReceive
            || (this._mailData.IsReceive === EMailState.UnreadOrUnReceive && (this._mailData.AttachData.length > 0 || this._mailData.AttachInfo.length > 0));
        const isReadAndReceive = (this._mailData.IsRead === EMailState.ReadedOrReceived && this._mailData.IsReceive === EMailState.ReadedOrReceived)
            || (this._mailData.IsRead === EMailState.ReadedOrReceived && this._mailData.AttachData.length === 0 && this._mailData.AttachInfo.length === 0);

        this.node.opacity = isReadAndReceive ? 155 : 255;

        if (this._mailData.AttachData.length > 0 || this._mailData.AttachInfo.length > 0) {
            this.NdPrize.active = true;
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
                option: { needNum: true },
                needGot: this._mailData.IsReceive === EMailState.ReadedOrReceived,
            };

            if (arr.length >= 4) {
                this.SvItem.active = true;
                this.NdItem.active = true;
                this.NdPrize.active = false;
                UtilItemList.ShowItemArr(this.NdItem, arr, msg);
            } else {
                this.SvItem.active = false;
                this.NdItem.active = false;
                this.NdPrize.active = true;
                UtilItemList.ShowItemArr(this.NdPrize, arr, msg);
            }
        } else {
            this.SvItem.active = false;
            this.NdItem.active = false;
            this.NdPrize.active = false;
        }
    }
}
