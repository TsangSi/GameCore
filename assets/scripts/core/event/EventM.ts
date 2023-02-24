/*
 * @Author: zs
 * @Date: 2023-02-14 18:01:15
 * @Description:
 *
 */
import { _decorator, js } from 'cc';
import {
    RecordObj,
    TFunc, Type,
} from '../../global/GConst';
import { EUpdate } from '../../common/EventConst';
import { Executor } from '../executor/Executor';
import { ExecutorList } from '../executor/ExecutorList';

const { ccclass } = _decorator;

export interface IEventM {
    /**
     * 监听事件
     * @param id 事件id
     * @param func 回调
     * @param target 回调的this
     * @returns true 成功，false 失败
     */
    on: (id: number, func: TFunc, target: RecordObj) => Executor
    /**
     * 一次性监听事件，一旦触发就会不再监听
     * @param id 事件id
     * @param func 回调
     * @param target 回调的this
     * @returns true 成功，false 失败
     */
    once: (id: number, func: TFunc, target: RecordObj) => Executor
    /**
     * 移除监听事件
     * @param id 事件id
     * @param func 回调
     * @param target 回调的this
     */
    off: (id: number, func: TFunc, target: RecordObj) => void
}

@ccclass('EventM')
export class EventM implements IEventM {
    private static _I: EventM = null;
    public static get I(): EventM {
        if (this._I == null) {
            this._I = new EventM();
        }
        return this._I;
    }

    /** 事件列表 */
    private listeners_: Record<string, ExecutorList> = js ? js.createMap(true) : Object.create(null);
    /** 单次事件列表 */
    private onceListeners_: Record<string, ExecutorList> = js ? js.createMap(true) : Object.create(null);

    public on(id: number, func: TFunc, target: RecordObj): Executor {
        return this.addListener(this.listeners_, id, func, target);
    }

    public once(id: number, func: TFunc, target: RecordObj): Executor {
        return this.addListener(this.onceListeners_, id, func, target);
    }

    public off(id: number, func: TFunc, target: RecordObj): void {
        this.removeListener(id, func, target);
    }

    /**
     *
     * @param {string} id
     * @param {any} arg0
     */
    public fire(id: number | string, ...param: any[]): void {
        return this._fire(id, param);
    }

    /**
     *
     * @param {string} id
     * @param {Array.<any>} args
     * @param {number} start_idx
     */
    private _fire(id: number | string, params: any[]) {
        if (!id) {
            console.warn('fn.EventM.fire: invalid id!');
            return;
        }

        let executors = this.listeners_[id];
        if (executors) {
            executors.invokeWithArgs.apply(executors, params);
        }

        executors = this.onceListeners_[id];
        delete this.onceListeners_[id];
        if (executors) {
            executors.invokeWithArgs.apply(executors, params);
        }
    }

    private addListener(mapping: Record<string, ExecutorList>, id: number | string, func: TFunc, target?: RecordObj) {
        if (!id || !func) {
            console.warn(js.formatStr(
                'hl.EventM._addListener: invalid param(s). id: %s, func: %s',
                id,
                func,
            ));
            return;
        }

        if (this.contains(mapping, id, func, target)) {
            return;
        }

        let executors = mapping[id];
        if (executors) {
            return executors.pushUnique(func, target);
        } else {
            executors = mapping[id] = new ExecutorList();
            return executors.push(func, target);
        }
    }

    private contains(mapping: Record<string, ExecutorList>, id: number | string, func: TFunc, target?: RecordObj) {
        const executors = mapping[id];
        return executors && executors.indexOf(func, target) >= 0;
    }

    /**
     *
     * @param {string} id
     * @param {Function} func
     * @param {any} target
     * @return {fn.EventM}
     */
    private removeListener(id: number | string, func: TFunc, target: RecordObj) {
        if (arguments.length === 1) {
            this.clearListener(id);
        } else if (typeof func === Type.Function) {
            const listeners = [this.listeners_[id], this.onceListeners_[id]];
            const managers = [this.listeners_, this.onceListeners_];
            for (let k = 0, n = listeners.length; k < n; ++k) {
                const executors = listeners[k];
                if (executors && executors.length) {
                    executors.removeAllOf(func, target);
                }

                if (executors && executors.length === 0) {
                    delete managers[k][id];
                }
            }
        }
    }

