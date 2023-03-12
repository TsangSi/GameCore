/*
 * @Author: myl
 * @Date: 2023-02-21 14:10:53
 * @Description:
 */
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { i18n, Lang } from '../../../../i18n/i18n';
import UtilHead from '../../../base/utils/UtilHead';
import ModelMgr from '../../../manager/ModelMgr';
import { FamilyPos } from '../FamilyConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class FamilyMemberItem extends cc.Component {
    @property(cc.Label)// 玩家昵称
    private LabName: cc.Label = null;

    @property(cc.Label)// 玩家Vip
    private LabVip: cc.Label = null;

    @property(cc.Sprite)// 玩家头像
    private SprHeadIcon: cc.Sprite = null;

    @property(cc.Sprite)// 玩家头像背景
    private SprHeadFrame: cc.Sprite = null;

    @property(cc.Node)// 在线
    private SprOnline: cc.Node = null;
    @property(cc.Node)// 离线
    private SprOffline: cc.Node = null;
    @property(cc.Label)// 玩家战力
    private LabTime: cc.Label = null;

    @property(cc.Label)// 玩家战力
    private LabPower: cc.Label = null;

    @property(cc.Label)// 职位
    private LabPos: cc.Label = null;

    public setData(data: FamilyMember): void {
        this.LabName.string = data.Name;// 昵称
        this.LabPower.string = `${UtilNum.ConvertFightValue(data.FightValue)}`;// 战力
        const name = ModelMgr.I.VipModel.getVipName(data.VIP);
        this.LabVip.string = `${name}`;// Vip
        this.SprHeadFrame.node.width = 100;
        this.SprHeadFrame.node.height = 100;

        UtilHead.setHead(data.Head, this.SprHeadIcon, data.HeadFrame, this.SprHeadFrame);

        this.SprOnline.active = !data.LastLogout;
        this.SprOffline.active = !!data.LastLogout;

        // 在线 0  或者空就是在线
        if (data.LastLogout) { // 离线
            const nowTime = UtilTime.NowSec();// 当前时间 S
            const deltaSecond: number = nowTime - data.LastLogout;
            const str: string = UtilTime.TimeLimit(deltaSecond);
            this.LabTime.string = `${str}${i18n.tt(Lang.family_qian)}`;// xxx小时前
        }

        if (data.Position === FamilyPos.Chiefs) { // 族长
            this.LabPos.string = i18n.tt(Lang.family_chief);// 族长
        } else if (data.Position === FamilyPos.FuChiefs) {
            this.LabPos.string = i18n.tt(Lang.family_fuchief);// '副族长';
        } else if (data.Position === FamilyPos.Older) {
            this.LabPos.string = i18n.tt(Lang.family_older);// '长老';
        } else {
            this.LabPos.string = '';// 成员
        }
    }
}
