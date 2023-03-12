/** import {' js } 'from 'cc';  // */
import { BaseEvent } from '../../../app/base/event/BaseEvent';
import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import { BagItemChangeInfo, BagItemChangeType } from '../bag/BagConst';
import { ERedListen, IRedDotMgr, RID } from './RedDotConst';

/*
 * @Author: zs
 * @Date: 2022-07-27 15:40:09
 * @FilePath: \SanGuo\assets\script\game\module\reddot\RedDotCheckMgr.ts
 * @Description:
 *
 */
export class RedDotCheckMgr extends BaseEvent {
    private redDotMgr: IRedDotMgr;
    public setRedDotMgr(mgr: IRedDotMgr): void {
        this.redDotMgr = mgr;
    }
    public init(): void {
        // throw new Error('Method not implemented.');
    }
    private static _i: RedDotCheckMgr;
    public static get I(): RedDotCheckMgr {
        if (!this._i) {
            this._i = new RedDotCheckMgr();
            // this._i.checkCall();
            EventClient.I.on(E.Lobby.FirstShow, this._i.onFirstShow, this._i);
        }
        return this._i;
    }

    /** 是否能检测，默认false */
    private isCanCheck: boolean = false;
    /** 刚进入游戏，因为有很多数据不是同时下发的，所以等主界面完全显示了再开始检测 */
    private onFirstShow() {
        this.isCanCheck = true;
        this.checkCall();
    }

    public static ShowLog: boolean = false;
    public onProto(id: ProtoId): void {
        // if (RedDotCheckMgr.ShowLog) {
        //     console.time(`红点检测：协议ID=${id}`);
        // }
        const num = this.tryCall(RedDotCheckMgr.ListenType.ProtoId, id);
        // if (RedDotCheckMgr.ShowLog && num) {
        //     // console.timeEnd(`红点检测：协议ID=${id}`);
        //     console.log('onProto push num：', num);
        // }
    }

    public onRoleAttr(data: { [key: string]: any }): void {
        // if (RedDotCheckMgr.ShowLog) {
        //     console.time(`红点检测：人物属性`);
        // }
        let num = 0;
        for (const k in data) {
            num += this.tryCall(RedDotCheckMgr.ListenType.RoleAttr, k);
        }
        // if (RedDotCheckMgr.ShowLog && num) {
        //     // console.timeEnd(`红点检测：人物属性`);
        //     console.log('onRoleAttr push num：', num);
        // }
    }

    public onItem(changes: BagItemChangeInfo[]): void {
        // if (RedDotCheckMgr.ShowLog) {
        //     console.time(`红点检测：道具`);
        // }
        let num = 0;
        changes.forEach((info) => {
            if (info.status === BagItemChangeType.Add) {
                num += this.onItemNumAdd(RedDotCheckMgr.ListenType.ItemId, info.itemModel.cfg.Id);
                num += this.onItemNumAdd(RedDotCheckMgr.ListenType.ItemType, info.itemModel.cfg.Type);
                num += this.onItemNumAdd(RedDotCheckMgr.ListenType.ItemSubType, info.itemModel.cfg.SubType);
            } else {
                num += this.tryCall(RedDotCheckMgr.ListenType.ItemId, info.itemModel.cfg.Id);
                num += this.tryCall(RedDotCheckMgr.ListenType.ItemType, info.itemModel.cfg.Type);
                num += this.tryCall(RedDotCheckMgr.ListenType.ItemSubType, info.itemModel.cfg.SubType);
            }
        });
        // if (RedDotCheckMgr.ShowLog && num) {
        //     // console.timeEnd(`红点检测：人物属性`);
        //     console.log('onRoleAttr push num：', num);
        // }
    }

    private onItemNumAdd(type: ERedListen, id: number) {
        let num = 0;
        const data = this.getObjByType(type);
        if (data[id]) {
            data[id].forEach((rid) => {
                if (!this.redDotMgr.getStatus(rid)) {
                    num += this.checkPushNeedCallRid(rid);
                }
            });
        }
        return num;
    }
    public onEvent(eventName: string): void {
        // if (RedDotCheckMgr.ShowLog) {
        //     console.time(`红点检测：道具`);
        // }
        let num = 0;
        num += this.tryCall(RedDotCheckMgr.ListenType.EventClient, eventName);
        if (RedDotCheckMgr.ShowLog && num) {
            // console.timeEnd(`红点检测：道具`);
            console.log('onItem push num：', num);
        }
    }
    /** 监听的协议id列表 */
    protected _idsByProtoId: { [type: number]: { [id: string]: number[] } } = cc.js.createMap(true);
    public static ListenType = ERedListen;

