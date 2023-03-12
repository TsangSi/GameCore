/** import {' BoxCollider2D, js } 'from 'cc';  // */
/** import { CC'_DEV } 'from 'cc/env';  // */
import { BaseEvent } from '../../../app/base/event/BaseEvent';
import { EventProto } from '../../../app/base/event/EventProto';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import { RedDotCheckMgr } from './RedDotCheckMgr';
import {
    REDDOT_ADD_LISTEN_INFO,
    ERedListen, IListenInfo, IRedDotMgr, IRedInfo, RID,
} from './RedDotConst';

interface IRidObj {
    Id: number,
}

/*
 * @Author: zs
 * @Date: 2022-08-02 20:27:48
 * @FilePath: \SanGuo\assets\script\game\module\reddot\RedDotMgrBase.ts
 * @Description:
 *
 */

export class RedDotMgrBase extends BaseEvent implements IRedDotMgr {
    protected redInfo: { [rid: number]: IRedInfo } = cc.js.createMap(true);

    private _inited: boolean = false;
    private checkMgr: RedDotCheckMgr;
    private listenInfos: { [rid: number]: IListenInfo } = cc.js.createMap(true);
    public init(): boolean {
        if (this._inited) {
            return false;
        }

        this.checkMgr = RedDotCheckMgr.I;
        this.checkMgr.setRedDotMgr(this);
        this._inited = true;
        this.on(REDDOT_ADD_LISTEN_INFO, this.addListenInfo, this);

        for (const k in RID) {
            this.register(RID[k], k);
        }
        // ModelMgr.I.registerRedDotListen();
        if (CC_DEV) {
            // console.log(this.redInfo);
        }
        return true;
    }
    public getStatus(rid: number): boolean {
        return false;
    }

    public getRedName(rid: number): string {
        return this.redInfo[rid]?.n || '';
    }

    /**
     * 注册红点数据
     * @param root 如果根类型没有子类型就使用number, 否则使用配置
     */
    public register(root: number | IRidObj, key: string, ...pid: number[]): void {
        if (typeof root === 'number') {
            // if (CC_DEV) {
            //     this.addDEV(key, root, this.listenInfos[root]);
            // } else {
            //     this.add(root, this.listenInfos[root]);
            // }
            if (pid && pid.length) {
                this._add(root, this.listenInfos[root], key, ...pid);
            } else {
                this._add(root, this.listenInfos[root], key);
            }
            delete this.listenInfos[root];
        } else {
            this._register(root, root.Id, key);
        }
    }

    private _add(child: number, listenInfo: IListenInfo, key: string, ...curPid: number[]) {
        if (CC_DEV) {
            if (curPid) {
                this.addDEV(key, child, this.listenInfos[child], ...curPid);
            } else {
                this.addDEV(key, child, this.listenInfos[child]);
            }
        } else if (curPid) {
            this.add(child, this.listenInfos[child], ...curPid);
        } else {
            this.add(child, this.listenInfos[child]);
        }
    }

    private _register(root: IRidObj, pid?: number, rootKey?: string): void {
        /** 是否原始根类型 */
        let isSourceRoot = false;
        let child: number | IRidObj;
        for (const key in root) {
            child = root[key];
            if (typeof child === 'number') {
                isSourceRoot = child === root.Id;
                const curPid = !isSourceRoot ? root.Id : child !== pid ? pid : undefined;
                if (isSourceRoot) {
                    pid = root.Id;
                }
                // if (CC_DEV) {
                //     if (curPid) {
                //         this.addDEV(key === 'Id' ? rootKey : key, child, this.listenInfos[child], curPid);
                //     } else {
                //         this.addDEV(key === 'Id' ? rootKey : key, child, this.listenInfos[child]);
                //     }
                // } else if (curPid) {
                //     this.add(child, this.listenInfos[child], curPid);
                // } else {
                //     this.add(child, this.listenInfos[child]);
                // }
                if (curPid) {
                    this._add(child, this.listenInfos[child], CC_DEV ? key === 'Id' ? rootKey : key : '', curPid);
                } else {
                    this._add(child, this.listenInfos[child], CC_DEV ? key === 'Id' ? rootKey : key : '');
                }
                delete this.listenInfos[child];
            } else {
                // 递归解析配置
                this._register(child, pid, key);
            }
        }
    }

    /**
     * 创建一个红点信息
     * @param rid 红点id
     * @param listenInfo 监控信息
     * @param parentRIds 父红点
     */
    protected create(rid: number, ...parentRIds: number[]): IRedInfo {
        const obj: IRedInfo = cc.js.createMap(true);
        obj.Pids = parentRIds || [];
        obj.showChilds = this.redInfo[rid]?.showChilds || [];
        obj.length = this.redInfo[rid]?.length || 0;
        obj.isNoneChild = this.redInfo[rid]?.isNoneChild || true;
        return obj;
    }

    /** 添加红点监听信息，可变传参，可能有多个 */
    public addListenInfo(data: { rid: number, info: IListenInfo }): void;
    public addListenInfo(...datas: { rid: number, info: IListenInfo }[]): void {
        datas.forEach((d) => {
            if (!d.info) {
                console.warn('监听信息info为空', d.rid);
            }
            this._addListenInfo(d.rid, d.info);
        });
    }

    /** 添加红点监听信息 */
    private _addListenInfo(rid: number, listenInfo: IListenInfo) {
        const obj = this.redInfo[rid];
        if (!obj) {
            this.listenInfos[rid] = listenInfo;
            return;
        }
        for (const k in listenInfo) {
            if (ERedListen[k] !== undefined && ERedListen[k] !== null) {
                this.checkMgr.listen(ERedListen[k], rid, listenInfo[k]);
            } else {
                obj[k] = listenInfo[k];
            }
        }
    }

    /** 根据红点id获取实际触发的红点id列表 */
    public getNeedCallRids(rid: number): number[] {
        const info = this.redInfo[rid];
        if (info && info.CheckVid && info.ProxyRid) {
            for (let i = 0, n = info.CheckVid.length; i < n; i++) {
                if (WinMgr.I.checkIsOpen(info.CheckVid[i])) {
                    return [rid];
                }
            }
            return info.ProxyRid;
        }
        return [rid];
    }

    protected add(rid: number, listenInfo: IListenInfo, ...parentRids: number[]): void {
        if (this.redInfo[rid]) {
            this.redInfo[rid].Pids = this.redInfo[rid].Pids.concat(parentRids);
        } else {
            this.redInfo[rid] = this.create(rid, ...parentRids);
        }
        if (listenInfo) {
            this._addListenInfo(rid, listenInfo);
        }
        if (parentRids) {
            parentRids.forEach((pid) => {
                delete this.redInfo[pid].isNoneChild;
            });
        }
    }

    protected addDEV(n: string, rid: number, listenInfo: IListenInfo, ...parentRids: number[]): void {
        this.redInfo[rid] = this.create(rid, ...parentRids);
        if (listenInfo) {
            this._addListenInfo(rid, listenInfo);
        }
        if (parentRids) {
            parentRids.forEach((pid) => {
                if (this.redInfo[pid].childs) {
                    this.redInfo[pid].childs.push(rid);
                } else {
                    this.redInfo[pid].childs = [rid];
                }
                delete this.redInfo[pid].isNoneChild;
            });
        }
        this.redInfo[rid].n = n;
    }
}
