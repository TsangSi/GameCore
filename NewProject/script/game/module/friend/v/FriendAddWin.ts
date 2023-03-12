/*
 * @Author: myl
 * @Date: 2022-11-24 10:23:14
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { FriendViewType } from '../FriendConst';
import FriendAddItem from './FriendAddItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendAddWin extends WinBase {
    @property(cc.EditBox)
    private EdBox: cc.EditBox = null;
    @property(cc.Node)
    private BtnSearch: cc.Node = null;
    @property(cc.Node)
    private BtnRefresh: cc.Node = null;
    @property(ListView)
    private list: ListView = null;

    @property(cc.Label)
    private LabFriendNum: cc.Label = null;
    @property(cc.Label)
    private LabSearchTip: cc.Label = null;

    @property(cc.Node)
    private NdNullSearch: cc.Node = null;

    private _listData: RelationPlayerData[] = [];

    public init(...param: unknown[]): void {
        UtilGame.Click(this.BtnSearch, () => {
            // 查找
            if (this.EdBox.string.length <= 0) {
                ControllerMgr.I.FriendController.recommendList();
            } else {
                ControllerMgr.I.FriendController.searchFriend(this.EdBox.string);
            }
            this.LabSearchTip.string = i18n.tt(Lang.friend_search);
        }, this);

        UtilGame.Click(this.BtnRefresh, () => {
            if (this.EdBox.string.length <= 0) {
                ControllerMgr.I.FriendController.recommendList();
            } else {
                ControllerMgr.I.FriendController.searchFriend(this.EdBox.string);
            }
        }, this);

        UtilGame.Click(this.node, () => {
            this.close();
        }, this, { scale: 1 });

        EventClient.I.on(E.Friend.Find, this.updateListFind, this);
        EventClient.I.on(E.Friend.RecommendList, this.updateListRecommend, this);
        ControllerMgr.I.FriendController.recommendList();
        const friends = ModelMgr.I.FriendModel.getFriendList(FriendViewType.FriendList);
        this.LabFriendNum.string = `${friends.length}/100`;
    }

    private scrollEvent(nd: cc.Node, index: number): void {
        const item = nd.getComponent(FriendAddItem);
        item.setData(this._listData[index]);
    }

    private updateListFind(): void {
        this._listData = ModelMgr.I.FriendModel.findList;
        this.list.setNumItems(this._listData.length);
        this.NdNullSearch.active = this._listData.length === 0;
    }

    private updateListRecommend(): void {
        this._listData = ModelMgr.I.FriendModel.recommendList;
        this.list.setNumItems(this._listData.length);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Friend.Find, this.updateListFind, this);
        EventClient.I.off(E.Friend.RecommendList, this.updateListRecommend, this);
    }
}
