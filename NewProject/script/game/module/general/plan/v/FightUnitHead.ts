/*
 * @Author: zs
 * @Date: 2022-11-17 18:52:21
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\plan\v\FightUnitHead.ts
 * @Description:
 *
 */
import { UtilString } from '../../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage, ImageType } from '../../../../base/components/DynamicImage';
import { SpriteCustomizer } from '../../../../base/components/SpriteCustomizer';
import { Config } from '../../../../base/config/Config';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilGeneral from '../../../../base/utils/UtilGeneral';
import UtilItem from '../../../../base/utils/UtilItem';
import { RES_ENUM } from '../../../../const/ResPath';
import { EntityUnitType } from '../../../../entity/EntityConst';
import ModelMgr from '../../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class FightUnitHead extends BaseCmp {
    @property(cc.Node)
    private SpriteFight: cc.Node = null;
    @property(SpriteCustomizer)
    private SpriteFrame: SpriteCustomizer = null;
    @property(cc.Label)
    private LabelTypeName: cc.Label = null;
    @property(cc.Label)
    private LabelLevel: cc.Label = null;
    @property(cc.Label)
    private LabelQualityTitle: cc.Label = null;
    @property(cc.Label)
    private LabelStar: cc.Label = null;
    @property(DynamicImage)
    private SpriteQualityBg: DynamicImage = null;
    @property(DynamicImage)
    private SpriteQuality: DynamicImage = null;
    @property(DynamicImage)
    private SpriteIcon: DynamicImage = null;
    @property(cc.Sprite)
    private SpriteTitle: cc.Sprite = null;
    @property(cc.Sprite)
    private SpriteRarity: cc.Sprite = null;
    private unitType: EntityUnitType;
    private onlyId: string | number;
    private selectCallback: (unitType, onlyId) => void;
    private target: any;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.SpriteFrame.node, this.onNodeClicked, this);
    }

    private onNodeClicked() {
        if (this.selectCallback) {
            if (this.target) {
                this.selectCallback.call(this.target, this.unitType, this.onlyId);
            } else {
                this.selectCallback(this.unitType, this.onlyId);
            }
        }
        this.SpriteFrame.curIndex = 1;
    }

    /**
     * 设置选中的隐藏和显示
     * @param active 隐藏or显示
     */
    public setSelectActive(active: boolean): void {
        this.SpriteFrame.curIndex = active ? 1 : 0;
    }

    /**
     * 设置出战中的隐藏和显示
     * @param active 隐藏or显示
     */
    public setFightActive(active: boolean): void {
        this.SpriteFight.active = active;
    }

    private _index: number;
    public set index(idx: number) {
        this._index = idx;
    }

    public get index(): number {
        return this._index;
    }

    /**
     * 设置数据
     * @param unitType 助战类型
     * @param onlyId 唯一id
     * @param selectCallback 选中的回调
     * @param target 回调的上下文
     * @returns
     */
    public setData(unitType: EntityUnitType, onlyId: string | number, selectCallback?: (unitType, onlyId) => void, target?: any): void {
        this.SpriteFight.active = ModelMgr.I.TeamModel.isLineup(onlyId as string);
        if (this.unitType === unitType && this.onlyId === onlyId) {
            this.selectCallback = selectCallback;
            this.target = target;
            return;
        }
        this.unitType = unitType;
        this.onlyId = onlyId;
        this.target = target;
        this.selectCallback = selectCallback;
        this.LabelStar.node.parent.active = unitType === EntityUnitType.Beauty;
        this.SpriteQuality.node.active = unitType === EntityUnitType.Beauty;
        this.SpriteRarity.node.active = unitType === EntityUnitType.General;
        this.SpriteTitle.node.active = unitType === EntityUnitType.General;
        switch (unitType) {
            case EntityUnitType.General:
                this.showGeneralHead();
                break;
            case EntityUnitType.Beauty:
                this.showBeautyHead();
                break;
            default:
                break;
        }
    }

    private showGeneralHead() {
        const g = ModelMgr.I.GeneralModel.generalData(this.onlyId as string);
        const cfgGeneral: Cfg_General = Config.Get(Config.Type.Cfg_General).getValueByKey(g.generalData.IId);

        // 稀有度
        UtilGeneral.SetRarityRes(this.SpriteRarity, cfgGeneral.Rarity);

        const headIcon = ModelMgr.I.GeneralModel.getGeneralResByData(g, true);
        this.SpriteIcon.loadImage(`${RES_ENUM.HeadIcon}${headIcon}`, ImageType.PNG, true);
        this.SpriteQualityBg.loadImage(UtilItem.GetItemQualityBgPath(g.generalData.Quality), ImageType.PNG, true);
        // 头衔
        UtilGeneral.SetTitle(this.SpriteTitle, this.LabelQualityTitle, { rarity: cfgGeneral.Rarity, title: g.generalData.Title, type: 3 });
        this.LabelLevel.string = UtilString.FormatArgs(i18n.tt(Lang.com_level), g.generalData.Level);
        this.LabelTypeName.string = i18n.tt(Lang.general_name);
    }
    private showBeautyHead() {
        const beauty = ModelMgr.I.BeautyModel.getBeauty(+this.onlyId);
        const cfgBeauty: Cfg_Beauty = Config.Get(Config.Type.Cfg_Beauty).getValueByKey(+this.onlyId);
        // 稀有度
        this.SpriteQuality.loadImage(UtilItem.GetItemQualityFontImgPath(cfgBeauty.Quality), ImageType.PNG, true);
        // 品质框
        this.SpriteQualityBg.loadImage(UtilItem.GetItemQualityBgPath(cfgBeauty.Quality), ImageType.PNG, true);
        // 头像
        this.SpriteIcon.loadImage(`${RES_ENUM.HeadIcon}${cfgBeauty.AnimId}`, ImageType.PNG, true);
        this.LabelLevel.string = UtilString.FormatArgs(i18n.tt(Lang.com_level), beauty.Level);
        this.LabelStar.string = `${beauty.Star}`;
        this.LabelTypeName.string = i18n.tt(Lang.beauty_name);
    }
}
