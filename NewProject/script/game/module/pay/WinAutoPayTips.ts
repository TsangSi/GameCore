/*
 * @Author: wangxin
 * @Date: 2022-08-26 11:47:31
 * @FilePath: \SanGuo\assets\script\game\module\pay\WinAutoPayTips.ts
 */

import { i18n, Lang } from '../../../i18n/i18n';
import { DynamicImage } from '../../base/components/DynamicImage';
import { Config } from '../../base/config/Config';
import { ConfigShopIndexer } from '../../base/config/indexer/ConfigShopIndexer';
import { UtilCurrency } from '../../base/utils/UtilCurrency';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilItem from '../../base/utils/UtilItem';
import { ItemIcon } from '../../com/item/ItemIcon';
import { WinCmp } from '../../com/win/WinCmp';
import { ShopChildType } from '../shop/ShopConst';
import { WinAutoPayTipsModel } from './WinAutoPayTipsModel';

const { ccclass, property } = cc._decorator;
export interface IWinAutoPayTips {
    /** 回调 */
    cb: (b: boolean, p?: Cfg_ShopCity) => void,
    /** 购买的物品 */
    itemId: number,
    /** 存储的key */
    recordKey: number,
    /** tips */
    tips?: string,
    /** title */
    title?: string,
    /** cd */
    cd?: number,
    /** 是否显示不再提示tog */
    unshowTog?: boolean,
    /** 使用richtext */
    richText?: string
}

@ccclass
export class WinAutoPayTips extends WinCmp {
    @property(ItemIcon)
    private item: ItemIcon = null;
    @property(cc.Label)
    private priceNum: cc.Label = null;
    @property(DynamicImage)
    private DyPriceIcon: DynamicImage = null;
    @property(cc.Node)
    private NdBtnCancel: cc.Node = null;
    @property(cc.Node)
    private NdBtnSure: cc.Node = null;
    @property(cc.Toggle)
    private checkBox: cc.Toggle = null;
    @property(cc.Label)
    private LabTips: cc.Label = null;
    @property(cc.RichText)
    private RichTips: cc.RichText = null;
    @property(cc.Node)
    private NdCd: cc.Node = null;
    @property(cc.Label)
    private LabTime: cc.Label = null;

    private conf: IWinAutoPayTips = null;
    private _shopData: Cfg_ShopCity = null;
    public init(param: unknown): void {
        if (param && param[0]) {
            this.conf = param[0] as IWinAutoPayTips;
        }
        const _itemModel = UtilItem.NewItemModel(this.conf.itemId);
        let price: number = 0;
        let goodType: number = 1;
        const indexer: ConfigShopIndexer = Config.Get(Config.Type.Cfg_ShopCity);
        // 9为固定的快捷商店的类型
        const shopItems = indexer.getShopItemsByShopType(ShopChildType.Quick);
        shopItems.forEach((v) => {
            if (v.ItemID === this.conf.itemId) {
                price = v.SalePrice;
                goodType = v.GoldType;
                this._shopData = v;
            }
        });
        if (this.conf.richText) {
            this.LabTips.node.active = false;
            this.RichTips.node.active = true;
            this.RichTips.string = this.conf.richText;
        } else {
            this.LabTips.node.active = true;
            this.RichTips.node.active = false;
            if (this.conf.tips) {
                this.LabTips.string = this.conf.tips;
            } else {
                this.LabTips.string = i18n.tt(Lang.com_buy_tips);
            }
        }

        if (this.conf.title) {
            this.resetTitle(this.conf.title);
        } else {
            this.resetTitle(i18n.tt(Lang.com_tips));
        }
        this.checkBox.node.active = !this.conf.unshowTog;

        this.priceNum.string = price.toString();
        this.item.setData(_itemModel, { needName: false, needNum: false });
        this.DyPriceIcon.loadImage(UtilCurrency.getIconByCurrencyType(goodType), 1, true);
        UtilGame.Click(this.NdBtnSure, this.BtnClick, this);
        UtilGame.Click(this.NdBtnCancel, this.BtnCancel, this);
        this.checkBox.isChecked = WinAutoPayTipsModel.getState(this.conf.recordKey);

        this.NdCd.active = this.conf.cd > 0;
        if (this.conf.cd) {
            this._time = this.conf.cd;
            this.LabTime.string = `${this._time}秒`;
            this.unschedule(this.uptTime);
            this.schedule(this.uptTime, 1);
        } else {
            this.LabTime.string = '';
        }
    }

    private _time: number = 0;
    private uptTime() {
        if (this._time > 0) {
            this._time--;
            this.LabTime.string = `${this._time}秒`;
        } else {
            this.close();
        }
    }

    private _clickClose = false;
    public BtnClick(): void {
        this._clickClose = true;
        if (this.conf && this.conf.cb) {
            this.conf.cb(true, this._shopData);
        }
        WinAutoPayTipsModel.setState(this.conf.recordKey, this.checkBox.isChecked);
        this.close();
    }

    public BtnCancel(): void {
        this._clickClose = true;
        if (this.conf && this.conf.cb) {
            this.conf.cb(false, this._shopData);
        }
        WinAutoPayTipsModel.setState(this.conf.recordKey, false);
        this.close();
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (!this._clickClose) {
            if (this.conf && this.conf.cb) {
                this.conf.cb(false, this._shopData);
            }
            WinAutoPayTipsModel.setState(this.conf.recordKey, false);
        }
    }
}
