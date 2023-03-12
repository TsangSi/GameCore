/*
 * @Author: hrd
 * @Date: 2022-06-23 16:36:50
 * @FilePath: \SanGuo\assets\script\game\battle\actions\TEffectAction.ts
 * @Description: 特效行为
 *
 */

import { UtilString } from '../../../app/base/utils/UtilString';
import ModelMgr from '../../manager/ModelMgr';
import { BattleMgr } from '../BattleMgr';
import { SkillEffect } from '../effect/SkillEffect';
import { UtilBattle } from '../util/UtilBattle';
import { EffectType, ExecuteType, TargerPosType } from '../WarConst';
import { ActionBase } from './base/ActionBase';
import { UnitFuncAction } from './base/UnitFuncAction';
import { UnitMoveAction } from './base/UnitMoveAction';

export class TEffectAction extends ActionBase {
    /** 延迟时间单位毫秒 */
    public mDelay: number = 0;
    /** 特效Id */
    public mEffectId: number = 0;
    /** 技能id */
    private mSkillActionId: number = 0;
    private mActCfg: Cfg_SkillActions = null;
    private mHitStep: FightStep;
    private mIsDown: boolean = false;
    // private _zOrder: number = 200;
    private isHideEff: boolean = false;
    private mTargerPos: number = 0;

    public static Create(hitStep: FightStep, skillActionId: number): TEffectAction {
        const action = new TEffectAction();
        action.mHitStep = hitStep;
        action.mSkillActionId = skillActionId;

        return action;
    }

    public onEnter(): void {
        super.onEnter();
        this.onPlay();
    }

    private onPlay() {
        const actCfg: Cfg_SkillActions = ModelMgr.I.BattleModel.getSkillActionCfg(this.mSkillActionId);
        if (!actCfg) {
            return;
        }
        this.mActCfg = actCfg;
        const tagPos = this.mHitStep.P;
        if (UtilBattle.I.isUpCamp(tagPos)) {
            this.mIsDown = true;
        }
        const atkEntity = this.mWar.getEntity(tagPos);
        this.isHideEff = UtilBattle.I.isHideEff(atkEntity);

        const effType = actCfg.EffType;

        if (effType === EffectType.FxedPoint) {
            // 定点特效
            this.playFxedPointEff();
        } else if (effType === EffectType.Duration) {
            // 持续特效
            this.playDurationEff();
        } else if (effType === EffectType.FlyMove) {
            // 飞行类特效
            this.playFlyEff();
        }
    }

    /** 播放定点特效 */
    private playFxedPointEff() {
        const step = this.mHitStep;
        const actCfg = this.mActCfg;
        if (!actCfg.BlastEffId) return;
        const d = SkillEffect.I.getEffIdAndTargerPosType(`${actCfg.BlastEffId}`);
        const effId = d.effId;
        const targerPos = d.posType;
        const tagPos = step.TP;
        let parentNd: cc.Node = BattleMgr.I.SkillLayer2;
        let effPos: cc.Vec2 = cc.v2(0, 0);
        const info = SkillEffect.I.getEffPosAndZOrder(targerPos, this.mHitStep.TP);
        parentNd = info.nd;
        effPos = info.p;
        if (actCfg.TargerPos === TargerPosType.TargerBody) {
            const tagEntity = this.mWar.getEntity(tagPos);
            if (tagEntity && cc.isValid(tagEntity)) {
                parentNd = tagEntity;
            }
        }
        SkillEffect.I.PlayEffByPos(effPos, parentNd, effId, this.mIsDown, 0, this.isHideEff);
    }

    /** 播放持续特效 */
    private playDurationEff() {
        const actCfg = this.mActCfg;
        if (!actCfg.BlastEffId) return;
        const d = SkillEffect.I.getEffIdAndTargerPosType(`${actCfg.BlastEffId}`);
        const effId = d.effId;
        const targerPos = d.posType;
        let parentNd: cc.Node = BattleMgr.I.SkillLayer2;
        let effPos: cc.Vec2 = cc.v2(0, 0);
        const info = SkillEffect.I.getEffPosAndZOrder(targerPos, this.mHitStep.TP);
        parentNd = info.nd;
        effPos = info.p;

        SkillEffect.I.PlayEffByPos(effPos, parentNd, effId, this.mIsDown, actCfg.skillTime, this.isHideEff);
    }

