/*
 * @Author: myl
 * @Date: 2023-01-31 10:15:57
 * @Description:
 */

import { EventClient } from '../../../../../../app/base/event/EventClient';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import ListView from '../../../../../base/components/listview/ListView';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import WinBase from '../../../../../com/win/WinBase';
import { E } from '../../../../../const/EventName';
import ModelMgr from '../../../../../manager/ModelMgr';
import { ActData } from '../../../ActivityConst';
import { WelfareItemData } from '../GeneralPassModel';
import WelfareItem from './WelfareItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class WelfareWin extends WinBase {
    @property(DynamicImage)
    private topSpr: DynamicImage = null;

    @property(ListView)
    private list: ListView = null;

    @property(cc.Label)
    private LabByuNum: cc.Label = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    private _actData: ActData = null;
    private _passCfg: Cfg_Server_GeneralPass = null;

    private _listData: WelfareItemData[] = [];

    public init(d: (ActData | Cfg_Server_GeneralPass)[]): void {
        if (d && d[0]) {
            this._actData = d[0] as ActData;
        }
        if (d && d[1]) {
            this._passCfg = d[1] as Cfg_Server_GeneralPass;
        }
        this.addEventListener();
        this.refreshUI(this._actData);
    }

    private addEventListener() {
        EventClient.I.on(E.GeneralPass.WelfareData, this.refreshUI, this);
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.BtnClose, () => this.close(), this, { scale: 0.9 });
    }

    private refreshUI(d: ActData | S2CGetAllServerReward) {
        if (d.CycNo !== this._actData.CycNo || d.FuncId !== this._actData.FuncId) return;
        const model = ModelMgr.I.GeneralPassModel;
        this._listData = model.getWelfareListData(this._actData.CycNo, this._actData.FuncId, this._actData.Config.ArgsGroup);
        this.list.setNumItems(this._listData.length);
        const userData = model.getUserData(this._actData.FuncId, this._actData.CycNo);
        this.LabByuNum.string = userData.data.ChargeNum.toString();
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.GeneralPass.WelfareData, this.refreshUI, this);
    }

    private scrollEvent(nd: cc.Node, idx: number) {
        const itemComp = nd.getComponent(WelfareItem);
        itemComp.setData(this._listData[idx], idx, this._actData.FuncId, this._actData.CycNo, this._passCfg.GoodName);
    }
}
