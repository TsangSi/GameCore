/*
 * @Author: hrd
 * @Date: 2022-05-05 20:02:12
 * @FilePath: \SanGuo2.4\assets\script\game\com\win\WinTabFrame.ts
 * @Description:
 *
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { EMarkType, IWinTabData } from '../../../app/core/mvc/WinConst';
import { ResMgr } from '../../../app/core/res/ResMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { WinTab } from './WinTab';

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class WinTabFrame extends BaseUiView {
    protected WinTab: WinTab = null;

    public open(param: unknown[]): void {
        ResMgr.I.showPrefab(UI_PATH_ENUM.WinTab, this.node, (err: any, node: cc.Node) => {
            if (err) {
                console.log('WinTabFrame == err', err);
            } else {
                this.WinTab = node.getComponent(WinTab);
                this.WinTab.viewVo = this.viewVo;
                super.open(param);
            }
        });
    }

    public init(param: unknown[]): void {
        this.WinTab.uiId = this.viewVo.id;
        // this.WinTab.viewVo = this.viewVo;
        const tabData = this.getTabData();
        this.WinTab.viewVo.tabData = tabData.filter((v) => UtilFunOpen.canShow(v.funcId));
        this.WinTab.context = this;
        this.WinTab.setBtnClickFunc(this.checkBtnClick);
        this.WinTab.setChangeTabFunc(this.changeTab);
        this.WinTab.init.apply(this.WinTab, param);
        this.initWin.apply(this, param);
    }

    public refreshView(param: unknown[]): void {
        this.WinTab.reTabWin.apply(this.WinTab, param);
    }

    public abstract getTabData(): IWinTabData[]

    public abstract initWin(...param: unknown[]): void

    /**
     * 判断按钮是否可以点击
     * @param index 按钮的下标(第几个)
     */
    protected checkBtnClick(index: number, tabId?: number): boolean {
        if (this.WinTab && this.WinTab.viewVo && this.WinTab.viewVo.tabData[index]) {
            return UtilFunOpen.isOpen(this.WinTab.viewVo.tabData[index].funcId, true);
        }
        return true;
    }

    /**
     * 点击按钮回调
     * @param tabIdx 页签索引
     * @param tabId 页签Id
     */
    public changeTab(tabIdx: number, tabId?: number): void {
        //
    }

    /**
     * 这个接口暂时没有任何地方调用，看了下this.WinTab.addTab里的写法有些地方也是不对的，慎用。
     * @param data
     */
    public addTabPage(data: IWinTabData[]): void {
        this.WinTab.addTab(data);
    }

    public remTabPage(tabId: number): void {
        this.WinTab.remTab(tabId);
    }

    /**
     * onTabPage
     */
    public onTabPage(tabId: number): void {
        this.WinTab.onTab(tabId);
    }

    public tabLength(): number {
        return this.WinTab.getTabDataNum();
    }

    /** 说明 */
    public setDesc(id: number): void {
        if (id && id > 0) {
            this.WinTab.updateDesc(id);
        } else {
            this.WinTab.updateDesc(id, false);
        }
    }

    /** 页签的标签 */
    public setMark(tabIndex: number, type: EMarkType): void {
        this.WinTab.setMark(tabIndex, type);
    }
}
