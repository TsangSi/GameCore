/*
 * @Author: zs
 * @Date: 2022-07-12 22:10:16
 * @FilePath: \SanGuo\assets\script\app\base\utils\algorithms\UtilBinarySearcher.ts
 * @Description:
 */
type NS = number | string | object;
/**
 * 二分查找基础类
 */
export class UtilBinarySearcher {
    public static LoopCondition(): boolean {
        return this.Low <= this.High;
    }
    public static Comparator: (checkValue: NS, value: NS, Mid: NS, list: NS[]) => number = null;
    public static Convergence: () => number | undefined = null;
    public static ConvergenceLB(): undefined {
        if (this.Cmp < 0) {
            this.Low = this.Mid + 1;
        } else {
            this.High = this.Mid - 1;
        }
        return undefined;
    }
    public static ConvergenceBS(): number | undefined {
        if (this.Cmp < 0) {
            this.Low = this.Mid + 1;
        } else if (this.Cmp > 0) {
            this.High = this.Mid - 1;
        } else {
            return this.Mid;
        }
        return undefined;
    }
    private static Mid = 0;
    private static Cmp = 0;
    public static Low = 0;
    public static High = 0;
    public static Getter: (checkValue: NS) => NS = null;
    public static Broken = false;

    /**
     * 二分查找
     * @param list 有序列表
     * @param value 查找的值
     * @returns
     */
    public static BinarySearch(list: NS[], value: NS): number {
        if (this.Low === undefined) {
            this.Low = 0;
        } else {
            this.Low |= 0;
            if (this.Low < 0 || this.Low >= list.length) {
                this.Low = 0;
            }
        }

        if (this.High === undefined) {
            this.High = list.length - 1;
        } else {
            this.High |= 0;
            if (this.High < 0 || this.High >= list.length) {
                this.High = list.length - 1;
            }
        }

        this.Broken = false;
        // const cond = this.LoopCondition();
        // console.log(cond, '------------aaaaaaaaaaaa-------', this.Low <= this.High);

        while (this.LoopCondition()) {
            this.Mid = this.Low + (this.High - this.Low >> 1);
            this.Cmp = +this.Comparator(list[this.Mid], value, this.Mid, list);
            if (this.Convergence() !== undefined) {
                this.Broken = true;
                return this.Mid;
            }
        }

        return this.Low;
    }

    /**
     * 升序查找值
     * @param x 被检查的值
     * @param value 查找的值
     * @returns
     */
    public static AscComparator(x: number, value: number): number {
        return x - value;
    }

    /**
     * 降序查找值
     * @param x 被检查的值
     * @param value 查找的值
     * @returns
     */
    public static DescComparator(x: number, value: number): number {
        return value - x;
    }

    /**
     * 字符串升序查找值
     * @param a 被检查的值
     * @param b 查找的值
     * @returns
     */
    public static StringAscComparator(a: string, b: string): number {
        return a > b ? 1 : a < b ? -1 : 0;
    }
    /**
     * 字符串降序查找值
     * @param a 被检查的值
     * @param b 查找的值
     * @returns
     */
    public static StringDescComparator(a: string, b: string): number {
        return a > b ? -1 : a < b ? 1 : 0;
    }

    /**
     * 升序查找值，外部检查的回调函数
     * @param x 被检查的值
     * @param value 查找的值
     * @returns
     */
    public static AscFunctorComparator(x: NS, value: NS): number {
        const Getter = this.Getter;
        const a = Getter(x);
        const b = Getter(value);
        return a > b ? 1 : a < b ? -1 : 0;
    }

    /**
     * 降序查找值，外部检查的回调函数
     * @param x 被检查的值
     * @param value 查找的值
     * @returns
     */
    public static DescFunctorComparator(x: NS, value: NS): number {
        const Getter = this.Getter;
        const a = Getter(x);
        const b = Getter(value);
        return a > b ? -1 : a < b ? 1 : 0;
    }
}
