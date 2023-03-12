import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

/** 世家副本-通关奖励 */
@ccclass
export class FamilyTrialAwardItem extends cc.Component {
    @property(cc.Label)// 标题
    private LabTitle: cc.Label = null;

    @property(cc.Node) // 领取
    private BtnGet: cc.Node = null;

    @property(cc.Node) // 未达成
    private BtnUnReach: cc.Node = null;

    @property(cc.Node) // 已领取
    private BtnAlreadyGet: cc.Node = null;

    @property(cc.Node)// 奖励容器
    private NdRewardContainer: cc.Node = null;

    @property(cc.Prefab)// 奖励预设
    private rewarditem: cc.Prefab = null;

    protected onLoad(): void {
        UtilGame.Click(this.BtnGet, this._onBtnGetClick, this);
        UtilGame.Click(this.BtnUnReach, this._onBtnUnReachClick, this);
    }

    private _cfg: Cfg_TrialCopyMonster;
    public setData(data: { state: number, cfg: Cfg_TrialCopyMonster }): void {
        // const cfg: Cfg_TrialCopyMonster = ModelMgr.I.FamilyModel.CfgTrialCopyMonsterByIndex(idx);
        this._cfg = data.cfg;
        // 后端给出奖励领取状态

        const strKey: string = ModelMgr.I.FamilyModel.getCfgTrialCopyTaskDesc();// 通关第{0}层副本
        this.LabTitle.string = UtilString.FormatArgs(strKey, [data.cfg.ID]);// 通关第{0}层副本

        // 奖励情况
        const arr = UtilString.SplitToArray(data.cfg.Reward);
        this.NdRewardContainer.destroyAllChildren();
        for (let i = 0; i < arr.length; i++) {
            const node: cc.Node = cc.instantiate(this.rewarditem);
            node.scale = 0.7;
            this.NdRewardContainer.addChild(node);

            const itemId: number = Number(arr[i][0]);
            const itemNum: number = Number(arr[i][1]);
            const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);

            const fri: ItemIcon = node.getComponent(ItemIcon);
            fri.setData(itemModel, { needNum: true });
        }

        // 通关领取状态

        const trialId: number = ModelMgr.I.FamilyModel.getTrialId();
        if (this._cfg.ID < trialId) { // 通关了，才能发送
            // 判断当前关卡是否被领取了
            const state: boolean = ModelMgr.I.FamilyModel.getTrialRewardState(this._cfg.ID);
            if (state) { // 已领取
                this.BtnGet.active = false;
                this.BtnUnReach.active = false;
                this.BtnAlreadyGet.active = true;
            } else {
                this.BtnUnReach.active = false;
                this.BtnGet.active = true;
                this.BtnAlreadyGet.active = false;
            }
        } else { // 未通关
            this.BtnGet.active = false;
            this.BtnUnReach.active = true;
            this.BtnAlreadyGet.active = false;
        }
    }

    private _onBtnGetClick(): void {
        const trialId: number = ModelMgr.I.FamilyModel.getTrialId();
        if (this._cfg.ID < trialId) { // 通关了，才能发送
            ControllerMgr.I.FamilyController.reqC2STrialCopyReward(this._cfg.ID);// 发送领取当前这个id
        } else {
            MsgToastMgr.Show(`${i18n.tt(Lang.family_passWhich)}${this._cfg.ID}${i18n.tt(Lang.family_stageGet)}`);
        }
    }
    private _onBtnUnReachClick(): void {
        MsgToastMgr.Show(`${i18n.tt(Lang.family_passWhich)}${this._cfg.ID}${i18n.tt(Lang.family_stageGet)}`);
    }
}
