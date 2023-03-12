/* eslint-disable @typescript-eslint/no-unsafe-return */
import { LogMgr } from '../../../../app/base/manager/LogMgr';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../../i18n/i18n';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { Config } from '../../../base/config/Config';
import UtilItem from '../../../base/utils/UtilItem';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import {
    EquipGemShowInfo, ItemType, ROLE_EQUIP_GEM_NUM, ROLE_EQUIP_PART_NUM,
} from '../../../com/item/ItemConst';
import ItemModel from '../../../com/item/ItemModel';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';

/** 部位限制条件 */
export interface GemPartLimit {
    /** 宝石类型 */
    gemType: number;
    /** 限制ID 需要查询对应表 */
    limitId: string;
}

/** 镶嵌所需宝石物品 */
export interface GemInlayItem {
    /** 可否镶嵌 */
    state: boolean;
    /** 技能ID */
    skillId: string;
    /** 宝石物品ID */
    gemItemId: number;
    /** 镶嵌所需宝石物品ID */
    sourceGemItemId: number;
    /** 提示文本 */
    tip: string;
    /** 激活 */
    active: boolean;
    /** 红点 */
    red: boolean;
}

/** 升级所需宝石物品 */
export interface GemUpdateItem {
    /** 可否镶嵌 */
    state: boolean;
    /** 宝石物品ID */
    curGemId: number;
    /** 升级所需要的宝石类型 */
    upGemId: number
    /** 所需数量 */
    upGemCost: number;
    /* 是否满级 */
    max: boolean;
}

export interface EquipPartGem {
    /** 允许镶嵌 */
    inlays?: boolean;
    /** 镶嵌红点 */
    inlaysRed?: boolean;
    /** 可否升级 */
    update?: boolean;
    /** 孔位上当前的宝石类型 */
    curGemId?: number;
    /** 升级所需要的宝石类型 */
    upGemId?: number
    /** 升级所需要的宝石数量 */
    upGemCost?: number
    /** 镶嵌所需宝石物品ID */
    sourceGemItemId?: number;
    /** 提示文本 */
    tip?: string

}

const { ccclass } = cc._decorator;
@ccclass('GemModel')
export class GemModel extends BaseModel {
    private _equipPosMap: Map<number, EquipPos> = new Map();

    public clearAll(): void {
        this._equipPosMap.clear();
    }

    public clear(): void {
        this._equipPosMap.clear();
    }

    public initData(equipPosList: EquipPos[]): void {
        for (const item of equipPosList) {
            this._equipPosMap.set(item.Pos, item);
        }
    }

    /**
     * @func 条件检测
     * @param  limit 条件
     * @return 成功返回null 失败返回错误提示
     */
    private checkLimit(item: ItemModel, equip: EquipPos, limit: string): string | null {
        const check = limit.split('|');
        // console.log(check);
        for (let i = 0; i < check.length; ++i) {
            const ary = check[i].split(':');
            if (ary[0] === '1') {
                const ArmyLevel = Number(ary[1]);
                if (!item || item.cfg.ArmyLevel < ArmyLevel) return UtilString.FormatArgs(i18n.tt(Lang.equip_gem_tip1), ArmyLevel);
            } else if (ary[0] === '2') {
                const max = Number(ary[1]);
                let level: number = 0;
                if (!equip) return UtilString.FormatArgs(i18n.tt(Lang.equip_gem_tip2), max);
                for (let n = 0; n < equip.Gems.length; ++n) {
                    level += this.getGemItem(equip.Gems[n].ItemId).Level;
                }
                if (level < max) return UtilString.FormatArgs(i18n.tt(Lang.equip_gem_tip2), max);
                // console.log(level, max, equip);
            } else if (ary[0] === '3') {
                const min = Number(ary[1]);
                if (!equip || equip.Gems.length < 4) {
                    return UtilString.FormatArgs(i18n.tt(Lang.equip_gem_tip3), min);
                }
                for (let n = 0; n < equip.Gems.length; ++n) {
                    if (equip.Gems[n].Pos === 5) continue;
                    if (this.getGemItem(equip.Gems[n].ItemId).Level < min) {
                        return UtilString.FormatArgs(i18n.tt(Lang.equip_gem_tip3), min);
                    }
                }
            }
        }
        return null;
    }

