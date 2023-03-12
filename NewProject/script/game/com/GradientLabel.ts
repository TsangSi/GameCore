const { ccclass, property } = cc._decorator;

@ccclass
export default class GradientLabel extends cc.Component {
    @property({ type: [cc.Color] })
    private _colors: cc.Color[] = [];

    @property({ type: [cc.Color] })
    public get colors(): cc.Color[] {
        return this._colors;
    }
    public set colors(value: cc.Color[]) {
        this._colors = value;
        this._resetColors();
    }

    public onLoad(): void {
        this._resetColors();
    }

    public _resetColors(): void {
        const lb = this.node.getComponent(cc.Label);
        if (this._colors.length >= 2) {
            lb.getMaterial(0).setProperty('col1', this._colors[0]);
            lb.getMaterial(0).setProperty('col2', this._colors[1]);
        }
    }

    /** 置灰功能？ */
}
