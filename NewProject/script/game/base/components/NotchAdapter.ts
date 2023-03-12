import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import { LayerMgr } from '../main/LayerMgr';

const { ccclass, property, menu } = cc._decorator;

/**
 * 根据平台下发的刘海屏、底部偏移高度去适配
 */
@ccclass
@menu('适配/NotchAdapter')
export default class NotchAdapter extends cc.Component {
    @property({
        visible(this: NotchAdapter) {
            return !this.isBottom;
        },
    })
    /** 顶部偏移 */
    public isTop: boolean = false;

    @property({
        visible(this: NotchAdapter) {
            return !this.isTop;
        },
    })
    /** 底部偏移 */
    public isBottom: boolean = false;

    private widget: cc.Widget;
    private originalWidgetTop: number = 0;
    private originalWidgetBottom: number = 0;
    private originalY: number = 0;

    protected onLoad(): void {
        EventClient.I.on(E.UI.NotchHeightChange, this.onNotchHeightChange, this);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.UI.NotchHeightChange, this.onNotchHeightChange, this);
    }

    protected start(): void {
        this.widget = this.getComponent(cc.Widget);
        if (this.widget && this.widget.enabled) {
            if (this.widget.isAlignTop) {
                this.originalWidgetTop = this.widget.top;
            }
            if (this.widget.isAlignBottom) {
                this.originalWidgetBottom = this.widget.bottom;
            }
        } else {
            this.originalY = this.node.y;
        }

        this.onNotchHeightChange();
    }

    public onNotchHeightChange(): void {
        const notchHeight = LayerMgr.I.notchHeight;
        const bottomHeight = LayerMgr.I.bottomHeight;
        // 小于设备分辨率的不做处理
        if (cc.view.getDesignResolutionSize().height < (1280 + notchHeight + bottomHeight)) {
            console.log('物理分辨率小于游戏设计分辨率，忽略异形屏高度适配');
            return;
        }

        if (this.isTop && notchHeight > 0) {
            if (this.widget && this.widget.enabled && this.widget.isAlignTop) {
                this.widget.top = this.originalWidgetTop + notchHeight;
                this.widget.updateAlignment();
            } else {
                this.node.y = this.originalY - notchHeight;
            }
        }

        if (this.isBottom && bottomHeight > 0) {
            if (this.widget && this.widget.enabled && this.widget.isAlignBottom) {
                this.widget.bottom = this.originalWidgetBottom + bottomHeight;
                this.widget.updateAlignment();
            } else {
                this.node.y = this.originalY + bottomHeight;
            }
        }
    }
}
