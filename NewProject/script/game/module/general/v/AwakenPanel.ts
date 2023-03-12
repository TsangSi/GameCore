/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-09-22 18:31:44
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\v\AwakenPanel.ts
 * @Description: 武将-觉醒
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import Progress from '../../../base/components/Progress';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemType } from '../../../com/item/ItemConst';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagItemChangeInfo } from '../../bag/BagConst';
import { BagMgr } from '../../bag/BagMgr';
import GeneralItem from '../com/GeneralItem';
import { GeneralMsg } from '../GeneralConst';
import { GeneralModel } from '../GeneralModel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AwakenPanel extends WinTabPage {
    @property(cc.Node)
    private BtnLeft: cc.Node = null;
    @property(cc.Node)
    private BtnRight: cc.Node = null;

    // 资质属性
    @property(Progress)
    private Progress: Progress[] = [];
    @property(cc.Node)
    private NdUp: cc.Node[] = [];
    @property(cc.Label)
    private LabUpNum: cc.Label[] = [];
    // 消耗道具
    @property(cc.Node)
    private NdUseItem: cc.Node = null;
    @property({ type: cc.Prefab })
    private GeneralItemPrefab: cc.Prefab = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Toggle)
    private TogBuy: cc.Toggle = null;

    @property(cc.Node)
    private NdCost: cc.Node = null;
    @property(cc.Node)
    private BtnMax: cc.Node = null;

    private _M: GeneralModel = null;
    private _generalIds: string[] = [];
    private _index: number = 0;
    private _curData: GeneralMsg = null;
    private _useItemId: number = 0;
    private _cost: { id: number, num: number }[] = [];

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
        this.TogBuy.isChecked = false;
    }

    public setData(): void {
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
        this._generalIds = this._M.getGeneralIds();
        for (let i = 0; i < this.NdUp.length; i++) {
            this.NdUp[i].active = false;
        }
        this.uptContent(true);
    }

    private addE() {
        EventClient.I.on(E.General.UptAwaken, this.uptAwaken, this);
        EventClient.I.on(E.General.GEquipStarUp, this.uptAttr, this);
        EventClient.I.on(E.Bag.ItemChange, this.onBagChange, this);
    }

    private remE() {
        EventClient.I.off(E.General.UptAwaken, this.uptAwaken, this);
        EventClient.I.off(E.General.GEquipStarUp, this.uptAttr, this);
        EventClient.I.off(E.Bag.ItemChange, this.onBagChange, this);
    }

    private clk() {
        UtilGame.Click(this.BtnLeft, () => {
            this.changeGeneral(false);
        }, this);

        UtilGame.Click(this.BtnRight, () => {
            this.changeGeneral(true);
        }, this);

        UtilGame.Click(this.BtnUp, () => {
            if (this._curData) {
                if (!this.TogBuy.isChecked) {
                    let index = this._useItemId === this._cost[0].id ? 0 : 1;
                    if (!this._cost[index]) {
                        index = 0;
                        this._useItemId = this._cost[0].id;
                    }
                    const need: number = this._cost[index].num;
                    const have = BagMgr.I.getItemNum(this._useItemId);
                    if (have < need) {
                        WinMgr.I.open(ViewConst.ItemSourceWin, this._useItemId);
                        return;
                    }
                }
                const itemType: number = this._useItemId === this._cost[0].id ? 1 : 2;
                const AutoBuy: number = this.TogBuy.isChecked ? 1 : 0;
                ControllerMgr.I.GeneralController.reqGeneralAwaken(this._curData.generalData.OnlyId, itemType, AutoBuy);
            }
        }, this);

        UtilGame.Click(this.TogBuy.node, this.onTog, this);
    }

    private changeGeneral(isRight: boolean) {
        if (!this._generalIds || this._generalIds.length === 0) {
            this.BtnLeft.active = false;
            this.BtnRight.active = false;
            return;
        }
        if (isRight) {
            if (this._index < this._generalIds.length - 1) {
                this._index++;
            }
        } else if (this._index > 0) {
            this._index--;
        }
        this._M.curOnlyId = this._generalIds[this._index];
        for (let i = 0; i < this.NdUp.length; i++) {
            this.NdUp[i].active = false;
        }
        this.uptContent(true);
    }

    private uptArrow() {
        this.BtnLeft.active = this._index > 0;
        this.BtnRight.active = this._index < this._generalIds.length - 1;
    }

    private onTog() {
        //
    }

    private uptAwaken(preMsg?: {
        AtkTalent: number,
        DefTalent: number,
        HpTalent: number,
        MaxAtkTalent: number,
        MaxDefTalent: number,
        MaxHpTalent: number,
        Grow: number,
        MaxGrow: number,
        Title: number,
    }) {
        if (this.node.active) {
            EventClient.I.emit(E.General.UptEntity, this._curData);
        }
        //
        this.uptAttr(preMsg);
        //
        this.uptCost();
        // 红点
        const isRed = this._M.checkCurAwakenRed(this._curData);
        UtilRedDot.UpdateRed(this.BtnUp, isRed, cc.v2(64, 18));
    }

    private uptContent(init: boolean) {
        // 获取当前武将
        if (!this._M.curOnlyId) {
            this._M.curOnlyId = this._generalIds[0];
        }
        this._curData = this._M.curData;
        if (!this._curData) {
            const all = this._M.getGeneralListByRarity(0);
            all.sort(this._M.sort);
            this._curData = all[0];
        }

        if (!this._curData) return;
        if (!this._curData.cfg) {
            this._curData.cfg = Config.Get(Config.Type.Cfg_General).getValueByKey(this._curData.generalData.IId);
        }

        this._index = this._generalIds.indexOf(this._curData.generalData.OnlyId);

        if (this.node.active) {
            EventClient.I.emit(E.General.UptEntity, this._curData);
        }

        // 属性
        this.uptAttr();

        // 消耗
        if (init) {
            this.initCost();
        }
        this.uptCost();

        // 红点
        const isRed = this._M.checkCurAwakenRed(this._curData);
        UtilRedDot.UpdateRed(this.BtnUp, isRed, cc.v2(64, 18));
        //
        this.uptArrow();
    }

    private uptAttr(preMsg?: {
        AtkTalent: number,
        DefTalent: number,
        HpTalent: number,
        MaxAtkTalent: number,
        MaxDefTalent: number,
        MaxHpTalent: number,
        Grow: number,
        MaxGrow: number,
        Title: number,
    }) {
        this._curData = this._M.curData;
        if (!this._curData) return;

        const isChange: boolean = !!preMsg;

        this.Progress[0].updateProgress(this._curData.generalData.AtkTalent, this._curData.generalData.MaxAtkTalent, isChange && (preMsg.AtkTalent !== this._curData.generalData.AtkTalent || preMsg.MaxAtkTalent !== this._curData.generalData.MaxAtkTalent));
        this.Progress[1].updateProgress(this._curData.generalData.DefTalent, this._curData.generalData.MaxDefTalent, isChange && (preMsg.DefTalent !== this._curData.generalData.DefTalent || preMsg.MaxDefTalent !== this._curData.generalData.MaxDefTalent));
        this.Progress[2].updateProgress(this._curData.generalData.HpTalent, this._curData.generalData.MaxHpTalent, isChange && (preMsg.HpTalent !== this._curData.generalData.HpTalent || preMsg.MaxHpTalent !== this._curData.generalData.MaxHpTalent));
        this.Progress[3].toFix = 4;
        this.Progress[3].updateProgress(this._curData.generalData.Grow / 10000, this._curData.generalData.MaxGrow / 10000, isChange && (preMsg.Grow !== this._curData.generalData.Grow || preMsg.MaxGrow !== this._curData.generalData.MaxGrow));

        if (isChange) {
            const addAtk = this._curData.generalData.AtkTalent - preMsg.AtkTalent;
            const addDef = this._curData.generalData.DefTalent - preMsg.DefTalent;
            const addHp = this._curData.generalData.HpTalent - preMsg.HpTalent;
            const addGrow = this._curData.generalData.Grow - preMsg.Grow;

            this.NdUp[0].active = addAtk > 0 && (this._curData.generalData.MaxAtkTalent >= this._curData.generalData.AtkTalent);
            this.NdUp[1].active = addDef > 0 && (this._curData.generalData.MaxDefTalent >= this._curData.generalData.DefTalent);
            this.NdUp[2].active = addHp > 0 && (this._curData.generalData.MaxHpTalent >= this._curData.generalData.HpTalent);
            this.NdUp[3].active = addGrow > 0 && (this._curData.generalData.MaxGrow >= this._curData.generalData.Grow);
            // console.log('addGrow=', addGrow, this._curData.generalData.MaxGrow, this._curData.generalData.Grow);
            this.LabUpNum[0].string = `${addAtk}`;
            this.LabUpNum[1].string = `${addDef}`;
            this.LabUpNum[2].string = `${addHp}`;
            this.LabUpNum[3].string = `${(addGrow / 10000).toFixed(4)}`;
        } else {
            // for (let i = 0; i < this.NdUp.length; i++) {
            //     this.NdUp[i].active = false;
            // }
        }
    }

    private autoChooseItemId() {
        if (!this._useItemId) {
            this._useItemId = this._cost[0].id;
        }
        // 先判断当前的是否还有数量
        const index = this._cost.findIndex((v) => v.id === this._useItemId);
        if (index >= 0) {
            const have = BagMgr.I.getItemNum(this._cost[index].id);
            if (have > 0) {
                return;
            }
        } else {
            this._useItemId = this._cost[0].id;
        }
        // 只有当前没数量了才跳到其他材料
        for (let i = 0; i < this._cost.length; i++) {
            const id: number = this._cost[i].id;
            const have = BagMgr.I.getItemNum(id);
            if (have > 0) {
                this._useItemId = id;
                break;
            }
        }
    }

    private initCost() {
        this._cost = [];
        const cfg: Cfg_GeneralRarity = Config.Get(Config.Type.Cfg_GeneralRarity).getValueByKey(this._curData.cfg.Rarity);
        if (cfg && cfg.AwakenCost) {
            const cost = cfg.AwakenCost.split(':');
            this._cost.push({ id: +cost[0], num: +cost[1] });
            const superCost: string = cfg.AwakenSuperCost;
            if (superCost) {
                const scost = superCost.split(':');
                if (scost && scost.length > 0) {
                    this._cost.push({ id: +scost[0], num: +scost[1] });
                }
            }
            this.autoChooseItemId();
        }
    }

    private uptCost() {
        if (this._M.isAwakenMax(this._curData)) {
            this.NdCost.active = false;
            this.BtnMax.active = true;
            return;
        }
        this.NdCost.active = true;
        this.BtnMax.active = false;

        // 删除多余的
        for (let index = this._cost.length; index < this.NdUseItem.children.length; index++) {
            const element = this.NdUseItem.children[index];
            element.destroy();
        }

        if (this._cost && this._cost.length > 0) {
            this.autoChooseItemId();
            for (let i = 0; i < this._cost.length; i++) {
                if (this.NdUseItem.children[i]) {
                    this.NdUseItem.children[i].getComponent(GeneralItem).setAwakenData(this._cost[i].id, this._cost[i].num, this._cost[i].id === this._useItemId);
                } else {
                    const id: number = this._cost[i].id;
                    const node = cc.instantiate(this.GeneralItemPrefab);
                    this.NdUseItem.addChild(node);
                    node.attr({ itemId: id });
                    node.getComponent(GeneralItem).setAwakenData(id, this._cost[i].num, this._cost[i].id === this._useItemId, false, (itemId: number) => {
                        this._useItemId = itemId;
                        const children = this.NdUseItem.children;
                        for (let k = 0; k < children.length; k++) {
                            // eslint-disable-next-line dot-notation
                            children[k].getComponent(GeneralItem).setSelected(children[k]['itemId'] === itemId);
                        }
                    }, this);
                }
            }
        }
    }

    private onBagChange(changes: BagItemChangeInfo[]) {
        let check: boolean = false;
        if (changes) {
            for (let i = 0; i < changes.length; i++) {
                if (changes[i].itemModel && changes[i].itemModel.cfg
                    && changes[i].itemModel.cfg.Type === ItemType.MATERIAL && changes[i].itemModel.cfg.SubType === ItemType.GENERAL_ITEM) {
                    check = true;
                    break;
                }
            }
        }
        if (check) {
            this.uptContent(false);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
