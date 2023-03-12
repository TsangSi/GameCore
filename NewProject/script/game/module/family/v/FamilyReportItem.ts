import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';

const { ccclass, property } = cc._decorator;

@ccclass
export class FamilyReportItem extends cc.Component {
    @property(cc.Label)// 第x场
    private Lab1: cc.Label = null;
    @property(cc.Label)// 族长对阵候选人
    private Lab2: cc.Label = null;

    @property(cc.Node)// 左边胜利
    private NdWinLeft: cc.Node = null;
    @property(cc.Node)// 右边胜利
    private NdWinRight: cc.Node = null;

    @property(cc.Node)// 右边胜利
    private NdWatchVideo: cc.Node = null;

    public setData(data: ReportIdx): void {
        if (data) { // 有战报的情况下
            // 字体颜色
            this.Lab1.node.color = UtilColor.Hex2Rgba(UtilColor.NorN);// '#823d3d'
            this.Lab2.node.color = UtilColor.Hex2Rgba(UtilColor.NorN);// '#823d3d'

            // 候选人胜利
            if (data.Win !== 1) {
                this.NdWinRight.active = true;
                this.NdWinLeft.active = false;
            } else {
                this.NdWinLeft.active = true;
                this.NdWinRight.active = false;
            }
            // 观看视频按钮
            UtilCocos.SetSpriteGray(this.NdWatchVideo, false, true);
        } else { // 没有战报
            // 字体颜色
            this.Lab1.node.color = UtilColor.Hex2Rgba(UtilColor.GreyV);
            this.Lab2.node.color = UtilColor.Hex2Rgba(UtilColor.GreyV);

            this.NdWinLeft.active = false;
            this.NdWinRight.active = false;
            UtilCocos.SetSpriteGray(this.NdWatchVideo, true, true);
        }
    }
}
