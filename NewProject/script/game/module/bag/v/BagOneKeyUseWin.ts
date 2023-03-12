/*
 * @Author: hwx
 * @Date: 2022-06-16 17:11:43
 * @FilePath: \SanGuo\assets\script\game\module\bag\v\BagOneKeyUseWin.ts
 * @Description: 背包扩容弹框
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIconSelect } from '../../../com/item/ItemIconSelect';
import ItemModel from '../../../com/item/ItemModel';
import { WinCmp } from '../../../com/win/WinCmp';
import ControllerMgr from '../../../manager/ControllerMgr';

type SelectInfo = {
    type: number,
    selected: boolean,
    onlyId: string,
    count: number
}

const { ccclass, property } = cc._decorator;

@ccclass
export class BagOneKeyUseWin extends WinCmp {
    @property(cc.Sprite)
    protected SprHelpButton: cc.Sprite = null;

    @property(ListView)
    protected ListItems: ListView = null;

    @property(cc.Layout)
    private LayTypes: cc.Layout = null;

    @property(cc.Node)
    private NdUseButton: cc.Node = null;

    private _itemModelList: ItemModel[] = [];

    private _selectedInfoMap: Map<number, SelectInfo> = new Map();

    protected start(): void {
        super.start();

        UtilGame.Click(this.SprHelpButton.node, () => {
            // TODO: 显示帮助弹框
        }, this);

        if (this._itemModelList.length > 0) {
            UtilGame.Click(this.NdUseButton, () => {
                const exchangeList: C2SExchange[] = [];
                this._selectedInfoMap.forEach((v) => {
                    if (v.selected) {
                        exchangeList.push({ OnlyId: v.onlyId, Count: v.count, Param: undefined });
                    }
                });

                if (exchangeList.length > 0) {
                    ControllerMgr.I.BagController.reqC2SBatchExchange(exchangeList);
                    this.close();
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.bag_one_key_use_msg_select));
                }
            }, this);
        }
    }

    public init(params: any[]): void {
        this._itemModelList = params[0];
        if (this._itemModelList.length === 0) {
            UtilCocos.SetSpriteGray(this.NdUseButton, true);
            return;
        }

        // 初始化数据
        const typeMap: Map<number, string> = new Map();
        for (let i = 0; i < this._itemModelList.length; i++) {
            const itemModel = this._itemModelList[i];
            const type = itemModel.cfg.Type;
            if (!typeMap.has(type)) {
                typeMap.set(type, UtilItem.GetItemTypeName(type));
            }
            // 默认全选
            this._selectedInfoMap.set(i, {
                type, selected: true, onlyId: itemModel.data.OnlyId, count: itemModel.data.ItemNum,
            });
        }
        this.ListItems.setNumItems(this._itemModelList.length);

        // 动态显示类型列表
        const typeArray = Array.from(typeMap);
        typeArray.sort((a, b) => a[0] - b[0]);
        UtilCocos.LayoutFill(this.LayTypes.node, (node, index) => {
            node.active = true;
            const [type, name] = typeArray[index];
            const tog = node.getComponent(cc.Toggle);
            tog.isChecked = true; // 默认全选
            const labName = tog.getComponentInChildren(cc.Label);
            if (labName) {
                labName.string = name;
            }
            UtilGame.Click(node, this.onToggleCheck, this, { customData: type });
        }, typeArray.length);
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const itemModel = this._itemModelList[idx];
        const icon = node.getComponent(ItemIconSelect);
        icon.setData(itemModel, idx, (isSelected, idx) => {
            // 点击图标后设置选中状态
            const info = this._selectedInfoMap.get(idx);
            info.selected = isSelected;
        }, { needNum: true });

        // 滚动列表时刷新选中状态
        const info = this._selectedInfoMap.get(idx);
        if (info.selected) {
            icon.select();
        } else {
            icon.unselect();
        }
    }

    private onToggleCheck(node: cc.Node, type: number): void {
        const toggle = node.getComponent(cc.Toggle);
        const isSelect = toggle.isChecked; // 选中或反选该类型所有道具
        // 批量更新类型道具选中状态
        this._selectedInfoMap.forEach((v) => {
            if (v && v.type === type) {
                v.selected = isSelect;
            }
        });

        // 更新显示中的道具
        this.ListItems.content.children.forEach((iconNode) => {
            const icon = iconNode.getComponent(ItemIconSelect);
            const data = icon.getData();
            if (data.cfg.Type === type) {
                if (isSelect) {
                    icon.select();
                } else {
                    icon.unselect();
                }
            }
        });
    }
}
