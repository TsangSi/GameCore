/*
 * @Author: lijun
 * @Date: 2023-02-22 11:21:02
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import HuarongdaoRecordItem from '../com/HuarongdaoRecordItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoRecord extends WinCmp {
    @property(ListView)
    private ListRecord: ListView = null;

    private cycNoArray: Array<number>;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected start(): void {
        super.start();
    }

    public init(...param: unknown[]): void {
        this.addE();
        ControllerMgr.I.HuarongdaoController.reqC2SHuarongBetLog();
    }

    protected addE(): void {
        EventClient.I.on(E.Huarongdao.SupportLog, this.updateList, this);
    }

    protected remE(): void {
        EventClient.I.off(E.Huarongdao.SupportLog, this.updateList, this);
    }

    private updateList(): void {
        this.cycNoArray = ModelMgr.I.HuarongdaoModel.getActivityLogCycNo();
        this.ListRecord.setNumItems(4);
    }

    private onRenderList(nd: cc.Node, index: number): void {
        const item = nd.getComponent(HuarongdaoRecordItem);
        item.setData(index, this.cycNoArray[index] || null);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
    // update (dt) {}
}
