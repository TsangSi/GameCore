/*
 * @Author: kexd
 * @Date: 2022-11-18 14:28:28
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\com\GSkillItem.ts
 * @Description: 武将-技能item
 *
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import {
    ESkillItemShow,
    ESkillState, ISkillEx,
} from '../GeneralConst';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { EffectMgr } from '../../../manager/EffectMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class GSkillItem extends BaseCmp {
    @property(DynamicImage)
    private SprBg: DynamicImage = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Sprite)
    private SprType: cc.Sprite = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabLv: cc.Label = null;
    // 锁定
    @property(cc.Sprite)
    private SprLock: cc.Sprite = null;
    // 状态为未激活显示激活条件
    @property(cc.Node)
    private NdLockDesc: cc.Node = null;
    @property(cc.Label)
    private LabLockDesc: cc.Label = null;
    // 状态为可激活
    @property(cc.Node)
    private NdActive: cc.Node = null;
    // 还未学习的
    @property(cc.Node)
    private NdUnStudy: cc.Node = null;
    @property(cc.Node)
    private NdContent: cc.Node = null;
    @property(cc.Node)
    private NdAnim: cc.Node = null;

    private _ex: ISkillEx = null;
    private _callback: (ex: ISkillEx, clickType: number) => void = null;
    private _context: any;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdActive, () => {
            if (this._callback && this._ex) {
                this._callback.call(this._context, this._ex, 2);
            }
        }, this, { scale: 1 });

        UtilGame.Click(this.SprLock.node, () => {
            if (this._callback && this._ex) {
                this._callback.call(this._context, this._ex, this._ex.isLock ? 4 : 3);
            }
        }, this, { scale: 1 });

        UtilGame.Click(this.SprBg.node, () => {
            if (this._ex) {
                if (this._ex.isShowUnStudy) {
                    MsgToastMgr.Show(i18n.tt(Lang.general_skill_lock));
                    return;
                }
                if (this._callback) {
                    this._callback.call(this._context, this._ex, 1);
                }
            }
        }, this, { scale: 1 });
    }

    /**
     * 武将-技能item展示
     */
    public setData(ex: ISkillEx, callBack: (ex: ISkillEx, clickType: number) => void = null, context: any = null): void {
        this._ex = ex;
        this._callback = callBack;
        this._context = context;

        if (!ex) {
            this.SprBg.loadImage(RES_ENUM.Com_Img_Com_Img_Jinengkuang);
            this.NdUnStudy.active = true;
            this.NdContent.active = false;
            return;
        }

        if (!ex.skillId) {
            this.SprBg.loadImage(RES_ENUM.Com_Img_Com_Img_Jinengkuang);
            this.NdUnStudy.active = !!ex.isShowUnStudy;
            this.NdContent.active = false;
            return;
        }

        this.NdContent.active = true;
        // 锁
        if (ex.isShowLock) {
            this.SprLock.node.active = true;
            UtilCocos.LoadSpriteFrame(this.SprLock, ex.isLock ? RES_ENUM.Com_Btn_Com_Btn_Suo_2 : RES_ENUM.Com_Btn_Com_Btn_Suo_1);
        } else {
            this.SprLock.node.active = false;
        }
        // 是否未学习
        this.NdUnStudy.active = !!ex.isUnStudy && !!ex.isShowUnStudy;
        // 品质背景
        const skillCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(ex.skillId);
        if (!skillCfg) {
            console.log('技能表里没有该技能数据：', ex.skillId);
            return;
        }
        if (skillCfg.Quality) {
            this.SprBg.loadImage(`${RES_ENUM.Com_Bg_Com_Bg_Skill}${skillCfg.Quality}`, 1, true);
        } else {
            this.SprBg.loadImage(RES_ENUM.Com_Img_Com_Img_Jinengkuang);
        }
        // icon
        this.SprIcon.loadImage(`${RES_ENUM.Skill}${skillCfg.SkillIconID}`, 1, true);
        // 角标类型
        UtilGeneral.SetSkillFlag(this.SprType, ex.skillType);

        // 0:不显示名字也不显示等级 1:只显示名字 2:名字的位置显示等级 3:同时显示名字和等级
        this.LabName.string = '';
        this.LabLv.string = '';
        if (ex.showNameOrLv === ESkillItemShow.OnlyName) {
            this.LabName.string = skillCfg.SkillName;
        } else if (ex.showNameOrLv === ESkillItemShow.OnlyLvAtNamePosition) {
            this.LabName.string = `${ex.skillLv}`;
        } else if (ex.showNameOrLv === ESkillItemShow.AllShow) {
            this.LabName.string = skillCfg.SkillName;
            this.LabLv.string = `${ex.skillLv}${i18n.lv}`;
        }

        let isRed: boolean = false;
        // 状态：未激活 灰，现在激活条件
        if (ex.skillState === ESkillState.UnActive) {
            this.NdLockDesc.active = true;
            this.LabLockDesc.string = ex.activeDesc;
            this.NdActive.active = false;
            UtilCocos.SetSpriteGray(this.SprIcon.node, true);
        } else if (ex.skillState === ESkillState.CanActive) {
            // 可激活
            this.NdLockDesc.active = false;
            this.NdActive.active = true;
            UtilCocos.SetSpriteGray(this.SprIcon.node, true);
            isRed = true;
        } else {
            // 已激活
            this.NdLockDesc.active = false;
            this.NdActive.active = false;
            UtilCocos.SetSpriteGray(this.SprIcon.node, false);
        }

        UtilRedDot.UpdateRed(this.node, isRed, cc.v2(42, 42));
    }

    public playAnim(): void {
        this.NdAnim.destroyAllChildren();
        EffectMgr.I.showEffect(RES_ENUM.Com_Ui_8006, this.NdAnim, cc.WrapMode.Normal);
    }
}
