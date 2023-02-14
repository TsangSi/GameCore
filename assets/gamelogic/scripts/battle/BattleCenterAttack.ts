/* eslint-disable max-len */
import { Config } from '../../../scripts/config/Config';
import { CLIENT_SHOW_TYPE, TURN_ATK_TYPE } from '../../../scripts/global/GConst';
import { BattleCallback } from './base/BattleCallback';
import { BattleSequnence } from './base/BattleSequence';
import { BattleSpawn } from './base/BattleSpawn';
import { BattleAttack } from './BattleAttack';
import { BattleFlyWorld } from './BattleFlyWorld';
import { BattleAttackEnd, BattleAttackStart } from './BattleShortAttack';
import { BattleSkill } from './BattleSkill';

export class BattleCenterAttack extends BattleSequnence {
    private step: FightStep;
    static Create (step: FightStep) {
        const action = new BattleCenterAttack();
        action.step = step;
        return action;
    }

    onEnter () {
        super.onEnter();
        this.show();
    }

    private show () {
        const cfg_skill: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(this.step.S.toString());
        if (cfg_skill && cfg_skill.ClientSkillName) {
            const hl_id = this.battleM.getHLID(this.step.ChangeHL, this.step.ChangeHLSkin);
            const act_entity = this.battleM.getEntityByP(this.step.P);
            // const act1 = BattleFlyWorld.Create(act_entity, cfg_skill.SkillName, CLIENT_SHOW_TYPE.SKILL_ATTACK, undefined, undefined, false, hl_id);
            const act2 = BattleCallback.Create(undefined, 300);
            const act3 = BattleSpawn.Create([/**act1*/, act2]);
            this.addAction(act3);
        }

        const atk_unit = this.step.U[0];
        const act4 = BattleAttackStart.Create(this.step, atk_unit, this.battleM.SCENE_MID);
        const act7 = BattleAttack.Create(this.step, TURN_ATK_TYPE.Centre);
        const atk_list = [];
        if (cfg_skill.AnimId) {
            // const act_effect = BattleSkill.Create(this.step.P, this.step.S, !!this.step.SamePlayFlag);
            // atk_list.push(BattleSpawn.Create([act4, act_effect]));
            atk_list.push(act7);
        } else {
            atk_list.push(act4);
            atk_list.push(act7);
        }

        this.addAction(BattleSequnence.CreateList(atk_list));
        this.addAction(BattleAttackEnd.Create(this.step.P));
    }
}
