/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: lijun
 * @Date: 2023-02-20 15:57:16
 * @Description:
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';

const { ccclass } = cc._decorator;

@ccclass('HuarongdaoController')
export default class HuarongdaoController extends BaseController {
    public addNetEvent(): void {
        /** 华容道协议监听 */
        EventProto.I.on(ProtoId.S2CHuarongInfo_ID, this.onS2CHuarongInfo, this);
        EventProto.I.on(ProtoId.S2CHuarongBet_ID, this.onS2CHuarongBet, this);
        EventProto.I.on(ProtoId.S2CHuarongBetLog_ID, this.onS2CHuarongBetLog, this);
        EventProto.I.on(ProtoId.S2CHuarongBuy_ID, this.onS2CHuarongBuy, this);
        EventProto.I.on(ProtoId.S2CHuarongBetUpate_ID, this.onS2CHuarongBetUpate, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CHuarongInfo_ID, this.onS2CHuarongInfo, this);
        EventProto.I.off(ProtoId.S2CHuarongBet_ID, this.onS2CHuarongBet, this);
        EventProto.I.off(ProtoId.S2CHuarongBetLog_ID, this.onS2CHuarongBetLog, this);
        EventProto.I.off(ProtoId.S2CHuarongBuy_ID, this.onS2CHuarongBuy, this);
        EventProto.I.off(ProtoId.S2CHuarongBetUpate_ID, this.onS2CHuarongBetUpate, this);
    }
    public addClientEvent(): void {
        /** 游戏启动 */
        EventClient.I.on(E.Game.Start, this.onGameStart, this);
    }
    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.onGameStart, this);
    }
    public clearAll(): void {
        //
    }

    private onGameStart(): void {
        // 游戏启动后红点监听
        ModelMgr.I.HuarongdaoModel.redCheck();
    }

    /** 请求 */
    public reqC2SHuarongInfo(): void {
        const d = {};
        NetMgr.I.sendMessage(ProtoId.C2SHuarongInfo_ID, d);
        // this.onS2CHuarongInfo(ModelMgr.I.HuarongdaoModel.testHuarongInfo());
    }

    /** 收到华容道信息 */
    private onS2CHuarongInfo(data: S2CHuarongInfo): void {
        ModelMgr.I.HuarongdaoModel.setHuarongInfo(data);
        EventClient.I.emit(E.Huarongdao.UpdateView);
    }

    /** 确定支持 */
    public reqC2SHuarongBet(id: number, num: number): void {
        const d: C2SHuarongBet = {
            Id: id,
            Count: num,
        };
        NetMgr.I.sendMessage(ProtoId.C2SHuarongBet_ID, d);
    }

    /** 押注结果 */
    private onS2CHuarongBet(data: S2CHuarongBet): void {
        if (data.Tag == 0) {
            ModelMgr.I.HuarongdaoModel.setGenSupportNum(data.Id, data.Count);
            EventClient.I.emit(E.Huarongdao.SupportResult, data);
        }
    }

    /** 请求押注记录 */
    public reqC2SHuarongBetLog(): void {
        const d = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SHuarongBetLog_ID, d);
    }

    /** 押注记录 */
    private onS2CHuarongBetLog(data: S2CHuarongBetLog): void {
        if (data.Tag === 0) {
            ModelMgr.I.HuarongdaoModel.setActivityLog(data.WinEntryList, data.BetList);
            EventClient.I.emit(E.Huarongdao.SupportLog);
        }
    }

    /** 购买礼券 */
    public reqC2SHuarongBuy(type: number, count: number): void {
        const d: C2SHuarongBuy = {
            BuyType: type,
            Count: count,
        };
        NetMgr.I.sendMessage(ProtoId.C2SHuarongBuy_ID, d);
    }

    private onS2CHuarongBuy(data: S2CHuarongBuy): void {
        if (data.Tag === 0) {
            ModelMgr.I.HuarongdaoModel.setBuyInfo(data.BuyInfoList);
            EventClient.I.emit(E.Huarongdao.GiftTimesUpdate);
        }
    }

    /** 押注更新 */
    private onS2CHuarongBetUpate(data: S2CHuarongBetUpate): void {
        if (data.Tag === 0) {
            ModelMgr.I.HuarongdaoModel.setSupportRateMap(data.BetList);
        }
    }

    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        if (params && params[0]) {
            WinMgr.I.open(ViewConst.DailyWin, tab, params[0]);
        } else {
            /** 此处做了特殊处理  配置表修改 */
            WinMgr.I.open(ViewConst.DailyWin, tab || 1);
        }
        return true;
    }
}
