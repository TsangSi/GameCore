
import { _decorator, Component, Node, Label, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LabelEx')
export class LabelEx extends Label {
    @property({ type: [Color] })
    private _colors: Color[] = [new Color(243, 16, 16, 255), new Color(20, 255, 0, 255), new Color(0, 0, 255, 255), new Color(255, 235, 0, 255)];
    @property({ type: [Color] })
    public get colors(): Color[] {
        return this._colors;
    }
    public set colors(value: Color[]) {
        this._colors = value;
        this._colorDirty = true;
    }

    protected _updateColor() {
        const colorDirty = this._colorDirty;
        super._updateColor();
        if (colorDirty) {
            const vData = this.renderData!.vData;
            let colorOffset = 5;
            for (let i = 0; i < 4; i++) {
                const color = this.colors[i] || this.color;
                const colorR = color.r / 255;
                const colorG = color.g / 255;
                const colorB = color.b / 255;
                const colorA = this.node._uiProps.opacity;
                vData![colorOffset] = colorR;
                vData![colorOffset + 1] = colorG;
                vData![colorOffset + 2] = colorB;
                vData![colorOffset + 3] = colorA;
                colorOffset += 9;
            }
        }
    }


}
