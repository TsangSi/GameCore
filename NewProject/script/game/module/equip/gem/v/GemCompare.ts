/*
 * @Author: hrd
 * @Date: 2022-10-17 15:38:16
 * @Description:
 *
 */

import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { UtilSkillInfo } from '../../../../base/utils/UtilSkillInfo';
import WinBase from '../../../../com/win/WinBase';
import { GemCompareItem } from './GemCompareItem';

const { ccclass, property } = cc._decorator;

// ActiveSkillTip

@ccclass
export class GemCompare extends WinBase {
    @property(cc.ScrollView)
    private SvAttrs: cc.ScrollView = null;

    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    @property(cc.Node)
    private NdSkillLayout: cc.Node = null;

    /** 属性可滚动高度 */
    private canScrollHeight = 600;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => {
            this.close();
        }, this, { scale: 1 });
    }

    public init(params: unknown[]): void {
        const skills = params[0] as number[][];
        UtilCocos.LayoutFill(this.NdSkillLayout, (node, i) => {
            console.log(skills);
            node.getComponent(GemCompareItem).setData(skills[i]);
        }, skills.length);
        this.scheduleOnce(() => {
            // 更新滚动视图的大小
            // const svTrans = this.SvAttrs.getComponent(UITransform);3.4
            const svTrans = this.SvAttrs.node;
            // 动态大小，需要立即更新
            this.SvAttrs.content.getComponent(cc.Layout).updateLayout();
            // const contentTrans = this.SvAttrs.content.getComponent(UITransform);3.4
            const contentTrans = this.SvAttrs.content;
            if (contentTrans.height < this.canScrollHeight) {
                svTrans.height = contentTrans.height;
                this.SvAttrs.vertical = false;
            } else {
                svTrans.height = this.canScrollHeight;
                this.SvAttrs.vertical = true;
            }
        });
    }
}
