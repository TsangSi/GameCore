/*
 * @Author: hwx
 * @Date: 2022-05-27 20:01:09
 * @FilePath: \SanGuo\assets\script\game\module\bag\v\BagItemGrid.ts
 * @Description: 背包道具格子
 */
import { ResMgr } from '../../../../app/core/res/ResMgr';
import ItemModel from '../../../com/item/ItemModel';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { BagItemIcon } from './BagItemIcon';

const { ccclass, property } = cc._decorator;

@ccclass
export class BagItemGrid extends cc.Component {
    /** 图标 */
    private icon: BagItemIcon;
    /** 物品加载中状态 */
    private loading: boolean = false;

    public loadIcon(itemModel: ItemModel): void {
        if (this.loading) { return; }

        if (this.icon) {
            this.icon.setData(itemModel);
        } else {
            this.loading = true;
            ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Bag_BagItemIcon, this.node, (err, node) => {
                this.loading = false;
                if (err) { return; }

                const icon = node.getComponent(BagItemIcon);
                if (icon) {
                    icon.setData(itemModel);
                    this.icon = icon;
                }
                this.getComponent(cc.Sprite).enabled = false;
            });
        }
    }

    public clearIcon(): void {
        if (this.icon) {
            this.icon.node.destroy();
            this.icon = null;
            this.getComponent(cc.Sprite).enabled = true;
        }
    }
}
