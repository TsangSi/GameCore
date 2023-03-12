/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2023-01-09 14:44:00
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\module\stageReward\v\StageRewardItem.ts
 * @Description: 阶段奖励（等级、战力、vip等）item
 *
 */

import { UtilNum } from '../../../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { Config } from '../../../../../base/config/Config';
import { ConfigConst } from '../../../../../base/config/ConfigConst';
import { ConfigActEventRewardIndexer } from '../../../../../base/config/indexer/ConfigActEventRewardIndexer';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilItemList from '../../../../../base/utils/UtilItemList';
import { ItemWhere } from '../../../../../com/item/ItemConst';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import { ERewardState, IStageReward, EStageType } from '../StageRewardConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageRewardItem extends BaseCmp {
    @property(cc.Node)
    private NdReward: cc.Node = null;

    @property(cc.Label)
    private LabType: cc.Label = null;

    @property(cc.Label)
    private LabValue: cc.Label = null;

    /** 未达成 */
    @property(cc.Node)
    private BtnUnReach: cc.Node = null;
    /** 可领取 */
    @property(cc.Node)
    private BtnCanGet: cc.Node = null;
    /** 已领取 */
    @property(cc.Node)
    private BtnGot: cc.Node = null;

    private _data: IStageReward = null;

    protected start(): void {
        UtilGame.Click(this.BtnCanGet, () => {
            ControllerMgr.I.StageRewardController.reqGetStageReward(this._data.funcID, this._data.cycNo, this._data.cfg.Id);
        }, this);
        UtilGame.Click(this.BtnUnReach, () => {
            MsgToastMgr.Show(i18n.tt(Lang.stage_unReach));
        }, this);
    }

    public setData(data: IStageReward): void {
        this._data = data;
        const cfgUI: Cfg_StageRewardsUI = Config.Get(ConfigConst.Cfg_StageRewardsUI).getValueByKey(data.group);
        this.LabType.string = cfgUI.Desc2;
        if (data.cfg.ConditionType === EStageType.Level) {
            this.LabValue.string = `${data.cfg.Value}${i18n.lv}`;
        } else {
            this.LabValue.string = UtilNum.ConvertFightValue(data.cfg.Value);
        }

        // 奖励
        let rewards = '';
        if (data.cfg.RewardID) {
            const indexer: ConfigActEventRewardIndexer = Config.Get(ConfigConst.Cfg_Server_EventReward);
            const d = indexer.getValueByGroupId(data.cfg.RewardID);
            rewards = d.ShowItems;
        } else if (data.cfg.Uireward) {
            rewards = data.cfg.Uireward;
        }
        if (rewards) {
            UtilItemList.ShowItems(this.NdReward, rewards, { option: { where: ItemWhere.OTHER, needNum: true } });
        }

        // 领取状态
        this.BtnUnReach.active = data.state === ERewardState.unReach;
        this.BtnCanGet.active = data.state === ERewardState.canGet;
        this.BtnGot.active = data.state >= ERewardState.got;
    }
}
