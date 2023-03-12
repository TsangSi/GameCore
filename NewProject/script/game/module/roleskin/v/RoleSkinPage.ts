/*
 * @Author: zs
 * @Date: 2022-07-12 17:20:42
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\roleskin\v\RoleSkinPage.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { Executor } from '../../../../app/base/executor/Executor';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { Config } from '../../../base/config/Config';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { ConfigRoleSkinIndexer } from '../../../base/config/indexer/ConfigRoleSkinIndexer';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemType } from '../../../com/item/ItemConst';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { EActiveStatus } from '../../../const/GameConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { EOpenType } from '../../grade/v/GradeSoulWin';
import { RID } from '../../reddot/RedDotConst';
import {
    ICfgRoleSkin, SUIT_PART_COUNT, SUIT_PART_STAR,
} from './RoleSkinConst';
import { RoleSkinPageBase } from './RoleSkinPageBase';

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleSkinPage extends RoleSkinPageBase {
    @property(cc.Node)
    private NodeAttrInfo: cc.Node = null;
    /** 注灵 */
    @property(cc.Node)
    private BtnZhuLing: cc.Node = null;
    /** 炼神 */
    @property(cc.Node)
    private BtnLianShen: cc.Node = null;
    /** 套装 */
    @property(cc.Node)
    private BtnSuit: cc.Node = null;
    @property(cc.Label)
    private LabelZL: cc.Label = null;
    @property(cc.Label)
    private LabelLS: cc.Label = null;
    @property(cc.Label)
    private LabelSuitName: cc.Label = null;
    @property(cc.Label)
    private LabelSuitNum: cc.Label = null;

    private readonly RoleSkinAttr = 'RoleSkinAttr';
    /** 角色时装配置表索引器 */
    private cfgRoleSkin: ConfigRoleSkinIndexer;
    private cfgRoleSkinStar: ConfigIndexer;
    protected onLoad(): void {
        super.onLoad();
        this.cfgRoleSkin = Config.Get(Config.Type.Cfg_RoleSkin);
        this.cfgRoleSkinStar = Config.Get(Config.Type.Cfg_RoleSkinStar);

        EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.SKIN_FASHION}`, this.onItemChange, this);
        EventClient.I.on(E.RoleSkin.SkinInfo, this.onSkinInfo, this);
        EventClient.I.on(E.RoleSkin.NewAddSkin, this.onNewAddSkin, this);
        EventClient.I.on(E.RoleSkin.SkinUpStar, this.onSkinUpStar, this);
        EventClient.I.on(E.RoleSkin.ZhuLingChange, this.onZhuLingChange, this);
        EventClient.I.on(E.RoleSkin.SuitActive, this.onUpdateSuitRed, this);
        EventClient.I.on(E.RoleSkin.LianShenChange, this.onLianShenChange, this);

        // ControllerMgr.I.RoleSkinController.C2SRoleSkinInfo();
        UtilGame.Click(this.BtnSuit, this.onClickSuit, this);
        UtilGame.Click(this.BtnLianShen, this.onClickLianShen, this);
        UtilGame.Click(this.BtnZhuLing, this.onClickZhuLing, this);
        UtilRedDot.Bind(RID.Role.Role.Skin.SkinPage.ZhuLing, this.BtnZhuLing, cc.v2(25, 20));
        UtilRedDot.Bind(RID.Role.Role.Skin.SkinPage.LianShen, this.BtnLianShen, cc.v2(25, 20));
        this.setNodeStarActive(true);
        this.updateCommon();
    }

    private redStates: { [field: number]: number[] } = cc.js.createMap(true);
    private onItemChange() {
        const datas = this.datas;
        for (const field in datas) {
            const list = datas[field];
            const states = this.redStates[field] = this.redStates[field] || [];
            states.length = 0;
            for (let i = 0, n = list.length; i < n; i++) {
                if (this.checkSkinRed(list[i].Id, list[i].NeedItem)) {
                    states.push(list[i].Id);
                }
            }
        }
        this.updateRed(this.redStates);
    }
    private checkFieldRed() {
        const datas = this.datas;
        this.redStates = cc.js.createMap(true);
        for (const field in datas) {
            const list = datas[field];
            const states = this.redStates[field] = this.redStates[field] || [];
            states.length = 0;
            for (let i = 0, n = list.length; i < n; i++) {
                if (this.checkSkinRed(list[i].Id, list[i].NeedItem)) {
                    states.push(list[i].Id);
                }
            }
            /** a 激活状态 */
            let a_active: boolean = false;
            /** b 激活状态 */
            let b_active: boolean = false;
            /** a 红点状态/可激活/可升星 */
            let a_red: boolean = false;
            /** b 红点状态/可激活/可升星 */
            let b_red: boolean = false;
            /** a 可激活状态 */
            let a_can_active: boolean = false;
            /** b 可激活状态 */
            let b_can_active: boolean = false;
            list.sort((a, b) => {
                a_active = ModelMgr.I.RoleSkinModel.getSkinActive(a.Id);
                b_active = ModelMgr.I.RoleSkinModel.getSkinActive(b.Id);
                a_red = states.indexOf(a.Id) >= 0;
                b_red = states.indexOf(b.Id) >= 0;
                a_can_active = !a_active && a_red;
                b_can_active = !b_active && b_red;
                if (a_can_active || b_can_active) {
                    // a 可激活 || b 可激活
                    if (a_can_active && b_can_active) {
                        return a.Id - b.Id;
                    } else if (a_can_active) {
                        return -1;
                    } else {
                        return b.Id;
                    }
                } else if (a_red || b_red) {
                    // a 可升星 || b 可升星
                    if (a_red && b_red) {
                        return a.Id - b.Id;
                    } else if (a_red) {
                        return -1;
                    } else {
                        return b.Id;
                    }
                } else if (a_active && b_active) {
                    return a.Id - b.Id;
                } else if (a_active) {
                    return -1;
                } else {
                    return b.Id;
                }
            });
        }
    }

    private checkSkinRed(skinId: number, itemId: number) {
        const star = ModelMgr.I.RoleSkinModel.getSkinStar(skinId);
        const index = this.cfgRoleSkinStar.getIntervalIndex(star);
        const cfgStar: Cfg_RoleSkinStar = this.cfgRoleSkinStar.getValueByIndex(index);

        const maxStar = this.cfgRoleSkinStar.getValueByIndex(this.cfgRoleSkinStar.length - 1, 'MaxLevel');
        if (star < maxStar && BagMgr.I.getItemNum(itemId) >= cfgStar.LevelUpItem) {
            return true;
        }
        return false;
    }

    public refreshPage(winId: number, params: any[]): void {
        if (params) {
            const skinId: number = params[1];
            if (skinId) {
                const field: number = this.cfgRoleSkin.getValueByKey(skinId, 'FieldId');
                this.selectSkin(skinId, field);
            }
        }
    }

    private datas: { [field: number]: Cfg_RoleSkin[] } = cc.js.createMap(true);
    protected updateCommon(): void {
        this.datas = this.cfgRoleSkin.getSkinIndexs();
        this.checkFieldRed();
        this.updateRed(this.redStates);
        this.showFields(this.cfgRoleSkin.getSkinFields(), this.datas, new Executor(this.onSelectSkin, this));
        this.updateBtnLabel();

        this.addPropertyPrefab(this.RoleSkinAttr, UI_PATH_ENUM.RoleSkinAttr, this.NodeAttrInfo);
    }

    /** 注灵点击事件 */
    private onClickZhuLing() {
        WinMgr.I.open(ViewConst.GradeSoulWin, EOpenType.ROLE, FuncId.Skin);
    }
    /** 炼神点击事件 */
    private onClickLianShen() {
        // 301 funid可传可不传
        WinMgr.I.open(ViewConst.GradeGodWin, EOpenType.ROLE);
    }
    /** 套装点击事件 */
    private onClickSuit() {
        const suitId = ModelMgr.I.RoleSkinModel.getSuitId(this.selectSkinId);
        if (suitId) {
            const type: number = this.cfgRoleSkin.getSkinSuitValueByKey(suitId, 'Type');
            ControllerMgr.I.RoleSkinController.linkOpen(type, undefined, suitId);
        }
    }

    /** 更新按钮上的文本 */
    private updateBtnLabel() {
        this.updateBtnLSLabel();
        this.updateBtnZLLabel();
    }

    /** 更新炼神文本 */
    private updateBtnLSLabel() {
        this.LabelLS.string = `${ModelMgr.I.RoleSkinModel.godNum}`;
    }
    /** 更新注灵文本 */
    private updateBtnZLLabel() {
        this.LabelZL.string = UtilString.FormatArgs(i18n.tt(Lang.com_lv_1), ModelMgr.I.RoleSkinModel.soulLevel);
    }

    /** 角色时装数据回来要更新 */
    private onSkinInfo() {
        this.updateNodeItems();
    }

    /** 选中皮肤 */
    private selectSkinId: number;
    private curShowData: ICfgRoleSkin;
    protected onSelectSkin(data: ICfgRoleSkin): void {
        this.selectSkinId = data.Id;
        this.curShowData = data;
        this.updateAttr();
        this.updateSuitNum();
    }

    private updateSuitNum() {
        const suitId = ModelMgr.I.RoleSkinModel.getSuitId(this.selectSkinId);
        if (suitId) {
            const name = ModelMgr.I.RoleSkinModel.getSuitName(suitId);
            const num = ModelMgr.I.RoleSkinModel.getSuitActivePartCount(suitId);
            const color = num >= SUIT_PART_COUNT ? UtilColor.Green() : UtilColor.Hex2Rgba(UtilColor.RedD);
            const str = UtilString.FormatArgs(i18n.tt(Lang.com_number), num, SUIT_PART_COUNT);
            this.LabelSuitName.string = name;
            this.LabelSuitNum.string = str;
            this.LabelSuitNum.node.color = color;
            this.updateSuitRed(suitId, num);
        }
    }

    private onUpdateSuitRed() {
        const num = ModelMgr.I.RoleSkinModel.getSuitActivePartCount(this.selectSkinId);
        this.updateSuitRed(this.selectSkinId, num);
    }

    private updateSuitRed(suitId: number, num: number) {
        if (num >= SUIT_PART_STAR) {
            const actives = ModelMgr.I.RoleSkinModel.getSuitActiveStatus(suitId);
            for (let i = 0, n = actives.length; i < n; i++) {
                if (actives[i] === EActiveStatus.CanActive) {
                    UtilRedDot.UpdateRed(this.BtnSuit, true, cc.v2(25, 20));
                    return;
                }
            }
        }
        UtilRedDot.UpdateRed(this.BtnSuit, false);
    }

    /** 更新属性 */
    private updateAttr() {
        const data = this.curShowData;
        const star = ModelMgr.I.RoleSkinModel.getSkinStar(data.Id);
        const nextStar = star + 1;
        const index = this.cfgRoleSkinStar.getIntervalIndex(star);
        const cfgStar: Cfg_RoleSkinStar = this.cfgRoleSkinStar.getValueByIndex(index);
        const attrInfo = AttrModel.MakeAttrInfo(data.AttrId);
        let nextAttrInfo: AttrInfo;
        let addstr;
        if (star > 0) {
            const ratio = (cfgStar.TotalRatio - (cfgStar.MaxLevel - star) * cfgStar.AttrRatio) / 10000;
            attrInfo.mul(ratio || 1);
            const maxIndex = this.cfgRoleSkinStar.length - 1;
            const maxStar = this.cfgRoleSkinStar.getValueByIndex(maxIndex, 'MaxLevel');
            if (star < maxStar) {
                const nextRatio = (cfgStar.TotalRatio - (cfgStar.MaxLevel - nextStar) * cfgStar.AttrRatio) / 10000;
                nextAttrInfo = AttrModel.MakeAttrInfo(data.AttrId);
                nextAttrInfo.mul(nextRatio || 1);
                nextAttrInfo.diff(attrInfo);
            }
        } else {
            const lianshenUp = this.cfgRoleSkin.getValueByKey(data.Id, 'LianshenUp');
            addstr = UtilString.FormatArgs(i18n.tt(Lang.roleskin_page_active_tips), lianshenUp);
        }
        data.Attrs = attrInfo.attrs;
        data.AddAttrs = nextAttrInfo?.attrs;
        this.updatePower(attrInfo.fightValue);
        this.proxyFunc(this.RoleSkinAttr, 'setData', data, addstr);
    }

    /** 新激活皮肤 */
    private onNewAddSkin(skinId: number) {
        this.updateSkinItem(skinId);
        if (skinId === this.selectSkinId) {
            this.updateAttr();
            this.updateSuitNum();
        }
        this.updateSkinRed(skinId);
    }

    /** 皮肤升星 */
    private onSkinUpStar(skinId: number) {
        this.updateSkinItem(skinId);
        if (skinId === this.selectSkinId) {
            this.updateAttr();
        }
        this.updateSkinRed(skinId);
    }

    private updateSkinRed(skinId: number) {
        const cfg = this.cfgRoleSkin.getValueByKey(skinId, { NeedItem: 0, FieldId: 0 });
        const result = this.checkSkinRed(skinId, cfg.NeedItem);
        const skinIds = this.redStates[cfg.FieldId] = this.redStates[cfg.FieldId] || [];
        if (result) {
            if (skinIds.indexOf(skinId) < 0) {
                skinIds.push(skinId);
            }
        } else {
            const index = skinIds.indexOf(skinId);
            if (index >= 0) {
                skinIds.splice(index, 1);
            }
        }
        this.updateRedOne(cfg.FieldId, skinId);
    }

    /** 注灵值变化 */
    private onZhuLingChange() {
        this.updateBtnZLLabel();
    }
    /** 炼神值变化 */
    private onLianShenChange() {
        this.updateBtnLSLabel();
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.RoleSkin.SkinInfo, this.onSkinInfo, this);
        EventClient.I.off(E.RoleSkin.NewAddSkin, this.onNewAddSkin, this);
        EventClient.I.off(E.RoleSkin.SkinUpStar, this.onSkinUpStar, this);
        EventClient.I.off(E.RoleSkin.ZhuLingChange, this.onZhuLingChange, this);
        EventClient.I.off(E.RoleSkin.LianShenChange, this.onLianShenChange, this);
    }
}