    /**
     * @func 通过道具模型获取总属性
     * @param itemModel 物品模型
    */
    public getGemItemAttr(itemModel: ItemModel): AttrInfo | null {
        const info = new AttrInfo();
        if (!itemModel) return info;
        /** 基础属性信息 */
        let baseAttrInfo: AttrInfo;
        const baseAttrId = itemModel.cfg.AttrId;
        if (baseAttrId) {
            baseAttrInfo = AttrModel.MakeAttrInfo(baseAttrId);
            info.add(baseAttrInfo);
        }
        /** 附加属性信息 */
        let addAttrInfo: AttrInfo;
        const addAttr = itemModel.data.AddAttr;
        if (addAttr && addAttr.length > 0) {
            addAttrInfo = AttrModel.MakeAttrInfo(...addAttr);
            info.add(addAttrInfo);
        }

        if (itemModel.cfg.Type === ItemType.EQUIP_ROLE) {
            const levelAttrInfo = ModelMgr.I.StrengthModel.getStrengthLevelAttrInfo(itemModel.cfg.EquipPart);
            if (levelAttrInfo) {
                info.add(levelAttrInfo);
            }
        }
        return info;
    }

    /**
     * 获取部位镶嵌宝石限制
     * @param equipPart 部位ID
     * @return 宝石限制
     */
    private getCfgEquipGemPartLimitByEquipPart(equipPart: number): GemPartLimit[] | null {
        const indexer = Config.Get(Config.Type.Cfg_EquipGemPos);
        const data: Cfg_EquipGemPos = indexer.getValueByKey(equipPart);
        if (data) {
            const result: GemPartLimit[] = [];
            const ary: string[] = data.GemType.split('|');
            const ary2: string[] = data.LimitId.split('|');
            ary.forEach((item, index) => {
                const id = Number(item);
                result.push(<GemPartLimit>{ gemType: id, limitId: ary2[index] ? ary2[index] : null });
            });
            return result;
        }
        return null;
    }

    /**
     * 获取部位宝石物品ID
     * @param equip 部位
     * @param gemPos 宝石位置
     * @return 物品ID
    */
    private getEquipPartGemItemId(equip: EquipPos, gemPos: number): number | null {
        if (equip) {
            for (let i = 0; i < equip.Gems.length; ++i) {
                if (equip.Gems[i].Pos === gemPos) return equip.Gems[i].ItemId;
            }
        }
        return null;
    }

