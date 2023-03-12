import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { MenuBar } from '../../../../base/components/menubar/MenuBar';
import { Config } from '../../../../base/config/Config';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import ItemModel from '../../../../com/item/ItemModel';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagMgr } from '../../../bag/BagMgr';
import { RoleAN } from '../../../role/RoleAN';
import { RoleMgr } from '../../../role/RoleMgr';
import { NdBuildItem } from './NdBuildItem';
import { ToggleBtnItem } from '../../v/ToggleBtnItem';
import { ItemType, ItemWhere } from '../../../../com/item/ItemConst';
import { FromPlace } from '../BuildConst';
import { GradeMgr } from '../../../grade/GradeMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';

const { ccclass, property } = cc._decorator;

/**
 * 锻造
 * @author ylj
 */
@ccclass
export class BuildPage extends WinTabPage {
    @property(MenuBar)
    private menus: MenuBar = null;

    /** 使用天火 */
    @property(cc.Node)
    private NdTgUseTh: cc.Node = null;
    /** 打造 */
    @property(cc.Node)
    private NdBuid: cc.Node = null;
    /** 打造上有个红点，直接判断材料是否足够 */
    @property(cc.Node)
    private SprRed: cc.Node = null;
    /** 中间的点击事件 */
    @property(cc.Node)
    private NdEvent: cc.Node = null;
    /** 按钮容器 */
    @property(cc.Node)
    private BtnContainer: cc.Node = null;
    @property(cc.Prefab)
    private ToggleBtnItem: cc.Prefab = null;
    /** 消耗 */
    @property(DynamicImage)
    private NdCostIcon: DynamicImage = null;
    @property(cc.Label)
    private LabCostNum: cc.Label = null;

    /** 顶部的描述 */
    @property(cc.Node)
    private NdDesc: cc.Node = null;

    @property(cc.Node)
    private NdTip: cc.Node = null;

    @property(NdBuildItem)
    private NdBuildItems: NdBuildItem[] = [];

    // @property(UITransform)
    // private SprCostBgTrans: UITransform;
    // @property(UITransform)
    // private CostNodeTrans: UITransform;

    private _curSelectIdx: number = 0;
    /** 表格索引 */
    private _tableIndexs: number[];

    /** 刷新 */
    public changeTab(param): void {
        //
    }

