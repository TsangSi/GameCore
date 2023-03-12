/*
 * @Author: zs
 * @Date: 2022-04-14 14:44:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-18 22:06:11
 * @FilePath: \SanGuo\assets\script\game\base\components\LabelCustomColor.ts
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

/** 选中状态 */
enum LabelStatu {
    /** 默认 */
    Normall,
    /** 选中 */
    Select
}

@ccclass
export class LabelCustomColor extends cc.Component {
    @property({
        type: cc.Color,
        serializable: true,
        displayName: 'color',
        tooltip: CC_DEV && '要显示color列表',
    })
    private colors: cc.Color[] = [];

    @property({ serializable: true })
    private _curIndex = 0;
    @property({
        type: cc.Integer,
        displayName: 'Current Show cc.Color Index',
        tooltip: CC_DEV && '当前显示的color索引',
    })
    public get curIndex(): number {
        return this._curIndex || 0;
    }
    public set curIndex(value: number) {
        this._curIndex = value;
        this.__applyCurrentLabel();
    }

    public get length(): number {
        return this.colors.length;
    }

    private __runing = false;

    protected onLoad(): void {
        const curIndex = this.curIndex;
        if (typeof curIndex === typeof 0) {
            this.curIndex = curIndex;
        }
    }

    private __applyCurrentLabel() {
        if (this.__runing) {
            return;
        }

        this.__runing = true;
        if (this.curIndex !== Math.floor(this.curIndex)) {
            this.curIndex = Math.floor(this.curIndex);
        }
        if (this.curIndex < 0 || this.curIndex >= this.colors.length) {
            this.curIndex = 0;
        }
        let color: cc.Color = null;
        const label = this.node.getComponent(cc.Label);
        if (this.curIndex >= 0 && this.curIndex < this.colors.length) {
            color = this.colors[this.curIndex];
        }

        if (label) {
            if (label.node.color !== color) {
                label.node.color = color;
            }
        }
        this.__runing = false;
    }

    public static Statu = LabelStatu;
}
