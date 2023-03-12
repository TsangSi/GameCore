/*
 * @Author: zs
 * @Date: 2022-11-10 20:20:33
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\TeamListView.ts
 * @Description:
 *
 */
import ListView from '../../../../base/components/listview/ListView';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import BaseUiView from '../../../../../app/core/mvc/view/BaseUiView';
import ControllerMgr from '../../../../manager/ControllerMgr';
import { EventClient } from '../../../../../app/base/event/EventClient';
import { E } from '../../../../const/EventName';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import { TeamItem } from './com/TeamItem';
import ModelMgr from '../../../../manager/ModelMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { BattleCommon } from '../../../../battle/BattleCommon';
import { EBattleType } from '../../../battleResult/BattleResultConst';
import MapCfg, { EMapFbInstanceType } from '../../../../map/MapCfg';

const { ccclass, property } = cc._decorator;
@ccclass
export class TeamListView extends BaseUiView {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Node)
    private BtnCreate: cc.Node = null;
    @property(cc.Node)
    private BtnExit: cc.Node = null;
    @property(cc.Node)
    private NodeNone: cc.Node = null;

    protected onLoad(): void {
        super.onLoad();
        this.node.on('PageRefreshEvent', this.onPageRefreshEvent, this);
        UtilGame.Click(this.BtnCreate, this.onBtnCreateClicked, this);
        UtilGame.Click(this.BtnExit, this.onBtnExitClicked, this);
        EventClient.I.on(E.Team.UpdateTeamList, this.onUpdateTeamList, this);
        EventClient.I.on(E.Team.Leave, this.onUpdateBtnActive, this);
        EventClient.I.on(E.Team.Create, this.onCreate, this);
        EventClient.I.on(E.Team.Join, this.onJoin, this);
        this.NodeNone.active = true;
        this.updateBtnActive();
    }
    /** 副本id */
    private fbId: number = 0;
    /** 副本类型 */
    private fbType: number = 0;

    private onPageRefreshEvent(fbType: number, fbId: number): void {
        this.fbType = fbType;
        this.fbId = fbId;
        ControllerMgr.I.TeamController.C2STeamDunViewList(this.fbId);
    }

    private teams: TeamView[] = [];
    private onUpdateTeamList(teams: TeamView[]) {
        this.teams = teams;
        this.ListView.setNumItems(this.teams.length);
        this.NodeNone.active = this.teams.length === 0;
    }

    private onRenderItem(node: cc.Node, index: number) {
        node.getComponent(TeamItem).setData(this.teams[index]);
    }

    private onBtnCreateClicked() {
        if (MapCfg.I.mapData.InstanceType !== EMapFbInstanceType.YeWai) {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_create_tips));
            return;
        }

        const cfgTBLevel: Cfg_TeamBoss_Level = ModelMgr.I.TeamModel.cfg.getValueByKeyFromLevel(this.fbId);
        const str = UtilString.FormatArgs(i18n.tt(Lang.team_page_create_team_tips), cfgTBLevel.LevelLimit, UtilColor.NorV);

        if (ModelMgr.I.TeamModel.getPassTime(this.fbType)) {
            ModelMgr.I.MsgBoxModel.ShowBox(str, () => {
                ControllerMgr.I.TeamController.C2STeamDunCreate(this.fbId);
            });
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_battle_num_tips));
        }
    }

    private onBtnExitClicked() {
        const str = ModelMgr.I.TeamModel.isCap()
            ? UtilString.FormatArgs(i18n.tt(Lang.team_msgbox_dissolve), UtilColor.NorV)
            : UtilString.FormatArgs(i18n.tt(Lang.team_list_exit_tips), UtilColor.NorV);
        ModelMgr.I.MsgBoxModel.ShowBox(str, () => {
            ControllerMgr.I.TeamController.C2STeamDunLeaveOrCancel();
        });
    }

    private onUpdateBtnActive() {
        this.updateBtnActive();
    }

    private updateBtnActive() {
        const hasTeam = ModelMgr.I.TeamModel.hasTeam();
        this.BtnCreate.active = !hasTeam;
        this.BtnExit.active = hasTeam;
        if (hasTeam) {
            // eslint-disable-next-line max-len
            UtilCocos.SetString(this.BtnExit, 'Label', ModelMgr.I.TeamModel.isCap() ? i18n.tt(Lang.team_list_btn_diss) : i18n.tt(Lang.team_list_btn_exit));
        }
    }

    private onCreate() {
        this.updateBtnActive();
    }

    private onJoin() {
        this.updateBtnActive();
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Team.UpdateTeamList, this.onUpdateTeamList, this);
        EventClient.I.off(E.Team.Leave, this.onUpdateBtnActive, this);
        EventClient.I.off(E.Team.Create, this.onCreate, this);
        EventClient.I.off(E.Team.Join, this.onJoin, this);
    }
}
