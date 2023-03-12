/*
 * @Author: kexd
 * @Date: 2022-10-31 14:05:44
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\v\ActivityWin.ts
 * @Description:
 *
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-10-18 11:00:57
 * @FilePath: \SanGuo24\assets\script\game\module\activity\v\WinActivity.ts
 * @Description:活动win
 *
 */

import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import ModelMgr from '../../../manager/ModelMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { EActivityRedId } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { ActivityClassName, ActivityPrefab, ActData } from '../ActivityConst';

const { ccclass } = cc._decorator;

@ccclass
export default class ActivityWin extends WinTabFrame {
    private _containerId: number = 0;
    /**
     * 活动类名
     */
    public getClassName(ActType: number): string {
        return ActivityClassName[ActType];
    }

    /** 活动预制 */
    public getActivityPrefab(ActType: number): string {
        return ActivityPrefab[ActType];
    }

    public init(param: unknown[]): void {
        console.log('WinActivity-------init', param);
        const funcId: number = param[0] as number;
        let actIds: number[] = ModelMgr.I.ActivityModel.getActsByContainerId(funcId);
        if (!actIds) {
            const actData: ActData = ModelMgr.I.ActivityModel.getActivityData(funcId);
            if (actData) {
                const containerId: number = actData.Config.ContainerId;
                if (containerId) {
                    this._containerId = containerId;
                    actIds = ModelMgr.I.ActivityModel.getActsByContainerId(containerId);
                }
            }
        } else {
            this._containerId = funcId;
        }
        if (!actIds || !actIds.length || !this._containerId) {
            console.log('没有该活动数据：', funcId);
            return;
        }
        // 排序
        actIds.sort((a, b) => {
            const actA: ActData = ModelMgr.I.ActivityModel.getActivityData(a);
            const actB: ActData = ModelMgr.I.ActivityModel.getActivityData(b);
            if (actA && actB) {
                if (actA.Config.Order !== actB.Config.Order) {
                    return actA.Config.Order - actB.Config.Order;
                }
                return actA.Config.FuncId - actB.Config.FuncId;
            }
            return -1;
        });
        // 生成页签数据
        const tabDataArr: IWinTabData[] = [];
        for (let i = 0; i < actIds.length; i++) {
            const actData: ActData = ModelMgr.I.ActivityModel.getActivityData(actIds[i]);
            // 活动类的不需要传入funcId，这个funcId会去检查功能开放的
            const d: IWinTabData = {
                TabId: actData.FuncId,
                className: this.getClassName(actData.Config.ActType),
                prefabPath: this.getActivityPrefab(actData.Config.ActType),
                redId: EActivityRedId + actData.FuncId,
                ActBtnName: actData.Config.Name,
                TabBtnId: actData.Config.WinPicName,
                descId: actData.Config.ClientMsg,
            };

            tabDataArr.push(d);
        }

        this.WinTab.uiId = this.viewVo.id;
        const tabData = tabDataArr;
        this.WinTab.viewVo.tabData = tabData.filter((v) => UtilFunOpen.canShow(v.funcId));
        this.WinTab.context = this;
        this.WinTab.setBtnClickFunc(this.checkBtnClick);
        this.WinTab.setChangeTabFunc(this.changeTab);
        this.WinTab.init.apply(this.WinTab, param);
        this.initWin.apply(this, param);

        this.uptRed();
    }

    /** 刷新入口红点 */
    private uptRed() {
        this.scheduleOnce(() => {
            if (this.node && this.node.isValid) {
                const actIds: number[] = ModelMgr.I.ActivityModel.getActsByContainerId(this._containerId);
                for (let i = 0; i < actIds.length; i++) {
                    const actData: ActData = ModelMgr.I.ActivityModel.getActivityData(actIds[i]);
                    RedDotMgr.I.updateRedDot(EActivityRedId + actData.FuncId, !!actData.Red);
                }
            }
        }, 0.2);
    }

    /** 实际上没用的 */
    public getTabData(): IWinTabData[] {
        return [];
    }

    /** 窗口初始化回调 */
    public initWin(param: unknown[]): void {
        // console.log('WinActivity-------initWin', param);
    }

    /** 刷新页签 */
    public refreshView(param: unknown[]): void {
        this.WinTab.reTabWin.apply(this.WinTab, param);
    }
}
