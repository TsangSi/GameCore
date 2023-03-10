import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { UtilUnionId } from '../../../../../app/base/utils/UtilUnionId';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { EffectMgr } from '../../../../manager/EffectMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { MenuBar } from '../../../../base/components/menubar/MenuBar';
import { Config } from '../../../../base/config/Config';
import { ConfigIndexer } from '../../../../base/config/indexer/ConfigIndexer';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { ItemQuality, ItemWhere } from '../../../../com/item/ItemConst';
import ItemModel from '../../../../com/item/ItemModel';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagMgr } from '../../../bag/BagMgr';
import { NdBuildItem } from '../../buildEquip/v/NdBuildItem';
import { ToggleBtnItem } from '../../v/ToggleBtnItem';
import { UpStar } from '../UpStarModel';
import { RES_ENUM } from '../../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class UpStarPage extends WinTabPage {
    @property({ type: MenuBar })
    private NdMenuBar: MenuBar = null;

    @property({ type: cc.Label })
    private tipLab: cc.Label = null;

    @property({ type: cc.Label })
    private targetEquipName: cc.Label = null;

    @property({ type: cc.Label })
    private tipPartSelectlab: cc.Label = null;

    @property({ type: cc.Node })
    private btnGroup: cc.Node = null;

    @property({ type: cc.Prefab })
    private partItemPrefab: cc.Prefab = null;

    @property({ type: cc.Node })
    private btnAddMat: cc.Node = null;

    @property({ type: cc.Node })
    private btnUpStar: cc.Node = null;

    @property({ type: cc.Node })
    private NdMatItem1: cc.Node = null;
    @property({ type: cc.Node })
    private NdMatItem2: cc.Node = null;
    @property({ type: cc.Node })
    private NdMatItem3: cc.Node = null;
    @property({ type: cc.Node })
    private NdMatItem4: cc.Node = null;
    @property({ type: cc.Node })
    private NdMatItem5: cc.Node = null;

    @property(cc.Node)
    private effectNode: cc.Node = null;

    // ????????????id
    // private targetItemId: string = '';
    // ?????????????????? ????????????????????????(????????????????????? ???????????????????????? ???????????????????????????)
    private _currentStarEquips: UpStar = null;
    // ???????????????index
    private _selectIndex = 0;

    public init(winId: number, param: unknown, tabIdx: number = 0): void {
        super.init(winId, param, tabIdx);
        EventClient.I.on(E.UpStar.ClickSelectEquip, this.toSelectEquip, this);
        EventClient.I.on(E.UpStar.SelectFinish, this.selectFinish, this);
        EventClient.I.on(E.UpStar.UpStarSuccess, this.upstarSuccess, this);
        EventClient.I.on(E.Bag.ItemChange, this.onItemChange, this);
    }

    private onItemChange(changes: { itemModel: ItemModel, status: number }[]): void {
        let needRefresh = false;
        for (let i = 0, len = changes.length; i < len; i++) {
            const info = changes[i];
            if (info.itemModel.cfg.Quality === ItemQuality.RED) {
                needRefresh = true;
            }
        }

        if (needRefresh) {
            this.refreshPage(this.winId, this.param, this.tabIdx);
        }
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number): void {
        super.refreshPage(winId, param, tabIdx);
        // ?????????????????????
        this.reselectMenu(this._currentStarEquips.equipReborn, this._currentStarEquips.equipStar);
    }
    protected start(): void {
        super.start();
        this.configMenuBar();
        UtilGame.Click(this.btnAddMat, () => {
            // ??????????????????  ????????????????????????
            if (this._currentStarEquips.mats.length < 3) {
                MsgToastMgr.Show(i18n.tt(Lang.equip_upstar_equip_unenough));
                return;
            }
            this.selectFinish([0, 1, 2]);
        }, this);

        UtilGame.Click(this.btnUpStar, () => {
            // ??????
            if (!this.needMaterial(this._currentStarEquips.equipReborn, this._currentStarEquips.equipStar)) {
                MsgToastMgr.Show(i18n.tt(Lang.equip_unenough_mats));
                return;
            }
            if (this.selectMatEquips.length >= 3) {
                ControllerMgr.I.UpStarController.upEquipStar(this._selectIndex + 1, this.selectMatEquips);

                EffectMgr.I.showEffect(RES_ENUM.Strength_Ui_7003, this.effectNode, cc.WrapMode.Normal, (nd: cc.Node) => {
                    //
                });
            } else {
                // console.log('????????????????????????');
                MsgToastMgr.Show(i18n.tt(Lang.equip_upstar_equip_unenough));
            }
        }, this);
        this.tipPartSelectlab.string = i18n.tt(Lang.equip_part_select);
    }

    private configMenuBar() {
        const roleInfo = ModelMgr.I.UpStarModel.GetRoleInfo();
        const configData = Config.Get(Config.Type.Cfg_Equip_Star);
        const menuConfig: { [key: number]: any } = {};
        const configMap = {};
        // ?????????????????????2???
        for (let i = 2; i <= roleInfo.star; i++) {
            configMap[i] = i;
        }
        const reb = roleInfo.reborn;
        menuConfig[reb] = configMap;
        this.NdMenuBar.setData(menuConfig, ['ArmyLevel', 'ArmyStar'], (star: number) => {
            // cfg[0] ?????????????????? ???select???????????????
            this.reselectMenu(roleInfo.reborn, star);
        }, this, (index: number, k: string) => {
            const lev: Cfg_Equip_Star = configData.getValueByKey(Number(`${roleInfo.reborn}${index}`));
            const v = lev.ArmyLevel;
            const v1 = lev.ArmyStar;
            if (k === 'ArmyLevel') {
                return `${v}${i18n.jie}${i18n.tt(Lang.com_btn_equip)}`;
            } else {
                return `${v}${i18n.jie}${v1}${i18n.star}`;
            }
        });
        this.NdMenuBar.setRecordCurMenu(true);

        const _selectMenuConfig = this.UpdateRed(roleInfo.reborn, roleInfo.star);
        // ??????
        this.NdMenuBar.select(_selectMenuConfig.reb, _selectMenuConfig.star);
    }

    /**
     *  ?????????????????????????????????????????????
     * @param reborn ????????????
     * @param lastStar ????????????
     * @returns
     */
    private UpdateRed(reborn: number, lastStar: number): { reb: number, star: number } {
        const redPointConfig = ModelMgr.I.UpStarModel.redPoint();
        let starLv = -1;
        for (const key in redPointConfig) {
            const element = redPointConfig[key];
            if (element && starLv < 0) {
                starLv = Number(key);
            }
            this.NdMenuBar.updateRed(element, reborn, key);
        }
        if (starLv < 0) {
            starLv = lastStar;
        }
        return { reb: reborn, star: starLv };
    }

    /** ??????????????? */
    private reselectMenu(reborn: number, star: number) {
        /** ?????????????????? */
        this.selectMatEquips = [];
        const pid = reborn;
        const cid = star;
        // ????????????
        this.btnAddMat.active = !this.changeBtnStatus();
        this.btnUpStar.active = this.changeBtnStatus();
        this.targetEquipName.string = `${pid}${i18n.jie}${cid}${i18n.star}`;
        const tipStr = i18n.tt(Lang.equip_tip_upstar);
        this.tipLab.string = UtilString.FormatArray(tipStr, ['3', pid, cid - 1, pid, cid]);

        this.getSelectBarEquip(pid, cid); // ???????????????????????????
        this.isSelected = false;
        this.UpdateRed(reborn, star);
    }

    /**
     * ????????????????????????????????????????????????
     * @param pid ??????
     * @param cid ??????
     */
    private getSelectBarEquip(pid: number, cid: number) {
        // ????????????
        const upStarData: UpStar = ModelMgr.I.UpStarModel.getEquip(pid, cid);
        this._currentStarEquips = upStarData;
        const mats = upStarData.mats;
        // ???????????????????????????
        this.selectMatEquips = mats.length > 3 ? [mats[0], mats[1], mats[2]] : mats.slice();

        // ????????????????????????????????????????????? ???????????????????????????
        const indexAndHave = ModelMgr.I.UpStarModel.defaultpartIndex(upStarData.equipStar);
        this.configBtnGroups(upStarData, indexAndHave.idx, indexAndHave.allHave);
    }

    private selectPart(configs: UpStar, idx: number, isFill: boolean = false, isPartSelectPart: boolean = false) {
        const reborn = configs.equipReborn;
        const star = configs.equipStar;
        const part = idx + 1; // ?????????0??????  ????????????1??????
        const targetItemId = UtilUnionId.CreateEquipId(5, reborn, star, part);
        const itm: Cfg_Item = UtilItem.GetCfgByItemId(Number(targetItemId));
        if (itm) {
            const cmp = this.NdMatItem5.getComponent(NdBuildItem);
            const item: ItemModel = UtilItem.NewItemModel(itm.Id);
            this.fillData(cmp, item);
            this.needMaterial(reborn, star);
            this.autoSetEquip(isFill, isPartSelectPart);
        }
    }

    /** ?????????????????? */
    private autoSetEquip(isFill: boolean = false, isPartSelect: boolean = false) {
        const mats = this.selectMatEquips;
        const itemCmp1 = this.NdMatItem1.getComponent(NdBuildItem);
        const itemCmp2 = this.NdMatItem2.getComponent(NdBuildItem);
        const itemCmp3 = this.NdMatItem3.getComponent(NdBuildItem);
        UtilRedDot.UpdateRed(this.btnUpStar, false, cc.v2(75, 20));
        UtilRedDot.UpdateRed(this.btnAddMat, false, cc.v2(75, 20));
        if (isPartSelect) {
            return;
        }
        const currentAllMats = this._currentStarEquips.mats;
        if (currentAllMats.length <= 3 && !isFill) {
            // ????????????
            const data1 = mats[0];
            if (data1) {
                this.fillData(itemCmp1, data1);
            } else {
                this.clearItem(itemCmp1);
            }

            const data2 = mats[1];
            if (data2) {
                this.fillData(itemCmp2, data2);
            } else {
                this.clearItem(itemCmp2);
            }

            const data3 = mats[2];
            if (data3) {
                this.fillData(itemCmp3, data3);
            } else {
                this.clearItem(itemCmp3);
            }
            /** ?????????????????????????????? */
            if (currentAllMats.length === 3) {
                const matEnuogh = this.needMaterial(0, this._currentStarEquips.equipStar);
                UtilRedDot.UpdateRed(this.btnUpStar, true && matEnuogh, cc.v2(75, 20));
                UtilRedDot.UpdateRed(this.btnAddMat, true && matEnuogh, cc.v2(75, 20));
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            const matEnuogh = this.needMaterial(0, this._currentStarEquips.equipStar);
            if (isFill) {
                UtilRedDot.UpdateRed(this.btnUpStar, true && matEnuogh, cc.v2(75, 20));
                this.fillData(itemCmp1, mats[0]);
                this.fillData(itemCmp2, mats[1]);
                this.fillData(itemCmp3, mats[2]);
            } else {
                UtilRedDot.UpdateRed(this.btnAddMat, true && matEnuogh, cc.v2(75, 20));
                this.clearWithAdd(itemCmp1);
                this.clearWithAdd(itemCmp2);
                this.clearWithAdd(itemCmp3);
            }
        }
        this.btnAddMat.active = this._currentStarEquips.mats.length !== 3;
        this.btnUpStar.active = this._currentStarEquips.mats.length === 3;
    }

    private fillData(nd: NdBuildItem, dta: ItemModel) {
        if (dta) {
            nd.loadIcon(dta);
            nd.hideCount();
            nd.hideLv();
            nd.hideClickNode(false);
        } else {
            this.clearWithAdd(nd);
        }
    }

    private clearItem(nd: NdBuildItem) {
        nd.clear();
        nd.setData(null);
        nd.hideClickNode(false);
    }

    private clearWithAdd(nd: NdBuildItem) {
        nd.clear();
        nd.setData(1);
        nd.hideClickNode(true);
    }

    /**
     * ???????????????
     * @param reborn ??????
     * @param star ??????
     * @returns ??????????????????
     */
    private needMaterial(reborn: number, star: number): boolean {
        this.NdMatItem4.active = star >= 5;
        if (this.NdMatItem4.active) {
            const cpm = this.NdMatItem4.getComponent(NdBuildItem);
            const iditor: ConfigIndexer = Config.Get(Config.Type.Cfg_Equip_Star);
            const configKey = UtilUnionId.CreateUpStarKey(this._currentStarEquips.equipReborn, this._currentStarEquips.equipStar);
            const itm: Cfg_Equip_Star = iditor.getValueByKey(configKey);
            const itmItem = itm.Item.split(':');
            const ite: ItemModel = UtilItem.NewItemModel(Number(itmItem[0]));
            cpm.loadIcon(ite, {
                where: ItemWhere.OTHER, needName: false, needNum: false, hideStar: true,
            });
            const count = Number(itmItem[1]);
            const spBagNum: number = BagMgr.I.getItemNum(Number(itmItem[0]));
            const color = spBagNum >= count ? UtilColor.ColorEnough : UtilColor.ColorUnEnough;
            cpm.setCount(`${spBagNum}/${itmItem[1]}`, color);
            cpm.setLv(ite.cfg.ArmyLevel);
            return spBagNum >= count;
        }

        return true;
    }

    private configBtnGroups(configs: UpStar, selectIndex: number = 0, have: boolean = false) {
        this._selectIndex = selectIndex;

        for (let index = configs.items.length; index < this.btnGroup.children.length; index++) {
            const element = this.btnGroup.children[index];
            element.destroy();
        }
        for (let i = 0; i < configs.items.length; i++) {
            let nd: cc.Node = null;
            if (i < this.btnGroup.children.length) {
                nd = this.btnGroup.children[i];
            } else {
                // ??????
                nd = cc.instantiate(this.partItemPrefab);
                this.btnGroup.addChild(nd);
            }

            const ndCopm = nd.getComponent(ToggleBtnItem);
            // const config: Cfg_MeltPartToType = Config.Get(Config.Type.Cfg_MeltPartToType).getValueByKey(i + 1);
            const partName = UtilItem.GetEquipPartName(i + 1);
            ndCopm.setName(partName);
            ndCopm.setIndex(i);

            // ?????????????????????
            ndCopm.initCheckState(i === selectIndex);
            // ???????????????????????????
            ndCopm.setFlagState(i === selectIndex && !have);
            nd.targetOff(this);
            UtilGame.Click(nd, (node: cc.Node) => {
                const idx: number = node.getComponent(ToggleBtnItem)._toggleIdx;
                if (idx === this._selectIndex) {
                    // ???????????? ??????????????????
                    return;
                }
                this._selectIndex = idx;
                for (const item of this.btnGroup.children) {
                    const tgItem: ToggleBtnItem = item.getComponent(ToggleBtnItem);
                    tgItem.initCheckState(tgItem._toggleIdx === idx);
                }
                this.selectPart(configs, this._selectIndex, false, true);
            }, this);
        }
        this.selectPart(configs, this._selectIndex);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.UpStar.ClickSelectEquip, this.toSelectEquip, this);
        EventClient.I.off(E.UpStar.SelectFinish, this.selectFinish, this);
        EventClient.I.off(E.UpStar.UpStarSuccess, this.upstarSuccess, this);
        EventClient.I.off(E.Bag.ItemChange, this.onItemChange, this);
    }

    /** ??????????????? */
    private isSelected: boolean = false;
    private toSelectEquip() {
        // if (!this.node.active) return;
        WinMgr.I.open(ViewConst.UpStarSelectEquipWin, this._currentStarEquips, this.isSelected ? this.selectMatEquips : []);
    }

    private selectMatEquips: ItemModel[] = [];

    // ????????????
    private selectFinish(indexs: number[]) {
        // if (!this.node.active) return;
        this.isSelected = true;
        const sMats: ItemModel[] = [];
        const mats = this._currentStarEquips.mats;
        for (let i = 0; i < indexs.length; i++) {
            const idx = indexs[i];
            const mat = mats[Math.abs(idx)];
            sMats.push(mat);
        }
        this.selectMatEquips = sMats;

        this.autoSetEquip(true);
        this.btnAddMat.active = !this.changeBtnStatus();
        this.btnUpStar.active = this.changeBtnStatus();
    }

    /** ?????????????????? */
    private changeBtnStatus(): boolean {
        return this.selectMatEquips.length >= 3;
    }

    private upstarSuccess(data: S2CItemPop) {
        // if (!this.node.active) return;
        this.isSelected = false;
        const Item: ItemModel = UtilItem.NewItemModel(data.ItemData[0]);
        WinMgr.I.open(ViewConst.UpStarRewardWin, Item);
        this._currentStarEquips.items[this._selectIndex].push(Item); // ??????????????????
        this.reUpdateUI();
    }

    private reUpdateUI() {
        for (let i = 0; i < this.selectMatEquips.length; i++) {
            const item = this.selectMatEquips[i];
            const idx = this._currentStarEquips.mats.indexOf(item);
            this._currentStarEquips.mats.splice(idx, 1);
        }
        this.selectMatEquips = [];
        this.btnAddMat.active = !this.changeBtnStatus();
        this.btnUpStar.active = this.changeBtnStatus();
        this.getSelectBarEquip(this._currentStarEquips.equipReborn, this._currentStarEquips.equipStar);
        const roleInfo = ModelMgr.I.UpStarModel.GetRoleInfo();
        const _selectMenuConfig = this.UpdateRed(roleInfo.reborn, roleInfo.star);
        // ??????
        // console.log(_selectMenuConfig.reb, _selectMenuConfig.star, '-----aaaaaaaaaa-----');
        // ????????????????????????
        // const redMap = ModelMgr.I.UpStarModel.redPoint();
        // if (redMap[this._currentStarEquips.equipStar]) {
        //     this.NdMenuBar.select(_selectMenuConfig.reb, this._currentStarEquips.equipStar);
        // } else {
        this.NdMenuBar.select(_selectMenuConfig.reb, _selectMenuConfig.star);
        // }
    }
}
