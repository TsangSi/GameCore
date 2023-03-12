import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../base/config/Config';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import UtilItem from '../../../base/utils/UtilItem';
import { ROLE_EQUIP_PART_NUM, ItemBagType, ItemType } from '../../../com/item/ItemConst';
import ItemModel from '../../../com/item/ItemModel';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import { BagMgr } from '../../bag/BagMgr';
import { RedDotCheckMgr } from '../../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
// import { EquipSys } from './BuildConst';

const { ccclass } = cc._decorator;
@ccclass('BuildModel')
export class BuildModel extends BaseModel {
    /** 是否使用天火 */
    public isThCk: boolean = false;

    public clearAll(): void {
        //
    }
    public clear(): void {
        //
    }
    /**  index 根据表格的索引  从0 ~N 返回 name 当前索引对应的名称  武器 头盔 */
    public getCfgName(index: number, sysId: number): string {
        const cfg: Cfg_EquipBuildNew = this.getCfgByIndex(index);
        return UtilItem.GetEquipPartName(cfg.EquipPart, sysId);
    }

    /** 根据索引获取一条配置 */
    public getCfgByIndex(index: number): Cfg_EquipBuildNew {
        // 如果是角色装备打造，则获取配置需要特殊处理

        const indexer = Config.Get(Config.Type.Cfg_EquipBuildNew);
        const cfg: Cfg_EquipBuildNew = indexer.getValueByIndex(index);
        return cfg;
    }

