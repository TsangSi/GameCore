/*
 * @Author: hrd
 * @Date: 2022-07-20 11:22:50
 * @FilePath: \SanGuo\assets\script\game\entity\ActorBloodBox.ts
 * @Description:
 *
 */
import BaseCmp from '../../app/core/mvc/view/BaseCmp';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActorBloodBox extends BaseCmp {
    @property(cc.Layout)
    private BuffLayer: cc.Layout = null;
    @property(cc.Layout)
    private BarLayer: cc.Layout = null;
    @property(cc.ProgressBar)
    private HpBar: cc.ProgressBar = null;

    public showBarLayer(v: boolean): void {
        this.BarLayer.node.active = v;
    }

    public showBuffLayer(v: boolean): void {
        this.BuffLayer.node.active = v;
    }

    public setHpBar(v: number): void {
        this.HpBar.progress = v;
    }

    public getBuffLayer(): cc.Layout {
        return this.BuffLayer;
    }
}
