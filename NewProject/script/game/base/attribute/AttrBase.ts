import { Config } from '../config/Config';
import { UtilAttr } from '../utils/UtilAttr';
import { EAttrType, IAttrBase } from './AttrConst';

/*
 * @Author: zs
 * @Date: 2022-06-21 21:37:21
 * @FilePath: \SanGuo2.4\assets\script\game\base\attribute\AttrBase.ts
 * @Description: 属性基类
 */
export class AttrBase implements IAttrBase {
    // 根据属性类型id 和 值 计算战力
    private _fightValue: number;
    /** 战力是否已计算的标记 */
    private _calcFlag: boolean = false;
    public key: string = '';
    private _attrType: EAttrType = EAttrType.Attr_1;
    /** 属性类型id */
    public set attrType(type: EAttrType) {
        if (this._attrType === type) { return; }
        this._attrType = type;
        this.clearCalcFlag();
    }
    public get attrType(): EAttrType {
        return this._attrType;
    }
    public name: string = '';
    private _value: number = 0;
    /** 属性值 */
    public set value(v: number) {
        if (this._value === v) { return; }
        this._value = v;
        this.clearCalcFlag();
    }
    public get value(): number {
        return this._value;
    }
    public constructor(attrType: EAttrType, value: number);
    public constructor(data: IAttrBase);
    public constructor(attrTypeORdata: EAttrType | IAttrBase, value?: number) {
        if (typeof attrTypeORdata === 'number') {
            this.attrType = attrTypeORdata;
            this.key = EAttrType[this.attrType];
            this.name = UtilAttr.GetAttrName(EAttrType[this.key]);
            this.value = value || 0;
        } else {
            this.attrType = attrTypeORdata.attrType;
            this.key = attrTypeORdata.key || EAttrType[this.attrType];
            this.name = attrTypeORdata.name || UtilAttr.GetAttrName(EAttrType[this.key]);
            this.value = attrTypeORdata.value || 0;
        }
    }

    private calculate(isAdd: boolean, attrORtype: IAttrBase | EAttrType, value?: number): boolean {
        if (typeof attrORtype === 'number') {
            if (this.attrType !== attrORtype) { return false; }
            if (isAdd) {
                this.value += value || 0;
            } else {
                this.value -= value || 0;
            }
        } else {
            if (this.attrType !== attrORtype.attrType) { return false; }
            if (isAdd) {
                this.value += attrORtype.value || 0;
            } else {
                this.value -= attrORtype.value || 0;
            }
        }
        return true;
    }
    public add(attr: IAttrBase): boolean
    public add(attrType: EAttrType, value: number): boolean
    public add(attrORtype: IAttrBase | EAttrType, value?: number): boolean {
        return this.calculate(true, attrORtype, value);
    }

    public diff(attr: IAttrBase): boolean
    public diff(attrType: EAttrType, value: number): boolean
    public diff(attrORtype: IAttrBase | EAttrType, value?: number): boolean {
        return this.calculate(false, attrORtype, value);
    }

    /** 倍数 */
    public mul(times: number, fractionDigits?: number): void {
        if (fractionDigits) {
            this.value = +(this.value * times).toFixed(fractionDigits);
        } else {
            this.value = Math.floor(this.value * times);
        }
    }

    /** 战力 */
    public get fightValue(): number {
        if (!this._calcFlag) {
            this._calcFlag = true;
            const fv: number = Config.Get(Config.Type.Cfg_Attr_Relation).getValueByKey(this.attrType, 'FightValue') || 0;
            this._fightValue = this.value * fv;
        }
        return this._fightValue;
    }

    /** 清除计算战力标记，让下一次拿战力的时候重新计算 */
    private clearCalcFlag() {
        this._calcFlag = false;
    }
}