    protected listenPid: { [sid: number]: number[] } = cc.js.createMap(true);

    private getObjByType(type: ERedListen) {
        if (this._idsByProtoId[type]) {
            return this._idsByProtoId[type];
        } else {
            this._idsByProtoId[type] = cc.js.createMap(true);
            return this._idsByProtoId[type];
        }
    }

    public listen(type: ERedListen, rid: number, sids: number[]): void {
        if (!sids) { return; }
        const obj = this.getObjByType(type);
        const ids = typeof sids === 'number' ? [sids] : sids;
        let list: number[];
        ids.forEach((id) => {
            list = obj[id] = obj[id] || [];
            if (list.indexOf(rid) < 0) {
                list.push(rid);
            }
        });
    }

    private pushWaitCallId(rid: number) {
        if (this._waitCallIds.indexOf(rid) < 0) {
            this.checkCall();
            return this._waitCallIds.push(rid);
        }
        return -1;
    }

    private checkTimer = undefined;
    private fpsCheckTimer = undefined;
    private checkCall() {
        if (this.checkTimer !== undefined || !this.isCanCheck) {
            return;
        }
        this.checkTimer = setInterval(() => {
            this.onOneSecond();
        }, 1000);
    }

    private oneFpsCallCount: number = 5;
    private onOneSecond() {
        const waitLength = this._waitCallIds.length;
        const length = Math.min(this.oneFpsCallCount, waitLength);
        if (length === 0) {
            this.clearTimer();
            return;
        }
        if (!this.fpsCheckTimer) {
            this.onOneFPS(waitLength, length);
        }
    }

    private onOneFPS(waitLength: number, length: number) {
        // if (RedDotCheckMgr.ShowLog) {
        //     console.time(`1秒触发一次，当前检测数量=${length},耗时：`);
        // }
        let id = 0;
        for (let i = 0; i < length; i++) {
            id = this._waitCallIds.shift();
            const name = this.redDotMgr.getRedName(id);
            if (RedDotCheckMgr.ShowLog) {
                console.time(`红点检测id=${id}，[${name}],耗时：`);
            }
            this.emit(id, id);
            if (RedDotCheckMgr.ShowLog) {
                console.timeEnd(`红点检测id=${id}，[${name}],耗时：`);
            }
        }
        // if (RedDotCheckMgr.ShowLog) {
        //     console.timeEnd(`1秒触发一次，当前检测数量=${length},耗时：`);
        // }
        if ((waitLength - length) > 0) {
            if (this.fpsCheckTimer !== undefined) {
                clearTimeout(this.fpsCheckTimer);
                this.fpsCheckTimer = undefined;
            }
            this.fpsCheckTimer = setTimeout(() => {
                if (this.fpsCheckTimer) {
                    clearTimeout(this.fpsCheckTimer);
                    this.fpsCheckTimer = null;
                }
                waitLength -= length;
                this.onOneFPS(waitLength, Math.min(this.oneFpsCallCount, waitLength));
            }, 10);
        }
    }

    private clearTimer() {
        if (this.checkTimer !== undefined) {
            clearInterval(this.checkTimer);
        }
        this.checkTimer = undefined;
    }

    private _waitCallIds: number[] = [];
    /**
     * 尝试触发
     * @param type 监听类型
     * @param id 监听的id
     * @returns
     */
    protected tryCall(type: ERedListen, id: number | string): number {
        const obj = this.getObjByType(type);
        let num = 0;
        if (obj[id]) {
            num = this.tryCallCheck(obj[id]);
        }
        return num;
    }

    /** 尝试触发检测 */
    private tryCallCheck(rids: number[]) {
        let num = 0;
        rids.forEach((rid) => {
            num += this.checkPushNeedCallRid(rid);
        });
        return num;
    }

    /**
     * 检测插入需要触发的红点id
     * @param rid 红点id
     * @returns
     */
    private checkPushNeedCallRid(rid: number) {
        /** 真实触发的红点id列表 */
        const needCallRids = this.redDotMgr.getNeedCallRids(rid);
        let num = 0;
        // 一般默认情况下，needCallRids.length就是1
        needCallRids.forEach((id) => {
            if (this.pushWaitCallId(id) >= 0) {
                num++;
                if (RedDotCheckMgr.ShowLog) {
                    if (rid !== id) {
                        console.log(`红点=${rid}的界面未打开，触发代理红点=${id}`);
                    }
                }
            } else if (RedDotCheckMgr.ShowLog) {
                console.log(`减少重复检测id=${id}`);
            }
        });
        return num;
    }
}
