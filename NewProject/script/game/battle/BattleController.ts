/*
 * @Author: hrd
 * @Date: 2022-07-21 16:16:30
 * @FilePath: \SanGuo2.4-main\assets\script\game\battle\BattleController.ts
 * @Description:
 *
 */

import { EventClient } from '../../app/base/event/EventClient';
import { EventProto } from '../../app/base/event/EventProto';
import BaseController from '../../app/core/mvc/controller/BaseController';
import { E } from '../const/EventName';
import NetMgr from '../manager/NetMgr';
import { BattleMgr } from './BattleMgr';
import { B } from './test/BattleTestData';

const { ccclass } = cc._decorator;
@ccclass('BattleController')
export default class BattleController extends BaseController {
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CBattlefieldReport_ID, this.onS2CBattlefieldReport, this);
        EventProto.I.on(ProtoId.S2CNoticeFightStateRep_ID, this.onS2CNoticeFightStateRep, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CBattlefieldReport_ID, this.onS2CBattlefieldReport, this);
        EventProto.I.off(ProtoId.S2CNoticeFightStateRep_ID, this.onS2CNoticeFightStateRep, this);
    }
    public addClientEvent(): void {
        // throw new Error('Method not implemented.');
        EventClient.I.on(E.Battle.Test, this.onTestBattle, this);
        EventClient.I.on(E.Battle.PlayReport, this.onS2CBattlefieldReport, this);
    }
    public delClientEvent(): void {
        // throw new Error('Method not implemented.');
        EventClient.I.off(E.Battle.Test, this.onTestBattle, this);
        EventClient.I.off(E.Battle.PlayReport, this.onS2CBattlefieldReport, this);
    }
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    /**
     * 通知战斗状态
     * @param state /0 结束 1 开始
     */
    public reqC2SNoticeFightStateReq(state: number): void {
        const d = new C2SNoticeFightStateReq();
        d.State = state;
        NetMgr.I.sendMessage(ProtoId.C2SNoticeFightStateReq_ID, d);
    }

    /**
     * 通知战斗状态回包
     */
    private onS2CNoticeFightStateRep(d: S2CNoticeFightStateRep): void {
        //
    }

    /** 返回战报 */
    private onS2CBattlefieldReport(d: S2CBattlefieldReport) {
        // if (!d) return;
        BattleMgr.ShowBattleScene(d);
    }
    /** 战斗奖励广播 */
    private onS2CPrizeReport(d: S2CPrizeReport) {
        //
    }

    private onTestBattle(data: unknown) {
        let d: S2CBattlefieldReport = null;
        if (!data) {
            d = B as unknown as S2CBattlefieldReport;
        } else {
            d = this.createTestDate(data);
        }

        this.onS2CBattlefieldReport(d);
    }

    public tryEnterFight(protoId: number, data?: any): void {
        NetMgr.I.sendMessage(protoId, data);
    }

    /** 创建测试战报 */
    private createTestDate(data: unknown): S2CBattlefieldReport {
        const d = new S2CBattlefieldReport(data);
        const u = [];
        for (let i = 0; i < d.U.length; i++) {
            const n = d.U[i];
            u.push(new FightUnit(n));
        }
        d.U = u;

        const fs = [];

        const func = (f: FightStep): FightStep => {
            f = new FightStep(f);
            const arr: FightStep[] = [];
            while (f.FS.length > 0) {
                const n = f.FS.shift();
                arr.push(func(n));
            }
            f.FS = arr;
            return f;
        };

        for (let i = 0; i < d.FS.length; i++) {
            const n = d.FS[i];
            const f = func(n);
            fs.push(f);
        }
        d.FS = fs;
        return d;
    }
}
