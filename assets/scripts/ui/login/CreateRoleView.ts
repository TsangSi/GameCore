/*
 * @Author: your name
 * @Date: 2019-10-23 13:41:33
 * @LastEditTime: 2021-05-26 21:56:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \RPG_Cocos\assets\script1\Login\CreateRoleView.ts
 */
// 创建角色
// eslint-disable-next-line max-len
import {
 AnimationClip, Component, EditBox, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, sys, Toggle, ToggleContainer, v2, _decorator,
} from 'cc';
import { EffectManager } from '../../common/EffectManager';
import { EventM } from '../../common/EventManager';
import { ResManager } from '../../common/ResManager';
import { ServerMonitor } from '../../common/ServerMonitor';
import GlobalConfig from '../../config/GlobalConfig';
import { AssetType, PrefabName } from '../../global/GConst';
import HttpManager from '../../net/HttpManager';
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

interface serverData {
    area_id: number,
    area_name: string,
    role_id: number,
    server_addr: '',
    server_id: number,
    server_status: number,
    ver: number,
    client_ver?: number,
}
@ccclass
export default class CreateRoleView extends BaseView {
    @property(Node)
    // 当前显示的角色
    CurRole: Node = null;
    @property(ToggleContainer)
    // 性别
    SexRadio: ToggleContainer = null;
    @property(Node)
    // 随机名字按钮
    BtnGetName: Node = null;
    @property(EditBox)
    // 名字
    NickLabel: EditBox = null;
    @property(Label)
    // 倒计时
    TimerLabel: Label = null;
    @property(Node)
    // 开始游戏
    BtnStart: Node = null;
    // 角色描述信息
    @property(Sprite)
    sp_RoleTip: Sprite = null;

    // static CreateData = null;
    private roleInfoListData: any = [];
    private cureRoleBox = 'curRole';// 当前正在显示的角色所在的容器的name,默认curRole
    private switchAniIng = false;// 角色切换动画正在执行
    private curRoleInfo;// 当前选中的角色信息
    private maxTime = 30;// 秒
    public maxInfo: serverData;// 最新服务器信息

    private static _instance: CreateRoleView = null;
    static get instance(): CreateRoleView {
        if (this._instance == null) {
            this._instance = new CreateRoleView();
        }
        return this._instance;
    }
    onLoad() {
        // const __self = this;
        // 配置信息
        this.getCfgInfo();
        // 开始游戏
        // ReportManager.I.SendDelay(ReportManager.Type.CreateRoleViewLoaded);

        // 开始游戏的按钮特效
        // AiaCfg.I.showEffect("e/login/ui_8028", this.BtnStart, WrapMode.Loop);
        EffectManager.I.showEffect('e/login/ui_8028', this.BtnStart, AnimationClip.WrapMode.Loop);
        // 音乐 音效
        // AudEng.I.onBGVolChange(0.5);
        // AudEng.I.onEffVolChange(0.5);

        UtilsCC.setClickEvent(this.BtnStart, 'on_start_clicked', this);

        UtilsCC.setClickEvent(this.BtnGetName, 'on_random_clicked', this);

        // 男女
        const _sex1 = this.SexRadio.node.getChildByName('toggle1');// 男
        const _sex2 = this.SexRadio.node.getChildByName('toggle2');// 女
        if (_sex1 === _sex2) {
            //
        }
        UtilsCC.setClickEvent(_sex1, 'on_toggle_clicked', this, 1);
        UtilsCC.setClickEvent(_sex2, 'on_toggle_clicked', this, 2);
        // _sex1.on('toggle', (e: Toggle) => {
        //     // 改变数据
        //     if (e.isChecked) {
        //         this.changeChosedData(this.sexChoseGetData(1));
        //     }// ReportManager.I.Send(ReportManager.Type.CreateRoleViewSexMale);
        // });
        // _sex2.on('toggle', (e: Toggle) => {
        //     // 改变数据
        //     if (e.isChecked) {
        //         this.changeChosedData(this.sexChoseGetData(2));
        //     }// ReportManager.I.Send(ReportManager.Type.CreateRoleViewSexFemale);
        // });
        // _sex1.on(Node.EventType.TOUCH_END, () => {
        // AudEng.I.playEffectMusic(AudioEffectUri.effect19);
        // })
        // _sex2.on(Node.EventType.TOUCH_END, () => {
        // AudEng.I.playEffectMusic(AudioEffectUri.effect19);
        // })

        this.initPos();
    }

