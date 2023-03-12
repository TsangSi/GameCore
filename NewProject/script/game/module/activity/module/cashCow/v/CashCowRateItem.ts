/*
 * @Author: myl
 * @Date: 2022-12-26 10:16:44
 * @Description:
 */

import { i18n, Lang } from '../../../../../../i18n/i18n';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashCowRateItem extends cc.Component {
    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.Label)
    private LabValue: cc.Label = null;

    @property(cc.Node)
    private BgNd: cc.Node = null;

    public setData(cfg: string, index: number): void {
        const cfgs = cfg.split(':');

        this.LabName.string = `${cfgs[0]}${i18n.tt(Lang.cashCow_rate_tip)}`;
        this.LabValue.string = `${Number(cfgs[1]) / 100}%`;
        this.BgNd.active = index % 2 === 0;
    }
}
