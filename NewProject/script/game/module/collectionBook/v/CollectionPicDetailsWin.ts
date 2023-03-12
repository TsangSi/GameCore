/*
 * @Author: dcj
 * @Date: 2022-12-03 09:54:36
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\v\CollectionPicDetailsWin.ts
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ShareToChat } from '../../../com/ShareToChat';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import ModelMgr from '../../../manager/ModelMgr';
import { ChatShowItemType } from '../../chat/ChatConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectionPicDetailsWin extends BaseUiView {
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelDesc: cc.Label = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Node)
    private BtnShare: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    @property(cc.Label)
    private LabelCost: cc.Label = null;
    @property(DynamicImage)
    private SprCost: DynamicImage = null;
    private cfg: Cfg_CollectionBook = null;
    public init(params: any[]): void {
        super.init(params);
        this.cfg = params[0];
        const isLink = params[1];
        this.LabelName.string = this.cfg.Name;
        const item = this.cfg.Prize.split(':');

        this.SprIcon.loadImage(`${RES_ENUM.CollectionBook_Bg_Bwz_Chahua}${this.cfg.AnimId}`, ImageType.PNG, true);
        this.SprCost.loadImage(UtilItem.GetItemIconPathByItemId(+item[0]), ImageType.PNG, true);
        this.LabelCost.string = `x${item[1]}`;

        this.BtnShare.parent.active = !isLink;
        if (this.BtnShare.parent.active) {
            const cItem = ModelMgr.I.CollectionBookModel.getItem(this.cfg.Id);
            if (cItem) {
                this.LabelCost.node.parent.active = !cItem.Share;
            }
        }
        this.LabelDesc.string = this.cfg.Text || '测试文字,配置表配置';
    }

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnShare, this.onBtnShare, this);
        UtilGame.Click(this.node, 'SprBlack', this.close, this);
        UtilGame.Click(this.BtnClose, this.close, this);
        EventClient.I.on(E.CollectionBook.UpdateCareerShare, this.onUpdateCareerShare, this);
    }

    private onUpdateCareerShare(id: number) {
        if (this.cfg.Id === id) {
            if (this.BtnShare.parent.active) {
                const cItem = ModelMgr.I.CollectionBookModel.getItem(this.cfg.Id);
                if (cItem) {
                    this.LabelCost.node.parent.active = !cItem.Share;
                }
            }
        }
    }

    private onBtnShare() {
        ShareToChat.show(ChatShowItemType.plot, this.cfg.Id, this.BtnShare.convertToWorldSpaceAR(cc.v2(0, 100)));
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.CollectionBook.UpdateCareerShare, this.onUpdateCareerShare, this);
    }
}
