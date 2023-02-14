import { BattleBase } from './BattleBase';

export class BattleSpawn extends BattleBase {
    public static Create (list: BattleBase[]): BattleSpawn {
        const action = new BattleSpawn();
        action.setActions(list);
        return action;
    }

    public onEnter (): void {
        this.onEnterFromActions();
    }
    public onUpdate (delta: number) {
        for (let i = this.getActionsLength() - 1; i >= 0; --i) {
            const action = this.getAction(i);
            if (action.onUpdate(delta) !== BattleSpawn.State.Runing) {
                this.delAction(i);
            }
        }
        if (this.getActionsLength() < 1) {
            return BattleSpawn.State.Finish;
        }
        return BattleSpawn.State.Runing;
    }
    public onExit (): void {
        this.onExitFromActions();
    }
}
