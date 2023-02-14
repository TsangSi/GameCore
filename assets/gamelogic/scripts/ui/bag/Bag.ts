
import { _decorator, Component, Node, js } from 'cc';
import List from '../../../../scripts/component/List';
import { BundleType, ItemType, ItemTypeView } from '../../../../scripts/global/GConst';
import { BaseView } from '../../../../scripts/ui/base/BaseView';
import UIManager from '../../../../scripts/ui/UIManager';
import UtilsCC from '../../../../scripts/utils/UtilsCC';
import { BagItem, ShowItemData } from '../common/BagItem';
import { BagItemManager } from './BagItemManger';
import { ItemViewBag } from './view/ItemViewBag';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = TabBag
 * DateTime = Thu Dec 16 2021 21:51:55 GMT+0800 (中国标准时间)
 * Author = knuth520
 * FileBasename = TabBag.ts
 * FileBasenameNoExtension = TabBag
 * URL = db://assets/gamelogic/scripts/ui/bag/TabBag.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('TabBag')
export class TabBag extends BaseView {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property(List)
    private ScrollviewList: List = null;
    private show_ids: string[] = [];
    private item_view: ItemViewBag;
    start() {
        // [3]
        UtilsCC.setActive('SpriteNo', this.node, false);
        // this.ScrollviewList.scrollTo(0);
        this.item_view = BagItemManager.I.getView(ItemTypeView.Bag);
        // let s = view.getItemsByType(ItemViewBag.BagType.);
        // this.show_ids = s;
        // UIManager.I.showPrefab(undefined, 'prefabs/ui/bag/Bag', BundleType.gamelogic, (e, node) => {
        // this.ScrollviewList.setTemplateItem(node);
        this.ScrollviewList.numItems = this.show_ids.length;
        // }, this);
        let event_btn_infos: { path: string, bag_type: number, func_name?: string; }[] = [
            { path: 'btnItm', bag_type: ItemViewBag.BagType.Normall },
            { path: 'nEquipFunc/Layout/btnEquip', bag_type: ItemViewBag.BagType.RoleEquip },
            { path: 'nEquipFunc/Layout/btnBeast', bag_type: ItemViewBag.BagType.XiongShouEquip },
            { path: 'nEquipFunc/Layout/btnTX', bag_type: ItemViewBag.BagType.HeTiEquip },
            { path: 'nEquipFunc/Layout/btnHL', bag_type: ItemViewBag.BagType.HuanLingEquip },
            { path: 'nEquipFunc/Layout/btnKingEquip', bag_type: ItemViewBag.BagType.KingSuit },
            { path: 'btnEqp', bag_type: ItemViewBag.BagType.RoleEquip },
            { path: 'btnSto', bag_type: ItemViewBag.BagType.Gem },
            { path: 'btnGrade', bag_type: ItemViewBag.BagType.Grade },
        ];
        event_btn_infos.forEach((info) => {
            UtilsCC.setClickEventOnly(info.path, this.node, info.func_name || 'on_bagtype_clicked', this, info.bag_type);
        });
    }

    on_bagtype_clicked(e, bag_type: number) {

        console.time('on_bagtype_clicked=');
        this.show_ids = this.item_view.getItemsByBagType(bag_type);
        console.timeEnd('on_bagtype_clicked=');
        this.ScrollviewList.numItems = this.show_ids.length;
    }

    onRenderItem(n: Node, index: number) {
        let item = BagItemManager.I.getItem(this.show_ids[index]);
        let s: ShowItemData = js.createMap(true);
        s.itemdata = item.getItemData();
        s.needLink = true;
        s.needName = true;
        n.attr({ _args: { ItemData: s } });
        n.getComponent(BagItem).updateShow();
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */

