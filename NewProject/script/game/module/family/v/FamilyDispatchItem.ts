import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ComHeadItem } from '../../../com/headIten/ComHeadItem';
import { ViewConst } from '../../../const/ViewConst';
import { EntityUnitType } from '../../../entity/EntityConst';
import ModelMgr from '../../../manager/ModelMgr';
import { RewardType } from '../FamilyConst';
import FamilyUtil from '../FamilyUtil';
import { FamilyUIType } from '../FamilyVoCfg';
import { FamilyRewardItem } from './FamilyRewardItem';

const { ccclass, property } = cc._decorator;

/** 事务列表Item */
@ccclass
export class FamilyDispatchItem extends cc.Component {
    @property(DynamicImage)// 任务品质
    private SprQuality: DynamicImage = null;

    @property(cc.Label)// 任务名称
    private LabName: cc.Label = null;

    @property(cc.Label) // 派遣时长
    private LabTime: cc.Label = null;

    @property(cc.Node)// 任务详情按钮
    private BtnTaskInfo: cc.Node = null;

    @property(cc.Node)// 奖励容器
    private NdRewardContainer: cc.Node = null;
    @property(cc.Prefab)// 奖励容器
    private rewarditem: cc.Prefab = null;

    @property(ListView)// 英雄头像列表
    private HeroList: ListView = null;

    @property(cc.Toggle)// 勾选 默认选中
    private tg: cc.Toggle = null;

    protected start(): void {
        this.tg.node.on('toggle', this._onToggle, this);
        UtilGame.Click(this.BtnTaskInfo, this._onTaskInfo, this);
        // UtilGame.Click(this.ndBox, this._onBox, this);
    }

    // 任务详情
    private _onTaskInfo(): void {
        // 根据任务ID 获取任务详情
        const data: FamilyTask = ModelMgr.I.FamilyModel.getFamilyTask(this._data.TaskId);
        // true 代表一进入任务详情页面，带有后端预选的头像
        WinMgr.I.open(ViewConst.FamilySetAssistTip, FamilyUIType.TaskDetail, data, true);
    }

    /** 点击后，更新选中状态 */
    private _onToggle(): void {
        if (this._cb) {
            this._cb(this.tg.isChecked);
        }
    }

    private _heroListData: SetPartner[];// 英雄列表
    private _data: CanStartTask;
    // eslint-disable-next-line  @typescript-eslint/ban-types
    private _cb: Function;
    // eslint-disable-next-line  @typescript-eslint/ban-types
    public setData(data: CanStartTask, cb: Function, bol: boolean): void {
        this._data = data;
        this._cb = cb;
        this.tg.isChecked = bol;// 默认选中

        const TaskId: number = data.TaskId;
        // 从事务列表获取事务基本信息
        const taskData: FamilyTask = ModelMgr.I.FamilyModel.getFamilyTask(TaskId);
        if (!taskData) {
            // console.log(`取不到任务${TaskId}`);
            return;
        }

        // 事务名称
        const cfgTaskName: Cfg_TaskName = ModelMgr.I.FamilyModel.CfgTaskName(taskData.NameId);
        this.LabName.string = cfgTaskName.TaskName;

        // 品质
        const quality: number = taskData.Quality;
        this.SprQuality.pngPath(UtilItem.GetItemQualityTitleBgPath(quality));

        // 根据任务品质 获取时间戳
        const cd: number = ModelMgr.I.FamilyModel.getCfgDispatchCD(quality);// 7200s
        this.LabTime.string = `${UtilTime.FormatHourDetail(cd)}`;

        // HeroList
        this._heroListData = data.SetPartnerL;
        let len = 0;
        if (this._heroListData && this._heroListData.length) {
            len = this._heroListData.length;
        }
        this.HeroList.setNumItems(len, 0);
        // this.HeroList.scrollTo(0);

        const arr: { type: RewardType, reward: string }[] = [];
        // 普通奖励
        const cfgTaskReward: Cfg_TaskReward = ModelMgr.I.FamilyModel.CfgTaskReward(taskData.PriceId);
        const rewards = UtilString.SplitToArray(cfgTaskReward.TaskReward);
        // 宝箱
        arr.push({ type: RewardType.box, reward: cfgTaskReward.BoxReward });
        for (let i = 0; i < rewards.length; i++) {
            arr.push({ type: RewardType.simple, reward: `${rewards[i][0]}:${rewards[i][1]}` });
        }
        // 缘分奖励
        if (taskData.TaskFateId) {
            const cfgFate: Cfg_TaskFateCondition = ModelMgr.I.FamilyModel.CfgTaskFateCondition(taskData.TaskFateId);
            console.log(cfgFate.Reward);
            arr.push({ type: RewardType.fate, reward: cfgFate.Reward });
        }

        this.NdRewardContainer.destroyAllChildren();
        for (let i = 0; i < arr.length; i++) {
            const node: cc.Node = cc.instantiate(this.rewarditem);
            this.NdRewardContainer.addChild(node);

            const fri: FamilyRewardItem = node.getComponent(FamilyRewardItem);
            fri.setData(arr[i], taskData);
        }
    }

    /** 英雄列表 */
    public onScrollHeroEvent(node: cc.Node, index: number): void {
        const comHeadItem: ComHeadItem = node.getComponent(ComHeadItem);
        const data: SetPartner = this._heroListData[index];
        const partnerId: string = data.Id;// id
        const partnerType: number = data.PartnerType;
        // 此处有可能是 武将  军师 红颜头像
        if (partnerType === EntityUnitType.General) { // 武将
            FamilyUtil.setGeneralHead(comHeadItem, data, [partnerId, partnerType]);
            comHeadItem.node.scale = 0.6;
        } else if (partnerType === EntityUnitType.Beauty) {
            FamilyUtil.setBeautyHead(comHeadItem, data, [partnerId, partnerType]);
            comHeadItem.node.scale = 0.6;
        }
        // else if (partnerType === EntityUnitType.Army) {
        //     // 军师
        //     // 待开发
        //     // 待开发
        //     // 待开发
        //     // 待开发
        //     // 待开发
        // }
    }
}
