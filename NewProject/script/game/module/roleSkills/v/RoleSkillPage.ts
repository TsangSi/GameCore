/*
 * @Author: kexd
 * @Date: 2022-07-18 10:42:40
 * @FilePath: \SanGuo2.4\assets\script\game\module\roleSkills\v\RoleSkillPage.ts
 * @Description:
 *
 */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { ResMgr } from '../../../../app/core/res/ResMgr';
import { TabContainer } from '../../../com/tab/TabContainer';
import { TabItem } from '../../../com/tab/TabItem';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { RoleSkillPageTabs, ERoleSkillPageType } from '../RoleSkillConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import { UniqueSkillPage } from '../uniqueSkill/v/UniqueSkillPage';
import RoleMartialPage from '../martialSkill/v/RoleMartialPage';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleSkillPage extends WinTabPage {
    @property(TabContainer)
    private TabsContent: TabContainer = null;
    @property(cc.Node)
    private NdContent: cc.Node = null;

    /** 页签下标 */
    private _tabIndex: number = 0;
    private _ndContent: { [name: number]: cc.Node } = cc.js.createMap(true);

    protected start(): void {
        super.start();
        this.addE();
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this.TabsContent.addEventHandler(this.node, 'RoleSkillPage', 'onItemTypeTabSelected');
        let selectTab: number = 0;
        if (param && typeof param[1] === 'number') {
            selectTab = param[1];
        }
        this.TabsContent.setData(RoleSkillPageTabs, selectTab);
    }

    public refreshPage(winId: number, param: any[]): void {
        let selectTab: number = 0;
        if (param && typeof param[1] === 'number') {
            selectTab = param[1];
        }
        this.TabsContent.setData(RoleSkillPageTabs, selectTab);
    }

    private addE() {
        //
    }

    private remE() {
        //
    }

    private onItemTypeTabSelected(tabItem: TabItem) {
        const data = tabItem.getData();
        switch (data.id) {
            case ERoleSkillPageType.Skill:
                this.showSkill();
                break;
            case ERoleSkillPageType.UniqueSkill:
                this.showUniqueSkil();
                break;
            case ERoleSkillPageType.MartialSkill:
                this.showMartialSkill();
                break;
            default:
                console.log(`未知类型${data.id}，请增加实现！`);
                break;
        }
        // this.getWinTabFrame().setTitle(data.title.replace(' ', ''));
    }

    private showCurTag() {
        for (const k in this._ndContent) {
            this._ndContent[k].active = +k === this._tabIndex;
        }
    }

    private dealAfterLoad(_tabIndex: number, node: cc.Node) {
        this._ndContent[_tabIndex] = node;
        if (this._tabIndex === _tabIndex) {
            this.NdContent.children.forEach((v) => v.active = false);
            node.active = true;
        } else {
            node.active = false;
        }
    }

    private showSkill(): void {
        const _tabIndex: number = 0;
        this._tabIndex = _tabIndex;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.RSkillPage, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
        });
    }

    private showUniqueSkil(): void {
        const _tabIndex: number = 1;
        this._tabIndex = _tabIndex;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            this._ndContent[this._tabIndex].getComponent(UniqueSkillPage).init(ViewConst.UniqueSkillPage);
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.UniqueSkillPage, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
        });
    }

    private showMartialSkill(): void {
        const _tabIndex: number = 2;
        this._tabIndex = _tabIndex;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            this._ndContent[this._tabIndex].getComponent(RoleMartialPage).init(ViewConst.RoleMartialPage);
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.RoleMartialPage, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
