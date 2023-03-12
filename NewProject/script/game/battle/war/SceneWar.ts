/* eslint-disable @typescript-eslint/no-floating-promises */
/*
 * @Author: hrd
 * @Date: 2022-06-21 10:54:00
 * @FilePath: \SanGuo\assets\script\game\battle\war\SceneWar.ts
 * @Description:
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import EntityBattle from '../../entity/EntityBattle';
import { ActionBase } from '../actions/base/ActionBase';
import { TWarDefaultFinishData } from '../actions/TWarFinishAction';
import { TWarStartAction } from '../actions/TWarStartAction';
import { ActionReturn, AtkTimeKey, IfloatWord } from '../WarConst';
import { BattleMgr } from '../BattleMgr';
import { WarBase } from './WarBase';
import { UtilBattle } from '../util/UtilBattle';
import { BattleFloatWordMgr } from '../BattleFloatWordMgr';
import { WordEffect } from '../effect/WordEffect';

export class SceneWar extends WarBase {
    /** 战斗开始时间 */
    private mStartTime: number = 0;
    /** 战斗实例加载完成 */
    private mLoadEnd: boolean = false;
    /** 回合索引 */
    private mTurnIndex: number = 0;
    /** 回合数据 */
    private mTurnData: ActionBase[] = [];
    /** 是否进入战斗 */
    private mIsEnter: boolean = false;
    /** 所有回合数据 */
    private mAllTurnData: ActionBase[][] = [];
    /** 回合总数 */
    private mTurnTotal: number = 0;
    /** 结束行为 */
    private mFinishAction: ActionBase;
    /** 开始行为 */
    private mStartAction: ActionBase;
    /** 回合id */
    private mTurnId: number = 0;
    /** 跳过战斗 */
    private isSkiping: boolean = false;

    /** 初始化 */
    public init(fightData: S2CBattlefieldReport): void {
        this.mFightData = fightData;
        this.mStartTime = UtilBattle.I.getFightAtkTime(AtkTimeKey.WarReadyTime);
    }

    public getTurnId(): number {
        return this.mTurnId;
    }

    public getTurnTotal(): number {
        return this.mTurnTotal;
    }

    /** 设置 */
    public setTurnAll(datas: ActionBase[][]): void {
        this.mAllTurnData = datas;
        this.mTurnTotal = datas.length;
        this.startTurn();
    }

    public onEnter(): void {
        super.onEnter();
        this.mIsEnter = true;
        this.initEntitys();

        this.mStartAction = TWarStartAction.Create();
        this.mFinishAction = TWarDefaultFinishData.Create(this.mFightData);
    }

    /** 退出 */
    public onExit(): void {
        this.exitCurWar();
    }

    /** 初始化战斗模型实体 */
    private initEntitys() {
        if (!(this.mFightData && this.mFightData.U)) {
            console.log('战斗报文为 null 或没有 战斗对象');
            return;
        }
        this._loadEntityFrame(this.mFightData);
    }

    /** 退出当前战场 */
    public exitCurWar(): void {
        super.exitCurWar();
        if (this.mTimer) {
            clearInterval(this.mTimer);
        }
        this.clearTurn();
    }

    private mTimer = null;
    /** 分帧加载战斗实例 */
    private _loadEntityFrame(figthData: S2CBattlefieldReport) {
        const count = figthData.U.length;
        let idx: number = 0;
        if (this.mTimer) {
            clearInterval(this.mTimer);
        }
        this.mTimer = setInterval(() => {
            if (this.mIsExit) return;
            if (idx < count) {
                const fUnit: FightUnit = figthData.U[idx];
                this.createEntity(fUnit);
                idx++;
            } else {
                clearInterval(this.mTimer);
                this.mTimer = null;
                this.mLoadEnd = true;
                this.setEntitySiblingIndex();
            }
        }, 10);
    }

    public createEntity(fUnit: FightUnit): EntityBattle {
        const fightData = this.mFightData;
        const entity = BattleMgr.I.createEntity(fUnit, fightData.T);
        this.addToWar(entity, fUnit, fightData);
        this.mEntityList[fUnit.P] = entity;
        this.mFightUnitList[fUnit.P] = fUnit;
        return entity;
    }

    public addToWar(entity: EntityBattle, unit: FightUnit, fightRepot: S2CBattlefieldReport): void {
        const realPos = UtilBattle.I.getRealPos(unit.P);
        const posV3 = UtilBattle.I.getPosVec2(realPos);
        BattleMgr.I.EntityLayer.addChild(entity);
        entity.setPosition(posV3);

        this._EntityPosInfo[realPos] = posV3;
    }

    // 统计站位信息 返回坐标
    private _EntityPosInfo: { [name: number]: cc.Vec2; } = {};
    public getEntityPosInfo(p1: number, p2: number): cc.Vec2 {
        const v = this._EntityPosInfo[p1];
        return cc.v2(v.x, v.y);
    }

    /** 开始回合 */
    private startTurn(): void {
        if (!this.mIsEnter) {
            return;
        }
        if (!this.mLoadEnd) {
            return;
        }
        if (this.exeStartAction()) {
            return;
        }

        if (this.mAllTurnData.length) {
            ++this.mTurnId;
            const list = this.mAllTurnData[0];
            this.mAllTurnData.splice(0, 1);
            if (list) {
                this.setCurrTurnData(list);
            }
            this.changeTurn(this.mTurnId);
        } else {
            this.exeFinishAction();
        }
    }

    private exeFinishAction(): boolean {
        BattleFloatWordMgr.I.clearFloatWord();
        console.log('=========战斗回合结束====行为======');
        if (this.mFinishAction) {
            this.mFinishAction.execute(this);
            this.mFinishAction = null;
            return true;
        }
        return false;
    }

    private exeStartAction(): boolean {
        if (this.mStartAction) {
            const list: ActionBase[] = [];
            list.push(this.mStartAction);
            this.setCurrTurnData(list);
            this.mStartAction = null;
            return true;
        }
        return false;
    }

    private changeTurn(_index: number) {
        // console.log('=========changeTurn======', `${_index}/${this.mTurnTotal}`);

        EventClient.I.emit(E.Battle.TurnNumChange, _index);
    }

    /** 设置当前回合数据 */
    private setCurrTurnData(datas: ActionBase[]): void {
        this.mTurnData = datas;
        this.mTurnIndex = 0;
        const data = this.mTurnData[this.mTurnIndex];
        if (data) {
            //
        } else {
            console.error('not turn data !!!');
        }

        // todo 回合开始
        // E.I.onE(EId.On_BATTLE_TURN_START);
    }

    /** 当前回合结束 */
    private doCurrTurnFinish(): void {
        // 开始新的回合
        this.startTurn();
    }

    /** 清理回合数据 */
    private clearTurn() {
        const data = this.mTurnData[this.mTurnIndex];
        if (data && data.mInit) {
            data.onExit();
        }
        this.mTurnIndex = -1;
        this.mAllTurnData = [];
        this.mTurnData = [];
    }

    /** 跳过当前战斗 */
    public skipCurWar(): void {
        super.skipCurWar();
        this.isSkiping = true;
        this.finishWar();
    }

    /** 结束战斗 */
    private finishWar(): void {
        this.clearTurn();
        if (!this.exeFinishAction()) {
            // 没有战斗结束行为 处理为连续战斗
            // BattleMgr.I.enterCurWar();
        }
    }

    public update(deltaTime: number): void {
        const speed = this.getSpeed();
        const delta = deltaTime * speed;

        if (!this.mIsEnter) {
            return;
        }

        if (!this.mLoadEnd) {
            return;
        }

        if (this.mStartTime > 0) {
            this.mStartTime -= delta;
            return;
        }

        if (this.isSkiping) {
            return;
        }

        if (this.mTurnIndex >= 0 && this.mTurnIndex < this.mTurnData.length) {
            const action = this.mTurnData[this.mTurnIndex];
            if (action) {
                if (!action.mInit) {
                    action.init(this);
                    action.onEnter();
                    action.mInit = true;
                }
                try {
                    if (action.onUpdate(delta) === ActionReturn.NEXT) {
                        action.onExit();
                        ++this.mTurnIndex;
                    }
                } catch (error) {
                    console.error('SceneWar update err:', error);
                    // todo 跳过该行为
                    action.onExit();
                    ++this.mTurnIndex;
                }

                if (!this.mTurnData[this.mTurnIndex]) {
                    this.doCurrTurnFinish();
                }
            } else {
                this.doCurrTurnFinish();
            }
        } else {
            this.doCurrTurnFinish();
        }

        const obj: IfloatWord = BattleFloatWordMgr.I.popFloatWord();
        if (obj) {
            new Promise((re, rej) => {
                WordEffect.I.showWordEff(obj.effKey, obj.wordStr, obj.targetNd, obj.mTagPos, obj.posNum, re);
            }).then((v: cc.Node) => {
                v.active = false;
                BattleFloatWordMgr.I.moveWord(v);
            });
        }
    }
}