    protected start(): void {
        super.start();
        /** 弹出中间tip */
        UtilGame.Click(this.NdEvent, () => {
            const cfg: Cfg_EquipBuildNew = ModelMgr.I.BuildModel.getCfgByIndex(this._tableIndexs[this._curSelectIdx]);
            const showItemId: number = cfg.ShowItemId;
            const showitemModel = UtilItem.NewItemModel(showItemId, 1);
            WinMgr.I.open(ViewConst.ItemTipsBuildWin, showitemModel);
        }, this);

        UtilGame.Click(this.NdBuid, () => {
            const cfg: Cfg_EquipBuildNew = ModelMgr.I.BuildModel.getCfgByIndex(this._tableIndexs[this._curSelectIdx]);
            let itemModel: ItemModel = null;
            if (cfg.EquipSys === ItemType.EQUIP_ROLE) {
                if (!RoleMgr.I.getArmyLevel()) {
                    MsgToastMgr.Show(i18n.tt(Lang.build_army_not_enough));// 军衔等级不足
                    return;
                }
                if (this._useTh) { // /** 天火 */
                    const thItemStr: string[] = cfg.ExcAttrStone.split(':');
                    const thItemId: number = Number(thItemStr[0]);
                    const thItemNum: number = Number(thItemStr[1]);
                    const thBagNum: number = BagMgr.I.getItemNum(thItemId);
                    itemModel = UtilItem.NewItemModel(thItemId, thItemNum);
                    if (thItemNum > thBagNum) {
                        MsgToastMgr.Show(`${itemModel.cfg.Name}${i18n.tt(Lang.build_num_notenough)}`);// 数量不足
                        return;
                    }
                }
            }

            /** 碎片 */
            const spItemStr: string[] = cfg.NeedItem1.split(':');
            const spItemId: number = Number(spItemStr[0]);
            const spItemNum: number = Number(spItemStr[1]);
            const spBagNum: number = BagMgr.I.getItemNum(spItemId);
            itemModel = UtilItem.NewItemModel(spItemId, spItemNum);
            if (spItemNum > spBagNum) {
                MsgToastMgr.Show(`${itemModel.cfg.Name}${i18n.tt(Lang.build_num_notenough)}`);// 数量不足
                return;
            }

            /** t图纸 */
            const tzItemStr: string[] = cfg.NeedItem2.split(':');
            const tzItemId: number = Number(tzItemStr[0]);
            const tzItemNum: number = Number(tzItemStr[1]);
            const tzBagNum: number = BagMgr.I.getItemNum(tzItemId);
            itemModel = UtilItem.NewItemModel(tzItemId, tzItemNum);
            if (tzItemNum > tzBagNum) {
                MsgToastMgr.Show(`${itemModel.cfg.Name}${i18n.tt(Lang.build_num_notenough)}`);// 数量不足
                return;
            }

            /** 打造石 */
            const dzsItemStr: string[] = cfg.PrefBuildStone.split(':');
            const dzsItemId: number = Number(dzsItemStr[0]);
            const dzsItemNum: number = Number(dzsItemStr[1]);
            const dzsBagNum: number = BagMgr.I.getItemNum(dzsItemId);
            itemModel = UtilItem.NewItemModel(dzsItemId, dzsItemNum);
            if (dzsItemNum > dzsBagNum) {
                MsgToastMgr.Show(`${itemModel.cfg.Name}${i18n.tt(Lang.build_num_notenough)}`);// 数量不足
                return;
            }

            const costItemStr: string[] = cfg.CostMoney.split(':');
            const costItemId: number = Number(costItemStr[0]);
            const costItemNum: number = Number(costItemStr[1]);
            const costBagNum: number = RoleMgr.I.getCurrencyById(costItemId);
            if (costItemNum > costBagNum) {
                const name: string = UtilCurrency.getNameByType(costItemId);
                MsgToastMgr.Show(`${name}${i18n.tt(Lang.not_enough)}`);// 不足
                return;
            }

            const part = this._curSelectIdx + 1;
            if (GradeMgr.I.isGradeEqiup(cfg.EquipSys)) {
                const gradeId = GradeMgr.I.getGradeIdBySubType(cfg.EquipSys);
                ControllerMgr.I.GradeController.reqC2SGradeEquipMake(gradeId, cfg.EquipPart, cfg.EquipLevel);
            } else {
                ControllerMgr.I.BuildController.reqBuildEquip(part, this._useTh ? 1 : 0);
            }
        }, this);

        this.NdTgUseTh.on('toggle', this._onUseClick, this);
        EventClient.I.on(E.Build.BuildEquip, this._onBuildEquip, this);
        // EventClient.I.on(E.Grade.UpdateInfo, this._updateGradeInfo, this);
        RoleMgr.I.on(this.onUpdateJade, this, RoleAN.N.ItemType_Coin2);
        // 背包物品变化，更新打造UI&红点
        EventClient.I.on(E.Bag.ItemChange, this._onItemChange, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Bag.ItemChange, this._onItemChange, this);
        // EventClient.I.off(E.Grade.UpdateInfo, this._updateGradeInfo, this);
        EventClient.I.off(E.Build.BuildEquip, this._onBuildEquip, this);
        RoleMgr.I.off(this.onUpdateJade, this, RoleAN.N.ItemType_Coin2);
    }

    /** 元宝变化 */
    public onUpdateJade(): void {
        this._showCostInfo();
    }

    private _onItemChange(changes: ItemModel[]): void {
        console.log(changes);
        // 抽空做下过滤
        // this._initMenuBar();
        this._initBuildInfo();
        this._initRed();
    }

