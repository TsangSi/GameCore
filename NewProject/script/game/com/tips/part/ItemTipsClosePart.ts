/*
 * @Author: hwx
 * @Date: 2022-06-17 14:20:03
 * @FilePath: \SanGuo2.4\assets\script\game\com\tips\part\ItemTipsClosePart.ts
 * @Description: 道具Tips关闭部件
 */
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ViewConst } from '../../../const/ViewConst';
import { BaseItemTipsPart } from './BaseItemTipsPart';

const { ccclass } = cc._decorator;

@ccclass
export class ItemTipsClosePart extends BaseItemTipsPart {
    protected start(): void {
        UtilGame.Click(this.node, () => {
            WinMgr.I.close(ViewConst.ItemTipsWin);
        }, this, { scale: 1 });
    }

    /**
     * 刷新
     */
    public refresh(): void {
        //
    }
}
