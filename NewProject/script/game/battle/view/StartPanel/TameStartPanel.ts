/*
 * @Author: hrd
 * @Date: 2022-11-19 18:53:19
 * @Description:
 *
 */

import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';

const { ccclass, property } = cc._decorator;

@ccclass
export class TameStartPanel extends BaseCmp {
    @property(cc.Label)
    private LabDes: cc.Label = null;
    @property(cc.Node)
    private NdAnim: cc.Node = null;

    protected start(): void {
        super.start();
        this.scheduleOnce(this.autoClose, 1.4);
    }

    public setData(batchNum: number): void {
        // const char = UtilGame.num2char(batchNum);
        this.LabDes.string = UtilString.FormatArray(i18n.tt(Lang.battle_batch_info), [batchNum]);
        const anim = this.NdAnim.getComponent(cc.Animation);
        const clip = anim.getClips()[0];
        anim.play(clip.name);
    }

    private autoClose() {
        this.close();
    }
}
