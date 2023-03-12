/*
 * @Author: zs
 * @Date: 2022-11-10 20:20:33
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\MyTeamView.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import BaseUiView from '../../../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../../base/anim/AnimCfg';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../../base/utils/UtilCurrency';
import { NickShowType, UtilGame } from '../../../../base/utils/UtilGame';
import { BattleCommon } from '../../../../battle/BattleCommon';
import { ShareToChat } from '../../../../com/ShareToChat';
import { E } from '../../../../const/EventName';
import { RES_ENUM } from '../../../../const/ResPath';
import { ViewConst } from '../../../../const/ViewConst';
import EntityUiMgr from '../../../../entity/EntityUiMgr';
import ControllerMgr from '../../../../manager/ControllerMgr';
import { EffectMgr } from '../../../../manager/EffectMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import MapCfg, { EMapFbInstanceType } from '../../../../map/MapCfg';
import { EBattleType } from '../../../battleResult/BattleResultConst';
import { ChatShowItemType, CHAT_CHANNEL_ENUM } from '../../../chat/ChatConst';
import { RoleInfo } from '../../../role/RoleInfo';
import { RoleMgr } from '../../../role/RoleMgr';
import { ETeamViewType } from '../../../team/TeamConst';
import { TeamModel } from '../../../team/TeamModel';
import { EVipFuncType } from '../../../vip/VipConst';

const { ccclass, property } = cc._decorator;
/** 队长位置永远都是1 */
const CAP_POS = 1;
@ccclass
export class MyTeamView extends BaseUiView {
    @property(cc.Node)
    private NodeAvatar: cc.Node = null;
    /** 喊话 */
    @property(cc.Node)
    private BtnSay: cc.Node = null;
    /** 自动匹配 */
    @property(cc.Node)
    private BtnAuto: cc.Node = null;
    /** 自动匹配中 */
    @property(cc.Node)
    private BtnAutoing: cc.Node = null;
    /** 军团加成 */
    @property(cc.Node)
    private BtnAddEffect: cc.Node = null;
    /** 开始战斗 */
    @property(cc.Node)
    private BtnBattle: cc.Node = null;
    /** 退出队伍 */
    @property(cc.Node)
    private BtnExit: cc.Node = null;
    /** 邀请按钮2 */
    @property(cc.Node)
    private BtnAdd2: cc.Node = null;
    /** 邀请按钮3 */
    @property(cc.Node)
    private BtnAdd3: cc.Node = null;
    /** 解散队伍按钮 */
    @property(cc.Node)
    private BtnDiss: cc.Node = null;
    /** 踢出队友2 */
    @property(cc.Node)
    private BtnKick2: cc.Node = null;
    /** 踢出队友3 */
    @property(cc.Node)
    private BtnKick3: cc.Node = null;
    /** 设置 */
    @property(cc.Node)
    private BtnSet: cc.Node = null;
    /** 购买次数 */
    @property(cc.Node)
    private BtnAddNum: cc.Node = null;
    /** 满人自动开始勾选框 */
    @property(cc.Toggle)
    private ToggleAutoStart: cc.Toggle = null;
    /** 战力输入框 */
    @property(cc.EditBox)
    private EditBox: cc.EditBox = null;
    /** 输入框底 */
    @property(cc.Node)
    private EditBoxBg: cc.Node = null;
    /** 奖励次数 */
    @property(cc.Label)
    private LabelNum: cc.Label = null;
    /** 满人自动开始倒计时 */
    @property(cc.Label)
    private LabelTime: cc.Label = null;
    /** 满人自动开始 */
    @property(cc.Label)
    private LabelDesc: cc.Label = null;
    /** 是否自动匹配中 */
    private isAutoMatch: boolean = false;

