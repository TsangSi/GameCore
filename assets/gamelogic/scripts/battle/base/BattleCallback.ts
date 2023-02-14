import { BattleBase } from './BattleBase';

export class BattleCallback extends BattleBase {
    private callback: () => void;
    private delay: number;
    static Create (callback: () => void, time = 0) {
        const action = new BattleCallback();
        action.callback = callback;
        action.delay = time;
        return action;
    }

    onUpdate (dt: number) {
        this.delay -= dt;
        if (this.delay > 0) {
            return BattleBase.State.Runing;
        }
        if (this.callback) {
            this.callback();
            this.callback = undefined;
        }
        return BattleBase.State.Finish;
    }
}
