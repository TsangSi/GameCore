/*
 * @Author: hwx
 * @Date: 2022-06-06 17:24:38
 * @FilePath: \SanGuo2.4\assets\script\game\module\bag\BagMgr.ts
 * @Description: 背包管理
 */
import { EventClient } from '../../../app/base/event/EventClient';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { AttrModel } from '../../base/attribute/AttrModel';
import { Config } from '../../base/config/Config';
import UtilItem from '../../base/utils/UtilItem';
import { ROLE_EQUIP_PART_NUM, ItemBagType, ItemType } from '../../com/item/ItemConst';
import ItemModel from '../../com/item/ItemModel';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import { RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleMgr } from '../role/RoleMgr';
import { BagItemChangeInfo } from './BagConst';

export class BagMgr {
    /** 道具数据容器，键对应：道具唯一ID */
    private itemMap: Map<string, ItemModel> = new Map();
    /** 道具数量容器，以ItemId为KEY，相同的ItemId道具数量累加 */
    private itemNumMap: Map<number, number> = new Map();
    /** 背包类型道具数据容器，键对应：背包类型>道具唯一ID；数值对应：[0]代表未装备，[1]代表已装备  */
    private bagTypeItemMapList: Map<number, Array<Map<string, ItemModel>>> = new Map();
    /** 背包类型装备属性数据容器，键对应：组合KEY>道具唯一ID  */
    private bagTypeUnEquipPropertyMap: Map<string, Map<string, ItemModel>> = new Map();
    /** 背包一键使用道具数据容器，键对应：道具唯一ID */
    private bagTypeOnKeyUseMap: Map<string, ItemModel> = new Map();

    /** 背包宝箱类型道具数据容器，键对应：道具唯一ID 红点功能 */
    private boxTypeMap: Map<string, ItemModel> = new Map();

    /** 背包扩容大小，键对应：背包类型；值对应：扩容大小 */
    private gridExtendSizeMap: Map<number, number> = new Map();
    /** 背包类型拥有容量大小，键对应：背包类型；值对应：基础大小+扩容大小 */
    private bagTypeGridSizeMap: Map<number, number> = new Map();
    /** 背包类型满状态容器，键对应：背包类型 */
    private bagTypeFullStateMap: Map<number, boolean> = new Map();

    /** 快速使用角色装备部位最高战力容器，键对应：装备部位 */
    private quickUseRoleEquipPartMap: Map<number, ItemModel> = new Map();

    /** 背包道具的Param容器，键对应：道具唯一ID */
    private bagParamMap: Map<string, ItemModel> = new Map();

    private static _Instance: BagMgr;
    public static get I(): BagMgr {
        if (!this._Instance) {
            this._Instance = new BagMgr();
        }
        return this._Instance;
    }

    /** 初始化道具数据容器  转换成Map缓存 */
    public init(itemDataList: ItemData[]): void {
        this.clear();
        for (let i = 0, len = itemDataList.length; i < len; i++) {
            this.addItemModel(itemDataList[i]);
        }
        EventClient.I.emit(E.Bag.Inited);// 背包初始化
    }

    /** 重置清除 */
    public clear(): void {
        this.itemMap.clear(); /** 道具主表缓存 */
        this.itemNumMap.clear();/** 物品数量 */
        this.bagTypeItemMapList.clear(); // 背包类型道具数据容
        this.bagTypeUnEquipPropertyMap.clear();
        this.bagTypeOnKeyUseMap.clear();
        this.bagParamMap.clear();
        this.boxTypeMap.clear();/** 宝箱类型 主要处理红点 是宝箱则需要显示红点 */
    }
    //
    /** ***增 删 改 查******* */
    /** 增加道具数据 */
    public addItemModel(itemData: ItemData, isNew?: boolean): ItemModel | null {
        const cfg = UtilItem.GetCfgByItemId(itemData.ItemId);
        if (!cfg) { cc.warn(`增加道具[${itemData.OnlyId}]失败，未找到配置!`); return null; }
        if (itemData.ItemNum <= 0) { cc.warn(`增加道具[${itemData.OnlyId}]失败，无效的道具数量!`); return null; }

        this.updateItemNum(itemData.ItemId, itemData.ItemNum); // 更新道具数量
        const itemModel = new ItemModel({ // 增加道具
            data: itemData, cfg, isNew,
        });
        if (cfg.AttrId) {
            itemModel.fightValue = this.getItemFightValue(itemModel);
        }
        this.itemMap.set(itemData.OnlyId, itemModel);
        // 增加分类缓存元素
        this.updateItemModelByBagType(cfg.BagType, itemModel, 1);
        return itemModel;
    }

