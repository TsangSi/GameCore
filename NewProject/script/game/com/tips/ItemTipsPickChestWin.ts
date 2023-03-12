/*
 * @Author: hwx
 * @Date: 2022-06-22 17:42:19
 * @FilePath: \SanGuo\assets\script\game\com\tips\ItemTipsPickChestWin.ts
 * @Description:
 */
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilItem from '../../base/utils/UtilItem';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import { BagMgr } from '../../module/bag/BagMgr';
import ItemModel from '../item/ItemModel';
import WinBase from '../win/WinBase';
import { ItemTipsPickChestItem } from './ItemTipsPickChestItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsPickChestWin extends WinBase {
    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.Label)
    private LabCount: cc.Label = null;

    @property(cc.Sprite)
    private SprCloseButton: cc.Sprite = null;

    @property(cc.ScrollView)
    private SvPickItems: cc.ScrollView = null;

    @property(cc.Node)
    private NdExchangeButton: cc.Node = null;

    /** 自选宝箱道具 */
    private _itemModel: ItemModel;

    /** 自选信息容器 <道具ID, 道具数量> */
    private _pickInfoMap: Map<number, number> = new Map();

    @property(cc.Node)
    private NdToggleAuto: cc.Node = null;

    private _count: number = 0;
    private get count(): number { return this._count; }
    private set count(value: number) {
        this._count = value;
        this.refreshCount();
    }

    private changeItemMaxChooseCountFuncs: ((count: number) => void)[] = [];

    protected start(): void {
        super.start();

        UtilGame.Click(this.SprCloseButton.node, () => {
            WinMgr.I.close(ViewConst.ItemTipsPickChestWin);
        }, this, { scale: 0.9 });

        UtilGame.Click(this.NdExchangeButton, () => {
            if (this._pickInfoMap.size > 0) {
                const list = [];
                const onlyId = this._itemModel.data.OnlyId;
                this._pickInfoMap.forEach((awardItemCount, awardItemId) => {
                    list.push({ OnlyId: onlyId, Count: awardItemCount, Param: awardItemId });
                });
                ControllerMgr.I.BagController.reqC2SBatchExchange(list);
                WinMgr.I.close(ViewConst.ItemTipsPickChestWin);
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.com_msg_choose_count));
            }
        }, this);

        this.NdToggleAuto.on('toggle', this._onSelect, this);
    }

    private _onSelect() {
        const ck: boolean = this.NdToggleAuto.getComponent(cc.Toggle).isChecked;

        this._data = [];
        if (ck) {
            const tempList = UtilItem.ParseAwardItems(this._itemModel.cfg.Contain);
            for (let i = 0, len = tempList.length; i < len; i++) {
                const own = BagMgr.I.getItemNum(tempList[i].data.ItemId);
                if (own === 0) {
                    this._data.push(tempList[i]);
                }
            }
        } else {
            const itemModelList = UtilItem.ParseAwardItems(this._itemModel.cfg.Contain);
            this._data = itemModelList;
        }
        this._fillLayout();
    }

    private _data: ItemModel[];
    public init(params: [ItemModel]): void {
        this._itemModel = params[0];

        this.LabName.string = this._itemModel.cfg.Name;
        this.count = this._itemModel.data.ItemNum;

        const itemModelList = UtilItem.ParseAwardItems(this._itemModel.cfg.Contain);
        this._data = itemModelList;
        this._fillLayout();
    }

    /** 为了刷新列表 */
    private _fillLayout() {
        UtilCocos.LayoutFill(this.SvPickItems.content, (item, index) => {
            const comp = item.getComponent(ItemTipsPickChestItem);
            comp.setData(this._data[index], (itemId, itemNum) => {
                this._pickInfoMap.set(itemId, itemNum);

                // 更新自选宝箱剩余数量
                let count = 0;
                const values = this._pickInfoMap.values();
                for (const num of values) {
                    count += num;
                }

                this.count = this._itemModel.data.ItemNum - count;

                // 更新自选道具的最大选择数量
                for (let i = 0, len = this.changeItemMaxChooseCountFuncs.length; i < len; i++) {
                    this.changeItemMaxChooseCountFuncs[i](this.count);
                }
            });
            comp.setMaxChooseCount(this.count);
            this.changeItemMaxChooseCountFuncs.push(comp.setMaxChooseCount.bind(comp));
        }, this._data.length);
    }

    private refreshCount(): void {
        const countTitle = i18n.tt(Lang.item_tips_pick_chest_count);
        this.LabCount.string = `${countTitle} ${this._count}`;
    }
}
