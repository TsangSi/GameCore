/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-13 11:00:41
 * @FilePath: \SanGuo2.4\assets\script\game\module\roleSkills\v\RSkilllPage.ts
 * @Description: 角色技能主界面
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { Config } from '../../../base/config/Config';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ItemSkill } from '../../../com/itemskill/ItemSkill';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { RoleMgr } from '../../role/RoleMgr';
import { ItemCurrencyId } from '../../../com/item/ItemConst';
import { RoleAN } from '../../role/RoleAN';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RSkillPage extends WinTabPage {
    // @property(cc.Label)
    // private LabTotal: cc.Label= null;
    // @property(FightValue)
    // private NdFv: FightValue = null;

    @property(ItemSkill)
    private ItemSkill: ItemSkill[] = [];
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabLv: cc.Label = null;
    @property(cc.Label)
    private LabOpen: cc.Label = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Node)
    private BtnOneKey: cc.Node = null;
    @property(cc.RichText)
    private RichAttr: cc.RichText = null;
    @property(cc.RichText)
    private RichDesc: cc.RichText = null;
    @property(cc.Node)
    private NdCost: cc.Node = null;
    @property(DynamicImage)
    private NdCostIcon: DynamicImage = null;
    @property(cc.Label)
    private LabCostNum: cc.Label = null;
    @property(cc.Node)
    private BtnMax: cc.Node = null;

    private _skillids: number[] = [];
    private _select: number = 0;
    private _skillId: number = 0;
    private _curLv: number = 0;

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
        this.initUI();

        const indexer = Config.Get(Config.Type.Cfg_RoleSkill);
        this._skillids = indexer.getKeys();
        // this.NdFv.setOnFvAttrId(EAttrKey.AttrKey_RoleSkill);
    }

    private addE() {
        EventClient.I.on(E.RoleSkill.UptSkill, this.uptUI, this);
        RoleMgr.I.on(this.uptCost, this, RoleAN.N.SkillExp, RoleAN.N.Level);
    }

    private remE() {
        EventClient.I.off(E.RoleSkill.UptSkill, this.uptUI, this);
        RoleMgr.I.off(this.uptCost, this, RoleAN.N.SkillExp, RoleAN.N.Level);
    }

    private clk() {
        for (let i = 0, len = this.ItemSkill.length; i < len; i++) {
            UtilGame.Click(this.ItemSkill[i].node, () => {
                this.onSkill(i);
            }, this);
        }

        UtilGame.Click(this.BtnUp, () => {
            if (ModelMgr.I.RoleSkillModel.canUp(this._skillId, true, true)) {
                ControllerMgr.I.RoleSkillController.reqRoleSkillUp(this._skillId);
            }
        }, this);

        UtilGame.Click(this.BtnOneKey, () => {
            if (ModelMgr.I.RoleSkillModel.canOneKeyUp(true, true)) {
                ControllerMgr.I.RoleSkillController.reqRoleSkillUp(0);
            }
        }, this);
    }

    private onSkill(index: number): void {
        this._select = index;

        for (let i = 0; i < this.ItemSkill.length; i++) {
            const item = this.ItemSkill[i];
            item.setSelected(this._select === i);
        }

        this.uptContent();
    }

    private initUI() {
        const cfgRoleSkill = Config.Get(Config.Type.Cfg_RoleSkill);
        for (let i = 0; i < this.ItemSkill.length; i++) {
            const item = this.ItemSkill[i];
            const cfgRS: Cfg_RoleSkill = cfgRoleSkill.getValueByIndex(i);
            const cfgS: Cfg_SkillDesc = UtilSkillInfo.GetCfg(cfgRS.SkillId);
            const curLv: number = ModelMgr.I.RoleSkillModel.getRoleSkillLv(cfgRS.SkillId);
            const openCondition = `${cfgRS.OpenLevel}${i18n.tt(Lang.rskill_opens)}`;

            item.setData(
                {
                    curSkillLv: curLv, // 当前技能等级
                    openCondition, // 开启条件
                    // 左上角角标，传入则显示，不传不显示
                    leftTopFlag: cfgS.SkillTag === 2 ? `texture/com/font/com_font_dan@ML` : `texture/com/font/com_font_qun@ML`, // 是否显示角标
                    isSelected: i === this._select, // 是否显示选中框
                    sprIconPath: `texture/skill/${cfgS.SkillIconID}`, // 图标路径
                },
            );
            if (i === this._select) {
                this.uptContent();
            }
        }
        // 红点
        this.BtnOneKey.getChildByName('NdRed').active = ModelMgr.I.RoleSkillModel.checkRed();
    }

    /** 刷新当前选中 */
    private uptUI(upList: number[]) {
        this.initUI();

        // 播个升级动画
        for (let i = 0; i < this.ItemSkill.length; i++) {
            const item = this.ItemSkill[i];
            if (upList && upList.indexOf(this._skillids[i]) >= 0) {
                item.showAnim();
            }
        }
    }

    private isMax(curLv: number): boolean {
        const isMax: boolean = RoleMgr.I.isMaxExp();
        if (isMax) {
            // 人物等级已满 + 技能等级也已满
            return curLv >= RoleMgr.I.getLevel();
        }
        return false;
    }

    /** 展示选中的技能信息 */
    private uptContent() {
        const cfgRS: Cfg_RoleSkill = Config.Get(Config.Type.Cfg_RoleSkill).getValueByIndex(this._select);
        const curLv: number = ModelMgr.I.RoleSkillModel.getRoleSkillLv(cfgRS.SkillId);
        const isMax: boolean = this.isMax(curLv);
        const isActive = curLv > 0;

        this._skillId = cfgRS.SkillId;
        this._curLv = curLv;

        this.LabName.string = UtilSkillInfo.GetSkillName(this._skillId);
        this.LabLv.string = curLv === 0 ? '' : `${i18n.tt(Lang.com_dengji)}:${curLv}`;
        this.BtnUp.active = isActive && !isMax;
        this.BtnOneKey.active = isActive && !isMax;
        this.BtnMax.active = isMax;
        this.LabOpen.node.active = !isActive;
        if (!isActive) {
            this.LabOpen.string = `${i18n.tt(Lang.rskill_name)}${cfgRS.OpenLevel}${i18n.tt(Lang.rskill_opens)}`;
        }

        let des: string = '';
        const attr: IAttrBase[] = UtilAttr.GetAttrBaseListById(cfgRS.AttrType);
        const attrValue: number = this.getAttrValue(this._skillId, curLv);
        if (attr && attr[0]) {
            des = `<color=${UtilColor.NorV}>${i18n.tt(Lang.rskill_attr)}：${attr[0].name}</color><color=${UtilColor.GreenV}>+${attrValue}</color>`;
        }
        this.RichAttr.string = des;

        const skillDes = UtilSkillInfo.GetSkillDesc(this._skillId, curLv || 1);
        this.RichDesc.string = `<color=${UtilColor.NorV}>${skillDes}</color>`;

        this.uptCost();
    }

    private uptCost(): void {
        const isMax: boolean = this.isMax(this._curLv);
        if (this._curLv === 0 || isMax) {
            this.NdCost.active = false;
        } else {
            this.NdCost.active = true;

            /** 消耗货币 */
            const costImgUrl: string = UtilCurrency.getIconByCurrencyType(ItemCurrencyId.SKILL_EXP);
            this.NdCostIcon.loadImage(costImgUrl, 1, true);
            const costItemNum: number = this.getCostValue(this._skillId, this._curLv);
            const BagNum: number = RoleMgr.I.getCurrencyById(ItemCurrencyId.SKILL_EXP);
            // 数量
            const color: cc.Color = BagNum >= costItemNum ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
            this.LabCostNum.string = `${UtilNum.Convert(BagNum)}/${UtilNum.Convert(costItemNum)}`;
            this.LabCostNum.node.color = color;
        }
    }

    private getCostValue(skillId: number, cur: number): number {
        let curLv = cur;
        if (curLv < 1) {
            curLv = 1;
        }
        const preLv: number = curLv - 1;
        const cfgRS: Cfg_RoleSkill = Config.Get(Config.Type.Cfg_RoleSkill).getValueByKey(skillId);
        const cost: number = Math.ceil((curLv * preLv / 2) * cfgRS.SkillUpCoeff2 + cfgRS.SkillUpBase + preLv * cfgRS.SkillUpCoeff1);
        return cost;
    }

    private getAttrValue(skillId: number, cur: number): number {
        let curLv = cur;
        if (curLv < 1) {
            curLv = 1;
        }
        const preLv: number = curLv - 1;
        const cfgRS: Cfg_RoleSkill = Config.Get(Config.Type.Cfg_RoleSkill).getValueByKey(skillId);
        const value: number = (curLv * preLv / 2) * cfgRS.AttrCoeff / 10 + cfgRS.AttrBase + preLv * cfgRS.AttrLevel;
        return Math.ceil(value);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
