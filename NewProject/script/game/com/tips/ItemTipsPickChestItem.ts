/*
 * @Author: hwx
 * @Date: 2022-06-22 11:26:41
 * @FilePath: \SanGuo\assets\script\game\com\tips\ItemTipsPickChestItem.ts
 * @Description: 道具Tips兑换项
 */
import { i18n, Lang } from '../../../i18n/i18n';
import { NumberChoose } from '../../base/components/NumberChoose';
import { BagMgr } from '../../module/bag/BagMgr';
import { ItemIcon } from '../item/ItemIcon';
import ItemModel from '../item/ItemModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsPickChestItem extends cc.Component {
    @property(ItemIcon)
    private NdIcon: ItemIcon = null;

    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.Label)
    private LabCount: cc.Label = null;

    @property(NumberChoose)
    private NdNumberChoose: NumberChoose = null;

    private _itemData: ItemModel;
    private _pickCb: (itemId: number, itemNum: number) => void;

    private _pickNum: number = 0;

    public setData(itemData: ItemModel, pickCb: (itemId: number, itemNum: number) => void): void {
        this._itemData = itemData;
        this._pickCb = pickCb;

        this.NdIcon.setData(itemData, { needNum: true });

        this.LabName.string = itemData.cfg.Name;

        const own = BagMgr.I.getItemNum(itemData.data.ItemId);
        const ownTitle = i18n.tt(Lang.item_tips_pick_chest_own);
        this.LabCount.string = `${ownTitle} ${own}`;
    }

    private onNumberChooseChange(num: number): void {
        this._pickNum = num;
        if (this._pickCb) {
            this._pickCb(this._itemData.data.ItemId, num);
        }
    }

    public setMaxChooseCount(count: number): void {
        this.NdNumberChoose.setMaxCount(this._pickNum + count);
    }
}
