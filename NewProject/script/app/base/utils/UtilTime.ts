import {
    i18n, Lang,
} from '../../../i18n/i18n';

/* eslint-disable @typescript-eslint/no-unsafe-return */
/*
 * @Author: hwx
 * @Date: 2022-03-29 11:20:58
 * @FilePath: \SanGuo2.4\assets\script\app\base\utils\UtilTime.ts
 * @Description: 时间工具类
 */

/**
 * 时间工具类
 */
export class UtilTime {
    /** 当前时间（毫秒） */
    private static ServerTimeCompareLocalTime = 0;
    /** 开服天数 */
    private static ServerDays: number = 0;

    /**
     * 获取当前时间（毫秒）
     * @returns 毫秒
     */
    public static NowMSec(): number {
        return new Date().getTime() + UtilTime.ServerTimeCompareLocalTime;
    }

    /**
     * 获取当前时间（秒）
     * @returns 秒
     */
    public static NowSec(): number {
        return Math.floor(new Date().getTime() / 1000 + UtilTime.ServerTimeCompareLocalTime / 1000);
    }

    /**
     * 同步服务器时间
     * @param serverTime 服务器时间(秒)
     */
    public static SyncServerTime(serverTime: S2CGetAreaOpenDay): void {
        UtilTime.ServerTimeCompareLocalTime = serverTime.ServerTime - new Date().getTime();
        UtilTime.ServerDays = serverTime.Days;
    }

    /** 开服天数 */
    public static GetServerDays(): number {
        return UtilTime.ServerDays;
    }

    /** 当前是星期几 (注意：周天是0，周一到周六是1-6) */
    public static NowDays(): number {
        return new Date(UtilTime.NowMSec()).getDay();
    }

    /** 是否是周末 */
    public static isWeekEnd(): boolean {
        const day = this.NowDays();
        return day === 6 || day === 0;
    }

    /**
     * 获取今天的某一时刻时间戳（毫秒）
     * @param hours
     * @param min
     * @param sec
     * @param ms
     * @returns 毫秒
     */
    public static GetTodySometime(hours: number, min: number = 0, sec: number = 0, ms: number = 0): number {
        return new Date(new Date(this.NowMSec()).setHours(hours, min, sec, ms)).getTime();
    }

    /**
     * 获取今天剩余时间戳
     * @returns 毫秒
     */
    public static GetTodayRemainTime(): number {
        return this.GetTodySometime(24) - this.NowMSec();
    }

    public static disTanceToday(sec: number): number {
        const deltaSec = UtilTime.NowSec() - sec;
        if (deltaSec > 0) {
            const day = Math.floor(deltaSec / 86400);
            return day;
        }
        return 0;
    }

