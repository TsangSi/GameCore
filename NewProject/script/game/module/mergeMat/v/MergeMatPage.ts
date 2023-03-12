import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { ColorsLabel } from '../../../base/components/ColorsLabel';
import { MenuBar } from '../../../base/components/menubar/MenuBar';
import { NumberChoose } from '../../../base/components/NumberChoose';
import { Config } from '../../../base/config/Config';
import { ConfigItemIndexer } from '../../../base/config/indexer/ConfigItemIndexer';
import { ConfigStickIndexer } from '../../../base/config/indexer/ConfigStickIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilObject from '../../../base/utils/UtilObject';
import { NdAttrBaseContainer } from '../../../com/attr/NdAttrBaseContainer';
import { ItemQuality, ItemWhere } from '../../../com/item/ItemConst';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { MergeMatModel } from '../MergeMatModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class MergeMatPage extends WinTabPage {
    @property(MenuBar)
    private menus: MenuBar = null;
    // 产出
    @property(ItemIcon)
    private itemOutPut: ItemIcon = null;
    // 消耗
    @property(ItemIcon)
    private itemCost: ItemIcon = null;
    // name
    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(ColorsLabel)
    private labNameColors: ColorsLabel = null;
    // 数量
    @property(cc.Label)
    private LabCount: cc.Label = null;
    /** 点击合成 */
    @property(cc.Node)
    private NdMerge: cc.Node = null;
    /** 合成属性 */
    @property(cc.Node)
    private NdAttrContainer: cc.Node = null;
    @property(cc.Node)
    private NdShowAttr: cc.Node = null;

    @property(NumberChoose)
    private NdUseNumChoose: NumberChoose = null;

    @property(cc.Node)
    private mergetRed: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdMerge, this._mergeMaterial, this, { unRepeat: true, time: 200 });
        EventClient.I.on(E.MergeMat.MergeSuccess, this._onMergeSuccess, this);
        EventClient.I.on(E.MergeMat.SuccessUpdateUI, this._onMergeSuccessUpdateUI, this);
        EventClient.I.on(E.Bag.ItemChange, this._onItemChange, this);
    }

    private _onItemChange(change: { itemModel, status }[]) {
        if (change && change.length) {
            for (let i = 0, len = change.length; i < len; i++) {
                const itemModel: ItemModel = change[i].itemModel;
                const cfg: Cfg_Stick = this._indexer.getValueByIndex(this._mindex);
                const needItemArr = cfg.NeedItem.split(':');
                const needItemId: number = Number(needItemArr[0]);
                if (needItemId === itemModel.data.ItemId) {
                    /** 更新数量与合成状态 */
                    this._onMergeSuccessUpdateUI();// 此处可选操作
                    // this.selectStickItem(this._mindex);
                    break;
                }
            }
        }
        this._initRed();
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Bag.ItemChange, this._onItemChange, this);
        EventClient.I.off(E.MergeMat.MergeSuccess, this._onMergeSuccess, this);
        EventClient.I.off(E.MergeMat.SuccessUpdateUI, this._onMergeSuccessUpdateUI, this);
    }

    /** 合成成功奖励展示 */
    private _onMergeSuccess(data: ItemInfo[]) {
        const arr = [];
        for (const item of data) {
            const itemModel: ItemModel = UtilItem.NewItemModel(item.ItemId, item.ItemNum);
            arr.push(itemModel);
        }
        WinMgr.I.open(ViewConst.GetRewardWin, arr);
    }

    private model: MergeMatModel;
    public init(winId: number, param: any[]): void {
        super.init(winId, param, 0);
        this.model = ModelMgr.I.MergeMatModel;
        this._initMenuBar();
    }
    public refreshPage(): void {
        this._initMenuBar();
    }

    private _indexer: ConfigStickIndexer;
    private _cfgItemIndexer: ConfigItemIndexer;
    private _initMenuBar(): void {
        const menus: MenuBar = this.menus.getComponent(MenuBar);
        this._indexer = Config.Get(Config.Type.Cfg_Stick);
        const indexer2 = Config.Get(Config.Type.Cfg_StickType);
        // const nestedMap: any = this._indexer.getNestedMap();
        const map: any = this._indexer.getNestedMap();
        const nestedMap = UtilObject.clone(map, true);
        // console.log(nestedMap);
        const keys = Object.keys(nestedMap);
        for (let i = 0; i < keys.length; i++) {
            const k1 = keys[i];// 一级标签
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const keys2 = Object.keys(nestedMap[k1]);// {201: {…}, 202: {…}, 203: {…}, 204: {…}}// 二级标签
            if (keys2 && keys2.length) {
                for (let j = 0; j < keys2.length; j++) {
                    const k2 = keys2[j];
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    const obj = nestedMap[k1][k2];
                    if (obj) {
                        const keys3 = Object.keys(obj);// 三级标签 {2: 0, 3: 1, 4: 2, 5: 3}
                        if (keys3 && keys3.length) {
                            for (let n = 0; n < keys3.length; n++) {
                                const k3 = keys3[n];
                                // console.log(k1, k2, k3);
                                const cfg = this.model.getStickCfgBy3Key(Number(k1), Number(k2), Number(k3));
                                const funcId = cfg.FuncId;
                                if (!UtilFunOpen.isOpen(Number(funcId))) {
                                    // 功能未开启
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                    delete nestedMap[k1][k2][k3];
                                }
                            }
                        } else {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            delete nestedMap[k1][k2];
                        }
                    } else {
                        console.log('配置错误,最少配置三级标签');
                    }
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                delete nestedMap[k1];
            }
        }

        for (let i = 0; i < keys.length; i++) {
            const k1 = keys[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const obj = nestedMap[k1];
            if (!obj || obj === {} || Object.keys(obj).length === 0) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                delete nestedMap[k1];
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const keys2 = Object.keys(nestedMap[k1]);// {201: {…}, 202: {…}, 203: {…}, 204: {…}}// 二级标签
                for (let j = 0; j < keys2.length; j++) {
                    const k2 = keys2[j];
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    const obj2 = nestedMap[k1][k2];
                    if (!obj2 || !Object.keys(obj2).length) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        delete nestedMap[k1][k2];
                    }
                }
            }
        }

        for (let i = 0; i < keys.length; i++) {
            const k1 = keys[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const obj = nestedMap[k1];
            if (!obj || obj === {} || Object.keys(obj).length === 0) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                delete nestedMap[k1];
            }
        }

        // 道具表
        this._cfgItemIndexer = Config.Get(Config.Type.Cfg_Item);
        // 默认选中某个

        menus.setData(nestedMap, ['FirstType', 'SecondType', 'ThirdType'], this.selectStickItem, this, (indexs: number | number[], k) => {
            let name: string;
            if (k === 'FirstType') {
                const type = Number(this._indexer.getValueByIndex(Number(indexs), k));
                name = indexer2.getValueByKey(type, 'Name');
            } else if (k === 'SecondType') {
                const type = Number(this._indexer.getValueByIndex(Number(indexs), k));
                name = indexer2.getValueByKey(type, 'Name');
            } else { // ItemId
                const itemId: number = this._indexer.getValueByIndex(Number(indexs), 'ItemId');
                const itemCfg: Cfg_Item = this._cfgItemIndexer.getValueByKey(itemId);
                if (!itemCfg) {
                    console.log(itemCfg);
                }
                name = itemCfg.Name;
            }
            return name;
        });
        // 默认选中某个
        this._initRed();
        const idx = this.model.getCanMergeIndex();// 获取当前可合成的项 也就是默认选中的项
        const cfg: Cfg_Stick = this._indexer.getValueByIndex(idx);
        this.menus.select(...[cfg.FirstType, cfg.SecondType, cfg.ThirdType]);
    }

    private _initRed() { // 所有页签都判断是否有红点
        const menus: MenuBar = this.menus.getComponent(MenuBar);
        const indexer = Config.Get(Config.Type.Cfg_Stick);
        const len = indexer.length; // 根据索引搞到所有的配置
        for (let i = 0; i < len; i++) { // 0----280
            const cfg = this.model.getCfgByIndex(i);
            const bol = this.model.isCanMerge(cfg);
            menus.updateRed(bol, cfg.FirstType, cfg.SecondType, cfg.ThirdType);
        }
    }

    /** 发送合成 */
    private _mergeMaterial() {
        const cfg: Cfg_Stick = this._indexer.getValueByIndex(this._mindex);
        const itemId: number = cfg.ItemId;// 产出
        const needItemArr = cfg.NeedItem.split(':');

        const needItemId: number = Number(needItemArr[0]);
        const needItemNum: number = Number(needItemArr[1]);

        const bagNum: number = BagMgr.I.getItemNum(needItemId);
        const itemNeedCfg: Cfg_Item = this._cfgItemIndexer.getValueByKey(needItemId);

        if (bagNum >= needItemNum) { // 数量足够 判断输入框
            if (this.NdUseNumChoose.curCount <= 0) {
                MsgToastMgr.Show(i18n.tt(Lang.mergematerial_num));
            } else {
                ControllerMgr.I.MergeMatController.reqC2SComMaterial(itemId, this.NdUseNumChoose.curCount);
            }
        } else {
            MsgToastMgr.Show(`${itemNeedCfg.Name}${i18n.tt(Lang.not_enough)}`);// xx不足
        }
    }

    private _onMergeSuccessUpdateUI() {
        // 判断当前是否还可以继续合成 不可以合成再选中可合成的
        this._indexer = Config.Get(Config.Type.Cfg_Stick);
        const cfgStick: Cfg_Stick = this._indexer.getValueByIndex(this._mindex);

        this._initRed();
        if (this.model.isCanMerge(cfgStick)) { // 当前还可合成
            this.selectStickItem(this._mindex);
        } else {
            const idx = this.model.getCanMergeIndex();// 获取当前可合成的项 也就是默认选中的项
            const cfg: Cfg_Stick = this._indexer.getValueByIndex(idx);
            this.menus.select(...[cfg.FirstType, cfg.SecondType, cfg.ThirdType]);
            this._mindex = idx;
            this.selectStickItem(this._mindex);
        }
    }

    /** 左侧选中，右侧展示 */
    private _mindex: number = -1;
    public selectStickItem(index: number): void {
        this._mindex = index;

        const cfg: Cfg_Stick = this._indexer.getValueByIndex(this._mindex);
        const itemId: number = cfg.ItemId;
        const needItemArr = cfg.NeedItem.split(':');

        const needItemId: number = Number(needItemArr[0]);
        const needItemNum: number = Number(needItemArr[1]);

        const itemOutPutModel: ItemModel = UtilItem.NewItemModel(itemId, 1);
        const itemCostModel: ItemModel = UtilItem.NewItemModel(needItemId, needItemNum);

        this.itemOutPut.setData(itemOutPutModel, { where: ItemWhere.OTHER }); // 产出什么物品
        this.itemCost.setData(itemCostModel, { where: ItemWhere.OTHER }); // 需要消耗什么物品
        // 名称
        const itemCfg: Cfg_Item = this._cfgItemIndexer.getValueByKey(itemId);
        if (itemOutPutModel.cfg.Quality === ItemQuality.COLORFUL) {
            this.labNameColors.string = itemCfg.Name;
            this.labNameColors.colors = UtilItem.getColorFulColor();
            this.LabName.string = '';
        } else {
            UtilItem.ItemNameScrollSet(itemOutPutModel, this.LabName, itemOutPutModel.cfg.Name, false);
            this.labNameColors.string = '';
            this.LabName.string = itemCfg.Name;
        }

        // 数量
        let color: string = UtilColor.GreenD;
        const bagNum: number = BagMgr.I.getItemNum(needItemId);
        if (bagNum < needItemNum) {
            color = UtilColor.RedD;
        }
        // 字体颜色
        this.LabCount.string = `${UtilNum.Convert(bagNum)}/${UtilNum.Convert(needItemNum)}`;
        this.LabCount.node.color = UtilColor.Hex2Rgba(color);

        // 更新属性
        const attrId: number = itemCfg.AttrId;
        if (attrId) {
            const attr: IAttrBase[] = UtilAttr.GetAttrBaseListById(attrId);
            this.NdAttrContainer.getComponent(NdAttrBaseContainer).init(attr);
            this.NdShowAttr.active = true;
        } else {
            this.NdShowAttr.active = false;
        }

        const num: number = Math.floor(bagNum / needItemNum);
        if (num === 0) {
            this.NdUseNumChoose.setMaxCount(1);
            this.NdUseNumChoose.curCount = 1;
        } else {
            this.NdUseNumChoose.setMaxCount(num);
            this.NdUseNumChoose.curCount = num;
        }

        this.mergetRed.active = bagNum >= needItemNum;
    }
}
