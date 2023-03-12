/*
 * @Author: myl
 * @Date: 2022-10-18 21:35:37
 * @Description:
 */

import { UtilNum } from '../../../../../app/base/utils/UtilNum';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletProgress extends cc.ProgressBar {
    @property(cc.Label)
    private tipLabe: cc.Label = null;

    public updateProgress(cur: number, total: number): void {
        this.tipLabe.string = `${UtilNum.Convert(cur)}/${total}`;
        let curProgress = 0;
        if (total <= 0) {
            this.progress = 1;
            total = 0;
            curProgress = 1;
        } else {
            curProgress = cur / total;
        }
        if (this.progress < curProgress) {
            this.progressAnimation(curProgress);
        } else {
            this.progressAnimation1(curProgress);
        }
    }

    private progressAnimation(newP: number) {
        this.progress = newP;
    }

    private progressAnimation1(newP: number) {
        this.progress = newP;
    }
}
