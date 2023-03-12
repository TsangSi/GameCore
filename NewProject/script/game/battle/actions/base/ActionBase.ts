/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: hrd
 * @Date: 2022-06-16 16:47:37
 * @FilePath: \SanGuo\assets\script\game\battle\actions\base\ActionBase.ts
 * @Description: 战斗行为基类
 *
 */

import { WarBase } from '../../war/WarBase';
import { ExecuteType, ActionReturn } from '../../WarConst';

export class ActionBase {
    /* 子类行为事件 */
    public mActions: ActionBase[] = [];
    /* 行为类型 */
    public mType: number;
    /** 是否初始化 */
    public mInit: boolean;
    /** 战斗场景容器 */
    protected mWar: WarBase;
    /** 执行类型 1=顺序 2=并发 */
    public executeType: ExecuteType = -1;
    /** 顺序执行索引 */
    public mIndex: number = 0;
    /** 顺序子行为是否开始 */
    public mIsEnter = true;

    /** 初始化 */
    public init(context: any): void {
        this.mWar = context;
        this.initAct();
        this.exeActInit();
    }

    public exeActInit() {
        if (this.executeType === ExecuteType.Parallel) {
            for (const action of this.mActions) {
                action.init(this.mWar);
            }
        }
    }

    public initAct() {
        //
    }

    public pushAction(action: ActionBase | ActionBase[]) {
        if (action instanceof Array) {
            this.mActions.push(...action);
        } else {
            this.mActions.push(action);
        }
    }

    /** 更新 */
    public onUpdate(delta: number): ActionReturn {
        if (this.executeType === ExecuteType.Parallel) {
            return this.onUpdateParallel(delta);
        } else if (this.executeType === ExecuteType.Series) {
            return this.onUpdateSeries(delta);
        }
        return ActionReturn.NEXT;
    }

    /** 平行 */
    private onUpdateParallel(delta: number): ActionReturn {
        for (let i = this.mActions.length - 1; i >= 0; --i) {
            const action = this.mActions[i];
            if (action.onUpdate(delta) !== ActionReturn.CONTINUE) {
                this.mActions.splice(i, 1);
            }
        }
        if (this.mActions.length === 0) {
            return ActionReturn.NEXT;
        }
        return ActionReturn.CONTINUE;
    }

    /** 串行 */
    private onUpdateSeries(delta: number): ActionReturn {
        const action = this.mActions[this.mIndex];
        if (action) {
            if (!action.mInit) {
                action.init(this.mWar);
                action.mInit = true;
            }
            if (this.mIsEnter) {
                action.onEnter();
                this.mIsEnter = false;
            }
            const ret = action.onUpdate(delta);
            if (ret !== ActionReturn.CONTINUE) {
                action.onExit();
                ++this.mIndex;
                this.mIsEnter = true;
            }
            return ActionReturn.CONTINUE;
        }
        return ActionReturn.NEXT;
    }

    /** 动作开始 */
    public onEnter(): void {
        if (this.executeType === ExecuteType.Parallel) {
            for (const action of this.mActions) {
                action.onEnter();
            }
        }
    }

    /** 动作结束 */
    public onExit(): void {
        if (this.mActions.length > 0) {
            for (const action of this.mActions) {
                action.onExit();
            }
        }
    }

    /** 数据执行事件，直接执行结果 */
    public execute(war: any): void {
        this.mWar = war;
        this.doExecute();
    }

    protected doExecute(): void {
        //
    }
}
