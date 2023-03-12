/* eslint-disable max-len */
/*
 * @Author: hrd
 * @Date: 2022-06-23 16:27:16
 * @FilePath: \SanGuo\assets\script\game\battle\actions\base\UnitPlayWordAction.ts
 * @Description:
 *
 */

import EntityBattle from '../../../entity/EntityBattle';
import { BattleFloatWordMgr } from '../../BattleFloatWordMgr';
import { BattleMgr } from '../../BattleMgr';
import { WordEffect } from '../../effect/WordEffect';
import { IfloatWord } from '../../WarConst';
import { ActionBase } from './ActionBase';

export class UnitPlayWordAction extends ActionBase {
    /** 飘字特效id */
    private mWordEffId: number = 0;
    private mTagPos: cc.Vec2;
    private mWordStr: string = '';
    private mAtkUnit: FightUnit = null;
    private mEntity: EntityBattle = null;

    public static Create(wordStr: string, id: number, atkUnit: FightUnit, tagPos: cc.Vec2 = cc.v2(0, 0), entity: EntityBattle = null): UnitPlayWordAction {
        const action = new UnitPlayWordAction();
        action.mWordStr = wordStr;
        action.mWordEffId = id;
        action.mAtkUnit = atkUnit;
        action.mTagPos = tagPos;
        action.mEntity = entity;
        return action;
    }

    public onEnter(): void {
        super.onEnter();
        // todo 播放文字特效
        // console.log('====播放文字特效=====id:', this.mWordEffId);
        this.playEff();
    }

    public doExecute(): void {
        super.doExecute();
        this.playEff();
    }

    private playEff() {
        let targetNd = BattleMgr.I.BloodLayer;
        const effKey = WordEffect.I.getWordEffCfgKey(this.mWordEffId, this.mAtkUnit);
        const wordStr = this.mWordStr;
        let posNum = 0;
        if (this.mEntity && cc.isValid(this.mEntity)) {
            // this.mTagPos = this.mEntity.position;
            // this.mTagPos = v3(0, 0);
            // targetNd = this.mEntity;
            const distance = cc.Vec2.distance(this.mTagPos, this.mEntity.getPosition());
            if (distance > 30) {
                this.mTagPos = cc.v2(0, 0);
                targetNd = this.mEntity;
            }
            posNum = this.mEntity.FightUnit.P;
        }

        const floatObj: IfloatWord = {
            effKey, wordStr, mTagPos: this.mTagPos, posNum, targetNd,
        };
        // WordEffect.I.showWordEff(effKey, wordStr, targetNd, this.mTagPos, posNum);
        BattleFloatWordMgr.I.addFloatWord(floatObj);
    }
}
