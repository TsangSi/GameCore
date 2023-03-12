/*
 * @Author: zs
 * @Date: 2022-12-30 16:59:13
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\utils\UtilEquip.ts
 * @Description:
 *
 */
import { i18n, Lang } from '../../../i18n/i18n';
import { ItemTipsOptions, ItemType, RoleEquipPart } from '../../com/item/ItemConst';
import ItemModel from '../../com/item/ItemModel';
import { FuncId } from '../../const/FuncConst';
import { RES_ENUM } from '../../const/ResPath';
import { GradeMgr } from '../../module/grade/GradeMgr';
import { GradeModel } from '../../module/grade/GradeModel';
import { AttrModel } from '../attribute/AttrModel';
import { UtilAttr } from './UtilAttr';
import { UtilGame } from './UtilGame';

interface IStrengthInfo {
    /** 强化的战力 */
    fv: number,
    /** 强化等级 */
    lv: number,
    /** 强化的字符串属性 */
    attrStr: string
}
export class UtilEquip {
    public static getEquipIconByPart(equipPart: number): string {
        switch (equipPart) {
            case RoleEquipPart.Weapon:// 武器
                return RES_ENUM.Com_Icon_Com_Icon_Jian;
            case RoleEquipPart.Helmet:// 头盔
                return RES_ENUM.Com_Icon_Com_Icon_Toushi;
            case RoleEquipPart.Sholder:// 护肩
                return RES_ENUM.Com_Icon_Com_Icon_Hujian;
            case RoleEquipPart.Cloth:// 衣服
                return RES_ENUM.Com_Icon_Com_Icon_Yifu;
            case RoleEquipPart.Cuff:// 护腕
                return RES_ENUM.Com_Icon_Com_Icon_Huwan;
            case RoleEquipPart.Belt:// 腰带
                return RES_ENUM.Com_Icon_Com_Icon_Yaodai;
            case RoleEquipPart.Trousers:// 裤子
                return RES_ENUM.Com_Icon_Com_Icon_Kuzi;
            case RoleEquipPart.Shoes:// 鞋子
                return RES_ENUM.Com_Icon_Com_Icon_Xiezi;
            default:
                return '';
        }
    }

    /**
     * 根据装备子类型 获取进阶ID
     * @param subType 装备类型
     * @returns
     */
    public static ItemTypeToFuncId(subType: number): number | 0 {
        return GradeMgr.I.getFuncIdBySubType(subType);
    }

    /**
     * 根据装备子类型和部位获取化金的属性id
     * @param subType 子类型
     * @param part 部位
     * @returns
     */
    public static GetEquipAttrId(subType: number, part: number, onlyId: string): number | 0 {
        if (subType) {
            return GradeMgr.I.getGoldEquipAttrId(subType, part, onlyId);
        }
        return 0;
    }
    /**
     * 根据品质获取简短的装备品质名字：绿装，蓝装，橙装，红装，金装，彩装
     * @param quality 品质
     * @returns
     */
    public static GetEquipQualityShortName(quality: number): string {
        return i18n.tt(Lang[`com_quality_short_${quality}`]) + i18n.tt(Lang.com_text_zhuang);
    }

    /**
     * 获取装备tips的扩展参数
     * @param equipItem 进阶装备
     * @param gradeId 进阶id
     * @returns
     */
    public static GetEquipItemTipsOptions(equipItem: ItemModel, gradeId?: number): ItemTipsOptions

    /**
     * 获取装备tips的扩展参数
     * @param equipItem 进阶装备
     * @param gradeModel 进阶model
     * @returns
     */
    public static GetEquipItemTipsOptions(equipItem: ItemModel, gradeModel?: GradeModel): ItemTipsOptions

    public static GetEquipItemTipsOptions(equipItem: ItemModel, gradeModelORgradeId?: GradeModel | number): ItemTipsOptions {
        const opts: ItemTipsOptions = cc.js.createMap(true);
        const part = equipItem.cfg.EquipPart;
        const onlyId = equipItem.data.OnlyId;
        const subType = equipItem.cfg.SubType;
        const attrId = equipItem.cfg.AttrId;
        let gradeModel: GradeModel;
        if (!gradeModelORgradeId) {
            const gradeId = this.ItemTypeToFuncId(subType);
            gradeModel = GradeMgr.I.getGradeModel(gradeId);
        } else if (typeof gradeModelORgradeId === 'number') {
            gradeModel = GradeMgr.I.getGradeModel(gradeModelORgradeId);
        } else {
            gradeModel = gradeModelORgradeId;
        }
        // 强化
        const strength = this.GetEquipItemStrength(equipItem, gradeModel);
        if (strength) {
            opts.strengthFv = strength.fv;
            opts.strengthLv = strength.lv;
            opts.strengthAttrStr = strength.attrStr;
        }
        if (equipItem && equipItem.cfg.Type === ItemType.EQUIP) {
            // 化金
            const goldAttrId = GradeMgr.I.getGoldEquipAttrId(subType, part, onlyId);
            if (goldAttrId) {
                const goldAttr = AttrModel.MakeAttrInfo(goldAttrId);
                const [goldFv, goldAttrStr] = UtilAttr.GetTipsStrengthFvAttrStr(attrId, goldAttr);
                opts.goldLv = GradeMgr.I.getGoldEquipLevel(subType, part, onlyId);
                opts.goldFv = goldFv;
                opts.goldAttrStr = goldAttrStr;
            }
        }

        return opts;
    }

    /**
     * 获取装备强化战力和字符串属性
     * @param equipItem 进阶装备
     * @param gradeId 进阶id
     * @returns
     */
    public static GetEquipItemStrength(equipItem: ItemModel, gradeId?: number): IStrengthInfo;
    /**
      * 获取装备强化战力和字符串属性
      * @param equipItem 进阶装备
      * @param gradeModel 进阶model
      * @returns
      */
    public static GetEquipItemStrength(equipItem: ItemModel, gradeModel?: GradeModel): IStrengthInfo;
    public static GetEquipItemStrength(equipItem: ItemModel, gradeModelORgradeId?: GradeModel | number): IStrengthInfo {
        const part = equipItem.cfg.EquipPart;
        const attrId = equipItem.cfg.AttrId;
        const subType = equipItem.cfg.SubType;
        let gradeModel: GradeModel;
        if (!gradeModelORgradeId) {
            const gradeId = this.ItemTypeToFuncId(subType);
            gradeModel = GradeMgr.I.getGradeModel(gradeId);
        } else if (typeof gradeModelORgradeId === 'number') {
            gradeModel = GradeMgr.I.getGradeModel(gradeModelORgradeId);
        } else {
            gradeModel = gradeModelORgradeId;
        }
        // 强化装备部位等级
        const equipPosLvs = gradeModel?.data?.GradeEquip?.PosLv || [];
        if (equipPosLvs.length) {
            const intAttr: IntAttr = UtilGame.GetIntAttrByKey(equipPosLvs, part);
            const strengthLv = intAttr ? intAttr.V : 0;
            if (strengthLv > 0) {
                const attrInfo = GradeMgr.I.getStrengthAttrInfo(part, strengthLv);
                const [strengthFv, strengthAttrStr] = UtilAttr.GetTipsStrengthFvAttrStr(attrId, attrInfo);
                return { fv: strengthFv, lv: strengthLv, attrStr: strengthAttrStr };
            }
        }
        return null;
    }
}
