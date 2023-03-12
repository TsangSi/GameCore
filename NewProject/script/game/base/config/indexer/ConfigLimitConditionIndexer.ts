/*
 * @Author: myl
 * @Date: 2022-09-06 10:12:33
 * @Description: 限制条件表
 */
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { i18n, Lang } from '../../../../i18n/i18n';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../../module/role/RoleMgr';
import { SealAmuletType } from '../../../module/roleOfficial/RoleSealAmulet/SealAmuletConst';
import UtilFunOpen from '../../utils/UtilFunOpen';
import { Config } from '../Config';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';
import { ConfigStageIndexer } from './ConfigStageIndexer';

const { ccclass, property } = cc._decorator;

/** 条件数量判断
 * 使用说明  :
 * 当为num1时 此为单条件判断  param1和param2为判断条件的值
 * 当为num2时 此为双条件判断  param1和param2为新的 判断条件id（conditionId）
 */
enum ConditionNumEnum {
    Num1 = 1,
    Num2 = 2
}

/** 条件类型判断
 * 使用说明 ： 根据该字段 ,从不同业务获取相应的业务值来判断
 *
 */
export enum ConditionTypeEnum {
    /** 等级 */
    Func_1 = 1,
    /** 战力 */
    Func_2 = 2,
    /** 帮会等级 */
    Func_3 = 3,
    /** 角色转生等级(军衔) */
    Func_4 = 4,
    /** 角色境界(官职) */
    Func_5 = 5,
    /** 升级、升阶 */
    Func_6 = 6,
    /** 完成首冲 */
    Func_7 = 7,
    /** 前置系统 */
    Func_8 = 8,
    /** 开服天数 */
    Func_9 = 9,
    /** vip等级 */
    Func_10 = 10,
    /** 材料副本通关数 */
    Func_11 = 11,
    /** 主线关卡通关数 */
    Func_12 = 12,
    /** 人物属性 */
    Func_13 = 13,
    /** 竞技场排名 */
    Func_14 = 14,
    /** 积分限制 */
    Func_15 = 15,
    /** 道具数量 */
    Func_16 = 16,
    /** 人物基础属性 */
    Func_17 = 17,
    /** 官职等级 */
    Func_18 = 18,
    /** 官印等级 */
    Func_19 = 19,
    /** 官印星级 */
    Func_20 = 20,
    /** 虎符等级 */
    Func_21 = 21,
    /** 虎符星级 */
    Func_22 = 22,
}

/** 数值判断的条件 逻辑 */
enum ConditionCategoryEnum {
    /** 或 */
    C1 = 1,
    /** 与 */
    C2 = 2,
    /** 非 */
    C3 = 3,
    /** 等于 */
    C4 = 4,
    /** 小于 */
    C5 = 5,
    /** 大于 */
    C6 = 6,
    /** 小于等于 */
    C7 = 7,
    /** 大于等于 */
    C8 = 8,

}

@ccclass('ConfigLimitConditionIndexer')
export class ConfigLimitConditionIndexer extends ConfigIndexer {
    private static _i: ConfigLimitConditionIndexer = null;
    public static get I(): ConfigLimitConditionIndexer {
        if (!this._i) {
            this._i = new ConfigLimitConditionIndexer(ConfigConst.Cfg_LimitCondition);
            this._i._walks();
        }
        return this._i;
    }

