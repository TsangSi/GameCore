/*
 * @Author: myl
 * @Date: 2023-02-22 12:27:29
 * @Description: 界面非功能红点处理
 */

import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { FuncId } from '../../const/FuncConst';
import { FuncDescConst } from '../../const/FuncDescConst';
import ModelMgr from '../../manager/ModelMgr';

export default class RedDotModelMgr {
    private static _i: RedDotModelMgr = null;
    public static get I(): RedDotModelMgr {
        if (!this._i) {
            this._i = new RedDotModelMgr();
        }
        return this._i;
    }

    /** 标记是否添加监听过 */
    private _listenerMap: { [k: number]: boolean } = {};
    /** 红点详细监听是否已经添加过  不能重复添加 */
    private _redInfoListened: number[] = [];

    /**
     * 通过funcId 来获取关联的model  后续新增需要在这个里面添加
     * @param funcId 功能id
     * @returns
     *
     * eg： 进阶功能 多个子功能关联了同一个model 则需要同时返回 一个公共的funcid来做监听的唯一标记
     */
    public getModelByFuncId(funcId: FuncId): { fId: number, mod: BaseModel } {
        const mgr = ModelMgr.I;
        let fid = 0;
        let mod: BaseModel = null;
        switch (funcId) {
            case FuncId.Arena:
                mod = mgr.ArenaModel;
                fid = FuncId.Arena;
                break;
            case FuncId.RankMatch:
                mod = mgr.RankMatchModel;
                fid = FuncId.RankMatch;
                break;
            case FuncId.Beauty:
                fid = FuncId.Beauty;
                mod = mgr.BeautyModel;
                break;
            case FuncId.EquipBuild:
                fid = FuncId.EquipBuild;
                mod = mgr.BuildModel;
                break;
            case FuncId.SilkRoad:
                fid = FuncId.SilkRoad;
                mod = mgr.SilkRoadModel;
                break;
            case FuncId.EquipStrength:
                fid = FuncId.EquipStrength;
                mod = mgr.StrengthModel;
                break;
            case FuncId.GuankaPass:
                fid = FuncId.GuankaPass;
                mod = mgr.GamePassModel;
                break;
            case FuncId.General:
                fid = FuncId.General;
                mod = mgr.GeneralModel;
                break;
            case FuncId.Mail:
                fid = FuncId.Mail;
                mod = mgr.MailModel;
                break;
            case FuncId.MaterialFB:
                fid = FuncId.MaterialFB;
                mod = mgr.MaterialModel;
                break;
            case FuncId.Material:
                fid = FuncId.Material;
                mod = mgr.MergeMatModel;
                break;
            case FuncId.RoleArmyLevel:
                fid = FuncId.RoleArmyLevel;
                mod = mgr.ArmyLevelModel;
                break;
            case FuncId.RoleArmyOfficial:
                fid = FuncId.RoleArmyOfficial;
                mod = mgr.RoleOfficeModel;
                break;
            case FuncId.RoleSkill:
                fid = FuncId.RoleSkill;
                mod = mgr.RoleSkillModel;
                break;
            case FuncId.Skin:
                fid = FuncId.Skin;
                mod = mgr.RoleSkinModel;
                break;
            case FuncId.SkinSpecialSuit:
                fid = FuncId.SkinSpecialSuit;
                mod = mgr.RoleSpecialSuitModel;
                break;
            case FuncId.DiscountShop:
                fid = FuncId.DiscountShop;
                mod = mgr.ShopModel;
                break;
            case FuncId.Team:
                fid = FuncId.Team;
                mod = mgr.TeamModel;
                break;
            case FuncId.Title:
                fid = FuncId.Title;
                mod = mgr.TitleModel;
                break;
            case FuncId.Vip:
                fid = FuncId.Vip;
                mod = mgr.VipModel;
                break;
            case FuncId.WorldBoss:
                fid = FuncId.WorldBoss;
                mod = mgr.WorldBossModel;
                break;
            /** 多funcid情况处理 */
            case FuncId.Head:
            case FuncId.HeadFrame:
            case FuncId.ChatBubble:
                fid = FuncId.Head;
                mod = mgr.HeadModel;
                break;
            case FuncId.Adviser:
            case FuncId.AdviserGrade:
            case FuncId.AdviserMastery:
                fid = FuncId.Adviser;
                mod = mgr.AdviserModel;
                break;
            default:

                break;
        }
        return { fId: fid, mod };
    }

    /**
     * 根据功能id 添加非功能红点计算监听
     * @param funcId 功能id
     */
    public registerRedDot(funcId: number): void {
        const isListened = this._listenerMap[funcId] || false;
        if (!isListened) {
            const { fId, mod } = this.getModelByFuncId(funcId);
            if (mod) {
                // 添加监听
                if (!this._listenerMap[fId]) {
                    mod.onRedDotEventListen();
                    this._listenerMap[fId] = true;
                }
                if (this._redInfoListened.indexOf(fId) === -1) {
                    mod.registerRedDotListen();
                    this._redInfoListened.push(fId);
                } else {
                    console.log('已经发送过过红点添加的事件', funcId);
                }
            }
        } else {
            console.log('已经添加过红点发送的事件的监听', funcId);
        }
    }

    /**
     * 当离开界面时移除非功能红点计算
     * @param funcId
     */
    public unRegisterRedDot(funcId: number): void {
        const { fId, mod } = this.getModelByFuncId(funcId);
        if (mod) {
            mod.offRedDotEventListen();
            this._listenerMap[fId] = false;
        }
    }
}
