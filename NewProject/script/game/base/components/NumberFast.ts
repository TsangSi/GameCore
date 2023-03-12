/*
 * @Author: zs
 * @Date: 2022-05-24 16:15:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-20 18:23:28
 * @FilePath: \SanGuo\assets\script\game\base\components\NumberFast.ts
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

/** 缓冲时间，控制由慢到快的节奏 */
const BUFFER_TIME = 0.2;
/** 每次间隔默认时间 */
const ONCE_TIME = 0.5;

/** 按钮按住枚举 */
enum EBtnEvent {
    /** 按住结束 */
    End = -1,
    /** 按住状态 */
    Touch = 0,
}
@ccclass
export class NumberFast extends cc.Component {
    @property(cc.Component.EventHandler)
    private clickEvents: cc.Component.EventHandler[] = [];
    /** 标记按住加的时间 */
    private touchDT: number = EBtnEvent.End;
    /** 间隔时间 */
    private onceTime: number = ONCE_TIME;
    /** 缓冲时间，处理由慢到快 */
    private bufferTime = BUFFER_TIME;
    private isTouchStart = false;
    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.isTouchStart = true;
            this.touchDT = EBtnEvent.Touch;
            this.resetTime();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => {
            if (!this.isTouchStart && this.touchDT <= EBtnEvent.Touch) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, dot-notation
            const hit: boolean = this.node['_hitTest'](e.touch.getLocation());
            // if (!this.node._uiProps.uiTransformComp.isHit(e.touch.getUILocation())) {
            if (!hit) {
                this.touchDT = EBtnEvent.End;
            } else if (this.touchDT === EBtnEvent.End) {
                this.touchDT = this.onceTime;
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.touchDT = EBtnEvent.End;
            this.isTouchStart = false;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.touchDT = EBtnEvent.End;
            this.isTouchStart = false;
        }, this);
    }

    protected update(dt: number): void {
        if (this.touchDT !== EBtnEvent.End) {
            this.touchDT += dt;
            if (this.touchDT > this.onceTime) {
                this.countTime(dt);
                this.clickEvents.forEach((e) => {
                    e.emit([]);
                });
            }
        }
    }

    /** 计算时间 */
    private countTime(dt: number) {
        this.onceTime += this.bufferTime;
        if (this.bufferTime > 0) {
            this.bufferTime -= dt;
        }
    }

    /** 重置时间 */
    private resetTime() {
        this.onceTime = ONCE_TIME;
        this.bufferTime = BUFFER_TIME;
    }
}
