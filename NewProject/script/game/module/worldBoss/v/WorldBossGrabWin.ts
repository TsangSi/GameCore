/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: dcj
 * @Date: 2022-08-29 14:27:57
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\worldBoss\v\WorldBossGrabWin.ts
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import { WorldBossRPType } from '../WorldBossConst';
import { WorldBossModel } from '../WorldBossModel';
import { WorldBossGrabItem } from './WorldBossGrabItem';

const { ccclass, property } = cc._decorator;
@ccclass
export class WorldBossGrabWin extends WinCmp {
    @property(ListView)
    private list: ListView = null;
    @property(cc.Node)
    private BtnSclBottom: cc.Node = null;
    @property(cc.Node)
    private NdEmpty: cc.Node = null;

    private _source = [];
    private _M: WorldBossModel = null;
    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnSclBottom, () => {
            this.list.scrollTo(this._index + this._countNum, 0.618);
        }, this);
        EventClient.I.on(E.WorldBoss.UpdateRankData, this.updateItems, this);
        // this.list.getComponent(cc.ScrollView).node.on('scroll-to-bottom', this.scrollToBottom, this);
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param);
        this._M = ModelMgr.I.WorldBossModel;
        this.updateItems();
    }

    private _index: number = 0;
    private _countNum: number = 7;// 滑动框展示的条数
    private _init: boolean = false;
    private scrollEvent(nd: cc.Node, idx: number) {
        const item = nd.getComponent(WorldBossGrabItem);
        item.setData(this._source[idx], idx);
        const len = this._source.length;
        if (idx !== len && this.BtnSclBottom.active) {
            this._index = idx;
        }
        this.BtnSclBottom.active = len - 1 !== this._index;
        if (!this.BtnSclBottom.active && idx <= len - this._countNum - 3) {
            this.BtnSclBottom.active = true;
        }
    }
    // private scrollToBottom() {
    //     // 分段加载请求，减少后端压力
    //     const range = this._M.getRankRange(this._source[this._index].R);
    //     console.log(range);
    //     ControllerMgr.I.WorldBossController.C2SGetWorldBossRank(WorldBossRPType.RpSelf, range[0], range[1]);
    // }

    /** 初始化奖励 */
    private updateItems(): void {
        // 初始化数据
        this._source = [];
        const range = this._M.getRankRange(this._M.myRank);
        const _data = this._M.rankData.get(WorldBossRPType.RpSelf) || [];
        _data?.forEach((item, index) => {
            if (item.R >= range[0] && item.R <= range[1]) {
                this._source.push(item);
            }
        });
        this.NdEmpty.active = this._source.length === 0;
        this.list.setNumItems(this._source.length);
        this.BtnSclBottom.active = this._source.length > this._countNum;
        if (!this._init) {
            const myIndex = this._source.findIndex((item) => item.R === this._M.myRank);
            this.list.scrollTo(myIndex - 1, 0.618);
            this._init = true;
        }
    }
    protected onDestroy(): void {
        super.onDestroy();
    }
}
