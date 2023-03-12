/*
 * @Author: hwx
 * @Date: 2022-07-19 17:16:48
 * @FilePath: \SanGuo\assets\script\game\com\attr\AttrItemA.ts
 * @Description: 属性项A
 */
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../i18n/i18n';
import { IAttrBase } from '../../base/attribute/AttrConst';
import { DynamicImage } from '../../base/components/DynamicImage';
import { UtilAttr } from '../../base/utils/UtilAttr';

const { ccclass, property } = cc._decorator;

@ccclass
export class AttrItemA extends BaseCmp {
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;

    @property(cc.Label)
    private LabNameValue: cc.Label = null;

    public init(...param: unknown[]): void {
        const attr = param[0] as IAttrBase;

        this.SprIcon.loadImage(UtilAttr.getIconByAttrType(attr.attrType), 1, true);

        const title = i18n.tt(Lang[`com_attr_${attr.attrType}_name`]);
        this.LabNameValue.string = `${title} +${attr.value}`;
    }
}
