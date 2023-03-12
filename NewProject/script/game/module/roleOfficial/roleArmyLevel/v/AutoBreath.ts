const { ccclass, property } = cc._decorator;

/** 呼吸效果 放大缩小 */
@ccclass
export class AutoBreath extends cc.Component {
    @property(cc.Integer)
    private time: number = 1;
    @property(cc.Integer)
    private scaleNum: number = 1.2;

    public onEnable(): void {
        this.node.setScale(1, 1, 1);
        const tween1 = cc.tween(this.node).to(this.time, { scale: this.scaleNum });
        const tween2 = cc.tween(this.node).to(this.time, { scale: 1 });
        cc.tween(this.node).repeatForever(tween1.then(tween2)).start();
    }

    public onDestroy(): void {
        this.node.setScale(1, 1, 1);
        cc.Tween.stopAllByTarget(this.node);
    }
}