    /** 播放飞行特效 */
    private playFlyEff() {
        const step = this.mHitStep;
        const actCfg = this.mActCfg;
        // const parentNd: cc.Node = BattleMgr.I.SkillLayer2;
        if (!actCfg.FlyEffId) return;

        const d = SkillEffect.I.getEffIdAndTargerPosType(`${actCfg.FlyEffId}`);
        const effId = d.effId;
        const targerPos = d.posType;

        const info = SkillEffect.I.getEffPosAndZOrder(targerPos, step.TP);
        const parentNd = info.nd;
        // effPos = info.p;
        const flyTime = actCfg.FlyTime;
        const startPos = UtilBattle.I.getPosVec2(step.P);
        const tpos: cc.Vec2 = UtilBattle.I.getPosVec2(step.TP);
        const effNode = SkillEffect.I.PlayEffByFly(startPos, parentNd, effId, this.mIsDown, flyTime / this.mWar.getSpeed(), this.isHideEff);
        const actList = [];

        // 向量转角度 减 90度资源修正角
        let angle = (Math.atan2(tpos.y - startPos.y, tpos.x - startPos.x) * 180 / Math.PI) - 90;
        if (this.mIsDown) {
            // 方向向下再次旋转180度
            angle += 180;
        }
        if (effNode) {
            effNode.angle = angle;
        }

        const act1 = UnitMoveAction.CreateMoveTo(effNode, tpos, flyTime);
        actList.push(act1);
        if (actCfg.BlastEffId) {
            const act2 = UnitFuncAction.Create(() => {
                this.playFxedPointEff();
                if (effNode && cc.isValid(effNode)) {
                    effNode.active = false;
                }
            }, 0);
            actList.push(act2);
        }
        this.pushAction(actList);
        this.executeType = ExecuteType.Series;
    }
}

/** 播放定点特效 */
export class TFxedPointEffectAction extends ActionBase {
    private mEffId: number = null;
    private mTargerPos: TargerPosType;
    private mTagPos: number;
    private mIsDown: boolean = false;
    private mIsHideEff: boolean = false;

    public static Create(effId: number, targerPos: TargerPosType, tagPos: number): TFxedPointEffectAction {
        const action = new TFxedPointEffectAction();
        action.mEffId = effId;
        action.mTargerPos = targerPos;
        action.mTagPos = tagPos;
        return action;
    }

    public onEnter(): void {
        super.onEnter();
        this.onPlay();
    }

    private onPlay() {
        const tagPos = this.mTagPos;
        if (UtilBattle.I.isUpCamp(tagPos)) {
            this.mIsDown = true;
        }
        this.playEff();
    }

    private getEffPosAndZOrder(): { p: cc.Vec2, nd: cc.Node } {
        const tagPos = this.mTagPos;
        let ndLayer = BattleMgr.I.SkillLayer2;
        let effPos: cc.Vec2 = cc.v2(0, 0);
        const tagEntity = this.mWar.getEntity(tagPos);
        if (this.mTargerPos === TargerPosType.TargerBody) {
            if (tagEntity && cc.isValid(tagEntity)) {
                ndLayer = tagEntity;
                effPos = cc.v2(0, 0);
            }
        } else if (this.mTargerPos === TargerPosType.TargerFloor) {
            if (tagEntity && cc.isValid(tagEntity)) {
                effPos = tagEntity.getPosition();
                ndLayer = BattleMgr.I.SkillLayer1;
            }
        } else if (this.mTargerPos === TargerPosType.SceneCentre) {
            effPos = cc.v2(0, 0);
        } else if (this.mTargerPos === TargerPosType.CampCentre) {
            effPos = UtilBattle.DownCompCentrePos;
            if (UtilBattle.I.isUpCamp(tagPos)) {
                effPos = UtilBattle.UpCompCentrePos;
            }
        } else if (this.mTargerPos === TargerPosType.TargerPos) {
            if (tagEntity && cc.isValid(tagEntity)) {
                effPos = tagEntity.getPosition();
                ndLayer = BattleMgr.I.SkillLayer2;
            }
        }
        return { p: effPos, nd: ndLayer };
    }

    /** 播放定点特效 */
    private playEff() {
        const effId = this.mEffId;
        if (!effId) return;
        let parentNd: cc.Node = BattleMgr.I.SkillLayer2;
        let effPos: cc.Vec2 = cc.v2(0, 0);
        const info = this.getEffPosAndZOrder();
        parentNd = info.nd;
        effPos = info.p;
        const eff = SkillEffect.I.PlayEffByPos(effPos, parentNd, effId, this.mIsDown, 0, this.mIsHideEff);
        if (eff) {
            // 挂载在目标身上的刀光特效跟随角色翻转
            if (this.mTargerPos === TargerPosType.TargerBody) {
                const tagEntity = this.mWar.getEntity(this.mTagPos);
                if (tagEntity && cc.isValid(tagEntity)) {
                    if (tagEntity.getBodyScaleX() < 0) {
                        eff.scaleX *= -1;
                    }
                }
            }
        }
    }
}
