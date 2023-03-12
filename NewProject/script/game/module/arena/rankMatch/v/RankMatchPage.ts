/*
 * @Author: zs
 * @Date: 2023-01-06 17:28:11
 * @Description:
 *
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage, ImageType } from '../../../../base/components/DynamicImage';
import Progress from '../../../../base/components/Progress';
import GameApp from '../../../../base/GameApp';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { BattleCommon } from '../../../../battle/BattleCommon';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { EBattleType } from '../../../battleResult/BattleResultConst';
import { RID } from '../../../reddot/RedDotConst';
import { RoleInfo } from '../../../role/RoleInfo';
import { RoleMgr } from '../../../role/RoleMgr';
import { EVipFuncType } from '../../../vip/VipConst';
import { RankMatchHeadItem } from '../com/RankMatchHeadItem';
import { ERankMatchBtn } from '../RankMatchConst';
import RankMatchModel from '../RankMatchModel';

const { ccclass, property } = cc._decorator;

export enum EStarStatus {
    /** 隐藏 */
    Hide,
    /** 显示 */
    Show
}
@ccclass
export default class RankMatchPage extends WinTabPage {
    @property(cc.Node)
    private NodeHeads: cc.Node = null;
    @property(cc.Node)
    private BtnReport: cc.Node = null;
    @property(cc.Node)
    private BtnRank: cc.Node = null;
    @property(cc.Node)
    private BtnAward: cc.Node = null;
    @property(cc.Node)
    private BtnAdd: cc.Node = null;
    @property(cc.Node)
    private NodeStars: cc.Node[] = [];
    @property(DynamicImage)
    private SpriteIcon: DynamicImage = null;
    @property(Progress)
    private progress: Progress = null;
    @property(cc.Node)
    private BtnMatch: cc.Node = null;
    @property(cc.Label)
    private LabelTime: cc.Label = null;
    @property(cc.Label)
    private LabelNextLevelName: cc.Label = null;
    @property(cc.Node)
    private NodeMaxName: cc.Node = null;
    @property(cc.Label)
    private LabelRank: cc.Label = null;
    @property(cc.Label)
    private LabelNum: cc.Label = null;
    @property(cc.Label)
    private LabelRecoveryTime: cc.Label = null;
    private model: RankMatchModel;
    /** 结束时间 */
    private endTime: number = 0;
    /** 恢复次数时间 */
    private refreshTime: number = 0;
    protected onLoad(): void {
        super.onLoad();
        this.model = ModelMgr.I.RankMatchModel;
        EventClient.I.on(E.RankMatch.UpdateData, this.onUpdateData, this);
        EventClient.I.on(E.RankMatch.UpdateChallengeNum, this.onUpdateChallengeNum, this);
        EventClient.I.on(E.RankMatch.MatchSucess, this.onMatchSucess, this);
        ControllerMgr.I.RankMatchController.C2SOpenRankMatchUI();
        UtilGame.Click(this.BtnReport, this.onBtnReport, this);
        UtilGame.Click(this.BtnRank, this.onBtnRank, this);
        UtilGame.Click(this.BtnAward, this.onBtnAward, this);
        UtilGame.Click(this.BtnAdd, this.onBtnAdd, this);
        UtilGame.Click(this.BtnMatch, this.onBtnMatch, this);
        UtilRedDot.Bind(RID.Arena.RankMatch.Reward.Id, this.BtnAward, cc.v2(21, 21));
    }

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        if (param && param[1] === ERankMatchBtn.Report) {
            this.onBtnReport();
        }
    }

    private time24: number = 0;
    private onUpdateData() {
        this.time24 = Math.floor(UtilTime.GetTodySometime(24) / 1000);
        const data = this.model.getData();
        this.updateStars();
        this.updateNum();
        this.updateProgress();
        this.showTopPlayers();
        this.endTime = data?.EndTime || 0;
        this.refreshTime = data?.NextRefreshTime || 0;
        this.updatePerSecond();
        if (data?.IsChangeSession) {
            WinMgr.I.open(ViewConst.RankMatchReset, data.LastSessionScore, this.model.score);
        }
    }
    private showTopPlayers() {
        let node: cc.Node;
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.RankMatchHeadItem, this.NodeHeads.children[0], (e, tempNode) => {
            if (e) { return; }
            this.NodeHeads.children.forEach((child, index) => {
                node = child.children[0] || cc.instantiate(tempNode);
                if (!child.children[0]) {
                    child.addChild(node);
                }
                node.getComponent(RankMatchHeadItem).setData(index);
            });
        });
    }

    protected updatePerSecond(): void {
        const curTime = UtilTime.NowSec();
        this.LabelTime.string = UtilTime.FormatTime(this.endTime - curTime, i18n.tt(Lang.com_time_fmt_dhs), true, false);
        if ((this.time24 - curTime) < 0) {
            // 防止60秒内协议没下发，又继续请求协议的问题
            this.time24 += 60;

            ControllerMgr.I.RankMatchController.C2SOpenRankMatchUI();
        }
        const time = this.refreshTime - curTime;
        if (time > 0 && this.model.num < this.model.RankMatchNumLimit) {
            this.LabelRecoveryTime.string = UtilString.FormatArgs(i18n.tt(Lang.rankmatch_refresh_time), UtilTime.FormatHourDetail(time));
        } else {
            this.LabelRecoveryTime.string = '';
        }
    }

    /** 更新阶级星数 */
    private updateStars() {
        const cfg = this.model.getCfgPos();
        const star = this.model.getStar(cfg.Id);
        this.NodeStars.forEach((n, index) => {
            n.active = index < star;
        });
    }

    /** 更新剩余次数 */
    private updateNum() {
        const isShowRed = this.model.num > 0;
        this.LabelNum.string = `${this.model.num}/${this.model.RankMatchNumLimit}`;
        this.LabelNum.node.color = isShowRed ? UtilColor.ColorEnough : UtilColor.ColorUnEnough;
        UtilRedDot.UpdateRed(this.BtnMatch, isShowRed, cc.v2(79, 18));
    }

    private curId: number = 0;

    /** 更新进度条 */
    private updateProgress() {
        const cfgCur = this.model.getCfgPos();
        const cfgNext = this.model.getCfgPosNext();
        if (cfgNext) {
            this.progress.updateProgress(this.model.score - cfgCur.GoalMin, cfgNext.GoalMin - cfgCur.GoalMin);
            this.LabelNextLevelName.node.parent.active = true;
            this.LabelNextLevelName.string = cfgNext.Name;
            this.NodeMaxName.active = false;
        } else {
            const cfgLast = this.model.getCfgPosLast();
            this.progress.updateProgress(this.model.score - cfgLast.GoalMin, cfgCur.GoalMin - cfgLast.GoalMin);
            this.LabelNextLevelName.node.parent.active = false;
            this.NodeMaxName.active = true;
        }
        this.LabelRank.string = this.model.getShowRank();
        if (this.curId !== cfgCur.Id) {
            this.curId = cfgCur.Id;
            this.SpriteIcon.loadImage(`texture/rankMatch/icon_pws_dw_${UtilNum.FillZero(cfgCur.Icon, 2)}@ML`, ImageType.PNG, true);
        }
    }

    /** 查看战报 */
    private onBtnReport(): void {
        WinMgr.I.open(ViewConst.RankMatchReportWin);
    }

    /** 查看排行榜 */
    private onBtnRank(): void {
        WinMgr.I.open(ViewConst.RankMatchRankWin);
    }

    /** 查看奖励 */
    private onBtnAward(): void {
        WinMgr.I.open(ViewConst.RankMatchAwardWin);
    }

    private isNeedShowBuy: boolean = false;
    /** 增加次数 */
    private onBtnAdd(): void {
        if (this.model.getData().ChallengeNum >= this.model.RankMatchNumLimit) {
            MsgToastMgr.Show(i18n.tt(Lang.rankmatch_buy_tips2));
        } else {
            const { tip, vipLv } = ModelMgr.I.VipModel.getMinTimesCfg(EVipFuncType.RankMatchDun);
            if (RoleMgr.I.d.VipLevel < vipLv) {
                MsgToastMgr.Show(tip);
                return;
            }
            this.showBuyView();
        }
    }
    private onUpdateChallengeNum(isAutoMatch: boolean) {
        if (GameApp.I.IsBattleIng) {
            return;
        }
        if (this.isNeedShowBuy) {
            if (this.model.getData().ChallengeNum >= this.model.RankMatchNumLimit) {
                WinMgr.I.close(ViewConst.ConfirmBox);
            } else if (!isAutoMatch) {
                this.showBuyView();
            }
        } else {
            WinMgr.I.close(ViewConst.ConfirmBox);
        }
        this.isNeedShowBuy = false;
        this.updateNum();
        this.refreshTime = this.model.getData()?.NextRefreshTime || 0;
    }

    private showBuyView(isAutoMatch: boolean = false) {
        const laug = i18n.tt(Lang.rankmatch_buy_tips);
        const model = this.model;
        const haveBuyNum = model.getData().DayBuyNum;
        // 计算消耗
        const costInfo = model.getBuyTimesConfig(haveBuyNum + 1);
        const coinNum = costInfo.num;
        const roleVip = RoleMgr.I.d.VipLevel;
        const roleVIpName = ModelMgr.I.VipModel.getVipName(roleVip);
        const configNum = model.configBuyTimes();

        const moneyName = UtilCurrency.getNameByType(costInfo.type);
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
                // 用户货币数量
                const roleCoin = RoleMgr.I.getCurrencyById(costInfo.type);
                if (roleCoin < coinNum) {
                    MsgToastMgr.Show(`${moneyName}${i18n.tt(Lang.com_buzu)}`);
                } else {
                    // 购买挑战次数
                    this.isNeedShowBuy = !isAutoMatch;
                    ControllerMgr.I.RankMatchController.C2SRankMatchBuyChallengeNum(isAutoMatch);
                    MsgToastMgr.Show(i18n.tt(Lang.com_buy_success));
                }
            }
        }, { showToggle: '', cbCloseFlag: 'RankMatchBuy' }, null);
    }

    /** 匹配 */
    private onBtnMatch(): void {
        // UtilMaskVir.SetRange(this.SpriteIcon.node.getComponent(cc.Sprite));
        if (this.model.num > 0) {
            if (BattleCommon.I.isCanEnter(EBattleType.RankMath)) {
                ControllerMgr.I.RankMatchController.C2SRankMatchStartMatch();
            }
        } else {
            this.showBuyView(true);
        }
    }

    private onMatchSucess(infos: BaseUserInfo[]) {
        // ControllerMgr.I.RankMatchController.C2SRankMatchChallenge(players[0].UserId);
        const players: RoleInfo[] = [];
        infos.forEach((v) => {
            const role = new RoleInfo(v);
            role.d.UserId = v.UserId;
            players.push(role);
        });
        WinMgr.I.open(ViewConst.RankMatchDuel, players);
    }

    protected onDestroy(): void {
        super.onDestroy();

        EventClient.I.off(E.RankMatch.UpdateData, this.onUpdateData, this);
        EventClient.I.off(E.RankMatch.UpdateChallengeNum, this.onUpdateChallengeNum, this);
        EventClient.I.off(E.RankMatch.MatchSucess, this.onMatchSucess, this);
    }
}
