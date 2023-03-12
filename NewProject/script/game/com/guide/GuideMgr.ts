import { EventClient } from '../../../app/base/event/EventClient';
import { UtilBool } from '../../../app/base/utils/UtilBool';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { Config } from '../../base/config/Config';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import GameApp from '../../base/GameApp';
import { E } from '../../const/EventName';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';
import { TaskMgr } from '../../module/task/TaskMgr';
import { GuideBind } from './GuideBind';
import { GuideBtnIds } from './GuideConst';
import { GuideUI } from './GuideUI';

/*
 * @Author: zs
 * @Date: 2022-09-22 11:28:32
 * @FilePath: \SanGuo2.4\assets\script\game\com\guide\GuideMgr.ts
 * @Description:
 */

interface IGuideNodeInfo {
    node: cc.Node,
    guiParent: cc.Node,
}

export class GuideMgr {
    private static _i: GuideMgr;
    public static get I(): GuideMgr {
        if (!this._i) {
            this._i = new GuideMgr();
            this._i.init();
        }
        return this._i;
    }
    private debug: boolean = false;
    /** 是否引导中 */
    private _isDoing: boolean = false;
    public get isDoing(): boolean {
        return this._isDoing;
    }

    public set isDoing(b: boolean) {
        if (b) {
            EventClient.I.off(E.Task.CompletedTask, this.onCompletedTask, this);
            EventClient.I.on(E.Task.CompletedTask, this.onCompletedTask, this);
        } else {
            EventClient.I.off(E.Task.CompletedTask, this.onCompletedTask, this);
        }
        this._isDoing = b;
    }

    private onCompletedTask(taskIds: number[]) {
        if (taskIds.indexOf(this.curLinkTaskId) >= 0) {
            // 当前指引的任务完成了
            console.log('完成了当前任务，继续指引');
            this.continueGuide();
        }
    }

    /** 当前指引的任务id */
    public get curLinkTaskId(): number {
        return this._curLinkTask?.Id || 0;
    }

    private nodeInfoById: { [id: number]: IGuideNodeInfo[] } = cc.js.createMap(true);
    private cfgLinkTask: ConfigIndexer;
    private cfgTaskGuide: ConfigIndexer;
    private init() {
        this.isDoing = true;
        this.cfgLinkTask = Config.Get(Config.Type.Cfg_LinkTask);
        this.cfgTaskGuide = Config.Get(Config.Type.Cfg_TaskGuide);
    }

    public bindScript(id: GuideBtnIds, node: cc.Node, guiParent?: cc.Node): void {
        if (!GuideMgr.I.isDoing) {
            return;
        }
        let s = node.getComponent(GuideBind);
        if (!s) {
            s = node.addComponent(GuideBind);
        }
        node.addComponent(GuideBind).bind(id, guiParent);
    }

    private indexOf(id: number, node: cc.Node): number {
        const nodeInfos: IGuideNodeInfo[] = this.nodeInfoById[id] || [];
        if (!node) {
            return nodeInfos.length - 1;
        }
        for (let i = 0, n = nodeInfos.length; i < n; i++) {
            if (nodeInfos[i].node === node) {
                return i;
            }
        }
        return -1;
    }

    /** 绑定 */
    public bind(id: GuideBtnIds, node: cc.Node, guiParent?: cc.Node): void {
        if (!this.isDoing) {
            return;
        }
        guiParent = guiParent || node.parent || node;
        const nodeInfo: IGuideNodeInfo[] = this.nodeInfoById[id] = this.nodeInfoById[id] || [];
        const index = this.indexOf(id, node);
        if (index >= 0) {
            if (nodeInfo[index].guiParent !== guiParent) {
                nodeInfo[index].guiParent = guiParent;
            } else {
                // 重复绑定，不继续下一步
                return;
            }
        } else {
            nodeInfo.push({ node, guiParent });
        }
        if (this.debug) {
            console.log('绑定，按钮id，需要的按钮id，上一步，当前步数=', id, this.taskGuides[this.curStep]?.ButtonID, this.curStep);
        }
        if (!GameApp.I.IsBattleIng && this.taskGuides.length > 0 && this.taskGuides[this.curStep]?.ButtonID === id) {
            if (this.debug) {
                console.log('绑定后继续下一步');
            }
            // eslint-disable-next-line max-len
            if (this.taskGuides[this.curStep]?.ButtonID === GuideBtnIds.GameLevelFight && this.isCompleteTask() && WinMgr.I.checkIsOpen(ViewConst.GameLevelWin)) {
                // 完成任务的话，如果是第一步，那么就直接指引最后一步
                this.curStep = this.curStep || this.taskGuides.length - 1;
                if (this.debug) {
                    console.log('完成任务的话，如果是第一步，那么就直接指引最后一步=', this.curStep);
                }
            }
            if (!this.isPasuseGuide()) {
                this.continueGuide();
            }
        }
    }