    /** 删除道具数据 */
    public deleteItemModel(onlyId: string): ItemModel {
        const itemModel: ItemModel = this.getItemModel(onlyId);
        if (itemModel) {
            this.deleteItemNum(itemModel.data.ItemId, itemModel.data.ItemNum);
            // 删除分类缓存元素
            this.updateItemModelByBagType(itemModel.cfg.BagType, itemModel, -1);
            // 删除主表缓存元素
            this.itemMap.delete(onlyId);
        } else {
            cc.warn(`删除道具[${onlyId}]失败!`);
        }
        return itemModel;
    }
    /** 删除道具数量，如果删除的数量和旧的数量一样多，说明没有了 */
    private deleteItemNum(itemId: number, itemNum: number) {
        const num = this.getItemNum(itemId);
        if (itemNum >= num) {
            this.itemNumMap.delete(itemId);
        } else {
            this.itemNumMap.set(itemId, num - itemNum);
        }
    }

    /** 更新道具数据 */
    public updateItemModel(itemData: ItemData): ItemModel | null {
        const oldItemModel = this.itemMap.get(itemData.OnlyId);
        if (itemData.ItemNum > 0) { // 更新道具
            let incr = itemData.ItemNum;
            if (oldItemModel) { // 计算道具数量修改前后的增量值
                incr = itemData.ItemNum - oldItemModel.data.ItemNum;
                // 更新道具数量
                this.updateItemNum(itemData.ItemId, incr);
                // 更新总表数据
                if (itemData.ItemId !== oldItemModel.data.ItemId) {
                    const itemCfg = UtilItem.GetCfgByItemId(itemData.ItemId);
                    oldItemModel.set({ data: itemData, cfg: itemCfg });
                } else {
                    oldItemModel.set({ data: itemData });
                }
                // 更新分类缓存元素
                this.updateItemModelByBagType(oldItemModel.cfg.BagType, oldItemModel);
                // 更新战力值
                if (oldItemModel.cfg.AttrId) {
                    oldItemModel.fightValue = this.getItemFightValue(oldItemModel);
                }
                return oldItemModel;
            } else {
                return this.addItemModel(itemData, true); // 新增道具
            }
        } else if (oldItemModel) {
            // 删除分类缓存元素
            this.updateItemModelByBagType(oldItemModel.cfg.BagType, oldItemModel, -1);
            // 删除总表缓存元素
            this.itemMap.delete(itemData.OnlyId);
        } else {
            cc.warn(`更新道具[${itemData.OnlyId}]失败，道具数量为0的无效道具!`);
        }
        return null;
    }
    /** 更新道具数量，增量更新，在旧的数量上加减 */
    private updateItemNum(itemId: number, itemNum: number) {
        const oldNum = this.getItemNum(itemId);
        const newNum = Math.max(oldNum + itemNum, 0);
        if (newNum > 0) {
            this.itemNumMap.set(itemId, newNum);
        } else {
            this.itemNumMap.delete(itemId);
        }
    }
    /** 获取道具数量 id number为ItemId获取相同道具的数量;string为OnlyId获取单个道具的数量  */
    public getItemNum(id: number | string): number {
        let num = 0;
        // 是否是货币
        if (RoleMgr.I.isCurrency(+id)) {
            return RoleMgr.I.getCurrencyById(+id);
        }
        if (typeof id === 'number') {
            num = this.itemNumMap.get(id) || 0;
        } else if (typeof id === 'string') {
            const itemModel = this.itemMap.get(id);
            if (itemModel) {
                num = itemModel.data.ItemNum;
            }
        }
        return num;
    }
    /** 获取道具数据 */
    public getItemModel(onlyId: string): ItemModel {
        return this.itemMap.get(onlyId);
    }
    /** ***增 删 改 查******* */
    //
    //
    /** 设置背包道具'新'属性  */
    public setItemIsNew(onlyId: string, isNew: boolean): void {
        const itemModel = this.itemMap.get(onlyId);
        if (itemModel) {
            itemModel.isNew = isNew;
        }
    }

