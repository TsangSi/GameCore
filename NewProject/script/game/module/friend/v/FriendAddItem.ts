import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilHead from '../../../base/utils/UtilHead';
import ControllerMgr from '../../../manager/ControllerMgr';

/*
 * @Author: myl
 * @Date: 2022-11-24 20:57:04
 * @Description:
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendAddItem extends cc.Component {
    @property(cc.Sprite)
    private SprHead: cc.Sprite = null;
    @property(cc.Sprite)
    private SprHeadFrame: cc.Sprite = null;

    @property(cc.Label)
    private LabName: cc.Label = null;
    // @property(cc.Label)
    // private LabState: cc.Label = null;
    @property(cc.Label)
    private LabLevel: cc.Label = null;
    @property(cc.Label)
    private LavFv: cc.Label = null;
    @property(cc.Node)
    private NdName: cc.Node = null;

    @property(cc.Node)
    private BtnAddFriend: cc.Node = null;

    private _data: RelationPlayerData = null;
    public setData(data: RelationPlayerData): void {
        this._data = data;
        this.LabName.string = data.Name;
        this.LavFv.string = UtilNum.ConvertFightValue(data.FightValue);
        this.LabLevel.string = `${i18n.tt(Lang.com_dengji)}：${data.Level}`;
        // this.LabState.node.active = false;
        // this.NdName.getComponent(cc.Layout).updateLayout();
        UtilHead.setHead(data.Head, this.SprHead, data.HeadFrame, this.SprHeadFrame);
        // this.LabState.string = `(${data.Online === 1 ? i18n.tt(Lang.friend_online) : i18n.tt(Lang.friend_offline)})`;
        // this.LabState.node.color = data.Online === 1 ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.NorV);
    }

    protected start(): void {
        UtilGame.Click(this.BtnAddFriend, () => {
            // 添加好友
            ControllerMgr.I.FriendController.addApply(this._data.UserId);
        }, this);
    }
}
