/*
 * @Author: kexd
 * @Date: 2023-02-22 17:28:17
 * @FilePath: \SanGuo2.4\assets\script\game\module\newMark\NewMark.ts
 * @Description: ‘新’标签脚本
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { Config } from '../../base/config/Config';
import { E } from '../../const/EventName';
import UtilNewMark from '../../base/utils/UtilNewMark';
import UtilFunOpen from '../../base/utils/UtilFunOpen';

const { ccclass, property } = cc._decorator;

@ccclass
export class NewMark extends cc.Component {
    private _funcId: number;
    private _pos: cc.Vec2;
    private _scale: number = 1;

    protected start(): void {
        EventClient.I.on(E.FuncPreview.FuncOpenNew, this.onFuncNew, this);
        EventClient.I.on(E.FuncPreview.FuncOpenDel, this.onFuncDel, this);
    }

    /**
     *
     * @param funcId 功能id
     * @param pos 位置
     * @param scale 缩放
     */
    public setData(funcId: number, pos: cc.Vec2, scale: number = 1): void {
        this._funcId = funcId;
        this._pos = pos;
        this._scale = scale;
    }

    /** 有新功能开启 */
    public onFuncNew(): number {
        const funcIds: number[] = UtilFunOpen.GetNewFuncIds();
        if (!funcIds || funcIds.length === 0) return 0;
        // console.log('有新功能开启', funcIds, this._funcId, this.node.name);
        if (funcIds.indexOf(this._funcId) >= 0) {
            UtilNewMark.UptNewMark(this.node, true, this._pos, this._scale);
            return this._funcId;
        } else {
            // 父级节点也会有‘新’标签
            let isNew: boolean = false;
            for (let i = 0; i < funcIds.length; i++) {
                const isParentFuncId: boolean = this.isParentFuncId(funcIds[i]);
                if (isParentFuncId) {
                    isNew = true;
                    break;
                }
            }
            UtilNewMark.UptNewMark(this.node, isNew, this._pos, this._scale);
            return this._funcId;
        }
    }

    /** 打开过了该新功能，则清除‘新’标签 */
    private onFuncDel(funcId: number) {
        if (!funcId) return;
        // console.log('清除‘新’标签', funcId, this._funcId, this.node.name);
        if (this._funcId === funcId) {
            UtilNewMark.UptNewMark(this.node, false, this._pos, this._scale);
        } else {
            // 检查父级节点是否还会有‘新’标签
            let isNew: boolean = false;
            // 检查当前还剩下的新开放功能id列表
            const newFuncIds: number[] = UtilFunOpen.GetNewFuncIds();
            if (newFuncIds.length > 0) {
                for (let i = 0; i < newFuncIds.length; i++) {
                    const isParentFuncId: boolean = this.isParentFuncId(newFuncIds[i]);
                    if (isParentFuncId) {
                        isNew = true;
                        break;
                    }
                }
            }
            UtilNewMark.UptNewMark(this.node, isNew, this._pos, this._scale);
        }
    }

    /** 是否在关联关系里 */
    private isParentFuncId(funcId: number): boolean {
        if (funcId === this._funcId) return true;
        const indexer = Config.Get(Config.Type.Cfg_Client_Func);
        let ccf: Cfg_Client_Func = null;
        let parentId: number = funcId;
        let count: number = 0;
        do {
            ccf = indexer.getValueByKey(parentId);
            parentId = ccf.Parent;
            count++;
            if (count >= 10) {
                console.warn('不可能会有10层的关联关系，检查配置是否有循环的情况', funcId);
            }
        } while (ccf.Parent && parentId !== this._funcId && count < 10);

        return parentId === this._funcId;
    }

    protected onDestroy(): void {
        EventClient.I.off(E.FuncPreview.FuncOpenNew, this.onFuncNew, this);
        EventClient.I.off(E.FuncPreview.FuncOpenDel, this.onFuncDel, this);
    }
}
