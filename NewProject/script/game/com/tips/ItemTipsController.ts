/*
 * @Author: myl
 * @Date: 2022-10-09 18:59:43
 * @Description:
 */
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilItem from '../../base/utils/UtilItem';
import { ViewConst } from '../../const/ViewConst';
import { ItemType, ItemWhere } from '../item/ItemConst';

const { ccclass, property } = cc._decorator;
@ccclass('ItemTipsController')
export class ItemTipsController extends BaseController {
    /** 监听网络事件 子类实现 */
    public addNetEvent(): void {
        //
    }

    /** 移除网络事件 子类实现 */
    public delNetEvent(): void {
        //
    }

    /** 监听业务事件 子类实现 */
    public addClientEvent(): void {
        //
    }

    /** 移除网络事件 子类实现 */
    public delClientEvent(): void {
        //
    }

    /** 清理数据 */
    public clearAll(): void {
        //
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param itemId 道具id
     * @returns
     */
    public linkOpen(tab?: number, params?: any[], itemId?: number): boolean {
        if (itemId) {
            const item = UtilItem.NewItemModel(itemId, 1);
            WinMgr.I.open(ViewConst.ItemTipsWin, item, { where: ItemWhere.OTHER });
            return true;
        } else {
            return false;
        }
    }
}
