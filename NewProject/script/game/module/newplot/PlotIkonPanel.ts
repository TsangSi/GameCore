/*
 * @Author: zs
 * @Date: 2022-11-29 10:22:11
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\newplot\PlotIkonPanel.ts
 * @Description:
 *
 */
import { UtilGame } from '../../base/utils/UtilGame';
import { DynamicImage, ImageType } from '../../base/components/DynamicImage';
import { ShareToChat } from '../../com/ShareToChat';
import { ChatShowItemType } from '../chat/ChatConst';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import UtilItem from '../../base/utils/UtilItem';
import ModelMgr from '../../manager/ModelMgr';
import { EventClient } from '../../../app/base/event/EventClient';
import { E } from '../../const/EventName';
import { RES_ENUM } from '../../const/ResPath';

/*
 * @Author: zs
 * @Date: 2022-11-23 18:37:34
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\newplot\PlotIkonPanel.ts
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class PlotIkonPanel extends BaseCmp {
    @property(cc.Node)
    private BtnShare: cc.Node = null;
    @property(cc.Node)
    private BtnContinue: cc.Node = null;
    @property(DynamicImage)
    private Icon: DynamicImage = null;
    @property(DynamicImage)
    private MoneyIcon: DynamicImage = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelNum: cc.Label = null;

    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.Node)
    private NodeTips: cc.Node = null;

    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnShare, this.onBtnShare, this);
        UtilGame.Click(this.BtnContinue, this.onBtnContinue, this);

        EventClient.I.on(E.CollectionBook.UpdateCareerShare, this.onUpdateCareerShare, this);
    }

    private onBtnShare() {
        const pos = this.BtnShare.convertToWorldSpaceAR(cc.v2(0, -100));
        ShareToChat.show(ChatShowItemType.plot, this.cfg.Id, pos);
    }

    private onBtnContinue() {
        this.close();
        if (this.completeFunc) {
            if (this.target) {
                this.completeFunc.call(this.target);
            } else {
                this.completeFunc();
            }
        }
    }

    private cfg: Cfg_CollectionBook;
    /** 完成触发的回调 */
    private completeFunc: () => void;
    private target: any = null;
    public setData(cfg: Cfg_CollectionBook, completeFunc: () => void, target: any): void {
        this.cfg = cfg;
        this.completeFunc = completeFunc;
        this.target = target;
        // const item = this.cfg.Prize.split(':');
        this.Icon.loadImage(`${RES_ENUM.CollectionBook_Bg_Bwz_Chahua}${this.cfg.AnimId}`, ImageType.PNG, true);
        // const cItem = ModelMgr.I.CollectionBookModel.getItem(this.cfg.Id);
        // if (cItem) {
        //     this.MoneyIcon.node.parent.active = !cItem.Share;
        // }
        // if (this.MoneyIcon.node.parent.active) {
        //     this.MoneyIcon.loadImage(UtilItem.GetItemIconPathByItemId(+item[0]), ImageType.PNG, true);
        //     this.LabelNum.string = `x${item[1]}`;
        // }
        this.LabelName.string = this.cfg.Name;
    }

    protected onUpdateCareerShare(id: number): void {
        if (this.cfg.Id === id) {
            const cItem = ModelMgr.I.CollectionBookModel.getItem(this.cfg.Id);
            if (cItem) {
                this.MoneyIcon.node.parent.active = !cItem.Share;
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.CollectionBook.UpdateCareerShare, this.onUpdateCareerShare, this);
    }
}
