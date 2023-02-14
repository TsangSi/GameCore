/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-len */
import { EventM } from '../../core/event/EventManager';
import { ServerMonitor } from '../../common/ServerMonitor';
import UtilsPlatform from '../../utils/UtilsPlatform';
import UtilsStorage from '../../utils/UtilsStorage';
import MsgToast from '../Toast/MsgToast';
import { UI_NAME } from '../UIConfig';
import UIManager from '../UIManager';

export default class LoginManager {
    private static _I: LoginManager = null;
    public static get I(): LoginManager {
        if (this._I == null) {
            this._I = new LoginManager();
        }
        return this._I;
    }

    private _cpsId = 20;
    public get cpsId(): number {
        return this._cpsId;
    }
    public set cpsId(v) {
        this._cpsId = v;
    }

    private _userToken = '';
    public get userToken(): string {
        return this._userToken;
    }
    public set userToken(v) {
        this._userToken = v;
    }

    private _fromUserId = 0;
    /** 邀请人id */
    public get fromUserId(): number {
        return this._fromUserId;
    }
    public set fromUserId(v: number) {
        this._fromUserId = v;
    }

    private _enterShareId = 0;
    /** 用户是根据哪个分享id带来的人 */
    public get enterShareId(): number {
        return this._enterShareId;
    }
    public set enterShareId(v: number) {
        this._enterShareId = v;
    }

    private _extClientInfo = 0;
    /** 登录时上传用户设备信息增加的扩展字段 */
    public get extClientInfo(): number {
        return this._extClientInfo;
    }
    public set extClientInfo(v: number) {
        this._extClientInfo = v;
    }

    private _channelId = 20; // 26 小游戏
    /** 登录时上传用户设备信息增加的扩展字段 */
    public get channelId(): number {
        return this._channelId;
    }
    public set channelId(v: number) {
        this._channelId = v;
    }

    private _user_id = 0;
    /** 第三方用户标识 */
    public get user_id(): number {
        return this._user_id;
    }
    public set user_id(v: number) {
        this._user_id = v;
    }

    private _platform = '';
    /** h5 android ios */
    public get platform(): string {
        return this._platform;
    }
    public set platform(v: string) {
        this._platform = v;
    }
    private _version = 1009;
    /** 版本号 */
    public get version(): number {
        return this._version;
    }
    public set version(v: number) {
        this._version = v;
    }

    private _uuid = 1009;
    /** uuid */
    public get uuid(): number {
        return this._uuid;
    }
    public set uuid(v: number) {
        this._uuid = v;
    }

    private _game_id = 2;
    /** 此游戏唯一标识 */
    public get game_id(): number {
        return this._game_id;
    }
    public set game_id(v: number) {
        this._game_id = v;
    }

    private _firstInGame = false;
    /** 第一次进去游戏 */
    public get firstInGame(): boolean {
        return this._firstInGame;
    }
    public set firstInGame(v: boolean) {
        this._firstInGame = v;
    }

    private _IsRealName = 2;
    /** 0未绑定身份证，1绑定未满18岁，2绑定，满十八岁 */
    public get IsRealName(): number {
        return this._IsRealName;
    }
    public set IsRealName(v: number) {
        this._IsRealName = v;
    }
    private _curVersion = 0;
    /** 0; //url中版本号 */
    public get curVersion(): number {
        return this._curVersion;
    }
    public set curVersion(v: number) {
        this._curVersion = v;
    }

    private _noJump = 0;
    public get noJump(): number {
        return this._noJump;
    }
    public set noJump(v: number) {
        this._noJump = v;
    }
    private _selectVersion = 0;
    public get selectVersion(): number {
        return this._selectVersion;
    }
    public set selectVersion(v: number) {
        this._selectVersion = v;
    }
    private _verified = 0;
    public get verified(): number {
        return this._verified;
    }
    public set verified(v: number) {
        this._verified = v;
    }

    public loginData = {
        AreaId: 0,
        AccountId: 0,
        Token: '',
        UserId: 0,
        LoginPf: '',
        Fcm: this._IsRealName, // 0，1，2实名认证状态,
        CheckWordUrl: '', // 屏蔽关键字地址
    };

