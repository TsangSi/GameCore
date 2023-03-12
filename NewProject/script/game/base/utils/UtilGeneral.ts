/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-11-21 15:11:18
 * @FilePath: \SanGuo2.4\assets\script\game\base\utils\UtilGeneral.ts
 * @Description: 武将相关的一些常用（主要是静态）方法
 *
 */

import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { AssetType } from '../../../app/core/res/ResConst';
import { i18n, Lang } from '../../../i18n/i18n';
import ItemModel from '../../com/item/ItemModel';
import { RES_ENUM } from '../../const/ResPath';
import {
    GeneralRarity, GeneralQuality, GeneralTitle, GeneralCamp, EGeneralSkillType, GeneralMsg,
} from '../../module/general/GeneralConst';
import { Config } from '../config/Config';
import { ConfigGeneralSkinIndexer } from '../config/indexer/ConfigGeneralSkinIndexer';
import { UtilSkillInfo } from './UtilSkillInfo';

export default class UtilGeneral {
    /** 武将稀有度路径 */
    public static GRPath(rarity: number): string {
        let res = rarity;
        if (res === 2) res = 3;
        else if (res === 3) res = 4;
        else if (res === 4) res = 5;
        return `${RES_ENUM.Com_Font_Com_Font_Wujiang}${res}@ML`;
    }
    /** 武将头衔  123草芥精英非凡,456入世盖世无双 789入世盖世绝世 */
    public static GLabTitle(t: number): string {
        return i18n.tt(Lang[`general_title_${t}`]);
    }

    /** 稀有度资源 */
    public static SetRarityRes(spr: cc.Sprite, rarity: GeneralRarity): void {
        if (rarity >= GeneralRarity.Rarity1 && rarity <= GeneralRarity.Rarity5) {
            UtilCocos.LoadSpriteFrameRemote(spr, this.GRPath(rarity), AssetType.SpriteFrame);
        }
    }

    /** 品质资源 */
    public static SetQualityRes(spr: cc.Sprite, quality: GeneralQuality): void {
        UtilCocos.LoadSpriteFrameRemote(spr, `${RES_ENUM.Com_Img_Com_Font_Wujiang_T}${quality}@ML`, AssetType.SpriteFrame);
    }

    /** 头衔资源（123草芥精英非凡,456入世盖世无双,789入世盖世绝世） */
    public static SetTitle(spr: cc.Sprite, lab: cc.Label, msg: { rarity: GeneralRarity, title: GeneralTitle, type: number }): void {
        let res: string;
        let title: number = msg.title;
        if (msg.title >= GeneralTitle.Title7) {
            title = msg.title - 6;
        } else if (msg.title >= GeneralTitle.Title4) {
            title = msg.title - 3;
        }

        if (msg.type === 1) { // 大的： 用在generalEntity里武将形象的旁边的头衔
            res = `${RES_ENUM.General_Img_Wujiang_T1}${title}`;
        } else if (msg.type === 2) { // 大头像的（如info里）
            res = `${RES_ENUM.General_Img_Wujiang_T2}${title}`;
        } else { // 小头像的头衔资源
            res = `${RES_ENUM.General_Img_Wujiang_T3}${title}`;
        }
        if (spr) {
            UtilCocos.LoadSpriteFrameRemote(spr, res, AssetType.SpriteFrame);
        }
        if (lab) lab.string = this.GLabTitle(msg.title);
    }

    /** 左侧 头衔小背景 */
    public static GetSmallTitle(rarity: number, title: number): string {
        let t = title;
        if (title >= GeneralTitle.Title7) {
            t -= 6;
        } else if (title >= GeneralTitle.Title4) {
            t -= 3;
        }
        return `${RES_ENUM.General_Img_Wujiang_T3}${t}`;
    }

    /** 阵营 */
    public static SetCamp(camp: GeneralCamp, lab?: cc.Label): void {
        if (lab) lab.string = i18n.tt(Lang[`general_camp_${camp}`]);
    }

    /** 获取阵营名字 */
    public static GetCampName(camp: GeneralCamp): string {
        return i18n.tt(Lang[`general_camp_${camp}`]);
    }

    /** 技能类型标签 */
    public static SetSkillFlag(spr: cc.Sprite, skillType: EGeneralSkillType): void {
        let url = '';
        switch (skillType) {
            case EGeneralSkillType.SkillActive:
                url = 'com_font_zhuanshu@ML';
                break;
            case EGeneralSkillType.SkillAwaken:
                url = 'com_font_juexing@ML';
                break;
            case EGeneralSkillType.SkillTalent:
                url = 'com_font_tianfu@ML';
                break;
            default:
                break;
        }
        if (url) {
            UtilCocos.LoadSpriteFrameRemote(spr, `${RES_ENUM.Com_Font}${url}`, AssetType.SpriteFrame);
        } else {
            spr.spriteFrame = null;
        }
    }

    /** 技能书刷选 */
    public static GetSkillBooksByQuality(books: ItemModel[], quality: number): ItemModel[] {
        const list: ItemModel[] = [];
        if (books) {
            for (let i = 0; i < books.length; i++) {
                const skillId = books[i].cfg.Param;
                const skillQuality: number = UtilSkillInfo.GetQuality(skillId, 1);
                if (quality === skillQuality) {
                    list.push(books[i]);
                }
            }
        }
        return list;
    }

