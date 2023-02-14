import {
 Color, Label, LabelOutline, Node, sys,
} from 'cc';
import { Executor } from '../core/executor/Executor';
import { QualityType } from '../global/GConst';
import { LowerBound } from './LowerBound';
import { ColorStyleType, UtilsColor } from './UtilsColor';
import UtilsPlatform from './UtilsPlatform';

// export class BinarySearcher {
//     static loopCondition: Function | null = null;
//     static comparator = null;
//     static convergence = null;
//     static mid = 0;
//     static cmp = 0;
//     static low = 0;
//     static high = 0;
//     static getter: Executor | Function | null = null;
//     static broken = false;

//     static binarySearch(orderd_list: number[], needle: number) {
//         if (this.low === undefined) {
//             this.low = 0;
//         } else {
//             this.low = this.low | 0;
//             if (this.low < 0 || this.low >= orderd_list.length) {
//                 this.low = 0;
//             }
//         }

//         if (this.high === undefined) {
//             this.high = orderd_list.length - 1;
//         } else {
//             this.high = this.high | 0;
//             if (this.high < 0 || this.high >= orderd_list.length) {
//                 this.high = orderd_list.length - 1;
//             }
//         }

//         this.broken = false;
//         if (this.loopCondition) {
//             while (this.loopCondition()) {
//                 this.mid = this.low + (this.high - this.low >> 1);
//                 this.cmp = +this.comparator(orderd_list[this.mid], needle, this.mid, orderd_list);
//                 if (this.convergence() !== undefined) {
//                     this.broken = true;
//                     return this.mid;
//                 }
//             }
//         }

//         return this.low;
//     };

//     static ascComparator(x: number, needle: number) {
//         return x - needle;
//     }
//     static descComparator(x: number, needle: number) {
//         return needle - x;
//     }

//     static stringAscComparator(a: number, b: number) {
//         return (a > b ? 1 : (a < b ? -1 : 0));
//     }
//     static stringDescComparator(a: number, b: number) {
//         return (a > b ? -1 : (a < b ? 1 : 0));
//     }

//     static ascFunctorComparator(x: number, needle: number) {
//         let getter = this.getter;
//         let a = 0;
//         let b = 0;
//         if (typeof(getter) == 'function') {
//             a = getter(x);
//             b = getter(needle);
//         }
//         return (a > b ? 1 : (a < b ? -1 : 0));
//     };
//     static descFunctorComparator(x: number, needle: number) {
//         let getter = this.getter;
//         let a = 0;
//         let b = 0;
//         if (typeof(getter) == 'function') {
//             a = getter(x);
//             b = getter(needle);
//         }
//         return (a > b ? -1 : (a < b ? 1 : 0));
//     };
// }

// const FetchComparableValue = (x: number, getter?: (x)=> unknown) => {
//     if (getter) {
//         if (typeof getter === 'function') {
//             return getter(x);
//         }
//     }
//     return x;
// };

export default class Utils {
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

    // static LowerBound(ordered_list: [], needle: number, getter: Function, low?: number, high?: number, asc?: number) {
    //     if (!ordered_list || ordered_list.length === 0) {
    //         return 0;
    //     }
    //     let bs = BinarySearcher;
    //     bs.loopCondition = () => { return bs.low <= bs.high; }
    //     bs.convergence = () => {
    //         if (bs.cmp < 0) {
    //             bs.low = bs.mid + 1;
    //         } else {
    //             bs.high = bs.mid - 1;
    //         }
    //     };
    //     bs.getter = getter;
    //     if (asc || asc === undefined || asc === null) {
    //         if (getter) {
    //             bs.comparator = bs.ascFunctorComparator;
    //         } else if (typeof (needle) === 'string') {
    //             bs.comparator = bs.stringAscComparator;
    //         } else {
    //             bs.comparator = bs.ascComparator;
    //         }
    //     } else {
    //         if (getter) {
    //             bs.comparator = bs.descFunctorComparator;
    //         } else if (typeof (needle) === 'string') {
    //             bs.comparator = bs.stringDescComparator;
    //         } else {
    //             bs.comparator = bs.descComparator;
    //         }
    //     }
    //     bs.low = low;
    //     bs.high = high;
    //     let result = bs.binarySearch(ordered_list, needle);
    //     delete bs.getter;
    //     return result;
    // }

