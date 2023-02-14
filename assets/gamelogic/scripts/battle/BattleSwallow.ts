/* eslint-disable max-len */
import { AnimationClip, tween, v2 } from 'cc';
import ActionBase from '../../../scripts/action/ActionBase';
import { ACTION_DIRECT, ACTION_RES_TYPE, ACTION_TYPE } from '../../../scripts/action/ActionConfig';
import { FightEntity } from '../../../scripts/action/FightEntity';
import { Config } from '../../../scripts/config/Config';
import { CLIENT_SHOW_TYPE, TURN_ATK_TYPE } from '../../../scripts/global/GConst';
import { BattleCallback } from './base/BattleCallback';
import { BattleSequnence } from './base/BattleSequence';
import { BattleSpawn } from './base/BattleSpawn';
import { BattleFlyWorld } from './BattleFlyWorld';

enum SwaStatus {
    /** 普通状态 */
    Normall = 0,
    /** 吞入 吞噬其他单位 */
    In = 1,
    /** 吐出  */
    Out = 2,
    /** 被吞噬 */
    BeSwallow = 3,
}

export class BattleSwallow extends BattleSequnence {
    // 被吞后显示
    private readonly afterSwallowID = '1650';
    // 被吞后遮罩显示
    private readonly afterSwallowMaskID = '5302';
    private m_step: FightStep;
    private victimUnit: AtkUnit;
    private atkMode = 0;
    static Create(step: FightStep, victimUnit: AtkUnit | null, atkMode: number) {
        const action = new BattleSwallow();
        action.m_step = step;
        action.victimUnit = victimUnit;
        action.atkMode = atkMode;
        return action;
    }

    public onEnter() {
        super.onEnter();
        this.Create(this.m_step, this.victimUnit, this.atkMode);
    }

    Create(fightStep: FightStep, victimUnit: AtkUnit, atkMode: TURN_ATK_TYPE) {
        let spawnAction = [];
        const actions = tween();
        const victim = this.battleM.getEntityByP(victimUnit.P);
        if (victimUnit.IsSwallow) {
            if (victimUnit.AngerValue === victimUnit.AngerValueMax && victimUnit.CurSkin) {
                // const act3 = BattleFlyWorld.Create(victim, '', CLIENT_SHOW_TYPE.ChangeToAlien, v2(50, 0), undefined, false, 0, victimUnit.CurSkin);
                // spawnAction = spawnAction.concat(act3);
            }
            this.swallowAction(fightStep, victimUnit.P);
        }
        victim.setAnger(victimUnit.AngerValue, victimUnit.AngerValueMax);
        if (fightStep.SwallowStatus) {
            this.playSwallowByShort(fightStep, atkMode);
        } else if (TURN_ATK_TYPE.Long === atkMode || TURN_ATK_TYPE.Short === atkMode) {
            // 普通
            if (fightStep.CurSkin) {
                const act1 = BattleCallback.Create(() => {
                    this.doRefreshAnima(fightStep.P, fightStep.CurSkin);
                }, 500);
                spawnAction.push(act1);
            }
        }
        if (victimUnit.CurSkin) {
            const act1 = BattleCallback.Create(() => {
                this.doRefreshAnima(victimUnit.P, victimUnit.CurSkin);
            }, 500);
            spawnAction.push(act1);
        }
        this.doBeSwallow(fightStep.P, fightStep.SwallowStatus === SwaStatus.BeSwallow);
        if (spawnAction.length) {
            this.addAction(BattleSpawn.Create(spawnAction));
        }
    }

    /** 刷新Anima */
    private doRefreshAnima(p: number, curSkin: number) {
        const e = this.battleM.getEntityByP(p);
        tween(e).delay(0.5).call(() => {
            e.updateModeBody(curSkin, ACTION_RES_TYPE.PET);
            e.setAnger(0, 0);
        }).start();
    }

