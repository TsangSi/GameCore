/*
 * @Author: myl
 * @Date: 2022-08-02 20:23:14
 * @Description:
 */
import { i18n, Lang } from '../../../../../i18n/i18n';
import { EBattleType } from '../../BattleResultConst';
import { BattleRewardExBase } from './BattleRewardExBase';

const { ccclass, property } = cc._decorator;
// 竞技场
@ccclass
export class BattleArenaEx extends BattleRewardExBase {
    /** 变化名次  第1行 */
    @property(cc.Node)
    private Nd2: cc.Node = null;
    @property(cc.Label)
    private LabHisChangeNum: cc.Label = null;
    /** 未变化节点 */
    @property(cc.Node)
    private NdHisUnchanged: cc.Node = null;
    @property(cc.Label)
    private LabHisRank: cc.Label = null;
    @property(cc.Label)
    private LabHisTitle: cc.Label = null;

    /** 变化名次 第2行 */
    @property(cc.Node)
    private Nd1: cc.Node = null;
    @property(cc.Label)
    private LabChangeNum: cc.Label = null;
    /** 未变化节点 */
    @property(cc.Node)
    private NdUnchanged: cc.Node = null;
    @property(cc.Label)
    private LabRank: cc.Label = null;
    @property(cc.Label)
    private LabTitle: cc.Label = null;

    /** 第3行 */
    @property(cc.Node)
    private Nd3: cc.Node = null;
    @property(cc.Label)
    private LabHisChangeNum3: cc.Label = null;
    /** 未变化节点 */
    @property(cc.Node)
    private NdHisUnchanged3: cc.Node = null;
    @property(cc.Label)
    private LabHisRank3: cc.Label = null;
    @property(cc.Label)
    private LabHisTitle3: cc.Label = null;

    /** 处理扩展内容赋值 */
    public setData(data: S2CPrizeReport): void {
        super.setData(data);
        switch (data.FBType) {
            case EBattleType.Arena: {
                this.Nd1.active = true;
                this.Nd2.active = true;
                this.Nd3.active = false;
                this.LabTitle.string = i18n.tt(Lang.arena_current_rank);
                this.LabHisTitle.string = i18n.tt(Lang.arena_history_highest_rank);
                const rankData = data.IntData;
                const hisRank = rankData[0] > 0 ? rankData[0] : 20000; // 历史最高
                const beforeRank = rankData[2] > 0 ? rankData[2] : 20000; // 挑战之前
                const afterRank = rankData[1] > 0 ? rankData[1] : 20000; // 挑战之后（当前）

                this.LabHisRank.string = `${hisRank < afterRank ? hisRank : afterRank}`;
                this.LabRank.string = `${afterRank}`;

                const rankRange = beforeRank - afterRank;
                if (rankRange <= 0) {
                    this.LabChangeNum.node.active = false;
                    this.NdUnchanged.active = true;
                } else {
                    this.LabChangeNum.string = `+${rankRange}   `;
                    this.LabChangeNum.node.active = true;
                    this.NdUnchanged.active = false;
                }

                /** 历史排名变化 当前排名-历史最高排名 */
                this.NdHisUnchanged.active = false;
                const hisRankRange = hisRank - afterRank;
                if (hisRankRange <= 0) {
                    this.LabHisChangeNum.node.active = false;
                } else {
                    this.LabHisChangeNum.node.active = true;
                    this.LabHisChangeNum.string = `+${hisRankRange}   `;
                }
            }

                break;
            case EBattleType.WorldBoss_PVE_DAYS:
                break;
            default:
                break;
        }
    }
}
