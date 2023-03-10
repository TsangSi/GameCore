import {
    ConstItemId, ROLE_EQUIP_PART_NUM, ItemBagType, ItemCurrencyId, ItemWhere, ItemType,
} from '../../../../com/item/ItemConst';
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { IAttrBase } from '../../../../base/attribute/AttrConst';
import { Config } from '../../../../base/config/Config';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import ItemModel from '../../../../com/item/ItemModel';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagMgr } from '../../../bag/BagMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { StrengthItem } from './StrengthItem';
import { StrengthModel } from '../StrengthModel';
import { NdAttrBaseAdditionContainer } from '../../../../com/attr/NdAttrBaseAdditionContainer';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { EffectMgr } from '../../../../manager/EffectMgr';
import { UtilEffectPath } from '../../../../base/utils/UtilEffectPath';
import { UtilAttr } from '../../../../base/utils/UtilAttr';
import { RID } from '../../../reddot/RedDotConst';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import { ResonanceType } from '../../EquipConst';
import { RoleAN } from '../../../role/RoleAN';
import { UI_PATH_ENUM } from '../../../../const/UIPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class StrengthPage extends WinTabPage {
    @property(cc.Node) /** ?????? */
    private NdStrength: cc.Node = null;
    @property(cc.Node) /** ???????????? */
    private StrengthRed: cc.Node = null;

    @property(cc.Node) /** ???????????? */
    private NdStrengthAuto: cc.Node = null;

    /** ?????? */
    @property(cc.Node)
    private NdResonance: cc.Node = null;

    /** ????????? */
    @property(cc.Node)
    private NdSprCk: cc.Node = null;

    /** ???????????? */
    @property(cc.Node)
    private NdCenterItem: cc.Node = null;

    @property(cc.Label)
    private NdCenterLabName: cc.Label = null;

    @property(cc.Label)
    private LabPowerUp: cc.Label = null;

    @property(cc.Sprite)
    private imgLight: cc.Sprite = null;
    @property(cc.Sprite)
    private imgSuccess: cc.Sprite = null;

    @property(StrengthItem)
    private strengthItem1: StrengthItem = null;
    @property(StrengthItem)
    private strengthItem2: StrengthItem = null;

    @property(cc.Label)
    private LabHasCoin: cc.Label = null;
    @property(cc.Label)
    private LabNeedCoin: cc.Label = null;
    @property(cc.Label)
    private LabCenterDesc: cc.Label = null;

    @property(cc.Label)
    private LabHasStone: cc.Label = null;
    @property(cc.Label)
    private LabNeedStone: cc.Label = null;

    @property(cc.Label)
    private LabResonateLev: cc.Label = null;
    @property(cc.Node)
    private NdAttrContainer: cc.Node = null;

    @property(cc.Label)
    private LabNeedEquip: cc.Label = null;

    @property(cc.Label)
    private LabPower: cc.Label = null;

    @property(cc.Node)
    private NdAnimation: cc.Node = null;

    // /** ?????? */
    @property(cc.Node)
    private NdEquipContainer: cc.Node = null;

    protected start(): void {
        super.start();

        /** ?????? */
        UtilGame.Click(this.NdStrength, this._onStrength, this);
        /** ???????????? */
        UtilGame.Click(this.NdStrengthAuto, this._oneKeyStrength, this);
        /** ?????? */
        UtilGame.Click(this.NdResonance, this._onResonance, this);

        EventClient.I.on(E.Strength.StrengthSuccess, this._onStrengthSuccess, this);
        EventClient.I.on(E.Strength.UpRsonateSuccess, this._onUpRsonateSuccess, this);
        EventClient.I.on(E.Role.WearEquipSuccess, this._onWearEquipSuccess, this);

        const funcObj = RID.Equip.Strength;
        UtilRedDot.Bind(funcObj.OneKeyStrength, this.NdStrengthAuto, cc.v2(75, 23));
        UtilRedDot.Bind(funcObj.Resonance, this.NdResonance, cc.v2(21, 39));
        EventClient.I.on(E.Bag.ItemChange, this.onItemChange, this);
        RoleMgr.I.on(this.onCurrencyChange, this, RoleAN.N.ItemType_Coin4);
    }

    protected onDestroy(): void {
        super.onDestroy();
        RoleMgr.I.off(this.onCurrencyChange, this, RoleAN.N.ItemType_Coin4);
        EventClient.I.off(E.Bag.ItemChange, this.onItemChange, this);
        EventClient.I.off(E.Role.WearEquipSuccess, this._onWearEquipSuccess, this);
        EventClient.I.off(E.Strength.StrengthSuccess, this._onStrengthSuccess, this);
        EventClient.I.off(E.Strength.UpRsonateSuccess, this._onUpRsonateSuccess, this);
    }

    public onCurrencyChange(): void {
        this._showCostInfo(this._curSelectIdx);
    }

    /** ??????????????? */
    public onItemChange(changes: { itemModel: ItemModel, status: number }[]): void {
        for (let i = 0, len = changes.length; i < len; i++) {
            const stoneId = ConstItemId.stoneId;
            const item: ItemModel = changes[i].itemModel;
            if (item.data.ItemId === stoneId) {
                this._showCostInfo(this._curSelectIdx);
                break;
            }
        }
    }

    /** ?????? */
    private _onStrength(): void {
        const itemModel: ItemModel = BagMgr.I.getOnEquipByPart(ItemBagType.EQUIP_ROLE, ItemType.EQUIP_ROLE, this._curSelectIdx);
        if (itemModel) {
            if (this._checkCondition(this._curSelectIdx)) {
                ControllerMgr.I.StrengthController.reqC2SStrengthEquipPos(this._curSelectIdx);
            }
            return;
        }
        // for (const item of roleEquipList) {
        //     if (item.cfg.EquipPart === this._curSelectIdx) {
        //         return;
        //     }
        // }
        MsgToastMgr.Show(i18n.tt(Lang.strength_noEquip));// '???????????????????????????'
    }

    /**
     * 1 ?????????????????? <= ????????????
     * 2 ?????????????????? <  ??????????????????
     * 3 ?????????????????? >= ???????????????
     * @param equipPart ??????
     * @returns ??????????????????
     */
    private _checkCondition(equipPart: number): boolean {
        const model: StrengthModel = ModelMgr.I.StrengthModel;
        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();
        if (!roleEquipList.size) {
            MsgToastMgr.Show(i18n.tt(Lang.strength_noEquip));// '???????????????????????????'
            return false;
        }

        // 1 ???????????????????????? < ???????????? ?????????
        const posLv: number = model.getStrengthLvByPart(equipPart);
        const roleLv: number = RoleMgr.I.d.Level;
        if (posLv >= roleLv) {
            MsgToastMgr.Show(i18n.tt(Lang.strength_roleMax));// ????????????????????????????????????
            return false;
        }
        // 2 ??????????????????
        const armyLevel: number = model.getEquipArmyLevelByEquipPart(equipPart);
        // ??????????????????
        const upLimit: number = model.getBuildMax(armyLevel);
        if (posLv >= upLimit) {
            MsgToastMgr.Show(i18n.tt(Lang.strength_alreadyMax));// ??????????????????????????????
            this._showLimitInfo(equipPart);
            return false;
        }
        // 3
        if (!model.isCoinEnaugth(equipPart)) {
            WinMgr.I.open(ViewConst.ItemSourceWin, ItemCurrencyId.COIN);// ????????????
            return false;
        }
        if (!model.isStoneEnugth(equipPart)) {
            WinMgr.I.open(ViewConst.ItemSourceWin, ConstItemId.stoneId);// ???????????????
            return false;
        }
        return true;
    }

    /** ???????????? */
    private _oneKeyStrength(): void {
        const model: StrengthModel = ModelMgr.I.StrengthModel;
        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();
        /** ?????????????????? */
        if (!roleEquipList.size) {
            MsgToastMgr.Show(i18n.tt(Lang.strength_unwear));
            return;
        }

        /** ????????????????????????????????? */
        let bol: boolean = true;
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            const item = roleEquipList.get(i);
            if (item) {
                const equipPart: number = item.cfg.EquipPart;
                // 2 ??????????????????
                const armyLevel: number = model.getEquipArmyLevelByEquipPart(equipPart);
                // ??????????????????
                const upLimit: number = model.getBuildMax(armyLevel);
                /** ????????????????????? */
                const posLv: number = model.getStrengthLvByPart(equipPart);
                if (posLv < upLimit) {
                    bol = false;
                    break;
                }
            }
        }
        if (bol) {
            MsgToastMgr.Show(i18n.tt(Lang.strength_all_limit));// ??????????????????????????????
            return;
        }

        /** ?????????????????????????????????????????? */
        bol = true;
        for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
            const item = roleEquipList.get(i);
            if (item) {
                const equipPart: number = item.cfg.EquipPart;
                const posLv: number = model.getStrengthLvByPart(equipPart);
                const roleLv: number = RoleMgr.I.d.Level;
                if (posLv < roleLv) {
                    bol = false;
                }
            }
        }
        if (bol) {
            // ??????????????????????????????????????????
            MsgToastMgr.Show(i18n.tt(Lang.strength_all_limit1));
            return;
        }

        // ????????????????????? ???????????? ?????????????????????
        const minPos: number = model.getMinLvEquipPart();

        if (!model.isCoinEnaugth(minPos)) {
            WinMgr.I.open(ViewConst.ItemSourceWin, ItemCurrencyId.COIN);// ????????????
            return;
        }
        if (!model.isStoneEnugth(minPos)) {
            WinMgr.I.open(ViewConst.ItemSourceWin, ConstItemId.stoneId);// ???????????????
            return;
        }
        ControllerMgr.I.StrengthController.reqC2SAutoStrengthEquipPos();
    }
    /** ?????? */
    private _onResonance() {
        WinMgr.I.open(ViewConst.ResonanceWin, ResonanceType.STRENGTH);
    }

    // ????????????????????? ??????????????????UI
    private _onWearEquipSuccess(): void {
        //
        this._initEquipInfo();
        this._selectSingleEquip();
    }

    /** ???????????? */
    private _onUpRsonateSuccess(): void {
        const model: StrengthModel = ModelMgr.I.StrengthModel;
        this.LabResonateLev.string = `${model.getResonateLev()}${i18n.jie}`;
    }

    /** ???????????? */
    private _onStrengthSuccess(data: EquipPos[]): void {
        this.NdEquipContainer.children.forEach((node, idx) => {
            const strengthItemNode: cc.Node = node;
            const st: StrengthItem = strengthItemNode.getComponent(StrengthItem);
            const model: StrengthModel = ModelMgr.I.StrengthModel; // idx//0---7
            const lv = model.getStrengthLvByPart(idx + 1) || 0;
            st.setLabLv(lv);
        });

        // for (let i = 0; i < this.NdEquipItems.length; i++) {
        //     const strengthItemNode: cc.Node = this.NdEquipItems[i].node;
        //     const st: StrengthItem = strengthItemNode.getComponent(StrengthItem);
        //     // idx//0---7
        //     const model: StrengthModel = ModelMgr.I.StrengthModel;
        //     const lv = model.getStrengthLvByPart(i + 1) || 0;
        //     st.setLabLv(lv);
        // }
        this._selectItem(this._curSelectIdx);
        this._playSuccessAni();// ????????????
    }

    private _playSuccessAni() {
        this.imgSuccess.node.active = true;
        this.imgSuccess.node.scale = 0.8;
        cc.tween(this.imgSuccess.node).to(1, { scale: 1 }).call(() => {
            this.imgSuccess.node.active = false;
        }).start();

        this.imgLight.node.active = true;
        this.imgLight.node.x = -10;
        cc.tween(this.imgLight.node).to(1, { x: 0, y: 0 }).call(() => {
            this.imgLight.node.active = false;
        }).start();
    }

    /** ??????????????????????????? */
    private _initPosLvInfo(): void {
        this.NdEquipContainer.children.forEach((node, idx) => {
            const strengthItemNode: cc.Node = node;
            const strengthItem: StrengthItem = strengthItemNode.getComponent(StrengthItem);
            const model: StrengthModel = ModelMgr.I.StrengthModel;
            const lv: number = model.getStrengthLvByPart(idx + 1) || 0;
            strengthItem.setLabLv(lv);
        });
    }

    private _initEvent(): void {
        this.NdEquipContainer.children.forEach((node, idx) => {
            const strengthItemNode: cc.Node = node;
            UtilGame.Click(strengthItemNode.getChildByName('NdEvent'), () => {
                this._selectItem(idx + 1);
            }, this, { scale: 1 });
        });
    }

    /** ????????????????????? */
    private _curSelectIdx = 1;// 1-8

    public init(winId: number, param: unknown, tabIdx: number): void {
        super.init(winId, param, tabIdx);

        const resonanceEff = UtilEffectPath.getResonanceEffUrl();
        this.NdAnimation.destroyAllChildren();
        EffectMgr.I.showEffect(resonanceEff, this.NdAnimation);

        this.LabCenterDesc.string = '';
        this.imgLight.node.active = false;
        this.imgSuccess.node.active = false;
        this._initEquipLayout();
    }

    /** ??????8????????? */
    private _initEquipLayout(): void {
        // eslint-disable-next-line no-void
        void this._init8PosInfo().then(() => {
            this._initEquipInfo();
            this._initEvent();
            const model: StrengthModel = ModelMgr.I.StrengthModel;
            model.getMinLvEquipPart();
            this.LabResonateLev.string = `${model.getResonateLev()}${i18n.jie}`;// ???
            this._initPosLvInfo();
            this._selectSingleEquip();
        });
    }

    private _init8PosInfo(): Promise<void> {
        return new Promise((resolve) => {
            ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Equip_Strength_StrengthItem, this.NdEquipContainer, (err, n: cc.Node) => {
                for (let i = 0; i < ROLE_EQUIP_PART_NUM - 1; i++) {
                    this.scheduleOnce(() => {
                        this.NdEquipContainer.addChild(cc.instantiate(n));
                        if (i === ROLE_EQUIP_PART_NUM - 2) {
                            resolve();
                        }
                    }, i * 0.02);
                }
            });
        });
    }

    /** ?????????????????? */
    private _initEquipInfo(): void {
        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();
        this.NdEquipContainer.children.forEach((node, idx) => {
            const strengthItemNode: cc.Node = node;
            const item = roleEquipList.get(idx + 1);
            const strengthItem: StrengthItem = strengthItemNode.getComponent(StrengthItem);
            if (item) {
                strengthItem.loadIcon(item, { where: ItemWhere.OTHER, needName: false, needNum: true });
                strengthItem.initDefaultIcon(false);
            } else {
                strengthItem.initDefaultIcon(true, idx + 1);
            }
        });
    }

    /** ????????????????????????????????? */
    private _selectSingleEquip() {
        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();

        let equipPart: number = 1;
        if (roleEquipList.size) {
            if (roleEquipList.size === 1) { // ???????????? ???????????????
                for (let i = 1; i <= ROLE_EQUIP_PART_NUM; i++) {
                    if (roleEquipList.get(i)) {
                        equipPart = i;
                        break;
                    }
                }
            } else { // ?????? ?????????????????????????????????
                const model: StrengthModel = ModelMgr.I.StrengthModel;
                equipPart = model.getMinLvEquipPart();
            }
        } else {
            equipPart = 1;
        }

        this._selectItem(equipPart);
    }

    /**
     * ??????????????????
     * @param pos 0 1 2 3 4 5 6 7
     */
    private _selectItem(equipPart: number): void {
        this._curSelectIdx = equipPart;
        const strengthItemNode: cc.Node = this.NdEquipContainer.children[equipPart - 1];
        this.NdSprCk.active = true;
        this.NdSprCk.position = strengthItemNode.position;
        this.NdSprCk.x = strengthItemNode.position.x;
        this.NdSprCk.y = strengthItemNode.position.y + this.NdEquipContainer.position.y;
        this._showCenterInfo(equipPart);
        this._showCostInfo(equipPart);
        this._showAttr(equipPart);
        this._showFightPower(equipPart);
        this._showLimitInfo(equipPart);
        this._showStrengthRed(equipPart);
    }

    private _showStrengthRed(equipPart: number): void {
        /** ???????????????????????? */
        this.StrengthRed.active = ModelMgr.I.StrengthModel.canEquipPartStrength(equipPart);
    }

    /** ???????????? */
    private _showFightPower(equipPart: number) {
        const equip: ItemModel = ModelMgr.I.StrengthModel.getEquipItemByPart(equipPart);
        const level: number = ModelMgr.I.StrengthModel.getStrengthLvByPart(equipPart);
        if (equip && level) { // ??????
            const attrInfo = ModelMgr.I.StrengthModel.getStrengthAttrInfo(equipPart, level);
            const [strengthFv, strengthAttrStr] = UtilAttr.GetTipsStrengthFvAttrStr(equip.cfg.AttrId, attrInfo);
            this.LabPower.string = `${strengthFv}`;
        } else { // ??????
            this.LabPower.string = '0';
        }
    }

    /**
     * ?????? x?????????????????????xx??????
     */
    private _showLimitInfo(equipPart: number): void { // 1-8
        const model: StrengthModel = ModelMgr.I.StrengthModel;
        const item: ItemModel = model.getSingleEquipData(equipPart);
        const armyLevel: number = model.getEquipArmyLevelByEquipPart(equipPart);
        const upLimit: number = model.getBuildMax(armyLevel);
        const posLv: number = model.getStrengthLvByPart(equipPart);
        if (item != null && posLv >= upLimit) {
            this.LabCenterDesc.string = `${armyLevel} ${i18n.tt(Lang.strength_rebornLimit)}${upLimit}`;// X??????????????????????????????100
        } else {
            this.LabCenterDesc.string = '';
        }
    }

    private _showCenterInfo(equipPart: number): void { // 1 2 3 4 5 6 7 8
        this.NdCenterLabName.string = '';
        const data: ItemModel = ModelMgr.I.StrengthModel.getEquipItemByPart(equipPart);
        const strItem: StrengthItem = this.NdCenterItem.getComponent(StrengthItem);
        const itemIcon: ItemIcon = strItem.getComponentInChildren(ItemIcon);
        if (data) {
            strItem.loadIcon(data, { where: ItemWhere.ROLE_EQUIP, clickScale: 1, showGem: true });
            strItem.initDefaultIcon(false);
            // itemIcon.setData(item, { where: ItemWhere.ROLE_EQUIP, clickScale: 1 });

            // node.getChildByName('Sprdefault').active = false;
            const strengthLv = ModelMgr.I.StrengthModel.getStrengthLvByPart(equipPart);
            const attrInfo = ModelMgr.I.StrengthModel.getStrengthLevelAttrInfo(equipPart, strengthLv);
            const [strengthFv, strengthAttrStr] = UtilAttr.GetTipsStrengthFvAttrStr(data.cfg.AttrId, attrInfo);
            itemIcon.setTipsOptions({ strengthFv, strengthLv, strengthAttrStr });

            // ??????
            this.NdCenterLabName.string = data.cfg.Name;
            // this.NdCenterLabName.color = new cc.Color(UtilColor.GoldD);
            // this.LabNeedEquip.node.active = false;
        } else {
            // this.LabNeedEquip.node.active = true;
            this.NdCenterLabName.string = i18n.tt(Lang.strength_unequip);// ?????????
            // this.NdCenterLabName.color = new cc.Color(UtilColor.NorV);
            strItem.initDefaultIcon(true, equipPart);
        }
        this.NdCenterLabName.node.color = UtilColor.Hex2Rgba('#FFF6E3');
        strItem.setLabLv(0, false);

        strItem.showEventNode(false);
        // ?????????
        const lv = ModelMgr.I.StrengthModel.getStrengthLvByPart(equipPart);
        // this.LabPowerUp.string = lv ? `+${lv}` : `+0`;
        this.LabPowerUp.string = lv ? `+${lv}` : `+0`;
    }

    private _showCostInfo(equipPart: number): void {
        // const data: ItemModel = ModelMgr.I.StrengthModel.getEquipItemByPart(equipPart);

        const model: StrengthModel = ModelMgr.I.StrengthModel;
        // ????????????
        const stLv: number = model.getStrengthLvByPart(equipPart) || 0;
        // if (data) {
        // ??????????????????
        // const Reborn = data ? data.cfg.ArmyLevel : 1;
        const indexer = Config.Get(Config.Type.Cfg_EquipStrengthC);
        const cfg: Cfg_EquipStrengthC = indexer.getIntervalData(stLv);
        // const cfg: Cfg_EquipStrengthC = indexer.getValueByKey(Reborn);

        // ??????  +   (??????????????????stLv  -  ??????????????????????????? ) *????????????

        // ??????
        const coinBase: number = cfg.CoinBase;
        const coinUp: number = cfg.CoinUp;
        const coinId = ItemCurrencyId.COIN;
        const coinNum = coinBase + (stLv + 1 - cfg.Min) * coinUp;// ??????+????????????*??????
        const coinItem: ItemModel = UtilItem.NewItemModel(coinId, coinNum);
        this.strengthItem1.getComponent(StrengthItem).loadIcon(coinItem, { where: ItemWhere.OTHER, needName: false });
        // ?????????
        const stoneBase: number = cfg.StoneBase;
        const stoneUp: number = parseFloat(cfg.StoneUp);
        const stoneId = ConstItemId.stoneId;
        const stoneNum = stoneBase + Math.ceil((stLv + 1 - cfg.Min) * stoneUp);
        const stoneItem: ItemModel = UtilItem.NewItemModel(stoneId, stoneNum);
        this.strengthItem2.getComponent(StrengthItem).loadIcon(stoneItem, { where: ItemWhere.OTHER, needName: false });

        // ??????????????????????????????
        const coinBagNum: number = RoleMgr.I.d.ItemType_Coin4;
        const stoneBagNum: number = BagMgr.I.getItemNum(stoneId);

        let color: cc.Color = UtilColor.Red();

        color = coinBagNum >= coinNum ? UtilColor.Hex2Rgba(UtilColor.GreenD) : UtilColor.Hex2Rgba(UtilColor.RedD);
        this.LabHasCoin.string = `${UtilNum.Convert(coinBagNum)}`;// ??????
        this.LabNeedCoin.string = `/${UtilNum.Convert(coinNum)}`;// ????????????

        this.LabHasCoin.node.color = color;
        this.LabNeedCoin.node.color = color;// UtilColor.Hex2Rgba(UtilColor.WhiteD);

        color = stoneBagNum >= stoneNum ? UtilColor.Hex2Rgba(UtilColor.GreenD) : UtilColor.Hex2Rgba(UtilColor.RedD);
        this.LabHasStone.string = `${UtilNum.Convert(stoneBagNum)}`;// ??????
        this.LabNeedStone.string = `/${UtilNum.Convert(stoneNum)}`;// ????????????

        this.LabHasStone.node.color = color;
        this.LabNeedStone.node.color = color; // UtilColor.Hex2Rgba(UtilColor.WhiteD);
    }

    private _showAttr(equipPart: number): void {
        const model: StrengthModel = ModelMgr.I.StrengthModel;
        const level: number = model.getStrengthLvByPart(equipPart);

        /** ????????? ??????&?????? */
        const data: ItemModel = ModelMgr.I.StrengthModel.getEquipItemByPart(equipPart);

        // ???????????????????????????&??????
        const c: Cfg_EquipStrengthA = model.getCfgByEquipPartLv(equipPart, level);
        const coloneBaseAttr: IAttrBase[] = UtilAttr.GetAttrBaseListById(c.BaseAttrId);
        const coloneAddAttr: IAttrBase[] = UtilAttr.GetAttrBaseListById(c.AddAttrId);

        // ???????????????????????????&??????
        const cNext: Cfg_EquipStrengthA = model.getCfgByEquipPartLv(equipPart, level + 1);
        const baseAttrNext: IAttrBase[] = UtilAttr.GetAttrBaseListById(cNext.BaseAttrId);
        const coloneBaseAttrNext: IAttrBase[] = baseAttrNext;

        for (let i = 0, len = coloneBaseAttr.length; i < len; i++) {
            const base: IAttrBase = coloneBaseAttr[i];
            const add: IAttrBase = coloneAddAttr[i];

            if (!level || !data) { // ???????????? ?????????0
                add.value = base.value;
                base.value = 0;
            } else {
                base.value += add.value * (level - c.LevelMin);
            }
            if (level >= c.LevelMax) { // ?????????????????? ?????????????????????
                add.value = coloneBaseAttrNext[i].value - base.value;
            }
        }

        if (level === 0 || !data) {
            this.NdAttrContainer.getComponent(NdAttrBaseAdditionContainer).init(coloneBaseAttr, coloneAddAttr, {
                isShowAdd: true, isShowAddSign: true, isShowLine: true,
            });
        } else {
            this.NdAttrContainer.getComponent(NdAttrBaseAdditionContainer).init(coloneBaseAttr, coloneAddAttr, {
                isShowAdd: !!data, isShowAddSign: true, isShowLine: true,
            });
        }
    }
}
