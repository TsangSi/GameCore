/*
 * @Author: hwx
 * @Date: 2022-05-09 16:03:06
 * @FilePath: \SanGuo2.4\assets\script\game\module\lobby\v\LobbyUITop.ts
 * @Description: 大厅UI顶部
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { RoleMgr } from '../../role/RoleMgr';
import { RoleAN } from '../../role/RoleAN';
import { LevelUp } from '../../../com/LevelUp';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { RID } from '../../reddot/RedDotConst';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { FoldButton } from '../../../base/components/FoldButton';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { EIdentiType } from '../../../com/msgbox/IdentitykBox';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { FuncId } from '../../../const/FuncConst';
import UtilHead from '../../../base/utils/UtilHead';
import ModelMgr from '../../../manager/ModelMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import UtilNewMark from '../../../base/utils/UtilNewMark';

const { ccclass, property } = cc._decorator;

@ccclass
export class LobbyUITop extends BaseCmp {
    @property({ type: cc.Label, displayName: '战力节点' })
    private LabPower: cc.Label = null;

    @property({ type: cc.Node, displayName: '头像按钮节点' })
    private NdHeadButton: cc.Node = null;

    @property(cc.Node)
    private NdHead: cc.Node = null;

    @property({ type: cc.Label, displayName: '等级标签' })
    private LabLevel: cc.Label = null;

    @property({ type: cc.Label, displayName: '名称标签' })
    private LabName: cc.Label = null;

    @property({ type: cc.Label, displayName: '贵族标签' })
    private LabNoble: cc.Label = null;
    @property(cc.Label)
    private LabNobleName: cc.Label = null;

    @property({ type: cc.Label, displayName: '状态标签' })
    private LabStatus: cc.Label = null;

    @property({ type: cc.Node, displayName: '功能按钮父节点' })
    private NdLayFixedContainer: cc.Node = null;

    @property({ type: cc.Node, displayName: '功能按钮1' })
    private NdBtn1: cc.Node = null;

    @property({ type: cc.Node, displayName: '功能按钮2' })
    private NdBtn2: cc.Node = null;

    @property({ type: cc.Node, displayName: '充值按钮' })
    private NdNoble: cc.Node = null;

    @property({ type: cc.Node, displayName: '防沉迷' })
    private NdLimit: cc.Node = null;

    @property(cc.Node)
    private NdGmBtn: cc.Node = null;

    @property(cc.Node)
    private NdStatus: cc.Node = null;

    @property(FoldButton)
    private btnFold: FoldButton = null;

    @property(cc.Sprite)
    private SprHead: cc.Sprite = null;
    @property(cc.Sprite)
    private SprHeadFrame: cc.Sprite = null;

    private _isFold: boolean = false;

    private onShowNdLayFixedContainer() {
        this.NdLayFixedContainer.active = true;
    }
    private onHideNdLayFixedContainer() {
        this.NdLayFixedContainer.active = false;
    }

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdHead, () => {
            WinMgr.I.open(ViewConst.SettingWin);
        }, this, { scale: 1 });

        UtilGame.Click(this.NdBtn1, () => {
            WinMgr.I.open(ViewConst.VipSuperWin, 1);
        }, this);

        UtilGame.Click(this.NdBtn2, () => {
            if (UtilFunOpen.isOpen(FuncId.RankListLocal, true)) {
                WinMgr.I.open(ViewConst.RankListWin, 0);
            }
        }, this);

        UtilGame.Click(this.NdNoble, () => {
            console.log('打开vip界面');
            WinMgr.I.open(ViewConst.VipSuperWin, 0);
        }, this);

        UtilGame.Click(this.NdStatus, () => {
            ControllerMgr.I.BuffController.linkOpen();
            UtilRedDot.UpdateRed(this.NdStatus, false, cc.v2(31, 11));
        }, this);

        UtilGame.Click(this.NdGmBtn, () => {
            WinMgr.I.open(ViewConst.GMWin);
        }, this);

        UtilGame.Click(this.NdLimit, () => {
            WinMgr.I.open(ViewConst.IdentitykBox, EIdentiType.State);
        }, this);

        this.setPower();
        this.setLevel();
        const role = RoleMgr.I;

        this.setName(role.info.getAreaNick(NickShowType.Nick, false));
        this.setNoble();
        this.setStatus();
        this.headChange();
        this.onE();

        this.NdLimit.active = RoleMgr.I.d.RealNameRealAuth !== 4;
        /** 红点 */
        UtilRedDot.Bind(RID.Vip.Id, this.NdBtn1, cc.v2(30, 28));
        UtilRedDot.Bind(RID.RankList.Id, this.NdBtn2, cc.v2(30, 28));
        UtilRedDot.Bind(RID.Setting.Id, this.NdHeadButton, cc.v2(105, 40));
        /** ‘新’标签 */
        UtilNewMark.Bind(FuncId.Vip, this.NdBtn1, cc.v2(30, 28));
        UtilNewMark.Bind(FuncId.RankListEntrance, this.NdBtn2, cc.v2(30, 28));

        /** 排行榜红点 */
        RedDotMgr.I.updateRedDot(RID.RankList.Mobai.Local, RoleMgr.I.d.RankWorship !== 1 && UtilFunOpen.isOpen(FuncId.RankListLocal, false));
        RedDotMgr.I.updateRedDot(RID.RankList.Mobai.More, RoleMgr.I.d.RankWorshipUnion !== 1 && UtilFunOpen.isOpen(FuncId.RankListCross, false));
        // 头像头像框红点
        this.updateWorldLevelRed();
    }

    private lastLevel: number = 0;
    private updateWorldLevelRed() {
        if (this.lastLevel === 0 && UtilFunOpen.isOpen(FuncId.WorldLevel, false) && UtilFunOpen.isOpen(FuncId.RankListLocal, false)) {
            // 第一次并且世界等级开启了
            RedDotMgr.I.updateRedDot(RID.RankList.WorldLevel, true);
            this.lastLevel = RoleMgr.I.d.Level;
        }
    }

    private _updateName() {
        this.LabName.string = `${RoleMgr.I.info.getAreaNick(NickShowType.Nick)}`;// S${RoleMgr.I.d.ShowAreaId}.
    }

    /** vip变化弹窗 */
    private vipUpdate() {
        console.log('检查到vip等级发生改变');
        WinMgr.I.open(ViewConst.VipUpdateWin);
        this.setNoble();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    private headChange() {
        UtilHead.setHead(UtilHead.ChangeHeadRes(RoleMgr.I.d.HeadIcon, RoleMgr.I.d.Sex), this.SprHead, RoleMgr.I.d.HeadFrame, this.SprHeadFrame);
    }

    private onAddBuff() {
        this.setStatus();
        UtilRedDot.UpdateRed(this.NdStatus, true, cc.v2(31, 11));
    }
    private onUpdateBuffNum() {
        this.setStatus();
    }

    private onE() {
        EventClient.I.on(E.Buff.Add, this.onAddBuff, this);
        EventClient.I.on(E.Buff.Del, this.onUpdateBuffNum, this);
        EventClient.I.on(E.Buff.Update, this.onUpdateBuffNum, this);
        RoleMgr.I.on(this._updateName, this, RoleAN.N.Nick);
        RoleMgr.I.on(this.setPower, this, RoleAN.N.FightValue);
        RoleMgr.I.on(this.setLevel, this, RoleAN.N.Level);
        RoleMgr.I.on(this.vipUpdate, this, RoleAN.N.VipLevel);
        RoleMgr.I.on(this.headChange, this, RoleAN.N.HeadIcon, RoleAN.N.HeadFrame, RoleAN.N.Sex);
        // 改名后更新
        EventClient.I.on(E.Battle.Start, this.battleStart, this);
        EventClient.I.on(E.Battle.End, this.battleEnd, this);
        EventClient.I.on(E.Lobby.TopFuncBtnHide, this.onHideNdLayFixedContainer, this);
        EventClient.I.on(E.Lobby.TopFuncBtnShow, this.onShowNdLayFixedContainer, this);
        // 晋升成功
        // EventClient.I.on(E.ArmyLevel.ArmyUp, this.setStatus, this);
    }

    private remE() {
        EventClient.I.off(E.Buff.Add, this.onAddBuff, this);
        EventClient.I.off(E.Buff.Del, this.onUpdateBuffNum, this);
        EventClient.I.off(E.Buff.Update, this.onUpdateBuffNum, this);
        RoleMgr.I.off(this._updateName, this, RoleAN.N.Nick);

        RoleMgr.I.off(this.setPower, this, RoleAN.N.FightValue);
        RoleMgr.I.off(this.setLevel, this, RoleAN.N.Level);
        RoleMgr.I.off(this.vipUpdate, this, RoleAN.N.VipLevel);
        RoleMgr.I.off(this.headChange, this, RoleAN.N.HeadIcon, RoleAN.N.HeadFrame, RoleAN.N.Sex);
        // 改名后更新
        EventClient.I.off(E.Battle.Start, this.battleStart, this);
        EventClient.I.off(E.Battle.End, this.battleEnd, this);
        EventClient.I.off(E.Lobby.TopFuncBtnHide, this.onHideNdLayFixedContainer, this);
        EventClient.I.off(E.Lobby.TopFuncBtnShow, this.onShowNdLayFixedContainer, this);
        // EventClient.I.off(E.ArmyLevel.ArmyUp, this.setStatus, this);
    }

    /**
     * 设置战力
     */
    public setPower(): void {
        this.LabPower.string = UtilNum.ConvertFightValue(RoleMgr.I.d.FightValue);// `${RoleMgr.I.d.FightValue}`;
    }

    /**
     * 设置等级
     */
    public setLevel(): void {
        let lv = RoleMgr.I.d.Level;
        if (lv <= 0) lv = 1;
        this.LabLevel.string = `${lv}`;
        LevelUp.show(lv);

        this.updateWorldLevelRed();
    }

    /**
     * 设置名字
     * @param name 名字
     */
    public setName(name: string): void {
        this.LabName.string = UtilGame.ShowNick(RoleMgr.I.d.ShowAreaId, name);
    }

    public setNoble(): void {
        // this.LabNoble.string = noble.toString();
        // this.LabNobleName.string = ModelMgr.I.VipModel.getVipName(RoleMgr.I.d.VipLevel);
    }

    public setStatus(): void {
        // 暂时改为军衔
        // const armyLv = RoleMgr.I.getArmyLevel();
        // const armyStar = RoleMgr.I.getArmyStar();
        // const model: ArmyLevelModel = ModelMgr.I.ArmyLevelModel;
        // const url: string = model.getNameIconByArmyLv(armyLv);
        // this.SprArmy.loadImage(url, 1, true);
        /** 当前军衔等级 */
        // if (armyLv === 0 && armyStar === 0) {
        //     this.LabStatus.node.active = false;
        // } else {
        //     this.LabStatus.node.active = true;
        //     this.LabStatus.string = `${armyStar}${i18n.lv}`;// 级
        //     const colorStr: string = ArmyLvConst.getLvColorByArmyLV(armyLv, true);
        //     this.LabStatus.color = new Color(colorStr);
        // }
        const length = ModelMgr.I.BuffModel.getBuffNum();
        this.LabStatus.string = `${length}`;
    }

    /** 监听战斗开始调用 */
    private battleStart() {
        this.btnFold.setFoldState(true);
    }
    /** 监听战斗结束调用 */
    private battleEnd() {
        this.btnFold.setFoldState(false);
    }
    /**
     * 折叠容器
     */
    public onFoldState(isFold: boolean): void {
        cc.Tween.stopAllByTarget(this.NdHeadButton);
        cc.Tween.stopAllByTarget(this.NdLayFixedContainer);
        this._isFold = isFold;
        if (isFold) {
            this.moveLayFixed(cc.v2(this.NdLayFixedContainer.position.x, 70), () => {
                this.NdLayFixedContainer.active = false;
            });
            this.moveHeadBtn(cc.v2(this.NdHeadButton.position.x, 58), () => {
                this.NdHeadButton.active = false;
            });
        } else {
            this.moveLayFixed(cc.v2(this.NdLayFixedContainer.position.x, -91), () => {
                this.NdLayFixedContainer.active = true;
            });
            this.moveHeadBtn(cc.v2(this.NdHeadButton.position.x, -58), () => {
                this.NdHeadButton.active = true;
            });
        }
    }

    /**
     * 缩放折叠容器
     * @param v3 缩放值
     */
    private moveLayFixed(v3: cc.Vec2, end?: () => void): void {
        cc.Tween.stopAllByTarget(this.NdLayFixedContainer);
        cc.tween(this.NdLayFixedContainer).to(0.2, { position: cc.v3(v3.x, v3.y, 0) }).call(end).start();
    }

    /**
     * 移动头像框
     * @param v3
     */
    private moveHeadBtn(v3: cc.Vec2, end?: () => void): void {
        cc.Tween.stopAllByTarget(this.NdHeadButton);
        cc.tween(this.NdHeadButton).to(0.2, { position: cc.v3(v3.x, v3.y, 0) }).call(end).start();
    }
}
