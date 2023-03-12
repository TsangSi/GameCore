/*
 * @Author: zs
 * @Date: 2023-01-10 18:21:09
 * @Description:
 *
 */
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilRichString } from '../../../../../app/base/utils/UtilRichString';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { ImageType } from '../../../../base/components/DynamicImage';
import { NickShowType } from '../../../../base/utils/UtilGame';
import UtilHead from '../../../../base/utils/UtilHead';
import UtilItemList from '../../../../base/utils/UtilItemList';
import ModelMgr from '../../../../manager/ModelMgr';
import { ERankMatchRankTabId } from '../RankMatchConst';

const { ccclass, property } = cc._decorator;
@ccclass
export class RankMatchRankItem extends BaseCmp {
    @property(cc.Node)
    private NodeInfo: cc.Node = null;
    @property(cc.Sprite)
    private HeadIcon: cc.Sprite = null;
    @property(cc.Sprite)
    private HeadFrame: cc.Sprite = null;
    @property(cc.Label)
    private LabelRank: cc.Label = null;
    @property(cc.Sprite)
    private SpriteRank: cc.Sprite = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelLevelName: cc.Label = null;
    @property(cc.Label)
    private LabelFv: cc.Label = null;
    @property(cc.Label)
    private LabelScore: cc.Label = null;
    @property(cc.Node)
    private NodeItems: cc.Node = null;
    @property(cc.Label)
    private LabelTips: cc.Label = null;

    public setData(index: number, tabId: ERankMatchRankTabId): void {
        if (tabId === ERankMatchRankTabId.Rank) {
            this.NodeInfo.active = true;
            this.NodeItems.active = false;
            this.NodeItems.destroyAllChildren();
            const rank = index + 1;
            this.updateRank(rank);
            const player = ModelMgr.I.RankMatchModel.getRankData(rank);
            if (player) {
                this.LabelName.string = player.getAreaNick(NickShowType.ArenaNick);
                this.LabelFv.string = player.FightValue;
                this.LabelScore.string = `${player.d.RankMatchScore}`;
                this.LabelLevelName.string = ModelMgr.I.RankMatchModel.getCfgPos(player.d.RankMatchScore)?.Name || '';
                UtilHead.setHead(player.d.HeadIcon, this.HeadIcon, player.d.HeadFrame, this.HeadFrame, 0.8);
                this.LabelTips.node.active = false;
            } else {
                this.NodeInfo.active = false;
                const cfgReward = ModelMgr.I.RankMatchModel.cfgReward;
                let cfg: Cfg_RankMatchReward = cfgReward.getIntervalData(rank);
                if (!cfg) {
                    cfg = cfgReward.getValueByIndex(cfgReward.length - 1);
                }
                if (cfg) {
                    this.LabelTips.string = UtilString.FormatArgs(i18n.tt(Lang.rankmatch_rank_tips), cfg.RankLimit);
                    this.LabelTips.node.active = true;
                }
            }
        } else {
            this.NodeInfo.active = false;
            this.NodeItems.active = true;
            this.LabelTips.node.active = false;
            const cfg: Cfg_RankMatchReward = ModelMgr.I.RankMatchModel.cfgReward.getValueByIndex(index);
            if (cfg) {
                this.updateRank(cfg.RankMin, cfg.RankMax);
                UtilItemList.ShowItems(this.NodeItems, cfg.Reward, { option: { needNum: true } });
            }
        }
    }

    /**
     * 更新排名显示
     * @param rankMin 排名下限
     * @param rankMax 排名上限
     */
    private updateRank(rankMin: number, rankMax?: number) {
        rankMax = rankMax || rankMin;
        if (rankMin <= 3) {
            this.SpriteRank.node.parent.active = true;
            this.LabelRank.node.active = false;
            UtilCocos.LoadSpriteFrameRemote(this.SpriteRank, `texture/com/img/com_img_paiming_0${rankMin}`);
        } else {
            this.SpriteRank.node.parent.active = false;
            this.LabelRank.node.active = true;
            if (rankMin === rankMax) {
                this.LabelRank.string = `${rankMin}`;
            } else {
                this.LabelRank.string = `${rankMin}-${rankMax}`;
            }
        }
    }
}
