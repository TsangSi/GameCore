/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import { RES_ENUM } from '../../const/ResPath';
import EntityBattle from '../../entity/EntityBattle';
import { MonsterType } from '../../entity/EntityConst';
import ModelMgr from '../../manager/ModelMgr';
import { RechargeItem } from '../../module/recharge/v/RechargeItem';
import { BattleMgr } from '../BattleMgr';
import { SkillEffect } from '../effect/SkillEffect';
import { UtilBattle } from '../util/UtilBattle';
import { BuffTargerPosType, DamagResultType, MountPointIndex } from '../WarConst';

export class EntityAi {
    /** buffIcon 路径 */
    public static readonly BuffIconPath = RES_ENUM.BattleUI_BuffIcon;
    public mEntity: EntityBattle;
    /** buff list */
    public mBuffDict: { [key: number]: UnitBuff } = {};
    /** buff 显示类型容器 */
    public mBuffEffDict: { [type: number]: BuffAnim[] } = {};
    // 已经死亡
    public mIsDead: boolean = false;
    protected mDelayAction: { mType: string, mDelay: number };

    public init(entity: EntityBattle): void {
        this.mEntity = entity;
        this.mIsDead = false;
        this.addEvent();
    }

    /** 是否死亡 */
    public isDead(): boolean {
        return this.mIsDead;
    }

    public isTarget(): boolean {
        return !this.isDead();
    }

    /**
     * 添加budd
     * @param buffId buffid
     * @param buffEffId 前端buff效果表id
     * @param buffVal 值
     * @returns
     */
    public addBuff(buffId: number, buffEffId: number, buffVal: number): void {
        if (!buffEffId) {
            return;
        }
        if (!buffId) {
            return;
        }

        let data = this.mBuffDict[buffEffId];
        if (!data) {
            data = new UnitBuff();
            data.id = buffId;
            data.mbuffEffId = buffEffId;
            data.mBuffVal = buffVal;
            data.mBuffIdList.push(buffId);
            const cfg = data.getCfg();
            if (!cfg) {
                console.warn('该buff没有对应的配置', buffId);
            }
            if (cfg && cfg.EffAgain) {
                // 只添加不需要后端通知移除
            } else {
                this.mBuffDict[buffEffId] = data;
            }
        } else {
            this.mBuffDict[buffEffId].mBuffIdList.push(buffId);
        }
        this.showEff(data);
        this.showBuffIcon(data);
    }

    /** 显示特效 */
    private showEff(data: UnitBuff): BuffAnim {
        const cfg = data.getCfg();
        if (!cfg) return null;
        if (!cfg.EffectId) return null;
        let effAmin: BuffAnim = data.mEffNode as BuffAnim;
        if (!effAmin) {
            effAmin = this.playBuffAnim(data.mbuffEffId, cfg);
        } else {
            if (cfg.EffLoop === 1) {
                // 循环播放特效不需要再次播放
                return effAmin;
            }
            effAmin = this.playBuffAnim(data.mbuffEffId, cfg);
        }

        if (cfg.BuffType > 0) {
            if (!this.mBuffEffDict[cfg.BuffType]) {
                this.mBuffEffDict[cfg.BuffType] = [];
            }
            this.mBuffEffDict[cfg.BuffType].push(effAmin);
        }
        this.refreshShowState(cfg.BuffType);
        data.mEffNode = effAmin;

        return effAmin;
    }

