/* eslint-disable max-len */
import { Executor } from '../common/Executor';
import { BinarySearcher } from './BinarySearcher';

export class LowerBound {
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
