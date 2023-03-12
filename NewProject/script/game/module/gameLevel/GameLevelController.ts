/*
 * @Author: myl
 * @Date: 2022-09-14 12:07:55
 * @Description:
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { Config } from '../../base/config/Config';
import { ConfigStageIndexer } from '../../base/config/indexer/ConfigStageIndexer';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import TimerMgr from '../../manager/TimerMgr';
import { EBattleType } from '../battleResult/BattleResultConst';
import { RoleMgr } from '../role/RoleMgr';
import { EClientDataKey } from './GameLevelConst';

const { ccclass, property } = cc._decorator;

@ccclass('GameLevelController')
export class GameLevelController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CStageFight_ID, this.onS2CStageFight, this);
        EventProto.I.on(ProtoId.S2CSendClientData_ID, this.onS2CSendClientData, this);
        EventProto.I.on(ProtoId.S2CSaveClientData_ID, this.onS2CSaveClientData, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CStageFight_ID, this.onS2CStageFight, this);
        EventProto.I.off(ProtoId.S2CSendClientData_ID, this.onS2CSendClientData, this);
        EventProto.I.off(ProtoId.S2CSaveClientData_ID, this.onS2CSaveClientData, this);
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        /** 战斗结束监听 */
        EventClient.I.on(E.Battle.End, this.battleEnd, this);
    }
    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        EventClient.I.off(E.Battle.End, this.battleEnd, this);
    }
    /** 清理数据 */
    public clearAll(): void {
        //
    }

    private battleEnd(t: number) {
        if (t === EBattleType.GameLevelBoss) {
            // 用户关卡改变
            const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
            // 最新章节
            const newStage = indexer.getChapterInfo(RoleMgr.I.d.Stage).chapter;
            const model = ModelMgr.I.GameLevelModel;
            if (!model.autoFight && model.hisStage < newStage) {
                // 章节发生改变
                TimerMgr.I.setTimeout(() => {
                    EventClient.I.emit(E.Music.FightEnd);
                }, 4000);
            } else {
                EventClient.I.emit(E.Music.FightEnd);
            }
        } else {
            EventClient.I.emit(E.Music.FightEnd);
        }
    }

    /** ***********关卡相关********************* */
    /** * 挑战关卡 */
    public challengeGameLevel(): void {
        const d = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SStageFight_ID, d);
    }

    private onS2CStageFight(d: S2CStageFight): void {
        // 关卡挑战结果  不处理 通过关卡属性监听改变来更新界面(监听自动战斗处理)
        if (d.Win > 0) {
            // 胜利
            ModelMgr.I.GameLevelModel.curIsWin = true;
            if (ModelMgr.I.GameLevelModel.autoFight) {
                ModelMgr.I.NewPlotModel.autoFightWinHandler();
            }
        } else {
            // 失败 取消自动闯关
            ModelMgr.I.GameLevelModel.autoFight = false;
            ModelMgr.I.GameLevelModel.curIsWin = false;
        }
    }

    public C2SSaveClientData(key: EClientDataKey, value: string): void {
        const d = new C2SSaveClientData();
        d.Param.push({ K: key, V: value });
        NetMgr.I.sendMessage(ProtoId.C2SSaveClientData_ID, d);
    }

    private onS2CSaveClientData(d: S2CSaveClientData) {
        if (d.Tag === 0) {
            d.Param.forEach((v) => {
                ModelMgr.I.GameLevelModel.setClientData(v.K, v.V);
            });
        }
    }
    private onS2CSendClientData(d: S2CSendClientData) {
        d.Param.forEach((v) => {
            ModelMgr.I.GameLevelModel.setClientData(v.K, v.V);
        });
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        WinMgr.I.open(ViewConst.GameLevelWin, tab || 0);
        return true;
    }
}
