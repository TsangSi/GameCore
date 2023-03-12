import { UtilString } from '../../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import { Config } from '../../../../../base/config/Config';
import { ConfigShopIndexer } from '../../../../../base/config/indexer/ConfigShopIndexer';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilItem from '../../../../../base/utils/UtilItem';
import { ItemIcon } from '../../../../../com/item/ItemIcon';
import ItemModel from '../../../../../com/item/ItemModel';
import WinBase from '../../../../../com/win/WinBase';
import { ViewConst } from '../../../../../const/ViewConst';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { BagMgr } from '../../../../bag/BagMgr';
import { ShopChildType } from '../../../../shop/ShopConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralAutoBuyTip extends WinBase {
    //
    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    @property(cc.Node)
    private BtnSure: cc.Node = null;
    @property(cc.Node)
    private BtnCancel: cc.Node = null;

    @property(ItemIcon)
    private needItem: ItemIcon = null;

    @property(cc.Label)
    private ItemCostName: cc.Label = null;
    @property(cc.Label)
    private LabCostNum: cc.Label = null;

    @property(cc.Label)
    private LabLeftNum: cc.Label = null;
    @property(cc.Label)
    private LabItemName: cc.Label = null;

    @property(DynamicImage)
    private imgCostItem: DynamicImage = null;

    @property(cc.Toggle)
    private CkShowNextTime: cc.Toggle = null;
    /** 描述 */
    @property(cc.Label)
    private LabDesc: cc.Label = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.BtnCancel, () => {
            this.close();
        }, this);
        UtilGame.Click(this.BtnSure, this._onSureClick, this);
    }

    private _onSureClick() {
        ModelMgr.I.GeneralRecruitModel.isOpenTip = !this.CkShowNextTime.isChecked;
        const currencyNum = BagMgr.I.getItemNum(this._cfgItem.Id);

        if (this._costCoinNum > currencyNum) {
            WinMgr.I.open(ViewConst.ItemSourceWin, this._curItem.GoldType);
        } else {
            const autoBuy = 1;
            if (ModelMgr.I.GeneralRecruitModel.checkMax(this._actId)) {
                const str: string = UtilString.unionColor(`${i18n.tt(Lang.general_storefull)}`);
                ModelMgr.I.MsgBoxModel.ShowBox(str, () => {
                    ControllerMgr.I.GeneralRecruitController.reqZhaoMuLuckyDraw(this._actId, autoBuy, this._num);
                }, null);
            } else {
                ControllerMgr.I.GeneralRecruitController.reqZhaoMuLuckyDraw(this._actId, autoBuy, this._num);
            }
        }
        this.close();
    }

    private _actId: number = 0;
    private _num = 0;
    private _costCoinNum: number = 0;// 需要消耗多少
    private _cfgItem: Cfg_Item;// 元宝
    private _curItem: Cfg_ShopCity;
    private _isOpenTip: boolean = false;
    public init(params: [{ actId: number, leftNum: number, num: number, descStr: string }]): void {
        this.CkShowNextTime.isChecked = !ModelMgr.I.GeneralRecruitModel.isOpenTip;
        this._isOpenTip = ModelMgr.I.GeneralRecruitModel.isOpenTip;// 存下最开始的

        this._actId = params[0].actId;
        this._num = params[0].num;// 购买数量  1  10  50
        const descStr: string = params[0].descStr;

        // 还差多少个
        this.LabLeftNum.string = `${params[0].leftNum}${i18n.tt(Lang.com_ge)}`;// 还差多少个

        const [itemId, itemNum] = ModelMgr.I.GeneralRecruitModel.getCfgCost(this._actId, this._num);

        const indexer: ConfigShopIndexer = Config.Get(Config.Type.Cfg_ShopCity);
        const shopitems = indexer.getShopItemsByShopType(ShopChildType.Quick);
        let curItem: Cfg_ShopCity = null;
        for (let i = 0; i < shopitems.length; i++) {
            const item = shopitems[i];
            if (item.ItemID === itemId) {
                curItem = item;
                break;
            }
        }
        this._curItem = curItem;

        // 金币
        const price = curItem.GoodsPrice;// 1个杜康酒 需要 1000 金币
        const costNum = price * params[0].leftNum;
        this.LabCostNum.string = `${costNum}`;// 消耗金币9000
        this._costCoinNum = costNum;
        const cfgItem: Cfg_Item = UtilItem.GetCfgByItemId(curItem.GoldType);
        this._cfgItem = cfgItem;
        this.ItemCostName.string = cfgItem.Name;// 金币 元宝
        console.log(this._costCoinNum, this._cfgItem);

        this.imgCostItem.loadImage(UtilItem.GetItemIconPath(cfgItem.PicID), 1, true);// 元宝图标

        // 杜康
        const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);
        this.LabItemName.string = `${itemModel.cfg.Name}`;
        this.needItem.setData(itemModel);

        // // 描述 测试说注释
        // if (descStr) {
        //     this.LabDesc.string = descStr;
        //     this.LabDesc.node.active = true;
        // } else {
        //     this.LabDesc.node.active = false;
        // }
    }
}