    /** 打造成功 */
    private _onBuildEquip(data: S2CItemPop): void {
        const arr = [];
        for (const item of data.ItemData) {
            const itemModel: ItemModel = UtilItem.NewItemModel(item);
            arr.push(itemModel);
        }
        WinMgr.I.open(ViewConst.GetRewardWin, arr, FromPlace.BUILD_EQUIP);
        // WinMgr.I.open(ViewConst.GetRewardWin, arr);
        const firstIndx = this._tableIndexs[0];
        const cfg = ModelMgr.I.BuildModel.getCfgByIndex(firstIndx);
        this._curSelectIdx = this._getDefaultSelect(cfg.EquipSys); /** 默认选中哪一个 */
        MsgToastMgr.Show(i18n.tt(Lang.build_success));// '打造成功'
        this._initToggleGroup(this._tableIndexs);

        /** 打造成功 更新红点 */
        this._initRed();
    }

    // /** 进阶 光武 坐骑更新 */
    // private _updateGradeInfo() {
    //     //

    // }

    /** 是否使用天火 */
    private _useTh: boolean = false;
    private _onUseClick(): void { /** 使用天火 */
        const ck: boolean = this.NdTgUseTh.getComponent(cc.Toggle).isChecked;
        this._useTh = ck;
        ModelMgr.I.BuildModel.isThCk = ck;

        // 先不判断天火
        // const tableIdx = this._tableIndexs[this._curSelectIdx];
        // const cfg = ModelMgr.I.BuildModel.getCfgByIndex(tableIdx);
        // const bol = ModelMgr.I.BuildModel.isCanBuild(cfg);
        // this.menus.updateRed(bol, EquipSys.ROLE_EQUIP, cfg.EquipLevel);

        // if (cfg.EquipSys === EquipSys.ROLE_EQUIP && !RoleMgr.I.getArmyLevel()) {
        //     this.SprRed.active = false;
        // } else {
        //     this.SprRed.active = ModelMgr.I.BuildModel.isCanBuild(cfg);
        // }
    }

    public init(winId: number, param: any[]): void {
        super.init(winId, param, 0);
        this.NdTgUseTh.getComponent(cc.Toggle).isChecked = false;
        ModelMgr.I.BuildModel.isThCk = false;
        if (!this._tableIndexs) {
            this._initMenuBar();
            const menuInfo = param && param[1] as { sys: number, lv: number };
            if (menuInfo) {
                const defaultMenuIdxs: number[] = [];
                const sys = menuInfo.sys;
                if (typeof sys === 'number') {
                    defaultMenuIdxs.push(sys);
                }
                const lv = menuInfo.lv;
                if (typeof lv === 'number') {
                    defaultMenuIdxs.push(lv);
                }
                if (defaultMenuIdxs.length > 0) {
                    this.menus.select(...defaultMenuIdxs);
                }
            }
        }
    }

    private _initMenuBar(): void {
        let roleArmyLevel: number = RoleMgr.I.getArmyLevel() || 1;// 转生等级不能为0
        const maxRoleArmyLvel = ModelMgr.I.BuildModel.getMaxArmyLevel();
        if (roleArmyLevel > maxRoleArmyLvel) {
            roleArmyLevel = maxRoleArmyLvel;
        }
        const menus: MenuBar = this.menus.getComponent(MenuBar);
        const indexer = Config.Get(Config.Type.Cfg_EquipBuildNew);
        const nestedMap: any = indexer.getNestedMap();

        const list: { [s: string]: { [lv: string]: any[] } } = {};
        for (const sys in nestedMap) {
            list[sys] = {};
            const sysId = Number(sys);
            if (sysId === ItemType.EQUIP_ROLE) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                for (const lv in nestedMap[sys]) {
                    if (Number(lv) === roleArmyLevel) {
                        // eslint-disable-next-line
                        list[sys][lv] = nestedMap[sys][lv].concat();
                        break;
                    }
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                for (const lv in nestedMap[sys]) {
                    // eslint-disable-next-line
                    list[sys][lv] = nestedMap[sys][lv].concat();
                }
            }
        }
        menus.setData(list, ['EquipSys', 'EquipLevel'], this.selectStickItem, this, (indexs: number | number[], k) => {
            if (k === 'EquipSys') {
                return indexer.getValueByIndex(indexs[0], 'EquipSysStr');
            } else {
                return indexer.getValueByIndex(indexs[0], 'EquipLevelStr');
            }
        });

        this._initRed();
    }

