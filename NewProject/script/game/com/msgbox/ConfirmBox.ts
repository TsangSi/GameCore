/*
 * @Author: zs
 * @Date: 2022-06-14 15:38:53
 * @FilePath: \SanGuo-2.4-main\assets\script\game\com\msgbox\ConfirmBox.ts
 * @Description:
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { DynamicImage } from '../../base/components/DynamicImage';
import { UtilCurrency } from '../../base/utils/UtilCurrency';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilItemList from '../../base/utils/UtilItemList';
import { E } from '../../const/EventName';
import { WinCmp } from '../win/WinCmp';

const { ccclass, property } = cc._decorator;
/** 弹出框按钮枚举类型 */
export enum EMsgBoxModel {
    /** 默认两个按钮，左边的取消，右边的确定 */
    Normall,
    /** 单个按钮，居中的确定 */
    Confirm,
    /** 单个按钮，居中的取消 */
    Cancel
}
export interface IBoxCfg {
    showToggle?: string,
    // info?: { id: number, count: number, pric: number, cType: number },
    info?: Cfg_SecretMall
    /** 点击确定按钮回调的时候是否关闭界面（其他操作会直接关闭界面） */
    cbCloseFlag?: string,
    tipTogState?: boolean // 默认是否勾选本次登录不再提示

    ConfirmName?: string // 确认按钮显示名称
    CancelName?: string // 取消按钮显示名称
}

@ccclass
export class ConfirmBox extends WinCmp {
    @property(cc.RichText)
    private richText: cc.RichText = null;
    @property(cc.Node)
    private cancelBtn: cc.Node = null;
    @property(cc.Node)
    private confirmBtn: cc.Node = null;
    @property(cc.Node)
    private ndTog: cc.Node = null;

    @property(cc.Toggle)
    private tipTog: cc.Toggle = null;
    @property(cc.Node)
    private ndItem: cc.Node = null;
    @property(cc.RichText)
    private ndTipLabel: cc.RichText = null;
    @property(cc.Label)
    private itemPriceLab: cc.Label = null;
    @property(DynamicImage)
    private coinTypeSpr: DynamicImage = null;
    @property(cc.Node)
    private itemIconSpr: cc.Node = null;

    private cb: (state: boolean) => void;
    private closeCall: (state: boolean) => void;
    /** 点击确定回调的时候 是否关闭界面 */
    private cbWithClose: string = '';

    protected start(): void {
        super.start();
        /** 强制关闭不会触发任何回调 */
        // EventClient.I.on(E.MsgBox.ForceClose, this.close, this);
    }

    private type: EMsgBoxModel = EMsgBoxModel.Normall;
    public init(params: any[]): void {
        this.updateUI(params[0], params[1], params[2], params[3], params[4], params[5]);
    }

    /** 刷新UI */
    public refreshUI(params: any[]): void {
        this.updateUI(params[0], params[1], params[2], params[3], params[4], params[5]);
    }

    private layoutContent() {
        const nd = this.node.getChildByName('Nd');
        const ndContent = nd.getChildByName('NdContent');
        // 新需求，固定弹窗不能低于原图尺寸
        let _size = 0;
        const paddT = ndContent.getComponent(cc.Layout)?.paddingTop || 0;
        const paddB = ndContent.getComponent(cc.Layout)?.paddingBottom || 0;
        let _has = false;
        if (this.ndItem.active) {
            _size += this.ndItem.getContentSize().height;
            _size += ndContent.getComponent(cc.Layout)?.spacingY || 0;
            _has = true;
        }
        if (this.richText.node.active) {
            _size += this.richText.node.getContentSize().height;
            _has = true;
        }
        if (_has) {
            _size += paddT;
            _size += paddB;
        }
        if (_size > 0 && _size < this.winSmall.minSizeHeight) {
            const _newPadd = Math.ceil((this.winSmall.minSizeHeight - _size) / 2);
            ndContent.getComponent(cc.Layout).paddingTop += _newPadd;
            ndContent.getComponent(cc.Layout).paddingBottom += _newPadd;
        }
        ndContent.getComponent(cc.Layout)?.updateLayout();

        const layout = nd.getComponent(cc.Layout);
        layout.updateLayout();
        const nSize = nd.getContentSize();
        this.resetSize(nSize);
    }

