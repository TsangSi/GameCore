/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-10-31 18:44:51
 * @FilePath: \SanGuo2.4\assets\script\game\module\beaconWar\BeaconWarController.ts
 * @Description: 烽火连城
 *
 */

import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import NetMgr from '../../manager/NetMgr';
import { bossTabDataArr } from '../boss/BossConst';
import ModelMgr from '../../manager/ModelMgr';
import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import { i18n, Lang } from '../../../i18n/i18n';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { Config } from '../../base/config/Config';
import { UtilCurrency } from '../../base/utils/UtilCurrency';
import { UtilString } from '../../../app/base/utils/UtilString';
import UtilItem from '../../base/utils/UtilItem';
import MapCfg from '../../map/MapCfg';

const { ccclass } = cc._decorator;
@ccclass('BeaconWarController')
export default class BeaconWarController extends BaseController {
    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2COpenBossHomeUI_ID, this.onS2COpenBossHomeUI, this);
        EventProto.I.on(ProtoId.S2CEnterBossHome_ID, this.onS2CEnterBossHome, this);
        EventProto.I.on(ProtoId.S2CExitBossHome_ID, this.onS2CExitBossHome, this);
        EventProto.I.on(ProtoId.S2CGetBossHomeRankData_ID, this.onS2CGetBossHomeRankData, this);
        EventProto.I.on(ProtoId.S2CBossHomePVE_ID, this.onS2CBossHomePVE, this);
        EventProto.I.on(ProtoId.S2CBossHomePVP_ID, this.onS2CBossHomePVP, this);
        EventProto.I.on(ProtoId.S2CGetBossHomePlayerPos_ID, this.onS2CGetBossHomePlayerPos, this);
        EventProto.I.on(ProtoId.S2CGetUserShowInfo_ID, this.onS2CGetUserShowInfo, this);

        EventProto.I.on(ProtoId.S2CBossHomeRelive_ID, this.onS2CBossHomeRelive, this);
        EventProto.I.on(ProtoId.S2CBossHomeBuyEnergy_ID, this.onS2CBossHomeBuyEnergy, this);
        EventProto.I.on(ProtoId.S2CBossHomeTreat_ID, this.onS2CBossHomeTreat, this);
        EventProto.I.on(ProtoId.S2CBossHomeBagOneKeyGet_ID, this.onS2CBossHomeBagOneKeyGet, this);
        EventProto.I.on(ProtoId.S2CBossHomeOpenBagUI_ID, this.onS2CBossHomeOpenBagUI, this);
        EventProto.I.on(ProtoId.S2CBossHomeBagNew_ID, this.onS2CBossHomeBagNew, this);
        EventProto.I.on(ProtoId.S2CBossHomeBuyBuff_ID, this.onS2CBossHomeBuyBuff, this);
        EventProto.I.on(ProtoId.S2CBossHomeGetPlayerHpList_ID, this.onS2CBossHomeGetPlayerHpList, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2COpenBossHomeUI_ID, this.onS2COpenBossHomeUI, this);
        EventProto.I.off(ProtoId.S2CEnterBossHome_ID, this.onS2CEnterBossHome, this);
        EventProto.I.off(ProtoId.S2CExitBossHome_ID, this.onS2CExitBossHome, this);
        EventProto.I.off(ProtoId.S2CGetBossHomeRankData_ID, this.onS2CGetBossHomeRankData, this);
        EventProto.I.off(ProtoId.S2CBossHomePVE_ID, this.onS2CBossHomePVE, this);
        EventProto.I.off(ProtoId.S2CBossHomePVP_ID, this.onS2CBossHomePVP, this);
        EventProto.I.off(ProtoId.S2CGetBossHomePlayerPos_ID, this.onS2CGetBossHomePlayerPos, this);
        EventProto.I.off(ProtoId.S2CGetUserShowInfo_ID, this.onS2CGetUserShowInfo, this);

        EventProto.I.off(ProtoId.S2CBossHomeRelive_ID, this.onS2CBossHomeRelive, this);
        EventProto.I.off(ProtoId.S2CBossHomeBuyEnergy_ID, this.onS2CBossHomeBuyEnergy, this);
        EventProto.I.off(ProtoId.S2CBossHomeTreat_ID, this.onS2CBossHomeTreat, this);
        EventProto.I.off(ProtoId.S2CBossHomeBagOneKeyGet_ID, this.onS2CBossHomeBagOneKeyGet, this);
        EventProto.I.off(ProtoId.S2CBossHomeOpenBagUI_ID, this.onS2CBossHomeOpenBagUI, this);
        EventProto.I.off(ProtoId.S2CBossHomeBagNew_ID, this.onS2CBossHomeBagNew, this);
        EventProto.I.off(ProtoId.S2CBossHomeBuyBuff_ID, this.onS2CBossHomeBuyBuff, this);
        EventProto.I.off(ProtoId.S2CBossHomeGetPlayerHpList_ID, this.onS2CBossHomeGetPlayerHpList, this);
    }

    public addClientEvent(): void {
        //
    }
    public delClientEvent(): void {
        //
    }
    public clearAll(): void {
        //
    }

    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param args 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab: number = 0, params: any[] = [0], ...args: any[]): boolean {
        const funcId: number = FuncId.BeaconWar;
        if (MapCfg.I.isBeaconWar) {
            MsgToastMgr.Show(i18n.tt(Lang.beaconWar_inMap));
            return true;
        }
        if (UtilFunOpen.isOpen(funcId, true)) {
            WinMgr.I.open(ViewConst.BossWin, tab, params ? params[0] : 0);
            return true;
        }
        return false;
    }

    private onS2COpenBossHomeUI(d: S2COpenBossHomeUI) {
        // console.log('返回 烽火连城 主界面:', d);
        if (d && !d.Tag) {
            ModelMgr.I.BeaconWarModel.setBeaconWarData(d.Data, d.TempBagData);
        }
    }

    private onS2CEnterBossHome(d: S2CEnterBossHome) {
        // console.log('返回 烽火连城 主场景:', d);
        if (d && !d.Tag) {
            ModelMgr.I.BeaconWarModel.setEnterBossHome(d);
        }
    }

    /** 某个城池的某个boss的伤害列表 */
    private onS2CGetBossHomeRankData(d: S2CGetBossHomeRankData) {
        // console.log('返回 某个城池的某个boss的伤害列表:', d);
        if (d && !d.Tag) {
            ModelMgr.I.BeaconWarModel.setBossHomeRankData(d);
        }
    }

    /** 返回 烽火连城PVE */
    private onS2CBossHomePVE(d: S2CBossHomePVE) {
        // console.log('返回 烽火连城PVE:', d);
    }

    /** 返回 烽火连城PVP 内容空的 */
    private onS2CBossHomePVP(d: S2CBossHomePVP) {
        // console.log('返回 烽火连城PVP:', d);
        if (d && !d.Tag) {
            //
        }
    }

    /** 获取目标玩家坐标返回 */
    private onS2CGetBossHomePlayerPos(d: S2CGetBossHomePlayerPos) {
        // console.log('返回 获取目标玩家坐标返回:', d);
        if (d && !d.Tag) {
            EventClient.I.emit(E.BeaconWar.MoveToPlayerPos, d);
        }
    }

    /** 获取目标玩家信息返回 */
    private onS2CGetUserShowInfo(d: S2CGetUserShowInfo) {
        // console.log('返回 获取目标玩家信息返回:', d);
        if (d && !d.Tag) {
            ModelMgr.I.BeaconWarModel.setPlayerInfo(d.UserShowInfo);
        }
    }

    /** 复活,返回的内容是空的，在人物属性变化里刷新 */
    private onS2CBossHomeRelive(d: S2CBossHomeRelive) {
        // console.log('返回 复活:', d);
        if (d && !d.Tag) {
            const cost: string = Config.Get(Config.Type.Cfg_Boss_Config).getValueByKey('BeaconWarRevivalCost', 'Value');
            const costList = cost.split(':');
            const name = UtilCurrency.getNameByType(+costList[0]);
            const num = costList[1];
            const str = UtilString.FormatArray(
                i18n.tt(Lang.beaconWar_relive_cost),
                [num, name],
            );
            MsgToastMgr.Show(str);
        }
    }

    /** 返回 购买体力 在人物属性变化里刷新 */
    private onS2CBossHomeBuyEnergy(d: S2CBossHomeBuyEnergy) {
        // console.log('返回 购买体力:', d);
        if (!d.Tag) {
            MsgToastMgr.Show(`${i18n.tt(Lang.beaconWar_get_energy)}${d.Add}`);
        }
    }

    /** 返回治疗 返回的内容是空的, 在人物属性变化里刷新 */
    private onS2CBossHomeTreat(d: S2CBossHomeTreat) {
        // console.log('返回 治疗:', d);
        ModelMgr.I.BeaconWarModel.isAutoTreat = false;
        EventClient.I.emit(E.BeaconWar.UptTreat, true);
    }

    /** 一键领取包裹返回 */
    private onS2CBossHomeBagOneKeyGet(d: S2CBossHomeBagOneKeyGet) {
        // console.log('一键包裹返回');
        if (d && !d.Tag) {
            // this.reqOpenPackageUI();
        }
    }

    /** 请求包裹数据返回 */
    private onS2CBossHomeOpenBagUI(d: S2CBossHomeOpenBagUI) {
        // console.log('包裹返回');
        if (d && !d.Tag) {
            ModelMgr.I.BeaconWarModel.uptPackage(d.TempBagData);
        }
    }

    /** 实时的奖励 */
    private onS2CBossHomeBagNew(d: S2CBossHomeBagNew) {
        // console.log('实时的奖励');
        if (d && !d.Tag) {
            EventClient.I.emit(E.BeaconWar.UptAward, d.TempBagData);
        }
    }

    /** 请求鼓舞数据返回 */
    private onS2CBossHomeBuyBuff(d: S2CBossHomeBuyBuff) {
        // console.log('鼓舞返回');
        if (d && !d.Tag) {
            ModelMgr.I.BeaconWarModel.uptInspire(d);
        }
    }

    /** 请求队伍详情返回 */
    private onS2CBossHomeGetPlayerHpList(d: S2CBossHomeGetPlayerHpList) {
        // console.log('请求队伍详情返回');
        if (d && !d.Tag) {
            ModelMgr.I.BeaconWarModel.uptTreats(d);
        }
    }

    private onS2CExitBossHome(d: S2CExitBossHome) {
        // console.log('返回 退出烽火连城:', d);
    }

    /** 请求主界面 */
    public reqOpenBossHomeUI(): void {
        // console.log('请求打开烽火连城 主界面:');
        NetMgr.I.sendMessage(ProtoId.C2SOpenBossHomeUI_ID, {});
    }

    /** 请求包裹背包数据 */
    public reqOpenPackageUI(): void {
        // console.log('请求包裹背包数据:');
        NetMgr.I.sendMessage(ProtoId.C2SBossHomeOpenBagUI_ID, {});
    }

    /** 进入场景 */
    public reqEnterBossHome(BossHomeId: number): void {
        // console.log('请求进入烽火连城 场景:', BossHomeId);
        NetMgr.I.sendMessage(ProtoId.C2SEnterBossHome_ID, { BossHomeId });
    }

    /** 玩家伤害排行榜 */
    public reqBossHomeRank(BossHomeId: number, BossId: number): void {
        // console.log('请求烽火连城 玩家伤害排行榜:', BossHomeId, BossId);
        NetMgr.I.sendMessage(ProtoId.C2SGetBossHomeRankData_ID, { BossHomeId, BossId });
    }

    /** 玩家信息 */
    public reqUserShowInfo(UserIdList: number[]): void {
        // console.log('请求烽火连城 玩家信息:', UserIdList);
        NetMgr.I.sendMessage(ProtoId.C2SGetUserShowInfo_ID, { UserIdList });
    }

    /** 烽火连城pve（打怪） */
    public reqBossHomePVE(BossHomeId: number, BossId: number): void {
        // console.log('请求 烽火连城pve（打怪）:', BossHomeId, BossId);
        NetMgr.I.sendMessage(ProtoId.C2SBossHomePVE_ID, { BossHomeId, BossId });
        ModelMgr.I.BeaconWarModel.reqPve = true;
    }

    /** 烽火连城pvp（打其它玩家） */
    public reqBossHomePVP(BossHomeId: number, UserId: number): void {
        // console.log('请求 烽火连城pvp（打其它玩家）:', BossHomeId, UserId);
        NetMgr.I.sendMessage(ProtoId.C2SBossHomePVP_ID, { BossHomeId, UserId });
        ModelMgr.I.BeaconWarModel.reqPvp = true;
    }

    /** 获取目标玩家坐标  */
    public reqGetBossHomePlayerPos(BossHomeId: number, UserId: number): void {
        // console.log('请求 获取目标玩家坐标:', BossHomeId, UserId);
        NetMgr.I.sendMessage(ProtoId.C2SGetBossHomePlayerPos_ID, { BossHomeId, UserId });
    }

    /** 请求复活 */
    public reqBossHomeRelive(): void {
        // console.log('请求 请求复活:');
        NetMgr.I.sendMessage(ProtoId.C2SBossHomeRelive_ID, {});
    }

    /** 购买体力 */
    public reqBossHomeBuyEnergy(): void {
        const AutoBuy = ModelMgr.I.BeaconWarModel.isHaveEnergyId() ? 0 : 1;
        // console.log('请求 购买体力:', AutoBuy);
        NetMgr.I.sendMessage(ProtoId.C2SBossHomeBuyEnergy_ID, { AutoBuy });
    }

    /** 请求治疗 */
    public reqBossHomeTreat(): void {
        // console.log('请求 治疗:');
        NetMgr.I.sendMessage(ProtoId.C2SBossHomeTreat_ID, {});
    }

    /** 请求玩家队伍详情 */
    public reqPlayerHpLists(BossHomeId: number, UserId: number): void {
        // console.log('请求 玩家队伍详情:');
        NetMgr.I.sendMessage(ProtoId.C2SBossHomeGetPlayerHpList_ID, { BossHomeId, UserId });
    }

    /** 一键领取包裹 */
    public reqBagOneKeyGet(): void {
        // console.log('请求 一键领取包裹:');
        NetMgr.I.sendMessage(ProtoId.C2SBossHomeBagOneKeyGet_ID, {});
    }

    /** 购买鼓舞BUFF */
    public reqBossHomeBuyBuff(): void {
        // console.log('请求 购买鼓舞:');
        NetMgr.I.sendMessage(ProtoId.C2SBossHomeBuyBuff_ID, {});
    }

    /** 退出烽火连城 */
    public reqExit(): void {
        // console.log('请求 退出烽火连城:');
        NetMgr.I.sendMessage(ProtoId.C2SExitBossHome_ID, {});
    }
}
