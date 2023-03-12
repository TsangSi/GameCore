/*
 * @Author: myl
 * @Date: 2022-08-30 16:25:42
 * @Description:
 */
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigCycleTimesIndexer } from '../../base/config/indexer/ConfigCycleTimesIndexer';
import { ConfigLimitConditionIndexer } from '../../base/config/indexer/ConfigLimitConditionIndexer';
import { ConfigShopIndexer } from '../../base/config/indexer/ConfigShopIndexer';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import {
    FreeShopItemId, SecretMallRefreshCost, SecretShopMaxRefreshTimes,
} from './ShopConst';
import { ShopCommonItem, ShopSecretItem, UtilShop } from './UtilShop';

const { ccclass, property } = cc._decorator;

@ccclass('ShopModel')
export class ShopModel extends BaseModel {
    public _shopData: ShopCommonItem[] = [];
    public _secretData: ShopSecretItem[] = [];
    /** 神秘商城手动刷新次数 */
    public _secretRefreshTimes = 0;
    /** 神秘商店下次刷新时间 */
    public _secretNextRefreshTime = 0;

    public clearAll(): void {
        this._shopData = [];
        this.buyNeedInfoMap.clear();
        this.shopsPageConfig.clear();
        this._originalShopData.clear();
    }

    /** 根据商城类型获取商城的配置表数据 */
    public getShopData(type: number): Cfg_ShopCity[] {
        const indexer: ConfigShopIndexer = Config.Get(Config.Type.Cfg_ShopCity);
        return indexer.getShopItemsByShopType(type);
    }

    /** item UI界面赋值使用 */
    public getShopUIData(type: number): ShopCommonItem[] {
        const items: ShopCommonItem[] = [];
        const shopItems = this.getShopData(type);
        if (shopItems === null || shopItems === undefined) {
            return [];
        }
        // 根据配置表判断是否显示
        const indexer: ConfigLimitConditionIndexer = Config.Get(Config.Type.Cfg_LimitCondition);
        for (let i = 0; i < shopItems.length; i++) {
            const cfg = shopItems[i];
            const data = this._originalShopData.get(cfg.GoodsID);
            if (cfg.ShowLimConID > 0) {
                const result = indexer.getCondition(cfg.ShowLimConID);
                if (result.state) {
                    items.push({ cfg, data, state: this.goodsMaxNum(cfg, (data && data.BuyTimes) ?? 0) });
                } else {
                    // 未达到显示条件 则不能添加进去
                    console.log(result);
                }
            } else {
                items.push({ cfg, data, state: this.goodsMaxNum(cfg, (data && data.BuyTimes) ?? 0) });
            }
            // 排序规则为按照是否购买完处理
            // 未购买完和未限制的购买置为1 售完的置为0
        }
        return items;
    }

    /** 某个商品是否已经购买完
     * 返回值为 1 ： 未购买完和无限制
     * 0：购买完
     */
    private goodsMaxNum(cfg: Cfg_ShopCity, haveBuyNum: number): number {
        if (cfg.LimTimeID > 0) {
            // 获取限制次数
            const CycleTimes: ConfigCycleTimesIndexer = Config.Get(Config.Type.Cfg_CycleTimes);
            const info = CycleTimes.getTimes(cfg.LimTimeID);
            const num = info.num;
            if (num > haveBuyNum) {
                return 1;
            }
            return 0;
        } else {
            // 无购买限制
            return 1;
        }
    }

    /** 原始服务端数据 */
    private _originalShopData: Map<number, ShoppingMall> = new Map();
    /** 服务端原始数据 */
    public setShopData(data: S2CShoppingMallInfo): void {
        this._originalShopData.clear();
        // console.log('收到普通商城所有数据刷新回调', data);

        data.ShoppingMallList.forEach((item) => {
            this._originalShopData.set(item.Id, item);
        });
    }

    /** 添加一条商城数据 */
    public addShopData(data: ShoppingMall): void {
        this._originalShopData.set(data.Id, data);
    }

    /** 神秘商城数据刷新 */
    public secretShopRefresh(data: S2CSecretMallInfo): void {
        this._secretData = []; // 清空历史数据
        this._secretRefreshTimes = data.RefreshTimes ?? 0;
        this._secretNextRefreshTime = data.NextRefreshUnix ?? 0;
        for (let i = 0; i < data.SecretMallList.length; i++) {
            const item = data.SecretMallList[i];
            const shopItem = UtilShop.NewSecretShopItem(item);
            this._secretData.push(shopItem);
        }
    }

