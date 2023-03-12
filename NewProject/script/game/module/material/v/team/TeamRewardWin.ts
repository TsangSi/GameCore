/*
 * @Author: zs
 * @Date: 2022-11-18 16:52:11
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\TeamRewardWin.ts
 * @Description:
 *
 */
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../../i18n/i18n';
import ListView from '../../../../base/components/listview/ListView';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import WinBase from '../../../../com/win/WinBase';
import ModelMgr from '../../../../manager/ModelMgr';
import { TeamModel } from '../../../team/TeamModel';
import { TeamRewardItem } from './com/TeamRewardItem';

const { ccclass, property } = cc._decorator;
@ccclass
export class TeamRewardWin extends WinBase {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Label)
    private LabelNum: cc.Label = null;
    @property(cc.Label)
    private LabelLevelName: cc.Label = null;
    @property(cc.Node)
    private NodeHelpReward: cc.Node = null;
    @property(cc.Node)
    private SprBlack: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.SprBlack, this.close, this);
        UtilGame.Click(this.BtnClose, this.close, this);
    }

    private showIndexs: number[] = [];
    public init(params: any[]): void {
        const fbType: number = params[0];
        const fbId: number = params[1];
        const model: TeamModel = ModelMgr.I.TeamModel;
        const indexs = model.cfg.getValueByKeyFromMonster(fbId);
        this.showIndexs = indexs;
        this.ListView.setNumItems(indexs.length);

        const cfgTM: Cfg_TeamBoss = model.cfg.getValueByKey(fbType);
        const cfgTMLevel: Cfg_TeamBoss_Level = model.cfg.getValueByKeyFromLevel(fbId);
        UtilItemList.ShowItems(this.NodeHelpReward, cfgTM.HelpReward, { option: { needNum: true } });
        this.LabelLevelName.string = UtilString.FormatArgs(i18n.tt(Lang.team_reward_win_level_name), cfgTMLevel.LevelLimit);
        this.LabelNum.string = `${model.getHelpPassTime(fbType)}/${cfgTM.HelpNO}`;
    }

    private onRenderItem(node: cc.Node, index: number) {
        const cfg: Cfg_TeamBoss_Monster = ModelMgr.I.TeamModel.cfg.getValueFromMonster(this.showIndexs[index]);
        if (cfg) {
            // eslint-disable-next-line max-len
            node.getComponent(TeamRewardItem).setData(UtilString.FormatArgs(i18n.tt(Lang.team_reward_win_level_item_desc), cfg.Level), cfg.ShowReward);
        }
    }
}
