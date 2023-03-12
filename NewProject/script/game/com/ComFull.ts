/*
 * @Author: wangxina
 * @Date: 2022-07-21 12:00:37
 * @FilePath: \SanGuo2.4\assets\script\game\com\ComFull.ts
 */
import { UtilColor } from '../../app/base/utils/UtilColor';
import { LocalizedLabel } from '../../i18n/LocalizedLabel';

const { ccclass, property } = cc._decorator;

@ccclass
export class ComFull extends cc.Component {
    @property(LocalizedLabel)
    protected lzLabel: LocalizedLabel = null;

    /**
     * 设置自定义字体，可选传入颜色，默认#67413D80
     * @param DataId : string 传入指定文案
     * @param cc.Color ： string  颜色
     */
    public setString(DataId: string, color = UtilColor.NorVOpacity): void {
        this.node.getChildByName('Label').getComponent(LocalizedLabel).destroy();
        this.node.getComponentInChildren(cc.Label).string = DataId;
        this.node.getComponentInChildren(cc.Label).node.color = UtilColor.Hex2Rgba(color);
    }
}
