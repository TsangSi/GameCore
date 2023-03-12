/*
 * @Author: hrd
 * @Date: 2022-07-12 11:40:23
 * @FilePath: \SanGuo\assets\script\game\battle\actions\turn\TDamageBaseAction.ts
 * @Description: 伤害行为
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import { E } from '../../../const/EventName';
import EntityBattle from '../../../entity/EntityBattle';
import { MonsterType } from '../../../entity/EntityConst';
import ModelMgr from '../../../manager/ModelMgr';
import { BattleMgr } from '../../BattleMgr';
import { BattleTurnDataParse } from '../../BattleTurnDataParse';
import { UtilBattle } from '../../util/UtilBattle';
import {
    ActionType, DamagResultType, ExecuteType, IBattleCampAtkInfo,
} from '../../WarConst';
import { ActionBase } from '../base/ActionBase';
import { UnitFuncAction } from '../base/UnitFuncAction';
import { UnitPlayWordAction } from '../base/UnitPlayWordAction';

export class TDamageBaseAction extends ActionBase {
    public mType = ActionType.Damage;
    public target: number;
    public type: number; // DamageTypes;
    public value: number;
    private mStep: FightStep;
    private _CfgAtk: Cfg_AtkEffect = null;
    private _actList: ActionBase[] = [];

    public static Create(step: FightStep): TDamageBaseAction {
        const action = new TDamageBaseAction();
        action.executeType = ExecuteType.Series;
        action.mStep = step;
        action.parseData();
        return action;
    }

    /** 初始化触发器 */
    private parseData() {
        const actions = BattleTurnDataParse.ParseDatas(this.mStep.FS);
        // if (this.mStep.ET) this.executeType = this.mStep.ET;
        if (actions && actions.length) {
            // this.pushAction(actions);
            this._actList = actions;
        }
    }

    // public onEnter(): void {
    //     super.onEnter();
    //     this.playDamage();
    // }

    public initAct(): void {
        this.playDamage();
    }

    private playDamage() {
        const hitStep = this.mStep;
        const tagEntity = this.mWar.getEntity(hitStep.TP);
        const atkEntity = this.mWar.getEntity(hitStep.P);
        if (!(tagEntity && cc.isValid(tagEntity))) {
            return;
        }
        const effId = hitStep.EK;
        this._CfgAtk = Config.Get(ConfigConst.Cfg_AtkEffect).getValueByKey(effId);

        // let hitVal = hitStep.EV;
        const tpos: cc.Vec2 = UtilBattle.I.getPosVec2(hitStep.TP);
        let aykUnit: FightUnit = null;
        if (atkEntity) {
            aykUnit = atkEntity.FightUnit;
        }
        const strVal = ModelMgr.I.BattleModel.getWordStrByEffId(hitStep.EK, hitStep.EV);
        const act1 = UnitPlayWordAction.Create(strVal, effId, aykUnit, tpos, tagEntity);
        this.pushAction(act1);
        const act2 = UnitFuncAction.Create(() => {
            this.doDamage();
        }, 0);
        this.pushAction(act2);
        if (this._actList.length) {
            this.pushAction(this._actList);
        }

        const act3 = UnitFuncAction.Create(() => {
            // 抛出我方阵营攻击事件
            if (!UtilBattle.I.isUpCamp(hitStep.P)) {
                const atkEntity = this.mWar.getEntity(hitStep.P);
                if (atkEntity && cc.isValid(atkEntity)) {
                    const FCampId = atkEntity.roleInfo.d.FCampId;
                    const info: IBattleCampAtkInfo = {};
                    info.campId = FCampId;
                    if (this._CfgAtk && this._CfgAtk.ResultAttr === 13001) {
                        info.campAtkDamage = +hitStep.EV;
                    }

                    EventClient.I.emit(E.Battle.MyCampAtkCount, info);
                }
            }
        }, 0);
        this.pushAction(act3);

        if (this._actList.length) {
            console.log('=====act====', this.mActions);
        }
    }

    private doDamage(): void {
        const hitStep = this.mStep;
        const EffId = hitStep.EK;
        const hitVal = hitStep.EV;
        const tagEntity = this.mWar.getEntity(hitStep.TP);
        if (!this._CfgAtk) return;
        const strVal = ModelMgr.I.BattleModel.getWordStrByEffId(EffId, hitVal);
        if (this._CfgAtk.ResultAttr === 13001) {
            const str = `--${this.mStep.TP}号位受击,HP:${strVal}，攻击者${this.mStep.P}号位`;
            BattleMgr.I.log(str);
            const isBoss = tagEntity.monsterType === MonsterType.Boss;
            const fbType = BattleMgr.I.getBattleReport().T;
            const cfg: Cfg_FightScene = Config.Get(ConfigConst.Cfg_FightScene).getValueByKey(fbType);
            if (cfg && cfg.NoDropHp === 1 && isBoss) {
                // boss只飘字不掉血
            } else {
                // 扣血、加血
                tagEntity.mAi.changeHp(this._CfgAtk.ResultType, hitVal);
                if (this._CfgAtk.ResultType === DamagResultType.AddHp) {
                    this.doRelive(tagEntity, EffId);
                }
            }

            if (isBoss) {
                EventClient.I.emit(E.Battle.BossHpChange, tagEntity.hp);
            }
        }
    }

    public doRelive(tagEntity: EntityBattle, EffId: number): void {
        if (EffId === 14) {
            tagEntity.mAi.relive();
        }
    }

    public isDie(): boolean {
        return false;
    }
}
