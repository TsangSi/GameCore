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
            // 点击挑战自动关闭自动挑战
            // 存储界面 战斗结束时会调用
            // 先存储历史关卡的信息（包括章节和区域）
            ModelMgr.I.GameLevelModel.storeHistoryData();
            WinMgr.I.setViewStashParam(ViewConst.GameLevelWin, [0, '战斗结束打开']);
            ModelMgr.I.GameLevelModel.autoFight = false;
            ModelMgr.I.NewPlotModel.checkBeforeBattlePlot(RoleMgr.I.d.Stage);
        }, this);
    }

    /** 当前关卡 */
    private hisLv: number = 0;
    /** 当前章节 */
    private hisStage: number = 0;
    /** 当前区域 */
    private hisArena: number = 0;
    /** 当前章节所属地图 */
    private hisMap: number = 0;

    /** 用户关卡改变调用 */
    private gameLevelChange() {
        // 用户关卡改变
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        // 最新章节
        const newStage = indexer.getChapterInfo(RoleMgr.I.d.Stage).chapter;
        // 最新区域
        // const newArena = ModelMgr.I.GameLevelModel.getFoxInfo();
        // if (this.hisArena >= newArena) {
        //     // 区域未改变 ()
        //     // this.MapNd.autoScroll(newStage);
        // } else {
        //     // 区域发生改变
        //     this.MapNd.unlockNewArean(this.hisArena, this.hisStage);
        //     // 区域发生变化 会自动执行场景人物移动因此不需要处理 场景的变化
        //     return;
        // }

        if (this.hisStage >= newStage) {
            // 章节未发生改变
            this.MapNd.setupMapRoleData(GameLevelPageState.Default);// 默认处理
        } else {
            const map = ModelMgr.I.GameLevelModel.GetCurrentStageChapterByLevel(newStage).nameInfo.MapSort;
            if (map === this.hisMap) {
                // 章节发生改变  是否切换地图 如果切换地图则处理为默认
                this.MapNd.unlockNewStage(this.hisStage);
            } else {
                this.MapNd.setupMapRoleData(GameLevelPageState.Default);
            }
        }
    }

    /** 上一次的关卡 */
    private lastLv: number = 0;
    /** 上一次的章节 */
    private lastStage: number = 0;

    // 界面打开传递参数
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
            // 关卡有变更
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
        // 播放转场动画
        EffectMgr.PlayCocosAnim('animPrefab/ui/ty_changjingqiehuan/anim/ty_changjingqiehuan', this.effectNd, (par: unknown, nd: cc.Node) => {
            //
            if (param[1]) {
                // 当从战斗结束打开界面 关卡变更和区域解锁动画
                const model = ModelMgr.I.GameLevelModel;
                this.hisStage = model.hisStage;
                this.hisArena = model.hisArena;
                this.hisMap = model.hisMap;
                if (needFireChange) {
                    this.gameLevelChange();
                    this.NdChallenge.active = true;
                }
            } else {
                this.MapNd.setupMapRoleData(GameLevelPageState.Default);// 默认处理
            }
        });
    }

    private onNewPlotPlayAfter() {
        ModelMgr.I.NewPlotModel.checkAfterBattlePlot(RoleMgr.I.d.Stage - 1, () => {
            // 用户关卡改变
            const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
            // 最新章节
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