    on_toggle_clicked(e, job: number) {
        this.changeChosedData(this.sexChoseGetData(job));
    }

    on_start_clicked() {
        const _str = this.NickLabel.string;
        if (!_str) {
            // ReportManager.I.Send(ReportManager.Type.CreateRoleFinished4);
            // MsgToast.ShowWithColor('昵称不能为空');
            console.log('昵称不能为空');
            return;
        }
        // ReportManager.I.Send(ReportManager.Type.CreateRoleFinished);
        this.unschedule(this.timerUpdate);
        this.createRoleViewRequest();
    }

    on_random_clicked() {
        this.getRandomNick();
    }

    update() {
        const _arg2 = this.SexRadio.toggleItems;
        for (let i = 0, l = _arg2.length; i < l; i++) {
            const _item = _arg2[i];
            _item.interactable = !this.switchAniIng;
        }
    }
    start() {
        if (!this.maxInfo) {
            this.requestServer();
        }

        EventM.I.on(EventM.Type.Login.LoginSuccess, this.onLoginSuccess, this);

        // 倒计时
        this.schedule(this.timerUpdate, 1);
        // 设置默认选中
        this.changeChosedData(this.curRoleInfo);

        // AudEng.I.playBgMusic(AudioBGUri.CreateRoleViewBG, true);
    }

    onLoginSuccess() {
        this.destroy();
    }

    initPos() {
        // this.correctPosArr = [
        //     v2(-66, -59),
        //     v2(6, -69),
        //     v2(46, -54),
        //     v2(39, -74),
        //     v2(23, -78),
        //     v2(38, -60),
        // ];
    }
    // 获取名字失败重试次数
    private NameTimes = 0;
    getRandomNick(callback = null) {
        // const __self = this;
        // 随机一个名字
        const areaId = window.localStorage.getItem('area_id') || this.maxInfo.area_id;
        const cps_id = window.localStorage.getItem('cps_id') || 0;
        HttpManager.I.post(`${GlobalConfig.I.httpUrl}/api/getNick`, { areaid: areaId, cpsid: cps_id }, (res) => {
            try {
                res = JSON.parse(res);
            } catch (e) {
                // 解析失败，res数据有问题，重试
                console.error('get nick error, res:', res);
                this.getRandomNick();
                return;
            }

            if (res.code === 1) {
                if (this.NickLabel == null) {
                    this.NickLabel = new EditBox();
                }
                this.NickLabel.string = res.data.nick || 'lala';
                if (callback) {
                    callback();
                }
            } else if (this.NameTimes < 20) {
                this.NameTimes++;
                this.getRandomNick();
            }
        }, null, true);
    }

    timerUpdate() {
        // 60秒倒计时
        const _t = this.maxTime;
        if (_t <= 0) {
            // 停止计时器
            this.unschedule(this.timerUpdate);
            // 进入服务器
            // 上报，长时间不点，自动创角
            // ReportManager.I.Send(ReportManager.Type.CreateRoleViewAutoStart);
            this.createRoleViewRequest();
            return;
        }
        this.maxTime -= 1;
        this.TimerLabel.string = this.maxTime.toString();
    }

