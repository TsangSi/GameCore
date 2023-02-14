import { Vec2, Vec3 } from 'cc';
import { ACTION_DIRECT, ACTION_TYPE } from '../../../scripts/action/ActionConfig';
import { FightEntity } from '../../../scripts/action/FightEntity';
import { BattleCallback } from './base/BattleCallback';
import { BattleMove } from './base/BattleMove';
import { BattleSequnence } from './base/BattleSequence';
import { BattleSpawn } from './base/BattleSpawn';
import { BattleManager } from './BattleManager';

export class BattleAttackStart extends BattleSequnence {
    private m_step: FightStep;
    private m_atkUnit: AtkUnit;
    private m_moveToPos: Vec3;

    public static Create(step: FightStep, AtkUnit: AtkUnit, moveToPos: Vec3 = null): BattleAttackStart {
        const action = new BattleAttackStart();

        action.m_step = step;
        action.m_atkUnit = AtkUnit;

        return action;
    }

    public onEnter() {
        super.onEnter();

        const step = this.m_step;
        const atkUnit = this.m_atkUnit;
        const entity = BattleManager.I.getEntityByP(step.P);
        let direct: number = ACTION_DIRECT.LEFT_UP;
        if (BattleManager.I.isTeamUp(step.P % BattleManager.I.secondB)) {
            direct = ACTION_DIRECT.RIGHT_DOWN;
        }

        const a1 = BattleCallback.Create(() => {
            entity.playAction(ACTION_TYPE.RUN, direct);
        });
        const tpos: Vec3 = BattleManager.I.getTargetPos(step.U[0].P, false, this.m_moveToPos, this.isChild);
        const a2 = BattleMove.CreateTo(entity, tpos, BattleManager.I.attackMoveToTime);
        const a3 = BattleCallback.Create(() => {
            entity.playAction(ACTION_TYPE.STAND, direct);
        });
        this.addAction(BattleSpawn.Create([a1, a2]));
        this.addAction(a3);
    }
}

export class BattleAttackEnd extends BattleSequnence {
    private ap: number;
    private m_aiaPlyList: FightEntity[] = null;

    public static Create(ap: number, aiaPlys: FightEntity[] = null) {
        const action = new BattleAttackEnd();
        action.ap = ap;
        action.m_aiaPlyList = aiaPlys;
        return action;
    }

    public onEnter() {
        super.onEnter();
        const entity = this.battleM.getEntityByP(this.ap);
        let direct: number = ACTION_DIRECT.LEFT_UP;
        if (this.battleM.isTeamUp(this.ap % this.battleM.secondB)) {
            direct = ACTION_DIRECT.RIGHT_DOWN;
        }

        const a1 = BattleCallback.Create(() => {
            entity.playAction(ACTION_TYPE.RUN, direct);
        });
        const tpos: Vec3 = this.battleM.getEntityPosInfo(this.ap % this.battleM.secondB, this.ap);
        const a2 = BattleMove.CreateTo(entity, tpos, this.battleM.attackOverMoveBackTime);
        const a3 = BattleCallback.Create(() => {
            entity.playAction(ACTION_TYPE.STAND, direct);
        });
        this.addAction(a1);
        this.addAction(a2);
        this.addAction(a3);

        if (this.m_aiaPlyList && this.m_aiaPlyList.length > 0) {
            const action_list = [];
            for (let index = 0; index < this.m_aiaPlyList.length; index++) {
                const aiaPly = this.m_aiaPlyList[index];
                const mePos: Vec3 = this.battleM.getTargetPos(this.ap);
                const act5 = BattleMove.CreateTo(aiaPly, mePos, this.battleM.attackMoveToTime);
                const act6 = BattleCallback.Create(() => {
                    aiaPly.destroy();
                });

                action_list.push(BattleSequnence.CreateList([act5, act6]));
            }

            this.addAction(BattleSpawn.Create(action_list));
        }
    }
}