    /** 最新服务器信息 */
    public maxInfo: any;

    private server_info: Record<string, any> = null;
    public setServerInfo(servers): void {
        this.server_info = servers;
    }

    public getServerInfo(): Record<string, any> {
        return this.server_info;
    }

    public requestServer(): void {
        if (window.SDK) {
            return;
        }
        // 请求服务器列表
        const _lac = UtilsStorage.getItem('acc_token');
        const _lacD = JSON.parse(_lac);
        if (!_lacD.account_id) {
            MsgToast.ShowWithColor('用户ID获取错误', 5000);
            return;
        }
        if (!_lacD.token) {
            MsgToast.ShowWithColor('Token获取错误', 5000);
            return;
        }

        const res = JSON.parse(UtilsStorage.getItem('serverInfo'));
        const _serverInfo = res.data.server_info;
        // 1正常  2新区 3推荐
        const _allServer: { area_id: number, area_name: string, role_id: number, server_addr: '', server_id: number, server_status: number, ver: number }[] = _serverInfo.all_server;
        if (_allServer.length <= 0) {
            MsgToast.ShowWithColor('服务器数据为空', 5000);
            return;
        }
        const bestServer: { area_id: number, area_name: string, role_id: number, server_addr: '', server_id: number, server_status: number, ver: number }[] = [];
        // 查找最新服务器
        for (let i = 0, l = _allServer.length; i < l; i++) {
            const _item = _allServer[i];
            if (_item.server_status === 3) {
                bestServer.push(_item);
            }
        }
        if (bestServer.length > 0) {
            this.maxInfo = bestServer[Math.floor(Math.random() * bestServer.length)];
        } else {
            this.maxInfo = _allServer[Math.floor(Math.random() * _allServer.length)];
        }
        // if (CreateRole.CreateData) {
        //     this.maxInfo = CreateRole.CreateData;
        // }
        UtilsStorage.setItem('maxInfo', this.maxInfo);
        ServerMonitor.I.game_server.serverId = this.maxInfo.server_id;
        ServerMonitor.I.game_server.areaId = this.maxInfo.area_id;
        if (!UtilsPlatform.isWechatGame()) {
            if (LoginManager.I.curVersion) {
                const _max = this.maxInfo;
                if (_max.client_ver && LoginManager.I.curVersion !== _max.client_ver && !LoginManager.I.noJump) {
                    const _url = window.location.href;
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    const _v = `/v${_max.client_ver}/`;
                    const _url2 = _url.replace(/\/v(\S*)\//, _v);
                    window.location.href = _url2;
                }
            }
        }
    }

    /**
    * 兼容平台方法
    */
    public createSuccess1(res): void {
        const _lac = UtilsStorage.getItem('acc_token');
        const _lacD = JSON.parse(_lac);
        // 0：ws, 1:wss
        const _serverIpArg = _lacD.ip.split('|');
        let _serverIp: any;
        if (ServerMonitor.I.getWSType() === 'ws') {
            _serverIp = _serverIpArg[0];
        } else if (ServerMonitor.I.getWSType() === 'wss') {
            _serverIp = _serverIpArg[1];
        }
        ServerMonitor.I.game_server.ws = _serverIpArg[0];
        ServerMonitor.I.game_server.wss = _serverIpArg[1];
        ServerMonitor.I.game_server.userId = res.data.userid;
        if (!_serverIp) {
            MsgToast.ShowWithColor('IP地址错误', 5000);
            return;
        }
        LoginManager.I.firstInGame = true;
        UIManager.I.close(UI_NAME.CreateRole);
        EventM.I.fire(EventM.Type.Login.ChangeView, 0);
        LoginManager.I.user_id = res.data.userid;
        // 建立websocket 连接
        this.C2SLogin({
            AreaId: ServerMonitor.I.game_server.areaId,
            AccountId: _lacD.account_id,
            Token: _lacD.sign,
        });

        EventM.I.fire(EventM.Type.Login.InitUserLoginResult);

        // 创建角色成功
        if (LoginManager.I.platform === UtilsPlatform.Type.androidNative) {
            const _userId = res.data.userid;

            window.WebViewJavascriptBridge.callHandler('submitFromWeb', {
                type: 'actionRegister',
                param: _userId,
            });
        }
    }

    public C2SLogin(data): void {
        LoginManager.I.loginData.LoginPf = LoginManager.I.platform;
        const checkWordUrl = window.localStorage.getItem('check_word_url');
        LoginManager.I.loginData.CheckWordUrl = checkWordUrl ? encodeURIComponent(checkWordUrl) : '';

        for (const key in data) {
            // eslint-disable-next-line no-prototype-builtins
            if (LoginManager.I.loginData.hasOwnProperty(key)) {
                LoginManager.I.loginData[key] = data[key];
            }
        }
    }

    public createSuccess(res): void {
        if (window.SDK) {
            this.createSuccess1(res);
            return;
        }
        const _lac = UtilsStorage.getItem('acc_token');
        const _lacD = JSON.parse(_lac);
        // 0：ws, 1:wss
        const _serverIpArg = this.maxInfo.server_addr.split('|');
        let _serverIp: any;
        if (ServerMonitor.I.getWSType() === 'ws') {
            _serverIp = _serverIpArg[0];
        } else if (ServerMonitor.I.getWSType() === 'wss') {
            _serverIp = _serverIpArg[1];
        }
        ServerMonitor.I.game_server.ws = _serverIpArg[0];
        ServerMonitor.I.game_server.wss = _serverIpArg[1];
        if (!_serverIp) {
            MsgToast.ShowWithColor('IP地址错误', 5000);
            return;
        }
        LoginManager.I.firstInGame = true;
        UIManager.I.close(UI_NAME.CreateRole);
        EventM.I.fire(EventM.Type.Login.ChangeView, 0);
        LoginManager.I.user_id = res.data.userid;
        ServerMonitor.I.game_server.userId = res.data.userid;
        // 建立websocket 连接
        this.C2SLogin({
            AreaId: ServerMonitor.I.game_server.areaId,
            AccountId: _lacD.account_id,
            Token: _lacD.token,
        });
        EventM.I.fire(EventM.Type.Login.InitUserLoginResult);
        // 创建角色成功
        if (LoginManager.I.platform === UtilsPlatform.Type.androidNative) {
            const _userId = res.data.userid;

            window.WebViewJavascriptBridge.callHandler('submitFromWeb', {
                type: 'actionRegister',
                param: _userId,
            });
        }
    }

    private _cVersion = '';
    public get cVersion(): string {
        return this._cVersion;
    }

    public set cVersion(v: string) {
        this._cVersion = v;
    }

    // 根据服务器状态，判断是否能够进入服务器
    public chargeServerStatus(serverStatus: number, roleId: number): { b: boolean, msg: string } {
        const _r = {
            b: true, // 是否能够进入游戏
            msg: '', // 当不能进入游戏时，返回的提示信息
        };
        if (serverStatus === undefined || serverStatus == null) {
            _r.b = false;
            return _r;
        }

        // 判断当前区服是否火爆
        if (serverStatus === LoginManager.PlayServerStatus.hot && roleId === 0) {
            _r.b = false;
            _r.msg = '服务器注册人数已达上限，请选择其他区服';
            return _r;
        }

        // 是否维护中
        if (serverStatus === LoginManager.PlayServerStatus.maintain || serverStatus === LoginManager.PlayServerStatus.test) {
            _r.b = false;
            _r.msg = '服务器维护中，请选择其他区服';
            return _r;
        }

        // 是否不存在
        if (serverStatus === LoginManager.PlayServerStatus.dele) {
            _r.b = false;
            _r.msg = '服务器不存在，请选择其他区服';
            return _r;
        }
        return _r;
    }

    public static PlayServerStatus = {
        /** 删除 */
        dele: -1,
        /** 维护 */
        maintain: 0,
        /** 正常 */
        normal: 1,
        /** 火爆 */
        hot: 2,
        /** 新区 */
        new: 3,
        /** 测试 */
        test: 4,
    }
}
