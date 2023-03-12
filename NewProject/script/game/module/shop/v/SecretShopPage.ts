/*
 * @Author: myl
 * @Date: 2022-08-30 16:32:22
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import TimerMgr from '../../../manager/TimerMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { SecretShopMaxRefreshTimes } from '../ShopConst';
import { SecretShopItem } from './SecretShopItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class SecretShopPage extends WinTabPage {
    @property([cc.Node])
    private posNodes: cc.Node[] = [];
    @property(cc.Label)
    private timeLab: cc.Label = null;

    @property(cc.Label)
    private timesLab: cc.Label = null;

    /** 货币数量 */
    @property(cc.Label)
    private currencyNumLab: cc.Label = null;
    /**
     * 货币图标
     */
    @property(DynamicImage)
    private currencyType: DynamicImage = null;
    /** 购买次数按钮 */
    @property(cc.Node)
    private buyTimesBtn: cc.Node = null;

    private _needTip = false;
    protected start(): void {
        super.start();
        EventClient.I.on(E.Shop.SecretShopUpdate, this.updateItems, this);
        UtilGame.Click(this.buyTimesBtn, () => {
            if (ModelMgr.I.ShopModel._secretRefreshTimes >= SecretShopMaxRefreshTimes) {
                MsgToastMgr.Show(i18n.tt(Lang.shop_refresh_max));
                return;
            }
            const currency = ModelMgr.I.ShopModel.buyNeedConfig();
            if (currency.type === 2) { // 玉璧
                const cost = UtilItem.GetCfgByItemId(currency.type).Name;
                const tipString = UtilString.FormatArray(
                    i18n.tt(Lang.shop_buy_refresh_tip),
                    [UtilColor.NorV, UtilColor.RedV, `${currency.num}${cost}`],
                );
                ModelMgr.I.MsgBoxModel.ShowBox(tipString, () => {
                    if (RoleMgr.I.getCurrencyById(2) >= currency.num) {
                        ControllerMgr.I.ShopController.refreshSecretShop();
                        this._needTip = true;
                    } else {
                        ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.exchange_tips), UtilColor.NorV), () => {
                            WinMgr.I.open(ViewConst.VipSuperWin, 0);
                        });
                    }
                });
            } else { // 其他情况
                // eslint-disable-next-line no-lonely-if
                if (RoleMgr.I.getCurrencyById(3) >= currency.num) {
                    ControllerMgr.I.ShopController.refreshSecretShop();
                    this._needTip = true;
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.com_msg_currency_not_enough));
                }
            }
        }, this);
    }

    public init(winId: number, param: unknown, tabIdx: number = 0): void {
        super.init(winId, param, tabIdx);
        this.updateItems();
    }

    private _timer = null;
    /** 收到商城刷新协议 */
    private updateItems(): void {
        const model = ModelMgr.I.ShopModel;
        const _datas = model._secretData;
        if (this._needTip) {
            // 手动刷新提示刷新成功
            MsgToastMgr.Show(i18n.tt(Lang.shop_refresh_success));
            this._needTip = false;
        }
        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Shop_SecretShopItem, null, (err, nd: cc.Node) => {
            if (nd) {
                for (let i = 0; i < this.posNodes.length; i++) {
                    const data = _datas[i];
                    const cNd = this.posNodes[i];
                    cNd.destroyAllChildren();
                    cNd.removeAllChildren();
                    const copyNd = cc.instantiate(nd);
                    cNd.addChild(copyNd);
                    const item = copyNd.getComponent(SecretShopItem);
                    item.setData(data);
                }
            }
            nd.destroy();
        });

        const currency = ModelMgr.I.ShopModel.buyNeedConfig();
        if (model._secretRefreshTimes >= 5) {
            this.currencyNumLab.node.active = false;
            this.currencyType.node.active = false;
        } else {
            this.currencyNumLab.node.active = true;
            this.currencyType.node.active = true;
            this.currencyNumLab.string = currency.num.toString();
            this.currencyType.loadImage(UtilCurrency.getIconByCurrencyType(currency.type), 1, true);
        }

        // 时间差
        let timeDis = model._secretNextRefreshTime - UtilTime.NowSec() - 1;
        this.timeLab.string = UtilTime.FormatHourDetail(timeDis);
        if (!this._timer) {
            this._timer = this.setInterval(() => {
                timeDis--;
                this.timeLab.string = UtilTime.FormatHourDetail(timeDis);
                if (timeDis <= 1) {
                    this.clearInterval(this._timer);
                    this._timer = null;
                }
            }, 1000);
        }

        this.timesLab.node.active = true;
        this.timesLab.string = `(${5 - model._secretRefreshTimes}/5)`;
        this.timesLab.node.color = UtilColor.Hex2Rgba(model._secretRefreshTimes >= 5 ? UtilColor.RedV : UtilColor.GreenV);
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }
        EventClient.I.off(E.Shop.SecretShopUpdate, this.updateItems, this);
    }
}
