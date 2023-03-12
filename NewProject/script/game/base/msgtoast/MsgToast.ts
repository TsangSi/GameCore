/*
 * @Author: zs
 * @Date: 2022-04-07 18:21:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-30 15:27:54
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\msgtoast\MsgToast.ts
 * @Description:
 */
const { ccclass, property } = cc._decorator;

@ccclass
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MsgToast extends cc.Component {
    @property(cc.RichText)
    private rich: cc.RichText = null;
    // 目标Y
    private aimY = 0;

    private endtime = 0;
    private upTime = 600;
    private disappearTime = 1500;
    private startY = 0;

    public setInfo(str: string): void {
        // let tArr: Array<ToastInfo> = [];
        str = str.replace(/<b>/g, '');
        str = str.replace(/<\/b>/g, '');
        str = str.replace(/<u>/g, '');
        str = str.replace(/<\/u>/g, '');
        this.rich.string = `${str}`;
        this.rich.node.children.forEach((c) => {
            c.active = true;
        });
        this.rich.node.active = true;
        this.node.setPosition(0, -500);
        this.aimY = 50;
        this.node.opacity = 255;
        // UtilsCC.setOpacity(this.node, 255);
        // this.node.getComponent(UIOpacity).opacity = 255;
        this.endtime = Date.now() + this.upTime + this.disappearTime;
        this.node.active = true;
    }
    // 目标y
    public setAimY(aimY: number): void {
        this.aimY = aimY;
        const y = this.startY + this.aimY;
        this.node.setPosition(this.node.position.x, y);
    }
    // 上升期->消失时期(可能补充上升)->回收
    protected update() {
        const t = this.endtime - Date.now();
        if (t < 0) { // 到时间回收
            this.node.active = false;
            this.node.destroy();
        } else if (t < this.disappearTime) { // 消失期
            this.node.opacity = 255 * t / this.disappearTime;
        } else { // 上升期
            const y = this.startY + this.aimY - this.aimY * (t - this.disappearTime) / this.upTime;
            this.node.setPosition(this.node.position.x, y);
        }
    }
    protected onDisable() {
        if (this.rich) {
            this.rich.string = '';
            // rt.destroyAllChildren();
            const n = this.rich.node.getChildByName('labelLayout');
            if (n) n.destroy();
        }
    }
}
