import { assetManager, js } from 'cc';
import { AIState } from '../action/ActionConfig';
import { EventM } from '../common/EventManager';
import EntityManager from './EntityManager';
import SceneMapManager from './SceneMapManager';
import { SceneN } from './SceneN';

export class AIManager {
    private static _I: AIManager = null;
    static get I(): AIManager {
        if (this._I == null) {
            this._I = new AIManager();
        }
        return this._I;
    }

    private CurStandTime = 0;
    private AutoHangUpTime = 3;

    private CurState: AIState = AIState.Stand;
    private CurData = js.createMap(true);

    setState(state: AIState = AIState.Stand, aiData: any = js.createMap(true)) {
        const old_state = this.CurState;
        this.CurState = state;
        this.CurData = aiData;
        switch (state) {
            case AIState.Stand:
                return this.stateStand();
            case AIState.HangUp:
                return this.stateHangUp();
            case AIState.AskNpc:
                return this.stateAskNpc();
            case AIState.TaskMMonster:
                return this.stateTaskMonster();
            default:
                return undefined;
        }
    }
    stateStand() {
        if (this.CurStandTime >= this.AutoHangUpTime) {
            this.CurStandTime = 0;
            this.setState(AIState.HangUp);
        }
    }

    stateHangUp() {
        // if (!this.CurData) { return; }
        // if (this.CurData.pos.length === 0) {
        // this.killMonster();
        if (EntityManager.I.haveCanAttackEntity()) {
            this.killMonster();
        } else {
            const player_avatar = EntityManager.I.getPlayerAvatar();
            const target_id = EntityManager.I.getNearestEntityId();
            if (target_id) {
                player_avatar.setTargetId(target_id);
                const entity = EntityManager.I.getEntityByHandle(target_id);
                if (entity.Info.x !== player_avatar.Info.x || entity.Info.y !== player_avatar.Info.y) {
                    EventM.I.once(EventM.Type.Player.CharactorState, () => {
                        if (EntityManager.I.haveCanAttackEntity()) {
                            this.killMonster();
                        }
                    }, this);
                    EventM.I.fire(EventM.Type.Player.MovePlayerByPos, entity.Info.x, entity.Info.y);
                }
            }
        }
    }

    stateAskNpc() {

    }

    stateTaskMonster() {

    }

    private killMonster() {
        // console.log('攻击怪物，播放战报');
        SceneN.I.C2SStageFight();
    }

    clearCurStandTime() {
        this.CurStandTime = 0;
        this.OneSecond = 0;
    }

    private OneSecond = 0;
    think(dt: number) {
        // this.OneSecond += dt;
        // if (this.OneSecond >= 1) {
        //     if (this.CurState === AIState.Stand) {
        //         this.CurStandTime += this.OneSecond;
        //     } else {
        //         this.CurStandTime = 0;
        //     }
        //     this.OneSecond = 0;
        //     this.setState(this.CurState);
        //     // console.log('this.CurStandTime=', this.CurStandTime);
        // }
    }
}
