/*
 * @Author: kexd
 * @Date: 2022-10-26 17:22:18
 * @FilePath: \SanGuo2.4\assets\script\game\module\arena\v\ArenaRewardView.ts
 * @Description:
 *
 */
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArenaRewardView extends BaseUiView {
    @property(cc.Node)
    private ndBg: cc.Node = null;

    @property(cc.Node)
    private SprTitleTypeSuc: cc.Node = null;
    @property(cc.Node)
    private SprTitleTypeFail: cc.Node = null;
    @property(cc.Node)
    private SprTitleTypeMaxFail: cc.Node = null;
    @property(cc.Node)
    private SprTitleTypeSweep: cc.Node = null;
    @property(cc.Node)
    private NdMaxFail: cc.Node = null;

    /** 变化名次 */
    @property(cc.Label)
    private LabChangeNum: cc.Label = null;
    /** 未变化节点 */
    @property(cc.Label)
    private NdUnchanged: cc.Node = null;
    @property(cc.Label)
    private LabRank: cc.Label = null;

    /** 变化名次 */
    @property(cc.Label)
    private LabHisChangeNum: cc.Label = null;
    /** 未变化节点 */
    @property(cc.Label)
    private NdHisUnchanged: cc.Node = null;
    @property(cc.Label)
    private LabHisRank: cc.Label = null;

    /** 奖励物品节点 */
    @property(cc.Node)
    private NdContent: cc.Node = null;

    /** 关闭 */
    @property(cc.Node)
    private NdClose: cc.Node = null;
    @property(cc.Label)
    private LabClose: cc.Label = null;

    private _timer: any;
    // private _type: BattleResultType = BattleResultType.Win;
    public init(param: number[]): void {
        this.setUpView();
    }

    public start(): void {
        super.start();
        UtilGame.Click(this.ndBg, () => {
            this.close();
        }, this, { scale: 1 });

        UtilGame.Click(this.NdClose, () => {
            this.close();
        }, this);

        if (!this._timer) {
            let cd = 5;
            this._timer = this.setInterval(() => {
                cd--;
                this.LabClose.string = `${i18n.tt(Lang.arena_reward_tip)}(${cd}${i18n.tt(Lang.com_second)})`;
                if (cd < 0) {
                    this.close();
                }
            }, 1000);
        }
    }

    private setUpView() {
        // const type = this._type;

        // 根据掉落配置读取相应的道具信息 模拟奖励数据
        // const rewards = ModelMgr.I.ArenaModel.arenaResult(this._type, {
        //     // 排名从700->500 最高历史排名从 500->300
        //     rankS: 400, rankE: 200, historyHeighRank: 300, newHeighRank: 200,
        // });
        // UtilItemList.ShowItemArr(this.NdContent, rewards, { option: { needNum: true, needName: true } });
    }

    public onDestroy(): void {
        super.onDestroy();
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }
    }
}
