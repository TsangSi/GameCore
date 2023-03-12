/*
 * @Author: lijun
 * @Date: 2023-02-14 14:17:47
 * @Description:
 */
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import WinBase from '../../../com/win/WinBase';
import ModelMgr from '../../../manager/ModelMgr';
import { FamilyPos } from '../FamilyConst';

const { ccclass, property } = cc._decorator;

/** 族长特权 */
@ccclass
export class FamilyPowerTip extends WinBase {
    @property(cc.Node)
    private NdSprMask: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    @property(ListView)
    private list: ListView = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => this.close(), this, { scale: 1 });
        UtilGame.Click(this.BtnClose, () => this.close(), this);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    private _rewards: any[][];
    public init(params: any): void {
        // 这里显示的是族长的奖励
        this._rewards = ModelMgr.I.FamilyModel.getCfgFamilyPosReward(FamilyPos.Chiefs, 'Reward1');
        this.list.setNumItems(this._rewards.length, 0);
        this.list.scrollTo(0);
    }

    private onScrollEvent(node: cc.Node, index: number): void { //
        node.scale = 0.7;
        const itemIcon: ItemIcon = node.getComponent(ItemIcon);
        const [itemId, itemNum] = this._rewards[index];
        const itemModel: ItemModel = UtilItem.NewItemModel(Number(itemId), Number(itemNum));
        itemIcon.setData(itemModel, { needNum: true });
    }
}
