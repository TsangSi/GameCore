/*
 * @Author: myl
 * @Date: 2022-08-16 16:24:16
 * @Description:
 */
import { DynamicImage } from '../../../base/components/DynamicImage';
import { RES_ENUM } from '../../../const/ResPath';
import { FuncAddState } from '../VipConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class VipContentItem extends cc.Component {
    @property(DynamicImage)
    private tipSpr: DynamicImage = null;

    @property(cc.RichText)
    private tipLab: cc.RichText = null;

    @property(cc.Label)
    private numLab: cc.Label = null;

    public setData(data: { funcState: FuncAddState, desc: string }): void {
        const contents = data.desc.split('：');

        this.tipLab.string = `${contents[0]}${contents.length > 1 ? ':' : ''}`;
        this.numLab.string = contents[1] || '';
        // console.log(data.funcState, '功能状态');
        if (data.funcState === 0) {
            this.tipSpr.node.active = false;
        } else {
            this.tipSpr.node.active = true;
            this.tipSpr.loadImage(`${RES_ENUM.Com_Font_Com_Img_Vip}${data.funcState === 1 ? 'xinzeng' : 'tisheng'}`, 1, true);
        }
    }
}
