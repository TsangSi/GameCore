/*
 * @Author: hwx
 * @Date: 2022-03-28 14:41:07
 * @LastEditors: hwx
 * @LastEditTime: 2022-03-29 11:28:42
 * @FilePath: \SanGuo\assets\script\base\event\EventProto.ts
 * @Description: 网络协议事件
 */

import { BaseEvent } from './BaseEvent';

export class EventProto extends BaseEvent {
    private static _Instance: EventProto = null;
    public static get I(): EventProto {
        if (!this._Instance) {
            this._Instance = new EventProto();
            this._Instance.init();
        }
        return this._Instance;
    }

    public init(): void {
        this.tag = '协议事件管理器';
    }
}
