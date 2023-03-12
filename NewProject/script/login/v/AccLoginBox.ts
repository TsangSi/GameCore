/*
 * @Author: hrd
 * @Date: 2022-04-19 20:28:01
 * @Description: 登录注册框
 *
 */

import { EventClient } from '../../app/base/event/EventClient';
import { StorageMgr } from '../../app/base/manager/StorageMgr';
import { UtilCocos } from '../../app/base/utils/UtilCocos';
import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../app/core/mvc/WinMgr';
import MsgToastMgr from '../../game/base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../game/base/utils/UtilGame';
import { E } from '../../game/const/EventName';
import { ViewConst } from '../../game/const/ViewConst';
import { i18n, Lang } from '../../i18n/i18n';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AccLoginBox extends BaseUiView {
    @property(cc.Node)
    /** 标题字图片 */
    private SprTitle: cc.Node = null;
    @property(cc.EditBox)
    /** 账号输入框 */
    private EditBoxAcc: cc.EditBox = null;
    @property(cc.EditBox)
    /** 密码输入框 */
    private EditBoxPass: cc.EditBox = null;
    @property(cc.Node)
    /** 注册按钮 */
    private BtnReg: cc.Node = null;
    @property(cc.Node)
    /** 登录按钮 */
    private ButLogin: cc.Node = null;

    @property(cc.Node)
    private testBtn: cc.Node = null;

    private _preg = /^[a-zA-Z0-9]{6,16}$/;

    protected onLoad(): void {
        super.onLoad();
        this.addEvent();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.delEvent();
    }

    public init(param: unknown[]): void {
        this.initUI();
    }

    private addEvent() {
        // EventClient.I.on(E.Login.AccLoginBoxClose, this.onClose, this);
    }

    private delEvent() {
        // EventClient.I.off(E.Login.AccLoginBoxClose, this.onClose, this);
    }

    private initUI() {
        this.EditBoxAcc.string = StorageMgr.I.getValue('h3_acc') || '';
        this.EditBoxPass.string = StorageMgr.I.getValue('h3_pwd') || '';
        UtilGame.Click(this.BtnReg, this.onClickReg, this);
        UtilGame.Click(this.ButLogin, this.onClickLogin, this);
    }

    private onClickReg() {
        // todo 注册 打开注册面版
        WinMgr.I.open(ViewConst.AccountRegView);
        this.onClose();
    }
    private onClickLogin() {
        // 获取账号密码
        const _acc = this.EditBoxAcc.string;
        const _pwd = this.EditBoxPass.string;

        // 验证账号秘密
        if (_acc === '') {
            // 账号不能为空
            MsgToastMgr.Show(i18n.tt(Lang.login_acc_null));
            return;
        }
        if (_pwd === '') {
            // 密码不能为空
            MsgToastMgr.Show(i18n.tt(Lang.login_pwd_null));
            return;
        }
        if (!this._preg.test(_acc)) {
            // 帐号输入不正确
            MsgToastMgr.Show(i18n.tt(Lang.login_acc_err));
            return;
        }
        if (!this._preg.test(_pwd)) {
            // 密码输入不正确
            MsgToastMgr.Show(i18n.tt(Lang.login_pwd_err));
            return;
        }
        // 验证通过
        // 请求登录
        this.regLogin(_acc, _pwd);
        StorageMgr.I.setValue('h3_acc', _acc);
        StorageMgr.I.setValue('h3_pwd', _pwd);
    }

    /** 请求登录 */
    private regLogin(acc: string, pwd: string) {
        EventClient.I.emit(E.Login.ReqLogin, acc, pwd);
    }

    private onClose() {
        WinMgr.I.closeView(this);
    }
}
