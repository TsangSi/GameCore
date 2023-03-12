/*
 * @Author: hwx
 * @Date: 2022-06-17 14:17:55
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsAttrItem.ts
 * @Description: 道具Tips属性部件
 */

import { i18n, Lang } from '../../../../i18n/i18n';
import { ItemTipsAttrItemInfo } from '../ItemTipsConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsAttrItem extends cc.Component {
    @property(cc.Node)
    private NdStrength: cc.Node = null;

    @property(cc.Label)
    private LabStrengthLevel: cc.Label = null;

    @property(cc.Label)
    private LabStrengthAddAttrs: cc.Label = null;

    @property(cc.Label)
    private LabGoldLevel: cc.Label = null;

    @property(cc.Label)
    private LabGoldAddAttrs: cc.Label = null;

    @property(cc.Label)
    private LabTitle: cc.Label = null;

    @property(cc.RichText)
    private RichAttr: cc.RichText = null;

    /** 数据 */
    private _data: ItemTipsAttrItemInfo = null;

    public setData(data: ItemTipsAttrItemInfo): void {
        this._data = data;

        // 基础属性才展示强化属性
        if (data.strengthLv && data.strengthLv > 0) {
            this.NdStrength.active = true;
            this.LabStrengthLevel.string = `${i18n.tt(Lang.strength)}+${data.strengthLv}`;

            if (data.strengthAttrStr && data.strengthAttrStr.length > 0) {
                this.LabStrengthAddAttrs.string = data.strengthAttrStr;
            }
        } else {
            this.NdStrength.active = false;
            this.LabStrengthLevel.string = '';
            this.LabStrengthAddAttrs.string = '';
        }
        if (data.goldLv || data.goldAttrStr) {
            this.LabGoldLevel.node.parent.active = true;
            this.LabGoldAddAttrs.string = data.goldAttrStr || '';
            this.LabGoldLevel.string = `${i18n.tt(Lang.grade_to_gold)}+${data.goldLv || 1}`;
        } else {
            this.LabGoldLevel.node.parent.active = false;
            this.LabGoldAddAttrs.string = '';
            this.LabGoldLevel.string = '';
        }

        this.LabTitle.string = data.title;

        this.RichAttr.node.active = true;
        this.RichAttr.string = data.attrStr;

        // 动态大小，需要立即更新
        this.node.getComponent(cc.Layout).updateLayout();
    }
}
