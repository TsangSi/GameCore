/*
 * @Author: zs
 * @Date: 2023-03-06 10:50:35
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilString } from '../../../app/base/utils/UtilString';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../i18n/i18n';
import { IAttrInfo } from '../../base/attribute/AttrConst';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { Config } from '../../base/config/Config';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { UtilAttr } from '../../base/utils/UtilAttr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { ItemType } from '../../com/item/ItemConst';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { BagMgr } from '../bag/BagMgr';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { EAdviserAttrInfoType, EMasteryType } from './AdviserConst';

const { ccclass, property } = cc._decorator;

/** 升级限制条件类型 */
enum EUpLevelLimit {
    /** 所有专精等级 */
    MasteryLevel = 1,
    /** 妙计大师等级 */
    SpecialLevel = 2,
    /** 军师等级 */
    AdsiverLevel = 3
}
/** 军师信息 */
interface IAdviserInfo {
    Level: number,
    Exp: number,
    Mastery: { [id: number]: number },
}

@ccclass('AdviserModel')
export default class AdviserModel extends BaseModel {
    public clearAll(): void {
        // throw new Error("Method not implemented.");
    }

    private _body: Cfg_AdviserBody;
    /** 军师本体 */
    public get body(): Cfg_AdviserBody {
        if (this._body) {
            return this._body;
        }
        this._body = Config.Get(Config.Type.Cfg_AdviserBody).getValueByKey(1);
        return this._body;
    }

    private _cfgMastery: ConfigIndexer;
    /** 军师专精 */
    public get cfgMastery(): ConfigIndexer {
        if (this._cfgMastery) {
            return this._cfgMastery;
        }
        this._cfgMastery = Config.Get(Config.Type.Cfg_AdviserMastery);
        return this._cfgMastery;
    }
    private _cfgLevel: ConfigIndexer;
    /** 军师升级表 */
    public get cfgLevel(): ConfigIndexer {
        if (this._cfgLevel) {
            return this._cfgLevel;
        }
        this._cfgLevel = Config.Get(Config.Type.Cfg_AdviserLevel);
        return this._cfgLevel;
    }
    private _cfgMasteryCost: ConfigIndexer;
    /** 军师专精升级消耗 */
    public get cfgMasteryCost(): ConfigIndexer {
        if (this._cfgMasteryCost) {
            return this._cfgMasteryCost;
        }
        this._cfgMasteryCost = Config.Get(Config.Type.Cfg_AdviserMasteryCost);
        return this._cfgMasteryCost;
    }

    private data: IAdviserInfo = cc.js.createMap(true);
    public setData(data: Adviser): void {
        this.data.Level = data.Level;
        this.data.Exp = data.Exp;
        this.data.Mastery = cc.js.createMap(true);
        this.updateMasteryInfo(data.MasteryList, true);
        EventClient.I.emit(E.Adviser.UpdateInfo);
    }

    /**
     * 更新经验和等级
     * @param level 等级
     * @param exp 经验
     */
    public updateLevelAndExp(level: number, exp: number): void {
        this.data.Level = level;
        this.data.Exp = exp;
        this._levelAttrInfo = cc.js.createMap(true);
        EventClient.I.emit(E.Adviser.UpdateExpLevel, level, exp);
    }

    /** 更新专精等级 */
    public updateMasteryInfo(info: IntAttr[], isInit: boolean = false): void {
        const ids: number[] = [];
        const levels: number[] = [];
        info.forEach((v) => {
            if (!isInit && this.data.Mastery[v.K] !== v.V) {
                ids.push(v.K);
                levels.push(v.V);
            }
            this.data.Mastery[v.K] = v.V;
        });
        if (!isInit) {
            EventClient.I.emit(E.Adviser.UpdateMasteryLevel, ids, levels);
        }
    }

    /**
     * 获取专精等级
     * @param id 专精id
     * @returns
     */
    public getMasteryLevel(id: number): number {
        if (this.data?.Mastery && this.data?.Mastery[id]) {
            return this.data.Mastery[id];
        }
        // this.data.Mastery = this.data.Mastery || cc.js.createMap(true);
        // if (id > 200) {
        //     this.data.Mastery[id] = UtilNum.RandomInt(0, 10);
        // } else {
        //     this.data.Mastery[id] = UtilNum.RandomInt(0, 20);
        // }
        return 0;
    }

