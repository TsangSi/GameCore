const ServerTimeCompareLocalTime = 0;
export default class UtilsTime {
    static NowS(): number { // 精确到毫秒
        return new Date().getTime() + ServerTimeCompareLocalTime * 1000;
    }

    /**
     * dateFormat2(11111111111111, 'Y年m月d日 H时i分s秒') mzc
     * @param timestamp 时间戳 毫秒
     * @param formats 格式
     */
    public static dateFormat2(timestamp: number, formats: string): string {
        // formats格式包括
        // 1. Y-m-d
        // 2. Y-m-d H:i:s
        // 3. Y年m月d日
        // 4. Y年m月d日 H时i分
        formats = formats || 'Y-m-d';
        const zero = (value: number) => {
            if (value < 10) {
                return `0${value}`;
            }
            return `${value}`;
        };
        const myDate = timestamp ? new Date(timestamp) : new Date(UtilsTime.NowS());
        const year = myDate.getFullYear().toString();
        const month = zero(myDate.getMonth() + 1);
        const day = zero(myDate.getDate());
        const hour = zero(myDate.getHours());
        const minite = zero(myDate.getMinutes());
        const second = zero(myDate.getSeconds());
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return formats.replace(/Y|m|d|H|i|s/ig, (matches) => ({
            Y: year,
            m: month,
            d: day,
            H: hour,
            i: minite,
            s: second,
        }[matches]));
    }

    /**
     * 帧时间转换秒
     * 原来游戏1秒是30帧
     */
    static frameTimeToSecond(f: number) {
        return f * 30 / 1000;
    }
}
