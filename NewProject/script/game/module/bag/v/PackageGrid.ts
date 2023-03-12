/*
 * @Author: dcj
 * @Date: 2022-11-02 11:54:39
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\bag\v\PackageGrid.ts
 * @Description:收益包裹格子
 */
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { UI_PATH_ENUM } from '../../../const/UIPath';

const { ccclass } = cc._decorator;

@ccclass
export class PackageGrid extends cc.Component {
    /** 图标 */
    private icon: ItemIcon;
    /** 物品加载中状态 */
    private loading: boolean = false;

    public loadIcon(itemModel: ItemModel): void {
        if (this.loading) { return; }

        if (this.icon) {
            this.icon.setData(itemModel, { needNum: true });
        } else {
            this.loading = true;
            ResMgr.I.showPrefab(UI_PATH_ENUM.Com_Item_ItemIcon, this.node, (err, node) => {
                this.loading = false;
                if (err) { return; }

                const icon = node.getComponent(ItemIcon);
                if (icon) {
                    icon.setData(itemModel, { needNum: true });
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