    /**
     * 专精是否激活
     * @param id 专精id
     * @returns
     */
    public getMasteryActive(id: number): boolean {
        return this.getMasteryLevel(id) > 0;
    }

    /** 军师等级 */
    public getLevel(): number {
        return this.data?.Level || 1;
    }

    /** 是否满级 */
    public isFullLevel(): boolean {
        return this.getLevel() >= this.cfgLevel.getValueByIndex<Cfg_AdviserLevel>(this.cfgLevel.length - 1)?.Level;
    }

    /** 军师等级经验值 */
    public getLevelExp(): number {
        return this.data?.Exp || 0;
    }
    /** 获取军师当前模型 */
    public getSkin(): number {
        return this.body.Skin;
    }

    /** 获取军师当前名字 */
    public getName(): string {
        return this.body.Name;
    }

    /** 获取军师当前技能 */
    public getSkill(): string {
        return `${this.body.Skill}:1`;
    }

    /** 获取军师当前品质 */
    public getQuality(): number {
        return this.body.Quality;
    }

    /** 获取升级消耗的道具和增加的经验值 */
    public getUpLevelCost(): { id: number, exp: number } {
        const cfg: Cfg_Adviser_Cfg = Config.Get(Config.Type.Cfg_Adviser_Cfg).getValueByKey('AdviserLevelCost');
        const items = cfg?.CfgValue?.split(':');
        if (items) {
            return { id: +items[0], exp: +items[1] };
        }
        return undefined;
    }

    private _levelAttrInfo: IAttrInfo = cc.js.createMap(true);
    /** 等级属性 */
    public get levelAttrInfo(): IAttrInfo {
        if (!this._levelAttrInfo.attrs?.length) {
            const level = this.getLevel();
            const attrId: number = this.cfgLevel.getValueByKey(level, 'AttrId');
            if (attrId) {
                this._levelAttrInfo.attrs = UtilAttr.GetAttrBaseListById(attrId);
            } else {
                this._levelAttrInfo.attrs = [];
            }
        }
        return this._levelAttrInfo;
    }

    /**
     * 根据属性类型获取所有已激活的所有红颜对应的属性
     * @param type 属性类型
     * @returns
     */
    public getAllAttrInfo(type: EAdviserAttrInfoType): AttrInfo {
        const attrInfo = new AttrInfo();
        const infos: IAttrInfo[] = [];
        // for (const k in this.beautys) {
        switch (type) {
            // case EBeautyAttrInfoType.All:
            //     infos.push(this.beautys[k].attrInfo);
            //     break;
            // case EBeautyAttrInfoType.Active:
            //     infos.push(this.beautys[k].baseAttrInfo);
            //     break;
            case EAdviserAttrInfoType.Level:
                infos.push(this.levelAttrInfo);
                break;
            case EAdviserAttrInfoType.Grade:
                // infos.push(this.beautys[k].starAttrInfo);
                break;
            case EAdviserAttrInfoType.Mastery:
                break;
            default:
                break;
        }
        // }
        attrInfo.add(...infos);
        return attrInfo;
    }

