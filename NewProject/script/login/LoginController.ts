/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: hrd
 * @Date: 2022-04-15 18:53:15
 * @FilePath: \SanGuo2.4\assets\script\login\LoginController.ts
 * @Description:
 *
 */

import { EventClient } from '../app/base/event/EventClient';
import { EventProto } from '../app/base/event/EventProto';
import BaseController from '../app/core/mvc/controller/BaseController';
import WinMgr from '../app/core/mvc/WinMgr';
import HttpReq from '../app/core/net/http/HttpReq';
import GameApp from '../game/base/GameApp';
import ModelMgr from '../game/manager/ModelMgr';
import { E } from '../game/const/EventName';
import { ViewConst } from '../game/const/ViewConst';
import NetMgr from '../game/manager/NetMgr';
import { IAreaInfo, LoginHttpApi, RealName } from './LoginConst';
import { AppEvent } from '../app/AppEventConst';
import { RoleMgr } from '../game/module/role/RoleMgr';
import TaskCollector, { DB_ID_ENUM, DB_KEY_ENUM } from '../game/manager/TaskCollector';
import { RedDotMgr } from '../game/module/reddot/RedDotMgr';
import MsgToastMgr from '../game/base/msgtoast/MsgToastMgr';
import ControllerMgr from '../game/manager/ControllerMgr';
import { NetConfirmBtnType } from './v/NetConfirmBox';
import { i18n, Lang } from '../i18n/i18n';
import { EIdentiType } from '../game/com/msgbox/IdentitykBox';

const { ccclass } = cc._decorator;
@ccclass('LoginController')
export default class LoginController extends BaseController {
    public constructor() {
        super();
    }

    public init(): void {
        //
    }

    public addClientEvent(): void {
        EventClient.I.on(E.Login.ReqRegister, this.onReqRegister, this);
        EventClient.I.on(E.Login.ReqLogin, this.onReqLogin, this);
        EventClient.I.on(E.Login.ReqCreateRole, this.onReqCreaterole, this);
        EventClient.I.on(E.Login.ReqRoleNick, this.onReqRoleNick, this);
        EventClient.I.on(E.Login.ReqGetgateaddr, this.onReqGetgateaddr, this);
        EventClient.I.on(E.Login.ReConnect, this.onReConnect, this);
        EventClient.I.on(E.Login.BacktoLogin, this.onBacktoLoginView, this);
        EventClient.I.on(AppEvent.SocketConnect, this.onConnectServerSucc, this);
        EventClient.I.on(AppEvent.SocketReconnectSucc, this.onSocketReconnectSucc, this);
        EventClient.I.on(E.Config.InitConfigSuccess, this.onInitConfigSuccess, this);
        EventClient.I.on(AppEvent.SocketReconnectFail, this.onReconnectFail, this);
    }

