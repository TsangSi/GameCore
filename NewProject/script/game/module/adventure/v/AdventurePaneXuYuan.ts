import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { TickTimer } from '../../../base/components/TickTimer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdventurePaneXuYuan extends BaseUiView {
    @property(DynamicImage)
    private SprXyIcon: DynamicImage = null;

    @property(cc.Label)
    private LabXyPrice: cc.Label = null;

    @property(cc.Node)
    private NdAlready: cc.Node = null;

    @property(cc.Node)
    private NdXyItems: cc.Node = null;

    @property(cc.Node)
    private NdBtns: cc.Node[] = [];

    /** 剩余时间节点 */
    @property(cc.Node)
    private NdOutTime: cc.Node = null;

    /** 剩余时间 */
    @property(TickTimer)
    private LabOutTime: TickTimer = null;

    /** 事件说明 */
    @property(cc.Label)
    private NdDescLabel: cc.Label = null;

    private costType: number = 0;

    private costNum: number = 0;

    private CanGetTime: number = 0;

    private step: number = 0;

    private curEvent: AdventureEvent = null;

    protected start(): void {
        const model = ModelMgr.I.AdventureModel;
        this.NdDescLabel.string = model.getEventDesc(3);

        this.NdBtns.forEach((v) => {
            UtilGame.Click(v, this.clickXuYuan, this);
        });
    }

    private checkEvent(): boolean {
        if (!this.curEvent) return false;
        if (this.curEvent.State === 1) {
            MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_3));
            return false;
        }
        if (UtilTime.NowSec() >= this.curEvent.OverTime) {
            if (this.curEvent.EventId !== 3 || this.curEvent.EventWish.WishState !== 1) {
                MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_4));
                return false;
            }
        }

        return true;
    }

    /** 点击许愿 */
    protected clickXuYuan(): void {
        console.log('点击许愿');
        if (this.checkEvent()) {
            if (!this.checkCost()) return;
            ControllerMgr.I.AdventureController.reqEventUse(this.curEvent.OnlyId);
        }
    }

    public checkCost(): boolean {
        if (UtilTime.NowSec() <= this.CanGetTime) {
            MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_5));
            return false;
        }
        if (this.step === 0) {
            const count = RoleMgr.I.getCurrencyById(this.costType);
            if (count < this.costNum) {
                const name = UtilItem.NewItemModel(this.costType).cfg.Name;
                MsgToastMgr.Show(name + i18n.tt(Lang.com_buzu));
                WinMgr.I.open(ViewConst.ItemSourceWin, this.costType);
                return false;
            }
        }
        return true;
    }

    /**
     * 设置许愿购买物品
     * @param  items 物品列表
     * @param prices 货币列表
     * @param priceTypes 货币类型列表
     */
    public setData(active: boolean, ev: AdventureEvent = null, item: Cfg_AdventureShop = null): void {
        console.log(111);

        this.curEvent = ev;
        this.node.active = active;
        if (active) {
            const price = item.Prize;
            const priceType = item.CostItem;
            const items = item.ItemString.split('|');
            for (let i = 0; i < 3; ++i) {
                const item = items[i];
                if (item) {
                    this.NdXyItems.children[i].active = true;
                    const ary = item.split(':');
                    const itemModel = UtilItem.NewItemModel(Number(ary[0]), Number(ary[1]));
                    this.NdXyItems.children[i].getComponent(ItemIcon).setData(itemModel, { needNum: true });
                    continue;
                }
                this.NdXyItems.children[i].active = false;
            }
            this.NdXyItems.getComponent(cc.Layout).updateLayout();
            const costImgUrl: string = UtilCurrency.getIconByCurrencyType(priceType);
            this.SprXyIcon.loadImage(costImgUrl, 1, true);
            this.LabXyPrice.string = String(price);
            this.costType = priceType;
            this.costNum = price;
            this.NdBtns[0].active = ev.EventWish.WishState === 0;
            this.NdBtns[1].active = ev.EventWish.WishState === 1;
            this.NdAlready.active = ev.EventWish.WishState === 2;
            this.SprXyIcon.node.active = ev.EventWish.WishState === 0;
            this.LabXyPrice.node.active = ev.EventWish.WishState === 0;
            this.step = ev.EventWish.WishState;
            const time = ev.EventWish.CanGetTime - UtilTime.NowSec();
            this.showTime(time);
            this.CanGetTime = ev.EventWish.CanGetTime;
            // this.NdFinish.active = ev.EventWish.WishState === 1 && time <= 0;
        }
    }

    /** 显示时间 */
    private showTime(time: number = 0) {
        if (time > 0) {
            this.LabOutTime.tick(time, `%HH:%mm:%ss`, true, true, false);
        }
        this.NdOutTime.active = time > 0;
    }

    /** 刷新全部UI */
    private onTimer() {
        EventClient.I.emit(E.Adventure.syncEventList);
    }
}
