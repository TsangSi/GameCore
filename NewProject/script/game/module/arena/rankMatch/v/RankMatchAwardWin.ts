/*
 * @Author: myl
 * @Date: 2022-08-30 16:33:33
 * @Description:
 */

import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { TabContainer } from '../../../../com/tab/TabContainer';
import { TabData } from '../../../../com/tab/TabData';
import { TabItem } from '../../../../com/tab/TabItem';
import WinBase from '../../../../com/win/WinBase';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import ModelMgr from '../../../../manager/ModelMgr';
import { RID } from '../../../reddot/RedDotConst';
import { ERankMatchAwardTabId } from '../RankMatchConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class RankMatchAwardWin extends WinBase {
    /** 关闭 */
    @property(cc.Node)
    protected NodeClose: cc.Node = null;
    @property(TabContainer)
    protected tabContainer: TabContainer = null;
    @property(cc.ScrollView)
    private ScrollView: cc.ScrollView = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    // 容器节点
    @property(cc.Node)
    private NdBg: cc.Node = null;
    public tabPages(): TabData[] {
        const panels: TabData[] = [
            {
                id: ERankMatchAwardTabId.Win,
                title: i18n.tt(Lang.rankmatch_award_view_tab1),
                uiPath: UI_PATH_ENUM.RankMatchAwardView,
                redId: RID.Arena.RankMatch.Reward.Win.Id,
            },
            {
                id: ERankMatchAwardTabId.Segme,
                title: i18n.tt(Lang.rankmatch_award_view_tab2),
                uiPath: UI_PATH_ENUM.RankMatchAwardView,
                redId: RID.Arena.RankMatch.Reward.Segme,
            },
        ];
        return panels;
    }

    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnClose, this.close, this);
        UtilGame.Click(this.NodeClose, this.close, this);
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
        this._selectId = this._selectId || pages[0].id;
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
        this.resetWidth();
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

    private resetWidth() {
        // if (this._selectId === ERankMatchAwardTabId.Segme) {
        //     this.NdBg.height = 852;
        // } else if (this._selectId === ERankMatchAwardTabId.Win) {
        //     this.NdBg.height = 903;
        // }
        // this.NdBg.children.forEach((node) => {
        //     node.getComponent(cc.Widget).updateAlignment();
        // });
    }
}
