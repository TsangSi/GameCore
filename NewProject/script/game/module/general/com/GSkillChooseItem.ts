/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-08-23 10:34:41
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\com\GSkillChooseItem.ts
 * @Description: 升级道具展示
 *
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { UtilGame } from '../../../base/utils/UtilGame';
import ItemModel from '../../../com/item/ItemModel';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GSkillChooseItem extends BaseCmp {
    @property(ItemIcon)
    private ItemIcon: ItemIcon = null;
    @property(cc.Node)
    private NdClick: cc.Node = null;
    @property(cc.Node)
    private NdSelect: cc.Node = null;
    @property(cc.Label)
    private LabName: cc.Label = null;

    private _itemId: number = 0;
    private _skillId: number = 0;
    private _callback: (itemId: number, skillId: number) => void = null;
    private _context: any;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdClick, () => {
            if (this._callback) {
                this._callback.call(this._context, this._itemId, this._skillId);
            }
        }, this);
    }

    /**
     * 展示
     * @param itemId 道具id
     * @param exp 经验
     * @param isSelected 选中状态
     * @param callback 回调
     */
    public setData(item: ItemModel, isSelected: boolean, callback: (itemId: number, skillId: number) => void = null, context: any = null): void {
        this.ItemIcon.setData(item, { needNum: true, needName: true });
        this.NdSelect.active = !!isSelected;
        this._itemId = item.cfg.Id;
        this._skillId = item.cfg.Param;
        this._callback = callback;
        this._context = context;
    }

    /**
     * 选中状态
     */
    public setSelected(isSelected: boolean): void {
        this.NdSelect.active = !!isSelected;
    }
}
