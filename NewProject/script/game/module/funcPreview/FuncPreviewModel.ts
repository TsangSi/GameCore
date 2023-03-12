/*
 * @Author: kexd
 * @Date: 2023-02-17 11:20:03
 * @FilePath: \SanGuo2.4\assets\script\game\module\funcPreview\FuncPreviewModel.ts
 * @Description:
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';

const { ccclass } = cc._decorator;
@ccclass('FuncPreviewModel')
export class FuncPreviewModel extends BaseModel {
    private _curIndex: number = 0;
    /** 当前已开放的功能id */
    private _curOpenFunc: number = 0;
    /** 已领取的功能预告的功能id列表 */
    private _gotFuncIds: number[] = [];
    /** 已开放的功能预告的功能id列表 用UtilFuncOpen里的getServerOpen */
    /** 所有功能预告的功能id列表 */
    private _allFuncIds: number[] = [];

    public clearAll(): void {
        //
    }

    public init(): void {
        //
    }

    /** 获取功能预告的所有功能id */
    public getAllFuncPreview(): number[] {
        if (!this._allFuncIds || this._allFuncIds.length === 0) {
            this._allFuncIds = [];
            const indexer = Config.Get(Config.Type.Cfg_FuncPreview);
            const configKeys = indexer.getKeys();
            for (let i = 0; i < configKeys.length; i++) {
                this._allFuncIds.push(configKeys[i]);
            }
        }
        return this._allFuncIds;
    }

    /** 是否是要预告的功能 */
    public isFuncPreview(funcId: number): boolean {
        if (!this._allFuncIds || this._allFuncIds.length === 0) {
            this.getAllFuncPreview();
        }
        return this._allFuncIds.indexOf(funcId) >= 0;
    }

    /** 获取当前功能预告的功能id */
    public getFuncPreviewId(): number {
        if (!this._allFuncIds || this._allFuncIds.length === 0) {
            this.getAllFuncPreview();
        }
        const indexer = Config.Get(Config.Type.Cfg_FuncPreview);
        const opens: number[] = UtilFunOpen.getServerOpen();
        let index: number = this._curIndex;
        let allOpen: boolean = true;
        for (let i = index; i < this._allFuncIds.length; i++) {
            const idx: number = opens.indexOf(this._allFuncIds[i]);
            if (idx < 0) {
                // 还需额外判断表里是否填了要预告的
                const cfg: Cfg_FuncPreview = indexer.getValueByKey(this._allFuncIds[i]);
                if (cfg && cfg.IFShow) {
                    index = i;
                    allOpen = false;
                    break;
                }
            }
        }
        if (!allOpen) {
            this._curIndex = index;
            this._curOpenFunc = this._allFuncIds[this._curIndex];
        } else {
            this._curIndex = null;
            this._curOpenFunc = null;
        }

        return this._curOpenFunc;
    }

    /** 读已领取的功能预告id列表 */
    public getFuncGot(): number[] {
        return this._gotFuncIds;
    }

    /** 设置已领取的功能id */
    public setFuncGot(openFuncIds: number[]): void {
        this._gotFuncIds = openFuncIds;
    }

    /** 更新已领取的功能id */
    public refreshFuncGot(funcId: number): void {
        const index = this._gotFuncIds.indexOf(funcId);
        if (index < 0) {
            this._gotFuncIds.push(funcId);
        }
        EventClient.I.emit(E.FuncPreview.Got, funcId);
    }

    /** 获取功能预告的描述 */
    public getFuncDesc(funcId: number, cfg?: Cfg_FuncPreview, isCut?: boolean): string {
        if (!funcId) return '';
        if (!cfg) {
            cfg = Config.Get(Config.Type.Cfg_FuncPreview).getValueByKey(funcId);
        }
        if (!cfg) return '';
        let des: string = '';
        const arrs = cfg.MSG;
        const arr = arrs.split(':');
        for (let i = 0; i < arr.length; i++) {
            const condition = UtilFunOpen.getConditionDesc(funcId, arr[i], isCut);
            if (condition !== '') {
                des = condition;
                break;
            }
        }
        return des;
    }
}
