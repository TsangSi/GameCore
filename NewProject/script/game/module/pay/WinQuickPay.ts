/**
 * @Author: wx
 * @Date: 2022-07-10 16:21:13
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\WinQuickPay.ts
 * @Description: 通用一键购买弹窗
 */
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilString } from '../../../app/base/utils/UtilString';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { DynamicImage } from '../../base/components/DynamicImage';
import { Config } from '../../base/config/Config';
import { ConfigCycleTimesIndexer } from '../../base/config/indexer/ConfigCycleTimesIndexer';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../base/utils/UtilCurrency';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilItem from '../../base/utils/UtilItem';
import UtilItemList from '../../base/utils/UtilItemList';
import { ItemWhere } from '../../com/item/ItemConst';
import ItemModel from '../../com/item/ItemModel';
import { WinCmp } from '../../com/win/WinCmp';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import { BagMgr } from '../bag/BagMgr';
import { RoleMgr } from '../role/RoleMgr';

const { ccclass, property } = cc._decorator;

/**
 * @param itemId 通用购买传商品id
 * @param type 面板类型： 0 通用购买，1 快速购买
 * @param num 可选， 设置打开时购买数量
 * @param limitNum 可选，设置已购买数量
 * @param callback 可选，设置回调
 */
export interface IComPayModel {
    itemId: number,
    type: number,
    num?: number,
    payNum?: number,
    callback?: (num: number) => void
}

@ccclass
export class WinQuickPay extends WinCmp {
    @property(cc.Label)
    private ItemName: cc.Label = null;
    @property(cc.Node)
    private NdPrice: cc.Node = null;
    @property(cc.Node)
    private NdItemIcon: cc.Node = null;
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
    @property(cc.Node)
    private NdMyselfNum: cc.Node = null;
    @property(cc.Label)
    private NdCounPrice: cc.Label = null;
    @property(cc.EditBox)
    private EbCounNum: cc.EditBox = null;
    @property(cc.Node)
    private NdToInvest: cc.Node = null;
    @property(cc.Node)
    private NdLimtPay: cc.Node = null;
    @property(cc.RichText)
    private DescLab: cc.RichText = null;

    // 面板模式
    private _type = 0;

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

    // 消耗的货币
    private goodType = 0;
    // 首次打开
    private isFirst = true;
    private callBack: (num: number) => void;

    protected start(): void {
        super.start();
    }

    /** 开启传入购买道具id */
    public init(param: IComPayModel[]): void {
        super.init(param);
        // 假设单价为100
        const data = param[0];
        this.payItemId = data.itemId;
        // 通用商城传商品id，快速购买传的可能是道具id
        this._type = data.type;
        this.callBack = data.callback;
        const shopData: Cfg_ShopCity = Config.Get(Config.Type.Cfg_ShopCity).getValueByKey(this.payItemId);
        // console.log('商品信息', shopData);

        const CycleTimes: ConfigCycleTimesIndexer = Config.Get(Config.Type.Cfg_CycleTimes);
        const limitInfo = CycleTimes.getTimes(shopData.LimTimeID);
        const isLimit: boolean = !!limitInfo;
        const absNum = data.payNum ? data.payNum : 0;
        this.limitNum = isLimit ? limitInfo.num - absNum : 99999;

        this.DescLab.string = UtilItem.GetCfgByItemId(shopData.ItemID).Description;
        const itemModel: ItemModel = UtilItem.NewItemModel(shopData.ItemID, shopData.BuyNum);
        UtilItemList.ShowItemArr(this.NdItemIcon, [itemModel], { option: { needName: false, needNum: true, where: ItemWhere.SHOP } });
        this.ItemName.string = itemModel.cfg.Name;
        this.ItemName.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(itemModel.cfg.Quality));
        this.countNum = data.num ? data.num > this.limitNum ? this.limitNum : data.num : 1;
        // 道具价格换算
        this.goodType = shopData.GoldType;
        this.price = shopData.SalePrice ? shopData.SalePrice : shopData.GoodsPrice;
        this.conutPrice = this.price * this.countNum;
        if (this._type === 0) {
            // 单价和持有数量切换
            const bagNum = BagMgr.I.getItemNum(shopData.ItemID);
            this.NdMyselfNum.getComponentInChildren(cc.Label).string = bagNum.toString();
            const NdLimtPay = this.NdLimtPay.getChildByName('Layout');
            NdLimtPay.active = isLimit;
            if (isLimit) {
                NdLimtPay.getChildByName('LbNumR').getComponent(cc.Label).string = `/${limitInfo.num})`;
                NdLimtPay.getChildByName('LbNumL').getComponent(cc.Label).string = (limitInfo.num - data.payNum).toString();
            }
        } else {
            //
            this.NdPrice.getComponentInChildren(cc.Label).string = this.price.toString();
            this.NdPrice.getComponentInChildren(DynamicImage).loadImage(UtilCurrency.getIconByCurrencyType(shopData.GoldType), 1, true);
        }
        this.NdToInvest.active = this._type === 0;
        this.NdMyselfNum.active = this._type === 0;
        this.NdPrice.active = this._type === 1;

