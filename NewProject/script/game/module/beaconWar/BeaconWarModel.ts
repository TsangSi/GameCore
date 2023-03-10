/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-10-31 18:58:29
 * @FilePath: \SanGuo\assets\script\game\module\beaconWar\BeaconWarModel.ts
 * @Description:
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { Config } from '../../base/config/Config';
import { ConfigBeaconWarIndexer } from '../../base/config/indexer/ConfigBeaconWarIndexer';
import UtilItem from '../../base/utils/UtilItem';
import ItemModel from '../../com/item/ItemModel';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import ControllerMgr from '../../manager/ControllerMgr';
import { FuBenMgr } from '../fuben/FuBenMgr';
import { BeaconWarCfgKey, EBeaconState } from './BeaconWarConst';
import { RoleInfo } from '../role/RoleInfo';
import SceneMap from '../../map/SceneMap';
import MapCfg, { EMapFbInstanceType } from '../../map/MapCfg';
import MapMgr from '../../map/MapMgr';
import { RoleMgr } from '../role/RoleMgr';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { BagMgr } from '../bag/BagMgr';
import { ConfigShopIndexer } from '../../base/config/indexer/ConfigShopIndexer';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { EMsgBoxModel } from '../../com/msgbox/ConfirmBox';
import { UtilString } from '../../../app/base/utils/UtilString';
import GameApp from '../../base/GameApp';
import { FuncId } from '../../const/FuncConst';
import { ShopChildType } from '../shop/ShopConst';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { BossPageType, WorldBossPageType } from '../boss/BossConst';
import { BattleCommon } from '../../battle/BattleCommon';
import { EBattleType } from '../battleResult/BattleResultConst';
import { IWinAutoPayTips } from '../pay/WinAutoPayTips';
import { WinAutoPayTipsModel, AutoPayKey } from '../pay/WinAutoPayTipsModel';

interface InspireItem {
    buffNum: number,
    endTime: number
}