    /**
     * 是否同一天
     * @param date1 日期1
     * @param date2 日期2
     */
    public static IsSameDay(date1: Date, date2: Date): boolean {
        const startTimeMs = date1.setHours(0, 0, 0, 0);
        const endTimeMs = date2.setHours(0, 0, 0, 0);
        return startTimeMs === endTimeMs;
        // return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    }

    /**
     * 格式化日期，最大单位年
     * @param timestamp 时间戳（毫秒）
     * @param fmt 格式 如：'%yyyy年%MM月%dd日%HH时%mm分%ss秒'
     */
    public static FormatToDate(timestamp: number, fmt: string = '', isFillZero: boolean = true): string {
        if (fmt === '') fmt = i18n.tt(Lang.com_format_datetime);
        timestamp = Math.abs(timestamp); // 不支持负数，取绝对值
        const date = new Date(timestamp);
        const yyyy = date.getFullYear();
        const MM = date.getMonth() + 1; // 月份从0开始，所以加1
        const dd = date.getDate();
        const HH = date.getHours();
        const mm = date.getMinutes();
        const ss = date.getSeconds();
        fmt = fmt.replace(/%yyyy/g, `${yyyy}`);
        fmt = fmt.replace(/%MM/g, (MM < 10) && isFillZero ? `0${MM}` : `${MM}`);
        fmt = fmt.replace(/%dd/g, (dd < 10) && isFillZero ? `0${dd}` : `${dd}`);
        fmt = fmt.replace(/%HH/g, (HH < 10) && isFillZero ? `0${HH}` : `${HH}`);
        fmt = fmt.replace(/%mm/g, (mm < 10) && isFillZero ? `0${mm}` : `${mm}`);
        fmt = fmt.replace(/%ss/g, (ss < 10) && isFillZero ? `0${ss}` : `${ss}`);
        return fmt;
    }

    /**
     * 格式化时间，最大单位天
     * @param second 秒
     * @param fmt 格式，如：'%dd日%HH时%mm分%ss秒'、'%HH时%mm分%ss秒'、'%mm分%ss秒'、'%ss秒'
     * @param isFillZero 是否补零，默认false，如果为true，00日00时03分40秒，如果为false，0日0时3分40秒
     * @param isFixed 是否固定格式，默认false，如果为true，0日0时3分40秒，如果为false，3分40秒
    */
    public static FormatTime(second: number, fmt: string = '', isFillZero: boolean = false, isFixed: boolean = false): string {
        if (fmt === '') fmt = i18n.tt(Lang.com_format_time);
        second = Math.abs(second); // 不支持负数，取绝对值
        const dd = Math.floor(second / (60 * 60 * 24));
        let HH = Math.floor(second / 60 / 60 % 24);
        let mm = Math.floor(second / 60 % 60);
        let ss = Math.floor(second % 60);

        // 如果缺少最大的单位，换算到下个单位中
        if (fmt.indexOf('%dd') < 0) {
            if (fmt.indexOf('%HH') !== -1) {
                HH += dd * 24;
            } else if (fmt.indexOf('%mm') !== -1) {
                mm += dd * 24 * 60 + HH * 60;
            } else {
                ss += dd * 24 * 60 * 60 + HH * 60 * 60 + mm * 60;
            }
        }

        let ret: string = '';
        const fmtArr = fmt.split('%');
        for (let i = 1; i < fmtArr.length; i++) {
            const element = fmtArr[i];
            if (element.indexOf('dd') !== -1 && (dd > 0 || isFixed)) {
                ret += element.replace(/dd/g, (dd < 10) && isFillZero ? `0${dd}` : `${dd}`);
            } else if (element.indexOf('HH') !== -1 && (HH > 0 || isFixed)) {
                ret += element.replace(/HH/g, (HH < 10) && isFillZero ? `0${HH}` : `${HH}`);
            } else if (element.indexOf('mm') !== -1 && (mm > 0 || isFixed)) {
                ret += element.replace(/mm/g, (mm < 10) && isFillZero ? `0${mm}` : `${mm}`);
            } else if (element.indexOf('ss') !== -1) {
                ret += element.replace(/ss/g, (ss < 10) && isFillZero ? `0${ss}` : `${ss}`);
            }
        }
        return ret;
    }

    /**
     * 大于1天只显示天；大于1小时只显示时；大于1分钟只显示分；大于1秒只显示秒
     * @param second
     * @returns
     */
    public static TimeLimit(second: number): string {
        if (second > 24 * 3600) {
            return UtilTime.FormatTime(second, '%dd天');
        } else if (second > 3600) {
            return UtilTime.FormatTime(second, '%HH小时');
        } else if (second > 60) {
            return UtilTime.FormatTime(second, '%mm分钟');
        } else if (second > 0) {
            return UtilTime.FormatTime(second, '%ss秒');
        } else {
            return '';
        }
    }

    /**
     * 大于1天只显示天；否则显示 00:00
     * @param second
     * @returns
     */
    public static TimeShow(second: number): string {
        if (second > 24 * 3600) {
            return UtilTime.FormatTime(second, '%dd天');
        } else if (second > 0) {
            return UtilTime.FormatTime(second, '%HH:%mm');
        } else {
            return '';
        }
    }

    /**
     * 时间转化为小时进制
     * @param second 以s为单位
     */
    public static FormatHourDetail(second: number, isFillZero: boolean = true): string {
        if (second <= 0) return '00:00:00';
        const h = Math.floor(second / 3600);
        const m = Math.floor(second % 3600 / 60);
        const s = Math.floor(second % 3600 % 60);
        const hs = isFillZero ? h > 9 ? `${h}:` : `0${h}:` : `${h}:`;
        const ms = isFillZero ? m > 9 ? `${m}:` : `0${m}:` : `${m}:`;
        const ss = isFillZero ? s > 9 ? `${s}` : `0${s}` : `${s}`;
        return hs + ms + ss;
    }

    /** 日期转时间戳 */
    public static DateToTimestamp(date: string): number {
        return new Date(date.replace(/-/g, '/')).getTime();
    }

    /**
     * 时间转换秒
     * @param time xx:xx | xx:xx:xx
     * @returns
     */
    public static TimeToSecond(time: string): number {
        let second = 0;
        const timeSeconds = [3600, 60, 1];
        let numberT: number = 0;
        const times = time.split(':');
        for (let i = 0, n = Math.max(times.length, timeSeconds.length); i < n; i++) {
            numberT = Number(times[i]);
            if (!Number.isNaN(numberT)) {
                second += numberT * timeSeconds[i];
            }
        }
        return second;
    }

    public static FormatDate(second: number, isFillZero: boolean = true): string {
        if (second <= 0) {
            return '00:00:00';
        }
        const d = Math.ceil(second / (3600 * 24));
        if (d > 1) {
            return `${d}天`;
        } else {
            return this.FormatHourDetail(second, isFillZero);
        }
    }

    /** 获取一周的每天的0点时间戳
     * num 周几 周日写7
     * isFeature 是否是未来时间
    */
    public static GetTimeZone(num: number = 0, isFeature: boolean = false): number {
        num = num <= 0 ? 1 : num;
        num = num > 7 ? 7 : num;
        const timeSec = new Date(UtilTime.NowSec() * 1000);
        const zoneSec = timeSec.setHours(0, 0, 0, 0) / 1000;// 0点时间戳
        let weekday = UtilTime.NowDays(); // 当前是周几
        weekday = weekday === 0 ? 7 : weekday;// 周日转化为7
        const dayDistance = (num - weekday) + (isFeature ? 7 : 0);
        return zoneSec + dayDistance * 3600 * 24;
    }
    /** 根据时间戳（S）判断 是周几 */
    /** 也可以传入 星期 周 */
    public static getWeekString(second: number, strDayFormat: string = `${i18n.tt(Lang.com_zhou)}`): string {
        const date = new Date(second);
        let week: string = '';

        const n = date.getDay() - 1;// 1 - 7

        if (n === 1) week = `${strDayFormat}${i18n.tt(Lang.com_num_1)}`;
        if (n === 2) week = `${strDayFormat}${i18n.tt(Lang.com_num_2)}`;
        if (n === 3) week = `${strDayFormat}${i18n.tt(Lang.com_num_3)}`;
        if (n === 4) week = `${strDayFormat}${i18n.tt(Lang.com_num_4)}`;
        if (n === 5) week = `${strDayFormat}${i18n.tt(Lang.com_num_5)}`;
        if (n === 6) week = `${strDayFormat}${i18n.tt(Lang.com_num_6)}`;
        if (n === 0) week = `${strDayFormat}${i18n.tt(Lang.com_num_ri)}`;// 周日

        return week;
    }

    /** 周1 -7 数量 */
    public static getWeekNum(second: number): number {
        let week = 1;
        const date = new Date(second);
        week = date.getDay() - 1;
        if (!week) {
            week = 7;
        }
        // if (date.getDay() === 0) week = 7;
        // if (date.getDay() === 1) week = 1;
        // if (date.getDay() === 2) week = 2;
        // if (date.getDay() === 3) week = 3;
        // if (date.getDay() === 4) week = 4;
        // if (date.getDay() === 5) week = 5;
        // if (date.getDay() === 6) week = 6;
        return week;
    }

    public static getHour(second: number): number {
        const date = new Date(second);
        const h = date.getHours();
        return h;
    }
    public static getMinutes(second: number): number {
        const date = new Date(second);
        const m = date.getMinutes();
        return m;
    }

    /** 下周 下下周 */
    public static getWhichWeek(nextSecond: number): string {
        const nowTime = UtilTime.NowSec();
        const deltaTime = nextSecond - nowTime;
        let str = '';
        if (deltaTime > 0) {
            for (let i = 1; i < 10; i++) {
                if (deltaTime >= i * 7 * 24 * 60 * 60) {
                    str += `${i18n.tt(Lang.com_next)}`;// '下'
                }
            }
        }
        return str;
    }

    public static getTimeYMD(timestamp: number, seg: string = '-'): string {
        const date = new Date(timestamp * 1000);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        const Y = date.getFullYear();
        const M = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
        return `${Y}${seg}${M}${seg}${D} ${h}:${m}:${s}`;
    }

    public static showWeekFirstDay(): string {
        const nowTemp = new Date();// 当前时间
        const oneDayLong = 246060 * 1000;// 一天的毫秒数
        const c_time = nowTemp.getTime();// 当前时间的毫秒时间
        const c_day = nowTemp.getDay() || 7;// 当前时间的星期几
        const m_time = c_time - (c_day - 1) * oneDayLong;// 当前周一的毫秒时间
        const monday = new Date(m_time);// 设置周一时间对象
        const m_year = monday.getFullYear();
        const m_month = monday.getMonth() + 1;
        const m_date = monday.getDate();
        return `${m_year}-${m_month}-${m_date}` + `00:00:00`;// 周一的年月日
    }
}
