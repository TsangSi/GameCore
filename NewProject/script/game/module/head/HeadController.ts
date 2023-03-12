/*
 * @Author: myl
 * @Date: 2022-11-16 11:17:09
 * @Description:
 */

import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { HeadPhotoType } from './HeadConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeadController extends BaseController {
    public addNetEvent(): void {
        /** 请求头像列表数据返回 */
        EventProto.I.on(ProtoId.S2CHeadInfo_ID, this.onS2CHeadInfo, this);
        /** 激活返回 */
        // EventProto.I.on(ProtoId.S2CHeadActivate_ID, this.onS2CHeadActivate, this);
        // /** 升星返回 */
        // EventProto.I.on(ProtoId.S2CHeadUpStar_ID, this.onS2CHeadUpStar, this);
        // /** 使用返回 */
        // EventProto.I.on(ProtoId.S2CHeadUse_ID, this.onS2CHeadUse, this);
        /** 头像改变 */
        EventProto.I.on(ProtoId.S2CHeadUpdate_ID, this.onS2CHeadUpdate, this);
        // S2CHeadUpdate_ID
    }
    public delNetEvent(): void {
        /** 请求头像列表数据返回 */
        EventProto.I.off(ProtoId.S2CHeadInfo_ID, this.onS2CHeadInfo, this);
        /** 激活返回 */
        // EventProto.I.off(ProtoId.S2CHeadActivate_ID, this.onS2CHeadActivate, this);
        // /** 升星返回 */
        // EventProto.I.off(ProtoId.S2CHeadUpStar_ID, this.onS2CHeadUpStar, this);
        // /** 使用返回 */
        // EventProto.I.off(ProtoId.S2CHeadUse_ID, this.onS2CHeadUse, this);
        /** 头像改变 */
        EventProto.I.off(ProtoId.S2CHeadUpdate_ID, this.onS2CHeadUpdate, this);
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
     * 获取用户当前拥有的头像和头像框
     */
    public GetUserHeadHeadFrame(type: HeadPhotoType): void {
        const d: C2SHeadInfo = {
            HeadType: type,
        };
        NetMgr.I.sendMessage(ProtoId.C2SHeadInfo_ID, d);
    }

    /**
     * 头像头像框升星
     * @param id
     */
    public upStarHead(type: HeadPhotoType, id: number): void {
        const d: C2SHeadUpStar = {
            HeadType: type,
            HeadId: id,
        };
        NetMgr.I.sendMessage(ProtoId.C2SHeadUpStar_ID, d);
    }

    /**
     * 激活头像头像框
     * @param type
     * @param id
     */
    public activeHead(type: HeadPhotoType, id: number): void {
        const d: C2SHeadActivate = {
            HeadType: type,
            HeadId: id,
        };
        NetMgr.I.sendMessage(ProtoId.C2SHeadActivate_ID, d);
    }

    /**
     * 使用
     * @param type
     * @param id
     */
    public useHead(type: HeadPhotoType, id: number): void {
        const d: C2SHeadUse = {
            HeadType: type,
            HeadId: id,
        };
        NetMgr.I.sendMessage(ProtoId.C2SHeadUse_ID, d);
    }

    private onS2CHeadInfo(data: S2CHeadInfo): void {
        console.log('S2CHeadInfo-------', data);

        ModelMgr.I.HeadModel.setHeadData(data.HeadType, data.HeadList);
    }

    // private onS2CHeadActivate(data: S2CHeadActivate): void {
    //     //
    // }

    // private onS2CHeadUpStar(dat: S2CHeadUpStar): void {
    //     //
    // }

    // private onS2CHeadUse(data: S2CHeadUse): void {
    //     //
    // }

    // 信息发生改变返回
    private onS2CHeadUpdate(data: S2CHeadUpdate): void {
        ModelMgr.I.HeadModel.updateHeadData(data);
    }

    public linkOpen(tab: number): void {
        if (tab === HeadPhotoType.Head) {
            if (UtilFunOpen.isOpen(FuncId.Head, true)) {
                WinMgr.I.open(ViewConst.SettingWin, tab);
            }
        } else if (UtilFunOpen.isOpen(FuncId.HeadFrame, true)) {
            WinMgr.I.open(ViewConst.SettingWin, tab);
        }
    }
}
