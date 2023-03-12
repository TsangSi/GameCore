/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { EventClient } from '../../app/base/event/EventClient';
import { UtilColor } from '../../app/base/utils/UtilColor';
import { UtilString } from '../../app/base/utils/UtilString';
import { ResMgr } from '../../app/core/res/ResMgr';
import { i18n, Lang } from '../../i18n/i18n';
import { Config } from '../base/config/Config';
import GameApp from '../base/GameApp';
import MsgToastMgr from '../base/msgtoast/MsgToastMgr';
import { E } from '../const/EventName';
import { UI_PATH_ENUM } from '../const/UIPath';
import ControllerMgr from '../manager/ControllerMgr';
import ModelMgr from '../manager/ModelMgr';
import MapCfg, { EMapFbInstanceType } from '../map/MapCfg';
import { EBattleType } from '../module/battleResult/BattleResultConst';
import BossHitRank from '../module/boss/v/win/BossHitRank';
import { EFightUIType } from './WarConst';

/*
 * @Author: zs
 * @Date: 2022-12-09 11:29:04
 * @FilePath: \SanGuo2.4-main\assets\script\game\battle\BattleCommon.ts
 * @Description:
 *
 */
export class BattleCommon {
    private static Instance: BattleCommon = null;
    public static get I(): BattleCommon {
        if (this.Instance === null) {
            this.Instance = new BattleCommon();
        }
        return this.Instance;
    }

    /** 显示副本战斗的UI组件/插件 */
    public showBattleCom(data: S2CBattlefieldReport, node: cc.Node): void {
        const fightUIType = Config.Get(Config.Type.Cfg_FightScene).getValueByKey(data.T, 'FightUIType');
        switch (fightUIType) {
            case EFightUIType.WorldBoss_PVE:
            case EFightUIType.WorldBoss_PVP:
                ResMgr.I.showPrefabOnce(UI_PATH_ENUM.BattleWorldBoss, undefined, (e, n) => {
                    n.attr({ shieldValue: ModelMgr.I.WorldBossModel.shieldValue });
                    node.addChild(n);
                    EventClient.I.emit(E.Battle.InitEnd, data);
                });
                break;
            case EFightUIType.MutilBoss_PvP:
                ResMgr.I.showPrefabOnce(UI_PATH_ENUM.BossHitRank, undefined, (e, n) => {
                    console.log('多人boss 血条', data);
                    node.addChild(n);
                    n.getComponent(BossHitRank).setHp();
                    EventClient.I.emit(E.Battle.InitEnd, data);
                });
                break;
            default:
                EventClient.I.emit(E.Battle.InitEnd, data);
                break;
        }
    }

    /**
     * 进入战斗，统一接口
     * @param battleType 副本战斗类型
     * @param param1 扩展参数
     */
    public enter(battleType: EBattleType, param1?: any): boolean {
        if (this.isCanEnter(battleType)) {
            return this._enter(battleType, param1);
        }
        return false;
    }

    /**
     * 是否在战斗中
     * @param isShowTips 是否显示飘字提示
     * @returns
     */
    public isBattleIng(isShowTips: boolean = true): boolean {
        // 当前正在战斗中
        if (GameApp.I.IsBattleIng) {
            if (isShowTips) {
                MsgToastMgr.Show(i18n.tt(Lang.com_battleing));// 正在战斗中
            }
            return true;
        }
        return false;
    }

    /**
     * 判断能否进入战斗
     * @param battleType 副本战斗类型
     * @param isShowTips 是否显示提示
     * @returns
     */
    public isCanEnter(battleType: EBattleType, isShowTips: boolean = true): boolean {
        if (this.isBattleIng(isShowTips)) {
            return false;
        }
        // 有队伍，不能进入非组队战斗
        if (battleType !== EBattleType.TeamFB_PVE && ModelMgr.I.TeamModel.hasTeam()) {
            const str = ModelMgr.I.TeamModel.isCap()
                ? UtilString.FormatArgs(i18n.tt(Lang.team_msgbox_cap_text), UtilColor.NorV)
                : UtilString.FormatArgs(i18n.tt(Lang.team_msgbox_text), UtilColor.NorV);
            ModelMgr.I.MsgBoxModel.ShowBox(str, () => {
                ControllerMgr.I.TeamController.C2STeamDunLeaveOrCancel();
            });
            return false;
        }

        const fbTypes = this.getFbTypeByBattleType(battleType);
        if (fbTypes.indexOf(MapCfg.I.mapData.InstanceType) < 0) {
            if (MapCfg.I.mapData.InstanceType === EMapFbInstanceType.YeWai) {
                // 野外不可进行该战斗
                MsgToastMgr.Show(i18n.tt(Lang.battle_enter_tips1));
            } else {
                // 在副本不可进行野外战斗
                MsgToastMgr.Show(i18n.tt(Lang.battle_enter_tips2));
            }
            return false;
        }

        return true;
    }

