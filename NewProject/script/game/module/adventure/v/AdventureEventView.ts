/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { TickTimer } from '../../../base/components/TickTimer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import AdventureController from '../AdventureController';
import AdventureEventItem from './AdventureEventItem';
import AdventurePaneLiuLang from './AdventurePaneLiuLang';
import AdventurePaneQianJin from './AdventurePaneQianJin';
import AdventurePaneXuYuan from './AdventurePaneXuYuan';
import AdventurePaneQuestion from './AdventurePaneQuestion';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AdventureEventView extends BaseUiView {
    @property(cc.Node)
    private NdEvent: cc.Node = null;

    @property(ListView)
    private listView: ListView = null;

    @property(cc.Node)
    private NdEventClick: cc.Node = null;

    @property(cc.Node)
    private NdCloseBtn: cc.Node = null;

    @property(cc.Label)
    private LabEventCount: cc.Label = null;

    @property(cc.Label)
    private LabEventState: cc.Label = null;

    /** 神秘商店(流浪商人) */
    @property(cc.Prefab)
    private PfbLiuLang: cc.Prefab = null;

    /** 选择题 */
    @property(cc.Prefab)
    private PfbQuestion: cc.Node = null;

    /** 许愿 */
    @property(cc.Prefab)
    private PfbXuYuan: cc.Node = null;

    /** 千金 */
    @property(cc.Prefab)
    private PfbQianJin: cc.Node = null;

    /** 剩余时间节点 */
    @property(cc.Node)
    private NdOutTime: cc.Node = null;

    /** 剩余时间 */
    @property(TickTimer)
    private LabOutTime: TickTimer = null;

    /** 神秘商店(流浪商人) */
    private NdLiuLang: cc.Node = null;

    /** 选择题 */
    private NdQuestion: cc.Node = null;

    /** 许愿 */
    private NdXuYuan: cc.Node = null;

    /** 千金 */
    private NdQianJin: cc.Node = null;

    private GetNdQianJin(force: boolean): cc.Node {
        if (force && !this.NdQianJin) {
            this.NdQianJin = cc.instantiate(this.PfbQianJin);
            this.NdEvent.addChild(this.NdQianJin);
        }
        return this.NdQianJin;
    }

    private GetNdXuYuan(force: boolean): cc.Node {
        if (force && !this.NdXuYuan) {
            this.NdXuYuan = cc.instantiate(this.PfbXuYuan);
            this.NdEvent.addChild(this.NdXuYuan);
        }
        return this.NdXuYuan;
    }

    private GetNdLiuLang(force: boolean): cc.Node {
        if (force && !this.NdLiuLang) {
            this.NdLiuLang = cc.instantiate(this.PfbLiuLang);
            this.NdEvent.addChild(this.NdLiuLang);
        }
        return this.NdLiuLang;
    }

    private GetNdQuestion(force: boolean): cc.Node {
        if (force && !this.NdQuestion) {
            this.NdQuestion = cc.instantiate(this.PfbQuestion);
            this.NdEvent.addChild(this.NdQuestion);
        }
        return this.NdQuestion;
    }

    protected start(): void {
        super.start();
        EventClient.I.on(E.Adventure.syncEventList, this.syncList, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Adventure.syncEventList, this.syncList, this);
        ModelMgr.I.AdventureModel.clearEmptyEvent();
    }

    public init(param: any[]): void {
        const model = ModelMgr.I.AdventureModel;

        model.sortEventTime();

        this.showTime(-1);

        this.LabEventCount.string = ModelMgr.I.AdventureModel.getEventCountFmt();

        UtilGame.Click(this.NdEventClick, () => {
            this.close();
        }, this, { scale: 1.0 });

        UtilGame.Click(this.NdCloseBtn, () => {
            this.close();
        }, this, { scale: 0.9 });

        this.scheduleOnce(() => {
            this.LabEventState.node.active = false;
            this.syncList(true);
        });
    }

    private syncList(sel: boolean = false) {
        console.log('刷新界面');
        const model = ModelMgr.I.AdventureModel;
        const count = model.getEventCount();
        this.LabEventState.node.active = false;
        this.listView.setNumItems(count);
        this.LabEventCount.string = ModelMgr.I.AdventureModel.getEventCountFmt();
        if (count > 0) {
            if (sel || this.listView.selectedId >= count) this.selectListItem(0, model.getEvent(0));
            else this.selectListItem(this.listView.selectedId, model.getEvent(this.listView.selectedId));
        } else {
            this.GetNdQuestion(false)?.getComponent(AdventurePaneQuestion).setData(false);
            this.GetNdLiuLang(false)?.getComponent(AdventurePaneLiuLang).setData(false);
            this.GetNdXuYuan(false)?.getComponent(AdventurePaneXuYuan).setData(false);
            this.GetNdQianJin(false)?.getComponent(AdventurePaneQianJin).setData(false);
            this.LabEventState.node.active = false;
            this.showTime(-1);
        }
    }

    /**
     * 刷新列表
     * @param item 列表项
     * @param idx 索引
     */
    public onRenderList(item: cc.Node, idx: number): void {
        const ev = ModelMgr.I.AdventureModel.getEvent(idx);
        if (!ev) return;
        item.targetOff(this);
        item.on(cc.Node.EventType.TOUCH_END, this.selectListItem.bind(this, idx, ev), this);
        item.getComponent(AdventureEventItem).setEvent(ev);
    }

    /** 选择列表Item */
    protected selectListItem(idx: number, ev: AdventureEvent): void {
        if (!ev) {
            this.GetNdQuestion(false)?.getComponent(AdventurePaneQuestion).setData(false);
            this.GetNdLiuLang(false)?.getComponent(AdventurePaneLiuLang).setData(false);
            this.GetNdXuYuan(false)?.getComponent(AdventurePaneXuYuan).setData(false);
            this.GetNdQianJin(false)?.getComponent(AdventurePaneQianJin).setData(false);
            return;
        }

        this.listView.selectedId = idx;

        const model = ModelMgr.I.AdventureModel;

        let active = false;

        let time = 0;

        if (ev.State === 1) {
            active = true;
            this.LabEventState.string = i18n.tt(Lang.adventure_tip_3);
        } else if (ev.State === 0) {
            if (ev.EventId === 3) {
                time = ev.EventWish.CanGetTime - UtilTime.NowSec();
                if (ev.EventWish.WishState === 1 && time <= 0) {
                    active = true;
                    this.LabEventState.string = i18n.tt(Lang.adventure_tip_8);
                } else if (ev.EventWish.WishState === 2) {
                    active = true;
                    this.LabEventState.string = i18n.tt(Lang.adventure_tip_4);
                }

                console.log(time);
            }
            if (active === false && UtilTime.NowSec() > ev.OverTime) {
                active = true;
                this.LabEventState.string = i18n.tt(Lang.adventure_tip_4);
            }
        }

        this.LabEventState.node.active = active;

        if (time > 0) {
            this.showTime(-1);
            this.LabEventState.node.active = false;
        } else {
            this.showTime(ev.State === 1 ? -1 : ev.OverTime - UtilTime.NowSec());
        }

        if (ev.EventId === 1) {
            const ary = [];
            for (let i = 0; i < ev.EventBuyList.length; ++i) {
                const shop = model.getShopInfo(ev.EventBuyList[i].Id);
                ary.push(shop);
            }
            this.GetNdQuestion(false)?.getComponent(AdventurePaneQuestion).setData(false);
            this.GetNdXuYuan(false)?.getComponent(AdventurePaneXuYuan).setData(false);
            this.GetNdQianJin(false)?.getComponent(AdventurePaneQianJin).setData(false);
            this.GetNdLiuLang(true)?.getComponent(AdventurePaneLiuLang).setData(true, ev, ary);
        } else if (ev.EventId === 2) {
            this.GetNdLiuLang(false)?.getComponent(AdventurePaneLiuLang).setData(false);
            this.GetNdQianJin(false)?.getComponent(AdventurePaneQianJin).setData(false);
            this.GetNdXuYuan(false)?.getComponent(AdventurePaneXuYuan).setData(false);
            if (ev.EventQuestion) {
                let Question = '';
                const data = model.getQuestion(ev.EventQuestion.Id);
                if (data) Question = data.Question;
                const fmt = UtilString.FormatArgs(Question, ev.EventQuestion.Param);
                const qst = this.GetNdQuestion(true)?.getComponent(AdventurePaneQuestion);
                if (qst) {
                    qst.setData(true, ev, fmt);
                    qst.setOptions([
                        ev.EventQuestion.OptionParam1 ? ev.EventQuestion.OptionParam1 : i18n.tt(Lang.com_shi),
                        ev.EventQuestion.OptionParam2 ? ev.EventQuestion.OptionParam2 : i18n.tt(Lang.com_fou),
                    ]);
                    if (ev.State === 0) {
                        qst.showBtnState([false, false], [false, false]);
                    } else {
                        qst.showBtnState(
                            [
                                ev.EventQuestion.Value === 1 && ev.EventQuestion.RightValue === 1,
                                ev.EventQuestion.Value === 2 && ev.EventQuestion.RightValue === 2,
                            ],
                            [
                                ev.EventQuestion.Value === 1 && ev.EventQuestion.RightValue !== 1,
                                ev.EventQuestion.Value === 2 && ev.EventQuestion.RightValue !== 2,
                            ],
                        );
                    }
                }
            }
        } else if (ev.EventId === 3) {
            this.GetNdLiuLang(false)?.getComponent(AdventurePaneLiuLang).setData(false);
            this.GetNdQuestion(false)?.getComponent(AdventurePaneQuestion).setData(false);
            this.GetNdQianJin(false)?.getComponent(AdventurePaneQianJin).setData(false);
            this.GetNdXuYuan(true)?.getComponent(AdventurePaneXuYuan).setData(true, ev, model.getShopInfo(ev.EventWish.IdList[0]));
        } else if (ev.EventId === 5) {
            this.GetNdQuestion(false)?.getComponent(AdventurePaneQuestion).setData(false);
            this.GetNdLiuLang(false)?.getComponent(AdventurePaneLiuLang).setData(false);
            this.GetNdXuYuan(false)?.getComponent(AdventurePaneXuYuan).setData(false);
            this.GetNdQianJin(true)?.getComponent(AdventurePaneQianJin).setData(true, ev, model.getShopInfo(ev.EventGoldBuy.Id));
        }
    }

    /** 显示时间 */
    private showTime(time: number = 0) {
        if (Math.abs(this.LabOutTime.total - time) > 2 && time > 0) this.LabOutTime.tick(time, `%HH:%mm:%ss`, true, true, false);
        this.NdOutTime.active = time > 0;
        if (this.NdOutTime.active) this.LabEventState.node.active = false;
    }
}
