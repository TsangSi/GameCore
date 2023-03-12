/*
 * @Author: kexd
 * @Date: 2022-06-13 17:22:08
 * @FilePath: \SanGuo2.4\assets\script\game\module\lobby\v\LobbyEasy.ts
 * @Description: 青蛙上面的快捷按钮。注意：登录时候不加载这个预制，减低登录的消耗。采用动态加载的办法。
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import { EffectMgr } from '../../../manager/EffectMgr';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import { BagWinTabType } from '../../bag/BagConst';
import { RES_ENUM } from '../../../const/ResPath';
import { EDailyPageType } from '../../daily/DailyConst';
import { ELobbyViewType } from '../LobbyConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class LobbyEasy extends BaseCmp {
    @property(cc.Node) /** 邮件 */
    private BtnMail: cc.Node = null;
    @property(cc.Node) /** 押镖-护 */
    private BtnEscort: cc.Node = null;
    @property(cc.Node) /** 押镖-劫 */
    private BtnRobbed: cc.Node = null;

    protected start(): void {
        super.start();
        this.addE();
        this.clk();
        this.checkEasy();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    private addE() {
        EventClient.I.on(E.Lobby.ChangeViewType, this.onChangeViewType, this);
        EventClient.I.on(E.Mail.NewMail, this.showMail, this);
        EventClient.I.on(E.Mail.UptMail, this.showMail, this);
        EventClient.I.on(E.Escort.EasyReward, this.showEscort, this);
        EventClient.I.on(E.Escort.GetReward, this.showEscort, this);
        EventClient.I.on(E.Escort.EasyRobbed, this.showRobbed, this);
        EventClient.I.on(E.Escort.RobbedRecord, this.showRobbed, this);
    }

    private remE() {
        EventClient.I.off(E.Lobby.ChangeViewType, this.onChangeViewType, this);
        EventClient.I.off(E.Mail.NewMail, this.showMail, this);
        EventClient.I.off(E.Mail.UptMail, this.showMail, this);
        EventClient.I.off(E.Escort.EasyReward, this.showEscort, this);
        EventClient.I.off(E.Escort.GetReward, this.showEscort, this);
        EventClient.I.off(E.Escort.EasyRobbed, this.showRobbed, this);
        EventClient.I.off(E.Escort.RobbedRecord, this.showRobbed, this);
    }

    private onChangeViewType(type: ELobbyViewType) {
        switch (type) {
            case ELobbyViewType.Family:
                this.BtnMail.active = false;
                this.BtnEscort.active = false;
                break;
            default:
                this.showMail();
                this.showEscort();
                break;
        }
    }

    private clk() {
        UtilGame.Click(this.BtnMail, () => {
            const mailType = ModelMgr.I.MailModel.latestMailType();
            WinMgr.I.open(ViewConst.BagWin, BagWinTabType.EMAIL, mailType);
        }, this);

        UtilGame.Click(this.BtnEscort, () => {
            this.BtnEscort.active = ModelMgr.I.EscortModel.rewardNotice;
            const tab: number = EDailyPageType.Escort; // DailyTabDataArr.findIndex((v) => v.TabId === EDailyPageType.Escort);
            WinMgr.I.open(ViewConst.DailyWin, tab);
        }, this);

        UtilGame.Click(this.BtnRobbed, () => {
            this.BtnRobbed.active = ModelMgr.I.EscortModel.robbedNotice;
            WinMgr.I.open(ViewConst.RobbedWin);
        }, this);
    }

    private showAnim(nd: cc.Node) {
        const n = nd.getChildByName('btnEffect');
        if (!n) {
            EffectMgr.I.showAnim(`${RES_ENUM.Com_Ui}${6048}`, (node: cc.Node) => {
                if (nd && nd.isValid) {
                    const eff = nd.getChildByName('btnEffect');
                    if (eff) {
                        eff.destroy();
                    }
                    nd.addChild(node);
                    node.setScale(0.7, 0.7, 0.7);
                    node.name = 'btnEffect';
                }
            });
        }
    }

    /** 可能主界面未加载完就有协议推送下来，那监听就会失效。所以在加载完的时候检查下是否有快捷入口要显示的 */
    private checkEasy() {
        this.showMail();
        this.showEscort();
        this.showRobbed();
    }

    /** 邮件 */
    private showMail() {
        this.BtnMail.active = ModelMgr.I.MailModel.isUnRead();
    }

    /** 押镖-护 */
    private showEscort() {
        this.BtnEscort.active = ModelMgr.I.EscortModel.rewardNotice;
    }

    /** 押镖-劫 */
    private showRobbed() {
        this.BtnRobbed.active = ModelMgr.I.EscortModel.robbedNotice;
    }
}
