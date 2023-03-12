/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-len */
/*
 * @Author: wangxin
 * @Date: 2022-09-28 21:20:27
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\module\DaySign\DaySignModel.ts
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import BaseModel from '../../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../../base/config/Config';
import { E } from '../../../../const/EventName';
import ModelMgr from '../../../../manager/ModelMgr';

const { ccclass } = cc._decorator;

@ccclass('DaySignModel')
export class DaySignModel extends BaseModel {
    private _PlayerSignInUIData: { [ActKey: number]: S2CPlayerSignInUIData } = cc.js.createMap(true);

    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    public init(): void {
        //
    }

    // 每日签到UI数据
    public setPlayerSignInUIData(data: S2CPlayerSignInUIData): void {
        this._PlayerSignInUIData[data.FuncId] = data;
        EventClient.I.emit(E.DaySign.UpdataUI);
    }

    /** 签到 */
    public setS2CPlayerSignIn(data: S2CPlayerSignIn): void {
        if (data.SignDays) {
            this._PlayerSignInUIData[data.FuncId].ActData.SignDays = data.SignDays;
        }
        EventClient.I.emit(E.DaySign.UpdateOne);
    }

    /** 再领一次 */
    public setS2CPlayerDoubleSignIn(data: S2CPlayerDoubleSignIn): void {
        if (data.DoubleDays) {
            this._PlayerSignInUIData[data.FuncId].ActData.DoubleDays = data.DoubleDays;
        }
        EventClient.I.emit(E.DaySign.UpdateOne);
    }

    // 补签
    public setS2CPlayerRemedySignIn(data: S2CPlayerRemedySignIn): void {
        if (data.RemedyDays) {
            this._PlayerSignInUIData[data.FuncId].ActData.RemedyDays = data.RemedyDays;
        }
        if (data.DoubleDays) {
            this._PlayerSignInUIData[data.FuncId].ActData.DoubleDays = data.DoubleDays;
        }

        EventClient.I.emit(E.DaySign.UpdateOne);
    }

    public setS2CPlayerSignInNumReward(data: S2CPlayerSignInNumReward): void {
        // console.log('累计奖励', data);
        if (data.SignNumRewardDays) {
            this._PlayerSignInUIData[data.FuncId].ActData.SignNumRewardDays = data.SignNumRewardDays;
        }
        EventClient.I.emit(E.DaySign.UpdateOne);
    }

    // 获取每日签到UI数据
    public getPlayerSignInUIData(FuncId: number): S2CPlayerSignInUIData {
        return this._PlayerSignInUIData[FuncId];
    }

    // 获取每日签到配置表
    public getCfgDailySignReward(StartTurn: number, ActId: number): Cfg_Server_DailySignReward[] {
        const actData = ModelMgr.I.ActivityModel.getActivityData(ActId);
        const SignData: Cfg_Server_DailySignReward[] = [];
        const indexer = Config.Get(Config.Type.Cfg_Server_DailySignReward);
        indexer.forEach((cfg: Cfg_Server_DailySignReward) => {
            if (cfg.StartTurn <= StartTurn && StartTurn <= cfg.EndTurn && actData && (!actData.Config.ArgsGroup || actData.Config.ArgsGroup === cfg.Group)) {
                SignData.push(cfg);
            }

            return true;
        });
        // console.log('getCfgDailySignReward---------', SignData);
        return SignData;
    }

    // 获取签到累计奖励
    public getCfgDailySignNumReward(StartTurn: number, FuncId: number): Cfg_Server_DailySignNumReward[] {
        const actData = ModelMgr.I.ActivityModel.getActivityData(FuncId);
        const SignNumRewardData: Cfg_Server_DailySignNumReward[] = [];
        const indexer = Config.Get(Config.Type.Cfg_Server_DailySignNumReward);
        indexer.forEach((cfg: Cfg_Server_DailySignNumReward) => {
            if (cfg.StartTurn <= StartTurn && StartTurn <= cfg.EndTurn && actData && (!actData.Config.ArgsGroup || actData.Config.ArgsGroup === cfg.Group)) {
                SignNumRewardData.push(cfg);
            }
            return true;
        });
        // console.log('getCfgDailySignNumReward---------', SignNumRewardData);
        return SignNumRewardData;
    }
}