    /** 解绑 */
    public unbind(id: GuideBtnIds, node?: cc.Node): void {
        if (!GuideMgr.I.isDoing) {
            return;
        }
        const nodeInfo: IGuideNodeInfo[] = this.nodeInfoById[id] = this.nodeInfoById[id] || [];
        const length = nodeInfo.length;
        if (length > 0) {
            const index = this.indexOf(id, node);
            if (index >= 0) {
                if (nodeInfo[index]?.guiParent?.isValid && nodeInfo[index]?.guiParent?.getChildByName('GuideUI')?.isValid) {
                    nodeInfo[index]?.guiParent?.getChildByName('GuideUI')?.destroy();
                }
                nodeInfo.splice(index, 1);
            }
        }
    }

    public getNodeInfoById(id: number): IGuideNodeInfo | undefined {
        const nodeInfos: IGuideNodeInfo[] = this.nodeInfoById[id] || [];
        return nodeInfos[nodeInfos.length - 1];
    }

    /** 改变节点信息索引 */
    public changeNodeInfoIndex(id: number, node: cc.Node): void {
        const nodeInfos: IGuideNodeInfo[] = this.nodeInfoById[id] || [];
        for (let i = 0, n = nodeInfos.length; i < n; i++) {
            if (nodeInfos[i].node === node) {
                const temp = nodeInfos[0];
                nodeInfos[0] = nodeInfos[i];
                nodeInfos[i] = temp;
                break;
            }
        }
    }

    /** 当前步骤的配置 */
    private curStepTaskGuide: Cfg_TaskGuide;
    /** 当前指引的任务 */
    private _curLinkTask: Cfg_LinkTask;
    /** 该任务的配置表的步骤列表 */
    private taskGuides: Cfg_TaskGuide[] = [];
    /** 当前指引ui脚本组件 */
    private guideUI: GuideUI;
    private taskId: number = 0;
    public show(taskId: number, step: number = 0): boolean {
        step = step || 0;
        this.taskId = taskId;
        if (taskId !== this._curLinkTask?.Id) {
            this._curLinkTask = this.cfgLinkTask.getValueByKey(taskId);
            if (!this._curLinkTask) {
                return false;
            }
            this.taskGuides.length = 0;
            this._curLinkTask.TaskGuid?.split(',')?.forEach((id) => {
                this.taskGuides.push(this.cfgTaskGuide.getValueByKey(+id));
            });
        }
        const cfgTaskGuide: Cfg_TaskGuide = this.taskGuides[step];
        if (!cfgTaskGuide) {
            return false;
        }
        const info = this.getNodeInfoById(cfgTaskGuide.ButtonID);
        if (info) {
            this.curStep = step;
            this.curStepTaskGuide = cfgTaskGuide;
            console.log('开始this.curStep=', this.curStep);
            const parent = info.guiParent;
            if (this.guideUI?.node?.parent !== parent) {
                this.guideUI?.node?.destroy();
                this.guideUI = parent.getChildByName('GuideUI')?.getComponent(GuideUI);
            }
            if (this.guideUI) {
                this.guideUI.setData(cfgTaskGuide, step);
            } else {
                ResMgr.I.loadLocal(UI_PATH_ENUM.GuideUI, cc.Prefab, (e, p: cc.Prefab) => {
                    let has = this.guideUI && this.guideUI.node && this.guideUI.isValid;
                    if (has) {
                        // p.destroy();
                    } else if (!parent || !parent.isValid) {
                        // p.destroy();
                    } else {
                        const n: cc.Node = cc.instantiate(p);
                        parent.addChild(n);
                        this.guideUI = n.getComponent(GuideUI);
                        has = true;
                    }
                    if (has) {
                        this.guideUI.setData(cfgTaskGuide, step);
                    }
                });
            }
            return true;
        }
        this.curStep = Math.max(this.curStep, 0);
        return false;
    }

