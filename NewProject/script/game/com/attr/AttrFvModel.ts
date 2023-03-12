/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-07-14 11:57:14
 * @FilePath: \SanGuo\assets\script\game\com\attr\AttrFvModel.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { E } from '../../const/EventName';

const { ccclass } = cc._decorator;
@ccclass('AttrFvModel')
export class AttrFvModel extends BaseModel {
    public init(): void {
        // throw new Error('Method not implemented.');
    }
    public clearAll(): void {
        //
    }

    private _attrData: { [key: number]: FightAttrData } = {};

    public getAttrData(key: number): FightAttrData {
        return this._attrData[key];
    }

    public setAttrData(list: FightAttrData[]): void {
        if (list) {
            if (!this._attrData) {
                this._attrData = {};
            }
            for (let i = 0; i < list.length; i++) {
                const key = list[i].Key;
                this._attrData[key] = list[i];
            }
            EventClient.I.emit(E.AttrFv.UptAttrFv);
        }
    }
}
