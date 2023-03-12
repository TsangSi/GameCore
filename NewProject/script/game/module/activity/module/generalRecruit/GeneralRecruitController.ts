import { EventProto } from '../../../../../app/base/event/EventProto';
import BaseController from '../../../../../app/core/mvc/controller/BaseController';
import ModelMgr from '../../../../manager/ModelMgr';
import NetMgr from '../../../../manager/NetMgr';

const { ccclass } = cc._decorator;
@ccclass('GeneralRecruitController')
export class GeneralRecruitController extends BaseController {
    public constructor() {
        super();
    }
    public addNetEvent(): void {
        // 招募基础数据返回
        EventProto.I.on(ProtoId.S2CZhaoMuUIData_ID, this.onS2CZhaoMuUIData, this);
        /** 招募返回 */
        EventProto.I.on(ProtoId.S2CZhaoMuLuckyDraw_ID, this.onS2CZhaoMuLuckyDraw, this);
        /** 阶段奖励领取 */
        EventProto.I.on(ProtoId.S2CZhaoMuGetStageRw_ID, this.onS2CZhaoMuGetStageRw, this);
        /** 设置许愿 */
        EventProto.I.on(ProtoId.S2CZhaoMuSetWish_ID, this.onS2CZhaoMuSetWish, this);
        /** 招募日志 */
        EventProto.I.on(ProtoId.S2CZhaoMuOpenLog_ID, this.onS2CZhaoMuOpenLog, this);
        /** 招募背包 */
        EventProto.I.on(ProtoId.S2CZhaoMuBagData_ID, this.onS2CZhaoMuBagData, this);
        /** 招募背包取出 */
        EventProto.I.on(ProtoId.S2CZhaoMuBagTakeOut_ID, this.onS2CZhaoMuBagTakeOut, this);
    }
    public delNetEvent(): void {
        // 招募基础数据返回
        EventProto.I.off(ProtoId.S2CZhaoMuUIData_ID, this.onS2CZhaoMuUIData, this);
        /** 招募返回 */
        EventProto.I.off(ProtoId.S2CZhaoMuLuckyDraw_ID, this.onS2CZhaoMuLuckyDraw, this);
        /** 阶段奖励领取 */
        EventProto.I.off(ProtoId.S2CZhaoMuGetStageRw_ID, this.onS2CZhaoMuGetStageRw, this);
        /** 设置许愿 */
        EventProto.I.off(ProtoId.S2CZhaoMuSetWish_ID, this.onS2CZhaoMuSetWish, this);
        /** 招募日志 */
        EventProto.I.off(ProtoId.S2CZhaoMuOpenLog_ID, this.onS2CZhaoMuOpenLog, this);
        /** 招募背包 */
        EventProto.I.off(ProtoId.S2CZhaoMuBagData_ID, this.onS2CZhaoMuBagData, this);
        /** 招募背包取出 */
        EventProto.I.off(ProtoId.S2CZhaoMuBagTakeOut_ID, this.onS2CZhaoMuBagTakeOut, this);
    }

    public addClientEvent(): void {
        // EventClient.I.on(E.GM.SendGMMsg, this.reqC2SGm, this);
    }
    public delClientEvent(): void {
        //
        // EventClient.I.off(E.GM.SendGMMsg, this.reqC2SGm, this);
    }
    public clearAll(): void {
        //
    }

