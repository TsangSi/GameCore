import { AnimationClip, Node, v2, v3 } from 'cc';
import { ACTION_DIRECT } from '../../../scripts/action/ActionConfig';
import { FightEntity } from '../../../scripts/action/FightEntity';
import { EffectManager } from '../../../scripts/common/EffectManager';
import { Config } from '../../../scripts/config/Config';
import { BATTLE_TYPE, CLIENT_SHOW_TYPE, UNIT_TYPE } from '../../../scripts/global/GConst';
import { BattleCallback } from './base/BattleCallback';
import { BattleMove } from './base/BattleMove';
import { BattleSequnence } from './base/BattleSequence';
import { BattleFlyWorld } from './BattleFlyWorld';

export class BattleTargetDamage extends BattleSequnence {
    private ap: number;
    private vp: number;
    private effects: Effect[];
    static Create(ap: number, vp: number, effects: Effect[]) {
        const action = new BattleTargetDamage();
        action.ap = ap;
        action.vp = vp;
        action.effects = effects;
        return action;
    }

    onEnter() {
        const vic_entity: FightEntity = this.battleM.getEntityByP(this.vp);
        let atk_entity: FightEntity;
        let cfg_client_skill: Cfg_ClientSkill;

        this.effects.forEach((e) => {
            switch (e.K) {
                case CLIENT_SHOW_TYPE.REVIVE:
                case CLIENT_SHOW_TYPE.BACK_BLOOD:
                case CLIENT_SHOW_TYPE.HURT:
                    // this.addAction(BattleFlyWorld.Create(vic_entity, e.V.toString(), e.K));
                    if (e.K !== CLIENT_SHOW_TYPE.HURT) {
                        vic_entity.hp = -e.V;
                    }
                    break;
                default:
                    cfg_client_skill = Config.getI(Config.T.Cfg_ClientSkill).getDataByKey(e.K.toString());
                    if (cfg_client_skill) {
                        if (cfg_client_skill.ForObj === 0) {
                            if (this.battleM.getRealPos(this.ap) < 10) {
                                // 自己攻击伤害值
                            }
                        } else if (cfg_client_skill.ForObj === 1) {
                            // this.addAction(BattleFlyWorld.Create(atk_entity, e.V.toString(), e.K));
                        } else if (cfg_client_skill.ForObj === 2 && vic_entity && vic_entity.isValid) {
                            this.battleM.doTargetDamage(cfg_client_skill.Result, this.battleM.getRealPos(this.ap), vic_entity, e);
                            // this.addAction(BattleFlyWorld.Create(vic_entity, e.V.toString(), e.K));
                        }
                    }
                    break;
            }
            if (vic_entity) {
                let p_entity: FightEntity;
                if (vic_entity.protectPos) {
                    p_entity = this.battleM.getEntityByP(vic_entity.protectPos);
                    p_entity.protectPos = undefined;
                } else if (vic_entity.isProtect) {
                    p_entity = vic_entity;
                    vic_entity.isProtect = false;
                }
                if (p_entity && p_entity.protectXY) {
                    this.addAction(BattleCallback.Create(() => {
                        BattleMove.CreateTo(p_entity, p_entity.protectXY, this.battleM.attackMoveToTime);
                    }));
                }
            }
            this.doDead(this.vp, this.effects);
        });
    }

    private doDead(vp: number, effects: Effect[]) {
        const willDeadPos: number = vp % this.battleM.secondB;
        const _targetPly: FightEntity = this.battleM.getEntityByP(vp);

        // 如果hp小于  且没有复活BUFF  才算真正死亡
        if (_targetPly.hp < 1 && this.battleM.hasEffectType(effects, CLIENT_SHOW_TYPE.REVIVE) == null) {
            if (Math.random() > 0.5 && this.battleM.getUnitByP(willDeadPos) && this.battleM.getUnitByP(willDeadPos).T === UNIT_TYPE.Monster) {
                _targetPly.setDeath(() => {
                    _targetPly.isUsed = false;
                }, this);
            } else if (this.battleM.isTeamUp(willDeadPos)) {
                let pos1 = v3(-160, 1000);
                let pos2 = v3(-300, -1000);
                const m: number = (willDeadPos - 1) % 5;
                if (m < 2) {
                    pos1 = v3(40, 1000);
                    pos2 = v3(560, -1000);
                } else if (m < 4) {
                    pos1 = v3(-30, 1000);
                    pos2 = v3(370, -1000);
                }
                const a1 = BattleMove.CreateTo(_targetPly, pos1, 100);
                const a2 = BattleMove.CreateTo(_targetPly, pos2, 230);
                const a3 = BattleCallback.Create(() => {
                    _targetPly.active = false;
                    _targetPly.isUsed = false;
                });
                const act = BattleSequnence.CreateList([a1, a2, a3]);
                this.addAction(act);
            } else {
                const pos1 = v3(_targetPly.position.x + 30, -1000);
                const a1 = BattleMove.CreateBy(_targetPly, pos1, 330);
                const a2 = BattleCallback.Create(() => {
                    _targetPly.active = false;
                    _targetPly.isUsed = false;
                });
                const act = BattleSequnence.CreateList([a1, a2]);
                this.addAction(act);
            }
            // 显示副本死亡特效
            this.showFbDeadEffect(willDeadPos, _targetPly);
            if (_targetPly.isValid) {
                // 是否有替补
                // this.mContext.checkFill(willDeadPos, _targetPly.getChildByName("battleArray"));
            }
        }
    }

    /** 显示副本 死亡特效 */
    private showFbDeadEffect(willDeadPos: number, _targetPly: FightEntity) {
        const t = this.battleM.getFightType();
        if (this.battleM.isTeamUp(willDeadPos)) {
            let loadPath = null;
            if (t === BATTLE_TYPE.FB_SL_JB) {
                loadPath = 'e/fuben/ui_5202';
            } else if (t === BATTLE_TYPE.FB_SL_JY) {
                loadPath = 'e/fuben/ui_5201';
            }
            if (loadPath) {
                EffectManager.I.showEffect(loadPath, undefined, AnimationClip.WrapMode.Normal, (n) => {
                    this.battleM.addToBattle(n);
                    n.setPosition(_targetPly.position.x, _targetPly.position.y);
                }, (n) => {
                    n.destroy();
                });
            }
        }
    }
}
