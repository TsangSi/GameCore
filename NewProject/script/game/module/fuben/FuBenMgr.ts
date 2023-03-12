/*
 * @Author: zs
 * @Date: 2022-09-05 10:08:42
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\fuben\FuBenMgr.ts
 * @Description:
 */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilString } from '../../../app/base/utils/UtilString';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import GameApp from '../../base/GameApp';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { BattleMgr } from '../../battle/BattleMgr';
import { IBoxCfg } from '../../com/msgbox/ConfirmBox';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import MapCfg, { EMapFbInstanceType, EMapID, MapType } from '../../map/MapCfg';
import SceneMap from '../../map/SceneMap';
import { RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';

/*
 * @Author: zs
 * @Date: 2022-08-29 18:45:06
 * @FilePath: \SanGuo\assets\script\game\module\fuben\FuBenMgr.ts
 * @Description:
 *
 */
/** 副本id */
type EFbId = EMapID;
export class FuBenMgr {
    private static _i: FuBenMgr;
    public static get I(): FuBenMgr {
        if (!this._i) {
            this._i = new FuBenMgr();
            if (!CC_EDITOR) {
                this._i.init();
            }
        }
        return this._i;
    }
    public do(): void {
        //
    }

    private init() {
        EventProto.I.on(ProtoId.S2CGetWorldLevel_ID, this.onS2CGetWorldLevel, this);

        EventClient.I.on(E.Game.Start, this.onLoginReq, this);
    }
    private onLoginReq() {
        NetMgr.I.sendMessage(ProtoId.C2SGetWorldLevel_ID);
    }

    private static _WorldLevel: number = 0;
    /** 世界等级 */
    public static get WorldLevel(): number {
        return FuBenMgr._WorldLevel;
    }
    private onS2CGetWorldLevel(d: S2CGetWorldLevel) {
        FuBenMgr._WorldLevel = d.WorldLevel;
    }

    // private _fbId: EFbId = 0;
    /** 当前所在的副本id */
    public get fbId(): EFbId {
        return SceneMap.I.mapId;
    }

    /**
     * 进入副本，统一接口
     * @param fbId 副本id
     * @param completeFunc 完成回调,参数：是否已请求协议
     */
    public enter(fbId: EFbId, completeFunc?: (isReqed: boolean) => void): void {
        if (GameApp.I.IsBattleIng) {
            if (completeFunc) {
                completeFunc(false);
            }
            MsgToastMgr.Show(i18n.tt(Lang.com_battleing));
            return;
        }
        if (SceneMap.I.mapId === fbId) {
            if (completeFunc) {
                completeFunc(false);
            }
            return;
        }

        // 有队伍，不能进入非野外场景
        if (ModelMgr.I.TeamModel.hasTeam()) {
            const str = ModelMgr.I.TeamModel.isCap()
                ? UtilString.FormatArgs(i18n.tt(Lang.team_msgbox_cap_text), UtilColor.NorV)
                : UtilString.FormatArgs(i18n.tt(Lang.team_msgbox_text), UtilColor.NorV);
            ModelMgr.I.MsgBoxModel.ShowBox(str, () => {
                ControllerMgr.I.TeamController.C2STeamDunLeaveOrCancel();
                if (completeFunc) {
                    completeFunc(false);
                }
            });
            return;
        }
        const result = this._enter(fbId);
        if (completeFunc) {
            completeFunc(result);
        }
    }

    /**
     * 进入副本统一接口
     * @param fbId 副本id
     * @returns
     */
    private _enter(fbId: EFbId): boolean {
        switch (fbId) {
            case EMapID.WorldBoss:
                if (UtilFunOpen.isOpen(FuncId.WorldBoss, true)) {
                    ControllerMgr.I.WorldBossController.C2SEnterWorldBoss();
                }
                break;
            case EMapID.BeaconWar1:
            case EMapID.BeaconWar2:
            case EMapID.BeaconWar3:
            case EMapID.BeaconWar4:
            case EMapID.BeaconWar5:
            case EMapID.BeaconWar6:
            case EMapID.BeaconWar7:
            case EMapID.BeaconWar8:
            case EMapID.BeaconWar9:
            case EMapID.BeaconWar10:
                break;
            default:
                // SceneMap.I.sendEnterMap(fbId);
                break;
        }
        WinMgr.I.close(ViewConst.MainCity);
        return true;
    }

    public enterResult(b: boolean): void {
        if (b) {
            EventClient.I.emit(E.FuBen.EnterSuccess);
        } else {
            EventClient.I.emit(E.FuBen.EnterFail);
        }
    }

    /**
     * 退出副本
     */
    private exit(): void {
        // SceneMap.I.sendEnterMap(EMapID.YeWai);
        // EventClient.I.emit(E.FuBen.Exit);
    }

    /** 是否在副本地图内 */
    public isInFuBen(): boolean {
        return MapCfg.I.mapData && MapCfg.I.mapData.MapType === MapType.FBType;
    }

    /** 退出当前副本
     * @param needTip 是否需要确认框
     * @param content  确认框里的提示内容(支持富文本)
     * @param cb  退出回调
     * @param ctx  上下文
     */
    public quitFuBen(needTip?: boolean, content?: string, cb?: () => void, ctx?: unknown, conf: IBoxCfg = null): void {
        if (this.isInFuBen()) {
            if (needTip) {
                const tipString = content || `<color=${UtilColor.NorV}>是否确认离开${MapCfg.I.mapData.Name}</c>`;
                ModelMgr.I.MsgBoxModel.ShowBox(tipString, () => {
                    BattleMgr.I.skipCurWar();
                    this.exit();
                    if (cb) {
                        cb.call(ctx);
                    }
                }, conf);
            } else {
                BattleMgr.I.skipCurWar();
                this.exit();
                if (cb) {
                    cb.call(ctx);
                }
            }
        } else {
            cc.warn('不在副本内');
        }
    }

    /** 检测能否进入战斗 */
    public checkCanEnterFight(instanceType: EMapFbInstanceType, shoTips?: boolean): boolean {
        if (instanceType === MapCfg.I.mapData.InstanceType) {
            // 一样的副本类型，运行战斗
            return true;
        } else {
            if (shoTips) {
                MsgToastMgr.Show(i18n.tt(Lang.com_battle_tips));
            }
            return false;
        }
    }
}
