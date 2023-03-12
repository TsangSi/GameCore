/*
 * @Author: myl
 * @Date: 2023-01-28 14:47:20
 * @Description:
 */

import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { Config } from '../../../../base/config/Config';
import { ConfigIndexer } from '../../../../base/config/indexer/ConfigIndexer';
import { ConfigStageIndexer } from '../../../../base/config/indexer/ConfigStageIndexer';
import ModelMgr from '../../../../manager/ModelMgr';
import { EFBExploreType } from '../../../fbExplore/FBExploreConst';
import { RoleMgr } from '../../../role/RoleMgr';
import { EBattleType } from '../../BattleResultConst';
import { BattleRewardExBase } from './BattleRewardExBase';

enum IState {
    BELONG_CHANGE_NOT = 0, // 归属未改变
    BELONG_CHANGE = 1// 归属改变
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleTextEx extends BattleRewardExBase {
    // 单纯的文本处理 （居中对齐可换行）
    @property(cc.RichText)
    private LabContent: cc.RichText = null;
    private cfg_level: ConfigStageIndexer = Config.Get<ConfigStageIndexer>(Config.Type.Cfg_Stage);
    public setData(data: S2CPrizeReport): void {
        switch (data.FBType) {
            case EBattleType.GameLevelBoss: {
                const obj = this.cfg_level.getChapterInfo(RoleMgr.I.d.Stage - 1);
                const chapterConfig: ConfigIndexer = Config.Get(Config.Type.Cfg_StageName);
                const nameInfo: Cfg_StageName = chapterConfig.getValueByKey(obj.chapter);
                this.LabContent.string = `${nameInfo.Name} ${i18n.tt(Lang.arena_di)}${obj.chapter}-${obj.level}${i18n.tt(Lang.game_level_guan)}`;
            }
                break;
            case EBattleType.MaterialFb:
                this.LabContent.string = '';
                this.node.destroy();
                break;
            case EBattleType.TeamFB_PVE:
            case EBattleType.TeamFB_PVP: {
                const cfgTBLevel: Cfg_TeamBoss_Level = ModelMgr.I.TeamModel.cfg.getValueByKeyFromLevel(ModelMgr.I.TeamModel.myTeamFbId);
                let level = 100;
                let name = i18n.tt(Lang.general_name);
                const boshu = data.IntData[0];
                if (cfgTBLevel) {
                    level = cfgTBLevel.LevelLimit;
                    const cfgTB: Cfg_TeamBoss = ModelMgr.I.TeamModel.cfg.getValueByKey(cfgTBLevel.FBId);
                    if (cfgTB) {
                        name = cfgTB.Name;
                    }
                }
                this.LabContent.string = UtilString.FormatArgs(i18n.tt(Lang.team_battle_result), name, level, boshu);
                break;
            }
            case EBattleType.FHLC_PVE: {
                const _state = data.IntData[0];
                switch (_state) {
                    case IState.BELONG_CHANGE:
                        this.LabContent.string = i18n.tt(Lang.beaconWar_get_belong);
                        break;
                    case IState.BELONG_CHANGE_NOT:
                        this.LabContent.string = i18n.tt(Lang.beaconWar_get_belong_not);
                        break;
                    default:
                        break;
                }
                break;
            }
            case EBattleType.FBExploreGem: {
                const cfg = ModelMgr.I.FBExploreModel.getCfg(EFBExploreType.Gem, data.IntData[0]);
                const str = UtilString.FormatArgs(i18n.tt(Lang.fbexplore_battle_result_desc), UtilNum.ToChinese(cfg.Part || 1), cfg.Stage);
                this.LabContent.string = str;
                break;
            }
            default:
                break;
        }
    }
}
