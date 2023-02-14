import { BattleBase } from './BattleBase';

export class BattleSequnence extends BattleBase {
    private mIndex = 0;
    private mIsEnter = true;

    public static CreateList (list: BattleBase[]): BattleSequnence {
        const action = new BattleSequnence();
        action.setActions(list);
        return action;
    }

    public onUpdate (delta: number) {
        const action = this.getAction(this.mIndex);
        if (action) {
            if (this.mIsEnter) {
                action.onEnter();
                this.mIsEnter = false;
            }
            const ret = action.onUpdate(delta);
            if (ret !== BattleSequnence.State.Runing) {
                action.onExit();
                ++this.mIndex;
                this.mIsEnter = true;
            }
            return BattleSequnence.State.Runing;
        }
        return BattleSequnence.State.Finish;
    }

    public onExit (): void {
        this.onExitFromActions();
    }
}
