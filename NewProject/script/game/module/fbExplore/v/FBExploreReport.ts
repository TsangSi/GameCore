/*
 * @Author: zs
 * @Date: 2023-02-07 22:10:17
 * @Description:
 *
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItemList from '../../../base/utils/UtilItemList';
import { WinCmp } from '../../../com/win/WinCmp';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { EFBExploreType } from '../FBExploreConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FBExploreReport extends WinCmp {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Node)
    private BtnComplete: cc.Node = null;

    private time = 0.3;
    /** 最大关卡数 */
    private maxStageId: number = 0;
    /** 探险类型 */
    private exploreType: EFBExploreType = 0;
    /** 起始关卡id */
    private curStage: number = 0;
    /** 需要显示的关卡奖励 */
    private cfgStages: Cfg_FB_ExploreGem[] = [];
    public init(param: any[]): void {
        this.exploreType = param[0];
        this.curStage = param[1];
        this.maxStageId = param[2];
        this.schedule(this.onFightNextStage, this.time);
    }

    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnComplete, this.onBtnComplete, this);
    }
    private onFightNextStage() {
        const stage = this.getNextStage();
        if (stage) {
            const cfg = ModelMgr.I.FBExploreModel.getCfg(this.exploreType, stage);
            this.cfgStages.push(cfg);
            this.ListView.setNumItems(this.cfgStages.length, this.cfgStages.length - 1);
        }
    }

    private getNextStage() {
        const stage = this.curStage + 1;
        if (stage > this.maxStageId) {
            // 到最后了
            this.unschedule(this.onFightNextStage);
            this.sendGetPrize();
            return undefined;
        }
        this.curStage = stage;
        return stage;
    }

    private onRenderItem(node: cc.Node, index: number) {
        const cfg = this.cfgStages[index];
        const str = UtilString.FormatArgs(i18n.tt(Lang.fbexplore_report_item_label), UtilNum.ToChinese(cfg.Part), cfg.Stage);
        UtilCocos.SetString(node, 'LabelName', str);
        UtilItemList.ShowItems(node.getChildByName('NodeItems'), cfg.StagePrize, { option: { needNum: true } });
    }

    private isSend: boolean = false;
    private sendGetPrize() {
        if (this.isSend) {
            return;
        }
        this.isSend = true;
        ControllerMgr.I.BattleResultController.reqC2SGetBattlePrize();
    }

    private onBtnComplete() {
        this.close();
    }
    protected onDestroy(): void {
        this.sendGetPrize();
    }
}
