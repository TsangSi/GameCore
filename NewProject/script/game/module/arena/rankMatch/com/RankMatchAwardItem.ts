/*
 * @Author: zs
 * @Date: 2023-01-10 18:21:09
 * @Description:
 *
 */
import { UtilBool } from '../../../../../app/base/utils/UtilBool';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../../i18n/i18n';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { ERankMatchAwardStatus, ERankMatchAwardTabId, IRankMatchAwardTitleInfo } from '../RankMatchConst';

const { ccclass, property } = cc._decorator;
@ccclass
export class RankMatchAwardItem extends BaseCmp {
    @property(cc.Node)
    private NodeLabels: cc.Node = null;
    @property(cc.Node)
    private BtnLQ: cc.Node = null;
    @property(cc.Node)
    private NodeYLQ: cc.Node = null;
    @property(cc.Node)
    private NodeWDC: cc.Node = null;
    @property(cc.Node)
    private NodeItems: cc.Node = null;
    @property(cc.Label)
    private LabelProgress: cc.Label = null;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnLQ, this.onBtnLQ, this);
    }
    private index: number = 0;
    private id: number = 0;
    private curShowTabId: ERankMatchAwardTabId = ERankMatchAwardTabId.Win;
    /** 领取的限制 */
    private limitValue: number = 0;
    public setData(index: number, tabId: ERankMatchAwardTabId): number {
        this.index = index;
        this.curShowTabId = tabId;
        const model = ModelMgr.I.RankMatchModel;
        let titles: IRankMatchAwardTitleInfo[] = [];
        let strAward: string = '';
        this.LabelProgress.string = '';
        if (this.curShowTabId === ERankMatchAwardTabId.Win) {
            const cfgWin: Cfg_RankMatchWinReward = model.cfgWinReward.getValueByIndex(index);
            titles = [
                { value: i18n.tt(Lang.rankmatch_award_item_win_title1) },
                { value: `${cfgWin.WinNum}`, color: UtilColor.Hex2Rgba('#c04437') },
                { value: i18n.tt(Lang.rankmatch_award_item_win_title2) },
            ];
            strAward = cfgWin.Reward;
            this.id = cfgWin.Id;
            this.limitValue = cfgWin.WinNum;
            this.updateProgress(model.getData().SessionWinNum, cfgWin.WinNum);
        } else if (this.curShowTabId === ERankMatchAwardTabId.Segme) {
            const cfgPos: Cfg_RankMatchPos = model.cfgPos.getValueByIndex(index);
            titles = [
                { value: i18n.tt(Lang.rankmatch_award_item_rank_title) },
                { value: cfgPos.Name || '', color: UtilColor.Hex2Rgba('#c04437') },
            ];
            strAward = cfgPos.Reward;
            this.id = cfgPos.Id;
            this.limitValue = cfgPos.GoalMin;
        }
        this.showLabels(titles);
        this.updateStatus();
        UtilItemList.ShowItems(this.NodeItems, strAward, { option: { needNum: true } });
        return this.id;
    }
    /**
     * 更新进度
     * @param cur 当前值
     * @param max 满值
     */
    public updateProgress(cur: number, max: number): void {
        this.LabelProgress.string = `${cur}/${max}`;
        this.LabelProgress.node.color = cur >= max ? UtilColor.ColorEnough : UtilColor.ColorUnEnough;
        this.LabelProgress.node.active = true;
    }

    /**
     * 更新奖励状态
     * @param status 奖励状态
     */
    public updateStatus(status?: ERankMatchAwardStatus): void {
        if (UtilBool.isNullOrUndefined(status)) {
            status = ERankMatchAwardStatus.UnLq;
            if (ModelMgr.I.RankMatchModel.isYlqReward(this.id, this.curShowTabId)) {
                status = ERankMatchAwardStatus.Ylq;
                this.LabelProgress.node.active = false;
            } else if (this.curShowTabId === ERankMatchAwardTabId.Win) {
                if (ModelMgr.I.RankMatchModel.getData().SessionWinNum >= this.limitValue) {
                    status = ERankMatchAwardStatus.Canlq;
                }
            } else if (this.curShowTabId === ERankMatchAwardTabId.Segme) {
                if (ModelMgr.I.RankMatchModel.score >= this.limitValue) {
                    status = ERankMatchAwardStatus.Canlq;
                }
            }
        }
        this.BtnLQ.active = status === ERankMatchAwardStatus.Canlq;
        this.NodeYLQ.active = status === ERankMatchAwardStatus.Ylq;
        this.NodeWDC.active = status === ERankMatchAwardStatus.UnLq;
        UtilRedDot.UpdateRed(this.BtnLQ, status === ERankMatchAwardStatus.Canlq, cc.v2(38, 6));
    }

    /** 显示多个文本 */
    private showLabels(titles: IRankMatchAwardTitleInfo[]) {
        for (let i = 0, n = Math.max(titles.length, this.NodeLabels.childrenCount); i < n; i++) {
            const title = titles[i];
            if (title) {
                this.updateLabel(title, i);
            } else if (i === 0) {
                this.NodeLabels.children[i].active = false;
            } else {
                this.NodeLabels.children[i]?.destroy();
            }
        }
    }

    /**
     * 更新显示文本
     * @param node label节点
     * @param title 需要显示的文本
     */
    private updateLabel(title: IRankMatchAwardTitleInfo, index: number) {
        const node = this.NodeLabels.children[index] || cc.instantiate(this.NodeLabels.children[0]);
        const color = title.color || this.getNormalColor();
        node.active = false;
        UtilCocos.SetString(node, title.value);
        UtilCocos.SetColor(node, color);
        node.active = true;
        if (!this.NodeLabels.children[index]) {
            this.NodeLabels.addChild(node);
        }
    }

    private getNormalColor() {
        return UtilColor.Nor();
    }

    private onBtnLQ() {
        if (this.curShowTabId === ERankMatchAwardTabId.Win) {
            if (ModelMgr.I.RankMatchModel.getData().SessionWinNum >= this.limitValue) {
                ControllerMgr.I.RankMatchController.C2SRankMatchGetSessionWinReward(this.id);
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.rankmatch_award_item_tips));
            }
        } else if (this.curShowTabId === ERankMatchAwardTabId.Segme) {
            if (ModelMgr.I.RankMatchModel.score >= this.limitValue) {
                ControllerMgr.I.RankMatchController.C2SRankMatchGetLevelReward(this.id);
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.rankmatch_award_item_tips));
            }
        }
    }
}