    public test(taskId: number): void {
        const s = new S2CMainTaskInfo();
        s.CurTaskId = taskId;
        TaskMgr.I.setMainTaskInfo(s);
        GuideMgr.I.show(TaskMgr.I.curMainTaskCfg.Id);
    }

    public curStepIsDoing(step: number): boolean {
        return this.curStepTaskGuide === this.taskGuides[step];
    }

    /**
     * 当前指引的是否是该按钮
     * @param btnId 按钮id
     * @returns
     */
    public isDoingByBtnId(btnId: number): boolean {
        return this.curStepTaskGuide?.ButtonID === btnId;
    }

    /**
     * 下一步指引是否是该按钮
     * @param btnId 按钮id
     * @returns
     */
    public isNextStepBtnId(btnId: number): boolean {
        const guide = this.taskGuides[this.curStep + 1];
        return guide?.ButtonID === btnId;
    }

    /** 根据按钮id改变当前指引步骤 */
    public changeCurStepByBtnId(btnId: number): boolean {
        for (let i = 0, n = this.taskGuides.length; i < n; i++) {
            if (this.taskGuides[i].ButtonID === btnId) {
                this.curStep = i;
                this.continueGuide();
                return true;
            }
        }
        return false;
    }

    public continueGuide(): void {
        console.log('继续指引=', this.curStep);
        if (this.guideUI && this.guideUI.node && this.guideUI.node.isValid) {
            const cfgTaskGuide = this.taskGuides[this.curStep];
            if (cfgTaskGuide) {
                if (cfgTaskGuide && this.nodeInfoById[cfgTaskGuide.ButtonID] && this.nodeInfoById[cfgTaskGuide.ButtonID].length) {
                    this.curStepTaskGuide = cfgTaskGuide;
                    this.guideUI.setData(cfgTaskGuide, this.curStep);
                }
            }
        } else {
            this.show(this._curLinkTask?.Id, this.curStep);
        }
    }

    /** 下一步指引 */
    public nextGuide(step?: number): void {
        if (UtilBool.isNullOrUndefined(step)) {
            step = this.curStep + 1;
        }
        this.curStep = step;
        if (this.debug) {
            console.log('下一步的指引步骤是=', this.curStep);
        }
        if (this.taskGuides[this.curStep]) {
            if (this.isPasuseGuide()) {
                if (this.debug) {
                    console.log('当前是返回按钮，未完成任务，什么都不做');
                }
            } else {
                this.continueGuide();
            }
        } else {
            if (this.debug) {
                console.log('步骤超过当前任务的指引步骤数量，清空指引=', this.taskGuides);
            }
            this.clearCur();
        }
    }
    private _curStep: number = 0;
    public get curStep(): number {
        return this._curStep;
    }
    public set curStep(s: number) {
        if (s > this._curStep) {
            if (this.debug) {
                console.log('到下一步骤=', s);
            }
        }
        this._curStep = s;
    }

    /** 是否显示着引导 */
    public isShowGuideUI(): boolean {
        return this.guideUI && this.guideUI.node && this.guideUI.isValid;
    }

    /** 是否完成当前指引的任务 */
    public isCompleteTask(): boolean {
        if (this.taskId) {
            return TaskMgr.I.isCompleted(this.taskId);
        } else {
            return false;
        }
    }

    /** 是否需要暂停指引，因为上一步骤走完，当前步骤是返回，但是任务未完成 */
    public isPasuseGuide(): boolean {
        return this.taskGuides[this.curStep]?.ButtonID === GuideBtnIds.Black && !this.isCompleteTask();
    }

    public clearCur(): void {
        console.log('clearCurStep');
        const id = this._curLinkTask?.Id;
        this.curStep = -1;
        this._curLinkTask = undefined;
        EventClient.I.emit(E.Guide.ClearGuideComplete, id);
        if (this.guideUI?.node?.isValid) {
            this.guideUI.node.destroy();
        }
    }
}
// eslint-disable-next-line dot-notation
window['GuideMgr'] = GuideMgr;
