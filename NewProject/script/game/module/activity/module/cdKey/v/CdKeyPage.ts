/*
 * @Author: lijun
 * @Date: 2023-02-16 15:37:39
 * @Description:
 */

import { EventClient } from '../../../../../../app/base/event/EventClient';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import { WinTabPage } from '../../../../../com/win/WinTabPage';
import { E } from '../../../../../const/EventName';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { ActData } from '../../../ActivityConst';
import { CdKeyResultType } from '../CdKeyConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CdKeyPage extends WinTabPage {
    // 输入框
    @property(cc.EditBox)
    private EBInput: cc.EditBox = null;
    // 按钮
    @property(cc.Node)
    private BtnGet: cc.Node = null;

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        EventClient.I.on(E.CdKey.Result, this.resultTips, this);

        this.uptUI();
        this.getData(tabId);

        UtilGame.Click(this.BtnGet, () => {
            const cdKey = this.EBInput.string;
            if (cdKey.trim().length === 0) {
                MsgToastMgr.Show(i18n.tt(Lang.cdKey_input_tip));
                return;
            }
            ControllerMgr.I.CdKeyController.GetCdKeyReward(this._actData.FuncId, this._actData.CycNo, cdKey);
        }, this);
    }

    private _actData: ActData = null;
    private getData(tabId: number) {
        this._actData = ModelMgr.I.ActivityModel.getActivityData(tabId);
    }

    /** 更新UI */
    private uptUI(): void {
        // const Btnlabel = this.BtnGet.getComponentInChildren(cc.Label);
        // Btnlabel.string = i18n.tt(Lang.cdkey_reward_tip);
    }

    private resultTips(result: S2CGetCDKeyReward): void {
        switch (result.Tag) {
            case CdKeyResultType.Success:
                // 成功
                console.log('领取成功');
                break;
            case CdKeyResultType.NonExistent:
                // 不存在
                MsgToastMgr.Show(i18n.tt(Lang.cdKey_non_existent_tip));
                break;
            case CdKeyResultType.BeOverdue:
                // 过期
                MsgToastMgr.Show(i18n.tt(Lang.cdKey_input_tip));
                break;
            case CdKeyResultType.Received:
                // 已领取
                MsgToastMgr.Show(i18n.tt(Lang.cdKey_received_tip));
                break;
            default:
                break;
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.CdKey.Result, this.resultTips, this);
    }
}
