import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import ItemModel from '../../../com/item/ItemModel';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RID } from '../../reddot/RedDotConst';
import { RoleMgr } from '../../role/RoleMgr';
import { TipPageType } from '../FamilyConst';
import FamilyModel from '../FamilyModel';
import { FamilyUIType } from '../FamilyVoCfg';
import { FamilyTaskItem } from './FamilyTaskItem';

const { ccclass, property } = cc._decorator;

/** 世家-世家 */
@ccclass
export default class FamilyTaskPage extends WinTabPage {
    @property(cc.Node)// 设置协助
    private BtnSetAssist: cc.Node = null;

    @property(cc.Node)// 刷新事务
    private BtnRefreshTask: cc.Node = null;

    @property(cc.Node)// 一键派遣
    private BtnAutoDispatch: cc.Node = null;

    @property(ListView)// 一键派遣
    private list: ListView = null;

    // 刷新消耗
    @property(DynamicImage)// 消耗
    private SprCost: DynamicImage = null;
    @property(cc.Label)// 消耗
    private LabCost: cc.Label = null;

    @property(cc.Label)// StartNum 事务令用了几次
    private LabUsedNum: cc.Label = null;

    @property(cc.Label)// 事务等级
    private LabLv: cc.Label = null;

    @property(cc.Node)// 事务提示
    private BtnTip: cc.Node = null;
    @property(cc.Node)// 事务提示
    private BtnVip: cc.Node = null;
    @property(cc.Node)
    private NdNull: cc.Node = null;

    // 经验等级
    @property(cc.ProgressBar)// 经验等级
    private expPro: cc.ProgressBar = null;
    @property(cc.Label)// label进度条
    private LabPro: cc.Label = null;

