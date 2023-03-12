/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import BaseUiView from '../../../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import ListView from '../../../../base/components/listview/ListView';
import { TickTimer } from '../../../../base/components/TickTimer';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import { ItemWhere } from '../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import WinBase from '../../../../com/win/WinBase';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { EVipFuncType } from '../../../vip/VipConst';
import { RoadData } from '../SilkRoadConst';
import SilkRoadSelectItem from './SilkRoadSelectItem';

const { ccclass, property } = cc._decorator;

/**
 * 西域行商
 * @author juny
 */
@ccclass
export class SilkRoadSelectView extends cc.Component {
    @property(cc.Label)
    private LabCount: cc.Label = null;

    @property(cc.RichText)
    private LabTips: cc.RichText = null;

    @property(cc.Node)
    private BtnReward: cc.Node = null;

    @property(cc.Node)
    private BtnBuy: cc.Node = null;

    @property(ListView)
    private listview: ListView = null;

    private data: RoadData[] = null;

    protected start(): void {
        EventClient.I.on(E.SilkRoad.buyCount, this.updateTimes, this);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.SilkRoad.buyCount, this.updateTimes, this);
    }

    public init(): void {
        this.updateTimes();
        const model = ModelMgr.I.SilkRoadModel;

        this.data = model.getAllRoadData();
        this.listview.setNumItems(this.data.length, 0);
        this.LabTips.string = i18n.tt(Lang.silkroad_tip5);

        /** 行商事件奖励预览 */
        UtilGame.Click(this.BtnReward, () => {
            const reward = model.getEventReward();
            WinMgr.I.open(ViewConst.SilkRoadEventReward, reward, true);
        }, this);

        /** 购买行商次数 */
        UtilGame.Click(this.BtnBuy, () => {
            this.buyView();
        }, this);
    }

    private isLimit(): boolean {
        const model = ModelMgr.I.SilkRoadModel;
        const info = model.getInfo();
        const cur = model.getSilkRoadTimes() + info.BuyCount - info.Count;
        return cur === model.getSilkRoadTimes();
    }

    private buyView() {
        const { tip, vipLv } = ModelMgr.I.VipModel.getMinTimesCfg(EVipFuncType.SilkRoadCount);
        if (RoleMgr.I.d.VipLevel < vipLv) {
            MsgToastMgr.Show(tip);
            return;
        }
        const vipModel = ModelMgr.I.VipModel;
        const model = ModelMgr.I.SilkRoadModel;
        const cost = model.getSilkRoadOneKey();
        const name = UtilItem.NewItemModel(cost.id).cfg.Name;
        const cur = model.getInfo().BuyCount;
        const max = vipModel.getSilkRoadCount(RoleMgr.I.d.VipLevel);

        if (this.isLimit()) {
            MsgToastMgr.Show(i18n.tt(Lang.silkroad_tip8));
            return;
        }

        const config = [
            UtilColor.NorV,
            UtilColor.GreenV,
            cost.num,
            1,
            vipModel.getVipName(RoleMgr.I.d.VipLevel),
            max - cur,
            max,
            max - cur > 0 ? UtilColor.GreenV : UtilColor.RedV,
            name,
        ];

        const str = UtilString.FormatArray(
            i18n.tt(Lang.silkroad_tip21),
            config,
        );

        ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
            /** 判断购买次数是否上限 */
            if (cur === max) {
                MsgToastMgr.Show(i18n.tt(Lang.arena_buy_times_unenough));
                return;
            }
            const count = RoleMgr.I.getCurrencyById(cost.id);
            if (count < cost.num) {
                MsgToastMgr.Show(name + i18n.tt(Lang.com_buzu));
                // WinMgr.I.open(ViewConst.ItemSourceWin, cost.id);
                return;
            }
            ControllerMgr.I.SilkRoadController.reqBuyCount();
            WinMgr.I.close(ViewConst.ConfirmBox);
        }, { showToggle: '', cbCloseFlag: 'SilkRoad' }, null);
    }

    private updateTimes(showBuyView: boolean = false): void {
        const model = ModelMgr.I.SilkRoadModel;
        const info = model.getInfo();
        const cur = model.getSilkRoadTimes() + info.BuyCount - info.Count;
        this.LabCount.string = `${cur}/${model.getSilkRoadTimes()}`;
        this.LabCount.node.color = this.node.color.fromHEX(cur !== 0 ? '#1FAE3E' : '#E12727');
        // if (showBuyView) {
        //     this.buyView();
        // }
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const road = this.data[idx];
        node.getComponent(SilkRoadSelectItem).setData(road);
    }
}
