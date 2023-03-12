/*
 * @Author: hwx
 * @Date: 2022-06-17 12:26:07
 * @FilePath: \SanGuo2.4\assets\script\game\com\tips\content\BaseItemTipsContent.ts
 * @Description: 道具提示内容
 */
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { ItemTipsOptions, ItemWhere } from '../../item/ItemConst';
import ItemModel from '../../item/ItemModel';
import { BaseItemTipsPart } from '../part/BaseItemTipsPart';

const { ccclass, property } = cc._decorator;

@ccclass
export class BaseItemTipsContent extends cc.Component {
    @property({
        type: BaseItemTipsPart,
    })
    protected parts: BaseItemTipsPart[] = [];

    protected itemModel: ItemModel;
    protected opts: ItemTipsOptions;

    /**
     * 设置数据
     * @param itemModel 道具数据
     * @param where 道具在哪：1-背包，999-其他
     */
    public setData(itemModel: ItemModel, opts: ItemTipsOptions): void {
        this.itemModel = itemModel;
        this.opts = opts;

        // 设置部件数据
        for (let i = 0, len = this.parts.length; i < len; i++) {
            const part = this.parts[i];
            if (part) {
                part.setData(itemModel, opts);
            }
        }
    }

    public getPart<T extends BaseItemTipsPart>(Ctor: any): any {
        for (let i = 0, len = this.parts.length; i < len; i++) {
            const part = this.parts[i];
            if (part && part instanceof Ctor) {
                return part;
            }
        }
        return null;
    }

    /**
     * 点击使用按钮
     */
    protected onClickUseButton(event: TouchEvent): void {
        WinMgr.I.close(ViewConst.ItemTipsWin);
        ControllerMgr.I.BagController.itemUseHandler(this.itemModel);
    }
}
