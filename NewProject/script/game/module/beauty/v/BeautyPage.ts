/*
 * @Author: zs
 * @Date: 2022-10-28 18:19:27
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\beauty\v\BeautyPage.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { ACTION_TYPE, ANIM_TYPE } from '../../../base/anim/AnimCfg';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { EntityUnitPos, EntityUnitType } from '../../../entity/EntityConst';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BeautyModel } from '../BeautyModel';
import { EBeautyIndexId } from '../BeautyVoCfg';
import { BeautyActive } from '../com/BeautyActive';
import { BeautyHead } from '../com/BeautyHead';
import { BeautyLevel } from '../com/BeautyLevel';
import { BeautySkill } from '../com/BeautySkill';
import { BeautyStar } from '../com/BeautyStar';
import { FightValue } from '../../../com/fightValue/FightValue';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { EAttrShowType, IAttrInfo } from '../../../base/attribute/AttrConst';
import { ChatShowItemType } from '../../chat/ChatConst';
import { ShareToChat } from '../../../com/ShareToChat';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { EBeautyAttrInfoType } from '../BeautyConst';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemType } from '../../../com/item/ItemConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';

const { ccclass, property } = cc._decorator;
@ccclass
export class BeautyPage extends WinTabPage {
    @property(cc.Node)
    private content: cc.Node = null;
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Label)
    private LabelActiveCount: cc.Label = null;
    @property(cc.Label)
    private LabelAllFightValue: cc.Label = null;
    @property(cc.Node)
    private NodeSkill: cc.Node = null;
    @property(cc.Node)
    private NodeAnim: cc.Node = null;
    @property(cc.Node)
    private NodeFollow: cc.Node = null;
    @property(cc.Node)
    private NodeAreadyBattle: cc.Node = null;
    @property(cc.Node)
    private NodeShow: cc.Node = null;
    @property(cc.Node)
    private NodeFull: cc.Node = null;
    @property(cc.Node)
    private NodeFightValue: cc.Node = null;
    @property(cc.Node)
    private NodeCheckAllFv: cc.Node = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Node)
    private NdAttr: cc.Node = null;
    @property(cc.Node)
    private NdSZ: cc.Node = null;

    /** ?????????????????????????????????????????????????????????????????? */
    private isLoads: { [tabId: number]: boolean } = [];
    /** ????????????????????????????????????????????????????????????????????? */
    private isLoadActive: boolean = false;
    /** ?????????????????????id */
    private selectId: number = 0;
    /** ?????????????????????id???????????????????????? */
    private showIds: number[] = [];
    /** ??????id?????????????????????????????? */
    private headScriptById: { [id: number]: BeautyHead } = cc.js.createMap(true);
    /** ????????????model */
    private model: BeautyModel = null;
    /** ??????????????? */
    private scriptFightValue: FightValue = null;
    /** ??????????????????????????? */
    private skills: string[] = [];
    protected onLoad(): void {
        super.onLoad();
        this.model = ModelMgr.I.BeautyModel;
        EventClient.I.on(E.Beauty.Add, this.onAdd, this);
        EventClient.I.on(E.Beauty.Update, this.updateActiveCount, this);
        EventClient.I.on(E.Beauty.UpdateExpLevel, this.onUpdateExpLevel, this);
        EventClient.I.on(E.Beauty.UpdateStar, this.onUpdateStar, this);
        EventClient.I.on(E.BattleUnit.UptUnit, this.onUptUnit, this);
        EventClient.I.on(E.Beauty.UpdateHead, this.updateHeadItem, this);
        EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.BEAUTY}`, this.onItemChangeItem, this);
        UtilGame.Click(this.NodeShow, this.onShowClicked, this);
        UtilGame.Click(this.NodeFollow, this.onFollowClicked, this);
        UtilGame.Click(this.NodeCheckAllFv, this.onNodeCheckAllFvClicked, this);
    }
    protected start(): void {
        super.start();
        this.sortShowHeads();
        this.LabelActiveCount.string = `${this.model.activeCount}`;
        this.updateFightValue();
        this.updateLabelAllFightValue();
    }

    /** ??????????????????????????? */
    private updateFightValue() {
        if (!this.scriptFightValue) {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Com_FightValue, this.NodeFightValue, (e, n) => {
                if (n) {
                    this.scriptFightValue = n.getComponent(FightValue);
                    this._setFightValue();
                    this.scriptFightValue.setDetailCallback(() => {
                        if (!this.model.isActive(this.selectId)) {
                            MsgToastMgr.Show(i18n.tt(Lang.beauty_unactive));
                            return;
                        }
                        const b = this.model.getBeauty(this.selectId);
                        const titles = [
                            // i18n.tt(Lang.beauty_active_attr_title),
                            i18n.tt(Lang.beauty_level_attr_title),
                            i18n.tt(Lang.beauty_star_attr_title),
                        ];
                        const infos = this.getAttrDetailTips(titles, b.levelAttrInfo, b.starAttrInfo);
                        WinMgr.I.open(ViewConst.AttrDetailTips, infos);
                    });
                }
            });
        } else {
            this._setFightValue();
        }
    }

    /** ???????????? */
    private _setFightValue() {
        if (this.model.isActive(this.selectId)) {
            const b = this.model.getBeauty(this.selectId);
            this.scriptFightValue?.setValue(b.fightValue);
        } else {
            this.scriptFightValue?.setValue(0);
        }
    }

    /** ?????????????????? */
    private showSkills() {
        this.skills.length = 0;
        const isActive = this.model.isActive(this.selectId);
        let star = 1;
        if (isActive) {
            star = this.model.getBeauty(this.selectId).Star;
        }
        const cfg = this.model.cfg.getValueByKeyFromStar(this.selectId, star, { SkillId: '', PassiveSkills: '' });
        const pskills = cfg.PassiveSkills.split('|');
        this.skills = this.skills.concat(cfg.SkillId).concat(pskills);
        if (this.NodeSkill.childrenCount === 0) {
            ResMgr.I.loadLocal(UI_PATH_ENUM.Module_Beauty_Com_BeautySkill, cc.Prefab, (e, p: cc.Prefab) => {
                let skill: string[] = [];
                for (let i = 0, n = this.skills.length; i < n; i++) {
                    skill = this.skills[i].split(':');
                    if (skill) {
                        const child = cc.instantiate(p);
                        child.getComponent(BeautySkill).setData(this.selectId, i, +skill[0], +skill[1], isActive);
                        this.NodeSkill.addChild(child);
                    }
                }
            });
        } else {
            let skill: string[] = [];
            for (let i = 0, n = Math.max(this.NodeSkill.childrenCount, this.skills.length); i < n; i++) {
                skill = this.skills[i]?.split(':');
                if (skill) {
                    const child = this.NodeSkill.children[i] || cc.instantiate(this.NodeSkill.children[0]);
                    child.getComponent(BeautySkill).setData(this.selectId, i, +skill[0], +skill[1], isActive);
                    if (!this.NodeSkill.children[i]) {
                        this.NodeSkill.addChild(child);
                    } else {
                        child.active = true;
                    }
                } else {
                    this.NodeSkill.children[i].destroy();
                }
            }
        }
    }

    private onAdd(ids: number[]) {
        MsgToastMgr.Show(i18n.tt(Lang.beauty_active_success));
        this.updateActiveCount(ids);
    }

    /** ?????????????????? */
    private updateActiveCount(ids: number[]) {
        this.LabelActiveCount.string = `${this.model.activeCount}`;
        this.updateLabelAllFightValue();
        let index = 0;
        ids.forEach((id) => {
            index = this.showIds.indexOf(id);
            if (index >= 0) {
                this.ListView.updateItem(index);
            }
        });
        this.updateView();
        this.updateFightValue();
    }

    /** ?????????????????? */
    private onUpdateExpLevel(id) {
        if (this.selectId === id) {
            if (this.model.isFullLevel(id)) {
                this.updateCom();
            }
            this.updateFightValue();
        }
        this.updateLabelAllFightValue();
        this.updateAllHeadRed();
        this.updateHeadItem(id);
    }

    /** ?????????????????? */
    private onUpdateStar(id: number) {
        if (this.selectId === id) {
            this.updateFightValue();
        }
        this.updateLabelAllFightValue();
        this.updateAllHeadRed();
        this.updateHeadItem(id);
        this.showSkills();
    }

    /** ?????????????????? */
    private updateHeadItem(id: number) {
        const s = this.headScriptById[id];
        if (s && s.node && s.node.isValid) {
            const index = this.showIds.indexOf(id);
            if (index >= 0) {
                this.ListView.updateItem(index);
            }
        }
    }

    /** ????????????????????? */
    private updateLabelAllFightValue() {
        this.LabelAllFightValue.string = `${this.model.getAllFightValue()}`;
    }

    /** ?????????????????????????????? */
    private sortShowHeads(id?: number) {
        const canActives: number[] = [];
        const activeds: number[] = [];
        Config.Get(Config.Type.Cfg_Beauty).forEach((cfg: Cfg_Beauty) => {
            if (cfg.IsVisible === 1) {
                if (this.model.isActive(cfg.PetAId)) {
                    activeds.unshift(cfg.PetAId);
                } else if (this.model.isCanActive(cfg.PetAId)) {
                    canActives.unshift(cfg.PetAId);
                } else {
                    this.showIds.unshift(cfg.PetAId);
                }
            }
            return true;
        });
        this.showIds = canActives.concat(activeds).concat(this.showIds);
        const selectId = id || this.showIds[0];
        this.onSelectCallback(selectId);
        let showIndex = this.showIds.indexOf(selectId);
        if (showIndex < 0) {
            showIndex = 0;
        }
        this.ListView.setNumItems(this.showIds.length, showIndex);
    }

    /** ?????????????????????????????? */
    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        this.changeTabPage();
    }

    /** ????????????????????? */
    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        this.changeTabPage();
        this.updateAllHeadRed();
    }

    /**
     * ??????????????????????????????
     * @param node ??????
     * @param index ??????
     */
    private onRenderList(node: cc.Node, index: number) {
        const id = this.showIds[index];
        const s = node.getComponent(BeautyHead);
        this.headScriptById[id] = s;
        s.setData(id, this.onSelectCallback, { target: this });
        s.select = this.selectId === id;
        UtilRedDot.UpdateRed(node, this.model.isCanShowRed(id, this.tabId), cc.v2(40, 50));
    }

    private updateAllHeadRed() {
        this.showIds.forEach((id, index) => {
            const n = this.ListView.getItemByListId(index);
            UtilRedDot.UpdateRed(n, this.model.isCanShowRed(id, this.tabId), cc.v2(40, 50));
        });
    }

    /**
     * ????????????
     * @param id ??????id
     */
    private onSelectCallback(id: number) {
        if (this.selectId === id) { return; }
        this.changeSelectStatus(id);
        this.updateView();
        this.updateFightValue();
    }

    /** ???????????? */
    private updateView() {
        this.updateCom();
        this.showSkills();
        this.showAnim();
        this.updateBtnActive();
    }

    private updateBtnActive() {
        this.NodeShow.active = this.model.isActive(this.selectId);
        // this.NodeAreadyBattle.active = ModelMgr.I.BattleUnitModel.isLineupByOnlyId(EntityUnitType.Beauty, this.selectId.toString());
        // eslint-disable-next-line max-len
        this.NdSZ.active = ModelMgr.I.BattleUnitModel.isLineupByOnlyId(EntityUnitType.Beauty, this.selectId.toString());
        this.NodeFollow.active = this.NodeShow.active && !this.NdSZ.active;
        if (this.NodeFollow.active) {
            UtilRedDot.UpdateRed(this.NodeFollow, !ModelMgr.I.BeautyModel.isAreadyBattle, cc.v2(25, 25));
        }
    }
    /** ????????????????????? */
    private changeSelectStatus(id: number) {
        if (this.selectId) {
            const n = this.headScriptById[this.selectId];
            if (n && n.isValid) {
                n.getComponent(BeautyHead).select = false;
            }
        }
        if (id) {
            const n = this.headScriptById[id];
            if (n && n.isValid) {
                n.getComponent(BeautyHead).select = true;
            }
        }
        this.selectId = id;
        ModelMgr.I.BeautyModel.setCurViewShow(id);
    }

    /** ???????????? */
    private showAnim() {
        const cfg = this.model.cfg.getValueByKey(this.selectId, { AnimId: 0, Name: '' });
        this.NodeAnim.destroyAllChildren();
        EntityUiMgr.I.createAnim(this.NodeAnim, cfg.AnimId, ANIM_TYPE.PET, ACTION_TYPE.UI);
        this.LabelName.string = cfg.Name;
    }

    /** ????????????id */
    private changeTabPage() {
        if (this.selectId) {
            this.updateCom();
        }
    }

    /** ?????????????????????????????????????????????????????? */
    private updateCom() {
        this.content.children.forEach((c) => c.active = false);
        const isActive = this.model.isActive(this.selectId);
        if (isActive) {
            if (this.tabId === EBeautyIndexId.Level && this.model.isFullLevel(this.selectId)) {
                this.NodeFull.active = true;
            } else {
                this.showPageCom();
            }
            this.NdAttr.active = this.tabId === EBeautyIndexId.Level;
        } else {
            this.showUnActiveCom();
        }
    }

    /** ????????????????????????????????? */
    private showUnActiveCom() {
        if (!this.isLoadActive) {
            this.isLoadActive = true;
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Module_Beauty_Com_BeautyActive, this.content, (e, n) => {
                if (this.model.isActive(this.selectId)) {
                    n.active = false;
                } else {
                    n.getComponent(BeautyActive).setData(this.selectId);
                }
            });
        } else {
            const node = this.content.getChildByName('BeautyActive');
            if (node) {
                node.active = true;
                node.getComponent(BeautyActive).setData(this.selectId);
            }
        }
    }

    /** ??????????????????????????? */
    private showPageCom() {
        const tabId = this.tabId;
        const name = this.getComName(tabId);
        if (!this.isLoads[tabId]) {
            this.isLoads[tabId] = true;
            if (name) {
                ResMgr.I.showPrefabOnce(`prefab/module/beauty/com/${name}`, this.content, (e, n) => {
                    if (this.tabId !== tabId) {
                        n.active = false;
                    } else {
                        const s: BeautyLevel | BeautyStar = n.getComponent(name);
                        s.setData(this.selectId);
                    }
                });
            }
        } else {
            const node = this.content.getChildByName(name);
            if (node) {
                node.active = true;
                const s: BeautyLevel | BeautyStar = node.getComponent(name);
                s.setData(this.selectId);
            }
        }
    }

    /** ??????????????? */
    private getComName(tabId: number) {
        switch (tabId) {
            case EBeautyIndexId.Level:
                return 'BeautyLevel';
            case EBeautyIndexId.Star:
                return 'BeautyStar';
            default:
                return '';
        }
    }

    /** ??????????????????????????? */
    private onShowClicked() {
        const pos = this.NodeShow.convertToWorldSpaceAR(cc.v2(0, -100));
        ShareToChat.show(ChatShowItemType.beauty, this.selectId, pos);
    }

    /** ???????????????????????????????????? */
    private onNodeCheckAllFvClicked() {
        if (this.model.activeCount <= 0) {
            MsgToastMgr.Show(i18n.tt(Lang.beauty_unactive));
            return;
        }

        const titles = [
            // i18n.tt(Lang.beauty_active_all_attr_title),
            i18n.tt(Lang.beauty_level_all_attr_title),
            i18n.tt(Lang.beauty_star_all_attr_title),
        ];
        // const activeAttr = this.model.getAllBeautyAttrInfo(EBeautyAttrInfoType.Active);
        const levelAttr = this.model.getAllBeautyAttrInfo(EBeautyAttrInfoType.Level);
        const starAttr = this.model.getAllBeautyAttrInfo(EBeautyAttrInfoType.Star);
        const infos = this.getAttrDetailTips(titles, levelAttr, starAttr);
        WinMgr.I.open(ViewConst.AttrDetailTips, infos);
    }

    /**
     * ??????????????????info??????????????????????????????
     * @param attrInfos ??????????????????????????????info
     * @returns
     */
    private getAttrDetailTips(titles: string[], ...attrInfos: IAttrInfo[]) {
        const infos: { title: string, data: string }[] = [];
        attrInfos.forEach((attrInfo, index) => {
            if (attrInfo?.attrs?.length) {
                const baseStr = UtilAttr.GetShowAttrStr(attrInfo.attrs, EAttrShowType.Plus);
                infos.push({ title: titles[index], data: baseStr });
            }
        });
        return infos;
    }

    /** ???????????????????????? */
    private onFollowClicked() {
        ControllerMgr.I.BattleUnitController.reqC2SBattleLineupPos(EntityUnitType.Beauty, EntityUnitPos.Beauty, this.selectId.toString());
    }

    /** ????????????????????? */
    private onUptUnit() {
        // const lastFollowActive = this.NodeFollow.active;
        this.updateBtnActive();
        // if (lastFollowActive && !this.NodeFollow.active) {
        // }
        // this.updateAllHeadRed();
        this.showIds.forEach((id, index) => {
            const n = this.ListView.getItemByListId(index);
            if (n) {
                n.getComponent(BeautyHead)?.updateBattleFlag();
                UtilRedDot.UpdateRed(n, this.model.isCanShowRed(id, this.tabId), cc.v2(40, 50));
            }
        });
    }

    private onItemChangeItem() {
        this.updateAllHeadRed();
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Beauty.Add, this.onAdd, this);
        EventClient.I.off(E.Beauty.Update, this.updateActiveCount, this);
        EventClient.I.off(E.Beauty.UpdateExpLevel, this.onUpdateExpLevel, this);
        EventClient.I.off(E.Beauty.UpdateStar, this.onUpdateStar, this);
        EventClient.I.off(E.BattleUnit.UptUnit, this.onUptUnit, this);
        EventClient.I.off(E.Beauty.UpdateHead, this.updateHeadItem, this);
        EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.BEAUTY}`, this.onItemChangeItem, this);
        ModelMgr.I.BeautyModel.setCurViewShow(undefined);
    }
}
