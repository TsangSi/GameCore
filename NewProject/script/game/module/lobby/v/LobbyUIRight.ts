/*
 * @Author: hwx
 * @Date: 2022-05-09 16:04:26
 * @Description: 大厅UI右侧
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { FoldButton } from '../../../base/components/FoldButton';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ViewConst } from '../../../const/ViewConst';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { RoleMgr } from '../../role/RoleMgr';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import ModelMgr from '../../../manager/ModelMgr';
import { FuncId } from '../../../const/FuncConst';
import { RID } from '../../reddot/RedDotConst';
import { BossPageType, LocalBossPageType } from '../../boss/BossConst';
import { RoleAN } from '../../role/RoleAN';
import { i18n, Lang } from '../../../../i18n/i18n';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { Config } from '../../../base/config/Config';
import { ConfigStageIndexer } from '../../../base/config/indexer/ConfigStageIndexer';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { BattleCommon } from '../../../battle/BattleCommon';
import { EDailyPageType } from '../../daily/DailyConst';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { RES_ENUM } from '../../../const/ResPath';
import UtilNewMark from '../../../base/utils/UtilNewMark';
import { ELobbyViewType } from '../LobbyConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class LobbyUIRight extends BaseCmp {
    @property(FoldButton)
    private NdFoldButton: FoldButton = null;
    @property(cc.ScrollView)
    private SvFoldContainer: cc.ScrollView = null;

    @property(cc.Node)
    private NdAutoFight: cc.Node = null;
    @property(cc.Node)
    private NdAutoEmigrated: cc.Node = null;
    @property(cc.Node)
    private NdFight: cc.Node = null;
    @property(cc.Label)
    private LabGameLevel: cc.Label = null;
    @property(cc.Label)
    private LabTime: cc.Label = null;

    @property(cc.Node)
    private NdBossTips: cc.Node = null;
    @property(cc.Node)
    private NdTeam: cc.Node = null;
    @property(cc.Node)
    private NdFuncOpen: cc.Node = null;
    @property(cc.Node)
    private NdActivityOpen: cc.Node = null;

    /** 右边列表是否是折叠的 */
    private _isFold: boolean = false;
    /** 首领入口 */
    private _isBossOpen: boolean = false;

    protected start(): void {
        super.start();

        UtilRedDot.Bind(RID.Stage.Id, this.NdFight, cc.v2(26, 34));
        UtilGame.Click(this.NdAutoFight, this.autoFightClick, this);
        UtilGame.Click(this.NdFight, () => WinMgr.I.open(ViewConst.GameLevelWin, 0), this);
        UtilGame.Click(this.NdBossTips.getChildByName('NdClose'), () => this.closBossTips(), this);
        UtilGame.Click(this.NdBossTips.getChildByName('NdContent').getChildByName('title'), () => {
            WinMgr.I.open(ViewConst.BossWin, BossPageType.Local, LocalBossPageType.MultiBoss);
            this.closBossTips();
        }, this);
        /** 注册容器项点击 */
        this.SvFoldContainer.content.children.forEach((node, idx) => {
            UtilRedDot.Unbind(node);
            switch (idx) {
                case 0:
                    UtilRedDot.Bind(RID.DailyTask.Id, node, cc.v2(18, 18));
                    UtilNewMark.Bind(FuncId.Daily, node, cc.v2(18, 18), 0.8);
                    break;
                case 1:
                    UtilRedDot.Bind(RID.Arena.Id, node, cc.v2(18, 18));
                    UtilNewMark.Bind(FuncId.ArenaEntrance, node, cc.v2(18, 18), 0.8);
                    break;
                case 2:
                    UtilRedDot.Bind(RID.Boss.Id, node, cc.v2(18, 18));
                    UtilNewMark.Bind(FuncId.BossEntrance, node, cc.v2(18, 18), 0.8);
                    break;
                case 3:
                    UtilRedDot.Bind(RID.MaterialFB.Id, node, cc.v2(18, 18));
                    UtilNewMark.Bind(FuncId.FBEntrance, node, cc.v2(18, 18), 0.8);
                    break;
                default:
                    break;
            }
            UtilGame.Click(node, () => {
                this.clickFunc(node, idx);
            }, this);
        });

        UtilGame.Click(this.NdTeam, this.onNdTeamClick, this);

        UtilGame.Click(this.NdFuncOpen, () => {
            WinMgr.I.open(ViewConst.DailyWin, EDailyPageType.FuncPreviw);
        }, this);

        this.bossOpen();
        this.gameLevelChange();
        this.onFuncOpen();

        ModelMgr.I.ArenaModel.updateRed();

        if (UtilFunOpen.isOpen(FuncId.MulitBoss)) {
            // 请求多人boss的提示
            ControllerMgr.I.BossController.reqMiltBossTip();
        }
        this.onE();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
        if (this._timerFunc) { // 清除掉正在计算的倒计时
            this.clearInterval(this._timerFunc);
            this._timerFunc = null;
        }
        this.unschedule(this.onUpdateTeamStartTime);
    }

    private onE() {
        // 监听属性数据变化
        // RoleMgr.I.on(this.bossOpen, this);
        // 添加关卡改变监听
        RoleMgr.I.on(this.gameLevelChange, this, RoleAN.N.Stage);
        EventClient.I.on(E.Lobby.ChangeViewType, this.onChangeViewType, this);
        EventClient.I.on(E.GameLevel.AutoFight, this.autoFight, this);

        // 添加战斗开始和战斗结束的监听
        EventClient.I.on(E.Battle.Start, this.battleStart, this);
        EventClient.I.on(E.Battle.End, this.battleEnd, this);
        EventClient.I.on(E.Boss.BossUpdateState, this.BossUpState, this);
        EventClient.I.on(E.Team.UpdateMember, this.onUpdateMember, this);
        EventClient.I.on(E.Team.Leave, this.onUpdateMember, this);
        EventClient.I.on(E.Team.BeginAutoStart, this.onUpdateTeamBeginAutoStart, this);
        EventClient.I.on(E.Team.EndAutoStart, this.onUpdateTeamBeginAutoStart, this);
        EventClient.I.on(E.FuncPreview.FuncOpenInit, this.onFuncOpen, this);
        EventClient.I.on(E.FuncPreview.FuncOpenNew, this.onFuncOpen, this);
        //
        RoleMgr.I.on(
            this.uptCondition,
            this,
            RoleAN.N.Level, // 人物等级
            RoleAN.N.Stage, // 关卡
            RoleAN.N.VipLevel, // vip等级
            RoleAN.N.ArmyLevel, // 军衔
            RoleAN.N.ArmyStar,
            RoleAN.N.OfficeLevel, // 官职
            RoleAN.N.ChargeRmb, // 充值
            RoleAN.N.MonthCard, // 月卡
        );
    }

    private remE() {
        RoleMgr.I.off(this.gameLevelChange, this, RoleAN.N.Stage);
        EventClient.I.off(E.Lobby.ChangeViewType, this.onChangeViewType, this);
        EventClient.I.off(E.GameLevel.AutoFight, this.autoFight, this);
        EventClient.I.off(E.Battle.Start, this.battleStart, this);
        EventClient.I.off(E.Battle.End, this.battleEnd, this);
        EventClient.I.off(E.Boss.BossUpdateState, this.BossUpState);
        EventClient.I.off(E.Team.UpdateMember, this.onUpdateMember, this);
        EventClient.I.off(E.Team.Leave, this.onUpdateMember, this);
        EventClient.I.off(E.Team.BeginAutoStart, this.onUpdateTeamBeginAutoStart, this);
        EventClient.I.off(E.Team.EndAutoStart, this.onUpdateTeamBeginAutoStart, this);
        EventClient.I.off(E.FuncPreview.FuncOpenInit, this.onFuncOpen, this);
        EventClient.I.off(E.FuncPreview.FuncOpenNew, this.onFuncOpen, this);
        //
        RoleMgr.I.off(
            this.uptCondition,
            this,
            RoleAN.N.Level, // 人物等级
            RoleAN.N.Stage, // 关卡
            RoleAN.N.VipLevel, // vip等级
            RoleAN.N.ArmyLevel, // 军衔
            RoleAN.N.ArmyStar,
            RoleAN.N.OfficeLevel, // 官职
            RoleAN.N.ChargeRmb, // 充值
            RoleAN.N.MonthCard, // 月卡
        );
    }

    private onChangeViewType(type: ELobbyViewType) {
        switch (type) {
            case ELobbyViewType.YeWai:
                this.funcOpen();
                this.NdAutoEmigrated.active = true;
                this.NdActivityOpen.active = true;
                if (this.SvFoldContainer && this.SvFoldContainer.node) {
                    // this.lastFoldState = this.NdFoldButton.getFoldState();
                    // const lastFoldState = this.NdFoldButton.getFoldState();
                    this.NdFoldButton.setFoldState(this.lastFoldState);
                    this.lastFoldState = undefined;
                }
                break;
            default:
                this.NdAutoEmigrated.active = type !== ELobbyViewType.Family;
                this.NdActivityOpen.active = type !== ELobbyViewType.Family;
                this.funcOpen();
                if (this.SvFoldContainer && this.SvFoldContainer.node) {
                    // 这里被执行多次
                    if (this.lastFoldState === undefined) {
                        this.lastFoldState = this.NdFoldButton.getFoldState();// 记录下最后的状态
                    }
                    this.NdFoldButton.setFoldState(true);
                }
                break;
        }
    }

    /** 功能预告 */
    private _isShowFunc: boolean = false;
    private onFuncOpen() {
        const funcPreviewId: number = ModelMgr.I.FuncPreviewModel.getFuncPreviewId();
        this._isShowFunc = !!funcPreviewId;
        console.log('下个要开放的功能id是', funcPreviewId);
        if (funcPreviewId) {
            this.NdFuncOpen.active = true;
            const cfg: Cfg_Client_Func = UtilFunOpen.getFuncCfg(funcPreviewId);
            const sprIcon = this.NdFuncOpen.getChildByName('SprIcon').getComponent(DynamicImage);
            const labName = this.NdFuncOpen.getChildByName('LabName').getComponent(cc.Label);
            const labDesc = this.NdFuncOpen.getChildByName('LabDesc').getComponent(cc.Label);
            sprIcon.loadImage(`${RES_ENUM.FuncPreviewOpen}${funcPreviewId}`, ImageType.PNG, true);
            labName.string = cfg.Desc;
            const des: string = ModelMgr.I.FuncPreviewModel.getFuncDesc(funcPreviewId, null, true);
            labDesc.string = des;
        } else {
            this.NdFuncOpen.active = false;
        }
    }

    private funcOpen() {
        this._isBossOpen = UtilFunOpen.canShow(FuncId.BossPersonal);
        if (this._isFold && !WinMgr.I.checkIsOpen(ViewConst.MainCity)) {
            // this.NdBoss.active = this._isBossOpen;
        } else {
            // this.NdBoss.active = false;
        }
    }

    private uptCondition() {
        if (this.NdFuncOpen.active) {
            const funcPreviewId: number = ModelMgr.I.FuncPreviewModel.getFuncPreviewId();
            if (!funcPreviewId) return;
            if (!this.NdFuncOpen.active) return;
            const labDesc = this.NdFuncOpen.getChildByName('LabDesc').getComponent(cc.Label);
            const des: string = ModelMgr.I.FuncPreviewModel.getFuncDesc(funcPreviewId, null, true);
            labDesc.string = des;
        }
    }

    private lastFoldState = undefined;
    private bossOpen() {
        this._isBossOpen = UtilFunOpen.canShow(FuncId.BossPersonal);
        if (this._isFold && !WinMgr.I.checkIsOpen(ViewConst.MainCity)) {
            // this.NdBoss.active = this._isBossOpen;
        } else {
            // this.NdBoss.active = false;
        }
    }

    private clickFunc(node: cc.Node, idx: number) {
        switch (idx) {
            case 0:
                // 日常
                if (UtilFunOpen.isOpen(FuncId.Daily, true)) {
                    WinMgr.I.open(ViewConst.DailyWin);
                }
                if (node.getChildByName('NewMark')) {
                    UtilFunOpen.CheckClick(FuncId.Daily);
                }
                break;
            case 1:
                // 竞技场
                if (UtilFunOpen.isOpen(FuncId.Arena, true)) {
                    WinMgr.I.open(ViewConst.ArenaWin, 0, 0);
                }
                if (node.getChildByName('NewMark')) {
                    UtilFunOpen.CheckClick(FuncId.Arena);
                }
                break;
            case 2:
                // 个人首领
                if (UtilFunOpen.isOpen(FuncId.BossPersonal, true)) {
                    WinMgr.I.open(ViewConst.BossWin, BossPageType.Local, LocalBossPageType.Personal);
                }
                if (node.getChildByName('NewMark')) {
                    UtilFunOpen.CheckClick(FuncId.BossPersonal);
                }
                break;
            case 3:
                // 材料副本
                if (UtilFunOpen.isOpen(FuncId.Material, true)) {
                    ControllerMgr.I.MaterialController.linkOpen();
                }
                if (node.getChildByName('NewMark')) {
                    UtilFunOpen.CheckClick(FuncId.Material);
                }
                break;
            case 4:
                // 跨服
                break;
            default:
                break;
        }
    }

    /**
     * 缩放折叠容器
     * @param v3 缩放值
     */
    private moveFoldContainer(v3: cc.Vec2, end?: () => void): void {
        cc.Tween.stopAllByTarget(this.SvFoldContainer.node);
        this.SvFoldContainer.node.active = true;
        cc.tween(this.SvFoldContainer.node).to(0.2, { position: cc.v3(v3.x, v3.y, 0) }).call(end).start();
    }

    /**
     * 侦听折叠状态
     * @param isFold 是否折叠
     */
    private onFoldState(isFold: boolean): void {
        // cc.Tween.stopAllByTarget(this.NdFoldButton.node);
        cc.Tween.stopAllByTarget(this.SvFoldContainer.node);
        const w = this.SvFoldContainer.node.width;
        this._isFold = isFold;
        if (isFold) {
            this.moveFoldContainer(cc.Vec2.ZERO, () => {
                this.SvFoldContainer.node.active = false;
                this.funcOpen();
            });
            // this.moveFoldButton(cc.v2(1, this.NdFoldButton.node.position.y, 0));
        } else {
            // this.NdBoss.active = false;
            this.moveFoldContainer(cc.v2(-w, 0));
            // this.moveFoldButton(cc.v2(-w + 1, this.NdFoldButton.node.position.y, 0));
        }
    }

    private cfg_level: ConfigStageIndexer = Config.Get<ConfigStageIndexer>(Config.Type.Cfg_Stage);
    private gameLevelChange() {
        const obj = this.cfg_level.getChapterInfo(RoleMgr.I.d.Stage);
        this.LabGameLevel.string = `${i18n.tt(Lang.arena_di)}${obj.chapter}-${obj.level}${i18n.tt(Lang.game_level_guan)}`;
    }
    // 点击自动闯关
    private autoFightClick() {
        if (ModelMgr.I.GameLevelModel.autoFight) {
            ModelMgr.I.GameLevelModel.autoFight = false;
        } else {
            ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.newplot_msgbox_text), UtilColor.NorV), () => {
                ModelMgr.I.GameLevelModel.autoFight = true;
            });
        }
    }

    private _timerCd = 10;
    private _timerFunc = null;
    private autoFight() {
        const state = ModelMgr.I.GameLevelModel.autoFight;
        if (state) {
            if (!this._timerFunc) {
                this._timerFunc = this.setInterval(() => {
                    this._timerCd--;
                    this.LabTime.string = `${i18n.tt(Lang.game_level_autoTime)}${this._timerCd}${i18n.tt(Lang.com_second)}`;
                    if (this._timerCd <= 1) {
                        this.clearInterval(this._timerFunc);
                        this._timerFunc = null;
                        ModelMgr.I.GameLevelModel.storeHistoryData();
                        if (BattleCommon.I.enter(EBattleType.GameLevelBoss)) {
                            this.LabTime.string = i18n.tt(Lang.game_level_auto_fight_state);
                            this._timerCd = 10;
                        } else {
                            ModelMgr.I.GameLevelModel.autoFight = false;
                        }
                    }
                }, 1000);
            }
        } else {
            if (this._timerFunc) { // 清除掉正在计算的倒计时
                this.clearInterval(this._timerFunc);
                this._timerFunc = null;
            }
            this._timerCd = 10;
            this.LabTime.string = i18n.tt(Lang.game_level_auto_fight_state);
        }
    }

    private battleStart(t: number) {
        if (ModelMgr.I.GameLevelModel.autoFight && t === EBattleType.GameLevelBoss) {
            //
        } else {
            ModelMgr.I.GameLevelModel.autoFight = false;
        }
    }

    private battleEnd(t: number) {
        // 如果是正在自动战斗
        if (ModelMgr.I.GameLevelModel.autoFight) {
            // 战斗类型是 关卡战斗的话 继续执行战斗 否则的话 自动战斗取消
            ModelMgr.I.GameLevelModel.autoFight = t === EBattleType.GameLevelBoss;
        } else {
            // 不是自动战斗  不做任何处理
        }
    }

    private maxBossLv: number = 0;
    public BossUpState(d: S2CMultiBossUpdateState): void {
        console.log(this.node.active, 'lobby list');
        if (this.node.active === false) return;
        if (!d || d.Data.length <= 0) return;
        const bossNameLy = this.NdBossTips.getChildByName('NdContent').getChildByName('LyBossName');
        bossNameLy.removeAllChildren();
        bossNameLy.destroyAllChildren();
        this.NdBossTips.active = true;
        const NdBossName = this.NdBossTips.getChildByName('NdBossName');
        const bossInfo = ModelMgr.I.BossModel.GetBossBaseInfo(LocalBossPageType.MultiBoss);
        const bossNameList: { id: number, bossName: string, nlevel: number }[] = [];
        const bossId: number[] = [];
        console.log('复活boss列表', d);
        d.Data.forEach((v) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const item = bossInfo.find((k) => k.id === v.Id);
            bossNameList.push({ id: item.id, bossName: item.bossName, nlevel: item.needLevel });
            bossId.push(item.id);
        });
        bossNameList.sort((a, b) => a.nlevel - b.nlevel);
        this.maxBossLv = bossNameList[0].nlevel;
        // bossNameList.forEach((v, i) => {
        const item = cc.instantiate(NdBossName);
        item.active = true;
        bossNameLy.addChild(item);
        item.getComponent(cc.Label).string = bossNameList[0].bossName;
        UtilGame.Click(item, () => {
            ModelMgr.I.BossModel.setJumpToId(bossNameList[0].id);
            WinMgr.I.open(ViewConst.BossWin, BossPageType.Local, LocalBossPageType.MultiBoss);
            this.closBossTips();
        }, this);
        // });
    }

    private onNdTeamClick() {
        ControllerMgr.I.TeamController.linkOpen(ModelMgr.I.TeamModel.myTeamFbId, ViewConst.TeamWin);
    }

    /** 组队满人自动开始战斗的剩余时间 */
    private teamStartBattleTime: number = 0;

    /** 更新成员数量 */
    private onUpdateMember() {
        const num = ModelMgr.I.TeamModel.getTeamMemberNum();
        this.NdTeam.active = num > 0;
        if (this.NdTeam.active) {
            UtilCocos.SetString(this.NdTeam, 'LabelNum', `${num}/${ModelMgr.I.TeamModel.maxMemberNum}`);
        }
    }

    /**
     * 更新组队满人自动开始的开始和结束事件
     */
    private onUpdateTeamBeginAutoStart() {
        this.unschedule(this.onUpdateTeamStartTime);
        if (ModelMgr.I.TeamModel.isCanBeginShowAutoStart()) {
            const endTime = ModelMgr.I.TeamModel.autoStartEndTime;
            this.teamStartBattleTime = endTime - UtilTime.NowSec();
            if (this.teamStartBattleTime > 0) {
                this.schedule(this.onUpdateTeamStartTime, 1);
                this.onUpdateTeamStartTime();
            } else {
                UtilCocos.SetString(this.NdTeam, 'LabelDesc', i18n.tt(Lang.team_icon_start_battle));
            }
        } else if (ModelMgr.I.TeamModel.isFullTeam()) {
            UtilCocos.SetString(this.NdTeam, 'LabelDesc', i18n.tt(Lang.team_icon_full_text));
        } else {
            UtilCocos.SetString(this.NdTeam, 'LabelDesc', i18n.tt(Lang.team_icon_wait_text));
        }
    }

    /** 更新显示满人开始剩下的cd时间 */
    private onUpdateTeamStartTime() {
        UtilCocos.SetString(this.NdTeam, 'LabelDesc', UtilString.FormatArgs(i18n.tt(Lang.team_icon_auto_start), this.teamStartBattleTime));
        this.teamStartBattleTime--;
        if (this.teamStartBattleTime < 0) {
            this.unschedule(this.onUpdateTeamStartTime);
        }
    }

    public closBossTips(): void {
        this.maxBossLv = 0;
        this.NdBossTips.active = false;
    }
}
