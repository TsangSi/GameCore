/*
 * @Author: kexd
 * @Date: 2022-08-15 16:41:25
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\v\GeneralPage.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { TabContainer } from '../../../com/tab/TabContainer';
import { TabItem } from '../../../com/tab/TabItem';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import GeneralEntity from '../com/GeneralEntity';
import {
    GeneralPageTabs, InfoPageType, GeneralMsg, EGeneralUiType,
} from '../GeneralConst';
import GSkillPanel from '../gSkill/GSkillPanel';
import AwakenPanel from './AwakenPanel';
import GEquipPanel from './GEquipPanel';
import GradeUpPanel from './GradeUpPanel';
import InfoPanel from './InfoPanel';
import LevelUpPanel from './LevelUpPanel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralPage extends WinTabPage {
    @property(TabContainer)
    private TabsContent: TabContainer = null;
    @property(cc.Node)
    private NdContent: cc.Node = null;
    // 顶部头像相关信息
    @property(cc.Node)
    private NdEntity: cc.Node = null;

    /** 页签下标 */
    private _tabIndex: number = 0;
    private _ndContent: { [name: number]: cc.Node } = {};
    private _curData: GeneralMsg = null;
    private _generalUiType: EGeneralUiType = EGeneralUiType.None;
    private _GeneralEntity: GeneralEntity = null;

    protected start(): void {
        super.start();
        this.addE();
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.GeneralEntity, this.NdEntity, (err, node) => {
            if (this.NdEntity && this.NdEntity.isValid) {
                this.NdEntity.active = true;
                this._GeneralEntity = node.getComponent(GeneralEntity);
                if (this._curData) {
                    this._GeneralEntity.uptContent(this._curData, this._generalUiType);
                }
            }
        });
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this.TabsContent.addEventHandler(this.node, 'GeneralPage', 'onItemTypeTabSelected');
        let tab: number = 0;
        if (param && typeof param[1] === 'number') {
            tab = param[1];
        }
        this.TabsContent.setData(GeneralPageTabs, tab);
    }

    protected onEnable(): void {
        if (this._GeneralEntity) {
            this.NdEntity.active = true;
            this._GeneralEntity.uptContent(this._curData, this._generalUiType);
        }
    }

    private addE() {
        EventClient.I.on(E.General.UptEntity, this.uptEntity, this);
        EventClient.I.on(E.General.UptTitle, this.uptEntityTitle, this);
    }

    private remE() {
        EventClient.I.off(E.General.UptEntity, this.uptEntity, this);
        EventClient.I.off(E.General.UptTitle, this.uptEntityTitle, this);
    }

    private uptEntity(msg: GeneralMsg, generalUiType: EGeneralUiType = EGeneralUiType.None) {
        if (msg) {
            this._curData = msg;
        }
        this._generalUiType = generalUiType;
        if (this._GeneralEntity) {
            this.NdEntity.active = true;
            this._GeneralEntity.uptContent(this._curData, this._generalUiType);
        }
    }

    private uptEntityTitle(data: GeneralData) {
        if (data) {
            this._curData.generalData = data;
        }
        if (this._GeneralEntity) {
            this.NdEntity.active = true;
            this._GeneralEntity.uptContent(this._curData, this._generalUiType);
        }
    }

    private onItemTypeTabSelected(tabItem: TabItem) {
        const data = tabItem.getData();
        switch (data.id) {
            case InfoPageType.Main:
                this.infoPanel();
                break;
            case InfoPageType.LevelUp:
                this.levelUpPanel();
                break;
            case InfoPageType.GradeUp:
                this.gradeUpPanel();
                break;
            case InfoPageType.Awaken:
                this.awakenPanel();
                break;
            case InfoPageType.Equip:
                this.equipPanel();
                break;
            case InfoPageType.Skill:
                this.skillPanel();
                break;
            default:
                console.log(`未知类型${data.id}，请增加实现！`);
                break;
        }
    }

    private showCurTag() {
        for (const k in this._ndContent) {
            this._ndContent[k].active = +k === this._tabIndex;
        }
    }

    private dealAfterLoad(_tabIndex: number, node: cc.Node) {
        if (!node) return;
        this._ndContent[_tabIndex] = node;
        if (this._tabIndex === _tabIndex) {
            this.NdContent.children.forEach((v) => v.active = false);
            node.active = true;
        } else {
            node.active = false;
        }
    }

    /** 信息界面 */
    private infoPanel(): void {
        const _tabIndex: number = 0;
        this._tabIndex = _tabIndex;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            this.NdContent.getChildByName('InfoPanel').getComponent(InfoPanel).setData(false);
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.InfoPanel, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
            node.getComponent(InfoPanel).setData(true);
        });
    }

    /** 升级界面 */
    private levelUpPanel(): void {
        const _tabIndex: number = 1;
        this._tabIndex = _tabIndex;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            this.NdContent.getChildByName('LevelUpPanel').getComponent(LevelUpPanel).setData();
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.LevelUpPanel, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
            node.getComponent(LevelUpPanel).setData();
        });
    }

    /** 升阶界面 */
    private gradeUpPanel(): void {
        const _tabIndex: number = 2;
        this._tabIndex = _tabIndex;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            this.NdContent.getChildByName('GradeUpPanel').getComponent(GradeUpPanel).setData();
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.GradeUpPanel, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
            node.getComponent(GradeUpPanel).setData();
        });
    }

    /** 觉醒界面 */
    private awakenPanel(): void {
        const _tabIndex: number = 3;
        this._tabIndex = _tabIndex;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            this.NdContent.getChildByName('AwakenPanel').getComponent(AwakenPanel).setData();
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.AwakenPanel, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
            node.getComponent(AwakenPanel).setData();
        });
    }

    /** 装备界面 */
    private equipPanel(): void {
        const _tabIndex: number = 4;
        this._tabIndex = _tabIndex;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            this.NdContent.getChildByName('GEquipPanel').getComponent(GEquipPanel).setData();
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.GEquipPanel, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
            node.getComponent(GEquipPanel).setData();
        });
    }

    /** 技能界面 */
    private skillPanel(): void {
        const _tabIndex: number = 5;
        this._tabIndex = _tabIndex;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            this.NdContent.getChildByName('GSkillPanel').getComponent(GSkillPanel).setData();
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.GSkillPanel, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
            node.getComponent(GSkillPanel).setData();
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
