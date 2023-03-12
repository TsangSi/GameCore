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
import ItemModel from '../../../com/item/ItemModel';
import WinBase from '../../../com/win/WinBase';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { FamilyDispatchItem } from './FamilyDispatchItem';

const { ccclass, property } = cc._decorator;

/** 一键派遣列表 */
@ccclass
export class FamilyAutoDispathTip extends WinBase {
    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    @property(cc.Node)// 一键派遣
    private BtnSure: cc.Node = null;
    @property(cc.Node)
    private BtnCancell: cc.Node = null;
    @property(cc.Node)// 没有可派遣列表
    private NdEmpty: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    @property(ListView)
    private list: ListView = null;

    // 刷新消耗
    @property(DynamicImage)// 消耗
    private SprCost: DynamicImage = null;
    @property(cc.Label)// 消耗
    private LabCost: cc.Label = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => this.close(), this, { scale: 1 });
        UtilGame.Click(this.BtnCancell, () => this.close(), this);
        UtilGame.Click(this.BtnSure, this._onDispatch, this);
        UtilGame.Click(this.BtnClose, this.close, this);
    }

    /** 派遣 */
    private _onDispatch(): void {
        const cstL: CanStartTask[] = [];
        // 获取当前勾选的列表
        for (let i = 0, len = this._canStartListData.length; i < len; i++) {
            if (this._ckArr[i]) {
                cstL.push(this._canStartListData[i]);
            }
        }
        const limitNum: number = ModelMgr.I.FamilyModel.getCfgItemCostLimit();

        const [itemId, itemNum] = ModelMgr.I.FamilyModel.getCfgItemCost();
        const itemModel: ItemModel = UtilItem.NewItemModel(Number(itemId), Number(itemNum));

        // 已经使用数量
        const curNum: number = ModelMgr.I.FamilyModel.getCurItemCost();
        // 判断是否达到上限
        if (curNum >= limitNum) {
            MsgToastMgr.Show(`${itemModel.cfg.Name}${i18n.tt(Lang.family_uptoLimit)}`);// 已达上限
            return;
        }
        // 判断事务令是否足够
        const bagNum = BagMgr.I.getItemNum(Number(itemId));
        if (bagNum <= 0) {
            // 没有事务令
            MsgToastMgr.Show(itemModel.cfg.Name + i18n.tt(Lang.not_enough));
            WinMgr.I.open(ViewConst.ItemSourceWin, Number(itemId));
            return;
        }

        const len = cstL.length;
        if (!this._canStartListData.length) { // 没有可派遣列表
            MsgToastMgr.Show(i18n.tt(Lang.family_notcanSend));// 当前没有可派遣任务
            return;
        }
        if (!len) {
            MsgToastMgr.Show(i18n.tt(Lang.family_select));// 请选择派遣列表
            return;
        }

        if (bagNum < (len * Number(itemNum))) {
            MsgToastMgr.Show(itemModel.cfg.Name + i18n.tt(Lang.not_enough));
            WinMgr.I.open(ViewConst.ItemSourceWin, Number(itemId));
            return;
        }
        // 发送一键派遣
        ControllerMgr.I.FamilyController.reqC2SFamilyTaskStartOneKey(cstL);
    }

    public init(params: any): void {
        EventClient.I.on(E.Family.FamilyCanStartList, this._onGetCanStartList, this);
        EventClient.I.on(E.Family.FamilyOneKeySuccess, this._onFamilyOneKeySuccess, this);
        EventClient.I.on(E.Family.FamilySingleSendSuccess, this._onFamilySingleSendSuccess, this);
        // 请求一键派遣列表
        ControllerMgr.I.FamilyController.reqC2SFamilyTaskGetAllCanStart();
        this._initCost();
    }
    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Family.FamilySingleSendSuccess, this._onFamilySingleSendSuccess, this);
        EventClient.I.off(E.Family.FamilyOneKeySuccess, this._onFamilyOneKeySuccess, this);
        EventClient.I.off(E.Family.FamilyCanStartList, this._onGetCanStartList, this);
    }

    /** 初始化显示消耗 */
    private _initCost(): void {
        const arrStr: any[] = ModelMgr.I.FamilyModel.getCfgItemCost();
        const itemId = Number(arrStr[0]);
        const itemNum = Number(arrStr[1]);
        // 已经使用数量
        const p = UtilItem.GetItemIconPathByItemId(itemId);
        this.SprCost.pngPath(p);
        // 刷新消耗
        const bagNum = BagMgr.I.getItemNum(itemId);
        this.LabCost.string = `${UtilNum.Convert(itemNum)}/${UtilNum.Convert(bagNum)}`;
        this.LabCost.node.color = UtilColor.costColor(bagNum, itemNum);
    }

    /** 初始默认选中列表 */
    private _initCkArr(): void {
        this._ckArr = [];
        if (this._canStartListData && this._canStartListData.length) {
            for (let i = 0, len = this._canStartListData.length; i < len; i++) {
                this._ckArr.push(true);
            }
        }
    }

    /** 初始化可派遣列表 */
    private _ckArr: boolean[];// 选中列表
    private _canStartListData: CanStartTask[];
    private _onGetCanStartList(data: S2CFamilyTaskGetAllCanStart): void {
        this._canStartListData = [];
        this._canStartListData = ModelMgr.I.FamilyModel.getCanStarList();

        this.NdEmpty.active = this._canStartListData.length === 0;
        this._initCkArr();
        this.list.setNumItems(this._canStartListData.length, 0);
        this.list.scrollTo(0);
    }

    /** 一键派遣成功 */
    private _onFamilyOneKeySuccess(): void {
        MsgToastMgr.Show(i18n.tt(Lang.family_SendSuccess));
        this._canStartListData = [];
        this._canStartListData = ModelMgr.I.FamilyModel.getCanStarList();
        this._initCkArr();
        if (this._canStartListData.length === 0) { // 列表没东西 关闭
            this.close();
            return;
        }
        this.list.setNumItems(this._canStartListData.length, 0);
        this.list.scrollTo(0);
        this._initCost();// 更新消耗
    }

    /** 单独派遣成功 */
    private _onFamilySingleSendSuccess(): void {
        this._canStartListData = [];
        this._canStartListData = ModelMgr.I.FamilyModel.getCanStarList();
        this._initCkArr();
        if (this._canStartListData.length === 0) { // 列表没东西 关闭
            this.close();
            return;
        }
        this.list.setNumItems(this._canStartListData.length, 0);
        this.list.scrollTo(0);
        this._initCost();// 更新消耗
    }

    /** 展示列表 */
    private scrollEvent(node: cc.Node, index: number) {
        const item: FamilyDispatchItem = node.getComponent(FamilyDispatchItem);
        item.setData(this._canStartListData[index], (bol: boolean) => {
            this._ckArr[index] = bol;
        }, this._ckArr[index]);
    }
}
