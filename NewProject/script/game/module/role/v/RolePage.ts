/* eslint-disable max-len */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemBagType, ItemWhere } from '../../../com/item/ItemConst';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import EntityBase from '../../../entity/EntityBase';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RoleAN } from '../RoleAN';
import { RoleMgr } from '../RoleMgr';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import ModelMgr from '../../../manager/ModelMgr';
import { RID } from '../../reddot/RedDotConst';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { SealAmuletType } from '../../roleOfficial/RoleSealAmulet/SealAmuletConst';
import { SealAmuletItem } from '../../roleOfficial/RoleSealAmulet/v/SealAmuletItem';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import UtilNewMark from '../../../base/utils/UtilNewMark';
import { NewMark } from '../../newMark/NewMark';

const { ccclass, property } = cc._decorator;

@ccclass
export class RolePage extends WinTabPage {
    @property(cc.Node)
    private NodeCheckFv: cc.Node = null;

    @property(cc.Node)
    private NodeAuto: cc.Node = null;

    @property(cc.Node)
    private NodeWZTZ: cc.Node = null;

    @property(cc.Node)
    private NodeAni: cc.Node = null;

    @property(cc.Node)
    private NodeFuncContent: cc.Node = null;

    @property(cc.Label)
    private LabelFightValue: cc.Label = null;

    @property(cc.Node)
    private NdEquips: cc.Node = null;

    @property(cc.Label)
    private LabNick: cc.Label = null;

    /** 官印 */
    @property(cc.Node)
    private NdSeal: cc.Node = null;
    /** 虎符 */
    @property(cc.Node)
    private NdAmulet: cc.Node = null;

