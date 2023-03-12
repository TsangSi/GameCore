/* eslint-disable max-len */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { UtilColorFull } from '../../../base/utils/UtilColorFull';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemQuality } from '../../../com/item/ItemConst';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import ModelMgr from '../../../manager/ModelMgr';
import {
    GeneralMsg, HeadType, exMsg, ClickType,
} from '../GeneralConst';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GeneralHead extends BaseCmp {
    @property
    private HeadType: HeadType = HeadType.Info;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabLevel: cc.Label = null;
    @property(cc.Label)
    private LabCamp: cc.Label = null;
    @property(cc.Sprite)
    private SprTitle: cc.Sprite = null;
    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(cc.Node)
    private NdState: cc.Node = null;
    @property(DynamicImage)
    private SprQualityBg: DynamicImage = null;
    @property(DynamicImage)
    private SprQualityKuang: DynamicImage = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Sprite)
    private SprRarity: cc.Sprite = null;
    @property(cc.Node)
    private NdLock: cc.Node = null;
    @property(cc.Node)
    private NdSelect: cc.Node = null;
    @property(cc.Node)
    private NdLockB: cc.Node = null;

    private _msg: GeneralMsg = null;
    private _ex: exMsg = null;

    protected start(): void {
        super.start();
        this.addE();

        UtilGame.Click(this.node, this.onClick, this, { scale: 1 });
    }

    private addE() {
        EventClient.I.on(E.General.Lock, this.uptLock, this);
        EventClient.I.on(E.General.UptTitle, this.uptTitle, this);
        EventClient.I.on(E.General.GskinWear, this.uptUI, this);
    }

    private remE() {
        EventClient.I.off(E.General.Lock, this.uptLock, this);
        EventClient.I.off(E.General.UptTitle, this.uptTitle, this);
        EventClient.I.off(E.General.GskinWear, this.uptUI, this);
    }

    /** 改变锁状态后的刷新 */
    public uptLock(): void {
        if (this._msg) {
            this._msg = ModelMgr.I.GeneralModel.generalData(this._msg.generalData.OnlyId);
            if (this._msg) {
                this.NdLock.active = this._msg.generalData.Lock === 1;
                // 改变锁也会影响
                if (this._ex && this._ex.unshowSelect) {
                    this.NdSelect.active = false;
                    this.NdLockB.active = false;
                } else {
                    // 选中
                    this.NdSelect.active = !!this._ex?.isSelected;
                    // 带蒙层的大锁
                    if (this.NdLockB) {
                        if (this._ex && this._ex.qualityupSelect && this._ex.clickType === ClickType.QualityUp) {
                            this.NdLockB.active = (this._msg.generalData.Lock > 0 || this._msg.battlePos > 0) && !this.NdSelect.active;
                        } else if (this._ex && this._ex.clickType === ClickType.GradeChoose || this._ex.clickType === ClickType.Reborn || this._ex.clickType === ClickType.Disband) {
                            this.NdLockB.active = (this._msg.generalData.Lock > 0 || this._msg.battlePos > 0) && !this.NdSelect.active;
                        } else {
                            this.NdLockB.active = false;
                        }
                    }
                }
            }
        }
    }

    private uptTitle() {
        if (this._msg) {
            this._msg = ModelMgr.I.GeneralModel.generalData(this._msg.generalData.OnlyId);
            if (this._msg) {
                const headIcon = ModelMgr.I.GeneralModel.getGeneralResByData(this._msg, true);
                if (this.HeadType === HeadType.Info) {
                    this.SprIcon.loadImage(`${RES_ENUM.PortraitIcon}${headIcon}`, 1, true);
                } else {
                    this.SprIcon.loadImage(`${RES_ENUM.HeadIcon}${headIcon}`, 1, true);
                }

                if (this.HeadType === HeadType.Info) {
                    UtilGeneral.SetTitle(this.SprTitle, this.LabTitle, { rarity: this._msg.cfg.Rarity, title: this._msg.generalData.Title, type: 2 });
                } else {
                    UtilGeneral.SetTitle(this.SprTitle, this.LabTitle, { rarity: this._msg.cfg.Rarity, title: this._msg.generalData.Title, type: 3 });
                }
            }
        }
    }

    private uptUI() {
        // 名字
        if (!this._msg) {
            console.log('this._msg为空');
            return;
        }
        if (this.HeadType === HeadType.Info && this.LabName) {
            if (this._msg.generalData.Grade > 0) {
                this.LabName.string = `${this._msg.cfg.Name}+${this._msg.generalData.Grade}`;
            } else {
                this.LabName.string = this._msg.cfg.Name;
            }
        }
        if (this.LabName) {
            UtilColorFull.resetMat(this.LabName);
            if (this._msg.generalData.Quality === ItemQuality.COLORFUL) {
                UtilColorFull.setColorFull(this.LabName, false);
            } else {
                this.LabName.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(this._msg.generalData.Quality, true));
            }
        }

        // 等级 头像 品质
        const headIcon = ModelMgr.I.GeneralModel.getGeneralResByData(this._msg, true);
        if (this.HeadType === HeadType.Info) {
            if (this._msg.generalData.Level) {
                this.LabLevel.node.parent.active = true;
                this.LabLevel.string = `${this._msg.generalData.Level}`;
            } else {
                this.LabLevel.string = '';
                this.LabLevel.node.parent.active = false;
            }

            this.SprIcon.loadImage(`${RES_ENUM.PortraitIcon}${headIcon}`, 1, true);
            // 品质底图
            this.SprQualityBg.loadImage(`${RES_ENUM.General_Img_Wujiang_Kapai}${this._msg.generalData.Quality}_b`, 1, true);
            this.SprQualityKuang.loadImage(`${RES_ENUM.General_Img_Wujiang_Kapai}${this._msg.generalData.Quality}_a`, 1, true);
            // 头衔
            UtilGeneral.SetTitle(this.SprTitle, this.LabTitle, { rarity: this._msg.cfg.Rarity, title: this._msg.generalData.Title, type: 2 });
        } else {
            if ((this._ex && this._ex.unshowLevel) || !this._msg.generalData.Level) {
                this.LabLevel.string = '';
                this.LabLevel.node.parent.active = false;
            } else {
                this.LabLevel.node.parent.active = true;
                this.LabLevel.string = `${this._msg.generalData.Level}${i18n.lv}`;
            }

            this.SprIcon.loadImage(`${RES_ENUM.HeadIcon}${headIcon}`, 1, true);
            this.SprQualityBg.loadImage(UtilItem.GetItemQualityBgPath(this._msg.generalData.Quality), 1, true);
            // 头衔
            UtilGeneral.SetTitle(this.SprTitle, this.LabTitle, { rarity: this._msg.cfg.Rarity, title: this._msg.generalData.Title, type: 3 });
        }
        // 阵营
        UtilGeneral.SetCamp(this._msg.cfg.Camp, this.LabCamp);
        // 稀有度
        UtilGeneral.SetRarityRes(this.SprRarity, this._msg.cfg.Rarity);

        // 出战中
        this.NdState.active = this._msg.battlePos > 0;
        // 锁
        this.NdLock.active = this._msg.generalData.Lock === 1;

        if (this._ex && this._ex.unshowSelect) {
            this.NdSelect.active = false;
            this.NdLockB.active = false;
        } else {
            // 选中
            this.NdSelect.active = !!this._ex?.isSelected;
            // 带蒙层的大锁
            if (this.NdLockB) {
                if (this._ex && this._ex.qualityupSelect && this._ex.clickType === ClickType.QualityUp) {
                    this.NdLockB.active = (this._msg.generalData.Lock > 0 || this._msg.battlePos > 0) && !this.NdSelect.active;
                } else if (this._ex && this._ex.clickType === ClickType.GradeChoose || this._ex.clickType === ClickType.Reborn || this._ex.clickType === ClickType.Disband) {
                    this.NdLockB.active = (this._msg.generalData.Lock > 0 || this._msg.battlePos > 0) && !this.NdSelect.active;
                } else {
                    this.NdLockB.active = false;
                }
            }
        }
        // 红点
        let isRed: boolean = false;
        if (this._ex && this._ex.isRed) isRed = true;
        if (this.HeadType === HeadType.Info) {
            UtilRedDot.UpdateRed(this.node, isRed, cc.v2(68, 98));
        } else if (this.HeadType === HeadType.QualityUp) {
            UtilRedDot.UpdateRed(this.node, isRed, cc.v2(42, 42));
        } else if (this.HeadType === HeadType.Plan) {
            UtilRedDot.UpdateRed(this.node, isRed, cc.v2(42, 42));
        }
    }

    /**
     * 展示
     */
    public setData(gData: GeneralMsg, ex?: exMsg): void {
        if (!this.node || !this.node.isValid || !gData) return;

        this._msg = gData;
        this._ex = ex;

        if (!this._msg.cfg) {
            this._msg.cfg = Config.Get(Config.Type.Cfg_General).getValueByKey(gData.generalData.IId);
        }

        this.uptUI();
    }

    /**
     * 设置选中显示或者隐藏
     * @param active 显示或隐藏
     */
    public setSelectActive(active: boolean): void {
        this.NdSelect.active = active;
        if (this._ex) {
            this._ex.isSelected = active;
        }
    }

    /** 点击头像 */
    private onClick() {
        if (this._ex) {
            if (this._ex.callback) {
                this._ex.callback.call(this._ex.callback.call(this._ex.context, this._msg));
                return;
            }

            switch (this._ex.clickType) {
                case ClickType.Info:
                    if (this._ex.isSelected) {
                        return;
                    }
                    EventClient.I.emit(E.General.InfoHead, this._msg.generalData.OnlyId);
                    break;
                case ClickType.QualityUp:
                    EventClient.I.emit(E.General.QualityUpHead, this._msg.generalData.OnlyId);
                    break;
                case ClickType.Plan:
                    EventClient.I.emit(E.General.PlanHead, this._msg.generalData.OnlyId);
                    break;
                case ClickType.GradeCost:
                    EventClient.I.emit(E.General.GradeHead);
                    break;
                case ClickType.GradeChoose:
                    EventClient.I.emit(E.General.GradeChooseHead, this._msg.generalData.OnlyId);
                    break;
                case ClickType.EquipCost:
                    EventClient.I.emit(E.General.EquipHead);
                    break;
                default:
                    break;
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
