/*
 * @Author: myl
 * @Date: 2022-12-21 11:23:13
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { EventProto } from '../../../../../app/base/event/EventProto';
import BaseController from '../../../../../app/core/mvc/controller/BaseController';
import { E } from '../../../../const/EventName';
import ModelMgr from '../../../../manager/ModelMgr';
import NetMgr from '../../../../manager/NetMgr';
import { CashCowShakeType } from './CashCowConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashCowController extends BaseController {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        // C2SCashCowUIData_ID = 996;
        // S2CCashCowUIData_ID = 997;
        // C2SCashCowShake_ID = 995;
        // S2CCashCowShake_ID = 998;
        EventProto.I.on(ProtoId.S2CCashCowUIData_ID, this.onS2CCashCowUIData, this);
        EventProto.I.on(ProtoId.S2CCashCowShake_ID, this.onS2CCashCowShake, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CCashCowUIData_ID, this.onS2CCashCowUIData, this);
        EventProto.I.off(ProtoId.S2CCashCowShake_ID, this.onS2CCashCowShake, this);
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        //
    }

    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        //
    }

    public GetCashCowData(FuncId: number, CycNo: number): void {
        const d: C2SCashCowUIData = {
            FuncId,
            CycNo,
        };
        NetMgr.I.sendMessage(ProtoId.C2SCashCowUIData_ID, d);
    }

    private onS2CCashCowUIData(data: S2CCashCowUIData): void {
        console.log('摇钱树数据====', data);
        if (data && data.Tag === 0) {
            ModelMgr.I.CashCowModel.userData = data.ActData;
        }
    }

    public shakeCashCow(
        FuncId: number,
        CycNo: number,
        ShakeType: CashCowShakeType,
        IsOneKey: number = 0,
        Num: number = 0,
    ): void {
        const d: C2SCashCowShake = {
            FuncId,
            CycNo,
            ShakeType,
            IsOneKey,
            Num,
        };
        NetMgr.I.sendMessage(ProtoId.C2SCashCowShake_ID, d);
    }
    private onS2CCashCowShake(data: S2CCashCowShake): void {
        console.log('摇树结果', data);
        if (data && data.Tag === 0) {
            ModelMgr.I.CashCowModel.userData = data.CashCowClientData;
            // 飘字提示
            EventClient.I.emit(E.CashCow.Shake, data.Reward);
        }
    }
}
