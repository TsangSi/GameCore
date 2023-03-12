/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2023-01-14 18:51:09
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\EscortModel.ts
 * @Description:
 *
 */

import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigEscortRewardIndexer } from '../../base/config/indexer/ConfigEscortRewardIndexer';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { RoleMgr } from '../role/RoleMgr';
import { UnlockFunc } from '../vip/VipConst';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import ActivityMgr from '../activity/timerActivity/ActivityMgr';
import { ETimerActId } from '../activity/timerActivity/TimerActivityConst';
import { ERobState, EscortState } from './EscortConst';
import UtilItem from '../../base/utils/UtilItem';
import ItemModel from '../../com/item/ItemModel';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../i18n/i18n';

const { ccclass } = cc._decorator;
@ccclass('EscortModel')
export class EscortModel extends BaseModel {
    // 镖车数据
    private _carData: { [UserId: number]: CarData } = cc.js.createMap(true);
    private _escortNum: number = 0; // 押镖次数
    private _robNum: number = 0; // 劫镖次数
    private _qualityId: number = 1; // 当前刷新品质
    // 被劫记录
    private _robbedLog: EscortRobLog[] = [];

    public clearAll(): void {
        //
    }
    public init(): void {
        //
    }

    /** 已押镖次数 */
    public get escortNum(): number {
        return this._escortNum;
    }

    /** 剩余押镖次数 */
    public get leftEscortNum(): number {
        const maxEscort: number = +this.getCfgValue('DailyProTimes');
        return maxEscort - this._escortNum;
    }

    /** 已劫镖次数 */
    public get robNum(): number {
        return this._robNum;
    }

    /** 剩余劫镖次数 */
    public get leftRobNum(): number {
        const maxRob: number = +this.getCfgValue('DailyRobTimes');
        return maxRob - this._robNum;
    }

    /** 镖品质 */
    public get qualityId(): number {
        return this._qualityId;
    }

    /** 我的镖车数据 */
    public myCar(): CarData {
        const my = RoleMgr.I.info.userID;
        return this._carData[my];
    }

    /** 某个镖车数据 */
    public getCarData(userId: number): CarData {
        return this._carData[userId];
    }

    /** 获取所有镖车数据 */
    public getAllCarData(): { [UserId: number]: CarData } {
        return this._carData;
    }

    /** 常量表 */
    private _CfgNormal: ConfigIndexer;
    public get CfgNormal(): ConfigIndexer {
        if (!this._CfgNormal) {
            this._CfgNormal = Config.Get(Config.Type.Cfg_EscortNormal);
        }
        return this._CfgNormal;
    }

    public getCfgValue(key: string): string {
        const cfg: Cfg_EscortNormal = this.CfgNormal.getValueByKey(key);
        return cfg.CfgValue;
    }

    /** 押镖表 */
    private _CfgEscort: ConfigIndexer;
    public get CfgEscort(): ConfigIndexer {
        if (!this._CfgEscort) {
            this._CfgEscort = Config.Get(Config.Type.Cfg_Escort);
        }
        return this._CfgEscort;
    }

