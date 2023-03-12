/*
 * @Author: myl
 * @Date: 2023-02-08 18:33:52
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { TabPagesView } from '../../../com/win/WinTabPageView';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RID } from '../../reddot/RedDotConst';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { ResRecoveryType } from '../DailyTaskConst';
import FuncRecoveryItem from './FuncRecoveryItem';
import ResRecoveryItem from './ResRecoveryItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResRecoveryView extends TabPagesView {
    @property(ListView)
    private list: ListView = null;
    @property(ListView)
    private list1: ListView = null;

    @property(cc.Node)
    private NdNull: cc.Node = null;

    @property(cc.Node)
    private BtnAuto: cc.Node = null;

    @property(cc.RichText)
    private RichHalfTip: cc.RichText = null;

    @property(DynamicImage)
    private BgSpr: DynamicImage = null;

    private _idx: number = 0;
    protected updateUI(idx: number): void {
        this._idx = idx;
        this.reqData();
    }

    private _limitInfo: { tip: string, state: boolean } = null;
    public init(idx: number): void {
        this._idx = idx;

        UtilGame.Click(this.BtnAuto, () => {
            const costStr = ModelMgr.I.DailyTaskModel.getTotalCost(this._listData, this._limitInfo.state);
            WinMgr.I.open(ViewConst.ResRecoveryBuyWin, 0, costStr, () => {
                ControllerMgr.I.DailyTaskController.gerAllResReward(this._idx);
            });
        }, this);

        this._limitInfo = ModelMgr.I.DailyTaskModel.resCostHalf();
        this.RichHalfTip.string = UtilString.FormatArray(i18n.tt(Lang.res_recovery_half_tip), [UtilColor.RedV, this._limitInfo.tip]);
        EventClient.I.on(E.DailyTask.ResData, this.updateList, this);
        EventClient.I.on(E.DailyTask.ResReward, this.reqData, this);
        UtilRedDot.Bind(RID.DailyTask.ResRecovery.Res, this.BtnAuto, cc.v2(85, 30));
        // 监听vip变化
        RoleMgr.I.on(this.vipChange, this, RoleAN.N.VipLevel);

        this.reqData();
    }

    private vipChange() {
        this.reqData();
    }

    private reqData() {
        this.RichHalfTip.node.active = this._idx === ResRecoveryType.Res;
        this.BgSpr.loadImage(`texture/com/bg/${this._idx === ResRecoveryType.Res ? 'bg_mrrw_ba_zyzh@ML' : 'bg_mrrw_ba_wfzh@ML'}`, 1, true);
        ControllerMgr.I.DailyTaskController.getResList(this._idx);
    }

    public scrollEvent(nd: cc.Node, index: number): void {
        if (this._idx === ResRecoveryType.Res) {
            const ndComp = nd.getComponent(ResRecoveryItem);
            ndComp.setData(this._listData[index], this._limitInfo.state);
        } else {
            const ndComp = nd.getComponent(FuncRecoveryItem);
            ndComp.setData(this._listData[index]);
        }
    }

    private _listData: { cfg: Cfg_Resource, data: ResRecoveredReward }[] = [];
    private updateList() {
        this._listData = ModelMgr.I.DailyTaskModel.getResListData(this._idx);
        if (this._listData.length <= 0) {
            this.list.node.active = false;
            this.list1.node.active = false;
            this.NdNull.active = true;
        } else {
            this.NdNull.active = false;
            if (this._idx === ResRecoveryType.Res) {
                this.list.setNumItems(this._listData.length);
                this.list.node.active = true;
                this.list1.node.active = false;
                this.BtnAuto.active = true;
            } else {
                this.BtnAuto.active = false;
                this.list.node.active = false;
                this.list1.node.active = true;
                this.list1.setNumItems(this._listData.length);
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.DailyTask.ResData, this.updateList, this);
        EventClient.I.off(E.DailyTask.ResReward, this.reqData, this);
        RoleMgr.I.off(this.vipChange, this, RoleAN.N.VipLevel);
    }
}
