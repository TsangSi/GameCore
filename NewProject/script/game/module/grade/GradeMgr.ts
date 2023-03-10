import { EventClient } from '../../../app/base/event/EventClient';
import { UtilString } from '../../../app/base/utils/UtilString';
import { IWinTabData } from '../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../i18n/i18n';
import { ANIM_TYPE } from '../../base/anim/AnimCfg';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { AttrModel } from '../../base/attribute/AttrModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigGradeSkinIndexer } from '../../base/config/indexer/ConfigGradeSkinIndexer';
import { ConfigGradeSkinSkillIndexer } from '../../base/config/indexer/ConfigGradeSkinSkillIndexer';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { UtilEquip } from '../../base/utils/UtilEquip';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilItem from '../../base/utils/UtilItem';
import { EAttrKey } from '../../com/attr/AttrFvConst';
import { GuideBtnIds } from '../../com/guide/GuideConst';
import { ItemBagType, ItemQuality, ItemType } from '../../com/item/ItemConst';
import ItemModel from '../../com/item/ItemModel';
import { TabData } from '../../com/tab/TabData';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { BagMgr } from '../bag/BagMgr';
import { RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleMgr } from '../role/RoleMgr';
import {
    Cfg_GradeSkill_Unit,
    Cfg_Grade_Unit,
    GradePageItemTabs,
    GradePageTabType,
    GradeType,
    GRADE_EQUIP_MIN_QUALITY,
    GRADE_EQUIP_PART_NUM,
    GRADE_MAX_LEVEL,
    GRADE_MAX_STAR,
    GRADE_MIN_LEVEL,
    GRADE_SKILL_PART_NUM,
    GRADE_SOUL_MAX_LEVEL,
    GRADE_STRENGTH_MAX_LEVEL,
} from './GradeConst';
import { GradeModel } from './GradeModel';

interface IRedUpData {
    UP_STAR: number,
    UP_STAR_ONEKEY: number,
    UP_LEVEL: number,
    SOUL: number,
    GOD: number,
    JJHL: number
}
interface IRedEquipData {
    BE_GOLD: number,
    BETTER: number,
    STRENGTH: number,
    Build: number,
}
/*
 * @Author: hwx
 * @Date: 2022-07-06 14:43:29
 * @FilePath: \SanGuo\assets\script\game\module\grade\GradeMgr.ts
 * @Description: ???????????????
 */

export class GradeMgr {
    private static _Instance: GradeMgr;
    public _GradeAutoPay = {
        Horse: false,
        Wing: false,
        Weapon: false,
        Beauty: false,
        Adviser: false,
        Pet: false,
    };

    public static get I(): GradeMgr {
        if (!this._Instance) {
            this._Instance = new GradeMgr();
            // RedDotMgr.I.register(RID.Grade);
        }
        return this._Instance;
    }

    private _gradeDataMap: Map<number, GradeData> = new Map();

    /**
     * ???????????????????????????
     * @param gradeId
     * @returns
     */
    public getGradeCfgIndexer(gradeId: number): ConfigIndexer {
        let indexer: ConfigIndexer;
        switch (gradeId) {
            case GradeType.HORSE:
                indexer = Config.Get(ConfigConst.Cfg_Grade_Horse);
                break;
            case GradeType.WING:
                indexer = Config.Get(ConfigConst.Cfg_Grade_Wing);
                break;
            case GradeType.WEAPON:
                indexer = Config.Get(ConfigConst.Cfg_Grade_Weapon);
                break;
            case FuncId.BeautyGrade:
                indexer = Config.Get(ConfigConst.Cfg_Grade_Beauty);
                break;
            case FuncId.AdviserGrade:
                indexer = Config.Get(ConfigConst.Cfg_Grade_Adviser);
                break;
            case GradeType.PET:
                indexer = Config.Get(ConfigConst.Cfg_Grade_Pet);
                break;
            default:
                cc.warn(`?????????${gradeId}???????????????`);
                return null;
        }
        return indexer;
    }

    /**
     * ????????????????????????????????????????????????
     * @param subType ???????????????
     * @param level ??????
     * @returns
     */
    public getEquipLevelDesc(subType: ItemType, level: number): string {
        let lvDesc = '';
        if (subType === ItemType.EQUIP_HORSE) {
            lvDesc = `${i18n.tt(Lang.grade_tab_horse)}${level}${i18n.jie}`;
        } else if (subType === ItemType.EQUIP_WING) {
            lvDesc = `${i18n.tt(Lang.grade_tab_wing)}${level}${i18n.jie}`;
        } else if (subType === ItemType.EQUIP_WEAPON) {
            lvDesc = `${i18n.tt(Lang.grade_tab_weapon)}${level}${i18n.jie}`;
        } else if (subType === ItemType.EQUIP_BEAUTY) {
            lvDesc = `${i18n.tt(Lang.grade_beauty)}${level}${i18n.jie}`;
        } else if (subType === ItemType.EQUIP_ADVISER) {
            lvDesc = `${i18n.tt(Lang.grade_adviser)}${level}${i18n.jie}`;
        } else if (subType === ItemType.EQUIP_PET) {
            lvDesc = `${i18n.tt(Lang.grade_tab_pet)}${level}${i18n.jie}`;
        } else {
            lvDesc = UtilGame.GetLevelStr(level);
        }
        return lvDesc;
    }

    /**
     * ???????????????????????????????????????id
     * @param subType ???????????????
     * @returns
     */
    public getFuncIdBySubType(subType: ItemType): number {
        switch (subType) {
            case ItemType.EQUIP_HORSE:
                return FuncId.Horse;
            case ItemType.EQUIP_WING:
                return FuncId.Wing;
            case ItemType.EQUIP_WEAPON:
                return FuncId.Weapon;
            case ItemType.EQUIP_BEAUTY:
                return FuncId.BeautyGrade;
            case ItemType.EQUIP_ADVISER:
                return FuncId.AdviserGrade;
            case ItemType.EQUIP_PET:
                return FuncId.Pet;
            default:
                break;
        }
        return 0;
    }

    /**
     * ?????????????????????????????????
     */
    public getGradeTabData(): IWinTabData[] {
        const gradeList = this.getGradeIdList();

        const tabDataArr: IWinTabData[] = [];

        if (gradeList.includes(GradeType.HORSE)) {
            tabDataArr.push({
                TabId: GradeType.HORSE,
                className: 'GradePage',
                prefabPath: UI_PATH_ENUM.GradePage,

                redId: RID.Grade.Horse.Id,
                funcId: FuncId.Horse,
                guideId: GuideBtnIds.GradeMount,
            });
        }
        if (gradeList.includes(GradeType.WING)) {
            tabDataArr.push({
                TabId: GradeType.WING,
                className: 'GradePage',
                prefabPath: UI_PATH_ENUM.GradePage,

                redId: RID.Grade.Wing.Id,
                funcId: FuncId.Wing,
                guideId: GuideBtnIds.GradeWing,
            });
        }
        if (gradeList.includes(GradeType.WEAPON)) {
            tabDataArr.push({
                TabId: GradeType.WEAPON,
                className: 'GradePage',
                prefabPath: UI_PATH_ENUM.GradePage,

                redId: RID.Grade.Weapon.Id,
                funcId: FuncId.Weapon,
                guideId: GuideBtnIds.GradeReiki,
            });
        }
        if (gradeList.includes(GradeType.PET)) {
            tabDataArr.push({
                TabId: GradeType.PET,
                className: 'GradePage',
                prefabPath: UI_PATH_ENUM.GradePage,

                redId: RID.Grade.Pet.Id,
                funcId: FuncId.Pet,
                guideId: GuideBtnIds.GradePet,
            });
        }
        return tabDataArr;
    }

