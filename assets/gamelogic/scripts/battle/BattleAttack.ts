import {
 AnimationClip, isValid, v3, Vec3,
} from 'cc';
import { ACTION_DIRECT, ACTION_TYPE } from '../../../scripts/action/ActionConfig';
import { Config } from '../../../scripts/config/Config';
import { CLIENT_SHOW_TYPE, TURN_ATK_TYPE } from '../../../scripts/global/GConst';
import { BattleBase, FightEntity } from './base/BattleBase';
import { BattleCallback } from './base/BattleCallback';
import { BattleMove } from './base/BattleMove';
import { BattleSequnence } from './base/BattleSequence';
import { BattleSpawn } from './base/BattleSpawn';
import { BattleDamage } from './BattleDamage';
import { BattleFlyWorld } from './BattleFlyWorld';
import { BattleManager } from './BattleManager';
import { BattleSwallow } from './BattleSwallow';
import { BattleTargetDamage } from './BattleTargetDamage';

export class BattleAttack extends BattleSequnence {
    private m_step: FightStep;
    private m_entity: FightEntity;
    // private m_atkUnitList: AtkUnit[] = [];

    /** 攻击者是否死亡 */
    private isAttackerKill = false;
    private atkMode = 0;

    public static Create(step: FightStep, atkMode: number): BattleAttack {
        const a = new BattleAttack();
        a.m_step = step;
        a.atkMode = atkMode;
        // a.m_atkUnitList = Utils.I.copyDataHandler(step.U);
        return a;
    }

    public onEnter() {
        super.onEnter();
        this.m_entity = BattleManager.I.getEntityByP(this.m_step.P);

        this.getTriggerList();
    }

    public getTriggerList() {
        const list = [];
        let isDouble = false;
        this.m_step.U.forEach((v, index) => {
            const act: BattleBase = this.parseData(index);
            if (isDouble === false) {
                isDouble = this.battleM.isDoubleStep(this.m_step, index);
            }
            list.push(act);
        });

        if (isDouble) {
            this.addAction(BattleSequnence.CreateList(list));
        } else {
            this.addAction(BattleSpawn.Create(list));
        }
    }

    /** 初始化触发器 */
    public parseData(index: number): BattleBase {
        const acton_sequence_List = []; // 串
        const acton_spawn_List = []; // 并

        const step: FightStep = this.m_step;
        const _attackerPly: FightEntity = this.m_entity; // 攻击者对象

        const _targetUnit: AtkUnit = step.U[index]; // 被攻击者数据
        // const _targetPly: FightEntity = this.mContext.getEntity(_targetUnit.P); //被攻击者对象

        if (step.AtkContinue) { // 本次出手是否是追击，0否1是
            // 飘字
            // const act1 = BattleFlyWorld.Create(_attackerPly, '', CLIENT_SHOW_TYPE.CHASE);
            // acton_spawn_List.push(act1);
        }
        // =========异兽=====start======
        const act2 = BattleSwallow.Create(step, _targetUnit, this.atkMode);
        acton_spawn_List.push(act2);
        // =========异兽=====end======

        // 播放攻击动作
        const act3 = BattleCallback.Create(() => {
            _attackerPly.playAction(ACTION_TYPE.ATTACK, null, AnimationClip.WrapMode.Normal);
        });
        const skillCfg: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(step.S.toString());
        const turnAtk = this.atkMode;
        let isDouble = false;
        // 如果此次是连击,或者下一次攻击是连击,则本轮攻击是连击
        if (this.battleM.isDoubleStep(step, index)) {
            isDouble = true;
            if (_targetUnit.E && _targetUnit.E[0] && _targetUnit.E[0].K !== CLIENT_SHOW_TYPE.ReduceBlood) {
                if (turnAtk === TURN_ATK_TYPE.Short || turnAtk === TURN_ATK_TYPE.Centre) {
                    // 近战
                    const tpos: Vec3 = this.battleM.getTargetPos(_targetUnit.P);
                    const act4 = BattleMove.CreateTo(_attackerPly, tpos, this.battleM.attackMoveToTime);
                    acton_spawn_List.push(act3);
                    acton_spawn_List.push(act4);
                }
            }
        } else if (this.battleM.isLastAtkUnit(this.m_step, index) && !step.NoAtk) {
            // 单个目标是否需要 播放攻击动作
            acton_spawn_List.push(act3);
        }

        //= ==通过受击者Buff状态，算出攻击方血量变化BEGIN======
        const act1 = BattleDamage.Create(step.P, _targetUnit.P, _targetUnit.E); // 攻击方伤害
        acton_spawn_List.push(act1);

        acton_sequence_List.push(BattleSpawn.Create(acton_spawn_List));
        // 技能结束后回调
        const actEnd = this.doAtkEnd(step.P, step.E);
        acton_sequence_List.push(actEnd);
        if (this.isAttackerKill === false) {
            const act2 = BackToSeat.Create(step.P, _targetUnit, step.S, step.NoAtk);
            if (act2) {
                acton_sequence_List.push(act2);
            }
        }

        // boss 特殊处理 再技能结束后统一处理。
        // this.setBossInfo();

        // 准备开始下一回合 徐处理 是否死亡、复活、近战归位
        // this.netxTurn();

        const act = BattleSequnence.CreateList(acton_sequence_List);
        return act;
    }

