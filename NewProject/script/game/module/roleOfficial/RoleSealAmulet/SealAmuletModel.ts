/*
 * @Author: myl
 * @Date: 2022-10-11 22:07:10
 * @Description: 虎符 官印 公用
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../../i18n/i18n';
import { EAttrShowType } from '../../../base/attribute/AttrConst';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { ConfigLimitConditionIndexer } from '../../../base/config/indexer/ConfigLimitConditionIndexer';
import { ConfigSAGradeIndexer } from '../../../base/config/indexer/ConfigSAGradeIndexer';
import { ConfigSAQualityIndexer } from '../../../base/config/indexer/ConfigSAQualityIndexer';
import { ConfigSAStarIndexer } from '../../../base/config/indexer/ConfigSAStarIndexer';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import BuffModel from '../../buff/BuffModel';
import { RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { OfficiaSkillIcon } from '../RoleOfficialConst';
import { SealAmuletType, SealAmuletContentType } from './SealAmuletConst';

const { ccclass, property } = cc._decorator;

@ccclass('SealAmuletModel')
export class SealAmuletModel extends BaseModel {
    public clearAll(): void {
        //
    }

    private _sealConfig: OfficeSign = {
        Type: 1,
        Level: 1,
        LevelExp: 0,
        Star: 1,
        StarPos: 1,
        StarExp: 0,
        RefineLv: 1,
        RefineValue: 1,
    };
    private _amuletConfig: OfficeSign = {
        Type: 2,
        Level: 1,
        LevelExp: 0,
        Star: 1,
        StarPos: 1,
        StarExp: 0,
        RefineLv: 1,
        RefineValue: 1,
    };

    // 赋值当前的所有数据
    public setSealAmulet(data: OfficeSign[]): void {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.Type === 1) {
                this._sealConfig = item;
            } else if (item.Type === 2) {
                this._amuletConfig = item;
            }
        }
    }

    public updateGrade(data: S2COfficeSignUp | S2COfficeSignAutoUp): void {
        if (data.Type === 1) {
            this._sealConfig.Level = data.Level;
            this._sealConfig.LevelExp = data.Exp;
            EventClient.I.emit(E.SealAmulet.UpGrade, this._sealConfig);
        } else if (data.Type === 2) {
            this._amuletConfig.Level = data.Level;
            this._amuletConfig.LevelExp = data.Exp;
            EventClient.I.emit(E.SealAmulet.UpGrade, this._amuletConfig);
        }
    }

    public updateStar(data: S2COfficeSignStar | S2COfficeSignAutoStar): void {
        if (data.Type === 1) {
            this._sealConfig.StarPos = data.Pos;
            this._sealConfig.StarExp = data.Exp;
            EventClient.I.emit(E.SealAmulet.UpStar, this._sealConfig);
        } else if (data.Type === 2) {
            this._amuletConfig.StarPos = data.Pos;
            this._amuletConfig.StarExp = data.Exp;
            EventClient.I.emit(E.SealAmulet.UpStar, this._amuletConfig);
        }
    }

    public breakStar(data: S2COfficeSignBreakStar): void {
        if (data.Type === 1) {
            this._sealConfig.StarPos = data.Pos;
            this._sealConfig.StarExp = data.Exp;
            this._sealConfig.Star = data.Star;
            EventClient.I.emit(E.SealAmulet.UpStar, this._sealConfig);
        } else if (data.Type === 2) {
            this._amuletConfig.StarPos = data.Pos;
            this._amuletConfig.StarExp = data.Exp;
            this._amuletConfig.Star = data.Star;
            EventClient.I.emit(E.SealAmulet.UpStar, this._amuletConfig);
        }
    }

    public upQuality(data: S2COfficeSignRefine): void {
        if (data.Type === 1) {
            this._sealConfig.RefineValue = data.RefineValue;
            EventClient.I.emit(E.SealAmulet.Quality, this._sealConfig);
        } else if (data.Type === 2) {
            this._amuletConfig.RefineValue = data.RefineValue;
            EventClient.I.emit(E.SealAmulet.Quality, this._amuletConfig);
        }
    }

    public breakQuality(data: S2COfficeSignRefineBreak): void {
        if (data.Type === 1) {
            this._sealConfig.RefineLv = data.RefineLv;
            this._sealConfig.RefineValue = data.RefineValue;
            EventClient.I.emit(E.SealAmulet.Quality, this._sealConfig);
        } else if (data.Type === 2) {
            this._amuletConfig.RefineLv = data.RefineLv;
            this._amuletConfig.RefineValue = data.RefineValue;
            EventClient.I.emit(E.SealAmulet.Quality, this._amuletConfig);
        }
    }

    public getConfig(type: number): OfficeSign {
        if (type === 1) {
            return this._sealConfig;
        }
        return this._amuletConfig;
    }

    /** *********等级相关********** */
    // 根据虎符官印的等级获取等级相关属性数据
    public getAttByLv(type: number, lv: number): Cfg_SAGrade {
        const indexer: ConfigSAGradeIndexer = Config.Get(ConfigConst.Cfg_SAGrade);
        return indexer.getSealGradeAmuletByLv(type, lv);
    }

    /** *********升星相关********** */
    /** 根据星级获取当前的星级相关配置表数据 */
    public getAttByStar(type: number, stage: number, activation: number): Cfg_SAStar {
        const indexer: ConfigSAStarIndexer = Config.Get(ConfigConst.Cfg_SAStar);
        return indexer.getSealAmuletStarBy(type, stage, activation);
    }

    public getNextAttByStar(id: number): Cfg_SAStar {
        const indexer: ConfigSAStarIndexer = Config.Get(ConfigConst.Cfg_SAStar);
        return indexer.getValueByKey(id);
    }

    /** *********淬炼相关********** */
    /** 根据淬炼等级获取相关的配置属性数据 */
    public getAttByRefineLv(type: number, stage: number, activation: number): Cfg_SAQuality {
        const indexer: ConfigSAQualityIndexer = Config.Get(ConfigConst.Cfg_SAQuality);
        return indexer.getSealAmuletQualityBy(type, stage, activation);
    }

    public getNextAttByQuality(id: number): Cfg_SAQuality {
        const indexer: ConfigSAQualityIndexer = Config.Get(ConfigConst.Cfg_SAQuality);
        return indexer.getValueByKey(id);
    }

    /** 获取淬炼等级的长度 */
    public getNumQuality(type: number, stage: number): number {
        const indexer: ConfigSAQualityIndexer = Config.Get(ConfigConst.Cfg_SAQuality);
        return indexer.getSealAmuletQualityLength(type, stage);
    }

    public conditionInfo(conf: Cfg_SAGrade | Cfg_SAStar | Cfg_SAQuality): { state: boolean, info: Cfg_LimitCondition, desc: string } {
        if (conf && conf.Limit) {
            return this.canLevelUp(conf.Limit);
        }
        return { state: true, info: null, desc: '' };
    }

    /** 判断条件 */
    public canLevelUp(id: number): { state: boolean, info: Cfg_LimitCondition, desc: string } {
        const indexer: ConfigLimitConditionIndexer = Config.Get(ConfigConst.Cfg_LimitCondition);
        return indexer.getCondition(id);
    }

    /** 获取技能信息
     * 此处不是公共处理方式的技能  虎符官印的技能是单独处理的
     */
    public GetSkillInfo(conf: Cfg_SAQuality, titleName?: string): {
        skill: string,
        icon: string,
        skillName: string,
        descs: { title: string, data: string }[]
    } {
        // 获取到技能相关配置
        let skillCfg: Cfg_IncreaseSkill | Cfg_SkillDesc = null;
        let descString = '';

        if (conf.Tpye === SealAmuletType.Amulet) {
            skillCfg = UtilSkillInfo.GetCfg(Number(conf.SkillId), conf.SkillLv);
            descString = UtilSkillInfo.GetSkillDesc(Number(conf.SkillId), conf.SkillLv);
        } else {
            const model = ModelMgr.I.BuffModel;
            skillCfg = model.getSkillCfg(conf.SkillId2, conf.SkillLv);
            descString = model.getSkillCfgDesc(conf.SkillId2, conf.SkillLv);
        }

        const descs: { title: string, data: string }[] = [];
        const desc = `<color=${UtilColor.WhiteD}>${descString}</c>`;
        descs.push({ title: titleName || i18n.tt(Lang.con_skill_property), data: desc });
        // const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_OfficialConstant);
        // // 官印虎符的技能图标
        // const conf2: Cfg_OfficialConstant = indexer.getValueByKey(OfficiaSkillIcon);
        // const SealAmuletSkillIcon = conf2.CfgValue.split('|');
        // const icon1 = SealAmuletSkillIcon[0].split(':');
        // const icon2 = SealAmuletSkillIcon[1].split(':');
        // const icon = conf.Tpye === 1 ? icon1[0] : icon2[0];
        const icon = skillCfg.SkillIconID.toString();
        const skillName = skillCfg.SkillName;// i18n.tt(conf.Tpye === 1 ? icon1[1] : icon2[1]);
        return {
            skill: desc, icon, skillName, descs,
        };
    }

    public GetCurrInfo(type: number): {
        fv: number[],
        property: { title: string, data: string }[],
        skill: {
            skill: string,
            icon: string,
            skillName: string,
            descs: { title: string, data: string }[]
        }
    } {
        const info = this.getConfig(type);
        return this.GetSealAmuletInfo(info);
    }

    public GetSealAmuletInfo(data: OfficeSign): {
        fv: number[],
        property: { title: string, data: string }[],
        skill: {
            skill: string,
            icon: string,
            skillName: string,
            descs: { title: string, data: string }[]
        }
    } {
        const info = data;
        const grade = this.getAttByLv(info.Type, info.Level);
        const star = this.getAttByStar(info.Type, info.Star, info.StarPos);
        const refine = this.getAttByRefineLv(info.Type, info.RefineLv, info.RefineValue);
        const at1 = AttrModel.MakeAttrInfo(grade.Attr);
        const at2 = AttrModel.MakeAttrInfo(star.Attr);
        const at3 = AttrModel.MakeAttrInfo(refine.Attr);
        const descs: { title: string, data: string }[] = [];
        const msg1 = UtilAttr.GetShowAttrStr(at1.attrs, EAttrShowType.SpaceAndColonRich, { nameC: UtilColor.WhiteD });
        const msg2 = UtilAttr.GetShowAttrStr(at2.attrs, EAttrShowType.SpaceAndColonRich, { nameC: UtilColor.WhiteD });
        const msg3 = UtilAttr.GetShowAttrStr(at3.attrs, EAttrShowType.SpaceAndColonRich, { nameC: UtilColor.WhiteD });
        descs.push({ title: i18n.tt(Lang.level_property), data: msg1 });
        descs.push({ title: i18n.tt(Lang.star_property), data: msg2 });
        descs.push({ title: i18n.tt(Lang.refinement_property), data: msg3 });
        return {
            fv: [at1.fightValue, at2.fightValue, at3.fightValue],
            property: descs,
            skill: this.GetSkillInfo(refine),
        };
    }

    /** 根据红点选中页签 */
    public redTabIndex(): { tab: number, index: number } {
        const red1 = RedDotMgr.I.getStatus(RID.Role.RoleOfficial.Official.SealAmulet.Seal.Grade.Id);
        const red12 = RedDotMgr.I.getStatus(RID.Role.RoleOfficial.Official.SealAmulet.Seal.Star.Id);
        const red13 = RedDotMgr.I.getStatus(RID.Role.RoleOfficial.Official.SealAmulet.Seal.Refine.Id);

        const red2 = RedDotMgr.I.getStatus(RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Grade.Id);
        const red22 = RedDotMgr.I.getStatus(RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Star.Id);
        const red23 = RedDotMgr.I.getStatus(RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Refine.Id);

        let tab = 0;
        let index = 0;
        if (red1) {
            tab = SealAmuletType.Seal;
            index = SealAmuletContentType.Grade;
            return { tab, index };
        }
        if (red12) {
            tab = SealAmuletType.Seal;
            index = SealAmuletContentType.Star;
            return { tab, index };
        }
        if (red13) {
            tab = SealAmuletType.Seal;
            index = SealAmuletContentType.Quality;
            return { tab, index };
        }
        if (red2) {
            tab = SealAmuletType.Amulet;
            index = SealAmuletContentType.Grade;
            return { tab, index };
        }
        if (red22) {
            tab = SealAmuletType.Amulet;
            index = SealAmuletContentType.Star;
            return { tab, index };
        }
        if (red23) {
            tab = SealAmuletType.Amulet;
            index = SealAmuletContentType.Quality;
            return { tab, index };
        }
        return { tab, index };
    }

    /** 根据红点选中当前的页签下的子红点 */
    public GetSealRedIndex(type: number): number {
        const red1 = RedDotMgr.I.getStatus(
            type === SealAmuletType.Seal
                ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Grade.Id
                : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Grade.Id,
        );
        const red2 = RedDotMgr.I.getStatus(
            type === SealAmuletType.Seal
                ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Star.Id
                : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Star.Id,
        );
        const red3 = RedDotMgr.I.getStatus(
            type === SealAmuletType.Seal
                ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Refine.Id
                : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Refine.Id,
        );
        let index = 0;
        if (red1) {
            index = SealAmuletContentType.Grade;
            return index;
        }
        if (red2) {
            index = SealAmuletContentType.Star;
            return index;
        }
        if (red3) {
            index = SealAmuletContentType.Quality;
            return index;
        }
        return index;
    }
}
