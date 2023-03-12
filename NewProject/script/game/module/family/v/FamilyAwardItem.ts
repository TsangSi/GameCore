import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

/** 族长争夺-奖励列表 */
@ccclass
export class FamilyAwardItem extends cc.Component {
    @property(cc.Label)// 昵称
    private LabName: cc.Label = null;

    @property(cc.Label) // 挂机收益
    private LabDesc: cc.Label = null;

    @property(ListView)// 奖励列表
    private list: ListView = null;

    private _rewards: any[][];
    public setData(Id: number): void {
        const cfg: Cfg_FamilyPos = ModelMgr.I.FamilyModel.getCfgFamilyPos(Id);
        const str = cfg.HangingRevenue;
        if (str) {
            const arrStr: string[] = str.split(':');
            this.LabDesc.string = `${i18n.tt(Lang.family_handExp)}+${Number(arrStr[1]) / 100}%`;// 挂机经验
        } else {
            this.LabDesc.string = '';
        }
        this.LabName.string = cfg.PosName;

        const fpInfo: S2CFamilyPatriInfo = ModelMgr.I.FamilyModel.getFamilyPatriInfo();

        if (fpInfo.FirstType === 1) {
            this._rewards = UtilString.SplitToArray(cfg.Reward1);
        } else if (fpInfo.FirstType === 2) {
            this._rewards = UtilString.SplitToArray(cfg.Reward2);
        } else {
            this._rewards = UtilString.SplitToArray(cfg.Reward3);
        }
        this.list.setNumItems(this._rewards.length, 0);
        this.list.scrollTo(0);
    }

    /** 英雄列表 */
    public onScrollRewardEvent(node: cc.Node, index: number): void {
        // 奖励根据新服 合服 第几届来定
        const arr = this._rewards[index];
        const itemId: number = Number(arr[0]);
        const itemNum: number = Number(arr[1]);
        const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);
        const itemIcon: ItemIcon = node.getComponent(ItemIcon);
        itemIcon.setData(itemModel, { needNum: true });
    }
}
