/*
 * @Author: myl
 * @Date: 2022-11-24 10:27:54
 * @Description:
 */

import { i18n, Lang } from '../../../../i18n/i18n';
import { TabData } from '../../../com/tab/TabData';
import { WinTabPageView } from '../../../com/win/WinTabPageView';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';
import { FriendViewType } from '../FriendConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendPage extends WinTabPageView {
    public tabPages(): TabData[] {
        return [
            {
                id: FriendViewType.FriendList,
                uiPath: UI_PATH_ENUM.MyFriendView,
                title: i18n.tt(Lang.friend_list),
                redId: RID.More.Friend.MyFriend.Id,
            },
            {
                id: FriendViewType.FriendApplyList,
                uiPath: UI_PATH_ENUM.MyFriendApplyView,
                title: i18n.tt(Lang.friend_apply_list),
                redId: RID.More.Friend.ApplyFriend,
            },
        ];
    }

    // update (dt) {}
}
