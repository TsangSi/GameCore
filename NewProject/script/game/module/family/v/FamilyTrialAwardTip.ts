import { EventClient } from '../../../../app/base/event/EventClient';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import { FamilyTrialAwardItem } from './FamilyTrialAwardItem';

const { ccclass, property } = cc._decorator;
/** 通关奖励 */
@ccclass
export class FamilyTrialAwardTip extends WinBase {
    @property(cc.Node)
    private NdSprMask: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    @property(ListView)
    private list: ListView = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => this.close(), this, { scale: 1 });
        UtilGame.Click(this.BtnClose, () => this.close(), this);
        // 领取奖励成功
        EventClient.I.on(E.Family.FamilyTrialGetReward, this._onFamilyTrialGetReward, this);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Family.FamilyTrialGetReward, this._onFamilyTrialGetReward, this);
        super.onDestroy();
    }

    // 领取奖励成功 更新item

    private _onFamilyTrialGetReward(trialId: number): void {
        for (let i = 0, len = this._rewards.length; i < len; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const cfg: Cfg_TrialCopyMonster = this._rewards[i].cfg;
            if (cfg.ID === trialId) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                this._rewards[i].state = 2;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                this._rewards.sort((l, r) => l.state - r.state);
                this.list.updateAll();
                // this.list.scrollTo(i);
                break;
            }
        }
    }

    // 通关奖励列表
    private _rewards = [];
    public init(params: any): void {
        const arr: Cfg_TrialCopyMonster[] = ModelMgr.I.FamilyModel.getCfgTrialCopyMonster();
        this._rewards = [];
        for (let i = 0, len = arr.length; i < len; i++) {
            const cfg = arr[i];
            const trialId: number = ModelMgr.I.FamilyModel.getTrialId();
            if (cfg.ID < trialId) { // 通关了，才能发送
                const state: boolean = ModelMgr.I.FamilyModel.getTrialRewardState(cfg.ID);
                if (state) { // 已领取
                    this._rewards.push({ state: 2, cfg });
                } else { // 可领取
                    this._rewards.push({ state: 0, cfg });
                }
            } else { // 未通关
                this._rewards.push({ state: 1, cfg });
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this._rewards.sort((l, r) => l.state - r.state);
        const len = ModelMgr.I.FamilyModel.getCfgTrialCopyMonsterLen();
        this.list.setNumItems(len, 0);
        this.list.scrollTo(0);
    }

    private onScrollEvent(node: cc.Node, index: number): void {
        const faitem: FamilyTrialAwardItem = node.getComponent(FamilyTrialAwardItem);
        faitem.setData(this._rewards[index]);
    }
}
