/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-08-23 10:34:41
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\general\com\GeneralItem.ts
 * @Description: 升级道具展示
 *
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { UtilGame } from '../../../base/utils/UtilGame';
import { BagMgr } from '../../bag/BagMgr';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilColor } from '../../../../app/base/utils/UtilColor';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GeneralItem extends BaseCmp {
    @property(ItemIcon)
    private ItemIcon: ItemIcon = null;
    @property(cc.Node)
    private NdClick: cc.Node = null;
    @property(cc.Node)
    private NdSelect: cc.Node = null;
    @property(cc.Label)
    private LabExp: cc.Label = null;
    @property(cc.Label)
    private LabHave: cc.Label = null;
    @property(cc.Label)
    private LabNeed: cc.Label = null;

    private _itemId: number = 0;
    private _callback: (itemId: number) => void = null;
    private _context: any;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdClick, () => {
            if (this._callback) {
                this._callback.call(this._context, this._itemId);
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
    public setData(itemId: number, exp: number, isSelected: boolean, callback: (itemId: number) => void = null, content: any = null): void {
        if (callback) {
            this._callback = callback;
        }

        this._context = content;

        const have: number = BagMgr.I.getItemNum(itemId);
        const itemModel = UtilItem.NewItemModel(itemId, have);
        this.ItemIcon.setData(itemModel, { needNum: true, allNumShow: true });
        this.LabExp.string = `${i18n.tt(Lang.general_exp)}+${exp}`;
        this.NdSelect.active = !!isSelected;
        this._itemId = itemId;
    }

    public setAwakenData(itemId: number, need: number, isSelected: boolean, clickItem: boolean = false, callback: (itemId: number) => void = null, content: any = null): void {
        if (callback) {
            this._callback = callback;
        }
        this._context = content;

        const have: number = BagMgr.I.getItemNum(itemId);
        const itemModel = UtilItem.NewItemModel(itemId, have);
        this.ItemIcon.setData(itemModel, { needNum: false });
        const color: cc.Color = have >= need ? UtilColor.Hex2Rgba(UtilColor.GreenG) : UtilColor.Hex2Rgba(UtilColor.RedG);
        this.LabHave.node.color = color;
        this.LabHave.string = `${UtilNum.Convert(have)}`;
        this.LabNeed.string = `/${UtilNum.Convert(need)}`;
        this.NdSelect.active = !!isSelected;
        this._itemId = itemId;
        this.NdClick.active = !clickItem;
    }

    /**
     * 选中状态
     */
    public setSelected(isSelected: boolean): void {
        this.NdSelect.active = !!isSelected;
    }
}
