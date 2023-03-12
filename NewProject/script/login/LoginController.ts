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

    /** 注册 */
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
    /** 登录 */
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
     * 创角
     * @param nick 昵称
     * @param auto 是否自动创建，先留着
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
    /** 获取昵称 */
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
    /** 获取网关 */
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
     * 用户注册
     * @param name 账号
     * @param pwd 密码
     */
    private async reqRegister(name: string, pwd: string) {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Register;
        const reqData = {
            // 账号名
            UserName: name,
            // 账号密码
            UserPass: pwd,
        };

        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo 失败
            console.error('register fail, result:', info.errInfo);
            MsgToastMgr.Show(i18n.tt(Lang.login_net_err));
            return;
        }
        // todo 成功
        let result = null;
        try {
            result = JSON.parse(info.resultInfo);
        } catch (e) {
            // 解析失败，res数据有问题，重试
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

    /** 用户登陆 */
    private async reqLogin(acc: string, pwd: string) {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Login;
        const model = ModelMgr.I.LoginModel;
        const reqData = {
            // 账号名
            UserName: acc,
            // 账号密码
            UserPass: pwd,
            // SDK类型 int32
            sdktype: model.sdktype,
            // 客户端版本号
            client_version: model.client_version,
            // 渠道Id
            channel_id: model.channel_id,
        };
        // console.log('====http==用户登陆======', reqData);
        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo 失败
            console.error('login fail, result:', info.errInfo);
            MsgToastMgr.Show(i18n.tt(Lang.login_net_err));
            return;
        }
        // todo 成功
        let result = null;
        try {
            result = JSON.parse(info.resultInfo);
        } catch (e) {
            // 解析失败，res数据有问题，重试
            console.error('login error, result:', info.resultInfo);
            return;
        }
        if (result.tag !== 0) {
            console.error('login error2, result:', result);
            if (result.tag === 602) {
                // 未实名认证，跳转
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
        const IsWhite = result.is_white; // 1白名单
        const GateUrl = result.gate_url; // 网关路径
        // eslint-disable-next-line dot-notation
        const AreaInfos: IAreaInfo[] = result['AreaInfos'] || [];
        model.AccountID = AccountID;
        model.Token = Token;
        GameApp.I.IsWhite = IsWhite;
        GameApp.I.GateUrl = GateUrl;
        ModelMgr.I.LoginModel.setData(AreaInfos);
        WinMgr.I.close(ViewConst.AccountLoginView);
        console.log('====登录成功=====', result);
        EventClient.I.emit(E.Login.Succ);
        // 请求身份认证信息
        // EventClient.I.emit(E.Login.ReqRealName);
        // this.onReqGetRealName();
    }

    /** 请求创角 */
    private async reqCreaterole(_nick: string, auto: number) {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Createrole;
        const model = ModelMgr.I.LoginModel;
        const reqData = {
            // 帐号Id
            account_id: model.AccountID,
            // Token
            token: model.Token,
            // 区Id
            area_id: model.selServerId,
            // 性别
            sex: model.sex,
            // 昵称
            nick: _nick,
            // 是否自动创建
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
            // 解析失败，res数据有问题，重试
            console.error('Createrole error, result:', info.resultInfo);
            return;
        }
        if (result.tag !== 0) {
            // 如果是自动创建角色遇到了重名，重现请求一次随机名字再请求一次
            console.error('Createrole error2, result:', result);
            MsgToastMgr.Show(result.msg);
            return;
        }
        // todo 成功 进入游戏
        WinMgr.I.close(ViewConst.CreateRoleView);
        WinMgr.I.open(ViewConst.GameWelcomeWin);
        console.log('Createrole succ, result:', result);
        model.selUserId = result.user_id;
        await this.reqGetgateaddr();
    }

    /** 获得随机昵称 */
    private async reqGetrandnick(_sex: number) {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Getrandnick;
        const model = ModelMgr.I.LoginModel;
        model.sex = _sex;
        const reqData = {
            // 帐号Id
            account_id: model.AccountID,
            // Token
            token: model.Token,
            // 区Id
            area_id: model.selServerId,
            // 性别
            sex: _sex,
        };

        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo 失败
            console.error('get nick fail, result:', info.errInfo);
            MsgToastMgr.Show(i18n.tt(Lang.login_net_err));
            return;
        }
        // todo 成功
        let result = null;
        try {
            result = JSON.parse(info.resultInfo);
        } catch (e) {
            // 解析失败，res数据有问题，重试
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

    /** 获取公告 */
    private async reqGetnotice() {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Getnotice;
        const reqData = {
            // 渠道Id
            channel_id: '',
            // 序号
            sort: '',
        };

        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            // todo err
        } else if (info.resultInfo) {
            // todo
        }
    }

    /** 获取网关地址 */
    private async reqGetgateaddr() {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Getgateaddr;
        const model = ModelMgr.I.LoginModel;
        const reqData = {
            // 角色ID int32
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
            // 解析失败，res数据有问题，重试
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
        console.log('获取网关地址', result);
        this.doConnectServer();
    }

    /** 获取配置 */
    private async reqGetconfig() {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + LoginHttpApi.Getconfig;
        const reqData = {
            // 渠道Id int32
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

    /** 链接服务器 */
    private doConnectServer() {
        EventClient.I.emit(E.Login.GameLoading);
        NetMgr.I.connectNet(GameApp.I.GateUrl);
    }

    /** 链接服务器成功 */
    private onConnectServerSucc() {
        this.reqC2SLogin();
        // this.startHearBeat();
    }
    /** 重连成功 */
    private onSocketReconnectSucc() {
        // this.startHearBeat();
        this.reqC2SReLogin();
    }

    /** 处理重连 */
    private onReConnect() {
        this.clearHearBeat();
        NetMgr.I.closeNet();
    }

    /** 返回登录界面 */
    private onBacktoLoginView() {
        GameApp.I.exitGame();
    }

    /** 开始登陆 */
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
        console.log('登录成功。。。', d);
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

    /** 请求重连 */
    private reqC2SReLogin() {
        const d = new C2SReLogin();
        d.UserId = RoleMgr.I.info.userID;
        d.AreaID = ModelMgr.I.LoginModel.selServerId;
        d.Token = ModelMgr.I.LoginModel.Token;
        NetMgr.I.sendMessage(ProtoId.C2SReLogin_ID, d);
    }

    private onS2CReLogin(d: S2CReLogin) {
        if (d.Tag) {
            // console.log('重连失败===', d.Tag);
            this.clearHearBeat();
            NetMgr.I.closeNet(false);
            const msg = MsgToastMgr.GetErrTipsStr(d.Tag);
            WinMgr.I.open(ViewConst.ReqLoginWarnWin, msg, NetConfirmBtnType.btnType2);
            return;
        }
        this.clearHearBeat();
        this.startHearBeat();
    }

    /** 服务器主动断开 */
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
        // console.log('服务器主动断开===', d.Tag);
    }

    /** 心跳 */
    private reqC2SPing() {
        const d = new C2SPing();
        NetMgr.I.sendMessage(ProtoId.C2SPing_ID, d);
    }
    private onS2CPing(d: S2CPing): void {
        this._sendNum = 0;
        // console.log('心跳');
    }

    private _hasSendEvt: boolean = false;
    /** 心跳定时器句柄 */
    private _pingTimeout: any = null;
    /** 心跳间隔3s */
    private _time3000: number = 3000;
    /** 发送心跳次数 */
    private _sendNum: number = 0;
    /** 发送心跳次数限制 */
    private _sendNumMax: number = 3;

    /** 开始心跳 */
    private startHearBeat() {
        this.clearHearBeat();
        this._pingTimeout = setInterval(() => {
            this.doPing();
        }, this._time3000);
    }

    /** 清理心跳状态 */
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

    /** 踢下线主动断开链接 */
    public onDoKill(): void {
        const msg = '下线提示';
        this.clearHearBeat();
        console.log(NetMgr.I.getState());
        if (NetMgr.I.getState()) {
            NetMgr.I.closeNet(false);
        }
        // EventClient.I.emit(E.Login.BacktoLogin);
    }
}
