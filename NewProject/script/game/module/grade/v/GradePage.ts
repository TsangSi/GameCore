/*
 * @Author: hwx
 * @Date: 2022-07-06 15:11:05
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\GradePage.ts
 * @Description: 进阶页
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { Config } from '../../../base/config/Config';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { TabContainer } from '../../../com/tab/TabContainer';
import { TabItem } from '../../../com/tab/TabItem';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import { EntityUnitType } from '../../../entity/EntityConst';
import ModelMgr from '../../../manager/ModelMgr';
import { GradePageItemTabs, GradePageTabType, GradeType } from '../GradeConst';
import { GradeMgr } from '../GradeMgr';
import { GradeModel } from '../GradeModel';
import { GradeAvatarInfoPanel } from './GradeAvatarInfoPanel';
import { GradeEquipInfoPanel } from './GradeEquipInfoPanel';
import { IGetAwardsInfo } from './GradeGetAwardsWin';
import { GradeSkillBar } from './GradeSkillBar';
import { GradeSkinInfoPanel } from './GradeSkinInfoPanel';
import { GradeUpInfoPanel } from './GradeUpInfoPanel';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradePage extends WinTabPage {
    @property(TabContainer)
    private NdTabs: TabContainer = null;

    @property(GradeSkillBar)
    private SkillBar: GradeSkillBar = null;

    private AvatarInfoPanel: GradeAvatarInfoPanel;

    /** 当前二级TabId */
    private _tabIds: number = 0;
    /** 当前Tab面板 */
    private _tabPanel: BaseCmp;
    /** 升阶信息面板 */
    private _upInfoPanel: GradeUpInfoPanel;
    /** 装备信息面板 */
    private _equipInfoPanel: GradeEquipInfoPanel;
    /** 技能信息面板 */
    private _skinInfoPanel: GradeSkinInfoPanel;
    /** 进阶模型 */
    private _gradeModel: GradeModel;
    /** 进阶ID */
    private _gradeId: number;
    /** 是否改变了进阶ID */
    private _isChangeGradeId: boolean = false;
    /** 是否皮肤Tab */
    private _isSkinTab: boolean = false;
    private isEquipTab: boolean = false;
    private _skinTabId: number = 0;
    public GradeIdList: number[] = GradeMgr.I.getGradeIdList();// [GradeType.HORSE, GradeType.WING, GradeType.WEAPON];

    public init(winId: number, param: unknown, tabIdx: number, tabId: number): void {
        super.init(winId, param, tabId);
        // 解析参数
        let tabIds: number;
        // 不明白为什么要传皮肤id
        let skinTabId: number;
        if (param) {
            tabId = param[0];
            tabIds = param[1];
            skinTabId = param[2] ? param[2] : 0;
        }

        if (tabIds === undefined) {
            tabIds = this._tabIds || GradePageItemTabs[0].id;
        } else {
            let has = false;
            for (let i = 0, len = GradePageItemTabs.length; i < len; i++) {
                const v = GradePageItemTabs[i];
                if (tabIds === v.id) {
                    has = true;
                }
            }
            if (!has) {
                tabIds = GradePageItemTabs[0].id;
            }
        }
        this.addE();
        // 初始化皮肤TabId
        this._skinTabId = skinTabId;
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Module_Grade_Com_GradeSkillItem, this.SkillBar.node);
        // 根据红点打开面板
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Module_Grade_GradeAvatarInfoPanel, this.node.getChildByName('NdAvatar'), (err, node) => {
            this.AvatarInfoPanel = node.getComponent(GradeAvatarInfoPanel);
            this.updateData(tabId, tabIds);
        });
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId: number): void {
        super.refreshPage(winId, param, tabIdx);

        this.updateData(tabId, this._tabIds);
    }

    private updateData(tabId: number, defaultTabId: number): void {
        if (!tabId) {
            console.log('找不到数据');
            return;
        }
        this._isChangeGradeId = this._gradeId && this._gradeId !== tabId;
        this._gradeModel = GradeMgr.I.getGradeModel(tabId) || GradeMgr.I.getGradeModel(GradeType.HORSE);
        this._gradeId = tabId;
        // 清除已有tabBtn红点绑定
        this.NdTabs.node.children.forEach((winTabBtn) => {
            UtilRedDot.Unbind(winTabBtn);
        });

        const itemtabs = GradeMgr.I.getGradePageTbas(this._gradeId);
        // 初始化页签
        this.NdTabs.setData(itemtabs, defaultTabId);
        if (this._isChangeGradeId) {
            this.NdTabs.focus();
        }
    }

    protected start(): void {
        super.start();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    protected addE(): void {
        EventClient.I.on(E.Grade.UpdateInfo, this.onUpdateInfo, this);
        EventClient.I.on(E.BattleUnit.UptUnit, this.onUptUnit, this);
        GradeMgr.I.listeningGradeItem(true);
        GradeMgr.I.ListeningSkinItem(true);
        GradeMgr.I.ListeningEquipItem(true);
        EventClient.I.on(E.Grade.SkinActive, this.onNewActive, this);
    }

    protected remE(): void {
        GradeMgr.I.listeningGradeItem(false);
        GradeMgr.I.ListeningSkinItem(false);
        GradeMgr.I.ListeningEquipItem(false);
        EventClient.I.off(E.Grade.UpdateInfo, this.onUpdateInfo, this);
        EventClient.I.off(E.Grade.SkinActive, this.onNewActive, this);
        EventClient.I.off(E.BattleUnit.UptUnit, this.onUptUnit, this);
    }

    /** 监听二级Tab切换 */
    private onPageTabSelected(tabItem: TabItem) {
        const tabData = tabItem.getData();
        const tabId = tabData.id;
        if (this._tabIds === tabId && !this._isChangeGradeId) {
            return;
        }

        if (tabId === GradePageTabType.UP) {
            this.showGradeUpInfo();
        } else if (tabId === GradePageTabType.EQUIP) {
            this.showGradeEquipInfo();
        } else if (tabId === GradePageTabType.SKIN) {
            this.showGradeSkinInfo();
        }
    }

    /**
     * 升阶
     */
    private showGradeUpInfo() {
        if (!this._upInfoPanel) {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Module_Grade_GradeUpInfoPanel, this.node, (err, node) => {
                if (err) return;
                if (!this.node || !this.node.isValid) return;
                this._upInfoPanel = node.getComponent(GradeUpInfoPanel);
                this.setTabPanelData(this._upInfoPanel, GradePageTabType.UP);
            });
        } else {
            this.setTabPanelData(this._upInfoPanel, GradePageTabType.UP);
        }
    }

    /**
     * 装备
     */
    private showGradeEquipInfo() {
        if (!this._equipInfoPanel) {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Module_Grade_GradeEquipInfoPanel, this.node, (err, node) => {
                if (err) return;
                if (!this.node || !this.node.isValid) return;
                this._equipInfoPanel = node.getComponent(GradeEquipInfoPanel);
                this.setTabPanelData(this._equipInfoPanel, GradePageTabType.EQUIP);
            });
        } else {
            this.setTabPanelData(this._equipInfoPanel, GradePageTabType.EQUIP);
        }
    }

    /**
     * 幻化
     */
    private showGradeSkinInfo() {
        if (!this._skinInfoPanel) {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Module_Grade_GradeSkinInfoPanel, this.node, (err, node) => {
                if (err) return;
                if (!this.node || !this.node.isValid) return;
                this._skinInfoPanel = node.getComponent(GradeSkinInfoPanel);
                this._skinInfoPanel.onChangeSkinCallback(this.onChangeSkin, this);
                this.setTabPanelData(this._skinInfoPanel, GradePageTabType.SKIN);
            });
        } else {
            this.setTabPanelData(this._skinInfoPanel, GradePageTabType.SKIN);
        }
    }

    /**
     * 显示当前页数据
     */
    private setTabPanelData(compt: BaseCmp, tabId: number) {
        if (compt) {
            this._isSkinTab = tabId === GradePageTabType.SKIN;
            this.isEquipTab = tabId === GradePageTabType.EQUIP;
            let skinTabId: number; // 初始化皮肤TabId
            if (this._isSkinTab && this._skinTabId) {
                skinTabId = this._skinTabId;
                this._skinTabId = undefined; // 用完就丢
            }

            // 初始化共用的
            let fvIds: number[] = [];
            if (this.isEquipTab) {
                fvIds = [
                    GradeMgr.I.getGradeEquipAttrFvId(this._gradeId),
                    GradeMgr.I.getGradeEquipStrengthFvId(this._gradeId),
                    GradeMgr.I.getGradeHjAttrFvId(this._gradeId),
                ];
            } else if (!this._isSkinTab) {
                fvIds = [GradeMgr.I.getGradeTotalAttrFvId(this._gradeId)];
            }
            this.AvatarInfoPanel.init(this._gradeModel, tabId, fvIds);

            if (!this.isEquipTab) {
                this.SkillBar.init(this._gradeModel, this._isSkinTab);
            }
            this.SkillBar.node.active = !this.isEquipTab;

            if (compt === this._upInfoPanel) {
                // 借skinTabId 一用来限制升级进度条变化
                skinTabId = this._tabIds;
            }

            // 初始化切换的页面
            if (this._tabPanel) {
                this._tabPanel.node.active = false;
            }
            this._tabIds = tabId;
            this._tabPanel = compt;
            compt.node.active = true;
            compt.init(this._gradeModel, skinTabId);
        }
    }

    private onUptUnit() {
        this.AvatarInfoPanel.updateSkin(this._gradeModel.skinCfg);
    }

    /**
     * 监听皮肤变化
     * @param skinId
     */
    private onChangeSkin(skinCfg: Cfg_GradeSkin, star: number = 0) {
        this.AvatarInfoPanel.updateSkin(skinCfg, star);

        // 根据皮肤属性技能
        const skillInfo: { name: string, iconId: string, cfg: Cfg_GradeSkinSkill, skinLv: number }[] = [];
        const skills = GradeMgr.I.parseGradeSkinAttrSkill(skinCfg.AttrSkill);
        for (let i = 0; i < skills.length; i++) {
            const [name, icon] = skills[i];
            const part = i + 1;
            const cfg = GradeMgr.I.getGradeSkinSkillCfgForLimit(skinCfg.AttrSkillQuality, part, star);
            skillInfo[i] = {
                name,
                iconId: icon,
                cfg,
                skinLv: star,
            };
        }

        this.SkillBar.setGradeSkinSkills(skillInfo);
    }

    /**
     * 监听信息更新
     * @param gradeId
     */
    private onUpdateInfo(changeGradeIds: number[]): void {
        if (!changeGradeIds.includes(this._gradeId)) {
            return;
        }

        this._gradeModel = GradeMgr.I.getGradeModel(this._gradeId);

        // 初始化共用的
        let gradeTotalFvIds = [GradeMgr.I.getGradeTotalAttrFvId(this._gradeId)];
        if (this.isEquipTab) {
            gradeTotalFvIds = [
                GradeMgr.I.getGradeEquipAttrFvId(this._gradeId),
                GradeMgr.I.getGradeEquipStrengthFvId(this._gradeId),
                GradeMgr.I.getGradeHjAttrFvId(this._gradeId),
            ];
        }
        this.AvatarInfoPanel.init(this._gradeModel, this._tabIds, gradeTotalFvIds);
        this.SkillBar.init(this._gradeModel, this._isSkinTab);

        // 更新显示中的面板
        if (this._upInfoPanel && this._upInfoPanel.node.active) {
            this._upInfoPanel.updateModel(this._gradeModel);
        } else if (this._equipInfoPanel && this._equipInfoPanel.node.active) {
            this._equipInfoPanel.updateModel(this._gradeModel);
        } else if (this._skinInfoPanel && this._skinInfoPanel.node.active) {
            this._skinInfoPanel.updateModel(this._gradeModel);
        }
    }

    private onNewActive(id: number) {
        const cfg: Cfg_GradeSkin = Config.Get(Config.Type.Cfg_GradeSkin).getValueByKey(id);
        const cfgItem: Cfg_Item = Config.Get(Config.Type.Cfg_Item).getValueByKey(cfg.NeedItem);
        let showName: string = '';
        let animId: number = 0;
        const quality = cfgItem?.Quality || 1;
        let posY: number = -35;
        if (cfg.FuncId === FuncId.BeautyGrade) {
            const lineups = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.Beauty);
            let beautyId = 0;
            if (lineups && lineups[0]) {
                beautyId = +lineups[0].OnlyId;
            } else {
                beautyId = ModelMgr.I.BeautyModel.getCurViewShowBeauty()?.BeautyId;
            }
            if (beautyId) {
                const cfgBeauty: Cfg_Beauty = Config.Get(Config.Type.Cfg_Beauty).getValueByKey(beautyId);
                if (cfgBeauty) {
                    animId = cfgBeauty.AnimId;
                }
            }

            const data = GradeMgr.I.getGradeData(cfg.FuncId);
            const cfgGrade = GradeMgr.I.getGradeCfg(cfg.FuncId, data.GradeLv.BigLv);
            if (cfgGrade) {
                showName = cfgGrade.Name;
            }
        } else if (cfg.FuncId === FuncId.AdviserGrade) {
            const data = GradeMgr.I.getGradeData(cfg.FuncId);
            const cfgGrade = GradeMgr.I.getGradeCfg(cfg.FuncId, data.GradeLv.BigLv);
            if (cfgGrade) {
                showName = cfgGrade.Name;
            }
            animId = ModelMgr.I.AdviserModel.getSkin();
            posY = 20;
        } else {
            showName = cfg.Name;
            animId = cfg.AnimId;
        }
        const resType = GradeMgr.I.getResTypeByGradeId(cfg.FuncId);
        const data: IGetAwardsInfo = {
            type: 0, // 0默认模板，展示获得物品。 1 三倍领取 2 限时三倍领取
            showName, // 道具名字
            quality, // 道具质量
            animId, // 动画id
            animType: resType,
            animScale: 0.85,
            animPosY: posY,
        };
        WinMgr.I.open(ViewConst.GradeGetAwardsWin, data);
    }
}
