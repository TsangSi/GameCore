import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { UtilColorFull } from '../../../../base/utils/UtilColorFull';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import { UtilSkillInfo } from '../../../../base/utils/UtilSkillInfo';
import { ItemQuality } from '../../../../com/item/ItemConst';
import { RES_ENUM } from '../../../../const/ResPath';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { ArmyLvConst } from '../../../roleOfficial/roleArmyLevel/ArmyLvConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class UniqueSkillItem extends cc.Component {
    @property(DynamicImage)
    private SprName: DynamicImage = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;

    @property(cc.Label)
    private LabSkillName: cc.Label = null;

    @property(cc.Label)
    private LabOpenState: cc.Label = null;
    @property(cc.Node)
    private NdLabOpen: cc.Node = null;

    @property(cc.RichText)
    private RTDesc: cc.RichText = null;

    @property(cc.Node)
    private NdActive: cc.Node = null;

    protected start(): void {
        UtilGame.Click(this.NdActive, this._onActiveSkill, this, { scale: 1 });
    }

    private _onActiveSkill() {
        ControllerMgr.I.ArmyLevelController.reqActiveSkill(this._skillId);
    }

    private _skillId: number;

    public setData(cfg: Cfg_ArmySkill): void {
        // 描述在技能表
        this._skillId = cfg.SkillId;
        this.LabSkillName.string = UtilSkillInfo.GetSkillName(cfg.SkillId);
        const quality: number = UtilSkillInfo.GetQuality(cfg.SkillId, 1);
        UtilColorFull.resetMat(this.LabSkillName);
        if (quality === ItemQuality.COLORFUL) {
            UtilColorFull.setColorFull(this.LabSkillName, false);
        } else {
            this.LabSkillName.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(quality));
        }
        this.SprIcon.loadImage(`${RES_ENUM.Skill}${UtilSkillInfo.GetSkillIconID(cfg.SkillId, 1)}`, 1, true);
        this.RTDesc.string = `<color=${UtilColor.NorV}>${UtilSkillInfo.GetSkillDesc(cfg.SkillId, 1)}</c>`;

        // 是否激活
        // 开启的阶级
        const openLvs = cfg.Army.split('|');
        const armyLv = Number(openLvs[0]);
        const armyStar = Number(openLvs[1]);
        //
        // 如果在skillsId列表里 就是已开启
        const isActive = ModelMgr.I.ArmyLevelModel.isSkillActive(cfg.SkillId);
        if (isActive) {
            // 已解锁
            this.SprName.node.active = false;
            this.LabOpenState.string = ` ${i18n.tt(Lang.uniqueskill_open)}`;// '已（激活）';
            this.NdLabOpen.active = false;
            // this.SprIcon.getComponent(cc.Sprite).grayscale = false;
            UtilColor.setGray(this.SprIcon.node, false);
            this.NdActive.active = false;
        } else {
            this.NdLabOpen.active = true;
            // 未解锁
            // 判断能否解锁
            const curUserArmyLv = RoleMgr.I.getArmyLevel();// 军衔
            const curArmyStar = RoleMgr.I.getArmyStar();// 军衔星级

            if (curUserArmyLv > armyLv) {
                // 可解锁
                this.SprName.node.active = true;
                const url: string = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(armyLv);
                this.SprName.loadImage(url, 1, true);
                this.LabOpenState.string = `${armyStar}${i18n.lv}${i18n.tt(Lang.open_open)}`;// 级开启
                this.NdActive.active = true;
                // this.SprIcon.getComponent(cc.Sprite).grayscale = true;
                UtilColor.setGray(this.SprIcon.node, true);
            } else if (curUserArmyLv === armyLv) {
                //
                if (curArmyStar >= armyStar) {
                    // 可解锁
                    this.SprName.node.active = true;
                    const url: string = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(armyLv);
                    this.SprName.loadImage(url, 1, true);
                    this.LabOpenState.string = `${armyStar}${i18n.lv}${i18n.tt(Lang.open_open)}`;
                    this.NdActive.active = true;
                    // this.SprIcon.getComponent(cc.Sprite).grayscale = true;
                    UtilColor.setGray(this.SprIcon.node, true);
                } else {
                    // 不能解锁
                    this.SprName.node.active = true;
                    const url: string = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(armyLv);
                    this.SprName.loadImage(url, 1, true);
                    this.LabOpenState.string = `${armyStar}${i18n.lv}${i18n.tt(Lang.open_open)}`;
                    this.NdActive.active = false;
                    // this.SprIcon.getComponent(cc.Sprite).grayscale = false;
                    UtilColor.setGray(this.SprIcon.node, false);
                }
            } else {
                // 不能解锁
                this.SprName.node.active = true;
                const url: string = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(armyLv);
                this.SprName.loadImage(url, 1, true);
                this.LabOpenState.string = `${armyStar}${i18n.lv}${i18n.tt(Lang.open_open)}`;
                this.NdActive.active = false;
                // this.SprIcon.getComponent(cc.Sprite).grayscale = false;
                UtilColor.setGray(this.SprIcon.node, false);
            }
        }
        const colorStr: string = ArmyLvConst.getLvColorByArmyLV(armyLv, false);
        if (!isActive) {
            this.LabOpenState.node.color = UtilColor.Hex2Rgba(colorStr);
        }
    }
}
