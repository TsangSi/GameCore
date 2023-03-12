/*
 * @Author: zs
 * @Date: 2022-11-19 18:30:49
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\general\plan\v\TeamPlanPreView.ts
 * @Description:
 *
 */
import { UtilGame } from '../../../../base/utils/UtilGame';
import WinBase from '../../../../com/win/WinBase';

const { ccclass, property } = cc._decorator;

@ccclass
export class TeamPlanPreView extends WinBase {
    @property(cc.Node)
    private BtnBlack: cc.Node = null;
    @property(cc.Node)
    private SprBlack: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnBlack, this.close, this);
        UtilGame.Click(this.SprBlack, this.close, this);
        UtilGame.Click(this.BtnClose, this.close, this);
    }
}
