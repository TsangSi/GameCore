/*
 * @Author: myl
 * @Date: 2022-08-30 16:33:33
 * @Description:
 */
import { ResMgr } from '../../../app/core/res/ResMgr';
import { Config } from '../../base/config/Config';
import { ConfigPassLevelIndexer } from '../../base/config/indexer/ConfigPassLevelIndexer';
import { UtilGame } from '../../base/utils/UtilGame';
import { TabContainer } from '../../com/tab/TabContainer';
import { TabData } from '../../com/tab/TabData';
import { TabItem } from '../../com/tab/TabItem';
import { WinTabPage } from '../../com/win/WinTabPage';
import ModelMgr from '../../manager/ModelMgr';
import { GamePassView } from './com/GamePassView';

const { ccclass, property } = cc._decorator;

@ccclass
export class GamePassWin extends WinTabPage {
    @property(TabContainer)
    protected tabContainer: TabContainer = null;
    @property(cc.ScrollView)
    private ScrollView: cc.ScrollView = null;
    // 容器节点
    @property(cc.Node)
    private NdBg: cc.Node = null;
    public tabPages(): TabData[] {
        return ModelMgr.I.GamePassModel.pageConfig();
    }

    protected onLoad(): void {
        super.onLoad();
        ModelMgr.I.GamePassModel.onCheckAllRed();
    }

    private viewNode: cc.Node = null;
    private _selectId: number = 0;
    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        let index: number = 0;
        const pages = this.tabPages();
        const pageLength = pages.length;
        if (pageLength <= 0) {
            console.warn('未配置页签数据');
            return;
        }
        if (param && param[1]) {
            index = Math.min(+param[1], pageLength - 1);
            this._selectId = pages[Math.min(index, pageLength - 1)]?.id;
        } else {
            index = pageLength - 1;
        }
        this._selectId = this._selectId || pages[pageLength - 1].id;
        this.tabContainer.setData(pages, this._selectId);
        const offset = this.ScrollView.getScrollOffset();
        this.scheduleOnce(() => {
            this.ScrollView.scrollToOffset(cc.v2(135 * index, offset.y), 0.618);
        });
    }

    /** 底部tab选中事件 */
    private tabClickEvents(item: TabItem) {
        this.addNdContents(item);
    }

    private addNdContents(item: TabItem) {
        const data = item.getData();
        this._selectId = data.id;
        if (this.viewNode) {
            this.viewNode.emit('PageRefreshEvent', this._selectId);
            return;
        }
        ResMgr.I.showPrefabOnce(data.uiPath, this.NdBg, (err, node) => {
            if (err) {
                console.log('添加界面出错', data.uiPath);
                return;
            }
            this.viewNode = node;
            node.getComponent(GamePassView).sync();
            // 首次加载发送事件刷新界面
            node.emit('PageRefreshEvent', this._selectId);
        });
        console.log(1212);
    }
}
