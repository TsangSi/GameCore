/* eslint-disable max-len */
/*
 * @Author: wangxin
 * @Date: 2022-10-19 18:40:05
 * @FilePath: \SanGuo2.4\assets\script\game\com\msgbox\IdentitykBox.ts
 */
// import {
//     _decorator, Component, Node, Label, RichText,
// } from 'cc';

import { EventClient } from '../../../app/base/event/EventClient';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilString } from '../../../app/base/utils/UtilString';
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../base/utils/UtilGame';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';

const { ccclass, property } = cc._decorator;

/** 实名认证提示窗类型 -- 警告层级 */
export enum EIdentiType {
    Logout = 0, // 下线
    State = 1, // 防沉迷状态
    PayLimit = 2, // 充值限制
}

@ccclass
export class IdentitykBox extends BaseUiView {
    @property(cc.Node)
    private SureBtn: cc.Node = null;

    @property(cc.Label)
    private LbTitleText: cc.Label = null;

    @property(cc.RichText)
    private RtInfoText: cc.RichText = null;

    private type: number = 0;
    private ret: number = 0;
    public init(params: any[]): void {
        super.init(params);
        this.type = params[0];
        this.ret = params[1];
        console.log('实名认证', params);
        this.setInfo();
        UtilGame.Click(this.SureBtn, this.ClickEvent, this);
        if (this.type === EIdentiType.Logout) {
            ControllerMgr.I.LoginController.onDoKill();
        }
    }

    protected start(): void {
        super.start();
    }

    public setInfo(): void {
        // const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_ClientMsg);
        const title: string[] = [i18n.tt(Lang.realname_logout_tips), i18n.tt(Lang.realname_fcmzt_tips), i18n.tt(Lang.realname_charge_tips)];
        const infoLogout: string = UtilString.FormatArgs(i18n.tt(Lang.realname_logout_info), UtilColor.GreenV);
        const infoStatic: string = UtilString.FormatArgs(i18n.tt(Lang.realname_fcmzt_info), UtilColor.GreenV, UtilColor.PurpleV);
        const infoLimit: string = UtilString.FormatArgs(i18n.tt(Lang.realname_charge_info), UtilColor.GreenV, UtilColor.PurpleV);

        const infoArr = [infoLogout, infoStatic, infoLimit];
        this.LbTitleText.string = title[this.type];
        this.RtInfoText.string = infoArr[this.type];

        if (this.type === EIdentiType.PayLimit) {
            const msgStr = MsgToastMgr.GetErrTipsStr(this.ret);
            this.RtInfoText.string = `${msgStr}`;
        }
    }

    private ClickEvent() {
        // 注销
        if (this.type === EIdentiType.Logout) {
            EventClient.I.emit(E.Login.BacktoLogin);
            WinMgr.I.closeAll(false);
            // WinMgr.I.checkIsOpen(ViewConst.LoginView);
            WinMgr.I.open(ViewConst.LoginView);
        }
        // EventClient.I.emit(E.Login.ForceLogout);
        this.close();
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
