/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-20 17:22:54
 * @FilePath: \SanGuo2.4\assets\script\game\module\battleResult\BattleResultModel.ts
 * @Description:
 */
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { ISTATE_BATTLE } from '../beaconWar/BeaconWarConst';
import { BattleType, EBattleType } from './BattleResultConst';

const { ccclass, property } = cc._decorator;

@ccclass('BattleResultModel')
export class BattleResultModel extends BaseModel {
    /** 战斗奖励缓存容器 */
    private _BattlePrizeReportMap: Map<string, S2CPrizeReport> = new Map();
    /** 是否显示中 */
    private isShowing: boolean = false;
    public getIsShowing(): boolean {
        return this.isShowing;
    }

    public setIsShowing(b: boolean): void {
        this.isShowing = b;
    }
    public clearAll(): void {
        this._BattlePrizeReportMap.clear();
    }

    /**
     * 保存战斗结算数据
     * @param d 奖励数据
     */
    public saveBattlePrizeReport(d: S2CPrizeReport): void {
        this._BattlePrizeReportMap.set(d.Idx, d);
    }

    /**
     * 获取战斗结算数据
     * @param idx 战斗序号索引，与战报S2CBattlefieldReport数据内Idx字段一一对应。
     * @returns
     */
    public getBattlePrizeReport(idx: string): S2CPrizeReport {
        const d = this._BattlePrizeReportMap.get(idx);
        if (!d) {
            return null;
        }
        this._BattlePrizeReportMap.delete(idx);
        return d;
    }

    /**
     * 结算界面用到的动态加载的图片以及配置表中颗粒数据
     * t: 标题文字
     * b: 背景文字
     * tb:标题背景图片
     * part:当前界面需要显示的颗粒UI
     */
    public getWinImages(data: S2CPrizeReport): { t: string, b: string, tb: string, part: string } {
        // 烽火结算穿插预制体显示

        let t = '';
        let b = '';
        let tb = '';
        /** 获取到配置表的颗粒配置数据 */
        const part = this.getBattleSettleParts(data);
        // data.Type : 1:胜利 2：失败 3：扫荡
        switch (data.Type) {
            case BattleType.Win:
            case BattleType.Sweep:
                // if(data.FBType===family)
                t = 'com_font_shengli@ML';// 标题
                if (data.FBType === EBattleType.Family_TrialCopy || data.FBType === EBattleType.Family_Boss || data.FBType === EBattleType.Family_Chif) {
                    t = 'com_font_zhandoujieshu@ML';// 战斗结束
                }

                b = 'com_img_JS_shenglidiban@9[20_20_0_0]';// 中间内容底板
                tb = 'com_img_JS_shengli';// 标题背景图片光效
                break;
            case BattleType.Fail: {
                let _BeaconBattleState = true;
                if (data.FBType === EBattleType.FHLC_PVE) {
                    _BeaconBattleState = data.IntData[0] && data.IntData[0] === ISTATE_BATTLE.BATTLE_DIE;
                }
                if (data.FBType === EBattleType.WorldBoss_PVE_DAYS || data.FBType === EBattleType.WorldBoss_PVE_WeekDay) {
                    _BeaconBattleState = false;
                }
                // 失败的时候包含了一种特殊情况：战斗结束
                t = _BeaconBattleState ? 'com_font_shibai@ML' : 'com_font_zhandoujieshu@ML';
                b = _BeaconBattleState ? 'com_img_JS_shibaidiban@9[20_20_0_0]' : 'com_img_JS_shenglidiban@9[20_20_0_0]';
                tb = _BeaconBattleState ? 'com_img_JS_shibai' : 'com_img_JS_shengli';
            }
                break;
            default:
                break;
        }

        return {
            t, b, tb, part,
        };
    }

    /** 获取结算界面的颗粒配置  按照配置表的配置 动态加载颗粒UI */
    private getBattleSettleParts(data: S2CPrizeReport): string {
        const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_FightScene);
        const conf: Cfg_FightScene = indexer.getValueByKey(data.FBType);
        let partCfg = '';
        switch (data.Type) {
            case BattleType.Win:
                partCfg = conf.FightReportWin;
                break;
            case BattleType.Fail: { // 失败的特殊情况 显示未战斗结束
                let _BeaconBattleState = true;
                if (data.FBType === EBattleType.FHLC_PVE) {
                    _BeaconBattleState = data.IntData[0] && data.IntData[0] === ISTATE_BATTLE.BATTLE_DIE; // 战斗结束
                }
                if (data.FBType === EBattleType.WorldBoss_PVE_DAYS || data.FBType === EBattleType.WorldBoss_PVE_WeekDay) {
                    _BeaconBattleState = false;
                }
                partCfg = !_BeaconBattleState ? conf.FightReportTimeout : conf.FightReportFail;
            }
                break;
            default:
                partCfg = conf.FightReportWin;
                break;
        }
        return partCfg || '';
    }
}
