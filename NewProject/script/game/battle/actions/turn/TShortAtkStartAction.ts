/*
 * @Author: hrd
 * @Date: 2022-06-27 10:08:15
 * @FilePath: \SanGuo\assets\script\game\battle\actions\turn\TShortAtkStartAction.ts
 * @Description: 近程攻击出手行为
 *
 */

import { ACTION_DIRECT, ACTION_TYPE } from '../../../base/anim/AnimCfg';
import EntityBattle from '../../../entity/EntityBattle';
import { EntityAcionName } from '../../../entity/EntityConst';
import { UtilBattle } from '../../util/UtilBattle';
import { AtkTimeKey, ExecuteType } from '../../WarConst';
import { ActionBase } from '../base/ActionBase';
import { UnitEntityAction } from '../base/UnitEntityAction';
import { UnitFuncAction } from '../base/UnitFuncAction';
import { UnitMoveAction } from '../base/UnitMoveAction';
import { UnitParallelAction } from '../base/UnitParallelAction';
import { UnitSeriesAction } from '../base/UnitSeriesAction';

export class TShortAtkStartAction extends ActionBase {
    private mStep: FightStep;
    private mTagPos: cc.Vec2 = null;
    private mSpeed: number = 2;

    public static Create(step: FightStep, tagPos: cc.Vec2 = null): TShortAtkStartAction {
        const action = new TShortAtkStartAction();
        action.executeType = ExecuteType.Series;
        action.mStep = step;
        if (tagPos) {
            action.mTagPos = cc.v2(tagPos.x, tagPos.y);
        }

        return action;
    }
    public onEnter(): void {
        super.onEnter();

        const step = this.mStep;
        const entity = this.mWar.getEntity(step.P);
        if (!(entity && cc.isValid(entity))) {
            return;
        }
        let direct: number = ACTION_DIRECT.LEFT_UP;
        if (UtilBattle.I.isUpCamp(step.P)) {
            direct = ACTION_DIRECT.RIGHT_DOWN;
        }
        let tpos = this.mTagPos;
        if (!tpos) {
            tpos = UtilBattle.I.getAtkPos(step.TP, false);
        }
        const locPosX = entity.position.x;
        const locPosY = entity.position.y;
        const _startPos = cc.v2(locPosX, locPosY);
        const distance = cc.Vec2.distance(_startPos, tpos);
        const time = distance / this.mSpeed;

        // eslint-disable-next-line dot-notation
        const hitTwen: cc.Tween = entity['_hitTwen'] as cc.Tween;
        if (hitTwen) {
            hitTwen.stop();
        }
        const a1 = UnitEntityAction.Create(entity, EntityAcionName.run, direct);
        const a2 = UnitMoveAction.CreateMoveTo(entity, tpos, time);
        const a3 = UnitEntityAction.Create(entity, EntityAcionName.stand, direct);
        this.pushAction(UnitParallelAction.Create([a1, a2]));
        // this.pushAction(a3);
    }
}

export class TShortAtkEndAction extends ActionBase {
    private mStep: FightStep;
    private mAiaPlyList: EntityBattle[] = null;

    public static Create(step: FightStep, aiaPlys: EntityBattle[] = []): TShortAtkEndAction {
        const action = new TShortAtkEndAction();
        action.executeType = ExecuteType.Series;
        action.mStep = step;
        action.mAiaPlyList = aiaPlys;
        return action;
    }

    public onEnter(): void {
        super.onEnter();

        const step = this.mStep;
        const entity = this.mWar.getEntity(step.P);
        if (!(entity && cc.isValid(entity))) {
            return;
        }
        let direct: number = ACTION_DIRECT.LEFT_UP;
        if (UtilBattle.I.isUpCamp(step.P)) {
            direct = ACTION_DIRECT.RIGHT_DOWN;
        }
        const AtkOverMoveBackTime = UtilBattle.I.getFightAtkTime(AtkTimeKey.AtkOverMoveBackTime);

        const a1 = UnitEntityAction.Create(entity, EntityAcionName.run, direct);
        const tpos: cc.Vec2 = this.mWar.getEntityPosInfo(UtilBattle.I.getRealPos(step.P), step.P);
        const a2 = UnitMoveAction.CreateMoveTo(entity, tpos, AtkOverMoveBackTime);
        const a3 = UnitEntityAction.Create(entity, EntityAcionName.stand, direct);
        this.pushAction(a1);
        this.pushAction(a2);
        this.pushAction(a3);

        if (this.mAiaPlyList && this.mAiaPlyList.length > 0) {
            const action_list = [];
            for (let index = 0; index < this.mAiaPlyList.length; index++) {
                const aiaPly = this.mAiaPlyList[index];
                const mePos: cc.Vec2 = UtilBattle.I.getAtkPos(step.P, false);
                const act5 = UnitMoveAction.CreateMoveTo(aiaPly, mePos, AtkOverMoveBackTime);
                const act6 = UnitFuncAction.Create(() => {
                    aiaPly.destroy();
                });
                action_list.push(UnitSeriesAction.CreateList([act5, act6]));
            }
            this.pushAction(UnitParallelAction.Create(action_list));
        }
    }
}
