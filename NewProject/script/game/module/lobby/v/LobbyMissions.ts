/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Author: hwx
 * @Date: 2022-05-16 12:25:04
 * @Description: 大厅任务栏
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { EffectMgr } from '../../../manager/EffectMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import { GuideMgr } from '../../../com/guide/GuideMgr';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import { Link } from '../../link/Link';
import { ECountType, ETaskType } from '../../task/TaskConst';
import { TaskMgr } from '../../task/TaskMgr';
import { Config } from '../../../base/config/Config';
import MapCfg from '../../../map/MapCfg';
import { RES_ENUM } from '../../../const/ResPath';
import { ELobbyViewType } from '../LobbyConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class LobbyMissions extends BaseCmp {
    // @property(cc.Label)
    // private LabelName: cc.Label = null;
    @property(cc.RichText)
    private RichName: cc.RichText = null;
    // @property(cc.Label)
    // private LabelProgress: cc.Label = null;
    @property(cc.Node)
    private NodeRewardLayout: cc.Node = null;
    @property(cc.Node)
    private NodeGuide: cc.Node = null;
    /** 跳转id */
    private linkId: number = 0;
    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.Task.ChangeMainTaskId, this.onChangeMainTaskId, this);
        EventClient.I.on(E.Task.UpdateTask, this.onUpdateTask, this);
        EventClient.I.on(E.Guide.Close, this.onGuideClose, this);
        EventClient.I.on(E.Guide.ClearGuideComplete, this.onClearGuideComplete, this);
        EventClient.I.on(E.Task.CheckGuide, this.onCheckGuide, this);
        EventClient.I.on(E.Map.ChangeMapIdYW, this.onChangeMapIdYW, this);
        EventClient.I.on(E.Lobby.ChangeViewType, this.onChangeViewType, this);

        UtilGame.Click(this.node, () => {
            if (TaskMgr.I.isCompletedMainTask(TaskMgr.I.curMainTaskCfg?.Id)) {
                ControllerMgr.I.TaskController.C2SMainTaskReward();
            } else {
                if (this.linkId) {
                    Link.To(this.linkId);
                }
                if (GuideMgr.I.isDoing) {
                    GuideMgr.I.clearCur();
                    GuideMgr.I.show(TaskMgr.I.curMainTaskCfg.Id, 0);
                }
                this.NodeGuide.active = false;
            }
        }, this);
        ControllerMgr.I.TaskController.C2SMainTaskInfo();
    }

    private updateRewardByPrize(prize: string) {
        const items: number[][] = [];
        if (prize) {
            const prizes = prize.split('|');
            prizes.forEach((p) => {
                const s = p.split(':');
                items.push([+s[0], +s[1]]);
            });
        }
        this.upadteReward(items);
    }
    private onChangeViewType(type: ELobbyViewType) {
        switch (type) {
            case ELobbyViewType.Family:
                this.node.active = false;
                break;
            default:
                this.onChangeMainTaskId();
                break;
        }
    }

    private onChangeMainTaskId() {
        const taskCfg = TaskMgr.I.curMainTaskCfg;
        if (!TaskMgr.I.isCompletedAll() && taskCfg && (taskCfg.Id || taskCfg.TargetCount)) {
            this.linkId = TaskMgr.I.curMainTaskCfg.FuncId;
            // 任务
            // if (taskCfg.Id) {
            //     this.RichName.string = TaskMgr.I.getTaskModel(taskCfg.Id).getDesc(ETaskType.Main, undefined, true);
            // } else {
            //     this.RichName.string = taskCfg.Name;
            // }
            const prizes = TaskMgr.I.curMainTaskCfg?.Prize?.split('|');
            if (prizes) {
                const items: number[][] = [];
                prizes.forEach((p) => {
                    const s = p.split(':');
                    items.push([+s[0], +s[1]]);
                });
                this.upadteReward(items);
            }
            this.updateProgress(TaskMgr.I.curMainTaskCfg.Count, TaskMgr.I.curMainTaskCfg.TargetCount);
            this.node.active = true;
        } else {
            this.node.active = false;
        }
        this.checkGuide();
    }

    private onUpdateTask(ids: number[]) {
        if (ids && ids.indexOf(TaskMgr.I.curMainTaskCfg?.Id) >= 0) {
            this.updateProgress(TaskMgr.I.curMainTaskCfg.Count, TaskMgr.I.curMainTaskCfg.TargetCount);
        }
    }

    /**
     * 更新奖励
     * @param items [ [2, 1000], [3, 999] ]
     */
    private upadteReward(items: number[][]) {
        let node: cc.Node;
        let id: number;
        let num: number;
        for (let i = 0; i < 2; i++) {
            if (items[i]) {
                id = items[i][0];
                num = items[i][1];
                node = this.NodeRewardLayout.children[i] || cc.instantiate(this.NodeRewardLayout.children[0]);
                node.getChildByName('SprIcon').getComponent(DynamicImage).loadImage(`${RES_ENUM.Item}${id}_h`, 1, true);
                UtilCocos.SetString(node, 'LabCount', UtilNum.Convert(num));
                node.active = true;
                if (!this.NodeRewardLayout.children[i]) {
                    this.NodeRewardLayout.addChild(node);
                }
            } else if (i === 0) {
                this.NodeRewardLayout.children[i].active = false;
            } else {
                this.NodeRewardLayout.children[i]?.destroy();
            }
        }
    }

    /** 是否完成任务 */
    private updateProgress(cur: number, max: number) {
        let desc = '';
        let progress = '';
        if (TaskMgr.I.curMainTaskCfg?.Id) {
            desc = TaskMgr.I.getTaskModel(TaskMgr.I.curMainTaskCfg.Id).getDesc(ETaskType.Main, undefined, true);
        } else {
            desc = TaskMgr.I.curMainTaskCfg?.Name || '';
        }
        if (TaskMgr.I.isCompletedMainTask(TaskMgr.I.curMainTaskCfg?.Id)) {
            progress = `<color=${UtilColor.GreenD}>(${i18n.tt(Lang.maintask_complete)})</c>`;
            EffectMgr.I.showEffect(RES_ENUM.Com_Ui_116, this.node.getChildByName('NdEffect'));
            this.checkGuide();
        } else {
            if (TaskMgr.I.curMainTaskCfg.CounterType === ECountType.GameLevel) {
                progress = `<color=${UtilColor.RedD}>(0/1)</c>`;
            } else {
                progress = `<color=${UtilColor.RedD}>(${cur}/${max})</c>`;
            }
            EffectMgr.I.delEffect(RES_ENUM.Com_Ui_116, this.node.getChildByName('NdEffect'));
        }
        this.RichName.string = desc + progress;
    }

    private onClearGuideComplete(taskId: number): void {
        this.checkGuide();
    }

    private checkGuide(isEnable: boolean = false) {
        if (GuideMgr.I.isDoing && TaskMgr.I.curMainTaskCfg?.Finger === 1) {
            if (!GuideMgr.I.curLinkTaskId || (!GuideMgr.I.isShowGuideUI() && (isEnable || GuideMgr.I.curStep <= 0))) {
                this.NodeGuide.active = true;
                return;
            }
        }
        this.NodeGuide.active = false;
    }

    private onCheckGuide() {
        this.checkGuide();
    }

    protected onEnable(): void {
        this.checkGuide(true);
    }

    private onGuideClose() {
        this.checkGuide();
    }

    private onChangeMapIdYW() {
        if (!TaskMgr.I.curMainTaskCfg.Id && TaskMgr.I.curMainTaskCfg.TargetCount && !TaskMgr.I.curMainTaskCfg.Prize) {
            TaskMgr.I.curMainTaskCfg.Prize = Config.Get(Config.Type.Cfg_MapTask).getValueByKey(MapCfg.I.mapIdYW, 'Prize');
            this.updateRewardByPrize(TaskMgr.I.curMainTaskCfg.Prize);
        }
    }

    protected onDestroy(): void {
        super.destroy();
        EventClient.I.off(E.Task.ChangeMainTaskId, this.onChangeMainTaskId, this);
        EventClient.I.off(E.Task.UpdateTask, this.onUpdateTask, this);
        EventClient.I.off(E.Guide.ClearGuideComplete, this.onClearGuideComplete, this);
        EventClient.I.off(E.Task.CheckGuide, this.onCheckGuide, this);
        EventClient.I.off(E.Map.ChangeMapIdYW, this.onChangeMapIdYW, this);
        EventClient.I.off(E.Lobby.ChangeViewType, this.onChangeViewType, this);
    }
}
