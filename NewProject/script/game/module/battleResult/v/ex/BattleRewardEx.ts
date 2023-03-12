/*
 * @Author: myl
 * @Date: 2023-01-10 16:42:23
 * @Description:
 */

import UtilItemList from '../../../../base/utils/UtilItemList';
import { EItemLeftCustomLogoName } from '../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';
import { FuncId } from '../../../../const/FuncConst';
import ModelMgr from '../../../../manager/ModelMgr';
import {
    MaxLayoutWidth, DoubleLineHeight, MoreLineHeight, EBattleType,
} from '../../BattleResultConst';
import { BattleRewardExBase } from './BattleRewardExBase';

const { ccclass, property } = cc._decorator;
// 奖励颗粒
@ccclass
export default class BattleRewardExPart extends BattleRewardExBase {
    // 单行物品界面
    @property(cc.Node)
    public ItemNode: cc.Node = null;
    // 多行物品展示
    @property(cc.Node)
    public ItemsNode: cc.Node = null;
    @property(cc.ScrollView)
    public scrollView: cc.ScrollView = null;

    public setData(data: S2CPrizeReport): void {
        this._data = data;
        this.setUpRewards(data.Items);
    }

    protected setUpRewards(rewards: string | ItemModel[] | ItemData[]): void {
        if (rewards.length <= 0) {
            this.node.destroy(); // 移除
            return;
        }
        const isDouble = this.isDouble();
        console.log('------是否双倍结算', isDouble);

        if (typeof rewards === 'string') {
            const itemStrArray = rewards.split('|');
            if (itemStrArray.length <= 5) {
                if (this.ItemsNode) {
                    this.ItemsNode.active = false;
                }
                this.ItemNode.active = true;
                UtilItemList.ShowItems(
                    this.ItemNode,
                    rewards,
                    { option: { needNum: true, needName: false, isDarkBg: true } },
                    (nd: cc.Node, index: number) => {
                        if (isDouble) {
                            const itemIcon = nd.getComponent(ItemIcon);
                            itemIcon.refreshLeftCustomLogo(EItemLeftCustomLogoName.Double);
                        }
                    },
                );
            } else {
                // 需要布局
                if (this.ItemsNode) {
                    this.ItemsNode.active = true;
                }
                this.ItemNode.active = false;
                if (rewards.length <= 10) {
                    this.scrollView.node.setContentSize(MaxLayoutWidth, DoubleLineHeight);
                } else {
                    this.scrollView.node.setContentSize(MaxLayoutWidth, MoreLineHeight);
                }
                UtilItemList.ShowItems(
                    this.scrollView.content,
                    rewards,
                    { option: { needNum: true, needName: false, isDarkBg: true } },
                    (nd: cc.Node, index: number) => {
                        if (isDouble) {
                            const itemIcon = nd.getComponent(ItemIcon);
                            itemIcon.refreshLeftCustomLogo(EItemLeftCustomLogoName.Double);
                        }
                    },
                );
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (rewards.length <= 5) {
                if (this.ItemsNode) {
                    this.ItemsNode.active = false;
                }
                this.ItemNode.active = true;
                UtilItemList.ShowItemArr(
                    this.ItemNode,
                    rewards,
                    { option: { needNum: true, needName: false, isDarkBg: true } },
                    (nd: cc.Node, index: number) => {
                        if (isDouble) {
                            const itemIcon = nd.getComponent(ItemIcon);
                            itemIcon.refreshLeftCustomLogo(EItemLeftCustomLogoName.Double);
                        }
                    },
                );
            } else {
                // 需要布局
                if (this.ItemsNode) {
                    this.ItemsNode.active = true;
                }
                this.ItemNode.active = false;
                if (rewards.length <= 10) {
                    this.scrollView.node.setContentSize(MaxLayoutWidth, DoubleLineHeight);
                } else {
                    this.scrollView.node.setContentSize(MaxLayoutWidth, MoreLineHeight);
                }
                UtilItemList.ShowItemArr(
                    this.scrollView.content,
                    rewards,
                    { option: { needNum: true, needName: false, isDarkBg: true } },
                    (nd: cc.Node, index: number) => {
                        if (isDouble) {
                            const itemIcon = nd.getComponent(ItemIcon);
                            itemIcon.refreshLeftCustomLogo(EItemLeftCustomLogoName.Double);
                        }
                    },
                );
            }
        }
    }

    /** 双倍标记  如果功能会放置日常任务的功能找回  则需要在此处处理双倍标记 */
    public isDouble(): boolean {
        if (this._data.FBType === EBattleType.WorldBoss_PVE_DAYS
            || this._data.FBType === EBattleType.WorldBoss_PVP_DAYS
            || this._data.FBType === EBattleType.WorldBoss_PVE_WeekDay
            || this._data.FBType === EBattleType.WorldBoss_PVP_WeekDay) {
            const doubleList = ModelMgr.I.DailyTaskModel.getFuncDataList();
            console.log('双倍的结算列表', doubleList);

            for (let i = 0; i < doubleList.length; i++) {
                const item = doubleList[i];
                const funcid = item.cfg.FuncId;
                if (funcid === FuncId.WorldBoss) {
                    return true;
                }
            }
        }

        return false;
    }
}