    /**
     * 根据类型更新道具数据
     * @param type
     * @param itemModel 道具数据 ItemModel
     * @param state 1:新增 -1:删除 0:更新, 默认为0：更新
     * @returns
     */
    private updateItemModelByBagType(bagType: number, itemModel: ItemModel, state: number = 0): void {
        let mapSize = 0;
        const onlyId = itemModel.data.OnlyId;
        const subType = itemModel.cfg.SubType;
        const isOn = itemModel.data.Pos && itemModel.data.Pos === 2; // 是否穿戴
        const itemMap = this.getItemMapByBagType(bagType, isOn);
        const subTypeItemMap = this.getItemMapBySubType(subType, isOn);
        if (state === 1) { // 新增
            itemMap.set(onlyId, itemModel);
            subTypeItemMap.set(onlyId, itemModel);
        } else if (state === -1) { // 删除
            itemMap.delete(onlyId);
            subTypeItemMap.delete(onlyId);
        } else if (state === 0) { // 更新
            const oldItemModel = itemMap.get(onlyId);
            if (oldItemModel) {
                itemMap.set(onlyId, oldItemModel);
                subTypeItemMap.set(onlyId, oldItemModel);
            } else if (itemModel.data.Pos) { // 如果是可穿戴道具就检查是否穿戴状态改变
                const equipMap = this.getItemMapByBagType(bagType, !isOn); // 非穿即卸
                equipMap.delete(onlyId); // 从未穿带列表删除/从穿戴列表删除
                itemMap.set(onlyId, itemModel); // 添加到穿戴列表/添加到未穿戴列表
                if (isOn) mapSize = equipMap.size;

                const equipSubTypeMap = this.getItemMapBySubType(subType, !isOn); // 非穿即卸
                equipSubTypeMap.delete(onlyId); // 从未穿带列表删除/从穿戴列表删除
                subTypeItemMap.set(onlyId, itemModel); // 添加到穿戴列表/添加到未穿戴列表
            }
        }

        // 更新未穿戴装备部位容器
        if (itemModel.cfg.Type === ItemType.EQUIP) {
            const partMap = this.getUnEquipPartMapByBagType(bagType, subType, itemModel.cfg.EquipPart);
            const qualityMap = this.getUnEquipQualityMapByBagType(bagType, subType, itemModel.cfg.Quality);
            let rebornMap: Map<string, ItemModel>;
            let starMap: Map<string, ItemModel>;
            if (itemModel.cfg.ArmyLevel) {
                rebornMap = this.getUnEquipRebornMapByBagType(bagType, subType, itemModel.cfg.ArmyLevel);
                if (itemModel.cfg.Star) {
                    starMap = this.getUnEquipStarMapByBagType(bagType, subType, itemModel.cfg.Star);
                }
            }
            if (state === -1 || isOn) { // 装备删除或穿戴中
                partMap.delete(onlyId);
                qualityMap.delete(onlyId);
                if (rebornMap) rebornMap.delete(onlyId);
                if (starMap) starMap.delete(onlyId);
            } else {
                partMap.set(onlyId, itemModel);
                qualityMap.set(onlyId, itemModel);
                if (rebornMap) rebornMap.set(onlyId, itemModel);
                if (starMap) starMap.set(onlyId, itemModel);
            }
        } else if (itemModel.cfg.OneKeyUse) { // 一键使用类型
            if (state === -1) { // 道具删除
                this.bagTypeOnKeyUseMap.delete(onlyId);
            } else if (state === 1) { // 道具添加
                this.bagTypeOnKeyUseMap.set(onlyId, itemModel);
            }
        } else if (itemModel.cfg.Type === ItemType.CHEST) { // 宝箱类型
            if (state === -1) { // 道具删除
                this.boxTypeMap.delete(onlyId);
            } else if (state === 1) { // 道具添加
                this.boxTypeMap.set(onlyId, itemModel);
            }
        }
        // 额外信息
        if (itemModel.cfg.Param) {
            if (state === -1) { // 道具删除
                this.bagParamMap.delete(onlyId);
            } else if (state === 1) { // 道具添加
                this.bagParamMap.set(onlyId, itemModel);
            }
        }

        /** 宝箱类型不一定是 一键使用类型 */
        const redBol = this.bagTypeOnKeyUseMap.size > 0 || this.boxTypeMap.size > 0;
        RedDotMgr.I.updateRedDot(RID.Bag.Item, redBol);
        // 检查背包是否满了
        mapSize = state === 0 && isOn ? mapSize : itemMap.size;
        this.checkFullState(bagType, mapSize);
    }

    /**
     * 根据道具类型获取道具缓存数据
     * @param bagType 背包类型 ItemBagType
     * @param isOn 是否穿戴
     */
    public getItemMapByBagType(bagType: number, isOn: boolean = false): Map<string, ItemModel> {
        const idx = Number(isOn); // 获取Map列表，[0]代表未装备，[1]代表已装备
        let list = this.bagTypeItemMapList.get(bagType);
        if (!list) {
            list = new Array(2);
            this.bagTypeItemMapList.set(bagType, list);
        }
        let itemMap = list[idx]; // 获取道具列表
        if (!itemMap) {
            itemMap = new Map();
            list[idx] = itemMap;
        }
        return itemMap;
    }

    /** 获取战力 */
    public getItemFightValue(itemModel: ItemModel, reset?: boolean): number {
        if (itemModel.fightValue && !reset) {
            return itemModel.fightValue;
        }
        let fv = 0;
        /** 基础属性信息 */
        let baseAttrInfo: AttrInfo;
        const baseAttrId = itemModel.cfg.AttrId;
        if (baseAttrId) {
            baseAttrInfo = AttrModel.MakeAttrInfo(baseAttrId);
            fv += baseAttrInfo.fightValue;
        }
        /** 附加属性信息 */
        let addAttrInfo: AttrInfo;
        const addAttr = itemModel.data.AddAttr;
        if (addAttr && addAttr.length > 0) {
            addAttrInfo = AttrModel.MakeAttrInfo(...addAttr);
            fv += addAttrInfo.fightValue;
        }

        if (itemModel.cfg.Type === ItemType.EQUIP_ROLE) {
            const levelAttrInfo = ModelMgr.I.StrengthModel.getStrengthLevelAttrInfo(itemModel.cfg.EquipPart);
            if (levelAttrInfo) {
                fv += levelAttrInfo.fightValue;
            }
        }
        return fv;
    }

