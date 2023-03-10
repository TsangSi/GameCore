/*
 * @Author: myl
 * @Date: 2022-09-14 12:07:11
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import { ConfigStageIndexer } from '../../../base/config/indexer/ConfigStageIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { GuideMgr } from '../../../com/guide/GuideMgr';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import { EffectMgr } from '../../../manager/EffectMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { GameLevelPageState } from '../GameLevelConst';
import { ILevelMapConf } from '../UtilGameLevel';
import { GameLevelView } from './GameLevelView';
import { TaskMgr } from '../../task/TaskMgr';
import { FuncId } from '../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';

const { ccclass, property } = cc._decorator;
@ccclass
export class GameLevelPage extends WinTabPage {
    @property(GameLevelView)
    private MapNd: GameLevelView = null;
    @property(cc.Node)
    private NdUi: cc.Node = null;

    @property(cc.Node)
    private NdChallenge: cc.Node = null;
    @property(cc.Node)
    private effectNd: cc.Node = null;

    public start(): void {
        super.start();

        UtilGame.Click(this.NdChallenge, () => {
            if (!ModelMgr.I.GameLevelModel.canFight()) {
                MsgToastMgr.Show(i18n.tt(Lang.game_level_max_chapter));
                return;
            }
            const condition = ModelMgr.I.GameLevelModel.lastLevelCondition();
            if (!condition.state) {
                MsgToastMgr.Show(`${condition.desc}${i18n.tt(Lang.open_conditon)}`);
                return;
            }
            // ????????????????????????????????????
            // ???????????? ????????????????????????
            // ?????????????????????????????????????????????????????????
            ModelMgr.I.GameLevelModel.storeHistoryData();
            WinMgr.I.setViewStashParam(ViewConst.GameLevelWin, [0, '??????????????????']);
            ModelMgr.I.GameLevelModel.autoFight = false;
            ModelMgr.I.NewPlotModel.checkBeforeBattlePlot(RoleMgr.I.d.Stage);
        }, this);
    }

    /** ???????????? */
    private hisLv: number = 0;
    /** ???????????? */
    private hisStage: number = 0;
    /** ???????????? */
    private hisArena: number = 0;
    /** ???????????????????????? */
    private hisMap: number = 0;

    /** ???????????????????????? */
    private gameLevelChange() {
        // ??????????????????
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        // ????????????
        const newStage = indexer.getChapterInfo(RoleMgr.I.d.Stage).chapter;
        // ????????????
        // const newArena = ModelMgr.I.GameLevelModel.getFoxInfo();
        // if (this.hisArena >= newArena) {
        //     // ??????????????? ()
        //     // this.MapNd.autoScroll(newStage);
        // } else {
        //     // ??????????????????
        //     this.MapNd.unlockNewArean(this.hisArena, this.hisStage);
        //     // ?????????????????? ?????????????????????????????????????????????????????? ???????????????
        //     return;
        // }

        if (this.hisStage >= newStage) {
            // ?????????????????????
            this.MapNd.setupMapRoleData(GameLevelPageState.Default);// ????????????
        } else {
            const map = ModelMgr.I.GameLevelModel.GetCurrentStageChapterByLevel(newStage).nameInfo.MapSort;
            if (map === this.hisMap) {
                // ??????????????????  ?????????????????? ????????????????????????????????????
                this.MapNd.unlockNewStage(this.hisStage);
            } else {
                this.MapNd.setupMapRoleData(GameLevelPageState.Default);
            }
        }
    }

    /** ?????????????????? */
    private lastLv: number = 0;
    /** ?????????????????? */
    private lastStage: number = 0;

    // ????????????????????????
    public init(winId: number, param: unknown[], tabIdx: number, tabId?: number): void {
        // todo
        this.winId = winId;
        this.tabIdx = tabIdx;
        this.tabId = tabId;
        this.param = param;
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        const { chapter, level } = indexer.getChapterInfo();
        const indexer1 = Config.Get(ConfigConst.Cfg_StageName);
        const chapterInfo: Cfg_StageName = indexer1.getValueByKey(chapter);
        const mapConf = chapterInfo.MapId.split(',');
        const mapConfig: ILevelMapConf = {
            id: parseInt(mapConf[0]),
            size: cc.size(parseInt(mapConf[1]), parseInt(mapConf[2])),
        };

        this.MapNd.setMapResConfig(mapConfig);

        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_GameLevel_GameLevelInfoLeft, this.NdUi);
        let needFireChange = false;
        if (param[1]) {
            // ???????????????
            if (ModelMgr.I.GameLevelModel.curIsWin && !ModelMgr.I.GameLevelModel.autoFight) {
                this.NdChallenge.active = false;
                if (ModelMgr.I.BattleResultModel.getIsShowing()) {
                    EventClient.I.once(E.BattleResult.SettleCloseView, this.onNewPlotPlayAfter, this);
                } else {
                    this.onNewPlotPlayAfter();
                }
                if (GuideMgr.I.isDoing) {
                    if (!GuideMgr.I.isPasuseGuide() && GuideMgr.I.isCompleteTask()) {
                        if (TaskMgr.I.curMainTaskCfg.FuncId === FuncId.GuanKa) {
                            GuideMgr.I.show(TaskMgr.I.curMainTaskCfg.Id, 1);
                        }
                    }
                }
            } else {
                needFireChange = true;
            }
        }
        // ??????????????????
        EffectMgr.PlayCocosAnim('animPrefab/ui/ty_changjingqiehuan/anim/ty_changjingqiehuan', this.effectNd, (par: unknown, nd: cc.Node) => {
            //
            if (param[1]) {
                // ?????????????????????????????? ?????????????????????????????????
                const model = ModelMgr.I.GameLevelModel;
                this.hisStage = model.hisStage;
                this.hisArena = model.hisArena;
                this.hisMap = model.hisMap;
                if (needFireChange) {
                    this.gameLevelChange();
                    this.NdChallenge.active = true;
                }
            } else {
                this.MapNd.setupMapRoleData(GameLevelPageState.Default);// ????????????
            }
        });
    }

    private onNewPlotPlayAfter() {
        ModelMgr.I.NewPlotModel.checkAfterBattlePlot(RoleMgr.I.d.Stage - 1, () => {
            // ??????????????????
            const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
            // ????????????
            const newStage = indexer.getChapterInfo(RoleMgr.I.d.Stage).chapter;
            const model = ModelMgr.I.GameLevelModel;
            if (!model.autoFight && model.hisStage < newStage) {
                WinMgr.I.open(ViewConst.GameLevelNewChapterView);
            }
            this.gameLevelChange();
            this.NdChallenge.active = true;
        }, this);
    }
}