    /** 武将-图鉴 */
    public static GetBooks(_camp: GeneralCamp, _rarity: GeneralRarity): GeneralMsg[] {
        let rarity2: GeneralRarity = null;
        if (_rarity === GeneralRarity.Rarity4) {
            rarity2 = GeneralRarity.Rarity5;
        } else if (_rarity === GeneralRarity.Rarity5) {
            rarity2 = GeneralRarity.Rarity4;
        }

        const list: GeneralMsg[] = [];
        const indexerRarity = Config.Get(Config.Type.Cfg_GeneralRarity);
        const indexer = Config.Get(Config.Type.Cfg_General);
        indexer.forEach((cfg: Cfg_General) => {
            if (cfg.IsVisible
                && (_camp === GeneralCamp.All || cfg.Camp === _camp)
                && (_rarity === GeneralRarity.ALL || cfg.Rarity === _rarity || (rarity2 && cfg.Rarity === rarity2))) {
                const cfgRarity: Cfg_GeneralRarity = indexerRarity.getValueByKey(cfg.Rarity);
                const gData: GeneralData = new GeneralData();
                // 最高品质
                gData.Quality = cfgRarity.MaxQuality;
                // 最高头衔
                gData.Title = cfgRarity.Title <= GeneralTitle.Title3 ? GeneralTitle.Title3 : cfgRarity.Title === GeneralTitle.Title4 ? GeneralTitle.Title6 : GeneralTitle.Title9;
                // 资质
                gData.AtkTalent = +cfg.TalentA_Max.split('|')[gData.Quality - 1];
                gData.MaxAtkTalent = gData.AtkTalent;
                gData.DefTalent = +cfg.TalentD_Max.split('|')[gData.Quality - 1];
                gData.MaxDefTalent = gData.DefTalent;
                gData.HpTalent = +cfg.TalentH_Max.split('|')[gData.Quality - 1];
                gData.MaxHpTalent = gData.HpTalent;
                gData.Grow = +cfg.Grow_Max.split('|')[gData.Quality - 1];
                gData.MaxGrow = gData.Grow;
                // 皮肤
                if (cfg.Rarity === GeneralRarity.Rarity5) {
                    const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
                    const data: number[] = indexer.getGeneralSkinIds(cfg.Id);
                    if (data && data.length > 0) {
                        gData.SkinId = data[0];
                    }
                }
                // 技能
                gData.Skills = [];
                const zhu = new GeneralSkill();
                zhu.SkillId = +cfg.BaseSkillId;
                zhu.SkillLv = 1;
                zhu.SkillType = EGeneralSkillType.SkillActive;
                gData.Skills.push(zhu);
                if (cfg.TalentSkillID) {
                    const talent = new GeneralSkill();
                    talent.SkillId = +cfg.TalentSkillID;
                    talent.SkillLv = 1;
                    talent.SkillType = EGeneralSkillType.SkillTalent;
                    gData.Skills.push(talent);
                }
                if (cfg.AwakenSkillID) {
                    const talent = new GeneralSkill();
                    talent.SkillId = +cfg.AwakenSkillID;
                    talent.SkillLv = 1;
                    talent.SkillType = EGeneralSkillType.SkillAwaken;
                    gData.Skills.push(talent);
                }
                const common = cfg.RandCommonSkills.split('|');
                for (let i = 0; i < common.length; i++) {
                    const com = new GeneralSkill();
                    com.SkillId = +common[i];
                    com.SkillLv = 1;
                    com.SkillType = EGeneralSkillType.SkillCommon;
                    gData.Skills.push(com);
                }

                const msg: GeneralMsg = {
                    cfg,
                    generalData: gData,
                };

                list.push(msg);
            }
            return true;
        });
        return list;
    }

    public static GetCompose(_camp: GeneralCamp, _rarity: GeneralRarity): GeneralMsg[] {
        let rarity2: GeneralRarity = null;
        if (_rarity === GeneralRarity.Rarity4) {
            rarity2 = GeneralRarity.Rarity5;
        } else if (_rarity === GeneralRarity.Rarity5) {
            rarity2 = GeneralRarity.Rarity4;
        }

        const list: GeneralMsg[] = [];
        const indexerRarity = Config.Get(Config.Type.Cfg_GeneralRarity);
        const indexer = Config.Get(Config.Type.Cfg_General);
        indexer.forEach((cfg: Cfg_General) => {
            if (cfg.StickCost
                && (_camp === GeneralCamp.All || cfg.Camp === _camp)
                && (_rarity === GeneralRarity.ALL || cfg.Rarity === _rarity || (rarity2 && cfg.Rarity === rarity2))) {
                const cfgRarity: Cfg_GeneralRarity = indexerRarity.getValueByKey(cfg.Rarity);
                const gData: GeneralData = new GeneralData();
                // 初始品质
                gData.Quality = cfg.Quality;
                // 初始头衔
                gData.Title = cfgRarity.Title;

                const msg: GeneralMsg = {
                    cfg,
                    generalData: gData,
                };
                list.push(msg);
            }
            return true;
        });
        return list;
    }
}
