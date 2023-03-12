/*
 * @Author: myl
 * @Date: 2022-07-29 16:53:32
 * @Description:
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { ItemWhere } from '../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import { UpStarSelectEquipWin } from './UpStarSelectEquipWin';

const { ccclass, property } = cc._decorator;

@ccclass
export class SelecEquiptItem extends cc.Component {
    @property(ItemIcon)
    private Icon: ItemIcon = null;

    @property(cc.Node)
    private NdSelectStatus: cc.Node = null;

    @property(cc.Node)
    private NdTouch: cc.Node = null;

    /** 是否选中 */
    private isSelect: boolean = false;
    private _idx: number = 0;
    private _itemModel: ItemModel = null;
    private _modelWin: UpStarSelectEquipWin = null;
    private touchClick(isLong: boolean) {
        if (!isLong) {
            if (this._modelWin.getSelectCount() >= 3 && !this.isSelect) {
                MsgToastMgr.Show(i18n.tt(Lang.equip_upstar_more_fail));
                return;
            }
            this.isSelect = !this.isSelect;
            this.updateState();
            EventClient.I.emit(E.UpStar.SelectEquip, [this.isSelect, this._idx]);
        } else {
            // 查看详情
            WinMgr.I.open(ViewConst.ItemTipsWin, this._itemModel, { where: ItemWhere.OTHER });
        }
    }

    private updateState() {
        this.NdSelectStatus.active = this.isSelect;
    }

    public setData(dta: ItemModel, index: number, sta: boolean, win: UpStarSelectEquipWin): void {
        this._modelWin = win;
        this._idx = index;
        this._itemModel = dta;
        this.isSelect = sta;
        this.Icon.setData(dta);
        this.updateState();
    }
}
