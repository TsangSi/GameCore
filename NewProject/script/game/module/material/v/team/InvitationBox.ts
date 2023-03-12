/*
 * @Author: zs
 * @Date: 2022-11-18 16:52:11
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\InvitationBox.ts
 * @Description:
 *
 */
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { UtilGame } from '../../../../base/utils/UtilGame';
import WinBase from '../../../../com/win/WinBase';
import { ViewConst } from '../../../../const/ViewConst';

interface IInvitationBoxOpts {
    /** 确认按钮回调 */
    sureCallback?: () => void,
    /** 拒绝按钮回调 */
    rejectCallback?: () => void,
    /** 倒计时是否在确认按钮上 */
    isSureTime?: boolean,
    /** 回调上下文 */
    target?: any
}
const { ccclass, property } = cc._decorator;
@ccclass
export class InvitationBox extends WinBase {
    @property(cc.RichText)
    private RichDesc: cc.RichText = null;
    @property(cc.Node)
    private BtnReject: cc.Node = null;
    @property(cc.Node)
    private BtnSure: cc.Node = null;

    private isSureTime: boolean = false;
    private sureCallback: () => void;
    private rejectCallback: () => void;
    private target: any = null;
    /** 倒计时 */
    private time = 0;
    private opts: IInvitationBoxOpts;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnReject, this.onBtnReject, this);
        UtilGame.Click(this.BtnSure, this.onBtnSure, this);
    }

    protected start(): void {
        super.start();
        if (this.time) {
            this.onSechedule();
        }
    }

    public static Show(desc: string, time: number, opts?: IInvitationBoxOpts): void {
        WinMgr.I.open(ViewConst.InvitationBox, desc, time, opts);
    }

    /**
     *
     * @param desc 文字描述
     * @param sureCallback 确认回调
     * @param rejectCallback 拒绝回调
     * @param target 回调上下文
     */
    public init(params: any[]): void {
        const desc: string = params[0];
        this.time = params[1];
        const opts: IInvitationBoxOpts = params[2];
        this.opts = opts;
        this.RichDesc.string = desc;
        this.target = opts?.target;
        this.sureCallback = opts?.sureCallback;
        this.rejectCallback = opts?.rejectCallback;

        if (this.time) {
            this.unschedule(this.onSechedule);
            this.schedule(this.onSechedule, 1);
        }
        this.isSureTime = opts?.isSureTime;
        UtilCocos.SetActive(this.BtnSure, 'LabelTime', this.time > 0 && this.isSureTime);
        UtilCocos.SetActive(this.BtnReject, 'LabelTime', this.time > 0 && !this.isSureTime);
    }

    public refreshView(params: any[]): void {
        const desc: string = params[0];
        this.time = params[1];
        const opts: IInvitationBoxOpts = params[2];
        this.opts = opts;
        this.RichDesc.string = desc;
        this.target = opts?.target;
        this.sureCallback = opts?.sureCallback;
        this.rejectCallback = opts?.rejectCallback;

        if (this.time) {
            this.unschedule(this.onSechedule);
            this.schedule(this.onSechedule, 1);
        }
        this.isSureTime = opts?.isSureTime;
        UtilCocos.SetActive(this.BtnSure, 'LabelTime', this.time > 0 && this.isSureTime);
        UtilCocos.SetActive(this.BtnReject, 'LabelTime', this.time > 0 && !this.isSureTime);
    }

    private onSechedule() {
        if (this.isSureTime) {
            UtilCocos.SetString(this.BtnSure, 'LabelTime', `(${this.time}${i18n.tt(Lang.com_second)})`);
            if (this.time <= 0) {
                this.unschedule(this.onSechedule);
                this.onBtnSure();
            }
        } else {
            UtilCocos.SetString(this.BtnReject, 'LabelTime', `(${this.time}${i18n.tt(Lang.com_second)})`);
            if (this.time <= 0) {
                this.unschedule(this.onSechedule);
                this.onBtnReject();
            }
        }

        if (this.time > 0) {
            this.time--;
        }
    }

    private onBtnReject() {
        if (this.rejectCallback) {
            if (this.target) {
                this.rejectCallback.call(this.target);
            } else {
                this.rejectCallback();
            }
        }
        this.close();
    }

    private onBtnSure() {
        if (this.sureCallback) {
            if (this.target) {
                this.sureCallback.call(this.target);
            } else {
                this.sureCallback();
            }
        }
        this.close();
    }
}
