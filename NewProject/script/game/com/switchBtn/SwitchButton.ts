import { UtilColor } from '../../../app/base/utils/UtilColor';

const { ccclass, property } = cc._decorator;

@ccclass
export class SwitchButton extends cc.Component {
    @property(cc.Node)
    private btnSwitch: cc.Node = null;// 左右滑动的按钮

    @property(cc.Node)
    private labOpen: cc.Node = null;// 开
    @property(cc.Node)
    private labClose: cc.Node = null;// 关

    @property(cc.Node)
    private sprOpen: cc.Node = null;// 开
    @property(cc.Node)
    private sprClose: cc.Node = null;// 关

    public state: boolean = false;

    public setState(state: boolean): void {
        this.state = state;
        const x = this.state ? 32 : -32;
        this.btnSwitch.x = x;
        this.labOpen.active = this.state;
        this.sprOpen.active = this.state;
        this.labClose.active = !this.state;
        this.sprClose.active = !this.state;
    }
}
