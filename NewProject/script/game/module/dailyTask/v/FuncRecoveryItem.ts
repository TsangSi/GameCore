/*
 * @Author: myl
 * @Date: 2023-02-08 18:42:58
 * @Description:
 */

import { UtilGame } from '../../../base/utils/UtilGame';
import { Link } from '../../link/Link';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FuncRecoveryItem extends cc.Component {
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabTip: cc.Label = null;
    @property(cc.Node)
    private BtnGet: cc.Node = null;

    private _data: { cfg: Cfg_Resource, data: ResRecoveredReward } = null;
    public setData(d: { cfg: Cfg_Resource, data: ResRecoveredReward }): void {
        this._data = d;
        this.LabName.string = d.cfg.Des;
        this.LabTip.string = d.cfg.Des1 || '';
    }

    protected start(): void {
        UtilGame.Click(this.BtnGet, () => {
            Link.To(this._data.cfg.FuncId);
        }, this);
    }
}
