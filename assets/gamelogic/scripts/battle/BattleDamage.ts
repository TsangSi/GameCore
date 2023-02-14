import { v2 } from 'cc';
import { Config } from '../../../scripts/config/Config';
import FightSceneIndexer from '../../../scripts/config/indexer/FightSceneIndexer';
import { BATTLE_TYPE, CLIENT_SHOW_TYPE } from '../../../scripts/global/GConst';
import { BattleBase } from './base/BattleBase';
import { BattleCallback } from './base/BattleCallback';
import { BattleMove } from './base/BattleMove';
import { BattleSequnence } from './base/BattleSequence';
import { BattleSpawn } from './base/BattleSpawn';
import { BattleFlyWorld } from './BattleFlyWorld';

export class BattleDamage extends BattleSequnence {
    private ap: number;
    private vp: number;
    private effects: Effect[] = [];
    static Create (ap: number, vp: number, effects: Effect[]) {
        const action = new BattleDamage();
        action.ap = ap;
        action.vp = vp;
        action.effects = effects;
        return action;
    }

    onEnter () {
        super.onEnter();
        this.showDamage(this.ap, this.vp, this.effects);
    }

    /** 显示伤害效果 */
    showDamage (ap: number, p: number, effects: Effect[]) {
        const action_list: BattleBase[] = []; // 并行
        let hasBJ = false;
        const atk_entity = this.battleM.getEntityByP(ap);
        const vic_entity = this.battleM.getEntityByP(p);
        let allHurt = 0;
        effects.forEach((e) => {
            switch (e.K) {
                case CLIENT_SHOW_TYPE.SHIELD: // 受击者 上护盾
                    action_list.push(BattleCallback.Create(() => {
                        this.battleM.shieldStatus(vic_entity, e.V);
                    }));
                    break;
                case CLIENT_SHOW_TYPE.LookAt: // 男仙童，盯着你打
                    action_list.push(BattleCallback.Create(() => {
                        vic_entity.lockup(e.V === 1);
                    }));
                    break;
                case CLIENT_SHOW_TYPE.SHIELD_HURT: // 护盾伤害状态
                case CLIENT_SHOW_TYPE.IceShieldUse: // 冰盾伤害状态
                    // action_list.push(BattleCallback.Create(() => {
                    //     BattleFlyWorld.Create(atk_entity, e.V.toString(), e.K);
                    // }));
                    break;
                case CLIENT_SHOW_TYPE.SKILL_ATTACK:
                case CLIENT_SHOW_TYPE.SOUL_BLOW:
                case CLIENT_SHOW_TYPE.CRIT:
                case CLIENT_SHOW_TYPE.DEFAULT_ATTACK:
                case CLIENT_SHOW_TYPE.DOUBLE_HIT:
                case CLIENT_SHOW_TYPE.GOD_HIT:
                case CLIENT_SHOW_TYPE.BeSwallow:
                case CLIENT_SHOW_TYPE.Swallow:
                    allHurt += e.V;
                    break;
                case CLIENT_SHOW_TYPE.SHOW_BOOLD:
                    // 飘字但不减血,应要求不再飘
                    break;
                default:
                    effects.forEach((e) => {
                        if (e.K === CLIENT_SHOW_TYPE.CRIT) {
                            hasBJ = true;
                        }
                    });
                    action_list.push(DomDamage.Ctrate(p, e, hasBJ));
                    // action_list.push(BattleCallback.Create(() => {
                    //     BattleFlyWorld.Create(atk_entity, e.V.toString(), e.K);
                    // }));
                    break;
            }
            if (e.Protect) {
                // 有人保护受击者
                action_list.push(Protect.Create(p, e.Protect));
            }
        });
        this.addAction(BattleSpawn.Create(action_list));
    }
}

class Protect extends BattleSequnence {
    private p: number;
    private pp: number;
    static Create (p: number, pp: number) {
        const action = new Protect();
        action.p = p;
        action.pp = pp;
        return action;
    }

