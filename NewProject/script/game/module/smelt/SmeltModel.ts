import { UtilBool } from '../../../app/base/utils/UtilBool';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigAttributeIndexer } from '../../base/config/indexer/ConfigAttributeIndexer';
import {
    ConstItemId, ItemBagType, ItemCurrencyId, ItemQuality, ItemType,
} from '../../com/item/ItemConst';
import ItemModel from '../../com/item/ItemModel';
import { BagMgr } from '../bag/BagMgr';
import { GradeMgr } from '../grade/GradeMgr';
import { TAB_IDX } from './SmeltConst';

export enum MaterialType {
    WEPON = 1, // 武器
    DEFENCE = 2, // 防具
    DECORATE = 3, // 装饰
}

export interface MeltReward {
    ItemId: number,
    ItemNum: number,
    showGL: boolean
}
const { ccclass } = cc._decorator;
@ccclass('SmeltModel')
export class SmeltModel extends BaseModel {
    public clearAll(): void {
        //
    }

    public init(): void {
        //
    }
    public autoSmelt: boolean = false;

    /**
     * 根据装备品质获取配置物品数量
     * @param quality 品质ID
     * @returns 铜钱 强化石数量
     */
    public getCfgMeltItemByQuality(quality: number): number[] {
        const indexer = Config.Get(Config.Type.Cfg_MeltCom);
        const cfg: Cfg_MeltCom = indexer.getValueByKey(quality);
        return [cfg.CoinNum, cfg.StoneNum];
    }

    /**
     * 计算熔炼后得到 铜钱数量 强化石数量
     * @param smeltItems 熔炼列表
     */
    public calcSimpleReward(smeltItems: ItemModel[]): MeltReward[] {
        let sumCoin: number = 0;
        let sumStone: number = 0;
        for (const item of smeltItems) {
            const quality: number = item.cfg.Quality;
            const [coinNum, stoneNum] = this.getCfgMeltItemByQuality(quality);
            sumCoin += coinNum;
            sumStone += stoneNum;
        }
        // 常量ID
        // const cfg: Cfg_Item = UtilItem.GetCfgByItemId(ConstItem.coinId);// 铜钱配置
        // const cfg1: Cfg_Item = UtilItem.GetCfgByItemId(ConstItem.stoneId);// 强化石配置
        // console.log(cfg);
        // console.log(cfg1);
        const arr: MeltReward[] = [
            { ItemId: ItemCurrencyId.COIN, ItemNum: sumCoin, showGL: false },
            { ItemId: ConstItemId.stoneId, ItemNum: sumStone, showGL: false },
        ];
        return arr;
    }

