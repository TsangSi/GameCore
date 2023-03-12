/*
 * @Author: zs
 * @Date: 2023-01-06 17:17:59
 * @Description:
 *
 */

import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../../base/config/Config';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { BattleCommon } from '../../battle/BattleCommon';
import { ViewConst } from '../../const/ViewConst';
import { EBattleType } from '../battleResult/BattleResultConst';
import { RoleAN } from '../role/RoleAN';
import { RoleMgr } from '../role/RoleMgr';
import { EFBExploreType } from './FBExploreConst';

const { ccclass } = cc._decorator;

@ccclass('FBExploreModel')
export default class FBExploreModel extends BaseModel {
    public clearAll(): void {
        // throw new Error("Method not implemented.");
    }

    private _cfgFBGem: ConfigIndexer = null;
    /** 宝石秘矿 */
    public get cfgFBGem(): ConfigIndexer {
        if (!this._cfgFBGem) {
            this._cfgFBGem = Config.Get(Config.Type.Cfg_FB_ExploreGem);
        }
        return this._cfgFBGem;
    }
    private _cfgFBGemStage: ConfigIndexer = null;
    /** 宝石秘矿 */
    public get cfgFBGemStage(): ConfigIndexer {
        if (!this._cfgFBGemStage) {
            this._cfgFBGemStage = Config.Get(Config.Type.Cfg_FB_ExploreGemStage);
        }
        return this._cfgFBGemStage;
    }

    public getCurStageKeyName(type: number): string {
        switch (type) {
            case EFBExploreType.Gem:
                return RoleAN.N.ExploreGemCurrStage;
            default:
                return '';
        }
    }
    public getMaxStageKeyName(type: number): string {
        switch (type) {
            case EFBExploreType.Gem:
                return RoleAN.N.ExploreGemMaxStage;
            default:
                return '';
        }
    }

    /** 记录是否已重置过 */
    private isReseted: { [type: number]: boolean } = cc.js.createMap(true);
    public setReseted(type: EFBExploreType, isReset: boolean): void {
        this.isReseted[type] = isReset;
    }
    public getReseted(type: EFBExploreType): boolean {
        return this.isReseted[type] || false;
    }
    /**
     * 根据类型获取当前关卡id
     * @param type 类型
     */
    public getCurStageId(type: number): number {
        const keyName = this.getCurStageKeyName(type);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return RoleMgr.I.d[keyName];
    }

    /**
     * 根据类型获取最高通关关卡id
     * @param type 类型
     * @returns
     */
    public getMaxStageId(type: EFBExploreType): number {
        const keyName = this.getMaxStageKeyName(type);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return RoleMgr.I.d[keyName];
    }

    /**
     * 根据类型获取配置表中最大的关卡id
     * @param type 类型
     * @returns
     */
    public getCfgMaxStageId(type: EFBExploreType): number {
        switch (type) {
            case EFBExploreType.Gem: {
                const cfgGem: Cfg_FB_ExploreGem = this.cfgFBGem.getValueByIndex(this.cfgFBGem.length - 1);
                if (cfgGem) {
                    return cfgGem.Id;
                }
            }
                break;
            default:
                break;
        }
        return 600;
    }

    /** 是否已通关 */
    public isTongGuan(type: EFBExploreType): boolean {
        return this.getCurStageId(type) >= this.getCfgMaxStageId(type);
    }

    /** 根据id获取配置 */
    public getCfg(type: EFBExploreType, id?: number): Cfg_FB_ExploreGem {
        id = id || this.getCurStageId(type);
        switch (type) {
            case EFBExploreType.Gem:
                return this.cfgFBGem.getIntervalData(id);
            default:
                return undefined;
        }
    }

    /** 根据类型获取对应的功能界面 */
    public getFuncWinId(type: EFBExploreType): ViewConst {
        switch (type) {
            case EFBExploreType.Gem:
                MsgToastMgr.Show('显示宝石界面');
                return 0;
            default:
                return 0;
        }
    }

    /** 战斗前记录的关卡id */
    private preBattleStageId: number = 0;
    public savePreBattleStageId(type: EFBExploreType): void {
        const id = this.getCurStageId(type);
        this.preBattleStageId = id + 1;
    }

    public getPreBattleStageId(type: number): number {
        return this.preBattleStageId || this.getCurStageId(type) + 1;
    }

    /** 清除战斗前记录的关卡id */
    public clearPreBattleStageId(): void {
        this.preBattleStageId = 0;
    }

    /**
     * 根据探险类型获取战斗类型
     * @param type 探险类型
     * @returns
     */
    public getBattleType(type: EFBExploreType): EBattleType {
        switch (type) {
            case EFBExploreType.Gem:
                return EBattleType.FBExploreGem;
            default:
                break;
        }
        return undefined;
    }

    /**
     * 进入战斗
     * @param type 探险类型
     */
    public enterFight(type: EFBExploreType): void {
        const battleType: EBattleType = this.getBattleType(type);
        BattleCommon.I.enter(battleType, type);
    }

    // /**
    //  * 该关卡是否通关
    //  * @param type 类型
    //  * @param id id
    //  */
    // public isTongGuanByOne(type: number, id: number): boolean {
    //     return this.getCurStageId(type) >= id;
    // }
    // /**
    //  * 获取某个探险某个难度某个阶段下的关卡数组索引
    //  * @param type 类型
    //  * @param level 难度
    //  * @param part 阶段
    //  * @returns
    //  */
    // public getIndexs(type: number, level: number, part: number): number[] {
    //     return this.cfgFBGem.getValueByKey(type, level, part);
    // }
}