    /**
     *
     * @param {string} id
     */
    private clearListener(id: number | string) {
        let listeners = this.listeners_;
        let executors = listeners[id];
        if (executors) {
            executors.clear();
            delete listeners[id];
        }

        listeners = this.onceListeners_;
        executors = listeners[id];
        if (executors) {
            executors.clear();
            delete listeners[id];
        }
    }

    /** 事件列表 */
    public static Type = {
        /** UI管理器 */
        UI: {
            /** 关闭某个界面，参数1：UI_NAME */
            Close: 'Close',
        },

        Update: EUpdate,
        /** 登录 */
        Login: {
            /** 登录成功事件 */
            LoginSuccess: 'LoginSuccess',
            /** 登录失败事件 */
            LoginFail: 'LoginFail',
            /** 切换页面 参数：index */
            ChangeView: 'ChangeView',
            /** 玩家登录结果 */
            InitUserLoginResult: 'InitUserLoginResult',
            /** 关闭创角面板 */
            CloseCreateRole: 'CloseCreateRole',
            /** 更新选中服务器 */
            UpdateSelectServer: 'UpdateSelectServer',
        },
        Joystick: {
            /** 显示 */
            Show: 'Show',
            /** 隐藏 */
            Hide: 'Hide',
            /** 更新方向，参数1：dir: Vec2 */
            UpdateDir: 'UpdateDir',
            /** 更新坐标，参数1：pos: Vec2 */
            UpdatePos: 'UpdatePos',
        },
        /** 主界面 */
        Main: {
            /** 加载完成事件 */
            LoadComplete: 'LoadComplete',
            /** 首次显示事件 */
            FirstShow: 'FirstShow',
            /** 显示事件 */
            Show: 'Show',
        },
        /** 配置表 */
        Config: {
            /** 初始化配置表 */
            InitConfig: 'InitConfig',
            /** 初始化配置完成 */
            InitConfigComplete: 'InitConfigComplete',
        },
        /** 网络 */
        Socket: {
            /** Error */
            SocketError: 'SocketError',
            SocketOpen: 'SocketOpen',
            /** Close */
            SocketClose: 'SocketClose',

            NeedConnect: 'NeedConnect',
        },
        /** 主角 */
        Player: {
            /** 移动到某个像素位置，参数1：目标坐标x, 参数2：目标坐标y */
            MovePlayerByPixel: 'MovePlayerByPixel',
            /** 移动到某个坐标位置，参数1：目标坐标x, 参数2：目标坐标y */
            MovePlayerByPos: 'MovePlayerByPos',
            /** 停止移动 */
            StopMove: 'StopMove',
            /**
             * 更新等级
             */
            updateLevel: 'updateLevel',
            /** 更新战斗状态, 参数：是否战斗中 */
            UpdateFightStatus: 'UpdateFightStatus',
            /** 变更状态，参数1：MapConst.CharactorState 当前状态 */
            CharactorState: 'CharactorState',
        },
        /** 场景地图 */
        SceneMap: {
            /** 点击地图，参数1：event: EventTouch */
            TouchMap: 'TouchMap',
            /** 第一次加载完成 */
            FirstLoadComplete: 'FirstLoadComplete',
            LoadComplete: 'LoadComplete',
            /** 移动地图到某个位置，参数1：x，参数2：y */
            MoveToPos: 'MoveToPos',
        },
        BuildLayer: {
            /** 添加建筑 */
            AddBuild: 'AddBuild',
            /** 移除建筑 */
            DestroyBuild: 'DestroyBuild',
        },
        /** 战斗 */
        Battle: {
            BattleBegin: 'BattleBegin',
            BattleEnd: 'BattleEnd',
            /** 战斗奖励，参数：S2CPrizeReport */
            BattleReward: 'BattleReward',
        },
        Entity: {
            /** 实体更新层级 参数当前实体id */
            UpdateSiblingIndex: 'UpdateSiblingIndex',
        },
    };
}
