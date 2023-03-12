import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../base/utils/UtilGame';
import { FoldButton } from '../../../base/components/FoldButton';
import { LobbySuctionGold } from './LobbySuctionGold';
import { LobbyMoreFeature } from './LobbyMoreFeature';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { BagMgr } from '../../bag/BagMgr';
import { ChatBoard } from '../../chat/ChatBoard';
import { RoleMgr } from '../../role/RoleMgr';
import { RoleAN } from '../../role/RoleAN';
import { RID } from '../../reddot/RedDotConst';
import { ItemBagType } from '../../../com/item/ItemConst';
import ModelMgr from '../../../manager/ModelMgr';
import Progress, { LableStyle } from '../../../base/components/Progress';
import { GuideMgr } from '../../../com/guide/GuideMgr';
import { GuideBtnIds } from '../../../com/guide/GuideConst';
import GameApp from '../../../base/GameApp';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MapCfg from '../../../map/MapCfg';
import { FuBenMgr } from '../../fuben/FuBenMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { FuncId } from '../../../const/FuncConst';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { SmeltViewId } from '../../smelt/SmeltConst';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { ELobbyViewType } from '../LobbyConst';
import UtilNewMark from '../../../base/utils/UtilNewMark';

const { ccclass, property } = cc._decorator;

@ccclass
export class LobbyUIBottom extends BaseCmp {
    @property({ type: cc.Layout, displayName: '公告容器' })
    private LayContainer: cc.Layout = null;

    @property({ type: LobbySuctionGold, displayName: '吸金动画' })
    private NdSuctionGold: LobbySuctionGold = null;

    @property({ type: cc.Node, displayName: '主城按钮节点' })
    private NdCityButton: cc.Node = null;

    @property({ type: cc.Node, displayName: '角色按钮节点' })
    private NdRoleButton: cc.Node = null;

    @property(cc.Node)
    private NdEquipButton: cc.Node = null;

    @property(cc.Node)
    private BtnGeneral: cc.Node = null;

    @property({ type: cc.Node, displayName: '进阶按钮节点' })
    private NdGradeButton: cc.Node = null;

    @property({ type: cc.Node, displayName: '锻造按钮节点' })
    private BtnDuanzao: cc.Node = null;

    @property({ type: cc.Node, displayName: '势力按钮节点' })
    private BtnShili: cc.Node = null;

    @property({ type: FoldButton, displayName: '更多按钮节点' })
    private NdMoreButton: FoldButton = null;

    @property({ type: Progress, displayName: '经验条' })
    private BarPlayerExp: Progress = null;

    @property({ type: cc.Prefab, displayName: '更多面板预制' })
    private PfbMoreFeature: cc.Prefab = null;

    // 进入世家对以下4部分做显示隐藏
    @property(cc.Node)
    private NdShop: cc.Node = null;
    @property({ type: cc.Node, displayName: '背包按钮节点' })
    private NdBagButton: cc.Node = null;
    @property(cc.Node)// 聊天背景
    private NdChatBg: cc.Node = null;
    @property({ type: cc.Node, displayName: '公告板节点' })
    private NdBulletinBoard: cc.Node = null;

    private moreFeature: LobbyMoreFeature = null;

    /** 展示在国士中 子节点索引 */
    private readonly ForgeIndexs: string[] = ['NdBeauty', 'NdAdviser'];
    /** 展示在更多中 子节点索引  [2, 3]; */
    private readonly MoreIndexs: string[] = ['NdCollectionBook'];

    protected onEnable(): void {
        EventClient.I.on(E.Bag.FullStateChange, this.onBagFullStateChange, this);
        // const isOpenFamily = WinMgr.I.checkIsOpen(ViewConst.FamilyWin);
        // 刷新背包满字状态
        const isFullBag = BagMgr.I.isFullBag();
        this.onBagFullStateChange(isFullBag);
        if (!this.NdBulletinBoard.active) {
            if (!this._hideAll) {
                this.NdBulletinBoard.active = true;
            }
        }
    }

