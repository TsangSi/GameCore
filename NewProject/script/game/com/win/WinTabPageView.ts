/*
 * @Author: myl
 * @Date: 2022-08-30 17:11:23
 * @Description:
 */
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { TabContainer } from '../tab/TabContainer';
import { TabData } from '../tab/TabData';
import { TabItem } from '../tab/TabItem';
import { WinTabPage } from './WinTabPage';

const { ccclass, property } = cc._decorator;

// 界面刷新事件 （每次切页签都会调用）
const PageRefreshEvent = 'PageRefreshEvent';

@ccclass
export abstract class WinTabPageView extends WinTabPage {
    @property(TabContainer)
    protected tabContainer: TabContainer = null;
    protected _selectId: number = -1;
    protected _NdContents: Map<string, cc.Node> = new Map();
    // 容器节点
    @property(cc.Node)
    private NdBg: cc.Node = null;

    /** 底部tab选中事件 */
    private tabClickEvents(item: TabItem) {
        this.addNdContents(item.getData());
    }

    protected addNdContents(data: TabData, param: any = null): void {
        // const data = item.getData();
        this._selectId = data.id;
        const desId = data.descId || 0;
        this.getWinTabFrame().setDesc(desId);
        const nd = this._NdContents.get(data.uiPath);
        this.hideOthersNd(nd);
        if (nd) {
            nd.active = true;
            // 发送事件 刷新界面
            nd.emit(PageRefreshEvent, this._selectId, this.tabIdx, this.tabId, param, this.winId);
        } else {
            this.initTabView(data);
        }
    }

    private hideOthersNd(newNode: cc.Node) {
        this._NdContents.forEach((nd) => {
            if (nd !== newNode) {
                nd.active = false;
            }
        });
    }

    public initTabView(data: TabData): void {
        if (data.uiPath === null || data.uiPath.length === 0) {
            console.error('缺少页面路径配置，如需自定义写法 请重写改方法 无需执行super.initTabView()');
            return;
        }
        ResMgr.I.showPrefabOnce(data.uiPath, this.NdBg, (err, node) => {
            if (err) {
                console.log('添加界面出错', data.uiPath);
                return;
            }
            // 首次加载发送事件刷新界面
            // node.emit(PageRefreshEvent, this._selectId, this.tabIdx, this.tabId, this.param, this.winId);
            const pageView = node.getComponent(TabPagesView);
            if (pageView) {
                pageView.init(this._selectId, this.tabIdx, this.tabId, this.param, this.winId);
            } else {
                console.error('二级页签需要继承pagesview');
            }

            this._NdContents.set(data.uiPath, node);
        });
    }

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        const pages = this.tabPages();
        if (pages.length <= 0) {
            console.warn('未配置页签数据');
            return;
        }
        if (!param) {
            this._selectId = pages[0].id;
        } else {
            const paramIndex = param[1];
            if (paramIndex) {
                this._selectId = parseInt(param[1]);
            } else {
                this._selectId = pages[0].id;
            }
        }
        this.tabContainer.setData(pages, this._selectId);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        this.tabIdx = tabIdx;
        this.tabId = tabId;
        // 二级页签重新选中
        const pages = this.tabPages();
        // const newId = pages[0].id;
        // if (newId === this._selectId) {
        //     // 手动做一次刷新
        //     this.addNdContents(pages[0], param);
        //     this._selectId = newId;
        // } else {
        //     this._selectId = Number(param[1]);
        // }
        if (!param) {
            this._selectId = pages[0].id;
            this.addNdContents(pages[0], param);
        } else {
            const paramIndex = param[1];
            if (paramIndex) {
                this._selectId = parseInt(param[1]);
            } else {
                this._selectId = pages[0].id;
            }
        }
        this.tabContainer.setData(pages, this._selectId);
    }

    public abstract tabPages(): TabData[];
}

export class TabPagesView extends BaseUiView {
    protected onLoad(): void {
        super.onLoad();
        this.node.on(PageRefreshEvent, this.updateUI, this);
    }

    /**
    * 重写该方法可以获取到一下内容
    * @param idx  当前二级页签的id
    * @param tabIdx 当前一级页面的index
    * @param tabId 当前一级页签的id
    */
    protected updateUI(...param): void {
        //
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.node.off(PageRefreshEvent, this.updateUI, this);
    }
}