    /**
     * ??????????????????????????????
     * @param gradeId ??????id
     * @returns
     */
    public getRedEquipDataByGradeId(gradeId: number): IRedEquipData {
        const redData: IRedEquipData = cc.js.createMap(true);
        // ????????????
        if (gradeId === GradeType.HORSE) {
            redData.BE_GOLD = RID.Grade.Horse.Equip.BE_GOLD;
            redData.BETTER = RID.Grade.Horse.Equip.BETTER;
            redData.STRENGTH = RID.Grade.Horse.Equip.STRENGTH;
            redData.Build = RID.Grade.Horse.Equip.Build;
        } else if (gradeId === GradeType.WING) {
            redData.BE_GOLD = RID.Grade.Wing.Equip.BE_GOLD;
            redData.BETTER = RID.Grade.Wing.Equip.BETTER;
            redData.STRENGTH = RID.Grade.Wing.Equip.STRENGTH;
            redData.Build = RID.Grade.Wing.Equip.Build;
        } else if (gradeId === GradeType.WEAPON) {
            redData.BE_GOLD = RID.Grade.Weapon.Equip.BE_GOLD;
            redData.BETTER = RID.Grade.Weapon.Equip.BETTER;
            redData.STRENGTH = RID.Grade.Weapon.Equip.STRENGTH;
            redData.Build = RID.Grade.Weapon.Equip.Build;
        } else if (gradeId === FuncId.BeautyGrade) {
            redData.BE_GOLD = RID.Forge.Beauty.Grade.Equip.BE_GOLD;
            redData.BETTER = RID.Forge.Beauty.Grade.Equip.BETTER;
            redData.STRENGTH = RID.Forge.Beauty.Grade.Equip.STRENGTH;
            redData.Build = RID.Forge.Beauty.Grade.Equip.Build;
        } else if (gradeId === FuncId.AdviserGrade) {
            redData.BE_GOLD = RID.Forge.Adviser.Grade.Equip.BE_GOLD;
            redData.BETTER = RID.Forge.Adviser.Grade.Equip.BETTER;
            redData.STRENGTH = RID.Forge.Adviser.Grade.Equip.STRENGTH;
            redData.Build = RID.Forge.Adviser.Grade.Equip.Build;
        } else if (gradeId === FuncId.Pet) {
            redData.BE_GOLD = RID.Grade.Pet.Equip.BE_GOLD;
            redData.BETTER = RID.Grade.Pet.Equip.BETTER;
            redData.STRENGTH = RID.Grade.Pet.Equip.STRENGTH;
            redData.Build = RID.Grade.Pet.Equip.Build;
        }
        return redData;
    }
    /**
     * ?????????????????????????????????????????????
     * @param gradeId ??????id
     * @returns
     */
    public getRedUpDataByGradeId(gradeId: number): IRedUpData {
        const redData: IRedUpData = cc.js.createMap(true);
        if (gradeId === GradeType.HORSE) {
            redData.UP_STAR = RID.Grade.Horse.Up.UP_STAR;
            redData.UP_STAR_ONEKEY = RID.Grade.Horse.Up.UP_STAR_ONEKEY;
            redData.UP_LEVEL = RID.Grade.Horse.Up.UP_LEVEL;
            redData.SOUL = RID.Grade.Horse.Up.SOUL;
            redData.GOD = RID.Grade.Horse.Up.GOD;
            redData.JJHL = RID.Grade.Horse.Up.JJHL;
        } else if (gradeId === GradeType.WING) {
            redData.UP_STAR = RID.Grade.Wing.Up.UP_STAR;
            redData.UP_STAR_ONEKEY = RID.Grade.Wing.Up.UP_STAR_ONEKEY;
            redData.UP_LEVEL = RID.Grade.Wing.Up.UP_LEVEL;
            redData.SOUL = RID.Grade.Wing.Up.SOUL;
            redData.GOD = RID.Grade.Wing.Up.GOD;
            redData.JJHL = RID.Grade.Wing.Up.JJHL;
        } else if (gradeId === GradeType.WEAPON) {
            redData.UP_STAR = RID.Grade.Weapon.Up.UP_STAR;
            redData.UP_STAR_ONEKEY = RID.Grade.Weapon.Up.UP_STAR_ONEKEY;
            redData.UP_LEVEL = RID.Grade.Weapon.Up.UP_LEVEL;
            redData.SOUL = RID.Grade.Weapon.Up.SOUL;
            redData.GOD = RID.Grade.Weapon.Up.GOD;
            redData.JJHL = RID.Grade.Weapon.Up.JJHL;
        } else if (gradeId === FuncId.BeautyGrade) {
            redData.UP_STAR = RID.Forge.Beauty.Grade.Up.UP_STAR;
            redData.UP_STAR_ONEKEY = RID.Forge.Beauty.Grade.Up.UP_STAR_ONEKEY;
            redData.UP_LEVEL = RID.Forge.Beauty.Grade.Up.UP_LEVEL;
            redData.SOUL = RID.Forge.Beauty.Grade.Up.SOUL;
            redData.GOD = RID.Forge.Beauty.Grade.Up.GOD;
            redData.JJHL = RID.Forge.Beauty.Grade.Up.JJHL;
        } else if (gradeId === FuncId.AdviserGrade) {
            redData.UP_STAR = RID.Forge.Adviser.Grade.Up.UP_STAR;
            redData.UP_STAR_ONEKEY = RID.Forge.Adviser.Grade.Up.UP_STAR_ONEKEY;
            redData.UP_LEVEL = RID.Forge.Adviser.Grade.Up.UP_LEVEL;
            redData.SOUL = RID.Forge.Adviser.Grade.Up.SOUL;
            redData.GOD = RID.Forge.Adviser.Grade.Up.GOD;
            redData.JJHL = RID.Forge.Adviser.Grade.Up.JJHL;
        } else if (gradeId === FuncId.Pet) {
            redData.UP_STAR = RID.Grade.Pet.Up.UP_STAR;
            redData.UP_STAR_ONEKEY = RID.Grade.Pet.Up.UP_STAR_ONEKEY;
            redData.UP_LEVEL = RID.Grade.Pet.Up.UP_LEVEL;
            redData.SOUL = RID.Grade.Pet.Up.SOUL;
            redData.GOD = RID.Grade.Pet.Up.GOD;
            redData.JJHL = RID.Grade.Pet.Up.JJHL;
        }
        return redData;
    }

    /**
     * ????????????id????????????id
     * @param gradeId ??????id
     * @returns
     */
    public getRedSkillByGradeId(gradeId: number): number {
        let redId: number = 0;
        if (gradeId === GradeType.HORSE) {
            redId = RID.Grade.Horse.Up.SKILL;
        } else if (gradeId === GradeType.WING) {
            redId = RID.Grade.Wing.Up.SKILL;
        } else if (gradeId === GradeType.WEAPON) {
            redId = RID.Grade.Weapon.Up.SKILL;
        } else if (gradeId === FuncId.BeautyGrade) {
            redId = RID.Forge.Beauty.Grade.Up.SKILL;
        } else if (gradeId === FuncId.AdviserGrade) {
            redId = RID.Forge.Adviser.Grade.Up.SKILL;
        } else if (gradeId === FuncId.Pet) {
            redId = RID.Grade.Pet.Up.SKILL;
        }
        return redId;
    }

    /**
     * ????????????id????????????????????????
     * @param gradeId ??????id
     * @returns
     */
    public getResTypeByGradeId(gradeId: number): ANIM_TYPE {
        let resType: ANIM_TYPE = ANIM_TYPE.HORSE;
        if (gradeId === GradeType.HORSE) {
            resType = ANIM_TYPE.HORSE;
        } else if (gradeId === GradeType.WING) {
            resType = ANIM_TYPE.WING;
        } else if (gradeId === GradeType.WEAPON) {
            resType = ANIM_TYPE.WEAPON;
        } else if (gradeId === FuncId.BeautyGrade) {
            resType = ANIM_TYPE.PET;
        } else if (gradeId === FuncId.AdviserGrade) {
            resType = ANIM_TYPE.PET;
        } else if (gradeId === GradeType.PET) {
            resType = ANIM_TYPE.PET;
        }
        return resType;
    }

    /**
     * ????????????id????????????????????????
     * @param gradeId ??????id
     * @returns
     */
    public getGradePageTbas(gradeId: number): TabData[] {
        const itemtabs: TabData[] = [];
        // ????????????????????????
        GradePageItemTabs.forEach((tabData) => {
            if (gradeId === GradeType.HORSE) {
                if (tabData.id === GradePageTabType.UP) {
                    tabData.redId = RID.Grade.Horse.Up.Id;
                } else if (tabData.id === GradePageTabType.EQUIP) {
                    tabData.redId = RID.Grade.Horse.Equip.Id;
                } else if (tabData.id === GradePageTabType.SKIN) {
                    tabData.redId = RID.Grade.Horse.Skin.Id;
                }
                itemtabs.push(tabData);
            } else if (gradeId === GradeType.WING) {
                if (tabData.id === GradePageTabType.UP) {
                    tabData.redId = RID.Grade.Wing.Up.Id;
                } else if (tabData.id === GradePageTabType.EQUIP) {
                    tabData.redId = RID.Grade.Wing.Equip.Id;
                } else if (tabData.id === GradePageTabType.SKIN) {
                    tabData.redId = RID.Grade.Wing.Skin.Id;
                }
                itemtabs.push(tabData);
            } else if (gradeId === GradeType.WEAPON) {
                if (tabData.id === GradePageTabType.UP) {
                    tabData.redId = RID.Grade.Weapon.Up.Id;
                } else if (tabData.id === GradePageTabType.EQUIP) {
                    tabData.redId = RID.Grade.Weapon.Equip.Id;
                } else if (tabData.id === GradePageTabType.SKIN) {
                    tabData.redId = RID.Grade.Weapon.Skin.Id;
                }
                itemtabs.push(tabData);
            } else if (gradeId === FuncId.BeautyGrade) {
                if (tabData.id === GradePageTabType.UP) {
                    tabData.redId = RID.Forge.Beauty.Grade.Up.Id;
                    itemtabs.push(tabData);
                } else if (tabData.id === GradePageTabType.EQUIP) {
                    tabData.redId = RID.Forge.Beauty.Grade.Equip.Id;
                    const tmpData: TabData = cc.js.createMap(true);
                    for (const k in tabData) {
                        if (k === 'title') {
                            tmpData[k] = i18n.tt(Lang.grade_page_tab_equip2);
                        } else {
                            tmpData[k] = tabData[k];
                        }
                    }
                    itemtabs.push(tmpData);
                }
            } else if (gradeId === FuncId.AdviserGrade) {
                if (tabData.id === GradePageTabType.UP) {
                    tabData.redId = RID.Forge.Adviser.Grade.Up.Id;
                    itemtabs.push(tabData);
                } else if (tabData.id === GradePageTabType.EQUIP) {
                    tabData.redId = RID.Forge.Adviser.Grade.Equip.Id;
                    const tmpData: TabData = cc.js.createMap(true);
                    for (const k in tabData) {
                        if (k === 'title') {
                            tmpData[k] = i18n.tt(Lang.grade_page_tab_equip3);
                        } else {
                            tmpData[k] = tabData[k];
                        }
                    }
                    itemtabs.push(tmpData);
                }
            } else if (gradeId === GradeType.PET) {
                if (tabData.id === GradePageTabType.UP) {
                    tabData.redId = RID.Grade.Pet.Up.Id;
                } else if (tabData.id === GradePageTabType.EQUIP) {
                    tabData.redId = RID.Grade.Pet.Equip.Id;
                } else if (tabData.id === GradePageTabType.SKIN) {
                    tabData.redId = RID.Grade.Pet.Skin.Id;
                }
                itemtabs.push(tabData);
            }
        });
        return itemtabs;
    }

    /**
     * ????????????ID????????????????????????
     * @param gradeId
     * @param lv
     * @param star
     * @returns Cfg_Grade_Unit | null
     */
    public getGradeCfg(gradeId: number, lv: number = 1, star: number = 1): Cfg_Grade_Unit {
        const indexer = this.getGradeCfgIndexer(gradeId);
        const cfg: Cfg_Grade_Unit = indexer.getValueByKey(lv, star);
        return cfg;
    }

    /**
     * ????????????ID????????????????????????
     * @param gradeId
     * @param skinId
     * @returns Cfg_Grade_Unit | null
     */
    public getGradeCfgBySkinId(gradeId: number, skinId: number): Cfg_Grade_Unit | null {
        const indexer = this.getGradeCfgIndexer(gradeId);
        const nestedMap = indexer.getNestedMap() as object;
        for (const level in nestedMap) {
            const starMap = nestedMap[level] as object;
            for (const star in starMap) {
                const cfg: Cfg_Grade_Unit = indexer.getValueByIndex(starMap[star]);
                if (cfg.SkinId === skinId) {
                    return cfg;
                }
            }
        }
        return null;
    }

    /**
     * ?????????????????????????????????
     * @param gradeId
     * @returns ConfigIndexer
     */
    public getGradeSkillCfgIndexer(gradeId: number): ConfigIndexer {
        let indexer: ConfigIndexer;
        switch (gradeId) {
            case GradeType.HORSE:
                indexer = Config.Get(ConfigConst.Cfg_GradeSkill_Horse);
                break;
            case GradeType.WING:
                indexer = Config.Get(ConfigConst.Cfg_GradeSkill_Wing);
                break;
            case GradeType.WEAPON:
                indexer = Config.Get(ConfigConst.Cfg_GradeSkill_Weapon);
                break;
            case FuncId.BeautyGrade:
                indexer = Config.Get(ConfigConst.Cfg_GradeSkill_Beauty);
                break;
            case FuncId.AdviserGrade:
                indexer = Config.Get(ConfigConst.Cfg_GradeSkill_Adviser);
                break;
            case FuncId.Pet:
                indexer = Config.Get(ConfigConst.Cfg_GradeSkill_Pet);
                break;
            default:
                cc.warn(`?????????${gradeId}???????????????`);
                return null;
        }
        return indexer;
    }

