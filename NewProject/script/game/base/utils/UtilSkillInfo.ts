/*
 * @Author: hrd
 * @Date: 2022-11-10 15:54:00
 * @Description: 技能描述信息
 *
 */

import { UtilString } from '../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../config/Config';
import { UtilAttr } from './UtilAttr';
import { IPDStruct } from './UtilConst';

enum SkillDescType {
    /** 默认读表 */
    Normall = 0,
    /** 属性加成 */
    AttrAdd = 1,
}

/** 技能参数计算公式 */
enum ParamFormulaType {
    /** 等级递增计算公式 */
    LevelAdd = 1,
}

interface ParamInfo {
    lv?: number;
}

export class UtilSkillInfo {
    /** 支持最大技能参数数量 Param1、Param2、Param3、... */
    public static MaxParamCount: number = 6;

    public static GetCfg(skillId: number, lv: number = 1): Cfg_SkillDesc {
        const configSkillDesc = Config.Get(Config.Type.Cfg_SkillDesc);
        const cfg: Cfg_SkillDesc = configSkillDesc.getIntervalData(skillId, lv);
        if (!cfg) {
            const indexs: number[] = configSkillDesc.getValueByKey(skillId);
            if (!indexs) return null;
            const index = indexs[indexs.length - 1];
            return configSkillDesc.getValueByIndex(index);
        }
        return cfg;
    }

    public static getMaxSkillLevel(key: number): number {
        const configSkillDesc = Config.Get(Config.Type.Cfg_SkillDesc);
        const v: number[] = configSkillDesc.getValueByKey(key);
        let max = 0;
        for (let i = 0; i < v.length; i++) {
            const cfg: Cfg_SkillDesc = configSkillDesc.getValueByIndex(v[i]);
            if (!max) {
                max = cfg.SkillMaxLevel;
            } else if (max <= cfg.SkillMaxLevel) {
                max = cfg.SkillMaxLevel;
            }
        }

        return max;
    }

    /**
     * 获取技能的描述
     * @param skillId 技能id
     * @param lv 技能等级 不能为0
     * @returns
     */
    public static GetSkillDesc(cfgDesc: Cfg_SkillDesc, lv?: number, addParams?: number[]): string
    public static GetSkillDesc(id: number, lv?: number, addParams?: number[]): string
    public static GetSkillDesc(...args: unknown[]): string {
        let cfg: Cfg_SkillDesc = null;
        const skillLv: number = +args[1] || 1;
        if (typeof args[0] === 'number') {
            const skillId = +args[0];
            cfg = UtilSkillInfo.GetCfg(skillId, skillLv);
        } else {
            cfg = args[0] as Cfg_SkillDesc;
        }

        if (!cfg) {
            return i18n.tt(Lang.com_level_max);
        }

        let desc: string = cfg.SkillDesc;
        const type: number = cfg.DescType;
        if (type === SkillDescType.Normall) {
            desc = this.getNormallDesc(cfg, skillLv);
        } else if (type === SkillDescType.AttrAdd) {
            desc = this.getAttrAddDesc(cfg, skillLv);
        }
        return desc;
    }

    /**
     * 参数解析
     * @param paramStr
     * @param info
     * @returns
     */
    private static doParamStrParse(paramStr: string, info: ParamInfo): number {
        let p = 0;
        const strArr = paramStr.split('|');
        for (let i = 0; i < strArr.length; i++) {
            const element = strArr[i];
            const a = element.split(':');
            const formulaType = +a[0];
            if (formulaType === ParamFormulaType.LevelAdd) {
                p = this.ParamStrParseByLv(a, info.lv);
                if (p) {
                    break;
                }
            }
        }
        return p;
    }
    /**
     * 技能参数解析 等级递增计算公式
     * @param paramStr // 1:1:600:0|2:3:900:0    开始等级:结束等级:初始值:递增值 | 开始等级:结束等级:初始值:递增值
     * @param lv 技能等级                        1:10:200:5 | 11:20:300:6
     * @returns
     */
    private static ParamStrParseByLv(paramArr: any[], lv: number): number {
        let p = 0;
        const a = paramArr;
        if (a[1] && a[2] && a[3] && a[4] && lv >= parseInt(a[1]) && lv <= parseInt(a[2])) {
            const add = parseInt(a[4]);
            if (add === 0) {
                // 固定参数
                p = parseInt(a[3]);
            } else if (add > 0) {
                // 根据等级递增
                p = parseInt(a[3]) + (lv - parseInt(a[1])) * add;
            }
        }

        return p;
    }

