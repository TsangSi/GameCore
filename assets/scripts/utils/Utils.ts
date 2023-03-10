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
     * @param hex ??????:"#23ff45" ??? "#23ff45ff"
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
     * - ???????????????????????????????????????
     * @param {Array} array - ????????????
     * @param {number | string | any | Array} x - ?????????????????????????????????????????????????????????????????????????????????
     * @param {Function | fn.Executor}
     * @return {number} - ?????????????????????
     */
    private static InsertToAscUniqueArray(array: number[], x: number | string | any | [], asc = true, getter?: ((x) => unknown) | Executor) {
        const len = array.length;
        if (!len) { array.push(x); return 0; }

        const comparablex = this.FetchComparableValue(x, getter);
        const last = array[len - 1];
        if (asc) { // ??????
            const comparableLast = this.FetchComparableValue(last, getter);
            if (comparablex >= comparableLast) { // ??????????????????????????????????????????
                array.push(x);
                return len;
            } else if (len === 1 || comparablex <= this.FetchComparableValue(array[0], getter)) { // ????????????1 or ???????????????????????????????????????
                array.unshift(x);
                return 0;
            }
        } else { // ??????
            const first = array[0];
            const comparableFirst = this.FetchComparableValue(first, getter);
            if (comparablex >= comparableFirst) { // ???????????????????????????????????????
                array.unshift(x);
                return 0;
            } else if (len === 1 || comparablex <= this.FetchComparableValue(last, getter)) { // ????????????1 or ???????????????????????????????????????
                array.push(x);
                return len;
            }
        }
        // const first = array[0];
        // const comparableFirst = FetchComparableValue(first, getter);
        // if (comparablex < comparableFirst) { // ?????????????????????
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
     * ???????????????????????????????????????
     * @param array ???????????????
     * @param x ????????????
     * @param asc false????????????????????????true???????????????
     * @param getter ?????????
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
     * ??????????????????????????????????????????null ??? ???undefined???????????????
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
   * ????????????ID
   * @param idStr: ??????ID?????????
   */
     public static getSkinId(idStr = '', sex: number): number {
        if (Utils.isNullOrUndefined(idStr)) { return 0; }

        if (idStr.indexOf('|') === -1) return Number(idStr);
        const animArr = idStr.split('|');
        return Number(sex === 1 ? animArr[0] : animArr[1]);
    }

    /**
     * ??????????????????????????????????????????????????????????????? 1010001
     * ???????????????????????????????????????????????????????????????????????????????????????
     */
     public static LevelToLongLevel(level: number): Array<number> {
        const r = Math.floor(level / 1000000);
        const b = Math.floor((level - r * 1000000) / 10000);
        const l = Math.floor(level % 10000);
        return [r, b, l];
    }

    /**
     * ?????????????????? ???x???x???x??????
     */
     public static GetSLv(level: number): string {
        const [r, b, l] = this.LevelToLongLevel(level);
        if (r > 0 || b > 0) return `${r}???${b}???`;
        return `${l}???`;
    }
    /**
     * ????????????
     */
     public static GetR(level: number): number {
        const [r, b, l] = this.LevelToLongLevel(level);
        return r;
    }
    /**
     * ???
     */
     public static GetB(level: number): number {
        const [r, b, l] = this.LevelToLongLevel(level);
        return b;
    }
    /**
     * ???
     */
     public static GetL(level: number): number {
        const [r, b, l] = this.LevelToLongLevel(level);
        return l;
    }

    /**
     * ????????????????????????
     * @param str ?????????
     * @param outLine ????????????
     * @param isDark ???????????????
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
        // ??????
        const _arg = [];
        for (let i = 0, l = 6; i < l; i++) {
            const _c = UtilsColor.GetColorHex(i, ColorStyleType.Dark);
            _arg.push(_c);
        }
        // //??????
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
    // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????label,
    // ??????richText???????????????????????????????????????????????????????????????
    /**
    * ?????????label???????????????richText
    * @param string:string ??????
    * @param label:cc.Label ?????????????????????Label
    * @param qKey:number ??????????????????????????????
    * @param limitQ:number ?????????????????????????????????????????????
    * @param mustHide ????????????label??????
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
            // ??????
            // label.string = string;
            // if (bLabLine) {
            //     let labOutLine = _parent.getChildByName(label.uuid); // cxb ?????????????????????label
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
    //  * @param ordered_list ????????????
    //  * @param needle ??????????????????
    //  * @param getter ??????ordered_list????????????????????????
    //  * @param low ??????????????????, [0, orderd_list.length)??? ?????????????????????0
    //  * @param high ?????????????????????[0, orderd_list.length)????????????????????????orderd_list.length - 1
    //  * @param asc ??????ordered_list????????????, true????????????????????????????????????????????????
    //  * @return {number} ????????????????????????????????????????????????0
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
