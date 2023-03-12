/*
 * @Author: kexd
 * @Date: 2022-06-22 18:35:34
 * @FilePath: \SanGuo2.4\assets\script\game\module\boss\v\BossPage.ts
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
import { BossPageTabs, LocalBossPageType } from '../BossConst';
import PersonalPage from './PersonalPage';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ComBossPage from './ComBossPage';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BossPage extends WinTabPage {
    @property(TabContainer)
    private TabsContent: TabContainer = null;
    @property(cc.Node)
    private NdContent: cc.Node = null;
    @property(cc.Node)
    private NdSprBg: cc.Node = null;

    /** 页签下标 */
    private _tabIndex: number = 0;
    private _isPersonal: boolean = false;
    private _ndContent: { [name: number]: cc.Node } = {};

    protected start(): void {
        super.start();
        this.addE();
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this.TabsContent.addEventHandler(this.node, 'BossPage', 'onItemTypeTabSelected');
        let tab: number = 0;
        if (param && typeof param[1] === 'number') {
            tab = param[1];
        }
        this.TabsContent.setData(BossPageTabs, tab);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number): void {
        super.refreshPage(winId, param, tabIdx);
        if (param && (param[1] !== undefined || param[1] !== null)) {
            this.TabsContent.switchTab(param[1] || 0, true);
        }
    }

    private addE() {
        //
    }

    private remE() {
        //
    }

    private onItemTypeTabSelected(tabItem: TabItem) {
        const data = tabItem.getData();
        this.NdSprBg.active = data.id !== LocalBossPageType.MultiBoss;
        switch (data.id) {
            case LocalBossPageType.Personal:
                this.personalBoss();
                break;
            case LocalBossPageType.Vip:
                this.VipBoss();
                break;
            case LocalBossPageType.MultiBoss:
                this.MultiBoss();
                break;
            default:
                console.log(`未知类型${data.id}，请增加实现！`);
                break;
        }
    }

    private showCurTag() {
        for (const k in this._ndContent) {
            this._ndContent[k].active = +k === this._tabIndex;
            if (+k === 0) {
                this._ndContent[k].getComponent(PersonalPage).setData(this._isPersonal);
            }
            if (+k === 2) {
                this._ndContent[k].getComponent(ComBossPage).setData(LocalBossPageType.MultiBoss);
            }
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

    /**
     * 个人首领
     */
    private personalBoss(): void {
        const _tabIndex: number = 0;
        this._tabIndex = _tabIndex;
        this._isPersonal = true;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            return;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.PersonalPage, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
            node.getComponent(PersonalPage).setData(true);
        });
    }

    /**
     * 至尊首领
     */
    private VipBoss(): void {
        // 因为个人首领和至尊首领都是用PersonalPage预制，故这里也设this._tabIndex = 0
        const _tabIndex: number = 0;
        this._tabIndex = _tabIndex;
        this._isPersonal = false;

        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            return;
        }
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.PersonalPage, this.NdContent, (err, node) => {
            if (err) return;
            if (!this.NdContent || !this.NdContent.isValid) return;
            this.dealAfterLoad(_tabIndex, node);
            node.getComponent(PersonalPage).setData(false);
        });
    }

    /** 多人首领 */
    private MultiBoss(): void {
        const _tabIndex: number = 2;
        this._tabIndex = _tabIndex;
        this._isPersonal = false;
        if (this._ndContent[this._tabIndex]) {
            this.showCurTag();
            return;
        }
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.ComBossPage, this.NdContent, (err, node) => {
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
