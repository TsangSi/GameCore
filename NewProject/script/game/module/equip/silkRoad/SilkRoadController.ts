/*
 * @Author: kexd
 * @Date: 2022-07-07 14:52:48
 * @FilePath: \SanGuo\assets\script\game\module\equip\buildEquip\BuildController.ts
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { EventProto } from '../../../../app/base/event/EventProto';
import BaseController from '../../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import NetMgr from '../../../manager/NetMgr';
import { equipTabDataArr, ItemPopType } from '../EquipConst';

const { ccclass } = cc._decorator;
@ccclass('SilkRoadController')
export default class SilkRoadController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CSilkRoadInfo_ID, this.onInfo, this);
        EventProto.I.on(ProtoId.S2CSilkRoadStart_ID, this.onStart, this);
        EventProto.I.on(ProtoId.S2CSilkRoadFastFinish_ID, this.onFastFinish, this);
        EventProto.I.on(ProtoId.S2CSilkRoadBuyCount_ID, this.onBuyCount, this);
        EventProto.I.on(ProtoId.S2CSilkRoadReward_ID, this.onReward, this);
    }

    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CSilkRoadInfo_ID, this.onInfo, this);
        EventProto.I.off(ProtoId.S2CSilkRoadStart_ID, this.onStart, this);
        EventProto.I.off(ProtoId.S2CSilkRoadFastFinish_ID, this.onFastFinish, this);
        EventProto.I.off(ProtoId.S2CSilkRoadBuyCount_ID, this.onBuyCount, this);
        EventProto.I.off(ProtoId.S2CSilkRoadReward_ID, this.onReward, this);
    }
    public addClientEvent(): void {
        //
    }
    public delClientEvent(): void {
        //
    }
    public clearAll(): void {
        //
    }

    /** 请求西域之行信息 */
    public reqInfo(): void {
        const req: C2SSilkRoadInfo = new C2SSilkRoadInfo();
        NetMgr.I.sendMessage(ProtoId.C2SSilkRoadInfo_ID, req);
    }

    /** 数据返回 */
    private onInfo(data: S2CSilkRoadInfo): void {
        data.SilkRoadInfo.BuyCount = data.SilkRoadInfo.BuyCount ? data.SilkRoadInfo.BuyCount : 0;
        data.SilkRoadInfo.Count = data.SilkRoadInfo.Count ? data.SilkRoadInfo.Count : 0;
        ModelMgr.I.SilkRoadModel.setInfo(data.SilkRoadInfo);
        EventClient.I.emit(E.SilkRoad.loadInfo, data.SilkRoadInfo);
    }

    /** 请求西域之行 行商 */
    public reqStart(id: number): void {
        const req = new C2SSilkRoadStart();
        req.Id = id;
        NetMgr.I.sendMessage(ProtoId.C2SSilkRoadStart_ID, req);
    }

    /** 数据返回 */
    private onStart(data: S2CSilkRoadStart): void {
        ModelMgr.I.SilkRoadModel.setInfo(data.SilkRoadInfo);
        EventClient.I.emit(E.SilkRoad.start, data.SilkRoadInfo);
    }

    /** 请求西域之行 快速完成 */
    public reqFastFinish(id: number) {
        const req = new C2SSilkRoadFastFinish();
        req.Id = id;
        NetMgr.I.sendMessage(ProtoId.C2SSilkRoadFastFinish_ID, req);
    }

    /** 数据返回 */
    private onFastFinish(data: S2CSilkRoadFastFinish) {
        ModelMgr.I.SilkRoadModel.setInfo(data.SilkRoadInfo);
        EventClient.I.emit(E.SilkRoad.finish);
    }

    /** 请求购买次数 */
    public reqBuyCount() {
        const req = new C2SSilkRoadBuyCount();
        NetMgr.I.sendMessage(ProtoId.C2SSilkRoadBuyCount_ID, req);
    }

    private onBuyCount(data: S2CSilkRoadBuyCount) {
        ModelMgr.I.SilkRoadModel.setBuyCount(data.BuyCount);
        EventClient.I.emit(E.SilkRoad.buyCount, true);
    }

    /** 奖励请求 */
    public reqReward() {
        const req = new C2SSilkRoadReward();
        NetMgr.I.sendMessage(ProtoId.C2SSilkRoadReward_ID, req);
    }

    /** 数据返回 */
    private onReward(data: S2CSilkRoadReward) {
        if (data.SilkRoadInfo) {
            if (data.SilkRoadInfo.BaseItemInfos.length) {
                WinMgr.I.close(ViewConst.SilkRoadReward);
            }
            ModelMgr.I.SilkRoadModel.setInfo(data.SilkRoadInfo);
            EventClient.I.emit(E.SilkRoad.loadInfo, data.SilkRoadInfo);
        }
    }
}
