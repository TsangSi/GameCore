/*
 * @Author: hwx
 * @Date: 2022-06-17 14:19:14
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsPickItemsPart.ts
 * @Description: 道具Tips自选宝箱部件
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../item/ItemIcon';
import ItemModel from '../../item/ItemModel';
import { BaseItemTipsPart } from './BaseItemTipsPart';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsPickItemsPart extends BaseItemTipsPart {
    @property(cc.ScrollView)
    private SvAwardItems: cc.ScrollView = null;

    private pickItemModelList: ItemModel[] = [];

    @property(cc.Node)
    private SprBtn: cc.Node = null;

    @property(cc.Node)
    private content: cc.Node = null;
    @property(cc.Node)
    private view: cc.Node = null;
    /** list展开 */
    private _BtnStateSpread = false;

    public start(): void {
        UtilGame.Click(this.SprBtn, this._onSpread, this);
    }

    private _onSpread() {
        if (this._BtnStateSpread) {
            this._BtnStateSpread = false;
            // console.log('收缩');
            // this.SvAwardItems.node.getComponent(UITransform).height = 180;
            // this.view.getComponent(UITransform).height = 180;
            this.SvAwardItems.node.height = 180;
            this.view.height = 180;
            // this.SprBtn.scale.set(1, 1, 1);
            this.SprBtn.scale = 1;
        } else {
            this._BtnStateSpread = true;
            const cH = this.content.height;
            if (cH >= 500) {
                this.SvAwardItems.node.height = 500;
                this.view.height = 500;
            } else {
                this.SvAwardItems.node.height = cH;
                this.view.height = cH;
            }
            this.SprBtn.scaleX = 1;
            this.SprBtn.scaleY = -1;
        }
    }

    public refresh(): void {
        const itemModelList = UtilItem.ParseAwardItems(this.itemModel.cfg.Contain);
        UtilCocos.LayoutFill(this.SvAwardItems.content, (item, index) => {
            const comp = item.getComponent(ItemIcon);
            if (comp) {
                comp.setData(itemModelList[index], { needName: true, needNum: true, isDarkBg: true });
            }
        }, itemModelList.length);

        this.pickItemModelList = itemModelList;

        this.SprBtn.active = itemModelList.length > 4;
    }

    public getPickItemModelList(): ItemModel[] {
        return this.pickItemModelList;
    }
}
