/*
 * @Author: kexd
 * @Date: 2022-07-19 10:04:58
 * @FilePath: \SanGuo\assets\script\game\module\arena\v\ArenaRankRewardItem.ts
 * @Description:
 *
 */
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import UtilItemList from '../../../base/utils/UtilItemList';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArenaRankRewardItem extends cc.Component {
    @property(cc.Label)
    private LabRank: cc.Label = null;

    @property(cc.ScrollView)
    private scroll: cc.ScrollView = null;

    public setData(index: number): void {
        const configIndexer: ConfigIndexer = Config.Get(Config.Type.Cfg_ArenaRewards);
        // 表中索引为从0开始
        const cfg: Cfg_ArenaRewards = configIndexer.getValueByIndex(index);
        if (cfg) {
            if (cfg.RankMax === cfg.RankMin) {
                this.LabRank.string = `${i18n.tt(Lang.arena_di)}${cfg.RankMin}${i18n.tt(Lang.arena_ming)}`;
            } else {
                this.LabRank.string = `${i18n.tt(Lang.arena_di)}${cfg.RankMin}-${cfg.RankMax}${i18n.tt(Lang.arena_ming)}`;
            }
        }
        const groupId = cfg.GroupId;
        const rewardConfig: Cfg_DropReward = ModelMgr.I.ArenaModel.getRewardConfig(groupId);
        if (!rewardConfig) {
            this.scroll.node.active = false;
        } else {
            this.scroll.node.active = true;
            UtilItemList.ShowItems(this.scroll.content, rewardConfig.ShowItems, { option: { needNum: true } });
        }
    }
}