    /**
     *
     * @param hex 例如:"#23ff45" 或 "#23ff45ff"
     */
    public static hex2Rgba(hex: string): Color {
        if (hex.length === 9) {
            return new Color(parseInt(`0x${hex.slice(1, 3)}`), parseInt(`0x${hex.slice(3, 5)}`),
                parseInt(`0x${hex.slice(5, 7)}`), parseInt(`0x${hex.slice(7, 9)}`));
        } else {
            return new Color(parseInt(`0x${hex.slice(1, 3)}`), parseInt(`0x${hex.slice(3, 5)}`), parseInt(`0x${hex.slice(5, 7)}`), 255);
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

        const pos = LowerBound.LowerBound(array, x, asc, getter, 1, len - 2);
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
     * 将元素插入到一个有序列表中
     * @param array 有序的列表
     * @param x 插入的值
     * @param asc false为从大到小，默认true，从小到大
     * @param getter 比较器
     * @returns
     */
    public static insertToAscUniqueArray(array: any[], x: unknown, asc = true, getter?: ((x) => unknown) | Executor): number {
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

    public static RemoveFromSortedArray(array: any[], x: unknown): number {
        if (!array || !array.length) { return -1; }
        // let i = LowerBound.LowerBound(array, x, asc);
        // if (i >= 0) {
        //     array.splice(i, 1);
        //     return i;
        // }
        const pos = array.indexOf(x);
        if (pos >= 0) {
            array.splice(pos, 1);
            return pos;
        }
        return -1;
    }

    /**
     * 从列表里获取第一个有效值，非null 和 非undefined就是有效值
     * @param values
     * @returns
     */
    public static GetValidValueFromArray<T>(values: T[]): T {
        for (let i = 0, n = values.length; i < n; i++) {
            const v = values[i];
            if (!this.isNullOrUndefined(v)) {
                return v;
            }
        }
        return values[0];
    }

    public static isNullOrUndefined(v: unknown): boolean {
        return v == null || v === undefined;
    }

    public static setNodeAttr(node: Node, ...args: unknown[]): void {
        node.attr(args);
    }

    public static getNodeAttr(node: Node, key: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return node[key];
    }

    /**
   * 获取皮肤ID
   * @param idStr: 皮肤ID字符串
   */
     public static getSkinId(idStr = '', sex: number): number {
        if (Utils.isNullOrUndefined(idStr)) { return 0; }

        if (idStr.indexOf('|') === -1) return Number(idStr);
        const animArr = idStr.split('|');
        return Number(sex === 1 ? animArr[0] : animArr[1]);
    }

    /**
     * 处理玩家等级字段，返回转生等级、重数、等级 1010001
     * 玩家的等级字段，后四位为等级，中间两位为重数，前两位为转数
     */
     public static LevelToLongLevel(level: number): Array<number> {
        const r = Math.floor(level / 1000000);
        const b = Math.floor((level - r * 1000000) / 10000);
        const l = Math.floor(level % 10000);
        return [r, b, l];
    }

    /**
     * 显示展示等级 “x转x重x级”
     */
     public static GetSLv(level: number): string {
        const [r, b, l] = this.LevelToLongLevel(level);
        if (r > 0 || b > 0) return `${r}转${b}重`;
        return `${l}级`;
    }
    /**
     * 转生等级
     */
     public static GetR(level: number): number {
        const [r, b, l] = this.LevelToLongLevel(level);
        return r;
    }
    /**
     * 重
     */
     public static GetB(level: number): number {
        const [r, b, l] = this.LevelToLongLevel(level);
        return b;
    }
    /**
     * 级
     */
     public static GetL(level: number): number {
        const [r, b, l] = this.LevelToLongLevel(level);
        return l;
    }

    /**
     * 获取七彩色字符串
     * @param str 字符串
     * @param outLine 描边大小
     * @param isDark 是否暗背景
     * @returns
     */
     public static GetRainBowStr(str: string, outLine = '', isDark = false): string {
        if (str.length <= 0) {
            return '';
        }
        if (!UtilsPlatform.isSmallGame() && (!sys.isNative && sys.os !== sys.OS.IOS)) {
            // if (cc.sys.platform !== cc.sys.WECHAT_GAME && (!cc.sys.isNative && cc.sys.os != cc.sys.OS_IOS)) {
            if (outLine) {
                return `<outline width=1 color = ${outLine} ><multiColor color=${isDark ? 2 : 1}>${str}</multiColor></outline>`;
            }
            return `<multiColor color=${isDark ? 2 : 1}>${str}</multiColor>`;
        }
        let _colorStr = '';
        // 七彩
        const _arg = [];
        for (let i = 0, l = 6; i < l; i++) {
            const _c = UtilsColor.GetColorHex(i, ColorStyleType.Dark);
            _arg.push(_c);
        }
        // //反序
        // _arg.reverse();

        const _nameArg = str.split('');
        for (let i = 0, l = _nameArg.length; i < l; i++) {
            const _n = _nameArg[i];
            const _cc: string = _arg[5 - i % 6];
            if (outLine === '' || isDark === false) {
                _colorStr += `<color=${_cc}>${_n}</color>`;
            } else {
                _colorStr += `<color=${_cc}><outline width=1 color=${outLine}>${_n}</outline></color>`;
            }
        }
        return _colorStr;
    }

    // static setFillColor(_parent, label: Label | RichText, string, isDark: boolean = false, outline?: string) {
    //     label.node.active = false;
    //     let rich = UtilsCC.getRichText(label.node.name + '_rich', _parent);
    //     if (rich) {
    //         rich.string = Utils.GetRainBowStr(string, outline, isDark);
    //     } else {
    //         UtilsCC.LabelConvertRainBow(label, string, isDark, outline);
    //     }
    // }
    // 场景：有些地方的文本根据品质的不同或者等级的变化，颜色会发生变化，当需要七彩色时
    // 需要使用富文本，但是如果常驻富文本，会降低性能，因此，我们在预制体制作时仍使用label,
    // 需要richText时去动态生成，下面这个函数就是解决这个问题
    /**
    * 将指定label替换为七彩richText
    * @param string:string 文本
    * @param label:cc.Label 可能会被替换的Label
    * @param qKey:number 凭证（品质或者等级）
    * @param limitQ:number 大于等于此值才会被替换成七彩色
    * @param mustHide 强制控制label隐藏
    */
     public static ShowRainBowStr(string: string, label: Label, qKey = 0, limitQ = 7, bOutLine = '', bLabLine = true, mustHide: any = null): void {
        if (limitQ === null) {
            limitQ = QualityType.Color;
        }
        if (bLabLine === null) {
            bLabLine = true;
        }
        const _parent = label.node.parent;
        if (qKey == limitQ) {
            // 七彩
            // label.string = string;
            // if (bLabLine) {
            //     let labOutLine = _parent.getChildByName(label.uuid); // cxb 处理同级有多个label
            //     if (labOutLine) {
            //         labOutLine.active = false;
            //         labOutLine.destroy();
            //     }
            // }
            label.isColor = true;
            // this.setFillColor(_parent, label, string, false, bOutLine);
        } else {
            label.isColor = false;
            label.color = UtilsColor.GetColorRGBA(qKey);
            // let _rrt = _parent.getChildByName(label.node.name + '_rich');
            // if (_rrt) {
            //     _rrt.active = false;
            //     _rrt.destroy();
            // }

            // if (bLabLine && qKey === QualityType.J) {
            //     label.node.active = false;
            //     label.string = string;
            //     let _labOutLine = _parent.getChildByName(label.uuid);
            //     if (!_labOutLine) {
            //         _labOutLine = instantiate(label.node);
            //         _labOutLine.name = label.uuid;
            //         _parent.addChild(_labOutLine);
            //     }
            //     let _l = _labOutLine.getComponent(Label);
            //     _l.string = string;
            //     _labOutLine.active = true;
            //     this.rainAddOutline(_labOutLine, qKey);

            //     _l.color = UtilsColor.GetColorRGBA(qKey);
            //     _l.string = string;
            //     _l.node.active = true;
            //     // this.refLbl(_l.node);
            // } else {
            //     if (bLabLine) {
            //         let _labOutLine = _parent.getChildByName(label.uuid);
            //         if (_labOutLine) {
            //             _labOutLine.active = false;
            //             _labOutLine.destroy();
            //         }
            //     }

            //     label.color = UtilsColor.GetColorRGBA(qKey);
            //     label.string = string;
            //     label.node.active = true;
            //     // this.refLbl(label.node);
            // }
        }
        // if (mustHide) {
        //     label.node.active = false;
        //     label.string = string;
        // }
    }

    private static rainAddOutline(labOutLine: Node, qKey: number) {
        let _com: LabelOutline;
        _com = labOutLine.getComponent(LabelOutline);
        if (!_com) {
            _com = labOutLine.addComponent(LabelOutline);
        }
        _com.color = UtilsColor.GetColorRGBA(qKey, ColorStyleType.Stroke);
        _com.width = 2;
    }
    // /**
    //  *
    //  * @param ordered_list 有序列表
    //  * @param needle 参照值。整数
    //  * @param getter 获取ordered_list元素的数值的函数
    //  * @param low 起始位置索引, [0, orderd_list.length)。 不传入参数表示0
    //  * @param high 结束位置索引，[0, orderd_list.length)。不传入参数表示orderd_list.length - 1
    //  * @param asc 标记ordered_list是否升序, true表示升序。不传入该参数默认为升序
    //  * @return {number} 找到返回索引位置，找不到返回小于0
    //  */
    // binarySearch(ordered_list, needle, getter?: Function, low?: number, high?: number, asc?: boolean) {
    //     if (!ordered_list || ordered_list.length === 0 || typeof (needle) != 'number') {
    //         return -1;
    //     }

    //     let bs = BinarySearcher;
    //     bs.loopCondition = () => { return bs.low <= bs.high; }
    //     bs.convergence = () => {
    //         if (bs.cmp < 0) {
    //             bs.low = bs.mid + 1;
    //         } else if (bs.cmp > 0) {
    //             bs.high = bs.mid - 1;
    //         } else {
    //             return bs.mid;
    //         }
    //     };

    //     bs.getter = getter;
    //     if (asc || asc === undefined || asc === null) {
    //         if (getter) {
    //             bs.comparator = bs.ascFunctorComparator;
    //         } else if (typeof (needle) === 'string') {
    //             bs.comparator = bs.stringAscComparator;
    //         } else {
    //             bs.comparator = bs.ascComparator;
    //         }
    //     } else {
    //         if (getter) {
    //             bs.comparator = bs.descFunctorComparator;
    //         } else if (typeof (needle) === 'string') {
    //             bs.comparator = bs.stringDescComparator;
    //         } else {
    //             bs.comparator = bs.descComparator;
    //         }
    //     }

    //     bs.low = low;
    //     bs.high = high;

    //     let n = bs.binarySearch(ordered_list, needle);
    //     delete bs.getter;

    //     return (bs.broken ? n : (~n));
    // }
}
