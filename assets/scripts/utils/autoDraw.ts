import {
 Component, Layout, UITransform, _decorator,
} from 'cc';
import AutoResolution from './AutoResolution';

const { ccclass, property, menu } = _decorator;
@ccclass
@menu('自定义组件/autoDraw')
export default class autoDraw extends Component {
    // 以下4种模式适用于界面部件
    // 46为左右拉伸,上下保持不变,
    // 28为上下拉伸,左右保持不变,
    // 456为左右拉伸,比例保持,所有上下跟着也会随着比例而变
    // 258为上下拉伸,比例保持,所以左右跟着也会随着比例而变

    // 以下3种模式适用于全屏物体
    // 111为上下左右拉伸,showAll模式,优点:不变形,内容全显,缺点:不到边
    // 555为上下左右拉伸,fullScreen模式,优点:到边,不变形,缺点:内容不全显
    // 999为上下左右拉伸,fullScreen+showAll模式,优点:到边,内容全显,缺点:变形
    @property
    public align = 5;
    @property
    public ctrlScale = false;// 是否控制Scale,默认false,false代表控制width和height,true代表控制scale
    @property
    public changeLayoutSpaceX = false;// 是否适用主页面底部按钮(主页面底部按钮，等比放置)
    public RX: number | null = null;
    public RY: number | null = null;
    public RSX: number | null= null;
    public RSY: number | null = null;
    public designX = 720;
    public designY = 1280;
    protected start(): void {
        // const _self = this;
        // E.I.addE(EId.On_ResolutionChange, _self.setPosition, _self);
        this.setPosition();
    }
    protected onDestroy(): void {
        // const _self = this;
        // E.I.remE(EId.On_ResolutionChange, _self.setPosition, _self);
    }
    public setPosition(): void {
        let width = this.node.getComponent(UITransform)?.width;
        let height = this.node.getComponent(UITransform)?.height;
        let scaleX = this.node.scale.x;
        let scaleY = this.node.scale.y;
        if (this.RX == null) this.RX = width;
        if (this.RY == null) this.RY = height;
        if (this.RSX == null) this.RSX = scaleX;
        if (this.RSY == null) this.RSY = scaleY;
        const mx = AutoResolution.rootWidth / this.designX;
        const my = AutoResolution.rootHeight / this.designY;
        if (this.align === 46) {
            if (this.ctrlScale) {
                scaleX = this.RSX * mx;
            } else {
                width = this.RX * mx;
            }
        }
        if (this.align === 28) {
            if (this.ctrlScale) {
                scaleY = this.RSY * my;
            } else {
                height = this.RY * my;
            }
        }
        if (this.align === 456) {
            if (this.ctrlScale) {
                scaleX = this.RSX * mx;
                scaleY = this.RSY * mx;
            } else {
                width = this.RX * mx;
                height = this.RY * mx;
            }
        }
        if (this.align === 258) {
            if (this.ctrlScale) {
                scaleX = this.RSX * my;
                scaleY = this.RSY * my;
            } else {
                width = this.RX * my;
                height = this.RY * my;
            }
        }
        if (this.align === 111) {
            //
        }
        if (this.align === 555) {
            if (this.ctrlScale) {
                scaleX = this.RSX * (mx > my ? mx : my);
                scaleY = this.RSY * (mx > my ? mx : my);
            } else {
                width = this.RX * (mx > my ? mx : my);
                height = this.RY * (mx > my ? mx : my);
            }
        }
        if (this.align === 999) {
            if (this.ctrlScale) {
                scaleX = this.RSX * mx;
                scaleY = this.RSY * my;
            } else {
                width = this.RX * mx;
                height = this.RY * my;
            }
        }
        this.node.getComponent(UITransform)?.setContentSize(width, height);
        this.node.setScale(scaleX, scaleY);
        if (this.changeLayoutSpaceX === true) { // 主页面底部按钮拉伸，bug单独处理，等宽排列
            const layout = this.node.getChildByName('New Layout')?.getComponent(Layout);
            if (layout) { // 底部按钮，总宽度648，5个间隙
                layout.spacingX = (width - 648) / 5;
            }
        }
    }
}
