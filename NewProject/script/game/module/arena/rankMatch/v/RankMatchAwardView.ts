/*
 * @Author: zs
 * @Date: 2023-01-06 17:28:11
 * @Description:
 *
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import BaseUiView from '../../../../../app/core/mvc/view/BaseUiView';
import ListView from '../../../../base/components/listview/ListView';
import { E } from '../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import ModelMgr from '../../../../manager/ModelMgr';
import { RankMatchAwardItem } from '../com/RankMatchAwardItem';
import { ERankMatchAwardTabId } from '../RankMatchConst';
import RankMatchModel from '../RankMatchModel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankMatchAwardView extends BaseUiView {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Node)
    private NodeBottom: cc.Node = null;
    private curShowTabId: ERankMatchAwardTabId;
    private model: RankMatchModel;
    protected onLoad(): void {
        super.onLoad();
        this.model = ModelMgr.I.RankMatchModel;
        this.node.on('PageRefreshEvent', this.onPageRefreshEvent, this);
        EventClient.I.on(E.RankMatch.UpdateSessionGetRwList, this.onUpdateSessionGetRwList, this);
        EventClient.I.on(E.RankMatch.UpdateLevelGetRwList, this.onUpdateLevelGetRwList, this);
    }

    private onPageRefreshEvent(id: ERankMatchAwardTabId) {
        this.showIndexs.length = 0;
        this.curShowTabId = id;
        switch (id) {
            case ERankMatchAwardTabId.Win:
                this.showWinAwards();
                UtilCocos.SetActive(this.NodeBottom, 'RankMatchAwardBottomSegme', false);
                UtilCocos.SetActive(this.NodeBottom, 'RankMatchAwardBottomWin', true);
                this.addPropertyPrefab('RankMatchAwardBottomWin', UI_PATH_ENUM.RankMatchAwardBottomWin, this.NodeBottom, (n) => {
                    if (this.curShowTabId !== id) {
                        n.active = false;
                    }
                });
                break;
            case ERankMatchAwardTabId.Segme:
                this.showRankAwards();
                UtilCocos.SetActive(this.NodeBottom, 'RankMatchAwardBottomWin', false);
                UtilCocos.SetActive(this.NodeBottom, 'RankMatchAwardBottomSegme', true);
                this.addPropertyPrefab('RankMatchAwardBottomSegme', UI_PATH_ENUM.RankMatchAwardBottomSegme, this.NodeBottom, (n) => {
                    if (this.curShowTabId !== id) {
                        n.active = false;
                    }
                });
                break;
            default:
                break;
        }
    }

    /** 显示胜场的奖励列表 */
    private showIndexs: number[] = [];
    private showWinAwards() {
        const ylqs: number[] = [];
        this.model.cfgWinReward.forEach((cfg: Cfg_RankMatchWinReward, index: number) => {
            if (this.model.isYlqReward(cfg.Id, ERankMatchAwardTabId.Win)) {
                ylqs.push(index);
            } else {
                this.showIndexs.push(index);
            }
            return true;
        });
        this.showIndexs = this.showIndexs.concat(ylqs);
        this.ListView.node.height = 734;
        this.ListView.setNumItems(this.showIndexs.length);
    }

    /** 显示段位的奖励列表 */
    private showRankAwards() {
        const ylqs: number[] = [];
        this.model.cfgPos.forEach((cfg: Cfg_RankMatchWinReward, index: number) => {
            if (this.model.isYlqReward(cfg.Id, ERankMatchAwardTabId.Segme)) {
                ylqs.push(index);
            } else {
                this.showIndexs.push(index);
            }
            return true;
        });
        this.showIndexs = this.showIndexs.concat(ylqs);
        this.ListView.node.height = 818;
        this.ListView.setNumItems(this.showIndexs.length);
    }

    private compScripts: { [id: number]: RankMatchAwardItem } = cc.js.createMap(true);
    private onRenderItem(node: cc.Node, index: number) {
        const compScript: RankMatchAwardItem = node.getComponent(RankMatchAwardItem);
        const id = compScript.setData(this.showIndexs[index], this.curShowTabId);
        this.compScripts[id] = compScript;
    }

    private onUpdateSessionGetRwList(changeIds: number[]) {
        if (this.curShowTabId === ERankMatchAwardTabId.Win) {
            changeIds.forEach((id) => {
                if (this.compScripts[id] && this.compScripts[id].node && this.compScripts[id].node.isValid) {
                    this.compScripts[id].updateStatus();
                }
            });
        }
    }

    private onUpdateLevelGetRwList(changeIds: number[]) {
        if (this.curShowTabId === ERankMatchAwardTabId.Segme) {
            changeIds.forEach((id) => {
                if (this.compScripts[id] && this.compScripts[id].node && this.compScripts[id].node.isValid) {
                    this.compScripts[id].updateStatus();
                }
            });
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.RankMatch.UpdateSessionGetRwList, this.onUpdateSessionGetRwList, this);
        EventClient.I.off(E.RankMatch.UpdateLevelGetRwList, this.onUpdateLevelGetRwList, this);
    }
}
