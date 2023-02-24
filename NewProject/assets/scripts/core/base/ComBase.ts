/*
 * @Author: zs
 * @Date: 2023-02-14 18:01:15
 * @Description:
 *
 */
import { Component, js, _decorator } from 'cc';
import { EventM, IEventM } from '../event/EventM';
import { Executor } from '../executor/Executor';
import { RecordNT, RecordObj, TFunc } from '../GConst';

const { ccclass } = _decorator;

@ccclass()
export class ComBase extends Component implements IEventM {
    protected onLoad(): void { /** */ }

    protected start(): void { /**  */ }

    protected onEnable(): void { /**  */ }

    protected update(): void { /**  */ }

    protected lateUpdate(): void { /**  */ }

    protected onDisable(): void { /**  */ }

    protected onDestroy(): void {
        for (const id in this.executors) {
            this.off(+id, this.executors[id].callback, this.executors[id].target());
        }
        this.executors = js.createMap(true);
    }

    private executors: RecordNT<Executor> = js.createMap(true);
    public on(id: number, func: TFunc, target: RecordObj): Executor {
        const executor = EventM.I.on(id, func, target);
        if (executor) {
            this.executors[id] = executor;
        }
        return executor;
    }

    public once(id: number, func: TFunc, target: RecordObj): Executor {
        const executor = EventM.I.once(id, func, target);
        if (executor) {
            this.executors[id] = executor;
        }
        return executor;
    }

    public off(id: number, func: TFunc, target: RecordObj): void {
        EventM.I.off(id, func, target);
    }
}
