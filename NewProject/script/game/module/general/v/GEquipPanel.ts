/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-11-15 15:53:10
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\v\GEquipPanel.ts
 * @Description: 武将-装备
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { SpriteCustomizer } from '../../../base/components/SpriteCustomizer';
import { Config } from '../../../base/config/Config';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ItemType } from '../../../com/item/ItemConst';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagItemChangeInfo } from '../../bag/BagConst';
import GeneralGradeUpItem from '../com/GeneralGradeUpItem';
import GeneralItem from '../com/GeneralItem';
import GEquipItem from '../com/GEquipItem';
import { EGeneralUiType, GeneralMsg } from '../GeneralConst';
import { GeneralModel } from '../GeneralModel';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { RID } from '../../reddot/RedDotConst';
import { BagMgr } from '../../bag/BagMgr';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UI_PATH_ENUM } from '../../../const/UIPath';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GEquipPanel extends WinTabPage {
    @property(cc.Node)
    private BtnLeft: cc.Node = null;
    @property(cc.Node)
    private BtnRight: cc.Node = null;
    // NdEquip里的控件
    @property(cc.Node)
    private BtnOnekey: cc.Node = null;
    @property(cc.Node)
    private NdEquip: cc.Node[] = [];

    @property(cc.Node)
    private NdLv: cc.Node = null;
    @property(cc.Label)
    private LabLv: cc.Label = null;
    @property(cc.Node)
    private NdStars: cc.Node = null;
    // NdContent里的控件:属性
    @property(cc.Node)
    private NdArrow: cc.Node = null;
    @property(cc.Node)
    private NdNext: cc.Node = null;
    @property(cc.Label)
    private LabCurAtk: cc.Label = null;
    @property(cc.Label)
    private LabCurDef: cc.Label = null;
    @property(cc.Label)
    private LabCurHp: cc.Label = null;
    @property(cc.Label)
    private LabCurGrow: cc.Label = null;
    @property(cc.Label)
    private LabNextAtk: cc.Label = null;
    @property(cc.Label)
    private LabNextDef: cc.Label = null;
    @property(cc.Label)
    private LabNextHp: cc.Label = null;
    @property(cc.Label)
    private LabNextGrow: cc.Label = null;
    // NdContent里的控件
    @property(cc.Node)
    private BtnMax: cc.Node = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Label)
    private LabCondition: cc.Label = null;
    @property(cc.Node)
    private NdCost1: cc.Node = null;
    @property(cc.Node)
    private NdCost2: cc.Node = null;
    @property(cc.Node)
    private NdCostTitle: cc.Node = null;

    @property({ type: cc.Prefab })
    private GradeUpItemPrefab: cc.Prefab = null;
    @property({ type: cc.Prefab })
    private GeneralItemPrefab: cc.Prefab = null;

    private _M: GeneralModel = null;
    private _curData: GeneralMsg = null;
    private _generalIds: string[] = [];
    private _index: number = 0;
    private _chooseCost: GeneralMsg[] = [];
    private _costNum: number = 0;

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
        UtilRedDot.Bind(RID.General.Cur.CurEquip.CurWear, this.BtnOnekey, cc.v2(78, 26));
        UtilRedDot.Bind(RID.General.Cur.CurEquip.CurStarUp, this.BtnUp, cc.v2(58, 20));
        this.uptContent();
    }

    private addE() {
        EventClient.I.on(E.General.GEquipStarUp, this.uptContent, this);
        EventClient.I.on(E.General.GEquipWear, this.uptContent, this);
        EventClient.I.on(E.Bag.ItemChange, this.onBagChange, this);
        EventClient.I.on(E.General.EquipHead, this.uptClickHead, this);
        EventClient.I.on(E.General.UptEquipChoose, this.uptChoose, this);
    }

    private remE() {
        EventClient.I.off(E.General.GEquipStarUp, this.uptContent, this);
        EventClient.I.off(E.General.GEquipWear, this.uptContent, this);
        EventClient.I.off(E.Bag.ItemChange, this.onBagChange, this);
        EventClient.I.off(E.General.EquipHead, this.uptClickHead, this);
        EventClient.I.off(E.General.UptEquipChoose, this.uptChoose, this);
    }

    private clk() {
        UtilGame.Click(this.BtnLeft, () => {
            this.changeGeneral(false);
        }, this);

        UtilGame.Click(this.BtnRight, () => {
            this.changeGeneral(true);
        }, this);

        UtilGame.Click(this.BtnUp, () => {
            const isCanUp = this._M.canEquipStarUp(this._curData, true, true).isRed;
            if (isCanUp) {
                const cost: string[] = [];
                for (let i = 0; i < this._chooseCost.length; i++) {
                    cost.push(this._chooseCost[i].generalData.OnlyId);
                }
                ControllerMgr.I.GeneralController.reqGeneralEquipStarUp(this._curData.generalData.OnlyId, cost);
            }
        }, this);

        UtilGame.Click(this.BtnOnekey, () => {
            // 是否都已装备
            if (this._curData.generalData.EquipData.WearEquips.length >= 4) {
                MsgToastMgr.Show(i18n.tt(Lang.general_equip_full));
                return;
            }
            const onekeyCost = this._M.canOnekeyWear(this._curData);
            if (onekeyCost.canUp) {
                ControllerMgr.I.GeneralController.reqGeneralEquipOnekeyWear(this._curData.generalData.OnlyId);
            } else {
                const have = BagMgr.I.getItemNum(onekeyCost.cost[0].id);
                WinMgr.I.open(ViewConst.WinComQuickPay, onekeyCost.cost[0].id, onekeyCost.cost[0].need - have);
            }
        }, this);
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
            this.uptContent();
        }
    }
    /** 选中哪个武将 */
    private uptClickHead() {
        const gList: GeneralMsg[] = this._M.getGeneralListbyIId(this._curData.generalData.IId, this._curData.generalData.OnlyId);
        if (this._costNum > 0 && gList.length > 0) {
            const choose: string[] = [];
            for (let i = 0; i < this._chooseCost.length; i++) {
                choose.push(this._chooseCost[i].generalData.OnlyId);
            }

            WinMgr.I.open(ViewConst.GradeUpChooseWin, this._curData, choose, this._costNum, 1);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.general_grade_less));
        }
    }

    private uptChoose(chooseList: string[]) {
        this._chooseCost = [];
        for (let i = 0; i < chooseList.length; i++) {
            const d = this._M.generalData(chooseList[i]);
            this._chooseCost.push(d);
        }
        // 消耗
        this.uptCost();
    }

    /** 消耗武将的展示 */
    private uptCost() {
        const cfg: ConfigIndexer = Config.Get(Config.Type.Cfg_Genera_EquipStarUp);
        const curLv = this._curData.generalData.EquipData.Level || 1;
        const curStar = this._curData.generalData.EquipData.Star || 1;
        const curCfg: Cfg_Genera_EquipStarUp = cfg.getValueByKey(curLv, curStar);

        if (!curCfg) return;
        this._costNum = curCfg.CostMyself;

        // 删了多余的
        for (let index = this._costNum; index < this.NdCost1.children.length; index++) {
            const element = this.NdCost1.children[index];
            element.destroy();
        }

        if (this._costNum > 0) {
            for (let i = 0; i < 1; i++) { // this._costNum
                let _d = this._chooseCost[i];
                if (!_d) {
                    const gData = new GeneralData();
                    gData.IId = this._curData.generalData.IId;
                    gData.Title = this._curData.generalData.Title;
                    gData.Quality = this._curData.generalData.Quality;
                    _d = {
                        generalData: gData,
                    };
                }
                // 已存在就刷新
                if (this.NdCost1.children[i]) {
                    this.NdCost1.children[i].getComponent(GeneralGradeUpItem).setData(1, this._curData.generalData.OnlyId, _d, this._chooseCost.length, this._costNum, i);
                } else {
                    const nd = cc.instantiate(this.GradeUpItemPrefab);
                    this.NdCost1.addChild(nd);
                    nd.getComponent(GeneralGradeUpItem).setData(1, this._curData.generalData.OnlyId, _d, this._chooseCost.length, this._costNum, i);
                }
            }
        }
        this.NdCost1.active = this._costNum > 0;

        this.uptItemCost(curCfg);
    }

    /** 消耗道具的展示 */
    private uptItemCost(cfg: Cfg_Genera_EquipStarUp) {
        const cost: { id: number, need: number }[] = [];
        if (cfg.Cost) {
            const itemCost = cfg.Cost.split('|');
            for (let j = 0; j < itemCost.length; j++) {
                const item = itemCost[j].split(':');
                cost.push({ id: +item[0], need: +item[1] });
            }
        }

        // 删除多余的
        for (let index = cost.length; index < this.NdCost2.children.length; index++) {
            const element = this.NdCost2.children[index];
            element.destroy();
        }

        if (cost && cost.length > 0) {
            this.NdCost2.active = true;
            for (let i = 0; i < cost.length; i++) {
                // 已存在就刷新
                if (this.NdCost2.children[i]) {
                    this.NdCost2.children[i].getComponent(GeneralItem).setAwakenData(cost[i].id, cost[i].need, false, true);
                } else {
                    const nd = cc.instantiate(this.GeneralItemPrefab);
                    this.NdCost2.addChild(nd);
                    nd.getComponent(GeneralItem).setAwakenData(cost[i].id, cost[i].need, false, true);
                }
            }
        } else {
            this.NdCost2.active = false;
        }
    }

    /** 更新属性数据 */
    private uptAttr(condition: string) {
        const cfg: ConfigIndexer = Config.Get(Config.Type.Cfg_Genera_EquipStarUp);
        const curLv = this._curData.generalData.EquipData.Level || 1;
        const curStar = this._curData.generalData.EquipData.Star || 1;
        const curCfg: Cfg_Genera_EquipStarUp = cfg.getValueByKey(curLv, curStar);

        if (!curCfg) {
            this.LabCurAtk.string = '+0%';
            this.LabCurDef.string = '+0%';
            this.LabCurHp.string = '+0%';
            this.LabCurGrow.string = '+0';
        } else {
            const ratio = curCfg.AttrPer / 100;
            this.LabCurAtk.string = `+${ratio.toFixed(1)}%`;
            this.LabCurDef.string = `+${ratio.toFixed(1)}%`;
            this.LabCurHp.string = `+${ratio.toFixed(1)}%`;
            if (curCfg.GrowPer === 0) {
                this.LabCurGrow.string = `+0`;
            } else {
                this.LabCurGrow.string = `+${(curCfg.GrowPer / 10000).toFixed(3)}`;
            }
        }

        const next = this._M.getNextLvStar(curLv, curStar);
        let nextRatio = 0;
        const nextCfg: Cfg_Genera_EquipStarUp = cfg.getValueByKey(next.level, next.star);
        if (!nextCfg) {
            this.NdArrow.active = false;
            this.NdNext.active = false;
        } else {
            this.NdArrow.active = true;
            this.NdNext.active = true;
            nextRatio = nextCfg.AttrPer / 100;
            this.LabNextAtk.string = `+${nextRatio.toFixed(1)}%`;
            this.LabNextDef.string = `+${nextRatio.toFixed(1)}%`;
            this.LabNextHp.string = `+${nextRatio.toFixed(1)}%`;
            if (nextCfg.GrowPer === 0) {
                this.LabNextGrow.string = `+0`;
            } else {
                this.LabNextGrow.string = `+${(nextCfg.GrowPer / 10000).toFixed(3)}`;
            }
        }

        // 是否满级
        const isMax = !nextCfg;
        this.NdCostTitle.active = !isMax;
        this.BtnMax.active = isMax;
        this.BtnUp.active = !isMax;
        // 是否穿了4件
        const isWearAll = this._M.isWearAll(this._curData);
        // 未满足升星条件
        if (condition) {
            this.LabCondition.node.active = true;
            this.LabCondition.string = `${i18n.tt(Lang.general_equip_condition)}${condition}`;
        } else {
            this.LabCondition.node.active = false;
        }
        const canUp = isWearAll && !condition;
        UtilCocos.SetSpriteGray(this.BtnUp, !canUp, true);
        this.BtnUp.getChildByName('Label').color = UtilColor.Hex2Rgba(canUp ? '#124633' : '#462112');
        // 隐藏一键装备
        this.BtnOnekey.active = !(isWearAll || isMax);
        //
        this.NdLv.active = true;
        this.LabLv.string = UtilNum.ToChinese(curCfg.Level);
        this.refreshStars(curCfg.Star);
    }

    private uptEquip() {
        let isAllLoad: boolean = true;
        const isLoad: boolean[] = [true, true, true, true];
        for (let i = 0; i < 4; i++) {
            if (this.NdEquip[i].childrenCount > 0) {
                const nd = this.NdEquip[i].getChildByName('GEquipItem');
                if (nd) {
                    const data = this._M.getEquipCfgByPos(this._curData, i + 1);
                    nd.getComponent(GEquipItem).setData(data);
                }
            } else {
                isLoad[i] = false;
                isAllLoad = false;
            }
        }
        if (isAllLoad) return;
        ResMgr.I.loadLocal(UI_PATH_ENUM.Module_General_Com_GEquipItem, cc.Prefab, (e, p: cc.Prefab) => {
            for (let i = 0; i < 4; i++) {
                if (isLoad[i]) continue;
                // 再判断下是否已加了
                if (this.NdEquip[i].childrenCount > 0) {
                    const nd = this.NdEquip[i].getChildByName('GEquipItem');
                    if (nd) {
                        const data = this._M.getEquipCfgByPos(this._curData, i + 1);
                        nd.getComponent(GEquipItem).setData(data);
                    }
                } else {
                    // 还没有
                    const child = cc.instantiate(p);
                    this.NdEquip[i].addChild(child);
                    const data = this._M.getEquipCfgByPos(this._curData, i + 1);
                    child.getComponent(GEquipItem).setData(data);
                }
            }
        });
    }

    /**
     * 刷新星数
     * @param star
     * @param isHide
     */
    private refreshStars(star: number, isHide?: boolean): void {
        if (isHide) {
            this.NdStars.active = false;
        } else {
            this.NdStars.active = star > 0;
            if (this.NdStars.active) {
                this.NdStars.children.forEach((node, idx) => {
                    const spr = node.getComponent(SpriteCustomizer);
                    if (idx < star) {
                        spr.curIndex = SpriteCustomizer.Statu.Select;
                    } else {
                        spr.curIndex = SpriteCustomizer.Statu.Normall;
                    }
                });
            }
        }
    }

    private uptContent() {
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
        // 清了选中消耗的武将
        this._chooseCost = [];

        if (this.node.active) {
            EventClient.I.emit(E.General.UptEntity, this._curData, EGeneralUiType.Equip);
        }

        // 箭头
        this.uptArrow();
        // 装备
        this.uptEquip();

        // 消耗
        this.uptCost();
        // 红点
        this._M.checkCurEquipWearRed(this._curData);
        const d = this._M.checkCurEquipStarUpRed(this._curData);

        // 属性
        this.uptAttr(d.condition);
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
        this.uptContent();
    }

    private uptArrow() {
        this.BtnLeft.active = this._index > 0;
        this.BtnRight.active = this._index < this._generalIds.length - 1;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