    /**
     * 添加红点事件发送的监听
     */
    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Forge.Adviser.Mastery.Id, this.onCheckMastery, this);
    }

    /** 移除红点事件发送的监听 */
    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Forge.Adviser.Mastery.Id, this.onCheckMastery, this);
    }

    public registerRedDotListen(): void {
        const rid = RID.Forge.Adviser.Mastery.Id;
        const info: IListenInfo = {
            ProtoId: [ProtoId.S2CAdviserInfo_ID, ProtoId.S2CAdviserMasteryLevelUp_ID],
            ItemSubType: [ItemType.Adviser],
            // CheckVid: [ViewConst.AdviserWin],
            // ProxyRid: [RID.Forge.Adviser.Id],
        };
        RedDotMgr.I.emit(REDDOT_ADD_LISTEN_INFO, { rid, info });
    }

    /**
     * 针对升级页面来说，获取某个红颜是否要显示红点
     * @param id 红颜id
     * @returns
     */
    public isCanShowRedByLevel(): boolean {
        if (UtilFunOpen.isOpen(FuncId.Adviser, false)) {
            if (!this.isFullLevel()) {
                const item = this.getUpLevelCost();
                const nextCfg: Cfg_AdviserLevel = Config.Get(Config.Type.Cfg_AdviserLevel).getValueByKey(this.getLevel() + 1);
                if (nextCfg) {
                    const num = BagMgr.I.getItemNum(item.id);
                    const needNum = Math.ceil((nextCfg.NeedTotalExp - this.getLevelExp()) / item.exp);
                    if (num >= needNum) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /** 检查升级页签红点状态 */
    public onCheckMastery(): boolean {
        let allResult: boolean = false;
        if (UtilFunOpen.isOpen(FuncId.Adviser, false)) {
            this.cfgMastery.forEach((cfg: Cfg_AdviserMastery, index: number) => {
                let isRed = true;
                const level = this.getMasteryLevel(cfg.Id);
                const nextLevel = level + 1;
                const type = cfg.MasteryType;
                if (nextLevel > cfg.MaxLv) {
                    isRed = false;
                } else {
                    const cfgCostNext: Cfg_AdviserMasteryCost = this.cfgMasteryCost.getValueByKey(type, nextLevel);
                    const upLevelCost: { id: number; num: number }[] = [];
                    const items = cfgCostNext.Cost.split('|');
                    for (let i = 0, n = items.length; i < n; i++) {
                        const item = items[i].split(':');
                        upLevelCost.push({ id: +item[0], num: +item[1] });
                        if (BagMgr.I.getItemNum(+item[0]) < +item[1]) {
                            isRed = false;
                        }
                    }
                    let limit = '';
                    if (isRed) {
                        limit = this.getLimitStr(cfgCostNext.Limit);
                        if (limit) {
                            isRed = false;
                        }
                    }
                }
                RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Mastery.FirstMastery + index, isRed);
                if (isRed) {
                    allResult = true;
                }
                return true;
            });
        }
        return allResult;
    }

    /** 获取限制条件的描述 */
    public getLimitStr(str: string): string {
        let limitDesc: string;
        if (str) {
            const allLimits = str.split('|');
            for (let i = 0, n = allLimits.length; i < n; i++) {
                if (allLimits[i]) {
                    const limits = allLimits[i].split(':');
                    limitDesc = this.getLimitStrOne(+limits[0], +limits[1]);
                    if (limitDesc) {
                        break;
                    }
                }
            }
        }
        return limitDesc;
    }
    /**
     * 获取限制条件单个描述
     * @param type 限制类型
     * @param limitLevel 限制等级
     * @returns
     */
    private getLimitStrOne(type: EUpLevelLimit, limitLevel: number) {
        let limit: string;
        if (type === EUpLevelLimit.MasteryLevel) {
            this.cfgMastery.forEach((cfg: Cfg_AdviserMastery) => {
                if (cfg.MasteryType === EMasteryType.Normall && this.getMasteryLevel(cfg.Id) < limitLevel) {
                    limit = UtilString.FormatArgs(i18n.tt(Lang.adviser_mastery_up_limit1), limitLevel);
                    return false;
                }
                return true;
            });
        } else if (type === EUpLevelLimit.SpecialLevel) {
            this.cfgMastery.forEach((cfg: Cfg_AdviserMastery) => {
                if (cfg.MasteryType === EMasteryType.Special && this.getMasteryLevel(cfg.Id) < limitLevel) {
                    limit = UtilString.FormatArgs(i18n.tt(Lang.adviser_mastery_up_limit2), limitLevel);
                    return false;
                }
                return true;
            });
        } else if (type === EUpLevelLimit.AdsiverLevel) {
            if (this.getLevel() < limitLevel) {
                limit = UtilString.FormatArgs(i18n.tt(Lang.adviser_mastery_up_limit3), limitLevel);
            }
        }
        return limit;
    }
    // /**
    //  * 获取专精升级消耗
    //  * @param type 专精类型
    //  * @param level 专精等级
    //  * @returns
    //  */
    // public getMasteryCost(type: number, level: number): string {
    //     const cfg: Cfg_AdviserMasteryCost = this.cfgMasteryCost.getValueByKey(type, level);
    //     return cfg?.Cost || '';
    // }
}