    /**
     * ????????????ID????????????????????????
     * @param gradeId
     * @param part
     * @param lv
     * @returns Cfg_GradeSkill_Unit | null
     */
    public getGradeSkillCfg(gradeId: number, part: number, lv: number): Cfg_GradeSkill_Unit | null {
        const indexer = this.getGradeSkillCfgIndexer(gradeId);
        return indexer.getValueByKey(part, lv);
    }

    /**
     * ????????????????????????
     * @param skinId
     * @returns Cfg_GradeSkin | null
     */
    public getGradeSkinCfgById(skinId: number): Cfg_GradeSkin | null {
        const indexer = Config.Get(ConfigConst.Cfg_GradeSkin);
        return indexer.getValueByKey(skinId);
    }

    /**
     * ??????????????????????????????(???????????????????????????)
     * @param gradeId
     * @returns Cfg_GradeSkin[]
     */
    public getGradeSkinCfgList(gradeId: number): Cfg_GradeSkin[] {
        const list: Cfg_GradeSkin[] = [];
        const indexer: ConfigGradeSkinIndexer = Config.Get(ConfigConst.Cfg_GradeSkin);
        const indexs = indexer.getIndexsByFuncId(gradeId);
        for (let i = 0, len = indexs.length; i < len; i++) {
            const cfg: Cfg_GradeSkin = indexer.getValueByIndex(indexs[i]);
            list.push(cfg);
        }
        return list;
    }

    /**
     * ????????????????????????Tab??????(????????????)
     * @param gradeId
     * @param tabId
     * @returns Cfg_GradeSkin[]
     */
    public getGradeSkinCfgTabList(gradeId: number, tabId: number): Cfg_GradeSkin[] {
        const list: Cfg_GradeSkin[] = [];
        const indexer: ConfigGradeSkinIndexer = Config.Get(ConfigConst.Cfg_GradeSkin);
        const indexs = indexer.getIndexsByTabId(gradeId, tabId);
        for (let i = 0, len = indexs.length; i < len; i++) {
            const cfg: Cfg_GradeSkin = indexer.getValueByIndex(indexs[i]);
            list.push(cfg);
        }
        return list;
    }

    /**
     * ????????????????????????TabMap(????????????)
     * @param gradeId
     * @returns Map<number, Cfg_GradeSkin[]>
     */
    public getGradeSkinCfgTabMap(gradeId: number): Map<number, Cfg_GradeSkin[]> {
        const map: Map<number, Cfg_GradeSkin[]> = new Map();
        const indexer: ConfigGradeSkinIndexer = Config.Get(ConfigConst.Cfg_GradeSkin);
        const idxMap = indexer.getIndexsTabMapByGradeId(gradeId);
        if (idxMap) {
            idxMap.forEach((v, k) => {
                const list: Cfg_GradeSkin[] = [];
                for (let i = 0, len = v.length; i < len; i++) {
                    const cfg: Cfg_GradeSkin = indexer.getValueByIndex(v[i]);
                    list.push(cfg);
                }
                map.set(k, list);
            });
        }

        return map;
    }

    /**
     * ??????????????????????????????
     * @param skillId
     * @returns Cfg_GradeSkinSkill | null
     */
    public getGradeSkinSkillCfgById(skillId: number): Cfg_GradeSkinSkill | null {
        const indexer = Config.Get(ConfigConst.Cfg_GradeSkinSkill);
        return indexer.getValueByKey(skillId);
    }

    /**
     * ??????????????????????????????
     * @param quality
     * @param part
     * @param lv
     * @returns Cfg_GradeSkinSkill | null
     */
    public getGradeSkinSkillCfg(quality: number, part: number, lv: number): Cfg_GradeSkinSkill | null {
        return this.getGradeSkinSkillCfgById(quality * 100000 + part * 1000 + lv);
    }

    /**
     * ?????????????????????????????????????????????????????????limit????????????????????????
     * @param quality
     * @param part
     * @param limit
     * @returns Cfg_GradeSkinSkill | null
     */
    public getGradeSkinSkillCfgForLimit(quality: number, part: number, star: number): Cfg_GradeSkinSkill | null {
        let ret: Cfg_GradeSkinSkill;
        const indexer: ConfigGradeSkinSkillIndexer = Config.Get(ConfigConst.Cfg_GradeSkinSkill);
        const indexs = indexer.getIndexsByQualityPart(quality, part);
        if (indexs && indexs.length > 0) {
            for (let i = 0, len = indexs.length; i < len; i++) {
                const cfg: Cfg_GradeSkinSkill = indexer.getValueByIndex(indexs[i]);
                if (!ret || cfg.Limit <= star) {
                    ret = cfg;
                }
                if (cfg.Limit > star) {
                    break;
                }
            }
        }
        return ret;
    }

    /**
     * ??????????????????????????????
     * @param id
     * @returns Cfg_GradeSkinStar | null
     */
    public getGradeSkinStarCfgById(id: number): Cfg_GradeSkinStar | null {
        const indexer = Config.Get(ConfigConst.Cfg_GradeSkinStar);
        return indexer.getValueByKey(id);
    }

    /**
     * ??????????????????????????????
     * @param skinType
     * @param lv ??????????????????
     * @returns Cfg_GradeSkinStar
     */
    public getGradeSkinStarCfg(gradeId: number, lv: number): Cfg_GradeSkinStar | null {
        lv = lv > 0 ? lv : 1; // ?????????1???
        const indexer = Config.Get(ConfigConst.Cfg_GradeSkinStar);
        return indexer.getIntervalData(gradeId, lv);
    }

    /**
     * ??????????????????
     * @param id
     * @returns Cfg_GradeItem | null
     */
    public getGradeItemCfgById(id: number): Cfg_GradeItem | null {
        const indexer = Config.Get(ConfigConst.Cfg_GradeItem);
        return indexer.getValueByKey(id);
    }

    /**
     * ????????????????????????
     * @param gradeId ??????ID
     * @param part ????????????
     * @param lv ????????????
     * @returns Cfg_GradeHJ | null
     */
    public getGradeHJCfg(gradeId: number, part: number, lv: number): Cfg_GradeHJ | null {
        const indexer = Config.Get(ConfigConst.Cfg_GradeHJ);
        return indexer.getValueByKey(gradeId, part, lv);
    }

    /**
     * ??????????????????
     * @param part ????????????
     * @param lv ????????????
     * @returns Cfg_GradeStrength | null
     */
    public getGradeStrengthCfg(part: number, lv: number): Cfg_GradeStrength | null {
        const indexer = Config.Get(ConfigConst.Cfg_GradeStrength);
        const indexs: object = indexer.getValueByKey(part);
        for (const key in indexs) {
            const index = indexs[key];
            const cfg: Cfg_GradeStrength = indexer.getValueByIndex(index);
            if (lv >= cfg.LevelMin && lv <= cfg.LevelMax) {
                return cfg;
            }
        }
        return null;
    }

    /**
     * ????????????????????????
     * @param gradeId ??????ID
     * @param part ????????????
     */
    public getGradeStrengthLv(gradeId: number, part: number): number {
        let lv = 0;
        const data = this.getGradeData(gradeId);
        if (data && data.GradeEquip.PosLv) {
            const intAttr = UtilGame.GetIntAttrByKey(data.GradeEquip.PosLv, part);
            if (intAttr) {
                lv = intAttr.V;
            }
        }
        return lv;
    }

    /**
     * ????????????????????????
     * @param part ????????????
     * @param lv ????????????
     * @returns AttrInfo
     */
    public getStrengthAttrInfo(part: number, lv: number): AttrInfo {
        const attrInfo: AttrInfo = new AttrInfo();
        const cfg = GradeMgr.I.getGradeStrengthCfg(part, lv);
        const baseAttrInfo = AttrModel.MakeAttrInfo(cfg.BaseAttrId);
        if (lv >= cfg.LevelMin) {
            const addAttrInfo = AttrModel.MakeAttrInfo(cfg.AddAttrId);
            for (let i = 0; i < addAttrInfo.attrs.length; i++) {
                const attr = addAttrInfo.attrs[i];
                attr.value *= lv - 1;
            }
            baseAttrInfo.add(addAttrInfo);
        }
        attrInfo.add(baseAttrInfo);
        return attrInfo;
    }

    /**
     * ??????????????????????????????
     * @param gradeId
     * @returns Cfg_GradeJJHL[]
     */
    public getGradeJJHLCfgList(gradeId: number): Cfg_GradeJJHL[] {
        const list: Cfg_GradeJJHL[] = [];
        const indexer = Config.Get(ConfigConst.Cfg_Grade_JJHL);
        const indexs: object = indexer.getValueByKey(gradeId);
        for (const key in indexs) {
            const index = indexs[key];
            const cfg: Cfg_GradeJJHL = indexer.getValueByIndex(index);
            list.push(cfg);
        }
        return list;
    }

    /**
     * ????????????????????????
     * @param gradeId
     * @param lv ????????????
     * @returns Cfg_GradeJJHL | null
     */
    public getGradeJJHLCfg(gradeId: number, lv: number): Cfg_GradeJJHL | null {
        const list: Cfg_GradeJJHL[] = this.getGradeJJHLCfgList(gradeId);
        for (let i = 0, len = list.length; i < len; i++) {
            const cfg = list[i];
            if (cfg.TargetLevel === lv) {
                return cfg;
            }
        }
        return null;
    }

    /**
     * ????????????id??? ??????????????????
     * @returns gradeid[];
     */
    public getGradeIdList(): number[] {
        const keysList: number[] = [];
        for (const i of this._gradeDataMap.keys()) {
            keysList.push(i);
        }
        keysList.sort((a, b) => a - b);
        return keysList;
    }

    /**
     * ??????????????????????????????
     * @param gradeId
     * @returns Cfg_GradeJJHL[]
     */
    public getGradePrizeCfgList(gradeId: number): Cfg_GradePrize[] {
        const list: Cfg_GradePrize[] = [];
        const indexer = Config.Get(ConfigConst.Cfg_GradePrize);
        const indexs: object = indexer.getValueByKey(gradeId);
        for (const key in indexs) {
            const index = indexs[key];
            const cfg: Cfg_GradePrize = indexer.getValueByIndex(index);
            list.push(cfg);
        }
        return list;
    }

    /**
     * ????????????????????????
     * @param gradeId
     * @param lv ????????????
     * @returns Cfg_GradeJJHL | null
     */
    public getGradePrizeCfg(gradeId: number, lv: number): Cfg_GradePrize | null {
        const list: Cfg_GradePrize[] = this.getGradePrizeCfgList(gradeId);
        for (let i = 0, len = list.length; i < len; i++) {
            const cfg = list[i];
            if (cfg.Level === lv) {
                return cfg;
            }
        }
        return null;
    }

