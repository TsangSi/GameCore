import { Animation, AnimationClip, Node, Vec3 } from 'cc';
import ActionBase from '../../../scripts/action/ActionBase';
import { ACTION_RES_TYPE, ACTION_TYPE } from '../../../scripts/action/ActionConfig';
import { FightEntity } from '../../../scripts/action/FightEntity';
import { EffectManager } from '../../../scripts/common/EffectManager';
import { Config } from '../../../scripts/config/Config';
import { CLIENT_SHOW_TYPE } from '../../../scripts/global/GConst';
import { BattleBase } from './base/BattleBase';
import { BattleCallback } from './base/BattleCallback';
import { BattleDamage } from './BattleDamage';
import { BattleFlyWorld } from './BattleFlyWorld';

/** 变身效果 */
const changeBodySkill = [3501, 3502, 3503];

export class BattleBuff extends BattleBase {
    private entity: FightEntity = undefined;
    private effects: Effect[] = [];
    private cu: FightUnit[] = [];
    private ap: number;
    static Create(ap: number, effects: Effect[], cu: FightUnit[]) {
        const action = new BattleBuff();
        action.ap = ap;
        action.effects = effects;
        action.cu = cu;
        action.entity = action.battleM.getEntityByP(ap);
        return action;
    }

    onEnter() {
        super.onEnter();
        this.riseBuff();
    }

    onUpdate(delta: number) {
        for (let i = this.getActionsLength() - 1; i >= 0; --i) {
            const action = this.getAction(i);
            if (!action.mInit) {
                action.onEnter();
                action.mInit = true;
            }
            if (action.onUpdate(delta) !== BattleBase.State.Runing) {
                this.delAction(i);
            }
        }
        if (this.getActionsLength() < 1) {
            return BattleBase.State.Finish;
        } else {
            return BattleBase.State.Runing;
        }
    }

    // 70000到80000之间都是法阵
    private isFaZhenValue(id: number) {
        if (id >= 70000 && id < 80000) {
            return true;
        }
        return false;
    }

    private riseBuff() {
        this.effects.forEach((effect: Effect, index: number) => {
            let buff: Cfg_Buff;
            let is_fly_str = true;
            let riseValue: string;
            let riseType: number | string = -1;
            switch (effect.K) {
                case CLIENT_SHOW_TYPE.IS_BUFF: // 这是一个buff
                    buff = Config.getI(Config.T.Cfg_Buff).getDataByKey(effect.V.toString());
                    this.doBuff(effect, buff.ClientEffect);
                    is_fly_str = buff.ClientEffect !== CLIENT_SHOW_TYPE.REVIVE;
                    riseType = buff.ClientEffect;
                    riseValue = buff.ParamClient;
                    break;
                case CLIENT_SHOW_TYPE.CALL: // 召唤
                    this.callEntityBirth();
                    break;
                case CLIENT_SHOW_TYPE.CALL_A: // 新召唤
                    this.newCallEntity();
                    break;
                case CLIENT_SHOW_TYPE.SHIELD: // 护盾
                    this.addAction(BattleCallback.Create(() => { this.battleM.shieldStatus(this.entity, effect.V); }));
                    break;
                case CLIENT_SHOW_TYPE.LookAt: // 男仙童，盯着你打
                    this.addAction(BattleCallback.Create(() => { this.entity.lockup(effect.V === 1); }));
                    break;
                case CLIENT_SHOW_TYPE.PigChange: // 变身猪妖
                    this.addAction(BattleCallback.Create(() => {
                        if (effect.V) {
                            this.entity.changeToMonment(1314, ACTION_RES_TYPE.PET);
                        } else {
                            this.entity.changeToMonment();
                        }
                    }));
                    break;
                case CLIENT_SHOW_TYPE.PigRest: // 变身猪妖休息
                    this.addAction(BattleCallback.Create(() => { this.entity.toRest(effect.V); }));
                    break;
                case CLIENT_SHOW_TYPE.BACK_BLOOD: // 加血、减血
                    this.backBlood(effect.V);
                    break;
                case CLIENT_SHOW_TYPE.ContinueDropHp: // 流血，灼烧
                    this.addAction(BattleDamage.Create(this.ap, this.ap, [effect]));
                    riseType = effect.K;
                    riseValue = `${effect.V}`;
                    break;
                case CLIENT_SHOW_TYPE.REVIVE:
                    is_fly_str = false;
                    break;
                default:
                    riseType = effect.K;
                    riseValue = `${effect.V}`;
                    break;
            }
            if (is_fly_str) {
                /// 飘字
                // this.addAction(BattleFlyWorld.Create(this.entity, riseValue, riseType));
            }
        });
    }