    onEnter () {
        super.onEnter();
        const tp = this.p;
        const pp = this.pp;
        const p_entity = this.battleM.getEntityByP(pp);
        if (!p_entity) { return; }
        if (p_entity.keepNode && p_entity.keepNode.isValid) {
            // 保护者有持续buff，比如眩晕，要清除
            p_entity.keepNode.destroy();
            p_entity.keepNode = undefined;
        }
        const target_entity = this.battleM.getEntityByP(tp);
        const pos = this.battleM.getEntityPosInfo(pp % this.battleM.secondB, pp);
        p_entity.protectXY = pos;
        p_entity.isProtect = true;
        target_entity.protectPos = pp;
        const tpos = this.battleM.getTargetPos(tp);
        this.addAction(BattleMove.CreateTo(p_entity, tpos, this.battleM.attackMoveToTime));
    }
}

class DomDamage extends BattleBase {
    private ap: number;
    private m_ate: Effect;
    private m_hasBJ = false;

    public static Ctrate (ap: number, ate: Effect, hasBJ = false): DomDamage {
        const action = new DomDamage();
        action.m_ate = ate;
        action.ap = ap;
        action.m_hasBJ = hasBJ;
        return action;
    }

    public onEnter () {
        super.onEnter();
        const ate = this.m_ate;
        const _curBOSS: FightUnit = this.battleM.getBossUnit();
        const _attackerPly = this.battleM.getEntityByP(this.ap);
        // const _fightData = WarMgr.I.getFightRepotData();
        const clientSkill: Cfg_ClientSkill = Config.getI(Config.T.Cfg_ClientSkill).getDataByKey(ate.K.toString());
        if (!clientSkill) {
            // const act4 = BattleFlyWorld.Create(_attackerPly, ate.V.toString(), ate.K, v2(0, 0), null, false, 0, 0, -1, null, this.m_hasBJ);
            // this.addAction(act4);
            // act4.init(ba);
            // act4.onEnter();
        } else if (clientSkill.ForObj === 1) {
            // 如果状态是对自身
            if (clientSkill.Result === 1) {
                if (_curBOSS && this.ap === _curBOSS.P && _curBOSS.IsMH1) {
                    _curBOSS.H1 += ate.V;
                } else {
                    // 加血
                    _attackerPly.hp = -ate.V;
                }
            } else if (clientSkill.Result === -1) {
                // 不只灵兽园 所有护盾都要特殊处理
                const boss_unit = this.battleM.getBossUnit();
                const fight_type = this.battleM.getFightType();
                if (FightSceneIndexer.I.isNeedShield(fight_type)) {
                    let ShieldTrigger = Config.getI(Config.T.Cfg_Sect_Animal_Rage).selectByKey('1', 'ShieldTrigger');
                    if (fight_type === BATTLE_TYPE.worldBoss_PVE) {
                        ShieldTrigger = Config.getI(Config.T.Cfg_Act_WorldBoss).select('ShieldTrigger', 0);
                    }
                    // 当前有护盾 并且当前血量小于等于破盾血量
                    const st = Number(ShieldTrigger);
                    if (boss_unit.H1 > 0 && boss_unit.H <= (boss_unit.MH * st / 100) >> 0) {
                        boss_unit.IsMH1 = 1;
                    } else {
                        boss_unit.IsMH1 = 0;
                    }
                }
                // this.currentBOSS.IsMH1 = targetUnit.IsHp1;
                if (this.isBossUseShield(this.ap)) {
                    if (boss_unit.H1 < 1) {
                        // 如果护盾没有,就扣血,护盾一定是不会出现负数,不然就是数值有问题---问世东
                        boss_unit.H -= ate.V;
                    } else {
                        boss_unit.H1 -= ate.V;
                    }
                } else {
                    // 减血
                    _attackerPly.hp = ate.V;
                    if (boss_unit && this.ap === boss_unit.P) {
                        boss_unit.H -= ate.V;
                    }
                }
            }
        }
    }

    isBossUseShield (p: number) {
        const boss_unit = this.battleM.getBossUnit();
        return boss_unit && p === boss_unit.P && boss_unit.IsMH1;
    }
}
