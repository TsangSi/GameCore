/*
 * @Author: myl
 * @Date: 2022-10-11 22:06:56
 * @Description: 虎符 和 官印 controller
 */

import { EventProto } from '../../../../app/base/event/EventProto';
import BaseController from '../../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import NetMgr from '../../../manager/NetMgr';

const { ccclass, property } = cc._decorator;

@ccclass('SealAmuletController')
export class SealAmuletController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        // 虎符官印升级
        EventProto.I.on(ProtoId.S2COfficeSignUp_ID, this.onS2COfficeSignUp, this);
        // 一键升级
        EventProto.I.on(ProtoId.S2COfficeSignAutoUp_ID, this.onS2COfficeSignAutoUp, this);

        // 升星
        EventProto.I.on(ProtoId.S2COfficeSignStar_ID, this.onS2COfficeSignStar, this);
        // 一键升星
        EventProto.I.on(ProtoId.S2COfficeSignAutoStar_ID, this.onS2COfficeSignAutoStar, this);
        // 升星突破
        EventProto.I.on(ProtoId.S2COfficeSignBreakStar_ID, this.onS2COfficeSignBreakStar, this);

        // 淬炼
        EventProto.I.on(ProtoId.S2COfficeSignRefine_ID, this.onS2COfficeSignRefine, this);
        // 淬炼突破
        EventProto.I.on(ProtoId.S2COfficeSignRefineBreak_ID, this.onS2COfficeSignRefineBreak, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        // 虎符官印升级
        EventProto.I.off(ProtoId.S2COfficeSignUp_ID, this.onS2COfficeSignUp, this);
        // 一键升级
        EventProto.I.off(ProtoId.S2COfficeSignAutoUp_ID, this.onS2COfficeSignAutoUp, this);

        // 升星
        EventProto.I.off(ProtoId.S2COfficeSignStar_ID, this.onS2COfficeSignStar, this);
        // 一键升星
        EventProto.I.off(ProtoId.S2COfficeSignAutoStar_ID, this.onS2COfficeSignAutoStar, this);
        // 升星突破
        EventProto.I.off(ProtoId.S2COfficeSignBreakStar_ID, this.onS2COfficeSignBreakStar, this);

        // 淬炼
        EventProto.I.off(ProtoId.S2COfficeSignRefine_ID, this.onS2COfficeSignRefine, this);
        // 淬炼突破
        EventProto.I.off(ProtoId.S2COfficeSignRefineBreak_ID, this.onS2COfficeSignRefineBreak, this);
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        //
    }

    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        //
    }

    /** 清理数据 */
    public clearAll(): void {
        //
    }

    /** 升级 */
    public upSealAmulet(type: number, auto: boolean): void {
        const d: C2SOfficeSignUp = {
            Type: type,
            AutoBuy: auto ? 1 : 0,
        };
        NetMgr.I.sendMessage(ProtoId.C2SOfficeSignUp_ID, d);
    }

    private onS2COfficeSignUp(data: S2COfficeSignUp): void {
        ModelMgr.I.SealAmuletModel.updateGrade(data);
    }

    /** 一键升级 */
    public autoUp(type: number, auto: boolean): void {
        const d: C2SOfficeSignAutoUp = {
            Type: type,
            AutoBuy: auto ? 1 : 0,
        };
        NetMgr.I.sendMessage(ProtoId.C2SOfficeSignAutoUp_ID, d);
    }

    private onS2COfficeSignAutoUp(data: S2COfficeSignAutoUp) {
        ModelMgr.I.SealAmuletModel.updateGrade(data);
    }

    /** 升星 */
    public upStarSealAmulet(type: number, auto: boolean): void {
        const d: C2SOfficeSignStar = {
            Type: type,
            AutoBuy: auto ? 1 : 0,
        };
        NetMgr.I.sendMessage(ProtoId.C2SOfficeSignStar_ID, d);
    }

    private onS2COfficeSignStar(data: S2COfficeSignStar) {
        ModelMgr.I.SealAmuletModel.updateStar(data);
    }

    /** 一键升星 */
    public autoStar(type: number, auto: boolean): void {
        const d: C2SOfficeSignAutoStar = {
            Type: type,
            AutoBuy: auto ? 1 : 0,
        };
        NetMgr.I.sendMessage(ProtoId.C2SOfficeSignAutoStar_ID, d);
    }

    private onS2COfficeSignAutoStar(data: S2COfficeSignAutoStar) {
        ModelMgr.I.SealAmuletModel.updateStar(data);
    }

    /** 升星突破 */
    public upStarBreak(type: number): void {
        const d: C2SOfficeSignBreakStar = {
            Type: type,
        };
        NetMgr.I.sendMessage(ProtoId.C2SOfficeSignBreakStar_ID, d);
    }

    private onS2COfficeSignBreakStar(data: S2COfficeSignBreakStar) {
        ModelMgr.I.SealAmuletModel.breakStar(data);
    }

    /** 淬炼 */
    public refinementSealAmulet(type: number, mustSuccess: boolean): void {
        const d: C2SOfficeSignRefine = {
            Type: type,
            IsUseItem: mustSuccess ? 1 : 0,
        };
        NetMgr.I.sendMessage(ProtoId.C2SOfficeSignRefine_ID, d);
    }

    private onS2COfficeSignRefine(data: S2COfficeSignRefine) {
        if (!data.IsOk) {
            MsgToastMgr.Show(i18n.tt(Lang.refinement_fail));
            return;
        }
        ModelMgr.I.SealAmuletModel.upQuality(data);
    }

    /** 淬炼突破 */
    public refinementBreak(type: number, mustSuccess: boolean): void {
        const d: C2SOfficeSignRefineBreak = {
            IsUseItem: mustSuccess ? 1 : 0,
            Type: type,
        };
        NetMgr.I.sendMessage(ProtoId.C2SOfficeSignRefineBreak_ID, d);
    }

    private onS2COfficeSignRefineBreak(data: S2COfficeSignRefineBreak) {
        ModelMgr.I.SealAmuletModel.breakQuality(data);
    }

    protected linkOpen?(tab: number, param1: any[] | undefined, ...args: any[]): boolean {
        if (param1 && param1.length > 0) {
            WinMgr.I.open(ViewConst.SealAmuletWin, tab, param1[0]);
        }
        return true;
    }
}
