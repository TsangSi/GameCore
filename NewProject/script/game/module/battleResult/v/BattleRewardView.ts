// import {
//     cc._decorator, cc.Node, cc.Label, cc.ScrollView,
// } from 'cc';
/** import { CC'_EDITOR } 'from 'cc/env';  // */
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItemList from '../../../base/utils/UtilItemList';
import ItemModel from '../../../com/item/ItemModel';
import WinBase from '../../../com/win/WinBase';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import {
    DoubleLineHeight, MaxLayoutWidth, MoreLineHeight,
} from '../BattleResultConst';

/**
 * 使用eg
 * const rewards = '';
 * const conf : IBattleReward = {
                titleResPath: BattleResultType.Fail,
                tip: '自定义提示消息',
                exPath: 'BattleArenaEx',
                handleEx: (node:cc.Node) => {
                    console.log('预制接点');
                    const ex = node.getComponent(BattleArenaEx);
                    ex.setData({ hisRank: 666, rank: 777 });
                },
            };
    WinMgr.I.open(ViewConst.BattleRewardView, rewards, conf);
 */

export interface IBattleReward {
    /** 标题预制体路径 */
    titleResPath: string,
    /** 标题加载完成回调 */
    handleTitle?: (node: cc.Node) => void,
    /** 提示文字 若为空则不显示 */
    tip?: string,
    /** 扩展节点 内部业务需要自己处理
     *  预制体请放置在 battleResult/ex 文件夹下
     */
    exPath?: string,
    /** 扩展回调 如果设置扩展则会回调 内容为扩展节点 */
    handleEx?: (node: cc.Node) => void,
    /** 战斗星数  若非关卡战斗则赋值为-1|null 不显示星星节点 */
    starNum?: number,
    /** 倒计时关闭  <=0 时 为不设置倒计时  为空时 则为默认的5s倒计时 */
    closeCd?: number,
    /** 关闭按钮提示文字 为空时则显示为 领取奖励 */
    closeTip?: string,
}

const BattleResPath = UI_PATH_ENUM.Module_BattleResult;

const { ccclass, property } = cc._decorator;

@ccclass
export class BattleRewardView extends WinBase {
    /** 奖励自动布局节点 */
    @property(cc.Node)
    private NdLayoutContent: cc.Node = null;
    @property(cc.Node)
    private ndBg: cc.Node = null;

    @property(cc.ScrollView)
    private scrollView: cc.ScrollView = null;

    /** 关闭按钮Label */
    @property(cc.Label)
    private LabCloseTip: cc.Label = null;
    /** 关闭按钮 */
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    /** 关闭倒计时cd */
    private _closeCd = 5;

    @property(cc.Label)
    private LabTip: cc.Label = null;
    @property(cc.Node)
    private NdTitle: cc.Node = null;

    /** 扩展节点 需要自行管理内容 */
    @property(cc.Node)
    private NdEx: cc.Node = null;

    private _closeTip = i18n.tt(Lang.arena_reward_tip);

    public init(param: Array<string | ItemModel[] | IBattleReward | ItemData[]>): void {
        // 默认不传值的情况下 给定为失败
        const reward = param[0] as string | ItemModel[] | ItemData[];
        const conf = param[1] as IBattleReward;
        this.setUpRewards(reward);
        this.setUpUiConfig(conf);
    }

    /** 配置页面显示 */
    private setUpUiConfig(conf: IBattleReward): void {
        if (conf) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (conf.titleResPath.length <= 0) {
                console.error('缺少配置信息,请配置 IBattleReward 的 titlepath');
            } else {
                // 加载标题预制体
                const path = `${BattleResPath}${conf.titleResPath}`;
                ResMgr.I.showPrefab(path, this.NdTitle, (err, node) => {
                    if (err) {
                        console.log('资源加载出错');
                    } else if (conf.handleTitle) conf.handleTitle(node);
                });
            }
            if (conf.closeCd && conf.closeCd > 0) {
                this._closeCd = conf.closeCd;
            }
            if (conf.closeTip && conf.closeTip.length > 0) {
                this._closeTip = conf.closeTip;
            }
            if (conf.tip && conf.tip.length > 0) {
                this.LabTip.string = conf.tip;
                this.LabTip.node.active = true;
            } else {
                this.LabTip.node.active = false;
            }

            if (conf.exPath) {
                // 加载扩展节点  加载完成回调扩展函数
                const path = `${BattleResPath}ex/${conf.exPath}`;
                ResMgr.I.showPrefab(path, this.NdEx, (err, node) => {
                    if (!err) {
                        if (conf.handleEx) conf.handleEx(node);
                    } else {
                        console.warn('请检查扩展内容节点路径 确保在 battleResult/ex 下');
                    }
                });
            }

            this.updateCd();
        } else {
            console.error('缺少配置信息,请配置 IBattleReward');
        }
    }

    protected start(): void {
        super.start();

        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
        UtilGame.Click(this.ndBg, () => {
            this.close();
        }, this, { scale: 1 });
    }

    private setUpRewards(rewards: string | ItemModel[] | ItemData[]) {
        if (!this.NdContent) {
            // console.log('展示物品节点为空');
        }
        if (rewards.length <= 0) {
            // 没有奖励信息
            // console.log('没有奖励数据');
            this.NdContent.active = false;
            return;
        }
        if (typeof rewards === 'string') {
            const itemStrArray = rewards.split('|');
            if (itemStrArray.length <= 5) {
                this.NdLayoutContent.active = false;
                this.NdContent.active = true;
                UtilItemList.ShowItems(this.NdContent, rewards, { option: { needNum: true, needName: true, isDarkBg: true } });
            } else {
                // 需要布局
                this.NdLayoutContent.active = true;
                this.NdContent.active = false;
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
                this.NdLayoutContent.active = false;
                this.NdContent.active = true;
                UtilItemList.ShowItemArr(this.NdContent, rewards, { option: { needNum: true, needName: true, isDarkBg: true } });
            } else {
                // 需要布局
                this.NdLayoutContent.active = true;
                this.NdContent.active = false;
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
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        if (!CC_EDITOR) {
            ControllerMgr.I.BattleResultController.reqC2SGetBattlePrize();
        }
    }

    private _timer: NodeJS.Timer = null;
    private updateCd() {
        if (!this._timer) {
            this._timer = setInterval(() => {
                this._closeCd--;
                this.LabCloseTip.string = `${this._closeTip}(${this._closeCd}${i18n.tt(Lang.com_second)})`;
                if (this._closeCd < 1) {
                    // 关闭界面通知发奖

                    // this.close();
                }
            }, 1000);
        }
    }
}
