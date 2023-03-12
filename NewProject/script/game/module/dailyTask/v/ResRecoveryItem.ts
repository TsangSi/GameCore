/*
 * @Author: myl
 * @Date: 2023-02-08 18:42:58
 * @Description:
 */

import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilItemList from '../../../base/utils/UtilItemList';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { ResRecoveryType } from '../DailyTaskConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResRecoveryItem extends cc.Component {
    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.Label)
    private LabNum: cc.Label = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Node)
    private BtnGet: cc.Node = null;

    @property(cc.RichText)
    private RichTip: cc.RichText = null;

    @property(cc.Node)
    private NdLeft: cc.Node = null;
    @property(cc.Node)
    private NdReward: cc.Node = null;
    @property(cc.Node)
    private NdScroll: cc.Node = null;
    @property(cc.Node)
    private NdScrollView: cc.Node = null;

    private _data: { cfg: Cfg_Resource, data: ResRecoveredReward } = null;
    private _listData: ItemInfo[] = [];
    public setData(d: { cfg: Cfg_Resource, data: ResRecoveredReward }, isHalf: boolean): void {
        this._data = d;
        this.LabName.string = d.cfg.Des;
        this._listData = d.data.ItemInfos;
        this.SprIcon.loadImage(UtilItem.GetItemIconPathByItemId(d.cfg.CostItemId, 1, true), 1, true);
        this.LabNum.string = `${d.cfg.CostItemNum * (isHalf ? 0.5 : 1)}`;
        this.RichTip.string = UtilString.FormatArray(i18n.tt(Lang.res_recovery_times), [UtilColor.GreenV, d.data.Count]);

        if (d.data.ItemInfos.length < 5) {
            this.NdScroll.active = false;
            this.NdReward.parent = this.NdLeft;
            this.NdReward.getComponent(cc.Layout).resizeMode = cc.Layout.ResizeMode.NONE;
        } else {
            this.NdScroll.active = true;
            this.NdReward.parent = this.NdScrollView;
            this.NdReward.getComponent(cc.Layout).resizeMode = cc.Layout.ResizeMode.CONTAINER;
        }
        const arr = [];
        for (let i = 0; i < d.data.ItemInfos.length; i++) {
            const item = d.data.ItemInfos[i];
            const itemModel = UtilItem.NewItemModel(item.ItemId, item.ItemNum);
            arr.push(itemModel);
        }
        UtilItemList.ShowItemArr(this.NdReward, arr, { option: { needNum: true } });
    }

    private scrollEvent(nd: cc.Node, idx: number): void {
        const itemIcon = nd.getComponent(ItemIcon);
        const item = this._listData[idx];
        const itemModel = UtilItem.NewItemModel(item.ItemId, item.ItemNum);
        itemIcon.setData(itemModel, { needNum: true });
    }

    protected start(): void {
        UtilGame.Click(this.BtnGet, () => {
            WinMgr.I.open(ViewConst.ResRecoveryBuyWin, 1, this._data, (num: number) => {
                if (num <= 0) return;
                ControllerMgr.I.DailyTaskController.getResReward(this._data.cfg.Type, this._data.cfg.Id, num);
            });
        }, this);
    }
}
