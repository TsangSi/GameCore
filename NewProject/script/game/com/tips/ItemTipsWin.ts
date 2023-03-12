/*
 * @Author: hwx
 * @Date: 2022-06-16 09:30:54
 * @FilePath: \SanGuo2.4\assets\script\game\com\tips\ItemTipsWin.ts
 * @Description: Tips 窗口
 */

import { ResMgr } from '../../../app/core/res/ResMgr';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilItem from '../../base/utils/UtilItem';
import { BagMgr } from '../../module/bag/BagMgr';
import { ItemDetailType, ItemTipsOptions, ItemWhere } from '../item/ItemConst';
import ItemModel from '../item/ItemModel';
import WinBase from '../win/WinBase';
import { BaseItemTipsContent } from './content/BaseItemTipsContent';
import { ItemTipsContentPath } from './ItemTipsConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsWin extends WinBase {
    private _itemModel: ItemModel;
    private _where: number;
    private _opts: ItemTipsOptions;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
    }

    /**
     *  初始化Tips窗口，道具来源：1-背包，999-其他，默认其他
     * @param params [itemModel: string | number | ItemModel, where: ItemWhere, where: ItemWhere]
     * @returns
     */
    public init(params: unknown[]): void {
        this.initUI(params);
    }

    public refreshView(params: unknown[]): void {
        this.NdContent.destroyAllChildren();
        this.NdContent.removeAllChildren();
        this.initUI(params);
    }

    private initUI(params: unknown[]) {
        let itemModel: ItemModel;
        if (typeof params[0] === 'string') {
            // 道具唯一ID
            const onlyId = params[0];
            itemModel = BagMgr.I.getItemModel(onlyId);
        } else if (typeof params[0] === 'number') {
            const itemId = params[0];
            itemModel = UtilItem.NewItemModel(itemId, 1);
        } else if (typeof params[0] === 'object') {
            itemModel = params[0] as ItemModel; // 道具数据
        } else {
            console.error('ItemTipsWin init params error');
            return;
        }

        this._itemModel = itemModel;
        this._opts = params[1] as ItemTipsOptions;
        // 道具在哪：1-背包，999-其他
        this._where = params[1] as number || ItemWhere.OTHER; // 默认其他

        switch (itemModel.cfg.DetailType) {
            case ItemDetailType.EQUIP:
                this.initTipsContent(ItemTipsContentPath.Equip, itemModel, this._opts);
                break;
            case ItemDetailType.ATTR:
                this.initTipsContent(ItemTipsContentPath.Attr, itemModel, this._opts);
                break;
            case ItemDetailType.PICK_CHEST:
                this.initTipsContent(ItemTipsContentPath.PickChest, itemModel, this._opts);
                break;
            case ItemDetailType.RANDOM_CHEST:
                this.initTipsContent(ItemTipsContentPath.RandomChest, itemModel, this._opts);
                break;
            case ItemDetailType.AVATAR:
                this.initTipsContent(ItemTipsContentPath.Avatar, itemModel, this._opts);
                break;
            default:
                this.initTipsContent(ItemTipsContentPath.General, itemModel, this._opts);
                break;
        }
    }

    /**
     * 初始化Tips内容
     * @param path 内容预制体路径
     * @param itemModel 道具数据
     * @param where 道具在哪：1-背包，999-其他
     */
    private initTipsContent(path: string, itemModel: ItemModel, opts: ItemTipsOptions): void {
        ResMgr.I.showPrefab(path, this.NdContent, (err, node) => {
            if (err) return;

            // 设置组件数据
            const comp = node.getComponent(BaseItemTipsContent);
            if (comp) {
                comp.setData(itemModel, opts);
            } else {
                cc.warn('ItemTipsWin initTipsContent error', path, 'not tips');
            }
        });
    }
}