    /**
     * 兼容平台方法
     */
    createRoleViewRequest1() {
        // const __self = this;
        const _lac = UtilsStorage.getItem('acc_token');
        const _lacD = JSON.parse(_lac);
        if (!_lacD.account_id) {
            // MsgToast.ShowWithColor("用户ID获取错误", 5000);
            // ReportManager.Type.CreateRoleFinished1;
            ReportManager.I.Send(2);
            return;
        }
        if (!_lacD.sign) {
            // MsgToast.ShowWithColor("Token获取错误", 5000);
            ReportManager.I.Send(ReportManager.Type.CreateRoleFinished2);
            return;
        }
        // role_id
        let _roleId: any = null;
        if (this.curRoleInfo) {
            _roleId = this.curRoleInfo.RoleID;
        }
        // 昵称判断
        const _nick = this.NickLabel.string || '';
        if (!_nick) {
            MsgToast.ShowWithColor('昵称不能为空');
            ReportManager.I.Send(ReportManager.Type.CreateRoleFinished4);
            return;
        }

        const serverid = window.localStorage.getItem('server_id');
        const areaid = window.localStorage.getItem('area_id');
        const check_word_url = window.localStorage.getItem('check_word_url');
        ServerMonitor.I.game_server.areaId = parseInt(areaid);
        ServerMonitor.I.game_server.serverId = parseInt(serverid);
        const checkWordUrl = check_word_url ? encodeURIComponent(check_word_url) : '';
        HttpManager.I.post(`${GlobalConfig.I.httpUrl}/api/createRoleView`, {
            account_id: _lacD.account_id,
            role_id: _roleId || Math.ceil(Math.random() * 6),
            nick: _nick || '',
            server_id: serverid || '',
            area_id: areaid || '',
            token: _lacD.sign,
            check_word_url: checkWordUrl,
        }, (res) => {
            try {
                res = JSON.parse(res);
            } catch (e) {
                console.error('api/createRoleView json parse error res:', res);
                setTimeout(() => {
                    this.createRoleViewRequest1();
                }, 1000);
            }

            if (res.code === 1) {
                ReportManager.I.Send(ReportManager.Type.CreateRoleFinishedEnd);
                this.createSuccess(res);
            } else if (res.msg) {
                switch (res.msg) {
                    case 22:
                        res.msg = '昵称重复!';
                        break;
                    case 23:
                        res.msg = '一个区只能创建一个角色';
                        break;
                    default:
                        break;
                }
                ReportManager.I.Send(ReportManager.Type.CreateRoleFinished7);
                MsgToast.ShowWithColor(res.msg, 5000);
            }
        });
    }
    createRoleViewRequest() {
        if (window.SDK) {
            this.createRoleViewRequest1();
            return;
        }
        const _lac = UtilsStorage.getItem('acc_token');
        const check_word_url = UtilsStorage.getItem('check_word_url');
        const checkWordUrl = check_word_url ? encodeURIComponent(check_word_url) : '';
        const _lacD = JSON.parse(_lac);
        if (!_lacD.account_id) {
            MsgToast.ShowWithColor('用户ID获取错误', 5000);
            ReportManager.I.Send(ReportManager.Type.CreateRoleFinished1);
            return;
        }
        if (!_lacD.token) {
            MsgToast.ShowWithColor('Token获取错误', 5000);
            ReportManager.I.Send(ReportManager.Type.CreateRoleFinished2);
            return;
        }
        // role_id
        let _roleId: any = null;
        if (this.curRoleInfo) {
            _roleId = this.curRoleInfo.RoleID;
        }
        // if (!_roleId) {
        //     //MsgToast.ShowWithColor("玩家ID获取错误", 5000);
        //     //ReportManager.I.Send(ReportManager.Type.CreateRoleFinished3);
        //     //return;
        // }

        // 昵称判断
        const _nick = this.NickLabel.string || '';
        if (!_nick) {
            MsgToast.ShowWithColor('昵称不能为空');
            ReportManager.I.Send(ReportManager.Type.CreateRoleFinished4);
        }
        // server_id
        const _maxInfo = this.maxInfo;
        if (!_maxInfo) {
            MsgToast.ShowWithColor('服务器信息为空', 5000);
            ReportManager.I.Send(ReportManager.Type.CreateRoleFinished5);
            return;
        }
        if (!_maxInfo.server_status) {
            MsgToast.ShowWithColor('当前服务器暂未开放', 5000);
            ReportManager.I.Send(ReportManager.Type.CreateRoleFinished6);
            return;
        }
        // 微信小游戏 用户输入文本校验
        // const _self = this;
        if (window.Wx_PingTai_Sdk && window.Wx_PingTai_Sdk.msgCheckFun) {
            window.Wx_PingTai_Sdk.msgCheckFun(_nick, (res) => {
                if (res.errcode) {
                    // 内容违规
                    MsgToast.ShowWithColor('昵称含有违法违规内容');
                    return;
                }
                HttpManager.I.post(`${GlobalConfig.I.httpUrl}/api/createRole`, {
                    account_id: _lacD.account_id,
                    role_id: _roleId || Math.ceil(Math.random() * 6),
                    nick: _nick || '',
                    server_id: _maxInfo.server_id || '',
                    area_id: _maxInfo.area_id || '',
                    token: _lacD.token,
                    check_word_url: checkWordUrl,
                }, (res) => {
                    res = JSON.parse(res);
                    if (res.code === 1) {
                        ReportManager.I.Send(ReportManager.Type.CreateRoleFinishedEnd);
                        this.createSuccess(res);
                    } else if (res.msg) {
                        switch (res.msg) {
                            case 22:
                                res.msg = '昵称重复!';
                                break;
                            case 23:
                                res.msg = '一个区只能创建一个角色';
                                break;
                            default:
                                break;
                        }
                        ReportManager.I.Send(ReportManager.Type.CreateRoleFinished7);
                        MsgToast.ShowWithColor(res.msg, 5000);
                    }
                });
            });
        } else {
            HttpManager.I.post(`${GlobalConfig.I.httpUrl}/api/createRole`, {
                account_id: _lacD.account_id,
                role_id: _roleId || Math.ceil(Math.random() * 6),
                nick: _nick || '',
                server_id: _maxInfo.server_id || '',
                area_id: _maxInfo.area_id || '',
                token: _lacD.token,
                check_word_url: checkWordUrl,
            }, (res) => {
                res = JSON.parse(res);
                if (res.code === 1) {
                    ReportManager.I.Send(ReportManager.Type.CreateRoleFinishedEnd);
                    this.createSuccess(res);
                } else if (res.msg) {
                    switch (res.msg) {
                        case 22:
                            res.msg = '昵称重复!';
                            break;
                        case 23:
                            res.msg = '一个区只能创建一个角色';
                            break;
                        default:
                            break;
                    }
                    ReportManager.I.Send(ReportManager.Type.CreateRoleFinished7);
                    MsgToast.ShowWithColor(res.msg, 5000);
                }
            });
        }
    }

