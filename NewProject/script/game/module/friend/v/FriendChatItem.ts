/*
 * @Author: myl
 * @Date: 2022-11-29 21:55:42
 * @Description:
 */

import { IRichTransform, UtilRichString } from '../../../../app/base/utils/UtilRichString';
import { UtilString } from '../../../../app/base/utils/UtilString';
import UtilHead from '../../../base/utils/UtilHead';
import { RoleMgr } from '../../role/RoleMgr';
import { FriendChatModel } from '../FriendConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendChatItem extends cc.Component {
    @property(cc.Label)
    private LabNickFriend: cc.Label = null;
    @property(cc.Label)
    private LabContentFriend: cc.Label = null;

    @property(cc.Label)
    private LabNickMe: cc.Label = null;
    @property(cc.Label)
    private LabContentMe: cc.Label = null;

    @property(cc.Node)
    private NdOnline: cc.Node = null;
    @property(cc.Node)
    private NdOffline: cc.Node = null;

    @property(cc.Node)
    private NdFriend: cc.Node = null;
    @property(cc.Node)
    private NdMe: cc.Node = null;

    @property(cc.Sprite)
    private SprFriend: cc.Sprite = null;
    @property(cc.Sprite)
    private SrpFrameFriend: cc.Sprite = null;

    @property(cc.Sprite)
    private SprMe: cc.Sprite = null;
    @property(cc.Sprite)
    private SrpFrameMe: cc.Sprite = null;

    @property(cc.Node)
    private PaoMe: cc.Node = null;
    @property(cc.Node)
    private PaoFriend: cc.Node = null;

    private _data: FriendChatModel = null;

    public setData(data: FriendChatModel): void {
        this._data = data;
        if (data.data.SendUserId === RoleMgr.I.d.UserId) {
            this.NdFriend.active = false;
            this.NdMe.active = true;
            this.LabNickMe.string = RoleMgr.I.d.Nick;
            this.LabContentMe.string = data.data.Content;
            const conf: IRichTransform = {
                fSize: 18,
                maxWidth: data.data.Content.length < 20 ? 0 : 360,
                lineHeight: 20,
                richString: data.data.Content,
            };
            const textSize = UtilRichString.NormalRichStringSize(conf);
            // console.log(textSize.width, textSize.height, '------计算出的高度和宽度111------');
            this.PaoMe.width = textSize.width + 35;
            this.PaoMe.height = textSize.height + 25;
            this.LabContentMe.node.getComponent(cc.Widget)?.updateAlignment();
            UtilHead.setHead(RoleMgr.I.d.HeadIcon, this.SprMe, RoleMgr.I.d.HeadFrame, this.SrpFrameMe);
        } else {
            this.NdMe.active = false;
            this.NdFriend.active = true;
            this.LabNickFriend.string = data.info.Name;
            this.LabContentFriend.string = data.data.Content;
            const conf: IRichTransform = {
                fSize: 18,
                maxWidth: data.data.Content.length < 20 ? 0 : 360,
                lineHeight: 20,
                richString: data.data.Content,
            };
            // console.log(textSize.width, textSize.height, '------计算出的高度和宽度------');
            const textSize = UtilRichString.NormalRichStringSize(conf);
            this.PaoFriend.width = textSize.width + 35;
            this.PaoFriend.height = textSize.height + 25;
            this.LabContentFriend.node.getComponent(cc.Widget)?.updateAlignment();
            UtilHead.setHead(data.info.Head, this.SprFriend, data.info.HeadFrame, this.SrpFrameFriend);
            this.NdOnline.active = data.info.Online === 1;
            this.NdOffline.active = data.info.Online !== 1;
        }
    }
}
