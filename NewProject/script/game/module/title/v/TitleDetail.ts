/*
 * @Author: kexd
 * @Date: 2022-06-14 15:43:17
 * @FilePath: \SanGuo2.4\assets\script\game\module\title\v\TitleDetail.ts
 * @Description: 邮件详情
 *
 */

import { StarLabelComponent } from '../../../base/components/StarLabelComponent';
import { Config } from '../../../base/config/Config';
import { ConfigTitleLevelUpIndexer } from '../../../base/config/indexer/ConfigTitleLevelUpIndexer';
import { WinCmp } from '../../../com/win/WinCmp';
import EntityBase from '../../../entity/EntityBase';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilItem from '../../../base/utils/UtilItem';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { NdAttrBaseContainer } from '../../../com/attr/NdAttrBaseContainer';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import ItemFromItem from '../../../com/item/ItemFromItem';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { UtilColor } from '../../../../app/base/utils/UtilColor';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TitleDetail extends WinCmp {
    @property(cc.Node)
    private NdAnim: cc.Node = null;
    // 属性
    @property(cc.Label)
    private LabRare: cc.Label = null;
    @property(cc.Label)
    private LabFv: cc.Label = null;
    @property(DynamicImage)
    private SprQuality: DynamicImage = null;
    @property(cc.Node)
    private NdStar: cc.Node = null;
    @property(cc.Node)
    private NdAttr: cc.Node = null;
    // 获取途径
    @property(cc.Label)
    private LabGet: cc.Label = null;
    @property(cc.Node)
    private NdGet2: cc.Node = null;
    @property(cc.Node)
    private LayItem: cc.Node = null;

    private _role: EntityBase = null;
    private _titleData: TitleData = null;

    protected start(): void {
        super.start();

        this.addE();

        this.NdAnim.destroyAllChildren();
        this.NdAnim.removeAllChildren();
        this._role = EntityUiMgr.I.createAttrEntity(this.NdAnim, {
            isMainRole: true, isPlayUs: false, isShowTitle: true,
        });

        this.uptContent();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    private addE() {
        //
    }

    private remE() {
        //
    }

    public init(data: unknown): void {
        if (data && data[0]) {
            if (typeof data[0] === 'number') {
                this._titleData = new TitleData();
                this._titleData.TitleId = data[0];
            } else {
                this._titleData = data[0];
            }

            this.uptContent();
        }
    }

    private uptContent() {
        if (!this._titleData) return;
        const titleId: number = this._titleData.TitleId;
        const cfg: Cfg_Title = Config.Get(Config.Type.Cfg_Title).getValueByKey(titleId);

        // 称号
        if (this._role) {
            this._role.setTitleAnim(titleId);
        }

        // 稀有
        let rate: number = 0;
        if (this._titleData.RateValue > 0) {
            rate = this._titleData.RateValue;
        } else {
            rate = cfg.Rate;
        }

        if (rate > 0) {
            rate = Math.round(rate / 100);
            if (rate < 1) rate = 1;
            if (rate > 100) rate = 100;

            this.LabRare.node.active = true;
            this.LabRare.string = UtilString.FormatArray(i18n.tt(Lang.title_detail_active), [rate]);
        } else {
            this.LabRare.node.active = false;
        }
        // 战力和品质
        let fv = 0;
        let star = 0;
        if (this._titleData) {
            fv = ModelMgr.I.TitleModel.calculateFv(titleId, star);
            star = this._titleData.Star;
        }
        this.LabFv.string = `${fv}`;
        this.SprQuality.loadImage(UtilItem.GetItemQualityFontImgPath(cfg.Quality, true), 1, true);
        // 星星
        if (cfg.IsLevelUp === 1) {
            this.NdStar.active = true;
            this.NdStar.getComponent(StarLabelComponent).updateStars(star);
        } else {
            this.NdStar.active = false;
        }

        // 属性
        const indexer: ConfigTitleLevelUpIndexer = Config.Get(Config.Type.Cfg_TitleLevelUp);
        const ratio = indexer.getTitleAttrRatio(star);
        const attr: IAttrBase[] = UtilAttr.GetAttrBaseListById(cfg.AttrId);
        for (let i = 0; i < attr.length; i++) {
            attr[i].value = Math.ceil(attr[i].value * ratio);
        }
        this.NdAttr.getComponent(NdAttrBaseContainer).init(attr, 200, { nameC: UtilColor.NorN });

        // 产出
        this.LabGet.string = cfg.FromDesc;
        // 获取
        const FromID: string = Config.Get(Config.Type.Cfg_Item).getValueByKey(cfg.NeedItem, 'FromID');
        if (FromID) {
            this.NdGet2.active = true;
            const sources: Cfg_ItemSource[] = UtilItem.GetCfgItemSources(FromID);
            // console.log('sources=', sources);
            this.LayItem.destroyAllChildren();
            this.LayItem.removeAllChildren();
            ResMgr.I.showPrefab(UI_PATH_ENUM.Com_Item_ItemFromItem, null, (err, nd: cc.Node) => {
                // console.log('-----------sources=', sources, sources.length);
                this.LayItem.destroyAllChildren();
                this.LayItem.removeAllChildren();
                for (let i = 0; i < sources.length; i++) {
                    const item = sources[i];
                    const itemNd = cc.instantiate(nd);
                    itemNd.getComponent(ItemFromItem).setData(item);
                    this.LayItem.addChild(itemNd);
                }
            });
        } else {
            this.NdGet2.active = false;
        }
    }
}
