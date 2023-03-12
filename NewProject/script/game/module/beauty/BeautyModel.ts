/*
 * @Author: zs
 * @Date: 2022-10-27 18:42:10
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\beauty\BeautyModel.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilBool } from '../../../app/base/utils/UtilBool';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ANIM_TYPE } from '../../base/anim/AnimCfg';
import { IAttrInfo } from '../../base/attribute/AttrConst';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { Config } from '../../base/config/Config';
import { ConfigBeautyIndexer } from '../../base/config/indexer/ConfigBeautyIndexer';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { ItemType } from '../../com/item/ItemConst';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import { EntityUnitType } from '../../entity/EntityConst';
import ModelMgr from '../../manager/ModelMgr';
import { BagMgr } from '../bag/BagMgr';
import { IGetAwardsInfo } from '../grade/v/GradeGetAwardsWin';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleAN } from '../role/RoleAN';
import { EBeautyAttrInfoType } from './BeautyConst';
import { BeautyInfo } from './BeautyInfo';
import { EBeautyIndexId } from './BeautyVoCfg';

const { ccclass } = cc._decorator;
/** 操作类型 */
enum EOperType {
    /** null */
    Empty,
    /** 新增 */
    Add,
    /** 更新 */
    Update
}

@ccclass('BeautyModel')
export class BeautyModel extends BaseModel {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    /**
     * 添加红点事件发送的监听
     */
    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Forge.Beauty.Id, this.onCheckAll, this);
        RedDotCheckMgr.I.on(RID.Forge.Beauty.UpLevel, this.onCheckUpLevel, this);
        RedDotCheckMgr.I.on(RID.Forge.Beauty.UpStar, this.onCheckUpStar, this);
    }

    /** 移除红点事件发送的监听 */
    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Forge.Beauty.Id, this.onCheckAll, this);
        RedDotCheckMgr.I.off(RID.Forge.Beauty.UpLevel, this.onCheckUpLevel, this);
        RedDotCheckMgr.I.off(RID.Forge.Beauty.UpStar, this.onCheckUpStar, this);
    }

    /** 是否已经初始化过一次，初始化过一次后的新增红颜都是属于激活红颜 */
    private isInited: boolean = false;
    /** 已激活的红颜信息 */
    private beautys: Record<string, BeautyInfo> = {};

    private _cfg: ConfigBeautyIndexer = null;
    public get cfg(): ConfigBeautyIndexer {
        if (!this._cfg) {
            this._cfg = Config.Get(Config.Type.Cfg_Beauty);
        }
        return this._cfg;
    }
    /** 已激活的红颜数量 */
    private _activeCount: number = 0;
    /** 已激活的红颜数量 */
    public get activeCount(): number {
        return this._activeCount;
    }

    public getBeautyCfg(beautyId: number): Cfg_Beauty {
        return this._cfg.getValueByKey(beautyId);
    }

    public registerRedDotListen(): void {
        const rid = RID.Forge.Beauty.UpLevel;
        const info: IListenInfo = {
            // 红颜信息，红颜激活，红颜升级，红颜一键升级
            // eslint-disable-next-line max-len
            ProtoId: [ProtoId.S2CBeautyInfo_ID, ProtoId.S2CBeautyActive_ID, ProtoId.S2CBeautyLevelUp_ID, ProtoId.S2CBeautyLevelUpAuto_ID, ProtoId.S2CChangeLineup_ID],
            ItemSubType: [ItemType.BEAUTY],
            RoleAttr: [RoleAN.N.Stage],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.BeautyWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走rid个协议监听
            ProxyRid: [RID.Forge.Beauty.Id],
        };
        const rid2 = RID.Forge.Beauty.UpStar;
        const info2: IListenInfo = {
            // 红颜信息，红颜激活，红颜升级，红颜一键升级
            ProtoId: [ProtoId.S2CBeautyInfo_ID, ProtoId.S2CBeautyActive_ID, ProtoId.S2CBeautyStarUp_ID, ProtoId.S2CChangeLineup_ID],
            RoleAttr: [RoleAN.N.Stage],
            ItemSubType: [ItemType.BEAUTY],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.BeautyWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走rid个协议监听
            ProxyRid: [RID.Forge.Beauty.Id],
        };
        RedDotMgr.I.emit(REDDOT_ADD_LISTEN_INFO, { rid, info }, { rid: rid2, info: info2 });
    }

    public onS2CBeautyInfo(beautys: Beauty[]): void {
        if (this.isInited) {
            this.setBeautyInfos(beautys);
        } else {
            this.initBeautyInfos(beautys);
        }
    }

    /**
     * new一个红颜对象，给初始数据
     * @param id 红颜id
     * @returns
     */
    private newBeauty(id: number) {
        const b = new Beauty();
        b.BeautyId = id;
        b.Level = 1;
        b.LevelExp = 0;
        b.Star = 1;
        return b;
    }

    /**
     * 新激活红颜
     * @param id 红颜id
     */
    public newActiveBeauty(id: number): void {
        if (EOperType.Add === this.addBeautyInfo(id)) {
            EventClient.I.emit(E.Beauty.Add, [id]);
        }

        const cfgPetA = this.beautys[id].cfg.getValueByKey(id, { Name: '', Quality: 0, AnimId: 0 });

        const data: IGetAwardsInfo = {
            type: 0, // 0默认模板，展示获得物品。 1 三倍领取 2 限时三倍领取
            showName: cfgPetA.Name, // 道具名字
            quality: cfgPetA.Quality, // 道具质量
            animId: cfgPetA.AnimId, // 动画id
            animType: ANIM_TYPE.PET,
            animScale: 0.85,
            animPosY: 20,
        };
        WinMgr.I.open(ViewConst.GradeGetAwardsWin, data);
    }
    public addBeautyInfo(id: number): EOperType;
    public addBeautyInfo(beauty?: Beauty): EOperType;
    public addBeautyInfo(idOrBeauty: number | Beauty): EOperType {
        if (!idOrBeauty) {
            return EOperType.Empty;
        }
        let id: number = 0;
        let beauty: Beauty;
        if (typeof idOrBeauty === 'number') {
            id = idOrBeauty;
        } else {
            beauty = idOrBeauty;
            id = beauty.BeautyId;
        }

        if (!this.beautys[id]) {
            this._addBeauty(id, beauty);
            return EOperType.Add;
        } else {
            this._updateBeauty(id, beauty);
            return EOperType.Update;
        }
    }

    /** 是否已满级 */
    public isFullLevel(id: number): boolean {
        if (!this.beautys[id]) {
            return false;
        }
        return this.beautys[id].Level >= this.cfg.getMaxLevel();
    }

    /** 是否已激活 */
    public isActive(id: number): boolean {
        return !!this.beautys[id];
    }

    /** 能否激活 */
    public isCanActive(id: number): boolean {
        if (this.isActive(id)) { return false; }
        const cfg = this.cfg.getValueByKey(id, { UnlockItem: '', UnlockItemTatter: '' });
        const item = cfg.UnlockItem.split(':');
        if (BagMgr.I.getItemNum(+item[0]) >= +item[1]) {
            return true;
        }
        const itemT = cfg.UnlockItemTatter.split(':');
        return BagMgr.I.getItemNum(+itemT[0]) >= +itemT[1];
    }

    /**
     * 获取排序好的红颜列表
     * @param isBattlePlan 是否出战布阵
     * @returns
     */
    public getSortActiveBeautys(isPlan: boolean = false): BeautyInfo[] {
        const beautys: BeautyInfo[] = [];
        for (const id in this.beautys) {
            const b = this.beautys[id];
            beautys.push(b);
        }
        beautys.sort((a, b) => {
            if (isPlan && ModelMgr.I.BattleUnitModel.isLineupByOnlyId(EntityUnitType.Beauty, a.BeautyId.toString())) {
                return -1;
            } else if (isPlan && ModelMgr.I.BattleUnitModel.isLineupByOnlyId(EntityUnitType.Beauty, b.BeautyId.toString())) {
                return 1;
            } else {
                return b.fightValue - a.fightValue;
            }
        });
        return beautys;
    }

    /** 获取红颜对象 */
    public getBeauty(id: number): BeautyInfo {
        if (!id) {
            return undefined;
        }
        return this.beautys[id] || new BeautyInfo(id);
    }
    /**
     * 更新红颜星级
     * @param id 红颜id
     * @param star 星级
     */
    public updateBeautyStar(id: number, star: number): void {
        this.beautys[id]?.updateStar(star);
    }
    /**
     * 更新红颜等级
     * @param id 红颜id
     * @param exp 等级经验值
     * @param level 等级
     */
    public updateBeautyExpLevel(id: number, exp: number, level?: number): void {
        this.beautys[id]?.updateExpLevel(exp, level);
    }

    /**
     * 根据属性类型获取所有已激活的所有红颜对应的属性
     * @param type 属性类型
     * @returns
     */
    public getAllBeautyAttrInfo(type: EBeautyAttrInfoType = EBeautyAttrInfoType.All): AttrInfo {
        const attrInfo = new AttrInfo();
        const infos: IAttrInfo[] = [];
        for (const k in this.beautys) {
            switch (type) {
                case EBeautyAttrInfoType.All:
                    infos.push(this.beautys[k].attrInfo);
                    break;
                // case EBeautyAttrInfoType.Active:
                //     infos.push(this.beautys[k].baseAttrInfo);
                //     break;
                case EBeautyAttrInfoType.Level:
                    infos.push(this.beautys[k].levelAttrInfo);
                    break;
                case EBeautyAttrInfoType.Star:
                    infos.push(this.beautys[k].starAttrInfo);
                    break;
                default:
                    break;
            }
        }
        attrInfo.add(...infos);
        return attrInfo;
    }

    public getAllFightValue(): number {
        let fightValue = 0;
        for (const k in this.beautys) {
            fightValue += this.beautys[k].fightValue;
        }
        return fightValue;
    }

    /**
     * 初始化已有的红颜
     * @param beautys 已有的红颜列表
     */
    private initBeautyInfos(beautys: Beauty[]): void {
        this.isInited = true;
        beautys.forEach((b) => {
            this.addBeautyInfo(b);
        });
        EventClient.I.emit(E.Beauty.Init);
    }

    /**
     * 设置红颜信息
     * @param beautys 变更的红颜列表（新增、更新）
     */
    private setBeautyInfos(beautys: Beauty[]) {
        const addIds: number[] = [];
        const updateIds: number[] = [];
        let type: EOperType;
        beautys.forEach((b) => {
            type = this.addBeautyInfo(b);
            if (type === EOperType.Add) {
                addIds.push(b.BeautyId);
            } else if (type === EOperType.Update) {
                updateIds.push(b.BeautyId);
            }
        });
        if (addIds.length) {
            EventClient.I.emit(E.Beauty.Add, addIds);
        }
        if (updateIds.length) {
            EventClient.I.emit(E.Beauty.Update, updateIds);
        }
    }

    /**
     * 新增红颜信息
     * @param id 唯一id
     * @param beauty 红颜info
     */
    private _addBeauty(id: number, beauty?: Beauty) {
        this.beautys[id] = beauty ? new BeautyInfo(beauty) : new BeautyInfo(id);
        this._activeCount++;
    }

    /**
     * 更新红颜信息
     * @param id 红颜id
     * @param beauty 红颜信息
     */
    private _updateBeauty(id: number, beauty: Beauty) {
        this.beautys[id]?.updateInfo(beauty);
    }

    /** 检查等级页签或者升星页签红点状态 */
    private onCheckAll() {
        return this.onCheckUpLevel() || this.onCheckUpStar();
    }

    /**
     * 获取某个红颜在某个页签内是否要显示红点
     * @param id 红颜id
     * @param tabId 页签id
     * @returns
     */
    public isCanShowRed(id: number, tabId: EBeautyIndexId): boolean {
        if (this.isActive(id) && !this.isAreadyBattle) {
            return true;
        }
        switch (tabId) {
            case EBeautyIndexId.Level:
                return this.isCanShowRedByLevel(id);
            case EBeautyIndexId.Star:
                return this.isCanShowRedByStar(id);
            default:
                return false;
        }
    }

    /**
     * 针对升级页面来说，获取某个红颜是否要显示红点
     * @param id 红颜id
     * @returns
     */
    public isCanShowRedByLevel(id: number): boolean {
        if (this.isCanActive(id)) { return true; }
        if (this.isActive(id)) {
            // if (!this.isAreadyBattle) {
            //     return true;
            // }
            // if (this.isCanBattle(id)) {
            //     return true;
            // }
            if (!this.isFullLevel(id)) {
                const b = this.beautys[id];
                // 已激活 && 未满级
                // eslint-disable-next-line max-len
                const cfg: { NeedItem: number, NeedTotalExp: number, AddExp: number } = this.cfg.getValueByKeyFromLevel(b.Level + 1, { NeedItem: 0, NeedTotalExp: 0, AddExp: 0 });
                if (cfg) {
                    const num = BagMgr.I.getItemNum(cfg.NeedItem);
                    const needNum = Math.ceil((cfg.NeedTotalExp - b.LevelExp) / cfg.AddExp);
                    if (num >= needNum) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private _isAreadyBattle: boolean = false;
    /** 红颜是否有出战 */
    public get isAreadyBattle(): boolean {
        if (!this._isAreadyBattle) {
            this._isAreadyBattle = ModelMgr.I.BattleUnitModel.isLineupByOnlyId(EntityUnitType.Beauty);
        }
        return this._isAreadyBattle;
    }

    /**
     * 针对升星页面来说，获取某个红颜是否要显示红点
     * @param id 红颜id
     * @returns
     */
    private isCanShowRedByStar(id: number) {
        if (this.isCanActive(id)) { return true; }
        if (this.isActive(id)) {
            const b = this.beautys[id];
            if (b.isFullStar()) {
                return false;
            }
            const needNum: number = this.cfg.getValueByKeyFromStar(b.BeautyId, b.Star + 1, 'NeedItemCount');
            const itemTatter: string = this.cfg.getValueByKey(b.BeautyId, 'UnlockItemTatter');
            if (!UtilBool.isNullOrUndefined(needNum) && itemTatter) {
                const num = BagMgr.I.getItemNum(+itemTatter.split(':')[0]);
                if (num >= needNum) {
                    return true;
                }
            }
        }
        return false;
    }

    /** 检查升级页签红点状态 */
    public onCheckUpLevel(): boolean {
        /** 循环结果，如果是中断循环值就是false，也就是找到要显示的红点，才需要中断 */
        let foreachResult: boolean = true;
        if (UtilFunOpen.isOpen(FuncId.Beauty, false)) {
            this.cfg.forEach((c: Cfg_Beauty) => {
                if (c.IsVisible === 1 && this.isCanShowRed(c.PetAId, EBeautyIndexId.Level)) {
                    foreachResult = false;
                }
                return foreachResult;
            });
        }
        RedDotMgr.I.updateRedDot(RID.Forge.Beauty.UpLevel, !foreachResult);
        return !foreachResult;
    }

    /** 检查升星页签红点状态 */
    public onCheckUpStar(): boolean {
        /** 循环结果，如果是中断循环值就是false，也就是找到要显示的红点，才需要中断 */
        let foreachResult: boolean = true;
        if (UtilFunOpen.isOpen(FuncId.Beauty, false)) {
            this.cfg.forEach((c: Cfg_Beauty) => {
                if (c.IsVisible === 1 && this.isCanShowRed(c.PetAId, EBeautyIndexId.Star)) {
                    foreachResult = false;
                }
                return foreachResult;
            });
        }
        RedDotMgr.I.updateRedDot(RID.Forge.Beauty.UpStar, !foreachResult);
        return !foreachResult;
    }

    /** 当前界面展示的红颜id */
    private curViewShowId: number = 0;
    /** 保存一下当前界面展示的红颜id */
    public setCurViewShow(beautyId: number): void {
        this.curViewShowId = beautyId;
    }

    /** 获取当前界面展示的红颜对象 */
    public getCurViewShowBeauty(): BeautyInfo {
        if (this.curViewShowId) {
            return this.getBeauty(this.curViewShowId);
        }
        return undefined;
    }
}
