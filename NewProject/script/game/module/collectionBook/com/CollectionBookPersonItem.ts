/*
 * @Author: zs
 * @Date: 2022-12-01 18:08:44
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\com\CollectionBookPersonItem.ts
 * @Description: 博物志-奇物-item
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { StarLabelComponent } from '../../../base/components/StarLabelComponent';
import { Config } from '../../../base/config/Config';
import { ConfigAttributeIndexer } from '../../../base/config/indexer/ConfigAttributeIndexer';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { ECollectionBookCfg, ECollectionBookTabId } from '../CollectionBookConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectionBookPersonItem extends BaseCmp {
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelFight: cc.Label = null;
    @property(StarLabelComponent)
    private LabelStar: StarLabelComponent = null;
    @property(DynamicImage)
    private SpriteIcon: DynamicImage = null;
    @property(cc.Node)
    private NodeLock: cc.Node = null;
    private cfg: Cfg_CollectionBook = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.node, this.onClicked, this);
    }

    private itemId: number = 0;
    private needNum: number = 0;
    public setData(index: number): void {
        // this.index = index;
        this.cfg = Config.Get(Config.Type.Cfg_CollectionBook).getValueByIndex(index);
        const cfg = this.cfg;
        // if (cfg.Class === ECollectionBookTabId.Person) {
        //     this.SpriteIcon.loadImage(`${RES_ENUM.PortraitIcon}${cfg.AnimId}`, ImageType.PNG, true);
        // } else {
        this.SpriteIcon.loadImage(`${RES_ENUM.CollectionBook_Oddity}${cfg.AnimId}`, ImageType.JPG, true);
        // }
        this.LabelName.string = cfg.Name;
        this.LabelName.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(cfg.Quality));
        const attr = AttrModel.MakeAttrInfo(cfg.Attr);

        const item = ModelMgr.I.CollectionBookModel.getItem(cfg.Id);
        let itemId: number = 0;
        if (item) {
            this.NodeLock.active = false;
            this.LabelStar.updateStars(item.Star);
            this.LabelStar.node.active = true;
            const cfgStar: Cfg_CollectionBookStar = ModelMgr.I.CollectionBookModel.getCfg(ECollectionBookCfg.Star).getIntervalData(item.Star + 1);
            itemId = cfg.StarUpItem;
            UtilRedDot.UpdateRed(this.node, cfgStar && BagMgr.I.getItemNum(cfg.StarUpItem) >= cfgStar.LevelUpItem, cc.v2(85, 120));
            if (cfgStar) {
                this.needNum = cfgStar.LevelUpItem;
            }
            attr.mul(ModelMgr.I.CollectionBookModel.getAttrStarRatio(item.Star));
        } else {
            this.LabelStar.node.active = false;
            this.NodeLock.active = true;
            itemId = cfg.Unlockitem;
            this.needNum = 1;
            UtilRedDot.UpdateRed(this.node, BagMgr.I.getItemNum(cfg.Unlockitem) >= 1, cc.v2(85, 120));
        }

        this.LabelFight.string = UtilNum.ConvertFightValue(attr.fightValue);
        const isFullStar = ModelMgr.I.CollectionBookModel.isFullStar(this.cfg.Id);
        if (isFullStar || this.itemId !== itemId) {
            if (this.itemId !== 0) {
                EventClient.I.off(`${E.Bag.ItemChangeOfId}${this.itemId}`, this.onItemChange, this);
            }
            if (!isFullStar) {
                this.itemId = itemId;
                EventClient.I.on(`${E.Bag.ItemChangeOfId}${this.itemId}`, this.onItemChange, this);
            }
        }
    }
    private onItemChange() {
        UtilRedDot.UpdateRed(this.node, BagMgr.I.getItemNum(this.itemId) >= this.needNum, cc.v2(85, 120));
    }

    protected onDestroy(): void {
        super.onDestroy();

        EventClient.I.off(`${E.Bag.ItemChangeOfId}${this.itemId}`, this.onItemChange, this);
    }

    private onClicked() {
        WinMgr.I.open(ViewConst.CollectionUpDetailsWin, this.cfg);
    }
}