    /**
     * ??????????????????
     * @param lv ????????????
     * @returns Cfg_GradeZL | null
     */
    public getGradeZLCfg(lv: string | number): Cfg_GradeZL | null {
        const indexer = Config.Get(ConfigConst.Cfg_GradeZL);
        return indexer.getValueByKey(lv);
    }

    /**
     * ???????????????????????????
     * @param gradeId ????????????ID
     * @returns GradeData | null
     */
    public getGradeData(gradeId: number): GradeData | null {
        return this._gradeDataMap.get(gradeId);
    }

    /**
     * ???????????????????????????
     * @param gradeId ????????????ID
     * @param data GradeData
     */
    public updateGradeData(gradeId: number, data: GradeData): void {
        if (!gradeId || !data) {
            return;
        }
        const oldData = this._gradeDataMap.get(gradeId);
        if (oldData) {
            if (data.GradeLv) {
                // ??????????????????
                if (oldData.GradeLv.BigLv < data.GradeLv.BigLv) {
                    const diff = data.GradeLv.BigLv - oldData.GradeLv.BigLv;
                    EventClient.I.emit(E.Grade.UpLevel, diff);
                }
                oldData.GradeLv = data.GradeLv;
            }
            if (data.GradeSkill) oldData.GradeSkill = data.GradeSkill;
            if (data.GradeEquip) oldData.GradeEquip = data.GradeEquip;
            if (data.GradeSoul) oldData.GradeSoul = data.GradeSoul;
            if (data.GradeGod) oldData.GradeGod = data.GradeGod;
            if (data.GradeSkin) {
                if (oldData.GradeSkin && oldData.GradeSkin.SkinLv) {
                    for (let i = 0, n = data.GradeSkin.SkinLv.length; i < n; i++) {
                        let has = false;
                        for (let j = 0, n = oldData.GradeSkin.SkinLv.length; j < n; j++) {
                            if (data.GradeSkin.SkinLv[i].K === oldData.GradeSkin.SkinLv[j].K) {
                                has = true;
                                break;
                            }
                        }
                        if (!has) {
                            // ??????????????????
                            EventClient.I.emit(E.Grade.SkinActive, data.GradeSkin.SkinLv[i].K);
                            break;
                        }
                    }
                }
                oldData.GradeSkin = data.GradeSkin;
            }
            if (data.GradeBeGold) oldData.GradeBeGold = data.GradeBeGold;
            if (data.GradeRefine) oldData.GradeRefine = data.GradeRefine;
            if (data.GradeChanneling) oldData.GradeChanneling = data.GradeChanneling;
        } else {
            this._gradeDataMap.set(gradeId, data);
        }
    }

    /**
     * ??????????????????
     * @param gradeId
     * @returns GradeModel | null
     */
    public getGradeModel(gradeId: number): GradeModel | null {
        const data = this.getGradeData(gradeId);
        if (!data) { return null; }

        const level = data.GradeLv.BigLv || 1;
        const star = data.GradeLv.SmallLv || 1;

        const model = new GradeModel();
        model.data = data;
        model.cfg = this.getGradeCfg(gradeId, level, star);
        if (model.cfg) {
            model.skinCfg = this.getGradeSkinCfgById(model.cfg.SkinId);
            model.skillsCfg = this.getGradeSkills(gradeId);
        }
        return model;
    }

    /**
     * ??????????????????
     * @param gradeId
     * @param partLvList
     * @returns Cfg_GradeSkill_Unit[]
     */
    public getGradeSkills(gradeId: number): Cfg_GradeSkill_Unit[] {
        const data = this.getGradeData(gradeId);
        const skillLvs = data.GradeSkill && data.GradeSkill.Skills ? data.GradeSkill.Skills : [];

        const skills: Cfg_GradeSkill_Unit[] = [];
        for (let part = 1; part <= GRADE_SKILL_PART_NUM; part++) {
            const lv = this.getGradeSkillPartLv(skillLvs, part); // ??????????????????
            const cfg = this.getGradeSkillCfg(gradeId, part, lv);
            skills.push(cfg);
        }
        return skills;
    }

    /**
     * ??????????????????????????????
     * @param gradeIdOrSkillLvs number | IntAttr[] ??????[part]:[level]
     * @param part
     * @returns number
     */
    public getGradeSkillPartLv(gradeIdOrSkillLvs: number | IntAttr[], part: number): number {
        let lv = 1;
        let skillLvs: IntAttr[];
        if (typeof gradeIdOrSkillLvs === 'number') {
            const data = this.getGradeData(gradeIdOrSkillLvs);
            skillLvs = data.GradeSkill && data.GradeSkill.Skills ? data.GradeSkill.Skills : [];
        } else {
            skillLvs = gradeIdOrSkillLvs;
        }

        for (let i = 0; i < skillLvs.length; i++) {
            const kv = skillLvs[i];
            if (kv.K === part) {
                lv = kv.V || 1; // ??????????????????kv.V???0
                break;
            }
        }
        return lv;
    }

