/*
 * @Author: zs
 * @Date: 2022-11-10 20:20:33
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\InvitePlayerWin.ts
 * @Description:
 *
 */
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { TabContainer } from '../../../../com/tab/TabContainer';
import { TabData } from '../../../../com/tab/TabData';
import { TabItem } from '../../../../com/tab/TabItem';
import WinBase from '../../../../com/win/WinBase';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { CHAT_CHANNEL_ENUM } from '../../../chat/ChatConst';
import { ERankType, ERankParam } from '../../../rankList/RankListConst';

const { ccclass, property } = cc._decorator;
@ccclass
export class InvitePlayerWin extends WinBase {
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    @property(cc.Node)
    private NodePanel: cc.Node = null;
    @property(TabContainer)
    private TabContainer: TabContainer = null;
    protected viewNode: cc.Node = null;

    private curSelectType: CHAT_CHANNEL_ENUM;
    public tabPages(): TabData[] {
        const panels: TabData[] = [
            {
                id: CHAT_CHANNEL_ENUM.World,
                title: i18n.tt(Lang.chat_tip_sj),
                uiPath: UI_PATH_ENUM.InvitePlayerView,
            },
            {
                id: CHAT_CHANNEL_ENUM.Current,
                title: i18n.tt(Lang.chat_tip_bf),
                uiPath: UI_PATH_ENUM.InvitePlayerView,
            },
            // {
            //     id: CHAT_CHANNEL_ENUM.Regiment,
            //     title: i18n.tt(Lang.chat_tip_jt),
            //     uiPath: UI_PATH_ENUM.InvitePlayerView,
            // },
        ];
        return panels;
    }

    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.node.getChildByName('SprBlack'), this.close, this);
        UtilGame.Click(this.BtnClose, this.close, this);
    }
    private selectId: number = 0;
    public init(params: any[]): void {
        super.init(params);
        const pages = this.tabPages();
        const pageLength = pages.length;
        if (pageLength <= 0) {
            console.warn('未配置页签数据');
            return;
        }
        if (params && params[0]) {
            this.selectId = pages[Math.min(+params[0], pageLength - 1)]?.id;
        }
        this.selectId = this.selectId || pages[0].id;
        this.TabContainer.setData(pages, this.selectId);
    }
    /** 底部tab选中事件 */
    private tabClickEvents(item: TabItem) {
        this.addNdContents(item);
    }
    private addNdContents(item: TabItem) {
        const data = item.getData();
        this.selectId = data.id;
        if (this.viewNode) {
            this.viewNode.emit('PageRefreshEvent', this.selectId);
            return;
        }
        ResMgr.I.showPrefabOnce(data.uiPath, this.NodePanel, (err, node) => {
            if (err) {
                console.log('添加界面出错', data.uiPath);
                return;
            }
            this.viewNode = node;
            // 首次加载发送事件刷新界面
            node.emit('PageRefreshEvent', this.selectId);
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        ModelMgr.I.TeamModel.clearMatchList();
    }
}
