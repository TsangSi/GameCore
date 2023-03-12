import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdventurePaneLiuLang extends BaseUiView {
    @property(ItemIcon)
    private ItemIcons: ItemIcon[] = [];

    @property(DynamicImage)
    private SprIcons: DynamicImage[] = [];

    @property(cc.Node)
    private NdPriceLines: cc.Node[] = [];

    @property(cc.Label)
    private LabPrices: cc.Label[] = [];

    @property(cc.Label)
    private LabRawPrices: cc.Label[] = [];

    @property(cc.Label)
    private LabSales: cc.Label[] = [];

    @property(cc.Node)
    private NdBuyBtns: cc.Node[] = [];

    @property(cc.Label)
    private LabBuyBtns: cc.Label[] = [];

    /** 事件说明 */
    @property(cc.Label)
    private NdDescLabel: cc.Label = null;

    private costTypes: number[] = [];

    private costNums: number[] = [];

    private curEvent: AdventureEvent = null;

    protected start(): void {
        const model = ModelMgr.I.AdventureModel;
        this.NdDescLabel.string = model.getEventDesc(1);

        this.NdBuyBtns.forEach((v, idx) => {
            UtilGame.Click(v, this.clickBuyLiuLangItem.bind(this, idx), this);
        });
    }

    private checkEvent(): boolean {
        if (!this.curEvent) return false;
        if (this.curEvent.State === 1) {
            MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_3));
            return false;
        }
        if (UtilTime.NowSec() >= this.curEvent.OverTime) {
            if (this.curEvent.EventId !== 3 || this.curEvent.EventWish.WishState !== 1) {
                MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_4));
                return false;
            }
        }

        return true;
    }

    public checkCost(idx: number): boolean {
        if (this.curEvent.EventBuyList[idx].BuyNum !== 0) {
            MsgToastMgr.Show(i18n.tt(Lang.shop_item_no_times));
            return false;
        }
        const count = RoleMgr.I.getCurrencyById(this.costTypes[idx]);
        if (count < this.costNums[idx]) {
            const name = UtilItem.NewItemModel(this.costTypes[idx]).cfg.Name;
            MsgToastMgr.Show(name + i18n.tt(Lang.com_buzu));
            WinMgr.I.open(ViewConst.ItemSourceWin, this.costTypes[idx]);
            return false;
        }
        return true;
    }

    /** 点击购买流浪商人物品 */
    protected clickBuyLiuLangItem(idx: number): void {
        console.log('点击购买流浪商人物品', idx);
        if (!this.checkCost(idx)) return;
        if (this.checkEvent()) {
            ControllerMgr.I.AdventureController.reqEventUse(this.curEvent.OnlyId, this.curEvent.EventBuyList[idx].Id);
        }
    }

    /**
     * 设置流浪商人物品购买列表
     * @param  items 物品列表
     * @param prices 货币列表
     * @param priceTypes 货币类型列表
     */
    public setData(active: boolean, ev: AdventureEvent = null, items: Cfg_AdventureShop[] = null): void {
        this.curEvent = ev;
        this.node.active = active;
        if (active) {
            for (let i = 0; i < this.ItemIcons.length; ++i) {
                const item = items[i];
                if (item) {
                    const ary = item.ItemString.split(':');
                    const itemModel = UtilItem.NewItemModel(Number(ary[0]), Number(ary[1]));
                    this.ItemIcons[i].setData(itemModel, { needNum: true });
                    const costImgUrl: string = UtilCurrency.getIconByCurrencyType(item.CostItem);
                    this.costTypes[i] = item.CostItem;
                    this.costNums[i] = item.Prize;
                    this.SprIcons[i].loadImage(costImgUrl, 1, true, 'resources', false, () => {
                        this.LabPrices[i].string = String(item.Prize);
                        this.LabRawPrices[i].string = String(item.OldPrize);
                        this.LabSales[i].string = String(item.Sale);
                        this.scheduleOnce(() => {
                            this.NdPriceLines[i].width = this.LabRawPrices[i].node.width + 48;
                        });
                    });

                    this.LabBuyBtns[i].string = ev.EventBuyList[i].BuyNum === 0 ? Lang.com_buy : Lang.com_shousheng;

                    UtilCocos.SetSpriteGray(this.NdBuyBtns[i], ev.EventBuyList[i].BuyNum !== 0, true);
                }
            }
        }
    }
}
