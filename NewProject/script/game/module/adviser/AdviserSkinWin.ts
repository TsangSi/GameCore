/*
 * @Author: zs
 * @Date: 2023-03-06 11:18:02
 * @Description:
 *
 */
import { IWinTabData } from '../../../app/core/mvc/WinConst';
import WinTabFrame from '../../com/win/WinTabFrame';
import { FuncId } from '../../const/FuncConst';
import { FuncDescConst } from '../../const/FuncDescConst';
import { UI_PATH_ENUM } from '../../const/UIPath';
import ControllerMgr from '../../manager/ControllerMgr';
import { RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import RedDotModelMgr from '../reddot/RedDotModelMgr';
import { EAdviserTabId } from './AdviserConst';

const { ccclass } = cc._decorator;

@ccclass
export class AdviserSkinWin extends WinTabFrame {
    public initWin(...param: unknown[]): void {
        // ControllerMgr.I.AdviserController.C2SAdviserInfo();
    }
    public getTabData(): IWinTabData[] {
        return this.getPageConfig();
    }

    /** 获取商城页签配置数据 */
    private getPageConfig() {
        const tabs: IWinTabData[] = [];
        tabs.push({
            TabId: EAdviserTabId.Level,
            className: 'AdviserPage',
            // TabBtnId: TabBtnId.BeautyPage_Up,
            funcId: FuncId.Adviser,
            prefabPath: UI_PATH_ENUM.AdviserPage,
            redId: RID.Forge.Adviser.UpLevel,
        });
        tabs.push({
            TabId: FuncId.AdviserGrade,
            className: 'GradePage',
            // TabBtnId: TabBtnId.BeautyPage_Grade,
            prefabPath: UI_PATH_ENUM.GradePage,
            funcId: FuncId.AdviserGrade,
            redId: RID.Forge.Adviser.Grade.Id,
        });
        tabs.push({
            TabId: EAdviserTabId.Mastery,
            className: 'AdviserMasteryPage',
            // TabBtnId: TabBtnId.BeautyPage_Star,
            prefabPath: UI_PATH_ENUM.AdviserMasteryPage,
            funcId: FuncId.AdviserMastery,
            redId: RID.Forge.Adviser.Mastery.Id,
        });
        return tabs;
    }
}
