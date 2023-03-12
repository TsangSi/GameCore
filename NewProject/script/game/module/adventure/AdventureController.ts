/* eslint-disable dot-notation */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import { E } from '../../const/EventName';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';

const { ccclass } = cc._decorator;
@ccclass('AdventureController')
export default class AdventureController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CAdventureInfo_ID, this.onInfo, this);
        EventProto.I.on(ProtoId.S2CAdventureComDice_ID, this.onComDice, this);
        EventProto.I.on(ProtoId.S2CAdventureGoldDice_ID, this.onGoldDice, this);
        EventProto.I.on(ProtoId.S2CAdventureEventUse_ID, this.onEventUse, this);
    }

    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CAdventureInfo_ID, this.onInfo, this);
        EventProto.I.off(ProtoId.S2CAdventureComDice_ID, this.onComDice, this);
        EventProto.I.off(ProtoId.S2CAdventureGoldDice_ID, this.onGoldDice, this);
        EventProto.I.off(ProtoId.S2CAdventureEventUse_ID, this.onEventUse, this);
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

    /** 请求游历天下信息 */
    public reqInfo(): void {
        const req: C2SAdventureInfo = new C2SAdventureInfo();
        NetMgr.I.sendMessage(ProtoId.C2SAdventureInfo_ID, req);
    }

    /** 返回游历天下信息 */
    private onInfo(info: S2CAdventureInfo): void {
        ModelMgr.I.AdventureModel.setInfo(info);
        EventClient.I.emit(E.Adventure.loadInfo, info);
    }

    /** 请求普通骰子 */
    public reqComDice(): void {
        const req: C2SAdventureComDice = new C2SAdventureComDice();
        NetMgr.I.sendMessage(ProtoId.C2SAdventureComDice_ID, req);
    }

    /** 返回普通骰子 */
    private onComDice(dice: S2CAdventureComDice): void {
        if (dice) {
            ModelMgr.I.AdventureModel.setPos(dice.Pos);
            EventClient.I.emit(E.Adventure.ComDiceEvent, dice);
        }
    }

    /** 请求黄金骰子 */
    public reqGoldDice(diceNum: number): void {
        const req: C2SAdventureGoldDice = new C2SAdventureGoldDice();
        req.DiceNum = diceNum;
        NetMgr.I.sendMessage(ProtoId.C2SAdventureGoldDice_ID, req);
    }

    /** 返回黄金骰子 */
    private onGoldDice(dice: S2CAdventureGoldDice): void {
        if (dice) {
            ModelMgr.I.AdventureModel.setPos(dice.Pos);
            EventClient.I.emit(E.Adventure.GoldDiceEvent, dice);
        }
    }

    /** 请求事件使用 */
    public reqEventUse(id: number, val: number = null): void {
        const req: C2SAdventureEventUse = new C2SAdventureEventUse();
        req.OnlyId = id;
        if (val) { req.Value = val; }
        NetMgr.I.sendMessage(ProtoId.C2SAdventureEventUse_ID, req);
    }

    /** 请求事件返回 */
    private onEventUse(ev: S2CAdventureEventUse): void {
        if (ev.AdventureEvent) {
            ModelMgr.I.AdventureModel.updateEvent(ev.AdventureEvent);
            EventClient.I.emit(E.Adventure.syncEventList);
        }
    }
}
