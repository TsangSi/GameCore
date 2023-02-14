/* eslint-disable max-len */
import { Config } from '../../../scripts/config/Config';
import { CLIENT_SHOW_TYPE, TURN_ATK_TYPE } from '../../../scripts/global/GConst';
import { BattleBase } from './base/BattleBase';
import { BattleCallback } from './base/BattleCallback';
import { BattleSequnence } from './base/BattleSequence';
import { BattleSpawn } from './base/BattleSpawn';
import { BattleAttack } from './BattleAttack';
import { BattleFlyWorld } from './BattleFlyWorld';
import { BattleSkill } from './BattleSkill';

export class BattleLongAttack extends BattleSequnence {
    private step: FightStep;

    static Create (step: FightStep) {
        const action = new BattleLongAttack();
        action.step = step;
        return action;
    }

    onEnter () {
        super.onEnter();
        this.show(this.step);
    }

    private show (step: FightStep) {
        const action_sequence_list: BattleBase[] = [];
        const act = LongAttackStart.Create(step.P, step.S, !!step.ShowSkill);
        action_sequence_list.push(act);
        const act_entity = this.battleM.getEntityByP(step.P);
        const cfg_skill: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(step.S.toString());
        if (cfg_skill && cfg_skill.ClientSkillName) {
            const hl_id = this.battleM.getHLID(step.ChangeHL, step.ChangeHLSkin);
            // const act1 = BattleFlyWorld.Create(act_entity, cfg_skill.SkillName, CLIENT_SHOW_TYPE.SKILL_ATTACK, undefined, undefined, false, hl_id);
            const act2 = BattleCallback.Create(undefined, 300);
            const act3 = BattleSpawn.Create([/**act1*/, act2]);
            action_sequence_list.push(act3);
        }
        // const act4 = BattleSkill.Create(step.P, step.S, !!step.SamePlayFlag);
        // action_sequence_list.push(act4);
        const act5 = BattleCallback.Create(undefined, 100);
        const act6 = BattleAttack.Create(step, TURN_ATK_TYPE.Long);
        action_sequence_list.push(BattleSequnence.CreateList([act5, act6]));

        // 吞噬 吐出 处理 todo 暂时跳过
        this.addAction(BattleSpawn.Create(action_sequence_list));
    }
}

class LongAttackStart extends BattleSequnence {
    private s: number;
    private ap: number;
    private showSkill: boolean;
    static Create (ap: number, s: number, showSkill: boolean) {
        const action = new LongAttackStart();
        action.s = s;
        action.ap = ap;
        action.showSkill = showSkill;
        return action;
    }

    onEnter () {
        super.onEnter();
        const attack_entity = this.battleM.getEntityByP(this.ap);
        const cfg_skill: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(this.s.toString());
        if (this.showSkill) {
            // 显示技能名字
            if (cfg_skill.AnimPPlayTime > 0) {
                // 特殊处理英雄技能
                const str = `${Math.ceil(attack_entity.fightI / 3)}:${attack_entity.fightI}`;
                // BattleFlyWorld.Create(attack_entity, str, CLIENT_SHOW_TYPE.HERO_WORLD).onEnter();
            } else {
                // BattleFlyWorld.Create(attack_entity, cfg_skill.SkillName, CLIENT_SHOW_TYPE.PETA_GRAD).onEnter();
            }
        }
        if (cfg_skill.AnimSID) {
            this.battleM.showAnimSID(this.ap, cfg_skill.AnimSID);
        }
    }
}
