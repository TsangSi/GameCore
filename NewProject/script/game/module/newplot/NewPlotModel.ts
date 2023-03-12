/*
 * @Author: zs
 * @Date: 2022-11-23 20:15:24
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\newplot\NewPlotModel.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { Config } from '../../base/config/Config';
import { ConfigCollectionBookIndexer } from '../../base/config/indexer/ConfigCollectionBookIndexer';
import { ConfigStageIndexer } from '../../base/config/indexer/ConfigStageIndexer';
import { LayerMgr } from '../../base/main/LayerMgr';
import { BattleCommon } from '../../battle/BattleCommon';
import { BattleMgr } from '../../battle/BattleMgr';
import { E } from '../../const/EventName';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import { EBattleType } from '../battleResult/BattleResultConst';
import { EClientDataKey } from '../gameLevel/GameLevelConst';
import { RoleMgr } from '../role/RoleMgr';
import PlotIkonPanel from './PlotIkonPanel';

/** 剧情类型 */
enum EPlotType {
    /** 战斗前 */
    BeforeBattle = 1,
    /** 战斗结束 */
    AfterBattle = 2,
    /** 战斗中 */
    Battle = 3
}

export default class NewPlotModel extends BaseModel {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    /** 检查战斗之前的剧情播放 */
    public checkBeforeBattlePlot(stage?: number): void {
        stage = stage || RoleMgr.I.d.Stage;
        const storageStage = +ModelMgr.I.GameLevelModel.getClientData(EClientDataKey.BeforeBattlePlot);
        const plotIds = this.getPlotIds(EPlotType.BeforeBattle, stage);
        if (stage > storageStage && plotIds && plotIds.length) {
            WinMgr.I.open(ViewConst.NewPlotPanel, plotIds, () => {
                ControllerMgr.I.GameLevelController.C2SSaveClientData(EClientDataKey.BeforeBattlePlot, stage.toString());
                BattleCommon.I.enter(EBattleType.GameLevelBoss);
            });
        } else {
            BattleCommon.I.enter(EBattleType.GameLevelBoss);
        }
    }
    /** 检查战斗之后的剧情播放 */
    public checkAfterBattlePlot(stage: number, func?: () => void, target?: any): void {
        const plotIds = this.getPlotIds(EPlotType.AfterBattle, stage);
        if (plotIds && plotIds.length) {
            WinMgr.I.open(ViewConst.NewPlotPanel, plotIds, () => {
                ModelMgr.I.NewPlotModel.checkChapterIkon(stage, func, target);
            });
        } else { // 继续检查插画是否要播放
            this.checkChapterIkon(stage, func, target);
        }
    }

    /**
     * 检查剧情插画是否要播放
     * @param stage 关卡
     * @param func 回调
     * @param target 回调上下文
     */
    public checkChapterIkon(stage: number, func?: () => void, target?: any): void {
        const cfgIndexer = Config.Get<ConfigCollectionBookIndexer>(Config.Type.Cfg_CollectionBook);
        const index = cfgIndexer.getIndexByStage(stage);
        if (index >= 0) {
            const cfg: Cfg_CollectionBook = cfgIndexer.getValueByIndex(index);
            if (cfg && cfg.UnlockParam === stage) {
                this.showPlotIkon(cfg, func, target);
                return;
            }
        }
        if (func) {
            if (target) {
                func.call(target);
            } else {
                func();
            }
        }
    }

    /**
     * 根据关卡获取战斗中要播放剧情对话
     * @param stage 关卡
     * @returns
     */
    public getBattlePlotTexts(stage?: number): string[] {
        stage = stage || RoleMgr.I.d.Stage - 1;
        const plotIds = this.getPlotIds(EPlotType.Battle, stage);
        const texts: string[] = [];
        plotIds.forEach((id) => {
            const cfgNP: Cfg_NewPlot = Config.Get(Config.Type.Cfg_NewPlot).getValueByKey(id);
            texts.push(cfgNP.Text);
        });
        return texts;
    }

    /**
     * 根据关卡获取剧情id列表
     * @param stage 关卡
     * @returns
     */
    private getPlotIds(type: EPlotType, stage: number): number[] {
        const plotIds: number[] = [];
        // eslint-disable-next-line max-len
        const cfgNPGroup: Cfg_NewPlot_Group = Config.Get(Config.Type.Cfg_NewPlot_Group).getValueByKey(type, stage);
        if (cfgNPGroup) {
            cfgNPGroup.PlotID.split('|').forEach((id) => {
                plotIds.push(+id);
            });
        }
        return plotIds;
    }
    private PlotIkonPanel: PlotIkonPanel;
    public showPlotIkon(cfg: Cfg_CollectionBook, completeFunc: () => void, target: any): void {
        if (!this.PlotIkonPanel || !this.PlotIkonPanel.isValid) {
            ResMgr.I.loadAsync(UI_PATH_ENUM.PlotIkonPanel, cc.Prefab).then((pre: cc.Prefab) => {
                const node = cc.instantiate(pre);
                LayerMgr.I.addToLayer(GameLayerEnum.POP_LAYER, node);
                node.zIndex = -1;
                this.PlotIkonPanel = node.getComponent(PlotIkonPanel);
                this.PlotIkonPanel.setData(cfg, completeFunc, target);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            this.PlotIkonPanel.setData(cfg, completeFunc, target);
        }
    }

    /**
     * 关卡挑战自动闯关赢了才会走这里，非自动闯关走GameLevelPage
     */
    public autoFightWinHandler(): void {
        // 用户关卡改变
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        // 最新章节
        const newStage = indexer.getChapterInfo(RoleMgr.I.d.Stage).chapter;
        const hisStage = ModelMgr.I.GameLevelModel.hisStage;
        if (hisStage < newStage || (hisStage === newStage && !ModelMgr.I.GameLevelModel.canFight())) {
            // 章节发生改变
            EventClient.I.once(E.BattleResult.SettleCloseView, this.onNewPlotPlayAfter, this);
        }
    }

    /** 奖励领取完后触发的事件 */
    private onNewPlotPlayAfter() {
        ModelMgr.I.NewPlotModel.checkChapterIkon(ModelMgr.I.GameLevelModel.hisStage);
    }
}
