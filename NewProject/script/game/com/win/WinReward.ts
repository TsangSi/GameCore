/*
 * @Author: myl
 * @Date: 2022-08-16 20:26:21
 * @Description:
 */
import { UtilGame } from '../../base/utils/UtilGame';
import UtilItemList from '../../base/utils/UtilItemList';
import UtilRedDot from '../../base/utils/UtilRedDot';
import { WinCmp } from './WinCmp';

const { ccclass, property } = cc._decorator;

@ccclass
export class WinReward extends WinCmp {
    @property(cc.Node)
    private contentNd: cc.Node = null;

    @property(cc.Node)
    private btnReward: cc.Node = null;

    @property(cc.Node)
    private cannotReward: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.btnReward, () => {
            if (this._cb) {
                this._cb();
                this._cb = null;
            }
            this.close();
        }, this, { unRepeat: true, time: 1000 });
    }
    private _cb: () => void = null;
    public init(param: any[]): void {
        if (!param[0]) {
            this.close();
        }
        if (param) { UtilItemList.ShowItems(this.contentNd, param[0], { option: { needNum: true, needName: true } }); }
        const cb = param[1];
        if (cb) {
            this._cb = cb;
        }
        if (param[2]) {
            this.resetTitle(param[2]);
        }
        if (param[3] && Boolean(param[3])) {
            this.cannotReward.active = true;
        } else {
            this.cannotReward.active = false;
        }
        this.btnReward.active = !this.cannotReward.active;
        if (this.btnReward.active) {
            UtilRedDot.UpdateRed(this.btnReward, true, cc.v2(80, 27));
        }
    }
}