    /** 获取背包的物品总数 */
    public getItemOwnSize(bagType: number, isOn: boolean = false): number {
        const map = this.getItemMapByBagType(bagType, isOn);
        return map.size;
    }
    /**
     * ******************************此方法谨慎调用 待优化*****************************
     * 根据装备类型，获取装备列表。
     * @param bagType 背包类型 ItemBagType
     * @param isOn 是否穿戴
     * @returns ItemModel[]
     */
    public getItemListByBagType(bagType: number, isOn: boolean = false): ItemModel[] {
        const map = this.getItemMapByBagType(bagType, isOn);
        const list: ItemModel[] = [];
        map.forEach((v) => { /** 折叠 */
            if (!v.cfg.IsHide) { // 默认隐藏的不放入道具背包
                if (v.cfg.IsPile) {
                    const newItemModels = this.getPileItem(v);
                    list.push(...newItemModels);
                } else {
                    list.push(v); // list.push(new ItemModel(v));
                }
            }
        });
        return this.itemListSort(list, bagType !== ItemBagType.GENERAL && bagType !== ItemBagType.GEM);
    }

    public itemListSort(list: ItemModel[], isEquip?: boolean): ItemModel[] {
        if (isEquip) {
            return list.sort((a, b) => {
                // 装备背包中，按装备的基础战力 由大→小排序 （基础战力=基础属性+附加属性）
                if (a.fightValue !== b.fightValue) {
                    return b.fightValue - a.fightValue;
                }

                // 战力相同时，按装备的品质大小 由大→小排序 （品质大小为： 红→橙→紫→蓝→绿）
                if (a.cfg.Quality !== b.cfg.Quality) {
                    return b.cfg.Quality - a.cfg.Quality;
                }

                // 品质相同时，按装备的军衔等级大小 由大→小排序
                if (a.cfg.ArmyLevel === b.cfg.ArmyLevel) {
                    return b.cfg.ArmyLevel - a.cfg.ArmyLevel;
                }

                // 军衔相同时，由军衔星级大小 由大→小排序
                if (a.cfg.Star === b.cfg.Star) {
                    return b.cfg.Star - a.cfg.Star;
                }
                // 星级相同时，按装备部位ID 由小→大排序 1→2→···→···8
                return a.cfg.EquipPart - b.cfg.EquipPart;
            });
        } else {
            return list.sort((a, b) => {
                // 自选宝箱
                if (a.cfg.SubType === ItemType.CHEST_PICK && b.cfg.SubType !== ItemType.CHEST_PICK) {
                    return -1;
                } else if (a.cfg.SubType !== ItemType.CHEST_PICK && b.cfg.SubType === ItemType.CHEST_PICK) {
                    return 1;
                }

                // 一键使用
                if (a.cfg.OneKeyUse && !b.cfg.OneKeyUse) {
                    return -1;
                } else if (!a.cfg.OneKeyUse && b.cfg.OneKeyUse) {
                    return 1;
                }

                // 道具ID高到低
                if (a.data.ItemId !== b.data.ItemId) {
                    return a.data.ItemId - b.data.ItemId;
                }
                // 道具ID相同，按堆叠数量大到小
                return b.data.ItemNum - a.data.ItemNum;
            });
        }
    }
    /**
     * 获取折叠道具
     * @param item
     * @returns
     */
    public getPileItem(item: ItemModel): ItemModel[] {
        const list: ItemModel[] = [];
        const ownNum = item.data.ItemNum; // 拥有数量
        const pileNum = item.cfg.PileNum || 999; // 可堆叠数量
        if (item.cfg.IsPile && ownNum > pileNum) {
            // 向上取整
            const ceil = Math.ceil(ownNum / pileNum);
            for (let i = 0; i < ceil; i++) {
                let num = 0;
                if (i < ceil - 1) {
                    num = pileNum;
                } else {
                    num = ownNum - pileNum * (ceil - 1);
                }
                const newItemModel = new ItemModel(item);
                newItemModel.data.ItemNum = num;
                list.push(newItemModel);
            }
        } else {
            list.push(new ItemModel(item));
        }
        return list;
    }

