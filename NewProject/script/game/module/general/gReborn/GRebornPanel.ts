/*
 * @Author: kexd
 * @Date: 2022-12-12 14:50:31
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gReborn\GRebornPanel.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import { TabPagesView } from '../../../com/win/WinTabPageView';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import { GeneralModel } from '../GeneralModel';
import { DynamicImage } from '../../../base/components/DynamicImage';
import GeneralHead from '../com/GeneralHead';
import { ClickType, GeneralMsg } from '../GeneralConst';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import UtilItem from '../../../base/utils/UtilItem';
import ItemModel from '../../../com/item/ItemModel';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { BagMgr } from '../../bag/BagMgr';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { ItemType } from '../../../com/item/ItemConst';
import { BagItemChangeInfo } from '../../bag/BagConst';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UI_PATH_ENUM } from '../../../const/UIPath';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GRebornPanel extends TabPagesView {
    @property(cc.ToggleContainer)
    private TogCon: cc.ToggleContainer = null;

    @property(cc.Node)
    private NdEmpty: cc.Node = null;

    @property(cc.Node)
    private NdIcon: cc.Node = null;
    @property(cc.Node)
    private NdAdd: cc.Node = null;
    @property(cc.Node)
    private NdGeneral: cc.Node = null;

    @property(cc.Node)
    private BtnReborn: cc.Node = null;
    @property(DynamicImage)
    private SprCurrency: DynamicImage = null;
    @property(cc.Label)
    private LabHave: cc.Label = null;
    @property(cc.Label)
    private LabCost: cc.Label = null;

    @property(ListView)
    private ListBack: ListView = null;

    private _ndGeneralItem: cc.Node = null;

    private _M: GeneralModel = null;
    private _selectGeneral: GeneralMsg = null;
    private _tab: number = 0;

    protected onLoad(): void {
        super.onLoad();
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
    }

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
        this.uptCost();
    }

    protected onDisable(): void {
        this.uptSelected();
    }

    private addE() {
        EventClient.I.on(E.General.GReturn, this.uptUI, this);
        EventClient.I.on(E.General.GReturnChoose, this.uptSelected, this);
        EventClient.I.on(E.General.Del, this.onDel, this);
        EventClient.I.on(E.General.GReborn, this.onReborn, this);
        RoleMgr.I.on(this.uptCost, this, RoleAN.N.ItemType_Coin3);
    }

    private remE() {
        EventClient.I.off(E.General.GReturn, this.uptUI, this);
        EventClient.I.off(E.General.GReturnChoose, this.uptSelected, this);
        EventClient.I.off(E.General.Del, this.onDel, this);
        EventClient.I.off(E.General.GReborn, this.onReborn, this);
        RoleMgr.I.off(this.uptCost, this, RoleAN.N.ItemType_Coin3);
    }

    private clk() {
        UtilGame.Click(this.NdIcon, () => {
            WinMgr.I.open(ViewConst.GRebornChooseWin, this._selectGeneral);
        }, this);

        UtilGame.Click(this.BtnReborn, () => {
            if (!this._selectGeneral) {
                MsgToastMgr.Show(i18n.tt(Lang.general_reborn));
                return;
            }
            // 检查消耗是否足够
            const cost = this._M.getRebornCost();
            const have = BagMgr.I.getItemNum(cost.id);
            if (have < cost.need) {
                WinMgr.I.open(ViewConst.ItemSourceWin, cost.id);
                return;
            }

            ControllerMgr.I.GeneralController.reqGeneralReborn(this._selectGeneral.generalData.OnlyId);
        }, this);

        for (let i = 0; i < this.TogCon.toggleItems.length; i++) {
            if (this.TogCon.toggleItems[i]) {
                UtilGame.Click(this.TogCon.toggleItems[i].node, (nodeToggle: cc.Node) => {
                    const tab: number = +nodeToggle.name;
                    if (this._tab === tab) {
                        return;
                    }
                    this.onTog(tab);
                }, this);
            }
        }
    }

    /** 武将重生/神兵重铸 下期再补上 */
    private onTog(tab: number) {
        //
    }

    private uptCost() {
        if (!this._selectGeneral) {
            this.LabCost.node.active = false;
            this.LabHave.node.active = false;
            this.SprCurrency.node.active = false;
        } else {
            this.LabCost.node.active = true;
            this.LabHave.node.active = true;
            this.SprCurrency.node.active = true;

            const cost = this._M.getRebornCost();
            const have = BagMgr.I.getItemNum(cost.id);
            const color: cc.Color = have >= cost.need ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
            this.LabHave.node.color = color;
            this.LabCost.node.color = color;
            this.LabHave.string = `${UtilNum.Convert(have)}`;
            this.LabCost.string = `/${cost.need}`;
            const costImgUrl: string = UtilCurrency.getIconByCurrencyType(cost.id);
            this.SprCurrency.loadImage(costImgUrl, 1, true);
        }
    }

    private onDel() {
        if (this._selectGeneral) {
            const list = this._M.getGeneralListByNewRarity(0);
            if (list.length > 0) {
                const index = list.findIndex((v) => v.generalData.OnlyId === this._selectGeneral.generalData.OnlyId);
                if (index < 0) {
                    this._selectGeneral = null;
                }
            }
        }
        if (!this._selectGeneral) {
            if (this._ndGeneralItem) {
                this._ndGeneralItem.active = false;
            }

            this._backItems = [];
            this.ListBack.setNumItems(0);
        }
    }

    private onReborn() {
        this._selectGeneral = null;
        this._backItems = [];
        this.ListBack.setNumItems(0);

        if (this._ndGeneralItem) {
            this._ndGeneralItem.active = false;
        }
        this.uptCost();
    }

    private _backItems: ItemModel[] = [];
    private uptUI(backItems: ItemInfo[]) {
        this._backItems = [];
        for (let i = 0; i < backItems.length; i++) {
            const itemModel: ItemModel = UtilItem.NewItemModel(backItems[i].ItemId, backItems[i].ItemNum);
            this._backItems.push(itemModel);
        }
        this._backItems.sort((a, b) => {
            if (a.cfg.SubType !== b.cfg.SubType) {
                const aWeight: number = a.cfg.SubType === ItemType.GENERAL_TYPE ? 1 : 2;
                const bWeight: number = b.cfg.SubType === ItemType.GENERAL_TYPE ? 1 : 2;
                return aWeight - bWeight;
            }
            return a.cfg.Id - b.cfg.Id;
        });
        this.ListBack.setNumItems(backItems.length);

        this.NdEmpty.active = this._backItems.length === 0;
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: ItemModel = this._backItems[idx];
        const item = node.getComponent(ItemIcon);
        if (data && item) {
            item.setData(data, { needName: true, needNum: true });
        }
    }

    private uptSelected(msg?: GeneralMsg) {
        if (msg) {
            this._selectGeneral = msg;
            ControllerMgr.I.GeneralController.reqGeneralReturn(this._selectGeneral.generalData.OnlyId);
        } else {
            this._selectGeneral = null;
            this._backItems = [];
            this.ListBack.setNumItems(0);
        }

        if (this._selectGeneral) {
            if (this._ndGeneralItem) {
                this._ndGeneralItem.active = true;
                this._ndGeneralItem.getComponent(GeneralHead).setData(this._selectGeneral, {
                    isSelected: false,
                    callback: (msg: GeneralMsg) => {
                        WinMgr.I.open(ViewConst.GRebornChooseWin, this._selectGeneral);
                    },
                    context: this,
                });
            } else {
                ResMgr.I.loadLocal(UI_PATH_ENUM.Module_General_Com_GeneralHead, cc.Prefab, (e, p: cc.Prefab) => {
                    if (e) return;
                    if (this._ndGeneralItem) {
                        this._ndGeneralItem.active = true;
                    } else {
                        // 还没有
                        const child = cc.instantiate(p);
                        this._ndGeneralItem = child;
                        this._ndGeneralItem.active = true;
                        this.NdGeneral.addChild(child);
                    }
                    this._ndGeneralItem.getComponent(GeneralHead).setData(this._selectGeneral, {
                        isSelected: false,
                        callback: (msg: GeneralMsg) => {
                            WinMgr.I.open(ViewConst.GRebornChooseWin, this._selectGeneral);
                        },
                        context: this,
                    });
                });
            }
        } else if (this._ndGeneralItem) {
            this._ndGeneralItem.active = false;
        }

        this.uptCost();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
