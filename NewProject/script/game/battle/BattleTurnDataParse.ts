/* eslint-disable no-tabs */
/*
 * @Author: hrd
 * @Date: 2022-06-26 01:05:46
 * @FilePath: \SanGuo\assets\script\game\battle\BattleTurnDataParse.ts
 * @Description:
 *
 */

import { ActionBase } from './actions/base/ActionBase';
import { UnitDelayAction } from './actions/base/UnitDelayAction';
import { TAtkAction } from './actions/turn/TAtkAction';
import { TBuffAction } from './actions/turn/TBuffAction';
import { TDamageBaseAction } from './actions/turn/TDamageBaseAction';
import { THitAction } from './actions/turn/THitAction';
import { TUserSkillAction } from './actions/turn/TUserSkillAction';
import { ActionType, AtkTimeKey } from './WarConst';
import { UtilBattle } from './util/UtilBattle';
import { TDieAction } from './actions/turn/TDieAction';

// 战斗数据解析
export class BattleTurnDataParse {
    /** 格式化战斗步骤 根据回合id 保存为二维数组 */
    public static FormatFightStepDataByTurn(fightData: S2CBattlefieldReport): FightStep[][] {
        const turnStepDatas: FightStep[][] = [];
        if (!fightData) return turnStepDatas;
        let curTurnIdx: number = 0;
        let maxTurn: number = 0;
        // turnStepDatas[0] = []; // 第0回合播放 开始战斗效果行为。
        for (let i = 0; i < fightData.FS.length; i++) {
            const step = fightData.FS[i];
            if (curTurnIdx !== step.R - 1) {
                curTurnIdx = step.R - 1;
            }
            if (!turnStepDatas[curTurnIdx]) turnStepDatas[curTurnIdx] = [];
            turnStepDatas[curTurnIdx].push(step);
        }
        maxTurn = curTurnIdx + 1;
        return turnStepDatas;
    }

    /** 解析战斗步骤 */
    public static ParseFightData(fightData: S2CBattlefieldReport): ActionBase[][] {
        const turnStepDatas = this.FormatFightStepDataByTurn(fightData);
        // const turnStepDatas = fightData.FS;
        const maxTurn: number = turnStepDatas.length; // 最大回合数 默认从1开始
        const turnDatas: ActionBase[][] = [];

        for (let i = 0; i < maxTurn; i++) {
            const curTurn = i; // 当前回合 这里从0 开始。默认存放开始战斗效果行为
            const turnArr = turnStepDatas[i]; // 单回合数据
            const action_list: ActionBase[] = [];

            for (let j = 0; j < turnArr.length; j++) {
                const step: FightStep = turnArr[j];
                const action = BattleTurnDataParse.ParseFightStep(step);
                action_list.push(action);
            }

            // 回合间隔时间
            const time = UtilBattle.I.getFightAtkTime(AtkTimeKey.TurnDeltaTime);
            const act = UnitDelayAction.Create(time);
            action_list.push(act);

            turnDatas[curTurn] = action_list;
        }
        // turnDatas[0] = [UnitFuncAction.Create(() => {
        //     console.log('开始回合=--====dong====');
        // }, 500)];
        return turnDatas;
    }

    /** 解析单个战斗步骤 */
    public static ParseFightStep(step: FightStep): ActionBase {
        const action = this.ParseStepData(step);
        return action;
    }

    public static ParseStepData(step: FightStep, skillActionId?: number): ActionBase {
        let action: ActionBase = null;

        if (step.AT === ActionType.Skill) {
            action = TUserSkillAction.Create(step);
        } else if (step.AT === ActionType.ATK) {
            action = TAtkAction.Create(step, skillActionId);
        } else if (step.AT === ActionType.Buff) {
            action = TBuffAction.Create(step);
        } else if (step.AT === ActionType.Hit) {
            action = THitAction.Create(step, skillActionId);
        } else if (step.AT === ActionType.Damage) {
            action = TDamageBaseAction.Create(step);
        } else if (step.AT === ActionType.Die) {
            action = TDieAction.Create(step);
        }
        return action;
    }

    public static ParseDatas(datas: FightStep[], skillActionId?: number): ActionBase[] {
        if (!datas) {
            return null;
        }
        const list: ActionBase[] = [];
        for (const data of datas) {
            const item = this.ParseStepData(data, skillActionId);
            if (item) {
                list.push(item);
            }
        }
        return list;
    }
}
