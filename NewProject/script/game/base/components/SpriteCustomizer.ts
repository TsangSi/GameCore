/*
 * @Author: zs
 * @Date: 2022-04-14 14:44:42
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

/** 选中状态 */
enum SpriteStatu {
    /** 默认 */
    Normall,
    /** 选中 */
    Select
}

@ccclass
export class SpriteCustomizer extends cc.Component {
    @property({
        type: cc.SpriteFrame,
        serializable: true,
        displayName: 'Sprite Frames',
        tooltip: CC_DEV && '要显示sprite frames列表',
    })
    private spriteFrames: cc.SpriteFrame[] = [];

    @property({ serializable: true })
    private _curIndex = 0;
    @property({
        type: cc.Integer,
        displayName: 'Current Show cc.Sprite Frame Index',
        tooltip: CC_DEV && '当前显示的sprite frame',
    })
    public get curIndex(): number {
        return this._curIndex || 0;
    }
    public set curIndex(value: number) {
        this._curIndex = value;
        this.__applyCurrentSpriteFrame();
    }

    public get length(): number {
        return this.spriteFrames.length;
    }

    private __runing = false;

    protected onLoad(): void {
        const curIndex = this.curIndex;
        if (typeof curIndex === typeof 0) {
            this.curIndex = curIndex;
        }
    }

    private __applyCurrentSpriteFrame() {
        if (this.__runing) {
            return;
        }

        this.__runing = true;
        if (this.curIndex !== Math.floor(this.curIndex)) {
            this.curIndex = Math.floor(this.curIndex);
        }
        if (this.curIndex < 0 || this.curIndex >= this.spriteFrames.length) {
            this.curIndex = 0;
        }
        let spriteFrame = null;
        const sprite = this.node.getComponent(cc.Sprite);
        if (this.curIndex >= 0 && this.curIndex < this.spriteFrames.length) {
            spriteFrame = this.spriteFrames[this.curIndex];
        }

        if (sprite) {
            if (sprite.spriteFrame !== spriteFrame) {
                sprite.spriteFrame = spriteFrame;
            }
        }
        this.__runing = false;
    }

    public static Statu = SpriteStatu;
}
