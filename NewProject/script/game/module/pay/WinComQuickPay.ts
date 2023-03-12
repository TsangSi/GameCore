/**
 * @Author: wx
 * @Date: 2022-07-10 16:21:13
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\GradeQuickPay.ts
 * @Description: 进阶一键购买弹窗
 */

import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilString } from '../../../app/base/utils/UtilString';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { DynamicImage } from '../../base/components/DynamicImage';
import { Config } from '../../base/config/Config';
import { ConfigShopIndexer } from '../../base/config/indexer/ConfigShopIndexer';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../base/utils/UtilCurrency';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilItem from '../../base/utils/UtilItem';
import ItemFromItem from '../../com/item/ItemFromItem';
import { ItemIcon } from '../../com/item/ItemIcon';
import { WinCmp } from '../../com/win/WinCmp';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import { BagMgr } from '../bag/BagMgr';
import { RoleMgr } from '../role/RoleMgr';
import { ShopChildType } from '../shop/ShopConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class WinComQuickPay extends WinCmp {
    @property(cc.Label)
    private ItemName: cc.Label = null;
    @property(cc.Node)
    private NdPrice: cc.Node = null;
    @property(ItemIcon)
    private NdItemIcon: ItemIcon = null;
    @property(cc.Node)
    private addBtnI: cc.Node = null;
    @property(cc.Node)
    private reduceI: cc.Node = null;
    @property(cc.Node)
    private addBtnX: cc.Node = null;
    @property(cc.Node)
    private reduceX: cc.Node = null;
    @property(cc.Node)
    private NdPayBtn: cc.Node = null;
    @property(cc.Label)
    private NdCounPrice: cc.Label = null;
    @property(cc.EditBox)
    private EbCounNum: cc.EditBox = null;
    @property(cc.Node)
    private NdToInvest: cc.Node = null;
    @property(cc.Node)
    private NdBottom: cc.Node = null;
    /** 跳转节点 */
    @property(cc.Node)
    private NdLink: cc.Node = null;
    // 限制购买数量
    private limitNum = 99999;
    // 单价
    private price = 0;
    // 总数
    private countNum = 0;
    // 总价
    private conutPrice = 0;
    // 使用道具
    private payItemId = 0;
    // 商城id
    private shopId: number = 0;
    // 消耗的货币
    private goodType = 0;
    // 首次打开
    private isFirst = true;
    protected start(): void {
        super.start();
    }

    /** 开启传入购买道具id */
    public init(param: unknown): void {
        super.init(param);
        // 假设单价为100
        this.payItemId = param[0];
        const indexer: ConfigShopIndexer = Config.Get(Config.Type.Cfg_ShopCity);
        const shopitems = indexer.getShopItemsByShopType(ShopChildType.Quick);
        shopitems.forEach((v) => {
            if (v.ItemID === this.payItemId) {
                this.shopId = v.GoodsID;
                this.price = v.SalePrice;
                this.goodType = v.GoldType;
            }
        });
        this.countNum = param[1] ? param[1] : 1;
        const itemModel = UtilItem.NewItemModel(this.payItemId);
        this.NdItemIcon.setData(itemModel, { needName: false, needNum: false });
        this.ItemName.string = itemModel.cfg.Name;
        this.ItemName.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(itemModel.cfg.Quality));
        this.conutPrice = this.price * this.countNum;
        this.NdPrice.getComponentInChildren(cc.Label).string = this.price.toString();
        // 少一个道具兑换表
        this.NdPrice.getComponentInChildren(DynamicImage).loadImage(UtilCurrency.getIconByCurrencyType(this.goodType), 1, true);
        this.NdCounPrice.getComponentInChildren(DynamicImage).loadImage(UtilCurrency.getIconByCurrencyType(this.goodType), 1, true);
        this.setBtnEvent();
        this.updataUI(true);
        this.isFirst = false;
        this.FromShow();
    }

    private setBtnEvent() {
        UtilGame.Click(this.addBtnI, () => {
            if (this.countNum >= this.limitNum) {
                MsgToastMgr.Show(i18n.tt(Lang.shop_pay_limit));
                return;
            }
            this.countNum += 1;
            this.updataUI();
        }, this);
        UtilGame.Click(this.addBtnX, () => {
            let tips = '';
            if (this.countNum >= (this.limitNum - 10)) {
                this.countNum = this.limitNum;
                tips = i18n.tt(Lang.shop_pay_limit);
            } else {
                this.countNum += 10;
            }
            this.updataUI(false, tips);
        }, this);
        UtilGame.Click(this.reduceI, () => {
            if (this.countNum <= 1) {
                this.countNum = 1;
                MsgToastMgr.Show(i18n.tt(Lang.shop_pay_min));
                return;
            }
            this.countNum -= 1;
            this.updataUI(false);
        }, this);
        UtilGame.Click(this.reduceX, () => {
            if (this.countNum <= 10) {
                this.countNum = 1;
                this.updataUI(false, i18n.tt(Lang.shop_pay_min));
                return;
            } else {
                this.countNum -= 10;
            }
            this.updataUI();
        }, this);
        UtilGame.Click(this.NdPayBtn, () => {
            // 发送购买请求
            const bgNum = BagMgr.I.getItemNum(this.goodType);
            const roleNum = RoleMgr.I.getCurrencyById(this.goodType);
            let haveNum: number = 0;
            if (bgNum === 0 && roleNum === 0) {
                haveNum = 0;
            } else {
                haveNum = bgNum !== 0 ? bgNum : roleNum;
            }
            if (this.countNum * this.price > haveNum) {
                if (this.goodType === 2) {
                    ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.exchange_tips), UtilColor.NorV), () => {
                        WinMgr.I.open(ViewConst.VipSuperWin, 0);
                    });
                    return;
                }
                MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(this.goodType).Name}${i18n.tt(Lang.not_enough)} `);
                return;
            }
            ControllerMgr.I.ShopController.buyNormalShopGoods(this.shopId, this.countNum);
            this.close();
        }, this);
        UtilGame.Click(this.NdToInvest, () => {
            WinMgr.I.open(ViewConst.VipSuperWin, 0);
            // 发送充值请求
        }, this);

        this.EbCounNum.node.on('text-changed', this.eBCallback, this);
    }

    private updataUI(isInit: boolean = false, tips: string = ''): void {
        const haveNum: number = BagMgr.I.getItemNum(this.goodType);
        let paytips: string = '';
        if (!isInit) {
            const goodTypeNum: boolean = this.countNum * this.price > haveNum;
            if (goodTypeNum) {
                if (!this.isFirst) {
                    this.EbCounNum.blur();
                    if (this.goodType === 2) {
                        ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.exchange_tips), UtilColor.NorV), () => {
                            WinMgr.I.open(ViewConst.VipSuperWin, 0);
                        });
                    } else {
                        paytips = `${UtilItem.GetCfgByItemId(this.goodType).Name}${i18n.tt(Lang.not_enough)} `;
                    }
                }
                this.countNum = Math.floor(haveNum / this.price);
            }
        } else if (this.limitNum < parseInt(this.EbCounNum.string)) {
            // 是否超过限制数量
            if (!this.isFirst) {
                paytips = i18n.tt(Lang.shop_pay_limit);
            }
            this.EbCounNum.string = this.limitNum.toString();
        }
        // 需求要显示数量减少的时候不提示购买货币不足
        if (tips !== '') {
            MsgToastMgr.Show(tips);
        } else if (paytips !== '') {
            MsgToastMgr.Show(paytips);
        }
        if (this.countNum === 0) {
            this.countNum = 1;
        }
        this.EbCounNum.string = this.countNum.toString();
        this.conutPrice = this.countNum * this.price;
        this.NdCounPrice.getComponentInChildren(cc.Label).string = this.conutPrice.toString();
    }

    private eBCallback(editbox: cc.EditBox): void {
        const edString: string = editbox.string;
        let num: string = edString.replace(/[^0-9]/ig, '');
        if (Number.isNaN(parseInt(num))) {
            num = '1';
        }
        this.countNum = parseInt(num);
        this.updataUI();
    }

    /** 展示来源 */
    private FromShow(): void {
        const itemCfg = UtilItem.GetCfgByItemId(this.payItemId);
        const sources = UtilItem.GetCfgItemSources(itemCfg.FromID);
        if (sources.length > 0) {
            // this.NdBottom.active = true;
            ResMgr.I.showPrefab(UI_PATH_ENUM.Com_Item_ItemFromItem, null, (err, nd: cc.Node) => {
                for (let i = 0; i < sources.length; i++) {
                    const item = sources[i];
                    const itemNd = cc.instantiate(nd);
                    itemNd.getComponent(ItemFromItem).setData(item);
                    this.NdLink.addChild(itemNd);
                }
            });
        } else {
            // this.NdBottom.active = false;
        }
    }
}
