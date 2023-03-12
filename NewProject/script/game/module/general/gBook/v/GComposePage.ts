/*
 * @Author: kexd
 * @Date: 2022-12-07 11:38:11
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gBook\v\GComposePage.ts
 * @Description: 武将-合成
 *
 */

import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilGeneral from '../../../../base/utils/UtilGeneral';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { GeneralMsg } from '../../GeneralConst';
import GComposeItem from './GComposeItem';
import ListView from '../../../../base/components/listview/ListView';
import { EventClient } from '../../../../../app/base/event/EventClient';
import { E } from '../../../../const/EventName';
import ModelMgr from '../../../../manager/ModelMgr';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { ItemType } from '../../../../com/item/ItemConst';
import { BagItemChangeInfo } from '../../../bag/BagConst';
import { BagMgr } from '../../../bag/BagMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GComposePage extends WinTabPage {
    @property(cc.Node)
    private NdTog: cc.Node[] = [];
    @property(ListView)
    private ListView: ListView = null;

    private _tabIndex: number = 0;
    private _generalList: GeneralMsg[] = [];

    protected start(): void {
        super.start();
        this.addE();
        this.clk();
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this.uptUI();
        this.onTog(0);
    }

    private addE() {
        EventClient.I.on(E.General.GCompose, this.uptUI, this);
        EventClient.I.on(E.General.Add, this.uptUI, this);
        EventClient.I.on(E.Bag.ItemChange, this.onBagChange, this);
    }

    private remE() {
        EventClient.I.off(E.General.GCompose, this.uptUI, this);
        EventClient.I.off(E.General.Add, this.uptUI, this);
        EventClient.I.off(E.Bag.ItemChange, this.onBagChange, this);
    }

    private clk() {
        for (let i = 0; i < this.NdTog.length; i++) {
            UtilGame.Click(this.NdTog[i], () => {
                if (this._tabIndex === i) {
                    return;
                }
                this.onTog(i);
            }, this);
        }
    }

    private onBagChange(changes: BagItemChangeInfo[]) {
        let check: boolean = false;
        if (changes) {
            for (let i = 0; i < changes.length; i++) {
                if (changes[i].itemModel && changes[i].itemModel.cfg
                    && changes[i].itemModel.cfg.SubType === ItemType.GENERAL_ITEM) {
                    check = true;
                    break;
                }
            }
        }
        if (check) {
            this.uptUI();
        }
    }

    /** 主要是页签红点 */
    private uptUI() {
        const rList = [0, 4, 3, 2, 1];
        for (let i = 0; i < rList.length; i++) {
            const isRed: boolean = ModelMgr.I.GeneralModel.checkComposeTagRed(rList[i]);
            UtilRedDot.UpdateRed(this.NdTog[i], isRed, cc.v2(38, 15));
        }
        this.to();
    }

    private getBooks(rarityIndex: number): GeneralMsg[] {
        const rList = [0, 4, 3, 2, 1];
        const rarity = rList[rarityIndex];
        return UtilGeneral.GetCompose(0, rarity);
    }

    private onTog(index: number) {
        this._tabIndex = index;
        const list = this.getBooks(this._tabIndex);
        this._generalList = list;
        this._generalList.sort(this.sort);

        this.ListView.setNumItems(this._generalList.length);
        this.onTogSelect();
        this.to();
    }

    private to() {
        // 找到第一个可合成的index
        let to: number = 0;
        for (let i = 0; i < this._generalList.length; i++) {
            const cost = this._generalList[i].cfg.StickCost.split(':');
            const costId = +cost[0];
            const need = +cost[1];
            const have = BagMgr.I.getItemNum(costId);
            if (have >= need) {
                to = i;
                break;
            }
        }
        this.ListView.scrollTo(to);
    }

    private onTogSelect() {
        for (let i = 0; i < this.NdTog.length; i++) {
            const NdSelected = this.NdTog[i].getChildByName('NdSelected');
            NdSelected.active = this._tabIndex === i;
        }
    }

    /** 排序 */
    private sort(a: GeneralMsg, b: GeneralMsg): number {
        // 1.稀有度
        if (a.cfg.Rarity !== b.cfg.Rarity) {
            return b.cfg.Rarity - a.cfg.Rarity;
        }

        // 2.最高头衔
        if (a.generalData.Title !== b.generalData.Title) {
            return b.generalData.Title - a.generalData.Title;
        }

        // 3.最高品质
        if (a.generalData.Quality !== b.generalData.Quality) {
            return b.generalData.Quality - a.generalData.Quality;
        }
        return b.cfg.Id - a.cfg.Id;
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: GeneralMsg = this._generalList[idx];
        const item = node.getComponent(GComposeItem);
        if (item && data) {
            item.getComponent(GComposeItem).setData(data);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
