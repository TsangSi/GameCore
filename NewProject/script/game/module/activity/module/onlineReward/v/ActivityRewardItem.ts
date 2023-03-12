/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: myl
 * @Date: 2022-12-07 10:21:39
 * @Description:
 */

import BaseCmp from '../../../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { Config } from '../../../../../base/config/Config';
import { ConfigConst } from '../../../../../base/config/ConfigConst';
import { ConfigActEventRewardIndexer } from '../../../../../base/config/indexer/ConfigActEventRewardIndexer';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilItemList from '../../../../../base/utils/UtilItemList';
import UtilRedDot from '../../../../../base/utils/UtilRedDot';
import { ItemWhere } from '../../../../../com/item/ItemConst';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { OnlineRewardData } from '../OnlieRewardModel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActivityRewardItem extends BaseCmp {
    @property(cc.Label)
    private LabTip: cc.Label = null;
    @property(cc.Node)
    private NdReward: cc.Node = null;
    /** 未达成 */
    @property(cc.Node)
    private BtnCantGet: cc.Node = null;
    /** 可领取 */
    @property(cc.Node)
    private BtnCanGet: cc.Node = null;
    /** 已领取 */
    @property(cc.Node)
    private BtnGeted: cc.Node = null;

    private _data: OnlineRewardData = null;
    @property(cc.Node)
    private NdRed: cc.Node = null;

    protected start(): void {
        UtilGame.Click(this.BtnCanGet, () => {
            ControllerMgr.I.OnlineRewardController.GetOnlineReward(this._data.funcID, this._data.cycNo, this._data.cfg.Id);
        }, this);
        UtilGame.Click(this.BtnCantGet, () => {
            MsgToastMgr.Show(i18n.tt(Lang.online_time_unenough));
        }, this);
    }

    private scheduleCallback: Function = null;
    public setData(data: OnlineRewardData): void {
        this._data = data;
        this.LabTip.string = `${data.cfg.TimeRequest}`;

        const indexer: ConfigActEventRewardIndexer = Config.Get(ConfigConst.Cfg_Server_EventReward);
        const reward = indexer.getValueByDay(data.cfg.RewardID);
        UtilItemList.ShowItems(this.NdReward, reward.ShowItems, { option: { where: ItemWhere.OTHER, needNum: true } });
        this.BtnGeted.active = data.data > 0;
        this.BtnCantGet.active = data.data === 0;
        this.BtnCanGet.active = data.data < 0;
        // UtilRedDot.UpdateRed(this.node, data.data < 0, cc.v2(270, 20));
        this.NdRed.active = data.data < 0;
        if (this.scheduleCallback) {
            this.unschedule(this.scheduleCallback);
            this.scheduleCallback = null;
        }
        this.scheduleCallback = this.timerAction.bind(this);
        if (data.data === 0) {
            this.schedule(this.scheduleCallback, 1, cc.macro.REPEAT_FOREVER);
        }
    }

    private timerAction(): void {
        if (this._data.data > 0) return;
        const userTotalTime = ModelMgr.I.OnlineRewardModel.GetUserOnlineTotalTime();
        const CfgTime = this._data.cfg.TimeRequest * 60;
        if (CfgTime <= userTotalTime) {
            this._data.data = -1;
        } else {
            this._data.data = 0;
        }
        this.BtnCantGet.active = this._data.data === 0;
        this.BtnCanGet.active = this._data.data < 0;
    }
}
