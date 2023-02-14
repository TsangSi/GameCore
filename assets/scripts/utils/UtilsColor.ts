import { Color } from 'cc';
import { QualityType } from '../global/GConst';

export const enum ColorStyleType {
    /** 默认 */
    Normall,
    /** 暗背景 */
    Dark,
    /** 描边 */
    Stroke,
}

export class UtilsColor {
    /**
     * 品质相关的颜色
     * @param quality 品质
     * @param isDark 可选，是否暗背景
     * @returns
     */
     static GetColorHex(quality: QualityType, style_type: ColorStyleType = ColorStyleType.Normall) {
        let result = ['#8d4a2c', '#b87743', '#000000'];
        switch (quality) {
            case QualityType.unknown_2:
                result = ['#8d4a2c', '#b87743', '#000000'];
                break;
            case QualityType.unknown_1:
                result = ['#8d4a2c', '#b87743', '#000000'];
                break;
            case QualityType.Normall:
                result = ['#8d4a2c', '#b87743', '#FFFFFF'];
                break;
            case QualityType.B:
                result = ['#12a710', '#46ff69', '#018200']; // 绿色
                break;
            case QualityType.L:
                result = ['#0295e9', '#6ce1fc', '#0057ba']; // 蓝色 老的#0295e9
                break;
            case QualityType.Z:
                result = ['#fa72f8', '#fa72f8', '#9e00a4']; // 紫色 老的#ed2df2
                break;
            case QualityType.C:
                result = ['#f16e31', '#ff933d', '#ac4500']; // 橙色 老的 #f16e31
                break;
            case QualityType.R:
                result = ['#ff4242', '#ff4242', '#a70003']; // 红色  #ff3e40
                break;
            case QualityType.J:
                result = ['#fefb45', '#f3f049', '#573803']; // 金色
                break;
            case QualityType.Color:
                result = ['#fefb45', '#ff933d', '#c24d00']; // 彩色
                break;
            case QualityType.F:
                result = ['#ff79a6', '#fea8df', '#fea8df']; // 粉色
                break;
            case QualityType.unknown9:
                result = ['#fefb45', '#fea8df', '#c24d00']; // 金色
                break;
            case QualityType.unknown10:
                result = ['#fefb45', '#fea8df', '#000000']; // 金色
                break;
            default:
                break;
        }
        return result[style_type];
    }
    /**
     * 品质相关的颜色
     * @param quality 品质
     * @param isDark 可选，是否暗背景
     * @returns
     */
    static GetColorRGBA(quality: QualityType, style_type: ColorStyleType = ColorStyleType.Normall) {
        const color = this.GetColorHex(quality, style_type);
        return this.Hex2Rgba(color);
    }

    /**
     * * @param hex 例如:"#23ff45" 或 "#23ff45ff"
     * @returns {string}
    */
    static Hex2Rgba(hex: string): Color {
        if (hex.length == 9) {
            return new Color(parseInt(`0x${hex.slice(1, 3)}`), parseInt(`0x${hex.slice(3, 5)}`), parseInt(`0x${hex.slice(5, 7)}`), parseInt(`0x${hex.slice(7, 9)}`));
        } else {
            return new Color(parseInt(`0x${hex.slice(1, 3)}`), parseInt(`0x${hex.slice(3, 5)}`), parseInt(`0x${hex.slice(5, 7)}`), 255);
        }
    }
}
