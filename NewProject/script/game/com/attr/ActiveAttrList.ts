/*
 * @Author: wangxina
 * @Date: 2022-07-18 11:01:08
 */

import { UtilColor } from '../../../app/base/utils/UtilColor';

const { ccclass, property } = cc._decorator;

export interface ActiveInfo {
    infoName: string,
    effect: string
}

/**
 *  单段描述
 *  @param title 标题内容
 *  @param data 内容
 *  @param infoColor 可选 内容颜色
 *  @param titleColor k可选 标题颜色
 */
export interface ActiveInfoSingle {
    title: string,
    data: string,
    infoColor?: string,
    titleColor?: string
    /** 是否满级 */
    isFull?: boolean
}

@ccclass
export class ActiveAttrList extends cc.Component {
    @property(cc.Label)
    public LbTitel: cc.Label = null;
    @property(cc.Node)
    public NdActiveInfo: cc.Node = null;
    @property(cc.Node)
    public NdActiveContent: cc.Node = null;
    @property(cc.Node)
    public NdSingle: cc.Node = null;

    /**
     * 双列模式 用于进阶练神属性
     * @param title 标题名
     * @param data 描述内容，数组。若只有一段可以只传一个
     * @param infoColor 描述内容字体颜色，默认
     * @param TitleColor 标题颜色
     */
    public setDoubleData(title: string, data: ActiveInfo[], infoColor = UtilColor.GreenD, TitleColor = UtilColor.GoldD): void {
        this.setTitle(title, TitleColor);

        data.forEach((value) => {
            const tempInfo = cc.instantiate(this.NdActiveInfo);
            tempInfo.active = true;
            const LbLifet = tempInfo.getChildByName('LbLifet');
            const LbRight = tempInfo.getChildByName('LbRight');
            LbLifet.getComponent(cc.Label).string = value.infoName;
            LbRight.getComponent(cc.Label).string = value.effect;
            LbLifet.getComponent(cc.Label).node.color = UtilColor.Hex2Rgba(infoColor);
            LbRight.getComponent(cc.Label).node.color = UtilColor.Hex2Rgba(infoColor);
            this.NdActiveContent.addChild(tempInfo);
        });
        this.NdActiveContent.getComponent(cc.Layout).updateLayout();
    }

    /**
     * 整段模式 用于
     * @param title 标题内容
     * @param data 描述内容 富文本单色可以直接穿争端颜色到infoColor
     * @param infoColor 可选 描述颜色
     * @param TitleColor 可选 标题颜色
     */
    public setSingle(singleData: ActiveInfoSingle): void {
        const NdChild = this.NdActiveContent.children;
        const infoColor = singleData.infoColor ? singleData.infoColor : UtilColor.WhiteD;
        let lbSinge: cc.RichText = null;
        if (NdChild.length > 0) {
            NdChild[0].active = true;
            lbSinge = NdChild[0].getComponent(cc.RichText);
        } else {
            const singe = cc.instantiate(this.NdSingle);
            singe.active = true;
            singe.parent = this.NdActiveContent;
            lbSinge = singe.getComponent(cc.RichText);
        }
        lbSinge.string = `<color=${infoColor}>${singleData.data}</color>`;
        this.setTitle(singleData.title, singleData.titleColor);
    }

    private setTitle(text: string, color: string = UtilColor.GoldD) {
        this.LbTitel.string = text;
        this.LbTitel.node.color = UtilColor.Hex2Rgba(color);
    }
}
