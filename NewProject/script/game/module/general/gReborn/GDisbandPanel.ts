/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-12-12 15:37:00
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gReborn\GDisbandPanel.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { TabPagesView } from '../../../com/win/WinTabPageView';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import GeneralHead from '../com/GeneralHead';
import { ClickType, GeneralMsg } from '../GeneralConst';
import { GeneralModel } from '../GeneralModel';
import ControllerMgr from '../../../manager/ControllerMgr';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { RoleMgr } from '../../role/RoleMgr';
import { RoleAN } from '../../role/RoleAN';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { ConfigItemIndexer } from '../../../base/config/indexer/ConfigItemIndexer';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GDisbandPanel extends TabPagesView {
    @property(cc.Node)
    private NdTog: cc.Node[] = [];
    @property(cc.Node)
    private NdEmpty: cc.Node = null;
    @property(cc.Node)
    private BtnOnekey: cc.Node = null;
    @property(cc.Node)
    private BtnDisband: cc.Node = null;

    @property(DynamicImage)
    private SprCurrency: DynamicImage = null;
    @property(cc.Label)
    private LabHave: cc.Label = null;
    @property(cc.Label)
    private LabCost: cc.Label = null;

    @property(ListView)
    private ListHead: ListView = null;
    @property(ListView)
    private ListItems: ListView = null;

    private _M: GeneralModel = null;
    private _tabIndex: number = 0;
    private _generalList: GeneralMsg[] = [];
    private _generalSelected: GeneralMsg[] = [];
    private _backItems: ItemModel[] = [];

    protected onLoad(): void {
        super.onLoad();
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
    }

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
    }

    protected onEnable(): void {
        this.onTog(this._tabIndex);
    }

    protected onDisable(): void {
        this.onDel();
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
        this.onTog(this._tabIndex);
        this.uptCost();
    }

    private addE() {
        EventClient.I.on(E.General.Add, this.uptUI, this);
        EventClient.I.on(E.General.Del, this.onDel, this);
        RoleMgr.I.on(this.uptCost, this, RoleAN.N.ItemType_Coin3);
    }

    private remE() {
        EventClient.I.off(E.General.Add, this.uptUI, this);
        EventClient.I.off(E.General.Del, this.onDel, this);
        RoleMgr.I.off(this.uptCost, this, RoleAN.N.ItemType_Coin3);
    }

    private clk() {
        for (let i = 0; i < this.NdTog.length; i++) {
            UtilGame.Click(this.NdTog[i], () => {
                if (this._tabIndex === i) {
                    return;
                }
                this.onTog(i, true);
            }, this);
        }

        UtilGame.Click(this.BtnDisband, () => {
            if (!this._generalSelected || this._generalSelected.length === 0) {
                MsgToastMgr.Show(i18n.tt(Lang.general_disband));
                return;
            }
            // 检查是否会消耗完所有的武将
            const all = this._M.getGeneralListByRarity(0);
            if (this._generalSelected.length >= all.length) {
                MsgToastMgr.Show(i18n.tt(Lang.general_disband_left));
                return;
            }
            // 检查消耗是否足够
            const cost = this._M.getDisbandCost();
            const have = BagMgr.I.getItemNum(cost.id);
            if (have < cost.need * this._generalSelected.length) {
                WinMgr.I.open(ViewConst.ItemSourceWin, cost.id);
                return;
            }
            //
            const ids: string[] = [];
            for (let i = 0; i < this._generalSelected.length; i++) {
                ids.push(this._generalSelected[i].generalData.OnlyId);
            }
            ControllerMgr.I.GeneralController.reqGeneralRelease(ids);
        }, this);

        UtilGame.Click(this.BtnOnekey, this.onOnekey, this);
    }

    private uptCost() {
        if (!this._generalSelected || this._generalSelected.length === 0) {
            this.LabCost.node.active = false;
            this.LabHave.node.active = false;
            this.SprCurrency.node.active = false;
        } else {
            this.LabCost.node.active = true;
            this.LabHave.node.active = true;
            this.SprCurrency.node.active = true;

            const cost = this._M.getDisbandCost();
            const need = cost.need * this._generalSelected.length;
            const have = BagMgr.I.getItemNum(cost.id);
            const color: cc.Color = have >= need ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
            this.LabHave.node.color = color;
            this.LabCost.node.color = color;
            this.LabHave.string = `${UtilNum.Convert(have)}`;
            this.LabCost.string = `/${need}`;
            const costImgUrl: string = UtilCurrency.getIconByCurrencyType(cost.id);
            this.SprCurrency.loadImage(costImgUrl, 1, true);
        }
    }

    private onTog(index: number, isClick: boolean = false) {
        const rList = [0, 4, 3, 2, 1];
        const rarity = rList[index];
        const listAll = this._M.getGeneralListByNewRarity(rarity);
        // 未培养过的才可以遣散
        const list = [];
        for (let i = 0; i < listAll.length; i++) {
            if (this._M.canDisband(listAll[i])) {
                list.push(listAll[i]);
            }
        }
        if (list.length === 0 && index > 0 && isClick) {
            const str = i18n.tt(Lang.general_disband_no) + i18n.tt(Lang[`general_rarity_${rarity}`]);
            MsgToastMgr.Show(str);
            this.onTogSelect();
            return;
        }
        this._generalList = list;
        this._generalList.sort(this._M.selectedSort);
        this.ListHead.setNumItems(this._generalList.length);
        this.NdEmpty.active = this._generalList.length === 0;
        this._tabIndex = index;
        this.onTogSelect();
    }

    private onTogSelect() {
        for (let i = 0; i < this.NdTog.length; i++) {
            const NdSelected = this.NdTog[i].getChildByName('NdSelected');
            NdSelected.active = this._tabIndex === i;
        }
    }

    private onOnekey() {
        let add: boolean = false;
        for (let i = 0; i < this._generalList.length; i++) {
            const index = this._generalSelected.findIndex((v) => v.generalData.OnlyId === this._generalList[i].generalData.OnlyId);
            if (index < 0 && !this._generalList[i].battlePos && !this._generalList[i].generalData.Lock) {
                this._generalSelected.push(this._generalList[i]);
                add = true;
            }
        }
        if (this._generalSelected.length === 0) {
            MsgToastMgr.Show(i18n.tt(Lang.general_disband_none));
            return;
        }
        if (!add) {
            MsgToastMgr.Show(i18n.tt(Lang.general_disband_all));
            return;
        }
        this.ListHead.setNumItems(this._generalList.length);
        this.uptBack();
        this.uptCost();
    }

    private uptUI() {
        this.onTog(this._tabIndex);
    }

    /** 有武将被遣散了就是删了武将，会影响武将列表展示 */
    private onDel() {
        this._generalSelected.length = 0;
        this.onTog(this._tabIndex);
        this._backItems = [];
        this.ListItems.setNumItems(0);
        this.uptCost();
    }

    private _itemList: { id: number, num: number, mark: number }[] = [];
    private uptBack() {
        this._backItems = [];
        this._itemList = [];
        const itemIndexer: ConfigItemIndexer = Config.Get(Config.Type.Cfg_Item);
        const rarityIndexer = Config.Get(Config.Type.Cfg_GeneralRarity);
        for (let i = 0; i < this._generalSelected.length; i++) {
            const skills = this._generalSelected[i].generalData.Skills;
            for (let j = 0; j < skills.length; j++) {
                const id = itemIndexer.getItemIdByParam(skills[j].SkillId);
                if (id) {
                    const num: number = 1;
                    const mark: number = 1;
                    const index = this._itemList.findIndex((v) => v.id === id);
                    if (index >= 0) {
                        this._itemList[index].num += num;
                    } else {
                        this._itemList.push({ id, num, mark });
                    }
                }
            }
            // 加上表里配的遣散返还
            const rarity = this._generalSelected[i].cfg.Rarity;
            const cfg: Cfg_GeneralRarity = rarityIndexer.getValueByKey(rarity);
            const drops: string = cfg.ReleaseDropItem;
            const items = drops.split('|');
            if (items && items.length > 0) {
                for (let j = 0; j < items.length; j++) {
                    const item = items[j].split(':');
                    const id = +item[0];
                    const num = +item[1];
                    const index = this._itemList.findIndex((v) => v.id === id);
                    if (index >= 0) {
                        this._itemList[index].num += num;
                    } else {
                        this._itemList.push({ id, num, mark: 0 });
                    }
                }
            }
        }

        for (let i = 0; i < this._itemList.length; i++) {
            const itemModel: ItemModel = UtilItem.NewItemModel(this._itemList[i].id, this._itemList[i].num);
            itemModel.mark = this._itemList[i].mark;
            this._backItems.push(itemModel);
        }

        this._backItems.sort((a, b) => {
            // 技能道具在前
            if (a.cfg.Param !== b.cfg.Param) {
                return a.cfg.Param - b.cfg.Param;
            }
            // 品质 高-低
            if (a.cfg.Quality !== b.cfg.Quality) {
                return b.cfg.Quality - a.cfg.Quality;
            }
            // 道具id按升序
            return a.data.ItemId - b.data.ItemId;
        });

        this.ListItems.setNumItems(this._backItems.length);
        this.uptCost();
    }

    private uptClickHead(msg: GeneralMsg) {
        if (!msg) return;
        const index = this._generalList.findIndex((v) => v.generalData.OnlyId === msg.generalData.OnlyId);
        if (index < 0) {
            console.warn('不存在该武将');
            return;
        }

        const chooseIndex: number = this._generalSelected.findIndex((v) => v.generalData.OnlyId === msg.generalData.OnlyId);
        if (chooseIndex < 0) {
            // 不存在就加入
            if (!this._M.costSelf(this._generalList[index], index, { showToggle: 'GDisbandLock', tipTogState: false }, this.clickCallback, this)) {
                this._generalSelected.push(this._generalList[index]);
            }
        } else {
            // 已存在就移除
            this._generalSelected.splice(chooseIndex, 1);
        }

        this.ListHead.updateItem(index);
        this.uptBack();
    }

    private clickCallback(index: number) {
        this._generalSelected.push(this._generalList[index]);
        this.ListHead.updateItem(index);
        this.uptBack();
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: GeneralMsg = this._generalList[idx];
        const item = node.getComponent(GeneralHead);
        const isSelected: boolean = this._generalSelected.findIndex((v) => v.generalData.OnlyId === data.generalData.OnlyId) >= 0;

        if (data && item) {
            item.setData(data, {
                isSelected,
                callback: this.uptClickHead,
                context: this,
                clickType: ClickType.Disband,
            });
        }
    }

    private onRenderItems(node: cc.Node, idx: number): void {
        const data: ItemModel = this._backItems[idx];
        const item = node.getComponent(ItemIcon);
        if (data && item) {
            item.setData(data, { needName: true, needNum: true });
            UtilItem.addMark(item.node, data.mark);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
