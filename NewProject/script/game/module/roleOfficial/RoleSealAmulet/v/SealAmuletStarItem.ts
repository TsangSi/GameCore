/*
 * @Author: myl
 * @Date: 2022-10-18 14:19:58
 * @Description:
 */
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { IAttrBase } from '../../../../base/attribute/AttrConst';
import { AttrInfo } from '../../../../base/attribute/AttrInfo';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletStarItem extends cc.Component {
    @property(cc.Node)
    private NdBg: cc.Node = null;
    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(cc.Label)
    private LabAtt: cc.Label = null;
    @property(cc.Label)
    private LabK: cc.Label = null;
    @property(cc.Node)
    private NdSelect: cc.Node = null;

    /** 更新数据 */
    public setData(data0: AttrInfo, data1: AttrInfo, angle: number, state: number): void {
        this.NdBg.children[0].active = state < 2;
        this.NdBg.children[1].active = state === 2;
        this.NdSelect.active = state === 1;
        // this.NdBg.angle = angle;
        const diff = data1.diff(data0);
        let diffAtt: IAttrBase = null;
        diff.attrs.forEach((att) => {
            if (att.value > 0) {
                diffAtt = att;
            }
        });
        this.LabTitle.string = diffAtt.name[0];
        // this.LabAtt.string = `${diffAtt.name}`;
        this.LabK.string = diffAtt.name;
        this.LabAtt.string = `+${diffAtt.value}`;
        if (state < 2) {
            this.LabK.node.color = UtilColor.Hex2Rgba(UtilColor.WhiteD);
            this.LabAtt.node.color = UtilColor.Hex2Rgba(UtilColor.GreenD);
        } else {
            this.LabK.node.color = UtilColor.Hex2Rgba(UtilColor.GreyV);
            this.LabAtt.node.color = UtilColor.Hex2Rgba(UtilColor.GreyV);
        }
        this.LabTitle.node.color = UtilColor.Hex2Rgba(state > 0 ? UtilColor.WhiteD : UtilColor.DarkStarColor);
        // UtilCocos.SetSpriteGray(this.NdBg, state < 1, true);
    }
}
