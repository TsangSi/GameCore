/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Author: hrd
 * @Date: 2022-06-21 09:48:04
 * @FilePath: \SanGuo\assets\script\game\battle\war\WarBase.ts
 * @Description: 战场基类
 *
 */

import { UtilArray } from '../../../app/base/utils/UtilArray';
import EntityBattle from '../../entity/EntityBattle';
import { BattleMgr } from '../BattleMgr';

export class WarBase {
    /**  BOSS与当前玩家固定位置 */
    public static readonly BOSS_POS = 28;
    public static readonly ROLE_POS = 13;

    /** 是否结束战斗 */
    public mIsExit = false;
    /** 所有战斗实体对象 */
    public mEntityList: { [pos: number]: EntityBattle; } = {};
    public mFightUnitList: { [pos: number]: FightUnit; } = {};
    /** 间隔时间 */
    private mDeltaTime: number = 0;
    /** 当前boss 数据 */
    private mCurBossUnit: FightUnit = null;
    /** 战斗数据 */
    protected mFightData: S2CBattlefieldReport = null;

    private _warSpeed: number = 1;

    public init(data: S2CBattlefieldReport): void {
        this.mFightData = data;
    }

    public doUpdate(delta: number): void {
        if (this.isBackground()) {
            this.mDeltaTime += delta;
            if (this.mDeltaTime < 250) {
                return;
            }
            delta = this.mDeltaTime;
            this.mDeltaTime = 0;
        } else if (this.mDeltaTime) {
            delta = this.mDeltaTime + delta;
            this.mDeltaTime = 0;
        }

        this.update(delta);
    }

    /** 更新 */
    public update(delta: number): void {
        //
    }

    /** 进入 */
    public onEnter(): void {
        this.mDeltaTime = 0;
    }

    /** 退出 */
    public onExit(): void {
        this.mEntityList = {};
        this.mFightUnitList = {};
    }

    public onBackground(): void {
        //
    }

    public onForeground(): void {
        //
    }

    public get currentBOSS(): FightUnit {
        return this.mCurBossUnit;
    }

    public set currentBOSS(v: FightUnit) {
        this.mCurBossUnit = v;
    }

    public updateSetting(settingId: number): void {
        for (const key in this.mEntityList) {
            const entity = this.mEntityList[key];
            if (!entity) {
                return;
            }
            // entity.updateSetting(settingId);
        }
    }

    public getSpeed(): number {
        return this._warSpeed;
    }

    public setSpeed(v: number) {
        if (v) {
            this._warSpeed = v;
        }
    }

    /** 进入后台 */
    protected isBackground(): boolean {
        return false;
    }

    /** 移除所以实体 */
    public removeAllEntity(): void {
        for (const key in this.mEntityList) {
            const unit = this.mEntityList[key];
            unit.release();
            unit.destroy();
        }
        this.mEntityList = {};
    }

    /** 移除实体 */
    public removeEntity(handle: number): boolean {
        const unit = this.mEntityList[handle];
        if (!unit) {
            return false;
        }
        unit.release();
        unit.destroy();
        delete this.mEntityList[handle];
        return true;
    }

    /** 添加战斗实体 */
    protected addEntity(entityData: any): EntityBattle {
        //
        return null;
    }

    /**
     * 根据站位获取实体
     * @param pos 站位id
     * @returns
     */
    public getEntity(pos: number): EntityBattle {
        return this.mEntityList[pos];
    }

    /**
     * 根据站位获取实体数据
     * @param pos 站位id
     * @returns
     */
    public getFightUnit(pos: number): FightUnit {
        return this.mFightUnitList[pos];
    }

    /**
     * 创建战斗单位实体
     * @param fUnit 数据
     * @returns
     */
    public createEntity(fUnit: FightUnit): EntityBattle {
        return null;
    }

    /** 执行退出战斗 */
    public doExitWar(): boolean {
        return false;
    }

    /** 获取主角 */
    public getMainRole(): EntityBattle {
        const role = this.mEntityList[WarBase.ROLE_POS];
        if (!role) return null;
        return role;
    }

    /** 获取boss */
    public getBossEntity(): EntityBattle {
        if (!this.mCurBossUnit) {
            return null;
        }
        const boss = this.mEntityList[this.mCurBossUnit.P];
        if (!boss) return null;
        return boss;
    }

    /** 完成战斗 */
    public FinishBattle(): void {
        //
    }

    /** 获取回合id */
    public getTurnId(): number {
        return 1;
    }

    /** 获取实体坐标信息 */
    public getEntityPosInfo(p1: number, p2: number): cc.Vec2 {
        return null;
    }

    public addToWar(entity: EntityBattle, unit: FightUnit, fightRepot: S2CBattlefieldReport): void {
        //
    }

    /** 检查是否有替补 */
    public checkFill(unitPos: number, battleArray: cc.Node): void {
        //
    }

    public setEntitySiblingIndex() {
        BattleMgr.I.EntityLayer.children.sort((a, b) => b.position.y - a.position.y);
        for (let i = 0; i < BattleMgr.I.EntityLayer.children.length; i++) {
            BattleMgr.I.EntityLayer.children[i].setSiblingIndex(i);
        }
    }

    /** 退出当前战斗 */
    public exitCurWar(): void {
        this.removeAllEntity();
        this.mCurBossUnit = null;
        this.mFightData = null;
    }

    /** 跳过当前战斗 */
    public skipCurWar(): void {
        //
    }
}
