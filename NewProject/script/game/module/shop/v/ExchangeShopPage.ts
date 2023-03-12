/*
 * @Author: myl
 * @Date: 2022-08-30 16:33:33
 * @Description:
 */
import { TabData } from '../../../com/tab/TabData';
import { WinTabPageView } from '../../../com/win/WinTabPageView';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ModelMgr from '../../../manager/ModelMgr';
import { ShopPageType } from '../ShopConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class ExchangeShopPage extends WinTabPageView {
    public tabPages(): TabData[] {
        return this.pageConfig();
    }

    /** 商城类型中 判断当前商城中的子商店 */
    private pageConfig(): TabData[] {
        const items: TabData[] = [];
        const shops = ModelMgr.I.ShopModel.getShopPageConfig(ShopPageType.Exchange);
        shops.sort((a, b) => a.Sort - b.Sort);
        for (let i = 0; i < shops.length; i++) {
            const item = shops[i];
            const itemConfig = {
                id: item.MallTypeID,
                title: item.MallTypeName,
                uiPath: UI_PATH_ENUM.ShopView,
                // redId: ShopRedConfig[item.MallTypeID],
            };
            items.push(itemConfig);
        }
        return items;
    }

    public init(winId: number, param: unknown, tabIdx: number = 0): void {
        super.init(winId, param, tabIdx);
        const tabs = this.tabPages();
        this._selectId = tabs[0].id;// 根据传值来确定打开索引界面
        this.tabContainer.setData(tabs, this._selectId);
    }
}