    /** 召唤 重生 */
    private callEntityBirth() {
        this.entity.playAction(ACTION_TYPE.ATTACK);
        // 复活招唤喊话一共5条.定值
        const num = Math.floor(5 * Math.random() + 1);
        const Word1: string = Config.getI(Config.T.Cfg_FightScene).selectByKey(num.toString(), 'Word1');
        if (Word1) {
            this.entity.chat = Word1;
        }

        this.cu.forEach((f: FightUnit, index: number) => {
            const u = this.battleM.getEntityByP(f.P);
            const pos: Vec3 = this.battleM.playersPosition(f.P);
            this.callBro(u, f.MH, pos);
            this.showEffectRB(pos);
        });
    }

    /** 新召唤 */
    private newCallEntity() {
        this.entity.playAction(ACTION_TYPE.ATTACK);
        // 招唤小弟
        this.cu.forEach((f) => {
            let u = this.battleM.getEntityByP(f.P);
            if (!u) {
                u = this.battleM.createEntity(f);
                this.battleM.addToBattle(u);
            }
            this.callBro(u, f.MH, this.battleM.playersPosition(f.P));
        });
    }

    private callBro(u: FightEntity, hp: number, pos: Vec3) {
        // this.dStr = ".招唤 " + fu.P + " 血量 " + fu.MH
        u.stopAllActions();
        u.hp = null;
        u.hp = hp;

        // 血条
        // u.healthBar.active = true;
        u.setScale(1, 1);
        u.playAction(ACTION_TYPE.STAND);
        u.setPosition(pos);
    }

    private rebirthAia: { use?: boolean, aia?: Node; }[] = [];
    /**
    * 重生特效动画缓存数组
    */
    private showEffectRB(pos: Vec3) {
        let rb: { use?: boolean, aia?: Node; } = null;
        for (let i = this.rebirthAia.length - 1; i > 0; i--) {
            const rb = this.rebirthAia[i];
            if (rb && rb.use) {
                this.rebirthAia.splice(i, 1);
            }
        }

        if (rb == null || rb.aia.isValid === false) {
            rb = { use: true, aia: new Node() };
            this.rebirthAia.push(rb);

            EffectManager.I.showEffect('e/fuben/ui_6421', rb.aia, AnimationClip.WrapMode.Normal, (n) => {
                n.name = 'aia';
            }, (n) => {
                rb.aia.active = false;
                rb.use = false;
            });
        } else {
            const aiac = rb.aia.getChildByName('aia').getComponent(Animation);
            const animState = aiac.getState('default');
            rb.aia.active = true;
            rb.use = true;
            animState.play();
        }
        if (rb.aia.parent == null) {
            this.battleM.addToBattle(rb.aia);
            // WarMgr.I.battle_node.addChild(rb.aia, WarMgr.skillDeep);
        }
        rb.aia.setPosition(pos);
    }

    /** 单纯一个buff */
    private doBuff(effect: Effect, ClientEffect: number) {
        let skill: ActionBase;
        if (ClientEffect === CLIENT_SHOW_TYPE.REVIVE) {
            this.entity.flagRelive = true;
        }

        if (changeBodySkill.indexOf(effect.V) >= 0) {
            // 变身buff
            this.entity.transformShow(ClientEffect, ACTION_RES_TYPE.PET, undefined, ACTION_TYPE.DEFAULT);
            skill = new ActionBase(1802, ACTION_RES_TYPE.SKILL);
            if (skill) {
                skill.setPosition(this.entity.position.x, this.entity.position.y);
            }
        } else if (this.isFaZhenValue(effect.V)) {
            // 法阵
            const n: any = this.entity.getChildByName('fazhen');
            skill = n;
            if (!skill || !skill.opacity) {
                if (skill) {
                    skill.updateShowAndPlay(ClientEffect, ACTION_RES_TYPE.SKILL, -1, ACTION_TYPE.DEFAULT, AnimationClip.WrapMode.Loop);
                    skill.opacity = 255;
                } else {
                    skill = new ActionBase(ClientEffect, ACTION_RES_TYPE.SKILL);
                    skill.name = 'fazhen';
                    this.entity.addChild(skill);
                }
            }
        } else if (ClientEffect === CLIENT_SHOW_TYPE.Charm) {
            // 魅惑
            this.entity.flagCharm = true;
        }
        if (skill) {
            skill.setPosition(this.entity.position.x, this.entity.position.y);
        }

        if (ClientEffect !== CLIENT_SHOW_TYPE.REVIVE) {
            // 复活不即时飘字。等触发时再飘 流血已经再 doHitDamage 内飘字
            // TweenUtils.I.riseWorld(entity, riseValue, riseType);
            // let act2 = UnitPlayWordAction.Create(step.P, riseValue, riseType);
            // this.pushAction(act2);
        }
    }

    /** 加、减血 */
    backBlood(addhp: number) {
        const boss_unit = this.battleM.getBossUnit();
        if (this.isBossUseShield(this.ap)) {
            boss_unit.H1 += addhp;
        } else if (this.entity) {
            this.entity.hp = -addhp;
        }
    }

    isBossUseShield(p: number) {
        const boss_unit = this.battleM.getBossUnit();
        return boss_unit && p === boss_unit.P && boss_unit.IsMH1;
    }
}