        this.NdCounPrice.getComponentInChildren(DynamicImage).loadImage(UtilCurrency.getIconByCurrencyType(shopData.GoldType), 1, true);
        this.setBtnEvent();
        this.updataUI();
        this.isFirst = false;
        this.node.getComponent(cc.Layout).updateLayout();
        // const QSize: cc.Size = this.node.getComponent(UITransform).contentSize;
        // this.resetSize(QSize);

        const QSize: cc.Size = this.node.getContentSize();
        this.resetSize(QSize);
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
            this.updataUI(tips);
        }, this);
        UtilGame.Click(this.reduceI, () => {
            if (this.countNum <= 1) {
                MsgToastMgr.Show(i18n.tt(Lang.shop_pay_min));
                return;
            }
            this.countNum -= 1;
            this.updataUI();
        }, this);
        UtilGame.Click(this.reduceX, () => {
            if (this.countNum <= 10) {
                this.countNum = 1;
                // MsgToastMgr.Show(i18n.tt(Lang.shop_pay_min));
                this.updataUI(i18n.tt(Lang.shop_pay_min));
                return;
            } else {
                this.countNum -= 10;
            }
            this.updataUI();
        }, this);
        // 购买按钮
        UtilGame.Click(this.NdPayBtn, this.payBtn, this);

        UtilGame.Click(this.NdToInvest, () => {
            // 发送充值请求
            WinMgr.I.open(ViewConst.VipSuperWin, 0);
        }, this);
        this.EbCounNum.node.on('text-changed', this.eBCallback, this);
    }

    private payBtn() {
        // const haveNum: number = BagMgr.I.getItemNum(this.goodType);
        const haveNum: number = RoleMgr.I.getCurrencyById(this.goodType);// BagMgr.I.getItemNum(this.goodType);
        if (this.countNum * this.price > haveNum) {
            if (this.goodType === 2) {
                ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.exchange_tips), UtilColor.NorV), () => {
                    WinMgr.I.open(ViewConst.VipSuperWin, 0);
                });
                return;
            } else {
                MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(this.goodType).Name}${i18n.tt(Lang.not_enough)}`);
            }
            return;
        }
        this.callBack(this.countNum);
        this.close();
    }

    private updataUI(tips: string = ''): void {
        // 不能超过持有数量
        // const haveNum: number = BagMgr.I.getItemNum(this.goodType);
        const haveNum: number = RoleMgr.I.getCurrencyById(this.goodType);// BagMgr.I.getItemNum(this.goodType);
        const goodTypeNum: boolean = this.countNum * this.price > haveNum;
        let paytips: string = '';
        // 购买货币是否充足
        if (goodTypeNum) {
            if (!this.isFirst) {
                this.EbCounNum.blur();
                if (this.goodType === 2) {
                    ModelMgr.I.MsgBoxModel.ShowBox(i18n.tt(Lang.exchange_tips), () => {
                        WinMgr.I.open(ViewConst.VipSuperWin, 0);
                    });
                } else {
                    paytips = `${UtilItem.GetCfgByItemId(this.goodType).Name}${i18n.tt(Lang.not_enough)}`;
                }
            }
            this.countNum = Math.floor(haveNum / this.price);
        } else if (this.limitNum < parseInt(this.EbCounNum.string)) {
            // 是否超过限制数量
            if (!this.isFirst) {
                paytips = i18n.tt(Lang.shop_pay_limit);
            }
            this.EbCounNum.string = this.limitNum.toString();
        }

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
        // editbox.string = num;
        this.updataUI();
    }
}
