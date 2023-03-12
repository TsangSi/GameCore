/*
 * @Author: zs
 * @Date: 2022-07-12 16:40:20
 * @FilePath: \SanGuo\assets\script\game\module\roleskin\RoleSkinController.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { Config } from '../../base/config/Config';
import { ConfigRoleSkinIndexer } from '../../base/config/indexer/ConfigRoleSkinIndexer';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { ERoleSkinPageIndex } from './v/RoleSkinConst';

const { ccclass, property } = cc._decorator;
@ccclass('RoleSkinController')
export class RoleSkinController extends BaseController {
    public addNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.on(ProtoId.S2CRoleSkinInfo_ID, this.onS2CRoleSkinInfo, this);
        EventProto.I.on(ProtoId.S2CRoleSkinActive_ID, this.onS2CRoleSkinActive, this);
        EventProto.I.on(ProtoId.S2CRoleSkinRiseStar_ID, this.onS2CRoleSkinRiseStar, this);
        EventProto.I.on(ProtoId.S2CRoleSkinWearOrRemove_ID, this.onS2CRoleSkinWearOrRemove, this);
        EventProto.I.on(ProtoId.S2CSuitWearOrRemove_ID, this.onS2CSuitWearOrRemove, this);

        EventProto.I.on(ProtoId.S2CSuitActive_ID, this.onS2CSuitActive, this);
        EventProto.I.on(ProtoId.S2CSuitInfo_ID, this.onS2CSuitInfo, this);

        EventProto.I.on(ProtoId.S2CRoleSkinSoulLevel_ID, this.onS2CRoleSkinSoulLevel, this);
        EventProto.I.on(ProtoId.S2CRoleSkinGodNum_ID, this.onS2CRoleSkinGodNum, this);
    }
    public delNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.off(ProtoId.S2CRoleSkinInfo_ID, this.onS2CRoleSkinInfo, this);
        EventProto.I.off(ProtoId.S2CRoleSkinActive_ID, this.onS2CRoleSkinActive, this);
        EventProto.I.off(ProtoId.S2CRoleSkinRiseStar_ID, this.onS2CRoleSkinRiseStar, this);
        EventProto.I.off(ProtoId.S2CRoleSkinWearOrRemove_ID, this.onS2CRoleSkinWearOrRemove, this);
        EventProto.I.off(ProtoId.S2CSuitWearOrRemove_ID, this.onS2CSuitWearOrRemove, this);

        EventProto.I.off(ProtoId.S2CSuitActive_ID, this.onS2CSuitActive, this);
        EventProto.I.off(ProtoId.S2CSuitInfo_ID, this.onS2CSuitInfo, this);

        EventProto.I.off(ProtoId.S2CRoleSkinSoulLevel_ID, this.onS2CRoleSkinSoulLevel, this);
        EventProto.I.off(ProtoId.S2CRoleSkinGodNum_ID, this.onS2CRoleSkinGodNum, this);
    }
    public addClientEvent(): void {
        // ModelMgr.I.RoleSkinModel.do();
        EventClient.I.on(E.Game.Start, this.onLoginReq, this);
    }
    private onLoginReq(): void {
        this.C2SRoleSkinInfo();
        this.C2SSuitInfo();
    }
    public delClientEvent(): void {
        // throw new Error('Method not implemented.');
        EventClient.I.off(E.Game.Start, this.onLoginReq, this);
    }
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }
    /** 请求角色皮肤信息 */
    public C2SRoleSkinInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2SRoleSkinInfo_ID);
    }

    /** 角色皮肤信息 */
    private onS2CRoleSkinInfo(d: S2CRoleSkinInfo) {
        if (d.Tag === 0) {
            ModelMgr.I.RoleSkinModel.setSkinInfo(d);
        }
    }

    /**
     * 请求激活皮肤
     * @param skinId 皮肤id
     */
    public C2SRoleSkinActive(skinId: number): void {
        const d = new C2SRoleSkinActive();
        d.SkinId = skinId;
        NetMgr.I.sendMessage(ProtoId.C2SRoleSkinActive_ID, d);
    }

    private onS2CRoleSkinActive(d: S2CRoleSkinActive) {
        if (d.Tag === 0) {
            ModelMgr.I.RoleSkinModel.newAddSkin(d.SkinId);
        }
    }
    /**
     * 请求升星皮肤
     * @param skinId 皮肤id
     */
    public C2SRoleSkinRiseStar(skinId: number): void {
        const d = new C2SRoleSkinRiseStar();
        d.SkinId = skinId;
        NetMgr.I.sendMessage(ProtoId.C2SRoleSkinRiseStar_ID, d);
    }

    private onS2CRoleSkinRiseStar(d: S2CRoleSkinRiseStar) {
        if (d.Tag === 0) {
            ModelMgr.I.RoleSkinModel.setSkinStar(d.SkinId, d.Star);
        }
    }

    /** 请求幻化/卸下皮肤 */
    public C2SRoleSkinWearOrRemove(id: number): void {
        const d = new C2SRoleSkinWearOrRemove();
        d.WearOrRemoveId = id;
        NetMgr.I.sendMessage(ProtoId.C2SRoleSkinWearOrRemove_ID, d);
    }

    private onS2CRoleSkinWearOrRemove(d: S2CRoleSkinWearOrRemove) {
        if (d.Tag === 0) {
            //
        }
    }

    /** 请求幻化/卸下皮肤 */
    public C2SSuitWearOrRemove(id: number): void {
        const d = new C2SSuitWearOrRemove();
        d.Id = id;
        NetMgr.I.sendMessage(ProtoId.C2SSuitWearOrRemove_ID, d);
    }

    private onS2CSuitWearOrRemove(d: S2CSuitWearOrRemove) {
        if (d.Tag === 0) {
            //
        }
    }

    /** 请求套装信息 */
    public C2SSuitInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2SSuitInfo_ID);
    }

    private onS2CSuitInfo(d: S2CSuitInfo) {
        if (d.Tag === 0) {
            ModelMgr.I.RoleSkinModel.setSuitInfo(d.Data);
        }
    }
    /**
     * 请求激活套装
     * @param id 套装id
     * @param num 套装数量
     */
    public C2SSuitActive(id: number, num: number): void {
        const d = new C2SSuitActive();
        d.Id = id;
        d.Num = num;
        NetMgr.I.sendMessage(ProtoId.C2SSuitActive_ID, d);
    }

    private onS2CSuitActive(d: S2CSuitActive) {
        if (d.Tag === 0) {
            ModelMgr.I.RoleSkinModel.newActiveSuitNum(d.Id, d.Num);
        }
    }

    /** 请求注灵 */
    public C2SRoleSkinSoulLevel(): void {
        const d = new C2SRoleSkinSoulLevel();
        NetMgr.I.sendMessage(ProtoId.C2SRoleSkinSoulLevel_ID, d);
    }

    private onS2CRoleSkinSoulLevel(d: S2CRoleSkinSoulLevel) {
        if (d.Tag === 0) {
            ModelMgr.I.RoleSkinModel.updateSoulResult(d.SoulLevel, d.SoulValue);
        }
    }

    /** 请求炼神 */
    public C2SRoleSkinGodNum(): void {
        const d = new C2SRoleSkinGodNum();
        NetMgr.I.sendMessage(ProtoId.C2SRoleSkinGodNum_ID, d);
    }

    private onS2CRoleSkinGodNum(d: S2CRoleSkinGodNum) {
        if (d.Tag === 0) {
            ModelMgr.I.RoleSkinModel.updateGodNumResult(d.GodNum);
        }
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param id 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: ERoleSkinPageIndex, params?: any[], id?: number): boolean {
        if (UtilFunOpen.isOpen(FuncId.Skin, true)) {
            WinMgr.I.open(ViewConst.RoleSkinWin, tab, id);
        }
        return true;
    }

    /**
     * 根据皮肤id跳转角色时装入口
     * @param skinId 则皮肤id
     * @returns
     */
    public linkOpenBySkinId(skinId: number): boolean {
        const suitId = ModelMgr.I.RoleSkinModel.getSuitId(skinId);
        if (suitId) {
            const type: number = Config.Get<ConfigRoleSkinIndexer>(Config.Type.Cfg_RoleSkin).getSkinSuitValueByKey(suitId, 'Type');
            return this.linkOpen(type, undefined, suitId);
        }
        return false;
    }
}
