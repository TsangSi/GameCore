/*
 * @Author: zs
 * @Date: 2022-06-14 15:38:53
 * @FilePath: \SanGuo-2.4-main\assets\script\game\com\msgbox\MsgBoxModel.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import { EMsgBoxModel, IBoxCfg } from './ConfirmBox';

const { ccclass } = cc._decorator;
@ccclass('MsgBoxModel')
export class MsgBoxModel extends BaseModel {
    public init(): void {
        // 标记是否再次弹出
        EventClient.I.on(E.MsgBox.AddTogleFlag, this.onAddTip, this);
        // 手动关闭
        EventClient.I.on(E.MsgBox.Close, this.removeRefreshFlag, this);
    }

    public clearAll(): void {
        this.TipContent.length = 0;
        this.refreshViewMap.clear();
        EventClient.I.off(E.MsgBox.AddTogleFlag, this.onAddTip, this);
        // 手动关闭
        EventClient.I.off(E.MsgBox.Close, this.removeRefreshFlag, this);
    }
    private TipContent: string[] = [];
    /**
    *  显示一个弹出窗
    * @param tipMsg 提示文字信息
    * @param callback 确定点击的回调
    * @param conf 配置 {showToggle : 标识key ， info ： 物品信息，ID：物品ID，count：物品数量，price：物品价格，cType:货币类型 }
    * @param closeCall 关闭回调
    * @param type 按钮样式 EMsgBoxModel
    */
    public ShowBox(
        tipMsg: string,
        callback: (state: boolean) => void = null,
        conf: IBoxCfg = null,
        closeCall: (state: boolean) => void = null,
        type: EMsgBoxModel = EMsgBoxModel.Normall,
    ): void {
        if (conf != null && this.IsTip(conf.showToggle)) {
            callback(conf);
            if (closeCall) {
                closeCall(false);
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (conf?.cbCloseFlag?.length > 0) {
                if (this.getView(conf.cbCloseFlag)) {
                    EventClient.I.emit(E.MsgBox.Refresh, tipMsg, type, callback, conf, closeCall, conf.cbCloseFlag);
                } else {
                    WinMgr.I.open(ViewConst.ConfirmBox, tipMsg, type, callback, conf, closeCall, conf.cbCloseFlag);
                    this.setViewMap(conf.cbCloseFlag, true);
                }
            } else {
                WinMgr.I.open(ViewConst.ConfirmBox, tipMsg, type, callback, conf, closeCall);
            }
        }
    }

    public IsTip(str: string): boolean {
        if (str === '') return false;
        const idx = this.TipContent.indexOf(str);
        return idx >= 0;
    }

    private onAddTip(str: string): void {
        if (!this.IsTip(str)) {
            this.TipContent.push(str);
        }
    }

    private refreshViewMap: Map<string, boolean> = new Map();
    private setViewMap(flag: string, state: boolean) {
        if (state) {
            this.refreshViewMap.set(flag, state);
        } else {
            this.refreshViewMap.delete(flag);
        }
    }

    private getView(flag: string): boolean {
        if (this.refreshViewMap.get(flag)) {
            return true;
        }
        return false;
    }

    private removeRefreshFlag(flag: string) {
        this.setViewMap(flag, false);
    }

    public isOpen(flag: string): boolean {
        return this.getView(flag);
    }
}
