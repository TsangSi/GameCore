/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-13 10:48:45
 * @FilePath: \SanGuo2.4\assets\script\game\module\title\TitleModel.ts
 * @Description:
 *
 */
import { E } from '../../const/EventName';
import { EventClient } from '../../../app/base/event/EventClient';
import { Config } from '../../base/config/Config';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { RoleMgr } from '../role/RoleMgr';
import { TitleState } from './TitleConst';
import { BagMgr } from '../bag/BagMgr';
import { ConfigTitleLevelUpIndexer } from '../../base/config/indexer/ConfigTitleLevelUpIndexer';
import { ConfigTitleIndexer } from '../../base/config/indexer/ConfigTitleIndexer';
import { ItemType } from '../../com/item/ItemConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { ViewConst } from '../../const/ViewConst';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ConfigAttributeIndexer } from '../../base/config/indexer/ConfigAttributeIndexer';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { FuncId } from '../../const/FuncConst';
import { ANIM_TYPE } from '../../base/anim/AnimCfg';
import { IGetAwardsInfo } from '../grade/v/GradeGetAwardsWin';

const { ccclass } = cc._decorator;
@ccclass('TitleModel')
export class TitleModel extends BaseModel {
    public clearAll(): void {
        //
    }

    public onRedDotEventListen(): void {
        // 红点检测
        RedDotCheckMgr.I.on(RID.Role.Role.Title, this.checkRed, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Role.Role.Title, this.checkRed, this);
    }

