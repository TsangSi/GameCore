/* eslint-disable max-len */
import { i18n, Lang } from '../../../i18n/i18n';

/*
 * @Author: zs
 * @Date: 2022-06-08 17:29:14
 * @LastEditors: Please set LastEditors
 */

export class UtilColor {
    /** 亮棕色 常用文字颜色值 */
    /** 浅色背景 */
    public static NorV = '#67413d';
    public static NorVOpacity = '#67413D80';// 带透明度特殊需求
    public static NorN = '#823d3d';
    /** 红色 */
    public static RedV = '#a73c30';
    /** 橙色 */
    public static OrangeV = '#db7c4f';
    /** 绿色 */
    public static GreenV = '#4f9c69';
    /** 红褐色 */
    public static RedBrownV = '#af5449';
    /** 紫色 */
    public static PurpleV = '#a258b7';
    /** 灰色 #bcab9c */
    public static GreyV = '#bcab9c';
    /** 淡黄色 */
    public static YellowD = '#f3efda';

    /** 深色背景 */
    /** 白色 */
    // public static WhiteV = '#8d4a2c';
    public static WhiteD = '#fff5e4';
    /** 金色 */
    // public static GoldV = '#fefb45';
    public static GoldD = '#ffe595';
    /** 绿色 */
    public static GreenD = '#1fae3e';
    /** 深绿色 */
    public static GreenE = '#1fae3e';
    /** 红色 */
    public static RedD = '#ff343e';
    /** 浅蓝色 */
    public static BlueD = '#e4fffb';

    /** 粉色 */
    public static PinkV = '#ff79a6';
    /** 蓝色 */
    public static BlueV = '#0295e9';

    public static DarkStarColor = '#F9C096';

    /** 抹茶色 */
    public static GreenN = '#fffca8';

    /** 副本按钮字默认色 */
    public static YellowBtn = '#f8f3bb';
    /** 副本按钮字功能色 */
    public static GreenBtn = '#68FE9A';

    /** 武将材料色 */
    public static RedG = '#ff5252';
    public static GreenG = '#6df36d';

    public static ColorFullN = '#e23d5c';
    public static ColorFullD = '#fe998e';

    // 设置协助里用到的
    public static c1 = '#4d9c69';
    public static c2 = '#d33e2c';

    // 世家属性颜色
    public static AttrColor = '#8c4938';

    /** 材料充足 绿色 深色bg */
    public static get ColorEnough(): cc.Color {
        return this.Hex2Rgba(this.GreenD);
    }
    /** 材料充足 红色 深色bg */
    public static get ColorUnEnough(): cc.Color {
        return this.Hex2Rgba(this.RedD);
    }

    /** 材料充足 绿色 浅色bg */
    public static get ColorEnoughV(): cc.Color {
        return this.Hex2Rgba(this.GreenV);
    }
    /** 材料充足 红色  浅色bg */
    public static get ColorUnEnoughV(): cc.Color {
        return this.Hex2Rgba(this.RedV);
    }

    /**  富文本中棕色 */
    public static NorRichV = '#683b3b';
    /** 富文本中暗红色 */
    public static RedRichV = '#c14645';
    /** 选中未选中 tabbar */
    public static get SelectColor(): cc.Color {
        return this.Hex2Rgba('#a14a24');
    }
    public static get UnSelectColor(): cc.Color {
        return this.Hex2Rgba('#fbd2a1');
    }

    /** Color对象-亮棕色 常用文字颜色 */
    public static Nor(): cc.Color {
        return this.Hex2Rgba(this.NorV);
    }
    /** Color对象-红色 */
    public static Red(): cc.Color {
        return this.Hex2Rgba(this.RedV);
    }
    /** Color对象-橙色 */
    public static Orange(): cc.Color {
        return this.Hex2Rgba(this.OrangeV);
    }
    /** Color对象-绿色 */
    public static Green(): cc.Color {
        return this.Hex2Rgba(this.GreenV);
    }
    /** Color对象-红褐色 */
    public static RedBrown(): cc.Color {
        return this.Hex2Rgba(this.RedBrownV);
    }
    /** Color对象-紫色 */
    public static Purple(): cc.Color {
        return this.Hex2Rgba(this.PurpleV);
    }

