import BaseCmp from '../../../../../../app/core/mvc/view/BaseCmp';
import UtilItemList from '../../../../../base/utils/UtilItemList';

/*
 * @Author: zs
 * @Date: 2022-11-15 11:39:30
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\com\TeamRewardItem.ts
 * @Description:
 *
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class TeamRewardItem extends BaseCmp {
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Node)
    private NodeReward: cc.Node = null;
    public setData(name: string, rewardStr: string): void {
        this.LabelName.string = name;
        UtilItemList.ShowItems(this.NodeReward, rewardStr, { option: { needNum: true } });
    }
}
