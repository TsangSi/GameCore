import { Executor } from '../../../app/base/executor/Executor';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { WinTabPage } from './WinTabPage';

export class WinTabPageProxy extends WinTabPage {
    /** 添加代理预制体 */
    protected addPropertyPrefab(compName: string, path: string, parent: cc.Node, func?: (n: cc.Node) => void): void {
        const isLoad = this[`_is${compName}`];
        const funcs: Executor[] = this[`_${compName}Funcs`] = this[`_${compName}Funcs`] || [];
        if (!isLoad) {
            this[`is${compName}`] = true;
            ResMgr.I.showPrefab(path, parent, (e, n) => {
                if (e) {
                    this[`_is${compName}`] = false;
                    return;
                }
                if (func) {
                    func(n);
                }
                this[`_${compName}`] = n.getComponent(compName);
                funcs.forEach((ex) => {
                    ex.invoke();
                    ex.clear();
                    ex = undefined;
                });
                funcs.length = 0;
            });
        }
    }

    /** 异步预制体代理接口 */
    protected proxyFunc<T>(compName: string, funcName: string, ...args: any[]): T {
        const compScript: cc.Component = this[`_${compName}`];
        if (compScript) {
            const func = compScript[funcName] as (...args: any[]) => void;
            return func?.call(compScript, ...args) as T;
        } else {
            const funcs: Executor[] = this[`_${compName}Funcs`] = this[`_${compName}Funcs`] || [];
            funcs.push(new Executor(this.proxyFunc, this, compName, funcName, ...args));
        }
        return undefined;
    }
}
