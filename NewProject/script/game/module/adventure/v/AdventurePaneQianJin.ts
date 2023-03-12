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
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdventurePaneQianJin extends BaseUiView {
    @property(ItemIcon)
    private ItemIcon: ItemIcon = null;

    @property(DynamicImage)
    private SprIcon: DynamicImage = null;

    @property(cc.Node)
    private NdPriceLine: cc.Node = null;

    @property(cc.Label)
    private LabPrice: cc.Label = null;

    @property(cc.Label)
    private LabRawPrice: cc.Label = null;

    @property(cc.Label)
    private LabSale: cc.Label = null;

    @property(cc.Node)
    private NdBuyBtn: cc.Node = null;

    @property(cc.Label)
    private LabBuyBtn: cc.Label = null;

    /** 事件说明 */
    @property(cc.Label)
    private NdDescLabel: cc.Label = null;

    private costType: number = 0;

    private costNum: number = 0;

    private curEvent: AdventureEvent = null;

    protected start(): void {
        const model = ModelMgr.I.AdventureModel;
        this.NdDescLabel.string = model.getEventDesc(5);
        UtilGame.Click(this.NdBuyBtn, this.clickBuyQianJinItem.bind(this), this);
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

    public checkCost(): boolean {
        const count = RoleMgr.I.getCurrencyById(this.costType);
        if (this.curEvent.EventGoldBuy.BuyNum !== 0) {
            MsgToastMgr.Show(i18n.tt(Lang.shop_item_no_times));
            return false;
        }
        if (count < this.costNum) {
            const name = UtilItem.NewItemModel(this.costType).cfg.Name;
            MsgToastMgr.Show(name + i18n.tt(Lang.com_buzu));
            WinMgr.I.open(ViewConst.ItemSourceWin, this.costType);
            return false;
        }
        return true;
    }

    /** 点击购买千金物品 */
    protected clickBuyQianJinItem(): void {
        console.log('点击购买千金物品');
        if (!this.checkCost()) return;
        if (this.checkEvent()) {
            ControllerMgr.I.AdventureController.reqEventUse(this.curEvent.OnlyId, this.curEvent.EventGoldBuy.Id);
        }
    }

    /**
     * 设置千金台购买物品
     * @param  items 物品列表
     * @param prices 货币列表
     * @param priceTypes 货币类型列表
     */
    public setData(active: boolean, ev: AdventureEvent = null, item: Cfg_AdventureShop = null): void {
        this.curEvent = ev;
        this.node.active = active;
        if (active) {
            if (item) {
                const ary = item.ItemString.split(':');
                this.costType = item.CostItem;
                this.costNum = item.Prize;
                const itemModel = UtilItem.NewItemModel(Number(ary[0]), Number(ary[1]));
                this.ItemIcon.setData(itemModel, { needNum: true });
                const costImgUrl: string = UtilCurrency.getIconByCurrencyType(item.CostItem);
                this.SprIcon.loadImage(costImgUrl, 1, true, 'resources', false, () => {
                    this.LabPrice.string = String(item.Prize);
                    this.LabRawPrice.string = String(item.OldPrize);
                    this.LabSale.string = String(`${item.Sale}\n${i18n.tt(Lang.shop_zhe)}`);
                    this.scheduleOnce(() => {
                        this.NdPriceLine.width = this.LabRawPrice.node.width + 48;
                    });
                });

                this.LabBuyBtn.string = ev.EventGoldBuy.BuyNum === 0 ? Lang.com_buy : Lang.com_shousheng;

                UtilCocos.SetSpriteGray(this.NdBuyBtn, ev.EventGoldBuy.BuyNum !== 0, true);
            }
        }
    }
}