    /** 本次战斗步骤吞噬状态 0普通状态,1吞噬其他单位,2吐出其他单位,3被吞噬 */
    private playSwallowByShort(fightStep: FightStep, atkMode: TURN_ATK_TYPE) {
        const attackEntity = this.battleM.getEntityByP(fightStep.P);
        if (fightStep.SwallowStatus === SwaStatus.In) {
            if (atkMode === TURN_ATK_TYPE.Short) {
                // 吞噬
                if (fightStep.KILL) {
                    // 吞死目标
                    attackEntity.addOtherMask(false);
                    attackEntity.eatName();
                } else {
                    if (!attackEntity.otherMask || !attackEntity.otherMask.isValid) {
                        attackEntity.otherMask = new ActionBase(this.afterSwallowMaskID, ACTION_RES_TYPE.SKILL, -1, ACTION_TYPE.DEFAULT, AnimationClip.WrapMode.Loop);
                    }
                    attackEntity.addOtherMask();
                }
                // 吞噬过后怒气归零
                attackEntity.setAnger(0, 0);
            }
        } else if (fightStep.SwallowStatus === SwaStatus.Out) {
            if (atkMode === TURN_ATK_TYPE.Long) {
                let dir = ACTION_DIRECT.LEFT_UP;
                if (this.battleM.isTeamUp(fightStep.P)) {
                    dir = ACTION_DIRECT.RIGHT_DOWN;
                }
                const AnimSID: number | string = Config.getI(Config.T.Cfg_Skill).selectByKey(fightStep.S.toString(), 'AnimSID');
                const skillEffect = this.battleM.getSkill(AnimSID, false, fightStep.P === this.battleM.ROLE_POS, dir);
                skillEffect.setPosition(attackEntity.position.x, attackEntity.position.y);
                attackEntity.addOtherMask(false);
                if (fightStep.CurSkin) {
                    // 吐出后变回去
                    // attackEntity.refreshAnima(fightStep.CurSkin, ACTION_RES_TYPE.PET);
                }
                attackEntity.addAiaGhost(false);
            }
        }
    }

    /** 更新吞噬后的形象 */
    private swallowAnim(swallowStatus: number, ap: number, tp: number, animId: number, kill: boolean, curSkin = 0) {
        const atk_entity = this.battleM.getEntityByP(ap);
        if (swallowStatus === SwaStatus.In) {
            const dir = this.battleM.getDirByP(ap);
            const skill = this.battleM.getSkill(animId, false, this.battleM.isMe(ap), dir);
            skill.setPosition(atk_entity.position.x, atk_entity.position.y);
            if (kill) {
                if (curSkin) {
                    atk_entity.updateModeBody(curSkin, ACTION_RES_TYPE.PET);
                }
                atk_entity.addOtherMask(false);
                atk_entity.eatName();
            } else {
                const t_entity = this.battleM.getEntityByP(tp);
                const aname = t_entity.getName();
                atk_entity.eatName(aname);
            }

            atk_entity.setAnger(0, 0);
        } else if (swallowStatus === SwaStatus.Out) {
            atk_entity.addOtherMask(false);
            atk_entity.eatName();
        }
    }

    /** 吞噬操作 */
    private swallowAction(fightStep: FightStep, vp: number) {
        this.doBeSwallow(vp, true);
        const entity = this.battleM.getEntityByP(vp);
        if (entity.isProtect) {
            entity.isProtect = false;
        } else {
            const cfg_skill: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(fightStep.S.toString());
            this.swallowAnim(fightStep.SwallowStatus, fightStep.P, vp, cfg_skill.AnimId, fightStep.KILL === 1, fightStep.CurSkin);
        }
    }

    /** 被吞噬相关 */
    private doBeSwallow(p: number, state: boolean) {
        const entity = this.battleM.getEntityByP(p);
        if (state && !entity.ghostPart) {
            const dir = this.battleM.getDirByP(p);
            const handle = `${entity.getId()}${this.afterSwallowID}`;
            entity.ghostPart = new FightEntity(parseInt(handle));
            entity.ghostPart.initAnim(this.afterSwallowID, ACTION_RES_TYPE.PET, dir);
        }
        entity.addAiaGhost(state);
    }
}
