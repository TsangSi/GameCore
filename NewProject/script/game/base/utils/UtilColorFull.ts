/*
 * @Author: myl
 * @Date: 2022-11-15 10:42:54
 * @Description:
 */

import { UtilColor } from '../../../app/base/utils/UtilColor';
import { ItemQuality } from '../../com/item/ItemConst';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export class UtilColorFull {
    public static cahceMat = {};// 缓存下，防止重复加载材质

    public static setColorFull(lab: cc.Label, isDarkBg?: boolean): void {
        if (CC_EDITOR) return;
        if (!lab || !lab.node) return;
        lab.node.color = new cc.Color(255, 255, 255, 1);// 颜色需要还原

        const path = 'effects/ColorFull';
        const isLight = isDarkBg ? 0.0 : 1.0;

        // if (!this.cahceMat[path]) {
        cc.resources.load(path, cc.Material, null, (error, mat: cc.Material) => {
            // lab.getMaterial(0)
            lab.setMaterial(0, mat);
            lab.node.color = new cc.Color(255, 255, 255, 1);
            // 此处的getMaterial 不可以改为mat ;
            // getMaterial的时候，会复制一份 材质。否则当其他label调用这里的时候。会导致，当前这个mat是公用的
            lab.getMaterial(0).setProperty('isLight', isLight);
            lab.getMaterial(0).setProperty('isColorFull', 1.0);
        });
        // } else {
        //     // 当前的材质，是否等于彩色材质
        //     // if()
        //     lab.node.color = new cc.Color(255, 255, 255, 1);
        //     lab.setMaterial(0, this.cahceMat[path]);
        //     lab.getMaterial(0).setProperty('isLight', isLight);
        //     lab.getMaterial(0).setProperty('isColorFull', 1.0);
        // }
    }

    // 还原材质 list可能需要
    public static resetMat(lab: cc.Label): void {
        if (CC_EDITOR) return;
        if (!lab || !lab.node) return;
        const materialName = lab.getMaterial(0)?.name;
        if (!materialName) return;
        if (materialName.indexOf('builtin-2d-sprite') !== -1) {
            return;
        }
        // if (lab.node) {
        //     lab.node.color = new cc.Color(255, 255, 255, 1);
        // }
        lab.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'));
    }

    /** 彩色字体处理 */
    public static setQuality(lab: cc.Label, quality: number, isDark: boolean = false): void {
        if (CC_EDITOR) return;
        if (quality === ItemQuality.COLORFUL) {
            this.setColorFull(lab, isDark);
        } else {
            this.resetMat(lab);
        }
    }

    /** 彩色字体处理 颜色字符串 */
    public static setColorString(lab: cc.Label, colorString: string): void {
        if (CC_EDITOR) return;
        if (colorString === UtilColor.ColorFullN || colorString === UtilColor.ColorFullD) {
            this.setColorFull(lab, colorString === UtilColor.ColorFullN);
        } else {
            this.resetMat(lab);
        }
    }
}