    private setCancelClick() {
        this.cancelBtn.targetOff(this);
        UtilGame.Click(this.cancelBtn, () => {
            if (this.closeCall) {
                this.closeCall(this.tipTog.isChecked);
            }
            this.close(); // close 关闭不掉
        }, this);
    }

    private setConfirmeClick(key?: string) {
        this.confirmBtn.targetOff(this);
        UtilGame.Click(this.confirmBtn, () => {
            if (this.cb) {
                this.cb(this.tipTog.isChecked);
            }
            if (this.tipTog.isChecked) {
                EventClient.I.emit(E.MsgBox.AddTogleFlag, key);
            }
            if (!this.cbWithClose || this.cbWithClose.length === 0) { // 关闭处理
                this.close();
            }
        }, this);
    }

    private setClick(key: string) {
        switch (this.type) {
            case EMsgBoxModel.Confirm:
                this.cancelBtn.active = false;
                break;
            case EMsgBoxModel.Cancel:
                this.confirmBtn.active = false;
                break;
            default:
                this.cancelBtn.active = true;
                this.confirmBtn.active = true;
                break;
        }
        if (this.cancelBtn.active) {
            this.setCancelClick();
        }
        if (this.confirmBtn.active) {
            this.setConfirmeClick(key);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (EventClient.I.hasEventListener(E.MsgBox.Refresh, this.updateUI, this)) {
            EventClient.I.off(E.MsgBox.Refresh, this.updateUI, this);
        }
        // EventClient.I.off(E.MsgBox.ForceClose, this.close, this);
        // 关闭需要清除记录
        EventClient.I.emit(E.MsgBox.Close, this.cbWithClose);
    }

    /** 更新文字提示 */
    private updateUI(tipMsg: string, type: EMsgBoxModel, callback: () => void, config: IBoxCfg, closeCall: () => void, cbWithClose: string) {
        this.type = type || EMsgBoxModel.Normall;
        this.cbWithClose = cbWithClose;
        if (cbWithClose && cbWithClose.length > 0) {
            EventClient.I.on(E.MsgBox.Refresh, this.updateUI, this);
        }
        this.cb = callback;
        this.closeCall = closeCall;
        this.setClick(config?.showToggle);
        if (tipMsg == null || tipMsg.length <= 0) {
            console.log('提示信息不能为空');
            return;
        }
        if (config == null) {
            this.richText.string = tipMsg;
            this.richText.node.active = true;
            this.tipTog.node.active = false;
            this.ndItem.active = false;

            this.layoutContent();
            return;
        }

        this.richText.node.active = config.info == null || config.info === undefined;
        this.richText.string = tipMsg;
        this.ndTog.active = !(config.showToggle == null || config.showToggle.length <= 0);
        if (this.ndTog.active) {
            if (config.tipTogState === false) {
                this.tipTog.uncheck();
            }
        }
        this.ndItem.active = config.info !== null && config.info !== undefined;// !(config.info !== null || config.info !== undefined);
        this.ndTipLabel.string = tipMsg;
        if (config.info) {
            console.log('展示物品的信息=', config.info);
            // this.itemPriceLab.string = `单价：${config.info.pric}`;
            UtilItemList.ShowItems(this.itemIconSpr, config.info.ItemString);
            this.itemPriceLab.string = `${config.info.Prize}`;
            this.coinTypeSpr.loadImage(UtilCurrency.getIconByCurrencyType(config.info.CostItem), 1, true);
        }

        this.layoutContent();
    }
}
