import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemBagType } from '../../../com/item/ItemConst';
import ItemModel from '../../../com/item/ItemModel';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { FuncId } from '../../../const/FuncConst';
import { RoleMgr } from '../../role/RoleMgr';
import { Max_Vip_Level } from '../../vip/VipConst';
import { TAB_IDX } from '../SmeltConst';
import { MeltReward, SmeltModel } from '../SmeltModel';
import { SmeltItem } from './SmeltItem';
import { Link } from '../../link/Link';
import { GradeMgr } from '../../grade/GradeMgr';
import { UtilEquip } from '../../../base/utils/UtilEquip';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { FuncDescConst } from '../../../const/FuncDescConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class SmeltPage extends WinTabPage {
    @property(cc.Node)// 确定熔炼
    private NdMeltButton: cc.Node = null;

    @property(cc.Node)// 自动熔炼
    private NdToggleAuto: cc.Node = null;

    @property(ListView)
    private ListGrid: ListView = null;
    @property(ListView)
    private ListGridPreView: ListView = null;

    /** 初始列表条数 */
    private listMinGridCount: number = 30;
    /** 每行多少个 */
    private _rowNum: number = 5;
    /** 当前显示列表 */
    private _currData: ItemModel[];
    /** 最多显示200条 */
    private listMaxGridCount: number = 200;

    @property(cc.Node)
    private LabGoBtn: cc.Node = null;

    @property(cc.Node)
    private NdEmptyEquip: cc.Node = null;
    @property(cc.Node)
    private NdEmptyReward: cc.Node = null;
    @property(cc.Label)// 空的描述
    private LabEmptyReward: cc.Label = null;

    @property(cc.Node) // 说明按钮
    private NodeDesc: cc.Node = null;

    @property(cc.Node)// 一键选择
    private NdAutoSelect: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdMeltButton, this._onSmelt, this);
        UtilGame.Click(this.NodeDesc, this._onDescClick, this);
        UtilGame.Click(this.LabGoBtn, this._onFightBoss, this);
        this.NdToggleAuto.on('toggle', this._onSelect, this);
        UtilGame.Click(this.NdAutoSelect, this._handleAutoSelect, this);
        // this.NdAutoSelect.on('toggle', this._handleAutoSelect, this);
        EventClient.I.on(E.Bag.ItemChange, this._onBagEquipChange, this);
        EventClient.I.on(E.res.GetReward, this._onSmeltSuccess, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Bag.ItemChange, this._onBagEquipChange, this);
        EventClient.I.off(E.res.GetReward, this._onSmeltSuccess, this);
        this._checkedArr = null;
        this._currData = null;
        this._preViewArr = null;
    }

    private _onSelect() {
        const ck: boolean = this.NdToggleAuto.getComponent(cc.Toggle).isChecked;
        const model: SmeltModel = ModelMgr.I.SmeltModel;
        if (ck) {
            // supervip废弃 统一使用viplevel来判定是否是SVIP
            if (RoleMgr.I.d.VipLevel > Max_Vip_Level) {
                model.autoSmelt = true;
                this.smeltCheck();// 直接检测是否超出背包容量80% 勾选那一刻，直接熔炼
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.smelt_sviptip));// Svip等级不足
                this.NdToggleAuto.getComponent(cc.Toggle).isChecked = false;
                model.autoSmelt = false;
            }
        } else {
            model.autoSmelt = false;
        }
    }
    /** 一键选择 */
    private _onAutoSelect() {
        // const ck: boolean = this.NdAutoSelect.getComponent(cc.Toggle).isChecked;
        // const model: SmeltModel = ModelMgr.I.SmeltModel;
        // if (ck) {
        // 一键选中
        for (let i = 0, len = this._checkedArr.length; i < len; i++) {
            this._checkedArr[i] = true;
        }
        // } else {
        //     for (let i = 0, len = this._checkedArr.length; i < len; i++) {
        //         this._checkedArr[i] = false;
        //     }
        // }

        this.ListGrid.updateAll();
        // this.ListGrid.setNumItems(this._currData.length);
        this._calcReward();// 勾选状态变化，重新计算
    }

    private _handleAutoSelect(): void {
        if (this._currData.length) {
            ModelMgr.I.MsgBoxModel.ShowBox(
                UtilString.FormatArgs(i18n.tt(Lang.smelt_onekey), UtilColor.NorV),
                () => {
                    this._onAutoSelect();
                },
                { showToggle: `smelt_onekey${this._tabIdx}`, tipTogState: false },
            );
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.smelt_noSelectEquip));
        }
    }

    private smeltCheck(): void {
        const ownSize: number = BagMgr.I.getItemOwnSize(ItemBagType.EQUIP_ROLE);
        const totalSize = BagMgr.I.getGridSize(ItemBagType.EQUIP_ROLE);
        if (ownSize / totalSize >= 0.8) {
            this._onSmelt();// 直接开启熔炼
        }
    }

    private _onSmeltSuccess(itemModelArr: ItemModel[]) {
        // this._currData = []; 背包更新比此处快，如果这里置空，则列表滑动异常
        // this._currData = this.model.getCurrDataByTab(this.tabIdx);
        this._initMeltListData();

        WinMgr.I.open(ViewConst.GetRewardWin, itemModelArr);
    }

    private _onFightBoss() {
        Link.To(FuncId.BossPersonal);
    }
    private _onDescClick(): void {
        WinMgr.I.open(ViewConst.DescWinTip, FuncDescConst.EquipSmelt);
    }

    private _onBagEquipChange() {
        this._initMeltListData();
    }

    private _onSmelt() {
        const len = this._currData.length;
        if (len) {
            const itemIds: string[] = [];
            for (let i = 0; i < len; i++) {
                if (this._checkedArr[i]) { // 选中
                    const item: ItemModel = this._currData[i];
                    itemIds.push(item.data.OnlyId);
                }
            }

            if (itemIds.length === 0) {
                MsgToastMgr.Show(i18n.tt(Lang.smelt_noSelectEquip));// '当前没有勾选可熔炼装备'
            } else if (this._tabIdx === TAB_IDX.GRADE_MELT) {
                ControllerMgr.I.GradeController.reqC2SGradeEquipSmelting(itemIds);
            } else {
                ControllerMgr.I.SmeltController.reqC2SMeltEquip(itemIds);
            }
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.smelt_noSmeltEquip));// 当前没有可熔炼装备
        }
    }

    /** 0 普通熔炼 1 红装熔炼 2 进阶熔炼 */
    private _tabIdx = TAB_IDX.SIMPLE_MELT;
    private model: SmeltModel;
    public init(winId: number, param: unknown, tabIdx: number): void {
        super.init(winId, param, tabIdx);
        this.model = ModelMgr.I.SmeltModel;
        this._tabIdx = tabIdx;
        this._initMeltListData();
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number): void {
        super.refreshPage(winId, param, tabIdx);
        this._tabIdx = tabIdx;
        this._initMeltListData();
    }

    private _initMeltListData() {
        this._currData = this.model.getCurrDataByTab(this.tabIdx);
        const len: number = this._currData.length;
        if (len) {
            this.NdEmptyEquip.active = false;
            this.NdEmptyReward.active = false;
            this._initIndexArr();
            this._initList(this._currData.length, this.ListGrid, 604, this._rowNum, this.listMinGridCount, this.listMaxGridCount);
            this._calcReward();
        } else {
            this.NdEmptyEquip.active = true;
            this.NdEmptyReward.active = true;
            this.LabEmptyReward.string = i18n.tt(Lang.smelt_nosmeltEquip1);// 无可熔炼装备

            this._checkedArr = [];
            this.ListGrid.setNumItems(0);
            this.ListGridPreView.setNumItems(0);
        }
        // this.NdEmpty.active = !len;
        this.NdToggleAuto.active = this._tabIdx === TAB_IDX.SIMPLE_MELT;
        this.NdToggleAuto.getComponent(cc.Toggle).isChecked = this.model.autoSmelt;
    }

    // 选中状态
    private _checkedArr: boolean[];
    private _initIndexArr(): void {
        this._checkedArr = [];
        const roleRebornLv: number = RoleMgr.I.getArmyLevel();
        for (let i = 0, len = this._currData.length; i < len; i++) {
            const item: ItemModel = this._currData[i];
            if (this._tabIdx === TAB_IDX.SIMPLE_MELT) { // 普通装备
                const itemFightVal: number = this.model.getFightValuelByItemModel(item);
                const roleFightVal: number = this.model.getRoleFightValByEquipPart(item.cfg.EquipPart);
                this._checkedArr.push(itemFightVal < roleFightVal);// 装备基础战力 小于角色
            } else if (this._tabIdx === TAB_IDX.RED_MELT) { // 红装熔炼
                this._checkedArr.push(item.cfg.ArmyLevel < roleRebornLv);
            } else { // 进阶熔炼
                const itemFightVal: number = this.model.getFightValuelByItemModel(item);
                const roleFightVal: number = this.model.getRoleFightValByEquipPart(item.cfg.EquipPart);
                this._checkedArr.push(itemFightVal < roleFightVal);// 装备基础战力 小于角色
                // // 当前坐骑4阶，那么小于等于4阶的坐骑装备都要选中
                // const level: number = item.cfg.Level;// 进阶等级
                // const type = item.cfg.Type;// 类型是坐骑大类型
                // const subType = item.cfg.SubType;

                // const gradeId: number = UtilEquip.ItemTypeToFuncId(subType);
                // const gradeModel = GradeMgr.I.getGradeModel(gradeId);

                // const jie = gradeModel.data.GradeLv.BigLv;// 阶
                // const star = gradeModel.data.GradeLv.SmallLv;// 星级

                // this._checkedArr.push(item.cfg.ArmyLevel < roleRebornLv);
            }
        }
    }

    private _initList(len: number, list: ListView, height: number, rowNum: number, minCount: number, maxCount: number): void {
        let gridCount = Math.min(Math.max(len, minCount), maxCount);
        if (gridCount % rowNum !== 0) {
            gridCount += rowNum - gridCount % rowNum;
        }
        list.setNumItems(gridCount);
    }

    /** 计算分解能获得什么奖励 */
    private _preViewArr: MeltReward[];
    private _calcReward(): void {
        this._preViewArr = [];
        const len = this._currData.length;
        if (!len) {
            this.ListGridPreView.setNumItems(0);
            return;
        }

        const arr: ItemModel[] = [];
        for (let i = 0; i < len; i++) {
            if (this._checkedArr[i]) {
                arr.push(this._currData[i]);
            }
        }

        if (!arr.length) {
            this.NdEmptyReward.active = true;
            this.LabEmptyReward.string = i18n.tt(Lang.smelt_selectSmeltEquip);// 请选择需要熔炼的装备
            this.ListGridPreView.setNumItems(0);
            return;
        } else {
            this.NdEmptyReward.active = false;
        }

        // 计算预览
        if (this._tabIdx === TAB_IDX.SIMPLE_MELT) { // 普通
            this._preViewArr = this.model.calcSimpleReward(arr);
        } else if (this._tabIdx === TAB_IDX.RED_MELT) { // 红装
            this._preViewArr = this.model.calcRedMeltReward(arr);
        } else if (this._tabIdx === TAB_IDX.GRADE_MELT) { // 进阶
            this._preViewArr = this.model.calcGradeMeltReward(arr);
        }
        this._initList(2, this.ListGridPreView, 200, 5, 35, 200);
    }

    /** 熔炼获得奖励列表 */
    private onRenderPreList(node: cc.Node, idx: number): void {
        const prop: MeltReward = this._preViewArr[idx];

        const grid = node.getComponent(SmeltItem);
        grid.NdSelectVisible(false);
        grid.NdEventVisible(false);

        if (prop && grid) {
            const itemModel: ItemModel = UtilItem.NewItemModel(prop.ItemId, prop.ItemNum);
            grid.loadIcon(itemModel);
            if (this._tabIdx === TAB_IDX.SIMPLE_MELT) {
                grid.showGLBD(false, false);
            } else {
                grid.showGLBD(true, prop.showGL);
            }
        } else {
            grid.showGLBD(false, false);
            grid.clearIcon();
        }
    }

    /** 熔炼列表 */
    private onRenderList(node: cc.Node, idx: number): void {
        const prop = this._currData[idx];
        const grid = node.getComponent(SmeltItem);
        if (prop && grid) {
            grid.loadIcon(prop);
            grid.NdSelectVisible(this._checkedArr[idx]);

            const nodeEvent: cc.Node = node.getChildByName('NdEvent');
            nodeEvent.targetOff(this);
            UtilGame.Click(nodeEvent, () => {
                if (idx >= this._currData.length) {
                    nodeEvent.targetOff(this);
                    return;
                }
                this._checkedArr[idx] = !this._checkedArr[idx];
                grid.NdSelectVisible(this._checkedArr[idx]);
                this._calcReward();// 勾选状态变化，重新计算
            }, this);
            grid.NdEventVisible(true);
        } else {
            grid.clearIcon();
            grid.NdSelectVisible(false);
            grid.NdEventVisible(false);
            // grid.NdEventVisible(false);
        }
    }
}
