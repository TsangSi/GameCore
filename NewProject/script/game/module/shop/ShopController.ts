/*
 * @Author: myl
 * @Date: 2022-08-30 16:25:27
 * @Description:
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';

const { ccclass, property } = cc._decorator;

@ccclass('ShopController')
export class ShopController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        /** 神秘商城数据 */
        EventProto.I.on(ProtoId.S2CSecretMallInfo_ID, this.onS2CSecretMallInfo, this);
        /** 神秘商城购买 */
        EventProto.I.on(ProtoId.S2CSecretMallBuy_ID, this.onS2CSecretMallBuy, this);
        /** 普通商城数据 */
        EventProto.I.on(ProtoId.S2CShoppingMallInfo_ID, this.onS2CShoppingMallInfo, this);
        /** 普通商城购买返回 */
        EventProto.I.on(ProtoId.S2CShoppingMallBuy_ID, this.onS2CShoppingMallBuy_ID, this);
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        /** 神秘商城数据 */
        EventProto.I.off(ProtoId.S2CSecretMallInfo_ID, this.onS2CSecretMallInfo, this);
        /** 神秘商城购买 */
        EventProto.I.off(ProtoId.S2CSecretMallBuy_ID, this.onS2CSecretMallBuy, this);
        /** 普通商城数据 */
        EventProto.I.off(ProtoId.S2CShoppingMallInfo_ID, this.onS2CShoppingMallInfo, this);
        /** 普通商城购买返回 */
        EventProto.I.off(ProtoId.S2CShoppingMallBuy_ID, this.onS2CShoppingMallBuy_ID, this);
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], ...args: any[]): boolean {
        if (params && params[0]) {
            WinMgr.I.open(ViewConst.ShopWin, tab, params[0]);
        } else {
            WinMgr.I.open(ViewConst.ShopWin, tab);
        }
        return true;
    }

    public addClientEvent(): void {
        EventClient.I.on(E.Game.Start, this.shopConfigAndRed, this);
    }
    public delClientEvent(): void {
        EventClient.I.off(E.Game.Start, this.shopConfigAndRed, this);
    }

    private shopConfigAndRed() {
        const shopModel = ModelMgr.I.ShopModel;
        shopModel.buyRefreshNeed(); // 常量表
        this.shopBuyInfo();
    }

    /** 清理数据 */
    public clearAll(): void {
        //
    }
    /** 请求商城购买数据 */
    public shopBuyInfo(): void {
        const d = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SShoppingMallInfo_ID, d);
    }

    // 普通商城接收到数据
    private onS2CShoppingMallInfo(data: S2CShoppingMallInfo) {
        ModelMgr.I.ShopModel.setShopData(data);
        EventClient.I.emit(E.Shop.ShopUpdate);
    }

    // 普通商城购买
    public buyNormalShopGoods(gId: number, num: number): void {
        const d: C2SShoppingMallBuy = {
            Id: gId,
            Num: num,
        };
        console.log('--------------buyNormalShopGoods------------->', gId, num);
        NetMgr.I.sendMessage(ProtoId.C2SShoppingMallBuy_ID, d);
    }
    // 普通商城购买返回
    private onS2CShoppingMallBuy_ID(data: S2CShoppingMallBuy) {
        console.log(data);
        const d: ShoppingMall = {
            Id: data.Id,
            BuyTimes: data.BuyTimes,
        };
        ModelMgr.I.ShopModel.addShopData(d);
        EventClient.I.emit(E.Shop.ShopUpdate);
    }

    /** 神秘购买商品 */
    public buyShopGoods(goodsId: number): void {
        const d: C2SSecretMallBuy = {
            Id: goodsId,
        };
        NetMgr.I.sendMessage(ProtoId.C2SSecretMallBuy_ID, d);
    }

    /** 手动刷新商店 */
    public refreshSecretShop(): void {
        const d: C2SSecretMallRefresh = {
        };
        NetMgr.I.sendMessage(ProtoId.C2SSecretMallRefresh_ID, d);
    }

    /** 服务端推送刷新商城数据 */
    public onS2CSecretMallInfo(data: S2CSecretMallInfo): void {
        ModelMgr.I.ShopModel.secretShopRefresh(data);
        EventClient.I.emit(E.Shop.SecretShopUpdate);
    }

    /** 神秘商城购买之后 刷新界面 */
    private onS2CSecretMallBuy(data: S2CSecretMallBuy): void {
        ModelMgr.I.ShopModel.secretShopRefreshItem(data);
        EventClient.I.emit(E.Shop.SecretShopUpdate);
    }
}
