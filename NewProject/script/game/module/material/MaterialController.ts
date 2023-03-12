/*
 * @Author: myl
 * @Date: 2022-08-03 20:30:21
 * @Description:
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';

const { ccclass, property } = cc._decorator;

@ccclass('MaterialController')
export class MaterialController extends BaseController {
    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab: number = 0, params: any[] = [0], ...args: any[]): boolean {
        if (UtilFunOpen.isOpen(FuncId.MaterialFB, true)) {
            WinMgr.I.open(ViewConst.MaterialWin, tab, params, ...args);
        }
        return true;
    }

    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        // 接收可挑战的列表
        EventProto.I.on(ProtoId.S2CMaterialListPush_ID, this.onS2CMaterialListPush, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CMaterialListPush_ID, this.onS2CMaterialListPush, this);
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

    public init(): void {
        //
    }

    /** 获取到挑战列表 */
    private onS2CMaterialListPush(data: S2CMaterialListPush): void {
        ModelMgr.I.MaterialModel.fbList = data.MaterialList;
        EventClient.I.emit(E.MaterialFuBen.MaterialUpdateUI);
    }

    /** 扫荡结果回调 */
    public sweepResult(): void {
        //
    }

    /** 一键扫荡副本 */
    public sweepAll(): void {
        const d = {};
        NetMgr.I.sendMessage(ProtoId.C2SMaterialSweepOneKey_ID, d);
    }

    /** 扫荡副本 */
    public sweep(mid: number): void {
        const d = {
            MaterialId: mid,
        };
        NetMgr.I.sendMessage(ProtoId.C2SMaterialSweep_ID, d);
    }

    /** 挑战副本 */
    public challengeFB(mid: number): void {
        const d: C2SMaterialChallenge = {
            MaterialId: mid,
        };
        NetMgr.I.sendMessage(ProtoId.C2SMaterialChallenge_ID, d);
    }

    /** 挑战结果回调 */
    public challengeResult(): void {
        //
    }

    /** vip购买单个副本次数 */
    public buyTimes(mid: number): void {
        // 设置可以刷新
        // this.isForceUpdateUI = true;
        const d = {
            MaterialId: mid,
        };
        NetMgr.I.sendMessage(ProtoId.C2SMaterialBuyTimes_ID, d);
    }

    /** vip购买所有副本一次 */
    public buyAllTimes(): void {
        // this.isForceUpdateUI = true;
        const d = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SMaterialBuyTimesOneKey_ID, d);
    }
}
