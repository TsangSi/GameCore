/*
 * @Author: zs
 * @Date: 2023-01-10 18:21:09
 * @Description:
 *
 */
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import ModelMgr from '../../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;
@ccclass
export class RankMatchAwardBottomSegme extends BaseCmp {
    @property(cc.Label)
    private LabelLevelName: cc.Label = null;
    @property(cc.Label)
    private LabelScore: cc.Label = null;

    protected start(): void {
        super.start();
        this.LabelLevelName.string = ModelMgr.I.RankMatchModel.getCfgPos().Name;
        this.LabelScore.string = `${ModelMgr.I.RankMatchModel.score}`;
    }
}
