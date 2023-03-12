/** import { CC'_DEV } 'from 'cc/env';  // */
import { EventProto } from '../../../app/base/event/EventProto';
import { EActivityRedId, IRedInfo } from './RedDotConst';
import { RedDotMgrBase } from './RedDotMgrBase';

/*
 * @Author: zs
 * @Date: 2022-07-26 18:36:05
 * @FilePath: \SanGuo2.4\assets\script\game\module\reddot\RedDotMgr.ts
 * @Description:
 *
 */

export class RedDotMgr extends RedDotMgrBase {
    private static _i: RedDotMgr;
    public static get I(): RedDotMgr {
        if (!this._i) {
            this._i = new RedDotMgr();
        }
        return this._i;
    }

    public init(): boolean {
        const b = super.init();
        if (b) {
            EventProto.I.on(ProtoId.S2CRedDotStateList_ID, this.onS2CRedDotStateList, this);
        }
        return b;
    }

    /**
     * 更新红点
     * @param rid 红点
     * @param childId 子红点
     * @param isShow 是否显示
     * @returns
     */
    private _updateRedDot(rid: number, childId: number, isShow: boolean) {
        const info = this.redInfo[rid];
        if (!info) {
            return;
        }
        // const isSelf = rid === childId;
        const index = info.showChilds.indexOf(childId);
        if (isShow) {
            if (index < 0) {
                this.pushChildRid(info, childId);
            }
        } else if (index >= 0) {
            this.removeChildRid(info, index);
            // // 删除一个，列表里还有id说明自己就是父红点。不是最下层的子红点
            // if (info.showChilds.length > 0) {
            //     // 尝试查找是不是自己在里面
            //     const selfIndex = info.showChilds.indexOf(rid);
            //     if (selfIndex) {
            //         // 移除自己
            //         this.removeChildRid(info, selfIndex);
            //     }
            // }
        } else {
            return;
        }
        const length = info.showChilds.length;
        isShow = length > 0;
        info.Pids.forEach((pid) => {
            this._updateRedDot(pid, rid, isShow);
        });

        this.emit(rid, isShow, length);
    }

    private pushChildRid(info: IRedInfo, rid: number) {
        info.showChilds.push(rid);
        info.length++;
    }

    private removeChildRid(info: IRedInfo, index: number) {
        return this.spliceChildRid(info, index, 1);
    }

    private spliceChildRid(info: IRedInfo, start: number, deleteCount?: number, ...items: number[]) {
        if (items && items.length) {
            info.length += items.length + deleteCount;
            return info.showChilds.splice(start, deleteCount, ...items);
        } else {
            if (deleteCount !== undefined || deleteCount !== null) {
                deleteCount = 1;
            }
            info.length -= deleteCount;
            return info.showChilds.splice(start, deleteCount);
        }
    }
    /**
     * 是否显示红点
     * @param rid 红点id
     * @returns
     */
    public getStatus(rid: number): boolean {
        return this.getRedCount(rid) > 0;
    }

    /**
     * 获取红点数量
     * @param rid 红点id
     * @returns
     */
    public getRedCount(rid: number): number {
        const info = this.redInfo[rid];
        if (!info) {
            return 0;
        }
        // if (info.length > 1 && info.showChilds.indexOf(rid) >= 0) {
        //     return info.length - 1;
        // }
        return info.length;
    }

    /**
     * 更新红点状态
     * @param rid 红点id
     * @param isShow 是否显示红点
     * @returns
     */
    public updateRedDot(rid: number, isShow: boolean): boolean {
        if (rid > EActivityRedId) {
            this.register(rid, '');
            this._updateRedDot(rid, rid, isShow);
            return isShow;
        }
        const info = this.redInfo[rid];
        if (!info) {
            console.log('无效的红点id，尝试去增加一个=', rid);
            const brotherRedInfo = this.redInfo[rid - 1];
            if (brotherRedInfo) {
                this.register(rid, `${brotherRedInfo.n || ''}_${rid}`, ...brotherRedInfo.Pids);
                this.updateRedDot(rid, isShow);
            }
            return isShow;
        }
        if (!info.isNoneChild) {
            const stack = new Error().stack;
            console.warn('不允许直接设置父红点状态，应该由子红点控制父红点=', info, isShow, stack);
            return isShow;
        }
        this._updateRedDot(rid, rid, isShow);
        return isShow;
    }

    /** 后端下发的红点列表 */
    private onS2CRedDotStateList(d: S2CRedDotStateList) {
        console.log('后端下发的红点列表', d);
        d.RedDotStateList.forEach((r) => {
            const info = this.redInfo[r.RedDotId]; // 只更新当前前端配置的红点
            if (info) {
                this.updateRedDot(r.RedDotId, r.State === 1);
            }
        });
    }
}

if (CC_DEV) {
    // eslint-disable-next-line dot-notation
    window['RedDotMgr'] = RedDotMgr;
}
