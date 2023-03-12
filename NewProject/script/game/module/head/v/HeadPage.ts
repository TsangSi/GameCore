/*
 * @Author: myl
 * @Date: 2022-11-16 11:17:20
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import ListView from '../../../base/components/listview/ListView';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagItemChangeInfo } from '../../bag/BagConst';
import { RoleMgr } from '../../role/RoleMgr';
import { HeadItemData, HeadPhotoType } from '../HeadConst';
import HeadItem from './HeadItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeadPage extends WinTabPage {
    /** 动态加载的父节点节点 */
    @property(cc.Node)
    private NdInfo: cc.Node = null;
    /** 动态预制路径 */
    @property
    private NdInfoPrefabPath: string = '';

    @property(ListView)
    private List: ListView = null;

    private _type: HeadPhotoType = HeadPhotoType.Head;
    private _ListData: HeadItemData[] = [];
    private _selectIndex: number = 0;
    private _defaultAutoSelect: boolean = true;

    private isInit: boolean = false;

    /** 滚动事件 */
    private scrollEvent(node: cc.Node, index: number) {
        const item: HeadItem = node.getComponent(HeadItem);
        item.setData(this._ListData[index], index, this._type);
    }

    private _selectId = 0;
    /** 选中事件 */
    private selectEvent(nd: cc.Node, index: number) {
        const data = this._ListData[index];
        if (data) {
            this._selectIndex = index;
            this._selectId = data.cfg.Id;
            EventClient.I.emit(E.Head.Select, data);
        }
    }

    protected onEnable(): void {
        if (this.isInit) {
            this.updateList();
        }
    }
    //
    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        this.isInit = true;
        this._type = tabId;
        this._defaultAutoSelect = true;
        EventClient.I.on(E.Head.List, this.updateList, this);
        EventClient.I.on(E.Head.Update, this.updateList, this);
        EventClient.I.on(E.Bag.ItemChange, this.bagChange, this);
        ResMgr.I.showPrefab(UI_PATH_ENUM.HeadInfoView, this.NdInfo, (err, nd: cc.Node) => {
            // 请求列表
            ControllerMgr.I.HeadController.GetUserHeadHeadFrame(this._type);
        });
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        this._type = tabId;
        this._defaultAutoSelect = true;
        // EventClient.I.on(E.Head.List, this.updateList, this);
        // EventClient.I.on(E.Head.Update, this.updateList, this);
        // ResMgr.I.showPrefab(UI_PATH_ENUM.HeadInfoView, this.NdInfo, (err, nd: cc.Node) => {
        // 请求列表
        ControllerMgr.I.HeadController.GetUserHeadHeadFrame(this._type);
        // });
    }

    private bagChange(d: BagItemChangeInfo[]) {
        let needRefresh = false;
        const ids: number[] = [];
        d.forEach((item) => {
            ids.push(item.itemModel.cfg.Id);
        });
        for (let i = 0; i < this._ListData.length; i++) {
            const ele = this._ListData[i];
            if (ids.indexOf(ele.cfg.Id) > -1 || ids.indexOf(Number(ele.cfg.UnlockItem.split(':')[0])) > -1) {
                needRefresh = true;
            }
        }
        if (needRefresh) {
            this.updateList();
        }
    }

    private updateList(): void {
        this._ListData = ModelMgr.I.HeadModel.getHeadListData(this._type);

        this.List.setNumItems(this._ListData.length, 0);

        if (this._ListData.length === 0) return;

        // 默认选中正在使用的
        if (this._defaultAutoSelect) { // 普通舒心导致的数据不会处理重新选中
            for (let i = 0; i < this._ListData.length; i++) {
                const itm = this._ListData[i];
                if (itm.data && itm.data.Status === 1) {
                    this._selectIndex = i;
                    break;
                }
            }
        } else {
            for (let i = 0; i < this._ListData.length; i++) {
                const itm = this._ListData[i];
                if (itm.cfg.Id === this._selectId) {
                    this._selectIndex = i;
                    break;
                }
            }
        }
        this.List.selectedId = this._selectIndex;
        EventClient.I.emit(E.Head.Select, this._ListData[this._selectIndex]);
        this._defaultAutoSelect = false;
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Head.List, this.updateList, this);
        EventClient.I.off(E.Head.Update, this.updateList, this);
        EventClient.I.off(E.Bag.ItemChange, this.bagChange, this);
    }
}
