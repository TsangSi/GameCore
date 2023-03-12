import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { TabContainer } from '../../../com/tab/TabContainer';
import { FamilyTrialRankTabs, FamilyTrialRankType } from '../FamilyConst';
import { TabItem } from '../../../com/tab/TabItem';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import FamilyModel from '../FamilyModel';
import ModelMgr from '../../../manager/ModelMgr';
import { FamilyTrialRankItem } from './FamilyTrialRankItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class FamilyTrialRankTip extends WinBase {
    @property(TabContainer)// 底部增加两个页签
    private TabsItemType: TabContainer = null;

    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    @property(cc.Node)
    private NdEmpty: cc.Node = null;

    @property(ListView)
    private list: ListView = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.BtnClose, () => this.close(), this);
        // 获得排行榜信息
        EventClient.I.on(E.Family.FamilyTrialRankInfo, this._onFamilyTrialRankInfo, this);
    }
    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Family.FamilyTrialRankInfo, this._onFamilyTrialRankInfo, this);
    }

    private model: FamilyModel;
    private _curId: number;
    public init(params: any): void {
        this.model = ModelMgr.I.FamilyModel;
        this.TabsItemType.addEventHandler(this.node, 'FamilyTrialRankTip', 'onItemTypeTabSelected');
        this.TabsItemType.setData(FamilyTrialRankTabs, 1);
    }

    private onItemTypeTabSelected(tabItem: TabItem) {
        const tabData = tabItem.getData();
        this._curId = tabData.id;

        if (tabData.id === FamilyTrialRankType.RANK) { // 排行榜
            ControllerMgr.I.FamilyController.reqC2STrialCopyRank();
        } else { // 排行榜奖励
            const len = this.model.getCfgTrialCopyRankLen();
            this.list.setNumItems(len, 0);
            this.list.scrollTo(0);
            this.NdEmpty.active = false;
        }
    }

    /** 获取到排行榜信息 */
    private _rankList: TrialCopyRank[];
    private _onFamilyTrialRankInfo(): void { //
        this._rankList = this.model.getTrialRankInfo();
        let len = 0;
        if (this._rankList?.length) {
            len = this._rankList.length;
        }
        this.list.setNumItems(len, 0);
        this.list.scrollTo(0);
        this.NdEmpty.active = !len;
    }

    private scrollEvent(node: cc.Node, index: number) {
        const item: FamilyTrialRankItem = node.getComponent(FamilyTrialRankItem);
        if (this._curId === FamilyTrialRankType.RANK) {
            item.setData(this._rankList[index], this._curId);
        } else {
            item.setData(index, this._curId);
        }
    }
}
