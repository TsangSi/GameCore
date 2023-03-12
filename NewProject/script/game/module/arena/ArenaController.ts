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
import { RoleAN } from '../role/RoleAN';
import { RoleMgr } from '../role/RoleMgr';
import { EArenaTabId } from './ArenaConst';

const { ccclass, property } = cc._decorator;

@ccclass('ArenaController')
export class ArenaController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        /** 挑战玩家列表 */
        EventProto.I.on(ProtoId.S2CArenaList_ID, this.onS2CArenaList, this);
        /** 挑战 */
        EventProto.I.on(ProtoId.S2CArenaFight_ID, this.onS2CArenaFight, this);
        /** 扫荡 */
        EventProto.I.on(ProtoId.S2CArenaSweep_ID, this.onS2CArenaSweep, this);
        /** 购买竞技场次数 */
        EventProto.I.on(ProtoId.S2CArenaBuyTimes_ID, this.onS2CArenaBuyTimes, this);
        /** 排行榜 */
        EventProto.I.on(ProtoId.S2CGetArenaRankList_ID, this.onS2CGetArenaRankList, this);
        // 竞技场战斗次数
        RoleMgr.I.on(this.updateRed, this, RoleAN.N.ArenaTimes);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        /** 挑战玩家列表 */
        EventProto.I.off(ProtoId.S2CArenaList_ID, this.onS2CArenaList, this);
        /** 挑战 */
        EventProto.I.off(ProtoId.S2CArenaFight_ID, this.onS2CArenaFight, this);
        /** 扫荡 */
        EventProto.I.off(ProtoId.S2CArenaSweep_ID, this.onS2CArenaSweep, this);
        /** 购买竞技场次数 */
        EventProto.I.off(ProtoId.S2CArenaBuyTimes_ID, this.onS2CArenaBuyTimes, this);
        /** 排行榜 */
        EventProto.I.off(ProtoId.S2CGetArenaRankList_ID, this.onS2CGetArenaRankList, this);

        // 竞技场战斗次数
        RoleMgr.I.off(this.updateRed, this, RoleAN.N.ArenaTimes);
    }

    private updateRed() {
        ModelMgr.I.ArenaModel.updateRed();
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        //
    }

    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        //
    }

    public init(): void {
        //
    }
    /** 清理数据 */
    public clearAll(): void {
        //
    }

    /** 挑战一个玩家    */
    public fightPlayer(data: C2SArenaFight): void {
        const d: C2SArenaFight = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            TargetId: data.TargetId,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            TargetRank: data.TargetRank,
            // 是否是秒杀
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            Kill: data.Kill,
        };
        NetMgr.I.sendMessage(ProtoId.C2SArenaFight_ID, d);
    }

    /** 挑战结果 */
    private onS2CArenaFight(data: S2CArenaFight) {
        EventClient.I.emit(E.Arena.ArenaFightResult, data);
    }

    /** 获取挑战的玩家 */
    public C2SArenaList(): void {
        // 请求刷新数据
        const d: C2SArenaList = {};
        NetMgr.I.sendMessage(ProtoId.C2SArenaList_ID, d);
    }

    /** 获取挑战的玩家回调 */
    public onS2CArenaList(data: S2CArenaList): void {
        // 请求刷新数据
        EventClient.I.emit(E.Arena.RefreshChallengeData, data);
    }

    /** 获取排行榜数据 */
    public getRankList(): void {
        const d: C2SArenaList = {};
        NetMgr.I.sendMessage(ProtoId.C2SGetArenaRankList_ID, d);
    }

    /** 获取排行榜数据回调 */
    public onS2CGetArenaRankList(data: S2CGetArenaRankList): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ModelMgr.I.ArenaModel.rankListData = data.Ranks;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ModelMgr.I.ArenaModel.myRank = data.MyRank;
        EventClient.I.emit(E.Arena.RankList);
    }

    /** 购买竞技场挑战次数 */
    public buyTimes(): void {
        const d: C2SArenaBuyTimes = {};
        NetMgr.I.sendMessage(ProtoId.C2SArenaBuyTimes_ID, d);
    }

    /** 购买次数回调 */
    private onS2CArenaBuyTimes(data: S2CArenaBuyTimes): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.Tag === 0) {
            // 购买成功
            EventClient.I.emit(E.Arena.ArenaBuyTimes);
        } else {
            // MsgToastMgr.Show(i18n.tt(Lang.arena_buy_fail));
        }
    }

    /** 扫荡 */
    public sweep(): void {
        const d: C2SArenaSweep = {

        };
        NetMgr.I.sendMessage(ProtoId.C2SArenaSweep_ID, d);
    }
    /** 扫荡回调 */
    private onS2CArenaSweep(data: S2CArenaSweep) {
        if (data.Tag === 0) {
            //
        } else {
            // MsgToastMgr.Show(i18n.tt(Lang.arena_challenge_time_unenough));
        }
        EventClient.I.emit(E.Arena.SweepResult);
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: EArenaTabId, params?: any[], ...args: any[]): boolean {
        if (UtilFunOpen.isOpen(FuncId.Arena, true)) {
            WinMgr.I.open(ViewConst.ArenaWin, tab);
        }
        // WinMgr.I.open(ViewConst.ArenaWin);
        return true;
    }
}
