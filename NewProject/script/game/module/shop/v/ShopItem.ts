/*
 * @Author: myl
 * @Date: 2022-08-31 11:28:22
 * @Description:
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { ConfigCycleTimesIndexer } from '../../../base/config/indexer/ConfigCycleTimesIndexer';
import { ConditionTypeEnum, ConfigLimitConditionIndexer } from '../../../base/config/indexer/ConfigLimitConditionIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilItemList from '../../../base/utils/UtilItemList';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { IItemMsg, ItemWhere } from '../../../com/item/ItemConst';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { IComPayModel } from '../../pay/WinQuickPay';
import { ShopCommonItem } from '../UtilShop';

const { ccclass, property } = cc._decorator;

@ccclass
export class ShopItem extends cc.Component {
    @property(cc.Node)
    private btnBuy: cc.Node = null;
    @property(cc.Node)
    private ndIcon: cc.Node = null;
    @property(cc.Label)
    private labGoodsName: cc.Label = null;

    @property(cc.Label)
    private labTimes1: cc.Label = null;
    @property(cc.Label)
    private labTimes2: cc.Label = null;
    @property(cc.Label)
    private labTimes3: cc.Label = null;

    @property(cc.Node)
    private ndTimes: cc.Node = null;
    // @property(cc.Node)
    // private ndTime: cc.Node = null;

    /** 原价 */
    @property(cc.Label)
    private labPrize0: cc.Label = null;
    /** 折扣价 */
    @property(cc.Label)
    private labPrize1: cc.Label = null;

    /** 货币图标 */
    @property(DynamicImage)
    private sprCoin: DynamicImage = null;
    @property(DynamicImage)
    private sprCoin1: DynamicImage = null;

    @property(cc.Node)
    private ndPrize: cc.Node = null;
    @property(cc.Node)
    private ndPrize1: cc.Node = null;
    // 折扣信息
    @property(cc.Label)
    private LabDiscount: cc.Label = null;
    // 折扣信息
    @property(cc.Node)
    private NdDiscount: cc.Node = null;
    @property(DynamicImage)
    private discountBg: DynamicImage = null;

    @property(cc.Node)
    private ndNull: cc.Node = null;
    @property(cc.Node)
    private redLine: cc.Node = null;
    @property(cc.Node)
    private NdPrizeBg: cc.Node = null;

    @property(cc.Label)
    private unlockLabel: cc.Label = null;

    protected start(): void {
        UtilGame.Click(this.btnBuy, () => {
            // 点击购买
            if (this.unlockLabel.node.active) {
                MsgToastMgr.Show(i18n.tt(Lang.shop_item_connot_buy));
                // MsgToastMgr.Show(this._unlockString);
                return;
            }
            if (this._residueDegree <= 0) {
                MsgToastMgr.Show(i18n.tt(Lang.shop_item_no_times));
                return;
            }
            if (parseFloat(this._data.cfg.Sale) <= 0) { // 免费商品()小数点转化时可能出现为0情况
                ControllerMgr.I.ShopController.buyNormalShopGoods(this._data.cfg.GoodsID, 1);
                return;
            }
            const cb: (num: number) => void = (num: number) => { ControllerMgr.I.ShopController.buyNormalShopGoods(this._data.cfg.GoodsID, num); };
            const data: IComPayModel = {
                itemId: this._data.cfg.GoodsID,
                type: 0,
                payNum: this._data.data ? this._data.data.BuyTimes : 0,
                callback: cb,
            };
            WinMgr.I.open(ViewConst.WinQuickPay, data);
        }, this, { scale: 1 });
    }

    private _data: ShopCommonItem = null;
    // 当前是否解锁
    private _unlockString: string = '';
    // 剩余可购买次数
    private _residueDegree: number = 0;
    public setData(data: ShopCommonItem, idx: number): void {
        if (data === this._data) return;
        this._data = data;

        // 红点处理
        const redState = ModelMgr.I.ShopModel.freeShopItemState(data.cfg.GoodsID);
        UtilRedDot.UpdateRed(this.node, redState, cc.v2(100, -65));

        const item = UtilItem.NewItemModel(data.cfg.ItemID, data.cfg.BuyNum);
        UtilItem.ItemNameScrollSet(item, this.labGoodsName, item.cfg.Name, false);
        const cfg: IItemMsg = { option: { needNum: data.cfg.BuyNum > 1, where: ItemWhere.SHOP } };
        UtilItemList.ShowItemArr(this.ndIcon, [item], cfg);
        this.sprCoin.loadImage(UtilCurrency.getIconByCurrencyType(data.cfg.GoldType), 1, true);
        this.sprCoin1.loadImage(UtilCurrency.getIconByCurrencyType(data.cfg.GoldType), 1, true);
        const sale = Number(data.cfg.Sale);
        this.redLine.active = sale < 10;
        if (sale <= 0) {
            // 免费道具
            this.NdDiscount.active = true;
            this.LabDiscount.string = `${i18n.tt(Lang.shop_free)}`;
            this.discountBg.loadImage(RES_ENUM.Shop_Img_Sc_Mianfei, 1, true);
            this.labPrize0.string = `${data.cfg.GoodsPrice}`;
            this.labPrize1.node.active = true;
            this.labPrize1.string = `${i18n.tt(Lang.shop_free)}`;
            this.ndPrize1.active = true;
            this.sprCoin1.node.active = false;
        } else if (sale >= 10) {
            // 无折扣道具
            this.NdDiscount.active = false;
            this.labPrize1.node.active = false;
            this.ndPrize1.active = false;
            this.labPrize0.string = `${data.cfg.GoodsPrice}`;
            this.sprCoin1.node.active = true;
        } else {
            // 有折扣道具
            this.NdDiscount.active = true;
            this.discountBg.loadImage(RES_ENUM.Shop_Img_Sc_Zhekou, 1, true);
            this.LabDiscount.string = `${data.cfg.Sale}${i18n.tt(Lang.shop_zhe)}`;
            this.labPrize0.string = `${data.cfg.GoodsPrice}`;
            this.labPrize1.node.active = true;
            this.labPrize1.string = `${data.cfg.SalePrice}`;
            this.ndPrize1.active = true;
            this.sprCoin1.node.active = true;
        }

        // 0:限制条件处理
        if (data.cfg.LimConID > 0) {
            const condInfo = Config.Get<ConfigLimitConditionIndexer>(Config.Type.Cfg_LimitCondition).getCondition(data.cfg.LimConID);
            if (!condInfo.state) { // 未达解锁条件
                this.limitTimesCondition(data);
                this.ndPrize.active = false;
                this._unlockString = condInfo.desc;
                this.unlockLabel.string = this._unlockString;
                this.unlockLabel.node.active = true;
                this.ndNull.active = false;
                // this.ndTime.active = false;
            } else {
                this.unlockLabel.node.active = false;
                this._unlockString = '';
                // 限制次数
                this.limitTimesCondition(data);
            }
        } else {
            this.unlockLabel.node.active = false;
            this._unlockString = '';
            this.limitTimesCondition(data);
        }

        UtilColor.setGray(this.NdPrizeBg, this.ndNull.active);
    }

    private limitTimesCondition(data: ShopCommonItem) {
        // 1: 限购次数
        if (data.cfg.LimTimeID > 0) { // 有限制
            this.ndTimes.active = true;
            const CycleTimes: ConfigCycleTimesIndexer = Config.Get(Config.Type.Cfg_CycleTimes);
            const info = CycleTimes.getTimes(data.cfg.LimTimeID);
            // 剩余次数
            let buyTimes = 0;
            if (data.data === null || data.data === undefined) {
                buyTimes = info.num;
            } else {
                buyTimes = info.num - data.data.BuyTimes;
            }
            this.labTimes1.string = info.desc;
            this.labTimes2.string = `${buyTimes}`;
            this.labTimes3.string = `/${info.num})`;
            this._residueDegree = buyTimes;
            if (buyTimes > 0) {
                this.labTimes2.node.color = UtilColor.Hex2Rgba(UtilColor.GreenV);
                this.ndNull.active = false;
                this.ndPrize.active = true;
            } else {
                this.labTimes2.node.color = UtilColor.Hex2Rgba(UtilColor.RedV);
                this.ndPrize.active = false;
                this.ndNull.active = true;
            }
        } else {
            // 无限制
            this.ndTimes.active = false;
            this._residueDegree = 1000;
            this.ndNull.active = false;
            this.ndPrize.active = true;
        }
    }

    /** 限制时间：倒计时 暂不处理 */
    private limitTimeCondition(data: ShopCommonItem) {
        const condInfo = Config.Get<ConfigLimitConditionIndexer>(Config.Type.Cfg_LimitCondition).getCondition(data.cfg.LimConID);
        if (condInfo.info.ConditionFunc === ConditionTypeEnum.Func_9) { // 开服天数 倒计时
            // this.ndTime.active = true;
            if ((UtilFunOpen.serverDays - condInfo.info.Param1) > 2) {
                //
            } else {
                //
            }
        }
    }
}
