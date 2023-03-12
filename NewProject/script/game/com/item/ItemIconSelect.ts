/*
 * @Author: hwx
 * @Date: 2022-06-28 16:31:23
 * @FilePath: \SanGuo\assets\script\game\com\item\ItemIconSelect.ts
 * @Description: 道具图标选择
 */
import { UtilGame } from '../../base/utils/UtilGame';
import { ItemIconOptions } from './ItemConst';
import { ItemIcon } from './ItemIcon';
import ItemModel from './ItemModel';

const { ccclass, property } = cc._decorator;
@ccclass
export class ItemIconSelect extends cc.Component {
    @property(ItemIcon)
    private NdIcon: ItemIcon = null;

    @property(cc.Node)
    private NdSelect: cc.Node = null;

    private _data: ItemModel;

    private _idx: number;

    private _onSelectCb: (isSelected: boolean, idx: number) => void;

    protected start(): void {
        UtilGame.Click(this.node, () => {
            this.NdSelect.active = !this.NdSelect.active;
            if (this._onSelectCb) {
                this._onSelectCb(this.NdSelect.active, this._idx);
            }
        }, this);
    }

    public setData(data: ItemModel, idx: number, onSelectCb: (isSelected: boolean, idx: number) => void, opts: ItemIconOptions): void {
        this._data = data;
        this._idx = idx;
        this._onSelectCb = onSelectCb;
        this.NdIcon.setData(data, opts);
    }

    public select(): void {
        this.NdSelect.active = true;
    }

    public unselect(): void {
        this.NdSelect.active = false;
    }

    public getIdx(): number {
        return this._idx;
    }

    public getData(): ItemModel {
        return this._data;
    }
}
