/*
 * @Author: zs
 * @Date: 2023-01-10 18:21:09
 * @Description:
 *
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilBool } from '../../../../../app/base/utils/UtilBool';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../../i18n/i18n';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { E } from '../../../../const/EventName';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { RID } from '../../../reddot/RedDotConst';
import { ERankMatchAwardStatus } from '../RankMatchConst';

const { ccclass, property } = cc._decorator;
@ccclass
export class RankMatchAwardBottomWin extends BaseCmp {
    @property(cc.Node)
    private NodeItems: cc.Node = null;
    @property(cc.Node)
    private BtnLQ: cc.Node = null;
    @property(cc.Node)
    private NodeYLQ: cc.Node = null;
    @property(cc.Node)
    private NodeWDC: cc.Node = null;

    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.RankMatch.UpdateDayWinReward, this.onUpdateDayWinReward, this);
        UtilGame.Click(this.BtnLQ, this.onBtnLQ, this);
        UtilRedDot.Bind(RID.Arena.RankMatch.Reward.Win.DayFirst, this.BtnLQ, cc.v2(50, 10));
    }
    protected start(): void {
        super.start();
        UtilItemList.ShowItems(this.NodeItems, ModelMgr.I.RankMatchModel.RankMatchFirstReward, { option: { needNum: true } });
        this.updateStatus();
    }

    private status: ERankMatchAwardStatus = ERankMatchAwardStatus.UnLq;

    private onUpdateDayWinReward(isYLQ: boolean) {
        if (isYLQ) {
            this.updateStatus(ERankMatchAwardStatus.Ylq);
        }
    }
    /**
     * 更新奖励状态
     */
    public updateStatus(status?: ERankMatchAwardStatus): void {
        if (UtilBool.isNullOrUndefined(status)) {
            status = ERankMatchAwardStatus.UnLq;
            if (ModelMgr.I.RankMatchModel.getData().IsGetDayWin) {
                status = ERankMatchAwardStatus.Ylq;
            } else {
                status = ModelMgr.I.RankMatchModel.getData().DayWinNum > 0 ? ERankMatchAwardStatus.Canlq : ERankMatchAwardStatus.UnLq;
            }
        }
        this.status = status;
        this.BtnLQ.active = this.status === ERankMatchAwardStatus.Canlq;
        this.NodeYLQ.active = this.status === ERankMatchAwardStatus.Ylq;
        this.NodeWDC.active = this.status === ERankMatchAwardStatus.UnLq;
    }

    private onBtnLQ() {
        if (this.status === ERankMatchAwardStatus.Canlq) {
            ControllerMgr.I.RankMatchController.C2SRankMatchGetDayWinReward();
        } else if (this.status === ERankMatchAwardStatus.UnLq) {
            MsgToastMgr.Show(i18n.tt(Lang.rankmatch_award_daywin_tips));
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.rankmatch_award_tips));
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.RankMatch.UpdateDayWinReward, this.onUpdateDayWinReward, this);
    }
}