    /** 红装熔炼 */
    private _rewardArr: MeltReward[];
    public calcRedMeltReward(smeltItems: ItemModel[]): MeltReward[] {
        this._rewardArr = [];
        for (const item of smeltItems) {
            const equipPart: number = item.cfg.EquipPart;// 装备部位

            // 星级-->获得各种碎片 数量
            const star: number = item.cfg.Star;
            const indexer_0 = Config.Get(Config.Type.Cfg_MeltRed);
            const cfg_0: Cfg_MeltRed = indexer_0.getValueByKey(star);// 各种碎片

            // 部位-->获得碎片类型
            const indexer_1 = Config.Get(Config.Type.Cfg_MeltPartToType);
            const cfg_1: Cfg_MeltPartToType = indexer_1.getValueByKey(equipPart);// 碎片类型

            // 碎片类型+转生等级 = 材料道具ID
            const equipType: number = cfg_1.EquipMaterialType;// 碎片类型
            const ArmyLevel: number = item.cfg.ArmyLevel;// 转生等级

            // 材料类型+转生等级 = 材料道具ID
            const indexer2 = Config.Get(Config.Type.Cfg_Equip_Material);
            const cfg_2: any = indexer2.getValueByKey(equipType, ArmyLevel);
            const cfg_2_next: any = indexer2.getValueByKey(equipType, ArmyLevel + 1);

            /* eslint-disable */
            // 碎片
            const Tatter1Num = this._getNumByAttr(cfg_0.Tatter1);//碎片1数量
            const Tatter2Num = this._getNumByAttr(cfg_0.Tatter2);//碎片2数量
            const Tatter1Id = cfg_2.ItemId;// 碎片id1
            const Tatter2Id = cfg_2_next?.ItemId;// cfg_2.ItemId + 1;// 碎片id2
            this._addRewardItem(Tatter1Id, Tatter1Num);
            this._addRewardItem(Tatter2Id, Tatter2Num);

            // 打造石
            const indexer3 = Config.Get(Config.Type.Cfg_Equip_Material);
            const cfg_3: any = indexer3.getValueByKey(ConstItemId.BuidStoneType, ArmyLevel);
            const cfg_3_next: any = indexer3.getValueByKey(ConstItemId.BuidStoneType, ArmyLevel + 1);
            const BuildStone1Num = this._getNumByAttr(cfg_0.BuildStone1);//打造石1数量
            const BuildStone2Num = this._getNumByAttr(cfg_0.BuildStone2);//打造石2数量
            const BuidStone1Id = cfg_3.ItemId;// 打造石id1
            const BuidStone2Id = cfg_3_next?.ItemId;// cfg_3.ItemId + 1;// 打造石id2
            this._addRewardItem(BuidStone1Id, BuildStone1Num);
            this._addRewardItem(BuidStone2Id, BuildStone2Num);

            // 升星石
            const indexer4 = Config.Get(Config.Type.Cfg_Equip_Material);
            const cfg_4: any = indexer4.getValueByKey(ConstItemId.StarStoneType, ArmyLevel);
            const cfg_4_next: any = indexer4.getValueByKey(ConstItemId.StarStoneType, ArmyLevel + 1);
            const StarStone1Num = this._getNumByAttr(cfg_0.StarStone1);//升星石1数量
            const StarStone2Num = this._getNumByAttr(cfg_0.StarStone2);//升星石2数量
            const StarStone1Id = cfg_4.ItemId;// 升星石id1
            const StarStone2Id = cfg_4_next?.ItemId;// cfg_4.ItemId + 1;// 升星石id2
            this._addRewardItem(StarStone1Id, StarStone1Num);
            this._addRewardItem(StarStone2Id, StarStone2Num);

            // 卓越属性石
            const ExcAttrStroneNum = this._getNumByAttr(cfg_0.ExcAttrStone);//卓越属性石数量
            this._addRewardItem(ConstItemId.ExcAttrStrone, ExcAttrStroneNum);

            // 完美打造石
            const PrefBuildStoneNum = this._getNumByAttr(cfg_0.PrefBuildStone);//完美打造石数量
            this._addRewardItem(ConstItemId.PerfBuildStone, PrefBuildStoneNum);
            /* eslint-enable */
        }
        return this._rewardArr;
    }

