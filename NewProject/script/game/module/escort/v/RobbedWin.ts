/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2023-01-16 20:50:54
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\v\RobbedWin.ts
 * @Description: 被劫界面
 *
 */

import WinMgr from '../../../../app/core/mvc/WinMgr';
import ListView from '../../../base/components/listview/ListView';
import { WinCmp } from '../../../com/win/WinCmp';
import { ViewConst } from '../../../const/ViewConst';
import RobbedItem from '../com/RobbedItem';
import ModelMgr from '../../../manager/ModelMgr';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';

const { ccclass, property } = cc._decorator;

@ccclass
export class RobbedWin extends WinCmp {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Label)
    private LabDesc: cc.Label = null;
    @property(cc.Node)
    private NdEmpty: cc.Node = null;

    private _record: EscortRobLog[] = [];

    protected start(): void {
        super.start();
        this.addE();
        this.uptUI();
    }

    private addE() {
        EventClient.I.on(E.Escort.RobbedRecord, this.uptRecord, this);
    }

    private remE() {
        EventClient.I.off(E.Escort.RobbedRecord, this.uptRecord, this);
    }

    public init(args: unknown[]): void {
        ControllerMgr.I.EscortController.reqEscortOpenRobLog();
    }

    private uptUI() {
        const maxRecord = ModelMgr.I.EscortModel.getCfgValue('RevengeTimes');
        this.LabDesc.string = UtilString.FormatArray(
            i18n.tt(Lang.escort_robbed_max),
            [maxRecord],
        );
        this.uptRecord();
    }

    private uptRecord() {
        this._record = ModelMgr.I.EscortModel.getRobbedLog();
        this._record.sort((a, b) => b.RobTime - a.RobTime);
        this.ListView.setNumItems(this._record.length);
        this.NdEmpty.active = this._record.length === 0;
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const item = node.getComponent(RobbedItem);
        if (item) {
            item.getComponent(RobbedItem).setData(this._record[idx]);
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.RobbedWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
