/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-12-12 16:29:41
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gReborn\GRebornChooseWin.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import GeneralHead from '../com/GeneralHead';
import { GeneralMsg, ClickType } from '../GeneralConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GRebornChooseWin extends WinCmp {
    @property(cc.Node)
    private NdTog: cc.Node[] = [];
    @property(ListView)
    private ListHead: ListView = null;
    @property(cc.Node)
    private NdOk: cc.Node = null;
    @property(cc.Node)
    private NdEmpty: cc.Node = null;

    private _tabIndex: number = 0;
    private _selectGeneral: GeneralMsg = null;
    private _generalList: GeneralMsg[] = [];
    private _choose: boolean = false;

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
    }

    public init(data: unknown): void {
        this._choose = false;
        if (data) {
            this._selectGeneral = data[0];
            this.onTog(0);
        }
    }

    private addE() {
        //
    }

    private remE() {
        //
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

        UtilGame.Click(this.NdOk, () => {
            this._choose = true;
            this.onClose();
        }, this);
    }

    private onTog(index: number, isClick: boolean = false) {
        const rList = [0, 4, 3, 2, 1];
        const rarity = rList[index];
        const listAll = ModelMgr.I.GeneralModel.getGeneralListByNewRarity(rarity);
        // 培养过的才可以重生
        const list = [];
        for (let i = 0; i < listAll.length; i++) {
            if (ModelMgr.I.GeneralModel.canReborn(listAll[i])) {
                list.push(listAll[i]);
            }
        }

        if (list.length === 0 && index > 0 && isClick) {
            const str = i18n.tt(Lang.general_reborn_no) + i18n.tt(Lang[`general_rarity_${rarity}`]);
            MsgToastMgr.Show(str);
            this.onTogSelect();
            return;
        }
        this._generalList = list;
        this._generalList.sort(ModelMgr.I.GeneralModel.selectedSort);
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

    private _lastSelect: number = -1;
    private uptClickHead(msg: GeneralMsg) {
        if (!msg) {
            return;
        }
        this._lastSelect = -1;
        if (this._selectGeneral) {
            this._lastSelect = this._generalList.findIndex((v) => v.generalData.OnlyId === this._selectGeneral.generalData.OnlyId);
        }

        const index = this._generalList.findIndex((v) => v.generalData.OnlyId === msg.generalData.OnlyId);
        if (this._selectGeneral === msg) {
            this._selectGeneral = null;
        } else if (!ModelMgr.I.GeneralModel.costSelf(this._generalList[index], index, { showToggle: 'GRebornLock', tipTogState: false }, this.clickCallback, this)) {
            this._selectGeneral = this._generalList[index];
        }

        this.ListHead.updateItem(index);
        if (this._lastSelect >= 0) {
            this.ListHead.updateItem(this._lastSelect);
        }
    }

    private clickCallback(index: number) {
        this._selectGeneral = this._generalList[index];
        this.ListHead.updateItem(index);
        if (this._lastSelect >= 0) {
            this.ListHead.updateItem(this._lastSelect);
        }
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: GeneralMsg = this._generalList[idx];
        const item = node.getComponent(GeneralHead);
        if (data && item) {
            item.setData(data, {
                isSelected: this._selectGeneral && this._selectGeneral.generalData.OnlyId === data.generalData.OnlyId,
                callback: this.uptClickHead,
                context: this,
                clickType: ClickType.Reborn,
            });
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.GRebornChooseWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this._choose) {
            EventClient.I.emit(E.General.GReturnChoose, this._selectGeneral);
        }
        this.remE();
    }
}
