/*
 * @Author: hwx
 * @Date: 2022-05-11 18:58:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-16 15:45:27
 * @FilePath: \SanGuo2.4\assets\script\game\base\components\TickTimer.ts
 * @Description: 滴答定时器
 */
import { UtilTime } from '../../../app/base/utils/UtilTime';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';

const {
    ccclass, property, requireComponent, menu,
} = cc._decorator;

enum EventType {
    TICK,
    END
}

@ccclass
@requireComponent(cc.Label)
@menu('常用组件/TickTimer')
export class TickTimer extends BaseCmp {
    @property({ displayName: '滴答总秒', min: 0 })
    public total: number = 0;

    @property({ displayName: '计时格式', tooltip: '默认：%dd天%HH时%mm分%ss秒' })
    public format: string = '%dd天%HH时%mm分%ss秒';

    @property({ displayName: '格式固定' })
    protected fixedFmt: boolean = false;

    @property({ displayName: '填充零' })
    protected fillZero: boolean = false;

    @property({ displayName: '顺时针方向', tooltip: '顺时针方向递增计时，反之递减倒计时' })
    protected clockwise: boolean = false;

    /** 侦听滴答事件列表 */
    @property({ type: cc.Component.EventHandler, displayName: '滴答事件' })
    private tickEventHandler: cc.Component.EventHandler[] = [];

    /** 侦听结束事件列表 */
    @property({ type: cc.Component.EventHandler, displayName: '结束事件' })
    private endEventHandler: cc.Component.EventHandler[] = [];

    /** 标签控件 */
    private _label: cc.Label = null;
    /** 当前秒 */
    private _second: number = 0;
    /** 滴答中 */
    private _ticking: boolean = false;
    /** 暂停 */
    private _pause: boolean = false;

    protected onLoad(): void {
        super.onLoad();

        // 如果编辑器中设置了必要值，加载时就自动开始计时
        if (this.total > 0 && this.format.length > 0) {
            this.tick(this.total, this.format, this.fixedFmt, this.fillZero, this.clockwise);
        }
    }

    /**
     * 开始计时，不传参数时，默认使用编辑器设置的值
     * @param total 滴答总秒（秒）
     * @param format 格式化
     * @param fixedFmt 固定格式
     * @param fillZero 填充零
     * @param clockwise 是否顺时针方向，默认否
     */
    public tick(total: number, format: string, fixedFmt?: boolean, fillZero?: boolean, clockwise?: boolean): void {
        // 检查参数，存在就替换
        this.total = total;
        this.format = format;
        this.fixedFmt = fixedFmt;
        this.fillZero = fillZero;
        this.clockwise = clockwise;

        this._second = this.clockwise ? 0 : this.total;
        this.setTime(this._second);
        this._ticking = true;
    }

    /**
     *
     * @param cur 计时器开始时间
     * @param total 总时间
     * @param format 格式
     * @param fixedFmt 固定
     * @param fillZero 填充0
     * @param clockwise 顺（增）还是逆时针（减）
     */
    public tick2(cur: number, total: number, format: string, fixedFmt?: boolean, fillZero?: boolean, clockwise?: boolean): void {
        this._second = cur;
        this.total = total;
        this.format = format;
        this.fixedFmt = fixedFmt;
        this.fillZero = fillZero;
        this.clockwise = clockwise;

        this.setTime(this._second);
        this._ticking = true;
    }

    /** 每秒更新 */
    protected updatePerSecond(): void {
        super.updatePerSecond();

        if (!this._ticking) return;
        if (this._pause) return;

        this._ticking = this.clockwise ? this._second < this.total : this._second > 0;
        if (this._ticking) {
            // 根据顺时针方向递增或递减
            const second = this.clockwise ? ++this._second : --this._second;
            this.setTime(second);
            this.tickEventHandler.forEach((event) => {
                event.emit([second]);
            });
        } else {
            this.setTime(this._second);
            this.endEventHandler.forEach((event) => {
                event.emit([]);
            });
        }
    }

    /**
     * 设置时间
     * @param second
     */
    private setTime(second: number): void {
        if (!this._label) {
            this._label = this.getComponent(cc.Label);
        }
        this._label.string = UtilTime.FormatTime(second, this.format, this.fillZero, this.fixedFmt);
    }

    /**
     * 暂停计时
     */
    public pause(): void {
        this._pause = true;
    }

    /**
     * 恢复计时
     */
    public resume(): void {
        this._pause = false;
    }

    /**
     * 增加监听滴答事件
     * @param target 目标节点
     * @param component 节点组件名
     * @param handler 组件函数名
     * @param customEventData 自定义事件参数字符串
     */
    public addTickEventHandler(target: cc.Node, component: string, handler: string, customEventData = ''): void {
        this.addEventHandler(EventType.TICK, target, component, handler, customEventData);
    }

    /**
     * 删除监听滴答事件
     * @param target 目标节点
     * @param component 节点组件名
     * @param handler 组件函数名
     */
    public removeTickEventHandler(target: cc.Node, component: string, handler: string): void {
        this.removeEventHandler(EventType.TICK, target, component, handler);
    }

    /**
     * 增加监听结束事件
     * @param target 目标节点
     * @param component 节点组件名
     * @param handler 组件函数名
     * @param customEventData 自定义事件参数字符串
     */
    public addEndEventHandler(target: cc.Node, component: string, handler: string, customEventData = ''): void {
        this.addEventHandler(EventType.END, target, component, handler, customEventData);
    }

    /**
     * 删除监听结束事件
     * @param target 目标节点
     * @param component 节点组件名
     * @param handler 组件函数名
     */
    public removeEndEventHandler(target: cc.Node, component: string, handler: string): void {
        this.removeEventHandler(EventType.END, target, component, handler);
    }

    /**
     * 增加监听事件
     * @param type 事件类型
     * @param target 目标节点
     * @param component 节点组件名
     * @param handler 组件函数名
     * @param customEventData 自定义事件参数字符串
     */
    private addEventHandler(type: EventType, target: cc.Node, component: string, handler: string, customEventData = ''): void {
        const event = new cc.Component.EventHandler();
        event.target = target;
        event.component = component;
        event.handler = handler;
        event.customEventData = customEventData;
        (type === EventType.TICK ? this.tickEventHandler : this.endEventHandler).push(event);
    }

    /**
     * 删除监听事件
     * @param type 事件类型
     * @param target 目标节点
     * @param component 节点组件名
     * @param handler 组件函数名
     */
    private removeEventHandler(type: EventType, target: cc.Node, component: string, handler: string): void {
        const eventHandler = type === EventType.TICK ? this.tickEventHandler : this.endEventHandler;
        eventHandler.some((event, index) => {
            if (event.target === target && event.component === component && event.handler === handler) {
                eventHandler.splice(index, 1);
                return true;
            }
            return false;
        });
    }
}
