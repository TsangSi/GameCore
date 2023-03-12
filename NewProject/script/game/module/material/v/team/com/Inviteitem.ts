import { EventClient } from '../../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { Config } from '../../../../../base/config/Config';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { INickInfoConfig, NickShowType, UtilGame } from '../../../../../base/utils/UtilGame';
import UtilHead from '../../../../../base/utils/UtilHead';
import { E } from '../../../../../const/EventName';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { RoleInfo } from '../../../../role/RoleInfo';
import { RoleMgr } from '../../../../role/RoleMgr';

/*
 * @Author: zs
 * @Date: 2022-11-15 11:39:30
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\com\Inviteitem.ts
 * @Description:
 *
 */

interface IPlayerInfo {
    /** 玩家id */
    UserId: number;
    /** 玩家名字 */
    Name: string;
    /** 头像框 */
    HeadFrame: number;
    /** 头像 */
    Head: number;
    /** vip等级 */
    Vip?: number;
    /** 区服id */
    ShowAreaId: number;
    /** 战力 */
    FightValue?: number;
}
const { ccclass, property } = cc._decorator;

@ccclass
export class Inviteitem extends BaseCmp {
    @property(cc.Node)
    private BtnInvite: cc.Node = null;
    @property(cc.Node)
    private BtnTeam: cc.Node = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelFv: cc.Label = null;
    @property(cc.Sprite)
    private HeadFrame: cc.Sprite = null;
    @property(cc.Sprite)
    private Head: cc.Sprite = null;
    @property(cc.Label)
    private LabelTime: cc.Label = null;

    private userId: number = 0;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnInvite, this.onBtnInviteClicked, this);
        EventClient.I.on(E.Team.UpdateAllInvite, this.onUpdateAllInvite, this);
    }

    /**
     * 填充数据
     * @param player 玩家信息
     * @param isTeam 是否在组队中
     */
    public setData(player: TeamViewPlayer, isTeam?: boolean): void {
        this.userId = player.UserId;
        const nickConf: INickInfoConfig = {
            name: player.Nick,
            arenaId: player.AreaId,
            showType: NickShowType.ArenaNick,
            isDark: false,
            isSelf: player.UserId === RoleMgr.I.info.userID,
        };
        this.LabelName.string = UtilGame.FormatNick(nickConf);
        this.LabelFv.string = UtilNum.ConvertFightValue(player.Fight);
        UtilHead.setHead(player.HeadIcon, this.Head, player.HeadFrame, this.HeadFrame);
        this.BtnTeam.active = isTeam;
        this.BtnInvite.active = !isTeam;
        if (isTeam) {
            this.stopTime();
        }
        this.checkInvaiteTime();
    }

    private leftTime: number = 0;
    private onBtnInviteClicked() {
        if (this.leftTime <= 0) {
            const model = ModelMgr.I.TeamModel;
            model.invitePlayer(this.userId);
            this.checkInvaiteTime();
        } else {
            MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_invitation_again_player_tips), this.leftTime));
        }
    }

    private checkInvaiteTime() {
        if (!this.BtnInvite.active) {
            return;
        }
        const model = ModelMgr.I.TeamModel;
        const endTime = model.getInvitePlayerTime(this.userId) || 0;
        this.leftTime = endTime - UtilTime.NowSec();
        this.unschedule(this.updateTime);
        if (this.leftTime > 0) {
            this.schedule(this.updateTime, 1);
            this.updateTime();
            UtilColor.setGray(this.BtnInvite, true, true);
        } else {
            this.LabelTime.string = '';
            UtilColor.setGray(this.BtnInvite, false, true);
        }
    }

    private updateTime() {
        this.LabelTime.string = `${this.leftTime}${i18n.tt(Lang.com_second)}`;
        this.leftTime--;
        if (this.leftTime < 0) {
            this.unschedule(this.updateTime);
            UtilColor.setGray(this.BtnInvite, false, true);
            this.LabelTime.string = '';
        }
    }
    private stopTime() {
        this.unschedule(this.updateTime);
        UtilColor.setGray(this.BtnInvite, false, true);
        this.LabelTime.string = '';
    }

    private onUpdateAllInvite() {
        this.checkInvaiteTime();
    }

    protected onDestroy(): void {
        super.onDestroy();

        EventClient.I.off(E.Team.UpdateAllInvite, this.onUpdateAllInvite, this);
    }
}
