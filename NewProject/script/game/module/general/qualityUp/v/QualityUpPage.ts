/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-08-17 12:04:53
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\qualityUp\v\QualityUpPage.ts
 * @Description: 武将-升品
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import ListView from '../../../../base/components/listview/ListView';
import { Config } from '../../../../base/config/Config';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import { GuideBtnIds } from '../../../../com/guide/GuideConst';
import { GuideMgr } from '../../../../com/guide/GuideMgr';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import { EntityUnitType } from '../../../../entity/EntityConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import GeneralEntity from '../../com/GeneralEntity';
import GeneralHead from '../../com/GeneralHead';
import {
    GeneralQuality, GeneralRarity, GeneralMsg, ClickType,
} from '../../GeneralConst';
import { GeneralModel } from '../../GeneralModel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class QualityUpPage extends WinTabPage {
    @property(cc.Node)
    private NdEntity: cc.Node = null;
    // 按钮
    @property(cc.Label)
    private LabUpNum: cc.Label = null;
    @property(cc.Node)
    private BtnOneKeySelect: cc.Node = null;
    @property(cc.Node)
    private BtnOneKeyUp: cc.Node = null;
    @property(cc.Node)
    private BtnMedicine: cc.Node = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    //
    @property(cc.Node)
    private NdPos: cc.Node = null;
    @property(cc.Node)
    private NdTog: cc.Node[] = [];
    //
    @property(ListView)
    private ListHead: ListView = null;

    private _M: GeneralModel = null;
    private _GeneralEntity: GeneralEntity = null;
    private _tabIndex: number = 0;
    private _lastTabIndex: number = 0;
    private _curData: GeneralMsg = null;
    private _generalList: GeneralMsg[] = [];
    private _deputyList: GeneralMsg[] = [];

    protected onLoad(): void {
        super.onLoad();
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
    }

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
        this.initList();

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.GeneralEntity, this.NdEntity, (err, node) => {
            if (this.NdEntity && this.NdEntity.isValid) {
                this.NdEntity.active = true;
                this._GeneralEntity = node.getComponent(GeneralEntity);
                this._GeneralEntity.uptContent(this._curData);
            }
        });
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        if (!this._M) {
            this._M = ModelMgr.I.GeneralModel;
        }
    }

    private _isinit: boolean = false;
    protected lateUpdate(dt: number): void {
        if (!this._isinit) {
            this.scheduleOnce(() => {
                this.ListHead.frameByFrameRenderNum = 0;
            }, 0.6);
            this._isinit = true;
        }
    }

    private addE() {
        EventClient.I.on(E.General.Add, this.uptUI, this);
        EventClient.I.on(E.General.Del, this.uptUI, this);
        EventClient.I.on(E.General.UptAttr, this.uptUI, this);
        EventClient.I.on(E.General.QualityUp, this.uptUI, this);
        EventClient.I.on(E.BattleUnit.UptUnit, this.uptFight, this);
        EventClient.I.on(E.General.QualityUpHead, this.uptClickHead, this);
        EventClient.I.on(E.General.UptTitle, this.uptEntityTitle, this);
        EventClient.I.on(E.General.GskinWear, this.uptUI, this);
    }

    private remE() {
        EventClient.I.off(E.General.Add, this.uptUI, this);
        EventClient.I.off(E.General.Del, this.uptUI, this);
        EventClient.I.off(E.General.UptAttr, this.uptUI, this);
        EventClient.I.off(E.General.QualityUp, this.uptUI, this);
        EventClient.I.off(E.BattleUnit.UptUnit, this.uptFight, this);
        EventClient.I.off(E.General.QualityUpHead, this.uptClickHead, this);
        EventClient.I.off(E.General.UptTitle, this.uptEntityTitle, this);
        EventClient.I.off(E.General.GskinWear, this.uptUI, this);
    }

    private clk() {
        UtilGame.Click(this.BtnMedicine, () => {
            WinMgr.I.open(ViewConst.QualityUpPreview, this._curData, this.getQualityItem(this._curData.generalData.Quality));
        }, this);
        UtilGame.Click(this.BtnUp, () => {
            WinMgr.I.open(ViewConst.QualityUpPreview, this._curData, this._deputyList);
        }, this);
        UtilGame.Click(this.BtnOneKeySelect, this.onekeySelect, this);
        UtilGame.Click(this.BtnOneKeyUp, this.onekeyUp, this);
        for (let i = 0; i < this.NdTog.length; i++) {
            UtilGame.Click(this.NdTog[i], () => {
                if (this._tabIndex === i) {
                    return;
                }
                this.onTog(i);
            }, this);
        }
        GuideMgr.I.bindScript(GuideBtnIds.GeneralGradeUpBtn, this.BtnUp, this.node);
    }

    /** 初始界面展示 */
    private initList(): void {
        this._tabIndex = 0;
        this._lastTabIndex = 0;
        this._generalList = this._M.getGeneralListByQuality(this._tabIndex);
        // 赋值：是否能升品
        const canUp = this.deputyEnough();
        this._generalList.forEach((v) => {
            v.deputyEnough = canUp[v.generalData.Quality];
        });
        // 初始是选中全部页签，这里的排序采用 qualityAllSort
        this._generalList.sort(this._M.qualityAllSort);
        this.ListHead.setNumItems(this._generalList.length);

        this.uptDeputyList();
        this.uptContent();
    }

    /** 增、删、升品、属性变化的刷新 */
    private uptUI(isQualityUp?: boolean) {
        // console.log('QualityUpPage 监听数据有变化，刷新', isQualityUp);
        this._generalList = this._M.getGeneralListByQuality(this._tabIndex);
        // 赋值：是否能升品
        const canUp = this.deputyEnough();
        this._generalList.forEach((v) => {
            v.deputyEnough = canUp[v.generalData.Quality];
        });
        // 升品后就取消选中主武将
        if (isQualityUp) {
            this._curData = null;
        }
        // 排序
        if (this._tabIndex === 0) {
            this._generalList.sort(this._M.qualityAllSort);
        } else {
            this._generalList.sort(this._M.sort);
        }
        this.ListHead.setNumItems(this._generalList.length);
        // 刷新
        this.uptDeputyList();
        this.uptContent();
    }

    /** 改变出战的刷新 */
    private uptFight() {
        // 排序
        if (this._tabIndex === 0) {
            this._generalList.sort(this._M.qualityAllSort);
        } else {
            this._generalList.sort(this._M.sort);
        }
        this.ListHead.setNumItems(this._generalList.length);
        this.uptDeputyList();
        this.uptContent();
    }

    private uptEntityTitle(data: GeneralData) {
        if (data && this._curData && this._curData.generalData) {
            this._curData.generalData = data;
        }
        if (this._GeneralEntity) {
            this.NdEntity.active = true;
            this._GeneralEntity.uptContent(this._curData);
        }
    }

    /** 更新内容 */
    private uptContent() {
        if (this._GeneralEntity) {
            this._GeneralEntity.uptContent(this._curData);
        }
        const isSelected = !!this._curData;
        if (isSelected) {
            const isFull = this.isDeputyFull();
            this.BtnUp.active = isFull;
            if (isFull && GuideMgr.I.isDoing && !GuideMgr.I.isNextStepBtnId(GuideBtnIds.GeneralGradeUpSure)) {
                if (GuideMgr.I.isNextStepBtnId(GuideBtnIds.GeneralGradeUp1)
                    || GuideMgr.I.isNextStepBtnId(GuideBtnIds.GeneralGradeUp2)
                    || GuideMgr.I.isNextStepBtnId(GuideBtnIds.GeneralGradeUp3)
                    || GuideMgr.I.isNextStepBtnId(GuideBtnIds.GeneralGradeUpBtn)) {
                    GuideMgr.I.changeCurStepByBtnId(GuideBtnIds.GeneralGradeUpBtn);
                }
            } else if (!isFull && GuideMgr.I.isDoing && GuideMgr.I.isNextStepBtnId(GuideBtnIds.GeneralGradeUp2)) {
                GuideMgr.I.changeCurStepByBtnId(GuideBtnIds.GeneralGradeUp2);
            }
            this.BtnOneKeySelect.active = !isFull;
            if (isFull) {
                this.LabUpNum.string = `${this._M.costMoney(this._curData.generalData.Quality)[1]}`;
            }
        } else {
            this.BtnUp.active = false;
            this.BtnOneKeySelect.active = false;
            if (GuideMgr.I.isDoing
                && !GuideMgr.I.isNextStepBtnId(GuideBtnIds.GeneralGradeUp2)
                && !GuideMgr.I.isNextStepBtnId(GuideBtnIds.Black)
                && !GuideMgr.I.isDoingByBtnId(GuideBtnIds.Black)) {
                GuideMgr.I.changeCurStepByBtnId(GuideBtnIds.GeneralGradeUp1);
            }
        }

        this.BtnOneKeyUp.active = !isSelected;
        if (this._curData) {
            this.BtnMedicine.active = !!this.getQualityItem(this._curData.generalData.Quality);
        } else {
            this.BtnMedicine.active = false;
        }
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: GeneralMsg = this._generalList[idx];
        let isRed: boolean = false;
        let isSelected: boolean = false;
        if (this._curData) {
            isSelected = this._curData.generalData.OnlyId === data.generalData.OnlyId;
            if (!isSelected) {
                const deputyIndex = this._deputyList.findIndex((v) => v.generalData.OnlyId === this._generalList[idx].generalData.OnlyId);
                isSelected = deputyIndex >= 0;
            }
        } else {
            isRed = data.deputyEnough;
        }
        const item = node.getComponent(GeneralHead);
        if (data && item) {
            item.setData(data, {
                clickType: ClickType.QualityUp, isRed, qualityupSelect: !!this._curData, isSelected,
            });
        }
        if (idx === 0) {
            GuideMgr.I.bindScript(GuideBtnIds.GeneralGradeUp1, node, this.ListHead.node);
        } else if (idx === 1) {
            GuideMgr.I.bindScript(GuideBtnIds.GeneralGradeUp2, node, this.ListHead.node);
        } else if (idx === 2) {
            GuideMgr.I.bindScript(GuideBtnIds.GeneralGradeUp3, node, this.ListHead.node);
        } else {
            GuideMgr.I.unbind(GuideBtnIds.GeneralGradeUp1, node);
            GuideMgr.I.unbind(GuideBtnIds.GeneralGradeUp2, node);
            GuideMgr.I.unbind(GuideBtnIds.GeneralGradeUp3, node);
        }
    }

    private setTog(index: number) {
        this._lastTabIndex = this._tabIndex;
        this._tabIndex = index;

        for (let i = 0; i < this.NdTog.length; i++) {
            this.NdTog[i].getChildByName('NdSelected').active = i === index;
        }
    }

    /** 点击品质Tog，若没有该品质的武将则不选中，有就筛选出该品质的武将列表，排序展示 */
    private onTog(index: number, isBack: boolean = false) {
        if (this._curData) {
            if (index > 0 && this._curData.generalData.Quality !== index) {
                MsgToastMgr.Show(i18n.tt(Lang.general_deputy));
            } else {
                this.setTog(index);
                if (!isBack) {
                    this._lastTabIndex = this._tabIndex;
                }
            }
            return;
        }
        const list: GeneralMsg[] = this._M.getGeneralListByQuality(index);

        if (list.length === 0) {
            const str = i18n.tt(Lang.general_rarity_none) + i18n.tt(Lang[`general_quality_${index}`]) + i18n.tt(Lang.general_quality);
            MsgToastMgr.Show(str);
        } else {
            this._generalList = list;
            if (index === 0) {
                // 全部页签的排序会不一样
                const canUp = this.deputyEnough();
                this._generalList.forEach((v) => {
                    v.deputyEnough = canUp[v.generalData.Quality];
                });
                this._generalList.sort(this._M.qualityAllSort);
            } else {
                this._generalList.sort(this._M.sort);
            }

            this.ListHead.setNumItems(this._generalList.length);
            this.ListHead.scrollTo(0);

            if (isBack && this._lastTabIndex === 0 && this._tabIndex > 0) {
                this.setTog(0);
            } else {
                this.setTog(index);
                this._lastTabIndex = this._tabIndex;
            }
        }
    }

    /** 副武将数量是否足够。相同品质的武将，是否能升品，都是一样的,只需获取一次 */
    private deputyEnough(): boolean[] {
        const canUp: boolean[] = [];
        for (let i = GeneralQuality.GREEN; i <= GeneralQuality.COLORFUL; i++) {
            const list = this._M.getGeneralListByQuality(i);
            if (list && list.length > 1) {
                const need = this.costDeputyNum(i) + 1;
                canUp[i] = list.length >= need;
            } else {
                canUp[i] = false;
            }
        }
        return canUp;
    }

    /** 一键选择 */
    private onekeySelect() {
        if (this._curData) {
            // 1. 先筛选出符合条件的副武将列表：同品质；未上锁；未上阵；头衔低于名将
            const quality = this._curData.generalData.Quality;
            const list = this._M.getGeneralListByOnekey(quality, this._curData.generalData.OnlyId);
            if (!list || list.length === 0) {
                MsgToastMgr.Show(i18n.tt(Lang.general_q_onekey));
                return;
            }
            // 2. 筛选后的副武将排序
            list.sort(this._M.onekeyDeputySort);
            // 3. 放到副武将列表里
            const num = this.costDeputyNum(quality);
            if (this._deputyList.length < num) {
                // 一直加，加到数量够就跳出
                for (let i = 0; i < list.length; i++) {
                    const deputyIndex = this._deputyList.findIndex((v) => v.generalData.OnlyId === list[i].generalData.OnlyId);
                    if (deputyIndex < 0) {
                        this._deputyList.push(list[i]);
                    }
                    if (this._deputyList.length >= num) {
                        break;
                    }
                }
            }
            // 4. 刷新副武将列表内容和武将列表内容
            this.uptDeputyList();
            this.uptContent();
            this.ListHead.setNumItems(this._generalList.length);
        }
    }

    /** 选中主武将或取消选中主武将后，都重新筛选武将列表并排序 */
    private uptGeneralList(list: GeneralMsg[]) {
        if (list.length > 0) {
            const index = list.findIndex((v) => v.generalData.OnlyId === this._curData.generalData.OnlyId);
            if (index >= 0) {
                list.splice(index, 1);
            }
            list.sort(this._M.selectedSort);
            list.unshift(this._curData);
            // 重刷列表
            this._generalList = list;
            this.ListHead.setNumItems(this._generalList.length);
            this.ListHead.scrollTo(0);
        }
    }

    private clickCallback(index: number) {
        if (!this._curData) return;
        const need = this.costDeputyNum(this._curData.generalData.Quality);
        if (this._deputyList.length < need) {
            this._deputyList.push(this._generalList[index]);
            // 只刷新当前
            // this._generalList[index].isSelected = false;
            this.ListHead.updateItem(index);
            //
            this.uptDeputyList();
            this.uptContent();
        } else {
            MsgToastMgr.Show(UtilString.FormatArray(i18n.tt(Lang.general_more), [need]));
        }
    }

    /**
     * 点击头像按钮
    */
    private uptClickHead(onlyId: string) {
        const index = this._generalList.findIndex((v) => v.generalData.OnlyId === onlyId);
        if (!this._generalList[index]) return;
        if (!this._curData) {
            // 1.若当前没有选中，点击头像
            // (1).是否已达满级
            if (!this._M.canQualityUp(this._generalList[index])) {
                MsgToastMgr.Show(i18n.tt(Lang.general_max));
                return;
            }

            const quality = this._generalList[index].generalData.Quality;

            // (2).若可以使用提品丹来升品就不需要满足副武将数量的条件
            let canUp = !!this.getQualityItem(quality);
            const deputyList = this._M.getGeneralListByQuality(quality);

            // (3).判断副武将的数量是否足够，不够不能选中;够就选中，筛选出当前品质的武将，排序展示
            if (!canUp) {
                const need = this.costDeputyNum(quality);
                canUp = deputyList.length >= need + 1;
                if (!canUp) {
                    MsgToastMgr.Show(UtilString.FormatArray(i18n.tt(Lang.general_less), [i18n.tt(Lang[`general_quality_${quality}`]), need]));
                }
            }

            if (canUp) {
                this._curData = this._generalList[index];
                this.uptGeneralList(deputyList);
                //
                if (this._tabIndex === 0) {
                    this.setTog(quality);
                }
            }
        } else {
            // 2. 当前已选中主武将了
            // 2-1. 若点击的是主武将，则取消选中, 重新生成列表及排序
            if (this._generalList[index].generalData.OnlyId === this._curData.generalData.OnlyId) { // || index === 0
                // console.log('当前已选中主武将了,这时点击的是主武将，则取消选中');
                this._curData = null;
                // 取消选中主武将相当于点击品质菜单
                this.onTog(this._lastTabIndex, true);
            } else {
                // 2-2. 点击其它的武将 先判断该武将是否已被选为副武将了，若是，则取消
                const deputyIndex = this._deputyList.findIndex((v) => v.generalData.OnlyId === this._generalList[index].generalData.OnlyId);
                if (deputyIndex >= 0) {
                    this._deputyList.splice(deputyIndex, 1);
                    // 只刷新当前
                    this.ListHead.updateItem(index);
                } else {
                    // 优化为走统一接口
                    if (!ModelMgr.I.GeneralModel.costSelf(this._generalList[index], index, { showToggle: 'QualityUp', tipTogState: false }, this.clickCallback, this)) {
                        const need = this.costDeputyNum(this._curData.generalData.Quality);
                        if (this._deputyList.length < need) {
                            this._deputyList.push(this._generalList[index]);
                            // 只刷新当前
                            this.ListHead.updateItem(index);
                        } else {
                            MsgToastMgr.Show(UtilString.FormatArray(i18n.tt(Lang.general_more), [need]));
                        }
                    }
                }
            }
        }
        this.uptDeputyList();
        this.uptContent();
    }

    /** 选中主武将后的升品列表的刷新 */
    private uptDeputyList() {
        this.NdPos.active = true;
        let need = 5;
        if (this._curData) {
            need = this.costDeputyNum(this._curData.generalData.Quality) + 1;
        } else {
            this._deputyList.length = 0;
        }
        // 删了多余的
        for (let index = need; index < this.NdPos.children.length; index++) {
            const element = this.NdPos.children[index];
            element.destroy();
        }
        let tmpNode: cc.Node;
        for (let i = 0, n = need; i < n; i++) {
            if (i === 0) {
                // 主武将
                if (this._curData) {
                    const ndHead: cc.Node = this.NdPos.children[0].getChildByName('GeneralHead');
                    ndHead.active = true;
                    ndHead.getComponent(GeneralHead).setData(this._curData, { clickType: ClickType.QualityUp, unshowSelect: true });
                    this.NdPos.children[0].getChildByName('GenerlNull').active = false;
                } else {
                    this.NdPos.children[0].getChildByName('GeneralHead').active = false;
                    const NdNull: cc.Node = this.NdPos.children[0].getChildByName('GenerlNull');
                    NdNull.active = true;
                    NdNull.getChildByName('SprBgRarity').getComponent(DynamicImage).loadImage(UtilItem.GetItemQualityBgPath(1), 1, true);
                }
            } else {
                tmpNode = this.NdPos.children[i];
                if (!tmpNode) {
                    tmpNode = cc.instantiate(this.NdPos.children[1]);
                    this.NdPos.addChild(tmpNode);
                }
                tmpNode.active = true;
                if (this._curData) {
                    if (this._deputyList[i - 1]) {
                        const ndHead: cc.Node = tmpNode.getChildByName('GeneralHead');
                        ndHead.active = true;
                        ndHead.getComponent(GeneralHead).setData(this._deputyList[i - 1], { clickType: ClickType.QualityUp, unshowSelect: true });
                        tmpNode.getChildByName('GenerlNull').active = false;
                    } else {
                        tmpNode.getChildByName('GeneralHead').active = false;
                        const NdNull: cc.Node = tmpNode.getChildByName('GenerlNull');
                        NdNull.active = true;
                        NdNull.getChildByName('SprBgRarity').getComponent(DynamicImage).loadImage(UtilItem.GetItemQualityBgPath(this._curData.generalData.Quality), 1, true);
                    }
                } else {
                    tmpNode.getChildByName('GeneralHead').active = false;
                    const NdNull: cc.Node = tmpNode.getChildByName('GenerlNull');
                    NdNull.active = true;
                    NdNull.getChildByName('SprBgRarity').getComponent(DynamicImage).loadImage(UtilItem.GetItemQualityBgPath(1), 1, true);
                }
            }
        }
    }

    /** 是否显示 神丹提品 按钮 */
    private getQualityItem(quality: GeneralQuality): string {
        const cfg: Cfg_GeneralQuality = Config.Get(Config.Type.Cfg_GeneralQuality).getValueByKey(quality);
        return cfg.QualityItem;
    }

    /** 副武将选满了 */
    private isDeputyFull(): boolean {
        if (this._curData) {
            const quality = this._curData.generalData.Quality;
            const num = this.costDeputyNum(quality);
            return this._deputyList.length >= num;
        }
        return false;
    }

    /** 消耗副将的数目 */
    private costDeputyNum(quality: GeneralQuality): number {
        if (quality <= GeneralQuality.ALL || quality >= GeneralQuality.COLORFUL) {
            console.warn('品质参数不对');
            return 4;
        }
        const cfg: Cfg_GeneralQuality = Config.Get(Config.Type.Cfg_GeneralQuality).getValueByKey(quality);
        if (cfg) {
            return cfg.Cost;
        }
        return 4;
    }

    /** 一键升品需要多少组 */
    private onekeyGround(): number {
        const cfg: Cfg_Config_General = this._M.cfgConfigGeneral.getValueByKey('GeneralDevourNum');
        return +cfg.CfgValue;
    }

    /** 获取一键升品数据列表 */
    private getOnekeyData(): GeneralMsg[][] {
        // 1.筛选出能用于一键升品的武将（稀有度<=虎将&&品质<=橙色&&未锁定&&未上阵）
        const list: GeneralMsg[] = this._M.getGeneralListByQuality(0);
        const qualityList: GeneralMsg[][] = [];
        for (let i = 0; i < list.length; i++) {
            if (!list[i].cfg) {
                list[i].cfg = this._M.cfgGeneral.getValueByKey(list[i].generalData.IId);
            }

            const q: GeneralQuality = list[i].generalData.Quality;

            if (!list[i].battlePos && !list[i].generalData.Lock && q <= GeneralQuality.ORANGE && list[i].cfg.Rarity <= GeneralRarity.Rarity4) {
                if (!qualityList[q]) {
                    qualityList[q] = [];
                }
                qualityList[q].push(list[i]);
            }
        }
        // console.log(qualityList);
        // 2. 能达到一键升品的就加到升品列表里
        const onekeyList: GeneralMsg[][] = [];
        for (let i = GeneralQuality.GREEN; i <= GeneralQuality.ORANGE; i++) {
            const deputy = this.costDeputyNum(i);
            const oneGrow: number = deputy + 1;
            if (qualityList[i] && qualityList[i].length >= oneGrow) {
                // 先排序
                qualityList[i].sort(this._M.DeputySort);
                // 有多少组
                const grow = Math.floor(qualityList[i].length / oneGrow);
                for (let g = 0; g < grow; g++) {
                    const len = onekeyList.length;
                    if (!onekeyList[len]) {
                        onekeyList[len] = [];
                    }
                    onekeyList[len].push(qualityList[i].shift());
                    for (let index = 0; index < deputy; index++) {
                        onekeyList[len].push(qualityList[i].pop());
                    }
                }
            }
        }
        // console.log(onekeyList);
        return onekeyList;
    }

    /** 一键升品 */
    private onekeyUp() {
        const onekeyData: GeneralMsg[][] = this.getOnekeyData();
        const need: number = this.onekeyGround();
        if (onekeyData.length >= need) {
            WinMgr.I.open(ViewConst.QualityOnekeyUp, onekeyData);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.general_unfull));
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
