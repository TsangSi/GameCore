/*
 * @Author: zs
 * @Date: 2022-06-07 16:21:37
 * @FilePath: \SanGuo\assets\script\game\com\item\ItemSourceWin.ts
 * @Description:
 */
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import UtilItem from '../../base/utils/UtilItem';
import { BagMgr } from '../../module/bag/BagMgr';
import { WinCmp } from '../win/WinCmp';
import { ItemSourceItem } from './ItemSourceItem';
import { UtilColorFull } from '../../base/utils/UtilColorFull';
import { ItemQuality } from './ItemConst';
import { UtilGame } from '../../base/utils/UtilGame';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemSourceWin extends WinCmp {
    @property(cc.Node)
    private NodeItem: cc.Node = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.RichText)
    private RichDesc: cc.RichText = null;
    @property(cc.Label)
    private LabelCount: cc.Label = null;
    @property(cc.ScrollView)
    private ScrollView: cc.ScrollView = null;

    private sourceIds: string[] = [];
    public init(params: any[]): void {
        const id: number = params[0];
        const itemModel = UtilItem.NewItemModel(id, 1);
        UtilItem.ItemNameScrollSet(itemModel, this.LabelName, itemModel.cfg.Name, true);

        this.RichDesc.string = UtilColor.GetTextWithColor(itemModel.cfg.Description.replace(/\\n/g, '\n'), UtilColor.NorV);
        this.sourceIds = itemModel.cfg.FromID.split('|');
        this.showSources();
        this.LabelCount.string = UtilNum.Convert(BagMgr.I.getItemNum(id));

        UtilItem.Show(this.NodeItem, itemModel, {});
    }

    private showSources() {
        this.updateItems();
    }

    private updateItems() {
        let tmpNode: cc.Node;
        const content = this.ScrollView.content;
        for (let i = 0, n = this.sourceIds.length; i < n; i++) {
            if (this.sourceIds[i]) {
                tmpNode = content.children[i];
                if (!tmpNode) {
                    tmpNode = cc.instantiate(content.children[0]);
                    content.addChild(tmpNode);
                }
                tmpNode.active = true;
                tmpNode.getComponent(ItemSourceItem).setData(+this.sourceIds[i]);
            }
        }
    }
}
