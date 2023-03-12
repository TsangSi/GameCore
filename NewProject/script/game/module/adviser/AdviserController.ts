import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';

const { ccclass, property } = cc._decorator;

@ccclass('AdviserController')
export default class AdviserController extends BaseController {
    public addNetEvent(): void {
        // throw new Error("Method not implemented.");
        EventProto.I.on(ProtoId.S2CAdviserInfo_ID, this.onS2CAdviserInfo, this);
        EventProto.I.on(ProtoId.S2CAdviserLevelUp_ID, this.onS2CAdviserLevelUp, this);
        EventProto.I.on(ProtoId.S2CAdviserLevelUpAuto_ID, this.onS2CAdviserLevelUpAuto, this);
        EventProto.I.on(ProtoId.S2CAdviserMasteryLevelUp_ID, this.onS2CAdviserMasteryLevelUp, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CAdviserInfo_ID, this.onS2CAdviserInfo, this);
        EventProto.I.off(ProtoId.S2CAdviserLevelUp_ID, this.onS2CAdviserLevelUp, this);
        EventProto.I.off(ProtoId.S2CAdviserLevelUpAuto_ID, this.onS2CAdviserLevelUpAuto, this);
        EventProto.I.off(ProtoId.S2CAdviserMasteryLevelUp_ID, this.onS2CAdviserMasteryLevelUp, this);
        // throw new Error("Method not implemented.");
    }
    public addClientEvent(): void {
        // throw new Error("Method not implemented.");
    }
    public delClientEvent(): void {
        // throw new Error("Method not implemented.");
    }
    public clearAll(): void {
        // throw new Error("Method not implemented.");
    }

    /** 请求军师信息 */
    public C2SAdviserInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2SAdviserInfo_ID);
    }

    private onS2CAdviserInfo(d: S2CAdviserInfo) {
        if (d.Tag === 0) {
            ModelMgr.I.AdviserModel.setData(d.Adviser);
        }
    }

    /** 军师升级 */
    public C2SAdviserLevelUp(autoBuy: boolean): void {
        const d = new C2SAdviserLevelUp();
        d.AutoBuy = autoBuy ? 1 : 0;
        NetMgr.I.sendMessage(ProtoId.C2SAdviserLevelUp_ID);
    }

    private onS2CAdviserLevelUp(d: S2CAdviserLevelUp) {
        if (d.Tag === 0) {
            ModelMgr.I.AdviserModel.updateLevelAndExp(d.Adviser.Level, d.Adviser.Exp);
        }
    }

    /** 军师一键升级 */
    public C2SAdviserLevelUpAuto(autoBuy: boolean): void {
        const d = new C2SAdviserLevelUpAuto();
        d.AutoBuy = autoBuy ? 1 : 0;
        NetMgr.I.sendMessage(ProtoId.C2SAdviserLevelUpAuto_ID, d);
    }

    private onS2CAdviserLevelUpAuto(d: S2CAdviserLevelUpAuto) {
        if (d.Tag === 0) {
            ModelMgr.I.AdviserModel.updateLevelAndExp(d.Adviser.Level, d.Adviser.Exp);
        }
    }

    /**
     * 军师专精升级
     * @param type 专精类型
     */
    public C2SAdviserMasteryLevelUp(id: number): void {
        const d = new C2SAdviserMasteryLevelUp();
        d.MasteryId = id;
        NetMgr.I.sendMessage(ProtoId.C2SAdviserMasteryLevelUp_ID, d);
    }

    private onS2CAdviserMasteryLevelUp(d: S2CAdviserMasteryLevelUp) {
        if (d.Tag === 0) {
            ModelMgr.I.AdviserModel.updateMasteryInfo([d.MasteryInfo]);
            //
        }
    }

    /**
     * 打开红颜界面
     * @param tabId 页签id
     * @param params 配置表参数
     * @param args 手动传参
     */
    public linkOpen(index?: number, params?: any[], args?: any[]): void {
        const tabId: number = 0;
        if (UtilFunOpen.isOpen(FuncId.Adviser, true)) {
            WinMgr.I.open(ViewConst.AdviserWin, tabId, params, args);
        }
    }
}
