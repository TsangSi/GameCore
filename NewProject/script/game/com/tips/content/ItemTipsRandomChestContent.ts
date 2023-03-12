/*
 * @Author: hwx
 * @Date: 2022-06-14 20:31:45
 * @FilePath: \SanGuo\assets\script\game\com\tips\content\ItemTipsRandomChestContent.ts
 * @Description: 随机宝箱Tips
 */

import WinMgr from '../../../../app/core/mvc/WinMgr';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { BaseItemTipsContent } from './BaseItemTipsContent';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsRandomChestContent extends BaseItemTipsContent {
    private _useNum: number = 0;

    /**
     * 选择数量变化
     */
    private onNumberChooseChange(num: number): void {
        this._useNum = num;
    }

    /**
     * 点击使用按钮
     */
    protected onClickUseButton(): void {
        if (this._useNum > 0) {
            WinMgr.I.close(ViewConst.ItemTipsWin);
            ControllerMgr.I.BagController.itemUseHandler(this.itemModel, this._useNum);
        } else {
            MsgToastMgr.Show('请选择使用的数量');
        }
    }
}
