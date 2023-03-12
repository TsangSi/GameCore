/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: lijun
 * @Date: 2023-02-21 21:18:40
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemCurrencyId } from '../../../com/item/ItemConst';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { HuarongdaoBuyType } from '../HuarongdaoConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoGiftBuy extends WinCmp {
    @property(cc.Node)
    private BtnBuy1: cc.Node = null;
    @property(cc.Node)
    private BtnBuy2: cc.Node = null;

    @property(cc.Node)
    private ItemIcon1: cc.Node = null;
    @property(cc.Node)
    private ItemIcon2: cc.Node = null;

    @property(DynamicImage)
    private SprCoin1: DynamicImage = null;
    @property(DynamicImage)
    private SprCoin2: DynamicImage = null;

    @property(cc.Label)
    private LblNum1: cc.Label = null;
    @property(cc.Label)
    private LblNum2: cc.Label = null;

    @property(cc.Label)
    private LblTimes1: cc.Label = null;
    @property(cc.Label)
    private LblTimes2: cc.Label = null;

    private cost1;
    private cost2;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnBuy1, () => {
            this.handlerBuy(this.cost1[0][0], this.cost1[0][1], this.cost1[0][2]);
        }, this);

        UtilGame.Click(this.BtnBuy2, () => {
            this.handlerBuy(this.cost2[0][0], this.cost2[0][1], this.cost2[0][2]);
        }, this);
    }

    public init(...param: unknown[]): void {
        this.addE();
        this.showItemIcon();
        this.showCost();
        this.showBuyTimes();
    }

    /** 显示礼券图标 */
    private showItemIcon(): void {
        const cost = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongStakeCost');
        const constId = Number(cost.CfgValue);
        const haveNum = RoleMgr.I.getCurrencyById(constId);
        const itemData = new ItemData({ ItemId: constId, ItemNum: haveNum });
        UtilItem.NewItem(this.ItemIcon1, itemData, { option: { needNum: false } });
        UtilItem.NewItem(this.ItemIcon2, itemData, { option: { needNum: false } });
    }

    /** 刷新礼券数量 */
    private updateItemIcon(): void {
        const cost = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongStakeCost');
        const constId = Number(cost.CfgValue);
        const haveNum = RoleMgr.I.getCurrencyById(constId);
        const itemModel = UtilItem.NewItemModel(constId, haveNum);
        const ItemIcon1 = this.ItemIcon1.children[0];
        const ItemIcon2 = this.ItemIcon2.children[0];
        if (cc.isValid(ItemIcon1)) {
            ItemIcon1.getComponent(ItemIcon).setData(itemModel);
        }

        if (cc.isValid(ItemIcon2)) {
            ItemIcon2.getComponent(ItemIcon).setData(itemModel);
        }
    }

    /** 显示价格 */
    private showCost() {
        const cfg1 = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongdaoBuyTicketCost1');
        const cfg2 = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongdaoBuyTicketCost2');
        this.cost1 = UtilString.SplitToArray(cfg1.CfgValue);
        this.cost2 = UtilString.SplitToArray(cfg2.CfgValue);
        const icon_1 = this.cost1[0][0];
        const icon_2 = this.cost2[0][0];
        this.SprCoin1.loadImage(`${RES_ENUM.Item}${icon_1}_h`, 1, true);
        this.SprCoin2.loadImage(`${RES_ENUM.Item}${icon_2}_h`, 1, true);
        this.LblNum1.string = this.cost1[0][1];
        this.LblNum2.string = this.cost2[0][1];
    }

    /** 显示剩余购买次数 */
    private showBuyTimes() {
        const type1 = this.cost1[0][0] == ItemCurrencyId.INGOT ? HuarongdaoBuyType.yuanba : HuarongdaoBuyType.yubi;
        const type2 = this.cost2[0][0] == ItemCurrencyId.INGOT ? HuarongdaoBuyType.yuanba : HuarongdaoBuyType.yubi;
        const times1 = ModelMgr.I.HuarongdaoModel.getButTimesByType(type1);
        const times2 = ModelMgr.I.HuarongdaoModel.getButTimesByType(type2);
        const leave1 = this.cost1[0][2] - times1;
        const leave2 = this.cost2[0][2] - times2;
        this.LblTimes1.string = `${leave1}/${this.cost1[0][2]}`;
        this.LblTimes2.string = `${leave2}/${this.cost2[0][2]}`;
        UtilCocos.SetColor(this.LblTimes1.node, leave1 <= 0 ? UtilColor.Red() : UtilColor.Hex2Rgba('#4f9b6a'));
        UtilCocos.SetColor(this.LblTimes2.node, leave2 <= 0 ? UtilColor.Red() : UtilColor.Hex2Rgba('#4f9b6a'));
    }

    /**
     *购买礼券
     * @param type 货币类型
     * @param cost 价格
     * @param times 次数上限
     */
    private handlerBuy(type: number, cost: number, times: number): void {
        const haveNum = RoleMgr.I.getCurrencyById(Number(type));
        const buyTimes = ModelMgr.I.HuarongdaoModel.getButTimesByType(type);
        if (buyTimes >= times) { // 次数不足
            MsgToastMgr.Show(i18n.tt(Lang.huarongdao_buy_times_unenough));
        } else if (haveNum < cost) { // 货币不足
            MsgToastMgr.Show(i18n.tt(type == 2 ? Lang.com_msg_currency_yubi_not_enough : Lang.com_msg_currency_not_enough));
            WinMgr.I.open(ViewConst.ItemSourceWin, type == 2 ? ItemCurrencyId.JADE : ItemCurrencyId.INGOT);
        } else {
            const buyType = type == ItemCurrencyId.INGOT ? HuarongdaoBuyType.yuanba : HuarongdaoBuyType.yubi;
            ControllerMgr.I.HuarongdaoController.reqC2SHuarongBuy(buyType, 1);
        }
    }

    protected addE(): void {
        EventClient.I.on(E.Huarongdao.GiftTimesUpdate, this.showBuyTimes, this);
        RoleMgr.I.on(
            this.updateItemIcon,
            this,
            RoleAN.N.HuarongTicket,
        );
    }

    protected remE(): void {
        EventClient.I.off(E.Huarongdao.GiftTimesUpdate, this.showBuyTimes, this);
        RoleMgr.I.off(
            this.updateItemIcon,
            this,
            RoleAN.N.HuarongTicket,
        );
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    // update (dt) {}
}
