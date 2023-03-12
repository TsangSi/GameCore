/*
 * @Author: myl
 * @Date: 2022-07-29 16:53:32
 * @Description:
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import BaseUiView from '../../../../../app/core/mvc/view/BaseUiView';
import { i18n, Lang } from '../../../../../i18n/i18n';
import ListView from '../../../../base/components/listview/ListView';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import ItemModel from '../../../../com/item/ItemModel';
import { E } from '../../../../const/EventName';
import { UpStar } from '../UpStarModel';
import { SelecEquiptItem } from './SelecEquiptItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class UpStarSelectEquipWin extends BaseUiView {
    @property(cc.Node)
    private BtnSetUse: cc.Node = null;

    @property(cc.Label)
    private TipLabel: cc.Label = null;

    @property(cc.Label)
    private countLabel: cc.Label = null;

    @property(ListView)
    private list: ListView = null;

    @property(cc.Node)
    private bgNode: cc.Node = null;
    @property(cc.Node)
    private bg: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    private _listData: ItemModel[] = [];

    private selectStates: number[] = [];

    public init(...param: unknown[]): void {
        // todo
        UtilGame.Click(this.bgNode, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.bg, () => {
            // this.close();
        }, this, { scale: 1 });
        this.selectStates = [];
        UtilGame.Click(this.BtnSetUse, () => {
            EventClient.I.emit(E.UpStar.SelectFinish, this.selectStates);
            this.close();
        }, this);
        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
        EventClient.I.on(E.UpStar.SelectEquip, this.addItem, this);
        const ustar = param[0][0] as UpStar;
        this._listData = ustar.mats.sort((a, b) => {
            if (a.fightValue !== b.fightValue) {
                return b.fightValue - a.fightValue;
            }
            return a.cfg.EquipPart - b.cfg.EquipPart;
        });

        const hisEquips: ItemModel[] = param[0][1];
        // 计算选中索引
        for (let i = 0; i < hisEquips.length; i++) {
            const item = hisEquips[i];
            this.selectStates.push(this._listData.indexOf(item));
        }

        //  = ustar.mats;
        this.list.setNumItems(this._listData.length);

        // eslint-disable-next-line max-len
        this.TipLabel.string = `${i18n.tt(Lang.equip_upStar)}[${ustar.equipReborn}${i18n.jie}${ustar.equipStar}${i18n.star}]${i18n.tt(Lang.com_btn_equip)}`;
    }

    private scrollEvent(nd: cc.Node, index: number) {
        const equipComp = nd.getComponent(SelecEquiptItem);

        equipComp.setData(this._listData[index], index, this.selectStates.indexOf(index) > -1, this);
    }

    private addItem(cfg: Array<number | boolean>) {
        const state = cfg[0];
        const index = cfg[1] as number;
        if (this.selectStates.length > 3) {
            MsgToastMgr.Show(i18n.tt(Lang.equip_upstar_more_fail));
            return;
        }
        const idx = this.selectStates.indexOf(index);
        if (idx > -1) {
            if (state) {
                this.selectStates.push(index);
            } else {
                this.selectStates.splice(idx, 1);
            }
        } else if (state) {
            this.selectStates.push(index);
        }

        this.configUI();
    }

    private configUI() {
        this.countLabel.string = `${this.selectStates.length}/3`;
        this.countLabel.node.color = this.selectStates.length < 3 ? UtilColor.Red() : UtilColor.Green();
    }

    public getSelectCount(): number {
        return this.selectStates.length;
    }

    public close(): void {
        super.close();
        EventClient.I.off(E.UpStar.SelectEquip, this.addItem, this);
    }
}
