/*
 * @Author: wangxina
 * @Date: 2022-07-13 17:17:10
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\grade\v\GradeSoulWin.ts
 */
import { i18n, Lang } from '../../../../i18n/i18n';
import { BaseAddOptions, IAttrBase } from '../../../base/attribute/AttrConst';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { NdAttrBaseAdditionContainer } from '../../../com/attr/NdAttrBaseAdditionContainer';
import { ComFull } from '../../../com/ComFull';
import { FightValue } from '../../../com/fightValue/FightValue';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { WinCmp } from '../../../com/win/WinCmp';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { GradeMgr } from '../GradeMgr';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { E } from '../../../const/EventName';
import { EventClient } from '../../../../app/base/event/EventClient';
import { AttrModel } from '../../../base/attribute/AttrModel';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import {
    GRADE_SOUL_MAX_LEVEL, GRADE_SOUL_SKILL_UNLOCK, GRADE_SOUL_SKILL_UP,
} from '../GradeConst';
import { ROLESKIN_SOUL_MAX_LEVEL } from '../../roleskin/v/RoleSkinConst';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import Progress from '../../../base/components/Progress';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { FuncId } from '../../../const/FuncConst';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

/** 入口类型 */
export enum EOpenType {
    /** 角色时装 */
    ROLE = 0,
    /** 进阶 */
    GRADE = 1,
    /** 红颜才艺 */
    BEAUTY_GRADE = 2,
    /** 军师智略 */
    ADVISER_GRADE = 3,
}

@ccclass
export class GradeSoulWin extends WinCmp {
    @property(FightValue)
    private LbPower: FightValue = null;
    @property(cc.Label)
    private LbZLLevel: cc.Label = null;
    @property(NdAttrBaseAdditionContainer)
    private NdAttrBaseAddition: NdAttrBaseAdditionContainer = null;
    @property(cc.Node)
    private NdAddItem: cc.Node = null;
    @property(cc.Node)
    private NdIconSkill: cc.Node = null;
    @property(cc.Node)
    private NdSkillLock: cc.Node = null;
    @property(cc.Label)
    private LbSkillLv: cc.Label = null;
    @property(cc.RichText)
    private RtExp: cc.RichText = null;
    @property(Progress)
    private PgZLBar: Progress = null;
    @property(cc.Node)
    private NdConsumeItem: cc.Node = null;
    @property(cc.Node)
    private NdBtnOneKeyZL: cc.Node = null;
    @property(cc.Node)
    private NdBottom: cc.Node = null;
    @property(cc.Node)
    private NodeFull: cc.Node = null;
    @property(cc.Node)
    private NdSkillExp: cc.Node = null;

    /** 0来自个人时装 1来自进阶界面 */
    private openType: number = -1;
    /** 注灵的funcId,进阶的是gradeId */
    private _funcId: number = 0;
    /** 注灵道具不足 */
    private noItem: boolean = false;
    /** 满一级所需道具数量 */
    private itemNumCouns: number = 0;
    /** 能直接满级 */
    public canFull: boolean = false;
    private useItemId: number = 0;
    private fightValue: number = 0;
    private fightValueAdd: number = 0; // 加成后战力
    private isFull: boolean = false;

    private itemId: number = 0;
    protected start(): void {
        super.start();
    }

