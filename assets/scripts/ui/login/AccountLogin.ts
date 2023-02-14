/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
 Asset, assetManager, EditBox, Node, _decorator,
} from 'cc';
import { EventM } from '../../common/EventManager';
import { ServerMonitor } from '../../common/ServerMonitor';
import GlobalConfig from '../../config/GlobalConfig';
import HttpManager from '../../net/HttpManager';
import { ReportManager } from '../../net/ReportManager';
import UtilsCC from '../../utils/UtilsCC';
import UtilsStorage from '../../utils/UtilsStorage';
import { BaseView } from '../base/BaseView';
import MsgToast from '../Toast/MsgToast';
import { UI_NAME } from '../UIConfig';
import UIManager from '../UIManager';
import LoginManager from './LoginManager';
// 账号登录

const { ccclass, property } = _decorator;
@ccclass
export default class AccountLogin extends BaseView {
    @property(EditBox)
    private Acc: EditBox = null;
    @property(EditBox)
    private Pwd: EditBox = null;

    @property(Node)
    private BtnReg: Node = null;

    @property(Node)
    private BtnAcc: Node = null;

    @property(Asset)
    private mainFestUrl: Asset = undefined;

    private static _preg = /^[a-zA-Z0-9]{6,16}$/;

    protected onLoad(): void {
        UIManager.I.close(UI_NAME.AccountReg);
        this.Acc.string = UtilsStorage.getItem('acc') || '';
        this.Pwd.string = UtilsStorage.getItem('pwd') || '';
        let ddd;
        UtilsCC.setClickFunc(ddd, this.onRegClicked, this);
        UtilsCC.setClickFunc('sprite4', this.node, this.onSureClicked, this);
        // const editbox_acc = UtilsCC.getEditBox('input_account', this.node);
        // editbox_acc.node.on(EditBox.EventType.EDITING_DID_BEGAN, this.onInputAccount, this);
    }

    protected start(): void {
        // setTimeout(()=> {
        //     UIManager.I.close(UI_NAME.AccountLogin);
        // }, 2000);
        // console.log('=-====', assetManager);
        console.log('000=', assetManager.assets);
    }

    private onInputAccount(editbox: EditBox) {
        console.log('editbox.string=', editbox.string);
    }

    private onRegClicked(arg1, arg2, arg3, arg4) {
        console.log(arg1);
        // console.log('111=', assetManager.assets);
        // UIManager.I.close(UI_NAME.AccountLogin);
        UIManager.I.show(UI_NAME.AccountReg);
    }

    private onSureClicked(arg1, arg2, arg3, arg4) {
        console.log('arg1=', arg1);
        console.log('arg2=', arg2);
        this.loginBtn();
    }

