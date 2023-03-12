/*
 * @Author: zs
 * @Date: 2023-03-06 17:41:26
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { AttrModel } from '../../../base/attribute/AttrModel';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItemList from '../../../base/utils/UtilItemList';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { NdAttrBaseAddition } from '../../../com/attr/NdAttrBaseAddition';
import { FightValue } from '../../../com/fightValue/FightValue';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RID } from '../../reddot/RedDotConst';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { UtilShop } from '../../shop/UtilShop';
import { EMasteryType } from '../AdviserConst';
import AdviserModel from '../AdviserModel';
import { AdviserMasteryItem } from '../com/AdviserMasteryItem';

const { ccclass, property } = cc._decorator;
@ccclass
export class AdviserMasteryPage extends WinTabPage {
    @property(cc.Node)
    private NdMasteryItems: cc.Node = null;
    @property(cc.Node)
    private NodeFightValue: cc.Node = null;
    @property(cc.Node)
    private NdItem: cc.Node = null;
    @property(cc.Node)
    private NdAttr: cc.Node = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelLimit: cc.Label = null;
    @property(cc.Node)
    private NdFull: cc.Node = null;

    private model: AdviserModel = null;
    /** 战力组件类 */
    private scriptFightValue: FightValue = null;
    /** 选中的专精 */
    private selectItemScript: AdviserMasteryItem = null;

    /** 升级消耗道具 */
    private upLevelCost: { id: number, num: number }[] = [];
    private ids: number[] = [];
    protected onLoad(): void {
        super.onLoad();
        this.model = ModelMgr.I.AdviserModel;
        EventClient.I.on(E.Adviser.UpdateMasteryLevel, this.onUpdateMasteryLevel, this);
        RoleMgr.I.on(this.onItemChange, this, RoleAN.N.ItemType_Coin4);
        UtilGame.Click(this.BtnUp, this.onBtnUpClicked, this);

        ResMgr.I.loadLocal(UI_PATH_ENUM.AdviserMasteryItem, cc.Prefab, (e, p: cc.Prefab) => {
            this.NdMasteryItems.children.forEach((child, index) => {
                const node = child.children[0] || cc.instantiate(p);
                const cfg: Cfg_AdviserMastery = this.model.cfgMastery.getValueByIndex(index);
                const s = node.getComponent(AdviserMasteryItem);
                s.setData(index, cfg);
                s.setSelectFunc(this.updateSelect, this);
                if (!this.selectItemScript) {
                    this.updateSelect(s);
                }
                if (!child.children[0]) {
                    child.addChild(node);
                }
                let pos = cc.v2(30, 57);
                if (index === this.NdMasteryItems.childrenCount - 1) {
                    pos = cc.v2(44, 86);
                }
                UtilRedDot.Bind(RID.Forge.Adviser.Mastery.FirstMastery + index, child, pos);
                this.ids[index] = cfg.Id;
            });
        });
        this.updateFightValue();
    }

    /** 更新当前红颜的战力 */
    private updateFightValue() {
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Com_FightValue, this.NodeFightValue, (e, n) => {
            if (n) {
                n.getComponent(FightValue).setOnFvAttrId(510020000);
            }
        });
    }

    /**
     * 更新选中的专精信息
     */
    private updateSelect(itemScript: AdviserMasteryItem) {
        if (this.selectItemScript?.cfg?.Id === itemScript?.cfg?.Id) {
            return;
        }
        if (this.selectItemScript) {
            this.selectItemScript.setSelectActive(false);
        }
        this.selectItemScript = itemScript;

        if (this.selectItemScript) {
            this.selectItemScript.setSelectActive(true);
        }

        const level = this.model.getMasteryLevel(this.selectItemScript.cfg.Id);
        this.updateLevel(level);
    }

    private updateLevel(level: number) {
        this.updateAttrs(level);
        this.updateLimit(level + 1);
    }

    /**
     * 更新显示属性
     * @param level 等级
     */
    private updateAttrs(level: number) {
        const attrInfo = AttrModel.MakeAttrInfo(this.selectItemScript.cfg.AttrId);
        let nextAddAttr: AttrInfo;
        let btnStr = i18n.tt(Lang.com_button_active);
        if (this.model.getMasteryActive(this.selectItemScript.cfg.Id)) {
            const addAttr = AttrModel.MakeAttrInfo(this.selectItemScript.cfg.AttrIdAdd);
            if (level < this.selectItemScript.cfg.MaxLv) {
                nextAddAttr = addAttr.clone();
            }
            addAttr.mul(level - 1);
            attrInfo.add(addAttr);
            btnStr = i18n.tt(Lang.com_up);
        }
        if (this.NdAttr.childrenCount <= 0) {
            ResMgr.I.loadLocal('prefab/com/attr/NdAttrBaseAddition', cc.Prefab, (e, p: cc.Prefab) => {
                this.showLayoutAttr(attrInfo, nextAddAttr, p);
            });
        } else {
            this.showLayoutAttr(attrInfo, nextAddAttr);
        }
        UtilCocos.SetString(this.BtnUp, 'Label', btnStr);

        let str = '';
        if (this.selectItemScript.cfg.MasteryType === EMasteryType.Special) {
            str = i18n.jie;
        } else {
            str = i18n.lv;
        }
        const title = `${this.selectItemScript.cfg.Name}  ${level}${str}`;
        this.LabelName.string = title;
    }

    private limitStr: string = '';

    /**
     * 更新限制条件
     * @param level 等级
     */
    private updateLimit(nextLevel: number) {
        const type = this.selectItemScript.cfg.MasteryType;
        if (nextLevel > this.selectItemScript.cfg.MaxLv) {
            this.BtnUp.active = false;
            this.limitStr = type === EMasteryType.Normall ? i18n.tt(Lang.com_level_max) : i18n.tt(Lang.com_jie_max);
            this.LabelLimit.string = '';
            UtilCocos.SetString(this.NdFull, 'Label', this.limitStr);
            this.NdFull.active = true;
            const cfgCost: Cfg_AdviserMasteryCost = this.model.cfgMasteryCost.getValueByKey(type, nextLevel - 1);
            UtilItemList.ShowItems(this.NdItem, cfgCost?.Cost || '', { option: { needLimit: true } });
            return;
        }
        const cfgCostNext: Cfg_AdviserMasteryCost = this.model.cfgMasteryCost.getValueByKey(type, nextLevel);
        this.BtnUp.active = true;
        this.NdFull.active = false;
        UtilItemList.ShowItems(this.NdItem, cfgCostNext.Cost, { option: { needLimit: true } });
        this.limitStr = this.model.getLimitStr(cfgCostNext.Limit) || '';
        this.LabelLimit.string = this.limitStr;
        this.itemOnOrOff(false);

        this.upLevelCost.length = 0;
        const items = cfgCostNext.Cost.split('|');
        for (let i = 0, n = items.length; i < n; i++) {
            const item = items[i].split(':');
            this.upLevelCost.push({ id: +item[0], num: +item[1] });
        }
        this.itemOnOrOff(true);
        this.updateRed();
    }

    private onItemChange() {
        const type = this.selectItemScript.cfg.MasteryType;
        const level = this.model.getMasteryLevel(this.selectItemScript.cfg.Id);
        const nextLevel = level + 1;
        let cfgCostNext: Cfg_AdviserMasteryCost = this.model.cfgMasteryCost.getValueByKey(type, nextLevel);
        if (!cfgCostNext) {
            cfgCostNext = this.model.cfgMasteryCost.getValueByKey(type, level);
        }
        UtilItemList.ShowItems(this.NdItem, cfgCostNext?.Cost || '', { option: { needLimit: true } });
        this.updateRed();
    }

    private updateRed() {
        let isRed = !this.limitStr;
        if (isRed) {
            for (let i = 0, n = this.upLevelCost.length; i < n; i++) {
                if (BagMgr.I.getItemNum(this.upLevelCost[i].id) < this.upLevelCost[i].num) {
                    isRed = false;
                    break;
                }
            }
        }
        UtilRedDot.UpdateRed(this.BtnUp, isRed, cc.v2(78, 16));
    }

    private itemOnOrOff(isOn: boolean) {
        for (let i = 0, n = this.upLevelCost.length; i < n; i++) {
            const item = this.upLevelCost[i];
            if (item) {
                if (isOn) {
                    EventClient.I.on(`${E.Bag.ItemChangeOfId}${item.id}`, this.onItemChange, this);
                } else {
                    EventClient.I.off(`${E.Bag.ItemChangeOfId}${item.id}`, this.onItemChange, this);
                }
            }
        }
    }

    private showLayoutAttr(attrInfo: AttrInfo, addAttr: AttrInfo, p?: cc.Node | cc.Prefab) {
        UtilCocos.LayoutFill(this.NdAttr, (item, idx) => {
            item.active = true;
            item.getComponent(NdAttrBaseAddition).setAttr(attrInfo.attrs[idx], addAttr?.attrs[idx], { isShowAdd: !!addAttr });
        }, attrInfo.attrs.length, p as cc.Node);
    }

    /** 激活/升级按钮事件 */
    private onBtnUpClicked() {
        if (this.limitStr) {
            let limit: string;
            if (this.model.getMasteryActive(this.selectItemScript.cfg.Id)) {
                limit = i18n.tt(Lang.adviser_mastery_up_limit_level);
            } else {
                limit = i18n.tt(Lang.adviser_mastery_up_limit_active);
            }
            MsgToastMgr.Show(this.limitStr + limit);
            return;
        }
        for (let i = 0, n = this.upLevelCost.length; i < n; i++) {
            const item = this.upLevelCost[i];
            if (!UtilShop.itemIsEnough(item.id, item.num, false)) {
                return;
            }
        }
        ControllerMgr.I.AdviserController.C2SAdviserMasteryLevelUp(this.selectItemScript.cfg.Id);
    }

    private onUpdateMasteryLevel(ids: number[], levels: number[]) {
        ids.forEach((id, levelIndex) => {
            const index = this.ids.indexOf(id);
            this.NdMasteryItems.children[index]?.children[0]?.getComponent(AdviserMasteryItem)?.updateLevel(levels[levelIndex]);
            if (id === this.selectItemScript.cfg.Id) {
                this.updateLevel(levels[levelIndex]);
            }
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.itemOnOrOff(false);
        EventClient.I.off(E.Adviser.UpdateMasteryLevel, this.onUpdateMasteryLevel, this);
        RoleMgr.I.off(this.onItemChange, this, RoleAN.N.ItemType_Coin4);
    }
}
