/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    Component, AnimationClip, Sprite, SpriteAtlas, SpriteFrame, utils, _decorator, ProgressBar, Label, resources, assetManager, Asset, TextAsset,
} from 'cc';
import { EffectManager } from '../../common/EffectManager';
import { EventM } from '../../core/event/EventM';
import { ServerMonitor } from '../../common/ServerMonitor';
import CfgManager from '../../config/CfgManager';
import GlobalConfig from '../../config/GlobalConfig';
import { ResCleaner } from '../../global/ResCleaner';
import HttpManager from '../../net/HttpManager';
import { RegNetPack } from '../../net/RegNetPack';
import { ReportManager } from '../../net/ReportManager';
import Utils from '../../utils/Utils';
import UtilsCC from '../../utils/UtilsCC';
import UtilsPlatform from '../../utils/UtilsPlatform';
import UtilsStorage from '../../utils/UtilsStorage';
import { BaseView } from '../base/BaseView';
import MsgToast from '../Toast/MsgToast';
import { UI_NAME } from '../UIConfig';
import UIManager from '../UIManager';
import LoginCC from './LoginCC';
import LoginManager from './LoginManager';

const { ccclass, property } = _decorator;

@ccclass('LoginView')
export class LoginView extends BaseView {
    public curServerData: any;// 最近登录信息
    protected onLoad(): void {
        this.on(EventM.Type.Login.ChangeView, this.onChangeView);
        this.on(EventM.Type.Login.InitUserLoginResult, this.onInitUserLoginResult);
        this.on(EventM.Type.Login.UpdateSelectServer, this.onUpdateSelectServer);
        this.on(EventM.Type.Login.LoginSuccess, this.onLoginSuccess);
        this.on(EventM.Type.Config.InitConfigComplete, this.onInitConfigComplete);
    }

    protected start(): void {
        const btn = UtilsCC.setClickFunc('startGame/Button', this.node, this.onLoginClicked, this);
        UtilsCC.setString('startGame/Label', this.node, `当前版本号：${LoginManager.I.cVersion || ''}`);

        EffectManager.I.showEffect('e/login/ui_8028', btn, AnimationClip.WrapMode.Loop);

        // UtilsCC.setSprite(this.node.getChildByName('Sprite'), 'http://192.168.123.95/h5/map/minimap/1003.jpg', (sp: Sprite) => {
        //     //
        //     console.log(sp);
        // });

        assetManager.loadRemote('http://192.168.123.95/h5/1/11.frame', (err: Error | null, asset: TextAsset) => {
            if (err) {
                console.log('err=', err);
            }
            console.log('asset=', asset);
        });

        UtilsCC.setClickFunc('startGame/Layout/selectinfo/Sprite', this.node, this.onServerchoseClicked, this);
        UIManager.I.show(UI_NAME.AccountLogin);
        // let randoms = [];
        // for (let i = 1; i <= 100000; i++) {
        //     randoms.push(Utils.randomNum(1, 1000000));
        // }
        // console.time('1111');
        // let list = [];
        // for (let i = 0; i < 100000; i++) {
        //     Utils.insertToAscUniqueArray(list, randoms[i]);
        // }
        // console.timeEnd('1111');
        // console.log(list);
        // let list2 = [];
        // console.time('2222');
        // for (let i = 0; i < 100000; i++) {
        //     Utils.insertToAscUniqueArray(list2, randoms[i], false);
        // }
        // console.timeEnd('2222');
        // console.log(list2);
        // console.time('3333');
        // let list3 = [];
        // for (let i = 0; i < 100000; i++) {
        //     list3.push(randoms[i]);
        // }
        // console.timeEnd('3333');
        // console.time('4444');
        // list3.sort((a, b) => a-b);
        // console.timeEnd('4444');
        // console.log(list3);

        // console.time('555');
        //     Utils.insertToAscUniqueArray(list, 500, false);
        //     console.timeEnd('555');
        //     console.time('666');
        //         Utils.insertToAscUniqueArray(list2, 500, false);
        //         console.timeEnd('666');
    }

    private onServerchoseClicked() {
        UIManager.I.show(UI_NAME.ServerChose);
        // let button = UtilsCC.getNode('startGame/Button', this.node);
        // button.destroyAllChildren();

        // setTimeout(() => {
        //     EffectManager.I.showEffect('e/login/ui_8028', button, AnimationClip.WrapMode.Loop);
        // }, 5000);
    }

