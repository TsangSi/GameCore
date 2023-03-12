import { i18n, Lang } from '../../../i18n/i18n';

/*
 * @Author: hwx
 * @Date: 2022-03-29 11:20:32
 * @FilePath: \SanGuo-2.4-main\assets\script\app\base\utils\UtilNum.ts
 * @Description: 数值工具类
 */
export class UtilNum {
    /**
     * 转换大数过万过亿过万亿单位（战力转化请使用ConvertFightValue方法）
     * @param num 数值
     * @returns 转换后的字符串
     */
    public static Convert(num: number): string {
        let str = '';
        const max = 4; // 策划需求数值部分最多显示4位
        const k = 10000;
        const sizes = ['', i18n.tt(Lang.com_thousand), i18n.tt(Lang.com_Billion), i18n.tt(Lang.com_trillion), i18n.tt(Lang.com_trillions), i18n.tt(Lang.com_zhao)];
        let i: number = 0;
        if (num < k) {
            str = `${num}`;
        } else {
            i = Math.floor(Math.log(num) / Math.log(k));
            const value = num / k ** i;
            const len = (value | 0).toString().length; // 取整数位长度
            const fixed = len === 1 ? 2 : max - len;
            const ret = (value * 10 ** fixed | 0) / 10 ** fixed;
            str = `${ret}${sizes[i]}`;
        }
        return str;
    }

    /** 战力数值转换 */
    public static ConvertFightValue(num: number): string {
        // 亿之下原数字
        if (num < 100000000) {
            return num.toString();
        } else {
            return UtilNum.Convert(num);
        }
    }
    /**
     * 数字前面补零
     * @param num 数字
     * @param len 总长度, 不能等于1, 若为1以0处理
     * @returns 补零后的字符串
     * @example NumUtil.FillZero(1, 2) = 01;
     */
    public static FillZero(num: number, len: number): string {
        len = len <= 1 ? 0 : len; // 长度不能等于1
        return `${Array(len).join('0')}${num}`.slice(-len);
    }

    /**
     * 判断数字的奇偶数
     * @param num 数字
     * @returns 字符串 odd | even
     */
    public static OddEven(num: number): string {
        return num & 1 ? 'odd' : 'even';
    }

    /**
     * 获取范围内整型随机数
     * @param min
     * @param max
     * @returns 向下的整数
     */
    public static RandomInt(min: number, max: number): number {
        return Math.floor(this.RandomFloat(min, max));
    }

    /**
         * 获取范围内随机浮点数
         * @param min
         * @param max
         * @param decimal 小数点位数（可选）
         * @returns 浮点数
         */
    public static RandomFloat(min: number, max: number, decimal?: number): number {
        const value = Math.random() * (max - min + 1) + min;
        return decimal ? +value.toFixed(decimal) : value;
    }

    /**
     * 数字转汉字
     * @param num 数字0-10
     * @returns string
     */
    public static ToChinese(num: number): string {
        const words = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九',
            '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九',
            '二十'];
        return words[num];
    }

    private static Float32Array: Float32Array = new Float32Array(1);
    /** 未知精度转换成float32 */
    public static Float32(float_value: number): number {
        this.Float32Array[0] = float_value;
        return this.Float32Array[0];
    }
}