    /**
     * ????????????????????????????????????
     * @param str
     * @returns
     */
    public parseGradeSkinAttrSkill(str: string): [string, string][] {
        const ret: [string, string][] = [];
        const arr = str.split('|');
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            const [skillName, skillIconId] = element.split(':');
            ret.push([skillName, skillIconId]);
        }
        return ret;
    }

    private gradeSkillPartOpenLvMap: Map<string, number> = new Map();
    public cacheGradeSkillPartOpenLv(gradeId: number): void {
        const indexer = this.getGradeCfgIndexer(gradeId);
        const levelMap = indexer.getNestedMap() as object;
        for (const level in levelMap) {
            const starMap = levelMap[level];
            for (const star in starMap) {
                const cfg: Cfg_Grade_Unit = indexer.getValueByKey(+level, +star);
                if (cfg.SkillPart && !this.gradeSkillPartOpenLvMap.has(`${gradeId}_${cfg.SkillPart}`)) {
                    this.gradeSkillPartOpenLvMap.set(`${gradeId}_${cfg.SkillPart}`, cfg.Level);
                } else {
                    break;
                }
            }
        }
    }

    /**
     * ????????????????????????????????????
     * @param gradeId
     * @param part
     * @returns number
     */
    public getGradeSkillPartOpenLv(gradeId: number, part: number): number {
        if (!this.gradeSkillPartOpenLvMap.has(gradeId.toString())) {
            this.cacheGradeSkillPartOpenLv(gradeId);
        }
        return this.gradeSkillPartOpenLvMap.get(`${gradeId}_${part}`) || 0;
    }

    /**
     * ???????????????????????????ID
     * @param gradeId
     * @returns number
     */
    public getGradeTotalAttrFvId(gradeId: number): number {
        switch (gradeId) {
            case GradeType.HORSE: return EAttrKey.AttrKey_GradeHorseLv;
            case GradeType.WING: return EAttrKey.AttrKey_GradeWingLv;
            case GradeType.WEAPON: return EAttrKey.AttrKey_GradeWeaponLv;
            case FuncId.BeautyGrade: return EAttrKey.AttrKey_GradeBeautyLv;
            case FuncId.AdviserGrade: return EAttrKey.AttrKey_GradeAdviserLv;
            case FuncId.Pet: return EAttrKey.AttrKey_GradePetLv;
            default: return EAttrKey.AttrKey_GradeHorseLv;
        }
    }

    /**
     * ??????????????????????????????ID
     * @param gradeId
     * @returns number
     */
    public getGradeEquipAttrFvId(gradeId: number): number {
        switch (gradeId) {
            case GradeType.HORSE: return EAttrKey.AttrKey_GradeHorseEquip;
            case GradeType.WING: return EAttrKey.AttrKey_GradeWingEquip;
            case GradeType.WEAPON: return EAttrKey.AttrKey_GradeWeaponEquip;
            case FuncId.BeautyGrade: return EAttrKey.AttrKey_GradeBeautyEquip;
            case FuncId.AdviserGrade: return EAttrKey.AttrKey_GradeAdviserEquip;
            case GradeType.PET: return EAttrKey.AttrKey_GradePetEquip;
            default: return EAttrKey.AttrKey_GradeHorseLv;
        }
    }

    /** ???????????????????????? */
    public getGradeEquipStrengthFvId(gradeId: number): number {
        switch (gradeId) {
            case GradeType.HORSE: return EAttrKey.AttrKey_GradeHorseStrengthen;
            case GradeType.WING: return EAttrKey.AttrKey_GradeWingStrengthen;
            case GradeType.WEAPON: return EAttrKey.AttrKey_GradeWeaponStrengthen;
            case FuncId.BeautyGrade: return EAttrKey.AttrKey_GradeBeautyStrengthen;
            case FuncId.AdviserGrade: return EAttrKey.AttrKey_GradeAdviserStrengthen;
            case GradeType.PET: return EAttrKey.AttrKey_GradePetStrengthen;
            default: return EAttrKey.AttrKey_GradeHorseStrengthen;
        }
    }

    public getGradeHjAttrFvId(gradeId: number): number {
        switch (gradeId) {
            case GradeType.HORSE: return EAttrKey.AttrKey_GradeHorseBeGold;
            case GradeType.WING: return EAttrKey.AttrKey_GradeWingBeGold;
            case GradeType.WEAPON: return EAttrKey.AttrKey_GradeWeaponBeGold;
            case FuncId.BeautyGrade: return EAttrKey.AttrKey_GradeBeautyBeGold;
            case FuncId.AdviserGrade: return EAttrKey.AttrKey_GradeAdviserBeGold;
            case GradeType.PET: return EAttrKey.AttrKey_GradePetBeGold;
            default: return EAttrKey.AttrKey_GradeHorseBeGold;
        }
    }

    /**
     * ??????????????????
     * @param gradeId
     * @returns number
     */
    public getGradeEquipType(gradeId: number): number {
        switch (gradeId) {
            case GradeType.HORSE: return ItemType.EQUIP_HORSE;
            case GradeType.WING: return ItemType.EQUIP_WING;
            case GradeType.WEAPON: return ItemType.EQUIP_WEAPON;
            case FuncId.BeautyGrade: return ItemType.EQUIP_BEAUTY;
            case FuncId.AdviserGrade: return ItemType.EQUIP_ADVISER;
            case GradeType.PET: return ItemType.EQUIP_PET;
            default: return ItemType.EQUIP_HORSE;
        }
    }

    /**
     * ???????????????????????????
     * @param gradeId
     * @returns ItemModel[]
     */
    public getGradeOnEquipPartMap(gradeId: number): Map<number, ItemModel> {
        const onEquipMap: Map<number, ItemModel> = new Map();
        const itemType = this.getGradeEquipType(gradeId);
        for (let i = 0; i < GRADE_EQUIP_PART_NUM; i++) {
            const part = i + 1;
            const itemModel = BagMgr.I.getOnEquipByPart(ItemBagType.GENERAL, itemType, part);
            if (itemModel) {
                onEquipMap.set(part, itemModel);
            }
        }
        return onEquipMap;
    }

    /**
     * ?????????????????????
     */
    public getGradeBetterEquipMap(gradeId: number, bigLv: number, onEquipPartMap?: Map<number, ItemModel>): Map<number, ItemModel> {
        const betterEquipMap: Map<number, ItemModel> = new Map();
        const itemType = this.getGradeEquipType(gradeId);
        // ??????????????????
        if (!onEquipPartMap) {
            onEquipPartMap = this.getGradeOnEquipPartMap(gradeId);
        }
        for (let i = 0; i < GRADE_EQUIP_PART_NUM; i++) {
            const part = i + 1;
            // ????????????????????????
            const unEquipMap = BagMgr.I.getUnEquipPartMapByBagType(ItemBagType.GENERAL, itemType, part);
            if (unEquipMap.size === 0) {
                continue;
            }

            const list: ItemModel[] = [];
            const onEquip = onEquipPartMap.get(part);
            unEquipMap.forEach((v) => {
                if (onEquip) {
                    // ???????????????????????????????????????????????????????????????????????????
                    if ((v.cfg.Level >= onEquip.cfg.Level && v.cfg.Level <= bigLv)
                        && onEquip.fightValue < v.fightValue) {
                        list.push(v);
                    }
                } else if (v.cfg.Level <= bigLv) {
                    list.push(v);
                }
            });
            list.sort((a, b) => b.fightValue - a.fightValue);
            if (list.length > 0) {
                // ?????????????????????
                betterEquipMap.set(part, list[0]);
            }
        }
        return betterEquipMap;
    }

    /**
     * ???????????????????????????????????????
     * @param gradeId
     * @param part
     * @returns Cfg_Item | null
     */
    public getMinEquipPartCfg(gradeId: number, part: number): Cfg_Item | null {
        const itemType = this.getGradeEquipType(gradeId);
        return UtilItem.GetCfgItemByTPQL(itemType, part, GRADE_EQUIP_MIN_QUALITY, GRADE_MIN_LEVEL);
    }

    // /**
    //  * ???????????????????????????
    //  * @param gradeId
    //  * @param part
    //  * @returns string
    //  */
    // public getGradeEquipPartName(gradeId: number, part: number): string {
    //     return i18n.tt(Lang[`grade_equip_part_${gradeId}_${part}_name`]);
    // }

    /**
     * ??????????????????????????????
     * @param upInfos
     * @param skinId
     * @returns IntAttr1 | null K?????????ID???V1????????????V2?????????????????????
     */
    public getGradeSkinUpInfo(gradeId: number, skinId: number): IntAttr1 | null {
        const gradeData = this.getGradeData(gradeId);
        if (!gradeData) return null;
        const upInfos = gradeData.GradeSkin.SkinLv || [];
        if (upInfos && upInfos.length > 0 && skinId) {
            for (let i = 0; i < upInfos.length; i++) {
                const info = upInfos[i];
                if (info.K === skinId) {
                    return info;
                }
            }
        }
        return null;
    }

    /**
     * ??????????????????????????????
     * @param gradeId
     * @param skinId
     * @returns AttrInfo
     */
    public getGradeSkinAttrInfo(gradeId: number, skinId: number): AttrInfo;
    /**
     * ??????????????????????????????
     * @param gradeId
     * @param attrId
     * @param star
     * @returns AttrInfo
     */
    public getGradeSkinAttrInfo(gradeId: number, attrId: number, star: number): AttrInfo;
    public getGradeSkinAttrInfo(...param: unknown[]): AttrInfo {
        const gradeId = param[0] as number;
        let attrId = 0;
        let star = 0;
        if (param.length === 3) {
            attrId = param[1] as number;
            star = param[2] as number;
        } else {
            const skinId = param[1] as number;
            // ????????????
            const skinCfg = this.getGradeSkinCfgById(skinId);
            if (skinCfg) {
                attrId = skinCfg.AttrId;
            }
            // ??????????????????
            const skinUpInfo = this.getGradeSkinUpInfo(gradeId, skinId);
            if (skinUpInfo) {
                star = skinUpInfo.V1;
            }
        }
        const attrInfo = AttrModel.MakeAttrInfo(attrId);
        if (attrId) {
            if (star > 0) {
                const cfgStar = this.getGradeSkinStarCfg(gradeId, star);
                const ratio = (cfgStar.TotalRatio - (cfgStar.MaxLevel - star) * cfgStar.AttrRatio) / 10000;
                attrInfo.mul(ratio || 1);
            }
        }
        return attrInfo;
    }

    /**
     * ???????????????????????????????????????
     * @param gradeId
     * @param lv
     * @returns Cfg_GradeSkin | null
     */
    public getGradeSkinCfgByLevel(gradeId: number, lv: number): Cfg_GradeSkin | null {
        const gradeCfg = GradeMgr.I.getGradeCfg(gradeId, lv);
        return GradeMgr.I.getGradeSkinCfgById(gradeCfg.SkinId);
    }

    /**
     * ?????????????????????????????????ID
     * @param gradeId
     * @returns number
     */
    public getGradeMorphSkinId(gradeId: number): number {
        switch (gradeId) {
            case GradeType.HORSE: return RoleMgr.I.d.GradeHorse;
            case GradeType.WING: return RoleMgr.I.d.GradeWing;
            case GradeType.WEAPON: return RoleMgr.I.d.GradeWeapon;
            case GradeType.PET: return RoleMgr.I.d.GradePet;
            default: return 0;
        }
    }

    /**
     * ????????????????????????
     * @param gradeId
     * @param skinId
     * @returns number -1???????????????0???????????????1????????????
     */
    public getGradeSkinState(gradeId: number, skinId: number): number {
        const skinCfg = this.getGradeSkinCfgById(skinId);
        if (skinCfg) {
            const morphSkinId = this.getGradeMorphSkinId(gradeId);
            if (skinId === morphSkinId) {
                return 1;
            } if (skinCfg.AttrId) { // ?????????ID?????????????????????
                // ??????????????????????????????
                const skinUpInfo = this.getGradeSkinUpInfo(gradeId, skinId);
                if (skinUpInfo) {
                    return 0;
                }
            } else { // ????????????ID?????????????????????
                // ??????????????????????????????
                const gradeCfg = this.getGradeCfgBySkinId(gradeId, skinId);
                if (gradeCfg) {
                    // ??????????????????????????????????????????
                    const data = this.getGradeData(gradeId);
                    if (gradeCfg.Level <= data.GradeLv.BigLv) {
                        return 0;
                    }
                }
            }
        }
        return -1;
    }

    /**
     * ?????????????????????
     * @param equipSys ????????????
     * @returns
     */
    public isGradeEqiup(equipSys: ItemType): boolean {
        switch (equipSys) {
            case ItemType.EQUIP_HORSE:
            case ItemType.EQUIP_WING:
            case ItemType.EQUIP_WEAPON:
            case ItemType.EQUIP_BEAUTY:
            case ItemType.EQUIP_ADVISER:
            case ItemType.EQUIP_PET:
                return true;
            default:
                return false;
        }
    }

    /** ?????????????????????????????? */
    public getGradeEquipTypes(): ItemType[] {
        return [ItemType.EQUIP_HORSE, ItemType.EQUIP_WING, ItemType.EQUIP_WEAPON, ItemType.EQUIP_BEAUTY, ItemType.EQUIP_ADVISER, ItemType.EQUIP_PET];
    }

    /**
     * ????????????ID????????????????????????
     * @param gradeId
     * @returns number
     */
    public getGradeIdBySubType(subType: number): number {
        switch (subType) {
            case ItemType.EQUIP_HORSE: return GradeType.HORSE;
            case ItemType.SKIN_HORSE: return GradeType.HORSE;
            case ItemType.EQUIP_WING: return GradeType.WING;
            case ItemType.SKIN_WING: return GradeType.WING;
            case ItemType.EQUIP_WEAPON: return GradeType.WEAPON;
            case ItemType.SKIN_WEAPON: return GradeType.WEAPON;
            case ItemType.EQUIP_BEAUTY: return FuncId.BeautyGrade;
            case ItemType.EQUIP_ADVISER: return FuncId.AdviserGrade;
            case ItemType.EQUIP_PET: return GradeType.PET;
            case ItemType.SKIN_PET: return GradeType.PET;
            default: return GradeType.HORSE;
        }
    }

    /**
     * ?????????????????????(???????????????)
     * @param gradeId
     * @returns
     */
    public getGradeSkinCfgListWithActive(gradeId: number): Cfg_GradeSkin[] {
        const list: Cfg_GradeSkin[] = [];
        // ??????????????????????????????
        const data = this.getGradeData(gradeId);
        if (gradeId === FuncId.BeautyGrade) {
            for (let lv = 1; lv <= data.GradeLv.BigLv; lv++) {
                const cfg = this.getGradeCfg(gradeId, lv);
                const cfgSkin: Cfg_GradeSkin = this.getGradeSkinCfgById(cfg?.SkinId);
                if (cfgSkin) {
                    list.push(cfgSkin);
                }
            }
        } else {
            const activeList = data.GradeSkin.SkinLv;
            for (let i = 0; i < activeList.length; i++) {
                const element = activeList[i];
                const cfg: Cfg_GradeSkin = this.getGradeSkinCfgById(element.K);
                if (cfg) {
                    list.push(cfg);
                }
            }
        }
        return list;
    }

    /**
     *
     * @param skillCfg ??????????????????
     * @returns {??????????????????????????????????????????????????????????????????????????????????????? }
     */
    public getItemInfo(skillCfg: Cfg_GradeSkill_Unit): { itemData: ItemModel[]; itemNum: number[]; needNum: number[] } {
        // ?????????????????? ?????????????????????????????????????????????
        const itemData: ItemModel[] = [];
        const itemList = skillCfg.NeedItem.split('|');
        const itemNum: number[] = [];
        const needNum: number[] = [];
        itemList.forEach((v) => {
            const itemStr = v.split(':');
            const bagNum = BagMgr.I.getItemNum(parseInt(itemStr[0]));
            const needN = parseInt(itemStr[1]);
            itemNum.push(bagNum);
            needNum.push(needN);
            itemData.push(UtilItem.NewItemModel(parseInt(itemStr[0]), parseInt(itemStr[1])));
        });
        return {
            itemData, itemNum, needNum,
        };
    }

    /**
     * ?????????????????????????????????????????????????????????????????????????????????
     */
    public checkRed(): void {
        // const redDotMap: Map<number, boolean> = new Map();
        this._gradeDataMap.forEach((v) => {
            const gradeId = v.GradeId;
            this.checkRedUp(gradeId, v);
            this.checkRedSkill(gradeId, v);
            this.ckeckRedSould(gradeId, v);
            this.checkRedGod(gradeId, v);
            this.checkRedGradeGift(gradeId, v);
            this.checkRedGradeEquip(gradeId, v);
            this.checkRedSkin(gradeId, v);
            this.checkRedbeGold(gradeId, v);
        });
    }

    /**
     * ????????????????????????
     * @param gradeId
     * @param gradeData
     */
    public checkRedUp(gradeId: number, gradeData: GradeData): void {
        const model = this.getGradeModel(gradeId);
        let hasUpStarRed = false;
        let hasUpStarOneKeyRed = false;
        let hasUpLevelRed = false;
        const level = gradeData.GradeLv.BigLv;
        const star = gradeData.GradeLv.SmallLv;
        if (model.cfg && level <= GRADE_MAX_LEVEL && star <= GRADE_MAX_STAR) {
            if (level !== GRADE_MAX_LEVEL || star !== GRADE_MAX_STAR) {
                if (star === GRADE_MAX_STAR && gradeData.GradeLv.Exp === model.cfg.TotalExp) {
                    hasUpLevelRed = true;
                } else {
                    // ?????????????????????
                    const [itemId, itemNum] = UtilItem.ParseItemStr(model.cfg.NeedItem);
                    const own = BagMgr.I.getItemNum(itemId);
                    hasUpStarRed = own >= itemNum;

                    // ?????????????????????
                    const nextLvNum = (model.cfg.TotalExp - model.data.GradeLv.Exp) / model.cfg.SingleExp * itemNum;
                    hasUpStarOneKeyRed = own >= nextLvNum;
                }
            }
        }
        if (gradeId === GradeType.HORSE) {
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Up.UP_STAR, hasUpStarRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Up.UP_LEVEL, hasUpLevelRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Up.UP_STAR_ONEKEY, hasUpStarOneKeyRed);
        } else if (gradeId === GradeType.WING) {
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Up.UP_STAR, hasUpStarRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Up.UP_LEVEL, hasUpLevelRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Up.UP_STAR_ONEKEY, hasUpStarOneKeyRed);
        } else if (gradeId === GradeType.WEAPON) {
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Up.UP_STAR, hasUpStarRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Up.UP_LEVEL, hasUpLevelRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Up.UP_STAR_ONEKEY, hasUpStarOneKeyRed);
        } else if (gradeId === FuncId.BeautyGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Up.UP_STAR, hasUpStarRed);
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Up.UP_LEVEL, hasUpLevelRed);
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Up.UP_STAR_ONEKEY, hasUpStarOneKeyRed);
        } else if (gradeId === FuncId.AdviserGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Up.UP_STAR, hasUpStarRed);
            RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Up.UP_LEVEL, hasUpLevelRed);
            RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Up.UP_STAR_ONEKEY, hasUpStarOneKeyRed);
        } else if (gradeId === GradeType.PET) {
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Up.UP_STAR, hasUpStarRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Up.UP_LEVEL, hasUpLevelRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Up.UP_STAR_ONEKEY, hasUpStarOneKeyRed);
        }
    }

    /**
     * ??????????????????
     * @param gradeId
     * @param gradeData
     */
    public checkRedSkill(gradeId: number, gradeData: GradeData): void {
        const model = this.getGradeModel(gradeId);
        // ?????????????????????????????????????????????, ??????????????????????????????
        let hasSkillRed = false;
        // for (let i = 0, len = model.skillsCfg.length; i < len; i++) {
        if (model.skillsCfg) {
            const skillCfg = model.skillsCfg[0];
            const intAttr = UtilGame.GetIntAttrByKey(gradeData.GradeSkill.Skills, skillCfg.Part);
            const level = intAttr ? intAttr.V : 0;
            const limitLv = GradeMgr.I.getGradeSkillPartOpenLv(gradeId, skillCfg.Part);
            const unlockSkill = model.cfg.Level >= limitLv;
            const cfgLenght = GradeMgr.I.getGradeSkillCfgIndexer(gradeId).length;
            const levelMax: boolean = level >= cfgLenght;
            if (levelMax) {
                // ??????
                hasSkillRed = false;
            } else if (level <= 0) {
                // ?????????
                hasSkillRed = unlockSkill;
            } else {
                const nextItemCfg = GradeMgr.I.getGradeSkillCfg(gradeId, skillCfg.Part, levelMax ? level : level + 1);
                const itemInfo = this.getItemInfo(nextItemCfg);
                const itemOk = itemInfo.itemNum[0] < itemInfo.needNum[0];
                hasSkillRed = !itemOk;
            }
        }
        if (gradeId === GradeType.HORSE) {
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Up.SKILL, hasSkillRed);
        }
        if (gradeId === GradeType.WING) {
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Up.SKILL, hasSkillRed);
        }
        if (gradeId === GradeType.WEAPON) {
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Up.SKILL, hasSkillRed);
        }
        if (gradeId === FuncId.BeautyGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Up.SKILL, hasSkillRed);
        }
        if (gradeId === FuncId.AdviserGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Up.SKILL, hasSkillRed);
        }
        if (gradeId === GradeType.PET) {
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Up.SKILL, hasSkillRed);
        }
    }

    /**
     * ??????????????????
     * @param gradeId
     * @param GradeData
     */
    public ckeckRedSould(gradeId: number, GradeData: GradeData): void {
        let hasSoulRed = false;
        const nextSoulLv = GradeData.GradeSoul.Level + 1;
        if (nextSoulLv < GRADE_SOUL_MAX_LEVEL) {
            const zlNextLv = nextSoulLv;
            const zlNextCfg = this.getGradeZLCfg(zlNextLv);
            if (zlNextCfg) {
                const addExp = zlNextCfg.EXP - GradeData.GradeSoul.Exp;
                if (addExp > 0) {
                    const gradeItemCfg = GradeMgr.I.getGradeItemCfgById(gradeId);
                    const zlItemNum = BagMgr.I.getItemNum(gradeItemCfg?.ZLItem);
                    if (zlItemNum > 0) {
                        const itemExp = zlItemNum * gradeItemCfg.ZLExp;
                        hasSoulRed = itemExp >= addExp;
                    }
                }
            }
        }
        if (gradeId === GradeType.HORSE) {
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Up.SOUL, hasSoulRed);
        } else if (gradeId === GradeType.WING) {
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Up.SOUL, hasSoulRed);
        } else if (gradeId === GradeType.WEAPON) {
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Up.SOUL, hasSoulRed);
        } else if (gradeId === FuncId.BeautyGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Up.SOUL, hasSoulRed);
        } else if (gradeId === FuncId.AdviserGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Up.SOUL, hasSoulRed);
        } else if (gradeId === GradeType.PET) {
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Up.SOUL, hasSoulRed);
        }
    }

    /**
     *  ??????????????????
     * @param gradeId
     * @param GradeData
     */
    public checkRedGod(gradeId: number, GradeData: GradeData): void {
        // ???????????????>0????????????????????????????????????????????????????????????????????????
        let hasGodRed = false;
        const gradeItemCfg = GradeMgr.I.getGradeItemCfgById(gradeId);
        const lsItemNum = BagMgr.I.getItemNum(gradeItemCfg?.LSItem);
        const activeList = this.getGradeSkinCfgListWithActive(gradeId);
        let lsMaxLv = 0;
        for (let i = 0, len = activeList.length; i < len; i++) {
            const element = activeList[i];
            lsMaxLv += element.LianshenUp;
        }
        hasGodRed = lsItemNum > 0 && GradeData.GradeGod.Num < lsMaxLv;
        if (gradeId === GradeType.HORSE) {
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Up.GOD, hasGodRed);
        } else if (gradeId === GradeType.WING) {
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Up.GOD, hasGodRed);
        } else if (gradeId === GradeType.WEAPON) {
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Up.GOD, hasGodRed);
        } else if (gradeId === FuncId.BeautyGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Up.GOD, hasGodRed);
        } else if (gradeId === FuncId.AdviserGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Up.GOD, hasGodRed);
        } else if (gradeId === GradeType.PET) {
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Up.GOD, hasGodRed);
        }
    }

    /**
     * ????????????????????????
     * @param gradeId
     * @param GradeData
     */
    public checkRedGradeGift(gradeId: number, GradeData: GradeData): void {
        // ??????????????????????????????????????????????????????????????????????????????
        let hasJJHLRed = false; // ??????????????????????????????????????????
        const jjhlCfg = GradeMgr.I.getGradeJJHLCfgList(gradeId);
        for (let i = 0, len = jjhlCfg.length; i < len; i++) {
            const element = jjhlCfg[i];
            if (element.TargetLevel <= GradeData.GradeLv.BigLv) {
                if (!GradeData.GradeLv.UpGift || !GradeData.GradeLv.UpGift.includes(element.Key)) {
                    hasJJHLRed = true;
                }
            }
        }
        if (gradeId === GradeType.HORSE) {
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Up.JJHL, hasJJHLRed);
            RedDotMgr.I.updateRedDot(RID.GradeGift.Horse, hasJJHLRed);
        } else if (gradeId === GradeType.WING) {
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Up.JJHL, hasJJHLRed);
            RedDotMgr.I.updateRedDot(RID.GradeGift.Wing, hasJJHLRed);
        } else if (gradeId === GradeType.WEAPON) {
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Up.JJHL, hasJJHLRed);
            RedDotMgr.I.updateRedDot(RID.GradeGift.Weapon, hasJJHLRed);
        } else if (gradeId === FuncId.BeautyGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Up.JJHL, hasJJHLRed);
            RedDotMgr.I.updateRedDot(RID.GradeGift.Beauty, hasJJHLRed);
        } else if (gradeId === FuncId.AdviserGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Up.JJHL, hasJJHLRed);
            RedDotMgr.I.updateRedDot(RID.GradeGift.Adviser, hasJJHLRed);
        } else if (gradeId === GradeType.PET) {
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Up.JJHL, hasJJHLRed);
            RedDotMgr.I.updateRedDot(RID.GradeGift.Pet, hasJJHLRed);
        }
    }

    /**
     * ????????????????????????
     * @param gradeId
     * @param GradeData
     */
    public checkRedGradeEquipOne(gradeId: number, GradeData: GradeData, part: number): boolean {
        let isR = false;
        const model = this.getGradeModel(gradeId);
        const onEquipPartMap = GradeMgr.I.getGradeOnEquipPartMap(gradeId);
        const betterEquipMap = GradeMgr.I.getGradeBetterEquipMap(gradeId, GradeData.GradeLv.BigLv, onEquipPartMap);
        isR = betterEquipMap.has(part);
        if (!isR) {
            isR = this._checkRedGradeEquipOne(model, part, onEquipPartMap.get(part));
        }
        return isR;
    }

    /**
     *
     * @param model ??????model
     * @param part ??????
     * @param itemEquip ?????????????????????
     * @returns
     */
    private _checkRedGradeEquipOne(model: GradeModel, part: number, itemEquip: ItemModel) {
        const intAttr: IntAttr = UtilGame.GetIntAttrByKey(model.data.GradeEquip.PosLv, part);
        const strengthLv = intAttr ? intAttr.V : 0;
        // ?????????????????????????????????????????????????????????
        const minLv = Math.max(1, Math.min(strengthLv, GRADE_STRENGTH_MAX_LEVEL));
        const cfg = GradeMgr.I.getGradeStrengthCfg(part, minLv);
        if (cfg && strengthLv < cfg.LevelMax) {
            const jie = model.data.GradeLv.BigLv;
            const next_cfg = GradeMgr.I.getGradeStrengthCfg(part, minLv + 1);
            const isCanUp = next_cfg && next_cfg.LevelCondition <= jie;
            if (isCanUp) {
                const [itemId, itemNum] = UtilItem.ParseItemStr(next_cfg.NeedItem);
                const own = BagMgr.I.getItemNum(itemId);
                if (own >= itemNum) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * ???????????????????????????
     * @param cfg ????????????
     * @param part ??????
     * @param curLv ?????????????????????
     * @param maxLv ?????????????????????????????????
     * @param equipMap ????????????map???
     * @returns
     */
    private isCanStrength(cfg: Cfg_GradeStrength, part: number, curLv: number, maxLv: number, equipMap: Map<number, ItemModel>) {
        if (cfg) {
            let isCanUp = true;
            if (curLv === cfg.LevelMax) {
                const maxJie = maxLv;
                const next_cfg = GradeMgr.I.getGradeStrengthCfg(part, curLv + 1);
                const curE = equipMap.get(part);
                isCanUp = next_cfg && next_cfg.LevelCondition <= maxJie && curE.cfg.Level >= next_cfg.LevelCondition && curE.cfg.Level <= maxJie;
            }
            if (isCanUp) {
                const [itemId, itemNum] = UtilItem.ParseItemStr(cfg.NeedItem);
                const own = BagMgr.I.getItemNum(itemId);
                if (own >= itemNum) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * ??????????????????
     * @param gradeId
     * @param GradeData
     */
    public checkRedGradeEquip(gradeId: number, GradeData: GradeData): void {
        const model = this.getGradeModel(gradeId);
        // ????????????/?????????????????????????????????????????????
        let hasEquipRed = false;
        let hasStrengthRed = false;
        const onEquipPartMap = GradeMgr.I.getGradeOnEquipPartMap(gradeId);
        const betterEquipMap = GradeMgr.I.getGradeBetterEquipMap(gradeId, GradeData.GradeLv.BigLv, onEquipPartMap);
        hasEquipRed = betterEquipMap.size > 0;
        if (onEquipPartMap.size > 0) {
            for (const equip of onEquipPartMap.values()) {
                if (this._checkRedGradeEquipOne(model, equip.cfg.EquipPart, onEquipPartMap.get(equip.cfg.EquipPart))) {
                    hasStrengthRed = true;
                    break;
                }
            }
        }

        if (gradeId === GradeType.HORSE) {
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Equip.BETTER, hasEquipRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Equip.STRENGTH, hasStrengthRed);
        } else if (gradeId === GradeType.WING) {
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Equip.BETTER, hasEquipRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Equip.STRENGTH, hasStrengthRed);
        } else if (gradeId === GradeType.WEAPON) {
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Equip.BETTER, hasEquipRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Equip.STRENGTH, hasStrengthRed);
        } else if (gradeId === FuncId.BeautyGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Equip.BETTER, hasEquipRed);
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Equip.STRENGTH, hasStrengthRed);
        } else if (gradeId === FuncId.AdviserGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Equip.BETTER, hasEquipRed);
            RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Equip.STRENGTH, hasStrengthRed);
        } else if (gradeId === GradeType.PET) {
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Equip.BETTER, hasEquipRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Equip.STRENGTH, hasStrengthRed);
        }
    }

    /** ?????????????????? */
    public checkRedbeGold(gradeId: number, GradeData: GradeData): void {
        // ???????????????????????????????????????????????????????????????
        let hasBeGoldRed = false;
        const onEquipPartMap = GradeMgr.I.getGradeOnEquipPartMap(gradeId);
        const hjEquips: ItemModel[] = []; // ???????????????????????????
        onEquipPartMap.forEach((v) => {
            if (v.cfg.Level === GRADE_MAX_LEVEL && v.cfg.Quality >= ItemQuality.RED) {
                hjEquips.push(v);
            }
        });
        const hjEquipsLen = hjEquips.length;
        if (hjEquipsLen > 0) {
            for (let i = 0; i < hjEquipsLen; i++) {
                const beGoldePath: boolean[] = [];
                const element = hjEquips[i];
                const part = element.cfg.EquipPart;
                const intAttr = UtilGame.GetIntAttrByKey(GradeData.GradeBeGold.PosLv, part);
                const nextLv = (intAttr ? intAttr.V : 0) + 1;
                let canBeGold = nextLv <= GRADE_MAX_LEVEL;
                if (canBeGold) {
                    const nextGoldData = GradeMgr.I.getGradeHJCfg(gradeId, part, nextLv);
                    const itemList = UtilItem.ParseAwardItems(nextGoldData.CostItem);
                    // ??????????????????
                    for (let j = 0, len = itemList.length; j < len; j++) {
                        const item = itemList[j];
                        const ownNum = BagMgr.I.getItemNum(item.data.ItemId);
                        beGoldePath.push(ownNum >= item.data.ItemNum);
                    }
                }
                beGoldePath.forEach((v) => {
                    canBeGold = canBeGold && v;
                });
                console.log(beGoldePath, canBeGold);
                if (canBeGold) {
                    hasBeGoldRed = true;
                    break;
                }
            }
        }
        if (gradeId === GradeType.HORSE) {
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Equip.BE_GOLD, hasBeGoldRed);
        } else if (gradeId === GradeType.WING) {
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Equip.BE_GOLD, hasBeGoldRed);
        } else if (gradeId === GradeType.WEAPON) {
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Equip.BE_GOLD, hasBeGoldRed);
        } else if (gradeId === FuncId.BeautyGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Beauty.Grade.Equip.BE_GOLD, hasBeGoldRed);
        } else if (gradeId === FuncId.AdviserGrade) {
            RedDotMgr.I.updateRedDot(RID.Forge.Adviser.Grade.Equip.BE_GOLD, hasBeGoldRed);
        } else if (gradeId === GradeType.PET) {
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Equip.BE_GOLD, hasBeGoldRed);
        }
    }

    /**
     * ????????????????????????
     * @param gradeId
     * @param GradeData
     */
    public checkRedSkin(gradeId: number, GradeData: GradeData): void {
        // ????????????????????????????????????????????????????????????????????????????????????
        let hasActiveSkinRed = false;
        let hasUpStarSkinRed = false;
        const skinCfgTabMap = GradeMgr.I.getGradeSkinCfgTabMap(gradeId);
        for (const skinCfgList of skinCfgTabMap.values()) {
            for (let i = 0, len = skinCfgList.length; i < len; i++) {
                const element = skinCfgList[i];
                const count = BagMgr.I.getItemNum(element.NeedItem);
                if (count > 0) {
                    const intAttr = UtilGame.GetIntAttrByKey(GradeData.GradeSkin.SkinLv, element.Key);
                    const lv = intAttr ? intAttr.V1 : 0;
                    hasActiveSkinRed = hasActiveSkinRed || lv === 0;
                    const costNum = GradeMgr.I.getGradeSkinStarCfg(gradeId, lv).LevelUpItem;
                    // hasUpStarSkinRed = hasUpStarSkinRed || lv > 0; // ?????????????????????????????????
                    hasUpStarSkinRed = count >= costNum && lv > 0;
                }
            }
        }

        if (gradeId === GradeType.HORSE) {
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Skin.ACTIVE, hasActiveSkinRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Horse.Skin.UP_STAR, hasUpStarSkinRed);
        } else if (gradeId === GradeType.WING) {
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Skin.ACTIVE, hasActiveSkinRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Wing.Skin.UP_STAR, hasUpStarSkinRed);
        } else if (gradeId === GradeType.WEAPON) {
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Skin.ACTIVE, hasActiveSkinRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Weapon.Skin.UP_STAR, hasUpStarSkinRed);
        } else if (gradeId === GradeType.PET) {
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Skin.ACTIVE, hasActiveSkinRed);
            RedDotMgr.I.updateRedDot(RID.Grade.Pet.Skin.UP_STAR, hasUpStarSkinRed);
        }
    }

    /**
     * ????????????????????????ID
     * @param itemId ??????ID
     * @param subType ???????????????
     * @returns Cfg_GradeSkin | null
     */
    public getGradeSkinAnimIdByItemId(itemId: number, subType: number): Cfg_GradeSkin | null {
        const gradeId = this.getGradeIdBySubType(subType);
        const indexer: ConfigGradeSkinIndexer = Config.Get(ConfigConst.Cfg_GradeSkin);
        const indexs = indexer.getIndexsByFuncId(gradeId);
        for (let i = 0, len = indexs.length; i < len; i++) {
            const cfg: Cfg_GradeSkin = indexer.getValueByIndex(indexs[i]);
            if (cfg.NeedItem === itemId) {
                return cfg;
            }
        }
        return null;
    }

    /**
     * ??????????????????????????????
     */
    public getGradeAllAttr(gradeId: number): { title: string, attr: string[] }[] {
        const allAttr: { title: string, attr: string[] }[] = [];

        let gradeHead: string = '';
        // ??????????????????
        switch (gradeId) {
            case FuncId.Horse: /** ?????? */
                gradeHead = i18n.tt(Lang.grade_tab_horse);// ??????
                break;
            case FuncId.Wing:/** ?????? */
                gradeHead = i18n.tt(Lang.grade_111_up_attr);// ??????
                break;
            case FuncId.Weapon:
                gradeHead = i18n.tt(Lang.grade_121_up_attr);// ??????
                break;
            case FuncId.BeautyGrade:
                gradeHead = i18n.tt(Lang.beauty_grade_up_attr);
                break;
            case FuncId.AdviserGrade:
                gradeHead = i18n.tt(Lang.adviser_grade_up_attr);
                break;
            default: gradeHead = '';
        }

        // ????????????/??????/??????????????????
        const gradeTitel: string = `${gradeHead}????????????`;
        allAttr.push({ title: gradeTitel, attr: ['a'] });
        // ??????????????????

        // ??????????????????

        // ??????????????????

        // ??????????????????

        // ??????????????????

        // ??????????????????

        // ????????????????????????????????? ??????????????????
        return allAttr;
    }

    /**
     * ????????????????????????id
     * @returns { tabIdx: number, tabId: number } ??????id?????????id,wintabId???
     */
    public getRedPageIdx(): { tabId: number, tabIdx: number, wintabId } {
        let tabIdx = 0;
        let tabId = 0;
        let wintabId = GradeType.HORSE;
        if (RedDotMgr.I.getStatus(RID.Grade.Horse.Id)) {
            tabId = 0;
            wintabId = GradeType.HORSE;
            if (RedDotMgr.I.getStatus(RID.Grade.Horse.Up.Id)) {
                tabIdx = 1;
            } else if (RedDotMgr.I.getStatus(RID.Grade.Horse.Equip.Id)) {
                tabIdx = 2;
            } else if (RedDotMgr.I.getStatus(RID.Grade.Horse.Skin.Id)) {
                tabIdx = 3;
            }
        } else if (RedDotMgr.I.getStatus(RID.Grade.Wing.Id)) {
            tabId = 1;
            wintabId = GradeType.WING;
            if (RedDotMgr.I.getStatus(RID.Grade.Wing.Up.Id)) {
                tabIdx = 1;
            } else if (RedDotMgr.I.getStatus(RID.Grade.Wing.Equip.Id)) {
                tabIdx = 2;
            } else if (RedDotMgr.I.getStatus(RID.Grade.Wing.Skin.Id)) {
                tabIdx = 3;
            }
        } else if (RedDotMgr.I.getStatus(RID.Grade.Weapon.Id)) {
            tabId = 2;
            wintabId = GradeType.WEAPON;
            if (RedDotMgr.I.getStatus(RID.Grade.Weapon.Up.Id)) {
                tabIdx = 1;
            } else if (RedDotMgr.I.getStatus(RID.Grade.Weapon.Equip.Id)) {
                tabIdx = 2;
            } else if (RedDotMgr.I.getStatus(RID.Grade.Weapon.Skin.Id)) {
                tabIdx = 3;
            }
        } else if (RedDotMgr.I.getStatus(RID.Grade.Pet.Id)) {
            tabId = 2;
            wintabId = GradeType.PET;
            if (RedDotMgr.I.getStatus(RID.Grade.Pet.Up.Id)) {
                tabIdx = 1;
            } else if (RedDotMgr.I.getStatus(RID.Grade.Pet.Equip.Id)) {
                tabIdx = 2;
            } else if (RedDotMgr.I.getStatus(RID.Grade.Pet.Skin.Id)) {
                tabIdx = 3;
            }
        }
        return { tabId, tabIdx, wintabId };
    }

    // ????????????????????????????????????
    public getGradeAutoPay(gradeId: number): boolean {
        switch (gradeId) {
            case GradeType.HORSE:
                return this._GradeAutoPay.Horse;
            case GradeType.WING:
                return this._GradeAutoPay.Wing;
            case GradeType.WEAPON:
                return this._GradeAutoPay.Weapon;
            case FuncId.BeautyGrade:
                return this._GradeAutoPay.Beauty;
            case FuncId.AdviserGrade:
                return this._GradeAutoPay.Adviser;
            case GradeType.PET:
                return this._GradeAutoPay.Pet;
            default:
                cc.warn(`?????????${gradeId}??????????????????`);
                return false;
        }
    }

    // ????????????????????????????????????
    public setGradeAutoPay(gradeId: number, autoSw: boolean): void {
        switch (gradeId) {
            case GradeType.HORSE:
                this._GradeAutoPay.Horse = autoSw;
                return;
            case GradeType.WING:
                this._GradeAutoPay.Wing = autoSw;
                return;
            case GradeType.WEAPON:
                this._GradeAutoPay.Weapon = autoSw;
                return;
            case FuncId.BeautyGrade:
                this._GradeAutoPay.Beauty = autoSw;
                return;
            case GradeType.PET:
                this._GradeAutoPay.Pet = autoSw;
                return;
            default:
                cc.warn(`?????????${gradeId}??????????????????`);
        }
    }

    // ??????????????????????????????
    public listeningGradeItem(sw: boolean): void {
        const gradeIds: number[] = this.getGradeIdList();
        // ?????????????????????????????????
        gradeIds.forEach((gradeId) => {
            const _gradeMode = this.getGradeModel(gradeId);
            if (_gradeMode.cfg) {
                const _gradeItemCfg = GradeMgr.I.getGradeItemCfgById(gradeId);

                // ?????????
                const gradeDangId = _gradeMode.cfg.NeedItem.split(':')[0];
                // ?????????
                const souldDangId = _gradeItemCfg.ZLItem;
                // ?????????
                const godDangId = _gradeItemCfg.LSItem;
                // ?????????
                const skillBook = _gradeMode.skillsCfg[0].NeedItem.split(':')[0];
                // GradeMgr.I.getGradeSkillCfg(gradeId, _gradeMode.cfg.SkillPart, _gradeMode.cfg.Level).NeedItem.split(':')[0];
                // ???????????????????????????
                if (sw) {
                    EventClient.I.on(`${E.Bag.ItemChangeOfId}${gradeDangId}`, this.emitItemGradeDang, this);
                    EventClient.I.on(`${E.Bag.ItemChangeOfId}${souldDangId}`, this.emitItemSould, this);
                    EventClient.I.on(`${E.Bag.ItemChangeOfId}${godDangId}`, this.emitItemGod, this);
                    EventClient.I.on(`${E.Bag.ItemChangeOfId}${skillBook}`, this.emitSkillBook, this);
                } else {
                    EventClient.I.off(`${E.Bag.ItemChangeOfId}${gradeDangId}`, this.emitItemGradeDang, this);
                    EventClient.I.off(`${E.Bag.ItemChangeOfId}${souldDangId}`, this.emitItemSould, this);
                    EventClient.I.off(`${E.Bag.ItemChangeOfId}${godDangId}`, this.emitItemGod, this);
                    EventClient.I.off(`${E.Bag.ItemChangeOfId}${skillBook}`, this.emitSkillBook, this);
                }
            }
        });
    }

    private emitItemGradeDang(): void {
        EventClient.I.emit(E.Grade.GradeItemNumChange.GradeDang);
    }

    private emitItemSould(): void {
        EventClient.I.emit(E.Grade.GradeItemNumChange.SoulDang);
    }

    private emitItemGod(): void {
        EventClient.I.emit(E.Grade.GradeItemNumChange.GodDang);
    }

    private emitSkillBook(): void {
        // ??????????????????tips ui???????????????????????????
        console.log('??????????????????????????????');
        EventClient.I.emit(E.Grade.GradeItemNumChange.SkillBook);
    }

    // ????????????????????????
    public ListeningEquipItem(sw: boolean): void {
        // ???????????????????????????
        const cfg = GradeMgr.I.getGradeStrengthCfg(1, 1);
        let itemId = 210201;
        if (cfg) {
            itemId = UtilItem.ParseItemStr(cfg.NeedItem)[0];
        }
        if (sw) {
            EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_HORSE}`, this.emitEquipChange, this);
            EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_WING}`, this.emitEquipChange, this);
            EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_WEAPON}`, this.emitEquipChange, this);
            EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_BEAUTY}`, this.emitEquipChange, this);
            EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_ADVISER}`, this.emitEquipChange, this);
            EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_PET}`, this.emitEquipChange, this);
            EventClient.I.on(`${E.Bag.ItemChangeOfId}${itemId}`, this.emitEquipItem, this);
        } else {
            EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_HORSE}`, this.emitSkinChanges, this);
            EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_WING}`, this.emitSkinChanges, this);
            EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_WEAPON}`, this.emitSkinChanges, this);
            EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_BEAUTY}`, this.emitSkinChanges, this);
            EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_ADVISER}`, this.emitEquipChange, this);
            EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.EQUIP_PET}`, this.emitEquipChange, this);
            EventClient.I.off(`${E.Bag.ItemChangeOfId}${itemId}`, this.emitEquipItem, this);
        }
    }

    public emitEquipChange(): void {
        EventClient.I.emit(E.Grade.GradeEquipChange);
    }

    public emitEquipItem(): void {
        EventClient.I.emit(E.Grade.GradeEquipItemNum);
    }

    // ??????????????????
    public ListeningSkinItem(sw: boolean): void {
        // ??????????????????
        if (sw) {
            EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.SKIN_HORSE}`, this.emitSkinChanges, this);
            EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.SKIN_WING}`, this.emitSkinChanges, this);
            EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.SKIN_WEAPON}`, this.emitSkinChanges, this);
        } else {
            EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.SKIN_HORSE}`, this.emitSkinChanges, this);
            EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.SKIN_WING}`, this.emitSkinChanges, this);
            EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.SKIN_WEAPON}`, this.emitSkinChanges, this);
        }
    }

    //
    public emitSkinChanges(): void {
        // ????????????
        EventClient.I.emit(E.Grade.GradeSkinChange);
    }

    /**
     * ????????????id??????????????????????????????id
     * @param subType ???????????????
     * @param part ??????
     * @returns
     */
    public getGoldEquipAttrId(subType: number, part: number, onlyId: string): number {
        const level = this.getGoldEquipLevel(subType, part, onlyId);
        if (level) {
            const funcId = UtilEquip.ItemTypeToFuncId(subType);
            return GradeMgr.I.getGradeHJCfg(funcId, part, level)?.AttrId;
        }
        return 0;
    }

    /**
     * ????????????id????????????????????????????????????
     * @param funcId ??????id
     * @param part ??????
     * @returns
     */
    public getGoldEquipLevelName(subType: number, part: number, onlyId: string): string {
        const level = this.getGoldEquipLevel(subType, part, onlyId);
        if (level) {
            return UtilString.FormatArgs(i18n.tt(Lang.equip_gold_name), level);
        }
        return '';
    }

    /**
     * ????????????id???????????????????????????
     * @param funcId ??????id
     * @param part ??????
     * @returns
     */
    public getGoldEquipLevel(subType: number, part: number, onlyId: string): number {
        if (subType) {
            const funcId = UtilEquip.ItemTypeToFuncId(subType);
            if (onlyId && funcId && BagMgr.I.getOnEquipByPart(ItemBagType.GENERAL, subType, part)?.data?.OnlyId === onlyId) {
                const gradeData = this.getGradeData(funcId);
                if (gradeData && gradeData.GradeBeGold && gradeData.GradeBeGold.PosLv) {
                    for (let i = 0, n = gradeData.GradeBeGold.PosLv.length; i < n; i++) {
                        const lvInfo = gradeData.GradeBeGold.PosLv[i];
                        if (lvInfo.K === part) {
                            return lvInfo.V;
                        }
                    }
                }
            }
        }
        return 0;
    }
}