    /** 根据条件id 获取条件是否开放 */
    public getCondition(cId: number): { state: boolean, info: Cfg_LimitCondition, desc: string } {
        this._walks();
        let state = false;

        const indexer = Config.Get(ConfigConst.Cfg_LCDesc);

        const info: Cfg_LimitCondition = this.getValueByKey(cId);
        const nameCfg: Cfg_LCDesc = indexer.getValueByKey(info.ConditionFunc);
        let desc = '';

        // 1, 单条件、复合条件
        if (info.Sort === ConditionNumEnum.Num1) {
            // 单条件
            switch (info.ConditionFunc) {
                case ConditionTypeEnum.Func_1:
                    state = this.Func_1(info);
                    desc = nameCfg.Desc.replace('{0}', `${info.Param1}${i18n.lv}`);
                    break;
                case ConditionTypeEnum.Func_2:
                    state = this.Func_2(info);
                    desc = nameCfg.Desc.replace('{0}', `${UtilNum.ConvertFightValue(info.Param1)}`);
                    break;
                case ConditionTypeEnum.Func_3:
                    desc = nameCfg.Desc.replace('{0}', `${info.Param1}${i18n.lv}`);
                    state = this.Func_3(info);
                    break;
                case ConditionTypeEnum.Func_4:
                    desc = nameCfg.Desc.replace('{0}', `${ModelMgr.I.ArmyLevelModel.getArmyName(info.Param1, info.Param2)}`);
                    state = this.Func_4(info);
                    break;
                case ConditionTypeEnum.Func_5: {
                    const inf = ModelMgr.I.RoleOfficeModel.getOfficialInfo(info.Param1);

                    desc = nameCfg.Desc.replace('{0}', `${inf.name1}•${inf.name2}`);
                    state = this.Func_5(info);
                }
                    break;
                case ConditionTypeEnum.Func_6:
                    state = this.Func_6(info);
                    break;
                case ConditionTypeEnum.Func_7:
                    state = this.Func_7(info);
                    break;
                case ConditionTypeEnum.Func_8:
                    state = this.Func_8(info);
                    break;
                case ConditionTypeEnum.Func_9:
                    state = this.Func_9(info);
                    desc = nameCfg.Desc.replace('{0}', `${info.Param1}${i18n.day}`);
                    break;
                case ConditionTypeEnum.Func_10:
                    desc = nameCfg.Desc.replace('{0}', `${ModelMgr.I.VipModel.vipName(info.Param1)}`);
                    state = this.Func_10(info);
                    break;
                case ConditionTypeEnum.Func_11:
                    desc = nameCfg.Desc.replace('{0}', `${info.Param1}`);
                    state = this.Func_11(info);
                    break;
                case ConditionTypeEnum.Func_12: {
                    const cfg_level: ConfigStageIndexer = Config.Get<ConfigStageIndexer>(Config.Type.Cfg_Stage);
                    const obj = cfg_level.getChapterInfo(info.Param1);
                    desc = nameCfg.Desc.replace('{0}', `${obj.chapter}-${obj.level}`);
                    state = this.Func_12(info);
                }
                    break;
                case ConditionTypeEnum.Func_13:
                    state = this.Func_13(info);
                    break;
                case ConditionTypeEnum.Func_14:
                    desc = nameCfg.Desc.replace('{0}', `${info.Param1}`);
                    state = this.Func_14(info);
                    break;
                case ConditionTypeEnum.Func_15:
                    state = this.Func_15(info);
                    break;
                case ConditionTypeEnum.Func_16:
                    state = this.Func_16(info);
                    break;
                case ConditionTypeEnum.Func_17:
                    state = this.Func_17(info);
                    break;
                case ConditionTypeEnum.Func_18:
                    desc = nameCfg.Desc.replace('{0}', `${info.Param1}${i18n.lv}`);
                    state = this.Func_18(info);
                    break;
                case ConditionTypeEnum.Func_19:
                    desc = nameCfg.Desc.replace('{0}', `${info.Param1}${i18n.lv}`);
                    state = this.Func_19(info);
                    break;
                case ConditionTypeEnum.Func_20:
                    desc = nameCfg.Desc.replace('{0}', `${info.Param1}${i18n.star}`);
                    state = this.Func_20(info);
                    break;
                case ConditionTypeEnum.Func_21:
                    desc = nameCfg.Desc.replace('{0}', `${info.Param1}${i18n.star}`);
                    state = this.Func_21(info);
                    break;
                case ConditionTypeEnum.Func_22:
                    desc = nameCfg.Desc.replace('{0}', `${info.Param1}${i18n.star}`);
                    state = this.Func_22(info);
                    break;
                default:
                    break;
            }
        } else {
            // 复合条件
            const info1: Cfg_LimitCondition = this.getValueByIndex(info.Param1);
            const info2: Cfg_LimitCondition = this.getValueByIndex(info.Param1);
            const v1 = this.getCondition(info1.ConditionId).state;
            const v2 = this.getCondition(info2.ConditionId).state;
            if (info.Relation === ConditionCategoryEnum.C1) {
                state = v1 || v2;
            } else {
                state = v1 && v2;
            }
        }

        return { state, info, desc };
    }

    private Func_1(conf: Cfg_LimitCondition): boolean {
        const v2 = conf.Param1;
        const v1 = RoleMgr.I.d.Level;
        return this.numValue(v1, v2, conf.Relation);
    }

