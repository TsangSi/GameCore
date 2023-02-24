import { Executor } from "../executor/Executor";

export class UtilsArray {
    
    /**
     * @return {string | number}
     * */
    private static FetchComparableValue<T>(x: T, getter: ((x) => T) | Executor): T {
        if (getter) {
            if (typeof getter === 'function') {
                return getter(x);
            } else {
                return getter.invokeWithArgs(x);
            }
        } else { return x; }
    }

    public static Insert(array: any[], x: unknown, asc = true, getter?: ((x) => unknown) | Executor): number {
        if (x instanceof Array) {
            let changed = 0;
            for (let i = 0; i < x.length; ++i) {
                const pos = this.InsertToAscUniqueArray(array, x[i], asc, getter);
                changed += pos >= 0 ? 1 : 0;
            }
            return changed;
        } else {
            return this.InsertToAscUniqueArray(array, x, asc, getter);
        }
    }
    
    /**
     * - 将元素插入到一个升序列表中
     * @param {Array} array - 升序列表
     * @param {number | string | any | Array} x - 该值将会插入到列表中。如果是列表，将会枚举元素进行插入
     * @param {Function | fn.Executor}
     * @return {number} - 插入之后的位置
     */
    private static InsertToAscUniqueArray(array: number[], x: number | string | any | [], asc = true, getter?: ((x) => unknown) | Executor) {
        const len = array.length;
        if (!len) { array.push(x); return 0; }

        const comparablex = this.FetchComparableValue(x, getter);
        const last = array[len - 1];
        if (asc) { // 升序
            const comparableLast = this.FetchComparableValue(last, getter);
            if (comparablex >= comparableLast) { // 大于等于最后一个值，后面插入
                array.push(x);
                return len;
            } else if (len === 1 || comparablex <= this.FetchComparableValue(array[0], getter)) { // 数量只有1 or 小于等于第一个值，前面插入
                array.unshift(x);
                return 0;
            }
        } else { // 降序
            const first = array[0];
            const comparableFirst = this.FetchComparableValue(first, getter);
            if (comparablex >= comparableFirst) { // 大于等于第一个值，前面插入
                array.unshift(x);
                return 0;
            } else if (len === 1 || comparablex <= this.FetchComparableValue(last, getter)) { // 数量只有1 or 比最后一个还要小，后面插入
                array.push(x);
                return len;
            }
        }
        // const first = array[0];
        // const comparableFirst = FetchComparableValue(first, getter);
        // if (comparablex < comparableFirst) { // 比第一个还要小
        //     array.splice(0, 0, x);
        //     return 0;
        // } else if (comparablex === comparableFirst) {
        //     array.splice(1, 0, x);
        //     return 1;
        // }

        const pos = this.LowerBound(array, x, asc, getter, 1, len - 2);
        // let comparable_pos = this.FetchComparableValue(array[pos], getter);
        // if (comparable_pos === comparablex) {
        //     array.push(x);
        //     return len;
        // } else {
        array.splice(pos, 0, x);
        return pos;
        // }
    }
    /**
     * 二分查找的一种，在已排序的区间[first，last）中寻找元素value。
     * 如果[first，last）中有与value相等的元素，便返回一个索引，指向其中第一个元素。
     * 如果没有这样的元素存在，便返回“假设这样的元素存在时应该出现的位置”。也就是说，它返回一个索引，指向第一个“不小于value”的元素。
     * 如果value大于[first，last）内的任何一个元素，则返回last
     * @param orderedList 有序列表
     * @param needle 参照数值
     * @param asc true升序，false降序
     * @param getter 获取orderedList元素的数值的函数
     * @param low 起始点索引, [0, orderedList.length)。不传入该参数表示从0开始
     * @param high 起始点索引, [0, orderedList.length)。不传入该参数表示到orderedList.length - 1结束
     * @returns 索引值，有可能会等于orderedList.length
     */
    public static LowerBound(orderedList: number[] | string[], needle: number | string, asc = true, getter?: Executor | ((...arg: any)=> void), low?: number, high?: number): number {
        if (!orderedList || orderedList.length === 0) {
            return 0;
        }
        // eslint-disable-next-line new-cap
        const bs = new BinarySearcher();
        if (getter) {
            bs.setGetter(getter);
        }
        if (asc) { // 升序
            if (getter) {
                if (typeof getter === 'function') {
                    bs.setcomparator(bs.ascFunctorComparator);
                } else {
                    bs.setcomparator(bs.ascInvokeComparator);
                }
            } else if (typeof needle === 'string') {
                bs.setcomparator(bs.stringAscComparator);
            } else {
                bs.setcomparator(bs.ascComparator);
            }
        } else if (getter) {
            if (typeof getter === 'function') {
                bs.setcomparator(bs.descFunctorComparator);
            } else {
                bs.setcomparator(bs.descInvokeComparator);
            }
        } else if (typeof needle === 'string') {
            bs.setcomparator(bs.stringDescComparator);
        } else {
            bs.setcomparator(bs.descComparator);
        }
        bs.setLow(low);
        bs.setHigh(high);
        const result = bs.binarySearch(orderedList, needle, asc);
        bs.deletegetter();
        return result;
    }
}


