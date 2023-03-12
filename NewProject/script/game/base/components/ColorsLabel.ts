const { ccclass, property } = cc._decorator;

@ccclass
export class ColorsLabel extends cc.Label {
    @property([cc.Color]) /** 传入颜色数组 */
    private _colors: cc.Color[] = [];

    @property([cc.Color])
    public get colors(): cc.Color[] {
        return this._colors;
    }

    public set colors(value: cc.Color[]) {
        this._colors = value;
        this._resetColors();
    }

    public onEnable(): void {
        super.onEnable();
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, this._resetColors, this);
    }

    public onDisable(): void {
        cc.director.off(cc.Director.EVENT_AFTER_DRAW, this._resetColors, this);
        // eslint-disable-next-line dot-notation, @typescript-eslint/no-unsafe-member-access
        this.node[`_renderFlag`] |= cc[`RenderFlow`][`FLAG_COLOR`];
    }

    _init: boolean = false;
    private _resetColors(): void {
        // x y u v (rgba)4
        // x y u v (rgba)9
        // x y u v (rgba)14
        // x y u v (rgba)19
        // eslint-disable-next-line dot-notation
        if (this[`_assembler`]) {
            const unitVerts = this._assembler._renderData.uintVDatas[0];
            unitVerts[4] = this._colors[1]?._val;
            unitVerts[9] = this._colors[1]?._val;
            unitVerts[14] = this._colors[0]?._val;
            unitVerts[19] = this._colors[0]?._val;
        }
    }
}
