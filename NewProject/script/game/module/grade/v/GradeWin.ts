/*
 * @Author: hwx
 * @Date: 2022-07-06 14:45:14
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\grade\v\GradeWin.ts
 * @Description: 进阶窗口
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { GradeMgr } from '../GradeMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        return GradeMgr.I.getGradeTabData();
    }

    public init(param: unknown[]): void {
        if (param.length === 0) {
            // 若不指定启动页面，则优先红点标签
            const radIdx = GradeMgr.I.getRedPageIdx();
            param.push(radIdx.wintabId);
            param.push(radIdx.tabIdx);
        }
        super.init(param);
    }

    /** 窗口初始化回调 */
    public initWin(...param: unknown[]): void {
        // 其他初始化逻辑
    }
}
