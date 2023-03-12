/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-loop-func */
/* eslint-disable dot-notation */
/*
 * @Author: kexd
 * @Date: 2022-06-16 15:07:19
 * @FilePath: \SanGuo-2.4-main\assets\script\game\base\utils\UtilItemList.ts
 * @Description: 多个道具展示
 */
import { IItemMsg } from '../../com/item/ItemConst';
import { ItemIcon } from '../../com/item/ItemIcon';
import UtilItem from './UtilItem';
import { BagMgr } from '../../module/bag/BagMgr';
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import ItemModel from '../../com/item/ItemModel';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import UtilObject from './UtilObject';

export default class UtilItemList {
    /**
     * 展示多个道具
     * @param parent 父节点
     * @param itemStr 道具数据字符串
     * @param showMsg 额外参数：名字显隐、回调等。默认是不显示名字，显示数量的
     */
    public static ShowItems(parent: cc.Node, itemStr: string, showMsg?: IItemMsg, callback: Function = null): void {
        if (!parent) {
            console.log('ShowItems-----parent是空');
            return;
        }
        const itemStrArray = itemStr.split('|');
        // 删除多余的
        for (let index = itemStrArray.length; index < parent.children.length; index++) {
            const element = parent.children[index];
            element.destroy();
        }
        // 新增或修改
        for (let i = 0; i < itemStrArray.length; i++) {
            const itemStr = itemStrArray[i];
            const itemD = itemStr.split(':');
            const itemId = parseInt(itemD[0]);
            const itemNum = itemD[1] ? parseInt(itemD[1]) : 0;
            const markType = itemD[2] ? parseInt(itemD[2]) : 0;

            const itemModel = UtilItem.NewItemModel(itemId, itemNum);
            const exMsg: IItemMsg = {
                needGot: showMsg?.needGot,
                mark: showMsg?.mark,
            };
            if (showMsg) {
                if (showMsg.option) {
                    exMsg.option = UtilObject.clone(showMsg.option);
                }

                if (showMsg.needColor) {
                    const have = BagMgr.I.getItemNum(itemId);
                    if (!exMsg.option) exMsg.option = {};
                    exMsg.option.color = have < itemNum ? UtilColor.RedD : UtilColor.GreenD;
                }
            }

            if (markType === 1 || markType === 2) {
                exMsg.mark = markType;
            }

            // 已存在，更新
            if (i < parent.children.length) {
                const item = parent.children[i];
                item.getComponent(ItemIcon)?.setData(itemModel, exMsg?.option);
                UtilItem.addGot(item, exMsg?.needGot, exMsg?.needGotBg);
                if (exMsg.mark) {
                    UtilItem.addMark(item, exMsg.mark);
                }
                if (callback) {
                    callback(item, i);
                }
            } else {
                // 新增
                UtilItemList.loadItem(i, parent, itemModel, exMsg, callback);
            }
        }
    }

    /**
     * 展示多个道具
     * @param parent 父节点
     * @param itemStr 道具数据列表
     * @param showMsg 额外参数：名字显隐、回调等
     */
    public static ShowItemArr(parent: cc.Node, itemModel: ItemModel[] | ItemData[], showMsg?: IItemMsg, callback: Function = null): void {
        if (!parent) {
            console.log('ShowItemArr-----parent是空');
            return;
        }
        // 删除多余的
        for (let index = itemModel.length; index < parent.children.length; index++) {
            const element = parent.children[index];
            element.destroy();
        }
        // 新增或修改
        for (let i = 0; i < itemModel.length; i++) {
            const exMsg: IItemMsg = {
                needGot: showMsg?.needGot,
                needGotBg: showMsg?.needGotBg,
                mark: showMsg?.mark,
            };
            if (showMsg) {
                if (showMsg.option) {
                    exMsg.option = UtilObject.clone(showMsg.option);
                }
            }
            // 已存在，更新
            if (i < parent.children.length) {
                const item = parent.children[i];
                const modelItem = itemModel[i] as ItemModel;
                if (modelItem.data) {
                    if (showMsg && showMsg.needColor) {
                        const itemId = modelItem.data.ItemId;
                        const itemNum = modelItem.data.ItemNum;
                        const have = BagMgr.I.getItemNum(itemId);
                        if (!exMsg.option) exMsg.option = {};
                        exMsg.option.color = have < itemNum ? UtilColor.RedD : UtilColor.GreenD;
                    }
                    item.getComponent(ItemIcon).setData(modelItem, exMsg?.option);
                } else {
                    const dataItem = itemModel[i] as ItemData;
                    const itemData: ItemModel = UtilItem.NewItemModel(dataItem);
                    if (showMsg && showMsg.needColor) {
                        const itemId = itemData.data.ItemId;
                        const itemNum = itemData.data.ItemNum;
                        const have = BagMgr.I.getItemNum(itemId);
                        if (!exMsg.option) exMsg.option = {};
                        exMsg.option.color = have < itemNum ? UtilColor.RedD : UtilColor.GreenD;
                    }
                    item.getComponent(ItemIcon).setData(itemData, exMsg?.option);
                }

                UtilItem.addGot(item, exMsg?.needGot, exMsg?.needGotBg);
                if (callback) {
                    callback(item, i);
                }
            } else {
                // 新增
                const modelItem = itemModel[i] as ItemModel;
                if (modelItem.data) {
                    if (showMsg && showMsg.needColor) {
                        const itemId = modelItem.data.ItemId;
                        const itemNum = modelItem.data.ItemNum;
                        const have = BagMgr.I.getItemNum(itemId);
                        if (!exMsg.option) exMsg.option = {};
                        exMsg.option.color = have < itemNum ? UtilColor.RedD : UtilColor.GreenD;
                    }
                    UtilItemList.loadItem(i, parent, modelItem, exMsg, callback);
                } else {
                    const dataItem = itemModel[i] as ItemData;
                    const itemData = UtilItem.NewItemModel(dataItem);
                    if (showMsg && showMsg.needColor) {
                        const itemId = itemData.data.ItemId;
                        const itemNum = itemData.data.ItemNum;
                        const have = BagMgr.I.getItemNum(itemId);
                        if (!exMsg.option) exMsg.option = {};
                        exMsg.option.color = have < itemNum ? UtilColor.RedD : UtilColor.GreenD;
                    }
                    UtilItemList.loadItem(i, parent, itemData, exMsg, callback);
                }
            }
        }
    }

    /** 防重复加载 */
    private static loadItem(i: number, parent: cc.Node, itemModel: ItemModel, showMsg: IItemMsg, callback: Function = null) {
        const isLoading = parent['isLoading'] || [];
        if (isLoading && isLoading.length > 0 && isLoading.indexOf(i) >= 0) {
            return;
        }
        isLoading.push(i);
        parent['isLoading'] = isLoading;
        UtilItem.New(parent, itemModel, showMsg, (item: any) => {
            const index = parent['isLoading'].indexOf(i);
            if (index >= 0) {
                parent['isLoading'].splice(index, 1);
            }
            if (callback) {
                callback(item, i);
            }
        });
    }
}
