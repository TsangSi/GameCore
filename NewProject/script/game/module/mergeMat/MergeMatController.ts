import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import { i18n, Lang } from '../../../i18n/i18n';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { E } from '../../const/EventName';
import NetMgr from '../../manager/NetMgr';
import { ItemPopType } from '../equip/EquipConst';

const { ccclass } = cc._decorator;
@ccclass('MergeMatController')
export default class MergeMatController extends BaseController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CComMaterial_ID, this._onS2CComMaterial, this);
        EventProto.I.on(ProtoId.S2CItemInfoPop_ID, this._onItemInfoPop, this);
    }

    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CComMaterial_ID, this._onS2CComMaterial, this);
        EventProto.I.off(ProtoId.S2CItemInfoPop_ID, this._onItemInfoPop, this);
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

    public init(): void {
        //
    }

    /** 合成装备 */
    public reqC2SComMaterial(itemId: number, itemNum: number): void {
        const req = new C2SComMaterial();
        req.Id = itemId;
        req.Num = itemNum;
        NetMgr.I.sendMessage(ProtoId.C2SComMaterial_ID, req);
    }

    /** 合成返回 */
    private _onS2CComMaterial(data: S2CComMaterial): void {
        if (!data.Tag) {
            EventClient.I.emit(E.MergeMat.SuccessUpdateUI);
        }
    }

    private _onItemInfoPop(data: S2CItemInfoPop) {
        if (data.Type === ItemPopType.MergeMat) {
            if (!data.Tag) {
                EventClient.I.emit(E.MergeMat.MergeSuccess, data.ItemInfo);
            }
        }
    }
}
