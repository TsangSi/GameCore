/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-07-01 20:07:45
 * @FilePath: \SanGuo2.4\assets\script\game\base\main\GameController.ts
 * @Description: 游戏常规性协议数据处理。如开服天数、服务器时间、功能开启的协议
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import { E } from '../../const/EventName';
import NetMgr from '../../manager/NetMgr';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import UtilFunOpen from '../utils/UtilFunOpen';
import ModelMgr from '../../manager/ModelMgr';

const { ccclass } = cc._decorator;
@ccclass('GameController')
export default class GameController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CGetAreaOpenDay_ID, this.onS2CGetAreaOpenDay, this);
        EventProto.I.on(ProtoId.S2CSendFuncOpenData_ID, this.onS2CSendFuncOpenData, this);
        EventProto.I.on(ProtoId.S2CUpdateFuncOpen_ID, this.onS2CUpdateFuncOpen, this);
        EventProto.I.on(ProtoId.S2COpenFuncRed_ID, this.onS2COpenFuncRed, this);
    }

    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CGetAreaOpenDay_ID, this.onS2CGetAreaOpenDay, this);
        EventProto.I.off(ProtoId.S2CSendFuncOpenData_ID, this.onS2CSendFuncOpenData, this);
        EventProto.I.off(ProtoId.S2CUpdateFuncOpen_ID, this.onS2CUpdateFuncOpen, this);
        EventProto.I.off(ProtoId.S2COpenFuncRed_ID, this.onS2COpenFuncRed, this);
    }

    /** 事件监听 */
    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.reqServerMsg, this);
    }

    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.reqServerMsg, this);
    }

    public clearAll(): void {
        // console.log('clearAll');
    }

    public reqServerMsg(): void {
        NetMgr.I.sendMessage(ProtoId.C2SGetAreaOpenDay_ID, {});
    }

    /** 同步服务器时间 */
    private _preTime: number = 0;
    private onS2CGetAreaOpenDay(data: S2CGetAreaOpenDay) {
        UtilTime.SyncServerTime(data);
        UtilFunOpen.serverDays = data.Days;
        if (this._preTime) {
            if (!UtilTime.IsSameDay(new Date(this._preTime), new Date(data.ServerTime))) {
                EventClient.I.emit(E.Game.DayChange);
            }
        }
        this._preTime = data.ServerTime;
    }

    /** 功能开启 */
    private onS2CSendFuncOpenData(data: S2CSendFuncOpenData) {
        /** 已经开启功能 */
        UtilFunOpen.SetServerOpen(data.OpenFuncData);
        /** 已经开启并且使用过的功能 */
        UtilFunOpen.SetFuncRedList(data.OpenFuncRedList);
        /** 已经领取的功能id（功能预告） */
        ModelMgr.I.FuncPreviewModel.setFuncGot(data.FuncPreviewList);
    }

    /** 功能开启更新 */
    private onS2CUpdateFuncOpen(data: S2CUpdateFuncOpen) {
        /** 更新已开放的功能id */
        UtilFunOpen.UptServerOpen(data.OpenFuncData);
        // 更新 功能红点处理
        UtilFunOpen.UpdFuncRedList();
    }

    /** 使用功能 (功能红点) */
    public useFunc(funcId: number): void {
        const d: C2SOpenFuncRed = {
            FuncId: funcId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SOpenFuncRed_ID, d);
    }

    /** 使用功能 */
    private onS2COpenFuncRed(data: S2COpenFuncRed) {
        if (data.Tag === 0) {
            UtilFunOpen.addFuncRed(data.FuncId);
        }
    }
}
