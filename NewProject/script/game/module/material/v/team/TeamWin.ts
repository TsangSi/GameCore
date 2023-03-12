/*
 * @Author: zs
 * @Date: 2022-11-10 20:20:33
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\TeamWin.ts
 * @Description:
 *
 */
import { data } from '../../../../../../resources/i18n/en-US';
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { Config } from '../../../../base/config/Config';
import { ConfigTeamBossIndexer } from '../../../../base/config/indexer/ConfigTeamBossIndexer';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { TabContainer } from '../../../../com/tab/TabContainer';
import { TabData } from '../../../../com/tab/TabData';
import { TabItem } from '../../../../com/tab/TabItem';
import WinBase from '../../../../com/win/WinBase';
import { E } from '../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import ModelMgr from '../../../../manager/ModelMgr';
import MapCfg, { EMapFbInstanceType } from '../../../../map/MapCfg';

const { ccclass, property } = cc._decorator;
/** 页签索引 */
enum ETabIndex {
    /** 队伍列表 */
    TeamList = 0,
    /** 我的队伍 */
    MyTeam = 1
}
@ccclass
export class TeamWin extends WinBase {
    @property(cc.Node)
    private NodePanel: cc.Node = null;
    @property(TabContainer)
    private TabContainer: TabContainer = null;
    @property(cc.Label)
    private LabelTitle: cc.Label = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    protected _NdContents: Map<string, cc.Node> = new Map();

    /** 副本类型 */
    private fbType: number = 0;
    /** 副本id */
    private fbId: number = 0;
    public tabPages(): TabData[] {
        const panels: TabData[] = [
            {
                id: ETabIndex.TeamList,
                title: i18n.tt(Lang.team_view_tab1),
                uiPath: UI_PATH_ENUM.TeamListView,
            },
            {
                id: ETabIndex.MyTeam,
                title: i18n.tt(Lang.team_view_tab2),
                uiPath: UI_PATH_ENUM.MyTeamView,
            },
        ];
        return panels;
    }
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.node.getChildByName('SprBlack'), this.close, this);
        EventClient.I.on(E.Team.Leave, this.onLeave, this);
        EventClient.I.on(E.Team.Dissolve, this.onDissolve, this);
        EventClient.I.on(E.Team.Join, this.onJoin, this);
        EventClient.I.on(E.Team.Create, this.onCreate, this);
        UtilGame.Click(this.BtnClose, this.close, this);
    }
    private levelLimit: number = 0;
    public init(param: any[]): void {
        super.init(param);
        this.fbType = param[0];
        this.fbId = param[1];

        const cfgLevel: Cfg_TeamBoss_Level = Config.Get<ConfigTeamBossIndexer>(Config.Type.Cfg_TeamBoss).getValueByKeyFromLevel(this.fbId);
        const cfg: Cfg_TeamBoss = Config.Get(Config.Type.Cfg_TeamBoss).getValueByKey(cfgLevel.FBId);
        const name = cfg?.Name || '';
        this.levelLimit = cfgLevel?.LevelLimit || 80;
        this.LabelTitle.string = UtilString.FormatArgs(i18n.tt(Lang.team_list_title), this.levelLimit, name);
        this.selectIndex = ModelMgr.I.TeamModel.hasTeam() ? ETabIndex.MyTeam : ETabIndex.TeamList;
        this.TabContainer.setData(this.tabPages(), this.selectIndex);
    }

    /** 是否确认了创建队伍确认框 */
    private isSureCreateBox: boolean = false;
    /** 底部tab选中事件 */
    private tabClickEvents(item: TabItem) {
        if (item.getData().id === ETabIndex.MyTeam && this.isSureCreateBox === false) {
            if (!ModelMgr.I.TeamModel.hasTeam()) {
                if (MapCfg.I.mapData.InstanceType !== EMapFbInstanceType.YeWai) {
                    MsgToastMgr.Show(i18n.tt(Lang.team_page_create_tips));
                } else if (ModelMgr.I.TeamModel.getPassTime(this.fbType)) {
                    const str = UtilString.FormatArgs(i18n.tt(Lang.team_page_create_team_tips), this.levelLimit, UtilColor.NorV);
                    ModelMgr.I.MsgBoxModel.ShowBox(str, () => {
                        this.isSureCreateBox = true;
                        this.TabContainer.switchTab(ETabIndex.MyTeam);
                    });
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.team_page_battle_num_tips));
                }
                this.TabContainer.switchTab(ETabIndex.TeamList);
                return;
            }
        }
        this.addNdContents(item.getData());
    }
    private addNdContents(data: TabData) {
        this.isSureCreateBox = false;
        this.selectIndex = data.id;
        const nd = this._NdContents.get(data.uiPath);
        this.hideOthersNd(nd);
        if (nd) {
            nd.active = true;
            // 发送事件 刷新界面
            nd.emit('PageRefreshEvent', this.fbType, this.fbId);
        } else {
            this.initTabView(data);
        }
    }
    private hideOthersNd(newNode: cc.Node) {
        this._NdContents.forEach((nd) => {
            if (nd !== newNode) {
                nd.active = false;
            }
        });
    }

    public initTabView(data: TabData): void {
        if (data.uiPath === null || data.uiPath.length === 0) {
            console.error('缺少页面路径配置，如需自定义写法 请重写改方法 无需执行super.initTabView()');
            return;
        }
        ResMgr.I.showPrefabOnce(data.uiPath, this.NodePanel, (err, node) => {
            if (err) {
                console.log('添加界面出错', data.uiPath);
                return;
            }
            // 首次加载发送事件刷新界面
            node.emit('PageRefreshEvent', this.fbType, this.fbId);
            this._NdContents.set(data.uiPath, node);
        });
    }

    /** 当前选中的索引 */
    private selectIndex: number = -1;

    /** 离开了队伍 */
    private onLeave() {
        if (this.selectIndex !== ETabIndex.TeamList) {
            this.TabContainer.switchTab(ETabIndex.TeamList);
        }
    }

    /** 解散了队伍 */
    private onDissolve() {
        if (this.selectIndex !== ETabIndex.TeamList) {
            this.TabContainer.switchTab(ETabIndex.TeamList);
        }
    }

    private onJoin() {
        if (this.selectIndex !== ETabIndex.MyTeam) {
            this.TabContainer.switchTab(ETabIndex.MyTeam);
        }
    }

    private onCreate() {
        if (this.selectIndex !== ETabIndex.MyTeam) {
            this.TabContainer.switchTab(ETabIndex.MyTeam);
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Team.Leave, this.onLeave, this);
        EventClient.I.off(E.Team.Dissolve, this.onDissolve, this);
        EventClient.I.off(E.Team.Join, this.onJoin, this);
        EventClient.I.off(E.Team.Create, this.onCreate, this);
        if (ModelMgr.I.TeamModel.hasTeam()) {
            WinMgr.I.close(ViewConst.MaterialWin);
        }
    }
}
