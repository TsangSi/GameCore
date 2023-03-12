/*
 * @Author: myl
 * @Date: 2022-12-12 11:30:27
 * @Description:
 */

import { UtilGame } from '../../game/base/utils/UtilGame';
import WinBase from '../../game/com/win/WinBase';
import { i18n, Lang } from '../../i18n/i18n';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameWelcomeWin extends WinBase {
    @property(cc.Node)
    private NdBottom: cc.Node = null;

    @property(cc.Label)
    private timeLab: cc.Label = null;
    @property(cc.Node)
    private NdClickClose: cc.Node = null;

    private Time = 15;
    private readonly ShowTime = 10;
    protected start(): void {
        super.start();
        // const tipString = i18n.tt(Lang.welcome_tip);
        // const tipLength = tipString.length;
        // this.labContent.string = tipString;
        // let pos = 0;
        // this.schedule(() => {
        //     pos++;
        //     this.labContent.string = tipString.slice(0, pos);
        //     // this.Time--;
        //     // this.timeLab.string = ``;
        // }, 0.1, tipLength);

        this.schedule(() => {
            this.Time--;
            this.timeLab.string = `(${this.Time})${i18n.tt(Lang.com_second)}`;
            this.NdBottom.active = this.Time <= this.ShowTime;
            if (this.Time <= 0) {
                this.close();
            }
        }, 1, this.Time);

        UtilGame.Click(this.NdClickClose, () => {
            if (this.timeLab.node.active) {
                this.close();
            } else {
                this.Time = this.ShowTime;
            }
        }, this, { scale: 1 });

        UtilGame.Click(this.node, () => {
            this.Time = this.ShowTime;
        }, this, { scale: 1 });
    }
}
