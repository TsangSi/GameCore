const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class LabelTextScroll extends cc.Component {
    @property
    protected maskWidth: number = 98;
    @property
    protected moveSpeed: number = 0.1;
    @property
    protected delay: number = 3;
    @property
    protected tailSpaceNum: number = 3;

    @property
    private _isColorFull: boolean = false;
    @property
    protected set isColorFull(v: boolean) {
        if (v !== this._isColorFull) {
            this._isColorFull = v;
            this.setColorFull(this._isColorFull, this.isColorFullLight);
        }
    }
    protected get isColorFull(): boolean {
        return this._isColorFull;
    }

    @property
    private _isColorFullLight: boolean = false;
    @property({
        visible(this: LabelTextScroll) {
            return this.isColorFull;
        },
    })
    protected set isColorFullLight(v: boolean) {
        if (v !== this._isColorFullLight) {
            this._isColorFullLight = v;
            this.setColorFull(this._isColorFull, this.isColorFullLight);
        }
    }
    protected get isColorFullLight(): boolean {
        return this._isColorFullLight;
    }

    private _time: number = 0;
    private _isMove: boolean = false;
    private _leftPadding: number = 0;
    private _rightPadding: number = 0;
    private _text: string = '';

    private _label: cc.Label;
    private _material: cc.MaterialVariant;
    private _originalColor: cc.Color;

    protected onLoad(): void {
        this._originalColor = null;
        this._label = this.getComponent(cc.Label);
        this._material = this._label.getMaterial(0);
    }

    protected start(): void {
        this.updateMaterial();

        if (this._label) {
            this._label.node.on(cc.Node.EventType.SIZE_CHANGED, () => {
                this.updateMaterial();
            });

            this._label.node.on(cc.Node.EventType.COLOR_CHANGED, () => {
                if (this._label && !this.isColorFull) {
                    this._originalColor = this._label.node.color.clone();
                }
            });

            if (this._text) {
                this.setText(this._text);
            }
        }
    }

    public setText(txt: string): void {
        this._text = txt;
        if (!this._label) {
            return;
        }

        this._label.string = txt;

        // eslint-disable-next-line dot-notation
        if (this._label['_forceUpdateRenderData']) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, dot-notation
            this._label['_forceUpdateRenderData']();
        }

        const totalWidth = this._label.node.width;
        if (totalWidth > this.maskWidth) {
            let tailSpace = '';
            for (let i = 0; i < this.tailSpaceNum; i++) {
                tailSpace += ' ';
            }
            this._label.string = txt + tailSpace;
        }
    }

    public setColorFull(isSet: boolean, isLight?: boolean): void {
        if (!this._label) {
            return;
        }

        this._isColorFull = isSet;
        this._isColorFullLight = isLight;

        if (isSet) {
            if (!this._originalColor) {
                this._originalColor = this._label.node.color.clone();
            }
            this._label.node.color = cc.color(255, 255, 255, 255);
        } else if (this._originalColor) {
            this._label.node.color = this._originalColor.clone();
        }

        this.updateMaterial();
    }

    public updateMaterial(): void {
        if (!this._label || !this._material) {
            this._isMove = false;
            return;
        }

        this._time = 0;
        const totalWidth = this._label.node.width;
        if (totalWidth > this.maskWidth) {
            this._isMove = true;
        } else {
            this._isMove = false;
        }

        if (this._isMove) {
            this._leftPadding = ((totalWidth - this.maskWidth) / 2.0) / totalWidth;
            this._rightPadding = ((totalWidth - this.maskWidth) / 2.0 + this.maskWidth) / totalWidth;
            this._material.setProperty('moveOffsetX', -this._leftPadding);
        } else {
            this._leftPadding = 0;
            this._rightPadding = 0;
        }

        this._material.setProperty('leftPadding', this._leftPadding);
        this._material.setProperty('rightPadding', this._rightPadding);
        this._material.setProperty('isColorFull', this._isColorFull ? 1.0 : 0.0);
        this._material.setProperty('isColorFullLight', this._isColorFullLight ? 1.0 : 0.0);
    }

    protected update(dt: number): void {
        if (!this._isMove || !this.node.active) {
            return;
        }

        this._time += dt;
        if (this._time < this.delay) {
            return;
        }

        const moveOffsetX = -this._leftPadding + (this._time - this.delay) * this.moveSpeed;
        this._material.setProperty('moveOffsetX', moveOffsetX);
        this._material.setProperty('leftPadding', this._leftPadding);
        this._material.setProperty('rightPadding', this._rightPadding);
        this._material.setProperty('isColorFull', this._isColorFull ? 1.0 : 0.0);
        this._material.setProperty('isColorFullLight', this._isColorFullLight ? 1.0 : 0.0);
    }
}
