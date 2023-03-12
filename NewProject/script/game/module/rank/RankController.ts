/*
 * @Author: myl
 * @Date: 2022-09-20 09:58:55
 * @Description:
 */
/** import {' cc._decorator, cc.Component, cc.Node } 'from 'cc';  //*/
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { E } from '../../const/EventName';
import NetMgr from '../../manager/NetMgr';

const { ccclass, property } = cc._decorator;

@ccclass('RankController')
export class RankController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        //
        EventProto.I.on(ProtoId.S2CGetRankData_ID, this.onGetRankData, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CGetRankData_ID, this.onGetRankData, this);
    }

    // 获取排行榜数据返回
    private onGetRankData(data: S2CGetRankData): void {
        if (!data.Tag) {
            console.log('排行榜数据', data);
            // this.setRankData(data.FullData);
            EventClient.I.emit(E.Rank.GameLevelRank, data.FullData);
        } else {
            MsgToastMgr.Show(`排行榜数据异常：${data.Tag}`);
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
}