    private _quickFinishVip: number = 0;
    /** vip达到多少可快速完成押镖 */
    public getQuickFinishVip(): number {
        if (this._quickFinishVip) {
            return this._quickFinishVip;
        }
        const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_VIP);
        for (let i = 0; i < indexer.keysLength; i++) {
            const config: Cfg_VIP = indexer.getValueByIndex(i);
            if (config.UnlockFunc.split('|').indexOf(UnlockFunc.escort.toString()) > -1) {
                this._quickFinishVip = config.VIPLevel;
                break;
            }
        }
        return this._quickFinishVip;
    }

    public getQuickFinishVipName(): string {
        const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_VIP);

        if (this._quickFinishVip) {
            const config: Cfg_VIP = indexer.getValueByKey(this._quickFinishVip);
            return config.VIPName;
        }

        for (let i = 0; i < indexer.keysLength; i++) {
            const config: Cfg_VIP = indexer.getValueByIndex(i);
            if (config.UnlockFunc.split('|').indexOf(UnlockFunc.escort.toString()) > -1) {
                this._quickFinishVip = config.VIPLevel;
                return config.VIPName;
            }
        }
        return '';
    }

    /** 当前是否可快速完成 */
    public canQuickFinish(): boolean {
        // 是否是押镖中
        if (this._state === EscortState.Escorting) {
            // vip是否达到
            const vip = RoleMgr.I.d.VipLevel < 1 ? 1 : RoleMgr.I.d.VipLevel;
            const vipConfig: Cfg_VIP = Config.Get(Config.Type.Cfg_VIP).getValueByKey(vip);
            return vipConfig.UnlockFunc.split('|').indexOf(UnlockFunc.escort.toString()) > -1;
        }
        return false;
    }

    // 由于执行比较频繁，缓存这几个数据
    private _DoubleTimeOpenDay: number = 0;
    private _DoubleTimeOpen: string = '';
    private _DoubleTimeWeekend: string = '';
    private _DoubleTime: string = '';
    private doubleTimeOpenDay(): number {
        if (!this._DoubleTimeOpenDay) {
            this._DoubleTimeOpenDay = +this.getCfgValue('DoubleTimeOpenDay');
        }
        return this._DoubleTimeOpenDay;
    }
    private doubleTimeOpen(): string {
        if (!this._DoubleTimeOpen) {
            this._DoubleTimeOpen = this.getCfgValue('DoubleTimeOpen');
        }
        return this._DoubleTimeOpen;
    }
    private doubleTimeWeekend(): string {
        if (!this._DoubleTimeWeekend) {
            this._DoubleTimeWeekend = this.getCfgValue('DoubleTimeWeekend');
        }
        return this._DoubleTimeWeekend;
    }
    private doubleTime(): string {
        if (!this._DoubleTime) {
            this._DoubleTime = this.getCfgValue('DoubleTime');
        }
        return this._DoubleTime;
    }

    /** 获取双倍时间 */
    public getDoubleTime(): string[] {
        // 是否处在开服时间的双倍时间
        const serverDays: number = UtilTime.GetServerDays();
        const doubleDays: number = this.doubleTimeOpenDay();
        if (serverDays <= doubleDays) {
            return [this.doubleTimeOpen()];
        }
        // 是否在周末
        const isWeekEnd: boolean = UtilTime.isWeekEnd();
        if (isWeekEnd) {
            return [this.doubleTimeWeekend()];
        }
        //
        return this.doubleTime().split('|');
    }

    /** 当前是否在双倍时间里 */
    public isInDoubleTime(): boolean {
        // 加个前提条件：在活动时间里
        const isInActTime: boolean = ActivityMgr.I.isInActTime(ETimerActId.Escort);
        if (!isInActTime) return false;
        // 是否在双倍活动时间里
        const now = UtilTime.NowMSec();
        const time: string[] = this.getDoubleTime();
        for (let i = 0; i < time.length; i++) {
            const arr: string[] = time[i].split('-');
            const start: string[] = arr[0].split(':');
            const end: string[] = arr[1].split(':');
            const startSec: number = UtilTime.GetTodySometime(+start[0], +start[1], start[2] ? +start[2] : 0);
            const endSec: number = UtilTime.GetTodySometime(+end[0], +end[1], end[2] ? +end[2] : 0);
            if (now >= startSec && now <= endSec) {
                return true;
            }
        }
        return false;
    }

    /** 是否可拦截 */
    public canRob(carData: CarData): ERobState {
        if (this.leftRobNum <= 0) {
            return ERobState.NoRobNum;
        }
        const myUserId = RoleMgr.I.info.userID;
        if (carData.UserId === myUserId) {
            return ERobState.IsSelf;
        }

        const robLimit = +this.getCfgValue('RobLimitTimes');
        let robTimes: number = 0;

        let robbedBySelf: boolean = false;
        for (let j = 0; j < carData.RobLog.length; j++) {
            if (carData.RobLog[j].UserId === myUserId && !carData.RobLog[j].IsDefeSucc) {
                robbedBySelf = true;
            }
            if (!carData.RobLog[j].IsDefeSucc) {
                robTimes += 1;
            }
        }

        if (robTimes >= robLimit) {
            return ERobState.OverTimes;
        }

        if (robbedBySelf) {
            return ERobState.HaveRob;
        }
        return ERobState.CanRob;
    }

    /** 押镖时间到就清了该镖车，但不清自己（自己要领完奖励才清） */
    public delCar(userId: number): void {
        if (this._carData[userId] && userId !== RoleMgr.I.info.userID) {
            delete this._carData[userId];
        }
    }

    /** 我的镖车需要领取奖励后才清数据 */
    public delMyCar(userId: number): void {
        if (this._carData[userId]) {
            delete this._carData[userId];
        }
    }

    /** 打开主界面的协议返回的处理 */
    private _recMainUI: boolean = false;

    public get recMainUI(): boolean {
        return this._recMainUI;
    }
    public setEscort(d: S2COpenEscortUI): void {
        if (d.Tag === 0) {
            this._carData = cc.js.createMap(true);
            for (let i = 0; i < d.CarData.length; i++) {
                this._carData[d.CarData[i].UserId] = d.CarData[i];
            }
            // test
            // for (let i = 1; i < 30; i++) {
            //     const data = new CarData(d.CarData[0]);
            //     data.UserId = 1021591 + i;
            //     data.QualityId = i % 5 + 1;
            //     this._carData[data.UserId] = data;
            // }

            this._escortNum = d.EscortNum;
            this._robNum = d.RobNum;
            this._qualityId = d.QualityId;
            this.getEscortState();
            EventClient.I.emit(E.Escort.MainUI);
        }
        this._recMainUI = true;
    }

    /** 刷新主界面镖车数据的处理 */
    public refreshEscort(carList: CarData[]): void {
        this._carData = cc.js.createMap(true);
        for (let i = 0; i < carList.length; i++) {
            this._carData[carList[i].UserId] = carList[i];
        }
        EventClient.I.emit(E.Escort.RefreshMainUI);
    }

    /** 刷新品质 */
    public refreshQuality(qualityId: number): void {
        if (qualityId > this._qualityId) {
            MsgToastMgr.Show(i18n.tt(Lang.escort_up));
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.escort_noup));
        }
        this._qualityId = qualityId;
        EventClient.I.emit(E.Escort.RefreshQuality);
    }

    /** 开始押镖的返回的刷新 */
    public refreshEscortStart(d: S2CEscortCarStart): void {
        this._carData[d.CarData.UserId] = d.CarData;
        this._escortNum = d.EscortNum;
        this._qualityId = d.QualityId;
        this.getEscortState();
        EventClient.I.emit(E.Escort.Start);
    }

    /** 快速完成的返回的刷新 */
    public refreshQuick(carData: CarData): void {
        this._carData[carData.UserId] = carData;
        EventClient.I.emit(E.Escort.Quick);
    }

    /** 打开拦截界面返回的刷新 */
    public refreshRobUI(carList: CarData[]): void {
        for (let i = 0; i < carList.length; i++) {
            this._carData[carList[i].UserId] = carList[i];
        }
        EventClient.I.emit(E.Escort.RobUI);
    }

    /** 拦截返回的刷新 */
    public refreshRob(car: CarData): void {
        if (car && car.UserId) {
            this._carData[car.UserId] = car;
            EventClient.I.emit(E.Escort.Rob, car.UserId);
        }
    }

    /** 领取奖励的返回刷新 */
    public getFinishReward(car: CarData): void {
        if (car && car.UserId) {
            this._carData[car.UserId] = car;
            this.rewardNotice = false;
            EventClient.I.emit(E.Escort.GetReward);
        }
    }

    // 状态
    private _state: EscortState = EscortState.Start;
    public getEscortState(): EscortState {
        const my = RoleMgr.I.info.userID;

        if (this._carData && this._carData[my]) {
            const now = UtilTime.NowSec();
            if (this._carData[my].EndTime < now) {
                this._state = EscortState.Finish;
            } else {
                this._state = EscortState.Escorting;
            }
        } else {
            this._state = EscortState.Start;
        }
        return this._state;
    }

    /** 时间到会修改押镖的状态 */
    public setState(state: EscortState): void {
        this._state = state;
    }

    /** 获取我的押镖的状态 */
    public getState(): EscortState {
        return this._state;
    }

    /** 被劫记录 */
    public refreshRobbedLog(log: EscortRobLog[]): void {
        this._robbedLog = [];
        for (let i = 0; i < log.length; i++) {
            if (!log[i].IsRevenge) {
                this._robbedLog.push(log[i]);
            }
        }
        this.robbedNotice = this._robbedLog.length > 0;
        EventClient.I.emit(E.Escort.RobbedRecord);
    }
    public getRobbedLog(): EscortRobLog[] {
        return this._robbedLog;
    }

    /** 有奖励可领 */
    private _rewardNotice: boolean = false;
    public set rewardNotice(rewardNotice: boolean) {
        this._rewardNotice = rewardNotice;
    }
    public get rewardNotice(): boolean {
        return this._rewardNotice;
    }

    /** 有新的被劫记录 */
    private _robbedNotice: boolean = false;
    public set robbedNotice(robbedNotice: boolean) {
        this._robbedNotice = robbedNotice;
    }
    public get robbedNotice(): boolean {
        return this._robbedNotice;
    }

    /**
     *
     * @param quality 镖车品质
     * @param isDouble 是否双倍
     * @param useLing 使用了令
     * @param isRob 是否是拦截的奖励
     * @returns
     */
    public getReward(quality: number, level: number, isDouble: boolean, useLing: boolean, isRob: boolean = false): ItemModel[] {
        let add = 0;
        if (useLing) {
            add = +this.getCfgValue('ProtectPrizeNum');
        }
        const indexer: ConfigEscortRewardIndexer = Config.Get(Config.Type.Cfg_EscortReward);
        const cfgReward: Cfg_EscortReward = indexer.getDataByQualityAndLv(quality, level);
        const reward = cfgReward.Reward.split('|');
        const arr: ItemModel[] = [];
        for (let i = 0; i < reward.length; i++) {
            const item = reward[i].split(':');
            const id = +item[0];
            let num = +item[1];

            // 计算拦截的奖励（和令无关）
            if (isRob) {
                if (isDouble) {
                    num *= 2;
                }
                const robNum = +this.getCfgValue('RobNum');
                num = Math.floor(num * robNum / 10000);
            } else {
                // 押送的奖励
                if (isDouble) {
                    num *= 2;
                }
                if (useLing) {
                    num = Math.floor(num * (1 + add / 10000));
                }
            }
            if (num >= 1) {
                const itemModel = UtilItem.NewItemModel(id, num);
                arr.push(itemModel);
            }
        }
        return arr;
    }
}
