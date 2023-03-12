/*
 * @Author: hrd
 * @Date: 2022-04-19 21:40:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-24 15:32:42
 * @FilePath: \SanGuo2.4\assets\script\login\v\AccRegBox.ts
 * @Description:
 */
import { EventClient } from '../../app/base/event/EventClient';
import { StorageMgr } from '../../app/base/manager/StorageMgr';
import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../app/core/mvc/WinMgr';
import MsgToastMgr from '../../game/base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../game/base/utils/UtilGame';
import { E } from '../../game/const/EventName';
import { ViewConst } from '../../game/const/ViewConst';
import { i18n, Lang } from '../../i18n/i18n';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AccRegBox extends BaseUiView {
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
    private BtnBack: cc.Node = null;

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
        // EventClient.I.on(E.Login.AccRegBoxClose, this.onClose, this);
    }

    private delEvent() {
        // EventClient.I.off(E.Login.AccRegBoxClose, this.onClose, this);
    }

    private initUI() {
        this.EditBoxAcc.string = StorageMgr.I.getValue('h3_acc') || '';
        this.EditBoxPass.string = StorageMgr.I.getValue('h3_pwd') || '';

        UtilGame.Click(this.BtnReg, this.onClickReg, this);
        UtilGame.Click(this.BtnBack, () => {
            // todo 注册 打开注册面版
            WinMgr.I.open(ViewConst.AccountLoginView);
            this.onClose();
        }, this);
    }

    private onClickReg() {
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
        this.RegRegister(_acc, _pwd);
        StorageMgr.I.setValue('h3_acc', _acc);
        StorageMgr.I.setValue('h3_pwd', _pwd);
    }

    /** 请求登录 */
    private RegRegister(acc: string, pwd: string) {
        EventClient.I.emit(E.Login.ReqRegister, acc, pwd);
    }

    private onClose() {
        WinMgr.I.closeView(this);
    }
}
