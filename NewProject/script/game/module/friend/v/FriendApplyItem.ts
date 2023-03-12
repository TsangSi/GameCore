/*
 * @Author: myl
 * @Date: 2022-11-24 16:47:50
 * @Description:
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilHead from '../../../base/utils/UtilHead';
import ControllerMgr from '../../../manager/ControllerMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendApplyItem extends cc.Component {
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
    private BtnAgree: cc.Node = null;
    @property(cc.Node)
    private BtnRefuse: cc.Node = null;
    @property(cc.Node)
    private NdAgree: cc.Node = null;
    @property(cc.Node)
    private NdRefuse: cc.Node = null;

    private _data: RelationPlayerData = null;

    protected start(): void {
        UtilGame.Click(this.BtnAgree, () => {
            // 同意
            ControllerMgr.I.FriendController.agreeOrRefuse(this._data.UserId, 1);
        }, this);
        UtilGame.Click(this.BtnRefuse, () => {
            // 拒绝
            ControllerMgr.I.FriendController.agreeOrRefuse(this._data.UserId, 2);
        }, this);
    }

    public setData(data: RelationPlayerData): void {
        this._data = data;
        this.LabName.string = data.Name;
        this.LavFv.string = UtilNum.ConvertFightValue(data.FightValue);
        this.LabLevel.string = `${i18n.tt(Lang.com_dengji)}：${data.Level}`;
        UtilHead.setHead(data.Head, this.SprHead, data.HeadFrame, this.SprHeadFrame);
        this.LabState.string = `(${data.Online === 1 ? i18n.tt(Lang.friend_online) : i18n.tt(Lang.friend_offline)})`;
        this.LabState.node.color = data.Online === 1 ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.NorV);
    }
}