    // 本轮攻击完成
    private doAtkEnd(ap: number, e: Effect[]) {
        const action_list = [];
        // 先看一下攻击方还活着没有
        const entity = this.battleM.getEntityByP(ap);
        let isUnitDead = this.battleM.isDeadAttacker(entity);
        if (isUnitDead) {
            if (ap === this.battleM.MY_DRAGON_POS || ap === this.battleM.ENEMY_DRAGON_POS) {
                // 如果攻击者神龙
                isUnitDead = false;
            }
        }
        if (isUnitDead) {
            // 如果攻击者死了  且不是神龙    神龙不会死
            const aEff: Effect = this.battleM.hasEffectType(e, CLIENT_SHOW_TYPE.REVIVE);
            if (aEff) {
                // 复活时飘字
                // action_list.push(BattleFlyWorld.Create(entity, aEff.V.toString(), CLIENT_SHOW_TYPE.REVENGE));
                // 能复活
                entity.hp = aEff.V;
                // action_list.push(BattleFlyWorld.Create(entity, aEff.V.toString(), aEff.K));
            } else {
                // 彻底死了
                action_list.push(BattleCallback.Create(() => {
                    this.isAttackerKill = true;
                    const willDeadPos: number = ap;
                    entity.active = false;
                    entity.setPosition(entity.position.x, -2000);
                    // 是否有替补
                    // this.mContext.checkFill(willDeadPos, entity.getChildByName("battleArray"));
                }));
            }
        }
        return BattleSpawn.Create(action_list);
    }
}

class BackToSeat extends BattleSequnence {
    private ap: number;
    private targetUnit: AtkUnit;
    private noAtk: number;
    private s: number;
    static Create(ap: number, targetUnit: AtkUnit, s: number, noAtk: number) {
        const action = new BackToSeat();
        action.ap = ap;
        action.targetUnit = targetUnit;
        action.noAtk = noAtk;
        action.s = s;
        return action;
    }

    onEnter() {
        super.onEnter();
        this.show();
    }

    private show() {
        const atkPly: FightEntity = this.battleM.getEntityByP(this.ap);
        if (!atkPly || isValid(atkPly) === false) {
            return;
        }
        const isDead = atkPly.hp < 1;
        if (isDead) {
            return;
        }
        // todo 技能结束后回调
        const act1 = BattleTargetDamage.Create(this.ap, this.targetUnit.P, this.targetUnit.E);
        const act2 = EntityHit.Create(this.ap, this.targetUnit.P, this.s, !!this.noAtk);
        this.addAction(BattleSpawn.Create([act1, act2]));
    }
}

class EntityHit extends BattleSequnence {
    private s: number;
    private noAtk: boolean;
    private ap: number;
    private vp: number;
    static Create(ap: number, vp: number, s: number, noAtk: boolean) {
        const action = new EntityHit();
        action.ap = ap;
        action.vp = vp;
        action.s = s;
        action.noAtk = noAtk;
        return action;
    }

    onEnter() {
        super.onEnter();
        this.show();
    }

    private show() {
        const entity = this.battleM.getEntityByP(this.vp);
        const cfg_skill: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(this.s.toString());
        if (!cfg_skill) {
            return;
        }
        if (cfg_skill.IsShake) {
            this.battleM.doSceneShake();
        }
        if (!cfg_skill.AnimId) {
            return;
        }

        const skill_effect = this.battleM.getSkill(cfg_skill.AnimId, false, this.battleM.isMe(this.ap));
        if (skill_effect) {
            if (entity) {
                skill_effect.setPosition(entity.position.x, entity.position.y);
            }
            if (cfg_skill.AnimEnlarge) {
                skill_effect.setScale(cfg_skill.AnimEnlarge / 100, cfg_skill.AnimEnlarge / 100);
            }
            if (cfg_skill.Transform === 1) {
                if (entity && entity.getDir() === ACTION_DIRECT.LEFT_UP) {
                    skill_effect.setScale(skill_effect.scale.x, skill_effect.scale.y > 0 ? -skill_effect.scale.y : skill_effect.scale.y);
                    skill_effect.angle = 90;
                } else {
                    skill_effect.setScale(skill_effect.scale.x, skill_effect.scale.y < 0 ? -skill_effect.scale.y : skill_effect.scale.y);
                    skill_effect.angle = 0;
                }
            } else {
                skill_effect.angle = 0;
            }
        }

        // 受击位移
        if (!this.noAtk && entity.hp > 0) {
            let isUp = false;
            if (!this.battleM.isTeamUp(this.vp)) {
                isUp = true;
            }
            this.addAction(BattleCallback.Create(undefined, 200));
            this.addAction(HitMove.Create(this.vp, isUp));
            if (entity && entity.isValid) {
                entity.setSufferAttack();
            }
        }
    }
}

class HitMove extends BattleBase {
    private vp: number;
    private m_isUp: boolean;
    private mIndex = 0;
    private mIsEnter = true;

    public static Create(vp: number, isUp = true) {
        const action = new HitMove();
        action.vp = vp;
        action.m_isUp = isUp;
        return action;
    }

    public onEnter() {
        super.onEnter();
        const entity = this.battleM.getEntityByP(this.vp);
        let p1 = v3(-32, 20);
        let p2 = v3(32, -20);
        if (this.m_isUp === false) {
            p1 = v3(32, -20);
            p2 = v3(-32, 20);
        }
        const time = 200;
        const act1 = BattleMove.CreateBy(entity, p1, time);
        const act2 = BattleMove.CreateBy(entity, p2, time);
        this.addAction(act1);
        this.addAction(act2);
    }

    public onUpdate(delta: number) {
        const action = this.getAction(this.mIndex);
        if (action) {
            if (!action.mInit) {
                action.mInit = true;
            }
            if (this.mIsEnter) {
                action.onEnter();
                this.mIsEnter = false;
            }
            const ret = action.onUpdate(delta);
            if (ret !== BattleBase.State.Runing) {
                action.onExit();
                ++this.mIndex;
                this.mIsEnter = true;
            }
            return BattleBase.State.Runing;
        }
        return BattleBase.State.Finish;
    }
}
