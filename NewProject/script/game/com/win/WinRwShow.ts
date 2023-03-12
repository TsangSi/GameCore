/*
 * @Author: dcj
 * @Date: 2022-12-07 17:18:56
 * @FilePath: \SanGuo-2.4-main\assets\script\game\com\win\WinRwShow.ts
 * @Description:
 */
import ListView from '../../base/components/listview/ListView';
import { UtilGame } from '../../base/utils/UtilGame';
import { ItemIcon } from '../item/ItemIcon';
import ItemModel from '../item/ItemModel';
import { WinCmp } from './WinCmp';

const { ccclass, property } = cc._decorator;

@ccclass
export class WinRwShow extends WinCmp {
    @property(ListView)
    private list: ListView = null;
    @property(cc.Node)
    private Btn: cc.Node = null;
    private _source = [];
    public init(param: any[]): void {
        if (!param[0]) {
            this.close();
        }
        UtilGame.Click(this.Btn, () => {
            this.close();
        }, this);
        this._source = param[0] as ItemModel[];
        if (this._source && this._source.length > 0) {
            this.list.setNumItems(this._source?.length);
        }
    }

    private scrollEvent(nd: cc.Node, idx: number) {
        const item = nd.getComponent(ItemIcon);
        if (this._source[idx]) {
            item.setData(this._source[idx], { needNum: true, needName: true });
        }
    }
}
