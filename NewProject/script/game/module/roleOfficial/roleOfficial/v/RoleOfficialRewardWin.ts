/*
 * @Author: myl
 * @Date: 2022-10-12 17:54:50
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import ListView from '../../../../base/components/listview/ListView';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { ItemWhere } from '../../../../com/item/ItemConst';
import WinBase from '../../../../com/win/WinBase';
import { E } from '../../../../const/EventName';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { RID } from '../../../reddot/RedDotConst';
import { RoleOfficialRewardItem } from './RoleOfficialRewardItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleOfficialRewardWin extends WinBase {
    /** 获取每日任务奖励按钮 */
    @property(cc.Node)
    private BtnGetDayReward: cc.Node = null;

    @property(cc.Node)
    private NdTop: cc.Node = null;

    /** 领取过当日官职奖励 */
    @property(cc.Node)
    private NdGatedReward: cc.Node = null;

    /** 每日奖励界面 */
    @property(cc.Node)
    private NdReward: cc.Node = null;

    @property(ListView)
    private list: ListView = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    private _rewardList: OfficeTargetReward[] = [];
    protected start(): void {
        super.start();

        UtilGame.Click(this.node, this.close, this, { scale: 1 });
        UtilGame.Click(this.NdTop, () => {
            //
        }, this, { scale: 1 });
        UtilGame.Click(this.BtnGetDayReward, this.BtnDayReward, this);
        UtilGame.Click(this.BtnClose, this.close, this);
        UtilRedDot.Bind(RID.Role.RoleOfficial.Official.Reward.Day, this.BtnGetDayReward, cc.v2(65, 25));

        EventClient.I.on(E.RoleOfficial.OfficialDayReward, this.updateDay, this);
        EventClient.I.on(E.RoleOfficial.OfficialRankReward, this.updateList, this);
    }

    public init(args: unknown[]): void {
        this.refreshUI();
    }

    private refreshUI() {
        this._rewardList = ModelMgr.I.RoleOfficeModel.rewards;
        this.list.setNumItems(this._rewardList.length);
        const { reward, state } = ModelMgr.I.RoleOfficeModel.getDayReward();
        this.BtnGetDayReward.active = !state;
        this.NdGatedReward.active = state;
        UtilItemList.ShowItems(this.NdReward, reward, { option: { needNum: true, where: ItemWhere.OTHER } });
    }

    private updateList() {
        this._rewardList = ModelMgr.I.RoleOfficeModel.rewards;
        this.list.setNumItems(this._rewardList.length);
    }

    private updateDay() {
        const { reward, state } = ModelMgr.I.RoleOfficeModel.getDayReward();
        this.BtnGetDayReward.active = !state;
        this.NdGatedReward.active = state;
    }

    private BtnDayReward(): void {
        ControllerMgr.I.RoleOfficialController.getDayReward();
    }

    private scrollEvent(nd: cc.Node, index: number) {
        const item = this._rewardList[index];
        const itm = nd.getComponent(RoleOfficialRewardItem);
        itm.setData(item);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.RoleOfficial.OfficialDayReward, this.updateDay, this);
        EventClient.I.off(E.RoleOfficial.OfficialRankReward, this.updateList, this);
    }
}
