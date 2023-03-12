/*
 * @Author: myl
 * @Date: 2022-08-30 16:28:23
 * @Description:
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ModelMgr from '../../../manager/ModelMgr';
import { RedDotCheckMgr } from '../../reddot/RedDotCheckMgr';
import { RID } from '../../reddot/RedDotConst';
import RedDotModelMgr from '../../reddot/RedDotModelMgr';
import { ShopPageType } from '../ShopConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class ShopWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        return this.getShopConfig();
    }

    /** 获取商城页签配置数据 */
    private getShopConfig() {
        const tabs: IWinTabData[] = [];
        const configs = ModelMgr.I.ShopModel.shopsType();

        for (const [id, items] of configs) {
            switch (id) {
                case ShopPageType.Discount:
                    if (items.length > 0) {
                        tabs.push({
                            TabId: 1,
                            className: 'DiscountShopPage',
                            prefabPath: UI_PATH_ENUM.DiscountShopPage,
                            // TabBtnId: TabBtnId.DiscountShopPage,
                            funcId: FuncId.DiscountShop,
                            redId: RID.Shop.Discount.Id,
                        });
                    }
                    break;
                case ShopPageType.Unit:
                    if (items.length > 0) {
                        tabs.push({
                            TabId: 2,
                            className: 'UnitShopPage',
                            TabBtnId: TabBtnId.UnitShopPage,
                            prefabPath: UI_PATH_ENUM.UnitShopPage,
                        });
                    }
                    break;
                case ShopPageType.Exchange:
                    if (items.length > 0) {
                        tabs.push({
                            TabId: 3,
                            className: 'ExchangeShopPage',
                            TabBtnId: TabBtnId.DiscountShopPage,
                            prefabPath: UI_PATH_ENUM.ExchangeShopPage,

                        });
                    }
                    break;
                case ShopPageType.Secret:
                    break;
                case ShopPageType.Active:
                    if (items.length > 0) {
                        tabs.push({
                            TabId: 5,
                            className: 'ActiveShopPage',
                            prefabPath: UI_PATH_ENUM.ActiveShopPage,

                        });
                    }
                    break;
                default:

                    break;
            }
        }
        /** 神秘商城 */
        if (UtilFunOpen.isOpen(FuncId.SecretShop)) {
            tabs.push({
                TabId: 4,
                className: 'SecretShopPage',
                prefabPath: UI_PATH_ENUM.SecretShopPage,
                // TabBtnId: TabBtnId.SecretShopPage,
                funcId: FuncId.SecretShop,
                // redId: RID.Vip.Vip.Id,
            });
        }
        return tabs;
    }

    public initWin(...param: unknown[]): void {
        RedDotModelMgr.I.registerRedDot(FuncId.DiscountShop);
    }

    protected onDestroy(): void {
        super.onDestroy();
        RedDotModelMgr.I.unRegisterRedDot(FuncId.DiscountShop);
    }
}
