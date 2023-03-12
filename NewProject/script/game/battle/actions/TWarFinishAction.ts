/*
 * @Author: hrd
 * @Date: 2022-06-28 11:13:56
 * @FilePath: \SanGuo\assets\script\game\battle\actions\TWarFinishAction.ts
 * @Description:
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import ModelMgr from '../../manager/ModelMgr';
import { BattleMgr } from '../BattleMgr';
import { ActionBase } from './base/ActionBase';

class TWarFinishActionBase extends ActionBase {
    public ret: number = 0;
    public mWin: number;
    public mData: S2CBattlefieldReport;
    public constructor(data: S2CBattlefieldReport) {
        super();
        this.mWin = data.Win;
        this.mData = data;
    }
    public doExecute() {
        super.doExecute();
        console.log('======战斗结束====');
    }
}

/** 常规战斗结束 */
export class TWarDefaultFinishData extends TWarFinishActionBase {
    public star: number = null;

    public static Create(data: S2CBattlefieldReport): TWarDefaultFinishData {
        const action = new TWarDefaultFinishData(data);
        return action;
    }

    public doExecute(): void {
        super.doExecute();
        const count = BattleMgr.I.getNextFightDataCount();
        const fbType = BattleMgr.I.curBattleType;
        BattleMgr.I.exitCurWar();
        if (count > 0) {
            // 存在连续战报 不播放战斗结算
            return;
        }
        let data = ModelMgr.I.BattleResultModel.getBattlePrizeReport(this.mData.Idx);
        if (data) {
            EventClient.I.emit(E.BattleResult.OpenView, data);
            return;
        }

        data = new S2CPrizeReport();
        data.FBType = fbType;
        data.Items = [];
        data.Star = this.mWin;
        // 胜利
        if (this.mWin > 0) {
            data.Type = 1;
        } else {
            // 失败
            data.Type = 2;
        }
        EventClient.I.emit(E.BattleResult.OpenView, data);
    }
}