    private _role: EntityBase = null;

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);

        UtilGame.Click(this.NodeAuto, this.onAutoClicked, this);
        UtilGame.Click(this.NodeWZTZ, this.onWZTZClicked, this);
        UtilGame.Click(this.node, 'EquipJL/add', this.onAddEquip, this);
        UtilGame.Click(this.node, 'EquipHF/add', this.onAddEquip, this);
        UtilGame.Click(this.node, 'EquipZC/add', this.onAddEquip, this);
        UtilGame.Click(this.node, 'EquipSD/add', this.onAddEquip, this);
        UtilGame.Click(this.node, 'EquipHJ/add', this.onAddEquip, this);
        UtilGame.Click(this.node, 'EquipHJSB/add', this.onAddEquip, this);
        UtilGame.Click(this.NodeCheckFv, this.onCheckFvClicked, this);

        this.NodeFuncContent.children.forEach((n, index) => {
            switch (index) {
                case 0: // 剑魂
                    break;
                case 1:// 时装
                    n.active = UtilFunOpen.canShow(FuncId.Skin);
                    UtilRedDot.Bind(RID.Role.Role.Skin.Id, n, cc.v2(20, 35));
                    UtilNewMark.Bind(FuncId.Skin, n, cc.v2(20, 35));
                    UtilGame.Click(n, () => { this.onClickRoleSkin(n); }, this);
                    break;
                case 2: // 华服
                    n.active = UtilFunOpen.canShow(FuncId.SkinSpecialSuit);
                    UtilRedDot.Bind(RID.Role.Role.SpecialSuit.Id, n, cc.v2(20, 35));
                    UtilNewMark.Bind(FuncId.SkinSpecialSuit, n, cc.v2(20, 35));
                    UtilGame.Click(n, () => { this.onClickRoleSpecialSuit(n); }, this);
                    break;
                case 3: // 丹药
                    // n.active = UtilFunOpen.canShow(FuncId.RoleExercise);
                    UtilRedDot.Bind(RID.Role.Role.Exercise, n, cc.v2(20, 35));
                    UtilNewMark.Bind(FuncId.RoleExercise, n, cc.v2(20, 35));
                    UtilGame.Click(n, () => { this.onClickRoleExercise(n); }, this);
                    break;
                case 4: // 称号
                    n.active = UtilFunOpen.canShow(FuncId.Title);
                    UtilRedDot.Bind(RID.Role.Role.Title, n, cc.v2(20, 35));
                    UtilNewMark.Bind(FuncId.Title, n, cc.v2(20, 35));
                    UtilGame.Click(n, () => { this.onClickTitle(n); }, this);
                    break;
                default:
                    break;
            }
        });

        this.showRealRole();
        this._initEquip8Pos();
        this._checkAutoBtnState();

        this.addE();
        /** 初始化战力 */
        this.onFVChanged();

        this.updateSealAmulet();
        // 检查'新'标签
        this.checkNewMark();

        this.LabNick.string = RoleMgr.I.info.getAreaNick(NickShowType.ArenaNick, false);
    }

    protected onEnable(): void {
        if (this._role) {
            this._role.resume();
        }
    }

    private addE() {
        RoleMgr.I.on(this.uptOpen, this);

        // 人物属性变化的监听
        RoleMgr.I.on(this.uptRoleTitle, this, RoleAN.N.Title);
        RoleMgr.I.on(this.onFVChanged, this, RoleAN.N.FightValue);
        RoleMgr.I.on(this.onSkinChanged, this, RoleAN.N.PlayerSkin, RoleAN.N.GradeWeapon, RoleAN.N.GradeHorse, RoleAN.N.GradeWing);
        /** 一键换装 */
        EventClient.I.on(E.Role.WearEquipSuccess, this._onWearEquipSuccess, this);
        /** 添加虎符和官职相关协议返回的监听 */
        EventClient.I.on(E.RoleOfficial.OfficialChange, this.updateSealAmulet, this);
        EventClient.I.on(E.SealAmulet.UpGrade, this.updateSealAmulet, this);
        EventClient.I.on(E.SealAmulet.UpStar, this.updateSealAmulet, this);
        EventClient.I.on(E.SealAmulet.Quality, this.updateSealAmulet, this);
    }

    private remE() {
        RoleMgr.I.off(this.uptOpen, this);
        // 人物属性变化的监听
        RoleMgr.I.off(this.uptRoleTitle, this, RoleAN.N.Title);
        RoleMgr.I.off(this.onFVChanged, this, RoleAN.N.FightValue);
        RoleMgr.I.off(this.onSkinChanged, this, RoleAN.N.PlayerSkin, RoleAN.N.GradeWeapon, RoleAN.N.GradeHorse, RoleAN.N.GradeWing);
        EventClient.I.off(E.Role.WearEquipSuccess, this._onWearEquipSuccess, this);

        EventClient.I.off(E.SealAmulet.UpGrade, this.updateSealAmulet, this);
        EventClient.I.off(E.SealAmulet.UpStar, this.updateSealAmulet, this);
        EventClient.I.off(E.SealAmulet.Quality, this.updateSealAmulet, this);
    }

    /** 检查是否有‘新’标签 */
    private checkNewMark() {
        this.NodeFuncContent.children.forEach((n, index) => {
            if (n && cc.isValid(n)) {
                const newMark = n.getComponent(NewMark);
                if (newMark) {
                    newMark.onFuncNew();
                }
            }
        });
    }

    /** 一键换装成功 */
    private _onWearEquipSuccess() {
        this._initEquip8Pos();
        this._checkAutoBtnState();
    }

    private uptOpen() {
        this.NodeFuncContent.children.forEach((n, index) => {
            if (index === 4) {
                n.active = UtilFunOpen.canShow(FuncId.Title);
            }
        });
    }

    /** 判断是否显示一键穿戴按钮 */
    private _checkAutoBtnState(): void {
        this.NodeAuto.active = BagMgr.I.getOneKeyWearEquip();
    }

    /** 初始化8个部位装备 */
    private _initEquip8Pos() {
        const roleEquipMap = BagMgr.I.getItemMapByBagType(ItemBagType.EQUIP_ROLE, true);
        const len = roleEquipMap.size;

        if (!len) { return; }

        /** 显示8个默认图标 */
        this.NdEquips.children.forEach((node: cc.Node, idx: number) => {
            node.getChildByName('Sprdefault').active = true;
        });

        /** 遍历 已穿戴的8个部位 */
        const strengthModel = ModelMgr.I.StrengthModel;
        roleEquipMap.forEach((item, key) => {
            const equipPart: number = item.cfg.EquipPart;
            const node = this.NdEquips.children[equipPart - 1];
            const itemIcon: ItemIcon = node.getComponentInChildren(ItemIcon);
            itemIcon.setData(item, {
                needName: true, where: ItemWhere.ROLE_EQUIP, clickScale: 1,
            });

            node.getChildByName('Sprdefault').active = false;
            node.getChildByName('ItemIcon').getChildByName('SprNameDi').active = true;
            const strengthLv = strengthModel.getStrengthLvByPart(equipPart);
            const attrInfo = strengthModel.getStrengthLevelAttrInfo(equipPart, strengthLv);
            const [strengthFv, strengthAttrStr] = UtilAttr.GetTipsStrengthFvAttrStr(item.cfg.AttrId, attrInfo);
            const equipGemFv = ModelMgr.I.GemModel.getEquipGemFightValue(item.cfg.EquipPart);
            const equipPos = ModelMgr.I.GemModel.getEquipPos(item.cfg.EquipPart);
            const equipGemInfoArr = ModelMgr.I.GemModel.getEquipGemShowInfoArr(equipPos);
            itemIcon.setTipsOptions({
                strengthFv, strengthLv, strengthAttrStr, equipGemFv, equipGemInfoArr,
            });
        });
    }

    private onSkinChanged() {
        this.showRealRole();
    }

    /** 初始展示展示 */
    private showRealRole() {
        this.NodeAni.destroyAllChildren();
        this.NodeAni.removeAllChildren();
        this._role = EntityUiMgr.I.createAttrEntity(this.NodeAni, { isMainRole: true, isShowTitle: true });
        this._role.setTitleScale(1.3);
    }

    private uptRoleTitle() {
        if (this._role) {
            this._role.setTitleAnim(RoleMgr.I.d.Title);
        }
    }

    private onAddEquip() {
        //
    }

    private onClickRoleSpecialSuit(node: cc.Node) {
        if (UtilFunOpen.isOpen(FuncId.SkinSpecialSuit, true)) {
            ControllerMgr.I.RoleSpecialSuitController.linkOpen();
        }
        if (node.getChildByName('NewMark')) {
            UtilFunOpen.CheckClick(FuncId.SkinSpecialSuit);
        }
    }

    private onClickRoleExercise(node: cc.Node) {
        if (UtilFunOpen.isOpen(FuncId.RoleExercise, true)) {
            ControllerMgr.I.RoleExerciseController.linkOpen();
        }
        if (node.getChildByName('NewMark')) {
            UtilFunOpen.CheckClick(FuncId.RoleExercise);
        }
    }

    private onClickRoleSkin(node: cc.Node) {
        if (UtilFunOpen.isOpen(FuncId.Skin, true)) {
            ControllerMgr.I.RoleSkinController.linkOpen();
        }
        if (node.getChildByName('NewMark')) {
            UtilFunOpen.CheckClick(FuncId.Skin);
        }
    }
    private onClickTitle(node: cc.Node) {
        if (UtilFunOpen.isOpen(FuncId.Title, true)) {
            WinMgr.I.open(ViewConst.TitleWin, 0);
        }
        if (node.getChildByName('NewMark')) {
            UtilFunOpen.CheckClick(FuncId.Title);
        }
    }

    private onCheckFvClicked() {
        WinMgr.I.open(ViewConst.RoleAttrWin, 0);
    }

    private onAutoClicked() {
        ControllerMgr.I.RoleController.reqC2SAutoWearEquip(7);
    }

    private onWZTZClicked() {
        MsgToastMgr.Show('王者套装');
    }

    private onFVChanged() {
        this.LabelFightValue.string = `${UtilNum.ConvertFightValue(RoleMgr.I.d.FightValue)}`;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    protected updateSealAmulet(): void {
        if (this.NdSeal.children.length > 0) {
            const nd = this.NdSeal.children[0];
            const item = nd.getComponent(SealAmuletItem);
            item.setData(ModelMgr.I.SealAmuletModel.getConfig(SealAmuletType.Seal), true);
        } else {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Module_SealAmulet_SealAmuletItem, this.NdSeal, (err, nd: cc.Node) => {
                if (!err) {
                    const item = nd.getComponent(SealAmuletItem);
                    item.setData(ModelMgr.I.SealAmuletModel.getConfig(SealAmuletType.Seal), true);
                }
            });
        }

        if (this.NdAmulet.children.length > 0) {
            const nd = this.NdAmulet.children[0];
            const item = nd.getComponent(SealAmuletItem);
            item.setData(ModelMgr.I.SealAmuletModel.getConfig(SealAmuletType.Amulet), true);
        } else {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Module_SealAmulet_SealAmuletItem, this.NdAmulet, (err, nd: cc.Node) => {
                if (!err) {
                    const item = nd.getComponent(SealAmuletItem);
                    item.setData(ModelMgr.I.SealAmuletModel.getConfig(SealAmuletType.Amulet), true);
                }
            });
        }
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        this.updateSealAmulet();
    }
}
