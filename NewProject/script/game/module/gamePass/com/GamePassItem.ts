/*
 * @Author: zs
 * @Date: 2022-09-16 14:14:53
 * @FilePath: \SanGuo\assets\script\game\module\gamePass\com\GamePassItem.ts
 * @Description:
 *
 */
import { StorageMgr } from '../../../../app/base/manager/StorageMgr';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { Config } from '../../../base/config/Config';
import { ConfigStageIndexer } from '../../../base/config/indexer/ConfigStageIndexer';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import ItemModel from '../../../com/item/ItemModel';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { EGamePassRewardType } from '../GamePassConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class GamePassItem extends BaseCmp {
    @property(cc.Node)
    private NdLock: cc.Node = null;
    @property(cc.Node)
    private NdItemLeft: cc.Node = null;
    @property(cc.Node)
    private NdItemRight: cc.Node = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Node)
    private NdLines: cc.Node[] = [];
    @property(cc.Node)
    private NdUp: cc.Node = null;
    @property(cc.Node)
    private NdDown: cc.Node = null;

    private cfg: Cfg_Stage_PassLevel;
    private passId: number = 0;
    private itemIconNodeL: cc.Node = null;
    private itemIconNodeR: cc.Node = null;

    protected onLoad(): void {
        super.onLoad();
        this.itemIconNodeL = this.NdItemLeft.getChildByName('ItemIcon');
        this.itemIconNodeR = this.NdItemRight.getChildByName('ItemIcon');
    }

    public setData(passId: number, index: number): void {
        this.node.zIndex = -index;
        this.passId = passId;
        this.cfg = ModelMgr.I.GamePassModel.getPassRewardCfg(passId, index);
        if (this.cfg) {
            if (this.cfg.Prize1) {
                this.showItem(this.NdItemLeft, this.cfg.Prize1.split(':'), EGamePassRewardType.Nor);
            } else {
                UtilRedDot.UpdateRed(this.NdItemLeft, false, cc.v2(42, 42));
                UtilCocos.SetActive(this.NdItemLeft, 'SpriteYlq', false);
                this.itemIconNodeL.destroyAllChildren();
            }
            if (this.cfg.Prize2) {
                this.showItem(this.NdItemRight, this.cfg.Prize2.split(':'), EGamePassRewardType.Buy);
            } else {
                UtilRedDot.UpdateRed(this.NdItemRight, false, cc.v2(42, 42));
                UtilCocos.SetActive(this.NdItemRight, 'SpriteYlq', false);
                this.itemIconNodeR.destroyAllChildren();
            }
        }
        const obj = Config.Get<ConfigStageIndexer>(Config.Type.Cfg_Stage).getChapterInfo(this.cfg.MaxStageNum);
        this.LabelName.string = `${obj.chapter}-${obj.level}`;
        this.updateLockStatus();
    }

    public setNdUpActive(active: boolean): void {
        this.NdUp.active = active;
    }

    public setNdDownActive(active: boolean): void {
        this.NdDown.active = active;
    }

    /** 更新奖励状态-外部调用的接口 */
    public updateReward(): void {
        this._updateReward(this.NdItemLeft, EGamePassRewardType.Nor);
        this._updateReward(this.NdItemRight, EGamePassRewardType.Buy);
    }

    /** 更新上锁状态-外部调用接口 */
    public updateLockStatus(): void {
        this._updateLockStatus(this.cfg.MaxStageNum >= RoleMgr.I.d.Stage);
    }

    /** 显示道具 */
    private showItem(node: cc.Node, itemstrs: string[], rewardType: EGamePassRewardType) {
        const id = +itemstrs[0];
        const count = +itemstrs[1];
        const itemModel = UtilItem.NewItemModel(id, count);
        const iconNode = node.getChildByName('ItemIcon');
        iconNode.scale = 0.8;
        UtilItem.Show(iconNode, itemModel, {
            option: {
                needNum: true, needName: false, offClick: true, numScale: 1.2,
            },
        });
        UtilGame.Click(iconNode, this.onItemClicked, this, { customData: { itemModel, rewardType } });
        this._updateReward(node, rewardType);
    }

    /** 是否能领取 */
    private isCanLq() {
        return RoleMgr.I.d.Stage > this.cfg.MaxStageNum;
    }
    /**
     * 点击道具
     * @param targetNode 点击的node
     * @param customData 扩展传参
     */
    private onItemClicked(targetNode: cc.Node, customData: { itemModel: ItemModel, rewardType?: EGamePassRewardType }) {
        const cfg = this.cfg;
        // eslint-disable-next-line max-len
        if (customData.rewardType === EGamePassRewardType.Nor || ModelMgr.I.GamePassModel.getPassRewardBuyStatus(this.passId)) {
            if (this.isCanLq() && !ModelMgr.I.GamePassModel.isYlqReward(customData.rewardType, cfg.Key)) {
                ControllerMgr.I.GamePassController.C2SStagePassReward(this.passId);
                return;
            }
        }

        if (customData?.itemModel?.cfg) {
            // 道具调试模式
            const debugItemMode: boolean = StorageMgr.I.getValue('DebugItemMode', false);
            if (debugItemMode) {
                const count: number = StorageMgr.I.getValue('DebugItemModeCount', 1);
                ControllerMgr.I.GMController.reqC2SGm('additem', `${customData.itemModel.cfg.Id}@${count}`);
            } else {
                WinMgr.I.open(ViewConst.ItemTipsWin, customData.itemModel);
            }
        }
    }

    /** 更新奖励状态-内部调用的接口 */
    private _updateReward(node: cc.Node, rewardType: EGamePassRewardType): void {
        // 是否已领取
        const isYlq = ModelMgr.I.GamePassModel.isYlqReward(rewardType, this.cfg.Key);

        const isShowNor = rewardType === EGamePassRewardType.Nor && this.cfg.Prize1;
        // eslint-disable-next-line max-len
        if (isShowNor || (rewardType === EGamePassRewardType.Buy && this.cfg.Prize2 && ModelMgr.I.GamePassModel.getPassRewardBuyStatus(this.passId))) {
            UtilRedDot.UpdateRed(node, !isYlq && this.isCanLq(), cc.v2(42, 42));
        } else {
            UtilRedDot.UpdateRed(node, false, cc.v2(42, 42));
        }
        UtilCocos.SetActive(node, 'SpriteYlq', isYlq);
        if (rewardType === EGamePassRewardType.Buy) {
            UtilCocos.SetActive(node, 'SpriteLock', !ModelMgr.I.GamePassModel.getPassRewardBuyStatus(this.passId));
        }
    }

    private _updateLockStatus(lock: boolean) {
        this.NdLock.active = lock;
        // this.NdItemLock.active = lock;
        this.NdLines.forEach((nd) => {
            nd.active = !lock;
        });
        this.LabelName.node.color = lock ? UtilColor.Hex2Rgba('#fff3a9') : UtilColor.Hex2Rgba('#97412c');
    }
}
