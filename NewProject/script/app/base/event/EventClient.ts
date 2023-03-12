import { RedDotCheckMgr } from '../../../game/module/reddot/RedDotCheckMgr';
import { BaseEvent } from './BaseEvent';
/** 普通逻辑事件管理器 */
export class EventClient extends BaseEvent {
    private static _Instance: EventClient = null;
    public static get I(): EventClient {
        if (!this._Instance) {
            this._Instance = new EventClient();
            this._Instance.init();
        }
        return this._Instance;
    }

    public init(): void {
        this.tag = '普通事件管理器';
    }
    /**
     * 发送事件
     * @param id 事件ID
     * @param args 参数
     * @returns 空
     */
    public emit(id: string, ...args: unknown[]): void {
        super.emit(id, ...args);
        RedDotCheckMgr.I.onEvent(id);
    }
}