    public init(param: unknown): void {
        super.init(param);
        this.openType = param[0];
        this._funcId = param[1];
        if (this.openType === EOpenType.ROLE) {
            this._funcId = this._funcId ? this._funcId : 301;
            EventClient.I.on(E.RoleSkin.ZhuLingChange, this.getModel, this);
            UtilGame.Click(this.NdBtnOneKeyZL, () => {
                // 请求时装注灵
                if (this.noItem) {
                    WinMgr.I.open(ViewConst.ItemSourceWin, this.useItemId);
                } else {
                    ControllerMgr.I.RoleSkinController.C2SRoleSkinSoulLevel();
                }
            }, this);
        }
        if (this.openType === EOpenType.GRADE) {
            EventClient.I.on(E.Grade.UpdateInfo, this.getModel, this);
            EventClient.I.on(E.Grade.GradeItemNumChange.SoulDang, this.setUserItem, this);
            UtilGame.Click(this.NdBtnOneKeyZL, () => {
                if (this.noItem) {
                    // MsgToastMgr.Show('道具不足');
                    // WinMgr.I.open(ViewConst.GradeQuickPay, this.useItemId, this.itemNumCouns);
                    WinMgr.I.open(ViewConst.ItemSourceWin, this.useItemId);
                } else {
                    ControllerMgr.I.GradeController.reqC2SGradeSoul(this._funcId);
                }
            }, this);
        }
        this.getModel();
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.openType === EOpenType.ROLE) {
            EventClient.I.off(E.RoleSkin.ZhuLingChange, this.getModel, this);
        }
        if (this.openType === EOpenType.GRADE) {
            EventClient.I.off(E.Grade.GradeItemNumChange.SoulDang, this.setUserItem, this);
            EventClient.I.off(E.Grade.UpdateInfo, this.getModel, this);
        }
    }

    private getModel() {
        let level: number = 0;
        let value: number = 0;
        let valueCount: number = 0;
        let attrId: number = 0;
        let addAttrId: number = 0;
        let ratio: number = null;
        let zlExp: number = 0;
        let itemId: number = 0;
        let skillId: number = 0;
        let isZero: boolean = false; // 是否0级
        let skinNum: number = 1;
        if (this.openType === EOpenType.ROLE) {
            // 角色时装
            level = ModelMgr.I.RoleSkinModel.soulLevel;
            value = ModelMgr.I.RoleSkinModel.soulValue;
            // 获取注灵配置表
            if (level === 0) {
                level = 1;
                isZero = true;
            }
            // 先设置个上限30 之后上限超30时再说
            level = level > ROLESKIN_SOUL_MAX_LEVEL ? ROLESKIN_SOUL_MAX_LEVEL : level;
            this.isFull = level === ROLESKIN_SOUL_MAX_LEVEL;
            const roleSkinZlCfg: Cfg_RoleSkinZL = ModelMgr.I.RoleSkinModel.getRoleSkinZL(level);
            const roleItemCfg = ModelMgr.I.RoleSkinModel.getRoleSkinItem(this._funcId);
            skinNum = ModelMgr.I.RoleSkinModel.skinActiveNum;
            console.log('已激活时装数量', skinNum);
            attrId = roleSkinZlCfg.AttrId;
            // 下一个等级的0级和满级判断
            const nextLev = level === ROLESKIN_SOUL_MAX_LEVEL ? level : isZero ? 1 : level + 1;
            const nextRoleZlData = ModelMgr.I.RoleSkinModel.getRoleSkinZL(nextLev);
            valueCount = nextRoleZlData.EXP;
            addAttrId = nextRoleZlData.AttrId;
            // fightValue = UtilAttr.GetShowAttr1Str(attrId);
            ratio = roleSkinZlCfg.Ratio;
            // 获取所需道具注灵值
            zlExp = roleItemCfg.ZLExp;
            if (level >= 10) {
                skillId = roleSkinZlCfg.SkillId;
            } else {
                skillId = ModelMgr.I.RoleSkinModel.getRoleSkinZL(10).SkillId;
            }
            itemId = roleItemCfg.ZLItem;
            this.useItemId = itemId;
        }
        if (this.openType === EOpenType.GRADE) {
            // 进阶玩法
            const gradeData = GradeMgr.I.getGradeData(this._funcId);
            const gradeSoulData = gradeData.GradeSoul;
            level = gradeSoulData.Level ? gradeSoulData.Level : 0;
            this.isFull = level === GRADE_SOUL_MAX_LEVEL;
            value = gradeSoulData.Exp ? gradeSoulData.Exp : 0;
            // 获取注灵配置表
            // 先设置个上限30 之后上限超30时再说
            level = level > GRADE_SOUL_MAX_LEVEL ? GRADE_SOUL_MAX_LEVEL : level;
            if (level === 0) {
                level = 1;
                isZero = true;
            }
            const gradeZLData: Cfg_GradeZL = GradeMgr.I.getGradeZLCfg(level);
            const gradeItemCfg = GradeMgr.I.getGradeItemCfgById(this._funcId);
            skinNum = gradeData.GradeSkin.SkinLv.length;
            console.log(skinNum);
            attrId = gradeZLData.AttrId;
            const nextLev = level === ROLESKIN_SOUL_MAX_LEVEL ? level : isZero ? 1 : level + 1;
            const nextGradeZlData = GradeMgr.I.getGradeZLCfg(nextLev);
            addAttrId = nextGradeZlData.AttrId;
            valueCount = nextGradeZlData.EXP;
            ratio = gradeZLData.Ratio;
            if (level >= 10) {
                skillId = gradeZLData.SkillId;
            } else {
                skillId = GradeMgr.I.getGradeZLCfg(10).SkillId;
            }
            zlExp = gradeItemCfg.ZLExp;
            // 注灵消耗计算
            itemId = gradeItemCfg.ZLItem;
            this.useItemId = itemId;
        }
        // 是否满级

        if (this.isFull) {
            this.NdBottom.active = false;
            this.NodeFull.getComponent(ComFull).setString(i18n.tt(Lang.com_bg_full));
            this.NodeFull.active = true;
        } else {
            this.NodeFull.active = false;
            this.NdBottom.active = true;
            this.PgZLBar.updateProgress(value, valueCount);
            zlExp = zlExp !== 0 ? zlExp : 1; // 小心一点不能给他是0
            this.itemNumCouns = Math.round((valueCount - value) / zlExp);

            // 计算注灵道具消耗
            this.itemId = itemId;
            this.setUserItem();
        }

        this.setZlValue(isZero ? 0 : level);
        // 战力计算
        this.fightValue = AttrModel.MakeAttrInfo(attrId).fightValue;
        if (level >= 10) {
            // skinNum = skinNum !== 0 ? skinNum : 1;
            this.fightValueAdd = this.fightValue + Math.round(this.fightValue * skinNum * (ratio / 10000));
        } else {
            this.fightValueAdd = this.fightValue;
        }
        this.setFightValue(isZero ? 0 : this.fightValueAdd);
        this.setAttr(attrId, addAttrId, isZero);
        if (this._funcId === FuncId.BeautyGrade || this._funcId === FuncId.AdviserGrade) {
            this.NdSkillExp.active = false;
            this.resetSize(cc.size(702, 594));
        } else {
            this.NdSkillExp.active = true;
            this.setSkillInfo(level, skillId, skinNum, ratio);
            this.resetSize(cc.size(702, 708));
        }
    }

    private setZlValue(ZlValue: number) {
        this.LbZLLevel.string = `${i18n.tt(Lang.grade_zl)}${ZlValue}${i18n.lv}`;
    }

    private setFightValue(fightValue: number) {
        this.LbPower.setValue(fightValue);
    }

    /**
     *  设置技能面板
     * @param level
     * @param ratio
     */
    private setSkillInfo(level: number, skillId: number, skinNum: number, ratio?: number) {
        const islock = level >= GRADE_SOUL_SKILL_UNLOCK;
        if (!ratio) {
            ratio = 0;
        }
        const ratioNum = ratio / 10000 * 100;
        UtilColor.setGray(this.NdIconSkill, !islock);
        this.NdSkillLock.active = !islock;
        this.LbSkillLv.node.active = islock;
        // 设置技能信息
        const cfgS: Cfg_SkillDesc = UtilSkillInfo.GetCfg(skillId);
        let skillDesc = cfgS.SkillDesc;
        const skillName = cfgS.SkillName;
        // 填充相对提升值 取百分比整数

        const descFight = Math.round((this.fightValueAdd - this.fightValue) / this.fightValue * 100);
        skillDesc = UtilString.replaceAll(skillDesc, '{1}', `<color=${UtilColor.GreenV}>${descFight}%</color>`);
        skillDesc = UtilString.replaceAll(skillDesc, '{2}', `<color=${UtilColor.GreenV}>${ratioNum}%</color>`);
        this.NdIconSkill.getComponent(DynamicImage).loadImage(`${RES_ENUM.Skill}${cfgS.SkillIconID}`, 1, true);
        // eslint-disable-next-line max-len
        const skillLvUpDesc: string[] = [
            i18n.tt(Lang.grade_soul_skill_decs),
            `${i18n.tt(Lang.grade_soul_skill_lvup_decs)}${i18n.tt(Lang.com_dengji)}:20`,
            `${i18n.tt(Lang.grade_soul_skill_lvup_decs)}${i18n.tt(Lang.com_dengji)}:30`,
            i18n.tt(Lang.com_level_max)];
        let skillLvUpIdx: number = 0;// level < GRADE_SOUL_SKILL_UNLOCK ? 0 : level < GRADE_SOUL_SKILL_UP ? 1 : GRADE_SOUL_MAX_LEVEL > level ? 3 : 2;
        if (level < GRADE_SOUL_SKILL_UNLOCK) {
            skillLvUpIdx = 0;
        } else if (level < GRADE_SOUL_SKILL_UP) {
            skillLvUpIdx = 1;
        } else if (GRADE_SOUL_MAX_LEVEL > level) {
            skillLvUpIdx = 2;
        } else if (GRADE_SOUL_MAX_LEVEL === level) {
            skillLvUpIdx = 3;
        }

        // eslint-disable-next-line max-len
        const richString: string = `<color=${UtilColor.OrangeV}>【${skillName}】</color><color=${UtilColor.NorRichV}>${skillDesc}</color><color=${UtilColor.RedRichV}> (${skillLvUpDesc[skillLvUpIdx]})</color>`;
        this.LbSkillLv.string = `${i18n.tt(Lang.com_dengji)}:${skillLvUpIdx}`;
        this.RtExp.string = richString;
    }

    /**
     * 设置道具信息
     * @param itemId 道具id
     * @param numR 消耗道具数量
     */
    private setUserItem() {
        const intemIcon: ItemModel = UtilItem.NewItemModel(this.itemId);
        const itemNum = BagMgr.I.getItemNum(this.itemId);
        // 道具空
        this.noItem = itemNum === 0;
        this.canFull = itemNum >= this.itemNumCouns;
        this.NdAddItem.active = this.noItem;
        const numL = this.NdConsumeItem.getChildByName('NdNum').getChildByName('NumLeft').getComponent(cc.Label);
        numL.string = UtilNum.Convert(itemNum);
        numL.node.color = this.noItem ? UtilColor.Hex2Rgba(UtilColor.RedD) : UtilColor.Hex2Rgba(UtilColor.GreenD);
        const numR = this.NdConsumeItem.getChildByName('NdNum').getChildByName('NumRight').getComponent(cc.Label);
        numR.string = `/ 1`;
        this.NdConsumeItem.getComponentInChildren(ItemIcon).setGray(this.noItem, 3);
        this.NdConsumeItem.getComponentInChildren(ItemIcon).setData(intemIcon, { needName: false, needNum: false });
        UtilRedDot.Unbind(this.NdBtnOneKeyZL);
        UtilRedDot.UpdateRed(this.NdBtnOneKeyZL, this.canFull, cc.v2(80, 25));
    }

    private setAttr(attr: number, attrAdd: number, isZero: boolean) {
        const attrlist = UtilAttr.GetAttrBaseListById(attr);
        const attrlistAdd = UtilAttr.GetAttrBaseListById(attrAdd);
        const opt: BaseAddOptions = { isShowAdd: true };
        if (this.isFull) {
            opt.isShowAdd = false;
        }
        this.NdAttrBaseAddition.init(attrlist, attrlistAdd, opt);

        if (isZero) {
            // 处理0级的清空
            const zerolist: IAttrBase[] = [];
            zerolist.length = attrlist.length;
            attrlist.forEach((j, i) => {
                zerolist[i] = {
                    attrType: j.attrType,
                    value: 0,
                    name: j.name,
                };
            });
            this.NdAttrBaseAddition.init(zerolist, attrlistAdd);
        }
    }
}
