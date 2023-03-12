import { i18n, Lang } from '../../../../../../i18n/i18n';
import { EventClient } from '../../../../../../app/base/event/EventClient';
import ListView from '../../../../../base/components/listview/ListView';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import ItemModel from '../../../../../com/item/ItemModel';
import { E } from '../../../../../const/EventName';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { GeneralStoreItem } from './GeneralStoreItem';
import { WinTabPage } from '../../../../../com/win/WinTabPage';
import { UtilString } from '../../../../../../app/base/utils/UtilString';
import { EMsgBoxModel } from '../../../../../com/msgbox/ConfirmBox';
import { ItemType } from '../../../../../com/item/ItemConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralStorePage extends WinTabPage {
    @property(cc.Node)// 取出
    private BtnTakeOut: cc.Node = null;
    @property(cc.Node)// 空
    private NdEmpty: cc.Node = null;
    @property(cc.Node)// 全部取出
    private BtnTakeOutAll: cc.Node = null;

    @property(ListView)
    private ListGrid: ListView = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.BtnTakeOut, this._onTakeOut, this);
        UtilGame.Click(this.BtnTakeOutAll, this._onTakeOutAll, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this._checkedArr = null;
        EventClient.I.off(E.GeneralRecruit.ZhaoMuBagInfo, this._onInitBagInfo, this);
        EventClient.I.off(E.GeneralRecruit.TakeOutSuccess, this._onTakeOutSuccess, this);
    }

    private _onTakeOutAll(): void {
        if (this._currData && this._currData.length) {
            if (this._checkMax()) {
                this._currData = ModelMgr.I.GeneralRecruitModel.getBagData(this._actId);
                let hasGeneral = false;
                for (let i = 0; i < this._currData.length; i++) {
                    const itemModel: ItemModel = this._currData[i];
                    const subType = itemModel.cfg.SubType;
                    if (subType === ItemType.GENERAL_TYPE) {
                        hasGeneral = true;
                        break;
                    }
                }
                if (hasGeneral) {
                    const str = UtilString.unionColor(i18n.tt(Lang.general_full));
                    ModelMgr.I.MsgBoxModel.ShowBox(str, null, null, null, EMsgBoxModel.Confirm);
                }
            }
            ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuBagTakeOut(this._actId, 1, []);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.general_noneItem));// 没有物品可以取出
        }
    }
    private _checkMax(): boolean {
        const allData = ModelMgr.I.GeneralModel.generalAllData;
        const cfg: Cfg_Config_General = ModelMgr.I.GeneralModel.cfgConfigGeneral.getValueByKey('GeneralMaxNum');
        const maxGeneralLen = Number(cfg.CfgValue);

        return allData.size >= maxGeneralLen;
    }

    private _onTakeOut(): void {
        if (!this._currData || !this._currData.length) {
            MsgToastMgr.Show(i18n.tt(Lang.general_noneItem));
            return;
        }

        const onlyIds: string[] = [];
        let hasGeneral = false;
        for (let i = 0; i < this._checkedArr.length; i++) {
            const bol = this._checkedArr[i];
            if (bol) {
                const itemModel: ItemModel = this._currData[i];
                const onlyId: string = itemModel.data.OnlyId;
                onlyIds.push(onlyId);
                const subType = itemModel.cfg.SubType;
                if (subType === ItemType.GENERAL_TYPE) {
                    hasGeneral = true;
                    break;
                }
            }
        }

        if (onlyIds.length) {
            if (this._checkMax()) {
                if (hasGeneral) { // 取出的有武将需要弹窗
                    const str = UtilString.unionColor(i18n.tt(Lang.general_full));
                    ModelMgr.I.MsgBoxModel.ShowBox(str, null, null, null, EMsgBoxModel.Confirm);
                }
            }
            ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuBagTakeOut(this._actId, 0, onlyIds);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.general_unselect));
        }
    }

    private _checkedArr: boolean[];
    /** 初始列表条数 */
    private listMinGridCount: number = 30;
    /** 每行多少个 */
    private _rowNum: number = 5;
    /** 当前显示列表 */
    private _currData: ItemModel[];
    /** 最多显示200条 */
    private listMaxGridCount: number = 200;

    private _onTakeOutSuccess(data: S2CZhaoMuBagTakeOut): void {
        if (data.FuncId !== this._actId) return;
        // 直接更新list
        this._onInitBagInfo(data);
    }

    /** 所有操作在第一个协议返回执行 */
    private _onInitBagInfo(data: S2CZhaoMuBagData | S2CZhaoMuBagTakeOut) {
        if (data.FuncId !== this._actId) return;

        this._currData = ModelMgr.I.GeneralRecruitModel.getBagData(this._actId);
        if (this._currData && this._currData.length) {
            this.ListGrid.node.active = true;
            this.NdEmpty.active = false;

            this._checkedArr = [];
            for (let i = 0, len = this._currData.length; i < len; i++) {
                this._checkedArr.push(false);
            }

            const len: number = this._currData.length;
            if (len) {
                this._initList(this._currData.length, this.ListGrid, 604, this._rowNum, this.listMinGridCount, this.listMaxGridCount);
            } else {
                this.ListGrid.setNumItems(0);
            }
        } else {
            this.ListGrid.setNumItems(0);
            this.ListGrid.node.active = false;
            this.NdEmpty.active = true;
        }
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const prop: ItemModel = this._currData[idx];
        const grid = node.getComponent(GeneralStoreItem);
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
            }, this);
        } else {
            grid.clearIcon();
            grid.NdSelectVisible(false);
        }
        grid.NdEventVisible(true);
    }

    private _initList(len: number, list: ListView, height: number, rowNum: number, minCount: number, maxCount: number): void {
        let gridCount = Math.min(Math.max(len, minCount), maxCount);
        if (gridCount % rowNum !== 0) {
            gridCount += rowNum - gridCount % rowNum;
        }

        list.setNumItems(gridCount, 0);
    }

    private _containerId: number;
    private _actId: number = 0;
    public init(containerId: number, param: unknown[], tabIdx: number, funcId: number): void {
        super.init(containerId, param, tabIdx, funcId);

        EventClient.I.on(E.GeneralRecruit.ZhaoMuBagInfo, this._onInitBagInfo, this);
        EventClient.I.on(E.GeneralRecruit.TakeOutSuccess, this._onTakeOutSuccess, this);

        const actIds: number[] = ModelMgr.I.ActivityModel.getActsByContainerId(containerId);
        this._actId = actIds[tabIdx];
        this._containerId = containerId;
        ControllerMgr.I.ActivityController.reqC2SGetActivityConfig(this._actId);
        ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuBagData(this._actId);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number): void {
        super.refreshPage(winId, param, tabIdx);

        const actIds: number[] = ModelMgr.I.ActivityModel.getActsByContainerId(this._containerId);
        this._actId = actIds[tabIdx];

        ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuBagData(this._actId);
    }

    protected updateUI(secondId: number, tabIdx: number, tabId: number, param: number, winId: number): void {
        console.log('updateUI');

        // const actIds: number[] = ModelMgr.I.ActivityModel.getActsByContainerId(winId);
        // this._actId = actIds[tabIdx];

        // ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuBagData(this._actId);
    }
}
