import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../base/utils/UtilGame';
import { GuideBtnIds } from '../../../com/guide/GuideConst';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import TimerMgr from '../../../manager/TimerMgr';
import { Link } from '../../link/Link';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { EVipFuncType } from '../../vip/VipConst';
import { ArenaModel } from '../ArenaModel';
import { ArenaNormalItem } from './ArenaNormalItem';
import { ArenaTopItem } from './ArenaTopItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArenaPage extends WinTabPage {
    @property(cc.Node)
    private top1: cc.Node = null;
    @property(cc.Node)
    private top2: cc.Node = null;
    @property(cc.Node)
    private top3: cc.Node = null;
    private FirstItem: ArenaTopItem = null;
    private SecondItem: ArenaTopItem = null;
    private ThirdItem: ArenaTopItem = null;

    @property(cc.Node)
    private normal1: cc.Node = null;
    @property(cc.Node)
    private normal2: cc.Node = null;
    @property(cc.Node)
    private normal3: cc.Node = null;
    private defaultHighRank: ArenaNormalItem = null;
    private defaultMiddleRank: ArenaNormalItem = null;
    private defaultLowRank: ArenaNormalItem = null;

    // ??????
    @property(cc.Label)
    private labPower: cc.Label = null;
    // ??????
    @property(cc.Label)
    private labRank: cc.Label = null;

    @property(cc.Node)
    private BtnRank: cc.Node = null;
    @property(cc.Node)
    private BtnShop: cc.Node = null;
    @property(cc.Node)
    private BtnReward: cc.Node = null;

    @property(cc.Node)
    private BtnSweep: cc.Node = null;
    @property(cc.Node)
    private BtnRefresh: cc.Node = null;
    @property(cc.Label)
    private LabCd: cc.Label = null;

    @property(cc.Node)
    private BtnAddTimes: cc.Node = null;

    @property(cc.Label)
    private labTime: cc.Label = null;
    @property(cc.Label)
    private labTimes: cc.Label = null;
    @property(cc.Label)
    private labTimesR: cc.Label = null;
    private _timer;
    private _cdTimer: number = 0;

    /** ???????????? 4????????? ?????? ?????? ???????????????????????? ???????????? */
    public start(): void {
        super.start();
        UtilGame.Click(this.BtnShop, () => {
            Link.To(FuncId.ArenaShop);
        }, this);
        UtilGame.Click(this.BtnRank, () => {
            WinMgr.I.open(ViewConst.ArenaRankListView);
        }, this);
        UtilGame.Click(this.BtnReward, () => {
            WinMgr.I.open(ViewConst.ArenaRankRewardView);
        }, this);
        UtilGame.Click(this.BtnSweep, () => {
            // ????????????????????????
            ControllerMgr.I.ArenaController.sweep();
        }, this);

        const cd = ModelMgr.I.ArenaModel.refreshTime;
        if (cd > 0 && cd < 5) {
            this.LabCd.string = `${cd}${i18n.tt(Lang.com_second)}${i18n.tt(Lang.arena_cd_tip)}`;
            this.LabCd.fontSize = 26;
            if (this._cdTimer) {
                return;
            }
            this.refreshCdAction(cd);
        }
        UtilGame.Click(this.BtnRefresh, () => {
            if (this._cdTimer) {
                return;
            }
            this.refreshCdAction(ModelMgr.I.ArenaModel.refreshTime);
            this.refreshChallengePlayers();
        }, this);

        UtilGame.Click(this.BtnAddTimes, () => {
            // const model: ArenaModel = ModelMgr.I.ArenaModel;
            // const haveBuyNum = model.roleHaveBuyTimes();
            // const configNum = model.configBuyTimes();
            // if (configNum === haveBuyNum) {
            //     MsgToastMgr.Show(i18n.tt(Lang.arena_buy_times_unenough));
            //     return;
            // }
            const { tip, vipLv } = ModelMgr.I.VipModel.getMinTimesCfg(EVipFuncType.ArenaTimes);
            if (RoleMgr.I.d.VipLevel < vipLv) {
                MsgToastMgr.Show(tip);
                return;
            }
            this.buyTimesResult();
        }, this);

        this.addEventListener();
        this.updateUI();
    }

    private refreshCdAction(cd: number) {
        this.LabCd.string = `${cd}${i18n.tt(Lang.com_second)}${i18n.tt(Lang.arena_cd_tip)}`;
        this.LabCd.fontSize = 26;
        this._cdTimer = this.setInterval(() => {
            cd--;
            ModelMgr.I.ArenaModel.refreshTime = cd;
            if (cd > 0) {
                if (cc.isValid(this.node)) {
                    this.LabCd.string = `${cd}${i18n.tt(Lang.com_second)}${i18n.tt(Lang.arena_cd_tip)}`;
                    this.LabCd.fontSize = 26;
                }
            } else {
                console.log('???????????????');

                // ??????cd??????
                ModelMgr.I.ArenaModel.refreshTime = 5;
                this.clearInterval(this._cdTimer);
                this._cdTimer = null;
                if (cc.isValid(this.node)) {
                    this.LabCd.string = i18n.tt(Lang.arena_refresh);
                    this.LabCd.fontSize = 30;
                }
            }
        }, 1000);
    }

    private addEventListener() {
        EventClient.I.on(E.Arena.ArenaFightResult, this.fightResult, this);
        EventClient.I.on(E.Arena.RefreshChallengeData, this.eventRefreshPlayers, this);
        EventClient.I.on(E.Arena.SweepResult, this.sweepResult, this);
        EventClient.I.on(E.Arena.ArenaBuyTimes, this.buyTimesResult, this);

        // ????????????????????????
        // ??????
        RoleMgr.I.on(this.fightValueChange, this, RoleAN.N.FightValue);
        // ??????
        RoleMgr.I.on(this.rankChange, this, RoleAN.N.ArenaRank);
        // ?????????????????????
        RoleMgr.I.on(this.timesChange, this, RoleAN.N.ArenaTimes);
        // ????????????cd
        RoleMgr.I.on(this.cdChange, this, RoleAN.N.ArenaNextTime);
    }

    private fightValueChange() {
        this.labPower.string = RoleMgr.I.FightValueString;
    }

    private rankChange() {
        this.labRank.string = `${i18n.tt(Lang.arena_my_rank)}:${RoleMgr.I.Rank}`;
    }

    private timesChange() {
        const maxTimes = ModelMgr.I.ArenaModel.getChallengeTimesCfg();
        this.labTimes.string = `${RoleMgr.I.d.ArenaTimes}`;
        this.labTimesR.string = `/${maxTimes}`;
        this.labTimes.node.color = ModelMgr.I.ArenaModel.roleChallengeTimes() <= 0 ? UtilColor.ColorUnEnoughV : UtilColor.ColorEnoughV;
        ModelMgr.I.ArenaModel.updateRed();
        // ?????????????????? ??????????????????????????????????????? ????????????????????????????????????
        const role = RoleMgr.I;
        this.labTime.node.active = role.d.ArenaTimes < ModelMgr.I.ArenaModel.getChallengeTimesCfg();
    }
    private cdChange() {
        this.clearInterval(this._timer);
        this._timer = null;
        this.recoverTime();
    }
    private removeEventListener() {
        EventClient.I.off(E.Arena.ArenaFightResult, this.fightResult, this);
        EventClient.I.off(E.Arena.RefreshChallengeData, this.eventRefreshPlayers, this);
        EventClient.I.off(E.Arena.SweepResult, this.sweepResult, this);
        EventClient.I.off(E.Arena.ArenaBuyTimes, this.buyTimesResult, this);

        // ??????
        RoleMgr.I.off(this.fightValueChange, this, RoleAN.N.FightValue);
        // ??????
        RoleMgr.I.off(this.rankChange, this, RoleAN.N.ArenaRank);
        // ?????????????????????
        RoleMgr.I.off(this.timesChange, this, RoleAN.N.ArenaTimes);
        // cd??????
        RoleMgr.I.off(this.cdChange, this, RoleAN.N.ArenaNextTime);
    }

    /** ?????????????????? */
    private eventRefreshPlayers(data: S2CArenaList) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const players: ArenaRole[] = data.Roles;
        // ?????????????????????
        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Arena_ArenaTopItem, null, (err, nd: cc.Node) => {
            if (!cc.isValid(this.node)) return;
            if (nd) {
                if (!this.FirstItem) {
                    const nd1 = cc.instantiate(nd);
                    this.top1.addChild(nd1);
                    this.FirstItem = nd1.getComponent(ArenaTopItem);
                    this.FirstItem.setBodyScale(0.7);
                    this.FirstItem.setData(players[0]);
                } else {
                    this.FirstItem.setData(players[0]);
                }

                if (!this.SecondItem) {
                    const nd2 = cc.instantiate(nd);
                    this.top2.addChild(nd2);
                    this.SecondItem = nd2.getComponent(ArenaTopItem);
                    this.SecondItem.setBodyScale(0.6);
                    this.SecondItem.setData(players[1]);
                } else {
                    this.SecondItem.setData(players[1]);
                }

                if (!this.ThirdItem) {
                    const nd3 = cc.instantiate(nd);
                    this.top3.addChild(nd3);
                    this.ThirdItem = nd3.getComponent(ArenaTopItem);
                    this.ThirdItem.setBodyScale(0.6);
                    this.ThirdItem.setData(players[2]);
                } else {
                    this.ThirdItem.setData(players[2]);
                }
                nd.destroy();
            }
        });

        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Arena_ArenaNormalItem, null, (err, nd: cc.Node) => {
            if (!cc.isValid(this.node)) return;
            if (nd) {
                if (!this.defaultHighRank) {
                    const nd1 = cc.instantiate(nd);
                    this.normal1.addChild(nd1);
                    this.defaultHighRank = nd1.getComponent(ArenaNormalItem);
                    this.defaultHighRank.setData(players[3]);
                } else {
                    this.defaultHighRank.setData(players[3]);
                    nd.destroy();
                }

                if (!this.defaultMiddleRank) {
                    const nd2 = cc.instantiate(nd);
                    this.normal2.addChild(nd2);
                    this.defaultMiddleRank = nd2.getComponent(ArenaNormalItem);
                    this.defaultMiddleRank.setData(players[4], GuideBtnIds.ArenaCenterFight);
                } else {
                    this.defaultMiddleRank.setData(players[4], GuideBtnIds.ArenaCenterFight);
                }

                if (!this.defaultLowRank) {
                    const nd3 = cc.instantiate(nd);
                    this.normal3.addChild(nd3);
                    this.defaultLowRank = nd3.getComponent(ArenaNormalItem);
                    this.defaultLowRank.setData(players[5]);
                } else {
                    this.defaultLowRank.setData(players[5]);
                }
                nd.destroy();
            }
        });
    }

    /** ???????????? */
    private fightResult(data: S2CArenaFight) {
        this.refreshChallengePlayers();
        // WinMgr.I.open(ViewConst.BattleRewardView, data);
    }

    /** ???????????? */
    private sweepResult(data: S2CArenaSweep) {
        //
    }

    /** ?????????????????? ?????? */
    private buyTimesResult() {
        this.addTimeClick();
    }

    /** ???????????? */
    private updateUI() {
        const role = RoleMgr.I;
        const model = ModelMgr.I.ArenaModel;
        const currentTimes = model.roleChallengeTimes();
        const maxTimes = model.getChallengeTimesCfg();
        this.labTimes.string = `${role.d.ArenaTimes}`;
        this.labTimesR.string = `/${maxTimes}`;
        this.labRank.string = `${i18n.tt(Lang.arena_my_rank)}:${RoleMgr.I.Rank}`;
        this.labTimes.node.color = currentTimes <= 0 ? UtilColor.ColorUnEnoughV : UtilColor.ColorEnoughV;
        this.labPower.string = `${RoleMgr.I.FightValueString}`;

        this.recoverTime();
        this.refreshChallengePlayers();
    }

    private recoverTime() {
        if (this._timer) {
            return;
        }
        const role = RoleMgr.I;
        this.labTime.node.active = role.d.ArenaNextTime > 0; // ???????????????0
        let _nextAddTime = role.d.ArenaNextTime <= 0 ? 0 : role.d.ArenaNextTime - UtilTime.NowSec() - 1;
        this.labTime.string = UtilTime.FormatHourDetail(_nextAddTime);
        this._timer = this.setInterval(() => {
            _nextAddTime--;
            if (_nextAddTime <= 0) {
                this.labTime.node.active = role.d.ArenaNextTime > 0;
                this.clearInterval(this._timer);
                this._timer = null;
                return;
            }
            const timeString = UtilTime.FormatHourDetail(_nextAddTime);
            // this.labTime.node.active = timeString === '00:00:00';
            this.labTime.string = timeString;
        }, 1000);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.removeEventListener();
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }
        // ???????????????????????? ??????????????????????????????
        // if (this._cdTimer) {
        //     this.clearInterval(this._cdTimer);
        //     this._cdTimer = null;
        // }
    }

    private addTimeClick() {
        const laug = i18n.tt(Lang.arena_challenge_time_unenough_tip);
        const model: ArenaModel = ModelMgr.I.ArenaModel;
        const haveBuyNum = model.roleHaveBuyTimes();
        // ????????????
        const costInfo = model.getBuyTimesConfig(haveBuyNum + 1);
        const coinNum = costInfo.num;
        const roleVip = model.roleVipLevel();
        const roleVIpName = ModelMgr.I.VipModel.getVipFullName(RoleMgr.I.d.VipLevel);
        const configNum = model.configBuyTimes();
        const moneyName = UtilCurrency.getNameByType(costInfo.type);

        // // ???10??????
        // if (RoleMgr.I.d.ArenaTimes >= ModelMgr.I.ArenaModel.getChallengeTimesCfg()) {
        //     MsgToastMgr.Show(i18n.tt(Lang.arena_challenge_times_enough));
        //     EventClient.I.emit(E.MsgBox.ForceClose); // ????????????????????????????????????
        //     return;
        // }
        const config = [
            UtilColor.NorV,
            UtilColor.GreenV,
            coinNum,
            1,
            roleVIpName,
            configNum - haveBuyNum,
            configNum,
            configNum - haveBuyNum > 0 ? UtilColor.GreenV : UtilColor.RedV,
            moneyName,
        ];
        const tipString = UtilString.FormatArray(
            laug,
            config,
        );
        ModelMgr.I.MsgBoxModel.ShowBox(tipString, () => {
            if (configNum <= haveBuyNum) {
                MsgToastMgr.Show(i18n.tt(Lang.arena_buy_times_unenough));
            } else {
                // ??????????????????
                const roleCoin = RoleMgr.I.getCurrencyById(costInfo.type);
                if (roleCoin < coinNum) {
                    MsgToastMgr.Show(`${moneyName}${i18n.tt(Lang.com_buzu)}`);
                } else {
                    // ?????????????????????
                    ControllerMgr.I.ArenaController.buyTimes();
                    MsgToastMgr.Show(i18n.tt(Lang.com_buy_success));
                }
            }
        }, { showToggle: '', cbCloseFlag: 'arena' }, null);
    }

    /** ??????/?????????????????? */
    private refreshChallengePlayers() {
        ControllerMgr.I.ArenaController.C2SArenaList();
    }
}