    private playBuffAnim(buffEffId: number, cfg: Cfg_BuffClint): BuffAnim {
        let parentNode: cc.Node = this.mEntity;
        const effId = Number(cfg.EffectId);
        const effAmin: BuffAnim = new BuffAnim();
        effAmin.bName = `${buffEffId}_${cfg.BuffType}`;
        effAmin.level = cfg.Level;
        effAmin.id = buffEffId;
        const bodyAnimId = this.mEntity.bodyRes();
        if (cfg.TargerPos === BuffTargerPosType.head) { // 对象头上
            parentNode.addChild(effAmin);
            const offPos = ModelMgr.I.BattleModel.getModelMountPoint(Number(bodyAnimId), MountPointIndex.head);
            effAmin.setPosition(offPos);
        } else if (cfg.TargerPos === BuffTargerPosType.body) { // 对象身上
            parentNode.addChild(effAmin);
            const offPos = ModelMgr.I.BattleModel.getModelMountPoint(Number(bodyAnimId), MountPointIndex.body);
            effAmin.setPosition(offPos);
        } else if (cfg.TargerPos === BuffTargerPosType.foot) { // 对象脚下
            parentNode.insertChild(effAmin, 0);
            const offPos = ModelMgr.I.BattleModel.getModelMountPoint(Number(bodyAnimId), MountPointIndex.body);
            effAmin.setPosition(offPos);
        } else if (cfg.TargerPos === BuffTargerPosType.ground) { // 对象地面的坐标
            parentNode = BattleMgr.I.SkillLayer1;
            parentNode.insertChild(effAmin, 0);
        }
        if (cfg.EffLoop) {
            effAmin.play(effId, SkillEffect.NoDelay, this.mEntity);
        } else {
            // 不循环播放
            effAmin.play(effId, 0, this.mEntity);
        }
        return effAmin;
    }

    /** 显示buff图标 */
    private showBuffIcon(data: UnitBuff) {
        const cfg = data.getCfg();
        if (!cfg) return;
        if (!cfg.IsShowIcon) return;
        const num = data.getBuffCount(data.id);
        const path: string = `${EntityAi.BuffIconPath}${cfg.BuffIcon}`;
        // todo 添加icon
        this.mEntity.showBuffIcon(data.mbuffEffId, num, path);
    }

    /** 刷新显示状态 */
    private refreshShowState(buffType: number) {
        const arr = this.mBuffEffDict[buffType] || [];
        arr.sort((a, b) => b.level - a.level);
        let isH: boolean = false;
        for (let i = 0; i < arr.length; i++) {
            const amin = arr[i];
            if (!cc.isValid(amin) || !amin.isValidAim()) continue;
            amin.active = false;
            if (isH === false) {
                amin.active = true;
                isH = true;
            }
        }
    }

    /**
     * 移除buff
     * @param buffEffId
     */
    public removeBuff(buffId: number, buffEffId: number, isRemoveAll: boolean = false): void {
        const data = this.mBuffDict[buffEffId];
        if (!data) {
            return;
        }
        const num = data.removeBuffId(buffId, isRemoveAll);
        if (num > 0) {
            // 还存在关联的buffid该效果不移除
            this.mEntity.showBuffIcon(data.mbuffEffId, num);
            return;
        }
        data.mBuffVal = 0;
        const cfg = data.getCfg();
        if (!cfg) return;
        const arr = this.mBuffEffDict[cfg.BuffType] || [];
        for (let i = 0; i < arr.length; i++) {
            const amin = arr[i];
            if (amin.id === buffEffId) {
                arr.splice(i, 1);
                break;
            }
        }
        if (data.mEffNode && cc.isValid(data.mEffNode) && cc.isValid(data.mEffNode.parent)) {
            if (cfg.EffLoop === 1 && arr.length > 0) {
                //
            } else {
                data.mEffNode.destroy();
            }
        }
        this.mEntity.showBuffIcon(data.mbuffEffId, num);
        delete this.mBuffDict[buffEffId];
    }

    public changeHp(type: number, value: number): void {
        let curHp = this.mEntity.hp;
        if (type === DamagResultType.AddHp) { // 加血
            curHp += value;
        } else if (type === DamagResultType.SubHp) { // 扣血
            curHp -= value;
        }
        if (curHp <= 0) {
            // 血量为0
            const str = `----${this.mEntity.FightUnit.P}号位==死亡===${curHp}`;
            BattleMgr.I.log(str);
            this.playDieState();
        } else {
            const str = `----${this.mEntity.FightUnit.P}当前血量${curHp}`;
            BattleMgr.I.log(str);
        }
        this.mEntity.hp = curHp;
    }

    public clearOtherAnim(): void {
        //
    }

    public hit(damageData: unknown): void {
        //
    }

    public playDieState(): void {
        this.mEntity.stopAllActions();
        this.mEntity.mAnimState.die();
        this.mIsDead = true;
        // console.log('========playDieState==================', this.mEntity);
    }

