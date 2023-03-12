/*
 * @Author: myl
 * @Date: 2022-08-31 14:05:25
 * @Description:
 */
import WinMgr from '../../../app/core/mvc/WinMgr';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigShopIndexer } from '../../base/config/indexer/ConfigShopIndexer';
import { ViewConst } from '../../const/ViewConst';
import { BagMgr } from '../bag/BagMgr';
import { RoleMgr } from '../role/RoleMgr';
import { ShopChildType } from './ShopConst';

/** 商城物品 包含配置和购买次数信息 */
export type ShopCommonItem = { cfg: Cfg_ShopCity, data: ShoppingMall, state: number };
/** 神秘商城商品 */
export type ShopSecretItem = { cfg: Cfg_SecretMall, data: SecretMall }
/** 商城工具类 */
export class UtilShop {
    /** 根据id或服务端返回数据 组装一个神秘商城的item */
    public static NewSecretShopItem(id: number): ShopSecretItem;
    public static NewSecretShopItem(mall: SecretMall): ShopSecretItem;
    public static NewSecretShopItem(...args: unknown[]): ShopSecretItem {
        if (typeof args[0] === 'number') {
            const cfg = this.getSecretShopItemById(args[0]);
            const data: SecretMall = { Id: args[0], State: 0 };
            return { cfg, data };
        } else {
            const data = args[0] as SecretMall;
            const cfg = this.getSecretShopItemById(data.Id);
            return { cfg, data };
        }
    }

    /** 神秘商城 根据服务端返回的id 获取商品信息 */
    public static getSecretShopItemById(id: number): Cfg_SecretMall {
        const item: Cfg_SecretMall = Config.Get(Config.Type.Cfg_SecretMall).getValueByKey(id);
        return item;
    }

    /**
     * 消耗道具统一接口
     * @param itemId 道具id
     * @param needNum 需要数量
     * @param autoBuy 是否自动购买，默认false
     * @param showEnough 是否弹窗显示，默认true
     * @returns
     */
    public static itemIsEnough(itemId: number, needNum: number, autoBuy: boolean, showEnough: boolean = true): boolean {
        // 从商城获取道具的价值，计算货币是否足够
        const indexer: ConfigShopIndexer = Config.Get(Config.Type.Cfg_ShopCity);
        const shopitems = indexer.getShopItemsByShopType(ShopChildType.Quick);
        /** 是否在商城里 */
        let isIn = false;
        let currencyId: number = 1;
        let price: number = 1;
        shopitems.forEach((v) => {
            if (v.ItemID === itemId) {
                isIn = true;
                currencyId = v.GoldType;
                price = v.SalePrice;
            }
        });
        // if (!isIn) {
        //     // 如果不在商城中则显示获取途径
        //     WinMgr.I.open(ViewConst.ItemSourceWin, currencyId);
        //     return;
        // }
        const haveNum = BagMgr.I.getItemNum(itemId);
        if (haveNum >= needNum) return true; // 无需购买直接充足

        const buyNeedNum: number = (needNum - haveNum) * price;
        /** 是否有足够钱购买道具 */
        const isEnoughBuy = RoleMgr.I.checkCurrency(currencyId, buyNeedNum);
        /** 是否显示快捷购买框 */
        const isShowQuickPay = showEnough && isIn;

        if (autoBuy && isEnoughBuy) { // 是自动购买，有钱
            return true;
        } else if (autoBuy && isIn) { // 是自动购买，可以在在商城里购买，但是不够钱，显示钱的来源
            WinMgr.I.open(ViewConst.ItemSourceWin, currencyId);
            return false;
        } else if (!autoBuy && isShowQuickPay) { // 不是自动购买，但是在商城
            WinMgr.I.open(ViewConst.WinComQuickPay, itemId);
            return false;
        } else if (showEnough) { // 没有在商城
            WinMgr.I.open(ViewConst.ItemSourceWin, itemId);
            return false;
        }
        return true;
    }

    public static GoodsIsInShop(itemId: number): boolean {
        const indexer: ConfigShopIndexer = Config.Get(ConfigConst.Cfg_ShopCity);
        const shopItems = indexer.getShopItemsByShopType(ShopChildType.Quick);// 快捷商店

        for (let i = 0; i < shopItems.length; i++) {
            const e = shopItems[i];
            if (e.ItemID === itemId) {
                return true;
            }
        }
        return false;
    }
}
