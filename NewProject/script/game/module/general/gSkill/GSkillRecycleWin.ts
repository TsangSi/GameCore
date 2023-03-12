/*
 * @Author: kexd
 * @Date: 2022-11-21 14:56:42
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gSkill\GSkillRecycleWin.ts
 * @Description: 武将-技能 回收
 *
 */

import WinMgr from '../../../../app/core/mvc/WinMgr';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import ItemModel from '../../../com/item/ItemModel';
import { WinCmp } from '../../../com/win/WinCmp';
import { ViewConst } from '../../../const/ViewConst';
import { BagMgr } from '../../bag/BagMgr';
import GSkillChooseItem from '../com/GSkillChooseItem';
import ControllerMgr from '../../../manager/ControllerMgr';
import UtilItem from '../../../base/utils/UtilItem';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { FuncId } from '../../../const/FuncConst';
import { ESkillQuality } from '../GeneralConst';
import { Link } from '../../link/Link';
import { ItemType } from '../../../com/item/ItemConst';

const { ccclass, property } = cc._decorator;

interface RecycSkill {
    itemModel: ItemModel,
    isSelected: boolean,
    skillId: number,
    quality: number
}

@ccclass
export class GSkillRecycleWin extends WinCmp {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Node)
    protected NdBook: cc.Node = null;
    @property(cc.Node)
    private BtnChoose: cc.Node = null;
    @property(cc.Toggle)
    private TogLow: cc.Toggle = null;
    @property(cc.Toggle)
    private TogMid: cc.Toggle = null;
    @property(cc.Toggle)
    private TogTop: cc.Toggle = null;
    @property(cc.Node)
    protected NdEmpty: cc.Node = null;

    private _books: RecycSkill[] = [];
    private _cur: RecycSkill[] = [];

    protected start(): void {
        super.start();

        this.addE();

        UtilGame.Click(this.BtnChoose, () => {
            if (!this._cur.length) {
                MsgToastMgr.Show(i18n.tt(Lang.general_skill_nobook));
                return;
            }
            const items: ItemInfo[] = [];
            for (let i = 0; i < this._cur.length; i++) {
                if (this._cur[i].isSelected) {
                    const item: ItemInfo = {
                        ItemId: this._cur[i].itemModel.data.ItemId,
                        ItemNum: 1,
                        Bind: this._cur[i].itemModel.data.Bind,
                        ItemValid: 0,
                    };
                    items.push(item);
                }
            }
            if (!items.length) {
                MsgToastMgr.Show(i18n.tt(Lang.general_skill_norecycle));
                return;
            }
            ControllerMgr.I.GeneralController.reqGeneralSkillRecycle(items);
            this.onClose();
        }, this);

        UtilGame.Click(this.NdBook, () => {
            Link.To(FuncId.GeneralShop);
            // if (UtilFunOpen.isOpen(FuncId.GeneralShop, true)) {
            //     WinMgr.I.open(ViewConst.ShopWin, 2, 10);
            // }
        }, this);

        UtilGame.Click(this.TogLow.node, this.uptList, this);
        UtilGame.Click(this.TogMid.node, this.uptList, this);
        UtilGame.Click(this.TogTop.node, this.uptList, this);
    }

    private addE() {
        //
    }

    private remE() {
        //
    }

    public init(): void {
        const books = BagMgr.I.getParamItems(ItemType.GBook);
        // 转换为每个道具（技能书）的数量都是1
        this._books = [];
        for (let i = 0; i < books.length; i++) {
            if (books[i].data.ItemNum > 0) {
                for (let j = 0; j < books[i].data.ItemNum; j++) {
                    const book: ItemModel = UtilItem.NewItemModel(books[i].data.ItemId, 1);
                    const skillId = books[i].cfg.Param;
                    const quality: number = UtilSkillInfo.GetQuality(skillId, 1);

                    this._books.push({
                        itemModel: book, isSelected: false, skillId, quality,
                    });
                }
            }
        }

        this.TogLow.isChecked = false;
        this.TogMid.isChecked = false;
        this.TogTop.isChecked = false;

        this.uptList();
    }

    private uptList() {
        let qualityAll: number[] = [];

        if (!this.TogLow.isChecked && !this.TogMid.isChecked && !this.TogTop.isChecked) {
            qualityAll = [ESkillQuality.Low, ESkillQuality.Mid, ESkillQuality.Top];
            this._cur = this._books;
            this._cur.forEach((v) => v.isSelected = false);
        } else {
            qualityAll = [];
            if (this.TogLow.isChecked) qualityAll.push(ESkillQuality.Low);
            if (this.TogMid.isChecked) qualityAll.push(ESkillQuality.Mid);
            if (this.TogTop.isChecked) qualityAll.push(ESkillQuality.Top);

            // 刷选
            this._cur = this.setSelectByQuality(qualityAll);
        }

        // 排序
        this._cur.sort((a, b) => {
            // 1. 品质高到低
            if (a.quality !== b.quality) {
                return b.quality - a.quality;
            }
            // 2. id大到小
            return b.skillId - a.skillId;
        });
        //
        this.ListView.setNumItems(this._cur.length);

        this.NdEmpty.active = this._cur.length === 0;
    }

    private setSelectByQuality(quality: number[]): RecycSkill[] {
        const list: RecycSkill[] = [];
        if (this._books) {
            for (let i = 0; i < this._books.length; i++) {
                const skillId = this._books[i].skillId;
                const skillQuality: number = UtilSkillInfo.GetQuality(skillId, 1);
                if (quality.indexOf(skillQuality) >= 0) {
                    this._books[i].isSelected = true;
                    list.push(this._books[i]);
                }
            }
        }
        return list;
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: RecycSkill = this._cur[idx];
        const item = node.getComponent(GSkillChooseItem);
        if (item) {
            item.getComponent(GSkillChooseItem).setData(data.itemModel, data.isSelected, (itemId: number, skillId: number) => {
                data.isSelected = !data.isSelected;
                this.ListView.setNumItems(this._cur.length);
            }, this);
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.GSkillRecycleWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
