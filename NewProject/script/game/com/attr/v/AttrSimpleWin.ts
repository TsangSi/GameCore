/*
 * @Author: myl
 * @Date: 2022-11-25 15:56:25
 * @Description:
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../i18n/i18n';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../win/WinBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AttrSimpleWin extends WinBase {
    @property(cc.RichText)
    private contentRich: cc.RichText = null;

    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(cc.Node)
    private NdContent1: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    public init(data: unknown[]): void {
        if (data && data[0]) {
            const tit = data[0] as string;
            this.LabTitle.string = tit;
        }

        // 属性信息（单独处理）
        if (data && data[1]) {
            const attrInfo = data[1] as AttrInfo;
            let attStr = '';
            attrInfo.attrs.forEach((att) => {
                attStr += `${att.name}: <color=${UtilColor.GreenD}>+${att.value}</c>\n`;
            });
            if (attStr.length <= 0) {
                attStr = i18n.tt(Lang.com_null);
            }
            this.contentRich.string = attStr;
        }

        if (data && data[2]) {
            // const wPos = data[2] as cc.Vec2;
            // this.scheduleOnce(() => {
            //     const nPos = this.node.convertToNodeSpaceAR(cc.v2(this.node.width / 2, wPos.y - this.NdContent1.height));
            //     this.NdContent1.setPosition(nPos);
            // });
        } else {
            // this.NdContent1.setPosition(0, 0);
        }

        UtilGame.Click(this.node, () => {
            this.close();
        }, this, { scale: 1 });

        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
    }
}