    private _initRed() {
        // 所有页签都判断是否有红点
        const menus: MenuBar = this.menus.getComponent(MenuBar);
        // 遍历所有索引 --》 并且找到索引对应的

        const indexer = Config.Get(Config.Type.Cfg_EquipBuildNew);
        // const nestedMap = indexer.getNestedMap();
        const len = indexer.length;

        // 根据索引搞到所有的配置
        for (let i = 0; i < len; i++) { // 0----280
            const cfg = ModelMgr.I.BuildModel.getCfgByIndex(i);
            // 角色装备 只关心当前军衔等级的
            if (cfg.EquipSys === ItemType.EQUIP_ROLE) {
                const armyLevel = RoleMgr.I.getArmyLevel();
                if (!armyLevel) {
                    continue;// 无军衔 不处理角色装备 正式环境有军衔才开启
                }
                // 军衔非等于当前军衔不处理
                if (cfg.EquipLevel !== armyLevel) {
                    continue;
                }
            }
            // sys,lv
            const bol = ModelMgr.I.BuildModel.isCanBuild(cfg);
            menus.updateRed(bol, cfg.EquipSys, cfg.EquipLevel);
        }
    }

    private selectStickItem(indexs: number[]) {
        this._initToggleGroup(indexs);
    }

    private _initToggleGroup(indexs: number[]): void {
        this._curSelectIdx = 0;
        this._tableIndexs = indexs;
        const len = this.BtnContainer.children.length;
        for (let index = indexs.length; index < len; index++) {
            const element = this.BtnContainer.children[index];
            element.destroy();
        }

        const firstIndx = this._tableIndexs[0];
        const cfg = ModelMgr.I.BuildModel.getCfgByIndex(firstIndx);
        const isRoleEquip = cfg.EquipSys === ItemType.EQUIP_ROLE;
        this.NdTgUseTh.active = isRoleEquip;
        this.NdTip.active = isRoleEquip;
        this.NdDesc.active = isRoleEquip;

        /** 默认选中哪一个 */
        this._curSelectIdx = this._getDefaultSelect(cfg.EquipSys);

        for (let i = 0, len = indexs.length; i < len; i++) {
            let node: cc.Node = null;
            if (i < this.BtnContainer.children.length) {
                node = this.BtnContainer.children[i];
            } else {
                // 新增
                node = cc.instantiate(this.ToggleBtnItem);
                this.BtnContainer.addChild(node);
            }
            const btnItem: ToggleBtnItem = node.getComponent(ToggleBtnItem);
            const name: string = ModelMgr.I.BuildModel.getCfgName(indexs[i], cfg.EquipSys);
            btnItem.setName(name);
            btnItem.setIndex(i);// 0---7

            // 默认选中第几个
            btnItem.initCheckState(i === this._curSelectIdx);
            // 默认推荐第几个部位
            btnItem.setFlagState(isRoleEquip && i === this._curSelectIdx);

            node.targetOff(this);
            UtilGame.Click(node, (node: cc.Node) => {
                const idx: number = node.getComponent(ToggleBtnItem)._toggleIdx;
                if (idx === this._curSelectIdx) {
                    // 已经选中 无需重复点击
                    return;
                }
                this._curSelectIdx = idx;
                for (const item of this.BtnContainer.children) {
                    const tgItem: ToggleBtnItem = item.getComponent(ToggleBtnItem);
                    tgItem.initCheckState(tgItem._toggleIdx === idx);
                }
                this._initBuildInfo();
            }, this);
        }
        this._initBuildInfo();
    }

