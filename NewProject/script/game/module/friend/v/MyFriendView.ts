/*
 * @Author: myl
 * @Date: 2022-11-24 10:29:35
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
import { FriendViewType, MaxGiftNum } from '../FriendConst';
import FriendItem from './FriendItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MyFriendView extends TabPagesView {
    @property(cc.Node)
    private BtnAdd: cc.Node = null;
    @property(ListView)
    private list: ListView = null;
    @property(cc.Label)
    private LabFriendNum: cc.Label = null;
    @property(cc.Label)
    private LabGiftNum: cc.Label = null;

    private _listData: RelationPlayerData[] = [];

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnAdd, () => {
            WinMgr.I.open(ViewConst.FriendAddWin);
        }, this);
    }

    protected updateUI(...agrs: any[]): void {
        ControllerMgr.I.FriendController.GetFriendList(FriendViewType.FriendList);
    }

    public init(...param: unknown[]): void {
        super.init(param);
        EventClient.I.on(E.Friend.List, this.updateList, this);
        EventClient.I.on(E.Friend.ChatRed, this.updateList, this);
        ControllerMgr.I.FriendController.GetFriendList(FriendViewType.FriendList);
    }

    private updateList(tp: FriendViewType): void {
        if (tp === FriendViewType.FriendApplyList) return;
        const model = ModelMgr.I.FriendModel;
        this._listData = model.getFriendList(FriendViewType.FriendList);
        this._listData.sort((b, a) => a.Online - b.Online);
        this.list.setNumItems(this._listData.length);
        this.LabFriendNum.string = `${this._listData.length}/100`;
        this.LabGiftNum.string = `${model.giftNum}/${MaxGiftNum}`;
    }

    private scrollEvent(nd: cc.Node, index: number): void {
        const item = nd.getComponent(FriendItem);
        item.setData(this._listData[index]);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Friend.List, this.updateList, this);
        EventClient.I.off(E.Friend.ChatRed, this.updateList, this);
    }
}