    /** 战力限制 */
    private fightvalue: number = 0;
    private rolesByPos: { [pos: number]: RoleInfo } = cc.js.createMap(true);
    protected onLoad(): void {
        super.onLoad();
        this.node.on('PageRefreshEvent', this.onPageRefreshEvent, this);
        UtilGame.Click(this.BtnSay, this.onBtnSayClicked, this);
        UtilGame.Click(this.BtnAuto, this.onBtnAutoClicked, this);
        UtilGame.Click(this.BtnAutoing, this.onBtnAutoClicked, this);
        UtilGame.Click(this.BtnAddEffect, this.onBtnAddEffectClicked, this);
        UtilGame.Click(this.BtnBattle, this.onBtnBattleClicked, this);
        UtilGame.Click(this.BtnExit, this.onBtnExitClicked, this);
        UtilGame.Click(this.BtnAdd2, this.onBtnAdd2Clicked, this);
        UtilGame.Click(this.BtnAdd3, this.onBtnAdd3Clicked, this);
        UtilGame.Click(this.BtnDiss, this.onBtnDissClicked, this);
        UtilGame.Click(this.BtnKick2, this.onBtnKick2Clicked, this);
        UtilGame.Click(this.BtnKick3, this.onBtnKick3Clicked, this);
        UtilGame.Click(this.BtnAddNum, this.onBtnAddNumClicked, this);
        UtilGame.Click(this.BtnSet, this.onBtnSetClicked, this);
        UtilGame.Click(this.ToggleAutoStart.node, this.onToggleAutoStart, this);
        EventClient.I.on(E.Team.UpdateMember, this.onUpdateMember, this);
        EventClient.I.on(E.Team.UpdateBuyPassTime, this.onUpdateBuyPassTime, this);
        EventClient.I.on(E.Team.UpdatePowerLimit, this.onUpdatePowerLimit, this);
        EventClient.I.on(E.Team.BeginAutoMatch, this.onBeginAutoMatch, this);
        EventClient.I.on(E.Team.EndAutoMatch, this.onEndAutoMatch, this);
        EventClient.I.on(E.Team.BeginAutoStart, this.onBeginAutoStart, this);
        EventClient.I.on(E.Team.EndAutoStart, this.onEndAutoStart, this);

        if (ModelMgr.I.TeamModel.hasTeam()) {
            this.onUpdateMember();
        }

        if (ModelMgr.I.TeamModel.autoMatch) {
            this.onBeginAutoMatch();
        }
        this.ToggleAutoStart.isChecked = ModelMgr.I.TeamModel.autoStart;
    }

    protected onEnable(): void {
        this.updateBtnActive();
    }

    private updateBtnActive() {
        const isCap = ModelMgr.I.TeamModel.isCap();
        this.BtnSay.active = isCap;
        this.BtnAuto.active = isCap && !this.isAutoMatch;
        this.ToggleAutoStart.node.active = isCap;
        this.BtnSet.active = isCap;
        // UtilCocos.SetSpriteGray(this.EditBox.background.node, !isCap);
        this.EditBoxBg.opacity = !isCap ? 128 : 255;
        this.EditBox.enabled = isCap;
        this.BtnBattle.active = isCap;
        this.BtnExit.active = !isCap;
        if (isCap) {
            this.LabelDesc.string = i18n.tt(Lang.team_page_cap_desc);
        } else {
            this.LabelDesc.string = i18n.tt(Lang.team_page_normalldesc);
        }
    }

