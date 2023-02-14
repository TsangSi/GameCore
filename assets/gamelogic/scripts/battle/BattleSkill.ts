/* eslint-disable max-len */
import { Animation, Node, Sprite, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import ActionBase from '../../../scripts/action/ActionBase';
import { ACTION_DIRECT } from '../../../scripts/action/ActionConfig';
import { Config } from '../../../scripts/config/Config';
import { BundleType } from '../../../scripts/global/GConst';
import UIManager from '../../../scripts/ui/UIManager';
import UtilsCC from '../../../scripts/utils/UtilsCC';
import UtilsTime from '../../../scripts/utils/UtilsTime';
import { BattleCallback } from './base/BattleCallback';
import { BattleMove } from './base/BattleMove';
import { BattleSequnence } from './base/BattleSequence';
import { BattleSpawn } from './base/BattleSpawn';

export class BattleSkill extends BattleSequnence {
    private ap: number;
    private skillid: number;
    private flagSamePlay: boolean;
    static Create(ap: number, skillid: number, flagSamePlay: boolean) {
        const action = new BattleSkill();
        action.ap = ap;
        action.skillid = skillid;
        action.flagSamePlay = flagSamePlay;
        return action;
    }

    onEnter() {
        super.onEnter();
        this.show(this.ap, this.skillid, this.flagSamePlay);
    }

    private show(ap: number, skillid: number, flagSamePlay: boolean) {
        const skillCfg: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(skillid.toString());
        if (!skillCfg || !skillCfg.AnimPId) { return; }

        const attackEntity = this.battleM.getEntityByP(ap);

        let mark = '';
        let n = skillCfg.AnimPId.length - 1;
        let s = skillCfg.AnimPId.substr(n, 1);
        // eslint-disable-next-line no-restricted-globals
        while (isNaN(Number(s))) {
            mark = s + mark;
            n--;
            s = skillCfg.AnimPId.substr(n, 1);
        }

        const dt = 0.5;
        let bPos = this.battleM.playersPosition(this.battleM.BOSS_POS);
        const pos52c = v2(1000, -950);
        const offset = v2(0, 0);
        if (skillCfg.AnimEnlarge1 === 0) { // 特效缩放
            skillCfg.AnimEnlarge1 = 100;
        }
        const sc = v2(skillCfg.AnimEnlarge1 / 200, skillCfg.AnimEnlarge1 / 200);
        if (this.battleM.isTeamUp(ap % this.battleM.secondB)) {
            pos52c.x *= -1;
            pos52c.y *= -1;
            sc.x *= -1;
            sc.y *= -1;
            bPos = this.battleM.playersPosition(this.battleM.ROLE_POS);
            if (attackEntity.flagCharm) {
                bPos = this.battleM.playersPosition(this.battleM.BOSS_POS);
            }
        } else if (attackEntity.flagCharm) {
            bPos = this.battleM.playersPosition(this.battleM.ROLE_POS);
        }
        let dir = -1;
        if (skillCfg.AnimPDir) {
            // 如果有方向，就用真实方向，且不翻转
            dir = ap > 10 ? ACTION_DIRECT.RIGHT_DOWN : ACTION_DIRECT.LEFT_UP;
            sc.x *= sc.x < 0 ? -1 : 1;
            sc.y *= sc.y < 0 ? -1 : 1;
        }
        if (skillCfg.AnimPUseCenter) {
            // 如果使用场景中心点偏移
            if (skillCfg.AnimPUseCenter === '1') {
                bPos.x = 0;
                bPos.y = 0;
            } else {
                const pxy = skillCfg.AnimPUseCenter.split('|');
                let p = ['0', '0'];
                if (ap > 10) {
                    p = pxy[0].split(':');
                } else {
                    p = pxy[1].split(':');
                }
                bPos.x = +p[0];
                bPos.y = +p[1];
            }
        }

        switch (mark) {
            case 'p':
                this.addAction(MoveAimEff.Create(ap, skillid, flagSamePlay, dir, pos52c, sc));
                break;
            case 'ps':
                // 图片移动特效 26度
                this.addAction(ImageMoveEff.Create(skillid, dt, pos52c, sc));
                break;
            case 'pp':
                // cocos特效
                this.addAction(BattleCallback.Create(() => {
                    this.cocosEffAction(skillCfg.SkillId, sc);
                }));
                break;
            case 's':
                // 包含桃园结义处理
                // 动画原地特效
                this.addAction(ComEffect.Create(ap, skillid, dir, sc, bPos, flagSamePlay));
                break;
            default:
                break;
        }
    }

    private _prefabSkill: { [name: string]: Node; } = {};
    /**
     * prefab动画技能池
     * @param skillID 技能ID
     */
    private prefabSkill(skillID: string, callback?: () => void): Node {
        let effect: Node = this._prefabSkill[skillID];
        if (effect) {
            if (callback) callback();
        } else {
            effect = new Node();
            this.battleM.addToBattle(effect);
            effect.addComponent(UITransform);
            const path = `e/prefab/action/${skillID}/${skillID}`;
            UIManager.I.showPrefab(effect, path, BundleType.gamelogic, (e, n) => {
                if (effect && effect.isValid) {
                    this._prefabSkill[skillID] = effect;
                }
                if (callback) {
                    callback();
                }
            }, this);
        }
        return effect;
    }

    private cocosEffAction(skillid: number, sc: Vec2) {
        const skillCfg: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(skillid.toString());
        const effect = this.prefabSkill(skillCfg.AnimPId, () => {
            effect.getComponent(Animation).play();
        });
        effect.setScale(sc.x, sc.y);
    }
}

class MoveAimEff extends BattleSequnence {
    private ap: number;
    private skillid: number;
    private flagSamePlay: boolean;
    private dir: number;
    private pos52: Vec2;
    private sc: Vec2;
    static Create(ap: number, skillid: number, flagSamePlay: boolean, dir: number, pos52: Vec2, sc: Vec2) {
        const action = new MoveAimEff();
        action.ap = ap;
        action.skillid = skillid;
        action.flagSamePlay = flagSamePlay;
        action.dir = dir;
        action.pos52 = pos52;
        action.sc = sc;
        return action;
    }

    onEnter() {
        super.onEnter();
        this.show(this.ap, this.skillid, this.flagSamePlay, this.dir, this.pos52, this.sc);
    }

    private show(ap: number, skillid: number, flagSamePlay: boolean, dir: number, pos52c: Vec2, sc: Vec2) {
        const offset = v2(0, 0);
        const actions = [];
        const skillCfg: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(skillid.toString());
        if (!skillCfg || !skillCfg.AnimPId) { return; }

        if (skillCfg.AnimPDir) {
            dir = ap > 10 ? ACTION_DIRECT.RIGHT_DOWN : ACTION_DIRECT.LEFT_UP;
        }
        // 动画移动特效 26度
        const se1: ActionBase = this.battleM.getSkill(skillCfg.AnimPId, !!skillCfg.AnimPPlayTime, ap === this.battleM.ROLE_POS, dir);
        if (!se1) { return; }
        if (!skillCfg.AnimPPlayTime) { return; }
        // 过程动画要处理的

        let dt = skillCfg.AnimPPlayTime;
        if (flagSamePlay) {
            dt = 300;
        }
        actions.push(BattleCallback.Create(() => {
            se1.release();
        }, dt));
        // const act1 = UnitFuncAction.Create(() => {
        //     se1.removeFromParent();
        // }, dt);

        // _actlist.push(act1);

        for (let i = 0; i < 8; i++) {
            const soldier: ActionBase = this.battleM.getSkill(`${skillCfg.AnimPId}a`, !!skillCfg.AnimPPlayTime, ap === this.battleM.ROLE_POS, dir);
            let ranX = Math.random() * 500 + 100;
            let ranY = Math.random() * 500 + 100;
            if (ap > 10) {
                ranX *= -1;
            } else {
                ranY *= -1;
            }
            const x = pos52c.x + offset.x + ranX;
            const y = pos52c.y + offset.y + ranY;
            soldier.setPosition(x, y);
            const p = v2(-pos52c.x + offset.x + ranX, -pos52c.y + offset.y + ranY);
            const a1 = BattleMove.CreateTo(soldier, v3(p.x, p.y), dt);
            const a2 = BattleCallback.Create(() => {
                soldier.setPosition(x, y);
            });
            const act2 = BattleSequnence.CreateList([a1, a2]);
            actions.push(act2);
        }

        se1.setScale(sc.x, sc.y);
        const x = pos52c.x + offset.x;
        const y = pos52c.y + offset.y;
        se1.setPosition(x, y);

        const p = v2(-pos52c.x + offset.x, -pos52c.y + offset.y);
        const a1 = BattleMove.CreateTo(se1, v3(p.x, p.y), dt);
        const a2 = BattleCallback.Create(() => {
            se1.setPosition(x, y);
        });
        const act3 = BattleSequnence.CreateList([a1, a2]);
        actions.push(act3);
        this.addAction(BattleSpawn.Create(actions));
    }
}

class ImageMoveEff extends BattleSequnence {
    private skillid: number;
    private dt: number;
    private pos52: Vec2;
    private sc: Vec2;
    static Create(skillid: number, dt: number, pos52: Vec2, sc: Vec2) {
        const action = new ImageMoveEff();
        action.skillid = skillid;
        action.dt = dt;
        action.pos52 = pos52;
        action.sc = sc;
        return action;
    }

    onEnter() {
        super.onEnter();
        this.show(this.skillid, this.dt, this.pos52, this.sc);
    }

    private show(skillid: number, dt: number, pos52c: Vec2, sc: Vec2) {
        const offset = v2(0, 0);
        const d = UtilsTime.frameTimeToSecond(dt);
        const skillCfg: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(skillid.toString());

        const path = `action/texture/action/skill_effect/action_${skillCfg.AnimPId}/skill_effect${skillCfg.AnimPId}_s`;
        const snode = this.getImgSkill(path, (sn: Sprite) => {
            sn.node.setScale(sc.x, sc.y);
        });
        const x = pos52c.x + offset.x;
        const y = pos52c.y + offset.y;
        snode.setPosition(x, y);
        const pos = v2(-pos52c.x + offset.x, -pos52c.y + offset.y);
        this.addAction(BattleMove.CreateTo(snode, v3(pos.x, pos.y), dt));
        this.addAction(BattleCallback.Create(() => {
            snode.destroy();
        }));
    }

    private getImgSkill(path: string, callback?: (sp: Sprite) => void): Node {
        const skillNode = new Node();
        this.battleM.addToBattle(skillNode);
        skillNode.addComponent(UITransform);
        const sp = skillNode.addComponent(Sprite);
        UtilsCC.setSprite(sp, path, callback);
        return skillNode;
    }
}

class ComEffect extends BattleSequnence {
    private ap: number;
    private skillid: number;
    private dir: number;
    private bPos: Vec3;
    private sc: Vec2;
    private flagSamePlay: boolean;
    static Create(ap: number, skillid: number, dir: number, sc: Vec2, bPos: Vec3, flagSamePlay: boolean) {
        const action = new ComEffect();
        action.ap = ap;
        action.skillid = skillid;
        action.dir = dir;
        action.sc = sc;
        action.bPos = bPos;
        action.flagSamePlay = flagSamePlay;
        return action;
    }

    onEnter() {
        this.show(this.ap, this.skillid, this.dir, this.sc, this.bPos, this.flagSamePlay);
    }

    private show(ap: number, skillid: number, dir: number, sc: Vec2, bPos: Vec3, flagSamePlay: boolean) {
        const action_list = [];
        const skillCfg: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(skillid.toString());

        let speed = 0;
        if (flagSamePlay) {
            speed = 2;
        }
        const se3 = this.battleM.getSkill(skillCfg.AnimPId, !!skillCfg.AnimPPlayTime, ap === this.battleM.ROLE_POS, dir);

        if (se3) {
            // 原地特效不用翻转
            const scaleX = sc.x < 0 ? -sc.x : sc.x;
            const scaleY = sc.y < 0 ? -sc.y : sc.y;
            se3.setScale(scaleX, scaleY);
            if (bPos.x !== 0) {
                se3.setPosition(bPos.x, se3.position.y);
            }
            if (bPos.y !== 0) {
                se3.setPosition(se3.position.x, bPos.y);
            }
        }

        const stepTime1 = skillCfg.AnimPPlayTime;
        if (!stepTime1) {
            // 不是持续技能
            this.addAction(BattleCallback.Create(undefined, 100));
            return;
        }

        action_list.push(BattleCallback.Create(() => {
            se3.release();
            se3.isUsed = false;
        }, stepTime1));

        const stepTime2 = skillCfg.AnimPPlayTimeDelay > 0 ? skillCfg.AnimPPlayTimeDelay : stepTime1;
        const act2 = BattleCallback.Create(undefined, stepTime2);
        const act3 = ComEffectChild.Create(ap, skillid, sc);
        const act4 = BattleSequnence.CreateList([act2, act3]);
        action_list.push(act4);
        this.addAction(BattleSpawn.Create(action_list));
    }
}

class ComEffectChild extends BattleSequnence {
    private skillid: number;
    private sc: Vec2;
    private ap: number;

    public static Create(ap: number, skillid: number, sc: Vec2) {
        const action = new ComEffectChild();
        action.ap = ap;
        action.skillid = skillid;
        action.sc = sc;
        return action;
    }

    public onEnter() {
        const skillCfg: Cfg_Skill = Config.getI(Config.T.Cfg_Skill).getDataByKey(this.skillid.toString());
        const sc = this.sc;
        const curPos = this.ap;

        const se3a = this.battleM.getSkill(`${skillCfg.AnimPId}a`, !!skillCfg.AnimPPlayTime, this.battleM.isMe(curPos));
        const delay2 = skillCfg.AnimPPlayTime2;
        if (!se3a) return;
        se3a.setScale(sc.x, sc.y);
        let bPos: Vec3 = null;
        if (curPos > 10) {
            bPos = this.battleM.playersPosition(this.battleM.ROLE_POS);
        } else {
            bPos = this.battleM.playersPosition(this.battleM.BOSS_POS);
        }
        se3a.setPosition(bPos.x, bPos.y);
        const act2 = BattleCallback.Create(() => {
            se3a.destroy();
        }, delay2);
        this.addAction(act2);
    }
}
