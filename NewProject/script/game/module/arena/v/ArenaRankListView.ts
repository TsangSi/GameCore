/*
 * @Author: myl
 * @Date: 2022-08-01 17:51:56
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { ArenaRankListItem } from './ArenaRankListItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArenaRankListView extends BaseUiView {
    @property(cc.Node)
    private NdBg: cc.Node = null;

    @property(ListView)
    private list: ListView = null;

    @property(cc.Label)
    private LabSelf: cc.Label = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    private _dataSource: any[] = [];
    public start(): void {
        super.start();

        UtilGame.Click(this.NdBg, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.BtnClose, this.close, this);

        // 请求排行榜数据
        EventClient.I.on(E.Arena.RankList, this.uptUI, this);
        ControllerMgr.I.ArenaController.getRankList();
    }

    public init(): void {
        //
    }

    private uptUI(any) {
        this._dataSource = ModelMgr.I.ArenaModel.rankListData;
        this.list.setNumItems(this._dataSource.length, 0);
        this.LabSelf.string = `${RoleMgr.I.Rank}`;
    }

    private scrollEvent(node: cc.Node, index: number) {
        const item: ArenaRankListItem = node.getComponent(ArenaRankListItem);
        item.setData(this._dataSource[index], index);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Arena.RankList, this.uptUI, this);
    }
}
