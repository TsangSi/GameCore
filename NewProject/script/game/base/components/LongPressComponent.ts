/*
 * @Author: hrd
 * @Date: 2022-08-11 21:58:40
 * @Description:
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class LongPressComponent extends cc.Component {
    /** 点击回调 */
    @property(cc.Component.EventHandler)
    private clicktHandler: cc.Component.EventHandler = null;

    @property
    private LongTime = 1;

    public onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancle, this);
    }

    private _isLongPress: boolean = false;
    private _timer = null;
    private touchStart() {
        if (this._timer) return;
        this._timer = () => {
            this._timer = null;
            this._isLongPress = true;
        };
        this.scheduleOnce(this._timer, this.LongTime);
    }

    private touchEnd() {
        if (this.clicktHandler) {
            cc.Component.EventHandler.emitEvents([this.clicktHandler], this._isLongPress);
        }
        this.clearTimer();
    }

    private touchCancle() {
        this.clearTimer();
        console.log('取消触摸');
    }

    private clearTimer() {
        this._isLongPress = false;
        if (this._timer) {
            this.unschedule(this._timer);
            this._timer = null;
        }
    }

    protected onDisable(): void {
        this.clearTimer();
    }

    protected onDestory(): void {
        this.clearTimer();
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancle, this);
    }
}
