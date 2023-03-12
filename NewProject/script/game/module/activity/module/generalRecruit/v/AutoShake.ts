/*
 * @Author: myl
 * @Date: 2022-12-03 15:59:45
 * @Description:
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoShake extends cc.Component {// 自动呼吸
    @property
    private time: number = 1.2;
    @property(cc.Integer)
    private startX: number = 28;
    @property(cc.Integer)
    private endX: number = 0;

    protected onEnable(): void {
        // this.startAni();
    }

    protected onDisable(): void {
        this.node.x = this.startX;
        cc.Tween.stopAllByTarget(this.node);
    }

    public startAni(): void {
        this.node.x = this.startX;
        const tween1 = cc.tween(this.node).to(this.time, { x: this.endX });
        const tween2 = cc.tween(this.node).to(this.time, { x: this.startX });
        cc.tween(this.node).repeatForever(tween1.then(tween2)).start();
    }

    public stopAni(): void {
        this.node.x = 3;
        cc.Tween.stopAllByTarget(this.node);
    }
}