    /**
    * 兼容平台方法
    */
    createSuccess1(res) {
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
        // UIMgr.I.closePrefab(this);
        UIManager.I.close(UI_NAME.CreateRole);
        // this.node.destroy();
        // if (LoginView.I) {
        //     LoginView.I.changeView(0);
        // }
        EventM.I.fire(EventM.Type.Login.ChangeView, 0);
        LoginManager.I.user_id = res.data.userid;
        // 建立websocket 连接
        LoginManager.I.C2SLogin({
            AreaId: ServerMonitor.I.game_server.areaId,
            AccountId: _lacD.account_id,
            Token: _lacD.sign,
        });
        // if (LoginView.I) {
        //     //LoginView.I.spind.active = false;
        //     LoginView.I.loadbar.active = true;
        //     // LoginView.I.loadbar.getChildByName("bm_vip5").active = Game.I.firstInGame;
        //     LoginView.I.initUserLoginRes();
        // }

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

    createSuccess(res) {
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
        // UIMgr.I.closePrefab(this);
        this.node.destroy();
        EventM.I.fire(EventM.Type.Login.ChangeView, 0);
        LoginManager.I.user_id = res.data.userid;
        ServerMonitor.I.game_server.userId = res.data.userid;
        // 建立websocket 连接
        LoginManager.I.C2SLogin({
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
    requestServer() {
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
        const _allServer: serverData[] = _serverInfo.all_server;
        if (_allServer.length <= 0) {
            MsgToast.ShowWithColor('服务器数据为空', 5000);
            return;
        }
        const bestServer: serverData[] = [];
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
        this.maxInfo = this.getArg('serverData') || this.maxInfo;
        UtilsStorage.setItem('maxInfo', this.maxInfo);
        ServerMonitor.I.game_server.serverId = this.maxInfo.server_id;
        ServerMonitor.I.game_server.areaId = this.maxInfo.area_id;

        if (!UtilsPlatform.isWechatGame()) {
            if (LoginManager.I.curVersion) {
                const _max = this.maxInfo;
                if (_max.client_ver && LoginManager.I.curVersion !== _max.client_ver && !LoginManager.I.noJump) {
                    const _url = window.location.href;
                    const _v = `/v${_max.client_ver}/`;
                    const _url2 = _url.replace(/\/v(\S*)\//, _v);
                    window.location.href = _url2;
                }
            }
        }
    }

    // 为了解决登录页在配置表加载之前初始化的问题
    private cfgJob = [
        {
            AnimID: 3001,
            HeadImg: 'role_1',
            RaceID: 1,
            RaceImg: 'img_renzu',
            RaceName: '人族',
            RoleID: 1,
            RoleImg: 'img_nanjuese1',
            Sex: 1,
            SexImg: '1',
            Skills: '104|102|103|101|105',
            Sort: 1,
            WeaponID: 4131,
        },
        {
            AnimID: 3002,
            HeadImg: 'role_2',
            IsDefault: 1,
            RaceID: 1,
            RaceImg: 'img_renzu',
            RaceName: '人族',
            RoleID: 2,
            RoleImg: 'img_nvjuese1',
            Sex: 2,
            SexImg: '2',
            Skills: '104|102|103|101|105',
            Sort: 2,
            WeaponID: 4132,
        },
        {
            AnimID: 3003,
            HeadImg: 'role_3',
            RaceID: 2,
            RaceImg: 'img_xianzu',
            RaceName: '仙族',
            RoleID: 3,
            RoleImg: 'img_nanjuese3',
            Sex: 1,
            SexImg: '1',
            Skills: '109|107|108|106|110',
            Sort: 3,
            WeaponID: 4133,
        },
        {
            AnimID: 3004,
            HeadImg: 'role_4',
            RaceID: 2,
            RaceImg: 'img_xianzu',
            RaceName: '仙族',
            RoleID: 4,
            RoleImg: 'img_nvjuese3',
            Sex: 2,
            SexImg: '2',
            Skills: '109|107|108|106|110',
            Sort: 4,
            WeaponID: 4134,
        },
        {
            AnimID: 3005,
            HeadImg: 'role_5',
            RaceID: 3,
            RaceImg: 'img_mozu',
            RaceName: '巫族',
            RoleID: 5,
            RoleImg: 'img_nanjuese2',
            Sex: 1,
            SexImg: '1',
            Skills: '114|112|113|111|115',
            Sort: 5,
            WeaponID: 4135,
        },
        {
            AnimID: 3006,
            HeadImg: 'role_6',
            RaceID: 3,
            RaceImg: 'img_mozu',
            RaceName: '巫族',
            RoleID: 6,
            RoleImg: 'img_nvjuese2',
            Sex: 2,
            SexImg: '2',
            Skills: '114|112|113|111|115',
            Sort: 6,
            WeaponID: 4136,
        },
    ];

    getCfgInfo() {
        // 获取配置表信息
        // 获取角色配置信息
        const _arg: any = this.cfgJob;

        if (!_arg || _arg.length <= 0) {
            MsgToast.ShowWithColor('角色配置信息获取错误', 5000);
            return;
        }
        // 排序
        _arg.sort((a, b) => a.Sort - b.Sort);

        this.roleInfoListData = _arg;
        // 1.根据角色id存贮角色信息
        _arg.forEach((item, i) => {
            // 初始化默认角色
            if (item.IsDefault) {
                this.curRoleInfo = item;
            }
        });
    }

    private changeChosedData(data) {
        if (this.switchAniIng) {
            return;
        }
        // 更换角色数据
        // 随机一个名字
        this.getRandomNick();
        // 数据更换切换 -> UI更换
        this.moveRole(data);
        // TODO 暂时方案
        // 男女切换
        this.sexSetChose(data.Sex);
    }

    private nan: Node = null;
    private nv: Node = null;
    moveRole(nextRoleInfo) {
        if (this.switchAniIng) {
            // 动画正在执行
            return;
        }
        this.switchAniIng = true;

        const _curRole = this.CurRole;

        // 判断当前正咋显示的是哪个容器
        let _curDom: Node = null;

        if (this.cureRoleBox === 'curRole') {
            _curDom = _curRole;
        }
        if (!_curDom) {
            return;
        }

        if (this.nan) this.nan.active = false;
        if (this.nv) this.nv.active = false;

        if (nextRoleInfo) {
            if (nextRoleInfo.Sex === 1) {
                // 男
                if (this.nan) {
                    this.nan.active = true;
                    this.switchAniIng = false;
                } else {
                    UIManager.I.showPrefab(_curDom, PrefabName.NanZhu, undefined, (err, node: Node) => {
                        this.nan = node;
                        this.switchAniIng = false;
                    }, this);
                }
            } else if (this.nv) {
                this.nv.active = true;
                this.switchAniIng = false;
            } else {
                UIManager.I.showPrefab(_curDom, PrefabName.NvZhu, undefined, (err, node: Node) => {
                    this.nv = node;
                    this.switchAniIng = false;
                }, this, v2(0, 20));
            }

            this.setTip(nextRoleInfo.Sex);
            this.curRoleInfo = nextRoleInfo;
        } else {
            this.switchAniIng = false;
        }

        // this.scheduleOnce(() => {
        //     this.switchAniIng = false;
        // }, 0.5);
    }

    setTip(sex: number) {
        let image = 'chunyang';
        if (sex === 2) {
            image = 'haoyue';
        }
        ResManager.I.loadRemote(`i/m/login/crtRol/font_${image}`, AssetType.SpriteFrame, (err, sp: SpriteFrame) => {
            if (err) { return; }
            this.sp_RoleTip.spriteFrame = sp;
        }, this);
    }

    private sexSetChose(type) {
        // 设置男女选中
        const _sex1 = this.SexRadio.node.getChildByName('toggle1'); const // 男
            _sex2 = this.SexRadio.node.getChildByName('toggle2');// 女

        const tog1 = _sex1.getComponent(Toggle);
        const tog2 = _sex2.getComponent(Toggle);
        if (type === 1) {
            // 男
            tog2.isChecked = false;
            tog1.isChecked = true;
            UtilsCC.setOpacity(tog2.node, 153);
            UtilsCC.setOpacity(tog1.node, 255);
        } else if (type === 2) {
            // 女
            tog1.isChecked = false;
            tog2.isChecked = true;
            UtilsCC.setOpacity(tog1.node, 153);
            UtilsCC.setOpacity(tog2.node, 255);
        }
    }

    raceChoseGetData(raceId) {
        // raceId种族id
        // 种族选中获取数据
        // 查找角色数据
        // 显示要切换的种族的第一个角色
        const _arg = this.roleInfoListData;
        let _nextData: Record<string, unknown>;
        for (let i = 0, l = _arg.length; i < l; i++) {
            const _item = _arg[i];
            if (_item.RaceID === raceId && _item.Sex === this.curRoleInfo.Sex) {
                _nextData = _item;
                _nextData.index = i;
                break;
            }
        }
        return _nextData;
    }

    sexChoseGetData(sex) {
        // 点击男女切换
        const _curData = this.curRoleInfo;
        // 查找要切切换的角色信息
        let _info: Record<string, unknown>;
        if (sex) {
            for (let i = 0, l = this.roleInfoListData.length; i < l; i++) {
                const _item = this.roleInfoListData[i];
                if (_item.RaceID === _curData.RaceID && _item.Sex === sex) {
                    _info = _item;
                    _info.index = i;
                    break;
                }
            }
        }
        return _info;
    }
}
