import { BattleManager } from '../BattleManager';

// export type FightEntity = Avatar | Monster;

export class BattleBase {
    // 子类事件
    private actions: BattleBase[] = [];

    public mType: number;

    public mInit: boolean;

    // protected mContext: SceneWar;

    /** 并列行为子行为标记 */
    public isChild = false;

    /** 帧循环事件 */
    // public init (context: SceneWar) {
    //     this.mContext = context;
    // }
    protected battleM: BattleManager;
    public constructor() {
        this.battleM = BattleManager.I;
    }

    protected setActions(as: BattleBase[]): void {
        this.actions.length = 0;
        as.forEach((a) => {
            this.addAction(a);
        });
    }

    protected addAction(v: BattleBase): void {
        this.actions.push(v);
    }

    protected getAction(index: number): BattleBase {
        return this.actions[index];
    }

    protected delAction(index: number): void {
        this.actions.splice(index, 1);
    }

    protected getActionsLength(): number {
        return this.actions.length;
    }

    protected onEnterFromActions(): void {
        this.actions.forEach((a) => {
            a.onEnter();
        });
    }
    protected onExitFromActions(): void {
        this.actions.forEach((a) => {
            a.onExit();
        });
    }

    /** 更新 */
    public onUpdate(delta: number): number {
        return BattleBase.State.Finish;
    }

    /** 动作开始 */
    public onEnter(): void {
        //
    }

    /** 动作结束 */
    public onExit(): void {
        //
    }
    /** 帧循环事件结束 */

    /** 数据执行事件，直接执行结果 */
    public execute(): void {
        this.doExecute();
    }

    protected doExecute(): void {
//
    }
    /** 状态 */
    public static State = {
        /** 正在运行 */
        Runing: 0,
        /** 已完成 */
        Finish: 1,
        /** 中断 */
        Break: 2,
    };
}
