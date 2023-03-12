/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-08-16 16:59:09
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\v\LevelUpPanel.ts
 * @Description: 武将-升级界面
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import GeneralItem from '../com/GeneralItem';
import { GeneralMsg } from '../GeneralConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { BagItemChangeInfo } from '../../bag/BagConst';
import { ItemType } from '../../../com/item/ItemConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import Progress from '../../../base/components/Progress';
import { GeneralModel } from '../GeneralModel';
import { UtilShop } from '../../shop/UtilShop';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelUpPanel extends WinTabPage {
    @property(cc.Node)
    private BtnLeft: cc.Node = null;
    @property(cc.Node)
    private BtnRight: cc.Node = null;
    //
    @property(cc.Node)
    private NdCost: cc.Node = null;
    @property(cc.Node)
    private NdFull: cc.Node = null;
    //
    @property(Progress)
    private BarExp: Progress = null;
    @property(cc.Label)
    private LabAtk: cc.Label = null;
    @property(cc.Label)
    private LabAtkAdd: cc.Label = null;
    @property(cc.Label)
    private LabDef: cc.Label = null;
    @property(cc.Label)
    private LabDefAdd: cc.Label = null;
    @property(cc.Label)
    private LabHp: cc.Label = null;
    @property(cc.Label)
    private LabHpAdd: cc.Label = null;
    @property(cc.Node)
    private NdUseItem: cc.Node = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Node)
    private BtnOneKey: cc.Node = null;

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
    }

    public setData(): void {
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
        this._generalIds = this._M.getGeneralIds();
        this.initCostData();
        this.uptContent(true);
    }

    private addE() {
        EventClient.I.on(E.General.LevelUp, this.uptLevelUp, this);
        EventClient.I.on(E.General.UptAttr, this.uptAttr, this);
        EventClient.I.on(E.General.Del, this.uptDel, this);
        EventClient.I.on(E.Bag.ItemChange, this.onBagChange, this);
    }

    private remE() {
        EventClient.I.off(E.General.LevelUp, this.uptLevelUp, this);
        EventClient.I.off(E.General.UptAttr, this.uptAttr, this);
        EventClient.I.off(E.General.Del, this.uptDel, this);
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
                const have = BagMgr.I.getItemNum(this._useItemId);
                if (have < 1) {
                    UtilShop.itemIsEnough(this._useItemId, 1, false, true);// WinMgr.I.open(ViewConst.ItemSourceWin, this._useItemId);
                } else {
                    ControllerMgr.I.GeneralController.reqLevelUp(this._curData.generalData.OnlyId, this._useItemId, 1);
                }
            }
        }, this);

        UtilGame.Click(this.BtnOneKey, () => {
            if (this._curData) {
                const have: number = BagMgr.I.getItemNum(this._useItemId);
                if (have < 1) {
                    UtilShop.itemIsEnough(this._useItemId, 1, false, true);// WinMgr.I.open(ViewConst.ItemSourceWin, this._useItemId);
                } else {
                    const cfg: Cfg_GeneralLevelUp = Config.Get(Config.Type.Cfg_GeneralLevelUp).getValueByKey(this._curData.generalData.Level);
                    if (cfg) {
                        let need: number = cfg.ExpMax - this._curData.generalData.Exp;
                        const one = this.getItemExp();
                        need = Math.ceil(need / one);
                        if (need > have) need = have;
                        if (need < 1) need = 1;
                        ControllerMgr.I.GeneralController.reqLevelUp(this._curData.generalData.OnlyId, this._useItemId, need);
                    }
                }
            }
        }, this);
    }

    private getItemExp(): number {
        if (this._cost) {
            for (let i = 0; i < this._cost.length; i++) {
                if (this._cost[i].id === this._useItemId) {
                    return this._cost[i].num;
                }
            }
        }
        return 0;
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
        this.uptContent(true);
    }

    private uptArrow() {
        this.BtnLeft.active = this._index > 0;
        this.BtnRight.active = this._index < this._generalIds.length - 1;
    }

    /** 当前武将被删了的话就重现选一个武将 */
    private uptDel() {
        // 当前武将是否还存在，不存在则需要重现选择
        this._generalIds = this._M.getGeneralIds();
        const curIndex: number = this._generalIds.indexOf(this._M.curOnlyId);
        if (curIndex < 0) {
            this._index = 0;
            this._M.curOnlyId = this._generalIds[0];
            this.uptContent(true);
        }
    }

    /** 武将升级的刷新 */
    private uptLevelUp() {
        this.uptContent(false, true);
    }

    /** 有属性更新的刷新 */
    private uptAttr() {
        this.uptContent(false);
    }

    private uptContent(init: boolean, showAction: boolean = false) {
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

        this._index = this._generalIds.indexOf(this._curData.generalData.OnlyId);

        const cfg: Cfg_GeneralLevelUp = Config.Get(Config.Type.Cfg_GeneralLevelUp).getValueByKey(this._curData.generalData.Level);
        // 属性
        const atk = this._M.oneAttrIncr(cfg.A_Attr, this._curData.generalData.AtkTalent, 0, this._curData.generalData.Grow, 1);
        const def = this._M.oneAttrIncr(cfg.D_Attr, this._curData.generalData.DefTalent, 0, this._curData.generalData.Grow, 1);
        const hp = this._M.oneAttrIncr(cfg.H_Attr, this._curData.generalData.HpTalent, 0, this._curData.generalData.Grow, 1);

        this.LabAtk.string = `${i18n.tt(Lang.com_attr_2_name)} `;
        this.LabAtkAdd.string = `+${atk}`;
        this.LabDef.string = `${i18n.tt(Lang.com_attr_3_name)} `;
        this.LabDefAdd.string = `+${def}`;
        this.LabHp.string = `${i18n.tt(Lang.com_attr_1_name)} `;
        this.LabHpAdd.string = `+${hp}`;

        // 升级是否已满
        if (!this._M.isNotFull(this._curData.generalData.Level)) {
            this.NdCost.active = false;
            this.NdFull.active = true;
        } else {
            this.NdCost.active = true;
            this.NdFull.active = false;

            // 经验
            const cur: number = this._curData.generalData.Exp;
            let next: number = cfg.ExpMax;
            if (next < cur) {
                next = cur;
            }
            this.BarExp.updateProgress(cur, next, showAction);

            // 消耗
            this.uptCost();
        }

        // 模型信息
        if (this.node.active) {
            EventClient.I.emit(E.General.UptEntity, this._curData);
        }

        // 红点
        const isRed = this._M.checkCurLevelUp(this._curData);
        this.BtnUp.getChildByName('NdRed').active = isRed;
        this.BtnOneKey.getChildByName('NdRed').active = isRed;
        //
        this.uptArrow();
    }

    private initCostData() {
        this._cost = this._M.levelUpCost;
    }

    private uptCost() {
        // 删除多余的
        for (let index = this._cost.length; index < this.NdUseItem.children.length; index++) {
            const element = this.NdUseItem.children[index];
            element.destroy();
        }
        if (this._cost && this._cost.length > 0) {
            this.autoChooseItemId();
            if (this.NdUseItem.children.length > 0) {
                for (let i = 0; i < this._cost.length; i++) {
                    if (this.NdUseItem.children[i]) {
                        this.NdUseItem.children[i].getComponent(GeneralItem).setData(this._cost[i].id, this._cost[i].num, this._cost[i].id === this._useItemId);
                    }
                }
            } else {
                ResMgr.I.loadLocal(UI_PATH_ENUM.GeneralItem, cc.Prefab, (err, p: cc.Prefab) => {
                    if (err) return;
                    if (!this.NdUseItem || !this.NdUseItem.isValid) return;
                    if (p) {
                        for (let i = 0; i < this._cost.length; i++) {
                            const id: number = this._cost[i].id;
                            const node = cc.instantiate(p);
                            this.NdUseItem.addChild(node);
                            node.attr({ itemId: id });
                            node.getComponent(GeneralItem).setData(id, this._cost[i].num, this._cost[i].id === this._useItemId, (itemId: number) => {
                                this._useItemId = itemId;
                                const children = this.NdUseItem.children;
                                for (let k = 0; k < children.length; k++) {
                                    // eslint-disable-next-line dot-notation
                                    children[k].getComponent(GeneralItem).setSelected(children[k]['itemId'] === itemId);
                                }
                            }, this);
                        }
                    }
                });
            }
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
