/*
 * @Author: myl
 * @Date: 2022-12-22 14:41:46
 * @Description:
 */

import { UtilNum } from '../../../../../../app/base/utils/UtilNum';
import { i18n, Lang } from '../../../../../../i18n/i18n';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashCowShakeItem extends cc.Component {
    @property(cc.Label)
    private label: cc.Label = null;

    public setTip(tip: number, delay: number, nd: cc.Node): void {
        this.label.string = `${tip}${i18n.tt(Lang.com_rate)}`;
        this.scheduleOnce(() => {
            if (!nd.isValid) return;
            const xP = UtilNum.RandomInt(-300, 300);
            const yP = UtilNum.RandomInt(100, 300);
            this.node.setPosition(xP, yP);
            this.node.active = true;
            nd.addChild(this.node);
            cc.tween(this.node).to(0.4, { scale: 1.2 }).call(() => {
                this.node.destroy();
            }).start();
        }, delay);
    }
}