    /**
     * 收集进阶熔炼奖励
     * @param smeltItems
     * @returns MeltReward[]
     */
    public calcGradeMeltReward(smeltItems: ItemModel[]): MeltReward[] {
        this._rewardArr = [];
        for (const item of smeltItems) {
            const quality: number = item.cfg.Quality;
            const cfg_0 = this.getCfgMeltGradeByQuality(quality);

            // 部位-->获得碎片类型
            const gradeId = GradeMgr.I.getGradeIdBySubType(item.cfg.SubType);
            const indexer = Config.Get(Config.Type.Cfg_MeltSysToType);
            const cfg_1: Cfg_MeltSysToType = indexer.getValueByKey(gradeId); // 碎片类型
            // item.cfg.g

            // 材料类型+进阶等级等级 = 材料道具ID
            const materialType: number = cfg_1.EquipMaterialType; // 材料类型
            // const gradeData = GradeMgr.I.getGradeData(gradeId);
            const gradeLv = item.cfg.Level;// gradeData.GradeLv.BigLv;
            // 材料类型+进阶等级等级 = 材料道具ID
            const indexer2 = Config.Get(Config.Type.Cfg_Equip_Material);
            const cfg_2: Cfg_Equip_Material = indexer2.getValueByKey(materialType, gradeLv);
            const cfg_2_next: Cfg_Equip_Material = indexer2.getValueByKey(materialType, gradeLv + 1);

            // 碎片
            const Tatter1Num = this._getNumByAttr(cfg_0.Tatter1); // 碎片1数量
            const Tatter2Num = this._getNumByAttr(cfg_0.Tatter2); // 碎片2数量
            const Tatter1Id = cfg_2.ItemId;// 碎片id1
            const Tatter2Id = cfg_2_next?.ItemId;// 碎片id2
            this._addRewardItem(Tatter1Id, Tatter1Num);
            this._addRewardItem(Tatter2Id, Tatter2Num);

            // 打造石
            const indexer3 = Config.Get(Config.Type.Cfg_Equip_Material);
            const cfg_3: Cfg_Equip_Material = indexer3.getValueByKey(ConstItemId.JJBuidStoneType, gradeLv);
            const cfg_3_next: Cfg_Equip_Material = indexer3.getValueByKey(ConstItemId.JJBuidStoneType, gradeLv + 1);
            const BuildStone1Num = this._getNumByAttr(cfg_0.BuildStone1); // 打造石1数量
            const BuildStone2Num = this._getNumByAttr(cfg_0.BuildStone2); // 打造石2数量
            const BuidStone1Id = cfg_3.ItemId;// 打造石id1
            const BuidStone2Id = cfg_3_next?.ItemId;// 打造石id2
            this._addRewardItem(BuidStone1Id, BuildStone1Num);
            this._addRewardItem(BuidStone2Id, BuildStone2Num);
        }
        return this._rewardArr;
    }

    // 奖励统计
    private _addRewardItem(itemId: number, arr: unknown[]): void {
        const num: any = arr[0];// 当前数量
        const bol: boolean = Boolean(arr[1]);// 当前是否需要显示概率

        if ((num === 0 && !bol) || UtilBool.isNullOrUndefined(itemId)) return;// 没有数量,无需加入
        const len = this._rewardArr.length;
        if (!len) { // 没有数据
            const obj: MeltReward = {
                ItemId: itemId,
                ItemNum: num,
                showGL: Boolean(arr[1]),
            };
            this._rewardArr.push(obj);
        } else {
            for (let i = 0; i < len; i++) {
                const item: MeltReward = this._rewardArr[i];
                if (item.ItemId === itemId) {
                    item.ItemNum += num;
                    if (item.ItemNum >= 1) {
                        item.showGL = false;
                    }
                    break;
                } else if (i === len - 1) { // 都没找到这个ID
                    const obj: MeltReward = {
                        ItemId: itemId,
                        ItemNum: num,
                        showGL: Boolean(arr[1]),
                    };
                    this._rewardArr.push(obj);
                }
            }
        }
    }

    // num>0  必得   概率显示false
    private _getNumByAttr(numStr: string) {
        const NumArr = numStr.split(':');
        const nl = Number(NumArr[0]);
        const nr = Number(NumArr[1]);
        if (nl === 0 && nr === 0) {
            return [0, false];
        } else if (nl === 0 && nr === 1) { // 概率
            return [0, true];
        } else {
            return [nl, false];
        }
    }

