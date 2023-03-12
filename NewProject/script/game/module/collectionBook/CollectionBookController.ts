/*
 * @Author: zs
 * @Date: 2022-12-02 11:53:56
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\CollectionBookController.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';

const { ccclass, property } = cc._decorator;

@ccclass('CollectionBookController')
export default class CollectionBookController extends BaseController {
    public addNetEvent(): void {
        // throw new Error('Method not implemented.');
        EventProto.I.on(ProtoId.S2CCollectionBookAllData_ID, this.onS2CCollectionBookAllData, this);
        EventProto.I.on(ProtoId.S2CCollectionBookUpdate_ID, this.onS2CCollectionBookUpdate, this);
        EventProto.I.on(ProtoId.S2CCollectionBookActive_ID, this.onS2CCollectionBookActive, this);
        EventProto.I.on(ProtoId.S2CCollectionBookStarUp_ID, this.onS2CCollectionBookStarUp, this);
        EventProto.I.on(ProtoId.S2CCollectionBookTask_ID, this.onS2CCollectionBookTask, this);
        EventProto.I.on(ProtoId.S2CCollectionBookLook_ID, this.onS2CCollectionBookLook, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CCollectionBookAllData_ID, this.onS2CCollectionBookAllData, this);
        EventProto.I.off(ProtoId.S2CCollectionBookUpdate_ID, this.onS2CCollectionBookUpdate, this);
        EventProto.I.off(ProtoId.S2CCollectionBookActive_ID, this.onS2CCollectionBookActive, this);
        EventProto.I.off(ProtoId.S2CCollectionBookStarUp_ID, this.onS2CCollectionBookStarUp, this);
        EventProto.I.off(ProtoId.S2CCollectionBookTask_ID, this.onS2CCollectionBookTask, this);
        EventProto.I.off(ProtoId.S2CCollectionBookLook_ID, this.onS2CCollectionBookLook, this);
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

    /** 博物志-下发数据 */
    private onS2CCollectionBookAllData(d: S2CCollectionBookAllData) {
        ModelMgr.I.CollectionBookModel.setData(d);
    }

    /** 博物志-更新数据 */
    private onS2CCollectionBookUpdate(d: S2CCollectionBookUpdate) {
        ModelMgr.I.CollectionBookModel.updateData(d);
    }

    /** 博物志-激活 */
    public C2SCollectionBookActive(id: number): void {
        const d = new C2SCollectionBookActive();
        d.Id = id;
        NetMgr.I.sendMessage(ProtoId.C2SCollectionBookActive_ID, d);
    }

    private onS2CCollectionBookActive(d: S2CCollectionBookActive) {
        if (d.Tag === 0) {
            EventClient.I.emit(E.CollectionBook.NewActive);
            MsgToastMgr.Show(i18n.tt(Lang.collectionbook_active_success));
        }
    }

    /** 博物志-升星 */
    public C2SCollectionBookStarUp(id: number): void {
        const d = new C2SCollectionBookStarUp();
        d.Id = id;
        NetMgr.I.sendMessage(ProtoId.C2SCollectionBookStarUp_ID, d);
    }

    private onS2CCollectionBookStarUp(d: S2CCollectionBookStarUp) {
        if (d.Tag === 0) {
            EventClient.I.emit(E.CollectionBook.UpdateStar);
            MsgToastMgr.Show(i18n.tt(Lang.collectionbook_upstar_success));
        }
    }

    /**
     * 请求任务奖励
     * @param taskId 任务id
     */
    public C2SCollectionBookTask(taskId: number): void {
        const d = new C2SCollectionBookTask();
        d.TaskId = taskId;
        NetMgr.I.sendMessage(ProtoId.C2SCollectionBookTask_ID, d);
    }

    private onS2CCollectionBookTask(d: S2CCollectionBookTask) {
        if (d.Tag === 0) {
            ModelMgr.I.CollectionBookModel.updateTask(d.TaskId, d.NewTaskId);
        }
    }

    /**
     * 请求查看生涯图鉴
     * @param id 唯一id
     */
    public C2SCollectionBookLook(id: number): void {
        const d = new C2SCollectionBookLook();
        d.Id = id;
        NetMgr.I.sendMessage(ProtoId.C2SCollectionBookLook_ID, d);
    }

    private onS2CCollectionBookLook(d: S2CCollectionBookLook) {
        if (d.Tag === 0) {
            EventClient.I.emit(E.CollectionBook.UpdateCareer);
        }
    }

    public linkOpen(tab?: number, params?: any[], ...exParams: any[]): void {
        WinMgr.I.open(ViewConst.CollectionBookWin, tab, exParams);
    }
}