const { ccclass } = cc._decorator;
@ccclass('BeaconWarModel')
export class BeaconWarModel extends BaseModel {
    /** ?????????????????? */
    private _bossHomeIds: number[] = [];
    private _bossHomeData: { [bossHomeId: number]: BossHomeData } = cc.js.createMap(true);
    /** ????????????????????????id */
    private _curBossHomeId: number = 0;
    /** ??????????????????boss????????? */
    private _curBossId: number = 0;
    /** ???????????? */
    private _bossRankData: BossHomeRankData[] = [];
    /** ?????????????????? */
    private _tempBagData: ItemData[] = [];
    /** ???????????? */
    private _inspireData: InspireItem = null;
    // ??????????????????????????????KEY
    public tipsKey = 'BeaconWarQuickWin';

    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }
    public init(): void {
        //
    }

    /** ???????????????boss?????????????????? */
    public getHighCity(): number {
        const armyLv = RoleMgr.I.getArmyLevel();
        const armyStar = RoleMgr.I.getArmyStar();
        for (let i = 0; i < this._bossHomeIds.length; i++) {
            const cfg: Cfg_BeaconWar = this.CfgBeaconWar.getValueByKey(this._bossHomeIds[i]);
            if (armyLv > cfg.ArmyLevel || (armyLv === cfg.ArmyLevel && armyStar >= cfg.ArmyStar)) {
                return this._bossHomeIds[i];
            }
        }
        return 0;
    }

    /** ?????? */
    private _CfgBeaconWar: ConfigBeaconWarIndexer;
    public get CfgBeaconWar(): ConfigBeaconWarIndexer {
        if (!this._CfgBeaconWar) {
            this._CfgBeaconWar = Config.Get(Config.Type.Cfg_BeaconWar);
        }
        return this._CfgBeaconWar;
    }

    private _cfgMapMonster: ConfigIndexer;
    public get cfgMapMonster(): ConfigIndexer {
        if (!this._cfgMapMonster) {
            this._cfgMapMonster = Config.Get(Config.Type.Cfg_Map_Monster);
        }
        return this._cfgMapMonster;
    }

    private _cfgRefresh: ConfigIndexer;
    public get cfgRefresh(): ConfigIndexer {
        if (!this._cfgRefresh) {
            this._cfgRefresh = Config.Get(Config.Type.Cfg_Refresh);
        }
        return this._cfgRefresh;
    }

    /** ??????bossId?????????????????????????????? */
    public getMonsterRefreshData(bossId: number): Cfg_Refresh {
        const cfgMM: Cfg_Map_Monster = this.cfgMapMonster.getValueByKey(bossId);
        if (cfgMM) {
            const cfgRrefresh: Cfg_Refresh = this.cfgRefresh.getValueByKey(cfgMM.RefreshId);
            return cfgRrefresh;
        }
        return null;
    }
    /** ??????bossId???????????????id */
    public getMonsterId(bossId: number): number {
        const cfgMM: Cfg_Map_Monster = this.cfgMapMonster.getValueByKey(bossId);
        if (cfgMM) {
            const cfgRrefresh: Cfg_Refresh = this.cfgRefresh.getValueByKey(cfgMM.RefreshId);
            if (cfgRrefresh) {
                return +cfgRrefresh.MonsterIds.split('|')[0];
            }
        }
        return 0;
    }
    /** ??????bossId????????????????????? */
    public getMonsterLv(bossId: number): number {
        const cfgMM: Cfg_Map_Monster = this.cfgMapMonster.getValueByKey(bossId);
        if (cfgMM) {
            const cfgRrefresh: Cfg_Refresh = this.cfgRefresh.getValueByKey(cfgMM.RefreshId);
            if (cfgRrefresh) {
                return cfgRrefresh.MonsterLevel;
            }
        }
        return 0;
    }

    private _CfgBossConfig: ConfigIndexer;
    public get CfgBossConfig(): ConfigIndexer {
        if (!this._CfgBossConfig) {
            this._CfgBossConfig = Config.Get(Config.Type.Cfg_Boss_Config);
        }
        return this._CfgBossConfig;
    }

    public getBossHomeIds(): number[] {
        return this._bossHomeIds;
    }

    /** ???????????????boss?????? */
    public getBossHomeData(bossHomeId: number): BossHomeData {
        const bossData = this._bossHomeData[bossHomeId];
        if (bossData && bossData.BossData) {
            for (let i = 0; i < bossData.BossData.length; i++) {
                const bossId = bossData.BossData[i].BossId;
                const mapMonsterData = MapMgr.I.getMapMonsterData(bossId);
                if (mapMonsterData) {
                    bossData.BossData[i].State = mapMonsterData.d.Monster_State;
                    bossData.BossData[i].ReliveTime = mapMonsterData.d.Monster_ReliveTime;
                    bossData.BossData[i].UserId = mapMonsterData.d.Monster_OwnerId;
                }
            }
        }
        return bossData;
    }

    /** ?????????????????????boss?????? */
    public getBossData(bossId: number): BossHomeBossData {
        const bossData = this._bossHomeData[this._curBossHomeId];
        if (!bossData || !bossData.BossData) return null;

        for (let i = 0; i < bossData.BossData.length; i++) {
            if (bossData.BossData[i].BossId === bossId) {
                const mapMonsterData = MapMgr.I.getMapMonsterData(bossId);
                if (mapMonsterData) {
                    bossData.BossData[i].State = mapMonsterData.d.Monster_State;
                    bossData.BossData[i].ReliveTime = mapMonsterData.d.Monster_ReliveTime;
                    bossData.BossData[i].UserId = mapMonsterData.d.Monster_OwnerId;
                }

                return bossData.BossData[i];
            }
        }
        return null;
    }

    public getTempBagData(): ItemData[] {
        return this._tempBagData;
    }

    /** ????????????????????????????????? */
    public setBeaconWarData(bossHomeData: BossHomeData[], bagData: ItemData[]): void {
        this._bossHomeIds = [];
        for (let i = 0; i < bossHomeData.length; i++) {
            this._bossHomeIds.push(bossHomeData[i].BossHomeId);
            this._bossHomeData[bossHomeData[i].BossHomeId] = bossHomeData[i];
        }

        this._tempBagData = bagData;

        EventClient.I.emit(E.BeaconWar.UptMain);
    }

    public get curBossHomeId(): number {
        return this._curBossHomeId;
    }

    public set curBossHomeId(_id: number) {
        this._curBossHomeId = _id;
    }

    public get curBossId(): number {
        return this._curBossId;
    }

    public get inspireData(): InspireItem {
        return this._inspireData;
    }

    private _reqPve: boolean = false;
    private _reqPvp: boolean = false;
    public set reqPve(_reqPve: boolean) {
        this._reqPve = _reqPve;
    }
    public get reqPve(): boolean {
        return this._reqPve;
    }
    public set reqPvp(_reqPvp: boolean) {
        this._reqPvp = _reqPvp;
    }
    public get reqPvp(): boolean {
        return this._reqPvp;
    }

    /** ??????????????? */
    public setEnterBossHome(d: S2CEnterBossHome): void {
        this._curBossHomeId = d.BossHomeId;
        this._inspireData = { buffNum: d.BuffNum, endTime: d.BuffEndTime };
        // ????????????????????????
        if (WinAutoPayTipsModel.getState(AutoPayKey.BeaconWarAutoBuff)) {
            this.autoInspire();
        }
    }

    /** ??????this._bossHomeData??????boss?????????????????????????????? */
    public uptBossDataState(bossId: number, state: number, reliveTime: number): void {
        // ??????boss???boss??????????????????boss???boss??????????????????????????????
        let clean: boolean = false;
        if (bossId === this._curBossId) {
            if (state === EBeaconState.Die) {
                this.clearRankData();
                clean = true;
                // console.log('??????boss???boss??????????????????boss???boss??????????????????????????????');
            }
        }
        const boss = this._bossHomeData[this._curBossHomeId].BossData;
        if (boss) {
            for (let i = 0; i < boss.length; i++) {
                if (boss[i].BossId === bossId) {
                    boss[i].State = state;
                    boss[i].ReliveTime = reliveTime;
                    if (clean) {
                        boss[i].UserId = 0;
                        // console.log('-----------????????????-----------');
                    }
                }
            }
        }
        // console.log('---------uptBossDataState---------', boss);
        EventClient.I.emit(E.BeaconWar.UptBossData);
    }

    /** ?????????????????? */
    public uptBossBelong(bossId: number, belongId: number): void {
        const boss = this._bossHomeData[this._curBossHomeId].BossData;
        if (boss) {
            for (let i = 0; i < boss.length; i++) {
                if (boss[i].BossId === bossId) {
                    boss[i].UserId = belongId;
                }
            }
        }
        // console.log('---------??????????????????---------', boss);
        EventClient.I.emit(E.BeaconWar.UptBossData);
    }

    /** ?????????????????????boss??????????????? */
    public setBossHomeRankData(d: S2CGetBossHomeRankData): void {
        if (d.BossHomeId !== this._curBossHomeId || d.BossId !== this._curBossId) {
            this.clearRankData();
            // console.warn('??????????????????', d);
        }
        this._curBossHomeId = d.BossHomeId;
        this._curBossId = d.BossId;
        const rankData: BossHomeRankData[] = d.RankData;
        const delIds: number[] = d.RankDel;

        for (let i = 0; i < rankData.length; i++) {
            const index = this._bossRankData.findIndex((v) => v.UserId === rankData[i].UserId);
            if (index >= 0) {
                // ?????????
                this._bossRankData[index] = rankData[i];
            } else {
                this._bossRankData.push(rankData[i]);
            }
        }

        // ????????????
        if (delIds && delIds.length > 0) {
            for (let i = 0; i < delIds.length; i++) {
                const index = this._bossRankData.findIndex((v) => v.UserId === delIds[i]);
                if (index >= 0) {
                    this._bossRankData.splice(index, 1);
                }
            }
        }

        // ??????
        if (this._bossRankData.length > 0) {
            this._bossRankData.sort((a, b) => b.Damage - a.Damage);
        }

        // console.log(d.BossHomeId, d.BossId, '????????????', this._bossRankData);

        EventClient.I.emit(E.BeaconWar.PlayerDamageRank);
    }

    public cleanAllData(): void {
        this.clearRankData();
        this._bossHomeIds.length = 0;
        this._bossHomeData = cc.js.createMap(true);
        // console.warn('??????????????????');
    }

    /** ?????????????????? */
    public clearRankData(): void {
        // console.warn('??????????????????');
        if (this._bossRankData) {
            this._bossRankData.length = 0;
        }
        this._curBossId = 0;
    }

    public getBossHomeRankData(): BossHomeRankData[] {
        return this._bossRankData;
    }

    /**
     * ???????????????????????????????????????????????????????????????MapMgr???_playerData???????????????????????????????????????
     * ?????????????????????????????????????????????????????????????????????????????????????????????????????????
     */
    public setPlayerInfo(d: BaseUserInfo[]): void {
        if (d && d.length > 0) {
            for (let i = 0; i < d.length; i++) {
                MapMgr.I.setMapPlayerData(d[i]);
            }
            EventClient.I.emit(E.BeaconWar.UptPlayerData, false);
        }
    }

    /** ?????????????????? */
    public playerInfo(userId: number, reqDataIfNotFound: boolean = false): RoleInfo {
        if (!userId) return null;

        // ???????????????
        if (userId === RoleMgr.I.info.userID) {
            return RoleMgr.I.info;
        }
        const info: RoleInfo = MapMgr.I.getMapPlayerData(userId);

        if (reqDataIfNotFound && (!info || !info.d || !info.d.HeadIcon || !info.d.Nick)) {
            // ?????????????????????????????????????????????????????????????????????
            ControllerMgr.I.BeaconWarController.reqUserShowInfo([userId]);
        }
        return info;
    }

    /** Boss????????????????????????????????????, ???????????????????????????boss??????????????? */
    public isHasDamage(): number {
        if (this._bossRankData.length > 0) {
            return this._curBossId;
        }
        return 0;
    }

    /** ?????????????????????boss????????? */
    public getBossBelong(): number {
        const boss = this._bossHomeData[this._curBossHomeId].BossData;
        if (boss && boss.length > 0) {
            for (let i = 0; i < boss.length; i++) {
                if (boss[i].UserId) {
                    return boss[i].UserId;
                }
            }
        }
        console.warn('*********** ??????????????????????????????');
        return 0;
    }

    /** ??????????????????????????????????????????????????????????????????boss?????? */
    public getPlayerDamage(userId: number): number {
        const rank = this.getBossHomeRankData();
        if (rank && rank.length > 0) {
            for (let i = 0; i < rank.length; i++) {
                if (rank[i].UserId === userId) {
                    return rank[i].Damage;
                }
            }
        }
        return 0;
    }

    /** ?????????boss??????????????????????????? */
    public moveToBossPos(bossId: number, callback: () => void = null, context: any = null): void {
        // ?????????boss?????????
        const info: RoleInfo = MapMgr.I.getMapMonsterData(bossId);
        if (info) {
            // console.log('------------moveToBossPos----------', info.d.Monster_Map_X * MapCfg.I.cellWidth, info.d.Monster_Map_Y * MapCfg.I.cellHeight);
            SceneMap.I.movePlayer(info.d.Monster_Map_X * MapCfg.I.cellWidth, info.d.Monster_Map_Y * MapCfg.I.cellHeight, () => {
                this.fightBoss(bossId, callback, context);
            });
        } else {
            console.log('------------moveToBossPos----------??????????????????----------------');
        }
    }

    /** ??????Boss */
    private fightBoss(bossId: number, callback: () => void = null, context: any = null): void {
        // console.log('----------fightBoss----------', bossId);
        // ????????????boss??????
        const bossData = this.getBossData(bossId);
        if (bossData) {
            // boss?????????
            if (bossData.State === EBeaconState.Die) {
                MsgToastMgr.Show(i18n.tt(Lang.beaconWar_unRelive_b));
                if (callback) {
                    callback.call(context);
                }
            } else if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.BeaconWar, true)) {
                // ControllerMgr.I.BeaconWarController.reqBossHomePVE(this._curBossHomeId, bossId);
                BattleCommon.I.enter(EBattleType.FHLC_PVE, [this._curBossHomeId, bossId]);
                this.closeAllWin();
            }
        } else {
            console.log('??????boss,????????????boss??????', bossId);
        }
    }

    /** ?????????????????????????????????????????? */
    public moveToPlayerPos(userId: number, posX: number, posY: number): void {
        SceneMap.I.movePlayer(posX, posY, () => {
            this.fightOtherPlayer(userId);
        });
    }

    /** ?????????????????? */
    public fightOtherPlayer(UserId: number): void {
        // ????????????????????????
        if (UserId === RoleMgr.I.info.userID) {
            // ???????????????
        } else {
            const info = this.playerInfo(UserId, true);
            if (info) {
                if (info.d.Map_State === EBeaconState.Die) {
                    MsgToastMgr.Show(i18n.tt(Lang.beaconWar_unRelive));
                } else if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.BeaconWar, true)) {
                    // ControllerMgr.I.BeaconWarController.reqBossHomePVP(this._curBossHomeId, UserId);
                    BattleCommon.I.enter(EBattleType.FHLC_PVP, [this._curBossHomeId, UserId]);
                    this.closeAllWin();
                }
            } else {
                console.log('??????????????????,??????????????????', UserId);
            }
        }
    }

    /**
     * ?????????id???????????????????????????
     */
    public getReWardMsg(): string[] {
        const List = this.CfgBeaconWar.getBeaconWarDatas();
        const temp: string[] = [];
        const _data: Cfg_BeaconWar = List.filter((item) => item.CityID === this._curBossHomeId)[0];
        if (_data) {
            temp.push(_data.ShowDrop, _data.ShowLuckDrop, _data.ShowOwnerDrop);
        }
        return temp;
    }

    /** ??????????????????????????? */
    public getQuickUseModel(): ItemModel {
        const energy = this.getEnergyIdAndNeed();
        return UtilItem.NewItemModel(energy.id, energy.need);
    }

    /** ???????????? */
    public openPackage(_d: ItemModel[]): void {
        WinMgr.I.open(ViewConst.PackageWin, _d, () => {
            ControllerMgr.I.BeaconWarController.reqBagOneKeyGet();
        });
    }

    private setPackageData(): ItemModel[] {
        const _data: ItemModel[] = [];
        const _items: ItemData[] = this.getTempBagData();
        _items.forEach((item, i) => {
            _data.push(UtilItem.NewItemModel(item));
        });
        _items.sort((a, b) => {
            if (a.EndTime === b.EndTime) {
                return UtilItem.NewItemModel(b).cfg.Quality - UtilItem.NewItemModel(a).cfg.Quality;
            } else {
                return b.EndTime - a.EndTime;
            }
        });
        return _data;
    }
    // ????????????
    public uptPackage(bagData: ItemData[]): void {
        this._tempBagData = bagData;
        const temp = this.setPackageData();
        if (!WinMgr.I.checkIsOpen(ViewConst.PackageWin)) {
            this.openPackage(temp);
        } else {
            EventClient.I.emit(E.Package.UptPackage, temp);
        }
    }

    private _playerHpLists: HpList[] = [];
    public get playerHpLists(): HpList[] {
        return this._playerHpLists;
    }
    // ???????????????
    public isAutoTreat: boolean = false;
    // ??????????????????
    public uptTreats(_d: S2CBossHomeGetPlayerHpList): void {
        _d.HL.sort((a, b) => {
            const aT = this.getTeamUnitType(a.P);
            const bT = this.getTeamUnitType(b.P);
            if (aT.UnitType === bT.UnitType) {
                return aT.Pos - bT.Pos;
            }
            return aT.UnitType - bT.UnitType;
        });
        this._playerHpLists = _d.HL;
        EventClient.I.emit(E.BeaconWar.UptTreatHpList);
    }

    private getTeamUnitType(posId: number) {
        const cfgFPos = Config.Get(Config.Type.Cfg_FightPos);
        const posIndexs: number[] = cfgFPos.getValueByKey(0);
        const cfg = cfgFPos.getValueByIndex(posIndexs[posId], { Pos: 0, UnitType: 0 });
        return cfg;
    }

    // ????????????
    public autoTreat(): void {
        const _tips = this.getIsETreat();
        if (!_tips) {
            // ????????????????????????????????????????????????
            // WinAutoPayTipsModel.setState(AutoPayKey.BeaconWarAutoTreat, false);
        } else {
            const _eTips = this.getIsMaxHp();
            if (_eTips) {
                MsgToastMgr.Show(_eTips);
            } else if (!this.isAutoTreat) {
                this.isAutoTreat = true;
                ControllerMgr.I.BeaconWarController.reqBossHomeTreat();
                MsgToastMgr.Show(_tips);
            }
        }
    }

    public getIsMaxHp(): string {
        const tips = RoleMgr.I.info.d.FCurrHp === RoleMgr.I.info.d.FMaxHp ? i18n.tt(Lang.beaconWar_max_hp) : '';
        return tips;
    }

    public getIsETreat(): string {
        const costD = ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarTreatCost);
        const _cost = costD.split(':');
        const hasNum = BagMgr.I.getItemNum(_cost[0]);
        const needNum = _cost[1];
        const _str = hasNum < +needNum ? '' : UtilString.FormatArray(i18n.tt(Lang.beaconWar_treat_tips), [`${needNum}${UtilItem.GetCfgByItemId(+_cost[0]).Name}`]);
        return _str;
    }
    // ????????????
    public uptInspire(_d: S2CBossHomeBuyBuff): void {
        this._inspireData = { buffNum: _d.BuffNum, endTime: _d.BuffEndTime };
        EventClient.I.emit(E.BeaconWar.UptInspire);
        this._isUpDateBuff = false;
    }
    // ????????????????????????
    private isInspireAttE(): string {
        const addAttack = +ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarAddAtt);
        const maxAttack = +ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarMaxAtt) / 100;
        const attactVal = ((this.inspireData.buffNum + 1) * addAttack) / 100;
        const attactE = attactVal <= maxAttack ? `${UtilString.FormatArray(i18n.tt(Lang.beaconWar_inspire_add_attack), [attactVal])}` : '';
        return attactE;
    }
    // ????????????????????????
    private isInspireTE(): string {
        const maxEndTime = +ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarTimeLimit);
        const addEndTime = +ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarAddSeconds);
        const hasTime = this.inspireData.endTime - UtilTime.NowSec();
        const timeE = hasTime < maxEndTime - addEndTime ? `${UtilString.FormatArray(i18n.tt(Lang.beaconWar_inspire_add_time), [addEndTime])}` : '';
        return timeE;
    }
    // ????????????????????????
    private isInspireCE(): string {
        const _d = ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarInspireCost);
        const inspireCost = _d.split(':');
        const needCost = +inspireCost[1];
        const hasNum = RoleMgr.I.getCurrencyById(+inspireCost[0]);
        const costE = needCost >= hasNum ? `${UtilItem.GetCfgByItemId(+inspireCost[0]).Name}${i18n.tt(Lang.not_enough)}` : '';
        return costE;
    }
    // ???????????????
    public isCanInspire(): { state: boolean, str: string } {
        let tips = '';
        let state = false;
        const costA = this.isInspireAttE();
        const costT = this.isInspireTE();
        const costC = this.isInspireCE();
        if (!costC) {
            state = true;
            if (!!costA && !!costT) { // ??????????????????
                tips = `${costA},${costT}`;
            } else if (!!costA && !costT) { // ???????????????
                tips = costA;
            } else if (!costA && !!costT) { // ???????????????
                tips = costT;
            } else { // ???????????????
                state = false;
                tips = i18n.tt(Lang.beaconWar_inspire_max);
            }
        } else {
            tips = costC;
        }
        return { state, str: tips };
    }
    // ?????????????????????
    public isCanAutoInspire(): string {
        let isAuto = '';
        const costA = this.isInspireAttE();
        const costT = this.isInspireTE();
        const costC = this.isInspireCE();
        if (!costC) {
            if (!!costA || !!costT) { // ?????????????????????
                isAuto = '';
            }
        } else {
            isAuto = costC;
        }
        return isAuto;
    }
    public checkInspire(): boolean {
        this._isUpDateBuff = true;
        const isAuto = this.isCanAutoInspire();
        if (!isAuto) {
            // console.log('????????????');
            ControllerMgr.I.BeaconWarController.reqBossHomeBuyBuff();
            return true;
        } else {
            if (isAuto !== '') {
                MsgToastMgr.Show(isAuto);
            }
            clearInterval(this._timer);
            this._timer = null;
            WinAutoPayTipsModel.setState(AutoPayKey.BeaconWarAutoBuff, false);
            EventClient.I.emit(E.BeaconWar.UptInspire);
        }
        return false;
    }
    private _timer = null;
    private _isUpDateBuff = false; // ?????????????????????????????????
    // ????????????
    public autoInspire(): void {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        let _count = 0;
        this._timer = setInterval(() => {
            _count += 0.2;
            if (!this._isUpDateBuff) {
                this.checkInspire();
            }
            if (_count === 2) {
                clearInterval(this._timer);
                this._timer = null;
                this._isUpDateBuff = false;
            }
        }, 0.2);
    }

    /** ???????????? */
    public getNeedEnergy(): number {
        let need: number = 10;
        const vip = RoleMgr.I.d.VipLevel;
        const vipCfg: Cfg_VIP = Config.Get(Config.Type.Cfg_VIP).getValueByKey(vip);
        if (vipCfg) {
            const strength = vipCfg.BeaconWarStrength.split(':');
            if (+strength[0] === 114) {
                need = +strength[1];
            }
        }

        return need;
    }

    public getShopId(_id: number): number {
        let shopId = null;
        const indexer: ConfigShopIndexer = Config.Get(Config.Type.Cfg_ShopCity);
        const shopitems = indexer.getShopItemsByShopType(ShopChildType.Quick);
        shopitems.forEach((v) => {
            if (v.ItemID === _id) {
                shopId = v.GoodsID;
            }
        });
        return +shopId;
    }

    /** ????????? */
    private _energyId: number = 0;
    private _energyNeed: number = 0;
    public getEnergyIdAndNeed(): { id: number, need: number } {
        if (!this._energyId) {
            const item = ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarStrengthCost);
            const _id = +item.split(':')[0];
            const _num = +item.split(':')[1];
            this._energyId = _id;
            this._energyNeed = _num;
        }
        return { id: this._energyId, need: this._energyNeed };
    }

    /** ??????????????????????????????????????? */
    public isHaveEnergyId(): boolean {
        if (!this._energyId) {
            this.getEnergyIdAndNeed();
        }
        return BagMgr.I.getItemNum(this._energyId) >= this._energyNeed;
    }

    /** ???????????? */
    public addEnergyForUI(): void {
        const have: number = RoleMgr.I.d.BossHomeEnergyVal;
        const need: number = this.getNeedEnergy();

        if (have >= need) { // ????????????
            MsgToastMgr.Show(i18n.tt(Lang.beaconWar_energy));
        } else {
            const item = this.getEnergyIdAndNeed();
            const isAuto = WinAutoPayTipsModel.getState(AutoPayKey.BeaconWarQuick);
            if (item) {
                const _id = item.id;
                const _need = item.need;
                const hasNum = BagMgr.I.getItemNum(_id);
                // ?????????
                if (hasNum >= _need) {
                    if (ModelMgr.I.MsgBoxModel.IsTip(this.tipsKey)) {
                        // const shopId = this.getShopId(_id);
                        // ControllerMgr.I.ShopController.buyNormalShopGoods(shopId, _need);
                        ControllerMgr.I.BeaconWarController.reqBossHomeBuyEnergy();
                    } else {
                        WinMgr.I.open(ViewConst.BeaconWarQuickWin);
                    }
                } else if (!isAuto) {
                    const conf: IWinAutoPayTips = {
                        /** ?????? */
                        cb: (isDo: boolean, _d: Cfg_ShopCity) => {
                            if (isDo) {
                                if (_d.GoodsPrice <= BagMgr.I.getItemNum(_d.GoldType)) {
                                    // ControllerMgr.I.ShopController.buyNormalShopGoods(shopId, _need);
                                    ControllerMgr.I.BeaconWarController.reqBossHomeBuyEnergy();
                                } else {
                                    MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(_d.GoldType).Name}${i18n.tt(Lang.not_enough)}`);
                                    WinMgr.I.open(ViewConst.ItemSourceWin, _d.GoldType);
                                }
                            }
                        },
                        /** ??????????????? */
                        itemId: _id,
                        /** ?????????key */
                        recordKey: AutoPayKey.BeaconWarQuick,
                        /** ?????? */
                        tips: i18n.tt(Lang.beaconWar_buy),
                        title: i18n.tt(Lang.beaconWar_quick),
                        unshowTog: true,
                    };
                    MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(_id).Name}${i18n.tt(Lang.not_enough)}`);
                    WinMgr.I.open(ViewConst.WinAutoPayTips, conf);
                } else {
                    // ControllerMgr.I.ShopController.buyNormalShopGoods(shopId, _need);
                    ControllerMgr.I.BeaconWarController.reqBossHomeBuyEnergy();
                }
            }
        }
    }

    public buyEnergyMedicine(): void {
        const item = this.getEnergyIdAndNeed();
        if (item) {
            const _id = item.id;
            const _need = item.need;
            const hasNum = BagMgr.I.getItemNum(_id);
            if (hasNum >= _need) {
                // const shopId = this.getShopId(_id);
                // ControllerMgr.I.ShopController.buyNormalShopGoods(shopId, _need);
                ControllerMgr.I.BeaconWarController.reqBossHomeBuyEnergy();
            }
        }
    }

    /** ???????????? */
    public addEnergy(isQuick: boolean): void {
        if (GameApp.I.IsBattleIng || !MapCfg.I.isBeaconWar) {
            return;
        }

        const have: number = RoleMgr.I.d.BossHomeEnergyVal;
        const max: number = this.getNeedEnergy();

        if (have >= max) { // ????????????
            MsgToastMgr.Show(i18n.tt(Lang.beaconWar_energy));
        } else {
            const item = this.getEnergyIdAndNeed();
            const isAuto = false;// WinAutoPayTipsModel.getState(AutoPayKey.BeaconWarQuick);
            if (item) {
                const _id = item.id;
                const _need = item.need;
                const hasNum = BagMgr.I.getItemNum(_id);

                // ?????????
                if (hasNum >= _need) {
                    if (ModelMgr.I.MsgBoxModel.IsTip(this.tipsKey)) {
                        // const shopId = this.getShopId(_id);
                        // ControllerMgr.I.ShopController.buyNormalShopGoods(shopId, _need);
                        ControllerMgr.I.BeaconWarController.reqBossHomeBuyEnergy();
                    } else {
                        WinMgr.I.open(ViewConst.BeaconWarQuickWin, 1);
                    }
                } else if (!isAuto) {
                    let conf: IWinAutoPayTips;
                    if (isQuick) {
                        const add: number = +Config.Get(Config.Type.Cfg_Boss_Config).getValueByKey('BeaconWarStrengthReply', 'Value');
                        conf = {
                            /** ?????? */
                            cb: (isDo: boolean) => {
                                if (isDo) {
                                    // ControllerMgr.I.ShopController.buyNormalShopGoods(shopId, _need);
                                    ControllerMgr.I.BeaconWarController.reqBossHomeBuyEnergy();
                                } else if (RoleMgr.I.d.BossHomeEnergyVal < 10) {
                                    this.exit(false, true);
                                }
                            },
                            /** ??????????????? */
                            itemId: _id,
                            /** ?????????key */
                            recordKey: AutoPayKey.BeaconWarQuick,
                            /** ?????? */
                            richText: UtilString.FormatArray(
                                i18n.tt(Lang.beaconWar_buy2),
                                [add, UtilColor.NorV, UtilColor.GreenV],
                            ),
                            title: i18n.tt(Lang.beaconWar_quick),
                            cd: 10,
                            unshowTog: true,
                        };
                    } else {
                        conf = {
                            /** ?????? */
                            cb: (isDo: boolean) => {
                                if (isDo) {
                                    // ControllerMgr.I.ShopController.buyNormalShopGoods(shopId, _need);
                                    ControllerMgr.I.BeaconWarController.reqBossHomeBuyEnergy();
                                } else if (RoleMgr.I.d.BossHomeEnergyVal < 10) {
                                    this.exit(false, true);
                                }
                            },
                            /** ??????????????? */
                            itemId: _id,
                            /** ?????????key */
                            recordKey: AutoPayKey.BeaconWarQuick,
                            /** ?????? */
                            tips: i18n.tt(Lang.beaconWar_buy),
                            title: i18n.tt(Lang.beaconWar_quick),
                            // cd: 10,
                            unshowTog: true,
                        };
                    }
                    MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(_id).Name}${i18n.tt(Lang.not_enough)}`);
                    WinMgr.I.open(ViewConst.WinAutoPayTips, conf);
                } else {
                    // ControllerMgr.I.ShopController.buyNormalShopGoods(shopId, _need);
                    ControllerMgr.I.BeaconWarController.reqBossHomeBuyEnergy();
                }
            }
        }
    }

    public getReliveCost(): { id: number, need: number } {
        const cost: string = Config.Get(Config.Type.Cfg_Boss_Config).getValueByKey('BeaconWarRevivalCost', 'Value');
        const cData = cost.split(':');
        return {
            id: +cData[0],
            need: +cData[1],
        };
    }

    /** ???????????????????????????????????? */
    public closeAllWin(): void {
        WinMgr.I.closeViewAttr([
            // ?????????
            ViewConst.ConfirmBox,
            // ??????
            ViewConst.BeaconWarQuickWin,
            // ??????
            ViewConst.PackageWin,
            // ????????????
            ViewConst.WinAutoPayTips,
            // ??????
            ViewConst.ItemSourceWin,
            // ????????????
            ViewConst.BattleSettleWin,
        ]);
    }

    /**
     * ??????????????????
     * @param needTip ??????????????????????????????,??????false
     * @param needReback ???????????????????????????????????????
     */
    public exit(needTip: boolean = false, needReback: boolean = false): void {
        if (GameApp.I.IsBattleIng) {
            return;
        }

        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        this._isUpDateBuff = false;

        const name: string = UtilFunOpen.getDesc(FuncId.BeaconWar);
        const str: string = UtilString.FormatArray(
            i18n.tt(Lang.maincity_beaconWar_msgbox),
            [name, UtilColor.NorV],
        );

        FuBenMgr.I.quitFuBen(needTip, str, () => {
            ControllerMgr.I.BeaconWarController.reqExit();
            if (needReback) {
                // console.log('??????????????????????????????');
                WinMgr.I.open(ViewConst.BossWin, BossPageType.Cross, WorldBossPageType.BeaconWar);
                // ??????
                if (RoleMgr.I.d.BossHomeEnergyVal < 10) {
                    ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${i18n.tt(Lang.beaconWar_exit)}</c>`, null, null, null, EMsgBoxModel.Confirm);
                }
            }
        }, this, { showToggle: 'QuitBeaconWar', tipTogState: false });
    }
}
