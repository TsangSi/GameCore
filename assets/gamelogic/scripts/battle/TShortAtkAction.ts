import { AnimationClip, v2, Vec2, Vec3 } from 'cc';
import { ACTION_TYPE } from '../../../scripts/action/ActionConfig';
import { Config } from '../../../scripts/config/Config';
import { CLIENT_SHOW_TYPE, TURN_ATK_TYPE } from '../../../scripts/global/GConst';
import { BattleBase } from './base/BattleBase';
import { BattleCallback } from './base/BattleCallback';
import { BattleMove } from './base/BattleMove';
import { BattleSequnence } from './base/BattleSequence';
import { BattleSpawn } from './base/BattleSpawn';
import { BattleAttack } from './BattleAttack';
import { BattleFlyWorld } from './BattleFlyWorld';
import { BattleManager } from './BattleManager';
import { BattleSkill } from './BattleSkill';
import { BattleAttackEnd, BattleAttackStart } from './BattleShortAttack';
import { FightEntity } from '../../../scripts/action/FightEntity';

export class TShortAtkAction extends BattleSequnence {
    private m_step: FightStep;
    /** 分身模型容器 */
    private m_fenSList: FightEntity[] = [];
    public static Create(step: FightStep): TShortAtkAction {
        const action = new TShortAtkAction();
        action.m_step = step;
        return action;
    }
    public onEnter() {
        super.onEnter();
        this.parseData();
    }
    private parseData() {
        const step = this.m_step;
        const skillCfg: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(step.S.toString());
        const action_sequence_List = []; // 串
        let action_spawn_List = []; // 并
        if (skillCfg && skillCfg.ClientSkillName) { // 是否需要显示技能名字
            const atk_entity = BattleManager.I.getEntityByP(step.P);
            const hlID = this.battleM.getHLID(step.ChangeHL, step.ChangeHLSkin);
            // const act1 = BattleFlyWorld.Create(atk_entity, skillCfg.SkillName, CLIENT_SHOW_TYPE.SKILL_ATTACK, v2(0, 0), null, false, hlID);
            // 延迟 300毫秒 再移动到目标前
            const act2 = BattleCallback.Create(undefined, 300);
            const act3 = BattleSpawn.Create([/**act1*/, act2]);
            action_sequence_List.push(act3);
        }
        // 移动要目标前且执行攻击
        const atkUnit = step.U[0];
        const act4 = BattleAttackStart.Create(step, atkUnit); // 移动到目标前
        const act7 = BattleAttack.Create(step, TURN_ATK_TYPE.Short); // 执行攻击
        const aa = BattleSequnence.CreateList([act4, act7]); // 串行动作
        action_sequence_List.push(aa);
        if (this.isFenS2006() && this.m_step.U.length > 1) { // 美猴王分身
            this.doFenS2006Action(action_spawn_List);
        }
        if (skillCfg && skillCfg.AnimId) {
            // 显示技能特效
            // const actEff = BattleSkill.Create(step.P, step.S, step.SamePlayFlag === 1);
            // action_spawn_List.push(actEff);
        }
        if (skillCfg && skillCfg.AttackFenShen) {
            // let act6 = TSplitBodyAtkAction.CreateAtk(step);
            // action_spawn_List.push(act6);
            action_spawn_List = action_spawn_List.concat(this.doSplitBodyAtk(skillCfg.AnimId));
        }
        // 处理异兽吞噬技能（进程为吞入）todo
        // if (action_spawn_List.length > 0) {
        //     let atkAction = UnitSpawnAction.Create(action_spawn_List);
        //     action_sequence_List.splice(0, 0, atkAction);
        // }
        /** 攻击完毕返回原位 */
        const act = BattleAttackEnd.Create(step.P, this.m_fenSList);
        action_sequence_List.push(act);
        const spawnAction = BattleSpawn.Create(action_spawn_List);
        const sequenceAction = BattleSequnence.CreateList(action_sequence_List);
        const action = BattleSpawn.Create([spawnAction, sequenceAction]);
        this.addAction(action);
    }

    /** 是否为美猴王分身 */
    private isFenS2006() {
        const _attackerPly = this.battleM.getEntityByP(this.m_step.P);
        if (this.m_step.U.length > 0 && _attackerPly.fightI === 2006) {
            return true;
        }
        return false;
    }
    /** 处理美猴王分身处理 */
    private doFenS2006Action(action_spawn_List: BattleBase[]) {
        const step = this.m_step;
        const _attackerPly = this.battleM.getEntityByP(this.m_step.P);
        for (let idx = 1; idx < this.m_step.U.length; idx++) {
            const aUnit = step.U[idx];
            const tpos: Vec3 = this.battleM.getTargetPos(aUnit.P);
            const aiaPly = _attackerPly.cloneAia();
            this.m_fenSList.push(aiaPly);
            aiaPly.parent = _attackerPly.parent;
            aiaPly.setPosition(_attackerPly.position.x, _attackerPly.position.y);
            // aiaPly.zIndex = _attackerPly.zIndex;
            const act1 = BattleMove.CreateTo(aiaPly, tpos, this.battleM.attackMoveToTime);
            const act2 = BattleCallback.Create(() => {
                aiaPly.playAction(ACTION_TYPE.ATTACK, undefined, AnimationClip.WrapMode.Normal);
            });
            action_spawn_List.push(BattleSequnence.CreateList([act1, act2]));
        }
    }
    /** 处理配置表分身攻击类型  */
    private doSplitBodyAtk(animid: number) {
        const action_spawn_List: BattleBase[] = [];
        const step = this.m_step;
        for (let i = 1; i < step.U.length; i++) {
            const act = this.getSplitBodyAtkAction(step.P, step.U[i].P, animid);
            action_spawn_List.push(act);
        }
        return action_spawn_List;
    }
    /** 分身攻击 */
    private getSplitBodyAtkAction(pos: number, targetPos: number, AnimId: number): BattleBase {
        const entity = this.battleM.getEntityByP(this.m_step.P);
        const entityCopy = entity.cloneAia();
        entityCopy.parent = entity.parent;
        entityCopy.setPosition(entity.position.x, entity.position.y);
        this.m_fenSList.push(entityCopy);
        // entityCopy.playAction(entity..resourceAction, entity.role.resourceDirect);
        const vec = this.battleM.playersPosition(pos);
        const targetVec = this.battleM.getTargetPos(targetPos);
        const goT = this.battleM.attackMoveToTime;
        let stayT = this.battleM.attackStayTime;
        const backT = this.battleM.attackMoveToTime;
        stayT = 0;
        const a1 = BattleMove.CreateTo(entityCopy, targetVec, goT);
        // let a2 = UnitDelayAction.Create(stayT);
        // let a3 = BattleMove.CreateTo(entityCopy, vec, backT);
        const a3 = BattleCallback.Create(() => {
            entityCopy.playAction(ACTION_TYPE.ATTACK, undefined, AnimationClip.WrapMode.Normal);
        });
        const a4 = BattleSequnence.CreateList([a1, a3]);
        const a5 = BattleCallback.Create(() => {
            const effect = this.battleM.getSkill(AnimId, false, this.battleM.isMe(targetPos));
            if (effect) {
                effect.setPosition(targetVec.x, targetVec.y);
            }
        }, goT);
        const a6 = BattleSpawn.Create([a4, a5]);
        return a6;
    }
    public onExit() {
        super.onExit();
        if (this.m_fenSList && this.m_fenSList.length > 0) {
            this.m_fenSList.forEach((aiaPly) => {
                aiaPly.release();
            });
            this.m_fenSList = [];
        }
    }
}
