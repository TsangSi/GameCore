import { ResMgr } from '../../../../app/core/res/ResMgr';
import { TabContainer } from '../../../com/tab/TabContainer';
import { TabItem } from '../../../com/tab/TabItem';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { FuncDescConst } from '../../../const/FuncDescConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import { RoleArmyLevelPage } from '../roleArmyLevel/v/RoleArmyLevelPage';
import { RoleOfficialPage } from '../roleOfficial/v/RoleOfficialPage';
import { ERoleOfficialPageType, RoleOfficialTabs } from '../RoleOfficialConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleArmyOfficialPage extends WinTabPage {
    @property(TabContainer)
    private TabsContent: TabContainer = null;
    @property(cc.Node)
    private NdContent: cc.Node = null;
    @property(cc.Node)
    private NdBg: cc.Node = null;
    /** 页签下标 */
    private _tabIndex: number = 0;

    protected start(): void {
        super.start();
        this.addE();
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this.TabsContent.addEventHandler(this.node, 'RoleArmyOfficialPage', 'onItemTypeTabSelected');
        let selectTab: number = 0;
        if (param && typeof param[1] === 'number') {
            selectTab = param[1];
        }
        this.TabsContent.setData(RoleOfficialTabs, selectTab);
    }

    public refreshPage(winId: number, param: any[]): void {
        let selectTab: number = 0;
        if (param && typeof param[1] === 'number') {
            selectTab = param[1];
        }
        this.TabsContent.setData(RoleOfficialTabs, selectTab);
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
            case ERoleOfficialPageType.Officail:
                this.showOfficial();
                break;
            case ERoleOfficialPageType.ArmyLevel:
                this.showArmyLevel();
                break;
            default:
                console.log(`未知类型${data.id}，请增加实现！`);
                break;
        }
        // this.getWinTabFrame().setTitle(data.title.replace(' ', ''));
    }

    private _ndContent: { [name: number]: cc.Node } = {};
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

    /** 显示官职 */
    private showOfficial(): void {
        const _tabIndex: number = 0;
        this._tabIndex = _tabIndex;
        this.NdBg.active = false;
        this.getWinTabFrame().setDesc(FuncDescConst.RoleOfficial);
        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this._ndContent[this._tabIndex].getComponent(RoleOfficialPage)?.updateUI();
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.RoleOfficialPage, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
            node.getComponent(RoleOfficialPage).init(ViewConst.RoleOfficialPage, null);
        });
    }

    /** 显示军衔 */
    private showArmyLevel(): void {
        const _tabIndex: number = 1;
        this._tabIndex = _tabIndex;
        this.NdBg.active = true;
        this.getWinTabFrame().setDesc(0);
        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            this._ndContent[this._tabIndex].getComponent(RoleArmyLevelPage).updateSkillInfo();
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.RoleArmyLevelPage, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
            node.getComponent(RoleArmyLevelPage).init(ViewConst.RoleArmyLevelPage, null);
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
