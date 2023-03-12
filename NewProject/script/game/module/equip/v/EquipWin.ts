/*
 * @Author: kexd
 * @Date: 2022-10-26 17:22:18
 * @FilePath: \SanGuo2.4\assets\script\game\module\equip\v\EquipWin.ts
 * @Description:
 *
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { equipTabDataArr, EquipWinTabType } from '../EquipConst';

const { ccclass } = cc._decorator;

@ccclass
export default class EquipWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        return equipTabDataArr;
    }
    public initWin(param: unknown[]): void {
        //
    }
    public refreshView(param: unknown[]): void {
        this.WinTab.reTabWin.apply(this.WinTab, param);
    }
}
