import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdventurPaneQuestion extends BaseUiView {
    /** 选择题按钮 */
    @property(cc.Node)
    private NdQuestionBtns: cc.Node[] = [];

    /** 答题奖励积分 */
    @property(cc.Label)
    private NdValues: cc.Label[] = [];

    @property(DynamicImage)
    private NdIcons: DynamicImage[] = [];

    @property(cc.RichText)
    private LabQuestion: cc.RichText = null;

    @property(cc.Label)
    private LabOptions: cc.Label[] = [];

    @property(cc.Node)
    private NdDuis: cc.Node[] = [];

    @property(cc.Node)
    private NdCuos: cc.Node[] = [];

    private curEvent: AdventureEvent = null;

    protected start(): void {
        const model = ModelMgr.I.AdventureModel;

        this.NdQuestionBtns.forEach((v, idx) => {
            UtilGame.Click(v, this.clickQuestion.bind(this, idx), this);
        });

        this.NdIcons.forEach((v, idx) => {
            let ary = [];
            if (idx === 0) {
                ary = model.getQuestionRight().split(':');
            } else {
                ary = model.getQuestionWrong().split(':');
            }
            const costImgUrl: string = UtilCurrency.getIconByCurrencyType(Number(ary[0]));
            v.loadImage(costImgUrl, 1, true);
            this.NdValues[idx].string = ary[1];
        });
    }

    private checkEvent(): boolean {
        if (!this.curEvent) return false;
        if (this.curEvent.State === 1) {
            MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_3));
            return false;
        }
        if (UtilTime.NowSec() >= this.curEvent.OverTime) {
            if (this.curEvent.EventId !== 3 || this.curEvent.EventWish.WishState !== 1) {
                MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_4));
                return false;
            }
        }

        return true;
    }

    /** 点击题目 */
    protected clickQuestion(idx: number): void {
        console.log(idx);
        if (this.checkEvent()) {
            console.log('点击题目', idx);
            ControllerMgr.I.AdventureController.reqEventUse(this.curEvent.OnlyId, idx + 1);
        }
    }

    /**
     * 填充选项
     * @param active 是否显示
     * @param text 选项内容
    */
    public setOptions(text: string[] = null): AdventurPaneQuestion {
        this.LabOptions.forEach((val, idx) => {
            val.string = text[idx];
        });
        return this;
    }

    /**
     * 设置题目内容
     * @param active 是否显示
     * @param text 题目内容
    */
    public setData(active: boolean, ev: AdventureEvent = null, text: string = null): AdventurPaneQuestion {
        this.curEvent = ev;
        this.node.active = active;
        this.LabQuestion.node.active = active;
        if (active) {
            this.LabQuestion.string = text;
        }
        return this;
    }

    /**
     * 设置题目内容
     * @param active 是否显示
     * @param text 题目内容
    */
    public showBtnState(duis: boolean[], cuos: boolean[]): void {
        this.NdDuis[0].active = duis[0];
        this.NdDuis[1].active = duis[1];
        this.NdCuos[0].active = cuos[0];
        this.NdCuos[1].active = cuos[1];
    }
}