    public start(): void {
        super.start();
        UtilGame.Click(this.BtnSetAssist, this._onSetAssist, this);// 设置协助
        UtilGame.Click(this.BtnRefreshTask, this._onRefreshTask, this);// 刷新事务
        UtilGame.Click(this.BtnAutoDispatch, this._onAutoDispatch, this);// 一键派遣
        UtilGame.Click(this.BtnTip, this._onBtnTip, this);// 提示
        UtilGame.Click(this.BtnVip, this._onBtnVip, this);// Vip特权按钮

        UtilRedDot.Bind(RID.Family.FamilyHome.Family.FamilyFamily.FamilyTask, this.BtnSetAssist, cc.v2(20, 20));
    }
    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Family.FamilyTaks, this._onFamilyTaskInfo, this);
        EventClient.I.off(E.Family.FamilyRefreshTask, this._onRefreshTaskBack, this);
        EventClient.I.off(E.Family.FamilyOneKeySuccess, this._onFamilyOneKeySuccess, this);
        EventClient.I.off(E.Family.FamilyGetReward, this._onFamilyGetReward, this);
        EventClient.I.off(E.Family.FamilySingleSendSuccess, this._onFamilySingleSendSuccess, this);
        // 加速CD成功
        EventClient.I.off(E.Family.FamilySpeedUpCD, this._onFamilySpeedUpCD, this);
    }

    private model: FamilyModel;
    public init(winId: number, param: unknown[], tabIdx: number, tabId?: number): void {
        super.init(winId, param, 0);
        this.model = ModelMgr.I.FamilyModel;
        EventClient.I.on(E.Family.FamilyTaks, this._onFamilyTaskInfo, this);
        EventClient.I.on(E.Family.FamilyRefreshTask, this._onRefreshTaskBack, this);
        EventClient.I.on(E.Family.FamilyOneKeySuccess, this._onFamilyOneKeySuccess, this);
        EventClient.I.on(E.Family.FamilySingleSendSuccess, this._onFamilySingleSendSuccess, this);
        // 加速CD成功
        EventClient.I.on(E.Family.FamilySpeedUpCD, this._onFamilySpeedUpCD, this);
        EventClient.I.on(E.Family.FamilyGetReward, this._onFamilyGetReward, this);
        ControllerMgr.I.FamilyController.reqC2SFamilyTaskInfo();

        // 监听跨天
        EventClient.I.on(E.Game.DayChange, this._onDayChange, this);

        // // 后来策划说，在未打开一键派遣之前，就要拿到一键派遣里的数据，这样打开一键派遣，就能判断没数据，不打开该页面
        // ControllerMgr.I.FamilyController.reqC2SFamilyTaskGetAllCanStart();
    }

    private _initRefreshBtn(): void {
        // 判断事务令是否足够
        const limitNum: number = ModelMgr.I.FamilyModel.getCfgItemCostLimit();
        const [itemId, itemNum] = ModelMgr.I.FamilyModel.getCfgItemCost();
        const itemModel: ItemModel = UtilItem.NewItemModel(Number(itemId), Number(itemNum));
        const curNum: number = ModelMgr.I.FamilyModel.getCurItemCost();// 已经使用数量
        if (curNum >= limitNum) { // 判断是否达到上限
            UtilColor.setGray(this.BtnRefreshTask, true, true);
        } else {
            UtilColor.setGray(this.BtnRefreshTask, false, true);
        }

        this.LabUsedNum.string = `${limitNum - curNum}/${limitNum}`;
    }
    /** 跨时间点 */
    private _onDayChange(time: number): void {
        // 判断时间点 等于配置的时间点 则刷新
        // const cfgTime: number = this.model.getCfgResetTime();
        // if (cfgTime === time) {
        ControllerMgr.I.FamilyController.reqC2SFamilyTaskInfo();
        // }
    }

    /** 一键派遣成功 */
    private _onFamilyOneKeySuccess(): void {
        this._initList();
        this._initRefreshBtn();// 派遣成功事务令发生变化 按钮状态刷新
    }
    /** 单独派遣成功 */
    private _onFamilySingleSendSuccess(): void {
        this._initList();
        this._initRefreshBtn();// 派遣成功事务令发生变化 按钮状态刷新
    }
    /** 领取奖励成功 */
    private _onFamilyGetReward(data: S2CFamilyTaskGetPrice): void {
        if (RoleMgr.I.d.FamilyTaskLevel > this._curLv) {
            WinMgr.I.open(ViewConst.FamilyUpTipsWin);
        }
        this._initTaskInfo();// 任务基础信息

        this._initList();
    }

    public refreshPage(winId: number, params: any[]): void { //
    }

    /** 加速CD成功 */
    private _onFamilySpeedUpCD(): void {
        MsgToastMgr.Show(i18n.tt(Lang.family_SpeedUp));
        this._initList();
    }

    private _onFamilyTaskInfo(data): void {
        this._initTaskInfo();// 任务基础信息
        this._initList();
        this._initRefreshCost();
        this._initRefreshBtn();
    }

    // 事务等级经验
    private _curLv;
    private _initTaskInfo(): void {
        // this.model.getTaskList();
        const curExp: number = RoleMgr.I.d.FamilyTaskExp || 0;// 经验
        const curLv: number = RoleMgr.I.d.FamilyTaskLevel || 0;// 等级
        this._curLv = curLv;

        // 当前的等级
        this.LabLv.string = `${curLv}`;// 等级
        // 当前经验
        const cfg: Cfg_FNTask = this.model.CfgFNTask(curLv);
        const cfgExp: number = cfg.Exp;// 需要的经验

        this.expPro.progress = curExp / cfgExp;
        this.LabPro.string = `${curExp}/${cfgExp}`;
    }

    /** 提示 */
    private _onBtnTip(): void {
        const worldPos = this.BtnTip.convertToWorldSpaceAR(cc.v2(-100, -270));
        WinMgr.I.open(ViewConst.FamilyLevelTips, TipPageType.FamilyTask, worldPos);
    }
    /** 提示 */
    private _onBtnVip(): void {
        const worldPos = this.BtnVip.convertToWorldSpaceAR(cc.v2(-150, -170));
        WinMgr.I.open(ViewConst.FamilyLevelTips, TipPageType.SpecialPower, worldPos);
    }

    /** 事务列表 */
    private _taskList: { item: FamilyTask, state: number }[];
    private _initList(): void {
        this._taskList = this.model.getTaskList();// 事务列表
        this.list.setNumItems(this._taskList && this._taskList.length || 0, 0);
        this.list.scrollTo(0);
        this.NdNull.active = this._taskList.length <= 0;
    }

    /** 刷新消耗 */
    private _initRefreshCost(): void {
        const model = this.model;
        const curNum: number = model.getCurRefreshNum();
        const cost: number[] = model.getCfgRefreshCost(curNum);
        const [times, itemId, itemNum] = cost;
        const bagNum: number = BagMgr.I.getItemNum(itemId);

        const path = UtilItem.GetItemIconPathByItemId(itemId);
        this.SprCost.loadImage(path, 1, true);
        this.SprCost.node.scale = 0.45;
        // 刷新消耗
        this.LabCost.string = `${UtilNum.Convert(bagNum)}/${UtilNum.Convert(itemNum)}`;
        this.LabCost.node.color = UtilColor.costColor(bagNum, itemNum);
    }

    /** 设置协助 */
    private _onSetAssist(): void {
        WinMgr.I.open(ViewConst.FamilySetAssistTip, FamilyUIType.SetAssist);
    }

    /** 刷新事务 */
    private _onRefreshTask(): void {
        // 判断今日已经使用的事务令上限是否达到
        const limitNum: number = ModelMgr.I.FamilyModel.getCfgItemCostLimit();
        const useStarNum: number = ModelMgr.I.FamilyModel.getCurItemCost();// 已经使用数量
        if (useStarNum >= limitNum) { // 判断是否达到上限
            MsgToastMgr.Show(i18n.tt(Lang.family_tomorrow));
            return;
        }

        const model = this.model;
        const curNum: number = model.getCurRefreshNum();
        const cost: number[] = model.getCfgRefreshCost(curNum);
        const [times, itemId, itemNum] = cost;
        // const itemName: string = UtilItem.NewItemModel(itemId, itemNum).cfg.Name;
        const bagNum: number = BagMgr.I.getItemNum(Number(itemId));
        if (bagNum >= itemNum) {
            ControllerMgr.I.FamilyController.reqC2SFamilyTaskRefresh();
        } else {
            WinMgr.I.open(ViewConst.ItemSourceWin, Number(itemId));// 事务令不足
            // MsgToastMgr.Show(itemName + i18n.tt(Lang.com_buzu));
        }
    }
    /** 刷新事务返回 */
    private _onRefreshTaskBack(data): void {
        MsgToastMgr.Show(i18n.tt(Lang.family_refresh));// "刷新成功"
        this._initList();
        this._initRefreshCost();
    }

    /** 一键派遣 */
    private _onAutoDispatch(): void {
        const [itemId, itemNum] = ModelMgr.I.FamilyModel.getCfgItemCost();
        const itemModel: ItemModel = UtilItem.NewItemModel(Number(itemId), Number(itemNum));

        // 判断事务令是否足够
        const bagNum = BagMgr.I.getItemNum(Number(itemId));
        if (bagNum <= 0) {
            // 没有事务令
            MsgToastMgr.Show(itemModel.cfg.Name + i18n.tt(Lang.not_enough));
            WinMgr.I.open(ViewConst.ItemSourceWin, Number(itemId));
            return;
        }

        WinMgr.I.open(ViewConst.FamilyAutoDispathTip, FamilyUIType.SetAssist);
    }

    private scrollEvent(node: cc.Node, index: number) {
        const item: FamilyTaskItem = node.getComponent(FamilyTaskItem);
        item.setData(this._taskList[index].item);
    }
}
