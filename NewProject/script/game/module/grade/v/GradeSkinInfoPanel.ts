/*
 * @Author: hwx
 * @Date: 2022-07-12 11:55:56
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\GradeSkinInfoPanel.ts
 * @Description: 进阶皮肤信息面板
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { AttrsStyleA } from '../../../com/attr/AttrsStyleA';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { TabContainer } from '../../../com/tab/TabContainer';
import { TabData } from '../../../com/tab/TabData';
import { TabItem } from '../../../com/tab/TabItem';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { GRADE_SKIN_MAX_LV } from '../GradeConst';
import { GradeMgr } from '../GradeMgr';
import { GradeModel } from '../GradeModel';
import { GradeSkinItem } from './GradeSkinItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeSkinInfoPanel extends BaseCmp {
    @property(cc.Node)
    private NdSuitBtn: cc.Node = null;
    @property(cc.Label)
    private LabSuitName: cc.Label = null;
    @property(cc.Label)
    private LabSuitCount: cc.Label = null;

    @property(cc.Node)
    private NdActiveBtn: cc.Node = null;

    @property(cc.Node)
    private NdUpStarBtn: cc.Node = null;

    @property(cc.Node)
    private NdUpMax: cc.Node = null;

    @property(cc.ScrollView)
    private SvTabs: cc.ScrollView = null;

    @property(TabContainer)
    private NdTabs: TabContainer = null;

    @property(ListView)
    private ListSkin: ListView = null;

    @property(AttrsStyleA)
    private NdAttrsStyleA: AttrsStyleA = null;

    @property(cc.RichText)
    private RhAddAttr: cc.RichText = null;

    @property(ItemIcon)
    private NdCostSkinIcon: ItemIcon = null;
    @property(cc.Node)
    private NdMask: cc.Node = null;

    @property(cc.Label)
    private LabOwn: cc.Label = null;

    @property(cc.Label)
    private LabCost: cc.Label = null;

    /** 皮肤变化回调 */
    private _onChangeSkinCallback: (skinCfg: Cfg_GradeSkin, star?: number) => void;

    /** 升阶数据模型 */
    private _gradeModel: GradeModel;
    private _gradeId: number;
    private _isChangeGradeId: boolean = false;

    private _tabId: number;
    private _isChangeTab: boolean = false;
    private _defaultTabId: number;

    /** 选择的皮肤下标 */
    private _selectSkinIdx: number;
    private _selectSkinItem: GradeSkinItem;

    private _skinCfgTabMap: Map<number, Cfg_GradeSkin[]> = new Map();
    private _skinCfgList: Cfg_GradeSkin[] = [];
    private _skinUpInfoMap: Map<number, IntAttr1> = new Map();
    private _skinUpNumMap: Map<number, number> = new Map();
    private _costNum: number = 1;

    /** 聚焦页签 */
    private _forcesTab: boolean = false;

    public init(...param: unknown[]): void {
        this._gradeModel = param[0] as GradeModel;
        this._defaultTabId = param[1] as number;

        // 没有指定Id时直接更新
        if (!this._defaultTabId) {
            this.updateModel(this._gradeModel, true, !!this._gradeId);
        }
    }

    protected start(): void {
        super.start();
        EventClient.I.on(E.Grade.GradeSkinChange, this.refSkinNum, this);

        UtilGame.Click(this.NdSuitBtn, this.onClickSuitBtn, this);
        UtilGame.Click(this.NdActiveBtn, this.onClickActiveBtn, this);
        UtilGame.Click(this.NdUpStarBtn, this.onClickUpStarBtn, this);

        // 有指定id时，ListView没有初始化，延后更新
        if (this._defaultTabId) {
            this.updateModel(this._gradeModel, true, !!this._gradeId);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Grade.GradeSkinChange, this.refSkinNum, this);
    }

    /**
     * 皮肤数量变化是刷新
     */
    private refSkinNum(): void {
        GradeMgr.I.checkRedSkin(this._gradeId, this._gradeModel.data);
        const num = BagMgr.I.getItemNum(this._selectSkinItem.getIconData().cfg.Id);
        this._selectSkinItem.getIconData().data.ItemNum = num;
        this.refreshSkin(this._selectSkinIdx, this._selectSkinItem.getIconData());
    }

    /**
     * 设置监听皮肤切换回调
     * @param cb
     * @param target
     */
    public onChangeSkinCallback(cb: (skinCfg: Cfg_GradeSkin, star?: number) => void, target: unknown): void {
        this._onChangeSkinCallback = cb.bind(target);
    }

    /**
     * 监听点击套装按钮
     */
    private onClickSuitBtn(): void {
        const skinCfg = this._skinCfgList[this._selectSkinIdx];
        if (skinCfg) {
            ControllerMgr.I.RoleSkinController.linkOpenBySkinId(skinCfg.Key);
        }
    }

    /**
     * 激活
     */
    private onClickActiveBtn(): void {
        this.reqSkinUp(true);
    }

    /**
     * 升星
     */
    private onClickUpStarBtn(): void {
        this.reqSkinUp();
    }

    private reqSkinUp(isActive?: boolean) {
        const itemModel = this._selectSkinItem.getIconData();
        if (itemModel.data.ItemNum >= this._costNum) {
            const cfg = this._skinCfgList[this._selectSkinIdx];
            if (cfg) {
                const gradeId = this._gradeModel.data.GradeId;
                if (isActive) {
                    ControllerMgr.I.GradeController.reqC2SGradeSkinActive(gradeId, cfg.Key);
                } else {
                    ControllerMgr.I.GradeController.reqC2SGradeSkinLevelUp(gradeId, cfg.Key);
                }
            }
        } else {
            WinMgr.I.open(ViewConst.ItemSourceWin, itemModel.cfg.Id);
        }
    }

    /**
     * 更新数据
     * @param gradeModel
     */
    public updateModel(gradeModel: GradeModel, isInitUI?: boolean, forces?: boolean): void {
        this._forcesTab = forces;
        this._gradeModel = gradeModel;
        this._isChangeGradeId = this._gradeId && this._gradeId !== gradeModel.data.GradeId;
        this._gradeId = gradeModel.data.GradeId;
        const skinLv = this._gradeModel.data.GradeSkin.SkinLv || [];
        for (let i = 0, len = skinLv.length; i < len; i++) {
            const kv = skinLv[i];
            // 缓存提升等级，做进度动画
            const old = this._skinUpInfoMap.get(kv.K);
            if (!isInitUI && (!old || (old && old.V1 < kv.V1))) {
                const num = old ? kv.V1 - old.V1 : kv.V1;
                this._skinUpNumMap.set(kv.K, num);
            } else {
                this._skinUpNumMap.set(kv.K, 0);
            }
            // 转换提升信息为Map
            this._skinUpInfoMap.set(kv.K, kv);
        }

        const skinCfgTabMap = GradeMgr.I.getGradeSkinCfgTabMap(this._gradeId);
        if (skinCfgTabMap && skinCfgTabMap.size > 0) {
            this._skinCfgTabMap = skinCfgTabMap;
            this.sortSkinMap();

            if (isInitUI || this._forcesTab) {
                let validTabId = false;
                let tabCount = 0;
                const tabCfg: TabData[] = [];
                skinCfgTabMap.forEach((_, k) => {
                    tabCfg.push({
                        id: k, title: UtilItem.GetItemQualityName(k), isTrail: ++tabCount === skinCfgTabMap.size, notScale: true,
                    });
                    // 检查默认的tabId是否有效
                    if (this._defaultTabId && this._defaultTabId === k) {
                        validTabId = true;
                    }
                });
                tabCfg.sort((a, b) => a.id - b.id);

                let defaultTabId: number;
                if (this._defaultTabId && validTabId) {
                    defaultTabId = this._defaultTabId;
                } else {
                    // 没有默认的就找推荐的
                    defaultTabId = this.getRecommendTabId();
                }
                this._defaultTabId = undefined; // 默认的用完就丢
                this.NdTabs.setData(tabCfg, defaultTabId);
                if (this._isChangeGradeId || this._forcesTab) {
                    this.NdTabs.focus();
                }
                this.SvTabs.node.setContentSize(630, this.SvTabs.node.height);
                this.NdTabs.getComponent(cc.Layout).updateLayout();
                const svWidth = this.SvTabs.node.width;
                let ccnum = tabCount;
                const feildNum = 4; // 超过4条就滑动吧
                if (tabCount > feildNum) {
                    ccnum = feildNum;
                }
                const width = svWidth / feildNum * ccnum;
                this.SvTabs.node.setContentSize(width, this.SvTabs.node.height);
                this.SvTabs.horizontal = tabCount > feildNum;
            } else if (this._selectSkinItem) {
                this.updateSkinItemData(this._selectSkinItem, this._selectSkinIdx);
                if (!this._selectSkinItem.canUp) {
                    // 找当前列表有红点的
                    let hasRecommendSkin = false;
                    const len = this.ListSkin.content.children.length;
                    for (let i = 0; i < len; i++) {
                        const node = this.ListSkin.content.children[i];
                        const comp = node.getComponent(GradeSkinItem);
                        if (comp.canUp) {
                            hasRecommendSkin = true;
                            this._selectSkinItem.unselect();
                            this._selectSkinIdx = i;
                            this.onListRenderEvent(node, this._selectSkinIdx);
                            break;
                        }
                    }
                    if (!hasRecommendSkin) {
                        const tabId = this.getRecommendTabId();
                        if (this._tabId !== tabId) {
                            this.NdTabs.switchTab(tabId);
                        }
                    }
                }
                this.refreshSkin(this._selectSkinIdx, this._selectSkinItem.getIconData());
            }
        }
    }

    /**
     * 皮肤Map排序
     */
    private sortSkinMap(): void {
        for (const skinCfgList of this._skinCfgTabMap.values()) {
            this.sortSkinList(skinCfgList);
        }
    }

    /**
     * 皮肤列表排序
     * @param list
     * @returns Cfg_GradeSkin[]
     */
    private sortSkinList(list: Cfg_GradeSkin[]): Cfg_GradeSkin[] {
        return list.sort((a, b) => {
            const aStar = this.getSkinStar(a.Key);
            const aCount = BagMgr.I.getItemNum(a.NeedItem);
            const bStar = this.getSkinStar(b.Key);
            const bCount = BagMgr.I.getItemNum(b.NeedItem);
            if (aStar <= 0 && aCount > 0 && bStar <= 0 && bCount > 0) {
                return a.Key - b.Key;
            } else if (aStar <= 0 && aCount > 0) {
                return -1;
            } else if (bStar <= 0 && bCount > 0) {
                return 1;
            } else if (aStar > 0 && aCount > 0 && bStar > 0 && bCount > 0) {
                return a.Key - b.Key;
            } else if (aStar > 0 && aCount > 0) {
                return -1;
            } else if (bStar > 0 && bCount > 0) {
                return 1;
            } else if (aStar > 0 && bStar > 0) {
                return a.Key - b.Key;
            } else if (aStar > 0) {
                return -1;
            } else if (bStar > 0) {
                return 1;
            }
            return a.Key - b.Key;
        });
    }

    /**
     * 获取推荐TabId
     * @returns number
     */
    private getRecommendTabId(): number {
        let tabId = 0;
        /** 备份配置 */
        let backCfg: Cfg_GradeSkin = null;
        const morphSkinId = GradeMgr.I.getGradeMorphSkinId(this._gradeId);
        const list: Cfg_GradeSkin[] = [];
        this._skinCfgTabMap.forEach((skinCfgList) => {
            for (let i = 0; i < skinCfgList.length; i++) {
                const cfg = skinCfgList[i];
                if (!backCfg || cfg.Key === morphSkinId) {
                    backCfg = cfg;
                }
                const star = this.getSkinStar(cfg.Key);
                const skinStarCfg = GradeMgr.I.getGradeSkinStarCfg(this._gradeId, star);
                const count = BagMgr.I.getItemNum(cfg.NeedItem);
                if (count >= skinStarCfg.LevelUpItem) {
                    list.push(cfg);
                }
            }
        });
        if (list.length > 0) {
            list.sort((a, b) => b.TapId - a.TapId);
            tabId = list[0].TapId;
        } else if (backCfg) {
            tabId = backCfg.TapId;
        }
        return tabId;
    }

    /**
     * 监听皮肤Tab
     * @param item
     */
    public onSkinTabItem(item: TabItem): void {
        const tabData = item.getData();
        this._isChangeTab = tabData.id !== this._tabId;
        this._tabId = tabData.id;
        this._skinCfgList = this._skinCfgTabMap.get(this._tabId);

        this._selectSkinIdx = 0;
        this.ListSkin.setNumItems(this._skinCfgList.length);
    }

    /**
     * 监听皮肤列表渲染
     * @param node
     * @param idx
     */
    public onListRenderEvent(node: cc.Node, idx: number): void {
        const comp = node.getComponent(GradeSkinItem);
        this.updateSkinItemData(comp, idx);
        if (idx === this._selectSkinIdx) {
            comp.select();
            this._selectSkinItem = comp;
        } else {
            comp.unselect();
        }
    }

    /**
     * 更新皮肤项数据
     * @param comp
     * @param idx
     */
    private updateSkinItemData(comp: GradeSkinItem, idx: number): void {
        const cfg = this._skinCfgList[idx];
        const star = this.getSkinStar(cfg.Key);
        const skinStarCfg = GradeMgr.I.getGradeSkinStarCfg(this._gradeId, star);
        comp.onSelected(this.onSelectedSkinItem, this);
        comp.init(idx, cfg.NeedItem, star, skinStarCfg.LevelUpItem);
    }

    /**
     * 获取皮肤星级
     * @param skinId
     * @returns number
     */
    public getSkinStar(skinId: number): number {
        const upInfo = this._skinUpInfoMap.get(skinId);
        const star = upInfo ? upInfo.V1 : 0;
        return star;
    }

    /**
     * 监听选中皮肤
     * @param comp
     * @param idx
     * @returns
     */
    private onSelectedSkinItem(comp: GradeSkinItem, idx: number): void {
        if (idx === this._selectSkinIdx) {
            if (this._isChangeGradeId || this._isChangeTab || this._forcesTab) {
                this.refreshSkin(idx, comp.getIconData());
            }
            return;
        }
        if (this._selectSkinItem) this._selectSkinItem.unselect();

        this._selectSkinIdx = idx;
        this._selectSkinItem = comp;

        this.refreshSkin(idx, comp.getIconData());
    }

    /**
     * 刷新皮肤
     * @param idx
     * @param itemModel
     */
    private refreshSkin(idx: number, itemModel: ItemModel): void {
        const cfg = this._skinCfgList[idx];
        const skinId = cfg.Key;
        const upInfo = this._skinUpInfoMap.get(skinId);
        const star = upInfo ? upInfo.V1 : 0;
        this.NdActiveBtn.active = star === 0;
        this.NdUpStarBtn.active = star > 0 && star < GRADE_SKIN_MAX_LV;
        this.NdUpMax.active = star >= GRADE_SKIN_MAX_LV;
        this.refreshSuitIcon(skinId);
        this.refreshAttrs(cfg, star);
        this.refreshItem(itemModel, star);

        if (this._onChangeSkinCallback) {
            this._onChangeSkinCallback(cfg, star);
        }
    }

    /**
     * 刷新属性
     * @param cfg
     */
    private refreshAttrs(cfg: Cfg_GradeSkin, star: number): void {
        /** 计算属性 */
        const attrInfo = GradeMgr.I.getGradeSkinAttrInfo(this._gradeId, cfg.AttrId, star);
        this.NdAttrsStyleA.init(attrInfo);

        const attrBase = UtilAttr.GetAttrBaseExtra(cfg.AttrId);

        if (attrBase?.extraAttr) {
            const add = parseInt(attrBase.extraAttr.split(':')[1]) / 100;
            const str = `<color=${UtilColor.NorN}>${i18n.tt(Lang[`grade_${this._gradeId}_up_attr`])}</c>+<color=${UtilColor.GreenV}>${add}%</c>`;
            this.RhAddAttr.string = str;
        }
        this.RhAddAttr.node.active = !!attrBase;
    }

    /**
     * 刷新道具
     * @param itemModel
     */
    private refreshItem(itemModel: ItemModel, star: number) {
        console.log('刷新道具');
        const ownNum = itemModel.data.ItemNum;
        this.NdCostSkinIcon.setData(itemModel);

        const skinStarCfg = GradeMgr.I.getGradeSkinStarCfg(this._gradeId, star);
        this._costNum = skinStarCfg.LevelUpItem;
        this.LabOwn.string = `${UtilNum.Convert(ownNum)}`;
        this.LabOwn.node.color = ownNum < this._costNum ? UtilColor.ColorUnEnough : UtilColor.ColorEnough;
        this.LabCost.string = `/${this._costNum}`;

        const hasActiveRedDot = ownNum >= this._costNum && star === 0;
        const hasUpStarRedDot = ownNum >= this._costNum && star > 0;
        this.NdMask.active = star === 0;

        // 动态改变这个红点缓冲池子有bug
        UtilRedDot.UpdateRed(this.NdActiveBtn, hasActiveRedDot, cc.v2(65, 15));
        UtilRedDot.UpdateRed(this.NdUpStarBtn, hasUpStarRedDot, cc.v2(65, 15));
    }

    /**
     * 刷新套装图标
     * @param skinId
     */
    private refreshSuitIcon(skinId: number): void {
        const suitInfo = ModelMgr.I.RoleSkinModel.getSuitActiveInfo(skinId);
        if (suitInfo) {
            this.LabSuitName.string = suitInfo.Name;
            this.LabSuitCount.string = `${suitInfo.Count}/${suitInfo.MaxCount}`;
            this.LabSuitCount.node.color = suitInfo.Count < suitInfo.MaxCount ? UtilColor.Red() : UtilColor.Hex2Rgba(UtilColor.GreenD);
        }
    }
}
