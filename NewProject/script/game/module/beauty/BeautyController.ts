/*
 * @Author: zs
 * @Date: 2022-10-27 18:42:10
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\beauty\BeautyController.ts
 * @Description:
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import { UtilBool } from '../../../app/base/utils/UtilBool';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { GradeTabIndex } from '../grade/GradeConst';
import { EBeautyIndexId } from './BeautyVoCfg';

const { ccclass } = cc._decorator;

@ccclass('BeautyController')
export class BeautyController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CBeautyInfo_ID, this.onS2CBeautyInfo, this);
        EventProto.I.on(ProtoId.S2CBeautyActive_ID, this.onS2CBeautyActive, this);
        EventProto.I.on(ProtoId.S2CBeautyLevelUp_ID, this.onS2CBeautyLevelUp, this);
        EventProto.I.on(ProtoId.S2CBeautyLevelUpAuto_ID, this.onS2CBeautyLevelUpAuto, this);
        EventProto.I.on(ProtoId.S2CBeautyStarUp_ID, this.onS2CBeautyStarUp, this);
    }
    public delNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.off(ProtoId.S2CBeautyInfo_ID, this.onS2CBeautyInfo, this);
        EventProto.I.off(ProtoId.S2CBeautyActive_ID, this.onS2CBeautyActive, this);
        EventProto.I.off(ProtoId.S2CBeautyLevelUp_ID, this.onS2CBeautyLevelUp, this);
        EventProto.I.off(ProtoId.S2CBeautyLevelUpAuto_ID, this.onS2CBeautyLevelUpAuto, this);
        EventProto.I.off(ProtoId.S2CBeautyStarUp_ID, this.onS2CBeautyStarUp, this);
    }
    public addClientEvent(): void {
        // throw new Error('Method not implemented.');
    }
    public delClientEvent(): void {
        // throw new Error('Method not implemented.');
    }
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }
    /**
     * 请求红颜信息
     */
    public C2SBeautyInfo(): void {
        NetMgr.I.sendMessage(ProtoId.C2SBeautyInfo_ID);
    }

    private onS2CBeautyInfo(d: S2CBeautyInfo) {
        if (d.Tag === 0) {
            ModelMgr.I.BeautyModel.onS2CBeautyInfo(d.BeautyList);
        }
    }

    /**
     * 激活红颜
     * @param id 红颜的唯一id
     */
    public C2SBeautyActive(id: number): void {
        const d = new C2SBeautyActive();
        d.BeautyId = id;
        NetMgr.I.sendMessage(ProtoId.C2SBeautyActive_ID, d);
    }

    private onS2CBeautyActive(d: S2CBeautyActive) {
        if (d.Tag === 0) {
            ModelMgr.I.BeautyModel.newActiveBeauty(d.BeautyId);
        }
    }

    /**
     * 红颜升级
     * @param id 红颜id
     * @param autoBuy 是否自动购买
     */
    public C2SBeautyLevelUp(id: number, autoBuy: boolean): void {
        const d = new C2SBeautyLevelUp();
        d.BeautyId = id;
        d.AutoBuy = autoBuy ? 1 : 0;
        NetMgr.I.sendMessage(ProtoId.C2SBeautyLevelUp_ID, d);
    }

    private onS2CBeautyLevelUp(d: S2CBeautyLevelUp) {
        if (d.Tag === 0) {
            ModelMgr.I.BeautyModel.updateBeautyExpLevel(d.Beauty.BeautyId, d.Beauty.LevelExp, d.Beauty.Level);
            EventClient.I.emit(E.Beauty.UpdateExpLevel, d.Beauty.BeautyId);
        }
    }

    /**
     * 红颜一键升级
     * @param id 红颜id
     * @param autoBuy 是否自动购买
     */
    public C2SBeautyLevelUpAuto(id: number, autoBuy: boolean): void {
        const d = new C2SBeautyLevelUpAuto();
        d.BeautyId = id;
        d.AutoBuy = autoBuy ? 1 : 0;
        NetMgr.I.sendMessage(ProtoId.C2SBeautyLevelUpAuto_ID, d);
    }

    private onS2CBeautyLevelUpAuto(d: S2CBeautyLevelUpAuto) {
        if (d.Tag === 0) {
            ModelMgr.I.BeautyModel.updateBeautyExpLevel(d.Beauty.BeautyId, d.Beauty.LevelExp, d.Beauty.Level);
            EventClient.I.emit(E.Beauty.UpdateExpLevel, d.Beauty.BeautyId);
        }
    }

    /**
     * 红颜升星
     * @param id 红颜id
     */
    public C2SBeautyStarUp(id: number): void {
        const d = new C2SBeautyStarUp();
        d.BeautyId = id;
        NetMgr.I.sendMessage(ProtoId.C2SBeautyStarUp_ID, d);
    }

    private onS2CBeautyStarUp(d: S2CBeautyStarUp) {
        if (d.Tag === 0) {
            ModelMgr.I.BeautyModel.updateBeautyStar(d.Beauty.BeautyId, d.Beauty.Star);
            EventClient.I.emit(E.Beauty.UpdateStar, d.Beauty.BeautyId);
        }
    }

    /**
     * 打开红颜界面
     * @param tabId 页签id
     * @param params 配置表参数
     * @param args 手动传参
     */
    public linkOpen(index?: number, params?: any[], args?: any[]): void {
        let tabId: number = 0;
        if (!UtilBool.isNullOrUndefined(index)) {
            switch (index) {
                case EBeautyIndexId.Grade:
                    tabId = FuncId.BeautyGrade;
                    break;
                default:
                    tabId = index;
                    break;
            }
        }
        if (UtilFunOpen.isOpen(FuncId.Beauty, true)) {
            WinMgr.I.open(ViewConst.BeautyWin, tabId, params, args);
        }
    }
}