    private onLoginClicked() {
        // 开始游戏
        // 连接服务器
        // AccountId
        // Token
        // 判断是否是维护状态
        const _curServerData = this.curServerData;
        if (_curServerData) {
            const _b = this.chargeServerStatus(_curServerData.server_status, _curServerData.role_id);
            if (!_b || !_b.b) {
                if (_b.msg) {
                    MsgToast.ShowWithColor(_b.msg || '');
                }
                return;
            }
        } else {
            MsgToast.Show('请重新选择正确服务器');
            return;
        }

        if (UtilsPlatform.isWechatGame()) {
            //
        } else if (LoginManager.I.curVersion) {
            if (LoginManager.I.selectVersion && LoginManager.I.curVersion !== LoginManager.I.selectVersion && !LoginManager.I.noJump) {
                const _url = window.location.href;
                const _v = `/v${LoginManager.I.selectVersion}/`;
                const _url2 = _url.replace(/\/v(\S*)\//, _v);
                UtilsStorage.setItem('reconnection', ServerMonitor.I.game_server.userId.toString());
                window.location.href = _url2;
                return;
            }
        }
        // this.node.active = false;
        UtilsCC.setActive('startGame', this.node, false);
        if (this.curServerData) {
            if (!this.curServerData.role_id) {
                UIManager.I.show(UI_NAME.CreateRole);
                return;
            }
        }
        this.onInitUserLoginResult();
    }

    private onInitConfigComplete() {
        LoginCC.I.C2SLoginStart();
    }

    private login(acc: string, pwd: string) {
        const loginI = LoginManager.I;
        HttpManager.I.post(GlobalConfig.getHttpLoginUrl(), {
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
        }, this.loginResult.bind(this));
    }

    private loginResult(res) {
        res = JSON.parse(res);
        if (res.code === 1) {
            UtilsStorage.setItem('acc_token', JSON.stringify(res.data));
            if (res.data.new_userid) {
                // new player
                const svr = {
                    data: {
                        server_info: {
                            all_server: [res.data.new_server],
                        },
                    },
                };
                UtilsStorage.setItem('serverInfo', JSON.stringify(svr));
                UIManager.I.show(UI_NAME.CreateRole);
            }
            console.log('login success');
        } else {
            console.log('res=', res);
        }
    }

    private onChangeView(index: number) {
        if (index === 2) {
            UtilsCC.setActive('startGame', this.node, true);
            this.requestServer();
            // setTimeout(() => {
            //     console.log('aaaaaaaa=', assetManager.assets);
            //     UIManager.I.show(UI_NAME.Sword);
            // }, 1000);
        }
    }

    private requestServer() {
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
        const _serverInfo = LoginManager.I.getServerInfo();
        if (_serverInfo) {
            // _self.serverInfo = _serverInfo;

            const _allServer = _serverInfo.all_server;
            if (_allServer.length <= 0) {
                return;
            }
            _allServer.sort((a, b) => b.login_time - a.login_time);
            // 查找最新服务器
            let _maxInfo: any = null;
            for (let i = 0, l = _allServer.length; i < l; i++) {
                const _item = _allServer[i];
                if (_item.server_id) {
                    _maxInfo = _item;
                    break;
                }
            }
            if (_maxInfo) {
                // 最新服务器
                // _self.NewServerName.string = '双线' + _maxInfo.area_id + '服';
                UtilsCC.setString('startGame/Layout/newinfo/name', this.node, _maxInfo.area_name);
            }
            // 查找最近登录的服务器
            const _recArg = _serverInfo.play_server;
            if (_recArg.length <= 0) {
                // return false;
                _recArg.push(_allServer[0]);
            }
            let _recData: any = null;
            if (_recArg.length === 1) {
                // 直接取
                _recData = _recArg[0];
            } else {
                // 按照时间排序
                _recArg.sort((a, b) => b.login_time - a.login_time);
                _recData = _recArg[0];
            }

            if (_recData) {
                // 最近登录
                UtilsCC.setString('startGame/Layout/selectinfo/title', this.node, _recData.area_name);
                this.curServerData = _recData;
                const _ws = _recData.server_addr.split('|');
                // 0:ws, 1:wss
                /*
                * {ws:'',wss:'',userId:123};
                * */
                // Game.I.SetUserId(_recData.user_id)
                ServerMonitor.I.game_server.serverId = _recData.server_id;
                ServerMonitor.I.game_server.areaId = _recData.area_id;
                LoginManager.I.selectVersion = _recData.client_ver;
                ServerMonitor.I.game_server.ws = _ws[0];
                ServerMonitor.I.game_server.wss = _ws[1];
                const _obj = {
                    ws: _ws[0],
                    wss: _ws[1],
                };
                UtilsStorage.setItem('wsInfo', JSON.stringify(_obj));

                // let _str = '';
                // switch (_recData.server_status) {
                //     case 0:
                //         //维护
                //         _str = 'i/m/login/img_fwqhui';
                //         break;
                //     case 1:
                //         //正常
                //         _str = 'i/m/login/img_fwqlv';
                //         break;
                //     case 2:
                //         //火爆
                //         _str = 'i/m/login/img_fwqhong';
                //         break;
                //     case 3:
                //         //新区
                //         _str = 'i/m/login/img_fwqlv';
                //         break;
                //     case 4:
                //         //测试
                //         _str = 'i/m/login/img_fwqlv';
                //         break;
                //     default:
                //         _str = 'i/m/login/img_fwqlv';
                //         break
                // }
                // 上面资源缺失
                // Utils.I.setSprite(this.ServerState, _str);
            }
        }
    }

    private intervalID;
    private loadTime;
    private loadCurr;
    private loadDelay;
    public loadCurrs: number[] = [0, 0, 0, 0];
    private onInitUserLoginResult() {
        UtilsCC.setActive('startGame', this.node, false);
        // this.loadbar.getChildByName("img_bj").active = Game.I.firstInGame;
        ReportManager.I.SendDelay(ReportManager.Type.LoadJsonConfig);
        const loadbar = UtilsCC.setActive('loadbar', this.node, true);
        // this.intervalID = setInterval(() => {
        //     if (loadbar && loadbar.getChildByName('progressBarT')) {
        //         const rNum: number = Math.random();
        //         loadbar.getChildByName('progressBarT').getComponent(ProgressBar).progress = rNum;
        //         loadbar.getChildByName('lab_progress').getComponent(Label).string = `${Math.floor(rNum * 100)}%`;
        //     }
        // }, 100);
        // this.loadTime = setInterval(() => {
        //     if (this.loadCurrs == null) {
        //         clearInterval(this.loadTime);
        //         return;
        //     }
        //     this.loadCurrs[0] += this.loadDelay / 10000;
        //     this.loadCurr = (this.loadCurrs[0] > 0.1 ? 0.1 : this.loadCurrs[0]) + this.loadCurrs[1] + this.loadCurrs[2] + +this.loadCurrs[3];
        //     if (this.loadCurr > 1) this.loadCurr = 1;
        //     if (loadbar) {
        //         const barB = loadbar.getChildByName('progressBarB');
        //         barB.getComponent(ProgressBar).progress = this.loadCurr;
        //         UtilsCC.setString('ProgressBarB/Label', loadbar, `${Math.floor(this.loadCurr * 100)}%`);
        //         if (this.loadCurr > 0.1) {
        //             UtilsCC.setString('tips1', loadbar, '读取配置文件......');
        //         }
        //     }
        //     if (this.loadCurr >= 1) {
        //         clearInterval(this.loadTime);
        //     }
        // }, this.loadDelay);

        // 将mpq加载放在proto加载之前
        // if (false) {
        //     CfgManager.I.loadMergeJson(["1.txt", "2.txt", "3.txt", "4.txt", "5.txt", "allMap.txt"]);
        //     ReportManager.I.SendDelay(ReportManager.Type.LoadMpq);
        // } else {
        //  this.loadProto();
        EventM.I.fire(EventM.Type.Login.LoginSuccess);
        // RegNetPack.I.init();
        // CfgManager.I.loadMergeJson(['allMap.txt']);
        // }
    }

    private onUpdateSelectServer(itemdata) {
        if (!itemdata) { return; }
        this.curServerData = itemdata;
        UtilsCC.setString('startGame/Layout/selectinfo/title', this.node, itemdata.area_name);
    }

    // 根据服务器状态，判断是否能够进入服务器
    private chargeServerStatus(serverStatus: number, roleId: number): { b: boolean, msg: string; } {
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

    private onLoginSuccess() {
        UIManager.I.close(UI_NAME.Login);
        // EventM.I.fire(EventM.Type.SceneMap.FirstLoadComplete);
    }

    protected onDestroy(): void {
        super.onDestroy();
        // if (this.intervalID) {
        //     clearInterval(this.intervalID);
        //     this.intervalID = null;
        // }
    }
}
