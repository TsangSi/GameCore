/*
 * @Author: wangxin
 * @Date: 2022-10-11 10:44:35
 * @FilePath: \SanGuo2.4\assets\script\game\module\rankList\RankListController.ts
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import NetMgr from '../../manager/NetMgr';

const { ccclass } = cc._decorator;

@ccclass('RankListController')
export class RankListController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        //
        EventProto.I.on(ProtoId.S2CGetRankData_ID, this.onGetRankData, this);
        EventProto.I.on(ProtoId.S2CRankWorship_ID, this.onRankWorship, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CGetRankData_ID, this.onGetRankData, this);
        EventProto.I.off(ProtoId.S2CRankWorship_ID, this.onRankWorship, this);
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        //
    }

    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        //
    }

    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        if (params && params[0]) {
            WinMgr.I.open(ViewConst.RankListWin, tab, params[0]);
        } else {
            WinMgr.I.open(ViewConst.RankListWin, tab);
        }
        return true;
    }

    // 获取排行榜数据返回
    private onGetRankData(data: S2CGetRankData): void {
        if (!data.Tag) {
            // this.setRankData(data.FullData);
            EventClient.I.emit(E.Rank.GameLevelRank, data);
        } else {
            MsgToastMgr.Show(`排行榜数据异常：${data.Tag}`);
        }
    }

    private onRankWorship(data: S2CRankWorship): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!data.Tag) {
            console.log('今日膜拜', data);
            EventClient.I.emit(E.Rank.Workshio, data);
        }
    }

    /**
     * 请求排行榜数据
     * 关卡传 1 和 2557 , 等级传 1 和 2524
     * @param RankType number 排行榜类型
     * @param Param
     */
    public getRankData(RankType: number, Param: number): void {
        const d: C2SGetRankData = {
            RankType,
            Param,
        };
        NetMgr.I.sendMessage(ProtoId.C2SGetRankData_ID, d);
    }

    /** 请求膜拜 */
    public getRankWorship(Type: number): void {
        const d: C2SRankWorship = {
            Type,
        };
        NetMgr.I.sendMessage(ProtoId.C2SRankWorship_ID, d);
    }

    /** 清理数据 */
    public clearAll(): void {
        //
    }
}
