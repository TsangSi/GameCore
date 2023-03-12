/*
 * @Author: myl
 * @Date: 2022-08-01 17:51:56
 * @Description:
 */
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { UtilGame } from '../../../base/utils/UtilGame';
import { RoleMgr } from '../../role/RoleMgr';
import { ArenaRankRewardItem } from './ArenaRankRewardItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArenaRankRewardView extends BaseUiView {
    @property(cc.Node)
    private ndBg: cc.Node = null;
    @property(ListView)
    private list: ListView = null;

    @property(cc.Node)
    private listBg: cc.Node = null;

    @property(cc.Label)
    private LabRankMe: cc.Label = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    public start(): void {
        super.start();
        UtilGame.Click(this.BtnClose, this.close, this);
        UtilGame.Click(this.ndBg, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.listBg, () => {
            // this.close();
        }, this, { scale: 1 });
        this.getConfig();
        this.LabRankMe.string = `${RoleMgr.I.Rank}`;
    }

    private getConfig() {
        const configIndexer: ConfigIndexer = Config.Get(Config.Type.Cfg_ArenaRewards);
        const length = configIndexer.keysLength;
        this.list.setNumItems(length, 0);
    }

    private scrollEvent(node: cc.Node, index: number) {
        const item = node.getComponent(ArenaRankRewardItem);
        item.setData(index);
    }
}
