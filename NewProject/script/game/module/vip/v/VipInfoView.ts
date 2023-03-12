/*
 * @Author: myl
 * @Date: 2022-08-30 09:59:54
 * @Description:
 */
import { UtilGame } from '../../../base/utils/UtilGame';
import ControllerMgr from '../../../manager/ControllerMgr';
import { RechargeVip } from '../../recharge/v/RechargeVip';

const { ccclass, property } = cc._decorator;

@ccclass
export class VipInfoView extends RechargeVip {
    @property(cc.Node)
    private rechargeBtn: cc.Node = null;

    protected start(): void {
        UtilGame.Click(this.rechargeBtn, () => {
            ControllerMgr.I.RechargeController.linkOpen();
        }, this);
    }
}
