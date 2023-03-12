/*
 * @Author: zs
 * @Date: 2022-10-31 14:19:11
 * @FilePath: \SanGuo\assets\script\game\module\beauty\com\BeautySkill.ts
 * @Description:
 *
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { ActiveInfoSingle } from '../../../com/attr/ActiveAttrList';
import { TipsSkillInfo } from '../../../com/tips/skillPart/SkillTopPart';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import { EffectMgr } from '../../../manager/EffectMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { EGeneralSkillType } from '../../general/GeneralConst';

interface IBeaustySkillShow { SkillId: number, SkillName?: string, SkillIconID?: number, Effect_Type: number, SkillDesc: string }
const { ccclass, property } = cc._decorator;
@ccclass()
export class BeautySkill extends BaseCmp {
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(DynamicImage)
    private SprType: DynamicImage = null;
    @property(cc.Sprite)
    private SpriteBg: cc.Sprite = null;
    @property(cc.Node)
    private NdLv: cc.Node = null;
    @property(cc.Label)
    private LabLv: cc.Label = null;
    @property(cc.Node)
    private NdOpen: cc.Node = null;
    @property(cc.Label)
    private LabOpen: cc.Label = null;
    /** 红颜id */
    private id: number;
    /** 技能标记 */
    private skillFlag: number;
    /** 配置 */
    private cfgSkill: IBeaustySkillShow = null;
    /** 技能等级 */
    private skillLevel: number = 0;
    protected start(): void {
        super.start();
        UtilGame.Click(this.SpriteBg.node, this.onSkillClicked, this);
    }
    /**
     *
     * @param id 红颜id
     * @param skillFlag 技能标记（有多个被动技能，标识是哪个被动技能）
     * @param skillId 技能id
     * @param level 等级
     * @param isActive 是否激活
     */
    public setData(id: number, skillFlag: number, skillId: number, level: number, isActive: boolean): void {
        this.id = id;
        this.skillFlag = skillFlag;
        this.skillLevel = level;
        this.cfgSkill = UtilSkillInfo.GetCfg(skillId, level);
        this.NdOpen.active = !isActive;
        this.NdLv.active = isActive;
        if (!isActive) {
            this.LabOpen.string = i18n.tt(Lang.com_unactive);
        } else {
            this.LabLv.string = `${level}${i18n.lv}`;
        }

        this.SprIcon.loadImage(`${RES_ENUM.Skill}${this.cfgSkill.SkillIconID}`, 1, true);
        if (this.cfgSkill.Effect_Type === 1) {
            this.SprType.loadImage(RES_ENUM.Com_Font_Com_Font_Zhuanshu, ImageType.PNG, true);
            // this.SprType.node.active = true;
        } else {
            this.SprType.loadImage(RES_ENUM.Com_Font_Com_Font_Tianfu, ImageType.PNG, true);
            // this.SprType.node.active = false;
        }
        // 角标类型
        UtilColor.setGray(this.SprIcon.node, !isActive);
    }

    /**
     *
     * @param curLv 当前等级
     * @param openLv 开放等级
     */
    public setActive(curLv: number, openLv: number): void {
        const isActive: boolean = curLv > 0;
        this.NdOpen.active = !isActive;
        this.NdLv.active = isActive;
        if (!isActive) {
            this.LabOpen.string = `${openLv}${i18n.tt(Lang.rskill_opens)}`;
        } else {
            this.LabLv.string = `${curLv}${i18n.lv}`;
        }
        // this.SprIcon.node.getComponent(cc.Sprite).grayscale = !isActive;
        UtilColor.setGray(this.SprIcon.node, !isActive);
    }

    /** 播放升级动画 */
    public showAnim(): void {
        const n = this.node.getChildByName('btnEffect');
        if (!n) {
            EffectMgr.I.showAnim(RES_ENUM.Com_Ui_106, (node: cc.Node) => {
                if (this.node && this.node.isValid) {
                    const eff = this.node.getChildByName('btnEffect');
                    if (eff) {
                        eff.destroy();
                    }
                    this.node.addChild(node);
                    node.name = 'btnEffect';
                }
            }, cc.WrapMode.Normal);
        }
    }

    private onSkillClicked() {
        const skillInfo: ActiveInfoSingle[] = [];
        const tipsInfo: TipsSkillInfo = {
            skillId: this.cfgSkill.SkillId,
            iconId: this.cfgSkill.SkillIconID,
            type: 0,
            level: this.skillLevel,
            skillType: this.cfgSkill.Effect_Type === 1 ? this.cfgSkill.Effect_Type : EGeneralSkillType.SkillTalent,
            name: this.cfgSkill.SkillName,

        };
        // 红颜技能当前级的描述
        let skillDesc = this.cfgSkill.SkillDesc;
        // if (this.cfgSkill.Effect_Type === 1) {
        skillDesc = UtilSkillInfo.GetSkillDesc(this.cfgSkill.SkillId, this.skillLevel);
        // }
        skillInfo.push({ title: i18n.tt(Lang.skill_effect), data: skillDesc });
        if (this.id) {
            // 红颜技能下一级的描述
            const nextSkillInfo = ModelMgr.I.BeautyModel.cfg.getSkillByLvAndFlag(this.id, this.skillFlag, this.skillLevel + 1);
            if (nextSkillInfo && nextSkillInfo.Star) {
                let nextCfgSkill: IBeaustySkillShow;
                if (this.cfgSkill.SkillId !== nextSkillInfo.skillId) {
                    nextCfgSkill = UtilSkillInfo.GetCfg(nextSkillInfo.skillId, this.skillLevel + 1);
                } else {
                    nextCfgSkill = this.cfgSkill;
                }
                let nextSkillDesc = nextCfgSkill.SkillDesc;
                // if (nextCfgSkill.Effect_Type === 1) {
                nextSkillDesc = UtilSkillInfo.GetSkillDesc(nextCfgSkill.SkillId, nextSkillInfo.level);
                // }
                skillInfo.push({ title: i18n.tt(Lang.skill_effect_next), data: nextSkillDesc });
                /** 升级条件 */
                // eslint-disable-next-line max-len
                skillInfo.push({ title: i18n.tt(Lang.com_next_limit), data: UtilString.FormatArgs(i18n.tt(Lang.beauty_next_skill_limit_desc), nextSkillInfo.Star) });
            } else {
                skillInfo.push({ title: i18n.tt(Lang.skill_effect_next), data: `${i18n.tt(Lang.com_null)}` });
                /** 升级条件 */
                skillInfo.push({ title: i18n.tt(Lang.com_next_limit), data: `${i18n.tt(Lang.com_text_full)}` });
            }
        }
        // 武将技能展开Tips
        WinMgr.I.open(ViewConst.TipsSkillWin, tipsInfo, skillInfo);
    }
}
