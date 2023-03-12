/*
 * @Author: zs
 * @Date: 2023-01-06 17:28:11
 * @Description:
 *
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import BaseUiView from '../../../../../app/core/mvc/view/BaseUiView';
import { i18n, Lang } from '../../../../../i18n/i18n';
import ListView from '../../../../base/components/listview/ListView';
import { E } from '../../../../const/EventName';
import ModelMgr from '../../../../manager/ModelMgr';
import { RankMatchRankItem } from '../com/RankMatchRankItem';
import { ERankMatchRankTabId } from '../RankMatchConst';
import RankMatchModel from '../RankMatchModel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankMatchRankView extends BaseUiView {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Label)
    private LabelRank: cc.Label = null;
    @property(cc.Label)
    private LabelScore: cc.Label = null;

    private curShowTabId: ERankMatchRankTabId;
    private model: RankMatchModel;
    protected onLoad(): void {
        super.onLoad();
        this.model = ModelMgr.I.RankMatchModel;
        this.LabelRank.string = this.model.getShowRank();
        this.LabelScore.string = `${this.model.score}`;
        this.node.on('PageRefreshEvent', this.onPageRefreshEvent, this);
        EventClient.I.on(E.RankMatch.UpdateRankData, this.onUpdateRankData, this);
        this.ListView.node.on('scroll-to-bottom', this.onScrollToBottom, this);
        ModelMgr.I.RankMatchModel.clearRankData();
    }

    private _maxNum: number = 0;
    private get maxNum(): number {
        if (!this._maxNum) {
            const cfg: Cfg_RankMatchReward = this.model.cfgReward.getValueByIndex(this.model.cfgReward.length - 1);
            this._maxNum = cfg.RankMax;
        }
        return this._maxNum;
    }
    private onPageRefreshEvent(id: ERankMatchRankTabId) {
        this.curShowTabId = id;
        if (this.ListView.numItems > 0) {
            this.ListView.scrollTo(0, 0);
            this.scheduleOnce(() => {
                if (this.curShowTabId === ERankMatchRankTabId.Rank) {
                    // ModelMgr.I.RankMatchModel.reqRankData();
                    this.onUpdateRankData(this.num);
                } else {
                    this.updateListView();
                }
            }, 0);
        } else if (this.curShowTabId === ERankMatchRankTabId.Rank) {
            // ModelMgr.I.RankMatchModel.reqRankData();
            this.onUpdateRankData(this.num);
        } else {
            this.updateListView();
        }
    }

    private onUpdateRankData(num?: number) {
        if (this.curShowTabId === ERankMatchRankTabId.Rank) {
            num = num || this.num + 10;
            const cfg: Cfg_RankMatchReward = this.model.cfgReward.getValueByIndex(this.model.cfgReward.length - 1);
            if (cfg) {
                num = Math.min(cfg.RankMax, num);
            }
            if (num > this.maxNum) {
                num = this.maxNum;
            }
            this.updateListView(num);
        }
    }

    private num: number = 0;
    private updateListView(num: number = 0) {
        num = num || 0;
        switch (this.curShowTabId) {
            case ERankMatchRankTabId.Rank:
                this.num = num;
                break;
            case ERankMatchRankTabId.Reward:
                num = this.model.cfgReward.length;
                break;
            default:
                break;
        }
        this.ListView.setNumItems(num);
    }

    private onRenderItem(node: cc.Node, index: number) {
        const compScript: RankMatchRankItem = node.getComponent(RankMatchRankItem);
        compScript.setData(index, this.curShowTabId);
    }

    private onScrollToBottom() {
        if (this.num <= ModelMgr.I.RankMatchModel.getRankDataLength()) {
            // ModelMgr.I.RankMatchModel.reqRankData();
        } else if (this.num < this.maxNum) {
            this.onUpdateRankData();
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.RankMatch.UpdateRankData, this.onUpdateRankData, this);
    }
}
