/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: wangxin
 * @Date: 2022-10-20 21:58:04
 * @FilePath: \SanGuo2.4\assets\script\login\v\RealNameWin.ts
 */

import { UtilString } from '../../app/base/utils/UtilString';
import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../app/core/mvc/WinMgr';
import HttpReq from '../../app/core/net/http/HttpReq';
import GameApp from '../../game/base/GameApp';
import MsgToastMgr from '../../game/base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../game/base/utils/UtilGame';
import { ViewConst } from '../../game/const/ViewConst';
import ControllerMgr from '../../game/manager/ControllerMgr';
import ModelMgr from '../../game/manager/ModelMgr';
import { SdkMgr } from '../../platformSdk/SdkMgr';
import { RealName } from '../LoginConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class RealNameWin extends BaseUiView {
    @property(cc.Node)
    private NdclickBtn: cc.Node = null;
    @property(cc.Node)
    private NdBlack: cc.Node = null;

    @property(cc.EditBox)
    private EdName: cc.EditBox = null;

    @property(cc.EditBox)
    private EdNum: cc.EditBox = null;

    public _name: string;
    public _pass: string;
    public _sdktype: number;
    public _channelId: number;

    protected start(): void {
        // start
        // this.EdName.node.on('text-changed', this.checkName, this);
    }

    public open(...param: unknown[]): void {
        super.open(param);
        console.log('开启实名面板', param);
        const data = param[0];
        this._name = data[0] as string;
        this._pass = data[1] as string;
        this._sdktype = data[2] as number;
        this._channelId = data[3] as number;
        UtilGame.Click(this.NdclickBtn, this.clickReqName, this);
        UtilGame.Click(this.NdBlack, this.onNdBlack, this);
        if (GameApp.I.GameCfgGlobal.Branch !== 'release' && !GameApp.I.isBanshu()) {
            this.EdName.string = '任兵';
            this.EdNum.string = '142724197804131211';
        }
    }

    private clickReqName() {
        // 请求实名认证数据
        const Name = this.EdName.string;
        const Code = this.EdNum.string;
        if (Name.length === 0) {
            MsgToastMgr.Show('请输入名字');
            return;
        }
        if (Code.length === 0) {
            MsgToastMgr.Show('请输入身份证号');
            return;
        }
        if (!UtilString.IsChinese(Name)) {
            MsgToastMgr.Show('请填写正确的名字');
            return;
        }
        if (!this.checkUseId(Code)) {
            return;
        }
        // 发送请求
        const p = this.reqRealName(Name, Code);
        p.then(
            () => {
                //
            },
            (err) => {
                //
                console.log(err);
            },
        );
    }

    private onNdBlack() {
        if (GameApp.I.isOpenSDK()) {
            SdkMgr.I.exitLogin();
        } else {
            WinMgr.I.open(ViewConst.AccountLoginView);
            this.close();
        }
    }
    /** 请求实名认证 */
    private async reqRealName(_name: string, idCode: string) {
        const httpUri = GameApp.I.LoginHttpUri;
        const url = httpUri + RealName.ReqRealName;
        console.log(this._name, this._sdktype);
        const reqData = {
            // ??? 帐号Id
            userName: this._name,
            sdktype: this._sdktype,
            channelId: this._channelId,
            idCard: idCode,
            realName: _name,
        };
        console.log('请求实名认证', url, reqData);
        const info = await HttpReq.I.postAsync(url, reqData);
        if (info.errInfo) {
            MsgToastMgr.Show(info.errInfo);
        }
        let result = null;
        try {
            result = JSON.parse(info.resultInfo);
            console.log('实名认证信息返回log', result);
        } catch (e) {
            console.error('实名认证信息, result:', info.resultInfo);
            MsgToastMgr.Show(result.msg);
            return;
        }
        const RealNameType = result.RealNameType;
        if (result.tag === 0) {
            // WinMgr.I.open(ViewConst.LoginView);
            // EventClient.I.off(E.Login.ReqRegister, this.onReqRegister, this);
            // EventClient.I.emit(E.Login.ReqRegister, this._name, this._pawss);
            ControllerMgr.I.LoginController.onReqLogin(this._name, this._pass);
            this.close();
            // EventClient.I.emit(E.Login.AutoLogin);
        } else {
            MsgToastMgr.Show(result.msg);
        }
    }

    private checkUseId(code: string): boolean {
        // eslint-disable-next-line max-len
        const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
        // 号码规则校验
        if (!format.test(code)) {
            MsgToastMgr.Show('请填写正确的“身份证号”');
            return false;
        }
        // 区位码校验
        // 出生年月日校验   前正则限制起始年份为1900;
        const year = code.substring(6, 10); // 身份证年
        const month = code.substring(10, 12); // 身份证月
        const date = code.substring(12, 14); // 身份证日
        const time = Date.parse(`${month}-${date}-${year}`); // 身份证日期时间戳date
        const now_time = Date.parse(new Date().toString()); // 当前时间戳
        const dates = new Date(parseInt(year), parseInt(month), 0).getDate();// 身份证当月天数
        if (time > now_time || parseInt(date) > dates) {
            MsgToastMgr.Show('请填写正确的“身份证号”');
            return false;
        }
        // 校验码判断 暂时不用
        // const cArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 系数
        const b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; // 校验码对照表
        const id_array = code.split('');
        // let sum = 0;
        // for (let k = 0; k < 17; k++) {
        //     sum += parseInt(id_array[k]) * cArr[k];
        // }
        // if (id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
        //     MsgToastMgr.Show('请填写正确的“身份证号”');
        //     return false;
        // }
        return b.includes(id_array[17]);
    }
}
