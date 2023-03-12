/** import {' cc._decorator } 'from 'cc';  //*/
import BaseModel from '../../app/core/mvc/model/BaseModel';

const { ccclass } = cc._decorator;
@ccclass('GmModel')
export class GmModel extends BaseModel {
    public clearAll(): void {
        //
    }
    public clear(): void {
        //
    }
    /** 存储页面打开的时间 */
    private _pageOpenTimeMap: Map<string, number> = new Map<string, number>();
    public setPageTime(k: string, t: number): void {
        if (!this._pageOpenTimeMap.get(k)) { this._pageOpenTimeMap.set(k, t); }
    }
    public getAllPageTime(): Map<string, number> {
        return this._pageOpenTimeMap;
    }
}
