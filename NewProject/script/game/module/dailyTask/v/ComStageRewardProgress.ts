/*
 * @Author: myl
 * @Date: 2023-02-08 12:03:42
 * @Description:
 */

import { i18n, Lang } from '../../../../i18n/i18n';
import Progress from '../../../base/components/Progress';
import { DailyTaskType } from '../DailyTaskConst';
import ComStageRewardBox, { ComStageRewardBoxStatus, IComStageRewardData } from './ComStageRewardBox';

const { ccclass, property } = cc._decorator;

/** 每日任务活跃度名称提示 */
export enum EStageRewardProgressType {
    Daily = 1,
    Weekly = 2,
}

@ccclass
export default class ComStageRewardProgress extends cc.Component {
    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(cc.Label)
    private LabNum: cc.Label = null;

    @property(Progress)
    private progress: Progress = null;

    /** 宝箱预制体 */
    @property(cc.Prefab)
    private PrefabBox: cc.Prefab = null;

    @property(cc.Node)
    private NdBox: cc.Node = null;

    private _boxData: IComStageRewardData[] = [];

    private _progressGrade: number[] = [15, 42, 70, 100];
    public setData(
        cur: number,
        total: number,
        d: IComStageRewardData[],
        type: DailyTaskType.Daily,
    ): void {
        this.LabNum.string = cur.toString();
        this.LabTitle.string = i18n.tt(type === DailyTaskType.Daily ? Lang.daily_task_activity : Lang.weekly_task_acitvity);
        const spaceX = this.NdBox.width / (d.length - 1);
        let curStageIndex = 0; // 所处在第几阶段

        for (let i = 0; i < d.length; i++) {
            const ele = d[i];
            const nd = this.NdBox.children[i] || cc.instantiate(this.PrefabBox);
            const ndComp = nd.getComponent(ComStageRewardBox);
            ndComp.updateState(ele);
            if (!nd.parent) {
                nd.y = 0;
                nd.x = spaceX + i * spaceX - this.NdBox.width / 2;
                this.NdBox.addChild(nd, i);
            }
            if (cur >= ele.cfgValue) {
                curStageIndex = i + 1;
            }
        }
        if (cur >= d[d.length - 1].cfgValue) {
            this.progress.updateProgressRate(1.0);
            return;
        }
        // 上一阶段的进度值
        const lastCfg = curStageIndex > 0 ? this._progressGrade[curStageIndex - 1] : 0;
        const lastVal = curStageIndex > 0 ? d[curStageIndex - 1].cfgValue : 0;
        // 距离上一阶段的差距

        const curCfg = this._progressGrade[curStageIndex];
        const curVal = d[curStageIndex].cfgValue;

        // 当前进度的标准范围值
        const cfgCurStageProg = (curCfg - lastCfg) / 100;

        const realCurStageProg = curVal - lastVal;
        const disProg = (cur - lastVal) * cfgCurStageProg / realCurStageProg;

        // 上一阶段的比例
        const lastProgValue = lastCfg / 100;
        let prog = disProg + lastProgValue;
        if (cur >= d[d.length - 1].cfgValue) {
            prog = 1;
        }

        // 当前的最大进度
        this.progress.updateProgressRate(prog);
    }

    public set progressGrade(v: number[]) {
        this._progressGrade = v;
    }
}
