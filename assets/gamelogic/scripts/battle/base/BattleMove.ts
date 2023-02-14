import { Node, tween, v2, v3, Vec3 } from 'cc';
import { BattleBase } from './BattleBase';

export class BattleMove extends BattleBase {
    private time = 0
    private target: Node;
    private pos: Vec3;
    private isBy = false;
    private isMoving = false;
    private state = BattleMove.State.Runing
    private static Create (target: Node, pos: Vec3, time: number, isBy = false) {
        const action = new BattleMove();
        action.time = time;
        action.target = target;
        action.pos = pos;
        action.isBy = isBy;
        return action;
    }

    public static CreateTo (target: Node, pos: Vec3, time: number) {
        return this.Create(target, pos, time, false);
    }

    public static CreateBy (target: Node, pos: Vec3, time: number) {
        return this.Create(target, pos, time, true);
    }

    public onUpdate (dt: number) {
        if (!this.isMoving) {
            this.isMoving = true;
            this.state = BattleMove.State.Runing;
            if (this.isBy) {
                tween(this.target).by(this.time / 1000, { position: v3(this.pos.x, this.pos.y) }).call(() => {
                    this.state = BattleMove.State.Finish;
                }).start();
            } else {
                tween(this.target).to(this.time / 1000, { position: v3(this.pos.x, this.pos.y) }).call(() => {
                    this.state = BattleMove.State.Finish;
                }).start();
            }
        }
        return this.state;
    }
}
