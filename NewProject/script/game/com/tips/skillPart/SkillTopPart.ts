/*
 * @Author: kexd
 * @Date: 2022-09-26 20:11:23
 * @FilePath: \SanGuo2.4\assets\script\game\com\tips\skillPart\SkillTopPart.ts
 * @Description: 技能-头部
 *
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { AssetType } from '../../../../app/core/res/ResConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { RES_ENUM } from '../../../const/ResPath';
import { EGeneralSkillType } from '../../../module/general/GeneralConst';

/**
 *  技能tips参数
 *  @param skillId 技能id
 *  @param iconId 技能图片名
 *  @param type 类型 0 阶级 1 星级 3显示其它名称
 *  @param name 技能名
 *  @param level 技能阶级
 *  @param starLevel 星级
 *  @param isMain 布尔值,是否显示主要图标
 *  @param unlock 0 未解锁 1 激活 2 升级 .. 3满级
 *  @param unlockString 未解锁的文案
 *  @param needActive 需要激活操作 传点击方法
 */
export interface TipsSkillInfo {
    skillId: number;
    iconId: number;
    type: number;
    typeName?: string,
    skillType?: EGeneralSkillType,
    name: string;
    level?: number;
    starLevel?: number;
    isMain?: boolean;
    unlock?: number;
    unlockString?: string;
    contentType?: number;
    needActive?: () => void;
}

const { ccclass, property } = cc._decorator;
@ccclass
export default class SkillTopPart extends BaseCmp {
    /** 技能图标节点 */
    @property(cc.Node)
    protected NdSkill: cc.Node = null;
    @property(cc.Label)
    protected LbSkillName: cc.Label = null;
    /** 外面的星星标志 */
    @property(cc.Node)
    protected NdStar: cc.Node = null;
    @property(cc.Label)
    protected LbLevel: cc.Label = null;
    /** 技能图标的等级 */
    @property(cc.Label)
    protected LbInnerLevel: cc.Label = null;
    /** 内部的星星标志 */
    @property(cc.Node)
    protected NdInnerStar: cc.Node = null;
    /** 未解锁图标 */
    @property(cc.Node)
    protected unlock: cc.Node = null;
    /** 激活图标 */
    @property(cc.Node)
    protected NdActive: cc.Node = null;

    protected start(): void {
        super.start();
    }

    public setSkillInfo(skillInfo: TipsSkillInfo): void {
        // 需要一个参数判断暂时为阶级还是星级 0 阶级 1 星级 3 专属技能
        const showType = skillInfo.type; // 1
        this.LbSkillName.string = skillInfo.name;
        // 设置技能等级/阶级
        let LvString: string = '';
        let LvNum: number = skillInfo.level;
        let levelStr: string = '';
        // let innerLevelStr: string = '';
        if (showType === 0) {
            // LvString = `${i18n.tt(Lang.com_reborn)}${i18n.tt(Lang.equip_lev)}`;
            LvString = `${LvNum}${i18n.lv}`;
            LvNum = skillInfo.level;
            this.NdStar.active = false;
            // this.NdInnerStar.active = false;
            levelStr = LvString;
            // innerLevelStr = `${LvNum}${i18n.lv}`;
        }
        if (showType === 1) {
            LvString = `${i18n.tt(Lang.com_star)}${i18n.tt(Lang.equip_lev)}`;
            LvNum = skillInfo.starLevel;
            this.NdStar.active = true;
            // this.NdInnerStar.active = true;
            levelStr = `${LvString}:${LvNum}`;
            // innerLevelStr = `${LvString}${LvNum}`;
        }
        if (showType === 3) {
            LvString = skillInfo.typeName ? skillInfo.typeName : `类型： ${i18n.tt(Lang.com_private_skill)}`;
            this.NdStar.active = false;
            levelStr = LvString;
            if (skillInfo.level) {
                this.LbInnerLevel.string = `${skillInfo.level}${i18n.lv}`;
            }
        }
        this.LbLevel.string = levelStr;
        // this.LbInnerLevel.string = innerLevelStr;
        // 技能图标设置
        const skillimg = this.NdSkill.getComponent(DynamicImage);
        skillimg.loadImage(`${RES_ENUM.Skill}${skillInfo.iconId}`, 1, true);
        // ‘主’角标
        let unlockAct: boolean = false;
        let isGrayscale: boolean = false;
        let NdAct: boolean = false;
        switch (skillInfo.unlock) {
            // 未解锁
            case 0:
                unlockAct = true;
                isGrayscale = true;
                NdAct = false;
                this.unlock.getChildByName('Label').getComponent(cc.Label).string = skillInfo.unlockString;
                break;
            // 激活
            case 1:
                unlockAct = false;
                isGrayscale = true;
                NdAct = true;
                UtilGame.Click(this.NdActive, skillInfo.needActive, this);
                break;
            case 2:
                unlockAct = false;
                NdAct = false;
                break;
            default:
                unlockAct = false;
                isGrayscale = false;
                NdAct = false;
        }
        this.NdActive.active = NdAct;

        let sprType = this.NdSkill.getChildByName('SprType');
        if (!sprType) {
            sprType = this.NdSkill.getChildByName('SpIsMain');
        }
        if (sprType) {
            if (skillInfo.skillType) {
                UtilGeneral.SetSkillFlag(sprType.getComponent(cc.Sprite), skillInfo.skillType);
                sprType.active = true;
            } else if (UtilSkillInfo.GetSkillType(skillInfo.skillId) === 2) { // 被动技能{
                UtilCocos.LoadSpriteFrameRemote(sprType.getComponent(cc.Sprite), RES_ENUM.Com_Font_Com_Font_Bei, AssetType.SpriteFrame);
                sprType.active = !!skillInfo.isMain;
            }
        }

        this.unlock.active = unlockAct;
        // this.NdSkill.getComponent(cc.Sprite).grayscale = isGrayscale;
        UtilColor.setGray(this.NdSkill, isGrayscale);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