    /**
     * @func 检测装备部位是否可镶嵌
     * @param equipPart 部位ID
     * @param gemPos 宝石位置
     * @return 镶嵌所需宝石物品
     */
    public checkEquipPartInlay(item: ItemModel, equipPart: number, gemPos: number): GemInlayItem {
        const result = <GemInlayItem>{ state: false, active: false };
        const equip = this._equipPosMap.get(equipPart);
        /** 孔位已经激活过了 */
        if (equip) {
            const gemItemId = this.getEquipPartGemItemId(equip, gemPos);
            if (gemItemId != null) {
                const parts = this.getCfgEquipGemPartLimitByEquipPart(equipPart);
                if (parts) {
                    const part = parts[gemPos - 1];
                    if (part) {
                        if (part.limitId != null) {
                            const err = this.checkLimit(item, equip, part.limitId);
                            if (err) {
                                result.gemItemId = gemItemId;
                                result.tip = err;
                                return result;
                            }
                        }
                    }
                }
                result.active = true;
                result.tip = this.getGemDesc(gemItemId, gemPos === 5);
                return result;
            }
        }

        /** 部位的孔位条件限制判断 */
        const parts = this.getCfgEquipGemPartLimitByEquipPart(equipPart);
        if (parts) {
            const part = parts[gemPos - 1];
            if (part) {
                if (part.limitId != null) {
                    const err = this.checkLimit(item, equip, part.limitId);
                    if (err) {
                        result.tip = err;
                        return result;
                    }
                }
                if (!equip) return result;
                const indexer = Config.Get(Config.Type.Cfg_EquipGemItem);
                const indexer2 = Config.Get(Config.Type.Cfg_EquipGemType);
                const gemItem: Cfg_EquipGemItem = indexer.getValueByKey(part.gemType, 1);
                const gemType: Cfg_EquipGemType = indexer2.getValueByKey(gemItem.Type);
                result.gemItemId = this.getGemIdByType(gemItem.Type);
                result.sourceGemItemId = gemItem.ItemId;
                result.red = !!result.gemItemId;
                result.tip = i18n.tt(Lang.role_button_xiangqian) + gemType.Name;
                result.skillId = gemItem.Skill;
                result.state = true;
                // console.log('镶嵌所需宝石', result.gemItemId, '目前数量', BagMgr.I.getItemNum(result.gemItemId));
            }
        }

        return result;
    }

    /**
     * @func 检测装备部位是否可替换
     * @param equipPart 部位ID
     * @param gemPos 宝石位置
     * @return 升级所需宝石物品
     */
    public checkEquipPartReplace(equipPart: number, gemPos: number): boolean {
        const equip = this._equipPosMap.get(equipPart);
        if (!equip) return false;

        // 孔位未激活过了
        const gemItemId = this.getEquipPartGemItemId(equip, gemPos);

        if (gemItemId == null) return false;

        const item = this.getGemItem(gemItemId);

        if (item) {
            // console.log('替换宝石类型检测', item.Type, item.Level, this.getGemIdByType(item.Type, item.Level));
            if (this.getGemIdByType(item.Type, item.Level)) return true;
        }

        return false;
    }

    /**
     * @func 检测装备部位是否可升级
     * @param equipPart 部位ID
     * @param gemPos 宝石位置
     * @return 升级所需宝石物品
     */
    public checkEquipPartUpdate(equipPart: number, gemPos: number): GemUpdateItem {
        const result = <GemUpdateItem>{ state: false };
        const equip = this._equipPosMap.get(equipPart);
        if (!equip) return result;

        // 孔位未激活过了
        const gemItemId = this.getEquipPartGemItemId(equip, gemPos);
        if (gemItemId == null) return result;

        const parts = this.getCfgEquipGemPartLimitByEquipPart(equipPart);
        const part = parts[gemPos - 1];
        if (part) {
            const indexer = Config.Get(Config.Type.Cfg_EquipGemItem);
            const item = this.getGemItem(gemItemId);

            if (item) {
                result.curGemId = gemItemId;
                const gemItem: Cfg_EquipGemItem = indexer.getValueByKey(part.gemType, item.Level);
                if (gemItem && gemItem.LevelCostNum) {
                    // console.log('宝石ID', gemItemId, '升级所需同等级数量', gemItem.LevelCostNum, '目前数量', BagMgr.I.getItemNum(gemItemId));
                    result.upGemId = gemItem.ItemId;
                    result.upGemCost = 1;
                    /* || BagMgr.I.getItemNum(result.upGemId) > 0 */
                    const num = BagMgr.I.getItemNum(gemItemId);
                    result.state = num >= gemItem.LevelCostNum;
                    if (!result.state) result.state = this.checkGemItemCount(part.gemType, item.Level - 1, gemItem.LevelCostNum - num);
                    result.max = false;
                } else {
                    result.max = true;
                }
            }
        }

        return result;
    }

