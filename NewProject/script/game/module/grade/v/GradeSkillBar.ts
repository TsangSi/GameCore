/*
 * @Author: hwx
 * @Date: 2022-07-18 17:21:49
 * @Description: 进阶技能栏
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { EAttrShowType } from '../../../base/attribute/AttrConst';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilGame } from '../../../base/utils/UtilGame';
import ItemModel from '../../../com/item/ItemModel';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { RID } from '../../reddot/RedDotConst';
import { Cfg_GradeSkill_Unit, GradeType } from '../GradeConst';
import { GradeMgr } from '../GradeMgr';
import { GradeModel } from '../GradeModel';
import { GradeSkillItem } from './GradeSkillItem';
import { ActiveInfoSingle } from '../../../com/attr/ActiveAttrList';
import { ItemOfUpSkill } from '../../../com/itemskill/ItemOfUpSkill';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeSkillBar extends BaseCmp {
    @property(cc.Prefab)
    private itemOfUpSkill: cc.Prefab = null;

    private _gradeModel: GradeModel;
    /** 功能ID */
    private _gradeId: number;

    private _isSkinTab: boolean = false;

    // 反正只有一个技能了
    private SkillItems: GradeSkillItem[] = [];

    private btnCfg = null;
    private openLimit: string = '';
    private addNode: cc.Node = null;

    public init(...param: unknown[]): void {
        this._gradeModel = param[0] as GradeModel;
        this._gradeId = this._gradeModel.data.GradeId;

        this._isSkinTab = param[1] as boolean;
        this.SkillItems = [];
        this.node.children.forEach((node) => {
            const comp = node.getComponent(GradeSkillItem);
            if (comp) {
                this.SkillItems.push(comp);
            }
        });

        if (!this._isSkinTab) {
            this.setGradeSkills();
            this.addClientEvent();
        } else {
            this.delClientEvent();
        }
    }

    protected onDestroy(): void {
        super.onDestroy();

        this.delClientEvent();
    }

    protected addClientEvent(): void {
        EventClient.I.on(E.Grade.UpdateInfo, this.updataSkillPanel, this);
        EventClient.I.on(E.Grade.GradeItemNumChange.SkillBook, this.updataSkillPanel, this);
    }

    protected delClientEvent(): void {
        EventClient.I.off(E.Grade.UpdateInfo, this.updataSkillPanel, this);
        EventClient.I.off(E.Grade.GradeItemNumChange.SkillBook, this.updataSkillPanel, this);
    }

    public updataSkillPanel(): void {
        GradeMgr.I.checkRedSkill(this._gradeId, this._gradeModel.data);
        this.setGradeSkills();
        if (WinMgr.I.checkIsOpen(ViewConst.TipsSkillWin)) {
            this.onClickSkillItem(null, this.btnCfg);
        }
    }

    /**
     * 设置进阶技能
     */
    private setGradeSkills(): void {
        const skillLvs = this._gradeModel.data.GradeSkill.Skills;
        skillLvs.sort((a, b) => a.K - b.K);

        this.SkillItems.forEach((item, idx) => {
            const skillCfg: Cfg_GradeSkill_Unit = this._gradeModel.skillsCfg[idx];
            if (!skillCfg) {
                return;
            }
            const iconId = skillCfg.IconId;

            // 当前技能等级
            const intAttr = UtilGame.GetIntAttrByKey(skillLvs, skillCfg.Part);
            const level = intAttr ? intAttr.V : 0;
            let isActive: boolean = false;
            let lockDesc: string = '';
            if (level <= 0) {
                // 技能未开启限制
                const limitLv = GradeMgr.I.getGradeSkillPartOpenLv(this._gradeId, skillCfg.Part);
                isActive = this._gradeModel.cfg.Level >= limitLv;
                const limitLvStr = UtilNum.ToChinese(limitLv);
                this.openLimit = `${limitLvStr}${i18n.tt(Lang.com_reborn_open)}`;
                lockDesc = this.openLimit;
            }
            const redId = this.getRedDotId();
            item.init({
                level, iconId, lockDesc, redId, isActive,
            });
            this.btnCfg = skillCfg;
            UtilGame.Click(item.clickNd, this.onClickSkillItem, this, { scale: 1, customData: skillCfg });
        });
    }

    public getRedDotId(): number {
        return GradeMgr.I.getRedSkillByGradeId(this._gradeId);
    }

    /**
     * 设置进阶皮肤技能
     */
    public setGradeSkinSkills(skillInfos: {
        name: string,
        iconId: string,
        cfg: Cfg_GradeSkinSkill,
        skinLv: number
    }[]): void {
        this.SkillItems.forEach((item, idx) => {
            const info = skillInfos[idx];
            const iconId = info.iconId;
            const skillCfg: Cfg_GradeSkinSkill = info.cfg;
            const skinLv = info.skinLv;

            // 当前技能等级
            let level = 0;
            let lockDesc: string;
            const limit = skillCfg.Limit;
            if (skinLv >= limit) {
                level = skillCfg.Level;
            } else {
                // 技能未开启限制
                lockDesc = `${limit}${i18n.tt(Lang.com_star_open)}`;
            }
            item.init({
                level, iconId, lockDesc, quality: skillCfg.Quality,
            });

            this.btnCfg = info;
            UtilGame.Click(item.clickNd, this.onClickSkillItem, this, { scale: 1, customData: info });
        });
    }

    private onClickSkillItem(ndoe, cfg): void {
        // 进阶技能改动，进阶技能和皮肤技能面板保持一致
        if (this._isSkinTab) {
            const skillInfo = cfg as { name: string, iconId: string, cfg: Cfg_GradeSkinSkill, skinLv: number };
            let level = 0;
            const limit = skillInfo.cfg.Limit;
            // 技能锁住状态
            const unlock = skillInfo.skinLv < limit ? 0 : 2;
            const unlockStr = `${limit}${i18n.tt(Lang.com_star_open)}`;
            if (skillInfo.skinLv >= limit) {
                level = skillInfo.cfg.Level;
            }
            const activeInfos = this.setActiveInfoSkin(skillInfo.cfg.AttrId, level, skillInfo.cfg.Part, skillInfo.cfg.Limit, skillInfo.cfg.Quality);
            WinMgr.I.open(ViewConst.TipsSkillWin, {
                skillId: skillInfo.cfg.Key,
                iconId: skillInfo.iconId,
                type: 0, // 皮肤技能不用星级
                name: skillInfo.name,
                level: skillInfo.cfg.Level,
                unlock,
                unlockString: unlockStr,
            }, activeInfos);
        } else {
            // 进阶技能数据整理
            const skillCfg: Cfg_GradeSkill_Unit = cfg;
            const limitLv = GradeMgr.I.getGradeSkillPartOpenLv(this._gradeId, skillCfg.Part);
            // 此处判断是否解锁技能
            const unlockSkill = this._gradeModel.cfg.Level >= limitLv;
            const skillLvs = this._gradeModel.data.GradeSkill.Skills;
            skillLvs.sort((a, b) => a.K - b.K);
            const intAttr = UtilGame.GetIntAttrByKey(skillLvs, skillCfg.Part);
            const level = intAttr ? intAttr.V : 0;
            // 道具详情控制 升级道具取下一级 可能会配置多个道具所以做了切割
            const cfgLenght = GradeMgr.I.getGradeSkillCfgIndexer(this._gradeId).length;
            // 满级
            const levelMax: boolean = level >= cfgLenght;
            const nextItemCfg = GradeMgr.I.getGradeSkillCfg(this._gradeId, skillCfg.Part, levelMax ? level : level + 1);
            const itemInfo = GradeMgr.I.getItemInfo(nextItemCfg);
            const itemData: ItemModel[] = itemInfo.itemData;
            const itemNum: number[] = itemInfo.itemNum;
            const needNum: number[] = itemInfo.needNum;
            let btnLabel: string;
            let unlock: number;
            let unlockStr: string;
            const cb = () => {
                let toDo: boolean = true;
                for (let i = 0; i < itemData.length; i++) {
                    if (itemNum[i] < needNum[i]) {
                        toDo = false;
                        WinMgr.I.open(ViewConst.ItemSourceWin, itemData[i].data.ItemId);
                        break;
                    }
                }
                if (toDo) ControllerMgr.I.GradeController.reqC2SGradeSkillLevelUp(this._gradeId, skillCfg.Part);
            };
            // 按钮状态变化 大于0级 判断是否已激活，未激活显示激活，已激活显示升级，已满级显示满级
            if (level <= 0) {
                // 激活态
                if (unlockSkill) {
                    btnLabel = i18n.tt(Lang.com_button_active);
                    unlock = 1;
                    // 判断是会否处于激活极端，需求变更为点击直接弹窗提示技能激活
                    const nexCfg: Cfg_GradeSkill_Unit = GradeMgr.I.getGradeSkillCfg(this._gradeId, skillCfg.Part, level + 1);
                    const attrIdNex: number = nexCfg.AttrId;
                    const attrInfo = AttrModel.MakeAttrInfo(attrIdNex);
                    const desc = UtilAttr.GetShowAttrStr(attrInfo.attrs, EAttrShowType.Plus, { s: ' ' });
                    const skillTipsInfo: { skillName: string, skillDesc: string, skillId, imgUrl?: string } = {
                        skillName: skillCfg.SkillName,
                        skillDesc: desc,
                        skillId: nexCfg.IconId,
                        imgUrl: RES_ENUM.Com_Font_Com_Font_Jhjn,
                    };
                    // 这里只要点击就可以激活了。不等回调直接开启看看
                    WinMgr.I.open(ViewConst.ActiveSkillTip, null, skillTipsInfo);
                    ControllerMgr.I.GradeController.reqC2SGradeSkillLevelUp(this._gradeId, skillCfg.Part);
                    return;
                } else {
                    // 未解锁
                    unlock = 0;
                    const limitLvStr = UtilNum.ToChinese(limitLv);
                    btnLabel = `${limitLvStr}${i18n.tt(Lang.com_reborn_open)}`;
                    unlockStr = `${limitLvStr}${i18n.tt(Lang.com_reborn_open)}`;
                }
            } else {
                // 正常升级
                btnLabel = i18n.tt(Lang.com_up);
                unlock = 2;
            }
            const activeInfos: ActiveInfoSingle[] = this.setActiveInfoSkill(skillCfg.AttrId, level, skillCfg.Part, unlock, levelMax);
            const viewInfo = {
                skillId: skillCfg.Key,
                iconId: skillCfg.IconId,
                type: 0,
                name: skillCfg.SkillName,
                level: skillCfg.Level,
                unlock,
                unlockString: unlockStr,
            };
            // 区分技能面板是否以打开，做用于刷新数据
            if (WinMgr.I.checkIsOpen(ViewConst.TipsSkillWin)) {
                EventClient.I.emit(E.TipsSkill.updateSkill, [viewInfo, activeInfos]);
            } else {
                this.addNode = cc.instantiate(this.itemOfUpSkill);
                WinMgr.I.open(ViewConst.TipsSkillWin, viewInfo, activeInfos, this.addNode);
            }
            // 新加条件，未激活不显示按钮
            const reddot = this.getRedDotId();
            if (this.addNode && this.addNode.isValid) {
                if (unlock === 2) {
                    this.addNode.active = true;
                } else {
                    this.addNode.active = false;
                }
                // 传递数据 这里按钮回调要注意几个东西，判断升级道具是否充足
                this.addNode.getComponent(ItemOfUpSkill).setData(itemData, [itemNum, needNum], btnLabel, cb, reddot);
                // 满级
                if (levelMax) {
                    this.addNode.active = false;
                }
            }
        }
    }

    /** 设置皮肤技能面板信息 */
    private setActiveInfoSkin(attrId: number, level: number, part: number, limit: number, quality: number): ActiveInfoSingle[] {
        const activeInfos: ActiveInfoSingle[] = [];
        if (level > 0) {
            const attrInfo = AttrModel.MakeAttrInfo(attrId);
            const currLvAttrStr = UtilAttr.GetShowAttrStr(attrInfo.attrs, EAttrShowType.Plus);
            activeInfos.push({ title: `【${i18n.tt(Lang.com_cur_effect)}】`, data: currLvAttrStr });
        } else {
            // 当前效果
            const descI = i18n.tt(Lang.com_null);
            activeInfos.push({ title: `【${i18n.tt(Lang.com_cur_effect)}】`, data: descI });
        }
        const nextLv = level + 1;
        const nextCfg = GradeMgr.I.getGradeSkinSkillCfg(quality, part, nextLv);
        if (nextCfg) {
            const attrInfo = AttrModel.MakeAttrInfo(nextCfg.AttrId);
            const nextLvAttrStr = UtilAttr.GetShowAttrStr(attrInfo.attrs, EAttrShowType.Plus);
            activeInfos.push({ title: `【${i18n.tt(Lang.com_next_effect)}】`, data: nextLvAttrStr, infoColor: UtilColor.WhiteD });

            if (level > 0) {
                activeInfos.push({
                    title: `【${i18n.tt(Lang.com_next_limit)}】`,
                    data: `${i18n.tt(Lang.com_skin)}${i18n.tt(Lang.com_attain)}${nextCfg.Limit}${i18n.tt(Lang.com_star)}`,
                    infoColor: UtilColor.RedD,
                });
            } else {
                activeInfos.push({
                    title: `【${i18n.tt(Lang.com_open_limit)}】`,
                    data: `${limit}${i18n.tt(Lang.equip_star)}${i18n.tt(Lang.com_do)}${i18n.tt(Lang.rskill_open)}`,
                    infoColor: UtilColor.RedD,
                });
            }
        } else {
            activeInfos.push({ title: `【${i18n.tt(Lang.com_next_limit)}】`, data: i18n.tt(Lang.com_level_max), infoColor: UtilColor.GreenD });
        }
        return activeInfos;
    }

    /** 设置技能面板信息 */
    private setActiveInfoSkill(attrId: number, level: number, part: number, unlock, levelMax: boolean): ActiveInfoSingle[] {
        const activeInfos: ActiveInfoSingle[] = [];
        // 已激活
        const unlockSkill: boolean = level > 0;
        if (unlock === 2) {
            // 当前等级信息
            const attrInfoI = AttrModel.MakeAttrInfo(attrId);
            const descI = UtilAttr.GetShowAttrStr(attrInfoI.attrs, EAttrShowType.Plus);
            activeInfos.push({ title: `【${i18n.tt(Lang.com_cur_effect)}】`, data: descI });
            // 下级技能信息
            let descII: string = '';
            if (!levelMax) {
                const nexCfg: Cfg_GradeSkill_Unit = GradeMgr.I.getGradeSkillCfg(this._gradeId, part, level + 1);
                if (nexCfg) {
                    const attrIdNex: number = nexCfg.AttrId;
                    const attrInfoII = AttrModel.MakeAttrInfo(attrIdNex);
                    if (attrInfoI) {
                        descII = UtilAttr.GetShowAttrStr(attrInfoII.attrs, EAttrShowType.Plus);
                    }
                }
            } else {
                descII = i18n.tt(Lang.com_level_max);
            }
            activeInfos.push(
                {
                    title: `【${unlockSkill ? i18n.tt(Lang.com_next_effect) : i18n.tt(Lang.com_cur_effect)}】`,
                    data: descII,
                    isFull: levelMax,
                },
            );
        } else if (unlock < 2) {
            // 未激活
            // 当前效果
            const descI = i18n.tt(Lang.com_null);
            activeInfos.push({ title: `【${i18n.tt(Lang.com_cur_effect)}】`, data: descI });
            // 下级效果
            let descII: string = '';
            const nexCfg: Cfg_GradeSkill_Unit = GradeMgr.I.getGradeSkillCfg(this._gradeId, part, level + 1);
            if (nexCfg) {
                const attrIdNex: number = nexCfg.AttrId;
                const attrInfoII = AttrModel.MakeAttrInfo(attrIdNex);
                if (attrInfoII) {
                    descII = UtilAttr.GetShowAttrStr(attrInfoII.attrs, EAttrShowType.Plus);
                }
            }
            activeInfos.push({ title: `【${i18n.tt(Lang.com_next_effect)}】`, data: descII });
            // 开启条件
            const descIII = this.openLimit;
            activeInfos.push({ title: `【${i18n.tt(Lang.com_open_limit)}】`, data: descIII, infoColor: UtilColor.RedD });
        }
        return activeInfos;
    }
}
