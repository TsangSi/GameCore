import { Executor } from '../common/Executor';

export class BinarySearcher {
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
