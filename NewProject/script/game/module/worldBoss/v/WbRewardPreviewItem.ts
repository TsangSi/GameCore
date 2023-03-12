/*
 * @Author: dcj
 * @Date: 2022-09-01 18:14:24
 * @FilePath: \SanGuo2.4\assets\script\game\module\worldBoss\v\WbRewardPreviewItem.ts
 * @Description:
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilItem from '../../../base/utils/UtilItem';
import UtilItemList from '../../../base/utils/UtilItemList';
import { UtilPath } from '../../../base/utils/UtilPath';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ModelMgr from '../../../manager/ModelMgr';
import { WorldBossRPType } from '../WorldBossConst';
import { WorldBossModel } from '../WorldBossModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class WbRewardPreviewItem extends cc.Component {
    @property(cc.Node)
    private NdPre: cc.Node = null;
    @property(cc.Node)
    private rankLab: cc.Node = null;
    @property(cc.Node)
    private NdRe: cc.Node = null;
    @property(cc.ScrollView)
    private scroll: cc.ScrollView = null;

    private _M: WorldBossModel = null;
    protected start(): void {
        //
    }

    public setData(_type: WorldBossRPType, index: number): void {
        this._M = ModelMgr.I.WorldBossModel;
        const rewards = this._M.getWbGroupReward(_type, index);
        const rankSpr = this.NdPre.getComponent(DynamicImage);
        this.NdPre.active = index < 3;
        this.rankLab.active = index >= 3;
        if (index < 3) {
            this.NdPre.active = true;
            const rankPath = UtilPath.rankPath(index + 1);
            // UtilCocos.LoadSpriteFrame(rankSpr, rankPath);
            rankSpr.loadImage(rankPath, 1, true);
        } else {
            const rankL = this.rankLab.getComponent(cc.Label);
            const rankLabel = this._M.getWbRankMess(_type, index);
            rankL.string = rankLabel;
        }
        if (!rewards) {
            this.scroll.node.active = false;
            this.NdRe.active = false;
            return;
        }
        const list = UtilItem.ParseAwardItems(rewards);
        if (list.length < 4) {
            this.scroll.node.active = false;
            this.NdRe.active = true;
            UtilItemList.ShowItems(this.NdRe, rewards, { option: { needNum: true } });
        } else {
            this.scroll.node.active = true;
            this.NdRe.active = false;
            UtilItemList.ShowItems(this.scroll.content, rewards, { option: { needNum: true } });
        }
    }

    protected onDestroy(): void {
        //
    }
}
