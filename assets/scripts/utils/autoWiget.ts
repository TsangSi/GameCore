import { Component, view, _decorator } from 'cc';
import AutoResolution from './AutoResolution';

const { ccclass, property, menu } = _decorator;

@ccclass
@menu('自定义组件/autoWiget')
export default class autoWiget extends Component {
    @property
    public align = 5;// 方向参照小键盘八方向
    @property
    public keepEdge = true;// 是否保证到边的距离,false则为保持到中心点距离与分辨率成比例.ps:false不要轻易用,具体使用环境请参考mzc意见
    @property
    public notch = false;// 是否需要兼容刘海屏，如果需要，贴上面边的会下移{刘海高度}个像素@property
    @property
    public bottom = false;// 是否需要兼容屏幕底部，如果需要，贴上面边的会下移{底部适应}个像素

    public RX: number | null = null;
    public RY: number | null = null;

    private changeFunc: (...any: any[]) => void = undefined;

    protected start(): void {
        // const _self = this;
        this.changeFunc = () => {
            this.setPosition();
        };
        // E.I.addE(EId.On_ResolutionChange, _self.setPosition, _self);
        view.on('design-resolution-changed', this.changeFunc);
        this.setPosition();
    }
    protected onDestroy(): void {
        view.off('design-resolution-changed', this.changeFunc);
        // E.I.remE(EId.On_ResolutionChange, _self.setPosition, _self);
    }

    public setPosition(): void {
        let x = this.node.position.x;
        let y = this.node.position.y;
        if (this.RX == null) this.RX = x;
        if (this.RY == null) this.RY = y;
        if (this.align === 1 || this.align === 4 || this.align === 7) {
            if (this.keepEdge) {
                x = this.RX - AutoResolution.offsetX() / 2;
            } else {
                x = this.RX * AutoResolution.offsetScaleX();
            }
        }
        if (this.align === 3 || this.align === 6 || this.align === 9) {
            if (this.keepEdge) {
                x = this.RX + AutoResolution.offsetX() / 2;
            } else {
                x = this.RX * AutoResolution.offsetScaleX();
            }
        }
        if (this.align === 1 || this.align === 2 || this.align === 3) {
            if (this.keepEdge) {
                y = this.RY - AutoResolution.offsetY() / 2;
            } else {
                y = this.RY * AutoResolution.offsetScaleY();
            }
            // 屏幕底部
            // if (this.bottom) {   //需要适配底部
            //     y = y + 0;
            // }
        }
        if (this.align === 7 || this.align === 8 || this.align === 9) {
            if (this.keepEdge) {
                y = this.RY + AutoResolution.offsetY() / 2;
            } else {
                y = this.RY * AutoResolution.offsetScaleY();
            }
        }
        // 刘海屏
        // if (this.notch) {
        //     y = y - Game.I.notchHight;
        // }
        this.node.position.set(x, y);
    }
}