    /**
     * 根据品质获取简短的品质名['全','绿','蓝','紫','橙','红','金','彩']
     * @param quality 品质
     * @returns
     */
    public static GetQualityShortName(quality: number): string {
        return i18n.tt(Lang[`com_quality_short_${quality}`]);
    }

    // 新版颜色

    /**
     * 获取加上的颜色的richtext文本内容
     * @param str richtext的文本内容
     * @param hex 颜色值
     * @returns 加上颜色的文本内容
     */
    public static GetTextWithColor(str: string, hex: string = this.NorV): string {
        return `<color=${hex}>${str}</c>`;
    }

    // /**
    //  * 返回有颜色值的3/3
    //  * @param num 当前数量
    //  * @param needNum 需要数量
    //  * @param fmt 格式化字符串
    //  * @returns
    //  */
    // public static GetLimitNumStr(num: number, needNum: number, fmt: string = i18n.tt(Lang.com_number_kuohao)): string {
    //     if (num >= needNum) {
    //         return this.GetTextWithColor(cc.js.formatStr(fmt, num, needNum), this.GreenV);
    //     } else {
    //         return this.GetTextWithColor(cc.js.formatStr(fmt, num, needNum), this.RedV);
    //     }
    // }

    /**
    * @param hex 例如:"#23ff45" 或 "#23ff45ff"
    * @returns {string}
    */
    public static Hex2Rgba(hex: string): cc.Color {
        if (hex.length === 9) {
            return new cc.Color(Number(`0x${hex.slice(1, 3)}`), Number(`0x${hex.slice(3, 5)}`), Number(`0x${hex.slice(5, 7)}`), Number(`0x${hex.slice(7, 9)}`));
        } else {
            return new cc.Color(Number(`0x${hex.slice(1, 3)}`), Number(`0x${hex.slice(3, 5)}`), Number(`0x${hex.slice(5, 7)}`), 255);
        }
    }

    /**
      * @param target 目标节点或节点名字
      * @param bGray 是否置灰
      * @param recursion 是否递归
      */
    public static setGray(target: cc.Node, bGray: boolean, recursion: boolean = false): void {
        let node: cc.Node = null;
        // if (typeof target == "string") {
        //     node = this.getNodeByName(target);
        // } else {
        node = target;
        // }
        if (node) {
            const component = node.getComponent(cc.RenderComponent);
            if (component) {
                if (bGray) {
                    const variant = cc.MaterialVariant.createWithBuiltin('2d-gray-sprite', component);
                    if (variant) {
                        component.setMaterial(0, variant);
                    }
                } else {
                    const variant = cc.MaterialVariant.createWithBuiltin('2d-sprite', component);
                    if (variant) {
                        component.setMaterial(0, variant);
                    }
                }
            }
            if (recursion) {
                node.children.forEach((child) => this.setGray(child, bGray, recursion));
            }
        } else {
            // cc.warn(this.node.name + " setNormalGray 没找到节点：", target);
        }
    }

    public static getNdColorRGBA(Nd: cc.Node): string {
        const _cn = Nd.color;
        const _a = Math.floor((_cn.getA() / 255) * 100) / 100;
        const _c = `rgba(${_cn.getR()},${_cn.getG()},${_cn.getB()},${_a})`;
        return _c;
    }

    /** 根据消耗物品是否足够
     * 足够则绿色，不够则红色
     */
    public static costColor(bagNum: number, curNum: number): cc.Color {
        return bagNum >= curNum ? this.Green() : UtilColor.Red();
    }
}
