/*
 * @Author: hwx
 * @Date: 2022-07-12 15:34:07
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\GradeAvatarInfoPanel.ts
 * @Description: 升阶形象信息面板
 */
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { FightValue } from '../../../com/fightValue/FightValue';
import { FuncId } from '../../../const/FuncConst';
import { EntityUnitType } from '../../../entity/EntityConst';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BeautyInfo } from '../../beauty/BeautyInfo';
import {
    GradePageTabType, GradeType, GRADE_MAX_LEVEL, GRADE_MIN_LEVEL,
} from '../GradeConst';
import { GradeMgr } from '../GradeMgr';
import { GradeModel } from '../GradeModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeAvatarInfoPanel extends BaseCmp {
    @property(FightValue)
    private NdFv: FightValue = null;

    @property(cc.Node)
    private NdAnim: cc.Node = null;

    @property(cc.Node)
    private NdPrevBtn: cc.Node = null;

    @property(cc.Node)
    private NdNextBtn: cc.Node = null;

    @property(cc.Node)
    private NdMorphBtn: cc.Node = null;

    @property(cc.Node)
    private NdTakeOffBtn: cc.Node = null;

    @property(cc.Node)
    private NdGradeLv: cc.Node = null;

    @property(cc.Label)
    private LabGradeLv: cc.Label = null;

    @property(DynamicImage)
    private SprQuality: DynamicImage = null;

    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.Label)
    private LabStar: cc.Label = null;

    /** 功能ID */
    private _gradeId: number = -1;
    /** 等级 */
    private _level: number;
    /** 当前动画ID */
    private _animId: number;
    /** 当前皮肤配置 */
    private _skinCfg: Cfg_GradeSkin;
    /** 是否皮肤页签 */
    private _isSkinTab: boolean;
    /** 是否装备页 */
    private _isEquipTab: boolean;
    /** 可预览的最大等级 */
    private _maxLv: number = GRADE_MAX_LEVEL;
    /** tabId 桌子id */
    private _tabId: number = -1;
    private _gradeLv: number = -1;

    private changeTab: boolean = true;
    private changeGrade: boolean = true;
    private changeGradeLv: boolean = true;
    private gradeModel: GradeModel = null;
    private inited: boolean = false;
    public init(...param: unknown[]): void {
        const gradeModel = param[0] as GradeModel;
        this.gradeModel = gradeModel;
        // 标签页变化
        this.inited = true;
        this.changeGrade = this._gradeId !== gradeModel.data.GradeId;
        this.changeTab = this._tabId !== param[1];
        this.changeGradeLv = this._gradeLv !== gradeModel.cfg.Level;
        this._gradeLv = gradeModel.cfg.Level;
        this._gradeId = gradeModel.data.GradeId;
        this._tabId = param[1] as number;
        this._isSkinTab = this._tabId === GradePageTabType.SKIN;
        this._isEquipTab = this._tabId === GradePageTabType.EQUIP;
        if (this._isSkinTab) {
            // 皮肤页签的皮肤展示
            this.NdGradeLv.active = false;
            this.SprQuality.node.active = true;
            this.NdPrevBtn.active = false;
            this.NdNextBtn.active = false;
            this.NdFv.setOnFvAttrId(null);
        } else {
            this.NdGradeLv.active = true;
            this.SprQuality.node.active = false;
            this.LabStar.node.parent.active = false;

            // 设置战力属性
            const totalAttrFvId = param[2] as number | number[];
            if (param[2]) {
                if (typeof totalAttrFvId === 'number') {
                    this.NdFv.setOnFvAttrId(totalAttrFvId);
                } else {
                    this.NdFv.setOnFvAttrId(...totalAttrFvId);
                }
            }

            // console.log('---gradeModel----', gradeModel);
            // 皮肤幻化规则：幻化之前进阶皮肤后刷新整个数据别刷走了
            // 切换不同配置不影响别的
            // 其他升阶页签的皮肤展示
        }
        if (this.changeGrade || this.changeTab || this.changeGradeLv) {
            const level = gradeModel.data.GradeLv.BigLv;
            this._maxLv = Math.min(level + 1, GRADE_MAX_LEVEL);
            this.updateSkinByLevel(level, gradeModel.skinCfg);
        }
    }

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdPrevBtn, this.onClickPrevBtn, this);
        UtilGame.Click(this.NdNextBtn, this.onClickNextBtn, this);
        UtilGame.Click(this.NdMorphBtn, this.onClickMorphBtn, this);
        UtilGame.Click(this.NdTakeOffBtn, this.onClickTakeOffBtn, this);
    }

    /**
     * 点击前一个按钮
     */
    private onClickPrevBtn(): void {
        const prevLv = Math.max(this._level - 1, GRADE_MIN_LEVEL);
        this.updateSkinByLevel(prevLv);
    }

    /**
     * 点击下一阶预览按钮
     */
    private onClickNextBtn(): void {
        const nextLv = Math.min(this._level + 1, this._maxLv);
        this.updateSkinByLevel(nextLv);
    }

    /**
     * 点击幻化按钮
     */
    private onClickMorphBtn(): void {
        if (this._tabId === GradePageTabType.UP) { this.NdMorphBtn.active = false; }
        ControllerMgr.I.GradeController.reqC2SGradeSkinUse(this._gradeId, this._skinCfg.Key);
    }

    /**
     * 点击脱下按钮
     */
    private onClickTakeOffBtn(): void {
        ControllerMgr.I.GradeController.reqC2SGradeSkinOff(this._gradeId);
    }

    /**
     * 更新皮肤，根据等级
     * @param level 皮肤阶级
     * @param skinCfg
     */
    private updateSkinByLevel(level: number, skinCfg?: Cfg_GradeSkin) {
        this.NdPrevBtn.active = level > GRADE_MIN_LEVEL && !this._isEquipTab;
        this.NdNextBtn.active = level < this._maxLv && !this._isEquipTab;
        this._level = level;

        if (!skinCfg) {
            skinCfg = GradeMgr.I.getGradeSkinCfgByLevel(this._gradeId, level);
        }
        this._skinCfg = skinCfg;

        this.refreshAvatar(skinCfg);
        this.refreshState(this._gradeId, skinCfg?.Key, this._isSkinTab, this._isEquipTab);
    }

    protected onEnable(): void {
        if (this.inited) {
            this.refreshAvatar(this._skinCfg);
        }
    }

    /**
     * 更新皮肤
     * @param skin number | Cfg_GradeSkin
     */
    public updateSkin(skin: number | Cfg_GradeSkin, star: number = 0): void {
        if (typeof skin === 'number') {
            this._skinCfg = GradeMgr.I.getGradeSkinCfgById(skin);
        } else {
            this._skinCfg = skin;
        }
        // 显示品质
        if (this._skinCfg.NeedItem) {
            const itemCfg = UtilItem.GetCfgByItemId(this._skinCfg.NeedItem);
            this.SprQuality.loadImage(UtilItem.GetItemQualityFontImgPath(itemCfg.Quality, true), 1, true);
        }
        this.refreshAvatar(this._skinCfg);

        // 皮肤战力
        const attrInfo = GradeMgr.I.getGradeSkinAttrInfo(this._gradeId, this._skinCfg.Key);
        this.NdFv.setValue(attrInfo.fightValue);

        // 星级
        if (star > 0) this.LabStar.string = `${star}`;
        this.LabStar.node.parent.active = star > 0;

        this.refreshState(this._gradeId, this._skinCfg.Key, this._isSkinTab, this._isEquipTab);
    }

    /**
     * 刷新皮肤动画
     * @param skinCfg
     * @param type: number  0 init， 1 左右切 2 皮肤切
     */
    private refreshAvatar(skinCfg: Cfg_GradeSkin): void {
        /** 调用时机判断
        * 需要切换情况：0： 升阶皮肤左右切换，皮肤也切换  1： tab页签切换  2： 升阶/皮肤间切换，装备无切换 3：升星时切换为最新获得皮肤
        * 条件判断， gradeId,tabId,
        * 因为每次刷新都会传入整个新数据，所有需要根据以上行为相以限制。
        */

        // 刷新名字
        this.refreshLevel(this._level);
        // 处理资源类型
        let animId: number = 0;
        if (this._gradeId === FuncId.BeautyGrade) {
            const lineups = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.Beauty);
            let beauty: BeautyInfo;
            if (lineups && lineups[0]) {
                beauty = ModelMgr.I.BeautyModel.getBeauty(+lineups[0].OnlyId);
            } else {
                beauty = ModelMgr.I.BeautyModel.getCurViewShowBeauty();
            }
            const cfgBeauty: Cfg_Beauty = beauty.cfg.getValueByKey(beauty.BeautyId);
            animId = cfgBeauty.AnimId;
            const cfg = GradeMgr.I.getGradeCfg(this._gradeId, this._level);
            this.LabName.string = cfg?.Name || this.gradeModel.cfg.Name;
        } else if (this._gradeId === FuncId.AdviserGrade) {
            animId = ModelMgr.I.AdviserModel.getSkin();

            const cfg = GradeMgr.I.getGradeCfg(this._gradeId, this._level);
            this.LabName.string = cfg?.Name || this.gradeModel.cfg.Name;
        } else {
            this.LabName.string = skinCfg?.Name;
            animId = skinCfg.AnimId;
        }
        const resType = GradeMgr.I.getResTypeByGradeId(this._gradeId);

        if (this._animId === animId) return;
        this._animId = animId;
        this.NdAnim.destroyAllChildren();
        this.NdAnim.removeAllChildren();
        EntityUiMgr.I.createEntity(this.NdAnim, {
            resId: this._animId,
            resType,
            isPlayUs: false,
        });

        if (skinCfg?.XY) {
            const arr = skinCfg.XY.split(',');
            const offsetY = Number(arr[1]);
            const avatar = this.NdAnim.children[0];
            if (avatar && typeof offsetY === 'number') {
                avatar.position.x = 0;
                avatar.position.y = offsetY;
            }
        }
    }

    /**
     * 刷新阶级
     * @param level
     */
    private refreshLevel(level: number): void {
        this.LabGradeLv.string = UtilNum.ToChinese(level);
    }

    /**
     * 刷新状态
     * @param gradeId
     * @param skinId
     */
    private refreshState(gradeId: number, skinId: number, isSkinTab?: boolean, isEquipTab?: boolean): void {
        if (gradeId === FuncId.BeautyGrade || gradeId === FuncId.AdviserGrade) {
            this.NdMorphBtn.active = false;
            this.NdTakeOffBtn.active = false;
            this.NdAnim.scale = 0.8;
        } else {
            // 获取进阶皮肤状态 -1：未激活、0：已激活、1：幻化中
            const state = GradeMgr.I.getGradeSkinState(gradeId, skinId);
            this.NdMorphBtn.active = state === 0 && !isEquipTab; // 装备画面不显示幻化和方向箭头
            this.NdTakeOffBtn.active = isSkinTab && state === 1; // 只有皮肤页签才显示脱下
        }
    }
}
