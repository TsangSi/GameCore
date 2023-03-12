/*
 * @Author: zs
 * @Date: 2022-07-12 16:40:58
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\roleskin\RoleSkinModel.ts
 * @Description:
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ANIM_TYPE } from '../../base/anim/AnimCfg';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { AttrModel } from '../../base/attribute/AttrModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { ConfigRoleSkinIndexer } from '../../base/config/indexer/ConfigRoleSkinIndexer';
import { UtilAttr } from '../../base/utils/UtilAttr';
import UtilItem from '../../base/utils/UtilItem';
import { ItemType } from '../../com/item/ItemConst';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { EActiveStatus, NumberS } from '../../const/GameConst';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import { BagMgr } from '../bag/BagMgr';
import { GradeMgr } from '../grade/GradeMgr';
import { IGetAwardsInfo } from '../grade/v/GradeGetAwardsWin';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleMgr } from '../role/RoleMgr';
import {
    ERoleSkinPageIndex, ESkinPartIndex, ROLESKIN_SOUL_MAX_LEVEL, SUIT_PART_COUNT, SUIT_PART_STAR,
} from './v/RoleSkinConst';

const { ccclass } = cc._decorator;
interface ISuitActiveInfo {
    /** 套装id */
    SuitId: number,
    /** 套装名字 */
    Name: string,
    /** 套装激活数量 */
    Count: number,
    /** 套装最大数量 */
    MaxCount: number
}
interface IAttrData { AttrId2: number, AttrId3: number, AttrId4: number }
@ccclass('RoleSkinModel')
export class RoleSkinModel extends BaseModel {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Role.Role.Skin.Id, this.checkAllRed, this);
        // UI打开的时候，走如下的几个监听
        RedDotCheckMgr.I.on(RID.Role.Role.Skin.SkinPage.List, this.checkSkinPageBaseRed, this);
        RedDotCheckMgr.I.on(RID.Role.Role.Skin.SkinPage.ZhuLing, this.checkZhuLingRed, this);
        RedDotCheckMgr.I.on(RID.Role.Role.Skin.SkinPage.LianShen, this.checkLianShenRed, this);
        // 套装功能
        RedDotCheckMgr.I.on(RID.Role.Role.Skin.SuitPage, this.checkSuitRed, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Role.Role.Skin.Id, this.checkAllRed, this);
        // UI打开的时候，走如下的几个监听
        RedDotCheckMgr.I.off(RID.Role.Role.Skin.SkinPage.List, this.checkSkinPageBaseRed, this);
        RedDotCheckMgr.I.off(RID.Role.Role.Skin.SkinPage.ZhuLing, this.checkZhuLingRed, this);
        RedDotCheckMgr.I.off(RID.Role.Role.Skin.SkinPage.LianShen, this.checkLianShenRed, this);
        // 套装功能
        RedDotCheckMgr.I.off(RID.Role.Role.Skin.SuitPage, this.checkSuitRed, this);
    }

    private _cfgRoleSkin: ConfigRoleSkinIndexer;
    public get cfgRoleSkin(): ConfigRoleSkinIndexer {
        if (!this._cfgRoleSkin) {
            this._cfgRoleSkin = Config.Get(Config.Type.Cfg_RoleSkin);
        }
        return this._cfgRoleSkin;
    }
    private _cfgRoleSkinStar: ConfigIndexer;
    public get cfgRoleSkinStar(): ConfigIndexer {
        if (!this._cfgRoleSkinStar) {
            this._cfgRoleSkinStar = Config.Get(Config.Type.Cfg_RoleSkinStar);
        }
        return this._cfgRoleSkinStar;
    }

    /** 注灵等级 */
    private _soulLevel: number = 0;
    public get soulLevel(): number {
        return this._soulLevel;
    }
    /** 注灵值 */
    private _soulValue: number = 0;
    public get soulValue(): number {
        return this._soulValue;
    }

    public setSoulValue(v: number, lv?: number): void {
        this._soulValue = v;
        if (lv !== undefined && lv !== null) {
            this._soulLevel = lv;
        }
        EventClient.I.emit(E.RoleSkin.ZhuLingChange);
    }

    /** 炼神次数 */
    private _godNum: number = 0;
    public get godNum(): number {
        return this._godNum;
    }
    private set godNum(lv: number) {
        this._godNum = lv;
        EventClient.I.emit(E.RoleSkin.LianShenChange, lv);
    }

    private _skinActiveNum: number = 0;
    /** 皮肤激活数量 */
    public get skinActiveNum(): number {
        return this._skinActiveNum;
    }
    /** 皮肤激活列表 */
    private skinActiveData: { [id: number]: number } = cc.js.createMap(true);
    /** 套装信息 */
    private suitInfoData: { [id: number]: number[] } = cc.js.createMap(true);

    public setSkinInfo(d: S2CRoleSkinInfo): void {
        this._soulLevel = d.SoulLevel;
        this.godNum = d.GodNum;
        this._skinActiveNum = 0;
        this.skinActiveData = cc.js.createMap(true);
        for (let i = 0, n = d.Data.length; i < n; i++) {
            this.skinActiveData[d.Data[i].Id] = d.Data[i].Star;
            this._skinActiveNum++;
        }
        EventClient.I.emit(E.RoleSkin.SkinInfo);
    }

    /**
     * 获取时装星级
     * @param id 时装id
     * @param index 索引ESkinPartIndex
     */
    public getSkinStar(id: number, index: ESkinPartIndex = ESkinPartIndex.Body, type: ERoleSkinPageIndex = ERoleSkinPageIndex.Skin): number {
        if (!index || type === ERoleSkinPageIndex.SpecialSuit || type === ERoleSkinPageIndex.ActitySuit) {
            return this.skinActiveData[id] || 0;
        } else {
            const info = GradeMgr.I.getGradeSkinUpInfo(this.getGradeIdByIndex(index), id);
            return info?.V1 || 0;
        }
    }

    /**
     * 是否满星
     * @param id 时装id
     * @param index 索引ESkinPartIndex
     */
    public isFullStar(id: number, index: ESkinPartIndex = ESkinPartIndex.Body, type: ERoleSkinPageIndex = ERoleSkinPageIndex.Skin): boolean {
        const star = this.getSkinStar(id, index);
        if (!index || type === ERoleSkinPageIndex.SpecialSuit) {
            const maxIndex = this.cfgRoleSkinStar.length - 1;
            const maxStar = this.cfgRoleSkinStar.getValueByIndex(maxIndex, 'MaxLevel');
            return star >= maxStar;
        } else {
            return false;
        }
    }

    /**
     * 获取皮肤是否已激活
     * @param skinId 皮肤id
     * @param isBody 是否身体模型
     * @returns
     */
    public getSkinActive(skinId: number, index: ESkinPartIndex = ESkinPartIndex.Body, type: ERoleSkinPageIndex = ERoleSkinPageIndex.Skin): boolean {
        // if (isBody) {
        return this.getSkinStar(skinId, index, type) > 0;
        // } else {
        //     return UtilNum.RandomInt(0, 1) === 1;
        // }
    }

    /** 获取套装激活的数量 */
    public getSuitActivePartCount(suitId: number): number {
        let num = 0;
        if (this.getSuitActiveByNum(suitId, SUIT_PART_COUNT)) {
            num = SUIT_PART_COUNT;
        } else {
            const skinids = this.cfgRoleSkin.getSkinSuitSkinIds(suitId);
            const indexer = Config.Get(ConfigConst.Cfg_SkinSuit);
            const suitCfg: Cfg_SkinSuit = indexer.getValueByKey(suitId);
            skinids.forEach((id, i) => {
                if (this.getSkinActive(id, i, suitCfg.Type)) {
                    num++;
                }
            });
        }
        return num;
    }

    /** 根据某个皮肤id获取该套装激活信息 */
    public getSuitActiveInfo(skinId: number): ISuitActiveInfo | undefined {
        const suitId: number = this.cfgRoleSkin.getSuitIdBySkinId(skinId);
        if (suitId) {
            const data: ISuitActiveInfo = cc.js.createMap(true);
            data.SuitId = suitId;
            data.Name = this.getSuitName(suitId);
            data.MaxCount = SUIT_PART_COUNT;
            data.Count = this.getSuitActivePartCount(suitId);
            return data;
        }
        return undefined;
    }

    /** 根据套装id获取套装名 */
    public getSuitName(suitId: number): string {
        return this.cfgRoleSkin.getSkinSuitValueByKey(suitId, 'Name') || '';
    }

    /** 根据皮肤id获取率属于的套装id */
    public getSuitId(skinId: number): number {
        return this.cfgRoleSkin.getSuitIdBySkinId(skinId);
    }

    /** 设置皮肤星级 */
    public setSkinStar(id: number, star: number): void {
        this.skinActiveData[id] = star;
        EventClient.I.emit(E.RoleSkin.SkinUpStar, id);
    }

    /** 新增激活的皮肤 */
    public newAddSkin(id: number): void {
        this.skinActiveData[id] = 1;
        this._skinActiveNum++;
        EventClient.I.emit(E.RoleSkin.NewAddSkin, id);

        // eslint-disable-next-line max-len
        const cfgData: { IsAutoWear: number, Name: string, FieldId: number, AnimId: string, NeedItem: number } = this.cfgRoleSkin.getValueByKey(id, {
            AnimId: '', IsAutoWear: 0, Name: '', FieldId: 0, NeedItem: 0,
        });
        if (cfgData && cfgData.IsAutoWear) {
            ControllerMgr.I.RoleSkinController.C2SRoleSkinWearOrRemove(id);
        }

        const itemIcon = UtilItem.NewItemModel(cfgData.NeedItem);
        const resType = this.getResType(itemIcon.cfg.SubType);

        const data: IGetAwardsInfo = {
            type: 0, // 0默认模板，展示获得物品。 1 三倍领取 2 限时三倍领取
            showName: cfgData.Name, // 道具名字
            quality: cfgData.FieldId, // 道具质量
            animId: ModelMgr.I.RoleSkinModel.getResIdByAnimId(cfgData.AnimId), // 动画id
            animType: resType, // 需要根据部位来判断
            animScale: 0.85,
            animPosY: 20,
        };
        WinMgr.I.open(ViewConst.GradeGetAwardsWin, data);
    }
    /** 根据模型id返回能用的模型id */
    public getResIdByAnimId(animId: NumberS): number {
        if (typeof animId === 'string') {
            const resids = animId.split('|');
            return +resids[RoleMgr.I.d.Sex - 1] || +resids[0];
        } else {
            return animId;
        }
    }

    // 存储了 华服的阶数信息
    protected _suitGrade: { [k: number]: number } = cc.js.createMap(true);
    public setSuitInfo(data: Suit[]): void {
        this.suitInfoData = cc.js.createMap(true);
        for (let i = 0, n = data.length; i < n; i++) {
            this.suitInfoData[data[i].Id] = data[i].ActiveNum;
            this._suitGrade[data[i].Id] = data[i].Grade;
        }
        EventClient.I.emit(E.RoleSkin.SuitInfo);
    }

    public getSpecialGrade(suitId: number): number {
        return this._suitGrade[suitId] || 1;
    }

    public setSpecialGrade(suitId: number, lv: number): void {
        this._suitGrade[suitId] = lv;
        EventClient.I.emit(E.RoleSkin.SpecialGradeSuccess, suitId);
    }
    /** 新激活套装数量 */
    public newActiveSuitNum(suitId: number, num: number): void {
        this.suitInfoData[suitId] = this.suitInfoData[suitId] || [];
        if (CC_DEV) {
            if (this.suitInfoData[suitId].indexOf(num) >= 0) {
                console.warn('套装新激活数量存储有重复=', suitId, num);
            }
        }
        this.suitInfoData[suitId].push(num);

        this.FirstSpecialActiveComplete(suitId);
        // 此处做判断是否首次全部激活
        EventClient.I.emit(E.RoleSkin.SuitActive, suitId);
    }

    /** 华服套装的首次完整激活 */
    private FirstSpecialActiveComplete(suitId: number) {
        const suitCfg: Cfg_SkinSuit = this.cfgRoleSkin.getSkinSuitValueByKey(suitId);
        if (suitCfg.Type === ERoleSkinPageIndex.SpecialSuit) {
            const suit2 = this.suitInfoData[suitId].indexOf(2);
            const suit4 = this.suitInfoData[suitId].indexOf(4);
            if (suit2 >= 0 && suit4 >= 0) { // 首次激活
                WinMgr.I.open(ViewConst.RoleSpecialCollectWin, suitCfg);
            }
            return;
        }
        if (suitCfg.Type === ERoleSkinPageIndex.ActitySuit) {
            WinMgr.I.open(ViewConst.RoleSpecialCollectWin, suitCfg);
        }
    }

    /** 获取皮肤名字 */
    public getSkinName(skinId: number, index: ESkinPartIndex = ESkinPartIndex.Body): string {
        if (index === ESkinPartIndex.Body) {
            return this.cfgRoleSkin.getValueByKey(skinId, 'Name');
        } else {
            return Config.Get(Config.Type.Cfg_GradeSkin).getValueByKey(skinId, 'Name');
        }
    }

    public getSuitInfo(suitId: number): number[] {
        return this.suitInfoData[suitId] || [];
    }

    /**
     * 根据套装数量获取是否已激活
     * @param suitId 套装id
     * @param num 套装数量
     */
    public getSuitActiveByNum(suitId: number, num: number): boolean {
        return this.getSuitInfo(suitId).indexOf(num) >= 0;
    }
    /**
     *
     * @param skinId 皮肤id
     * @param index 索引，0角色自己，1坐骑，2翅膀，3光武
     * @returns
     */
    public getSkinAttrInfo(
        skinId: number,
        index: ESkinPartIndex = ESkinPartIndex.Body,
        type: ERoleSkinPageIndex = ERoleSkinPageIndex.Skin,
    ): AttrInfo {
        if (type === ERoleSkinPageIndex.ActitySuit) {
            const attrId: number = this.cfgRoleSkin.getValueByKey(skinId);
            const attrInfo = AttrModel.MakeAttrInfo(attrId);
            return attrInfo;
        }
        if (!index || type === ERoleSkinPageIndex.SpecialSuit) {
            const attrId: number = this.cfgRoleSkin.getValueByKey(skinId, 'AttrId');
            const attrInfo = AttrModel.MakeAttrInfo(attrId);
            const star = this.getSkinStar(skinId, index);
            if (star > 0) {
                const index: number = this.cfgRoleSkinStar.getIntervalIndex(star);
                const cfgStar: Cfg_RoleSkinStar = this.cfgRoleSkinStar.getValueByIndex(index);
                const ratio = (cfgStar.TotalRatio - (cfgStar.MaxLevel - star) * cfgStar.AttrRatio) / 10000;
                attrInfo.mul(ratio || 1);
            }
            return attrInfo;
        } else {
            return GradeMgr.I.getGradeSkinAttrInfo(this.getGradeIdByIndex(index), skinId);
        }
    }

    /**
     * 根据套装id获取所有部件的
     * @param suitId 套装id
     * @param isReal 可选，默认true，是否真实属性，已激活才算真实属性
     * @returns
     */
    public getSuitAllPartAttrInfo(suitId: number, isReal: boolean = true, type: ERoleSkinPageIndex = ERoleSkinPageIndex.SkinSuit): AttrInfo {
        const skins = this.cfgRoleSkin.getSkinSuitSkinIds(suitId);
        const attrInfo = new AttrInfo();
        for (let i = 0, n = skins.length; i < n; i++) {
            if (!isReal || (this.getSkinActive(skins[i], i, type) || this.getSuitActiveByNum(suitId, SUIT_PART_COUNT))) {
                const skinAttrInfo = this.getSkinAttrInfo(skins[i], i, type);
                attrInfo.add(skinAttrInfo);
            }
        }
        return attrInfo;
    }

    /**
     * 根据套装id获取该套装的所有已激活的部位的属性
     * @param suitId 套装id
     * @returns
     */
    public getSuitAttrInfo(suitId: number): AttrInfo {
        const type = this.getSuitType(suitId);
        const attrInfo = this.getSuitAllPartAttrInfo(suitId, true, type);
        const multPartAttrInfo = this.getSuitMultPartAttrInfo(suitId);
        attrInfo.add(multPartAttrInfo);
        if (type === ERoleSkinPageIndex.SpecialSuit) {
            const gradeAttr = this.getSuitGradeAttrInfo(suitId);
            attrInfo.add(gradeAttr);
        }
        return attrInfo;
    }

    /** 根据套装id 获取套装的升阶属性 */
    public getSuitGradeAttrInfo(suitid: number): AttrInfo {
        const states = this.getSuitActiveStatus(suitid);
        let st1 = false;
        // for (let k = 0; k < states.length; k++) {
        //     const sta = states[k];
        //     st1 = sta === EActiveStatus.Active && st1;
        // }
        if (states[0] === EActiveStatus.Active && states[2] === EActiveStatus.Active) {
            st1 = true;
        }
        if (!st1) {
            return new AttrInfo();
        }
        const grade = this.getSpecialGrade(suitid);
        // 从升阶表中读取阶数的 属性配置
        const indexer = Config.Get(ConfigConst.Cfg_SpecialSuitUp);

        const cfgSuitUp: Cfg_SpecialSuitUp = indexer.getValueByKey(grade);
        if (!cfgSuitUp) {
            // const maxCfg: Cfg_SpecialSuitUp = indexer.getValue(indexer.length - 1);
            // const maxVal = maxCfg.Level;

            // const minCfg: Cfg_SpecialSuitUp = indexer.getValue(0);
            // const minVal = minCfg.Level;
            // if (grade < minVal) {
            //     const attrInfo = AttrModel.MakeAttrInfo(minCfg.AttrId);
            //     return attrInfo;
            // }
            // if (grade > maxVal) {
            //     const attrInfo = AttrModel.MakeAttrInfo(maxCfg.AttrId);
            //     return attrInfo;
            // }

            return new AttrInfo();
        } else {
            const attrInfo = AttrModel.MakeAttrInfo(cfgSuitUp.AttrId);
            return attrInfo;
        }
    }

    /**
     * 根据套装id获取多部件套装属性
     * @param suitId 套装id
     * @returns
     */
    public getSuitMultPartAttrInfo(suitId: number): AttrInfo {
        const attrInfo = new AttrInfo();
        const activePartNum = this.getSuitActivePartCount(suitId);
        // 激活的部件数量大于起始部件数量
        if (activePartNum >= SUIT_PART_STAR) {
            const attrIds = this.getSuitPartAttrIds(suitId);
            for (let i = 0, n = attrIds.length; i < n; i++) {
                if (attrIds[i] && this.getSuitActiveByNum(suitId, i + SUIT_PART_STAR)) {
                    // 2件套，3件套，4件套属性
                    attrInfo.add({ attrs: UtilAttr.GetAttrBaseListById(attrIds[i]) });
                }
            }
        }
        return attrInfo;
    }

    /** 获取套装部件激活的属性id列表 */
    public getSuitPartAttrIds(suitId: number): number[] {
        const attrData: IAttrData = this.cfgRoleSkin.getSkinSuitValueByKey(suitId, { AttrId2: 0, AttrId3: 0, AttrId4: 0 });
        return [attrData.AttrId2, attrData.AttrId3, attrData.AttrId4];
    }

    /** 根据索引获取进阶功能id */
    private getGradeIdByIndex(index: ESkinPartIndex) {
        switch (index) {
            case ESkinPartIndex.Horse:
                return 101;
            case ESkinPartIndex.Wing:
                return 111;
            case ESkinPartIndex.Weapon:
                return 121;
            default:
                return 0;
        }
    }

    /** 获取注灵所需道具 */
    public getRoleSkinItem(funcId: number): Cfg_RoleSkinItem | null {
        const indexer = Config.Get(ConfigConst.Cfg_RoleSkinItem);
        return indexer.getValueByKey(funcId);
    }

    /** 获取时装注灵表 */
    public getRoleSkinZL(level: number): Cfg_RoleSkinZL | null {
        const indexer = Config.Get(ConfigConst.Cfg_RoleSkinZL);
        return indexer.getValueByKey(level);
    }

    /** 更新炼神结果 */
    public updateGodNumResult(value: number): void {
        this.godNum = value;
    }

    /** 更新注灵结果 */
    public updateSoulResult(level: number, value: number): void {
        this.setSoulValue(value, level);
    }

    /** 获取增加炼神吞噬上限信息列表 */
    public getLianshenUpInfos(): { actives: { Name: string, LianshenUp: number }[], unactives: { Name: string, LianshenUp: number }[] } {
        const indexs = this.cfgRoleSkin.getLianshenUpIndexs();
        const actives: { Name: string, LianshenUp: number }[] = [];
        const unactives: { Name: string, LianshenUp: number }[] = [];
        for (let i = 0, n = indexs.length; i < n; i++) {
            const index = indexs[i];
            const d = this.cfgRoleSkin.getValueByIndex(index, { Id: 0, Name: '', LianshenUp: 0 });
            if (this.getSkinActive(d.Id)) {
                actives.push(d);
            } else {
                unactives.push(d);
            }
        }
        return { actives, unactives };
    }

    /** 获取时装相关道具表 */
    public getCfgLS(key: number = 1): Cfg_RoleSkinItem {
        return Config.Get(Config.Type.Cfg_RoleSkinItem).getValueByKey(key);
    }

    /** 检测时装所有红点，找到一个true就不继续找 */
    private checkAllRed(rid: number): boolean {
        let isShow = this.checkSkinPageBaseRed() || this.checkZhuLingRed() || this.checkLianShenRed();
        if (!isShow) {
            // 时装套装
            isShow = this.checkSkinSuitRed(ERoleSkinPageIndex.SkinSuit);
            RedDotMgr.I.updateRedDot(RID.Role.Role.Skin.SuitPage, isShow);
        }
        if (!isShow) {
            /** 活动套装 */
            isShow = this.checkSkinSuitRed(ERoleSkinPageIndex.ActitySuit);
            RedDotMgr.I.updateRedDot(RID.Role.Role.Skin.ActivitySuitPage, isShow);
        }
        if (!isShow) {
            /** 异域套装 */
            isShow = this.checkSkinSuitRed(ERoleSkinPageIndex.ExoticSuit);
            RedDotMgr.I.updateRedDot(RID.Role.Role.Skin.ExoticSuitPage, isShow);
        }
        // RedDotMgr.I.updateRedDot(rid, isShow);
        return isShow;
    }

    public checkSuitRed(): void {
        // 时装套装
        let isShow = this.checkSkinSuitRed(ERoleSkinPageIndex.SkinSuit);
        RedDotMgr.I.updateRedDot(RID.Role.Role.Skin.SuitPage, isShow);

        /** 活动套装 */
        isShow = this.checkSkinSuitRed(ERoleSkinPageIndex.ActitySuit);
        RedDotMgr.I.updateRedDot(RID.Role.Role.Skin.ActivitySuitPage, isShow);

        /** 异域套装 */
        isShow = this.checkSkinSuitRed(ERoleSkinPageIndex.ExoticSuit);
        RedDotMgr.I.updateRedDot(RID.Role.Role.Skin.ExoticSuitPage, isShow);
    }

    /** 检测时装页签的皮肤是否能激活和升星  时装不需要传参数应为是单独的处理激活与非激活的 */
    public checkSkinPageBaseRed(): boolean {
        let isShow = false;
        for (let i = 0, n = this.cfgRoleSkin.length; i < n; i++) {
            const cfg = this.cfgRoleSkin.getValueByIndex(i, {
                Id: 0, NeedItem: 0, FieldId: 0, isSuit: 0,
            });
            if (cfg.FieldId && cfg.isSuit === ERoleSkinPageIndex.Skin) {
                const star = this.getSkinStar(cfg.Id);
                const num = BagMgr.I.getItemNum(cfg.NeedItem);
                if (num) {
                    const d: Cfg_RoleSkinStar = this.cfgRoleSkinStar.getIntervalData(star + 1);
                    if (d && num >= d.LevelUpItem) {
                        isShow = true;
                        break;
                    }
                }
            }
        }
        RedDotMgr.I.updateRedDot(RID.Role.Role.Skin.SkinPage.List, isShow);
        return isShow;
    }

    /** 检测注灵红点 */
    public checkZhuLingRed(): boolean {
        let isShow = false;
        if (this.soulLevel < ROLESKIN_SOUL_MAX_LEVEL) {
            const itemId: number = Config.Get(Config.Type.Cfg_RoleSkinItem).getValueByKey(FuncId.Skin, 'ZLItem');
            const nextRoleZlData = this.getRoleSkinZL(this.soulLevel + 1);
            const roleItemCfg = this.getRoleSkinItem(FuncId.Skin);

            /** 下一级所需数量 */
            const nextLevelNeedNum = Math.round((nextRoleZlData.EXP - this.soulValue) / roleItemCfg.ZLExp);
            isShow = BagMgr.I.getItemNum(itemId) >= nextLevelNeedNum;
        }
        RedDotMgr.I.updateRedDot(RID.Role.Role.Skin.SkinPage.ZhuLing, isShow);
        return isShow;
    }

    /** 检测炼神红点 */
    public checkLianShenRed(): boolean {
        let isShow = false;
        const cfgData = Config.Get(Config.Type.Cfg_RoleSkinItem).getValueByKey(FuncId.Skin, { LSItem: 0, LSLimit: 0 });
        let num = cfgData.LSLimit;
        const list = ModelMgr.I.RoleSkinModel.getLianshenUpInfos();
        list.actives.forEach((e) => {
            num += e.LianshenUp;
        });
        if (this.godNum < num) {
            isShow = BagMgr.I.getItemNum(cfgData.LSItem) > 0;
        }
        RedDotMgr.I.updateRedDot(RID.Role.Role.Skin.SkinPage.LianShen, isShow);
        return isShow;
    }

    public checkSkinSuitRed(type: ERoleSkinPageIndex): boolean {
        if (type === ERoleSkinPageIndex.SkinSuit) {
            const datas = this.cfgRoleSkin.getSkinSuitIndexs();
            let suitId: number = 0;
            // 根据品质栏遍历套装
            for (const field in datas) { // 普通时装套装
                for (let i = 0, n = datas[field].length; i < n; i++) {
                    suitId = datas[field][i].Id;
                    const p = this.getSuitActivePartCount(suitId);
                    /** 判断2件套，3件套，4件套 */
                    for (let count = SUIT_PART_STAR; count <= p; count++) {
                        if (!this.getSuitActiveByNum(suitId, count)) {
                            // 未激活
                            return true;
                        }
                    }
                }
            }
        } else { // 活动/荣誉套装
            let suitId: number = 0;
            const datas = this.cfgRoleSkin.getActivitySuitDatas(type);
            for (let i = 0, n = datas.length; i < n; i++) {
                suitId = datas[i].Id;
                const p = this.getSuitActivePartCount(suitId);
                /** 判断2件套，3件套，4件套 */
                for (let count = SUIT_PART_STAR; count <= p; count++) {
                    if (!this.getSuitActiveByNum(suitId, count)) {
                        // 未激活
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public registerRedDotListen(): void {
        const cfgRoleSkinItem = Config.Get(Config.Type.Cfg_RoleSkinItem).getValueByKey(FuncId.Skin, { LSItem: 0, ZLItem: 0 });
        const rid1 = RID.Role.Role.Skin.SkinPage.LianShen;
        const listenInfo1: IListenInfo = {
            // 协议1 :炼神升级协议 协议    2：时装基础信息
            ProtoId: [ProtoId.S2CRoleSkinGodNum_ID, ProtoId.S2CRoleSkinInfo_ID],
            // 关注升级需要消耗的道具
            ItemId: [cfgRoleSkinItem.LSItem],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.RoleSkinWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
            ProxyRid: [RID.Role.Role.Skin.Id],
        };

        const rid2 = RID.Role.Role.Skin.SkinPage.ZhuLing;
        const listenInfo2: IListenInfo = {
            ProtoId: [ProtoId.S2CRoleSkinSoulLevel_ID, ProtoId.S2CRoleSkinInfo_ID],
            ItemId: [cfgRoleSkinItem.ZLItem],

            CheckVid: [ViewConst.RoleSkinWin],
            ProxyRid: [RID.Role.Role.Skin.Id],
        };

        const rid3 = RID.Role.Role.Skin.SkinPage.List;
        const listenInfo3: IListenInfo = {
            // 角色时装数据协议，炼神升级协议，注灵变化协议
            ProtoId: [ProtoId.S2CRoleSkinInfo_ID],
            // 子类型605的道具数量变化
            ItemSubType: [ItemType.SKIN_FASHION],
            CheckVid: [ViewConst.RoleSkinWin],
            ProxyRid: [RID.Role.Role.Skin.Id],
        };

        const rid4 = RID.Role.Role.Skin.SuitPage;
        const listenInfo4: IListenInfo = {
            // 角色时装激活协议，套装数据协议，套装激活多件套协议
            ProtoId: [ProtoId.S2CRoleSkinActive_ID, ProtoId.S2CSuitInfo_ID, ProtoId.S2CSuitActive_ID],
            // 进阶皮肤新激活事件
            EventClient: [E.Grade.SkinActive],
            CheckVid: [ViewConst.RoleSkinWin],
            ProxyRid: [RID.Role.Role.Skin.Id],
        };
        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: rid1, info: listenInfo1 },
            { rid: rid2, info: listenInfo2 },
            { rid: rid3, info: listenInfo3 },
            { rid: rid4, info: listenInfo4 },
        );
    }

    /**
     * 获取进阶皮肤动画ID
     * @param itemId 道具ID
     * @returns Cfg_RoleSkin | null
     */
    public getSkinAnimIdByItemId(itemId: number): Cfg_RoleSkin | null {
        for (let i = 0, n = this.cfgRoleSkin.length; i < n; i++) {
            const cfg: Cfg_RoleSkin = this.cfgRoleSkin.getValueByIndex(i);
            if (cfg.NeedItem === itemId) {
                return cfg;
            }
        }
        return null;
    }

    /**
     * 获取套装的激活状态
     * @param suitId 套装id
     * @param isCheck 是否检查红点
     * @returns
     */
    public getSuitActiveStatus(suitId: number, isCheck: boolean = false): EActiveStatus[] {
        const activeStatus: number[] = [];
        const actives = ModelMgr.I.RoleSkinModel.getSuitInfo(suitId);
        /** 已激活的部件数量 */
        const activePartNum: number = ModelMgr.I.RoleSkinModel.getSuitActivePartCount(suitId);
        for (let i = SUIT_PART_STAR; i <= SUIT_PART_COUNT; i++) {
            if (actives.indexOf(i) >= 0) {
                // 已激活
                if (!isCheck) {
                    activeStatus.push(EActiveStatus.Active);
                }
            } else if (activePartNum >= i) {
                activeStatus.push(EActiveStatus.CanActive);
                if (isCheck) {
                    break;
                }
            } else if (!isCheck) {
                activeStatus.push(EActiveStatus.UnActive);
            }
        }
        return activeStatus;
    }

    /** 获取套装的类型 */
    public getSuitType(suitId: number): number {
        const indexer = Config.Get(ConfigConst.Cfg_SkinSuit);
        const cfg: Cfg_SkinSuit = indexer.getValueByKey(suitId);
        return cfg ? cfg.Type : 1;
    }

    /** 华服是否已经激活 */
    public getSuitIsActive(suitId: number): boolean {
        const stats = this.getSuitActiveStatus(suitId);
        if (stats[0] === EActiveStatus.Active && stats[2] === EActiveStatus.Active) {
            return true;
        }
        return false;
    }

    public getUpgradeInfo(lv: number): Cfg_SpecialSuitUp {
        const indexer = Config.Get(ConfigConst.Cfg_SpecialSuitUp);
        return indexer.getValueByKey(lv);
    }

    private getResType(subType: number): ANIM_TYPE {
        switch (subType) {
            case ItemType.SKIN_HORSE:
            case ItemType.SKIN_HORSE_SPECIAL:
                return ANIM_TYPE.HORSE;
            case ItemType.SKIN_WING:
            case ItemType.SKIN_WING_SPECIAL:
                return ANIM_TYPE.WING;
            case ItemType.SKIN_WEAPON:
            case ItemType.SKIN_WEAPON_SPECIAL:
                return ANIM_TYPE.WEAPON;
            case ItemType.SKIN_FASHION:
            case ItemType.SKIN_SKIN_SPECIAL:
                return ANIM_TYPE.ROLE;
            case ItemType.GENERAL_TYPE:
            case ItemType.SKIN_GENERAL:
                return ANIM_TYPE.PET;
            default: return '' as ANIM_TYPE;
        }
    }
}