    /** 副本类型 */
    private fbType: number;
    /** 副本id */
    private fbId: number;
    private onPageRefreshEvent(fbType: number, fbId: number): void {
        this.fbType = fbType;
        this.fbId = fbId;
        this.updateBuyPassTime(fbType);
        if (ModelMgr.I.TeamModel.hasTeam()) {
            //
        } else if (ModelMgr.I.TeamModel.getPassTime(fbType)) {
            ControllerMgr.I.TeamController.C2STeamDunCreate(this.fbId);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_battle_num_tips));
        }
    }

    /** 更新队员 */
    private onUpdateMember() {
        this.updateBtnActive();
        this.fightvalue = ModelMgr.I.TeamModel.myTeamFV;
        this.onEditBoxReturn();
        for (let i = 0; i < 3; i++) {
            this.updateMember(i + 1, ModelMgr.I.TeamModel.getTeamMemberByPos(i + 1));
        }
    }

    /**
     * 更新队伍
     * @param pos 位置
     * @param member 队员信息
     */
    private updateMember(pos: number, member?: TeamMember) {
        const node = this.NodeAvatar.children[pos - 1];
        if (member) {
            UtilCocos.SetActive(this.NodeAvatar.getChildByName(`NdNone${pos}`), false);
            let role: RoleInfo;
            if (this.rolesByPos[pos]?.userID === member.UserId) {
                role = this.rolesByPos[pos];
            } else if (member.UserId === RoleMgr.I.d.UserId) {
                role = RoleMgr.I.info;
            } else {
                role = new RoleInfo({ A: member.IntAttr, B: member.StrAttr });
                role.userID = member.UserId;
            }
            const nodeAnim = node.getChildByName('NdAnim');
            // eslint-disable-next-line dot-notation
            if (nodeAnim['userId'] !== role.userID) {
                nodeAnim.attr({ userId: role.userID });
                nodeAnim.destroyAllChildren();
                EntityUiMgr.I.createAttrEntity(nodeAnim, {
                    isShowTitle: false,
                    resType: ANIM_TYPE.ROLE,
                    isPlayUs: false,
                }, role);
            }
            UtilCocos.SetString(node, 'NameBg/layout/LabelName', role.getAreaNick(NickShowType.ArenaNick));
            UtilCocos.SetString(node, 'NameBg/LabelFv', UtilNum.ConvertFightValue(role.d.FightValue));
            UtilCocos.SetActive(node, 'NameBg/layout/SpriteCap', pos === CAP_POS);
            this.rolesByPos[pos] = role;
            node.active = true;
            if (ModelMgr.I.TeamModel.isCap()) {
                UtilCocos.SetActive(node, 'BtnOper', true);
            } else {
                UtilCocos.SetActive(node, 'BtnOper', false);
            }
        } else {
            UtilCocos.SetActive(this.NodeAvatar.getChildByName(`NdNone${pos}`), true);
            const nodeAnim = node.getChildByName('NdAnim');
            nodeAnim.destroyAllChildren();
            // eslint-disable-next-line dot-notation
            nodeAnim['userId'] = undefined;
            node.active = false;
        }
        const add: cc.Node = this[`BtnAdd${pos}`];
        if (add) {
            add.active = member ? false : ModelMgr.I.TeamModel.isCap();
        }
    }

    /** 喊话 */
    private onBtnSayClicked() {
        const model = ModelMgr.I.TeamModel;
        const pos = this.BtnSay.convertToWorldSpaceAR(cc.v2(0, -100));
        ShareToChat.show(ChatShowItemType.team, `${model.myTeamFbId},${model.myTeamId}`, pos);
    }

    /** 自动匹配 */
    private onBtnAutoClicked() {
        if (ModelMgr.I.TeamModel.autoMatch) {
            ModelMgr.I.TeamModel.stopAutoMatch();
        } else if (ModelMgr.I.TeamModel.isFullTeam()) {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_auto_match_tips));
        } else {
            ModelMgr.I.TeamModel.startAutoMatch();
        }
    }

    /** 开始匹配 */
    private onBeginAutoMatch() {
        this.isAutoMatch = true;
        this.BtnAutoing.active = true;
        this.BtnAuto.active = false;
        EffectMgr.I.showEffect(RES_ENUM.Com_Ui_9003, this.BtnAutoing, cc.WrapMode.Loop);
    }

    /** 停止匹配 */
    private onEndAutoMatch() {
        this.isAutoMatch = false;
        EffectMgr.I.delEffect(RES_ENUM.Com_Ui_111, this.BtnAutoing);
        this.BtnAutoing.active = false;
        this.BtnAuto.active = true;
    }

    /** 自动开始的倒计时 */
    private onBeginAutoStart() {
        const time = ModelMgr.I.TeamModel.autoStartEndTime;
        if (time > 0) {
            this.LabelTime.string = `(${time - UtilTime.NowSec()}) `;
        } else {
            this.LabelTime.string = '';
        }
    }
    private onEndAutoStart() {
        this.LabelTime.string = '';
    }

    /** 军团加成 */
    private onBtnAddEffectClicked() {
        //
    }

    /** 开始战斗 */
    private onBtnBattleClicked() {
        if (!ModelMgr.I.TeamModel.isCap()) {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_battle_cap_tips));
        } else if (ModelMgr.I.TeamModel.getPassTime(this.fbType) <= 0) {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_battle_num_tips));
        } else if (ModelMgr.I.TeamModel.isFullTeam()) {
            ModelMgr.I.TeamModel.stopAutoMatch();
            BattleCommon.I.enter(EBattleType.TeamFB_PVE);
        } else {
            ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.team_msgbox_startbattle), UtilColor.NorV), () => {
                ModelMgr.I.TeamModel.stopAutoMatch();
                BattleCommon.I.enter(EBattleType.TeamFB_PVE);
            }, { showToggle: 'TeamStartBattle', tipTogState: false });
        }
    }

    /** 退出队伍 */
    private onBtnExitClicked() {
        ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.team_list_exit_tips), UtilColor.NorV), () => {
            ControllerMgr.I.TeamController.C2STeamDunLeaveOrCancel();
        });
    }

    /** 邀请位置2 */
    private onBtnAdd2Clicked() {
        WinMgr.I.open(ViewConst.InvitePlayerWin, CHAT_CHANNEL_ENUM.Current);
    }

    /** 邀请位置3 */
    private onBtnAdd3Clicked() {
        WinMgr.I.open(ViewConst.InvitePlayerWin, CHAT_CHANNEL_ENUM.Current);
    }

    /** 解散队伍 */
    private onBtnDissClicked() {
        ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.team_msgbox_dissolve), UtilColor.NorV), () => {
            ControllerMgr.I.TeamController.C2STeamDunLeaveOrCancel();
        });
    }

    /** 踢出位置2的玩家 */
    private onBtnKick2Clicked() {
        this.kickRole(this.rolesByPos[2].userID);
    }

    /** 踢出位置3的玩家 */
    private onBtnKick3Clicked() {
        this.kickRole(this.rolesByPos[3].userID);
    }

    /** 购买次数 */
    private onBtnAddNumClicked() {
        const maxTime: number = ModelMgr.I.TeamModel.cfg.getValueByKey(this.fbType, 'NOLimit');
        if (ModelMgr.I.TeamModel.getPassTime(this.fbType) >= maxTime) {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_add_tips));
        } else {
            const VipCfgConst = this.fbType === ETeamViewType.BingFa ? EVipFuncType.TeamDun1 : EVipFuncType.TeamDun2;
            const { tip, vipLv } = ModelMgr.I.VipModel.getMinTimesCfg(VipCfgConst);
            if (RoleMgr.I.d.VipLevel < vipLv) {
                MsgToastMgr.Show(tip);
                return;
            }
            this.showBuyBox();
        }
    }

    private onBtnSetClicked() {
        if (this.fightvalue <= 0) {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_input_min_tips));
            this.fightvalue = ModelMgr.I.TeamModel.myTeamFV;
            this.onEditBoxReturn();
            return;
        } else if (this.fightvalue >= 10000000000) {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_input_max_tips));
            this.fightvalue = ModelMgr.I.TeamModel.myTeamFV;
            this.onEditBoxReturn();
            return;
        }
        ControllerMgr.I.TeamController.C2STeamDunSetPowerLimit(this.fightvalue);
    }
    private onToggleAutoStart() {
        const newStatus = !this.ToggleAutoStart.isChecked;
        ModelMgr.I.TeamModel.autoStart = newStatus;
    }

    private showBuyBox() {
        const laug = i18n.tt(Lang.arena_challenge_time_unenough_tip);
        const model: TeamModel = ModelMgr.I.TeamModel;
        const haveBuyNum = model.getBuyTime(this.fbType);
        // 计算消耗
        const costInfo = model.getBuyTimesConfig(this.fbType, haveBuyNum);
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
            UtilCurrency.getNameByType(costInfo.type),
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
                    ControllerMgr.I.TeamController.C2STeamDunBuyPassTime(this.fbType);
                    MsgToastMgr.Show(i18n.tt(Lang.com_buy_success));
                }
            }
        }, { showToggle: '', cbCloseFlag: 'TeamBuy' }, null);
    }

    private kickRole(userId: number) {
        // ModelMgr.I.MsgBoxModel.ShowBox(i18n.tt('是否要踢出'), () => {
        ControllerMgr.I.TeamController.C2STeamDunKick(userId);
        // });
    }
    /** 点击输入框触发 */
    private onEditBoxBegan() {
        this.EditBox.string = this.fightvalue.toString();
    }

    private onEditTextChange() {
        this.fightvalue = +this.EditBox.string;
    }

    /** 点击输入框之外触发 */
    private onEditBoxReturn() {
        this.EditBox.string = UtilNum.ConvertFightValue(this.fightvalue);
    }

    private onUpdateBuyPassTime(fbType?: number) {
        this.updateBuyPassTime(fbType);
        const maxTime: number = ModelMgr.I.TeamModel.cfg.getValueByKey(this.fbType, 'NOLimit');
        if (ModelMgr.I.TeamModel.getPassTime(this.fbType) >= maxTime) {
            WinMgr.I.close(ViewConst.ConfirmBox);
        } else {
            this.showBuyBox();
        }
    }

    private updateBuyPassTime(FBType: number) {
        const cfg: Cfg_TeamBoss = ModelMgr.I.TeamModel.cfg.getValueByKey(this.fbType);
        const num = ModelMgr.I.TeamModel.getPassTime(this.fbType);
        this.LabelNum.string = `${num}/${cfg.NOLimit}`;
        this.LabelNum.node.color = num > 0 ? UtilColor.ColorEnough : UtilColor.ColorUnEnough;
    }

    /** 更新限制战力 */
    private onUpdatePowerLimit(fightValue: number) {
        this.fightvalue = fightValue;
        this.onEditBoxReturn();
        MsgToastMgr.Show(i18n.tt(Lang.team_page_input_set_success));
    }

    protected update(dt: number): void {
        const time = ModelMgr.I.TeamModel.autoStartEndTime;
        if (time > 0) {
            this.LabelTime.string = `(${time - UtilTime.NowSec()}) `;
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Team.UpdateMember, this.onUpdateMember, this);
        EventClient.I.off(E.Team.UpdateBuyPassTime, this.onUpdateBuyPassTime, this);
        EventClient.I.off(E.Team.UpdatePowerLimit, this.onUpdatePowerLimit, this);
        EventClient.I.off(E.Team.BeginAutoMatch, this.onBeginAutoMatch, this);
        EventClient.I.off(E.Team.EndAutoMatch, this.onEndAutoMatch, this);
        EventClient.I.off(E.Team.BeginAutoStart, this.onBeginAutoStart, this);
        EventClient.I.off(E.Team.EndAutoStart, this.onEndAutoStart, this);
    }
}