    /**
     * 获取装备背包基础容量
     * @returns
     */
    public getBagBaseSize(bagType: number): number {
        let size = 5 * 10000000; // 默认
        const indexer = Config.Get(Config.Type.Cfg_Config);
        switch (bagType) {
            case ItemBagType.EQUIP_ROLE:
                size = Number(indexer.getValueByKey('EquipBagBaseSize', 'CfgValue'));
                break;
            default:
                break;
        }
        return size;
    }

    /**
     * 获取装备背包最大容量
     * @returns
     */
    public getEquipBagMaxSize(): number {
        const indexer = Config.Get(Config.Type.Cfg_Config);
        const size = Number(indexer.getValueByKey('EquipBagMaxSize', 'CfgValue'));
        return size;
    }

    /**
     * 获取装备背包扩展消耗的道具
     * @returns ItemModel
     */
    public getEquipBagExtendPrice(): ItemModel {
        const indexer = Config.Get(Config.Type.Cfg_Config);
        const price: string = indexer.getValueByKey('EquipBagExtendPrice', 'CfgValue');
        const itemDatas = UtilItem.ParseAwardItems(price);
        return itemDatas[0];
    }

    /** 获取扩展格子大小 */
    public getExtendGridSize(bagType: number): number {
        const extendSize = this.gridExtendSizeMap.get(bagType);
        return extendSize || 0;
    }

    /**
     * 获取装备背包扩容容量
     * @param size
     */
    public setExtendGridSize(bagType: number, size: number): void {
        this.gridExtendSizeMap.set(bagType, size);
        const baseSize = this.getBagBaseSize(bagType); // 更新格子总数
        this.bagTypeGridSizeMap.set(bagType, baseSize + size);
        this.checkFullState(bagType);// 检查满状态
    }

    /** 获取可扩展格子数量 */
    public getCanExtendGridSize(bagType: number): number {
        let maxSize = 5 * 10000000; // 默认
        const size = this.getGridSize(bagType);
        switch (bagType) {
            case ItemBagType.EQUIP_ROLE:
                maxSize = this.getEquipBagMaxSize();
                break;
            default:
                break;
        }
        return maxSize - size;
    }
    /**
     * 获取背包格子容量
     * @returns
     */
    public getGridSize(bagType: number): number {
        let size = this.bagTypeGridSizeMap.get(bagType);
        if (!size) {
            const baseSize = this.getBagBaseSize(bagType);
            const extendSize = this.getExtendGridSize(bagType);
            size = baseSize + extendSize;
            this.bagTypeGridSizeMap.set(bagType, size);
        }
        return size;
    }

    /**
     * 是否背包满了
     * @param bagType 背包类型
     * @returns boolean
     */
    public isFullBag(bagType?: number): boolean {
        let isFull = false;
        if (bagType !== undefined) {
            isFull = this.bagTypeFullStateMap.get(bagType);
        } else {
            // 遍历所有背包检测
            this.bagTypeFullStateMap.forEach((v) => {
                if (v) isFull = true;
            });
        }
        return isFull;
    }

    /**
     * 检查背包是否满了
     * @param bagType
     * @param mapSize
     */
    public checkFullState(bagType: number, mapSize?: number): void {
        const ownSize = this.getGridSize(bagType);
        if (mapSize === undefined) {
            const itemMap = this.getItemMapByBagType(bagType);
            mapSize = itemMap.size;
        }
        // 比较状态，避免频繁发送事件
        const fullState = mapSize >= ownSize;
        const oldFullState = this.bagTypeFullStateMap.get(bagType);
        if (fullState !== oldFullState) {
            // 设置新的状态
            this.bagTypeFullStateMap.set(bagType, fullState);
            // 发送状态
            const isFull = this.isFullBag();
            EventClient.I.emit(E.Bag.FullStateChange, isFull);
        }
    }

    /**
     * 获取未穿戴装备部位容器
     * @param bagType
     * @param subType 装备子类型
     * @param part
     * @returns Map<string, ItemModel>
     */
    public getUnEquipPartMapByBagType(bagType: number, subType: number, part: number): Map<string, ItemModel> {
        return this._getUnEquipPropertyMap('part', bagType, subType, part);
    }

    /**
     * 获取未穿戴装备属性容器
     * @param bagType 背包类型
     * @param subType 装备子类型
     * @param property part | quality | reborn | star
     * @returns Map<string, ItemModel>
     */
    private _getUnEquipPropertyMap(keyPrefix: string, bagType: number, subType: number, property: number): Map<string, ItemModel> {
        const key = `${keyPrefix}_${bagType}_${subType}_${property}`;
        let map = this.bagTypeUnEquipPropertyMap.get(key);
        if (!map) {
            map = new Map();
            this.bagTypeUnEquipPropertyMap.set(key, map);
        }
        return map;
    }

    /**
     * 获取未穿戴装备品质容器
     * @param bagType
     * @param subType 装备子类型
     * @param quality
     * @returns Map<string, ItemModel>
     */
    public getUnEquipQualityMapByBagType(bagType: number, subType: number, quality: number): Map<string, ItemModel> {
        return this._getUnEquipPropertyMap('quality', bagType, subType, quality);
    }

