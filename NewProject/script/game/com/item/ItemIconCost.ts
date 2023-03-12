/*
 * @Author: hwx
 * @Date: 2022-06-28 16:31:23
 * @FilePath: \SanGuo\assets\script\game\com\item\ItemIconCost.ts
 * @Description: 道具图标费用
 */
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import { ItemIconOptions } from './ItemConst';
import { ItemIcon } from './ItemIcon';
import ItemModel from './ItemModel';

const { ccclass, property } = cc._decorator;
@ccclass
export class ItemIconCost extends cc.Component {
    @property(ItemIcon)
    private NdIcon: ItemIcon = null;

    @property(cc.Label)
    private LabOwn: cc.Label = null;

    @property(cc.Label)
    private LabCost: cc.Label = null;

    private _data: ItemModel;

    private _own: number = 0;

    private _cost: number = 0;

    /**
     * 设置数据
     * @param data
     * @param own
     * @param cost
     * @param opts
     */
    public setData(data: ItemModel, own?: number, cost?: number, opts?: ItemIconOptions): void {
        this._data = data;
        this._own = own || 0;
        this._cost = cost || 0;

        this.setOwnLabel(this._own);
        this.setCostLabel(this._cost);
        this.NdIcon.setData(data, opts);
    }

    /**
     * 获取道具模型
     * @returns ItemModel
     */
    public getItemModel(): ItemModel {
        return this._data;
    }

    /**
     * 获取拥有值
     * @returns number
     */
    public getOwn(): number {
        return this._own;
    }

    /**
     * 获取消耗值
     * @returns number
     */
    public getCost(): number {
        return this._cost;
    }

    /**
     * 设置拥有的数量
     * @param own
     */
    public setOwnLabel(own: number): void {
        this.LabOwn.string = `${UtilNum.Convert(own)}`;
        this.LabOwn.node.color = own < this._cost ? UtilColor.Hex2Rgba(UtilColor.RedD) : UtilColor.Hex2Rgba(UtilColor.GreenD);
    }

    /**
     * 设置消耗数量
     * @param cost
     */
    public setCostLabel(cost: number): void {
        this.LabCost.string = `/${UtilNum.Convert(cost)}`;
    }
}
