/*
 * @Author: zs
 * @Date: 2022-12-02 11:53:56
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\CollectionBookModel.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { AttrModel } from '../../base/attribute/AttrModel';
import { Config } from '../../base/config/Config';
import { ConfigInfo } from '../../base/config/ConfigConst';
import { ConfigCollectionBookIndexer } from '../../base/config/indexer/ConfigCollectionBookIndexer';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import { BagMgr } from '../bag/BagMgr';
import { ETaskStatus } from '../task/TaskConst';
import { TaskMgr } from '../task/TaskMgr';
import { ECollectionBookCfg } from './CollectionBookConst';

const { ccclass, property } = cc._decorator;

@ccclass('CollectionBookModel')
export default class CollectionBookModel extends BaseModel {
    private _cfgs: ConfigIndexer[] = [];
    /**
     * 根据类型获取对应的配置表
     * @param type 类型
     * @returns
     */
    public getCfg(type: ECollectionBookCfg = ECollectionBookCfg.Main): ConfigIndexer {
        if (!this._cfgs[type]) {
            let info: ConfigInfo;
            switch (type) {
                case ECollectionBookCfg.Star:
                    info = Config.Type.Cfg_CollectionBookStar;
                    break;
                case ECollectionBookCfg.Level:
                    info = Config.Type.Cfg_CollectionBookLevel;
                    break;
                case ECollectionBookCfg.Task:
                    info = Config.Type.Cfg_CollectionBookTask;
                    break;
                default:
                    info = Config.Type.Cfg_CollectionBook;
                    break;
            }
            this._cfgs[type] = Config.Get(info);
        }
        return this._cfgs[type] as ConfigIndexer;
    }

    // private data: S2CCollectionBookAllData;
    private allItem: { [id: number]: CollectionBookSt } = cc.js.createMap(true);
    private allTasks: number[] = [];
    private _infoLevel: number = 0;
    private _infoExp: number = 0;
    // private _infoLevel: number;
    /** 见闻等级 */
    public get infoLevel(): number {
        return this._infoLevel || 0;
    }

    /** 见闻经验值 */
    public get infoLevelExp(): number {
        return this._infoExp || 0;
    }

    private _fullLevelNeedExp: number = 0;
    public get fullLevelNeedExp(): number {
        if (this._fullLevelNeedExp) {
            return this._fullLevelNeedExp;
        }
        Config.Get(Config.Type.Cfg_CollectionBookLevel).forEach((cfg: Cfg_CollectionBookLevel) => {
            if (cfg.ExpMax) {
                this._fullLevelNeedExp += cfg.ExpMax;
            }
            return true;
        });

        return this._fullLevelNeedExp;
    }

    /**
     * 根据类型获取已有的评分，没有传参则全部类型
     * @param bigType 类型
     * @returns
     */
    public getScore(bigType: number): number {
        let score = 0;
        if (bigType) {
            const indexs = Config.Get<ConfigCollectionBookIndexer>(Config.Type.Cfg_CollectionBook).getIndexsByClass(bigType);
            indexs.forEach((index: number) => {
                const c: Cfg_CollectionBook = this.getCfg().getValueByIndex(index);
                if (c && this.getItem(c.Id)) {
                    score += c.AddExp;
                }
            });
        } else {
            this.getCfg().forEach((c: Cfg_CollectionBook) => {
                if (this.getItem(c.Id)) {
                    score += c.AddExp;
                }
                return true;
            });
        }
        return score;
    }

    /** 见闻任务列表 */
    public getSortTaskIds(): number[] {
        const ids: number[] = [];
        this.allTasks?.forEach((id) => {
            ids.push(id);
        });
        ids.sort((id1: number, id2: number) => {
            const m1 = TaskMgr.I.getTaskModel(id1);
            const m2 = TaskMgr.I.getTaskModel(id2);
            const s1 = (m1?.status === ETaskStatus.Processing ? ETaskStatus.Completed + 0.5 : m1?.status) || ETaskStatus.Awarded;
            const s2 = (m2?.status === ETaskStatus.Processing ? ETaskStatus.Completed + 0.5 : m2?.status) || ETaskStatus.Awarded;
            if (s1 === s2) {
                const c1: Cfg_CollectionBookTask = this.getCfg(ECollectionBookCfg.Task).getValueByKey(id1);
                const c2: Cfg_CollectionBookTask = this.getCfg(ECollectionBookCfg.Task).getValueByKey(id2);
                if (c1.SortIdx === c2.SortIdx) {
                    return c1.Id - c2.Id;
                } else {
                    return c1.SortIdx - c2.SortIdx;
                }
            } else {
                return s1 - s2;
            }
        });
        return ids;
    }

    public clearAll(): void {
        //
    }

    public setData(d: S2CCollectionBookAllData): void {
        // this.data = d;
        this.allTasks = d.TaskIds;
        this._infoExp = d.Exp;
        this._infoLevel = d.Level;
        d.Items.forEach((item) => {
            this.allItem[item.Id] = item;
        });
    }

    public updateData(d: S2CCollectionBookUpdate): void {
        if (d.Exp || d.Level) {
            this.updateExp(d.Exp, d.Level);
        }
        if (d.Item) {
            if (this.allItem[d.Item.Id]) {
                const oldNew = this.allItem[d.Item.Id].New;
                const oldShare = this.allItem[d.Item.Id].Share;
                this.allItem[d.Item.Id] = d.Item;
                if (oldNew !== d.Item.New) {
                    EventClient.I.emit(E.CollectionBook.UpdateCareer, d.Item.Id);
                }
                if (oldShare !== d.Item.Share) {
                    EventClient.I.emit(E.CollectionBook.UpdateCareerShare, d.Item.Id);
                }
            } else {
                this.allItem[d.Item.Id] = d.Item;
            }
        }
    }

    public updateTask(taskId: number, newTaskId: number): void {
        const compIndex = this.allTasks.indexOf(taskId);
        if (compIndex >= 0) {
            this.allTasks.splice(compIndex, 1);
        }
        if (this.allTasks.indexOf(newTaskId) < 0) {
            this.allTasks.push(newTaskId);
        }
        EventClient.I.emit(E.CollectionBook.UpdateTask, taskId);
    }

    public getItem(id: number): CollectionBookSt {
        return this.allItem[id];
    }

    /**
     * 更新经验和等级
     * @param exp 经验
     * @param level 等级
     */
    private updateExp(exp: number, level: number) {
        const oldLevel = this._infoLevel;
        this._infoExp = exp;
        this._infoLevel = level;
        EventClient.I.emit(E.CollectionBook.UpdateExp);
        if (oldLevel !== this._infoLevel) {
            EventClient.I.emit(E.CollectionBook.UpdateLevel);
        }
    }

    /** 见闻等级是否已满级 */
    public isInfoFullLevel(): boolean {
        const cfg = Config.Get(Config.Type.Cfg_CollectionBookLevel);
        const cfgLevel: Cfg_CollectionBookLevel = cfg.getValueByIndex(cfg.keysLength - 1);
        if (this.infoLevel >= cfgLevel.Level) {
            return true;
        }
        return false;
    }

    /** 是否满星 */
    public isFullStar(id: number): boolean {
        const length = this.getCfg(ECollectionBookCfg.Star).length;
        const cfgStar: Cfg_CollectionBookStar = this.getCfg(ECollectionBookCfg.Star).getValueByIndex(length - 1);
        const item = this.getItem(id);
        if (item && item.Star >= cfgStar.MaxLevel) {
            return true;
        }
        return false;
    }

    public isCanShowRed(id: number): boolean {
        const cfg: Cfg_CollectionBook = this.getCfg().getValueByKey(id);
        const item = this.getItem(id);
        if (item) {
            if (!this.isFullStar(cfg.Id)) {
                const cfgStar: Cfg_CollectionBookStar = Config.Get(Config.Type.Cfg_CollectionBookStar).getIntervalData(item.Star + 1);
                return BagMgr.I.getItemNum(cfg.StarUpItem) >= cfgStar.LevelUpItem;
            }
        } else {
            return BagMgr.I.getItemNum(cfg.Unlockitem) >= 1;
        }
        return false;
    }

    /**
     * 根据星级获取倍率
     * @param star 星级
     * @returns
     */
    public getAttrStarRatio(star: number): number {
        const cfgStar: Cfg_CollectionBookStar = ModelMgr.I.CollectionBookModel.getCfg(ECollectionBookCfg.Star).getIntervalData(star);

        const ratio = (cfgStar.TotalRatio - (cfgStar.MaxLevel - star + 1) * cfgStar.AttrRatio) / 10000;
        return ratio + 1;
    }

    /**
     * 根据id获取对应的已获得的属性
     * @param id 博物志唯一id
     * @returns
     */
    public getAttrById(id: number): AttrInfo {
        const item = this.getItem(id);
        if (item) {
            const cfg: Cfg_CollectionBook = this.getCfg().getValueByKey(id);
            const attr = AttrModel.MakeAttrInfo(cfg.Attr);
            const ratio = this.getAttrStarRatio(item.Star);
            attr.mul(ratio);
            return attr;
        } else {
            return undefined;
        }
    }

    /**
     * 显示插画详情
     * @param cfg 配置
     * @param isLink 是否超链接点进来的
     */
    public showCollectionPicDetailsWin(cfg: Cfg_CollectionBook, isLink: boolean = false): void {
        WinMgr.I.open(ViewConst.CollectionPicDetailsWin, cfg, isLink);
    }
}
