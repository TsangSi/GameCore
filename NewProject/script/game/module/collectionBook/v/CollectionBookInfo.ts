/*
 * @Author: zs
 * @Date: 2022-12-01 18:05:03
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\v\CollectionBookInfo.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { AttrModel } from '../../../base/attribute/AttrModel';
import ListView from '../../../base/components/listview/ListView';
import Progress from '../../../base/components/Progress';
import { Config } from '../../../base/config/Config';
import { NdAttrBaseAdditionContainer } from '../../../com/attr/NdAttrBaseAdditionContainer';
import { UtilGame } from '../../../base/utils/UtilGame';
import { FightValue } from '../../../com/fightValue/FightValue';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import CollectionBookInfoItem from '../com/CollectionBookInfoItem';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { EffectMgr } from '../../../manager/EffectMgr';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectionBookInfo extends WinTabPage {
    @property(ListView)
    private ListView: ListView = null;
    @property(Progress)
    private Progress: Progress = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Node)
    private BtnReward: cc.Node = null;
    @property(NdAttrBaseAdditionContainer)
    private AttrContent: NdAttrBaseAdditionContainer = null;
    @property(FightValue)
    private FightValue: FightValue = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Node)
    private NodeFull: cc.Node = null;
    @property(cc.Label)
    private LabelAllScore: cc.Label = null;
    private taskIds: number[] = [];

    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.CollectionBook.UpdateExp, this.onUpdateExp, this);
        EventClient.I.on(E.CollectionBook.UpdateLevel, this.onUpdateLevel, this);
        EventClient.I.on(E.CollectionBook.UpdateTask, this.onUpdateTask, this);
        // EventClient.I.on(E.CollectionBook.NewActive, this.onNewActive, this);
        UtilGame.Click(this.BtnReward, this.onBtnReward, this);
    }

    public init(winId: number, param: any[], tabIdx?: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        this.refreshPage(winId, param, tabIdx, tabId);
        this.updateExp(true);
        this.onUpdateLevel();
        const level = ModelMgr.I.CollectionBookModel.infoLevel;
        this.updateLevelIcon(level);
    }
    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        this.taskIds = ModelMgr.I.CollectionBookModel.getSortTaskIds();

        this.ListView.setNumItems(this.taskIds.length);
    }

    private updateExp(isInit: boolean = false) {
        const level = ModelMgr.I.CollectionBookModel.infoLevel;
        const cfgNext: Cfg_CollectionBookLevel = Config.Get(Config.Type.Cfg_CollectionBookLevel).getValueByKey(level);
        let curExp = ModelMgr.I.CollectionBookModel.infoLevelExp;
        let maxExp = 0;
        if (ModelMgr.I.CollectionBookModel.isInfoFullLevel()) {
            maxExp = curExp;
            curExp += ModelMgr.I.CollectionBookModel.fullLevelNeedExp;
        } else {
            maxExp = cfgNext.ExpMax;
        }
        this.Progress.updateProgress(curExp, maxExp, !isInit);
        if (!isInit && this.Progress.node.activeInHierarchy) {
            EffectMgr.I.showEffect(RES_ENUM.Com_Ui_8011, this.Progress.node, cc.WrapMode.Normal, (n) => {
                n.scaleX = 1.5;
            });
        }
        if (ModelMgr.I.CollectionBookModel.isInfoFullLevel()) {
            this.LabelAllScore.string = UtilString.FormatArgs(i18n.tt(Lang.collectionbook_all_score), curExp);
        }
    }

    /** 更新见闻经验值 */
    private onUpdateExp() {
        this.updateExp();
    }

    private level: number = -1;
    /** 更新见闻等级，战力变化，属性变化 */
    private onUpdateLevel() {
        const oldLevel = this.level;
        const level = ModelMgr.I.CollectionBookModel.infoLevel;
        const cfg: Cfg_CollectionBookLevel = Config.Get(Config.Type.Cfg_CollectionBookLevel).getValueByKey(level);
        let attr = AttrModel.MakeAttrInfo(cfg.AttrId);
        this.FightValue.setValue(attr.fightValue);
        if (!ModelMgr.I.CollectionBookModel.isInfoFullLevel()) {
            const nextCfg: Cfg_CollectionBookLevel = Config.Get(Config.Type.Cfg_CollectionBookLevel).getValueByKey(level + 1);
            const nextAttr = AttrModel.MakeAttrInfo(nextCfg.AttrId);
            let addAttr: AttrInfo;
            if (level === 0 && !attr.attrs?.length) {
                addAttr = nextAttr.clone();
                attr = nextAttr.diff(nextAttr);
            } else if (level > 0) {
                addAttr = nextAttr.diff(attr);
            }
            this.AttrContent.init(attr.attrs, addAttr.attrs);
            this.BtnReward.parent.active = true;
            this.NodeFull.active = false;
        } else {
            this.AttrContent.init(attr.attrs, undefined, { isShowAdd: false });
            this.BtnReward.parent.active = false;
            this.NodeFull.active = true;
        }
        this.LabelName.string = cfg.Name;
        if (this.level >= 0 && oldLevel !== level) {
            WinMgr.I.open(ViewConst.CollectionAttrUpWin, oldLevel, level);
            this.updateLevelIcon(level);
        }
        this.level = level;
    }

    private updateLevelIcon(level: number) {
        const oldCfg: Cfg_CollectionBookLevel = Config.Get(Config.Type.Cfg_CollectionBookLevel).getValueByKey(level);
        this.SprIcon.loadImage(`${RES_ENUM.CollectionBook_Icon_Jianwen_Dengji}${UtilNum.FillZero(+oldCfg.AnimId, 2)}`, ImageType.PNG, true);
    }

    private scriptByIndex: { [index: number]: CollectionBookInfoItem } = cc.js.createMap(true);
    private onRenderItem(node: cc.Node, index: number) {
        const script = this.scriptByIndex[index] = node.getComponent(CollectionBookInfoItem);
        script?.setData(this.taskIds[index]);
    }

    /** 见闻等级奖励按钮 */
    private onBtnReward() {
        // eslint-disable-next-line max-len
        const cfgLevel: Cfg_CollectionBookLevel = Config.Get(Config.Type.Cfg_CollectionBookLevel).getValueByKey(ModelMgr.I.CollectionBookModel.infoLevel + 1);
        WinMgr.I.open(ViewConst.CollectionBookRw, cfgLevel.DropReward);
    }

    private onUpdateTask(taskId: number) {
        this.taskIds = ModelMgr.I.CollectionBookModel.getSortTaskIds();
        this.ListView.setNumItems(this.taskIds.length);
    }

    // private onNewActive() {
    //     if (ModelMgr.I.CollectionBookModel.isInfoFullLevel()) {
    //         this.LabelAllScore.string = UtilString.FormatArgs(i18n.tt(Lang.collectionbook_all_score), ModelMgr.I.CollectionBookModel.getScore());
    //     }
    // }
    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.CollectionBook.UpdateTask, this.onUpdateTask, this);
        EventClient.I.off(E.CollectionBook.UpdateExp, this.onUpdateExp, this);
        EventClient.I.off(E.CollectionBook.UpdateLevel, this.onUpdateLevel, this);
        // EventClient.I.off(E.CollectionBook.NewActive, this.onNewActive, this);
    }
}