    /** 获取熔炼装备 */
    public getCurrDataByTab(tabIdx: number): ItemModel[] {
        let _currData: ItemModel[] = [];

        if (tabIdx === TAB_IDX.GRADE_MELT) {
            _currData = BagMgr.I.getItemListBySubTypes(GradeMgr.I.getGradeEquipTypes());
        } else {
            const list: ItemModel[] = BagMgr.I.getItemListByBagType(ItemBagType.EQUIP_ROLE);
            if (!list.length) {
                return _currData;
            }

            for (const item of list) {
                const quality: number = item.cfg.Quality;
                if (tabIdx === TAB_IDX.SIMPLE_MELT && quality <= ItemQuality.ORANGE) {
                    _currData.push(item);// 普通
                } else if (tabIdx === TAB_IDX.RED_MELT && quality === ItemQuality.RED) {
                    _currData.push(item);// 红装
                }
            }
        }

        // 排序
        if (tabIdx === TAB_IDX.SIMPLE_MELT) {
            //
            _currData.sort((b, a) => {
                // if (l.cfg.Quality - r.cfg.Quality === 0) {
                //     return l.cfg.ArmyLevel - r.cfg.ArmyLevel;
                // } else {
                //     return l.cfg.Quality - r.cfg.Quality;
                // }
                // 装备背包中，按装备的基础战力 由小-大排序 （基础战力=基础属性+附加属性）
                if (a.fightValue !== b.fightValue) {
                    return b.fightValue - a.fightValue;
                }

                // 战力相同时，按装备的品质大小 由小-大排序 （品质大小为： 红→橙→紫→蓝→绿）
                if (a.cfg.Quality !== b.cfg.Quality) {
                    return b.cfg.Quality - a.cfg.Quality;
                }

                // 品质相同时，按装备的军衔等级大小 由小-大排序
                if (a.cfg.ArmyLevel === b.cfg.ArmyLevel) {
                    return b.cfg.ArmyLevel - a.cfg.ArmyLevel;
                }

                // 军衔相同时，由军衔星级大小 由小-大排序
                if (a.cfg.Star === b.cfg.Star) {
                    return b.cfg.Star - a.cfg.Star;
                }
                // 星级相同时，按装备部位ID 由小-大排序 1→2→···→···8
                return a.cfg.EquipPart - b.cfg.EquipPart;
            });
        } else {
            _currData.sort((l, r) => {
                if (l.cfg.ArmyLevel - r.cfg.ArmyLevel === 0) { //
                    if (l.cfg.Star - r.cfg.Star === 0) {
                        return l.cfg.EquipPart - r.cfg.EquipPart;
                    } else {
                        return l.cfg.Star - r.cfg.Star;
                    }
                } else {
                    return l.cfg.ArmyLevel - r.cfg.ArmyLevel;
                }
            });
        }
        return _currData;
    }

    public getAutoSmeltData(): string[] {
        const itemModelArr: ItemModel[] = this.getCurrDataByTab(0);
        const arr: string[] = [];
        if (itemModelArr.length) {
            for (const item of itemModelArr) {
                arr.push(item.data.OnlyId);
            }
        }
        return arr;
    }

    /** 根据itemModel 返回战力 */
    public getFightValuelByItemModel(itemModel: ItemModel): number {
        const attrId = itemModel.cfg.AttrId;
        if (attrId) {
            const attrIndexer: ConfigAttributeIndexer = Config.Get(ConfigConst.Cfg_Attribute);
            return attrIndexer.getFightValueById(attrId);
        }
        return 0;
    }

    /** 根据部位获取战力 */
    public getRoleFightValByEquipPart(equipPart: number): number {
        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();
        if (!roleEquipList.size) return 0;
        const item = roleEquipList.get(equipPart);
        if (item) {
            // return roleEquipList.get(equipPart).fightValue;//是否需要改成现在这个战力
            return this.getFightValuelByItemModel(item);
        }
        return 0;
    }

    /**
     * 根据装备品质获取配置物品数量
     * @param quality 品质ID
     * @returns 铜钱 强化石数量
     */
    public getCfgMeltGradeByQuality(quality: number): Cfg_MeltGrade {
        const indexer = Config.Get(Config.Type.Cfg_MeltGrade);
        const cfg: Cfg_MeltGrade = indexer.getValueByKey(quality);
        return cfg;
    }
}
