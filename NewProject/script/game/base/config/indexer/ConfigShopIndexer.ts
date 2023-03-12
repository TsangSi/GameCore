/*
 * @Author: myl
 * @Date: 2022-08-31 12:15:55
 * @Description:
 */
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigShopIndexer')
export class ConfigShopIndexer extends ConfigIndexer {
    private static _i: ConfigShopIndexer = null;
    public static get I(): ConfigShopIndexer {
        if (!this._i) {
            this._i = new ConfigShopIndexer(ConfigConst.Cfg_ShopCity);
            this._i._walks();
        }
        return this._i;
    }
    protected walks(tableName: string, data: Cfg_ShopCity, index: number): void {
        const items = this._table[data.MallType] || [];
        items.push(data);
        this._table[data.MallType] = items;
    }

    private _table: { [key: number]: Cfg_ShopCity[] } = {};

    /** 根据商店类型获取出售的物品 */
    public getShopItemsByShopType(type: number): Cfg_ShopCity[] {
        this._walks();
        return this._table[type];
    }

    /** 获取配置表数据 已经按照商城类型分类过 */
    public getShopItemsConfig(): { [key: number]: Cfg_ShopCity[] } {
        this._walks();
        return this._table;
    }
}