    /** 神秘商城更新一条数据 */
    public secretShopRefreshItem(data: S2CSecretMallBuy): void {
        for (let i = 0; i < this._secretData.length; i++) {
            const item = this._secretData[i];
            if (item.data.Id === data.Id) {
                item.data.State = data.State;
            }
        }
    }

    /** 记录配置表数据 */
    private buyNeedInfoMap: Map<number, { type: number, num: number }> = new Map();

    /** **********   商城配置表常量获取 */
    /** 刷新需要的数据 */
    public buyRefreshNeed(): void {
        const config: Cfg_SecretMallCfg = Config.Get(Config.Type.Cfg_SecretMallCfg).getValueByKey(SecretMallRefreshCost);
        const val = config.CfgValue;
        const vals = val.split('|');
        for (let i = 0; i < vals.length; i++) {
            const v = vals[i];
            const vs = v.split(':');
            const t = parseInt(vs[0]);
            const tp = parseInt(vs[1]);
            const ct = parseInt(vs[2]);
            const tcp = { type: tp, num: ct };
            this.buyNeedInfoMap.set(t, tcp);
        }
    }

    /**
     * 获取到每次手动刷新消耗 (如果为空 则表示不能刷新)
     */
    public buyNeedConfig(): { type: number, num: number } {
        let times = this._secretRefreshTimes;
        if (times >= SecretShopMaxRefreshTimes) {
            times = SecretShopMaxRefreshTimes - 1;
        }
        return this.buyNeedInfoMap.get(times + 1);
    }

    /** ******** 红点 只有折扣商城中的 11001红点  其他均无红点 */
    public registerRedDotListen(): void {
        const info: IListenInfo = {
            ProtoId: [ProtoId.S2CShoppingMallInfo_ID, ProtoId.S2CShoppingMallBuy_ID],
            ProxyRid: [RID.Shop.Id],
            CheckVid: [ViewConst.ShopWin],
        };
        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: RID.Shop.Id, info },
        );
    }

    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Shop.Id, this.funcRed, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Shop.Id, this.funcRed, this);
    }

    /** 11001 为免费商品 */
    private funcRed(id: number): boolean {
        const discountshopOpen = UtilFunOpen.isOpen(FuncId.DiscountShop);
        if (!discountshopOpen) {
            return RedDotMgr.I.updateRedDot(RID.Shop.Discount.Base, false);
        }
        const shopItem = this._originalShopData.get(FreeShopItemId);
        if (shopItem && shopItem.BuyTimes > 0) {
            return RedDotMgr.I.updateRedDot(RID.Shop.Discount.Base, false);
        }
        return RedDotMgr.I.updateRedDot(RID.Shop.Discount.Base, true);
    }

    public freeShopItemState(id: number): boolean {
        if (id === FreeShopItemId) {
            const shopItem = this._originalShopData.get(id);
            if (!shopItem || shopItem && shopItem.BuyTimes === 0) {
                return true;
            }
        }
        return false;
    }

    private shopsPageConfig: Map<number, Array<Cfg_ShopCityType>> = new Map();
    /** * 商城的配置 */
    public shopsType(): Map<number, Array<Cfg_ShopCityType>> {
        this.shopsPageConfig.clear();
        const config = Config.Get(Config.Type.Cfg_ShopCityType);
        const len = config.keysLength;
        for (let i = 0; i < len; i++) {
            const conf: Cfg_ShopCityType = config.getValueByIndex(i);
            // 判断商城是否开启
            if (UtilFunOpen.isOpen(conf.FuncId) && conf.Show === 1) {
                const sps = this.shopsPageConfig.get(conf.ShopId) ?? [];
                sps.push(conf);
                this.shopsPageConfig.set(conf.ShopId, sps);
            } else {
                console.log('功能未开启', conf.MallTypeName);
            }
        }
        return this.shopsPageConfig;
    }

    /** 获取商城下的子商店 */
    public getShopPageConfig(id: number): Array<Cfg_ShopCityType> {
        return this.shopsPageConfig.get(id);
    }

    public getShopInfoConfig(id: number): Cfg_ShopCityType {
        const config: Cfg_ShopCityType = Config.Get(Config.Type.Cfg_ShopCityType).getValueByKey(id);
        return config;
    }
}
