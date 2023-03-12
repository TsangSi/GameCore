/*
 * @Author: myl
 * @Date: 2023-01-31 10:31:01
 * @Description:
 */

import { i18n, Lang } from '../../../../../../i18n/i18n';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilItemList from '../../../../../base/utils/UtilItemList';
import { EActiveStatus } from '../../../../../const/GameConst';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import { EWelfareState } from '../GeneralPassConst';
import { GeneralPassData, WelfareItemData } from '../GeneralPassModel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class WelfareItem extends cc.Component {
    @property(cc.Label)
    private LabItemName: cc.Label = null;
    @property(cc.Label)
    private LabItemNum: cc.Label = null;

    @property(cc.Node)
    private NdReward: cc.Node = null;
    /** 未达成 */
    @property(cc.Node)
    private BtnCantGet: cc.Node = null;
    /** 可领取 */
    @property(cc.Node)
    private BtnCanGet: cc.Node = null;
    /** 已领取 */
    @property(cc.Node)
    private BtnGeted: cc.Node = null;

    private _cycNo: number = 0;
    private _funcId: number = 0;

    private _data: WelfareItemData = null;
    protected start(): void {
        UtilGame.Click(this.BtnCanGet, () => {
            ControllerMgr.I.GeneralPassController.getAllServerReward(this._funcId, this._cycNo, this._data.cfg.Id);
        }, this);
        UtilGame.Click(this.BtnCantGet, () => {
            MsgToastMgr.Show(i18n.tt(Lang.general_welfare_unget));
        }, this);
    }

    public setData(data: WelfareItemData, idx: number, fId: number, cNo: number, passName: string): void {
        this._funcId = fId;
        this._cycNo = cNo;
        this._data = data;
        this.BtnCanGet.active = data.state === EWelfareState.CanActive;
        this.BtnCantGet.active = data.state === EWelfareState.UnActive;
        this.BtnGeted.active = data.state === EWelfareState.Active;
        UtilItemList.ShowItems(this.NdReward, data.cfg.Prize, { option: { needNum: true } });
        this.LabItemNum.string = `${data.cfg.Value}${i18n.tt(Lang.onhook_ci)}`;
        this.LabItemName.string = passName;
    }
}
