/*
 * @Author: myl
 * @Date: 2022-10-17 20:12:29
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilArray } from '../../../../../app/base/utils/UtilArray';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { StarLabelComponent } from '../../../../base/components/StarLabelComponent';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import { TabPagesView } from '../../../../com/win/WinTabPageView';
import { E } from '../../../../const/EventName';
import { RES_ENUM } from '../../../../const/ResPath';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import ModelMgr from '../../../../manager/ModelMgr';
import { SealAmuletContentType, SealAmuletType } from '../SealAmuletConst';
import { SealAmuletGradeDetailView } from './SealAmuletGradeDetailView';
import { SealAmuletQualityContentView } from './SealAmuletQualityContentView';
import { SealAmuletQualityDetailView } from './SealAmuletQualityDetailView';
import { SealAmuletStarContentView } from './SealAmuletStarContentView';
import { SealAmuletStarDetailView } from './SealAmuletStarDetailView';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletView extends TabPagesView {
    /** 页面类型 1官印 2虎符 */
    private _type: SealAmuletType = SealAmuletType.Seal;
    private _contentType: SealAmuletContentType = SealAmuletContentType.Grade;

    private contentConfig: OfficeSign = null;

    @property(cc.Node)
    private NdContent: cc.Node = null;
    // 包括进度条 和 材料装备
    @property(cc.Node)
    private NdDetail: cc.Node = null;

    @property(cc.Label)
    private tip1Lab: cc.Label = null;
    @property(cc.Label)
    private nameLab: cc.Label = null;
    @property(DynamicImage)
    private iconSpr: DynamicImage = null;

    @property(DynamicImage)
    private qualitySpr: DynamicImage = null;
    @property(StarLabelComponent)
    private starLab: StarLabelComponent = null;

    @property(cc.Label)
    private LabPower: cc.Label = null;
    @property(cc.Node)
    private CheckBtn: cc.Node = null;

    protected start(): void {
        super.start();
        EventClient.I.on(E.SealAmulet.UpGrade, this.onEvent, this);
        EventClient.I.on(E.SealAmulet.UpStar, this.onEvent, this);
        EventClient.I.on(E.SealAmulet.Quality, this.onEvent, this);

        UtilGame.Click(this.CheckBtn, () => {
            const info = ModelMgr.I.SealAmuletModel.GetCurrInfo(this.contentConfig.Type);
            WinMgr.I.open(ViewConst.AttrDetailTips, info.property, info.skill.skill);
        }, this);

        cc.tween(this.iconSpr.node)
            .repeatForever(
                cc.tween().by(1, { position: cc.v2(0, 10) })
                    .by(1, { position: cc.v2(0, -10) }),
            )
            .start();
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.SealAmulet.UpGrade, this.onEvent, this);
        EventClient.I.off(E.SealAmulet.UpStar, this.onEvent, this);
        EventClient.I.off(E.SealAmulet.Quality, this.onEvent, this);
    }

    protected onEvent(data: OfficeSign): void {
        this.contentConfig = data;
        const model = ModelMgr.I.SealAmuletModel;
        const nameInfo = model.getAttByRefineLv(data.Type, data.RefineLv, data.RefineValue);
        this.nameLab.string = `${UtilNum.ToChinese(data.RefineLv)}${i18n.jie}`;
        this.qualitySpr.loadImage(UtilItem.GetItemQualityFontImgPath(nameInfo.Star, true), 1, true);
        this.iconSpr.loadImage(`${RES_ENUM.Official_Icon_Icon}${this._type === 1 ? 'guanyin' : 'hufu'}_${nameInfo.Picture}`, 1, true);
        this.starLab.updateStars(data.Star);
        const info = ModelMgr.I.SealAmuletModel.GetCurrInfo(this.contentConfig.Type);
        this.LabPower.string = UtilNum.ConvertFightValue(UtilArray.GetSum(info.fv));
    }
    public init(...param: unknown[]): void {
        this.updateUI(Number(param[0]), 0, Number(param[2]));
    }

    protected updateUI(idx: number, tabIdx: number, tabId: number): void {
        this._type = tabId;
        this._contentType = idx;
        this.contentConfig = ModelMgr.I.SealAmuletModel.getConfig(this._type);
        this.loadPrefab();
        this.setTip1();
        this.onEvent(this.contentConfig);
    }

    private setTip1() {
        if (this._contentType === SealAmuletContentType.Grade) {
            this.tip1Lab.string = i18n.tt(Lang.level_property);
        } else if (this._contentType === SealAmuletContentType.Star) {
            this.tip1Lab.string = i18n.tt(Lang.star_property);
        } else {
            this.tip1Lab.string = i18n.tt(Lang.refinement_property);
        }
    }

    private loadPrefab() {
        this.NdContent.destroyAllChildren();
        this.NdContent.removeAllChildren();
        this.NdDetail.destroyAllChildren();
        this.NdDetail.removeAllChildren();
        switch (this._contentType) {
            case SealAmuletContentType.Star:
                ResMgr.I.showPrefab(UI_PATH_ENUM.SealAmuletStarContentView, this.NdContent, (err, nd: cc.Node) => {
                    if (this.NdContent.children.length > 1) {
                        const child = this.NdContent.children[0];
                        child.removeFromParent();
                        child.destroy();
                    }
                    const itm = nd.getComponent(SealAmuletStarContentView);
                    itm.setUpView(this.contentConfig);
                });

                ResMgr.I.showPrefab(UI_PATH_ENUM.SealAmuletStarDetailView, this.NdDetail, (err, nd: cc.Node) => {
                    if (this.NdDetail.children.length > 1) {
                        const child = this.NdDetail.children[0];
                        child.removeFromParent();
                        child.destroy();
                    }
                    const det = nd.getComponent(SealAmuletStarDetailView);
                    det.setUpView(this.contentConfig);
                });
                break;
            case SealAmuletContentType.Quality:

                ResMgr.I.showPrefab(UI_PATH_ENUM.SealAmuletQualityContentView, this.NdContent, (err, nd: cc.Node) => {
                    if (this.NdContent.children.length > 1) {
                        const child = this.NdContent.children[0];
                        child.removeFromParent();
                        child.destroy();
                    }
                    const det = nd.getComponent(SealAmuletQualityContentView);
                    det.setUpView(this.contentConfig);
                });

                ResMgr.I.showPrefab(UI_PATH_ENUM.SealAmuletQualityDetailView, this.NdDetail, (err, nd: cc.Node) => {
                    if (this.NdDetail.children.length > 1) {
                        const child = this.NdDetail.children[0];
                        child.removeFromParent();
                        child.destroy();
                    }
                    const det = nd.getComponent(SealAmuletQualityDetailView);
                    det.setUpView(this.contentConfig);
                });
                break;
            default:
                ResMgr.I.showPrefab(UI_PATH_ENUM.SealAmuletGradeDetailView, this.NdDetail, (err, nd: cc.Node) => {
                    if (this.NdDetail.children.length > 1) {
                        const child = this.NdDetail.children[0];
                        child.removeFromParent();
                        child.destroy();
                    }
                    const det = nd.getComponent(SealAmuletGradeDetailView);
                    det.setUpView(this.contentConfig);
                });
                ResMgr.I.showPrefab(UI_PATH_ENUM.SealAmuletGradeContentView, this.NdContent, (err, nd: cc.Node) => {
                    if (this.NdContent.children.length > 1) {
                        const child = this.NdContent.children[0];
                        child.removeFromParent();
                        child.destroy();
                    }
                });
                break;
        }
    }
}
