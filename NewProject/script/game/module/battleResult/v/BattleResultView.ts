/*
 * @Author: myl
 * @Date: 2022-09-26 18:27:44
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { AudioMgr } from '../../../../app/base/manager/AudioMgr';
import AudioPath from '../../../../app/base/manager/AudioPath';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import UtilItemList from '../../../base/utils/UtilItemList';
import ItemModel from '../../../com/item/ItemModel';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ModelMgr from '../../../manager/ModelMgr';
import {
    MaxLayoutWidth, DoubleLineHeight, MoreLineHeight, BattleType,
} from '../BattleResultConst';
import { BattleResultCommonView } from './BattleResultCommonView';

const { ccclass, property } = cc._decorator;

@ccclass
export class BattleResultView extends BaseUiView {
    @property(cc.Node)
    private bg: cc.Node = null;
    // 单行物品界面
    @property(cc.Node)
    public ItemNode: cc.Node = null;
    // 多行物品展示
    @property(cc.Node)
    public ItemsNode: cc.Node = null;
    @property(cc.ScrollView)
    public scrollView: cc.ScrollView = null;

    // 公共部分
    public commonView: BattleResultCommonView = null;

    protected _data: S2CPrizeReport = null;
    public init(data: S2CPrizeReport[]): void {
        super.init(data);
        this._data = data[0];
        this.loadBg();
    }

    protected loadBg(): void {
        this._playResultEff();
        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_BattleResult_BattleResultCommonView, this.bg, (err, nd: cc.Node) => {
            this.commonView = nd.getComponent(BattleResultCommonView);
            this.commonView.changeCloseTips(this._data.Type === BattleType.Fail || this._data.Items.length === 0);
            this.commonView.setUIState(this._data, () => {
                this.close();
            });
        });
    }

    /** 播放音效 */
    private _playResultEff() {
        if (this._data.Type === BattleType.Win) {
            AudioMgr.I.playEffect(AudioPath.YX_win_01, { isRemote: true });
        } else if (this._data.Type === BattleType.Fail) {
            AudioMgr.I.playEffect(AudioPath.YX_loss_01, { isRemote: true });
        }
    }

    protected setUpRewards(rewards: string | ItemModel[] | ItemData[]): void {
        if (rewards.length <= 0) {
            return;
        }
        if (typeof rewards === 'string') {
            const itemStrArray = rewards.split('|');
            if (itemStrArray.length <= 5) {
                if (this.ItemsNode) {
                    this.ItemsNode.active = false;
                }
                this.ItemNode.active = true;
                UtilItemList.ShowItems(this.ItemNode, rewards, { option: { needNum: true, needName: true, isDarkBg: true } });
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
                UtilItemList.ShowItems(this.scrollView.content, rewards, { option: { needNum: true, needName: true, isDarkBg: true } });
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (rewards.length <= 5) {
                if (this.ItemsNode) {
                    this.ItemsNode.active = false;
                }
                this.ItemNode.active = true;
                UtilItemList.ShowItemArr(this.ItemNode, rewards, { option: { needNum: true, needName: true, isDarkBg: true } });
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
                UtilItemList.ShowItemArr(this.scrollView.content, rewards, { option: { needNum: true, needName: true, isDarkBg: true } });
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