    public registerRedDotListen(): void {
        const listenInfo: IListenInfo = {
            // 协议
            ProtoId: [ProtoId.S2CTitleListPush_ID],
            /** 道具子类型列表 */
            ItemSubType: [ItemType.SKIN_TITLE],
        };
        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: RID.Role.Role.Title, info: listenInfo },
        );
    }

    private _titleList: TitleData[] = [];

    public get titleList(): TitleData[] {
        return this._titleList;
    }

    public setTitleList(data: S2CTitleListPush): void {
        if (!data || data.Tag > 0) return;

        const change: number[] = [];
        // 是否有增删数据
        let isAddOrDel: boolean = false;
        if (this._titleList.length === 0) {
            this._titleList = data.TitleList;
        } else {
            for (let i = 0; i < data.TitleList.length; i++) {
                let find: boolean = false;
                // 修改数据
                for (let j = 0; j < this._titleList.length; j++) {
                    if (data.TitleList[i].TitleId === this._titleList[j].TitleId) {
                        this._titleList[j] = data.TitleList[i];
                        find = true;
                        break;
                    }
                }
                // 新增激活的称号
                if (!find) {
                    this._titleList.push(data.TitleList[i]);
                    isAddOrDel = true;
                    // 获得称号
                    const cfg: Cfg_Title = Config.Get(Config.Type.Cfg_Title).getValueByKey(data.TitleList[i].TitleId);

                    const info: IGetAwardsInfo = {
                        type: 0, // 0默认模板，展示获得物品。 1 三倍领取 2 限时三倍领取
                        showName: cfg.Name, // 道具名字
                        quality: cfg.Quality, // 道具质量
                        titleId: data.TitleList[i].TitleId, // 动画id
                        animScale: 1,
                        animPosY: 100,
                    };
                    WinMgr.I.open(ViewConst.GradeGetAwardsWin, info);
                }
                change.push(data.TitleList[i].TitleId);
            }
        }
        if (data.DelTitleIds && data.DelTitleIds.length > 0 && this._titleList) {
            // 有删除的称号（过期）
            for (let i = 0; i < data.DelTitleIds.length; i++) {
                this._titleList = this._titleList.filter((v) => v.TitleId !== data.DelTitleIds[i]);
                change.push(data.DelTitleIds[i]);
            }
            isAddOrDel = true;
        }
        this.checkRed();

        EventClient.I.emit(E.Title.UptTitle, isAddOrDel, change);
    }

    /** 检查称号系统是否有红点, 称号数据发生变化 或 道具数据发生变化，都要去检查，是一个比较频繁的调用接口 */
    public checkRed(): boolean {
        if (!UtilFunOpen.isOpen(FuncId.Title)) {
            return false;
        }
        let isRed: boolean = false;
        const titleLvIndexer: ConfigTitleLevelUpIndexer = Config.Get(Config.Type.Cfg_TitleLevelUp);
        const titleIndexer: ConfigTitleIndexer = Config.Get(Config.Type.Cfg_Title);

        const cfgs: Cfg_Title[] = titleIndexer.getTitleDatas();
        for (let i = 0, len = cfgs.length; i < len; i++) {
            const t: Cfg_Title = cfgs[i];
            const cfg: Cfg_Title = titleIndexer.getValueByKey(t.Id);

            // 已激活就看是否能升星
            const isActive = this.isActived(t.Id);
            if (isActive[0]) {
                if (cfg.IsLevelUp === 1 && this._titleList && this._titleList[isActive[1]]) {
                    const need = titleLvIndexer.getLevelUpItemNum(this._titleList[isActive[1]].Star);
                    const have = BagMgr.I.getItemNum(t.NeedItem);
                    // 未满并且背包数量>=消耗
                    if (!need[1] && have >= need[0]) {
                        isRed = true;
                        break;
                    }
                }
            } else {
                // 未激活就看是否能激活
                if (BagMgr.I.getItemNum(t.NeedItem) > 0) {
                    isRed = true;
                    break;
                }
            }
        }

        RedDotMgr.I.updateRedDot(RID.Role.Role.Title, isRed);

        return isRed;
    }

    /** 获取称号的状态 */
    public getTitleState(titleId: number): TitleState {
        if (RoleMgr.I.d.Title === titleId) {
            return TitleState.Wear;
        } else {
            for (let i = 0; i < this._titleList.length; i++) {
                if (this._titleList[i].TitleId === titleId) {
                    return TitleState.Active;
                }
            }
        }
        const itemId: number = Config.Get(Config.Type.Cfg_Title).getValueByKey(titleId, 'NeedItem');
        if (BagMgr.I.getItemNum(itemId) > 0) {
            return TitleState.CanActive;
        }
        return TitleState.UnActive;
    }

    /** 是否已激活 */
    public isActived(titleId: number): [boolean, number] {
        if (this._titleList) {
            for (let i = 0; i < this._titleList.length; i++) {
                if (this._titleList[i].TitleId === titleId) {
                    return [true, i];
                }
            }
        }
        return [false, 0];
    }

    /** 是否已穿戴 */
    public isWeared(titleId: number): boolean {
        return titleId === RoleMgr.I.d.Title;
    }

    /** 是否能升星 */
    public canUpStar(titleId: number, star: number, state: TitleState): boolean {
        const cfg: Cfg_Title = Config.Get(Config.Type.Cfg_Title).getValueByKey(titleId);
        if (star == null) {
            if (this._titleList) {
                for (let i = 0; i < this._titleList.length; i++) {
                    if (this._titleList[i].TitleId === titleId) {
                        star = this._titleList[i].Star;
                        break;
                    }
                }
            }
        }
        if (state == null) {
            state = this.getTitleState(titleId);
        }
        if ((state === TitleState.Active || state === TitleState.Wear) && cfg.IsLevelUp === 1) {
            const indexer: ConfigTitleLevelUpIndexer = Config.Get(Config.Type.Cfg_TitleLevelUp);
            const need = indexer.getLevelUpItemNum(star);
            const have = BagMgr.I.getItemNum(cfg.NeedItem);
            return !need[1] && have >= need[0];
        }
        return false;
    }

    /** 计算总战力 */
    public getTotal(): number {
        let fv: number = 0;
        for (let i = 0; i < this._titleList.length; i++) {
            fv += this.calculateFv(this._titleList[i].TitleId, this._titleList[i].Star);
        }
        return fv;
    }

    /** 计算单个称号的战力 */
    public calculateFv(titleId: number, star: number): number {
        const titleCfg: Cfg_Title = Config.Get(Config.Type.Cfg_Title).getValueByKey(titleId);

        const attrIndexer: ConfigAttributeIndexer = Config.Get(Config.Type.Cfg_Attribute);
        const fv = attrIndexer.getFightValueById(titleCfg.AttrId);

        // const attrCfg: Cfg_Attribute = Config.Get(Config.Type.Cfg_Attribute).getValueByKey(titleCfg.AttrId);
        // if (!attrCfg) {
        //     return 0;
        // }
        // const fv = +attrCfg.FightValue;

        if (star <= 0) {
            return fv;
        }

        const indexer: ConfigTitleLevelUpIndexer = Config.Get(Config.Type.Cfg_TitleLevelUp);
        const ratio = indexer.getTitleAttrRatio(star);

        return Math.ceil(fv * ratio);
    }
}
