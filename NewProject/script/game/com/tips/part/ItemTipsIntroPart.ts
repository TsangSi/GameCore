/*
 * @Author: hwx
 * @Date: 2022-06-17 14:18:56
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsIntroPart.ts
 * @Description: 道具Tips简介部件
 */

import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { BaseItemTipsPart } from './BaseItemTipsPart';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsIntroPart extends BaseItemTipsPart {
    @property(cc.RichText)
    public RichIntro: cc.RichText = null;

    /**
     * 刷新
     */
    public refresh(): void {
        const description = UtilString.FormatArgs(this.itemModel.cfg.Description);
        this.RichIntro.string = `<color=${UtilColor.WhiteD}>${description.replace(/\\n/g, '\n')}</color>`;
    }
}