    /** 复活 */
    public relive(): void {
        this.mEntity.mAnimState.stand();
        this.mIsDead = false;
    }

    public doDie(delay: number = 0): void {
        this.mEntity.mAnimState.stand();
        const p = this.mEntity.FightUnit.P;
        // console.log('========doDie==================', this.mEntity);
        let p1 = cc.v3(400, -960);
        let p2 = cc.v3(360, 2000);
        if (UtilBattle.I.isUpCamp(p)) {
            p1 = cc.v3(-400, 960);
            p2 = cc.v3(-360, -2000);
        }
        const target = this.mEntity;
        target.stopAllActions();
        const t1 = cc.tween(target).by(0.4, { position: p1 });
        const t2 = cc.tween(target).by(0.8, { position: p2 });
        const t3 = cc.tween(target).call(() => {
            this.mEntity.active = false;
            this.mIsDead = true;
        });
        cc.tween(target).sequence(t1, t3).start();
    }

    private clearBuffEff(): void {
        for (const key in this.mBuffDict) {
            if (Object.prototype.hasOwnProperty.call(this.mBuffDict, key)) {
                const buffUnit = this.mBuffDict[key];
                this.removeBuff(buffUnit.id, buffUnit.mbuffEffId, true);
            }
        }
        this.mBuffDict = {};
        this.mBuffEffDict = {};
    }

    /** 清除数据 */
    public clear(): void {
        this.clearBuffEff();
        this.delEvent();
    }
    /**
     * 更新boss血量
     * @param data
     */
    private changeBossHp(data: { currHp: number, maxHp: number }): void {
        this.mEntity.maxHp = data.maxHp;
        // this.changeHp(2, data.currHp);
        this.mEntity.hp = data.currHp;
    }

    private addEvent(): void {
        if (this.mEntity.monsterType === MonsterType.Boss) {
            EventClient.I.on(E.Battle.UpBossEnittyHp, this.changeBossHp, this);
        }
    }

    private delEvent(): void {
        if (this.mEntity.monsterType === MonsterType.Boss) {
            EventClient.I.off(E.Battle.UpBossEnittyHp, this.changeBossHp, this);
        }
    }
}

class BuffAnim extends cc.Node {
    public id: number = 0;
    public level: number = 0; // 同类型buff显示优先级
    public bName: string = '';
    public effNode: cc.Node = null;

    public play(effId: number, delay: number = 0, entity: EntityBattle = null): void {
        if (!(this && cc.isValid(this))) return;
        const isHideEff = UtilBattle.I.isHideEff(entity);
        this.effNode = SkillEffect.I.PlayBuffEff(effId, delay, isHideEff);
        this.addChild(this.effNode);
    }

    public isValidAim(): boolean {
        return cc.isValid(this.effNode);
    }
}

class UnitBuff {
    public id: number;
    /** buff 效果id */
    public mbuffEffId: number;
    public mBuffVal: number;
    public mEffNode: cc.Node = null;
    public mIconNode: cc.Node = null;
    /** buff效果 关联buffid */
    public mBuffIdList: number[] = [];

    public getCfg(): Cfg_BuffClint {
        const cfg: Cfg_BuffClint = ModelMgr.I.BattleModel.getClintBuffCfg(this.mbuffEffId);
        return cfg;
    }

    /** 移除关联的buffid */
    public removeBuffId(buffid: number, isRemoveAll: boolean): number {
        // for (let i = 0; i < this.mBuffIdList.length; i++) {
        //     const id = this.mBuffIdList[i];
        //     if (id === buffid) {
        //         this.mBuffIdList.splice(i, 1);
        //         break;
        //     }
        // }
        let idx = this.mBuffIdList.length - 1;
        while (idx >= 0) {
            const id = this.mBuffIdList[idx];
            if (id === buffid) {
                this.mBuffIdList.splice(idx, 1);
                if (!isRemoveAll) {
                    break;
                }
            }
            idx--;
        }
        return this.mBuffIdList.length;
    }

    public getBuffCount(buffid: number): number {
        return this.mBuffIdList.length;
    }
}
