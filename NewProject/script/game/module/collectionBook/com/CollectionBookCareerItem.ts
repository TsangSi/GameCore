/*
 * @Author: zs
 * @Date: 2022-12-01 18:08:24
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\com\CollectionBookCareerItem.ts
 * @Description: 博物志-生涯-item
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { ConfigStageIndexer } from '../../../base/config/indexer/ConfigStageIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectionBookCareerItem extends BaseCmp {
    @property(DynamicImage)
    private SpriteIcon: DynamicImage = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Node)
    private NodeLock: cc.Node = null;
    @property(cc.Node)
    private NodeNew: cc.Node = null;
    @property(cc.Node)
    private NodeRed: cc.Node = null;
    @property(cc.Label)
    private LabLock: cc.Label = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.node, this.onClicked, this);
        EventClient.I.on(E.CollectionBook.UpdateCareer, this.onUpdateCareer, this);
    }

    private id: number = 0;
    private cfg: Cfg_CollectionBook = null;
    public setData(index: number): void {
        const cfg: Cfg_CollectionBook = Config.Get(Config.Type.Cfg_CollectionBook).getValueByIndex(index);
        this.cfg = cfg;
        this.id = cfg.Id;
        const item = ModelMgr.I.CollectionBookModel.getItem(cfg.Id);
        this.NodeLock.active = !item;
        if (this.NodeLock.active) {
            this.LabelName.string = '';
            this.LabelName.node.parent.active = false;
            this.SpriteIcon.node.active = false;
            this.NodeNew.active = false;
            this.NodeRed.active = false;
            const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
            const c = indexer.getChapterInfo(this.cfg.UnlockParam);
            this.LabLock.string = UtilString.FormatArgs(i18n.tt(Lang.collectionbook_career_item_tips), c.chapter, c.level);
        } else {
            this.LabelName.node.parent.active = true;
            this.LabelName.string = cfg.Name ? cfg.Name : `第${index + 1}章`;
            this.SpriteIcon.node.active = true;
            this.SpriteIcon.loadImage(`${RES_ENUM.CollectionBook_Bg_Bwz_Chahua}${cfg.AnimId}`, ImageType.PNG, true);
            // this.NodeNew.active = !!StorageMgr.I.getValue(`CollectionBookCareerItem${cfg.Id}`);
            this.NodeNew.active = !!item.New;
            this.NodeRed.active = this.NodeNew.active;
        }
    }

    private updateCareerStatus() {
        const item = ModelMgr.I.CollectionBookModel.getItem(this.id);
        if (item) {
            this.NodeNew.active = !!item.New;
            this.NodeRed.active = this.NodeNew.active;
        }
    }

    private onUpdateCareer(id: number) {
        if (this.id === id) {
            this.updateCareerStatus();
        }
    }

    // private onUpdateCareerShare(id: number) {
    //     if (this.id === id) {
    //         this.updateCareerStatus();
    //     }
    // }

    private onClicked() {
        if (this.NodeLock.active) {
            const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
            const c = indexer.getChapterInfo(this.cfg.UnlockParam);
            MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.collectionbook_career_item_tips), c.chapter, c.level));
        } else {
            if (ModelMgr.I.CollectionBookModel.getItem(this.id)?.New) {
                ControllerMgr.I.CollectionBookController.C2SCollectionBookLook(this.id);
            }
            ModelMgr.I.CollectionBookModel.showCollectionPicDetailsWin(this.cfg);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.CollectionBook.UpdateCareer, this.onUpdateCareer, this);
        // EventClient.I.off(E.CollectionBook.UpdateCareerShare, this.onUpdateCareerShare, this);
    }
}