    /** 判断是否有装备小于当前人物军衔等级 */
    public getDefaultBuildPos(): number {
        const armyLevel: number = RoleMgr.I.getArmyLevel();// 玩家军衔等级
        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();
        const roleUnEquipList = BagMgr.I.getItemMapByBagType(ItemBagType.EQUIP_ROLE);

        /** 部位1-8  如果 某个部位装备（人物身+背包里）的装备军衔等级 都小于人物军衔等级
         * 那么就打造这个部位
         */
        const _equipMap8: Map<number, ItemModel> = new Map<number, ItemModel>();
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            // 角色身上的
            if (roleEquipList && roleEquipList.size) {
                const item = roleEquipList.get(i);
                if (item) {
                    const equipArmyLv: number = item.cfg.ArmyLevel;
                    const equipPart: number = item.cfg.EquipPart;
                    if (equipArmyLv >= armyLevel) { // 当前这个部位有大于人物军衔等级的 放入map
                        const itemModel: ItemModel = _equipMap8.get(equipPart);
                        if (!itemModel || item.fightValue > itemModel.fightValue) { // 已经存过了 比较战力
                            _equipMap8.set(equipPart, item);
                        }
                    }
                }
            }
            // 背包里的
            if (roleUnEquipList && roleUnEquipList.size) {
                roleUnEquipList.forEach((item, index) => {
                    const equipArmyLv: number = item.cfg.ArmyLevel;
                    const equipPart: number = item.cfg.EquipPart;
                    if (equipArmyLv >= armyLevel) { // 当前这个部位有大于人物军衔等级的 放入map
                        const itemModel: ItemModel = _equipMap8.get(equipPart);
                        if (!itemModel || item.fightValue > itemModel.fightValue) { // 已经存过了 比较战力
                            _equipMap8.set(equipPart, item);
                        }
                    }
                });
            }
        }
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            const itemModel: ItemModel = _equipMap8.get(i);
            if (!itemModel) {
                return i;// 某个部位没有 军衔等级大于人物等级的 则打造这个部位
            }
        }

        // 所有部位的军衔等级都大于人物军衔等级 打造战力最低的那个部位
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            const itemModel: ItemModel = _equipMap8.get(i);
            if (!itemModel) {
                return i;// 某个部位没有 军衔等级大于人物等级的 则打造这个部位
            }
        }

        const arr: ItemModel[] = [];
        const iterators = _equipMap8.values();
        for (const value of iterators) {
            arr.push(value);
        }
        if (arr.length) {
            arr.sort((l, r) => l.fightValue - r.fightValue);
            const equipPart = arr[0].cfg.EquipPart;
            return equipPart;
        } else {
            return 1;
        }
    }

    /** 是否材料足够可以打造 */
    public isCanBuild(cfg: Cfg_EquipBuildNew): boolean {
        const arrStr: string[] = [];
        if (cfg.EquipSys === ItemType.EQUIP_ROLE && this.isThCk) {
            if (cfg.NeedItem1) {
                arrStr.push(cfg.NeedItem1);
            }
            if (cfg.NeedItem2) {
                arrStr.push(cfg.NeedItem2);
            }
            if (cfg.PrefBuildStone) {
                arrStr.push(cfg.PrefBuildStone);
            }
            if (cfg.ExcAttrStone) {
                arrStr.push(cfg.ExcAttrStone);
            }
            // arrStr = [cfg.NeedItem1, cfg.NeedItem2, cfg.PrefBuildStone, cfg.ExcAttrStone];
        } else {
            if (cfg.NeedItem1) {
                arrStr.push(cfg.NeedItem1);
            }
            if (cfg.NeedItem2) {
                arrStr.push(cfg.NeedItem2);
            }
            if (cfg.PrefBuildStone) {
                arrStr.push(cfg.PrefBuildStone);
            }
            // arrStr = [cfg.NeedItem1, cfg.NeedItem2, cfg.PrefBuildStone];
        }
        for (let i = 0, len = arrStr.length; i < len; i++) {
            const itemStr: string[] = arrStr[i].split(':');
            const itemId: number = Number(itemStr[0]);
            if (arrStr[i] && itemId > 0) {
                const itemNum: number = Number(itemStr[1]);
                const bagNum: number = BagMgr.I.getItemNum(itemId);
                const bol = bagNum < itemNum;
                if (bol) {
                    return false;
                }
            }
        }
        // 此处说明上面条件都成立了
        // 还需判断金币
        const costItemStr: string[] = cfg.CostMoney.split(':');
        const costItemId: number = Number(costItemStr[0]);
        const costItemNum: number = Number(costItemStr[1]);
        const BagNum: number = RoleMgr.I.getCurrencyById(costItemId);
        return BagNum >= costItemNum;
    }

    /** 获取最大的强化军衔等级 */
    public getMaxArmyLevel(): number {
        const indexerESC = Config.Get(Config.Type.Cfg_EquipStrengthC);
        const cfg: Cfg_EquipStrengthC = indexerESC.getValueByIndex(indexerESC.length - 1);
        return cfg.ArmyLevel;
    }

    /**
     * 添加红点事件发送的监听
     */
    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Equip.Build, this.redBuild, this);
    }

    /** 移除红点事件发送的监听 */
    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Equip.Build, this.redBuild, this);
    }

    public registerRedDotListen(): void {
        const buildRed = RID.Equip.Build;
        const buildListen: IListenInfo = {
            // 1背包变化 2 打造成功 3 银两变化 4 军衔等级变化
            ProtoId: [ProtoId.S2CBagChange_ID, ProtoId.S2CBuildEquip_ID],
            CheckVid: [ViewConst.EquipWin],
            RoleAttr: [RoleAN.N.ItemType_Coin3, RoleAN.N.ArmyLevel, RoleAN.N.Stage], // 人物等级变化
            ProxyRid: [RID.Equip.Build],
        };
        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: buildRed, info: buildListen },
        );
    }

    public redBuild(): boolean {
        /** 判断打造功能是否开启 */
        if (!UtilFunOpen.isOpen(FuncId.EquipBuild)) { // 打造功能未开启 不显示红点
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Equip.Build, false);
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Equip.Build, false);
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Equip.Build, false);
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Equip.Build, false);
            RedDotMgr.I.updateRedDot(RID.Equip.Build, false);
            return false;
        }

        let isShow = false;
        let gradeHorse = false;
        let gradeWeapon = false;
        let gradeWing = false;
        let gradeBeauty = false;
        let gradeAdviser = false;
        let gradePet = false;
        const indexer = Config.Get(Config.Type.Cfg_EquipBuildNew);
        // 根据索引搞到所有的配置
        for (let i = 0, len = indexer.length; i < len; i++) {
            const cfg = this.getCfgByIndex(i);

            // 角色装备 只关心当前军衔等级的
            if (cfg.EquipSys === ItemType.EQUIP_ROLE) {
                const armyLevel = RoleMgr.I.getArmyLevel();
                if (!armyLevel) {
                    continue;// 无军衔 不处理角色装备 正式环境有军衔才开启
                }
                // 军衔非等于当前军衔不处理
                if (cfg.EquipLevel !== armyLevel) {
                    continue;
                }
            }
            const bol = this.isCanBuild(cfg);
            if (bol) {
                isShow = true;
                if (cfg.EquipSys === ItemType.EQUIP_HORSE) {
                    gradeHorse = true;
                }
                if (cfg.EquipSys === ItemType.EQUIP_WEAPON) {
                    gradeWeapon = true;
                }
                if (cfg.EquipSys === ItemType.EQUIP_WING) {
                    gradeWing = true;
                }
                if (cfg.EquipSys === ItemType.EQUIP_BEAUTY) {
                    gradeBeauty = true;
                }
                if (cfg.EquipSys === ItemType.EQUIP_ADVISER) {
                    gradeAdviser = true;
                }
                if (cfg.EquipSys === ItemType.EQUIP_WEAPON) {
                    gradePet = true;
                }
                break;
            }
        }
        // 更新进阶打造的红点
        RedDotMgr.I.updateRedDot(RID.Grade.Horse.Equip.Build, gradeHorse);
        RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Equip.Build, gradeWeapon);
        RedDotMgr.I.updateRedDot(RID.Grade.Wing.Equip.Build, gradeWing);
        RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Equip.Build, gradeBeauty);
        RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Equip.Build, gradeAdviser);
        RedDotMgr.I.updateRedDot(RID.Equip.Build, isShow);
        RedDotMgr.I.updateRedDot(RID.Grade.Pet.Equip.Build, gradePet);
        return isShow;
    }
}
