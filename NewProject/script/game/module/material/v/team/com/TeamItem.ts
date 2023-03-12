/*
 * @Author: zs
 * @Date: 2022-11-15 21:48:38
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\com\TeamItem.ts
 * @Description:
 *
 */
import { UtilColor } from '../../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../../../app/core/mvc/view/BaseCmp';
import { ResMgr } from '../../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { NickShowType, UtilGame } from '../../../../../base/utils/UtilGame';
import { UI_PATH_ENUM } from '../../../../../const/UIPath';
import ModelMgr from '../../../../../manager/ModelMgr';
import { RoleInfo } from '../../../../role/RoleInfo';
import { RoleMgr } from '../../../../role/RoleMgr';
import { TeamMemberItem } from './TeamMemberItem';

const { ccclass, property } = cc._decorator;
/** 队伍最大成员人数 */
const MaxMember = 3;
@ccclass
export class TeamItem extends BaseCmp {
    @property(cc.Node)
    private BtnJoin: cc.Node = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelV: cc.Label = null;
    @property(cc.Node)
    private content: cc.Node = null;
    @property(cc.Label)
    private LabelTime: cc.Label = null;

    private teamInfo: TeamView;
    /** 限制战力 */
    private needFightValue: number = 0;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnJoin, this.onBtnJoinClicked, this);
    }

    public setData(teamInfo: TeamView): void {
        this.teamInfo = teamInfo;
        const player = teamInfo.TeamViewPlayerList[0];
        this.needFightValue = teamInfo.PowerLimit;
        const name = RoleInfo.GetAreaNick(NickShowType.ArenaNick, player.Nick, player.AreaId);
        this.LabelName.string = UtilString.FormatArgs(i18n.tt(Lang.team_item_name), name, teamInfo.TeamViewPlayerList.length, MaxMember);

        if (this.content.children.length < MaxMember) {
            ResMgr.I.loadLocal(UI_PATH_ENUM.TeamMemberItem, cc.Prefab, (e, p: cc.Prefab) => {
                this.showMemberItem(p);
            });
        } else {
            this.showMemberItem();
        }
        this.LabelV.string = UtilNum.ConvertFightValue(this.needFightValue);
        this.LabelV.node.color = this.needFightValue > RoleMgr.I.d.FightValue ? UtilColor.ColorUnEnoughV : UtilColor.ColorEnoughV;
        this.checkJoinTime();
    }

    private leftTime: number = 0;
    private checkJoinTime() {
        const endTime = ModelMgr.I.TeamModel.getJoinTeamTime(this.teamInfo.TeamId);
        this.leftTime = endTime - UtilTime.NowSec();
        this.unschedule(this.updateTime);
        if (this.leftTime > 0) {
            this.schedule(this.updateTime, 1);
            this.updateTime();
            UtilColor.setGray(this.BtnJoin, true, true);
        } else {
            this.LabelTime.string = '';
            UtilColor.setGray(this.BtnJoin, false, true);
        }
    }

    private updateTime() {
        this.LabelTime.string = `${this.leftTime}${i18n.tt(Lang.com_second)}`;
        this.leftTime--;
        if (this.leftTime < 0) {
            this.unschedule(this.updateTime);
            UtilColor.setGray(this.BtnJoin, false, true);
            this.LabelTime.string = '';
        }
    }

    private showMemberItem(p?: cc.Prefab) {
        for (let i = 0; i < MaxMember; i++) {
            let child = this.content.children[i];
            if (!child && p) {
                child = cc.instantiate(p);
            }
            if (!child) {
                console.warn('showMemberItem child is null');
            }
            child.getComponent(TeamMemberItem).setData(this.teamInfo.TeamViewPlayerList[i]);
            if (!this.content.children[i]) {
                this.content.addChild(child);
            }
        }
    }

    private onBtnJoinClicked() {
        if (this.needFightValue <= RoleMgr.I.d.FightValue) {
            if (this.leftTime <= 0) {
                if (ModelMgr.I.TeamModel.hasTeam()) {
                    ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.team_list_join_tips), UtilColor.NorV), () => {
                        ModelMgr.I.TeamModel.checkLinkJoinTeam(this.teamInfo.TeamId);
                    });
                } else {
                    ModelMgr.I.TeamModel.checkLinkJoinTeam(this.teamInfo.TeamId);
                }
            } else {
                MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_join_team_again_tips), this.leftTime));
            }
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.team_item_limit_fightvalue));
        }
    }
}
