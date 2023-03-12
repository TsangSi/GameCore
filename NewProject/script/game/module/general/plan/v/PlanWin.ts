/*
 * @Author: kexd
 * @Date: 2022-08-16 14:11:44
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\general\plan\v\PlanWin.ts
 * @Description: 武将-布阵
 */
import { IWinTabData } from '../../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../../com/win/WinTabFrame';
import { FuncId } from '../../../../const/FuncConst';
import { TabBtnId } from '../../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { RedDotCheckMgr } from '../../../reddot/RedDotCheckMgr';
import { RID } from '../../../reddot/RedDotConst';
import { RedDotMgr } from '../../../reddot/RedDotMgr';
import { PlanPageType } from '../PlanConst';

const { ccclass } = cc._decorator;

@ccclass
export default class PlanWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: PlanPageType.Plan,
                className: 'PlanPage',
                prefabPath: UI_PATH_ENUM.PlanPage,
                TabBtnId: TabBtnId.PlanPage,
                redId: RID.General.Main.Plan.Id,
            },
            {
                TabId: PlanPageType.TeamPlan,
                TabBtnId: TabBtnId.TeamPlan,
                className: 'TeamPlanPage',
                prefabPath: UI_PATH_ENUM.TeamPlanPage,
                funcId: FuncId.TeamPlanPage,
                redId: RID.MaterialFB.Team.TeamPlan,
            },
        ];
        return tabDataArr;
    }

    /** 窗口初始化回调 */
    public initWin(...param: unknown[]): void {
        // 其他初始化逻辑
        if (RedDotMgr.I.getRedCount(RID.General.Main.Plan.General)) {
            RedDotCheckMgr.I.emit(RID.General.Main.Plan.Beauty);
        }
    }
}
