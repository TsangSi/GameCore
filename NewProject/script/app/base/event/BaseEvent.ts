const fastRemoveAt = cc.js.array.fastRemoveAt;

type EventType = string | number;/** 事件类型 */
/** 事件回调处理器者类型 */
type EventHandler = { cb: (...args: unknown[]) => void, target?: unknown, once?: boolean };

/** 事件基类 */
export abstract class BaseEvent {
    /** 标签 */
    protected tag: string = '标签';
    /** 事件回调处理者字典 */
    private _handlers: { [key: string]: EventHandler[] } = cc.js.createMap(true);

    /**
     * 初始化，子类实现
     */
    public abstract init(): void;

    /**
     * 监听事件
     * @param id 事件ID
     * @param cb 回调
     * @param target 目标对象
     * @param once 是否只触发一次
     * @returns 下标或长度
     */
    public on(id: EventType, cb: (...args: unknown[]) => void, target?: unknown, once?: boolean): void {
        // 组装事件回调处理
        const objHandler: EventHandler = { cb, target, once };
        // 查找该对象监听事件列表，没有就新建空列表
        let handlerList: EventHandler[] = this._handlers[id];
        if (!handlerList) {
            handlerList = [];
            this._handlers[id] = handlerList;
        }

        // 侦听列表中存在了就刷新并返回刷新的列表下标
        for (let i = 0; i < handlerList.length; i++) {
            const objHandler = handlerList[i];
            if (objHandler.cb === cb && target === objHandler.target) {
                return;
            }
        }

        // 添加事件并返回事件列表长度
        handlerList.push(objHandler);
    }

    /**
     * 监听事件单次，触发后自动移除监听
     * @param id
     * @param cb
     * @param target
     */
    public once(id: EventType, cb: () => void, target?: unknown): void {
        this.on(id, cb, target, true);
    }

    /**
     * 取消监听
     * @param id 事件ID
     * @param cb 回调
     * @param target 目标对象
     * @returns 空
     */
    public off(id: EventType, cb: (...args: unknown[]) => void, target?: unknown): void {
        if (CC_EDITOR) { return; }
        // 查找该对象监听事件列表
        const handlerList = this._handlers[id];
        if (!handlerList) {
            if (id === undefined) {
                console.log(id);
            }
            console.warn(this.tag, `取消监听${id}`, '事件不存在！');
            return;
        }

        // 删除监听事件
        for (let i = 0; i < handlerList.length; i++) {
            const objHandler = handlerList[i];
            if (objHandler.cb === cb && target === objHandler.target) {
                handlerList.splice(i--, 1);
                break;
            }
        }

        // 空列表就抹去
        if (handlerList.length === 0) {
            delete this._handlers[id];
        }
    }

    /**
     * 取消对象所有事件监听（慎用）
     * @param target 目标对象
     */
    public targetOff(target: unknown): void {
        // 查找该对象监听事件列表
        for (const id in this._handlers) {
            const handlerList = this._handlers[id];
            // 删除监听事件
            for (let i = 0; i < handlerList.length; i++) {
                const objHandler = handlerList[i];
                if (objHandler && objHandler.target === target) {
                    fastRemoveAt(handlerList, i--);

                    // 空列表就抹去
                    if (handlerList.length === 0) {
                        delete this._handlers[id];
                    }
                }
            }
        }
    }

    /**
     * 取消事件类型所有事件监听（慎用）
     * @param id 事件ID
     */
    public typeOff(id: EventType): void {
        // 查找该对象监听事件列表
        const handlerList = this._handlers[id];
        if (handlerList) {
            delete this._handlers[id];
        }
    }

    /**
     * 发送事件
     * @param id 事件ID
     * @param args 参数
     * @returns 空
     */
    public emit(id: EventType, ...args: unknown[]): void {
        // 查找该对象监听事件列表
        const handlerList = this._handlers[id];
        if (!handlerList) {
            // console.warn(this.tag, `发送事件 ${id}失败，事件不存在！`);
            return;
        }

        // 调用该对象事件回调
        for (let i = 0; i < handlerList.length; i++) {
            const objHandler = handlerList[i];
            if (objHandler.target) {
                if (objHandler.target instanceof Object && !cc.isValid(objHandler.target, true)) {
                    // 删除监听事件
                    handlerList.splice(i--, 1);
                    // 空列表就抹去
                    if (handlerList.length === 0) {
                        delete this._handlers[id];
                    }
                    continue;
                } else {
                    objHandler.cb.apply(objHandler.target, args);
                }
            } else {
                objHandler.cb.apply(args);
            }

            // 监听一次的事件，发送后就取消监听
            if (objHandler.once) {
                // 删除监听事件
                handlerList.splice(i--, 1);
                // 空列表就抹去
                if (handlerList.length === 0) {
                    delete this._handlers[id];
                }
                continue;
            }
        }
    }

    /**
     * 检查指定事件是否已注册回调
     * @param id 事件ID
     * @param cb 回调
     * @param target 目标对象
     * @returns {boolean}
     */
    public hasEventListener(id: EventType, cb: (...args: unknown[]) => void, target?: unknown): boolean {
        // 查找该对象监听事件列表
        const handlerList = this._handlers[id];
        if (handlerList) {
            // 删除监听事件
            for (let i = 0; i < handlerList.length; i++) {
                const objHandler = handlerList[i];
                if (objHandler.cb === cb && target === objHandler.target) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取事件监听的数量
     * @param id
     * @returns number
     */
    public getEventListenerCount(id: EventType): number {
        // 查找该对象监听事件列表
        const handlerList = this._handlers[id];
        if (handlerList) {
            // 删除监听事件
            return handlerList.length;
        }
        return 0;
    }

    /**
     * 打印事件信息
     * @param idOrTarget 事件ID | 目标对象，为空时打印全部事件
     */
    public print(idOrTarget?: EventType | unknown): void {
        const type = typeof idOrTarget;
        if (type === 'string' || type === 'number') {
            const id = idOrTarget as EventType;
            console.log(this.tag, `${id}事件：`, this._handlers[id]);
        } else if (idOrTarget) {
            // 查找该对象监听事件列表
            const targetHandlerList: EventHandler[] = [];
            for (const key in this._handlers) {
                const handlerList = this._handlers[key];
                // 删除监听事件
                for (let i = 0; i < handlerList.length; i++) {
                    const objHandler = handlerList[i];
                    if (idOrTarget === objHandler.target) {
                        targetHandlerList.push(objHandler);
                    }
                }
            }
            console.log(this.tag, idOrTarget, `目标监听事件：`, targetHandlerList);
        } else {
            console.log(this.tag, '所有事件：', this._handlers);
        }
    }
}
