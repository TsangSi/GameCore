/*
 * @Author: myl
 * @Date: 2022-08-30 16:25:55
 * @Description:
 */

import { RID } from '../reddot/RedDotConst';

/** 商城常量手动刷新次数 键 */
export const SecretMallRefreshCost = 'SecretMallRefreshCost';

export enum ShopPageType {
    /** 折扣商城 */
    Discount = 1,
    /** 积分商城 */
    Unit = 2,
    /** 兑换商城 */
    Exchange = 3,
    /** 神秘商城 */
    Secret = 4,
    /** 活动商城(可以消失掉整个页签) */
    Active = 5
}

/** 子商店枚举 */
export enum ShopChildType {
    Daily = 1, /** 日常道具 */
    Vip = 2, /** 皇城宝库 */
    Partner = 3, /** 伙伴商城 */
    XianZong = 5, /** 仙踪商店 */
    Fight = 6, /** 竞技商店 */
    Quick = 9, /** 快捷商店 */
    Discount = 11, /** 限购特惠 */
    Family = 12, /** 世家 */
    Huarongdao = 13, /** 华容道商店 */
    Wujiang = 16, /** 武将商店 */
}

/** 神秘商城最大刷新次数 */
export const SecretShopMaxRefreshTimes = 5;

/** 免费商品的id  配置表修改需要修改此处 */
export const FreeShopItemId = 11001;
/** 免费商城所属商城的id */
export const FreeShopId = 11;
