// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuffController extends BaseController {
    public addNetEvent(): void {
        // throw new Error("Method not implemented.");
        EventProto.I.on(ProtoId.S2CAllIncrease_ID, this.onS2CAllIncrease, this);
        EventProto.I.on(ProtoId.S2CIncreaseUpdate_ID, this.onS2CIncreaseUpdate, this);
        EventProto.I.on(ProtoId.S2CIncreaseDel_ID, this.onS2CIncreaseDel, this);
    }
    public delNetEvent(): void {
        // throw new Error("Method not implemented.");
        EventProto.I.off(ProtoId.S2CAllIncrease_ID, this.onS2CAllIncrease, this);
        EventProto.I.off(ProtoId.S2CIncreaseUpdate_ID, this.onS2CIncreaseUpdate, this);
        EventProto.I.off(ProtoId.S2CIncreaseDel_ID, this.onS2CIncreaseDel, this);
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

    /** 下发所有增益技能 */
    private onS2CAllIncrease(d: S2CAllIncrease) {
        ModelMgr.I.BuffModel.updateBuff(d.Skills);
    }

    /** 更新增益技能(不存在则添加) */
    private onS2CIncreaseUpdate(d: S2CIncreaseUpdate) {
        ModelMgr.I.BuffModel.updateBuff([d.Skill]);
    }

    /** 删除增益技能 */
    private onS2CIncreaseDel(d: S2CIncreaseDel) {
        ModelMgr.I.BuffModel.delBuff(d.SkillId);
    }

    public linkOpen(tab?: number, params?: any[], ...args: any[]): void {
        WinMgr.I.open(ViewConst.BuffListWin);
    }
}