class BinarySearcher {
    // private loopCondition =  null;
    private comparator: (...arg: any)=>void | null = null;
    // private convergence =  null;
    private mid = 0;
    private cmp = 0;
    private low: number = undefined;
    private high: number = undefined;
    private broken = false;
    private getter: Executor | ((...arg: any)=>void) | null = null;

    public deletegetter(): void {
        // if (typeof this.getter === 'function') {
        //     this.getter = null;
        // } else {
        //     this.getter?.clear();
        // }
        delete this.getter;
    }
    public setLow(low: number): void {
        this.low = low;
    }
    public setHigh(high: number): void {
        this.high = high;
    }

    public setcomparator(comparator: (...arg: any)=>void): void {
        this.comparator = comparator;
    }

    public setGetter(getter: Executor | ((...arg: any) => void)): void {
        this.getter = getter;
    }

    public loopCondition(): boolean {
        return this.low <= this.high;
    }

    /**
     * 升序比较 Executor
     * @param x 已有值
     * @param needle 新的值
     * @returns
     */
     public ascInvokeComparator(x: number, needle: number): number {
        const getter = this.getter;
        const ag = getter as Executor;
        const a = ag.invokeWithArgs(x);
        const b = ag.invokeWithArgs(needle);
        return a > b ? 1 : a < b ? -1 : 0;
    }

    /**
     * 降序比较 Executor
     * @param x 已有值
     * @param needle 新的值
     * @returns
     */
     public descInvokeComparator(x: number, needle: number): number {
        const getter = this.getter;
        const ag = getter as Executor;
        const a = ag.invokeWithArgs(x);
        const b = ag.invokeWithArgs(needle);
        return a > b ? -1 : a < b ? 1 : 0;
    }

    /**
     * 升序比较 function
     * @param x 已有值
     * @param needle 新的值
     * @returns
     */
     public ascFunctorComparator(x: number, needle: number): number {
        const getter = this.getter;
        const ag = getter as (...arg: any)=>void;
        const a = ag(x);
        const b = ag(needle);
        return a > b ? 1 : a < b ? -1 : 0;
    }

    /**
     * 降序比较 function
     * @param x 已有值
     * @param needle 新的值
     * @returns
     */
     public descFunctorComparator(x: number, needle: number): number {
        const getter = this.getter;
        const ag = getter as (...arg: any)=>void;
        const a = ag(x);
        const b = ag(needle);
        return a > b ? -1 : a < b ? 1 : 0;
    }

    /**
     * 升序比较数字
     * @param x 已有值
     * @param needle 新的值
     * @returns
     */
     public ascComparator(x: number, needle: number): number {
        return x - needle;
    }

    /**
     * 降序比较数字
     * @param x 已有值
     * @param needle 新的值
     * @returns
     */
     public descComparator(x: number, needle: number): number {
        return needle - x;
    }

    /**
     * 升序比较字符串
     * @param a 已有值
     * @param b 新的值
     * @returns
     */
     public stringAscComparator(a: number, b: number): number {
        return a > b ? 1 : a < b ? -1 : 0;
    }

    /**
     * 降序比较字符串
     * @param a 已有值
     * @param b 新的值
     * @returns
     */
     public stringDescComparator(a: number, b: number): number {
        return a > b ? -1 : a < b ? 1 : 0;
    }

    public convergence(asc = true): void {
        if (asc) {
            if (this.cmp < 0) {
                this.low = this.mid + 1;
            } else {
                this.high = this.mid - 1;
            }
        } else if (this.cmp < 0) {
                this.low = this.mid + 1;
            } else {
                this.high = this.mid - 1;
            }
    }
    public binarySearch(orderdList: number[] | string[], needle: number | string, asc = true): number {
        if (this.low === undefined) {
            this.low = 0;
        } else {
            this.low |= 0;
            if (this.low < 0 || this.low >= orderdList.length) {
                this.low = 0;
            }
        }

        if (this.high === undefined) {
            this.high = orderdList.length - 1;
        } else {
            this.high |= 0;
            if (this.high < 0 || this.high >= orderdList.length) {
                this.high = orderdList.length - 1;
            }
        }
        /**
         * [9, 7, 7, 6, 4]  8                  * [1,3,4,5,6,10]   8
         *  2                           * 2;
         *  8-7=1                           * 4-8 = -4;
         *  2-1=1;                           * 2+1=3;
         *  [9,7];                           * 3 + (5 - 3 >> 1) = 4;
         *   8-9=-1;                          *
         *  1                           * [0,0,0,5,6,10];
         *                             * 4;
         *                             * 6-8 = -2;
         *                             * 4+1=5;
         *                             * 5 + (5 - 5 >> 1) = 5;
         *                             *
         *                             * [0,0,0,0,6,10];
         *                             * 5;
         *                             * 10-8 = 2;
         *                             * 5-1=4;
         */
        this.broken = false;
        if (this.loopCondition) {
            while (this.loopCondition()) {
                this.mid = this.low + (this.high - this.low >> 1);
                if (this.comparator) {
                    this.cmp = +this.comparator(orderdList[this.mid], needle, this.mid, orderdList);
                }
                if (this.convergence(asc) !== undefined) {
                    this.broken = true;
                    return this.mid;
                }
            }
        }

        return this.low || 0;
    }
}
