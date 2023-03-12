/*
 * @Author: myl
 * @Date: 2022-08-02 20:23:14
 * @Description:
 */
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { DynamicImage, ImageType } from '../../../../base/components/DynamicImage';
import Progress from '../../../../base/components/Progress';
import ModelMgr from '../../../../manager/ModelMgr';
import { EBattleType } from '../../BattleResultConst';
import { BattleRewardExBase } from './BattleRewardExBase';

const { ccclass, property } = cc._decorator;
@ccclass
export class BattleRankMatchEx extends BattleRewardExBase {
    @property(DynamicImage)
    private SpriteIcon: DynamicImage = null;
    @property(cc.Label)
    private LabelLevelName: cc.Label = null;
    @property(Progress)
    private Progress: Progress = null;
    @property(cc.Label)
    private LabelScore: cc.Label = null;
    @property(cc.Node)
    private NodeStars: cc.Node[] = [];
    /** 处理扩展内容赋值 */
    public setData(data: S2CPrizeReport): void {
        super.setData(data);
        console.log('data=', data);
        switch (data.FBType) {
            case EBattleType.RankMath:
                this.showRankMatch();
                break;
            default:
                break;
        }
    }

    private showRankMatch() {
        const nowScore = this._data.IntData[0];
        const oldScore = ModelMgr.I.RankMatchModel.lastScore;
        // this.updateRankMatch(oldScore);

        // this.scheduleOnce(() => {
        const addScore = nowScore - oldScore;
        if (addScore >= 0) {
            this.LabelScore.string = `+${addScore}`;
        } else {
            this.LabelScore.string = addScore.toString();
        }
        this.updateRankMatch(ModelMgr.I.RankMatchModel.score);
        // }, 0.5);
    }
    private updateRankMatch(score: number) {
        const cfgCur = ModelMgr.I.RankMatchModel.getCfgPos(score);
        const cfgNext = ModelMgr.I.RankMatchModel.getCfgPosNext(score);
        if (cfgNext) {
            this.Progress.updateProgress(score - cfgCur.GoalMin, cfgNext.GoalMin - cfgCur.GoalMin, false);
        } else {
            const cfgLast = ModelMgr.I.RankMatchModel.getCfgPosLast(score);
            this.Progress.updateProgress(score - cfgLast.GoalMin, cfgCur.GoalMin - cfgLast.GoalMin);
        }
        const star = ModelMgr.I.RankMatchModel.getStar(cfgCur.Id);
        this.NodeStars.forEach((n, index) => {
            // n.active = index < star;
            UtilCocos.SetSpriteGray(n, index >= star);
        });
        this.SpriteIcon.loadImage(`texture/rankMatch/icon_pws_dw_${UtilNum.FillZero(cfgCur.Icon, 2)}@ML`, ImageType.PNG, true);
        this.LabelLevelName.string = cfgCur.Name;
    }
}
