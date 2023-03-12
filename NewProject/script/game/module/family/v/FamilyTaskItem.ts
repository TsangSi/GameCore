import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import ItemModel from '../../../com/item/ItemModel';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RewardType, TaskState } from '../FamilyConst';
import { FamilyUIType } from '../FamilyVoCfg';
import { FamilyRewardItem } from './FamilyRewardItem';

const { ccclass, property } = cc._decorator;

/** 事务列表Item */
@ccclass
export class FamilyTaskItem extends cc.Component {
    @property(cc.Label)// 任务名称
    private LabName: cc.Label = null;

    @property(DynamicImage)// 任务品质
    private SprQuality: DynamicImage = null;

    @property(cc.Node)// 派遣按钮
    private BtnDisPatch: cc.Node = null;

    @property(cc.Node)// 领取
    private BtnGet: cc.Node = null;

    @property(cc.Node)// CD
    private BtnCd: cc.Node = null;

    @property(cc.Label)// 派遣时间
    private LabTime: cc.Label = null;

    @property(cc.Label)// cd
    private LabCd: cc.Label = null;

    // 消耗
    @property(DynamicImage)
    private SprCost: DynamicImage = null;
    @property(cc.Label)
    private LabCost: cc.Label = null;

    @property(cc.ProgressBar)// cd进度条
    private pro: cc.ProgressBar = null;

    @property(cc.Node)// 奖励容器
    private NdRewardContainer: cc.Node = null;
    @property(cc.Prefab)// 奖励容器
    private rewarditem: cc.Prefab = null;

    protected start(): void {
        UtilGame.Click(this.BtnDisPatch, () => {
            // false代表一进入任务详情页面，不带有后端预选的头像
            WinMgr.I.open(ViewConst.FamilySetAssistTip, FamilyUIType.TaskDetail, this._data, false);
        }, this);
        UtilGame.Click(this.BtnGet, this._BtnGetReward, this);
        UtilGame.Click(this.BtnCd, this._onSpeedUp, this);
    }

    // 领取奖励
    private _BtnGetReward(): void { // 发送一键领取奖励
        ControllerMgr.I.FamilyController.reqC2SFamilyTaskGetPrice();
    }

    /** 加速 */
    private _onSpeedUp(): void {
        const arr: number[] = ModelMgr.I.FamilyModel.getCfgSpeedUpCost(this._data.Quality);
        const itemId: number = arr[0];

        const itemNum: number = arr[1];
        const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);
        const bagNum = BagMgr.I.getItemNum(Number(itemId));
        if (bagNum >= itemNum) {
            const taskId: number = this._data.TaskId;// 加速完成某个
            ControllerMgr.I.FamilyController.reqC2SFamilyTaskSpeed(taskId);
        } else {
            MsgToastMgr.Show(`${itemModel.cfg.Name}${i18n.tt(Lang.com_buzu)}`);
        }
    }

    private _data: FamilyTask;// 任务信息
    public setData(data: FamilyTask): void {
        this._data = data;

        // 取任务名称 只能nameId
        const cfgTaskName: Cfg_TaskName = ModelMgr.I.FamilyModel.CfgTaskName(data.NameId);
        this.LabName.string = cfgTaskName.TaskName;

        // 品质
        const quality: number = data.Quality;
        this.SprQuality.loadImage(UtilItem.GetItemQualityTitleBgPath(quality), 1, true);

        // 派遣状态
        const state: number = data.TaskState;// 0:未开始 1:派遣中 2:完成
        this._updateState(state);

        const arr: { type: RewardType, reward: string }[] = [];
        // 普通奖励
        const cfgTaskReward: Cfg_TaskReward = ModelMgr.I.FamilyModel.CfgTaskReward(data.PriceId);
        const rewards = UtilString.SplitToArray(cfgTaskReward.TaskReward);
        // 宝箱
        arr.push({ type: RewardType.box, reward: cfgTaskReward.BoxReward });
        for (let i = 0; i < rewards.length; i++) {
            arr.push({ type: RewardType.simple, reward: `${rewards[i][0]}:${rewards[i][1]}` });
        }
        // 缘分奖励
        if (data.TaskFateId) {
            const cfgFate: Cfg_TaskFateCondition = ModelMgr.I.FamilyModel.CfgTaskFateCondition(data.TaskFateId);
            console.log(cfgFate.Reward);
            arr.push({ type: RewardType.fate, reward: cfgFate.Reward });
        }

        this.NdRewardContainer.destroyAllChildren();
        for (let i = 0; i < arr.length; i++) {
            const node: cc.Node = cc.instantiate(this.rewarditem);
            this.NdRewardContainer.addChild(node);

            const fri: FamilyRewardItem = node.getComponent(FamilyRewardItem);
            fri.setData(arr[i], data);
        }
    }
    private _countTime(): void {
        const nowTime: number = Math.floor(UtilTime.NowSec());
        const endTime: number = this._data.TaskTimestamp;
        const cfgTime: number = ModelMgr.I.FamilyModel.getCfgDispatchCD(this._data.Quality);// 600
        if (nowTime >= endTime) {
            this._updateState(TaskState.reward);
            this.LabCd.string = '';
        } else {
            const leftTime = endTime - nowTime;
            const timeStr: string = UtilTime.FormatHourDetail(leftTime);
            this.LabCd.string = `${timeStr}`;
            this.pro.progress = (cfgTime - (endTime - nowTime)) / cfgTime;
        }
    }

    private _updateState(state: number): void {
        this.unschedule(this._countTime);
        switch (state) {
            case TaskState.notBegin:// 未派遣
                this.BtnDisPatch.active = true;
                this.BtnGet.active = false;
                this.BtnCd.active = false;
                // eslint-disable-next-line no-case-declarations
                const cfgTime: number = ModelMgr.I.FamilyModel.getCfgDispatchCD(this._data.Quality);// 600
                this.LabTime.string = `${cfgTime / 60 / 60}`;
                // 时间戳
                break;
            case TaskState.doing:// Cd 派遣中
                this.BtnDisPatch.active = false;
                this.BtnGet.active = false;
                this.BtnCd.active = true;

                this._countTime();
                this.unschedule(this._countTime);
                this.schedule(this._countTime, 1);

                this._initCost();

                break;
            case TaskState.reward:// 已完成
                this.unschedule(this._countTime);
                this.BtnDisPatch.active = false;
                this.BtnGet.active = true;
                this.BtnCd.active = false;
                break;
            default:
                break;
        }
    }

    private _initCost(): void {
        const arr: number[] = ModelMgr.I.FamilyModel.getCfgSpeedUpCost(this._data.Quality);
        const itemId: number = arr[0];
        const itemNum: number = arr[1];

        // 已经使用数量
        // const bagNum = BagMgr.I.getItemNum(Number(itemId));
        const path = UtilItem.GetItemIconPathByItemId(Number(itemId));

        this.SprCost.loadImage(path, 1, true);
        this.LabCost.string = `${UtilNum.Convert(Number(itemNum))}`;
        // this.LabCost.string = `${UtilNum.Convert(Number(itemNum))}/${UtilNum.Convert(bagNum)}`;
        // this.LabCost.node.color = UtilColor.costColor(bagNum, Number(itemNum));
    }

    protected onDestroy(): void {
        this.unschedule(this._countTime);
    }
}
