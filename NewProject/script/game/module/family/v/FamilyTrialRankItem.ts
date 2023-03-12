import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilItem from '../../../base/utils/UtilItem';
import { UtilPath } from '../../../base/utils/UtilPath';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import ModelMgr from '../../../manager/ModelMgr';
import { FamilyTrialRankType } from '../FamilyConst';

const { ccclass, property } = cc._decorator;

/** 世家副本-通关奖励 */
@ccclass
export class FamilyTrialRankItem extends cc.Component {
    @property(cc.Node)// 奖励节点
    private NdItemContainer: cc.Node = null;
    @property(cc.Node)// 奖励节点
    private NdRank: cc.Node = null;

    @property(cc.Label)
    private LabRank: cc.Label = null;
    @property(DynamicImage)// 排行榜
    private SprRank: DynamicImage = null;

    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabTime: cc.Label = null;
    @property(cc.Label)
    private LabTrial: cc.Label = null;

    @property(cc.Prefab)// 奖励预设
    private rewarditem: cc.Prefab = null;

    public setData(data: any, curIdx: number): void {
        this.NdRank.active = curIdx === FamilyTrialRankType.RANK;
        this.NdItemContainer.active = curIdx !== FamilyTrialRankType.RANK;

        let rank = 1;
        if (curIdx === FamilyTrialRankType.RANK) {
            // eslint-disable-next-line
            rank = data.Rank;
            // eslint-disable-next-line
            this.LabName.string = `S${data.AreaId}${i18n.tt(Lang.com_server)}`;// 服务器
            // eslint-disable-next-line
            this.LabTime.string = `${UtilTime.getTimeYMD(data.Time, '/')}`;
            // eslint-disable-next-line
            this.LabTrial.string = `${i18n.tt(Lang.family_passTo)}${data.TrialId}${i18n.tt(Lang.com_cen)}`;// `通关至${data.TrialId}层`;
        } else {
            const cfg: Cfg_TrialCopyRank = ModelMgr.I.FamilyModel.getCfgTrialCopyRankByIdx(data);
            rank = cfg.RankId;
            // 奖励情况
            const arr = UtilString.SplitToArray(cfg.Reward);
            this.NdItemContainer.destroyAllChildren();
            for (let i = 0; i < arr.length; i++) {
                const node: cc.Node = cc.instantiate(this.rewarditem);
                node.scale = 0.8;
                this.NdItemContainer.addChild(node);

                const itemId: number = Number(arr[i][0]);
                const itemNum: number = Number(arr[i][1]);
                const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);

                const itemIcon: ItemIcon = node.getComponent(ItemIcon);
                itemIcon.setData(itemModel, { needNum: true });
            }
        }

        // 排名
        // eslint-disable-next-line
        if (rank <= 3) {
            this.LabRank.node.active = false;
            this.SprRank.node.active = true;
            const rankPath = UtilPath.rankPath(rank);
            this.SprRank.loadImage(rankPath, 1, true);
        } else {
            this.LabRank.node.active = true;
            this.LabRank.string = `${rank}`;
            this.SprRank.node.active = false;
        }
    }
}
