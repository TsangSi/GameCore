import BaseController from '../../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import { PlanPageType } from './PlanConst';

/*
 * @Author: kexd
 * @Date: 2022-08-15 16:30:08
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\general\plan\PlanController.ts
 * @Description:
 *
 */
const { ccclass } = cc._decorator;
@ccclass('PlanController')
export default class PlanController extends BaseController {
    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab: number = 0, params: any[] = [0], ...args: any[]): boolean {
        let funcId = FuncId.PlanPage;
        switch (tab) {
            case PlanPageType.Plan:
                funcId = FuncId.PlanPage;
                break;
            case PlanPageType.TeamPlan:
                funcId = FuncId.TeamPlanPage;
                break;
            default:
                break;
        }
        if (UtilFunOpen.isOpen(funcId, true)) {
            WinMgr.I.open(ViewConst.PlanWin, tab, params ? params[0] : 0);
        }
        return true;
    }
    /** 事件监听 */
    public addClientEvent(): void {
        //
    }
    public delClientEvent(): void {
        //
    }
    /** 事件监听 */
    public addNetEvent(): void {
        //
    }
    public delNetEvent(): void {
        //
    }
    /** 清理数据 */
    public clearAll(): void {
        //
    }

    public init(): void {
        //
    }
}
