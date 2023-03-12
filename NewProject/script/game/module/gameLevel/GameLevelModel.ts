/*
 * @Author: myl
 * @Date: 2022-09-14 12:08:09
 * @Description:
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { ConfigLimitConditionIndexer } from '../../base/config/indexer/ConfigLimitConditionIndexer';
import { ConfigStageIndexer } from '../../base/config/indexer/ConfigStageIndexer';
import { E } from '../../const/EventName';
import { RoleMgr } from '../role/RoleMgr';
import { EClientDataKey, GameLevelInfoModel, GameLevelState } from './GameLevelConst';

const { ccclass } = cc._decorator;

@ccclass('GameLevelModel')
export class GameLevelModel extends BaseModel {
    public clearAll(): void {
        //
    }

    public stageChaptersLength(): number {
        const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_StageName);
        return indexer.keysLength;
    }

    /** 获取用户当前关卡章节信息 */
    public userPassingLevInfo(): { chapter: number, level: number } {
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        return indexer.getChapterInfo();
    }

    public getChapterMsg(lv: number): { chapter: number, level: number } {
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        return indexer.getChapterInfo(lv);
    }

    /** 根据关卡 获取到所有关卡的信息关卡的信息
     * lv 章节id
     */
    public GetCurrentStageChapterByLevel(lv: number): GameLevelInfoModel {
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        const indexer1: ConfigIndexer = Config.Get(Config.Type.Cfg_StageName);
        // 用户关卡
        const { chapter, level } = indexer.getChapterInfo(RoleMgr.I.d.Stage);
        // 根据 获取到当前章节信息
        const infoName: Cfg_StageName = indexer1.getValueByKey(lv);
        // 场景信息
        const chapterInfo: Cfg_Stage = indexer.getStageConfByLv();
        let state = GameLevelState.unpass;
        if (lv < chapter) { // 区域
            state = GameLevelState.passed;
        } else if (lv === chapter) {
            state = GameLevelState.passing;
        } else {
            state = GameLevelState.unpass;
        }
        return { nameInfo: infoName, infoChapter: chapterInfo, state };
    }

    /** 获取到用户当前正在通过的详细信息 */
    public getUserLevel(): { name: string, chapter: number, level: number } {
        const { chapter, level } = this.userPassingLevInfo();
        const indexer1: ConfigIndexer = Config.Get(Config.Type.Cfg_StageName);
        const infoName: Cfg_StageName = indexer1.getValueByKey(chapter);
        return { name: infoName.Name, chapter, level };
    }

    /** 获取所有关卡的数据信息 */
    public getAllChapterData(): GameLevelInfoModel[] {
        const data: GameLevelInfoModel[] = [];
        const len = this.stageChaptersLength();
        for (let i = 1; i <= len; i++) {
            data.push(this.GetCurrentStageChapterByLevel(i));
        }
        return data;
    }

    /** 获取关卡的迷雾信息 即 区域id */
    public getFoxInfo(): number {
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        // 获取到场景配置信息
        const { chapter, level } = indexer.getChapterInfo();
        const indexer1: ConfigIndexer = Config.Get(Config.Type.Cfg_StageName);
        const stageNameConf: Cfg_StageName = indexer1.getValueByKey(chapter);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, dot-notation
        return stageNameConf.AreaId;
    }

    /** 获取当前最新的章节 */
    public getStageInfo(): number {
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        // 获取到场景配置信息
        const conf: Cfg_Stage = indexer.getStageConfByLv();
        return conf.MapId;
    }

    /** 获取关卡推荐战力 */
    public getNominateFv(dta: Cfg_Stage): string {
        const bossLevel = dta.MonsterLevel;
        const bossAttr = dta.AttrId_Boss;
        const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_Attr_Monster);
        const attr: Cfg_Attr_Monster = indexer.getValueByKey(bossAttr, bossLevel);
        const fv = parseInt(attr.FightValue) * (1 + RoleMgr.I.d.Stage * dta.Level_3 / 10000);
        return UtilNum.ConvertFightValue(Math.ceil(fv));
    }

    /** *************自动战斗相关**************** */
    /** 历史关卡 */
    public hisLv: number = 0;
    /** 历史章节 */
    public hisStage: number = 0;
    /** 历史区域 */
    public hisArena: number = 0;
    /** 历史地图标记 */
    public hisMap: number = 0;

    public storeHistoryData(): void {
        // 存储战斗之前的历史数据
        this.hisArena = this.getFoxInfo();
        const chap = this.getChapterInfo();
        this.hisStage = chap.chapter;
        this.hisLv = chap.level;
        this.hisMap = this.GetCurrentStageChapterByLevel(this.hisStage).nameInfo.MapSort;
    }

    private getChapterInfo() {
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        // 获取到场景配置信息
        return indexer.getChapterInfo(RoleMgr.I.d.Stage);
    }

    /** 当前这场关卡战斗是否有赢 */
    public curIsWin: boolean = false;

    private _autoFight: boolean;

    public set autoFight(v: boolean) {
        this._autoFight = v;
        EventClient.I.emit(E.GameLevel.AutoFight);
    }

    public get autoFight(): boolean {
        return this._autoFight;
    }

    public canFight(): boolean {
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        // 获取到场景配置信息
        const chapter = indexer.getChapterNum(RoleMgr.I.d.Stage + 1);
        const len = this.stageChaptersLength();
        return chapter <= len;
    }

    /** 判断当前的关卡是否是当前场景的最后一关 读取限制条件表 */
    public lastLevelCondition(): { state: boolean, info: Cfg_LimitCondition, desc: string } {
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        const state = true;
        const info = null;
        // 获取关卡的场景
        const conf = indexer.getStageInfo(RoleMgr.I.d.Stage);
        if (conf.MaxStageNum === RoleMgr.I.d.Stage) {
            if (!conf.LastCondition || conf.LastCondition <= 0) {
                return { state, info, desc: '' };
            }
            const indexer1: ConfigLimitConditionIndexer = Config.Get(Config.Type.Cfg_LimitCondition);
            const res = indexer1.getCondition(conf.LastCondition);
            return res;
        } else {
            return { state, info, desc: '' };
        }
    }

    private clientData: { [key: number]: string } = cc.js.createMap(true);

    public setClientData(key: EClientDataKey, value: string): void {
        this.clientData[key] = value;
    }
    public getClientData(key: EClientDataKey): string {
        return this.clientData[key] || '';
    }
}
