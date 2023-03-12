/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-13 11:00:41
 * @FilePath: \SanGuo2.4\assets\script\game\module\mail\v\MailPage.ts
 * @Description: 邮件主界面
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilGame } from '../../../base/utils/UtilGame';
import { TabContainer } from '../../../com/tab/TabContainer';
import { TabItem } from '../../../com/tab/TabItem';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { MailPageTabs, MailPageType } from '../MailConst';
import MailItem from './MailItem';
import ControllerMgr from '../../../manager/ControllerMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import ModelMgr from '../../../manager/ModelMgr';
import { Config } from '../../../base/config/Config';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import ListView from '../../../base/components/listview/ListView';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MailPage extends WinTabPage {
    @property(TabContainer)
    private TabsContent: TabContainer = null;
    @property(ListView)
    private ListMail: ListView = null;
    @property(cc.Label)
    private LabCount: cc.Label = null;
    @property(cc.Node)
    private BtnDel: cc.Node = null;
    @property(cc.Node)
    private BtnGet: cc.Node = null;
    @property(cc.Node)
    private NdEmpty: cc.Node = null;

    /** 邮件数据 */
    private _tabIndex: number = 0;
    private _mailList: MailData[] = [];

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
        this.uptUI();
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this.TabsContent.addEventHandler(this.node, 'MailPage', 'onItemTypeTabSelected');
        let mailTab: number = 0;
        if (param && typeof param[1] === 'number') {
            mailTab = param[1];
        }
        this.TabsContent.setData(MailPageTabs, mailTab);
    }

    private addE() {
        EventClient.I.on(E.Mail.NewMail, this.uptUI, this);
        EventClient.I.on(E.Mail.UptMail, this.uptUI, this);
    }

    private remE() {
        EventClient.I.off(E.Mail.NewMail, this.uptUI, this);
        EventClient.I.off(E.Mail.UptMail, this.uptUI, this);
    }

    private clk() {
        UtilGame.Click(this.BtnDel, () => {
            const str = i18n.tt(Lang.mail_del);
            ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                if (this._mailList.length > 0) {
                    ControllerMgr.I.MailController.reqC2SDelMail(0, this._tabIndex);
                }
            }, { showToggle: 'MailPage', tipTogState: false });
        }, this);

        UtilGame.Click(this.BtnGet, () => {
            if (this._mailList.length > 0) {
                ControllerMgr.I.MailController.reqC2SGetMailAttach(0, this._tabIndex);
            }
        }, this);
    }

    private onItemTypeTabSelected(tabItem: TabItem) {
        const data = tabItem.getData();
        switch (data.id) {
            case MailPageType.Normal:
                this.showNormal();
                break;
            case MailPageType.Important:
                this.showImportance();
                break;
            default:
                console.log(`未知类型${data.id}，请增加实现！`);
                break;
        }
    }

    /**
     * 显示普通邮件
     */
    private showNormal(): void {
        this._tabIndex = 0;
        this.BtnDel.setPosition(-154, this.BtnDel.position.y);
        this.uptUI();
    }

    /**
     * 显示重要邮件
     */
    private showImportance(): void {
        this._tabIndex = 1;
        this.BtnDel.setPosition(0, this.BtnDel.position.y);
        this.uptUI();
    }

    /**
     * 更新邮件列表
     */
    public uptUI(): void {
        this._mailList = ModelMgr.I.MailModel.mailList(this._tabIndex);
        let max: number = 0;
        if (this._tabIndex === 0) {
            max = parseInt(Config.Get(Config.Type.Cfg_Config).getValueByKey('MaxMailNum', 'CfgValue'));
        } else {
            max = parseInt(Config.Get(Config.Type.Cfg_Config).getValueByKey('MaxMailNum2', 'CfgValue'));
        }
        let cur = this._mailList.length;
        if (cur >= max) {
            cur = max;
            this.LabCount.node.color = UtilColor.Red();
        } else {
            this.LabCount.node.color = UtilColor.Green();
        }
        this.LabCount.string = `${cur}/${max}`;
        this.BtnGet.active = this._tabIndex === 0;
        this.NdEmpty.active = cur === 0;

        this.initList();
    }

    private initList(): void {
        this.ListMail.setNumItems(this._mailList.length);
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: MailData = this._mailList[idx];
        const item = node.getComponent(MailItem);
        if (data && item) {
            item.loadItem(data);
        } else {
            item.clearItem();
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
