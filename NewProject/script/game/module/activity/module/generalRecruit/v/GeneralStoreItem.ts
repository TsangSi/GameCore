/*
 * @Author: kexd
 * @Date: 2022-12-05 14:06:24
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\module\generalRecruit\v\GeneralStoreItem.ts
 * @Description:
 *
 */
import { ResMgr } from '../../../../../../app/core/res/ResMgr';
import { ItemIcon } from '../../../../../com/item/ItemIcon';
import ItemModel from '../../../../../com/item/ItemModel';
import { UI_PATH_ENUM } from '../../../../../const/UIPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralStoreItem extends cc.Component {
    /** 图标 */
    private icon: ItemIcon = null;
    /** 物品加载中状态 */
    private loading: boolean = false;
    /** 选中 */
    @property(cc.Node)
    private NdSelect: cc.Node = null;

    @property(cc.Node)
    private NdEvent: cc.Node = null;

    @property(cc.Node)
    private SpGL: cc.Node = null;

    public loadIcon(data: ItemModel): void {
        if (this.loading) { return; }

        if (this.icon) {
            this.icon.setData(data, { where: 1, needName: true, needNum: true });
        } else {
            this.loading = true;
            ResMgr.I.showPrefab(UI_PATH_ENUM.Com_Item_ItemIcon, this.node.children[0], (err, node) => {
                this.loading = false;
                if (err) { return; }

                const icon = node.getComponent(ItemIcon);
                if (icon) {
                    icon.setData(data, { where: 1, needName: true, needNum: true });
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

    public NdSelectVisible(bol: boolean): void {
        this.NdSelect.active = bol;
    }

    public NdEventVisible(bol: boolean): void {
        this.NdEvent.active = bol;
    }

    /**
     * 显示概率 或者显示必得
     * @param show 是否显示
     * @param isGL 显示概率 true 显示必得 false
     */
    public showGLBD(show: boolean, isGL: boolean): void {
        this.SpGL.active = show && isGL;
    }
}