    private loginBtn() {
        // 登录
        // 获取账号密码
        const _acc = this.Acc.string;
        const _pwd = this.Pwd.string;

        // 验证账号秘密
        if (_acc === '') {
            MsgToast.ShowWithColor('账号不能为空', 5000);
            return;
        }
        if (_pwd === '') {
            MsgToast.ShowWithColor('密码不能为空', 5000);
            return;
        }
        if (!AccountLogin._preg.test(_acc)) {
            MsgToast.ShowWithColor('帐号输入不正确', 5000);
            return;
        }
        if (!AccountLogin._preg.test(_pwd)) {
            MsgToast.ShowWithColor('密码输入不正确', 5000);
            return;
        }
        // 验证通过
        // 请求登录
        this.regRequest(_acc, _pwd);
        UtilsStorage.setItem('acc', _acc);
        UtilsStorage.setItem('pwd', _pwd);
    }
    // 与支撑组对接SDK接口
    // http://192.168.22.203:8001/?game_id=2&channel_id=3&user_id=90&userToken=eyJ
    // hbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDc3OTY0MTIsImlzcyI6IjkwIn0.op
    // 1BPEp0C9bRSy75xdk6eEXXzRztXJhSKFA-tQmJVfI&timestamp=121312&sign=123123
    private regRequest(acc, pwd) {
        const loginI = LoginManager.I;
        HttpManager.I.post(`${GlobalConfig.I.httpUrl}/api/login`, {
            UserName: acc || '',
            Password: pwd || '',
            Type: loginI.userToken ? 4 : 1, // 1账号密码,4第三方
            CpsId: loginI.cpsId ? loginI.cpsId : 3, // 第三方登录
            SubCpsId: 0,
            Imei: UtilsStorage.GetUUid(),
            from_user_id: loginI.fromUserId,
            share_id: loginI.enterShareId,
            SysVer: '',
            PhoneModel: '',
            LoginVer: '',
            ClientOnly: '',
            Ext: loginI.extClientInfo,
            ChannelId: loginI.channelId ? loginI.channelId : 0,
            SPName: '',
            SdkVer: '',
            ThirdToken: loginI.userToken ? loginI.userToken : '',
            ThirdUID: loginI.user_id ? loginI.user_id : '',
            IsRealName: 0, // 未绑定身份证，1绑定未满18岁，2绑定，满十八岁
            pf: loginI.platform,
            ver: loginI.version,
        }, (res) => {
            res = JSON.parse(res);
            if (res.code === 1) {
                UtilsStorage.setItem('acc_token', JSON.stringify(res.data));
                ReportManager.I.SendDelay(ReportManager.Type.LoginSuccess); // 上报
                if (res.data.new_userid) {
                    ReportManager.I.SendDelay(ReportManager.Type.LoginNewPlayer); // 上报
                    const svr = {
                        data: {
                            server_info: {
                                all_server: [res.data.new_server],
                            },
                        },
                    };
                    UtilsStorage.setItem('serverInfo', JSON.stringify(svr));
                    LoginManager.I.requestServer();
                    LoginManager.I.createSuccess({ data: { userid: res.data.new_userid } });
                    this.node.destroy();
                } else {
                    // 登录成功
                    // 请求服务器列表，判断是否有角色，从而判断是进入开始游戏界面，还是创建角色界面
                    HttpManager.I.post(`${GlobalConfig.I.httpUrl}/api/playServerInfo`, {
                        account_id: res.data.account_id,
                        token: res.data.token,
                        pf: loginI.platform,
                        ver: loginI.version,
                        cpsId: loginI.channelId ? loginI.channelId : 0,
                    }, (res2) => {
                        res2 = JSON.parse(res2);
                        if (res2.code === 1) {
                            UtilsStorage.setItem('serverInfo', JSON.stringify(res2));
                            ReportManager.I.SendDelay(ReportManager.Type.ServerUrlLoaded); // 上报
                            const _serverInfo = res2.data.server_info;
                            loginI.setServerInfo(_serverInfo);
                            // if (true) {
                            // if (_serverInfo.play_server.length > 0) {
                            _serverInfo.play_server.sort((a, b) => b.login_time - a.login_time);
                            // 此账号有角色
                            const _recData = _serverInfo.play_server[0];
                            if (_recData) {
                                const _ws = _recData.server_addr.split('|');

                                // 0:ws, 1:wss
                                /*
                                    * {ws:'',wss:'',userId:123};
                                    * */
                                loginI.user_id = _recData.user_id;
                                ServerMonitor.I.gameServer.userId = _recData.user_id;
                                ServerMonitor.I.gameServer.serverId = _recData.server_id;
                                ServerMonitor.I.gameServer.areaId = _recData.area_id;
                                ServerMonitor.I.gameServer.ws = _ws[0];
                                ServerMonitor.I.gameServer.wss = _ws[1];
                                loginI.selectVersion = _recData.client_ver;
                                const _obj = {
                                    ws: _ws[0],
                                    wss: _ws[1],
                                };
                                UtilsStorage.setItem('wsInfo', JSON.stringify(_obj));
                            }
                            UIManager.I.close(UI_NAME.AccountLogin);
                            EventM.I.fire(EventM.Type.Login.ChangeView, 2);
                            LoginManager.I.C2SLogin({
                                AreaId: ServerMonitor.I.gameServer.areaId,
                                AccountId: res.data.account_id,
                                Token: res.data.token,
                            });
                            // } else {
                            // 进入创建角色界面
                            // _self.close();
                            // Loading.mustLoadPrefab(UI_PH.StartLoading, (p: cc.Prefab) => {
                            //     let node = cc.instantiate(p);
                            //     GmMgr.I.loginUI.addChild(node);
                            // })
                            // }
                        } else {
                            ReportManager.I.SendDelay(ReportManager.Type.ServerClosed1); // 上报
                        }
                    });
                }
                UIManager.I.close(UI_NAME.AccountLogin);
            } else {
                // alert(res.msg);
                MsgToast.ShowWithColor(res.msg || '');
                // ReportManager.I.SendDelay(ReportManager.Type.LoginFailed);        //上报
                // //登陆失败,跳转登陆页
                // if (UtilsPlatform.isWechatGame()) {
                //     loginI.RequestWXInfo();
                // } else {
                //     loginI.Login();
                // }
            }
        });
        // GmPcy.I.beginLoadJson(GmPcy.I.MERGE_MAX_COUNT);
        // ResMgr.I.loadAdvance(GAME_BLOCK.LOAD);
    }

    protected onDestroy(): void {
        console.log('accountlogin ondestroy');
        super.onDestroy();
    }
}