    /**
     * 获取未穿戴装备军衔容器
     * @param bagType
     * @param subType 装备子类型
     * @param quality
     * @returns Map<string, ItemModel>
     */
    public getUnEquipRebornMapByBagType(bagType: number, subType: number, reborn: number): Map<string, ItemModel> {
        return this._getUnEquipPropertyMap('reborn', bagType, subType, reborn);
    }

    /**
     * 获取未穿戴装备星级容器
     * @param bagType
     * @param subType 装备子类型
     * @param quality
     * @returns Map<string, ItemModel>
     */
    public getUnEquipStarMapByBagType(bagType: number, subType: number, star: number): Map<string, ItemModel> {
        return this._getUnEquipPropertyMap('star', bagType, subType, star);
    }

    /**
     * 获取背包可以一键使用的道具列表
     * @returns ItemModel[]
     */
    public getOneKeyUseItems(): ItemModel[] {
        const itemModels: ItemModel[] = [];
        const values = Array.from(this.bagTypeOnKeyUseMap.values());
        for (const itemModel of values) {
            if (itemModel.cfg.OneKeyUse) {
                itemModels.push(itemModel);
            }
        }
        return itemModels;
    }

    /**
     * 获取背包有Param值的列表
     * @param subType 道具子类型
     * @returns ItemModel[]
     */
    public getParamItems(subType: ItemType): ItemModel[] {
        const itemModels: ItemModel[] = [];
        const values = Array.from(this.bagParamMap.values());
        for (const itemModel of values) {
            if (itemModel.cfg.Param && itemModel.cfg.SubType === subType) {
                itemModels.push(itemModel);
            }
        }
        return itemModels;
    }

    /**
     * 根据子类型 获取装备列表
     * @param subTypes 进阶坐骑装备 进阶羽翼装备 进阶光武装备...
     * @param isOn 是否已穿戴
     * @returns
     */
    public getItemListBySubTypes(subTypes: number[], isOn?: boolean): ItemModel[] {
        const list: ItemModel[] = [];

        for (let i = 0; i < subTypes.length; i++) {
            const subType = subTypes[i];
            const subTypeItemMap = this.getItemMapBySubType(subType, isOn);
            if (subTypeItemMap) {
                subTypeItemMap.forEach((v) => list.push(v));
            }
        }
        return list;
    }

    public checkArmyLvEquipLv(equipItemModel: ItemModel): boolean {
        const equipRebornLv = equipItemModel.cfg.ArmyLevel;
        const equipStar = equipItemModel.cfg.Star;
        const equipLevel: number = equipItemModel.cfg.Level;
        // 人物基础等级 lv
        const userLevel: number = RoleMgr.I.d.Level;
        // 角色穿戴战力小于 背包  && 军衔等级需要满足
        const armyLevel = RoleMgr.I.getArmyLevel();
        const userStar = RoleMgr.I.getArmyStar();

        if (equipRebornLv) {
            if (armyLevel > equipRebornLv) { // 判断星级
                return true;
            } else if (armyLevel === equipRebornLv && userStar >= equipStar) {
                return true;
            } else {
                return false;
            }
        } else if (userLevel >= equipLevel) { // 玩家等级大于装备等级
            return true;
        }
        return false;
    }
    /** 是否显示一键穿戴按钮 */
    public getOneKeyWearEquip(): boolean {
        // 未穿戴列表
        const roleUnEquipList = this.getItemMapByBagType(ItemBagType.EQUIP_ROLE, false);
        const lenUnWear: number = roleUnEquipList.size;

        /** 1、背包里没有装备 */
        if (!lenUnWear) { return false; }

        /** 2、 背包里有装备 但是角色身上都没穿 */
        const roleEquipList = this.getOnEquipMapWithEquipPart();
        const lenWear: number = roleEquipList.size;
        // 人物基础等级 lv
        const userLevel: number = RoleMgr.I.d.Level;
        // 角色穿戴战力小于 背包  && 军衔等级需要满足
        const armyLevel = RoleMgr.I.getArmyLevel();
        const userStar = RoleMgr.I.getArmyStar();

        const roleUnEquipPartMap = this.getUnEquipMapWithEquipPart();
        if (lenUnWear && !lenWear) {
            // 判断军衔等级 && 人物等级是否符合 穿戴条件
            for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
                const itemUnEquipArr: ItemModel[] = roleUnEquipPartMap.get(i);
                for (let j = 0; j < itemUnEquipArr.length; j++) {
                    const bol = this.checkArmyLvEquipLv(itemUnEquipArr[j]);
                    if (bol) {
                        return bol;
                    }
                }
            }
            return false;
        }

