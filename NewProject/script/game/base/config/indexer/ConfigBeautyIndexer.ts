/*
 * @Author: zs
 * @Date: 2022-10-28 14:48:22
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\config\indexer\ConfigBeautyIndexer.ts
 * @Description: 红颜相关配置集合
 *
 */
import { UtilArray } from '../../../../app/base/utils/UtilArray';
import { Config } from '../Config';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;
@ccclass('ConfigBeautyIndexer')
export class ConfigBeautyIndexer extends ConfigIndexer {
    private static _i: ConfigBeautyIndexer;
    public static get I(): ConfigBeautyIndexer {
        if (!this._i) {
            this._i = new ConfigBeautyIndexer(
                ConfigConst.Cfg_Beauty,
                ConfigConst.Cfg_BeautyStar,
                ConfigConst.Cfg_BeautyLevel,
            );
        }
        return this._i;
    }

    /** 最高星级的红颜星级 */
    private maxStar: number = 0;
    /** 根据红颜id存储的各个的最高星级 */
    private maxStarById: { [id: number]: number } = cc.js.createMap(true);
    /** 红颜最高等级 */
    private maxLevel: number = 0;

    // private config
    protected walks(tableName: string, data: any, index: number): void {
        if (tableName === ConfigConst.Cfg_BeautyStar.name) {
            this.walkStar(data, index);
            // 如果有额外处理就对应的表走对应的额外处理接口
        } else if (tableName === ConfigConst.Cfg_BeautyLevel.name) {
            this.walkLevel(data);
            // } else if (tableName === ConfigConst.Cfg_Config_PetAM.name) {
            //     this.walkPetAM(data, index);
            // } else if (tableName === ConfigConst.Cfg_PetA.name) {
            //     this.walkPetA(data, index)
        }
    }

    private skillLvsById: { [id: number]: { [skillFlag: number]: number[] } } = cc.js.createMap(true);
    private indexsByIdSkillLvIndex: { [id: number]: { [skillFlag: number]: number[] } } = cc.js.createMap(true);

    /** 红颜星级表 */
    private walkStar(data: Cfg_BeautyStar, index: number) {
        this.maxStarById[data.BeautyId] = this.maxStarById[data.BeautyId] ? Math.max(this.maxStarById[data.BeautyId], data.Star) : data.Star;
        this.maxStar = this.maxStarById[data.BeautyId] ? Math.max(this.maxStar, this.maxStarById[data.BeautyId]) : this.maxStarById[data.BeautyId];
        const skillLvs = this.skillLvsById[data.BeautyId] = this.skillLvsById[data.BeautyId] || [];
        const indexsByLvIndex = this.indexsByIdSkillLvIndex[data.BeautyId] = this.indexsByIdSkillLvIndex[data.BeautyId] || [];
        /** 技能标记，主动技能固定0 */
        let skillFlag = 0;
        if (data.SkillId) {
            const skill = data.SkillId.split(':');
            // eslint-disable-next-line max-len
            if (!skillLvs[skillFlag]) {
                skillLvs[skillFlag] = [];
                indexsByLvIndex[skillFlag] = [];
            }
            const lv = +skill[1];
            if (skillLvs[skillFlag].indexOf(lv) < 0) {
                skillLvs[skillFlag].push(lv);
                indexsByLvIndex[skillFlag].push(index);
            }
        }
        // 被动技能从1开始
        skillFlag = 1;
        if (data.PassiveSkills) {
            const passs = data.PassiveSkills.split('|');
            let lv: number = 0;
            passs.forEach((pass, idx) => {
                lv = +pass.split(':')[1];
                skillFlag += idx;
                if (!skillLvs[skillFlag]) {
                    skillLvs[skillFlag] = [];
                    indexsByLvIndex[skillFlag] = [];
                }
                if (skillLvs[skillFlag].indexOf(lv) < 0) {
                    skillLvs[skillFlag].push(lv);
                    indexsByLvIndex[skillFlag].push(index);
                }
            });
        }
    }

    /**
     * 获取下一等级技能所对应的索引
     * @param id 红颜id
     * @param skillFlag 技能标记：0：主动技能，1：被动技能1，2：被动技能2，以此类推
     * @param lv 技能等级
     * @returns
     */
    public getSkillIndexByLv(id: number, skillFlag: number, lv: number): number {
        this._walks();
        const skillLvs = this.skillLvsById[id];
        if (skillLvs && skillLvs[skillFlag]) {
            const index = UtilArray.LowerBound(skillLvs[skillFlag], lv);
            if (index >= 0) {
                return this.indexsByIdSkillLvIndex[id][skillFlag][index];
            }
        }
        return -1;
    }

    /**
     * 获取下一等级技能信息
     * @param id 红颜id
     * @param skillFlag 技能标记，0：主动技能，1：被动技能1，2：被动技能2，以此类推
     * @param lv 技能等级
     * @returns
     */
    public getSkillByLvAndFlag(id: number, skillFlag: number, lv: number): { skillId: number, level: number, Star: number } {
        const index = this.getSkillIndexByLv(id, skillFlag, lv);
        const skillInfo: { skillId: number, level: number, Star: number } = cc.js.createMap(true);
        if (index >= 0) {
            let cfg: Cfg_BeautyStar;
            let skill: string[];
            switch (skillFlag) {
                case 0:
                    cfg = this._getValueByIndex(Config.Type.Cfg_BeautyStar.name, index);
                    skill = cfg.SkillId.split(':');
                    skillInfo.skillId = +skill[0];
                    skillInfo.level = +skill[1];
                    skillInfo.Star = cfg.Star;
                    break;
                default:
                    cfg = this._getValueByIndex(Config.Type.Cfg_BeautyStar.name, index);
                    skill = cfg.PassiveSkills.split('|')[skillFlag - 1]?.split(':');
                    skillInfo.skillId = +skill[0];
                    skillInfo.level = +skill[1];
                    skillInfo.Star = cfg.Star;
                    break;
            }
        }
        return skillInfo;
    }

    private walkLevel(data: Cfg_BeautyLevel) {
        this.maxLevel = Math.max(data.Level, this.maxLevel);
    }

    /**
     * 通过等级从升级表获取值
     * @param level 等级
     * @param key 字段名 | object（包含多个字段名）
     * @returns
     */
    public getValueByKeyFromLevel<T>(level: number, key: string): T;
    public getValueByKeyFromLevel<T extends object>(level: number, key: object): T
    public getValueByKeyFromLevel<T>(level: number, key: T): T {
        return this._getValueByKey(ConfigConst.Cfg_BeautyLevel.name, level, key as any);
    }

    /**
     * 通过id，star从星级表获取值
     * @param id 红颜id
     * @param star 星级
     * @param key 字段名 | object（包含多个字段名）
     * @returns
     */
    public getValueByKeyFromStar<T>(id: number, star: number, key: string): T
    public getValueByKeyFromStar<T extends object>(id: number, star: number, key: T): T;
    public getValueByKeyFromStar<T extends object>(id: number, star: number, key: T): T {
        return this._getValueByKey(ConfigConst.Cfg_BeautyStar.name, id, star, key as any);
    }

    /**
     * 获取某个红颜的最高等级，没有的话会返回最高星级的红颜星级
     * @param id 红颜id
     * @returns
     */
    public getMaxStar(id: number): number {
        this._walks();
        return this.maxStarById[id] || this.maxStar;
    }

    /** 获取红颜最高等级 */
    public getMaxLevel(): number {
        this._walks();
        return this.maxLevel;
    }
}
