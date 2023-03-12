/*
 * @Author: hrd
 * @Date: 2022-09-27 11:52:44
 * @Description:
 *
 */

import { EventClient } from '../../app/base/event/EventClient';
import { UtilColor } from '../../app/base/utils/UtilColor';
import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import { UtilGame } from '../../game/base/utils/UtilGame';
import { E } from '../../game/const/EventName';

const { ccclass, property } = cc._decorator;

export enum NetConfirmBtnType {
    /** 重连 */
    btnType1 = 1,
    /** 返回登录 */
    btnType2 = 2,
    /** 重连 + 返回登录 */
    btnType3 = 3,
    /** 防沉迷提示 */
    btnType4 = 4
}

@ccclass
export class NetConfirmBox extends BaseUiView {
    @property(cc.RichText)
    private richText: cc.RichText = null;
    @property(cc.Node)
    private cancelBtn: cc.Node = null;
    @property(cc.Node)
    private confirmBtn: cc.Node = null;
    /** 滑动区域 */
    @property(cc.Node)
    private NdScroll: cc.Node = null;

    private _type: number = 1;
    private maxHeight: number = 900;
    private miniHeight: number = 200;

    public init(params: any[]): void {
        const tipMsg: string = params[0];
        this._type = params[1];
        if (!this._type) this._type = NetConfirmBtnType.btnType1;
        if (tipMsg == null || tipMsg.length <= 0) {
            console.log('提示信息不能为空');
            return;
        }
        // this.richText.string = `<color=${UtilColor.NorV}>${tipMsg}</color>`;
        // this.richText.string = tipMsg;
        this.initTxt(tipMsg);
        this.setClick();
        this.initUI();

        this.layoutContent();
    }

    public initTxt(tipMsg: string): void {
        const descStr: string = tipMsg;
        if (descStr.length > 22) {
            this.richText.horizontalAlign = cc.macro.TextAlignment.LEFT;
        } else {
            this.richText.horizontalAlign = cc.macro.TextAlignment.CENTER;
        }
        this.richText.string = `<color=${UtilColor.NorV}>${descStr}</c>`;

        if (this.richText.node.height <= this.miniHeight) {
            const strFinally = `${descStr}`;
            this.richText.string = `<color=${UtilColor.NorV}>${strFinally}</c>`;
            const paddT = this.NdScroll.getComponent(cc.Layout)?.paddingTop || 0;
            const paddB = this.NdScroll.getComponent(cc.Layout)?.paddingBottom || 0;
            const _size = this.richText.node.getContentSize().height;
            const _newPadd = Math.ceil((this.miniHeight - _size - paddT - paddB) / 2);
            this.NdScroll.getComponent(cc.Layout).paddingTop += _newPadd;
            this.NdScroll.getComponent(cc.Layout).paddingBottom += _newPadd;
            this.NdScroll.getComponent(cc.Layout)?.updateLayout();
        } else if (this.richText.node.height > this.maxHeight) {
            this.NdScroll.getComponent(cc.Layout).enabled = false;
            this.NdScroll.getComponent(cc.ScrollView).enabled = true;
            this.richText.getComponent(cc.Layout).enabled = true;

            const scrollviewNode = this.NdScroll.getChildByName('View');
            scrollviewNode.getComponent(cc.Layout).enabled = false;
            this.NdScroll.getContentSize().height = this.maxHeight - 100;
            scrollviewNode.getContentSize().height = this.maxHeight - 100;
        }
    }

    private initUI(): void {
        const type = this._type;
        this.cancelBtn.active = true;
        this.confirmBtn.active = true;
        const lab = this.cancelBtn.getChildByName('Label').getComponent(cc.Label);
        lab.string = '重新连接';
        if (type === NetConfirmBtnType.btnType1) {
            this.confirmBtn.active = false;
        } else if (type === NetConfirmBtnType.btnType2) {
            this.cancelBtn.active = false;
        } else if (type === NetConfirmBtnType.btnType3) {
            //
        } else if (type === NetConfirmBtnType.btnType4) {
            this.cancelBtn.active = false;
            lab.string = '知道了';
        }
    }

    /** 重连 */
    private onReConnectFunc() {
        EventClient.I.emit(E.Login.ReConnect);
        this.close();
    }

    /** 返回登录 */
    private onBacktoLoginFunc() {
        EventClient.I.emit(E.Login.BacktoLogin);
        this.close();
    }

    private layoutContent() {
        const NdFrame = this.node.getChildByName('NodeFrame');
        const nd = NdFrame.getChildByName('Nd');
        const ndContent = nd.getChildByName('NdContent');
        ndContent.getComponent(cc.Layout)?.updateLayout();

        const layout = nd.getComponent(cc.Layout);
        layout.updateLayout();
        // const nSize = nd.getComponent(UITransform).contentSize;
        // this.resetSize(nSize);
    }

    private setClick() {
        this.cancelBtn.targetOff(this);
        UtilGame.Click(this.cancelBtn, () => {
            this.onReConnectFunc();
            this.close(); // close 关闭不掉
        }, this);

        this.confirmBtn.targetOff(this);
        UtilGame.Click(this.confirmBtn, () => {
            if (this._type === NetConfirmBtnType.btnType4) {
                this.close();
            } else {
                this.onBacktoLoginFunc();
            }
        }, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
