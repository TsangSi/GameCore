import { BattleManager } from '../../gamelogic/scripts/battle/BattleManager';
import { EventM } from '../common/EventManager';
import { ServerMonitor } from '../common/ServerMonitor';
import { UI_NAME } from '../ui/UIConfig';
import UIManager from '../ui/UIManager';
import SceneMapManager from './SceneMapManager';

export class SceneN {
    private static _I: SceneN = null;
    static get I(): SceneN {
        if (this._I == null) {
            this._I = new SceneN();
        }
        return this._I;
    }

    init() {
        ServerMonitor.I.proxyOn(ProtoId.S2CChangeMap_ID, this.S2CChangeMap, this);
        ServerMonitor.I.proxyOn(ProtoId.S2CBattlefieldReport_ID, this.S2CBattlefieldReport, this);
        ServerMonitor.I.proxyOn(ProtoId.S2CPrizeReport_ID, this.S2CPrizeReport, this);
    }

    fini() {
        ServerMonitor.I.proxyOff(ProtoId.S2CChangeMap_ID, this.S2CChangeMap, this);
        ServerMonitor.I.proxyOff(ProtoId.S2CBattlefieldReport_ID, this.S2CBattlefieldReport, this);
        ServerMonitor.I.proxyOff(ProtoId.S2CPrizeReport_ID, this.S2CPrizeReport, this);
    }

    /** 请求阶段战斗 */
    C2SStageFight() {
        ServerMonitor.I.post(ProtoId.C2SStageFight_ID);
    }

    /** 收到切换地图 */
    S2CChangeMap(data: S2CChangeMap) {
        SceneMapManager.I.enterMap(data);
    }

    /** 收到战报 */
    S2CBattlefieldReport(data: S2CBattlefieldReport) {
        // console.log('data=', data);
        // console.log('JSON.stringify(fightData)=', JSON.stringify(data));
        EventM.I.fire(EventM.Type.Player.UpdateFightStatus, true);
        UIManager.I.show(UI_NAME.Battle, undefined, { fightData: data });
    }

    /** 通知后端开始战斗 */
    C2SFightContinue() {
        ServerMonitor.I.post(ProtoId.C2SFightContinue_ID);
    }

    /** 收到战斗奖励 */
    S2CPrizeReport(d: S2CPrizeReport) {
        EventM.I.fire(EventM.Type.Battle.BattleReward, d);
    }

    /** 请求退出奇遇 */
    C2SActLuckLeave() {
        ServerMonitor.I.post(ProtoId.C2SActLuckLeave_ID);
    }

    /** 请求结束战斗 */
    C2SEndFight(index: number) {
        const d = new C2SEndFight();
        d.Idx = index;
        ServerMonitor.I.post(ProtoId.C2SEndFight_ID, d);
    }
}
