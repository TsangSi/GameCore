/*
 * @Author: zs
 * @Date: 2022-07-07 12:24:09
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\maincity\v\MainCityModel.ts
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../base/config/Config';
import { E } from '../../../const/EventName';

const { ccclass } = cc._decorator;
@ccclass('MainCityModel')
export class MainCityModel extends BaseModel {
    private dateTimer: NodeJS.Timer;
    private hourTimer: NodeJS.Timer;
    /** xx秒当前主题结束，计算下一个主题 */
    private checkDateTime: number = 0;
    /** xx秒计算下一个时间段的主题 */
    private checkHourTime: number = 0;
    /** xx秒检查下一个节日的主题 */
    private checkNextDateTime: number = 0;

    /** 当前日期的索引 */
    private datesIndex = 1;
    /** 当前id列表的索引 */
    private idsIndex = 0;
    /** 当前日期显示的id列表 */
    private curDateShowIds: number[] = [];
    /** 当前时间显示的id */
    private curHourShowId: number = 0;
    /** 上一次显示的id */
    private lastShowId: number = 0;
    /** 默认显示的id列表 */
    // private defaultShowIds = [1001, 1002];
    private maxTime = 2 ** 21;
    public clearAll(): void {
        this.clearDateTimer();
        this.clearHourTimer();
    }
    public getCfgData(id: number): Cfg_MainCity {
        const data: Cfg_MainCity = Config.Get(Config.Type.Cfg_MainCity).getValueByKey(id);
        return data;
    }

    private clearDateTimer() {
        if (this.dateTimer !== undefined && this.dateTimer !== null) {
            clearTimeout(this.dateTimer);
            this.dateTimer = null;
        }
    }
    private clearHourTimer() {
        if (this.hourTimer !== undefined && this.hourTimer !== null) {
            clearTimeout(this.hourTimer);
            this.hourTimer = null;
        }
    }

    /** 清除时间id标记，记录上次id，不需要清除当前日期的标记就只调用这个 */
    private clearHourIdFlag() {
        this.lastShowId = this.curHourShowId;
        this.curHourShowId = 0;
    }

    /** 清除当前日期标记，清除时间id标记 */
    private clearShowMapFlag() {
        this.clearHourIdFlag();
        this.idsIndex = 0;
        this.curDateShowIds.length = 0;
    }

    /** 当前主题的处理 */
    private curThemeHandle(checkTime: number, idsstr: string) {
        this.checkDateTime = Math.min(checkTime, this.maxTime);
        this.dateTimer = setTimeout(() => {
            if (this.dateTimer) {
                clearTimeout(this.dateTimer);
                this.dateTimer = null;
            }
            this.clearShowMapFlag();
            this.checkIsChangeMap();
        }, this.checkDateTime * 1000 + 1000);
        this.curDateShowIds.length = 0;
        const strs = idsstr.split('|');
        strs.forEach((id, i) => this.curDateShowIds[i] = +id);
        console.log(`${this.checkDateTime}秒后更新主题`);
        return this.curDateShowIds;
    }

    /** 下一个主题的处理 */
    private nextThemeHandle(checkTime: number) {
        this.checkNextDateTime = Math.min(checkTime, this.maxTime);
        if (Math.abs(this.checkNextDateTime - this.checkDateTime) > 1) {
            let timer = setTimeout(() => {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                this.clearShowMapFlag();
                this.checkIsChangeMap();
            }, this.checkNextDateTime * 1000 + 1000);
            console.log(`${this.checkNextDateTime}秒后更新下一个节日主题`);
        }
    }

    /** 获取当前日期显示的id列表 */
    private getCurDateShowIds(): number[] {
        if (this.curDateShowIds.length) { return this.curDateShowIds; }
        this.clearDateTimer();
        const curTime = UtilTime.NowSec();
        const cfgMCDateIndexer = Config.Get(Config.Type.Cfg_MainCity_Date);
        let data: Cfg_MainCity_Date;
        for (let i = this.datesIndex, n = cfgMCDateIndexer.keysLength; i < n; i++) {
            data = cfgMCDateIndexer.getValueByIndex(i);
            const startTime = Math.floor(new Date(data.StartDate).getTime() / 1000);
            if (curTime >= startTime) {
                const endTime = Math.floor(new Date(data.EndDate).getTime() / 1000);
                if (curTime <= endTime) {
                    this.datesIndex = i;
                    return this.curThemeHandle(endTime - curTime, data.Ids);
                }
            } else {
                this.nextThemeHandle(startTime - curTime);
                if (this.curDateShowIds.length > 0) {
                    return this.curDateShowIds;
                } else {
                    break;
                }
            }
        }
        data = cfgMCDateIndexer.getValueByIndex(0);
        data.Ids.split('|').forEach((id) => {
            this.curDateShowIds.push(+id);
        });
        return this.curDateShowIds;
    }

    /**
     * 检查是否需要变更地图
     */
    public checkIsChangeMap(): boolean {
        const oldId = this.lastShowId;
        const newId = this.getCurHourShowId();
        if (oldId !== newId) {
            // 这里可以抛个事件 变更地图
            EventClient.I.emit(E.MainCity.ChangeMap);
            return true;
        }
        return false;
    }

    /** 获取当前时间显示的id */
    public getCurHourShowId(): number {
        if (this.curHourShowId) { return this.curHourShowId; }
        this.clearHourTimer();
        let ids = this.curDateShowIds;
        if (!ids.length) {
            ids = this.getCurDateShowIds();
        }
        const curTime = UtilTime.NowSec();
        for (let i = this.idsIndex, n = ids.length; i < n; i++) {
            const data = this.getCfgData(ids[i]);
            const showTimes = data.ShowTime.split('|');
            const curDate = new Date(curTime * 1000);
            const h = curDate.getHours();
            const m = curDate.getMinutes();
            const s = curDate.getSeconds();
            const starts = showTimes[0].split(':');
            const ends = showTimes[1].split(':');
            let starthtime = Number(starts[0]) * 60 * 60 + Number(starts[1]) * 60 + Number(starts[2]);
            let endhtime = Number(ends[0]) * 60 * 60 + Number(ends[1]) * 60 + Number(ends[2]);
            const curhtime = h * 60 * 60 + m * 60 + s;
            /** 是否跨天 */
            const isCrossDay = starthtime > endhtime;
            if (isCrossDay) {
                if (curhtime < starthtime) {
                    // 当前时间比开始时间还小
                    starthtime = curhtime;
                }
                if (curhtime > endhtime) {
                    // 当前时间到12点的时间加上跨天后的时间就是结束时间
                    endhtime = curhtime + (24 * 60 * 60 - curhtime) + endhtime;
                }
            }
            if (curhtime >= starthtime) {
                if (curhtime <= endhtime) {
                    this.idsIndex = i;
                    this.curHourShowId = data.Id;
                    this.checkHourTime = Math.min(endhtime - curhtime, this.maxTime);
                    if (Math.abs(this.checkHourTime - this.checkDateTime) <= 1 || Math.abs(this.checkNextDateTime - this.checkHourTime) <= 1) {
                        // 两个延迟触发器间隔小于5秒的话，就没必要用两个了
                        console.log(this.checkDateTime, this.checkHourTime, '两个延迟触发器间隔小于5秒的话，就没必要用两个了');
                        return this.curHourShowId;
                    } else {
                        this.hourTimer = setTimeout(() => {
                            if (this.idsIndex >= this.curDateShowIds.length - 1) {
                                // 已经用完了
                                this.clearShowMapFlag();
                                this.checkIsChangeMap();
                            } else {
                                this.clearHourIdFlag();
                                this.checkIsChangeMap();
                            }
                        }, this.checkHourTime * 1000 + 1000);
                        console.log(`${this.checkHourTime}秒后更新下一幅图`);
                    }
                    return this.curHourShowId;
                    // }
                }
            }
        }
        this.curHourShowId = this.curDateShowIds[0];
        return this.curHourShowId;
    }
}
