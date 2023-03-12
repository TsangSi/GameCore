/* eslint-disable @typescript-eslint/no-unsafe-return */
/*
 * @Author: kexd
 * @Date: 2022-12-07 11:35:12
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gBook\v\GBookPage.ts
 * @Description: 武将-图鉴
 *
 */

import ListView from '../../../../base/components/listview/ListView';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import GeneralHead from '../../com/GeneralHead';
import { GeneralMsg } from '../../GeneralConst';
import UtilGeneral from '../../../../base/utils/UtilGeneral';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../../const/ViewConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GBookPage extends WinTabPage {
    @property(cc.Node)
    private NdTog: cc.Node[] = [];

    @property(cc.Node)
    private NdCampTog: cc.Node[] = [];

    @property(ListView)
    private ListHead: ListView = null;

    private _tabIndex: number = 0;
    private _tabCampIndex: number = 0;
    private _generalList: GeneralMsg[] = [];

    protected start(): void {
        super.start();
        this.addE();
        this.clk();
        this.uptUI();
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this.onTog(0);
    }

    private addE() {
        // EventClient.I.on(E.General.UptGskin, this.uptSkin, this);
    }

    private remE() {
        // EventClient.I.off(E.General.UptGskin, this.uptSkin, this);
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

        for (let i = 0; i < this.NdCampTog.length; i++) {
            UtilGame.Click(this.NdCampTog[i], () => {
                if (this._tabCampIndex === i) {
                    return;
                }
                this.onCampTog(i);
            }, this);
        }
    }

    private uptUI() {
        //
    }

    private getBooks(rarityIndex: number, campIndex: number): GeneralMsg[] {
        const rList = [0, 4, 3, 2, 1];
        const rarity = rList[rarityIndex];
        return UtilGeneral.GetBooks(campIndex, rarity);
    }

    private onTog(index: number) {
        this._tabIndex = index;
        const list = this.getBooks(this._tabIndex, this._tabCampIndex);
        this._generalList = list;
        this._generalList.sort(this.sort);
        this.ListHead.setNumItems(this._generalList.length);
        this.onTogSelect();
    }

    private onTogSelect() {
        for (let i = 0; i < this.NdTog.length; i++) {
            const NdSelected = this.NdTog[i].getChildByName('NdSelected');
            NdSelected.active = this._tabIndex === i;
        }
    }

    private onCampTog(index: number) {
        this._tabCampIndex = index;
        const list = this.getBooks(this._tabIndex, this._tabCampIndex);
        this._generalList = list;
        this._generalList.sort(this.sort);
        this.ListHead.setNumItems(this._generalList.length);
        this.onCampTogSelect();
    }

    private onCampTogSelect() {
        for (let i = 0; i < this.NdCampTog.length; i++) {
            const NdSelected = this.NdCampTog[i].getChildByName('NdSelected');
            NdSelected.active = this._tabCampIndex === i;
        }
    }

    private uptClickHead(msg: GeneralMsg) {
        if (!msg) return;
        WinMgr.I.open(ViewConst.GBookDetailWin, msg);
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
        const item = node.getComponent(GeneralHead);

        if (data && item) {
            item.setData(data, {
                callback: this.uptClickHead,
                context: this,
            });
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
