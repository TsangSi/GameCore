/*
 * @Author: dcj
 * @Date: 2022-11-02 12:21:59
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\beaconWar\v\BeaconWarRePreWin.ts
 * @Description:
 */
import ListView from '../../../base/components/listview/ListView';
import { WinCmp } from '../../../com/win/WinCmp';
import ModelMgr from '../../../manager/ModelMgr';
import { BeaconWarModel } from '../BeaconWarModel';
import { BeaconWarRePreItem } from './BeaconWarRePreItem';

const { ccclass, property } = cc._decorator;
@ccclass
export class BeaconWarRePreWin extends WinCmp {
    @property(ListView)
    private list: ListView = null;

    protected start(): void {
        super.start();
    }

    private _M: BeaconWarModel = null;
    private _source: string[] = [];
    public init(winId: number, param: unknown): void {
        super.init(winId, param);
        this._M = ModelMgr.I.BeaconWarModel;
        this.upView();
    }

    private upView(): void {
        this._source = this._M.getReWardMsg();
        this.list.setNumItems(this._source.length);
    }

    private scrollEvent(nd: cc.Node, idx: number) {
        const item = nd.getComponent(BeaconWarRePreItem);
        item.setData(this._source, idx);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
