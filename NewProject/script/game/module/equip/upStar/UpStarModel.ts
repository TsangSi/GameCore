import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../base/config/Config';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import {
    ROLE_EQUIP_PART_NUM, ItemBagType, ItemQuality, ItemType,
} from '../../../com/item/ItemConst';
import ItemModel from '../../../com/item/ItemModel';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { BagMgr } from '../../bag/BagMgr';
import { RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

// 军衔  星级  部位装备(可以获取推荐升星的部位)  合成所需装备
export type UpStar = { equipReborn: number, equipStar: number, items: ItemModel[][], mats: ItemModel[] }
@ccclass
export class UpStarModel extends BaseModel {
    public clearAll(): void {
        //
    }

    public init(): void {
        EventClient.I.on(E.Bag.ItemChange, this.redPoint, this);
        EventClient.I.on(E.Game.Start, this.simpleRed, this);
    }

    private haveRed = false;
    /** 减小计算量 处理红点 */
    private simpleRed() {
        if (!UtilFunOpen.isOpen(FuncId.EquipUpStar)) {
            RedDotMgr.I.updateRedDot(RID.Equip.UpStar, false);
            return;
        }

        const roleInfo = this.GetRoleInfo();
        const reborn = roleInfo.reborn;
        const star = roleInfo.star;
        const childRedMaps = {};
        let isRed = false;
        this.BagEquips();
        // 最小合成星级为2星 则材料装备星级为1星
        for (let i = 2; i <= star; i++) {
            let childRed = false;
            let childNum = 0;
            this.qualityMap.forEach((item, key) => {
                if (item && item.cfg.Star === (i - 1) && item.cfg.ArmyLevel === reborn) {
                    childNum++;
                }
                childRed = childRed || childNum >= 3;
            });
            if (i === 5) {
                childRed = childRed && this.getMaterial(roleInfo.reborn, i);
            }
            childRedMaps[i] = childRed;
            isRed = childRed || isRed;
            if (isRed) {
                RedDotMgr.I.updateRedDot(RID.Equip.UpStar, isRed);
                return;
            }
        }
        RedDotMgr.I.updateRedDot(RID.Equip.UpStar, isRed);
    }

    /**
     * 获取部位推荐
     * @param reborn 军衔
     * @param star 等级
     */
    public getEquip(reborn: number, star: number): UpStar {
        const equips: ItemModel[][] = [];
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            const eqs = this.getEquipPart(reborn, star, i);
            equips.push(eqs);
        }
        const equipMats = this.getUpEquipMaterial(reborn, star);
        return {
            equipReborn: reborn, equipStar: star, items: equips, mats: equipMats,
        };
    }

    /**
     * 获取部位装备
     * @param reborn 军衔
     * @param star 星级
     * @param part 部位
     */
    public getEquipPart(reborn: number, star: number, part: number): ItemModel[] {
        const equips: ItemModel[] = [];
        this.BagEquips();
        this.qualityMap.forEach((item, key) => {
            if (item && item.cfg.Star === star && item.cfg.ArmyLevel === reborn && part === item.cfg.EquipPart) {
                equips.push(item);
            }
        });
        return equips;
    }

    /**
     * 获取升星的材料
     * @param reborn 军衔等级
     * @param star 军衔星级
     */
    private getUpEquipMaterial(reborn: number, star: number): ItemModel[] {
        const equips: ItemModel[] = [];
        this.BagEquips();
        this.qualityMap.forEach((item, key) => {
            if (item && item.cfg.Star === (star - 1) && item.cfg.ArmyLevel === reborn) {
                equips.push(item);
            }
        });
        equips.sort((a, b) => {
            if (a.fightValue !== b.fightValue) {
                return b.fightValue - a.fightValue;
            }
            return a.cfg.EquipPart - b.cfg.EquipPart;
        });
        return equips;
    }

    /** 获取用户可以升星的军衔等阶（没有0星一说） */
    private roleEquipMinStarNum(star: number): number {
        return star <= 2 ? 2 : star;
    }

    public GetRoleInfo(): { reborn: number, star: number } {
        const role = RoleMgr.I;
        const minStar = this.roleEquipMinStarNum(role.getArmyStar());
        return { reborn: role.getArmyLevel() || 1, star: minStar };
        // return { reborn: 1, star: minStar };
    }

    /** 红点信息
     * {1:false, 2 : ture ,3 :false}}
     */
    public redPoint(): { [key: number]: boolean } {
        if (!UtilFunOpen.isOpen(FuncId.EquipUpStar)) {
            RedDotMgr.I.updateRedDot(RID.Equip.UpStar, false);
            return;
        }
        const roleInfo = this.GetRoleInfo();
        const reborn = roleInfo.reborn;
        const star = roleInfo.star;
        const childRedMaps = {};
        let isRed = false;
        this.BagEquips();
        // 最小合成星级为2星 则材料装备星级为1星
        for (let i = 2; i <= star; i++) {
            let childRed = false;
            let childNum = 0;
            this.qualityMap.forEach((item, key) => {
                if (item && item.cfg.Star === (i - 1) && item.cfg.ArmyLevel === reborn) {
                    childNum++;
                }
                childRed = childRed || childNum >= 3;
            });
            if (i === 5) {
                childRed = childRed && this.getMaterial(roleInfo.reborn, i);
            }
            childRedMaps[i] = childRed;
            isRed = childRed || isRed;
        }
        // console.log('红点信息', childRedMaps);
        RedDotMgr.I.updateRedDot(RID.Equip.UpStar, isRed);
        return childRedMaps;
    }

    // 升级五星时是需要 额外材料的
    private getMaterial(reborn: number, star: number): boolean {
        const key = Number(`${reborn}${star}`);
        const config: Cfg_Equip_Star = Config.Get(Config.Type.Cfg_Equip_Star).getValueByKey(key);
        if (config === null) {
            return true;
        } else {
            const itemConfig = config.Item.split(':');
            const matId = itemConfig[0];
            const matNum = itemConfig[1];
            const bagNum = BagMgr.I.getItemNum(Number(matId));
            return bagNum >= Number(matNum);
        }
    }

    /** 升星目标装备的唯一id 101 + 品质(1) + 军衔(2) + 星级(2)+ 部位(2)  总计十位数 */
    public createEquipId(reborn: number, star: number, part: number): string {
        return `1015${UtilNum.FillZero(reborn, 2)}${UtilNum.FillZero(star, 2)}${UtilNum.FillZero(part, 2)}`;
    }

    /** 品质 */
    private qualityMap: Map<string, ItemModel> = new Map();
    /** 背包数据 */
    public BagEquips(): void {
        this.qualityMap = BagMgr.I.getUnEquipQualityMapByBagType(ItemBagType.EQUIP_ROLE, ItemType.EQUIP_ROLE, ItemQuality.RED);
    }

    // 获取用户穿戴的装备
    public GetRoleEquipedData(): void {
        const equiped = BagMgr.I.getItemListByBagType(ItemBagType.EQUIP_ROLE, true);
        equiped.forEach((equip) => {
            if (equip.cfg.Quality === ItemQuality.RED) {
                this.qualityMap.set(equip.data.OnlyId, equip);
            }
        });
    }

    /** 获取每个部位的最高星装备 最小的为当前军衔1星 */
    public getMaxPartEquip(): Map<number, ItemModel> {
        const allMaxRedEquips: Map<number, ItemModel> = new Map();
        const roleInfo = this.GetRoleInfo();
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            let maxEquip: ItemModel = null;
            const equiped = BagMgr.I.getOnEquipByPart(ItemBagType.EQUIP_ROLE, ItemType.EQUIP_ROLE, i);
            if (equiped && equiped.cfg.ArmyLevel === roleInfo.reborn && equiped.cfg.Quality === ItemQuality.RED) {
                maxEquip = equiped;
            }
            const unEupips = BagMgr.I.getUnEquipPartMapByBagType(ItemBagType.EQUIP_ROLE, ItemType.EQUIP_ROLE, i);
            unEupips.forEach((item, key) => {
                if (item && item.cfg.ArmyLevel >= roleInfo.reborn && item.cfg.Quality === ItemQuality.RED) {
                    if (maxEquip) {
                        if (maxEquip.cfg.Star < item.cfg.Star) {
                            maxEquip = item;
                        }
                    } else {
                        maxEquip = item;
                    }
                }
            });
            allMaxRedEquips.set(i, maxEquip);
        }
        return allMaxRedEquips;
    }

    /**
     *  allhave 选择的部位是否显示推荐提示
     * @param equs
     * @returns
     */
    public defaultpartIndex(star: number): { idx: number, allHave: boolean } { // equs : ItemModel[][]
        let index = -1; // 默认选中星级
        const maxEquips = this.getMaxPartEquip();
        maxEquips.forEach((equip, key) => {
            if (!equip) {
                if (index < 0) {
                    // 装备部位是从1开始计算
                    index = key - 1;
                }
            } else if (star > equip.cfg.Star) {
                if (index < 0) {
                    // 装备部位是从1开始计算
                    index = key - 1;
                }
            }
        });

        let isAllHave = false;
        if (index < 0) {
            isAllHave = true;
            index = 0;
        }
        return { idx: index, allHave: isAllHave };
    }
}
