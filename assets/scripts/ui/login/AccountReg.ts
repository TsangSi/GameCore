/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
 assetManager, Button, Component, instantiate, Node, _decorator,
} from 'cc';
import { EventM } from '../../common/EventManager';
import { ServerMonitor } from '../../common/ServerMonitor';
import GlobalConfig from '../../config/GlobalConfig';
import HttpManager from '../../net/HttpManager';
import UtilsCC from '../../utils/UtilsCC';
import UtilsStorage from '../../utils/UtilsStorage';
import { BaseView } from '../base/BaseView';
import MsgToast from '../Toast/MsgToast';
import { UI_NAME } from '../UIConfig';
import UIManager from '../UIManager';
import LoginManager from './LoginManager';
import RegItems from './RegItems';

const { ccclass, property } = _decorator;

interface LoginData {
    label: string,
    placeHolder: string,
    name: string,
    url: string,
    type: number, // editBox类型，1:string，2:password
}

class UserInfo {
    public UserName = '';
    public Password = '';
    public Password2 = '';
    public RealName = '';
    public IdCardNum = '';
}

@ccclass
export default class AccountReg extends BaseView {
    @property(Node)
    // 返回
    public BackBtn: Node = null;
    @property(Node)
    // 确定
    public SureBtn: Node = null;
    @property(Node)
    // item父节点
    public ItemBox: Node = null;

    @property(Node)
    // item节点
    public ItemNode: Node = null;

    // @property(Node)
    // // 关闭按钮
    // BtnClose: Node = null;

    private _reg = /^[a-z0-9A-Z]{6,16}$/;

    public close(): void {
        UIManager.I.show(UI_NAME.AccountLogin);
    }

    // close () {
    //     UIManager.I.show(UI_NAME.AccountLogin);
    // }

    public onSureClicked(): void {
        // 确定
        // 注册
        // TODO 1.获取参数，2.验证参数 3.请求注册
        const _data = this.getParams();
        // 账号
        if (_data.UserName === '') {
            MsgToast.ShowWithColor('账号不能为空', 3000);
            return;
        }
        if (!this._reg.test(_data.UserName)) {
            MsgToast.ShowWithColor('账号输入不正确', 3000);
            return;
        }
        // 密码
        if (_data.Password === '') {
            MsgToast.ShowWithColor('密码不能为空', 3000);
            return;
        }
        if (!this._reg.test(_data.Password)) {
            MsgToast.ShowWithColor('密码格式不正确定', 3000);
            return;
        }
        // 重复密码
        if (_data.Password2 === '') {
            MsgToast.ShowWithColor('确认密码不能为空', 3000);
            return;
        }
        if (_data.Password2 !== _data.Password) {
            MsgToast.ShowWithColor('两次密码输入不一致', 3000);
            return;
        }
        // 实名
        if (LoginManager.I.verified) {
            if (_data.RealName === '') {
                MsgToast.ShowWithColor('姓名不能为空', 3000);
                return;
            }
            if (_data.IdCardNum === '') {
                MsgToast.ShowWithColor('证件号码不能为空', 3000);
                return;
            }
        }
        this.requeset(_data);
    }

