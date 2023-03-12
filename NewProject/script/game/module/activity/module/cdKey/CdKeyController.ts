/*
 * @Author: lijun
 * @Date: 2023-02-16 15:37:55
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { EventProto } from '../../../../../app/base/event/EventProto';
import BaseController from '../../../../../app/core/mvc/controller/BaseController';
import { E } from '../../../../const/EventName';
import NetMgr from '../../../../manager/NetMgr';

const { ccclass } = cc._decorator;

@ccclass
export default class CdKeyController extends BaseController {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CGetCDKeyReward_ID, this.onS2CCdKeyResult, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CGetCDKeyReward_ID, this.onS2CCdKeyResult, this);
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        //
    }

    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        //
    }

    public GetCdKeyReward(FuncId: number, CycNo: number, CDKey: string): void {
        const d = {
            FuncId,
            CycNo,
            CDKey,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetCDKeyReward_ID, d);
    }

    private onS2CCdKeyResult(data: S2CGetCDKeyReward): void {
        console.log('cdkey领取结果', data);
        EventClient.I.emit(E.CdKey.Result, data);
    }
}
