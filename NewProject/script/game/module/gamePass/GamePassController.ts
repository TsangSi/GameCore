/*
 * @Author: zs
 * @Date: 2022-09-20 11:16:09
 * @FilePath: \SanGuo2.4\assets\script\game\module\gamePass\GamePassController.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { ItemPopType } from '../equip/EquipConst';

const { ccclass, property } = cc._decorator;

@ccclass('GamePassController')
export class GamePassController extends BaseController {
    public addNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.on(ProtoId.S2CStagePassInfo_ID, this.onS2CStagePassInfo, this);
        EventProto.I.on(ProtoId.S2CStagePassReward_ID, this.onS2CStagePassReward, this);
        EventProto.I.on(ProtoId.S2CItemInfoPop_ID, this.onS2CItemInfoPop, this);
        EventProto.I.on(ProtoId.S2CStagePassBuyBs_ID, this.onS2CStagePassBuyBs, this);
    }
    public delNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.off(ProtoId.S2CStagePassInfo_ID, this.onS2CStagePassInfo, this);
        EventProto.I.off(ProtoId.S2CStagePassReward_ID, this.onS2CStagePassReward, this);
        EventProto.I.off(ProtoId.S2CItemInfoPop_ID, this.onS2CItemInfoPop, this);
        EventProto.I.off(ProtoId.S2CStagePassBuyBs_ID, this.onS2CStagePassBuyBs, this);
    }
    public addClientEvent(): void {
        // throw new Error('Method not implemented.');
        EventClient.I.on(E.Game.Start, this.onLoginReq, this);
    }
    public delClientEvent(): void {
        // throw new Error('Method not implemented.');
        EventClient.I.off(E.Game.Start, this.onLoginReq, this);
    }
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }
    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        WinMgr.I.open(ViewConst.GamePassWin);
        return true;
    }

    private onLoginReq() {
        this.C2SStagePassInfo();
    }

    /** 请求通行证信息 */
    public C2SStagePassInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2SStagePassInfo_ID);
    }

    private onS2CStagePassInfo(d: S2CStagePassInfo) {
        if (d.Tag === 0) {
            ModelMgr.I.GamePassModel.setInfo(d);
        }
    }

    public C2SStagePassReward(passId: number): void {
        NetMgr.I.sendMessage(ProtoId.C2SStagePassReward_ID, new C2SStagePassInfo({ PassId: passId }));
    }

    private onS2CStagePassReward(d: S2CStagePassReward) {
        if (d.Tag === 0) {
            //
        }
    }

    private onS2CItemInfoPop(d: S2CItemInfoPop) {
        if (d.Type === ItemPopType.StagePass) {
            if (d.Tag === 0) {
                EventClient.I.emit(E.GamePass.GetReward, d.ItemInfo);
            }
        }
    }

    public C2SStagePassBuyBs(passId: number): void {
        const d = new C2SStagePassBuyBs();
        d.PassId = passId;
        NetMgr.I.sendMessage(ProtoId.C2SStagePassBuyBs_ID, d);
    }

    private onS2CStagePassBuyBs(d: S2CStagePassBuyBs) {
        if (d.Tag === 0) {
            //
        }
    }
}