    public delClientEvent(): void {
        EventClient.I.off(E.Login.ReqRegister, this.onReqRegister, this);
        EventClient.I.off(E.Login.ReqLogin, this.onReqLogin, this);
        EventClient.I.off(E.Login.ReqCreateRole, this.onReqCreaterole, this);
        EventClient.I.off(E.Login.ReqRoleNick, this.onReqRoleNick, this);
        EventClient.I.off(E.Login.ReqGetgateaddr, this.onReqGetgateaddr, this);
        EventClient.I.off(E.Login.ReConnect, this.onReConnect, this);
        EventClient.I.off(E.Login.BacktoLogin, this.onBacktoLoginView, this);
        EventClient.I.off(AppEvent.SocketConnect, this.onConnectServerSucc, this);
        EventClient.I.off(AppEvent.SocketReconnectSucc, this.onSocketReconnectSucc, this);
        EventClient.I.off(E.Config.InitConfigSuccess, this.onInitConfigSuccess, this);
        EventClient.I.off(AppEvent.SocketReconnectFail, this.onReconnectFail, this);
    }

    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CLogin_ID, this.onS2CLogin, this);
        EventProto.I.on(ProtoId.S2CLoginEnd_ID, this.onS2CLoginEnd, this);
        EventProto.I.on(ProtoId.S2CPing_ID, this.onS2CPing, this);
        EventProto.I.on(ProtoId.S2CReLogin_ID, this.onS2CReLogin, this);
        EventProto.I.on(ProtoId.S2CKill_ID, this.onS2CKill, this);
        EventProto.I.on(ProtoId.S2CRealNameTimeLimit_ID, this.onS2CRealNameTimeLimil, this);
        // E.I.addE(ProtoId.S2SKill_ID, this.onS2SKill))
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CLogin_ID, this.onS2CLogin, this);
        EventProto.I.off(ProtoId.S2CLoginEnd_ID, this.onS2CLoginEnd, this);
        EventProto.I.off(ProtoId.S2CPing_ID, this.onS2CPing, this);
        EventProto.I.off(ProtoId.S2CReLogin_ID, this.onS2CReLogin, this);
        EventProto.I.off(ProtoId.S2CKill_ID, this.onS2CKill, this);
        EventProto.I.off(ProtoId.S2CRealNameTimeLimit_ID, this.onS2CRealNameTimeLimil, this);
    }

    public clearAll(): void {
        this.clearHearBeat();
    }

    /** ?????? */
    private onReqRegister(acc: string, pwd: string) {
        const p = this.reqRegister(acc, pwd);
        p.then(
            () => {
                //
            },
            (err) => {
                console.log(err);
            },
        );
    }
    /** ?????? */
    public onReqLogin(acc: string, pwd: string): void {
        const p = this.reqLogin(acc, pwd);
        p.then(
            () => {
                //
            },
            (err) => {
                console.log(err);
            },
        );
    }
    /**
     * ??????
     * @param nick ??????
     * @param auto ??????????????????????????????
     */
    private onReqCreaterole(nick: string, auto: number) {
        const p = this.reqCreaterole(nick, auto);
        p.then(
            () => {
                //
            },
            (err) => {
                console.log(err);
            },
        );
    }
    /** ???????????? */
    private onReqRoleNick(_sex: number) {
        const p = this.reqGetrandnick(_sex);
        p.then(
            () => {
                //
            },
            (err) => {
                console.log(err);
            },
        );
    }
    /** ???????????? */
    private onReqGetgateaddr() {
        const p = this.reqGetgateaddr();
        p.then(
            () => {
                //
            },
            (err) => {
                console.log(err);
            },
        );
    }

    private onInitConfigSuccess() {
        // WinMgr.I.open(ViewConst.TestView, 'sdsda', 1232132);
        this.reqC2SLoginEnd();
        TaskCollector.I.endTask(DB_KEY_ENUM.LodgingEnd, DB_ID_ENUM.ConfigInitEnd);
        WinMgr.I.open(ViewConst.ResLoading);
        RedDotMgr.I.init();
    }

    private onReconnectFail() {
        this.clearHearBeat();
        NetMgr.I.closeNet(false);
        const msg = i18n.tt(Lang.login_net_err);
        WinMgr.I.open(ViewConst.ReqLoginWarnWin, msg, NetConfirmBtnType.btnType3);
    }

    // ===========================http==========================================

    /**
     * ????????????
     * @param name ??????
     * @param pwd ??????
     */
    private async reqRegister(name: string, pwd: string) {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Register;
        const reqData = {
            // ?????????
            UserName: name,
            // ????????????
            UserPass: pwd,
        };

        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo ??????
            console.error('register fail, result:', info.errInfo);
            MsgToastMgr.Show(i18n.tt(Lang.login_net_err));
            return;
        }
        // todo ??????
        let result = null;
        try {
            result = JSON.parse(info.resultInfo);
        } catch (e) {
            // ???????????????res????????????????????????
            console.error('login error, result:', info.resultInfo);
            return;
        }
        if (result.tag !== 0) {
            console.error('login error2, result:', result);
            MsgToastMgr.Show(result.msg);
            return;
        }
        const userName: string = result.UserName;
        const userPass: string = result.UserPass;
        WinMgr.I.close(ViewConst.AccountRegView);
        await this.reqLogin(userName, userPass);
    }

    /** ???????????? */
    private async reqLogin(acc: string, pwd: string) {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Login;
        const model = ModelMgr.I.LoginModel;
        const reqData = {
            // ?????????
            UserName: acc,
            // ????????????
            UserPass: pwd,
            // SDK?????? int32
            sdktype: model.sdktype,
            // ??????????????????
            client_version: model.client_version,
            // ??????Id
            channel_id: model.channel_id,
        };
        // console.log('====http==????????????======', reqData);
        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo ??????
            console.error('login fail, result:', info.errInfo);
            MsgToastMgr.Show(i18n.tt(Lang.login_net_err));
            return;
        }
        // todo ??????
        let result = null;
        try {
            result = JSON.parse(info.resultInfo);
        } catch (e) {
            // ???????????????res????????????????????????
            console.error('login error, result:', info.resultInfo);
            return;
        }
        if (result.tag !== 0) {
            console.error('login error2, result:', result);
            if (result.tag === 602) {
                // ????????????????????????
                WinMgr.I.open(ViewConst.RealNameWin, acc, pwd, model.sdktype, model.channel_id);
            } else if (result.tag === 603) {
                WinMgr.I.open(ViewConst.IdentitykBox, EIdentiType.Logout);
            } else {
                MsgToastMgr.Show(result.msg);
                return;
            }
        }

        const AccountID = result.AccountID;
        const Token = result.Token;
        const IsWhite = result.is_white; // 1?????????
        const GateUrl = result.gate_url; // ????????????
        // eslint-disable-next-line dot-notation
        const AreaInfos: IAreaInfo[] = result['AreaInfos'] || [];
        model.AccountID = AccountID;
        model.Token = Token;
        GameApp.I.IsWhite = IsWhite;
        GameApp.I.GateUrl = GateUrl;
        ModelMgr.I.LoginModel.setData(AreaInfos);
        WinMgr.I.close(ViewConst.AccountLoginView);
        console.log('====????????????=====', result);
        EventClient.I.emit(E.Login.Succ);
        // ????????????????????????
        // EventClient.I.emit(E.Login.ReqRealName);
        // this.onReqGetRealName();
    }

    /** ???????????? */
    private async reqCreaterole(_nick: string, auto: number) {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Createrole;
        const model = ModelMgr.I.LoginModel;
        const reqData = {
            // ??????Id
            account_id: model.AccountID,
            // Token
            token: model.Token,
            // ???Id
            area_id: model.selServerId,
            // ??????
            sex: model.sex,
            // ??????
            nick: _nick,
            // ??????????????????
            auto_create: auto,
        };

        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo
            console.error('Createrole fail, result:', info.errInfo);
            MsgToastMgr.Show(i18n.tt(Lang.login_net_err));
            return;
        }
        let result = null;
        try {
            result = JSON.parse(info.resultInfo);
        } catch (e) {
            // ???????????????res????????????????????????
            console.error('Createrole error, result:', info.resultInfo);
            return;
        }
        if (result.tag !== 0) {
            // ??????????????????????????????????????????????????????????????????????????????????????????
            console.error('Createrole error2, result:', result);
            MsgToastMgr.Show(result.msg);
            return;
        }
        // todo ?????? ????????????
        WinMgr.I.close(ViewConst.CreateRoleView);
        WinMgr.I.open(ViewConst.GameWelcomeWin);
        console.log('Createrole succ, result:', result);
        model.selUserId = result.user_id;
        await this.reqGetgateaddr();
    }

    /** ?????????????????? */
    private async reqGetrandnick(_sex: number) {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Getrandnick;
        const model = ModelMgr.I.LoginModel;
        model.sex = _sex;
        const reqData = {
            // ??????Id
            account_id: model.AccountID,
            // Token
            token: model.Token,
            // ???Id
            area_id: model.selServerId,
            // ??????
            sex: _sex,
        };

        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo ??????
            console.error('get nick fail, result:', info.errInfo);
            MsgToastMgr.Show(i18n.tt(Lang.login_net_err));
            return;
        }
        // todo ??????
        let result = null;
        try {
            result = JSON.parse(info.resultInfo);
        } catch (e) {
            // ???????????????res????????????????????????
            console.error('Getrandnick error1, result:', info.resultInfo);
            return;
        }
        if (result.tag !== 0) {
            console.error('Getrandnick error2, result:', result);
            MsgToastMgr.Show(result.msg);
            return;
        }
        const nick: string = result.nick;
        EventClient.I.emit(E.Login.ResultRoleNick, nick);
    }

    /** ???????????? */
    private async reqGetnotice() {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Getnotice;
        const reqData = {
            // ??????Id
            channel_id: '',
            // ??????
            sort: '',
        };

        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo err
        } else if (info.resultInfo) {
            // todo
        }
    }

    /** ?????????????????? */
    private async reqGetgateaddr() {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Getgateaddr;
        const model = ModelMgr.I.LoginModel;
        const reqData = {
            // ??????ID int32
            user_id: model.selUserId,
            // Token
            token: model.Token,
        };

        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo err
            console.error('getgateaddr fail, result:', info.errInfo);
            MsgToastMgr.Show(i18n.tt(Lang.login_net_err));
            return;
        }
        let result = null;
        try {
            result = JSON.parse(info.resultInfo);
        } catch (e) {
            // ???????????????res????????????????????????
            console.error('Getgateaddr error, result:', info.resultInfo);
            return;
        }
        if (result.tag !== 0) {
            console.error('Getgateaddr error2, result:', result);
            MsgToastMgr.Show(result.msg);
            return;
        }
        // result = info.resultInfo;
        GameApp.I.GateUrl = result.addr;
        console.log('??????????????????', result);
        this.doConnectServer();
    }

    /** ???????????? */
    private async reqGetconfig() {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Getconfig;
        const reqData = {
            // ??????Id int32
            channel_id: 0,
            // Token
            token: '',
        };

        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo err
        } else if (info.resultInfo) {
            // todo
        }
    }

    /** ??????????????? */
    private doConnectServer() {
        EventClient.I.emit(E.Login.GameLoading);
        NetMgr.I.connectNet(GameApp.I.GateUrl);
    }

    /** ????????????????????? */
    private onConnectServerSucc() {
        this.reqC2SLogin();
        // this.startHearBeat();
    }
    /** ???????????? */
    private onSocketReconnectSucc() {
        // this.startHearBeat();
        this.reqC2SReLogin();
    }

    /** ???????????? */
    private onReConnect() {
        this.clearHearBeat();
        NetMgr.I.closeNet();
    }

    /** ?????????????????? */
    private onBacktoLoginView() {
        GameApp.I.exitGame();
    }

    /** ???????????? */
    private reqC2SLogin() {
        const d = new C2SLogin();
        d.AccountID = ModelMgr.I.LoginModel.AccountID;
        d.AreaID = ModelMgr.I.LoginModel.selServerId;
        d.Token = ModelMgr.I.LoginModel.Token;
        // d.Token = '';
        NetMgr.I.sendMessage(ProtoId.C2SLogin_ID, d);
        console.log('C2SLogin_ID: ', ProtoId.C2SLogin_ID, d);
    }

    private onS2CLogin(d: S2CLogin) {
        console.log('?????????????????????', d);
        EventClient.I.emit(E.Config.InitConfigStart);
        // WinMgr.I.close(ViewConst.LoginView);
        // WinMgr.I.open(ViewConst.ResLoading);
        RoleMgr.I.info.userID = d.UserId;
        // this.reqC2SLoginEnd();
    }

    private reqC2SLoginEnd() {
        const d = new C2SLoginEnd();
        d.DataVersion = '123';
        d.LockStepVer = 1;
        NetMgr.I.sendMessage(ProtoId.C2SLoginEnd_ID, d);
    }

    private onS2CLoginEnd(d: S2CLoginEnd) {
        this.clearHearBeat();
        this.startHearBeat();
    }

    /** ???????????? */
    private reqC2SReLogin() {
        const d = new C2SReLogin();
        d.UserId = RoleMgr.I.info.userID;
        d.AreaID = ModelMgr.I.LoginModel.selServerId;
        d.Token = ModelMgr.I.LoginModel.Token;
        NetMgr.I.sendMessage(ProtoId.C2SReLogin_ID, d);
    }

    private onS2CReLogin(d: S2CReLogin) {
        if (d.Tag) {
            // console.log('????????????===', d.Tag);
            this.clearHearBeat();
            NetMgr.I.closeNet(false);
            const msg = MsgToastMgr.GetErrTipsStr(d.Tag);
            WinMgr.I.open(ViewConst.ReqLoginWarnWin, msg, NetConfirmBtnType.btnType2);
            return;
        }
        this.clearHearBeat();
        this.startHearBeat();
    }

    /** ????????????????????? */
    private onS2CKill(d: S2CKill) {
        if (d.Tag) {
            this.clearHearBeat();
            NetMgr.I.closeNet(false);
            let msg = MsgToastMgr.GetErrTipsStr(d.Tag);
            if (d.Tag === 9352) {
                msg = MsgToastMgr.GetMsgC(20002);
            }
            WinMgr.I.open(ViewConst.ReqLoginWarnWin, msg, NetConfirmBtnType.btnType2);
        }
        // console.log('?????????????????????===', d.Tag);
    }

    /** ?????? */
    private reqC2SPing() {
        const d = new C2SPing();
        NetMgr.I.sendMessage(ProtoId.C2SPing_ID, d);
    }
    private onS2CPing(d: S2CPing): void {
        this._sendNum = 0;
        // console.log('??????');
    }

    private _hasSendEvt: boolean = false;
    /** ????????????????????? */
    private _pingTimeout: any = null;
    /** ????????????3s */
    private _time3000: number = 3000;
    /** ?????????????????? */
    private _sendNum: number = 0;
    /** ???????????????????????? */
    private _sendNumMax: number = 3;

    /** ???????????? */
    private startHearBeat() {
        this.clearHearBeat();
        this._pingTimeout = setInterval(() => {
            this.doPing();
        }, this._time3000);
    }

    /** ?????????????????? */
    private clearHearBeat() {
        if (this._pingTimeout) {
            clearTimeout(this._pingTimeout);
            this._pingTimeout = null;
        }
        this._sendNum = 0;
    }

    private syncTime: number = 0;
    private doPing() {
        if (this._sendNum >= this._sendNumMax) {
            this.onReConnect();
        } else {
            this._sendNum++;
            this.reqC2SPing();
        }
        this.syncTime++;
        if (this.syncTime >= 60) {
            this.syncTime = 0;
            ControllerMgr.I.GameController.reqServerMsg();
        }
    }

    private onS2CRealNameTimeLimil(): void {
        WinMgr.I.closeAll(false);
        WinMgr.I.open(ViewConst.IdentitykBox, EIdentiType.Logout);
    }

    /** ??????????????????????????? */
    public onDoKill(): void {
        const msg = '????????????';
        this.clearHearBeat();
        console.log(NetMgr.I.getState());
        if (NetMgr.I.getState()) {
            NetMgr.I.closeNet(false);
        }
        // EventClient.I.emit(E.Login.BacktoLogin);
    }
}
