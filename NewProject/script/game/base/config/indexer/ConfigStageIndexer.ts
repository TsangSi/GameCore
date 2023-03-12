/*
 * @Author: myl
 * @Date: 2022-09-15 16:51:10
 * @Description:
 */
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../../module/role/RoleMgr';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigStageIndexer')
export class ConfigStageIndexer extends ConfigIndexer {
    private static _i: ConfigStageIndexer = null;
    public static get I(): ConfigStageIndexer {
        if (!this._i) {
            this._i = new ConfigStageIndexer(ConfigConst.Cfg_Stage);
            // this._i._walks();
        }
        return this._i;
    }

    /** 包含所有的关卡数据 */
    private _GameStage: Cfg_Stage[] = [];
    protected walks(tableName: string, data: Cfg_Stage, index: number): void {
        this._GameStage.push(data);
    }

    /** 获取关卡数据 */
    public getGameStage(mapId: number): Cfg_Stage {
        this._walks();
        // 做排序处理 防止混乱
        return this._GameStage[mapId];
    }

    public getMapMax(mapId: number): number {
        return this.getGameStage(mapId)?.MaxStageNum || 0;
    }

    /** 根据用户通关的关卡数量 获取当前所在的场景 index */
    public getStageIndexByLv(): number {
        this._walks();
        const stage = RoleMgr.I.d.Stage;
        return this.getIntervalIndex(stage);
    }

    public getStageInfo(stage: number): Cfg_Stage {
        return this.getValueByIndex(this.getIntervalIndex(stage));
    }

    /** 获取当前关卡的场景 配置 */
    public getStageConfByLv(): Cfg_Stage {
        this._walks();
        return this.getValueByIndex(this.getStageIndexByLv());
    }

    /** 获取用户的 通关章节和关卡 */
    public getChapterInfo(stage?: number): { chapter: number, level: number } {
        this._walks();
        // 用户正在通关的关卡（累计）
        stage = stage || RoleMgr.I.d.Stage;
        // 获得到当前的场景信息
        const stageInfo: Cfg_Stage = this.getValueByIndex(this.getIntervalIndex(stage));
        // 上一个场景的信息
        const lastStageInfo: Cfg_Stage = this.getValueByKey(stageInfo.MapId - 1);
        if (!lastStageInfo) { // 第一章
            return { chapter: 1, level: stage };
        } else {
            // 多余的关卡数 (当前关卡 - 上一章地图关卡最大值 - 1)
            const moreStage = stage - lastStageInfo.MaxStageNum - 1;
            // 当前地图的起始章节 多出的章节
            const minChapter = stageInfo.StartChapter;
            // 计算当前的章节(多出的关卡数/当前场景的小关数 + 当前场景的起始章节)
            let curChapter = minChapter + Math.floor(moreStage / stageInfo.MaxSection);
            // 计算当前关卡
            let level = moreStage % stageInfo.MaxSection + 1;
            if (level < 1) { // 容错处理
                level = 1;
            }
            /** 两个表联动 */
            if (curChapter > ModelMgr.I.GameLevelModel.stageChaptersLength()) {
                curChapter = ModelMgr.I.GameLevelModel.stageChaptersLength();
            }
            return { chapter: curChapter, level };
        }
    }

    public getChapterNum(stage: number): number {
        this._walks();
        stage = stage || RoleMgr.I.d.Stage;
        // 获得到当前的场景信息
        const stageInfo: Cfg_Stage = this.getValueByIndex(this.getIntervalIndex(stage));
        // 上一个场景的信息
        const lastStageInfo: Cfg_Stage = this.getValueByKey(stageInfo.MapId - 1);
        if (!lastStageInfo) { // 第一章
            return 1;
        } else {
            // 多余的关卡数 (当前关卡 - 上一章地图关卡最大值 - 1)
            const moreStage = stage - lastStageInfo.MaxStageNum - 1;
            // 当前地图的起始章节 多出的章节
            const minChapter = stageInfo.StartChapter;
            // 计算当前的章节(多出的关卡数/当前场景的小关数 + 当前场景的起始章节)
            const curChapter = minChapter + Math.floor(moreStage / stageInfo.MaxSection);
            return curChapter;
        }
    }
}
