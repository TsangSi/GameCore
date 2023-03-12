/*
 * @Author: hwx
 * @Date: 2022-03-29 11:21:30
 * @FilePath: \SanGuo\assets\script\app\base\utils\UtilArray.ts
 * @Description: 数组工具类
 */
import { UtilBinarySearcher } from './algorithms/UtilBinarySearcher';
import { UtilNum } from './UtilNum';

type NS = number | string | object;
type GetterFunc = (checkValue: NS) => NS;
/**
 * 数组工具类
 */
export class UtilArray {
    /**
     * 获取数值数组中的最小值
     * @param arr
     */
    public static GetMin(arr: number[]): number {
        return Math.min.apply(null, arr) as number;
    }

    /**
     * 获取数值数组中的最大值
     * @param arr
     */
    public static GetMax(arr: number[]): number {
        return Math.max.apply(null, arr) as number;
    }

    /**
     * 获取数值数值之和
     * @param arr
     */
    public static GetSum(arr: number[]): number {
        return arr.reduce((pre, cur) => pre + cur);
    }

    /**
     * 获取数值数值中的平均值
     * @param arr
     */
    public static GetAverage(arr: number[]): number {
        return this.GetSum(arr) / arr.length;
    }

    /**
     * 复制数组
     * @param arr 目标数组
     */
    public static Copy<T>(arr: T[]): T[] {
        const newArr: T[] = [];
        arr.forEach((elm) => newArr.push(elm));
        return newArr;
    }