    /** 递归深层检测宝石升级 */
    private checkGemItemCount(gemType: number, level: number, count: number): boolean {
        if (level < 1) return false;
        const indexer = Config.Get(Config.Type.Cfg_EquipGemItem);
        const gemItem: Cfg_EquipGemItem = indexer.getValueByKey(gemType, level);
        if (gemItem && gemItem.LevelCostNum) {
            count *= gemItem.LevelCostNum + 1;
            const num = BagMgr.I.getItemNum(gemItem.ItemId);
            if (num >= count) return true;
            return this.checkGemItemCount(gemType, level - 1, count - num);
        }
        return false;
    }

    /**
    * @func 检测单个穿戴的装备是否允许镶嵌或升级
    * @return 返回检测结果
    */
    public checkEquipPart(item: ItemModel, index: number): boolean {
        for (let n = 1; n <= 5; n++) {
            const inlay = this.checkEquipPartInlay(item, index, n);
            if (inlay.red) {
                return true;
            } else if (inlay.active) {
                if (this.checkEquipPartReplace(index, n)) return true;
                const update = this.checkEquipPartUpdate(index, n);
                if (update.state) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取上一级宝石物品ID
     * @param  gemItemId 当前的宝石ID
     */
    public getLastLevelGemId(gemItemId: number): number | null {
        const item = this.getGemItem(gemItemId);
        if (item) {
            const lastLevel = item.Level - 1;
            if (lastLevel) {
                const indexer = Config.Get(Config.Type.Cfg_EquipGemItem);
                const gemItem: Cfg_EquipGemItem = indexer.getValueByKey(item.Type, lastLevel);
                if (gemItem) return gemItem.ItemId;
            }
        }
        return null;
    }

    /**
    * @func 获取部位宝石数据
    * @return 返回宝石数据
    */
    public getEquipPartGem(item: ItemModel, index: number): EquipPartGem[] {
        const result: EquipPartGem[] = [];
        for (let n = 1; n <= 5; n++) {
            const inlay = this.checkEquipPartInlay(item, index, n);
            const child = <EquipPartGem>{ tip: inlay.tip };
            child.curGemId = inlay.gemItemId;
            if (inlay.state) {
                child.inlays = true;
                child.inlaysRed = inlay.red;
                child.curGemId = null;
                child.upGemCost = 1;
                child.upGemId = inlay.gemItemId;
                child.sourceGemItemId = inlay.sourceGemItemId;
            } else if (inlay.active) {
                if (this.checkEquipPartReplace(index, n)) child.inlaysRed = true;
                const update = this.checkEquipPartUpdate(index, n);
                child.curGemId = update.curGemId;
                child.upGemCost = update.upGemCost;
                child.upGemId = update.upGemId;
                child.update = update.state;
            }

            result.push(child);
        }
        return result;
    }

    /**
     * 获取穿戴中全部宝石的总属性
     * @return 返回属性信息
     */
    public getOnEquipGemAttrInfo(): AttrInfo {
        const info = new AttrInfo();

        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            const equip = this._equipPosMap.get(i);

            if (!equip) continue;

            for (let n = 1; n <= ROLE_EQUIP_GEM_NUM; n++) {
                const itemId = this.getEquipPartGemItemId(equip, n);
                if (itemId != null) {
                    const itemMo: ItemModel = UtilItem.NewItemModel(itemId, 1);
                    if (itemMo) {
                        const localAttr = this.getGemItemAttr(itemMo);
                        info.add(localAttr);
                    }
                }
            }
        }

        return info;
    }

    public getOnEquipGemFightValue(): number {
        const attr = this.getOnEquipGemAttrInfo();
        return attr.fightValue;
    }

    /**
     * 获取穿戴中某个部位装备宝石的属性
     * @param  arg 传入 Index 或者 EquipPos
    */
    public getEquipGemAttrInfo(pos: number | EquipPos): AttrInfo {
        const info = new AttrInfo();
        const equip = typeof pos === 'number' ? this._equipPosMap.get(pos) : pos;
        for (let n = 1; n <= ROLE_EQUIP_GEM_NUM; n++) {
            const itemId = this.getEquipPartGemItemId(equip, n);
            if (itemId != null) {
                const itemMo: ItemModel = UtilItem.NewItemModel(itemId, 1);
                if (itemMo) {
                    info.add(this.getGemItemAttr(itemMo));
                }
            }
        }
        return info;
    }

    public getEquipGemFightValue(pos: number | EquipPos): number {
        const attr = this.getEquipGemAttrInfo(pos);
        return attr.fightValue;
    }

    /**
     * @func 获取全局宝石技能描述
     * @return 返回属性信息
     */
    public getAllGemSkillDesc(): string {
        let str = '';
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            const equip = this._equipPosMap.get(i);

            if (!equip) continue;

            for (let n = 1; n <= 5; n++) {
                let desc: string = '';
                const itemId = this.getEquipPartGemItemId(equip, n);
                if (itemId != null) {
                    const gemItem = this.getGemItem(itemId);
                    if (gemItem) {
                        const s = this.getSkillDesc(gemItem.Skill);
                        if (s.length) desc += `${s}\n`;
                    }
                }
                str += desc;
            }
        }
        return str;
    }

    /** 获取装备部位信息 */
    public getEquipPos(idx: number): EquipPos {
        return this._equipPosMap.get(idx);
    }

    /** 获取物品属性描述 */
    public getItemDesc(itemId: number): string {
        const itemMo: ItemModel = UtilItem.NewItemModel(itemId, 1);
        const itemAttr = this.getGemItemAttr(itemMo);
        let result = '';
        if (itemAttr) {
            itemAttr.attrs.forEach((v) => {
                const name = v.name;
                const value = v.value;
                if (result.length) result += '\n';
                result += `${name} +${value}`;
            });
        }
        return result;
    }

    /** 获取技能描述 */
    public getSkillDesc(skill: string): string {
        const ary = skill.split(':');
        if (ary.length !== 2) return '';
        const id = Number(ary[0]);
        const level = Number(ary[1]);
        const name = UtilSkillInfo.GetSkillName(id);
        const skillDes = UtilSkillInfo.GetSkillDesc(id, level);
        return `${name} 【${level}${i18n.tt(Lang.equip_lev)}】：${skillDes}`;
    }

    /** 获取宝石描述 */
    public getGemDesc(gemItemId: number, isSkill: boolean): string {
        if (isSkill) {
            const itemMo: ItemModel = UtilItem.NewItemModel(gemItemId, 1);
            return itemMo.cfg.Name;
        }

        const item = this.getGemItem(gemItemId);

        if (item && item.Skill && item.Skill.length) {
            return this.getSkillDesc(item.Skill);
        }

        return this.getItemDesc(gemItemId);
    }

    /** 是否技能宝石 */
    public isSkillGem(itemId: number): boolean {
        const item = this.getGemItem(itemId);
        if (item && item.Skill && item.Skill.length) { return true; }
        return false;
    }

    /* 获取同类型1级宝石ID */
    public getOneLevelGemInfo(itemId: number): number {
        const item = this.getGemItem(itemId);
        if (item.Level === 1) return itemId;
        const indexer = Config.Get(Config.Type.Cfg_EquipGemItem);
        const gemItem: Cfg_EquipGemItem = indexer.getValueByKey(item.Type, 1);
        return gemItem.ItemId;
    }

    /* 获取宝石展示信息 */
    public getGemInfo(itemId: number): EquipGemShowInfo {
        const result: EquipGemShowInfo = {
            name: '',
            desc: '',
            icon: '',
            rawDesc: '',
            isSkill: false,
            skillLevel: 0,
            skillIcon: 0,
            skillName: '',
        };

        const item = this.getGemItem(itemId);

        const itemMo: ItemModel = UtilItem.NewItemModel(itemId, 1);

        const itemAttr = this.getGemItemAttr(itemMo);

        result.icon = itemMo.cfg.PicID;

        result.name = itemMo.cfg.Name;

        if (item.Skill && item.Skill.length) {
            const ary = item.Skill.split(':');
            if (ary.length !== 2) return result;
            const id = Number(ary[0]);
            const level = Number(ary[1]);
            result.isSkill = true;
            result.desc = UtilSkillInfo.GetSkillDesc(id, level);
            result.skillName = UtilSkillInfo.GetSkillName(id, level);
            result.skillIcon = UtilSkillInfo.GetSkillIconID(id, level);
            result.skillLevel = level;
            itemAttr.attrs.forEach((v) => {
                const name = v.name;
                const value = v.value;
                if (result.desc.length) result.desc += '\n';
                result.rawDesc += `${name} +${value}`;
            });
        } else if (itemAttr) {
            itemAttr.attrs.forEach((v) => {
                const name = v.name;
                const value = v.value;
                if (result.desc.length) result.desc += '\n';
                result.desc += `${name} +${value}`;
            });
        }

        return result;
    }

    /** 根据宝石ID获取宝石物品配置 */
    public getGemItem(gemItemId: number): Cfg_EquipGemItem | null {
        let result = null;
        const indexer = Config.Get(Config.Type.Cfg_EquipGemItem);
        indexer.forEach<Cfg_EquipGemItem>((item) => {
            if (item.ItemId === gemItemId) {
                result = item;
                return false;
            }
            return true;
        });
        return result;
    }

    /** 检测宝石类型是否存在 */
    public getGemIdByType(type: number, level?: number): number | null {
        let result = null;
        let min = 0;
        const indexer = Config.Get(Config.Type.Cfg_EquipGemItem);
        indexer.forEach<Cfg_EquipGemItem>((item) => {
            if (item.Type === type) {
                if (level && level >= item.Level) return true;
                if (BagMgr.I.getItemNum(item.ItemId) > 0 && item.Level > min) {
                    min = item.Level;
                    result = item.ItemId;
                }
            }
            return true;
        });
        return result;
    }

    /** 更新宝石数据 并返回修改过的数据 */
    public updateGem(EquipPart: number, info: GemInfo): number[][] {
        const change: number[][] = [];
        const e = this._equipPosMap.get(EquipPart);
        if (e) {
            for (let i = 0; i < e.Gems.length; ++i) {
                if (e.Gems[i].Pos === info.Pos) {
                    if (e.Gems[i].ItemId !== info.ItemId) { change.push([e.Gems[i].ItemId, info.ItemId]); }
                    e.Gems[i] = info;
                    return change;
                }
            }
            e.Gems.push(info);
            change.push([null, info.ItemId]);
        }
        return change;
    }

    /** 更新宝石数据 并返回修改过的数据 */
    public updateGemList(list: EquipPos[]): number[][] {
        let change: number[][] = [];
        list.forEach((item) => {
            item.Gems.forEach((gem) => {
                change = [...change, ...this.updateGem(item.Pos, gem)];
            });
        });
        return change;
    }

    public getBagMaxNum(): number {
        const indexer = Config.Get(Config.Type.Cfg_EquipGem_Config);
        const item: Cfg_EquipGem_Config = indexer.getValueByKey('GemBagMaxNum');
        return Number(item.CfgValue);
    }

    public getEquipGemShowInfoArr(equipPos: EquipPos): EquipGemShowInfo[] {
        const arr: EquipGemShowInfo[] = [];
        for (let i = 0; i < equipPos.Gems.length; i++) {
            const gem = equipPos.Gems[i];
            const info = this.getGemInfo(gem.ItemId);
            if (info) {
                arr.push(info);
            }
        }
        return arr;
    }
}
