/*
 * @Author: hwx
 * @Date: 2022-06-17 14:19:06
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsNumOperatePart.ts
 * @Description: 道具Tips数量操作部件
 */

import { NumberChoose } from '../../../base/components/NumberChoose';
import { ItemType, ItemWhere } from '../../item/ItemConst';
import { BaseItemTipsPart } from './BaseItemTipsPart';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsNumOperatePart extends BaseItemTipsPart {
    @property(NumberChoose)
    public NdNumberChoose: NumberChoose = null;

    /**
     * 刷新
     */
    public refresh(): void {
        // 拥有的数量
        const ownNum = this.itemModel.data.ItemNum;
        if (this.opts?.where === ItemWhere.BAG) {
            this.node.active = true;
        } else {
            // 角色装备界面仅显示，展示按钮
            this.node.active = false;
        }
        // 设置最大的选择数量
        this.NdNumberChoose.setMaxCount(ownNum);
        // 设置当前选择的数量
        this.NdNumberChoose.curCount = ownNum;
    }
}
