/*
 * @Author: myl
 * @Date: 2022-08-30 16:33:33
 * @Description:
 */
import { TabData } from '../../../com/tab/TabData';
import { WinTabPageView } from '../../../com/win/WinTabPageView';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ModelMgr from '../../../manager/ModelMgr';
import { RID } from '../../reddot/RedDotConst';
import { FreeShopId, ShopPageType } from '../ShopConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class DiscountShopPage extends WinTabPageView {
    public tabPages(): TabData[] {
        return this.pageConfig();
    }

    /** 商城类型中 判断当前商城中的子商店 */
    private pageConfig(): TabData[] {
        const items: TabData[] = [];
        const shops = ModelMgr.I.ShopModel.getShopPageConfig(ShopPageType.Discount);
        shops.sort((a, b) => a.Sort - b.Sort);
        for (let i = 0; i < shops.length; i++) {
            const item = shops[i];
            /** 此处需要特殊备注 只有特惠商城需要红点其他商城无需红点 */
            const itemConfig = item.MallTypeID === FreeShopId ? {
                id: item.MallTypeID,
                title: item.MallTypeName,
                uiPath: UI_PATH_ENUM.ShopView,
                redId: RID.Shop.Discount.Id,
            } : {
                id: item.MallTypeID,
                title: item.MallTypeName,
                uiPath: UI_PATH_ENUM.ShopView,
            };
            items.push(itemConfig);
        }
        return items;
    }
}