        /** 未穿戴列表 */
        /** 背包里有装备 并且角色也有穿 */
        /** 遍历8个部位 */
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            // 角色的某些部位 没穿，背包有穿
            const itemEquip = roleEquipList.get(i);// 某部位已穿戴
            // 角色未穿
            const itemUnEquipArr: ItemModel[] = roleUnEquipPartMap.get(i);

            /** 某部位背包里没有 无需判断 */
            if (!itemUnEquipArr || !itemUnEquipArr.length) {
                continue;
            }

            /** 某个部位未穿,背包里有 */
            if (!itemEquip && itemUnEquipArr && itemUnEquipArr.length) {
                for (let j = 0; j < itemUnEquipArr.length; j++) {
                    const bol = this.checkArmyLvEquipLv(itemUnEquipArr[j]);
                    if (bol) {
                        return bol;
                    }
                }
                return false;
            }

            /** 某部位和背包都有 */
            const roleEquipFightVal = this.getItemFightValue(itemEquip);// itemEquip.fightValue;
            for (let j = 0; j < itemUnEquipArr.length; j++) {
                const bagFightVal = this.getItemFightValue(itemUnEquipArr[j]);
                if (bagFightVal > roleEquipFightVal) {
                    const bol = this.checkArmyLvEquipLv(itemUnEquipArr[j]);
                    if (bol) {
                        return bol;
                    }
                }
            }
        }
        return false;
    }

    // ----------------快捷使用 begin------------------------
    /** 快速使用道具容器，键对应：道具唯一ID */
    private quickUseItemMap: Map<string, ItemModel> = new Map();

    public addQuickUseItemMap(onlyId: string, v: ItemModel): void {
        this.quickUseItemMap.set(onlyId, v);
    }
    /**
     * 检查快速使用的装备
     * @param changes 道具更新信息
     */
    public checkQuickUse(changes: BagItemChangeInfo[]): void {
        const userArmyLv = RoleMgr.I.getArmyLevel();
        const userStar = RoleMgr.I.getArmyStar();

        for (let i = 0, len = changes.length; i < len; i++) {
            const info: BagItemChangeInfo = changes[i];
            // 如果是删除道具\非快捷道具\穿戴的装备就过滤掉
            if (info.status === -1 || info.itemModel.data.Pos === 2) {
                continue;
            }
            const cfg: Cfg_Item = info.itemModel.cfg;// 背包里变化的装备

            if (cfg.SubType === ItemType.EQUIP_ROLE) {
                const equipArmyLv = cfg.ArmyLevel;
                const equipArmyStar = cfg.Star;

                // 增加判断 装备的军衔等级 星级 大于人物的军衔与星级return;
                if (equipArmyLv > userArmyLv || (equipArmyLv === userArmyLv && equipArmyStar > userStar)) {
                    continue;// 装备的大于人物的，则不可以穿
                }

                // 检查旧的部位装备战力是否小于新的
                const ePart: number = cfg.EquipPart;
                const oldItemModel = this.quickUseRoleEquipPartMap.get(ePart);

                // 1 池子里没有  2 池子里有&& 池子里的战力不如当前的大
                if (!oldItemModel || oldItemModel.fightValue < info.itemModel.fightValue) {
                    // 取出穿戴中同部位装备
                    const onEquipItem = this.getOnEquipByPart(cfg.BagType, cfg.SubType, ePart);
                    // 检查穿戴中的部位装备战力是否小于背包变化的装备
                    if (onEquipItem) {
                        if (onEquipItem.fightValue < info.itemModel.fightValue) {
                            this.quickUseRoleEquipPartMap.set(ePart, info.itemModel);
                            // 判断战力是否大于 map里的
                            EventClient.I.emit(E.ItemQU.GetEquip, info.itemModel);
                        }
                    } else {
                        // 未穿戴直接推荐
                        this.quickUseRoleEquipPartMap.set(ePart, info.itemModel);
                        EventClient.I.emit(E.ItemQU.GetEquip, info.itemModel);
                    }
                }
            } else if (cfg.IsFastShow) {
                // 快捷道具
                this.quickUseItemMap.set(info.itemModel.data.OnlyId, info.itemModel);
                // 获得相同道具 需要合并数量
                const isOpening = WinMgr.I.checkIsOpen(ViewConst.ItemQuickUseWin);
                if (isOpening) {
                    EventClient.I.emit(E.ItemQU.GetBox, info.itemModel.data.OnlyId);
                }
            }
        }

        // 如果有快捷使用的道具，通知弹出快捷使用框
        if (this.quickUseRoleEquipPartMap.size > 0 || this.quickUseItemMap.size > 0) {
            // console.log(this.quickUseRoleEquipPartMap, this.quickUseItemMap);

            const isOpening = WinMgr.I.checkIsOpen(ViewConst.ItemQuickUseWin);
            if (!isOpening) {
                WinMgr.I.open(ViewConst.ItemQuickUseWin);
            }
        }
    }

    /** 获取一个快速使用的道具 */
    public getQuickUseItem(): ItemModel {
        let itemModel: ItemModel;
        /** 先从装备里取一件 */
        if (this.quickUseRoleEquipPartMap.size > 0) {
            const arr = Array.from(this.quickUseRoleEquipPartMap.values());
            for (const iterator of arr) {
                if (!itemModel) {
                    itemModel = iterator;
                    this.quickUseRoleEquipPartMap.delete(itemModel.cfg.EquipPart);
                    break;
                }
            }
        }
        /** 装备没有从道具里取 */
        if (!itemModel && this.quickUseItemMap.size > 0) {
            for (const iterator of Array.from(this.quickUseItemMap.values())) {
                if (!itemModel) {
                    itemModel = iterator;
                    this.quickUseItemMap.delete(itemModel.data.OnlyId);
                    break;
                }
            }
        }
        return itemModel;
    }
    /** 倒计时结束 删除所有池子里的装备 */
    public deleteAllQuickUserEquip(): void {
        if (this.quickUseRoleEquipPartMap.size) {
            for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
                this.quickUseRoleEquipPartMap.delete(i);
            }
        }
    }
    /** 获取和快速使用的装备相同装备类型的装备列表 */
    public getQuickUseSameRoleEquips(): ItemModel[] {
        const list: ItemModel[] = [];
        if (this.quickUseRoleEquipPartMap.size > 0) {
            for (const itemModel of Array.from(this.quickUseRoleEquipPartMap.values())) {
                list.push(itemModel);
            }
            this.quickUseRoleEquipPartMap.clear();
        }
        return list;
    }

    // ------------获取角色装备的方法begin------------------------
    /**
     * 获取角色已穿戴的装备 按部位显示的map
     * equipPart:ItemModel
     */
    public getOnEquipMapWithEquipPart(): Map<number, ItemModel> {
        const mapIndex = new Map<number, ItemModel>();
        const map = this.getItemMapByBagType(ItemBagType.EQUIP_ROLE, true);
        if (map.size) {
            map.forEach((val, k) => {
                mapIndex.set(val.cfg.EquipPart, val);
            });
            return mapIndex;
        }
        return mapIndex;
    }
    /**
     * 根据部位获取穿戴的装备
     * @param bagType 背包类型 ItemBagType.xxx,
     * @param subType 物品类型 ItemType.xxx
     * @param equipPart 部位
     * @returns ItemModel
     */
    public getOnEquipByPart(bagType: number, subType: number, equipPart: number): ItemModel {
        let itemModel: ItemModel;
        const onEquipMap = this.getItemMapByBagType(bagType, true);
        for (const item of Array.from(onEquipMap.values())) {
            if (item.cfg.SubType === subType && item.cfg.EquipPart === equipPart) {
                itemModel = item;
                break;
            }
        }
        return itemModel;
    }
    /**
     * 角色未穿戴Map
     * equipPart:ItemModel[];
    */
    public getUnEquipMapWithEquipPart(): Map<number, ItemModel[]> {
        const mapIndex = new Map<number, ItemModel[]>();
        const map = this.getItemMapByBagType(ItemBagType.EQUIP_ROLE, false);
        if (map.size) {
            map.forEach((val, k) => {
                const equipPart = val.cfg.EquipPart;
                const arrItemModel: ItemModel[] = mapIndex.get(equipPart);
                if (mapIndex.get(equipPart)) {
                    arrItemModel.push(val);
                    mapIndex.set(equipPart, arrItemModel);
                } else {
                    mapIndex.set(val.cfg.EquipPart, [val]);
                }
            });
            return mapIndex;
        }
        return mapIndex;
    }

    /** 根据部位获取未穿戴的装备列表 ItemModel[] */
    public getUnEquipListByPart(bagType: number, subType: number, part: number): ItemModel[] {
        const list: ItemModel[] = [];
        const unEquipMap = this.getUnEquipPartMapByBagType(bagType, subType, part);
        unEquipMap.forEach((v) => {
            list.push(v);
        });
        return list;
    }

    /**
     * 根据子类型获取道具缓存数据
     * @param type 道具类型，默认为0：普通道具数据缓存
     * @param isOn 如果是可穿戴道具，获取穿戴中的装备缓存，默认为false
     * @returns 子类型对应的道具数据缓存
     */
    public getItemMapBySubType(subType: number, isOn: boolean = false): Map<string, ItemModel> {
        const idx = Number(isOn);
        // 获取Map列表，[0]代表未装备，[1]代表已装备
        let list = this.bagTypeItemMapList.get(subType);
        if (!list) {
            list = new Array(2);
            this.bagTypeItemMapList.set(subType, list);
        }

        // 获取道具列表
        let itemMap = list[idx];
        if (!itemMap) {
            itemMap = new Map();
            list[idx] = itemMap;
        }
        return itemMap;
    }
}
