/*
 * @Author: ylj
 * @Date: 2022-06-15 16:13:00
 * @FilePath: \SanGuo\assets\script\game\module\equip\strength\StrengthController.ts
 * @Description: 熔炼控制器
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
import { equipTabDataArr } from '../EquipConst';

const { ccclass } = cc._decorator;
@ccclass('StrengthController')
export default class StrengthController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CEquipPosInfo_ID, this._onS2CEquipPosInfo, this);
        EventProto.I.on(ProtoId.S2CStrengthEquipPos_ID, this._onS2CStrengthEquipPos, this);
        EventProto.I.on(ProtoId.S2CAutoStrengthEquipPos_ID, this._onS2CAutoStrengthEquipPos, this);
        EventProto.I.on(ProtoId.S2CResonateEquipPos_ID, this._onS2CResonateEquipPos, this);

        EventProto.I.on(ProtoId.S2CEquipGemOneKeyLevelUp_ID, this.onS2CEquipGemOneKeyLevelUp, this);

        EventProto.I.on(ProtoId.S2CEquipGemOneKeyInlay_ID, this.onS2CEquipGemOneKeyInlay, this);
        EventProto.I.on(ProtoId.S2CEquipGemInlay_ID, this.onS2CEquipGemInlay, this);
    }

    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CEquipPosInfo_ID, this._onS2CEquipPosInfo, this);
        EventProto.I.off(ProtoId.S2CStrengthEquipPos_ID, this._onS2CStrengthEquipPos, this);
        EventProto.I.off(ProtoId.S2CAutoStrengthEquipPos_ID, this._onS2CAutoStrengthEquipPos, this);
        EventProto.I.off(ProtoId.S2CResonateEquipPos_ID, this._onS2CResonateEquipPos, this);

        EventProto.I.off(ProtoId.S2CEquipGemOneKeyInlay_ID, this.onS2CEquipGemOneKeyInlay, this);
        EventProto.I.off(ProtoId.S2CEquipGemOneKeyLevelUp_ID, this.onS2CEquipGemOneKeyLevelUp, this);
        EventProto.I.off(ProtoId.S2CEquipGemInlay_ID, this.onS2CEquipGemInlay, this);
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        let funcId: number = FuncId.EquipStrength;
        if (tab) {
            const index = equipTabDataArr.findIndex((v) => v.TabId === tab);
            if (index >= 0) {
                funcId = equipTabDataArr[index].funcId;
            }
        }
        if (UtilFunOpen.isOpen(funcId, true)) {
            WinMgr.I.open(ViewConst.EquipWin, tab, params ? params[0] : 0);
        }

        return true;
    }

    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.onGameStart, this);
    }
    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.onGameStart, this);
    }
    public clearAll(): void {
        //
    }

    public init(): void {
        //
    }

    public onGameStart(): void {
        this.reqC2SEquipPosInfo();
    }

    /** 获取强化装备信息 */
    public reqC2SEquipPosInfo(): void {
        const req = new C2SEquipPosInfo();
        NetMgr.I.sendMessage(ProtoId.C2SEquipPosInfo_ID, req);
    }
    private _onS2CEquipPosInfo(data: S2CEquipPosInfo): void {
        if (!data.Tag) {
            ModelMgr.I.StrengthModel.initData(data.EquipPosList, data.ResonateLev);
            ModelMgr.I.GemModel.initData(data.EquipPosList);
            EventClient.I.emit(E.Strength.StrengthInfo);
        }
    }

    /** 强化 */
    public reqC2SStrengthEquipPos(pos: number): void {
        const req = new C2SStrengthEquipPos();
        req.Pos = pos;// 1 ---8
        NetMgr.I.sendMessage(ProtoId.C2SStrengthEquipPos_ID, req);
    }
    public _onS2CStrengthEquipPos(data: S2CStrengthEquipPos): void {
        if (!data.Tag) {
            ModelMgr.I.StrengthModel.updateEquipPosList([data.EquipPos]);
            EventClient.I.emit(E.Strength.StrengthSuccess, [data.EquipPos]);
        } else {
            // MsgToastMgr.Show(`${i18n.tt(Lang.strength_fail)}${data.Tag}`);// 强化失败
        }
    }

    /** 一键强化 */
    public reqC2SAutoStrengthEquipPos(): void {
        const req = new C2SAutoStrengthEquipPos();
        NetMgr.I.sendMessage(ProtoId.C2SAutoStrengthEquipPos_ID, req);
    }
    public _onS2CAutoStrengthEquipPos(data: S2CAutoStrengthEquipPos): void {
        if (!data.Tag) {
            ModelMgr.I.StrengthModel.updateEquipPosList(data.EquipPosList);
            EventClient.I.emit(E.Strength.StrengthSuccess, data.EquipPosList);
        } else {
            // MsgToastMgr.Show(`${i18n.tt(Lang.strength_fail)}${data.Tag}`);// 强化失败
        }
    }

    /** 单宝石镶嵌 */
    public reqC2SEquipGemInlay(EquipPart: number, Pos: number, ItemId: number): void {
        const req = new C2SEquipGemInlay();
        req.EquipPart = EquipPart;
        req.ItemId = ItemId;
        req.Pos = Pos;
        NetMgr.I.sendMessage(ProtoId.C2SEquipGemInlay_ID, req);
    }

    /** 一键镶嵌宝石 */
    public reqC2SEquipGemOneKeyInlay(): void {
        const req = new C2SEquipGemOneKeyInlay();
        NetMgr.I.sendMessage(ProtoId.C2SEquipGemOneKeyInlay_ID, req);
    }

    /** 一键升级宝石 */
    public reqC2SEquipGemOneKeyLevelUp(): void {
        const req = new C2SEquipGemOneKeyLevelUp();

        NetMgr.I.sendMessage(ProtoId.C2SEquipGemOneKeyLevelUp_ID, req);
    }

    /** 单宝石镶嵌 返回 */
    public onS2CEquipGemInlay(data: S2CEquipGemInlay): void {
        const ary = ModelMgr.I.GemModel.updateGem(data.EquipPart, data.GemInfo);
        EventClient.I.emit(E.Gem.Inlay, ary);
    }

    /** 一键镶嵌宝石 返回 */
    public onS2CEquipGemOneKeyInlay(data: S2CEquipGemOneKeyInlay): void {
        console.log('一键镶嵌宝石 callback');
        const ary = ModelMgr.I.GemModel.updateGemList(data.EquipPosList);
        EventClient.I.emit(E.Gem.OneKeyInlay, ary);
    }

    /** 一键升级宝石 返回 */
    public onS2CEquipGemOneKeyLevelUp(data: S2CEquipGemOneKeyLevelUp): void {
        console.log('一键升级宝石 callback');
        const ary = ModelMgr.I.GemModel.updateGemList(data.EquipPosList);
        EventClient.I.emit(E.Gem.OneKeyLevelUp, ary);
    }

    /** 升阶 */
    public reqC2SResonateEquipPos(): void {
        const req = new C2SResonateEquipPos();
        NetMgr.I.sendMessage(ProtoId.C2SResonateEquipPos_ID, req);
    }
    public _onS2CResonateEquipPos(data: S2CResonateEquipPos): void {
        if (!data.Tag) {
            ModelMgr.I.StrengthModel.updateResonateLev(data.Level);
            EventClient.I.emit(E.Strength.UpRsonateSuccess);
        } else {
            MsgToastMgr.Show(`${i18n.tt(Lang.strength_lvup_fail)}${data.Tag}`);
        }
    }
}
