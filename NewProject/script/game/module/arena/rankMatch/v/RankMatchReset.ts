/*
 * @Author: zs
 * @Date: 2023-01-16 10:46:25
 * @Description:
 *
 */
import { UtilGame } from '../../../../base/utils/UtilGame';
import WinBase from '../../../../com/win/WinBase';

const { ccclass, property } = cc._decorator;
@ccclass
export class RankMatchReset extends WinBase {
    @property(cc.Label)
    private LabelLastScore: cc.Label = null;
    @property(cc.Label)
    private LabelScore: cc.Label = null;

    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.NodeBlack, this.close, this);
    }

    public init(params: unknown[]): void {
        const lastScore = params[0] || 0;
        const curScore = params[1] || 0;
        this.LabelLastScore.string = `${lastScore}`;
        this.LabelScore.string = `${curScore}`;
    }
}
