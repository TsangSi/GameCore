/*
 * @Author: myl
 * @Date: 2022-11-24 10:29:21
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import { TabPagesView } from '../../../com/win/WinTabPageView';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { FriendViewType } from '../FriendConst';
import FriendApplyItem from './FriendApplyItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MyFriendApplyView extends TabPagesView {
    @property(cc.Node)
    private BtnAdd: cc.Node = null;
    @property(ListView)
    private list: ListView = null;
    @property(cc.Label)
    private LabFriendNum: cc.Label = null;

    private _listData: RelationPlayerData[] = [];

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnAdd, () => {
            WinMgr.I.open(ViewConst.FriendAddWin);
        }, this);
    }

    protected updateUI(...parma): void {
        ControllerMgr.I.FriendController.GetFriendList(FriendViewType.FriendApplyList);
    }

    public init(...param: unknown[]): void {
        EventClient.I.on(E.Friend.List, this.updateList, this);
        ControllerMgr.I.FriendController.GetFriendList(FriendViewType.FriendApplyList);
    }

    private updateList(tp: FriendViewType): void {
        if (tp === FriendViewType.FriendList) return;
        this._listData = ModelMgr.I.FriendModel.getFriendList(FriendViewType.FriendApplyList);
        this.list.setNumItems(this._listData.length);
        const friends = ModelMgr.I.FriendModel.getFriendList(FriendViewType.FriendList);
        this.LabFriendNum.string = `${friends.length}/100`;
    }

    private scrollEvent(nd: cc.Node, index: number): void {
        const item = nd.getComponent(FriendApplyItem);
        item.setData(this._listData[index]);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Friend.List, this.updateList, this);
    }
}
