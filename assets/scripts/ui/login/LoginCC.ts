/* eslint-disable max-len */
import { Asset, resources } from 'cc';
import { EventM } from '../../common/EventManager';
import { ServerMonitor } from '../../common/ServerMonitor';
import UtilsPlatform from '../../utils/UtilsPlatform';
import UtilsStorage from '../../utils/UtilsStorage';
import LoginManager from './LoginManager';

export default class LoginCC {
    private static instance: LoginCC = null;
    public static get I (): LoginCC {
        if (!this.instance) {
            this.instance = new LoginCC();
            this.instance.init();
        }
        return this.instance;
    }

    init () {
        ServerMonitor.I.proxyOn(ProtoId.S2CLogin_ID, this._on_S2CLogin, this);
    }

    fini () {
        ServerMonitor.I.proxyOff(ProtoId.S2CLogin_ID, this._on_S2CLogin, this);
    }

    public loginData = {
        AreaId: 0,
        AccountId: 0,
        Token: '',
        UserId: 0,
        LoginPf: '',
        Fcm: LoginManager.I.IsRealName, // 0，1，2实名认证状态,
        CheckWordUrl: '', // 屏蔽关键字地址
    };
    /**
     * 登陆包 发送
     */
    C2SLoginStart () {
        // 存储一下登录的数据，方便重连的时候使用
        if (ServerMonitor.I.game_server.areaId) {
            UtilsStorage.setItem('login_area_id', ServerMonitor.I.game_server.areaId);
        }
        if (LoginManager.I.platform) {
            UtilsStorage.setItem('login_platform', LoginManager.I.platform);
        }
        if (ServerMonitor.I.game_server.userId) {
            UtilsStorage.setItem('login_userId', ServerMonitor.I.game_server.userId);
        }
        if (LoginManager.I.loginData) {
            LoginManager.I.loginData.UserId = ServerMonitor.I.game_server.userId ? ServerMonitor.I.game_server.userId : +UtilsStorage.getItem('login_userId');
            LoginManager.I.loginData.LoginPf = LoginManager.I.platform ? LoginManager.I.platform : UtilsStorage.getItem('login_platform');
            LoginManager.I.loginData.AreaId = ServerMonitor.I.game_server.areaId ? ServerMonitor.I.game_server.areaId : +UtilsStorage.getItem('login_area_id');

            if (UtilsPlatform.isPrimitive()) {
                resources.load('cacert', Asset, (err, d: Asset) => {
                    console.log('d.nativeUrl=', d.nativeUrl);
                    ServerMonitor.I.join(d.nativeUrl);
                    ServerMonitor.I.post(ProtoId.C2SLogin_ID, LoginManager.I.loginData);
                });
            } else {
                ServerMonitor.I.join();
                ServerMonitor.I.post(ProtoId.C2SLogin_ID, LoginManager.I.loginData);
            }
        }
    }

    _on_S2CLogin (d: S2CLogin) {
        if (d.Tag === 0) {
            // const dd = new C2SLogin({ account: 1 });
            LoginManager.I.user_id = d.UserId;
            EventM.I.fire(EventM.Type.Login.LoginSuccess, d);
        }
    }

    c_C2SLoginEnd() {
        ServerMonitor.I.post(ProtoId.C2SLoginEnd_ID);
    }
}
