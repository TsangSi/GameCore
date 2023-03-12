import { AttrBase } from './AttrBase';
import {
    EAttrShowType, IAttrBase, IAttrInfo,
} from './AttrConst';

/*
 * @Author: zs
 * @Date: 2022-06-21 21:38:11
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\attribute\AttrInfo.ts
 * @Description: 属性
 */
interface IAttrTimes {
    [attrType: number]: number
}

export class AttrInfo implements IAttrInfo {
    /** 战力是否已计算的标记 */
    private _calcFlag: boolean = false;
    private _fightValue: number = 0;
    public get fightValue(): number {
        if (!this._calcFlag) {
            this._calcFlag = true;
            this._fightValue = 0;
            this.attrs.forEach((a) => {
                this._fightValue += a.fightValue;
            });
        }
        return this._fightValue;
    }
    public set fightValue(fv: number) {
        this._fightValue = fv;
    }
    public attrs: AttrBase[] = [];
    public static ShowAttrType = EAttrShowType;

    public constructor(...datas: IAttrInfo[]);
    public constructor(...datas: IAttrBase[]);
    public constructor(...datas: IAttrInfo[] | IAttrBase[]) {
        if (datas.length > 0) {
            // eslint-disable-next-line dot-notation
            if (datas[0] && datas[0]['attrType']) {
                this.constructorAttrType(...datas as IAttrBase[]);
            } else {
                this.constructorData(...datas as IAttrInfo[]);
            }
        }
    }

    /**
     * 克隆一个同样属性的AttrInfo
     */
    public clone(): AttrInfo {
        return new AttrInfo(this);
    }

    private constructorData(...datas: IAttrInfo[]) {
        this.calculateAttr(true, ...datas);
    }
    private constructorAttrType(...datas: IAttrBase[]) {
        datas.forEach((data) => {
            const attr = new AttrBase(data);
            this.attrs.push(attr);
        });
    }

    /**
     * 多个属性相加
     * @param aInfo 副属性Info，被增加者
     * @param outInfo 可选参数，主属性Info，增加者
     */
    public add(...aInfos: IAttrInfo[]): AttrInfo {
        return this.calculateAttr(true, ...aInfos);
    }

    /**
     * 多个属性相减
     * @param aInfo 副属性Info，被增加者
     * @param outInfo 可选参数，主属性Info，增加者
     */
    public diff(...aInfos: IAttrInfo[]): AttrInfo {
        return this.calculateAttr(false, ...aInfos);
    }

    /**
     * 多个属性计算，加 or 减
     * @param isAdd true为加，false为减
     * @param aInfos 属性集合
     */
    private calculateAttr(isAdd: boolean, ...aInfos: IAttrInfo[]): AttrInfo {
        aInfos.forEach((aInfo) => {
            // if (isAdd) {
            //     this.fightValue += aInfo.fightValue || 0;
            // } else {
            //     this.fightValue -= aInfo.fightValue || 0;
            // }
            if (aInfo.attrs) {
                aInfo.attrs.forEach((aInfo1) => {
                    let isNewAttr = true;
                    this.attrs.forEach((a2) => {
                        if (isAdd && a2.add(aInfo1)) {
                            isNewAttr = false;
                        } else if (!isAdd && a2.diff(aInfo1)) {
                            isNewAttr = false;
                        }
                    });
                    if (isNewAttr) {
                        this.attrs.push(new AttrBase(aInfo1));
                    }
                });
            }
        });
        this.clearCalcFlag();
        return this;
    }

    /**
     * 将属性x倍数
     * @param times 倍数
     */
    public mul(times: number): AttrInfo;
    /**
     * 将属性x倍数
     * @param times 倍数
     * @param fractionDigits 小数点后的位数。 必须在 0 - 20 的范围内，包括 0 到 20。
     */
    public mul(times: number, fractionDigits: number): AttrInfo;
    /**
     * 将属性x倍数
     * @param times 倍数
     * @param attrTimes 可选参数，不同属性不同倍数,{ 1: 2, 2: 1.5} 生命x2,攻击x1.5
     */
    public mul(times: number, attrTimes: IAttrTimes): AttrInfo;
    /**
     * 将属性x倍数
     * @param times 倍数
     * @param attrTimes 可选参数，不同属性不同倍数,{ 1: 2, 2: 1.5} 生命x2,攻击x1.5
     * @param fractionDigits 小数点后的位数。 必须在 0 - 20 的范围内，包括 0 到 20。
     */
    public mul(times: number, attrTimes: IAttrTimes, fractionDigits: number): AttrInfo;
    public mul(times: number, fractionDigitsORattrTimes?: IAttrTimes | number, fractionDigits?: number): AttrInfo {
        // let fv = 0;
        let _times = times;
        let attrTimes: IAttrTimes;
        if (typeof fractionDigitsORattrTimes === 'number') {
            fractionDigits = fractionDigitsORattrTimes;
        } else {
            attrTimes = fractionDigitsORattrTimes;
        }
        this.attrs.forEach((a1) => {
            if (attrTimes && attrTimes[a1.attrType]) {
                _times = attrTimes[a1.attrType] || times;
            } else {
                _times = times;
            }
            a1.mul(_times, fractionDigits);
            // fv += a1.fightValue;
        });
        // this.fightValue = fv;
        this.clearCalcFlag();
        return this;
    }
    /** 清除计算战力标记，让下一次拿战力的时候重新计算 */
    private clearCalcFlag() {
        this._calcFlag = false;
    }
}
