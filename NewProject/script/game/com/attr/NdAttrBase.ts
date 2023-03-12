/*
 * @Author: zs
 * @Date: 2022-07-13 15:31:03
 * @FilePath: \SanGuo-2.4-main\assets\script\game\com\attr\NdAttrBase.ts
 * @Description:
 *
 */
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { IAttrBase, IShowAttrOption } from '../../base/attribute/AttrConst';
import { DynamicImage } from '../../base/components/DynamicImage';
import { UtilAttr } from '../../base/utils/UtilAttr';

const { ccclass, property } = cc._decorator;
/**
 * 只有基础属性 没有加成属性
 */
@ccclass
export class NdAttrBase extends cc.Component {
    @property(DynamicImage)
    private NdIcon: DynamicImage = null;

    @property(cc.Label)
    private LabKey: cc.Label = null;

    @property(cc.Label)
    private LabVal: cc.Label = null;

    public setAttr(data: IAttrBase, opt?: IShowAttrOption): void {
        const type = data.attrType;
        this.NdIcon.loadImage(UtilAttr.getIconByAttrType(type), 1, true);
        this.LabKey.string = `${data.name}`;
        this.LabVal.string = `${opt?.s || ':'}${data.value}`;
        if (opt?.nameC) {
            this.LabKey.node.color = UtilColor.Hex2Rgba(opt.nameC);
        }
        if (opt?.valueC) {
            this.LabVal.node.color = UtilColor.Hex2Rgba(opt.valueC);
        }
        if (opt?.ASize) {
            this.LabKey.fontSize = opt.ASize;
            this.LabVal.fontSize = opt.ASize;
        }
    }
}
