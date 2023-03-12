/*
 * @Author: kexd
 * @Date: 2022-09-22 16:46:04
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gskin\v\GskinPage.ts
 * @Description: 武将-皮肤
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import ListView from '../../../../base/components/listview/ListView';
import { Config } from '../../../../base/config/Config';
import { ConfigGeneralSkinIndexer } from '../../../../base/config/indexer/ConfigGeneralSkinIndexer';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import ModelMgr from '../../../../manager/ModelMgr';
import GeneralSkinEntity from '../../com/GeneralSkinEntity';
import GeneralSkinItem from '../../com/GeneralSkinItem';
import { GeneralMsg } from '../../GeneralConst';
import { GSkinState } from '../GskinConst';
import { i18n, Lang } from '../../../../../i18n/i18n';
import UtilItem from '../../../../base/utils/UtilItem';
import { BagMgr } from '../../../bag/BagMgr';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import ControllerMgr from '../../../../manager/ControllerMgr';
import { IAttrBase } from '../../../../base/attribute/AttrConst';
import { UtilAttr } from '../../../../base/utils/UtilAttr';
import { NdAttrBaseContainer } from '../../../../com/attr/NdAttrBaseContainer';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { ItemType } from '../../../../com/item/ItemConst';
import { BagItemChangeInfo } from '../../../bag/BagConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GskinPage extends WinTabPage {
    // 顶部信息
    @property(cc.Node)
    private NdEntity: cc.Node = null;
    // 列表
    @property(ListView)
    private ListSkin: ListView = null;
    // 状态
    @property(cc.Node)
    private NdAttrTitle: cc.Node = null;
    @property(cc.Label)
    private LabAttr: cc.Label = null;
    @property(cc.Label)
    private LabNotActive: cc.Label = null;
    @property(cc.Node)
    private BtnUnActive: cc.Node = null;
    @property(cc.Node)
    private BtnActive: cc.Node = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Node)
    private BtnMax: cc.Node = null;
    // 属性
    @property(cc.Node)
    private NdAttr: cc.Node = null;
    // 消耗
    @property(ItemIcon)
    private ItemCost: ItemIcon = null;
    @property(cc.Label)
    private LabNum: cc.Label = null;
    @property(cc.Label)
    private LabNeed: cc.Label = null;

    private _GeneralSkinEntity: GeneralSkinEntity = null;
    private _curData: GeneralMsg = null;
    private _generalSkin: Cfg_GeneralSkin[] = [];
    private _selectSkinId: number = 0;
    private _state: GSkinState = GSkinState.UnActive;

    protected start(): void {
        super.start();
        this.addE();
        this.clk();
        this.uptUI();
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.GeneralSkinEntity, this.NdEntity, (err, node) => {
            this._GeneralSkinEntity = node.getComponent(GeneralSkinEntity);
            this._GeneralSkinEntity.uptContent(this._curData.generalData.OnlyId, this._selectSkinId);
        });
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        UtilCocos.SetSpriteGray(this.BtnUnActive, true);
        UtilCocos.SetSpriteGray(this.BtnMax, true);
    }

    private addE() {
        EventClient.I.on(E.General.UptGskin, this.uptSkin, this);
        EventClient.I.on(E.General.GskinWear, this.uptSkin, this);
        EventClient.I.on(E.Bag.ItemChange, this.onBagChange, this);
    }

    private remE() {
        EventClient.I.off(E.General.UptGskin, this.uptSkin, this);
        EventClient.I.off(E.General.GskinWear, this.uptSkin, this);
        EventClient.I.off(E.Bag.ItemChange, this.onBagChange, this);
    }

    private clk() {
        UtilGame.Click(this.BtnActive, () => {
            ControllerMgr.I.GeneralController.reqGeneralSkinLevelUp(this._selectSkinId);
        }, this);

        UtilGame.Click(this.BtnUp, () => {
            if (this._state === GSkinState.CanUpStar) {
                ControllerMgr.I.GeneralController.reqGeneralSkinLevelUp(this._selectSkinId);
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.general_gskin_less));
            }
        }, this);
    }

    private onBagChange(changes: BagItemChangeInfo[]) {
        let check: boolean = false;
        if (changes) {
            for (let i = 0; i < changes.length; i++) {
                if (changes[i].itemModel && changes[i].itemModel.cfg
                    && changes[i].itemModel.cfg.Type === ItemType.SKIN && changes[i].itemModel.cfg.SubType === ItemType.SKIN_GENERAL) {
                    check = true;
                    break;
                }
            }
        }
        if (check) {
            this.uptSkin();
        }
    }

    private uptUI() {
        this._curData = ModelMgr.I.GeneralModel.curData;
        if (!this._curData) {
            const all = ModelMgr.I.GeneralModel.getGeneralListByRarity(0);
            all.sort(ModelMgr.I.GeneralModel.sort);
            this._curData = all[0];
        }
        if (!this._curData) return;

        const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
        this._generalSkin = indexer.getGeneralSkins(this._curData.generalData.IId);
        this._selectSkinId = this._generalSkin[0].Key;
        this.ListSkin.setNumItems(this._generalSkin.length);
        this.uptContent();
    }

    private uptSkin() {
        this.uptContent();
        const index = this._generalSkin.findIndex((v) => v.Key === this._selectSkinId);
        this.ListSkin.updateItem(index);
    }

    private uptContent() {
        if (this._GeneralSkinEntity) {
            this._GeneralSkinEntity.uptContent(this._curData.generalData.OnlyId, this._selectSkinId);
        }
        // 状态
        const state: GSkinState = ModelMgr.I.GeneralModel.getSkinState(this._curData.generalData.OnlyId, this._selectSkinId);
        this._state = state;
        let need: number = 1;
        const index = this._generalSkin.findIndex((v) => v.Key === this._selectSkinId);
        const cfgSkin: Cfg_GeneralSkin = this._generalSkin[index];
        const isAwakenSkin = cfgSkin.IsTitle > 0;

        if (!isAwakenSkin) {
            this.NdAttrTitle.active = true;
            this.NdAttr.active = true;
            // 属性
            this.LabAttr.string = i18n.tt(Lang.general_gskin_attr);
            this.LabNotActive.node.active = false;
            // 属性数据
            const star = ModelMgr.I.GeneralModel.getSkinStar(this._selectSkinId);
            let ratio: number = 1;
            if (star > 0) {
                const cfgStar: Cfg_GeneralSkinStar = Config.Get(Config.Type.Cfg_GeneralSkinStar).getIntervalData(star);
                if (cfgStar) {
                    ratio = (cfgStar.TotalRatio - (cfgStar.MaxLevel - star) * cfgStar.AttrRatio) / 10000;
                    need = cfgStar.LevelUpItem;
                }
                const next: Cfg_GeneralSkinStar = Config.Get(Config.Type.Cfg_GeneralSkinStar).getIntervalData(star + 1);
                if (next) {
                    need = next.LevelUpItem;
                }
            }
            const attr: IAttrBase[] = UtilAttr.GetAttrBaseListById(cfgSkin.AttrId);
            const tAttr: IAttrBase[] = [];
            for (let i = 0; i < attr.length; i++) {
                const t: IAttrBase = {
                    attrType: attr[i].attrType,
                    value: Math.ceil(attr[i].value * ratio),
                    name: attr[i].name,
                };
                tAttr.push(t);
            }
            this.NdAttr.getComponent(NdAttrBaseContainer).init(tAttr, 200, { s: '+', nameC: UtilColor.NorN, valueC: UtilColor.GreenV });
        } else {
            this.NdAttrTitle.active = state === GSkinState.UnActive;
            this.NdAttr.active = false;
            this.LabAttr.string = i18n.tt(Lang.general_gskin_unActive);
            this.LabNotActive.node.active = state === GSkinState.UnActive;
            this.LabNotActive.string = cfgSkin.GetDesc;
        }

        this.BtnUnActive.active = state === GSkinState.UnActive && !isAwakenSkin;
        this.BtnMax.active = (state === GSkinState.MaxStar && !isAwakenSkin) || (isAwakenSkin && state > GSkinState.CanActive);
        this.BtnActive.active = state === GSkinState.CanActive;
        this.BtnUp.active = (state === GSkinState.CanUpStar || state === GSkinState.CannotUpStar) && !isAwakenSkin;
        // 红点
        UtilRedDot.UpdateRed(this.BtnUp, state === GSkinState.CanUpStar, cc.v2(64, 18));

        // 消耗
        if (state === GSkinState.CanActive || (!isAwakenSkin && state === GSkinState.CanUpStar || state === GSkinState.CannotUpStar)) {
            this.ItemCost.node.active = true;
            const ownNum = BagMgr.I.getItemNum(cfgSkin.NeedItem);
            const itemModel = UtilItem.NewItemModel(cfgSkin.NeedItem, ownNum);
            this.ItemCost.setData(itemModel, { hideLeftLogo: false, hideRightLogo: false, needNum: false });
            const color: cc.Color = ownNum >= need ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
            this.LabNum.node.color = color;
            this.LabNum.string = `${ownNum}`;
            this.LabNeed.string = `/${need}`;
        } else {
            this.ItemCost.node.active = false;
        }
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: Cfg_GeneralSkin = this._generalSkin[idx];
        const item = node.getComponent(GeneralSkinItem);
        if (data && item) {
            item.setData(this._curData.generalData.OnlyId, data, this._selectSkinId === data.Key, (skinId: number) => {
                this._selectSkinId = skinId;
                this.uptContent();
                this.ListSkin.setNumItems(this._generalSkin.length);
            }, this);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
