/*
 * @Author: myl
 * @Date: 2022-10-18 14:25:24
 * @Description:
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { AttrModel } from '../../../../base/attribute/AttrModel';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { ItemWhere } from '../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagMgr } from '../../../bag/BagMgr';
import { RID } from '../../../reddot/RedDotConst';
import { UtilShop } from '../../../shop/UtilShop';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletQualityDetailView extends cc.Component {
    // 攻击
    @property(cc.Label)
    private att1Lab: cc.Label = null;
    @property(cc.Label)
    private att11Lab: cc.Label = null;
    // 生命
    @property(cc.Label)
    private att2Lab: cc.Label = null;
    @property(cc.Label)
    private att21Lab: cc.Label = null;

    // 防御
    @property(cc.Label)
    private att3Lab: cc.Label = null;
    @property(cc.Label)
    private att31Lab: cc.Label = null;

    @property(cc.Node)
    private BtnGroup: cc.Node = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Node)
    private NdNeed: cc.Node = null;

    @property(cc.Node)
    private BtnBreak: cc.Node = null;
    @property(cc.Node)
    private NdNeed1: cc.Node = null;
    @property(cc.Toggle)
    private Tog: cc.Toggle = null;
    @property(cc.Node)
    private NdBreak: cc.Node = null;

    @property(cc.Node)
    private maxLv: cc.Node = null;
    @property(cc.Label)
    private rateLab: cc.Label = null;
    @property(cc.Node)
    private mustLine: cc.Node = null;

    private _canUp = true;
    private _canBreak = false;

    private needUpItems: string = '';
    private protectItem: string = '';

    /** 如果未解锁上限则为false 点击提示解锁信息 */
    private _canClick = true;
    private _unClickTip = '';
    private breakOtherMatId: number = 0;

    @property(cc.Label)
    private tipLab: cc.Label = null;

    protected start(): void {
        UtilGame.Click(this.BtnUp, () => {
            if (!this._canClick) {
                MsgToastMgr.Show(this._unClickTip);
                return;
            }
            if (this._canUp) {
                ControllerMgr.I.SealAmuletController.refinementSealAmulet(this._data.Type, this.Tog.isChecked);
            } else {
                const breadNeed = this.needUpItems.split('|');
                for (let k = 0; k < breadNeed.length; k++) {
                    const itemConf = breadNeed[k].split(':');
                    if (!UtilShop.itemIsEnough(parseInt(itemConf[0]), parseInt(itemConf[1]), false)) { return; }
                }
            }
        }, this);

        UtilGame.Click(this.BtnBreak, () => {
            if (!this._canClick) {
                MsgToastMgr.Show(this._unClickTip);
                return;
            }
            const breadNeed = this.needUpItems.split('|');
            for (let k = 0; k < breadNeed.length; k++) {
                const itemConf = breadNeed[k].split(':');
                if (!UtilShop.itemIsEnough(parseInt(itemConf[0]), parseInt(itemConf[1]), false)) { return; }
            }
            ControllerMgr.I.SealAmuletController.refinementBreak(this._data.Type, this.Tog.isChecked);
        }, this);

        EventClient.I.on(E.SealAmulet.Quality, this.setUpView, this);
        EventClient.I.on(E.Bag.ItemChange, this.bagChange, this);

        const redId = this._data.Type === 1
            ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Refine.Up
            : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Refine.Up;
        const redId1 = this._data.Type === 1
            ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Refine.Break
            : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Refine.Break;
        UtilRedDot.Bind(redId, this.BtnUp, cc.v2(70, 25));
        UtilRedDot.Bind(redId1, this.BtnBreak, cc.v2(70, 25));
    }

    private _data: OfficeSign = null;
    public setUpView(data: OfficeSign): void {
        this._data = data;
        const stage = data.RefineLv;
        const pos = data.RefineValue;
        const model = ModelMgr.I.SealAmuletModel;
        const confCur = model.getAttByRefineLv(data.Type, stage, pos);
        let nextConf = model.getNextAttByQuality(confCur.Id + 1);
        if (!nextConf || nextConf.Tpye !== confCur.Tpye) {
            nextConf = null;
        }

        if (!nextConf) {
            // 满级
            nextConf = confCur;
            this.maxLv.active = true;
            this.BtnGroup.active = false;
            this.NdBreak.active = false;
            this._canBreak = false;
            this._canUp = false;
        } else {
            this.maxLv.active = false;
            // 未满级  判断是否可以 突破（当前的孔位= 最大孔位）
            const maxNum = model.getNumQuality(data.Type, data.RefineLv);
            if (maxNum === data.RefineValue) {
                // 突破
                this.BtnGroup.active = false;
                this.NdBreak.active = true;
                this._canBreak = true;
                this._canUp = true;
            } else {
                // 淬炼
                this.BtnGroup.active = true;
                this.NdBreak.active = false;
                this._canBreak = false;
                this._canUp = true;
            }
        }

        // 处理当前的进度条数据
        const att = AttrModel.MakeAttrInfo(confCur.Attr);
        const att1 = AttrModel.MakeAttrInfo(nextConf.Attr);
        const diffAtt = att1.diff(att);

        this.att1Lab.string = `${att.attrs[1].name}:${att.attrs[1].value}`;
        this.att11Lab.string = ` +${diffAtt.attrs[1].value}`;
        this.att11Lab.node.active = diffAtt.attrs[1].value > 0;

        this.att2Lab.string = `${att.attrs[0].name}:${att.attrs[0].value}`;
        this.att21Lab.string = ` +${diffAtt.attrs[0].value}`;
        this.att21Lab.node.active = diffAtt.attrs[0].value > 0;

        this.att3Lab.string = `${att.attrs[2].name}:${att.attrs[2].value}`;
        this.att31Lab.string = ` +${diffAtt.attrs[2].value}`;
        this.att31Lab.node.active = diffAtt.attrs[2].value > 0;

        const needItems = nextConf.NeedItem.split('|');
        for (let k = 0; k < needItems.length; k++) {
            const needItem = needItems[k].split(':');
            const haveNum = BagMgr.I.getItemNum(parseInt(needItem[0]));
            const needNum = parseInt(needItem[1]);
            this._canUp = this._canUp && (needNum <= haveNum);
        }

        if (!this._canBreak) { // 淬炼
            this.needUpItems = nextConf.NeedItem;
            this.protectItem = nextConf.ProtectItem;
            const protCfg = this.protectItem.split(':');
            const protNum = parseInt(protCfg[1]);
            const protId = parseInt(protCfg[0]);
            if (protNum > BagMgr.I.getItemNum(protId)) {
                this.Tog.isChecked = false; // 材料不足取消选中
                this.mustLine.active = this.Tog.isChecked;
            }
            const items = `${nextConf.NeedItem}|${nextConf.ProtectItem}`;
            UtilItemList.ShowItems(this.NdNeed, items, {
                option: {
                    needNum: true, where: ItemWhere.OTHER, needLimit: true,
                },
            });
            this.rateLab.string = `${i18n.tt(Lang.success_rate)}${this.Tog.isChecked ? 100 : nextConf.SuccessProbability / 100}%`;
        } else { // 突破
            UtilItemList.ShowItems(this.NdNeed1, nextConf.NeedItem, {
                option: {
                    needNum: false, where: ItemWhere.OTHER, needLimit: false,
                },
            }, (item: cc.Node, i: number) => {
                console.log(item, i);
                const itemIcon: ItemIcon = item.getComponent(ItemIcon);

                const arrItem: any[][] = UtilString.SplitToArray(nextConf.NeedItem);
                const itemId = Number(arrItem[i][0]);
                const itemNum = Number(arrItem[i][1]);
                const bagNum = BagMgr.I.getItemNum(itemId);
                itemIcon.showCountInName(bagNum, itemNum);
            });
            this.needUpItems = nextConf.NeedItem;
        }

        // 处理解锁信息
        const limitInfo = model.conditionInfo(nextConf);
        if (!limitInfo.state) {
            this._canClick = false;
            this._unClickTip = limitInfo.desc + i18n.tt(Lang.com_unlock_max);
            this.tipLab.string = i18n.tt(Lang.con_zhu) + this._unClickTip;
            this.tipLab.node.active = true;
        } else {
            this._canClick = true;
            this.tipLab.node.active = false;
        }
    }

    // 点击保护材料选中
    private togClick(): void {
        if (this.Tog.isChecked) {
            const protectCfg = this.protectItem.split(':');
            const protectId = parseInt(protectCfg[0]);
            const needNum = parseInt(protectCfg[1]);
            const haveNum = BagMgr.I.getItemNum(protectId);
            if (haveNum < needNum) {
                this.Tog.isChecked = false;
                WinMgr.I.open(ViewConst.ItemSourceWin, protectId);
            } else {
                this.Tog.isChecked = true;
                this.rateLab.string = `${i18n.tt(Lang.success_rate)}100%`;
            }
        } else {
            this.setUpView(this._data);
        }
        this.mustLine.active = this.Tog.isChecked;
    }

    private bagChange(changes: { itemModel: ItemModel, status: number }[]): void {
        let needRefresh = false;
        const ids = [];
        this.needUpItems.split('|').forEach((a) => {
            ids.push(a.split(':')[0]);
        });
        this.protectItem.split('|').forEach((a) => {
            ids.push(a.split(':')[0]);
        });
        for (let i = 0, len = changes.length; i < len; i++) {
            const info = changes[i];
            if (ids.indexOf(info.itemModel.cfg.Id.toString()) > -1) {
                needRefresh = true;
                break;
            }
        }

        if (needRefresh) {
            this.setUpView(this._data);
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.SealAmulet.Quality, this.setUpView, this);
        EventClient.I.off(E.Bag.ItemChange, this.bagChange, this);
    }
}
