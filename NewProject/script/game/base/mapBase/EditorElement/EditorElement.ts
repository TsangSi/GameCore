/*
 * @Author: kexd
 * @Date: 2022-03-30 13:56:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-19 11:33:54
 * @FilePath: \SanGuo\assets\script\game\base\mapBase\EditorElement\EditorElement.ts
 * @Description:
 *
 */
const { ccclass } = cc._decorator;

@ccclass
export default class EditorElement extends cc.Component {
    private _isOnEvent: boolean = false;
    private _isAdd: boolean = false;

    public get className(): string {
        return 'EditorElement';
    }

    private _graphics: cc.Graphics = null;
    public get graphics(): cc.Graphics {
        if (!this._graphics) {
            this._graphics = this.addComponent(cc.Graphics);
        }
        return this._graphics;
    }

    private _selected: boolean;

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(value: boolean) {
        if (value) {
            this.graphics.clear();
            this.graphics.strokeColor.fromHEX('#cacaca');
            this.graphics.lineWidth = 2;
            // const transform = this.node.getComponent(UITransform);
            this.graphics.rect(-this.node.width * this.node.anchorX, -this.node.height * this.node.anchorX, this.node.width, this.node.height);
            this.graphics.stroke();
        } else {
            this.graphics.clear();
        }
        this._selected = value;
    }

    public get brush(): EditorElement {
        const sceneObject: EditorElement = cc.instantiate(this.node).getComponent(EditorElement);
        return sceneObject;
    }

    private _objId: string = '0';
    public get objId(): string {
        return this._objId;
    }
    public set objId(value: string) {
        this._objId = value;
    }

    private _objName: string = '名称';
    public get objName(): string {
        return this._objName;
    }
    public set objName(value: string) {
        this._objName = value;
    }

    private _objType: string = '0';
    public get objType(): string {
        return this._objType;
    }
    public set objType(value: string) {
        this._objType = value;
    }

    private _skin: string = '';
    public get skin(): string {
        return this._skin;
    }
    public set skin(value: string) {
        this._skin = value;
    }

    public get x(): number {
        return Number(this.node.position.x ^ 0);
    }
    public set x(value: number) {
        this.node.setPosition(value, this.node.position.y);
    }

    public get y(): number {
        return Number(this.node.position.y ^ 0);
    }
    public set y(value: number) {
        this.node.setPosition(this.node.position.x, value);
    }

    private _cx: number = 0;
    public get cx(): number {
        return this._cx;
    }
    public set cx(value: number) {
        this._cx = value;
    }

    private _cy: number = 0;
    public get cy(): number {
        return this._cy;
    }
    public set cy(value: number) {
        this._cy = value;
    }

    public get scaleX(): number {
        return this.node.scaleX;
    }
    public set scaleX(value: number) {
        this.node.setScale(value, this.node.scaleY);
    }

    public get scaleY(): number {
        return this.node.scaleY;
    }
    public set scaleY(value: number) {
        this.node.setScale(this.node.scaleX, value);
    }

    private _params: string = '';
    public get params(): string {
        return this._params;
    }
    public set params(value: string) {
        this._params = value;
    }

    protected onLoad(): void {
        //
    }

    protected start(): void {
        //
    }

    public get isOnEvent(): boolean {
        return this._isOnEvent;
    }

    public get isAdd(): boolean {
        return this._isAdd;
    }

    public set isAdd(isAdd: boolean) {
        this._isAdd = isAdd;
    }
}