    /**
     * 根据战斗类型获取副本类型数组
     * @param battleType 战斗类型
     * @returns
     */
    public getFbTypeByBattleType(battleType: EBattleType): number[] {
        const fbTypes: number[] = [];
        const cfgFight: Cfg_FightScene = Config.Get(Config.Type.Cfg_FightScene).getValueByKey(battleType);
        if (cfgFight?.InstanceType) {
            cfgFight.InstanceType.split('|').forEach((type) => {
                fbTypes.push(+type);
            });
        } else {
            fbTypes.push(EMapFbInstanceType.YeWai);
        }
        return fbTypes;
    }

    private _enter(fbType: EBattleType, param1?: any): boolean {
        switch (fbType) {
            case EBattleType.WorldBoss_PVE_DAYS:
            case EBattleType.WorldBoss_PVE_WeekDay:
                ControllerMgr.I.WorldBossController.C2SChallengeWorldBossPVE();
                return true;
            case EBattleType.WorldBoss_PVP_DAYS:
            case EBattleType.WorldBoss_PVP_WeekDay:
                if (ModelMgr.I.WorldBossModel.isWorldBossOpen()) {
                    ControllerMgr.I.WorldBossController.C2SChallengeWorldBossPVP(param1);
                    return true;
                }
                return false;
            case EBattleType.TeamFB_PVE:
                ControllerMgr.I.TeamController.C2STeamDunStart();
                return false;
            case EBattleType.MaterialFb:
                ControllerMgr.I.MaterialController.challengeFB(param1);
                break;
            case EBattleType.Arena:
                ControllerMgr.I.ArenaController.fightPlayer(param1);
                break;
            case EBattleType.PersonBoss:
                ControllerMgr.I.BossController.reqC2SPersonalFight(param1);
                break;
            case EBattleType.ZhiZunBoss:
                ControllerMgr.I.BossController.reqC2SVipFight(param1);
                break;
            case EBattleType.GameLevelBoss:
                ControllerMgr.I.GameLevelController.challengeGameLevel();
                return true;
            case EBattleType.MultiBoss_PVE:
                ControllerMgr.I.BossController.reqC2SMultiBossFight(param1);
                return true;
            case EBattleType.RankMath:
                ControllerMgr.I.RankMatchController.C2SRankMatchChallenge(param1);
                return true;
            case EBattleType.Escort_PVP: // 押镖复仇
                if (param1[0] === 0) {
                    ControllerMgr.I.EscortController.reqEscortRevenge(param1[1], param1[2]);
                } else if (param1[0] === 1) {
                    ControllerMgr.I.EscortController.reqEscortCarRob(param1[1]);
                }
                break;
            case EBattleType.Family_TrialCopy:// 世家-试炼副本
                ControllerMgr.I.FamilyController.reqC2STrialCopyChallenge(param1);
                return true;
            case EBattleType.Family_Boss:// 世家-boss战
                ControllerMgr.I.FamilyController.reqC2SFamilyPatriChallengeBoss();
                return true;
            case EBattleType.Family_Chif:// 世家-族长战
                ControllerMgr.I.FamilyController.reqC2SFamilyPatriChallengeLeader();
                return true;
            case EBattleType.FHLC_PVE: // 烽火PVE
                ControllerMgr.I.BeaconWarController.reqBossHomePVE(param1[0], param1[1]);
                break;
            case EBattleType.FHLC_PVP: // 烽火PVP
                ControllerMgr.I.BeaconWarController.reqBossHomePVP(param1[0], param1[1]);
                break;
            case EBattleType.FBExploreGem:
                ControllerMgr.I.FBExploreController.C2SExploreFight(param1);
                return true;
            default:
                return false;
        }
        return false;
    }
}
