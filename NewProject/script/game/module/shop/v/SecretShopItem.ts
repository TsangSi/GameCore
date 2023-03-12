/*
 * @Author: myl
 * @Date: 2022-09-02 17:58:08
 * @Description:
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilItemList from '../../../base/utils/UtilItemList';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { ShopSecretItem } from '../UtilShop';

const { ccclass, property } = cc._decorator;

@ccclass
export class SecretShopItem extends cc.Component {
    @property(cc.Node)
    private iconNd: cc.Node = null;
    // 原价
    @property(cc.Label)
    private prize0Lab: cc.Label = null;
    // 折扣
    @property(cc.Label)
    private prize1Lab: cc.Label = null;

    @property(DynamicImage)
    private prize0Spr: DynamicImage = null;

    /** 折扣信息 */
    @property(cc.Label)
    private discountLab: cc.Label = null;

    @property(cc.Node)
    private NdBuydBtn: cc.Node = null;
    @property(cc.Node)
    private NdCurrency: cc.Node = null;
    private canClick: boolean = true;
    protected start(): void {
        UtilGame.Click(this.NdCurrency, () => {
            if (this.canClick) {
                const coinName = UtilItem.GetCfgByItemId(this._data.cfg.CostItem).Name;
                const tipString = UtilString.FormatArray(
                    i18n.tt(Lang.shop_buy_tip),
                    [UtilColor.NorV, UtilColor.RedV, `${this._data.cfg.Prize}${coinName}`, this._data.cfg.GoodsTitle],
                );
                ModelMgr.I.MsgBoxModel.ShowBox(tipString, () => {
                    if (this._data && this._data.cfg) {
                        ControllerMgr.I.ShopController.buyShopGoods(this._data.cfg.Id);
                    } else {
                        MsgToastMgr.Show(i18n.tt(Lang.shop_item_unBuy));
                    }
                });
                // 连续点击处理
                this.canClick = false;
                this.scheduleOnce(() => {
                    this.canClick = true;
                }, 0.5);
            }
        }, this);
    }
    private _data: ShopSecretItem = null;
    public setData(data: ShopSecretItem): void {
        this._data = data;
        if (!data) {
            this.node.active = false;
        } else {
            this.node.active = true;
            this.prize0Lab.string = `${data.cfg.OldPrize}`;
            this.prize1Lab.string = `${data.cfg.Prize}`;
            this.prize0Spr.loadImage(UtilCurrency.getIconByCurrencyType(data.cfg.CostItem), 1, true);
            UtilItemList.ShowItems(this.iconNd, data.cfg.ItemString, { option: { needNum: true } });
            this.discountLab.string = `${data.cfg.Sale}\n    ${i18n.tt(Lang.shop_zhe)}`;
            this.NdCurrency.active = data.data.State === 0;
            this.NdBuydBtn.active = data.data.State !== 0;
        }
    }
}
