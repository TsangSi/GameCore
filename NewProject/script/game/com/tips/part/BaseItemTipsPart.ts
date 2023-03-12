/*
 * @Author: hwx
 * @Date: 2022-06-17 14:27:23
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\BaseItemTipsPart.ts
 * @Description:
 */
import { ItemTipsOptions } from '../../item/ItemConst';
import ItemModel from '../../item/ItemModel';

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class BaseItemTipsPart extends cc.Component {
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

        this.refresh();
    }

    /** 刷新UI */
    protected abstract refresh(): void;
}