    private Func_2(conf: Cfg_LimitCondition): boolean {
        const v2 = conf.Param1;
        const v1 = RoleMgr.I.d.FightValue;
        return this.numValue(v1, v2, conf.Relation);
    }
    private Func_3(conf: Cfg_LimitCondition): boolean {
        return false;
    }
    /** 角色军衔等级 */
    private Func_4(conf: Cfg_LimitCondition): boolean {
        const armyLevel: number = RoleMgr.I.getArmyLevel();// 玩家军衔等级
        const armyStar: number = RoleMgr.I.getArmyStar();// 玩家军衔星级
        return armyLevel > conf.Param1 || (armyLevel === conf.Param1 && armyStar >= conf.Param2);
    }
    private Func_5(conf: Cfg_LimitCondition): boolean {
        return true;
    }
    private Func_6(conf: Cfg_LimitCondition): boolean {
        return true;
    }
    /** 首次充值 */
    private Func_7(conf: Cfg_LimitCondition): boolean {
        return false;
    }
    /** 前置条件 */
    private Func_8(conf: Cfg_LimitCondition): boolean {
        return false;
    }
    /** 开服天数 */
    private Func_9(conf: Cfg_LimitCondition): boolean {
        const v1 = UtilFunOpen.serverDays;
        const v2 = conf.Param1;
        return this.numValue(v1, v2, conf.Relation);
    }
    private Func_10(conf: Cfg_LimitCondition): boolean {
        const v1 = RoleMgr.I.d.VipLevel;
        const v2 = conf.Param1;
        return this.numValue(v1, v2, conf.Relation);
    }

    /** 材料副本通关次数 */
    private Func_11(conf: Cfg_LimitCondition): boolean {
        return false;
    }
    private Func_12(conf: Cfg_LimitCondition): boolean {
        return false;
    }
    private Func_13(conf: Cfg_LimitCondition): boolean {
        return false;
    }
    /** 竞技场排名 */
    private Func_14(conf: Cfg_LimitCondition): boolean {
        const v1 = RoleMgr.I.d.ArenaRank;
        const v2 = conf.Param1;
        return this.numValue(v1, v2, conf.Relation);
    }
    private Func_15(conf: Cfg_LimitCondition): boolean {
        return false;
    }
    private Func_16(conf: Cfg_LimitCondition): boolean {
        return false;
    }
    private Func_17(conf: Cfg_LimitCondition): boolean {
        return false;
    }
    /** 官职等级 */
    private Func_18(conf: Cfg_LimitCondition): boolean {
        const v1 = RoleMgr.I.d.OfficeLevel;
        const v2 = conf.Param1;
        return this.numValue(v1, v2, conf.Relation);
    }

    /** 官印等级 */
    private Func_19(conf: Cfg_LimitCondition): boolean {
        const v1 = ModelMgr.I.SealAmuletModel.getConfig(SealAmuletType.Seal).Level;
        const v2 = conf.Param1;
        return this.numValue(v1, v2, conf.Relation);
    }
    /** 官印星级 */
    private Func_20(conf: Cfg_LimitCondition): boolean {
        const v1 = ModelMgr.I.SealAmuletModel.getConfig(SealAmuletType.Seal).Star;
        const v2 = conf.Param1;
        return this.numValue(v1, v2, conf.Relation);
    }
    /** 虎符等级 */
    private Func_21(conf: Cfg_LimitCondition): boolean {
        const v1 = ModelMgr.I.SealAmuletModel.getConfig(SealAmuletType.Amulet).Level;
        const v2 = conf.Param1;
        return this.numValue(v1, v2, conf.Relation);
    }
    /** 虎符星级 */
    private Func_22(conf: Cfg_LimitCondition): boolean {
        const v1 = ModelMgr.I.SealAmuletModel.getConfig(SealAmuletType.Amulet).Star;
        const v2 = conf.Param1;
        return this.numValue(v1, v2, conf.Relation);
    }

    /**
     * 根据逻辑计算是否解锁
     * @param v1 计算值
     * @param v2 参考值
     * @param type 运算逻辑
     * @returns
     */
    private numValue(v1: number, v2: number, type: ConditionCategoryEnum): boolean {
        let result = false;
        switch (type) {
            case ConditionCategoryEnum.C1:
                // result = v1 || v2;
                break;
            case ConditionCategoryEnum.C2:
                // result = v1 && v2;
                break;
            case ConditionCategoryEnum.C3:
                // result = !v2;
                break;
            case ConditionCategoryEnum.C4:
                result = v1 === v2;
                break;
            case ConditionCategoryEnum.C5:
                result = v1 < v2;
                break;
            case ConditionCategoryEnum.C6:
                result = v1 > v2;
                break;
            case ConditionCategoryEnum.C7:
                result = v1 <= v2;
                break;
            case ConditionCategoryEnum.C8:
                result = v1 >= v2;
                break;
            default:
                break;
        }
        return result;
    }
}
