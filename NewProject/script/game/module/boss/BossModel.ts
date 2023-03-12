/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-20 17:22:54
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\boss\BossModel.ts
 * @Description:
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { E } from '../../const/EventName';
import { RoleMgr } from '../role/RoleMgr';
import { LocalBossPageType } from './BossConst';

const { ccclass } = cc._decorator;
@ccclass('BossModel')
export class BossModel extends BaseModel {
    /** 个人首领 */
    private _bossPersonal: { [key: number]: BossPersonalInfo } = cc.js.createMap(true);
    /** 至尊首领 */
    private _bossVip: { [key: number]: BossPersonalInfo } = cc.js.createMap(true);

    private _CfgBoss: ConfigIndexer;
    /** 功能信息配置 */
    public get CfgBoss(): ConfigIndexer {
        if (!this._CfgBoss) {
            this._CfgBoss = Config.Get(Config.Type.Cfg_Boss_Config);
        }
        return this._CfgBoss;
    }

    public get bossPersonal(): { [key: number]: BossPersonalInfo } {
        return this._bossPersonal;
    }

    public get bossVip(): { [key: number]: BossPersonalInfo } {
        return this._bossVip;
    }

    public clearAll(): void {
        //
    }

    public init(): void {
        //
    }

    /** 个人首领数据 */
    public setPersonal(data: BossPersonalInfo[]): void {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const d: BossPersonalInfo = data[i];
                this._bossPersonal[d.Id] = d;
            }
            EventClient.I.emit(E.Boss.UptPersonal);
        }
    }

    /** 更新个人首领数据 */
    public uptPersonal(Id: number, LeftTimes: number): void {
        if (this._bossPersonal[Id]) {
            this._bossPersonal[Id].LeftTimes = LeftTimes;
        }
        EventClient.I.emit(E.Boss.UptPersonal);
    }

    /** 是否还有挑战次数 */
    public isPersonalTimes(): boolean {
        if (this._bossPersonal) {
            const reborn = RoleMgr.I.getArmyLevel();
            const _cfg = Config.Get(Config.Type.Cfg_Boss_Personal);
            for (const k in this._bossPersonal) {
                if (this._bossPersonal[k].LeftTimes > 0) {
                    const needLv = _cfg.getValueByKey(this._bossPersonal[k].Id, 'NeedLevel');
                    const needExtCond = _cfg.getValueByKey(this._bossPersonal[k].Id, 'ExtCond');
                    if (reborn >= needLv) {
                        if (needExtCond === 1 && RoleMgr.I.d.MonthCard < UtilTime.NowSec()) {
                            continue;
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /** 至尊首领数据 */
    public setVip(data: BossVipInfo[]): void {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                const d: BossVipInfo = data[i];
                this._bossVip[d.Id] = d;
            }
            EventClient.I.emit(E.Boss.UptVip);
        }
    }

    /** 更新至尊首领数据 */
    public uptVip(Id: number, LeftTimes: number): void {
        if (this._bossVip[Id]) {
            this._bossVip[Id].LeftTimes = LeftTimes;
        }
        EventClient.I.emit(E.Boss.UptVip);
    }

    /** 是否还有挑战次数 */
    public isVipTimes(): boolean {
        if (this._bossVip) {
            const reborn = RoleMgr.I.getArmyLevel();
            const _bossVipCfg = Config.Get(Config.Type.Cfg_Boss_VIP);
            for (const k in this._bossVip) {
                if (this._bossVip[k].LeftTimes > 0) {
                    const needLv = _bossVipCfg.getValueByKey(this._bossVip[k].Id, 'NeedLevel');
                    const needVip = _bossVipCfg.getValueByKey(this._bossVip[k].Id, 'NeedVipLevel');
                    if (reborn >= needLv) {
                        if (needVip > 0 && needVip > RoleMgr.I.d.VipLevel) {
                            continue;
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 获取boss基础信息列表，id，头像，名字，显示等级，挑战等级，vip等级
     * @param bossType
     * @param bossId
     * @returns
     */
    public GetBossBaseInfo(bossType: LocalBossPageType): {
        id: number,
        bossName: string,
        bossAnimId: number,
        needLevel: number
    }[] {
        let indexer: ConfigIndexer;
        if (bossType === LocalBossPageType.Personal) {
            indexer = Config.Get(Config.Type.Cfg_Boss_Personal);
        } else if (bossType === LocalBossPageType.Vip) {
            indexer = Config.Get(Config.Type.Cfg_Boss_VIP);
        } else if (bossType === LocalBossPageType.MultiBoss) {
            indexer = Config.Get(Config.Type.Cfg_Boss_Multi);
        } else return null;
        const bossListInfo: { id: number, bossName: string, bossAnimId: number, needLevel: number }[] = [];
        indexer.forEach((v: Cfg_Boss_VIP | Cfg_Boss_Personal | Cfg_Boss_Multi) => {
            const id: number = v.Id;
            const indexerM = Config.Get(Config.Type.Cfg_Monster);
            const bossName: string = v.ShowName;// indexerM.getValueByKey(v.BossId, 'Name');
            const bossAnimId: number = indexerM.getValueByKey(v.BossId, 'AnimId');
            bossListInfo.push({
                id, bossName, bossAnimId, needLevel: v.NeedLevel,
            });
            return true;
        });
        return bossListInfo;
    }

    /** 多人首领 归属奖励 */
    public GetMultiPrize(id: number): { join: string, best: string } {
        const indexer = Config.Get(Config.Type.Cfg_Boss_Multi);
        const bestPrize: string = indexer.getValueByKey(id, 'ShowBestPrize');
        const joinPrize: string = indexer.getValueByKey(id, 'ShowChallengePrize');
        return { join: joinPrize, best: bestPrize };
    }

    /** 多人首领 获取boss属性 */
    public GetMultiBossAttr(id: number): Cfg_Attr_Monster {
        if (id === -1) {
            // 给个默认boss
            id = 2;
        }
        const indexer = Config.Get(Config.Type.Cfg_Boss_Multi);
        const refreshId: number = indexer.getValueByKey(id, 'RefreshId');
        const refIdx = Config.Get(Config.Type.Cfg_Refresh);
        const attrBoss: number = refIdx.getValueByKey(refreshId, 'AttrId_Boss');
        const AttrIdx = Config.Get(Config.Type.Cfg_Attr_Monster);
        const bossLv: number = refIdx.getValueByKey(refreshId, 'MonsterLevel');
        const attr: Cfg_Attr_Monster = AttrIdx.getValueByKey(attrBoss, bossLv);
        return attr;
    }

    /** 多人首领复活令 */
    public GetMultiRelive(id: number): string[] {
        const indexer = Config.Get(Config.Type.Cfg_Boss_Multi);
        const item: string = indexer.getValueByKey(id, 'ReliveCost');
        const itemId: string[] = item.split(':');
        return itemId;
    }

    public SetMulitBossPlayData(d: S2CMultiBossGetPlayerData): void {
        this.InspireLeftTime = d.InspireLeftTime;
        this.InspireTimes = d.InspireTimes;
        EventClient.I.emit(E.Boss.UptMulitBossPlayData, d);
    }

    private MultiBossHpNow: number = 0;
    private MultiBossData: S2CGetMultiBossData = null;
    /** 多人boss首领数据 */
    public SetMulitBossData(data: S2CGetMultiBossData): void {
        EventClient.I.emit(E.Boss.UptMulitBoss, data);
        this.MultiBossData = data;
        this.MultiBossHpNow = data.State === 0 ? -1 : data.Hp;
    }

    public GetMultiBossData(): S2CGetMultiBossData {
        return this.MultiBossData;
    }

    private MultiBossRank: MultiBossRankData[] = [];
    private MultiBossFightId: number = -1;

    public setFightRank(Id: number, Ranks: MultiBossRankData[]): void {
        this.MultiBossFightId = Id;
        this.MultiBossRank = Ranks;
    }

    public getFightId(): number {
        const tmpid = this.jumpBossId !== -1 ? this.jumpBossId : this.MultiBossFightId;
        if (this.jumpBossId !== -1) {
            this.jumpBossId = -1;
        }
        return tmpid;
    }

    private jumpBossId: number = -1;
    /**
     * 指定跳转boss id;
     * @param id
     */
    public setJumpToId(id: number): void {
        this.jumpBossId = id;
    }

    public getFightRank(): MultiBossRankData[] {
        return this.MultiBossRank;
    }

    public getBossNowHp(): number {
        // console.log('当前boss状态信息', this.MultiBossData);

        return this.MultiBossHpNow;
    }

    /** 常量表获取对应的值 */
    public getValByKey(key: string): string {
        return this.CfgBoss.getValueByKey(key, 'Value');
    }

    private InspireLeftTime: number = 0;
    private InspireTimes: number = 0;
    public setInspire(d: S2CMultiBossInspire): void {
        this.InspireLeftTime = d.InspireLeftTime;
        this.InspireTimes = d.InspireTimes;
        EventClient.I.emit(E.Boss.MtBossInspirem, d.InspireLeftTime, d.InspireTimes);
    }

    public getInspireLeftTime(): number {
        return this.InspireLeftTime;
    }

    public getInspireTimes(): number {
        return this.InspireTimes;
    }

    /** 根据bossId 等级 获取怪物属性 */
    public CfgAttrMonster(attrBossId: number, monsterLevel: number): Cfg_Attr_Monster {
        const indexer = Config.Get(ConfigConst.Cfg_Attr_Monster);
        const attr: Cfg_Attr_Monster = indexer.getValueByKey(attrBossId, monsterLevel);
        return attr;
    }
}
