/*
 * @Author: myl
 * @Date: 2023-02-11 19:09:02
 * @Description
 */

import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import WinBase from '../../../com/win/WinBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ComItemsScanWin extends WinBase {
    @property(ListView)
    private list: ListView = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    @property(cc.Node)
    private NdBtnClose: cc.Node = null;

    @property(cc.RichText)
    private RichTitle: cc.RichText = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
        UtilGame.Click(this.NdBtnClose, () => {
            this.close();
        }, this);
    }

    public init(param: any[]): void {
        if (param) {
            this._data = param[0] as ItemModel[];
            this.list.setNumItems(this._data.length);
            this.RichTitle.string = param[1] as string;
        }
    }

    private _data: ItemModel[] = [];
    private scrollEvent(nd: cc.Node, index: number): void {
        const itemIcon = nd.getComponent(ItemIcon);
        itemIcon.setData(this._data[index], { needNum: true });
    }
}