    /**
     * 配置表默认描述
     * @param cfg
     * @param skillLv
     * @returns
     */
    private static getNormallDesc(cfg: Cfg_SkillDesc, skillLv: number): string {
        let desc: string = cfg.SkillDesc;
        for (let i = 1; i <= UtilSkillInfo.MaxParamCount; i++) {
            const key = `Param${i}`;
            if (!Object.prototype.hasOwnProperty.call(cfg, key)) {
                break;
            }
            const param = cfg[key];
            if (!param) {
                continue;
            }
            const ss = `{${i}}`; // {1}或{2} ...
            const p = UtilSkillInfo.doParamStrParse(param, { lv: skillLv });
            desc = UtilString.replaceAll(desc, ss, p.toString());
        }

        return desc;
    }

    /**
     * 属性成长描述
     * @param cfg
     * @param skillLv
     * @returns
     */
    private static getAttrAddDesc(cfg: Cfg_SkillDesc, skillLv: number): string {
        const desc: string = i18n.tt(Lang.com_fighting);
        let str = '';
        const txt = `{0}{1}<color=#12a710>{2}{3}</color>`;
        const pdArr: IPDStruct[] = this.getAttrPDArr(cfg, skillLv);

        for (let i = 0, len = pdArr.length; i < len; i++) {
            const p = pdArr[i].p;
            const d = pdArr[i].d;
            str = `${str}，${UtilString.FormatArgs(txt, d.name, d.make, p.toString(), d.perStr)}`;
        }
        return `${desc + str}。`;
    }

    public static getAttrPDArr(cfg: Cfg_SkillDesc, skillLv: number): IPDStruct[] {
        const arrPD: IPDStruct[] = [];
        for (let i = 1; i <= UtilSkillInfo.MaxParamCount; i++) {
            const key = `Param${i}`;
            if (!Object.prototype.hasOwnProperty.call(cfg, key)) {
                break;
            }
            const param = cfg[key];
            if (param) {
                const p = UtilSkillInfo.doParamStrParse(param, { lv: skillLv });
                const d = UtilSkillInfo.ParamStrParseAttr(param, 5, skillLv);
                arrPD.push({ p, d });
            }
        }
        return arrPD;
    }

    // 公式类型:开始等级:结束等级:初始值:递增值:属性ID:加或减类型:是否要需要百分号
    /**
     * 技能参数解析属性展示
     * @param paramStr
     * @param idx 从第几个开始取值
     * @returns
     */
    private static ParamStrParseAttr(paramStr: string, idx: number, lv: number): { name: string, make: string, perStr: string } {
        const d: { name: string, make: string, perStr: string } = {
            name: '',
            make: '',
            perStr: '',
        };
        const strArr = paramStr.split('|');
        strArr.forEach((element) => {
            const a = element.split(':');
            if (a[1] && a[2] && a[3] && a[4] && lv >= parseInt(a[1]) && lv <= parseInt(a[2])) {
                const attrId = +a[idx]; // 属性id
                const addType = +a[idx + 1]; // 加或减类型
                const percent = +a[idx + 2]; // 是否要需要百分号
                let makeStr: string = i18n.tt(Lang.com_add);
                if (addType === 2) {
                    makeStr = i18n.tt(Lang.com_sub);
                }
                let percentStr = '%';
                if (!percent) {
                    percentStr = '';
                }
                d.name = UtilAttr.GetAttrName(attrId);
                d.make = makeStr;
                d.perStr = percentStr;
            }
        });
        return d;
    }

    /** 技能名 */
    public static GetSkillName(skillId: number, lv: number = 1): string {
        const cfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(skillId, lv);
        if (!cfg) {
            return '';
        }
        return cfg.SkillName;
    }

    /** 获取技能icon */
    public static GetSkillIconID(skillId: number, lv: number = 1): number {
        const cfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(skillId, lv);
        if (!cfg) {
            return null;
        }
        return cfg.SkillIconID;
    }
    /**
     * 获取技能类型
     * @param skillId 技能id
     * @param lv 等级
     * @returns type 1主动技能 2被动技能
     */
    public static GetSkillType(skillId: number, lv: number = 1): number {
        const cfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(skillId, lv);
        if (!cfg) {
            return null;
        }
        return cfg.Effect_Type;
    }

    /** 获取品质 */
    public static GetQuality(skillId: number, lv: number = 1): number {
        const cfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(skillId, lv);
        if (!cfg) {
            return null;
        }
        return cfg.Quality;
    }

    /** 获取品质框 */
    public static GetFlashQuality(skillId: number, lv: number = 1): number {
        const cfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(skillId, lv);
        if (!cfg) {
            return null;
        }
        return cfg.Flash_Quality;
    }
}
