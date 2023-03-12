/*
 * @Author: zs
 * @Date: 2022-11-10 20:20:33
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\InvitePlayerView.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import BaseUiView from '../../../../../app/core/mvc/view/BaseUiView';
import { i18n, Lang } from '../../../../../i18n/i18n';
import ListView from '../../../../base/components/listview/ListView';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { E } from '../../../../const/EventName';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { CHAT_CHANNEL_ENUM } from '../../../chat/ChatConst';
import { RoleMgr } from '../../../role/RoleMgr';
import { Inviteitem } from './com/Inviteitem';

const { ccclass, property } = cc._decorator;
@ccclass
export class InvitePlayerView extends BaseUiView {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Node)
    private NodeNone: cc.Node = null;
    @property(cc.Node)
    private BtnInvite: cc.Node = null;
    @property(cc.Label)
    private LabelTime: cc.Label = null;

    private curSelectType: CHAT_CHANNEL_ENUM;
    protected onLoad(): void {
        super.onLoad();
        this.node.on('PageRefreshEvent', this.onPageRefreshEvent, this);
        EventClient.I.on(E.Team.UpdateMathPlayers, this.onUpdateMathPlayers, this);
        EventClient.I.on(E.Team.InviteFail, this.onInviteFail, this);
        EventClient.I.on(E.Team.UpdateAllInvite, this.onUpdateAllInvite, this);
        UtilGame.Click(this.BtnInvite, this.onBtnInviteClicked, this);
        // this.checkInvaiteTime();
    }
    private onPageRefreshEvent(type: number) {
        this.curSelectType = type;
        this.showPlayerList();
        this.checkInvaiteTime();
    }

    private showPlayerList() {
        this.players = ModelMgr.I.TeamModel.getMatchListByType(this.curSelectType);
        if (this.players) {
            this.onUpdateMathPlayers(this.curSelectType);
        }
    }

    private players: TeamViewPlayer[] = [];
    private onUpdateMathPlayers(type: CHAT_CHANNEL_ENUM) {
        if (this.curSelectType === type) {
            this.players = ModelMgr.I.TeamModel.getMatchListByType(this.curSelectType);
            if (this.players.length > 0) {
                this.NodeNone.active = false;
            } else {
                this.NodeNone.active = true;
            }
            this.ListView.setNumItems(this.players.length);
        }
    }

    private onRenderItem(node: cc.Node, index: number) {
        node.getComponent(Inviteitem).setData(this.players[index], this.userIdsTeam.indexOf(this.players[index].UserId) >= 0);
    }

    private leftTime: number = 0;
    private checkInvaiteTime() {
        const model = ModelMgr.I.TeamModel;
        const endTime = model.getInvitePlayerTime(this.curSelectType) || 0;
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
    private onBtnInviteClicked() {
        if (this.players.length) {
            if (this.leftTime <= 0) {
                ModelMgr.I.TeamModel.inviteAllPlayer(this.curSelectType);
                this.checkInvaiteTime();
            } else {
                MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_invitation_all_again_player_tips), this.leftTime));
            }
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.team_invitation_all_tips));
        }
    }

    private userIdsTeam: number[] = [];
    private onInviteFail(userId?: number) {
        if (userId) {
            if (this.userIdsTeam.indexOf(userId) < 0) {
                this.userIdsTeam.push(userId);
            }
            for (let i = 0, n = this.players.length; i < n; i++) {
                if (this.players[i].UserId === userId) {
                    this.ListView.updateItem(i);
                    break;
                }
            }
        }
        // ControllerMgr.I.TeamController.C2STeamDunMatchList(this.curSelectType);
    }

    private onUpdateAllInvite() {
        this.checkInvaiteTime();
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Team.UpdateMathPlayers, this.onUpdateMathPlayers, this);
        EventClient.I.off(E.Team.InviteFail, this.onInviteFail, this);
        EventClient.I.off(E.Team.UpdateAllInvite, this.onUpdateAllInvite, this);
    }
}
