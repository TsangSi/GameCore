/*
 * @Author: kexd
 * @Date: 2022-04-27 16:37:43
 * @LastEditors: kexd
 * @LastEditTime: 2022-04-27 16:45:12
 * @FilePath: \sanguo\assets\script\app\base\map\attribute\AttributeEditor.ts
 * @Description:
 *
 */
export default class AttributeEditor {
    public static NORMAL:string = 'normal';
    public static NUMBER:string = 'number';
    public static NOT_NUMBER:string = 'not_number';

    private _attribute:string;

    private _detail:string;

    private _type:string;

    private _editable:boolean = false;

    public constructor(attribute:string, detail:string, type:string = AttributeEditor.NORMAL, editAble:boolean = true) {
        this._attribute = attribute;
        this._detail = detail;
        this._type = type;
        this._editable = editAble;
    }

    public get attribute():string {
        return this._attribute;
    }

    public set attribute(value:string) {
        this._attribute = value;
    }

    public get detail():string {
        return this._detail;
    }

    public set detail(value:string) {
        this._detail = value;
    }

    public get type():string {
        return this._type;
    }

    public set type(value:string) {
        this._type = value;
    }

    public get editable():boolean {
        return this._editable;
    }

    public set editable(value:boolean) {
        this._editable = value;
    }
}
