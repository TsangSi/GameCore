/*
 * @Author: myl
 * @Date: 2022-12-03 15:34:42
 * @Description:
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilHead from '../../../base/utils/UtilHead';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { MaxGiftNum } from '../FriendConst';

/*
 * @Author: myl
 * @Date: 2022-11-24 15:09:20
 * @Description:
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendItem extends cc.Component {
    @property(cc.Sprite)
    private SprHead: cc.Sprite = null;
    @property(cc.Sprite)
    private SprHeadFrame: cc.Sprite = null;

    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabState: cc.Label = null;
    @property(cc.Label)
    private LabLevel: cc.Label = null;
    @property(cc.Label)
    private LavFv: cc.Label = null;

    @property(cc.Node)
    private BtnChat: cc.Node = null;
    @property(cc.Node)
    private BtnDel: cc.Node = null;
    @property(cc.Node)
    private BtnGift: cc.Node = null;
    @property(cc.Node)
    private BtnGive: cc.Node = null;

    private _data: RelationPlayerData = null;

    protected start(): void {
        UtilGame.Click(this.BtnChat, () => {
            // 聊天 清除红点
            ModelMgr.I.FriendModel.clearCacheRed(this._data.UserId);
            WinMgr.I.open(ViewConst.FriendChatWin, this._data);
        }, this);
        UtilGame.Click(this.BtnDel, () => {
            // 删除
            ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.friend_del_tip), UtilColor.NorV), () => {
                ControllerMgr.I.FriendController.DelFriend(this._data.UserId);
            });
        }, this);
        UtilGame.Click(this.BtnGift, () => {
            // 收到礼物
            if (ModelMgr.I.FriendModel.giftNum >= MaxGiftNum) {
                MsgToastMgr.Show(i18n.tt(Lang.friend_max_gift_num));
            } else {
                ControllerMgr.I.FriendController.GetGift(this._data.UserId);
            }
        }, this);
        UtilGame.Click(this.BtnGive, () => {
            // 赠送礼物
            ControllerMgr.I.FriendController.GiveGift(this._data.UserId);
        }, this);
    }

    public setData(data: RelationPlayerData): void {
        this._data = data;
        this.LabName.string = data.Name;
        this.LavFv.string = UtilNum.ConvertFightValue(data.FightValue);
        this.LabLevel.string = `${i18n.tt(Lang.com_dengji)}：${data.Level}`;

        this.LabState.string = `(${data.Online === 1 ? i18n.tt(Lang.friend_online) : i18n.tt(Lang.friend_offline)})`;
        this.LabState.node.color = data.Online === 1 ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.NorV);
        UtilHead.setHead(data.Head, this.SprHead, data.HeadFrame, this.SprHeadFrame);

        UtilRedDot.UpdateRed(this.BtnChat, ModelMgr.I.FriendModel.getCacheRed(data.UserId), cc.v2(20, 20));

        UtilRedDot.UpdateRed(this.BtnGift, (data.Status & 2) === 2, cc.v2(20, 20));
        UtilColor.setGray(this.BtnGift, (data.Status & 4) === 4, true);
        UtilColor.setGray(this.BtnGive, (data.Status & 1) === 1, true);
    }
}
