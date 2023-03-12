/*
 * @Author: zs
 * @Date: 2022-12-02 16:20:55
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\v\CollectionBookPageBase.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import ListView from '../../../base/components/listview/ListView';
import Progress from '../../../base/components/Progress';
import { Config } from '../../../base/config/Config';
import { ConfigCollectionBookIndexer } from '../../../base/config/indexer/ConfigCollectionBookIndexer';
import { TabContainer } from '../../../com/tab/TabContainer';
import { TabData } from '../../../com/tab/TabData';
import { TabItem } from '../../../com/tab/TabItem';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import { ECollectionBookTabId } from '../CollectionBookConst';
import CollectionBookModel from '../CollectionBookModel';

const { ccclass, property } = cc._decorator;
@ccclass
export default class CollectionBookPageBase extends WinTabPage {
    @property(Progress)
    private Progress: Progress = null;
    @property(cc.Label)
    private LabelScore: cc.Label = null;
    @property(ListView)
    private ListView: ListView = null;

    @property({
        type: cc.Enum(ECollectionBookTabId),
    })
    protected bigType: ECollectionBookTabId = ECollectionBookTabId.Career;
    protected subType: number = 0;

    private _model: CollectionBookModel = null;
    protected get model(): CollectionBookModel {
        if (!this._model) {
            this._model = ModelMgr.I.CollectionBookModel;
        }
        return this._model;
    }
    /** 显示索引列表 */
    // protected showIndexs: number[] = [];
    protected selectQuality: number = 0;
    protected indexsByQuality: { [quality: number]: number[] } = cc.js.createMap(true);
    // protected showQualitys(): void {
    /** 对应索引列表存储得激活状态 */
    protected indexActives: { [index: number]: boolean } = cc.js.createMap(true);
    /** 见闻评分 */
    private score: number = 0;
    /** 已激活的数量 */
    private activeNum: number = 0;
    protected qualitys: number[] = [];
    private _cfgBook: ConfigCollectionBookIndexer;
    protected get cfgBook(): ConfigCollectionBookIndexer {
        if (this._cfgBook) {
            return this._cfgBook;
        }
        this._cfgBook = Config.Get<ConfigCollectionBookIndexer>(Config.Type.Cfg_CollectionBook);
        return this._cfgBook;
    }
    protected start(): void {
        super.start();
        EventClient.I.on(E.CollectionBook.NewActive, this.onNewActive, this);
        EventClient.I.on(E.CollectionBook.UpdateStar, this.onUpdateStar, this);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        this.bigType = tabId;
        this.clearData();
        this.saveQualitys();
    }

    protected saveQualitys(): void {
        // 全部
        // eslint-disable-next-line max-len
        this.indexsByQuality[0] = this.cfgBook.getIndexsByClass(this.bigType, this.subType);
        this.qualitys.length = 0;
        let c: Cfg_CollectionBook;
        this.getAllIndexes().forEach((i) => {
            c = this.model.getCfg().getValueByIndex(i);
            if (this.qualitys.indexOf(c.Quality) < 0) {
                this.qualitys.push(c.Quality);
            }
            this.indexsByQuality[c.Quality] = this.indexsByQuality[c.Quality] || [];
            this.indexsByQuality[c.Quality].push(i);
        });
    }

    protected getShowIndexs(): number[] {
        return this.indexsByQuality[this.selectQuality];
    }
    protected getShowIndex(index: number): number {
        return this.indexsByQuality[this.selectQuality][index] || 0;
    }

    protected getAllIndexes(): number[] {
        return this.indexsByQuality[0];
    }

    /** 显示items */
    protected showItems(): void {
        if (this.indexsByQuality[this.selectQuality]) {
            this.ListView.setNumItems(this.indexsByQuality[this.selectQuality].length);
        } else {
            console.warn('CollectionBookPageBase错误类型=', this.bigType);
        }
    }

    /** 更新评分 */
    protected updateScore(isChange = true): void {
        let c: Cfg_CollectionBook;

        this.getAllIndexes().forEach((i) => {
            c = this.model.getCfg().getValueByIndex(i);
            if (!this.indexActives[i] && this.model.getItem(c.Id)) {
                this.score += c.AddExp;
                this.activeNum += 1;
                this.indexActives[i] = true;
            } else if (!this.model.getItem(c.Id)) {
                this.indexActives[i] = false;
            }
        });
        this.LabelScore.string = `${this.score}`;
        this.Progress.updateProgress(this.activeNum, this.getAllIndexes().length, isChange);
        this.updateAttr();
    }

    /** 更新评分 */
    protected onUpdateScore(isChange: boolean = true): void {
        // const activeNum = this.activeNum;
        this.updateScore(isChange);
        // for (let i = activeNum; i < this.activeNum; i++) {
        this.ListView.updateAll();
        // }
    }

    /** 可重写，更新属性 */
    protected updateAttr(): void {
        //
    }

    protected clearData(): void {
        this.indexsByQuality = cc.js.createMap(true);
        this.indexActives = cc.js.createMap(true);
        this.activeNum = 0;
        this.score = 0;
    }

    protected onNewActive(): void {
        this.onUpdateScore(true);
    }

    protected onUpdateStar(): void {
        this.updateAttr();
        this.ListView.updateAll();
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.CollectionBook.NewActive, this.onNewActive, this);
        EventClient.I.off(E.CollectionBook.UpdateStar, this.onUpdateStar, this);
    }
}
