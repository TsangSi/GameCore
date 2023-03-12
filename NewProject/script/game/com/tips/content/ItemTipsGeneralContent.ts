/*
 * @Author: hwx
 * @Date: 2022-06-14 20:12:12
 * @FilePath: \SanGuo2.4-zengsi\assets\script\game\com\tips\content\ItemTipsGeneralContent.ts
 * @Description: 道具Tips
 */
import { ItemTipsOptions, ItemType, ItemWhere } from '../../item/ItemConst';
import ItemModel from '../../item/ItemModel';
import { BaseItemTipsContent } from './BaseItemTipsContent';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsGeneralContent extends BaseItemTipsContent {
    @property(cc.Node)
    private NdCountValue: cc.Node = null;

    public setData(itemModel: ItemModel, opts: ItemTipsOptions): void {
        super.setData(itemModel, opts);
        let visible = true;
        if (itemModel.cfg.Type === ItemType.GEM && opts.where === ItemWhere.OTHER && this.NdCountValue) {
            visible = false;
        }
        this.NdCountValue.active = visible;
    }
}
