/*
 * @Author: dcj
 * @Date: 2022-12-03 09:54:36
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\v\CollectionUpDetailsWin.ts
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { EAttrType } from '../../../base/attribute/AttrConst';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemSourceWin } from '../../../com/item/ItemSourceWin';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { ECollectionBookCfg, ECollectionBookTabId } from '../CollectionBookConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectionUpDetailsWin extends BaseUiView {
    @property(cc.Label)
    private LabelTitle: cc.Label = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Node)
    private NodeItem: cc.Node = null;
    @property(cc.Label)
    private LabelCurNum: cc.Label = null;
    @property(cc.Label)
    private LabelNextNum: cc.Label = null;
    @property(cc.Label)
    private LabelAttack: cc.Label = null;
    @property(cc.Label)
    private LabelNextAttack: cc.Label = null;
    @property(cc.Label)
    private LabelDef: cc.Label = null;
    @property(cc.Label)
    private LabelNextDef: cc.Label = null;
    @property(cc.Label)
    private LabelHp: cc.Label = null;
    @property(cc.Label)
    private LabelNextHp: cc.Label = null;
    @property(cc.Label)
    private LabelStar: cc.Label = null;
    @property(cc.Label)
    private LabelNextStar: cc.Label = null;
    @property(cc.Label)
    private LabelFight: cc.Label = null;
    @property(cc.Node)
    private BtnActive: cc.Node = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Node)
    private NodeStar: cc.Node = null;
    @property(cc.Node)
    private NodeFull: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnActive, this.onBtnActive, this);
        UtilGame.Click(this.BtnUp, this.onBtnUp, this);
        UtilGame.Click(this.node, 'SprBlack', this.close, this);
        UtilGame.Click(this.BtnClose, this.close, this);
        EventClient.I.on(E.CollectionBook.NewActive, this.onNewActive, this);
        EventClient.I.on(E.CollectionBook.UpdateStar, this.onUpdateStar, this);
    }

    private onBtnUp() {
        if (BagMgr.I.getItemNum(this.curShowItemId) >= this.curNeedItemNum) {
            ControllerMgr.I.CollectionBookController.C2SCollectionBookStarUp(this.cfg.Id);
        } else {
            WinMgr.I.open(ViewConst.ItemSourceWin, this.curShowItemId);
        }
    }

    private onBtnActive() {
        if (BagMgr.I.getItemNum(this.curShowItemId) >= this.curNeedItemNum) {
            ControllerMgr.I.CollectionBookController.C2SCollectionBookActive(this.cfg.Id);
        } else {
            WinMgr.I.open(ViewConst.ItemSourceWin, this.curShowItemId);
        }
    }

    private cfg: Cfg_CollectionBook = null;
    private curShowItemId: number = 0;
    private curNeedItemNum: number = 0;
    public init(params: any[]): void {
        super.init(params);
        this.cfg = params[0];
        this.showBase();
        this.updateShow();
        this.updateBtnActive();
        EventClient.I.on(`${E.Bag.ItemChangeOfId}${this.cfg.Unlockitem}`, this.onItemChange, this);
        EventClient.I.on(`${E.Bag.ItemChangeOfId}${this.cfg.StarUpItem}`, this.onItemChange, this);
    }

    private onItemChange() {
        this.updateItemNum();
    }

    private showBase() {
        this.LabelName.string = this.cfg.Name;
        // eslint-disable-next-line max-len
        // const name = this.cfg.Class === ECollectionBookTabId.Person ? i18n.tt(Lang.collectionbook_person_details) : i18n.tt(Lang.collectionbook_wonder_details);
        // this.LabelTitle.string = i18n;
        this.LabelName.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(this.cfg.Quality));
        // if (this.cfg.Class === ECollectionBookTabId.Person) {
        //     this.SprIcon.loadImage(`${RES_ENUM.PortraitIcon}${this.cfg.AnimId}`, ImageType.PNG, true);
        // } else {
        this.SprIcon.loadImage(`${RES_ENUM.CollectionBook_Oddity}${this.cfg.AnimId}`, ImageType.JPG, true);
        // }
    }

    private updateItemNum() {
        const hasNum = BagMgr.I.getItemNum(this.curShowItemId);
        this.LabelCurNum.string = `${hasNum}`;
        const isShowRed = hasNum >= this.curNeedItemNum;
        this.LabelCurNum.node.color = isShowRed ? UtilColor.ColorEnough : UtilColor.ColorUnEnough;
        this.LabelNextNum.node.color = isShowRed ? UtilColor.ColorEnough : UtilColor.Hex2Rgba(UtilColor.NorN);
        this.LabelNextNum.string = `/${this.curNeedItemNum}`;
        UtilRedDot.UpdateRed(this.BtnActive.active ? this.BtnActive : this.BtnUp, isShowRed, cc.v2(71, 16));
    }

    private updateShow() {
        const cfg = this.cfg;
        const attr = AttrModel.MakeAttrInfo(this.cfg.Attr);
        const attrBase = attr.clone();
        const item = ModelMgr.I.CollectionBookModel.getItem(this.cfg.Id);
        const star = item ? item.Star : 0;
        let needNum: number = 1;
        let itemId: number = cfg.Unlockitem;
        const cfgStarNext: Cfg_CollectionBookStar = ModelMgr.I.CollectionBookModel.getCfg(ECollectionBookCfg.Star).getIntervalData(star + 1);
        if (item) {
            const ratio = ModelMgr.I.CollectionBookModel.getAttrStarRatio(star);
            attr.mul(ratio);
            if (cfgStarNext) {
                needNum = cfgStarNext.LevelUpItem;
            }
            itemId = cfg.StarUpItem;
        }
        this.curNeedItemNum = needNum;
        this.curShowItemId = itemId;
        this.LabelStar.string = `${star}`;
        this.updateAttr(star, attrBase, attr);
        UtilItem.Show(this.NodeItem, UtilItem.NewItemModel(itemId));
        this.updateItemNum();
    }

    private updateAttr(star: number, addAttr: AttrInfo, attr: AttrInfo) {
        // const addAttr = attr.clone();
        if (!star) {
            attr.attrs.forEach((a) => {
                a.value = 0;
            });
        }
        const nextStar = star + 1;

        const cfgStarNext: Cfg_CollectionBookStar = ModelMgr.I.CollectionBookModel.getCfg(ECollectionBookCfg.Star).getIntervalData(nextStar);
        if (cfgStarNext) {
            const nextRatio = ModelMgr.I.CollectionBookModel.getAttrStarRatio(nextStar);
            addAttr.mul(nextRatio);
            addAttr.diff(attr);
        }
        for (let i = 0, n = attr.attrs.length; i < n; i++) {
            const type = attr.attrs[i].attrType;
            if (type === EAttrType.Attr_1) {
                this.LabelHp.string = `${attr.attrs[i].value}`;
            } else if (type === EAttrType.Attr_2) {
                this.LabelAttack.string = `${attr.attrs[i].value}`;
            } else if (type === EAttrType.Attr_3) {
                this.LabelDef.string = `${attr.attrs[i].value}`;
            }
        }
        if (addAttr) {
            this.LabelNextAttack.node.active = true;
            this.LabelNextDef.node.active = true;
            this.LabelNextHp.node.active = true;
            for (let i = 0, n = addAttr.attrs.length; i < n; i++) {
                const addtype = addAttr.attrs[i].attrType;
                if (addtype === EAttrType.Attr_1) {
                    this.LabelNextHp.string = `+${addAttr.attrs[i].value}`;
                } else if (addtype === EAttrType.Attr_2) {
                    this.LabelNextAttack.string = `+${addAttr.attrs[i].value}`;
                } else if (addtype === EAttrType.Attr_3) {
                    this.LabelNextDef.string = `+${addAttr.attrs[i].value}`;
                }
            }
        } else {
            this.LabelNextAttack.node.active = false;
            this.LabelNextDef.node.active = false;
            this.LabelNextHp.node.active = false;
        }
        this.BtnActive.active = !star;
        this.BtnUp.active = !!star;
        this.LabelNextStar.string = `${nextStar}`;

        this.LabelFight.string = UtilNum.ConvertFightValue(attr.fightValue);
    }

    private onUpdateStar() {
        this.updateShow();
        this.updateBtnActive();
    }

    private updateBtnActive() {
        const isFullStar = ModelMgr.I.CollectionBookModel.isFullStar(this.cfg.Id);
        this.NodeFull.active = isFullStar;
        this.NodeItem.parent.active = !isFullStar;
        // this.LabelCurNum.node.parent.active = !isFullStar;
        // this.BtnActive.active = isFullStar ? false : this.BtnActive.active;
        // this.BtnUp.active = isFullStar ? false : this.BtnUp.active;
        this.LabelNextStar.string = isFullStar ? i18n.tt(Lang.com_text_full) : this.LabelNextStar.string;
        this.LabelNextStar.node.children[0].active = !isFullStar;
        UtilCocos.SetActive(this.NodeStar, 'SprJiantou', !isFullStar);
        UtilCocos.SetActive(this.NodeStar, 'NextStar', !isFullStar);
        UtilCocos.SetActive(this.NodeStar, 'CurStar/LabelFull', isFullStar);
        this.LabelNextAttack.node.active = !isFullStar;
        this.LabelNextDef.node.active = !isFullStar;
        this.LabelNextHp.node.active = !isFullStar;
        if (isFullStar) {
            this.LabelAttack.node.parent.x = 0;
            this.LabelDef.node.parent.x = 0;
            this.LabelHp.node.parent.x = 0;
        } else {
            this.LabelAttack.node.parent.x = -70;
            this.LabelDef.node.parent.x = -70;
            this.LabelHp.node.parent.x = -70;
        }
    }

    private onNewActive() {
        this.updateShow();
    }

    protected onDestroy(): void {
        super.onDestroy();

        EventClient.I.off(E.CollectionBook.NewActive, this.onNewActive, this);
        EventClient.I.off(E.CollectionBook.UpdateStar, this.onUpdateStar, this);
        EventClient.I.off(`${E.Bag.ItemChangeOfId}${this.cfg.Unlockitem}`, this.onItemChange, this);
        EventClient.I.off(`${E.Bag.ItemChangeOfId}${this.cfg.StarUpItem}`, this.onItemChange, this);
    }
}