    /**
    * 混淆数组，引用不变
    * Fisher-Yates Shuffle
    * @param arr 目标数组
    */
    public static Shuffle<T>(arr: T[]): T[] {
        let i = arr.length;
        while (i) {
            const j = Math.floor(Math.random() * i--);
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        return arr;
    }

    /**
    * 混淆数组，引用改变
    * @param arr 目标数组
    */
    public static Confound<T>(arr: T[]): T[] {
        return arr.slice().sort(() => Math.random() - 0.5);
    }

    /**
     * 数组扁平化
     * @param arr 目标数组
     */
    public static Flatten<T>(arr: T[]): T[] {
        while (arr.some((item) => Array.isArray(item))) {
            arr = [].concat(...arr); // 给原数组重新赋值
        }
        return arr;
    }

    /**
    * 合并数组
    * @param arr1 目标数组1
    * @param arr2 目标数组2
    */
    public static Combine<T>(arr1: T[], arr2: T[]): T[] {
        return [...arr1, ...arr2];
    }

    /**-
    * 获取随机数组成员
    * @param arr 目标数组
    */
    public static GetRandom<T>(arr: T[]): T {
        // console.log(arr, '----------------------------');

        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * 获取权重列表随机下标
     * @param weights 权重列表
     * @returns 随机下标
     */
    public static GetWeightIndex(weights: number[]): number {
        const len = weights.length;
        if (len <= 0) {
            return -1;
        }

        let totalWeight = this.GetSum(weights);
        const currentWeight = UtilNum.RandomFloat(0, totalWeight);
        for (let i = len - 1; i >= 0; --i) {
            totalWeight -= weights[i];
            if (totalWeight <= currentWeight) {
                return i;
            }
        }
        return 0;
    }

    /**
     * 比较列表1和列表2的每一项，全部一样才返回true，否则返回false
     * @param list1 列表1
     * @param list2 列表2
     * @returns
     */
    public static Every<T>(list1: T[], list2: T[]): boolean {
        if (list1.length === list2.length) {
            return list1.every((v, i) => v === list2[i]);
        }
        return false;
    }

    /**
     * 比较列表1和列表2的每一项，有一个一样的就返回true，全部不一样返回false
     * @param list1 列表1
     * @param list2 列表2
     * @returns
     */
    public static Some<T>(list1: T[], list2: T[]): boolean {
        return list1.some((v) => list2.indexOf(v) >= 0);
    }

    /** 两个数组的交集 */
    public static a(arr1: Array<string | number>, arr2: Array<number | string>): Array<any> {
        const arr3 = arr2.filter((v) => arr1.indexOf(v) !== -1);
        return arr3;
    }

    /**
     * - 将元素插入到一个升序列表中
     */
    public static Insert(list: NS[], value: NS | NS[], getter?: GetterFunc): number | boolean {
        if (value instanceof Array) {
            let changed = 0;
            for (let i = 0; i < value.length; ++i) {
                const pos = this.InsertToAscUniqueArray(list, value[i], getter);
                changed += pos >= 0 ? 1 : 0;
            }
            return changed > 0;
        } else {
            return this.InsertToAscUniqueArray(list, value, getter);
        }
    }

    private static FetchComparableValue(x: NS, getter: GetterFunc) {
        if (getter) {
            return getter(x);
        } else { return x; }
    }
    /**
     * - 将元素插入到一个升序列表中
     * @param {Array} array - 升序列表
     * @param {number | string | any | Array} x - 该值将会插入到列表中。如果是列表，将会枚举元素进行插入
     * @param {Function | fn.Executor}
     * @return {number} - 插入之后的位置
     */
    private static InsertToAscUniqueArray(list: NS[], x: NS, getter: GetterFunc) {
        const len = list.length;
        if (!len) { list.push(x); return 0; }

        const comparablex = this.FetchComparableValue(x, getter);
        const last = list[len - 1];
        const comparable_last = this.FetchComparableValue(last, getter);

        if (comparablex > comparable_last) { // 比最后一个要大
            list.push(x);
            return len;
        } else if (comparablex === comparable_last) {
            list.push(x);
            return len;
        } else if (len === 1) { // 比第一个还要小
            list.splice(0, 0, x);
            return 0;
        }
        const first = list[0];
        const comparable_first = this.FetchComparableValue(first, getter);
        if (comparablex < comparable_first) { // 比第一个还要小
            list.splice(0, 0, x);
            return 0;
        } else if (comparablex === comparable_first) {
            list.splice(1, 0, x);
            return 1;
        }

        const pos = this.LowerBound(list, x, getter);
        // let comparable_pos = this.FetchComparableValue(list[pos], getter);
        // if (comparable_pos === comparablex) {
        //     list.push(x);
        //     return len;
        // } else {
        list.splice(pos, 0, x);
        return pos;
        // }
    }
    /**
     * 从列表中获取值的索引，不能直接获取到，就会获取到相近的索引
     * @param list 有序列表
     * @param value 参照值。整数
     * @param getter 获取list元素的数值的函数
     * @param low 起始位置索引, [0, orderd_list.length)。 不传入参数表示0
     * @param high 结束位置索引，[0, orderd_list.length)。不传入参数表示orderd_list.length - 1
     * @param asc 标记list是否升序, true表示升序。不传入该参数默认为升序
     * @return {number} 索引index
     * @demo list.length = 5; 有可能返回 0 1 2 3 4 5; 小于list[0] 返回0  大于list[4] 返回 5
     */
    // eslint-disable-next-line max-len
    public static LowerBound(list: NS[], value: NS, getter?: GetterFunc, low?: number, high?: number, asc?: boolean): number {
        if (!list || list.length === 0) {
            return 0;
        }
        const bs = UtilBinarySearcher;
        bs.Convergence = bs.ConvergenceLB;
        bs.Getter = getter;
        if (asc || asc === undefined || asc === null) {
            if (getter) {
                bs.Comparator = bs.AscFunctorComparator;
            } else if (typeof value === 'string') {
                bs.Comparator = bs.StringAscComparator;
            } else {
                bs.Comparator = bs.AscComparator;
            }
        } else if (getter) {
            bs.Comparator = bs.DescFunctorComparator;
        } else if (typeof value === 'string') {
            bs.Comparator = bs.StringDescComparator;
        } else {
            bs.Comparator = bs.DescComparator;
        }
        bs.Low = low;
        bs.High = high;
        const result = bs.BinarySearch(list, value);
        delete bs.Getter;
        return result;
    }

    /**
     * 二分查找值的索引
     * @param list 有序列表
     * @param value 参照值。整数
     * @param getter 获取list元素的数值的函数
     * @param low 起始位置索引, [0, orderd_list.length)。 不传入参数表示0
     * @param high 结束位置索引，[0, orderd_list.length)。不传入参数表示orderd_list.length - 1
     * @param asc 标记list是否升序, true表示升序。不传入该参数默认为升序
     * @return {number} 找到返回索引位置，找不到返回小于0
     */
    // eslint-disable-next-line max-len
    public static BinarySearch(list: NS[], value: NS, getter?: GetterFunc, low?: number, high?: number, asc?: boolean): number {
        if (!list || list.length === 0 || typeof value !== 'number') {
            return -1;
        }
        const bs = UtilBinarySearcher;
        bs.Convergence = bs.ConvergenceBS;
        bs.Getter = getter;
        if (asc || asc === undefined || asc === null) {
            if (getter) {
                bs.Comparator = bs.AscFunctorComparator;
            } else if (typeof value === 'string') {
                bs.Comparator = bs.StringAscComparator;
            } else {
                bs.Comparator = bs.AscComparator;
            }
        } else if (getter) {
            bs.Comparator = bs.DescFunctorComparator;
        } else if (typeof value === 'string') {
            bs.Comparator = bs.StringDescComparator;
        } else {
            bs.Comparator = bs.DescComparator;
        }

        bs.Low = low;
        bs.High = high;

        const n = bs.BinarySearch(list, value);
        delete bs.Getter;

        return bs.Broken ? n : ~n;
    }

    public static StringArrayToNumberArray(arr: string[]): number[] {
        const arr1: number[] = [];
        arr.forEach((e, idx) => {
            arr1[idx] = Number(e);
        });
        return arr1;
    }
}