    private _initBuildInfo(): void {
        const tabIdx: number = this._tableIndexs[this._curSelectIdx];
        const cfg: Cfg_EquipBuildNew = ModelMgr.I.BuildModel.getCfgByIndex(tabIdx);
        this._initCostInfo(cfg);
    }

    /** 默认选中部位  默认推荐部位 */
    private _getDefaultSelect(sys: number): number {
        if (sys === ItemType.EQUIP_ROLE) {
            const equipPart = ModelMgr.I.BuildModel.getDefaultBuildPos();
            return equipPart - 1;
        }
        return 0;
    }

    private _initCostInfo(cfg: Cfg_EquipBuildNew): void {
        const arrStr: string[] = [cfg.NeedItem1, cfg.NeedItem2, cfg.PrefBuildStone, cfg.ExcAttrStone];
        for (let i = 0, len = arrStr.length; i < len; i++) {
            const itemStr: string[] = arrStr[i].split(':');
            const itemId: number = Number(itemStr[0]);
            const item: NdBuildItem = this.NdBuildItems[i];
            item.node.active = itemId > 0;
            if (itemId > 0) {
                const itemNum: number = Number(itemStr[1]);
                const itemModel = UtilItem.NewItemModel(itemId, itemNum);
                item.loadIcon(itemModel, {
                    where: ItemWhere.ROLE_EQUIP, needName: false, needNum: false, hideStar: true,
                });
                const spBagNum: number = BagMgr.I.getItemNum(itemId);
                const bol = spBagNum >= itemNum;
                // 数量
                const color: cc.Color = bol ? cc.Color.GREEN : cc.Color.RED;

                item.setCount(`${UtilNum.Convert(spBagNum)}/${UtilNum.Convert(itemNum)}`, color);
                // 装备军衔等级
                item.setLv(itemModel.cfg.ArmyLevel);
            }
        }

        /** 展示物品 */
        const showItemId: number = cfg.ShowItemId;
        const showitemModel = UtilItem.NewItemModel(showItemId, 1);
        const NdCompScript: NdBuildItem = this.NdBuildItems[4].getComponent(NdBuildItem);
        NdCompScript.setLv(cfg.EquipLevel);
        NdCompScript.loadIcon(showitemModel, {
            where: ItemWhere.OTHER, needName: false, needNum: false, hideStar: true,
        });
        NdCompScript.setCount('', cc.Color.RED);

        this._showCostInfo();
    }

    private _showCostInfo() {
        /** 消耗货币 */
        const cfg: Cfg_EquipBuildNew = ModelMgr.I.BuildModel.getCfgByIndex(this._tableIndexs[this._curSelectIdx]);
        const costItemStr: string[] = cfg.CostMoney.split(':');
        const costItemId: number = Number(costItemStr[0]);
        const costImgUrl: string = UtilCurrency.getIconByCurrencyType(costItemId);
        this.NdCostIcon.loadImage(costImgUrl, 1, true);
        const costItemNum: number = Number(costItemStr[1]);
        const BagNum: number = RoleMgr.I.getCurrencyById(costItemId);
        // 数量
        const color = BagNum >= costItemNum ? UtilColor.ColorEnoughV : UtilColor.ColorUnEnoughV;// cc.Color.GREEN : cc.Color.RED;

        this.LabCostNum.string = `${UtilNum.Convert(BagNum)}/${UtilNum.Convert(costItemNum)}`;
        this.LabCostNum.node.color = color;
        // this.LabCostNum.updateRenderData();
        // 立即更新Lable和 node layout长度
        // this.CostNodeTrans.node.getComponent(cc.Layout).updateLayout();
        // this.SprCostBgTrans.width = this.CostNodeTrans.width + 120;
        /** 消耗品足够 则打造上显示一个红点 */
        if (cfg.EquipSys === ItemType.EQUIP_ROLE && !RoleMgr.I.getArmyLevel()) {
            this.SprRed.active = false;
        } else {
            this.SprRed.active = ModelMgr.I.BuildModel.isCanBuild(cfg);
        }
    }
}
