/*
 * @Author: hwx
 * @Date: 2022-06-23 12:00:03
 * @FilePath: \SanGuo\assets\script\game\base\components\BreathingTween.ts
 * @Description: 呼吸缓动组件
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class BreathingTween extends cc.Component {
    protected onEnable(): void {
        this.play();
    }

    protected onDisable(): void {
        this.stop();
    }

    private play(): void {
        cc.tween(this.node)
            .to(1, { scale: 1.5 })
            .delay(0.1)
            .to(1, { scale: 1 })
            .union()
            .repeatForever()
            .start();
    }

    private stop(): void {
        cc.Tween.stopAllByTarget(this.node);
    }
}
