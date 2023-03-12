/*
 * @Author: zs
 * @Date: 2022-06-28 18:17:39
 * @FilePath: \SanGuo\assets\script\game\com\getreward\v\GetRewardWin.ts
 * @Description:
 */
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ItemWhere } from '../../item/ItemConst';
import { ItemIcon } from '../../item/ItemIcon';
import ItemModel from '../../item/ItemModel';
import WinBase from '../../win/WinBase';
import { FromPlace } from '../../../module/equip/buildEquip/BuildConst';
import { i18n } from '../../../../i18n/i18n';

const { ccclass, property } = cc._decorator;

@ccclass
export class GetRewardWin extends WinBase {
    @property(cc.Node)
    private LabClose: cc.Node = null;

    @property(ListView)
    private listGrid: ListView = null;

    @property(cc.Node)
    private NdBtnSure: cc.Node = null;

    @property(cc.Prefab)
    private itemIcon: cc.Prefab = null;

    @property(cc.Node)
    private NdLessthan5: cc.Node = null;// 少于5个用这个不用list

    @property(cc.Node)
    private NdList: cc.Node = null;// 多余5个用List

    @property(cc.Node)
    private labJie: cc.Node = null;

    private listMinGridCount: number = 5;
    private listMaxGridCount: number = 200;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.NdBtnSure, () => {
            this.close();
        }, this);
        UtilGame.Click(this.LabClose, () => {
            this.close();
        }, this);
    }

    protected close(): void {
        super.close();
        this.NdLessthan5.destroyAllChildren();
    }
    /**
     * 奖励列表
     * @param params
     */
    private _itemModelArr = [];
    public init(params: [ItemModel[]] | any): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this._itemModelArr = params[0];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const fromPlace = params[1];// 如果是从 打造装备成功来的 需要显示阶数
        if (fromPlace === FromPlace.BUILD_EQUIP) {
            this.labJie.active = true;
            const itemModel: ItemModel = this._itemModelArr[0];
            this.labJie.getComponent(cc.Label).string = `${itemModel.cfg.ArmyLevel || itemModel.cfg.Level}${i18n.jie}`;
        } else {
            this.labJie.getComponent(cc.Label).string = '';
            this.labJie.active = false;
        }

        // 待扩展

        for (let index = 0; index < this.NdLessthan5.children.length; index++) {
            const element = this.NdLessthan5.children[index];
            element.destroy();
        }

        if (this._itemModelArr.length <= 5) {
            this.NdList.active = false;
            this.NdLessthan5.active = true;
            for (const itemModel of this._itemModelArr) {
                const itemIconNode = cc.instantiate(this.itemIcon);
                this.NdLessthan5.addChild(itemIconNode);
                const itemIcon: ItemIcon = itemIconNode.getComponent(ItemIcon);
                itemIcon.setData(itemModel, { needNum: true });
            }
        } else {
            this.NdList.active = true;
            this.NdLessthan5.active = false;
            this.resetListHeight(360);
            this.initList();
        }
    }

    public onDestroy(): void {
        super.onDestroy();
    }

    public initList(): void {
        const propCount = this._itemModelArr.length;
        const gridCount = Math.min(Math.max(propCount, this.listMinGridCount), this.listMaxGridCount);
        this.listGrid.setNumItems(gridCount, 0);
    }

    private resetListHeight(height: number): void {
        this.listGrid.node.height = height;
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const prop = this._itemModelArr[idx];
        const grid: ItemIcon = node.getComponent(ItemIcon);
        if (prop && grid) {
            grid.setData(prop, {
                needName: true, where: ItemWhere.OTHER, needNum: true, hideStar: false,
            });
            grid.setBgActive(true);
        } else {
            grid?.destroy();
        }
    }
}
