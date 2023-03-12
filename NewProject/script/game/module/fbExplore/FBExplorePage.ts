/*
 * @Author: zs
 * @Date: 2023-02-02 16:14:58
 * @Description:
 *
 */
import { ResMgr } from '../../../app/core/res/ResMgr';
import { Config } from '../../base/config/Config';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { TabContainer } from '../../com/tab/TabContainer';
import { TabData } from '../../com/tab/TabData';
import { TabItem } from '../../com/tab/TabItem';
import { WinTabPage } from '../../com/win/WinTabPage';
import { UI_PATH_ENUM } from '../../const/UIPath';
import ControllerMgr from '../../manager/ControllerMgr';
import { RID } from '../reddot/RedDotConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FBExplorePage extends WinTabPage {
    @property(TabContainer)
    private TabsContent: TabContainer = null;
    @property(cc.Node)
    private NdContent: cc.Node = null;

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this.TabsContent.addEventHandler(this.node, 'FBExplorePage', 'onItemTypeTabSelected');
        // if (param && param[2] === 0) {
        //     // 宝石界面
        //     ControllerMgr.I.FBExploreController.showFunc(param[0]);
        // } else if (param && param[2] === 1) {
        //     // 排行榜
        //     ControllerMgr.I.FBExploreController.showRank(param[0]);
        // }
        const tabsData: TabData[] = [];
        Config.Get(Config.Type.Cfg_FB_Explore).forEach((cfg: Cfg_FB_Explore) => {
            if (UtilFunOpen.isOpen(cfg.FuncId, false)) {
                tabsData.push({
                    id: cfg.ExploreType,
                    redId: RID.MaterialFB.FBExplore,
                    uiPath: UI_PATH_ENUM.FBExploreView,
                    funcId: cfg.FuncId,
                    title: cfg.ExploreName,
                });
            }
            return true;
        });
        this.TabsContent.setData(tabsData, tabsData[0].id);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number): void {
        super.refreshPage(winId, param, tabIdx);
        if (param && (param[1] !== undefined || param[1] !== null)) {
            this.TabsContent.switchTab(param[1] || 0, true);
        }
    }

    public refreshView(params: any[]): void {
        console.log('params=', params);
    }

    private viewNode: cc.Node = null;
    private _selectId: number = 0;
    private onItemTypeTabSelected(tabItem: TabItem) {
        const data = tabItem.getData();
        this._selectId = data.id;
        if (this.viewNode) {
            this.viewNode.emit('PageRefreshEvent', this._selectId);
            return;
        }
        ResMgr.I.showPrefabOnce(data.uiPath, this.NdContent, (err, node) => {
            if (err) {
                console.log('添加界面出错', data.uiPath);
                return;
            }
            this.viewNode = node;
            // 首次加载发送事件刷新界面
            node.emit('PageRefreshEvent', this._selectId);
        });
    }
}
