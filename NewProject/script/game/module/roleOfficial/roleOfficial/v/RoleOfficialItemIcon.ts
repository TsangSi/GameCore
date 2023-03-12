/*
 * @Author: myl
 * @Date: 2022-10-17 14:14:24
 * @Description:
 */

import UtilItemList from '../../../../base/utils/UtilItemList';
import { ItemWhere } from '../../../../com/item/ItemConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleOfficialItemIcon extends cc.Component {
    @property(cc.Node)
    private itemIcon: cc.Node = null;

    public setData(itemData: string): void {
        UtilItemList.ShowItems(this.itemIcon, itemData, { option: { needNum: true, where: ItemWhere.OTHER } });
        // this.itemIcon.setData(itemData, { needNum: true, where: ItemWhere.OTHER });
    }
}
