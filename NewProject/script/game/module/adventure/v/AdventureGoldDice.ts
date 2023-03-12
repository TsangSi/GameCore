import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdventureGoldDice extends BaseUiView {
    @property(cc.ToggleContainer)
    private ToggleGroup: cc.ToggleContainer = null;

    @property(cc.Toggle)
    private Toggles: cc.Toggle[] = [];

    @property(cc.Label)
    private LabEventNames: cc.Label[] = [];

    @property(cc.Node)
    private NdEventClick: cc.Node = null;

    @property(cc.Node)
    private NdCloseBtn: cc.Node = null;

    private currentIndex: number = 0;

    protected onLoad(): void {
        super.onLoad();

        UtilGame.Click(this.NdCloseBtn, () => {
            this.close();
        }, this, { scale: 0.9 });

        UtilGame.Click(this.NdEventClick, () => {
            this.close();
        }, this, { scale: 1.0 });
    }

    /**
     *
     * @param param [itemStr: string, isShowTips: true]
    */
    public init(param: any[]): void {
        const ary: string[] = param[0];
        for (let i = 0; i < 6; ++i) {
            this.LabEventNames[i].string = ary[i];
            if (ary[i].length && this.currentIndex === 0) {
                this.Toggles[i].isChecked = true;
                this.currentIndex = i + 1;
                this.ToggleGroup.allowSwitchOff = false;
            }
        }
    }

    private onClickToggle(_, index: number): void {
        this.currentIndex = Number(index);
        this.ToggleGroup.allowSwitchOff = false;
    }

    private onClickConfirm() {
        if (this.currentIndex === 0) {
            MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_7));
            return;
        }
        const diceNum = this.currentIndex;
        EventClient.I.emit(E.Adventure.SelectGoldDice, 6 + diceNum);
        ControllerMgr.I.AdventureController.reqGoldDice(diceNum);
        this.close();
    }
}