    public onLoad() {
        // UtilsCC.setClickEvent(this.BtnClose, 'on_close_clicked', this);
        UtilsCC.setClickEvent(this.BackBtn, 'on_close_clicked', this);

        UtilsCC.setClickEvent(this.SureBtn, 'onSureClicked', this);
        console.log('accountreg onLoad');
        // setTimeout(() => {

            UIManager.I.close(UI_NAME.AccountLogin);
        // }, 2000);
        console.log('222=', assetManager.assets);
    }
    public start() {
        this.setItemFun();

        // setTimeout(()=> {
        // UIManager.I.close(UI_NAME.AccountReg);
        // }, 2000);
    }
    public setItemFun() {
        // 实名注册开启
        let _itemData: LoginData[] = [];
        if (LoginManager.I.verified) {
            _itemData = [
                {
                    label: '登录账号：',
                    placeHolder: '请输入登录账号',
                    name: 'UserName',
                    url: 'i/m/login/zi/regitem_acc',
                    type: 1, // editBox类型，1:string，2:password
                },
                {
                    label: '登录密码：',
                    placeHolder: '请输入登录密码',
                    name: 'Password',
                    url: 'i/m/login/zi/regitem_pwd',
                    type: 2,
                },
                {
                    label: '确认密码：',
                    placeHolder: '请再次输入密码',
                    name: 'Password2',
                    url: 'i/m/login/zi/regitem_spwd',
                    type: 2,
                },
                {
                    label: '姓名：',
                    placeHolder: '请输入真实姓名',
                    name: 'RealName',
                    url: 'i/m/login/zi/regitem_name',
                    type: 1,
                },
                {
                    label: '身份证号：',
                    placeHolder: '请输入身份证号码',
                    name: 'IdCardNum',
                    url: 'i/m/login/zi/regitem_id',
                    type: 1,
                },
            ];
        } else {
            _itemData = [
                {
                    label: '登录账号：',
                    placeHolder: '请输入登录账号',
                    name: 'UserName',
                    url: 'i/m/login/zi/regitem_acc',
                    type: 1,
                },
                {
                    label: '登录密码：',
                    placeHolder: '请输入登录密码',
                    name: 'Password',
                    url: 'i/m/login/zi/regitem_pwd',
                    type: 2,
                },
                {
                    label: '确认密码：',
                    placeHolder: '请再次输入密码',
                    name: 'Password2',
                    url: 'i/m/login/zi/regitem_spwd',
                    type: 2,
                },
            ];
        }
        // 添加
        for (let i = 0, l = _itemData.length; i < l; i++) {
            const _itme = _itemData[i];
            const _dom = instantiate(this.ItemNode);
            _dom.parent = this.ItemBox;
            _dom.active = true;
            const _com = _dom.getComponent(RegItems);
            _com.updateUi(_itme);
        }
    }
    public getParams(): UserInfo {
        const _p = new UserInfo();
        const _a = this.ItemBox.children;
        if (!_a || _a.length <= 0) {
            return _p;
        }
        for (let i = 0, l = _a.length; i < l; i++) {
            const _item = _a[i];
            if (_item) {
                const _v = _item.getComponent(RegItems).getInputValue();
                _p[_v.key] = _v.value;
            }
        }
        // 获取参数
        return _p;
    }
    public requeset(data: UserInfo): void {
        // 请求
        let _p: any = null;
        if (LoginManager.I.verified) {
            _p = {
                UserName: data.UserName || '',
                Password: data.Password || '',
                CpsId: 1 || 1,
                SubCpsId: 1 || 1,
                RealName: data.RealName || '',
                IdCardNum: data.IdCardNum || '',
                RegType: 3, // 1.普通 3.实名注册
                Imei: '',
                SysVer: '',
                PhoneModel: '',
                RegVer: '',
                PhoneNum: '',
                PhoneVCode: '',
                ClientOnly: '',
                ChannelId: 1,
                Ext: '',
            };
        } else {
            _p = {
                UserName: data.UserName || '',
                Password: data.Password || '',
                CpsId: 1 || 1,
                SubCpsId: 1 || 1,
                RealName: '',
                IdCardNum: '',
                RegType: 1, // 1.普通 3.实名注册
                Imei: '',
                SysVer: '',
                PhoneModel: '',
                RegVer: '',
                PhoneNum: '',
                PhoneVCode: '',
                ClientOnly: '',
                ChannelId: 1,
                Ext: '',
            };
        }
        HttpManager.I.post(`${GlobalConfig.I.httpUrl}/api/reg`, _p, (res: string) => {
            const result: {code: number, msg: string, data: any} = JSON.parse(res);
            if (result.code === 1) {
                // 登录成功
                UtilsStorage.setItem('acc_token', JSON.stringify(result.data));
                // 进入服务器选择
                ServerMonitor.I.gameServer.accountId = result.data.account_id;
                // 存储账号信息
                UtilsStorage.setItem('acc', data.UserName);
                UtilsStorage.setItem('pwd', data.Password);
                HttpManager.I.post(`${GlobalConfig.I.httpUrl}/api/playServerInfo`, {
                    account_id: result.data.account_id,
                    token: result.data.token,
                    pf: LoginManager.I.platform,
                    ver: LoginManager.I.version,
                    cps_id: LoginManager.I.channelId ? LoginManager.I.channelId : 0,
                }, (res2) => {
                    res2 = JSON.parse(res2);
                    if (res2.code === 1) {
                        UtilsStorage.setItem('serverInfo', JSON.stringify(res2));
                        // TODO 进入角色创建页
                        UIManager.I.close(UI_NAME.AccountReg);
                        UtilsStorage.setItem('serverInfo', JSON.stringify(res2));
                        const _serverInfo = res2.data.server_info;
                        LoginManager.I.setServerInfo(_serverInfo);
                        EventM.I.fire(EventM.Type.Login.ChangeView, 2);
                    } else {
                        //
                    }
                }, null, true);
            } else if (result.msg) {
                MsgToast.ShowWithColor(result.msg, 10000);
            }
        });
    }
}
