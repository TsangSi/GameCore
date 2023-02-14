export class UtilsNumber {
    /** 处理数字过万过亿过万亿 */
    public static ConvertNum(num: number): string {
        const k = 10000;
        if (num < k) {
            return num.toString();
        } else {
            let strNum = '';
            const Max = 4; // 策划需求数值部分最多显示4位
            const sizes = ['', '万', '亿', '万亿'];
            let i = 0;
            i = Math.floor(Math.log(num) / Math.log(k));
            // **  Math.Pow '被限制使用。使用幂运算符(**)代替。
            const temp = num / k ** i;
            const count = (temp | 0).toString().length;
            const t = count === 1 ? 2 : Max - count;
            const newNum = ((temp * 10 ** t | 0)) / 10 ** t;
            strNum = `${newNum}${sizes[i]}`;
            return strNum;
        }
    }
    /**
     * 数字前面补零
     * @param num 数字
     * @param len 总长度
     * @returns 补零后的字符串
     * @example NumUtil.FillZero(1, 2) = 01;
     */
    public static FillZero(num: number, len: number): string {
        return `${Array(len).join('0')}${num}`.slice(-len);
    }

    /**
     * 小写数字转换为大写数字
     * @param num 数字
     * @returns
     */
    public static ConvertNumber(num: number): string {
        const arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const arr2 = ['', '十'];// 可继续追加更高位转换值
        if (!num || Number(num)) {
            return '零';
        }
        const english = num.toString().split('');
        let result = '';
        for (let i = 0; i < english.length; i++) {
            const desI = english.length - 1 - i;// 倒序排列设值
            result = arr2[i] + result;
            const arr1Index = Number(english[desI]);
            result = `${arr1[arr1Index]}${result}`;
        }
        // 将【【十零】换成【十】
        result = result.replace(/零(十)/g, '零').replace(/十零/g, '十');
        // 移除末尾的零
        result = result.replace(/零+$/, '');
        // 将【一十】换成【十】
        result = result.replace(/^一十/g, '十');
        return result;
    }

    /** 生成随机数字 */
    public static RandomNum(min: number, max: number): number {
        switch (arguments.length) {
            case 1:
                return parseInt((Math.random() * min + 1).toString(), 10);
            case 2:
                return parseInt((Math.random() * (max - min + 1) + min).toString(), 10);
            default:
                return Math.random();
        }
    }
}
