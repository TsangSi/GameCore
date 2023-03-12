import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { Config } from '../../../base/config/Config';
import { ConfigAttributeIndexer } from '../../../base/config/indexer/ConfigAttributeIndexer';
import { ConfigEquipIndexer } from '../../../base/config/indexer/ConfigEquipIndexer';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import {
    ConstItemId, ROLE_EQUIP_PART_NUM, ItemBagType, ItemCurrencyId, ItemType,
} from '../../../com/item/ItemConst';
import ItemModel from '../../../com/item/ItemModel';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import { BagMgr } from '../../bag/BagMgr';
import { RedDotCheckMgr } from '../../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass } = cc._decorator;
@ccclass('StrengthModel')
export class StrengthModel extends BaseModel {
    public clearAll(): void {
        this._map.clear();
    }

    public clear(): void {
        this._map.clear();
    }
    /** 初始部位信息 */
    private _map: Map<number, number> = new Map();

    /** 共鸣等级 */
    private _resonateLev: number;
    public initData(equipPosList: EquipPos[], gmLevel: number): void {
        for (const item of equipPosList) {
            this._map.set(item.Pos, item.StrengthLevel);
        }

        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            if (!this._map.get(i)) {
                this._map.set(i, 0);
            }
        }
        this._resonateLev = gmLevel;
    }

    /** 获取共鸣等级 */
    public getResonateLev(): number {
        return this._resonateLev || 0;
    }
    /** 更新共鸣等级 */
    public updateResonateLev(lv: number): void {
        this._resonateLev = lv;
    }

    public updateEquipPosList(equipPosList: EquipPos[]): void {
        for (const item of equipPosList) {
            this._map.set(item.Pos, item.StrengthLevel);
        }
    }

    /**
     * 根据部位获取强化等级
     * @param equipPart 装备部位 1---8
     * @returns 等级0-n
     */
    public getStrengthLvByPart(equipPart: number): number {
        return this._map.get(equipPart) || 0;
    }

    /** 获取强化等级最低部位 */
    public getMinLvEquipPart(): number { // 1 2 3 4 45 6 7 8
        if (this._map.size === 0) {
            return 1;// un reachable code
        }
        let isAllZero: boolean = true;
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            if (this._map.get(i)) {
                isAllZero = false;
                break;
            }
        }
        if (isAllZero) { /** 全部等级都是0 */
            const roleEquip = BagMgr.I.getOnEquipMapWithEquipPart();
            if (roleEquip.size) { // 某个部位有穿，就返回某个部位
                for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
                    if (roleEquip.get(i)) {
                        return i;
                    }
                }
            }
            return 1;
        }

        /** 部分部位有穿戴  部位：等级 */
        const arr: { k: number, v: number }[] = [];
        this._map.forEach((val, key) => {
            arr.push({ k: Number(key), v: Number(val) });
        });
        arr.sort((l, r) => l.v - r.v);
        // 判断已穿戴部位 军衔等级最小的
        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();
        for (let j = 0; j < ROLE_EQUIP_PART_NUM; j++) {
            const equipPart = arr[j].k;
            const item = roleEquipList.get(equipPart);
            if (item) {
                return equipPart;// arr[j];
            }
        }
        return 1;
    }

    public getResonateByLv(lv: number): Cfg_EquipStrengthS {
        const indexer = Config.Get(Config.Type.Cfg_EquipStrengthS);
        const cfg: Cfg_EquipStrengthS = indexer.getValueByKey(lv);
        return cfg;
    }

    public getResonateAttrByLv(lv: number): IAttrBase[] {
        const cfg: Cfg_EquipStrengthS = this.getResonateByLv(lv);
        const attrId: number = cfg.AttrId;
        const attr: IAttrBase[] = UtilAttr.GetAttrBaseListById(attrId);
        return attr;
    }

    public getResonateFightPowerByLv(attrId: number): number {
        const attrIndexer: ConfigAttributeIndexer = Config.Get(Config.Type.Cfg_Attribute);
        return attrIndexer.getFightValueById(attrId);
    }

    /** 共鸣 */
    public getMaxLv(): number {
        const indexer = Config.Get(Config.Type.Cfg_EquipStrengthS);
        const keys = indexer.getKeys();
        const lastKey: number = keys[keys.length - 1];
        const cfg: Cfg_EquipStrengthS = indexer.getValueByKey(lastKey);
        return cfg.Level;
    }

    /** 获取强化等级上限 */
    public getBuildMax(Reborn: number): number {
        const indexer = Config.Get(Config.Type.Cfg_EquipStrengthC);
        const cfg: Cfg_EquipStrengthC = indexer.getValueByKey(Reborn);
        return cfg.Max;
    }

    /**
     * 根据共鸣等阶 获取所有部位最低强化需要的等级
     * @param lv 共鸣等阶
     */
    public getNeeLv(lv: number): number {
        const cfg: Cfg_EquipStrengthS = this.getResonateByLv(lv);
        return cfg.LevelLimit;
    }

    /**
     * 是否可以共鸣升阶
     * @param lv
     * @returns
     */
    public isCanUpResonate(lv: number): boolean {
        let bol: boolean = true;
        const needLv: number = this.getNeeLv(lv);// 共鸣升阶所需等级
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            const lv = this.getStrengthLvByPart(i);
            if (lv < needLv) { // 有个部位小于该等级则无法共鸣升阶
                bol = false;
                break;
            }
        }
        return bol;
    }

    /**
     *根据部位 强化等级 获取强化属性配置
     * @param equipPart 强化部位
     * @param stLv 强化等级
     * @returns cfg 强化属性配置
     */
    public getCfgByEquipPartLv(equipPart: number, stLv: number): Cfg_EquipStrengthA {
        const indexer: ConfigEquipIndexer = Config.Get(Config.Type.Cfg_EquipStrengthA);
        const c: Cfg_EquipStrengthA = indexer.getCfgByLv(equipPart, stLv);
        return c;
    }
    /**
     * 根据部位获取军衔等级
     * @param equipPart 部位 1 2 3 4 5 6  7 8
     */
    public getEquipArmyLevelByEquipPart(equipPart: number): number {
        const roleEquipList: Map<number, ItemModel> = BagMgr.I.getOnEquipMapWithEquipPart();

        if (roleEquipList.size && roleEquipList.get(equipPart)) {
            return roleEquipList.get(equipPart).cfg.ArmyLevel;
        }
        return 0;
    }

    /**
     * 强化该部位铜钱是否足够
     * @param equipPart 部位 1 2 3 4 5 6 7 8
     * @returns true 足够 false 不够
     */
    public isCoinEnaugth(equipPart: number): boolean {
        // 某个部位穿戴的装备
        const itemModel: ItemModel = BagMgr.I.getOnEquipByPart(ItemBagType.EQUIP_ROLE, ItemType.EQUIP_ROLE, equipPart);
        if (itemModel) {
            // 装备强化等级
            const stLv: number = this.getStrengthLvByPart(equipPart) || 0;
            const indexer = Config.Get(Config.Type.Cfg_EquipStrengthC);
            const cfg: Cfg_EquipStrengthC = indexer.getIntervalData(stLv);

            // 铜钱
            const coinBase: number = cfg.CoinBase;
            const coinUp: number = cfg.CoinUp;
            const coinNum = coinBase + stLv * coinUp;
            const coinBagNum: number = RoleMgr.I.d.ItemType_Coin4;

            return coinBagNum >= coinNum;
        }
        return false;
    }

    /**
     * 强化该部位 强化石是否足够
     * @param equipPart 部位 1 2 3 4 5 6 7 8
     * @returns true 足够 false 不够
     */
    public isStoneEnugth(equipPart: number): boolean {
        const itemModel: ItemModel = BagMgr.I.getOnEquipByPart(ItemBagType.EQUIP_ROLE, ItemType.EQUIP_ROLE, equipPart);
        if (itemModel) {
            // 装备强化等级
            const stLv: number = this.getStrengthLvByPart(equipPart) || 0;
            // 装备转生等级
            // const Reborn = data.cfg.ArmyLevel;

            // const indexer = Config.Get(Config.Type.Cfg_EquipStrengthC);
            // const cfg: Cfg_EquipStrengthC = indexer.getValueByKey(Reborn);
            const indexer = Config.Get(Config.Type.Cfg_EquipStrengthC);
            const cfg: Cfg_EquipStrengthC = indexer.getIntervalData(stLv);

            // 强化石
            const stoneBase: number = cfg.StoneBase;
            const stoneUp: number = parseFloat(cfg.StoneUp);
            const stoneNum = stoneBase + Math.ceil((stLv + 1 - cfg.Min) * stoneUp);

            // const stoneNum = stoneBase + Math.ceil(stLv * stoneUp);
            const stoneId = ConstItemId.stoneId;
            const stoneBagNum: number = BagMgr.I.getItemNum(stoneId);
            return stoneBagNum >= stoneNum;
        }
        return false;
    }

    public getSingleEquipData(equipPart: number): ItemModel {
        const itemModel: ItemModel = BagMgr.I.getOnEquipByPart(ItemBagType.EQUIP_ROLE, ItemType.EQUIP_ROLE, equipPart);
        return itemModel;
    }

    /**
     * 获取强化等级属性信息
     * @param equipPart
     * @returns AttrInfo | null
     */
    public getStrengthLevelAttrInfo(equipPart: number, lv?: number): AttrInfo | null {
        const level: number = lv && lv > 0 ? lv : this.getStrengthLvByPart(equipPart);
        if (level > 0) {
            const cfg = this.getCfgByEquipPartLv(equipPart, level);

            // 基础属性&加成
            const baseAttrs: IAttrBase[] = UtilAttr.GetAttrBaseListById(cfg.BaseAttrId);
            const addAttrs: IAttrBase[] = UtilAttr.GetAttrBaseListById(cfg.AddAttrId);

            const levelAttrs: IAttrBase[] = [];
            for (let i = 0, len = baseAttrs.length; i < len; i++) {
                const baseAttr = baseAttrs[i];
                const addAttr = addAttrs[i];
                levelAttrs[i] = {
                    attrType: baseAttr.attrType,
                    value: baseAttr.value + addAttr.value * (level - cfg.LevelMin),
                    name: baseAttr.name,
                    key: baseAttr.key,
                };
            }

            if (levelAttrs.length > 0) {
                return new AttrInfo(...levelAttrs);
            }
        }
        return null;
    }

    public getEquipItemByPart(equipPart: number): ItemModel {
        const item: ItemModel = BagMgr.I.getOnEquipByPart(ItemBagType.EQUIP_ROLE, ItemType.EQUIP_ROLE, equipPart);
        return item;
    }

    /** redDot---begin--- */
    public registerRedDotListen(): void {
        const funcObj = RID.Equip.Strength;// 强化功能
        const multipleRed = funcObj.Id;
        const win = ViewConst.EquipWin;

        // 一键强化
        const oneKeyStrengthRed = funcObj.OneKeyStrength;
        const oneKeyStrengthListen: IListenInfo = {
            // 协议1 :强化基础信息 2:强化成功 3:一键强化 4 背包物品变化 5 角色穿戴成功 6 角色军衔等级变化
            ProtoId: [
                // ProtoId.
                ProtoId.S2CEquipPosInfo_ID,
                ProtoId.S2CStrengthEquipPos_ID,
                ProtoId.S2CAutoStrengthEquipPos_ID,
                ProtoId.S2CBagChange_ID,
                ProtoId.S2CWearOrRemoveEquip_ID,
                ProtoId.S2CArmyUp_ID,
            ],
            RoleAttr: [RoleAN.N.ItemType_Coin4, RoleAN.N.Level], // 人物等级变化
            ItemId: [ConstItemId.stoneId],
            CheckVid: [win],
            ProxyRid: [multipleRed],
        };
        // 共鸣
        const resonanceRed = funcObj.Resonance;
        const resonanceListen: IListenInfo = {
            // 1强化 2 一键强化 3进阶
            ProtoId: [
                ProtoId.S2CStrengthEquipPos_ID,
                ProtoId.S2CAutoStrengthEquipPos_ID,
                ProtoId.S2CResonateEquipPos_ID,
            ],
            CheckVid: [win],
            ProxyRid: [multipleRed],
        };

        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            // { rid: strengthRed, info: strengthListen },
            { rid: oneKeyStrengthRed, info: oneKeyStrengthListen },
            { rid: resonanceRed, info: resonanceListen },
        );
    }

    /**
     * 添加红点事件发送的监听
     */
    public onRedDotEventListen(): void {
        const funcObj = RID.Equip.Strength;// 军衔功能
        // ui未打开检测所有内部的红点
        RedDotCheckMgr.I.on(funcObj.Id, this._redCheckAll, this);
        // UI打开的时候，走如下的几个监听
        RedDotCheckMgr.I.on(funcObj.OneKeyStrength, this._redOneKeyStrength, this);
        RedDotCheckMgr.I.on(funcObj.Resonance, this._redResonance, this);
    }

    /** 移除红点事件发送的监听 */
    public offRedDotEventListen(): void {
        const funcObj = RID.Equip.Strength;// 军衔功能
        // ui未打开检测所有内部的红点
        RedDotCheckMgr.I.off(funcObj.Id, this._redCheckAll, this);
        // UI打开的时候，走如下的几个监听
        RedDotCheckMgr.I.off(funcObj.OneKeyStrength, this._redOneKeyStrength, this);
        RedDotCheckMgr.I.off(funcObj.Resonance, this._redResonance, this);
    }

    /** 检测所有 强化 一键强化 共鸣 */
    private _redCheckAll(): boolean {
        const isShow: boolean = this._redOneKeyStrength() || this._redResonance();
        return isShow;
    }
    /** 一键强化红点 */
    public _redOneKeyStrength(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.EquipStrength)) { // 打造功能未开启 不显示红点
            RedDotMgr.I.updateRedDot(RID.Equip.Strength.OneKeyStrength, false);
            return false;
        }
        let isShow = false;
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            if (this.canEquipPartStrength(i)) {
                isShow = true;
                break;
            }
        }

        RedDotMgr.I.updateRedDot(RID.Equip.Strength.OneKeyStrength, isShow);
        return isShow;
    }
    /** 某部位是否可强化 */
    public canEquipPartStrength(equipPart: number): boolean {
        const roleEquipMap = BagMgr.I.getOnEquipMapWithEquipPart();
        if (roleEquipMap.size && roleEquipMap.get(equipPart)) {
            // 1 装备部位强化等级 < 人物等级 可强化
            const posLv: number = this.getStrengthLvByPart(equipPart);
            const roleLv: number = RoleMgr.I.d.Level;
            const armyLevel: number = this.getEquipArmyLevelByEquipPart(equipPart);
            const upLimit: number = this.getBuildMax(armyLevel); // 强化上限等级

            if (posLv < roleLv && posLv < upLimit && this.isCoinEnaugth(equipPart) && this.isStoneEnugth(equipPart)) {
                return true;
            }
        }
        return false;
    }

    /** 共鸣红点 */
    public _redResonance(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.EquipStrength)) { // 打造功能未开启 不显示红点
            RedDotMgr.I.updateRedDot(RID.Equip.Strength.Resonance, false);
            return false;
        }
        let isShow = false;
        const lv = this.getResonateLev();
        const MaxLevel: number = this.getMaxLv();
        const bol: boolean = this.isCanUpResonate(lv + 1);
        if (lv < MaxLevel && bol) {
            isShow = true;
        }
        RedDotMgr.I.updateRedDot(RID.Equip.Strength.Resonance, isShow);
        return isShow;
    }

    public getStrengthAttrInfo(equipPart: number, lv: number): AttrInfo {
        const attrInfo: AttrInfo = new AttrInfo();
        const cfg = this.getCfgByEquipPartLv(equipPart, lv);
        const baseAttrInfo = AttrModel.MakeAttrInfo(cfg.BaseAttrId);
        if (lv > cfg.LevelMin) {
            const addAttrInfo = AttrModel.MakeAttrInfo(cfg.AddAttrId);
            for (let i = 0; i < addAttrInfo.attrs.length; i++) {
                const attr = addAttrInfo.attrs[i];
                attr.value *= (lv - 1) % 10;
            }
            baseAttrInfo.add(addAttrInfo);
        }
        attrInfo.add(baseAttrInfo);
        return attrInfo;
    }
}
