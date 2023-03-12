/*
 * @Author: hrd
 * @Date: 2022-06-26 00:17:57
 * @FilePath: \SanGuo\assets\script\game\battle\actions\turn\THitAction.ts
 * @Description: 受击行为
 *
 */

import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import ModelMgr from '../../../manager/ModelMgr';
import { BattleMgr } from '../../BattleMgr';
import { BattleTurnDataParse } from '../../BattleTurnDataParse';
import { SkillEffect } from '../../effect/SkillEffect';
import { UtilBattle } from '../../util/UtilBattle';
import {
    ActionType, AtkTimeKey, ExecuteType, MountPointIndex,
} from '../../WarConst';
import { ActionBase } from '../base/ActionBase';
import { UnitFuncAction } from '../base/UnitFuncAction';
import { UnitParallelAction } from '../base/UnitParallelAction';
import { UnitSeriesAction } from '../base/UnitSeriesAction';
import { TAudioEffAction } from '../TAudioEffAction';
import { TDamageBaseAction } from './TDamageBaseAction';

export class THitAction extends ActionBase {
    public mType = ActionType.Hit;
    public mStep: FightStep;
    private mSkillActionId: number;
    private _hitActionList: ActionBase[] = [];

    public static Create(step: FightStep, skillActionId: number): THitAction {
        const action = new THitAction();
        action.mStep = UtilBattle.I.copyDataHandler(step) as FightStep;
        action.executeType = ExecuteType.Series;
        action.mSkillActionId = skillActionId;
        action.parseData();
        return action;
    }

    /** 初始化触发器 */
    private parseData() {
        if (this.mStep.ET) this.executeType = this.mStep.ET;
        const actions = BattleTurnDataParse.ParseDatas(this.mStep.FS, this.mSkillActionId);
        if (actions && actions.length) {
            // this.pushAction(actions);
            this._hitActionList = actions;
            this.mStep.FS = [];
        }
    }

    public initAct(): void {
        this.showHitEffect();
    }

    public onEnter(): void {
        // this.showHitEffect();
        super.onEnter();
    }

    /** 显示受击特效 播放音效 */
    private showHitEffect() {
        const actList = [];
        const tagEntity = this.mWar.getEntity(this.mStep.TP);
        const atkEntity = this.mWar.getEntity(this.mStep.P);
        if (!(tagEntity && cc.isValid(tagEntity))) {
            return;
        }
        if (!this.mStep.EK) {
            return;
        }

        const CfgAtk: Cfg_AtkEffect = Config.Get(ConfigConst.Cfg_AtkEffect).getValueByKey(this.mStep.EK);
        const actCfg: Cfg_SkillActions = ModelMgr.I.BattleModel.getSkillActionCfg(this.mSkillActionId);
        // 播放受击特效
        const act0 = UnitFuncAction.Create(() => {
            let hitEffId = 0;
            if (!actCfg) {
                return;
            }
            if (actCfg.IsShake) {
                BattleMgr.I.doSceneShake();
            }
            if (actCfg.HitEffId && !CfgAtk.NotHitEff) {
                hitEffId = actCfg.HitEffId;
                const bodyAnimId = tagEntity.bodyRes() as number;
                const offPos = ModelMgr.I.BattleModel.getModelMountPoint(bodyAnimId, MountPointIndex.body);

                const isHideEff = UtilBattle.I.isHideEff(atkEntity);
                SkillEffect.I.PlayHitEff(tagEntity, hitEffId, offPos, isHideEff);
            }
        }, 0);

        if (actCfg) {
            actList.push(act0);
        }

        // 播放音效
        actList.push(TAudioEffAction.Create(this.mSkillActionId));
        const damageActList = [];
        const act3 = TDamageBaseAction.Create(this.mStep);
        damageActList.push(act3);
        if (this._hitActionList.length) {
            damageActList.push(...this._hitActionList);
        }
        actList.push(UnitSeriesAction.CreateList(damageActList));

        // 没有攻击动作 没有位移
        let isNoAtk: boolean = false;
        if (CfgAtk.NotHit) {
            isNoAtk = true;
        }
        isNoAtk = false;
        if (!isNoAtk) {
            let isUp: boolean = false;
            if (UtilBattle.I.isUpCamp(this.mStep.TP)) {
                isUp = true;
            }
            const act2 = THitMoveAction.Create(tagEntity, isUp, this.mStep.TP);
            actList.push(act2);

            if (tagEntity && tagEntity.isValid) {
                tagEntity.mAnimState.hit();
            }
        }

        const act = UnitParallelAction.Create(actList);
        this.pushAction(act);
        // console.log(this.mActions);
    }
}

/** 受击位移行为 */
export class THitMoveAction extends ActionBase {
    private mTarget: cc.Node = null;
    private mIsUp: boolean;
    private mPos: number;

    public static Create(target: cc.Node, isUp: boolean = true, pos: number = 0): THitMoveAction {
        const action = new THitMoveAction();
        action.mTarget = target;
        action.mIsUp = isUp;
        action.executeType = ExecuteType.Series;
        action.mPos = pos;
        // action.doParse();
        return action;
    }

    private doParse() {
        let p1 = cc.v2(-32, 20);
        let p2 = cc.v2(32, -20);
        if (this.mIsUp === false) {
            p1 = cc.v2(32, -20);
            p2 = cc.v2(-32, 20);
        }
        const tpos: cc.Vec2 = this.mWar.getEntityPosInfo(UtilBattle.I.getRealPos(this.mPos), this.mPos);
        this.mTarget.x = tpos.x;
        this.mTarget.y = tpos.y;

        // eslint-disable-next-line dot-notation
        let hitTwen: cc.Tween = this.mTarget['_hitTwen'];
        if (hitTwen) {
            hitTwen.stop();
        }
        const time = UtilBattle.I.getFightAtkTime(AtkTimeKey.AtkHitTime);
        const t1 = cc.tween(this.mTarget).by(time / 1000, { x: p1.x, y: p1.y });
        const t2 = cc.tween(this.mTarget).by(time / 1000, { x: p2.x, y: p2.y });
        hitTwen = cc.tween(this.mTarget).sequence(t1, t2).start();
        // eslint-disable-next-line dot-notation
        this.mTarget['_hitTwen'] = hitTwen;
    }

    public onEnter(): void {
        super.onEnter();
        this.doParse();
    }
}
