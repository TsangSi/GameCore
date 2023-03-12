/*
 * @Author: dcj
 * @Date: 2022-08-24 17:45:56
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\timerActivity\ActivityMgr.ts
 * @Description:
 */

import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { ETimerActId, ETimeState } from './TimerActivityConst';

enum TimeType {
    /** 开始时间 */
    Start = 0,
    /** 结束时间 */
    End = 1
}

export default class ActivityMgr {
    private static Instance: ActivityMgr;
    public static get I(): ActivityMgr {
        if (!this.Instance) {
            this.Instance = new ActivityMgr();
            this.Instance.InitModel();
        }
        return this.Instance;
    }
    /** 定时活动配置表的索引器 */
    private CfgActive: ConfigIndexer = null;
    /** 初始化model */
    private InitModel(): void {
        this.CfgActive = Config.Get(Config.Type.Cfg_Active);
    }

    /** 获取当前活动数据 */
    public getActData(actId: ETimerActId): Cfg_Active {
        return this.CfgActive.getValueByKey(actId);
    }

    /**
     * 获取活动当前阶段的开始时间戳/结束时间戳（秒）
     * @param actId 活动id
     * @param timeType TimeType.Start | TimeType.End （开始时间 | 结束时间）
     * @returns
     */
    private getActTimestamp(actId: ETimerActId, timeType: TimeType): number {
        const cfg = this.CfgActive.getValueByKey(actId, { ActTime: '', Week: '' });
        /** 当前时间（毫秒） */
        const nowSecs = UtilTime.NowMSec();
        const curWeek: any = new Date(nowSecs).getDay() || 7;
        let nearWeek = 0;
        const weeks = cfg.Week.split('|');
        for (let i = weeks.length - 1; i >= 0; i--) {
            if (weeks[i] >= curWeek) {
                nearWeek = +weeks[i];
            }
        }
        /** 获取还需要多少天 */
        const w = Math.abs(nearWeek - curWeek);
        const leftTime = w === 0 ? 0 : w * 24 * 60 * 60 * 1000;
        const strTimes = cfg.ActTime.split('|');
        let outSecs = 0;
        let startEndTimes: string[];
        let sec: number;
        for (let i = 0, n = strTimes.length; i < n; i++) {
            startEndTimes = strTimes[i].split('-');
            sec = this.getTimeByStrTime(nowSecs, startEndTimes[timeType]);
            if (timeType === TimeType.Start) {
                if (sec > nowSecs || this.getTimeByStrTime(nowSecs, startEndTimes[TimeType.End]) > nowSecs) {
                    // 当前时间段
                    outSecs = sec;
                    break;
                }
            } else if (sec > nowSecs) {
                // 当前时间段
                outSecs = sec;
                break;
            }
        }
        return Math.floor((leftTime + outSecs) / 1000);
    }

    private getTimeByStrTime(nowSecs: number, strTime: string) {
        const t: any[] = strTime.split(':');
        return new Date(new Date(nowSecs).setHours(t[0] || 0, t[1] || 0, t[2] || 0)).getTime();
    }

    /**
     * 获取活动当前阶段的开始时间戳（秒）
     * @param actId 活动id
     * @returns
     */
    public getActStartTimestamp(actId: ETimerActId): number {
        return this.getActTimestamp(actId, TimeType.Start);
    }

    /**
     * 获取活动当前阶段的结束时间戳（秒）
     * @param actId 活动id
     * @returns
     */
    public getActEndTimestamp(actId: ETimerActId): number {
        return this.getActTimestamp(actId, TimeType.End);
    }

    /**
     * 获取活动当前阶段距离结束的剩余时间（秒）
     * @param actId 活动id
     * @returns
     */
    public getActEndLeftTime(actId: ETimerActId): number {
        return this.getActEndTimestamp(actId) - UtilTime.NowSec();
    }

    /**
     * 获取活动当前阶段距离开始的剩余时间（秒）
     * @param actId 活动id
     * @returns
     */
    public getActStartLeftTime(actId: ETimerActId): number {
        return this.getActStartTimestamp(actId) - UtilTime.NowSec();
    }

    /**
     * 当前是否在活动时间里
     * @returns
     */
    public isInActTime(actId: ETimerActId): boolean {
        const startTime: number = this.getActStartTimestamp(actId);
        const endTime: number = this.getActEndTimestamp(actId);
        const now: number = UtilTime.NowSec();
        return now >= startTime && now <= endTime;
    }

    /**
     * 定时活动的状态：0未开始 1活动中 2已结束
     * @param actId ETimerActId
     * @returns
     */
    public getActState(actId: ETimerActId): ETimeState {
        const startTime: number = this.getActStartTimestamp(actId);
        const endTime: number = this.getActEndTimestamp(actId);
        const now: number = UtilTime.NowSec();
        if (now < startTime) return ETimeState.UnStart;
        else if (now > endTime) return ETimeState.End;
        return ETimeState.InTime;
    }

    /**
     * @param actId 活动id
     * @param spacer 间隔符
     * 获取当前活动星期描述
     */
    public getActWeekDay(actId: ETimerActId, spacer?: string): string {
        const data = this.getActData(actId);
        const spa = spacer || '、';
        const weekD = data.Week;
        let str = '';
        const dataL = weekD.split('|');
        if (!weekD) { return i18n.tt(Lang.com_activity_not_open); } else if (dataL.length === 7) {
            return i18n.tt(Lang.com_everyday);
        } else {
            for (let i = 0, n = dataL.length; i < n; i++) {
                const ele = dataL[i];
                switch (ele) {
                    case '1':
                        str += `${UtilString.FormatArray(i18n.tt(Lang.com_week), ['一'])}${spa}`;
                        break;
                    case '2':
                        str += `${UtilString.FormatArray(i18n.tt(Lang.com_week), ['二'])}${spa}`;
                        break;
                    case '3':
                        str += `${UtilString.FormatArray(i18n.tt(Lang.com_week), ['三'])}${spa}`;
                        break;
                    case '4':
                        str += `${UtilString.FormatArray(i18n.tt(Lang.com_week), ['四'])}${spa}`;
                        break;
                    case '5':
                        str += `${UtilString.FormatArray(i18n.tt(Lang.com_week), ['五'])}${spa}`;
                        break;
                    case '6':
                        str += `${UtilString.FormatArray(i18n.tt(Lang.com_week), ['六'])}${spa}`;
                        break;
                    case '7':
                        str += `${UtilString.FormatArray(i18n.tt(Lang.com_week), ['日'])}`;
                        break;
                    default:
                        break;
                }
            }
        }
        return str;
    }

    /** 获取活动持续天数 */
    public getActLastDay(actId: ETimerActId): number | string {
        const data = this.getActData(actId);
        const startDay = data.StartDay;
        const endDay = data.EndDay;
        if (endDay === 0) { return i18n.tt(Lang.com_forever); } else {
            return endDay - startDay;
        }
    }

    /** 活动是否跨服 */
    public isCross(actId: ETimerActId): boolean {
        const data = this.getActData(actId);
        return data.Cross === 1;
    }
}