    /** 请求招募基础数据 */
    public reqC2SZhaoMuUIData(ActFuncId: number): void {
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(ActFuncId);
        const req = new C2SZhaoMuUIData();
        req.FuncId = ActFuncId;
        req.CycNo = CycNo;
        NetMgr.I.sendMessage(ProtoId.C2SZhaoMuUIData_ID, req);
    }
    /** 招募基础数据返回 */
    private onS2CZhaoMuUIData(data: S2CZhaoMuUIData): void {
        if (data && !data.Tag) {
            // 返回的数据
            // console.log('基础数据返回了:');
            // console.log(data);
            ModelMgr.I.GeneralRecruitModel.setZhaoMuUIData(data);
        }
    }
    /** 发送招募 */
    public reqZhaoMuLuckyDraw(ActFuncId: number, AutoBuy: number, Num: number): void {
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(ActFuncId);
        const req = new C2SZhaoMuLuckyDraw();
        req.FuncId = ActFuncId;
        req.CycNo = CycNo;
        req.Num = Num;// 招募次数
        req.AutoBuy = AutoBuy;// 是否自动购买
        NetMgr.I.sendMessage(ProtoId.C2SZhaoMuLuckyDraw_ID, req);
    }
    private onS2CZhaoMuLuckyDraw(data: S2CZhaoMuLuckyDraw): void {
        if (data && !data.Tag) {
            ModelMgr.I.GeneralRecruitModel.updateMainUIData(data);
        }
    }
    /** 领取阶段奖励 */
    public reqC2SZhaoMuGetStageRw(ActFuncId: number): void {
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(ActFuncId);
        const req = new C2SZhaoMuGetStageRw();
        req.FuncId = ActFuncId;
        req.CycNo = CycNo;
        NetMgr.I.sendMessage(ProtoId.C2SZhaoMuGetStageRw_ID, req);
    }
    private onS2CZhaoMuGetStageRw(data: S2CZhaoMuGetStageRw): void {
        if (data && !data.Tag) {
            ModelMgr.I.GeneralRecruitModel.updateStageInfo(data);
        }
    }

    // 打开招募日志
    public reqC2SZhaoMuOpenLog(ActFuncId: number, type: number, clientFlag: number, num: number = 0): void {
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(ActFuncId);
        const req = new C2SZhaoMuOpenLog();
        req.FuncId = ActFuncId;
        req.CycNo = CycNo;
        req.Type = type;
        req.Num = num;
        req.ClientFlag = clientFlag;
        NetMgr.I.sendMessage(ProtoId.C2SZhaoMuOpenLog_ID, req);
    }
    private onS2CZhaoMuOpenLog(data: S2CZhaoMuOpenLog): void {
        if (data && !data.Tag) {
            ModelMgr.I.GeneralRecruitModel.setZhaoMuLog(data);
        }
    }

    /** 点击确定 设置许愿 */
    public reqC2SZhaoMuSetWish(ActFuncId: number, wishList: number[]): void {
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(ActFuncId);
        const req = new C2SZhaoMuSetWish();
        req.FuncId = ActFuncId;
        req.CycNo = CycNo;
        req.WishList = wishList;
        NetMgr.I.sendMessage(ProtoId.C2SZhaoMuSetWish_ID, req);
    }

    private onS2CZhaoMuSetWish(data: S2CZhaoMuSetWish): void {
        if (data && !data.Tag) {
            ModelMgr.I.GeneralRecruitModel.updateWishInfo(data);
        }
    }

    // 打开招募背包UI
    public reqC2SZhaoMuBagData(ActFuncId: number): void {
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(ActFuncId);
        const req = new C2SZhaoMuBagData();
        req.FuncId = ActFuncId;
        req.CycNo = CycNo;
        NetMgr.I.sendMessage(ProtoId.C2SZhaoMuBagData_ID, req);
    }
    private onS2CZhaoMuBagData(data: S2CZhaoMuBagData): void {
        if (data && !data.Tag) {
            console.log('获得背包数据：');
            console.log(data);
            // 存储背包数据
            ModelMgr.I.GeneralRecruitModel.initBagInfo(data);
        }
    }

    /** 招募背包取出 */
    public reqC2SZhaoMuBagTakeOut(ActFuncId: number, isAll: number, OnlyId: Array<string>): void {
        const CycNo: number = ModelMgr.I.ActivityModel.getActCycNo(ActFuncId);
        const req = new C2SZhaoMuBagTakeOut();
        req.FuncId = ActFuncId;
        req.CycNo = CycNo;
        req.IsAll = isAll;
        req.OnlyId = OnlyId;
        console.log('发送取出');
        console.log({ isAll, OnlyId });

        NetMgr.I.sendMessage(ProtoId.C2SZhaoMuBagTakeOut_ID, req);
    }
    private onS2CZhaoMuBagTakeOut(data: S2CZhaoMuBagTakeOut): void {
        if (data && !data.Tag) {
            ModelMgr.I.GeneralRecruitModel.updateBagInfo(data);
        }
    }
}
