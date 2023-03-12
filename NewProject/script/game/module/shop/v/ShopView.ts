/*
 * @Author: myl
 * @Date: 2022-08-30 16:36:14
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import { TabPagesView } from '../../../com/win/WinTabPageView';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { ShopChildType } from '../ShopConst';
import { ShopCommonItem } from '../UtilShop';
import { ShopItem } from './ShopItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class ShopView extends TabPagesView {
    @property(ListView)
    private listView: ListView = null;

    // 界面商城类型
    private _shopType: ShopChildType = ShopChildType.Discount;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Label)
    private currencyLab: cc.Label = null;
    @property(cc.Label)
    private currencyNameLab: cc.Label = null;

    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.Shop.ShopUpdate, this.refreshUI, this);
        RoleMgr.I.on(
            this.currencyChange,
            this,
            RoleAN.N.ItemType_Coin2,
            RoleAN.N.ItemType_Coin3,
            RoleAN.N.ItemType_Coin4,
            RoleAN.N.ArenaMedal,
            RoleAN.N.WJZhaoMuScore,
            RoleAN.N.SkillCoin,
            RoleAN.N.FamilyCoin,
            RoleAN.N.HuarongTicket,
        );
    }
    protected start(): void {
        super.start();
        UtilGame.Click(this.SprIcon.node, () => {
            const info = ModelMgr.I.ShopModel.getShopInfoConfig(this._shopType);
            WinMgr.I.open(ViewConst.ItemSourceWin, parseInt(info.GoldType));
        }, this);
    }

    private currencyChange(coinInfo: { string: number }) {
        const info = ModelMgr.I.ShopModel.getShopInfoConfig(this._shopType);
        const cType = coinInfo[RoleMgr.I.cTypeToAtt(parseInt(info.GoldType))];

        if (cType !== null && cType !== undefined) {
            this.currencyLab.string = UtilNum.Convert(cType);
        }
    }

    public init(...param: unknown[]): void {
        this.updateUI(Number(param[0]));
    }

    protected updateUI(idx: number): void {
        this._shopType = idx;
        // this.refreshUI();
        // 请求商城购买数据
        ControllerMgr.I.ShopController.shopBuyInfo();

        // 获取商城配置
        const info = ModelMgr.I.ShopModel.getShopInfoConfig(this._shopType);
        this.currencyLab.string = UtilNum.Convert(RoleMgr.I.getCurrencyById(parseInt(info.GoldType)));
        this.currencyNameLab.string = `${UtilCurrency.getNameByType(parseInt(info.GoldType))}`;
        this.SprIcon.loadImage(UtilCurrency.getIconByCurrencyType(parseInt(info.GoldType)), 1, true);
    }

    private _shopItems: ShopCommonItem[] = [];
    /** 界面刷新 */
    private refreshUI() {
        this._shopItems = ModelMgr.I.ShopModel.getShopUIData(this._shopType);
        // 排序处理
        this._shopItems.sort((a, b) => a.cfg.Sort - b.cfg.Sort);
        this._shopItems.sort((m, n) => n.state - m.state);
        this.listView.setNumItems(this._shopItems.length);
    }

    // 滚动事件
    private scrollEvent(nd: cc.Node, index: number) {
        nd.getComponent(ShopItem).setData(this._shopItems[index], index);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Shop.ShopUpdate, this.refreshUI, this);
        RoleMgr.I.off(
            this.currencyChange,
            this,
            RoleAN.N.ItemType_Coin2,
            RoleAN.N.ItemType_Coin3,
            RoleAN.N.ItemType_Coin4,
            RoleAN.N.ArenaMedal,
            RoleAN.N.WJZhaoMuScore,
            RoleAN.N.SkillCoin,
            RoleAN.N.FamilyCoin,
            RoleAN.N.HuarongTicket,
        );
    }
}