    protected onDisable(): void {
        EventClient.I.on(E.Bag.FullStateChange, this.onBagFullStateChange, this);
    }

    protected start(): void {
        super.start();

        this.clk();
        this.onE();

        // 绑定红点// 商城红点
        UtilRedDot.Bind(RID.Shop.Id, this.NdShop, cc.v2(25, 20));
        UtilRedDot.Bind(RID.Bag.Id, this.NdBagButton, cc.v2(25, 75));
        UtilRedDot.Bind(RID.Role.Id, this.NdRoleButton, cc.v2(20, 70));
        UtilRedDot.Bind(RID.Equip.Id, this.NdEquipButton, cc.v2(20, 70));
        UtilRedDot.Bind(RID.Grade.Id, this.NdGradeButton, cc.v2(20, 70));
        UtilRedDot.Bind(RID.General.Id, this.BtnGeneral, cc.v2(20, 70));
        UtilRedDot.Bind(RID.Forge.Id, this.BtnDuanzao, cc.v2(20, 70));
        UtilRedDot.Bind(RID.More.Id, this.NdMoreButton.node, cc.v2(20, 70));
        UtilRedDot.Bind(RID.Family.Id, this.BtnShili, cc.v2(20, 70));
        // 绑定'新'标签
        UtilNewMark.Bind(FuncId.RoleEntrance, this.NdRoleButton, cc.v2(23, 68));
        UtilNewMark.Bind(FuncId.EquipEntrance, this.NdEquipButton, cc.v2(23, 68));
        UtilNewMark.Bind(FuncId.GradeEntrance, this.NdGradeButton, cc.v2(23, 68));
        UtilNewMark.Bind(FuncId.GeneralEntrance, this.BtnGeneral, cc.v2(23, 68));
        UtilNewMark.Bind(FuncId.BeautyEntrance, this.BtnDuanzao, cc.v2(23, 68));
        UtilNewMark.Bind(FuncId.MoreEntrance, this.NdMoreButton.node, cc.v2(23, 68));
        // 绑引导
        GuideMgr.I.bindScript(GuideBtnIds.Bag, this.NdBagButton, this.node.parent);
        GuideMgr.I.bindScript(GuideBtnIds.General, this.BtnGeneral, this.node.parent);
        GuideMgr.I.bindScript(GuideBtnIds.Role, this.NdRoleButton, this.node.parent);
        GuideMgr.I.bindScript(GuideBtnIds.Equip, this.NdEquipButton, this.node.parent);
        GuideMgr.I.bindScript(GuideBtnIds.Grade, this.NdGradeButton, this.node.parent);

        this.setPlayerExp();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    private onE() {
        EventClient.I.on(E.Lobby.BootomSuctionGoldHide, this.onHideNdSuctionGold, this);
        EventClient.I.on(E.Lobby.BootomSuctionGoldShow, this.onShowNdSuctionGold, this);

        RoleMgr.I.on(this.setPlayerExp, this, RoleAN.N.RoleExp, RoleAN.N.Level);
        EventClient.I.on(E.Chat.LobbyShowBoard, this.LobbyShowBoard, this);

        EventClient.I.on(E.Battle.Start, this.onStar, this);
        EventClient.I.on(E.Battle.End, this.onEnd, this);
    }

    private remE() {
        EventClient.I.off(E.Lobby.BootomSuctionGoldHide, this.onHideNdSuctionGold, this);
        EventClient.I.off(E.Lobby.BootomSuctionGoldShow, this.onShowNdSuctionGold, this);

        RoleMgr.I.off(this.setPlayerExp, this, RoleAN.N.RoleExp, RoleAN.N.Level);
        EventClient.I.off(E.Chat.LobbyShowBoard, this.LobbyShowBoard, this);

        EventClient.I.off(E.Battle.Start, this.onStar, this);
        EventClient.I.off(E.Battle.End, this.onEnd, this);
    }

    private onStar() {
        if (this.curViewType === ELobbyViewType.Family) {
            this.setBottomOtherActive(true);
        }
    }

    private onEnd() {
        if (this.curViewType === ELobbyViewType.Family) {
            this.setBottomOtherActive(false);
        }
    }
    /** 显示吸金节点 */
    private onShowNdSuctionGold() {
        if (WinMgr.I.checkIsOpen(ViewConst.MainCity) // 在主城界面  或者 战斗中就不处理显示
            || GameApp.I.IsBattleIng
            || MapCfg.I.isInFuben
            || this._hideAll
        ) {
            this.NdSuctionGold.node.active = false;
        } else {
            this.NdSuctionGold.node.active = true;
        }
    }

    /** 隐藏吸金节点 */
    private onHideNdSuctionGold() {
        this.NdSuctionGold.node.active = false;
    }

    private curViewType: ELobbyViewType = ELobbyViewType.YeWai;
    private changeViewType(type: ELobbyViewType) {
        if (this.curViewType === type) {
            return;
        }
        const lastType = this.curViewType;
        this.curViewType = type;
        switch (type) {
            case ELobbyViewType.YeWai:
                break;
            case ELobbyViewType.MainCity:
                this.setMainCityActive(true);
                break;
            case ELobbyViewType.Family:
                this.setFamilyActive(true);
                break;
            default:
                break;
        }
        if (lastType === ELobbyViewType.Family) {
            this.setFamilyActive(false);
        }
        if (lastType === ELobbyViewType.MainCity) {
            this.setMainCityActive(false);
        }
        EventClient.I.emit(E.Lobby.ChangeViewType, type);
    }

    private _hideAll: boolean = false;
    private setBottomOtherActive(active: boolean) {
        // if (params === FromPage.FamilyHome) {
        this.NdShop.active = active;
        this.NdBagButton.active = active;
        this.NdChatBg.active = active;
        this.NdBulletinBoard.active = active;
        this._hideAll = !active;
        if (!active) {
            EventClient.I.emit(E.Chat.LobbyShowBoard, false);
            EventClient.I.emit(E.Chat.CloseChatWin);
            // } else {
            // EventClient.I.emit(E.Chat.CloseChatWin);

            // WinMgr.I.open(ViewConst.ChatWin);
        }
    }

    private setFamilyActive(active: boolean) {
        if (active) {
            WinMgr.I.open(ViewConst.FamilyHomePage);
            this.setBottomOtherActive(false);
        } else {
            this.setBottomOtherActive(true);
            WinMgr.I.close(ViewConst.FamilyHomePage);
        }
        this._isInFamily = active;
    }
    private setMainCityActive(active: boolean) {
        if (active) {
            WinMgr.I.open(ViewConst.MainCity);
        } else {
            WinMgr.I.close(ViewConst.MainCity);
        }
    }

    private _isInFamily: boolean = false;
    private clk() {
        UtilGame.Click(this.NdBulletinBoard, () => {
            // WinMgr.I.open(ViewConst.ChatWin);
            // 手动关闭@节点
            this.NdBulletinBoard.getComponent(ChatBoard).closeAtMe();
        }, this, { scale: 1 });

        UtilGame.Click(this.NdSuctionGold.node, () => {
            if (UtilFunOpen.isOpen(FuncId.OnHook, true)) {
                WinMgr.I.open(ViewConst.OnHookWin, 0);
            }
        }, this);

        UtilGame.Click(this.NdCityButton, () => {
            if (WinMgr.I.checkIsOpen(ViewConst.MainCity)) {
                this.changeViewType(ELobbyViewType.YeWai);
                // WinMgr.I.close(ViewConst.MainCity);
            } else if (GameApp.I.IsBattleIng) {
                MsgToastMgr.Show(i18n.tt(Lang.maincity_no_open_tips));
            } else if (MapCfg.I.isYeWai) {
                // WinMgr.I.open(ViewConst.MainCity);
                // if (WinMgr.I.checkIsOpen(ViewConst.FamilyHomePage)) {
                //     WinMgr.I.close(ViewConst.FamilyHomePage);
                // }
                this.changeViewType(ELobbyViewType.MainCity);
            } else if (MapCfg.I.isBeaconWar) {
                const name: string = UtilFunOpen.getDesc(FuncId.BeaconWar);
                const str: string = UtilString.FormatArray(
                    i18n.tt(Lang.maincity_beaconWar_msgbox),
                    [name, UtilColor.NorV],
                );

                FuBenMgr.I.quitFuBen(true, str, () => {
                    ControllerMgr.I.BeaconWarController.reqExit();
                    // WinMgr.I.open(ViewConst.MainCity);
                    this.changeViewType(ELobbyViewType.MainCity);
                }, this, { showToggle: 'QuitBeaconWar' });
            } else {
                FuBenMgr.I.quitFuBen(true, UtilString.FormatArgs(i18n.tt(Lang.maincity_no_open_tips_msgbox), UtilColor.NorV), () => {
                    ControllerMgr.I.WorldBossController.C2SExitWorldBoss();
                    // WinMgr.I.open(ViewConst.MainCity);
                    this.changeViewType(ELobbyViewType.MainCity);
                });
            }
        }, this);

        UtilGame.Click(this.NdRoleButton, () => {
            if (UtilFunOpen.isOpen(FuncId.Role, true)) {
                WinMgr.I.open(ViewConst.RoleWin, 0);
            }
            if (this.NdRoleButton.getChildByName('NewMark')) {
                UtilFunOpen.CheckClick(FuncId.RoleEntrance);
            }
        }, this);

        UtilGame.Click(this.NdEquipButton, () => {
            if (UtilFunOpen.isOpen(FuncId.EquipStrength, true)) {
                WinMgr.I.open(ViewConst.EquipWin);
            }
            if (this.NdEquipButton.getChildByName('NewMark')) {
                UtilFunOpen.CheckClick(FuncId.EquipEntrance);
            }
        }, this);

        UtilGame.Click(this.BtnGeneral, () => {
            const isOpen = ModelMgr.I.GeneralModel.openGeneral();
            if (isOpen && this.BtnGeneral.getChildByName('NewMark')) {
                UtilFunOpen.CheckClick(FuncId.GeneralEntrance);
            }
        }, this);

        UtilGame.Click(this.NdGradeButton, () => {
            // 若不指定页签参数param GradeType, GradePageTabType ,skinId 为指定皮肤id ,优先红点标签
            WinMgr.I.open(ViewConst.GradeWin);
            if (this.NdGradeButton.getChildByName('NewMark')) {
                UtilFunOpen.CheckClick(FuncId.GradeSmelt); // FuncId.GradeSmelt待定
            }
        }, this);

        UtilGame.Click(this.BtnDuanzao, () => {
            this.showMorePanel(this.ForgeIndexs, 0);
            if (this.BtnDuanzao.getChildByName('NewMark')) {
                UtilFunOpen.CheckClick(FuncId.BeautyEntrance);
            }
        }, this);

        UtilGame.Click(this.BtnShili, () => {
            if (GameApp.I.IsBattleIng) {
                MsgToastMgr.Show(i18n.tt(Lang.family_no_open_tips));
            } else if (!this._isInFamily) {
                if (!WinMgr.I.checkIsOpen(ViewConst.FamilyHomePage) && UtilFunOpen.isOpen(FuncId.FamilyHome, true)) {
                    this.changeViewType(ELobbyViewType.Family);
                }
            } else {
                this.changeViewType(ELobbyViewType.YeWai);
            }
        }, this);

        UtilGame.Click(this.NdMoreButton.node, () => {
            this.showMorePanel(this.MoreIndexs, 1);
            if (this.NdMoreButton.node.getChildByName('NewMark')) {
                UtilFunOpen.CheckClick(FuncId.MoreEntrance);
            }
        }, this);

        UtilGame.Click(this.NdBagButton, () => {
            if (UtilFunOpen.isOpen(FuncId.Bag, true)) {
                WinMgr.I.open(ViewConst.BagWin, 0, 1, 1);
                const ownSize: number = BagMgr.I.getItemOwnSize(ItemBagType.EQUIP_ROLE);
                const totalSize = BagMgr.I.getGridSize(ItemBagType.EQUIP_ROLE);
                if (ownSize / totalSize >= 0.8) {
                    if (UtilFunOpen.isOpen(FuncId.Smelt, true)) {
                        ControllerMgr.I.SmeltController.linkOpen(SmeltViewId.SIMPLE_MELT);
                    }
                    if (GuideMgr.I.isDoing && GuideMgr.I.isNextStepBtnId(GuideBtnIds.BagSmelt)) {
                        GuideMgr.I.nextGuide();
                    }
                }
            }
            if (this.NdBagButton.getChildByName('NewMark')) {
                UtilFunOpen.CheckClick(FuncId.Bag);
            }
        }, this);
        UtilGame.Click(this.NdShop, () => {
            if (UtilFunOpen.isOpen(FuncId.ItemShop, true)) {
                WinMgr.I.open(ViewConst.ShopWin);
            }
            if (this.NdShop.getChildByName('NewMark')) {
                UtilFunOpen.CheckClick(FuncId.ItemShop);
            }
        }, this);
    }

    private dismissChatWin() {
        EventClient.I.emit(E.Chat.CloseChatView);
    }

    private LobbyShowBoard(sta: boolean) {
        // const isOpenFamily = WinMgr.I.checkIsOpen(ViewConst.FamilyWin);
        this.NdBulletinBoard.active = sta && !this._hideAll;
        if (sta) {
            const board = this.NdBulletinBoard.getComponent(ChatBoard);
            board.updateUI();
            this.onShowNdSuctionGold();
        } else {
            this.onHideNdSuctionGold();
        }
    }

    public setPlayerExp(): void {
        const cur: number = RoleMgr.I.d.RoleExp;
        let next: number = RoleMgr.I.getNextExp();
        if (next < cur) {
            next = cur;
        }

        if (RoleMgr.I.isMaxExp()) {
            this.BarPlayerExp.updateProgress(1, 1, false);
            this.BarPlayerExp.labelStyle = LableStyle.OnlyText;
        } else {
            this.BarPlayerExp.labelStyle = LableStyle.NumExceed;
            this.BarPlayerExp.updateProgress(cur, next, true);
        }
    }

    private onMorePanelHide(): void {
        this.NdMoreButton.setFoldState(true);
    }

    private showMorePanel(indexs: string[], type?: number): void {
        EventClient.I.emit(E.Win.WinOpen);
        if (!this.moreFeature) {
            const node = cc.instantiate(this.PfbMoreFeature);
            this.node.parent.addChild(node);

            const comp = node.getComponent(LobbyMoreFeature);
            comp.onHide(this.onMorePanelHide, this);
            this.moreFeature = comp;
        }
        this.moreFeature.LayFoldContainer.node.x = type === 0 ? -30 : 50;// 版署先这样特殊处理
        this.moreFeature.init(indexs);
        this.moreFeature.show();
    }

    private onBagFullStateChange(isFull: boolean) {
        const isOpenFamily = WinMgr.I.checkIsOpen(ViewConst.FamilyWin);
        if (!isOpenFamily) { // 如果进入世家，则不能显示背包
            UtilCocos.SetActive(this.NdBagButton, 'SprFullFlag', isFull);
        }
    }
}
